from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from bson import ObjectId
from core.db import get_collection, serialize_mongo_doc
from core.auth import hash_password, check_password, generate_token
from core.permissions import IsAuthenticatedMongo

class RegisterView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        role = data.get('role', 'family_user')
        phone = data.get('phone', '').strip()
        location = data.get('location', '').strip()

        if not email or not password or not name:
            return Response({'error': 'Name, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        users_col = get_collection('users')
        if users_col.find_one({'email': email}):
            return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user_doc = {
            'name': name,
            'email': email,
            'password': hash_password(password),
            'role': role,
            'phone': phone,
            'location': location,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        # If applying as Care Representative
        if role == 'care_representative':
            user_doc['representative_profile'] = {
                'verification_status': 'pending', # pending, verified, rejected
                'languages': data.get('languages', ['English', 'Hindi']),
                'service_area': data.get('service_area', location or 'Jalandhar'),
                'service_radius_km': int(data.get('service_radius_km', 15)),
                'government_id_type': data.get('government_id_type', 'Aadhaar / Voter ID'),
                'government_id_number': data.get('government_id_number', 'XXXX-XXXX-1234'),
                'is_available': True,
                'rating': 4.9,
                'completed_visits': 0,
                'training_status': 'Certified ApnoCare Care Associate'
            }

        res = users_col.insert_one(user_doc)
        user_id = str(res.inserted_id)

        token = generate_token(user_id, email, role)
        user_doc['_id'] = res.inserted_id
        safe_user = serialize_mongo_doc(user_doc)
        safe_user.pop('password', None)

        return Response({
            'message': 'Registration successful',
            'token': token,
            'user': safe_user
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        users_col = get_collection('users')
        user_doc = users_col.find_one({'email': email})

        if not user_doc or not check_password(password, user_doc.get('password', '')):
            return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = str(user_doc.get('_id'))
        role = user_doc.get('role', 'family_user')
        token = generate_token(user_id, email, role)

        safe_user = serialize_mongo_doc(user_doc)
        safe_user.pop('password', None)

        return Response({
            'message': 'Login successful',
            'token': token,
            'user': safe_user
        }, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_data = dict(request.user.data)
        user_data.pop('password', None)
        return Response(serialize_mongo_doc(user_data))

    def put(self, request):
        user_id = request.user.id
        update_data = {}
        for field in ['name', 'phone', 'location']:
            if field in request.data:
                update_data[field] = request.data[field]
        
        # Representative specific fields
        if request.user.role == 'care_representative' and 'is_available' in request.data:
            update_data['representative_profile.is_available'] = request.data['is_available']
        
        update_data['updated_at'] = datetime.utcnow()

        users_col = get_collection('users')
        try:
            q = {'_id': ObjectId(user_id)}
        except Exception:
            q = {'_id': user_id}

        users_col.update_one(q, {'$set': update_data})
        updated_doc = users_col.find_one(q)
        safe_user = serialize_mongo_doc(updated_doc)
        safe_user.pop('password', None)
        return Response(safe_user)


class ApplyRepresentativeView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def post(self, request):
        user_id = request.user.id
        data = request.data
        rep_profile = {
            'verification_status': 'pending',
            'languages': data.get('languages', ['English', 'Hindi']),
            'service_area': data.get('service_area', 'Jalandhar'),
            'service_radius_km': int(data.get('service_radius_km', 15)),
            'government_id_type': data.get('government_id_type', 'Aadhaar Card'),
            'government_id_number': data.get('government_id_number', ''),
            'is_available': True,
            'rating': 5.0,
            'completed_visits': 0,
            'training_status': 'Orientation Pending',
            'applied_at': datetime.utcnow()
        }

        users_col = get_collection('users')
        try:
            q = {'_id': ObjectId(user_id)}
        except Exception:
            q = {'_id': user_id}

        users_col.update_one(q, {
            '$set': {
                'role': 'care_representative',
                'representative_profile': rep_profile,
                'updated_at': datetime.utcnow()
            }
        })
        return Response({'message': 'Care Representative application submitted successfully. Pending Admin verification.'})
