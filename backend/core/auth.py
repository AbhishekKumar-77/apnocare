import jwt
import bcrypt
import datetime
import os
from bson import ObjectId
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from core.db import get_collection

JWT_SECRET = os.getenv("JWT_SECRET", "apnocare-super-secret-key-2026-jwt-token")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_DAYS = 30

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': str(user_id),
        'email': email,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=JWT_EXPIRATION_DAYS),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid authentication token")


class MongoUser:
    """A wrapper for MongoDB user dict that satisfies Django/DRF authentication requirements"""
    def __init__(self, data: dict):
        self.data = data
        self.id = str(data.get('_id', data.get('id', '')))
        self.email = data.get('email', '')
        self.name = data.get('name', '')
        self.role = data.get('role', 'family_user')
        self.phone = data.get('phone', '')
        self.location = data.get('location', '')
        self.is_authenticated = True
        self.is_staff = (self.role == 'admin')
        self.is_superuser = (self.role == 'admin')

    def __getitem__(self, item):
        return self.data.get(item)

    def get(self, item, default=None):
        return self.data.get(item, default)


class MongoJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None

        token = parts[1]
        try:
            payload = decode_token(token)
            user_id = payload.get('user_id')
            users_col = get_collection('users')
            
            try:
                query = {'_id': ObjectId(user_id)}
            except Exception:
                query = {'_id': user_id}

            user_doc = users_col.find_one(query)
            if not user_doc:
                raise AuthenticationFailed("User not found")

            user = MongoUser(user_doc)
            return (user, token)
        except AuthenticationFailed:
            raise
        except Exception as e:
            raise AuthenticationFailed(str(e))
