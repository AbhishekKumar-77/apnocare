import os
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class HealthRecordListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_id = request.user.id
        records_col = get_collection('health_records')
        query = {'user_id': user_id}
        
        family_member_id = request.query_params.get('family_member_id')
        if family_member_id and family_member_id != 'all':
            query['family_member_id'] = family_member_id

        record_type = request.query_params.get('type')
        if record_type and record_type != 'all':
            query['record_type'] = record_type

        records = records_col.find(query)
        sorted_records = sorted(records, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_records))

    def post(self, request):
        user = request.user
        data = request.data

        family_member_id = data.get('family_member_id')
        title = data.get('title', 'Medical Document')
        record_type = data.get('record_type', 'Prescription') # Prescription, Lab Report, X-Ray, Bill, Discharge Summary
        doctor_name = data.get('doctor_name', '')
        hospital_name = data.get('hospital_name', '')
        date_str = data.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
        notes = data.get('notes', '')

        file_obj = request.FILES.get('file')
        file_url = data.get('file_url')

        if file_obj:
            rec_dir = os.path.join(settings.MEDIA_ROOT, 'health_records')
            os.makedirs(rec_dir, exist_ok=True)
            filename = f"rec_{int(datetime.utcnow().timestamp())}_{file_obj.name}"
            filepath = os.path.join(rec_dir, filename)
            with open(filepath, 'wb+') as dest:
                for chunk in file_obj.chunks():
                    dest.write(chunk)
            file_url = f"{settings.MEDIA_URL}health_records/{filename}"

        patient_name = 'Family Member'
        if family_member_id:
            fam_col = get_collection('family_members')
            try:
                fm = fam_col.find_one({'_id': ObjectId(family_member_id)})
            except Exception:
                fm = fam_col.find_one({'_id': family_member_id})
            if fm:
                patient_name = fm.get('name')

        record_doc = {
            'user_id': user.id,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'title': title,
            'record_type': record_type,
            'file_url': file_url,
            'doctor_name': doctor_name,
            'hospital_name': hospital_name,
            'date': date_str,
            'notes': notes,
            'created_at': datetime.utcnow()
        }

        records_col = get_collection('health_records')
        res = records_col.insert_one(record_doc)
        record_doc['_id'] = res.inserted_id

        # Also add entry to chronological health timeline
        timeline_col = get_collection('health_timeline')
        timeline_col.insert_one({
            'user_id': user.id,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'event_type': f"{record_type} Uploaded",
            'title': title,
            'description': f"{record_type} from {doctor_name or hospital_name or 'Medical Center'} stored in Health Vault.",
            'status': 'Uploaded',
            'date': date_str,
            'file_url': file_url,
            'created_at': datetime.utcnow()
        })

        return Response(serialize_mongo_doc(record_doc), status=status.HTTP_201_CREATED)


class HealthTimelineView(APIView):
    """Returns chronological healthcare timeline for family"""
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_id = request.user.id
        timeline_col = get_collection('health_timeline')
        query = {'user_id': user_id}

        family_member_id = request.query_params.get('family_member_id')
        if family_member_id and family_member_id != 'all':
            query['family_member_id'] = family_member_id

        events = list(timeline_col.find(query))
        # Sort by date / created_at descending
        sorted_events = sorted(events, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_events))


class HealthRecordDetailView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def delete(self, request, pk):
        records_col = get_collection('health_records')
        try:
            query = {'_id': ObjectId(pk), 'user_id': request.user.id}
        except Exception:
            query = {'_id': pk, 'user_id': request.user.id}
        records_col.delete_one(query)
        return Response({'message': 'Record deleted successfully.'})
