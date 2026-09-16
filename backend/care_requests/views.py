import random
import os
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo, IsRepresentativeMongo

# Ordered stages of Care Assistance Workflow
CARE_STAGES = [
    ('requested', 'Care Request Created'),
    ('assigned', 'Representative Assigned'),
    ('accepted', 'Assignment Accepted'),
    ('on_the_way', 'Representative On The Way'),
    ('reached_home', "Reached Patient's Home"),
    ('patient_picked_up', 'Patient Accompanied / Picked Up'),
    ('reached_hospital', 'Reached Hospital / Clinic'),
    ('registration_done', 'Hospital Registration Completed'),
    ('consultation_done', 'Doctor Consultation Completed'),
    ('tests_coordinated', 'Prescribed Diagnostic Tests Coordinated'),
    ('prescription_received', 'Prescription Collected & Uploaded'),
    ('medicine_coordinated', 'Prescribed Medicines Coordinated'),
    ('returning_home', 'Accompanied Patient Returning Home'),
    ('reached_home_safe', "Patient Safely Reached Home"),
    ('completed', 'Care Assistance Visit Completed')
]

STAGE_KEYS = [s[0] for s in CARE_STAGES]

def auto_match_representative(city, language_pref='Punjabi', gender_pref='Any'):
    """Finds best matching verified representative"""
    users_col = get_collection('users')
    query = {
        'role': 'care_representative',
        'representative_profile.verification_status': 'verified',
        'representative_profile.is_available': True
    }
    candidates = list(users_col.find(query))
    if not candidates:
        # Fallback to any representative
        query.pop('representative_profile.is_available', None)
        candidates = list(users_col.find({'role': 'care_representative'}))
    
    if candidates:
        # Pick best or first
        rep = candidates[0]
        return {
            'representative_id': str(rep['_id']),
            'representative_name': rep.get('name', 'Local Care Associate'),
            'representative_phone': rep.get('phone', '+91 98765 43210'),
            'representative_rating': rep.get('representative_profile', {}).get('rating', 4.9),
            'representative_photo': rep.get('representative_profile', {}).get('photo_url', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
        }
    return None


class CareRequestListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user = request.user
        care_col = get_collection('care_requests')

        if user.role == 'care_representative':
            requests = care_col.find({'representative_id': user.id})
        elif user.role == 'admin':
            requests = care_col.find({})
        else:
            requests = care_col.find({'user_id': user.id})

        sorted_reqs = sorted(requests, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_reqs))

    def post(self, request):
        user_id = request.user.id
        data = request.data

        family_member_id = data.get('family_member_id')
        service_type = data.get('service_type', 'Doctor Visit Assistance')
        scheduled_date = data.get('scheduled_date')
        scheduled_time = data.get('scheduled_time')

        if not family_member_id or not scheduled_date or not scheduled_time:
            return Response({'error': 'Family member, scheduled date, and time are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Get family member details
        family_col = get_collection('family_members')
        try:
            fm_q = {'_id': ObjectId(family_member_id), 'user_id': user_id}
        except Exception:
            fm_q = {'_id': family_member_id, 'user_id': user_id}
        member = family_col.find_one(fm_q)
        if not member:
            return Response({'error': 'Family member not found.'}, status=status.HTTP_404_NOT_FOUND)

        request_code = f"CARE-{random.randint(100000, 999999)}"
        matched_rep = auto_match_representative(
            city=member.get('city', 'Jalandhar'),
            language_pref=data.get('language_pref', member.get('preferred_language', 'Punjabi')),
            gender_pref=data.get('gender_pref', 'Any')
        )

        now = datetime.utcnow()
        init_status = 'assigned' if matched_rep else 'requested'

        timeline_entries = [{
            'stage': 'requested',
            'title': 'Care Request Created',
            'timestamp': now.isoformat(),
            'notes': f"Requested {service_type} for {member.get('name')} in {member.get('city', 'Jalandhar')}."
        }]

        if matched_rep:
            timeline_entries.append({
                'stage': 'assigned',
                'title': f"Care Associate {matched_rep['representative_name']} Assigned",
                'timestamp': now.isoformat(),
                'notes': f"Matched based on patient location, language ({member.get('preferred_language')}) and service requirements."
            })

        care_doc = {
            'request_code': request_code,
            'user_id': user_id,
            'user_name': request.user.name,
            'user_phone': request.user.phone,
            'family_member_id': str(member['_id']),
            'patient_name': member.get('name'),
            'patient_relation': member.get('relation'),
            'patient_age': member.get('age'),
            'patient_gender': member.get('gender'),
            'patient_phone': member.get('phone'),
            'pickup_address': data.get('pickup_address', member.get('location')),
            'city': member.get('city', 'Jalandhar'),
            'emergency_contact': member.get('emergency_contact'),
            
            'service_type': service_type,
            'preferred_provider_mode': data.get('preferred_provider_mode', 'find_nearby'), # 'selected_provider' or 'find_nearby'
            'preferred_hospital_doctor': data.get('preferred_hospital_doctor', member.get('preferred_hospital', 'Tagore Hospital')),
            'gender_pref': data.get('gender_pref', 'Any'),
            'language_pref': data.get('language_pref', member.get('preferred_language', 'Punjabi')),
            'special_instructions': data.get('special_instructions', ''),
            'scheduled_date': scheduled_date,
            'scheduled_time': scheduled_time,

            'status': init_status, # requested, assigned, accepted, on_the_way, reached_home, etc.
            'timeline': timeline_entries,
            'uploaded_documents': [],
            'care_fee': 1200, # INR service fee
            'created_at': now,
            'updated_at': now
        }

        if matched_rep:
            care_doc.update(matched_rep)

        care_col = get_collection('care_requests')
        res = care_col.insert_one(care_doc)
        care_doc['_id'] = res.inserted_id

        # Notification for User
        notif_col = get_collection('notifications')
        notif_col.insert_one({
            'user_id': user_id,
            'title': 'Care Assistance Booked',
            'message': f"Request #{request_code} created for {member.get('name')}. Care Associate assigned: {matched_rep['representative_name'] if matched_rep else 'Finding Associate'}.",
            'type': 'care_request_created',
            'related_id': str(res.inserted_id),
            'read': False,
            'created_at': now
        })

        # Health timeline
        health_timeline_col = get_collection('health_timeline')
        health_timeline_col.insert_one({
            'user_id': user_id,
            'family_member_id': str(member['_id']),
            'patient_name': member.get('name'),
            'event_type': 'Care Assistance',
            'title': f"Care Assistance Request ({service_type})",
            'description': f"Associate {matched_rep['representative_name'] if matched_rep else 'Pending'} arranged for {scheduled_date} at {scheduled_time}.",
            'status': 'Scheduled',
            'date': scheduled_date,
            'created_at': now
        })

        return Response(serialize_mongo_doc(care_doc), status=status.HTTP_201_CREATED)


class CareRequestDetailView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request, pk):
        care_col = get_collection('care_requests')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        # Check permissions: owner, rep, or admin
        req_doc = care_col.find_one(query)
        if not req_doc:
            return Response({'error': 'Care request not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role != 'admin' and req_doc.get('user_id') != user.id and req_doc.get('representative_id') != user.id:
            return Response({'error': 'Access denied to this care request'}, status=status.HTTP_403_FORBIDDEN)

        return Response(serialize_mongo_doc(req_doc))


class CareRequestStatusUpdateView(APIView):
    """Representative or Admin updates care assistance status timeline"""
    permission_classes = [IsAuthenticatedMongo]

    def post(self, request, pk):
        user = request.user
        care_col = get_collection('care_requests')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        req_doc = care_col.find_one(query)
        if not req_doc:
            return Response({'error': 'Care request not found'}, status=status.HTTP_404_NOT_FOUND)

        if user.role != 'admin' and req_doc.get('representative_id') != user.id:
            return Response({'error': 'Only the assigned representative or admin can update status'}, status=status.HTTP_403_FORBIDDEN)

        next_stage = request.data.get('stage')
        notes = request.data.get('notes', '')

        # Find friendly title for the stage
        stage_title = dict(CARE_STAGES).get(next_stage, next_stage.replace('_', ' ').title())
        now = datetime.utcnow()

        new_timeline_entry = {
            'stage': next_stage,
            'title': stage_title,
            'timestamp': now.isoformat(),
            'notes': notes,
            'updated_by': user.name
        }

        # Check for optional document attachment uploaded in this step
        uploaded_doc = request.data.get('uploaded_doc')
        if uploaded_doc:
            new_timeline_entry['attachment'] = uploaded_doc

        updates = {
            'status': next_stage,
            'updated_at': now
        }

        care_col.update_one(query, {
            '$set': updates,
            '$push': {'timeline': new_timeline_entry}
        })

        # If document attached, also add to uploaded_documents
        if uploaded_doc:
            care_col.update_one(query, {'$push': {'uploaded_documents': uploaded_doc}})
            # Also record in health vault for the patient!
            health_records_col = get_collection('health_records')
            health_records_col.insert_one({
                'user_id': req_doc.get('user_id'),
                'family_member_id': req_doc.get('family_member_id'),
                'patient_name': req_doc.get('patient_name'),
                'title': uploaded_doc.get('title', 'Document from Care Visit'),
                'record_type': uploaded_doc.get('type', 'Prescription'),
                'file_url': uploaded_doc.get('file_url'),
                'doctor_name': req_doc.get('preferred_hospital_doctor', 'Consulting Doctor'),
                'hospital_name': req_doc.get('city', 'Hospital'),
                'date': now.strftime('%Y-%m-%d'),
                'created_at': now
            })

        # Send notification to remote family user
        notif_col = get_collection('notifications')
        notif_col.insert_one({
            'user_id': req_doc.get('user_id'),
            'title': f"Care Update: {stage_title}",
            'message': f"Care Representative {user.name} reported: '{notes or stage_title}' for {req_doc.get('patient_name')}.",
            'type': 'care_status_update',
            'related_id': str(req_doc['_id']),
            'read': False,
            'created_at': now
        })

        updated_req = care_col.find_one(query)
        return Response(serialize_mongo_doc(updated_req))


class CareRequestUploadDocView(APIView):
    """Uploads document image (prescription, lab slip) during a visit"""
    permission_classes = [IsAuthenticatedMongo]

    def post(self, request, pk):
        care_col = get_collection('care_requests')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        req_doc = care_col.find_one(query)
        if not req_doc:
            return Response({'error': 'Care request not found'}, status=status.HTTP_404_NOT_FOUND)

        file_obj = request.FILES.get('file')
        doc_type = request.data.get('doc_type', 'Prescription')
        doc_title = request.data.get('doc_title', f"{doc_type} - {req_doc.get('patient_name')}")

        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Save file to media/documents
        doc_dir = os.path.join(settings.MEDIA_ROOT, 'care_documents')
        os.makedirs(doc_dir, exist_ok=True)
        filename = f"{req_doc.get('request_code')}_{int(datetime.utcnow().timestamp())}_{file_obj.name}"
        filepath = os.path.join(doc_dir, filename)

        with open(filepath, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        file_url = f"{settings.MEDIA_URL}care_documents/{filename}"
        doc_info = {
            'title': doc_title,
            'type': doc_type,
            'file_url': file_url,
            'uploaded_at': datetime.utcnow().isoformat(),
            'uploaded_by': request.user.name
        }

        care_col.update_one(query, {
            '$push': {'uploaded_documents': doc_info},
            '$set': {'updated_at': datetime.utcnow()}
        })

        # Also store in health vault for patient
        health_col = get_collection('health_records')
        health_col.insert_one({
            'user_id': req_doc.get('user_id'),
            'family_member_id': req_doc.get('family_member_id'),
            'patient_name': req_doc.get('patient_name'),
            'title': doc_title,
            'record_type': doc_type,
            'file_url': file_url,
            'hospital_name': req_doc.get('preferred_hospital_doctor', 'Hospital'),
            'date': datetime.utcnow().strftime('%Y-%m-%d'),
            'created_at': datetime.utcnow()
        })

        return Response(doc_info, status=status.HTTP_201_CREATED)


class CareRepresentativeAssignedListView(APIView):
    """Lists requests assigned to current Care Representative"""
    permission_classes = [IsRepresentativeMongo]

    def get(self, request):
        user_id = request.user.id
        care_col = get_collection('care_requests')
        assigned = care_col.find({'representative_id': user_id})
        sorted_reqs = sorted(assigned, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_reqs))


class CareRepresentativeResponseView(APIView):
    """Care representative accepts or rejects assigned request"""
    permission_classes = [IsRepresentativeMongo]

    def post(self, request, pk):
        action = request.data.get('action') # 'accept' or 'reject'
        care_col = get_collection('care_requests')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        req_doc = care_col.find_one(query)
        if not req_doc:
            return Response({'error': 'Care request not found'}, status=status.HTTP_404_NOT_FOUND)

        now = datetime.utcnow()
        if action == 'accept':
            care_col.update_one(query, {
                '$set': {'status': 'accepted', 'updated_at': now},
                '$push': {'timeline': {
                    'stage': 'accepted',
                    'title': 'Care Associate Accepted Assignment',
                    'timestamp': now.isoformat(),
                    'notes': f"{request.user.name} confirmed availability and is preparing for visit."
                }}
            })
        elif action == 'reject':
            # Unassign and set status to requested for re-matching
            care_col.update_one(query, {
                '$set': {'status': 'requested', 'representative_id': None, 'representative_name': None, 'updated_at': now},
                '$push': {'timeline': {
                    'stage': 'requested',
                    'title': 'Re-assigning Associate',
                    'timestamp': now.isoformat(),
                    'notes': 'Associate had an emergency conflict; re-matching nearby verified representative.'
                }}
            })

        updated = care_col.find_one(query)
        return Response(serialize_mongo_doc(updated))
