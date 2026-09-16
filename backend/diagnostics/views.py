import random
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class DiagnosticCatalogView(APIView):
    """Returns available diagnostic tests and accredited labs"""
    def get(self, request):
        diag_col = get_collection('diagnostic_tests')
        tests = list(diag_col.find({}))
        if not tests:
            tests = [
                {'test_name': 'Complete Blood Count (CBC)', 'category': 'Routine Pathology', 'price': 350, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '6 Hours'},
                {'test_name': 'Lipid Profile (Cholesterol)', 'category': 'Cardiac Health', 'price': 750, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '8 Hours'},
                {'test_name': 'HbA1c (Glycated Hemoglobin)', 'category': 'Diabetes Care', 'price': 450, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '6 Hours'},
                {'test_name': 'Thyroid Profile (T3, T4, TSH)', 'category': 'Endocrine', 'price': 550, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '12 Hours'},
                {'test_name': 'Liver Function Test (LFT)', 'category': 'Organ Profile', 'price': 800, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '8 Hours'},
                {'test_name': 'Kidney Function Test (KFT)', 'category': 'Organ Profile', 'price': 700, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '8 Hours'},
                {'test_name': 'Electrocardiogram (ECG)', 'category': 'Cardiology', 'price': 400, 'fasting_required': False, 'sample_type': 'In-clinic', 'tat': 'Instant'}
            ]
        return Response(serialize_mongo_doc(tests))


class DiagnosticBookingListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user = request.user
        book_col = get_collection('diagnostic_bookings')
        query = {} if user.role == 'admin' else {'user_id': user.id}
        bookings = book_col.find(query)
        sorted_b = sorted(bookings, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_b))

    def post(self, request):
        user = request.user
        data = request.data

        family_member_id = data.get('family_member_id')
        test_name = data.get('test_name')
        booking_date = data.get('booking_date')
        booking_time = data.get('booking_time')
        collection_type = data.get('collection_type', 'Home Sample Collection')

        if not family_member_id or not test_name or not booking_date:
            return Response({'error': 'Patient, test name, and date are required.'}, status=status.HTTP_400_BAD_REQUEST)

        fam_col = get_collection('family_members')
        try:
            fm = fam_col.find_one({'_id': ObjectId(family_member_id)})
        except Exception:
            fm = fam_col.find_one({'_id': family_member_id})

        patient_name = fm.get('name') if fm else 'Family Member'
        patient_address = fm.get('location') if fm else user.location

        booking_code = f"LAB-{random.randint(100000, 999999)}"
        now = datetime.utcnow()

        labs = ['Apollo Diagnostics', 'Dr. Lal PathLabs', 'SRL Diagnostics Jalandhar', 'Thyrocare']
        lab_name = data.get('lab_name', random.choice(labs))

        booking_doc = {
            'booking_code': booking_code,
            'user_id': user.id,
            'user_name': user.name,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'test_name': test_name,
            'lab_name': lab_name,
            'collection_type': collection_type,
            'collection_address': data.get('collection_address', patient_address),
            'booking_date': booking_date,
            'booking_time': booking_time or '09:00 AM',
            'price': data.get('price', 650),
            'status': 'Confirmed', # Confirmed, Sample Collected, Processing, Report Ready
            'created_at': now,
            'updated_at': now
        }

        book_col = get_collection('diagnostic_bookings')
        res = book_col.insert_one(booking_doc)
        booking_doc['_id'] = res.inserted_id

        # Add to health timeline
        timeline_col = get_collection('health_timeline')
        timeline_col.insert_one({
            'user_id': user.id,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'event_type': 'Diagnostic Test',
            'title': f"{test_name} Booked ({booking_code})",
            'description': f"{collection_type} scheduled with {lab_name} on {booking_date}.",
            'status': 'Confirmed',
            'date': booking_date,
            'created_at': now
        })

        return Response(serialize_mongo_doc(booking_doc), status=status.HTTP_201_CREATED)
