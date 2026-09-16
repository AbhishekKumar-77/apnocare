import os
import json
import logging
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

logger = logging.getLogger(__name__)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/apnocare")
DB_NAME = os.getenv("MONGODB_DB_NAME", "apnocare")

class InMemoryCollection:
    """In-memory fallback collection compatible with common PyMongo API"""
    def __init__(self, name, db_store):
        self.name = name
        self.db_store = db_store
        if self.name not in self.db_store:
            self.db_store[self.name] = []

    def _matches(self, doc, query):
        for k, v in query.items():
            if k == '_id':
                doc_id = str(doc.get('_id'))
                query_id = str(v)
                if doc_id != query_id:
                    return False
            elif isinstance(v, dict):
                # Simple operators
                val = doc.get(k)
                if '$in' in v and val not in v['$in']:
                    return False
                if '$ne' in v and val == v['$ne']:
                    return False
                if '$regex' in v:
                    import re
                    pattern = v['$regex']
                    options = v.get('$options', '')
                    flags = re.IGNORECASE if 'i' in options else 0
                    if not re.search(pattern, str(val or ''), flags):
                        return False
            else:
                if doc.get(k) != v:
                    return False
        return True

    def insert_one(self, doc):
        doc = dict(doc)
        if '_id' not in doc:
            doc['_id'] = ObjectId()
        self.db_store[self.name].append(doc)
        class InsertResult:
            inserted_id = doc['_id']
        return InsertResult()

    def find_one(self, query=None, sort=None):
        query = query or {}
        results = self.find(query)
        if sort:
            # Sort is list of tuples (key, direction)
            for key, direction in reversed(sort):
                reverse = (direction == -1)
                results = sorted(results, key=lambda x: x.get(key, ''), reverse=reverse)
        return results[0] if results else None

    def find(self, query=None):
        query = query or {}
        matches = [dict(d) for d in self.db_store[self.name] if self._matches(d, query)]
        return matches

    def update_one(self, query, update):
        query = query or {}
        for doc in self.db_store[self.name]:
            if self._matches(doc, query):
                if '$set' in update:
                    for k, v in update['$set'].items():
                        doc[k] = v
                if '$push' in update:
                    for k, v in update['$push'].items():
                        if k not in doc or not isinstance(doc[k], list):
                            doc[k] = []
                        doc[k].append(v)
                class UpdateResult:
                    matched_count = 1
                    modified_count = 1
                return UpdateResult()
        class UpdateResult:
            matched_count = 0
            modified_count = 0
        return UpdateResult()

    def delete_one(self, query):
        query = query or {}
        for idx, doc in enumerate(self.db_store[self.name]):
            if self._matches(doc, query):
                del self.db_store[self.name][idx]
                class DeleteResult:
                    deleted_count = 1
                return DeleteResult()
        class DeleteResult:
            deleted_count = 0
        return DeleteResult()

    def count_documents(self, query=None):
        query = query or {}
        return len(self.find(query))

    def create_index(self, keys, **kwargs):
        return "index_created"


class MongoDBManager:
    _instance = None
    _client = None
    _db = None
    _is_fallback = False
    _fallback_store = {}

    @classmethod
    def get_db(cls):
        if cls._db is not None:
            return cls._db

        mongo_uri = os.getenv("MONGODB_URI", "")
        if mongo_uri:
            try:
                # Attempt to connect to provided MongoDB Atlas URI
                logger.info(f"Connecting to MongoDB Atlas at {mongo_uri[:25]}...")
                cls._client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2500)
                cls._client.admin.command('ping')
                cls._db = cls._client[DB_NAME]
                cls._is_fallback = False
                logger.info("Successfully connected to MongoDB Atlas.")
                return cls._db
            except Exception as e:
                logger.warning(f"Failed connecting to Atlas URI ({e}). Checking local MongoDB...")

        try:
            # Attempt local MongoDB
            cls._client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=1000)
            cls._client.admin.command('ping')
            cls._db = cls._client[DB_NAME]
            cls._is_fallback = False
            logger.info("Connected to local MongoDB.")
            return cls._db
        except Exception:
            logger.info("No external MongoDB found. Activating persistent in-memory MongoDB fallback store.")
            cls._is_fallback = True
            
            class FallbackDB:
                def __getitem__(self, name):
                    return InMemoryCollection(name, MongoDBManager._fallback_store)
                def get_collection(self, name):
                    return InMemoryCollection(name, MongoDBManager._fallback_store)

            cls._db = FallbackDB()
            return cls._db

    @classmethod
    def get_collection(cls, name):
        db = cls.get_db()
        return db[name]

    @classmethod
    def is_fallback(cls):
        return cls._is_fallback


def get_db():
    return MongoDBManager.get_db()

def get_collection(name):
    return MongoDBManager.get_collection(name)

def serialize_mongo_doc(doc):
    """Recursively convert ObjectId, datetimes, and Cursors to JSON serializable types"""
    if doc is None:
        return None
    if isinstance(doc, list) or hasattr(doc, '__iter__') and not isinstance(doc, (dict, str, bytes)):
        return [serialize_mongo_doc(item) for item in doc]
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == '_id':
                res['id'] = str(v)
            elif isinstance(v, ObjectId):
                res[k] = str(v)
            elif isinstance(v, datetime):
                res[k] = v.isoformat()
            elif isinstance(v, (dict, list)) or hasattr(v, '__iter__') and not isinstance(v, (str, bytes)):
                res[k] = serialize_mongo_doc(v)
            else:
                res[k] = v
        return res
    if isinstance(doc, ObjectId):
        return str(doc)
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc
