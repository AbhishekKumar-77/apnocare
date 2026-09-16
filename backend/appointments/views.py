import random
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_id = request.user.id
        role = request.user.role
        appointments_col = get_collection('appointments')

        if role == 'doctor':
            query = {'doctor_email': request.user.email}
        elif role == 'admin':
            query = {}
        else:
            query = {'user_id': user_id}

        family_member_id = request.query_params.get('family_member_id')
        if family_member_id:
            query['family_member_id'] = family_member_id

        appointments = appointments_col.find(query)
        # Sort by appointment_date / created_at descending
        sorted_appts = sorted(appointments, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_appts))

    def post(self, request):
        user_id = request.user.id
        data = request.data

        family_member_id = data.get('family_member_id')
        doctor_id = data.get('doctor_id')
        appointment_date = data.get('appointment_date')
        appointment_time = data.get('appointment_time')

        if not family_member_id or not doctor_id or not appointment_date or not appointment_time:
            return Response({'error': 'Family member, doctor, date, and time slot are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve family member
        family_col = get_collection('family_members')
        try:
            fm_query = {'_id': ObjectId(family_member_id), 'user_id': user_id}
        except Exception:
            fm_query = {'_id': family_member_id, 'user_id': user_id}
        family_doc = family_col.find_one(fm_query)
        if not family_doc:
            return Response({'error': 'Family member not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve doctor
        doctors_col = get_collection('doctors')
        try:
            doc_query = {'_id': ObjectId(doctor_id)}
        except Exception:
            doc_query = {'_id': doctor_id}
        doctor_doc = doctors_col.find_one(doc_query)
        if not doctor_doc:
            return Response({'error': 'Doctor not found.'}, status=status.HTTP_404_NOT_FOUND)

        appointment_code = f"APT-{random.randint(100000, 999999)}"
        appt_doc = {
            'appointment_code': appointment_code,
            'user_id': user_id,
            'user_name': request.user.name,
            'user_email': request.user.email,
            'family_member_id': str(family_doc.get('_id')),
            'patient_name': family_doc.get('name'),
            'patient_relation': family_doc.get('relation'),
            'patient_age': family_doc.get('age'),
            'patient_gender': family_doc.get('gender'),
            'patient_location': family_doc.get('location'),
            'doctor_id': str(doctor_doc.get('_id')),
            'doctor_name': doctor_doc.get('name'),
            'doctor_specialty': doctor_doc.get('specialty'),
            'hospital_name': doctor_doc.get('hospital_name'),
            'hospital_address': doctor_doc.get('hospital_address', doctor_doc.get('city', 'Jalandhar')),
            'consultation_fee': doctor_doc.get('consultation_fee', 800),
            'appointment_date': appointment_date,
            'appointment_time': appointment_time,
            'reason_for_visit': data.get('reason_for_visit', 'Routine Health Consultation'),
            'status': 'confirmed',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        appointments_col = get_collection('appointments')
        res = appointments_col.insert_one(appt_doc)
        appt_doc['_id'] = res.inserted_id

        # Add to notifications
        notif_col = get_collection('notifications')
        notif_col.insert_one({
            'user_id': user_id,
            'title': 'Appointment Confirmed',
            'message': f"Appointment #{appointment_code} with {doctor_doc.get('name')} for {family_doc.get('name')} has been scheduled on {appointment_date} at {appointment_time}.",
            'type': 'appointment_confirmed',
            'related_id': str(res.inserted_id),
            'read': False,
            'created_at': datetime.utcnow()
        })

        # Add to health timeline
        timeline_col = get_collection('health_timeline')
        timeline_col.insert_one({
            'user_id': user_id,
            'family_member_id': str(family_doc.get('_id')),
            'patient_name': family_doc.get('name'),
            'event_type': 'Doctor Appointment',
            'title': f"Consultation with {doctor_doc.get('name')} ({doctor_doc.get('specialty')})",
            'description': f"Scheduled at {doctor_doc.get('hospital_name')} on {appointment_date} at {appointment_time}.",
            'status': 'Confirmed',
            'date': appointment_date,
            'created_at': datetime.utcnow()
        })

        return Response(serialize_mongo_doc(appt_doc), status=status.HTTP_201_CREATED)


class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def _get_query(self, appt_id, user):
        try:
            oid = ObjectId(appt_id)
        except Exception:
            oid = appt_id
        if user.role == 'admin':
            return {'_id': oid}
        return {'_id': oid, 'user_id': user.id}

    def get(self, request, pk):
        appointments_col = get_collection('appointments')
        appt = appointments_col.find_one(self._get_query(pk, request.user))
        if not appt:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo_doc(appt))

    def put(self, request, pk):
        action = request.data.get('action') # cancel or reschedule
        appointments_col = get_collection('appointments')
        query = self._get_query(pk, request.user)
        appt = appointments_col.find_one(query)
        if not appt:
            return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)

        updates = {'updated_at': datetime.utcnow()}
        if action == 'cancel':
            updates['status'] = 'cancelled'
            updates['cancellation_reason'] = request.data.get('reason', 'User cancelled')
        elif action == 'reschedule':
            new_date = request.data.get('new_date')
            new_time = request.data.get('new_time')
            if not new_date or not new_time:
                return Response({'error': 'New date and time required'}, status=status.HTTP_400_BAD_REQUEST)
            updates['appointment_date'] = new_date
            updates['appointment_time'] = new_time
            updates['status'] = 'confirmed'

        appointments_col.update_one(query, {'$set': updates})
        updated = appointments_col.find_one(query)
        return Response(serialize_mongo_doc(updated))
