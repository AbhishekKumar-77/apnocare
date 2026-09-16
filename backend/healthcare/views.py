from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from core.db import get_collection, serialize_mongo_doc

class DoctorListView(APIView):
    def get(self, request):
        specialty = request.query_params.get('specialty', '').strip()
        location = request.query_params.get('location', '').strip()
        city = request.query_params.get('city', '').strip()
        search = request.query_params.get('search', '').strip()
        hospital = request.query_params.get('hospital', '').strip()

        query = {}
        if specialty and specialty.lower() != 'all':
            query['specialty'] = {'$regex': specialty, '$options': 'i'}
        if city and city.lower() != 'all':
            query['city'] = {'$regex': city, '$options': 'i'}
        if hospital:
            query['hospital_name'] = {'$regex': hospital, '$options': 'i'}
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'specialty': {'$regex': search, '$options': 'i'}},
                {'hospital_name': {'$regex': search, '$options': 'i'}},
                {'health_concerns': {'$regex': search, '$options': 'i'}}
            ]

        doctors_col = get_collection('doctors')
        doctors = doctors_col.find(query)
        return Response(serialize_mongo_doc(doctors))


class DoctorDetailView(APIView):
    def get(self, request, pk):
        doctors_col = get_collection('doctors')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}
        doc = doctors_col.find_one(query)
        if not doc:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo_doc(doc))


class HospitalListView(APIView):
    def get(self, request):
        city = request.query_params.get('city', '').strip()
        emergency_only = request.query_params.get('emergency', '').lower() in ['true', '1']
        department = request.query_params.get('department', '').strip()
        search = request.query_params.get('search', '').strip()

        query = {}
        if city and city.lower() != 'all':
            query['city'] = {'$regex': city, '$options': 'i'}
        if emergency_only:
            query['has_emergency_24_7'] = True
        if department:
            query['departments'] = {'$regex': department, '$options': 'i'}
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'city': {'$regex': search, '$options': 'i'}},
                {'departments': {'$regex': search, '$options': 'i'}},
                {'services': {'$regex': search, '$options': 'i'}}
            ]

        hospitals_col = get_collection('hospitals')
        hospitals = hospitals_col.find(query)
        return Response(serialize_mongo_doc(hospitals))


class HospitalDetailView(APIView):
    def get(self, request, pk):
        hospitals_col = get_collection('hospitals')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}
        doc = hospitals_col.find_one(query)
        if not doc:
            return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo_doc(doc))


class HealthcareCategoriesView(APIView):
    """Returns available specialties, departments, cities for filter dropdowns"""
    def get(self, request):
        specialties = [
            'General Physician', 'Cardiologist', 'Neurologist', 'Orthopedic Surgeon',
            'Pediatrician', 'Gynecologist & Obstetrician', 'Dermatologist', 'ENT Specialist',
            'Ophthalmologist', 'Gastroenterologist', 'Pulmonologist', 'Urologist', 'Psychiatrist'
        ]
        cities = ['Jalandhar', 'Delhi NCR', 'Chandigarh', 'Amritsar', 'Ludhiana', 'Bangalore', 'Mumbai']
        departments = [
            'Emergency & Trauma Care', 'Cardiology & Heart Care', 'Neurology', 'Orthopedics',
            'Obstetrics & Gynecology', 'Pediatrics & Neonatology', 'Oncology', 'Dialysis & Nephrology',
            'Radiology & Imaging', 'Pathology & Lab'
        ]
        return Response({
            'specialties': specialties,
            'cities': cities,
            'departments': departments
        })
