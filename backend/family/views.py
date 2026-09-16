from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class FamilyListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_id = request.user.id
        family_col = get_collection('family_members')
        members = family_col.find({'user_id': user_id})
        return Response(serialize_mongo_doc(members))

    def post(self, request):
        user_id = request.user.id
        data = request.data

        name = data.get('name', '').strip()
        relation = data.get('relation', '').strip()
        if not name or not relation:
            return Response({'error': 'Name and relation are required.'}, status=status.HTTP_400_BAD_REQUEST)

        member_doc = {
            'user_id': user_id,
            'name': name,
            'relation': relation,
            'age': int(data.get('age', 0)) if data.get('age') else None,
            'gender': data.get('gender', 'Female'),
            'phone': data.get('phone', ''),
            'location': data.get('location', request.user.location or 'Jalandhar, Punjab'),
            'city': data.get('city', 'Jalandhar'),
            'preferred_language': data.get('preferred_language', 'Punjabi'),
            'emergency_contact': data.get('emergency_contact', {
                'name': request.user.name,
                'phone': request.user.phone,
                'relation': 'Child / Primary Sponsor'
            }),
            'blood_group': data.get('blood_group', 'B+'),
            'chronic_conditions': data.get('chronic_conditions', []),
            'allergies': data.get('allergies', []),
            'preferred_hospital': data.get('preferred_hospital', 'Tagore Hospital & Heart Care, Jalandhar'),
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        family_col = get_collection('family_members')
        res = family_col.insert_one(member_doc)
        member_doc['_id'] = res.inserted_id

        return Response(serialize_mongo_doc(member_doc), status=status.HTTP_201_CREATED)


class FamilyDetailView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def _get_query(self, member_id, user_id):
        try:
            return {'_id': ObjectId(member_id), 'user_id': user_id}
        except Exception:
            return {'_id': member_id, 'user_id': user_id}

    def get(self, request, pk):
        family_col = get_collection('family_members')
        doc = family_col.find_one(self._get_query(pk, request.user.id))
        if not doc:
            return Response({'error': 'Family member not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo_doc(doc))

    def put(self, request, pk):
        family_col = get_collection('family_members')
        query = self._get_query(pk, request.user.id)
        doc = family_col.find_one(query)
        if not doc:
            return Response({'error': 'Family member not found.'}, status=status.HTTP_404_NOT_FOUND)

        update_fields = {}
        for key in ['name', 'relation', 'age', 'gender', 'phone', 'location', 'city', 
                    'preferred_language', 'emergency_contact', 'blood_group', 
                    'chronic_conditions', 'allergies', 'preferred_hospital', 'notes']:
            if key in request.data:
                update_fields[key] = request.data[key]
        
        update_fields['updated_at'] = datetime.utcnow()
        family_col.update_one(query, {'$set': update_fields})
        updated = family_col.find_one(query)
        return Response(serialize_mongo_doc(updated))

    def delete(self, request, pk):
        family_col = get_collection('family_members')
        query = self._get_query(pk, request.user.id)
        res = family_col.delete_one(query)
        if getattr(res, 'deleted_count', 0) == 0:
            return Response({'error': 'Family member not found or already removed.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'message': 'Family member removed successfully.'})
