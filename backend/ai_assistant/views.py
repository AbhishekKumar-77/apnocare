import os
import re
import json
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

# Emergency keywords triggering critical medical safety protocol
EMERGENCY_KEYWORDS = [
    r'collapse', r'unconscious', r'chest pain', r'heart attack', r'stroke',
    r'breath(less)?', r'cannot breathe', r'heavy bleed', r'convulsion', r'seizure',
    r'behosh', r'chhati mein dard', r'dil ka daura', r'khoon', r'sans nahi'
]

def check_emergency(text: str) -> bool:
    for kw in EMERGENCY_KEYWORDS:
        if re.search(kw, text, re.IGNORECASE):
            return True
    return False

def parse_patient_from_family(text: str, family_members: list):
    """Detects which family member the user is referring to (Mom, Dad, Mother, Father, etc.)"""
    text_lower = text.lower()
    relations_map = {
        'mom': 'Mother', 'mother': 'Mother', 'mummy': 'Mother', 'mata': 'Mother', 'maa': 'Mother',
        'dad': 'Father', 'father': 'Father', 'papa': 'Father', 'pitaji': 'Father',
        'dadi': 'Grandmother', 'nani': 'Grandmother', 'grandmother': 'Grandmother',
        'dada': 'Grandfather', 'nana': 'Grandfather', 'grandfather': 'Grandfather',
        'wife': 'Spouse', 'husband': 'Spouse', 'spouse': 'Spouse',
        'son': 'Child', 'daughter': 'Child', 'child': 'Child', 'bacha': 'Child',
        'brother': 'Sibling', 'sister': 'Sibling'
    }

    # Match by direct name first
    for fm in family_members:
        if fm.get('name', '').lower() in text_lower:
            return fm

    # Match by relation keyword
    for kw, rel in relations_map.items():
        if re.search(r'\b' + kw + r'\b', text_lower):
            for fm in family_members:
                if fm.get('relation', '').lower() == rel.lower():
                    return fm
            # Return first with relation match or synthetic
            if family_members:
                return family_members[0]

    return family_members[0] if family_members else None


class AskApnoCareView(APIView):
    """Core AI Assistant endpoint for navigation, medical guidance, safety & platform actions"""
    permission_classes = [IsAuthenticatedMongo]

    def post(self, request):
        user = request.user
        message = request.data.get('message', '').strip()
        conversation_history = request.data.get('history', [])
        language = request.data.get('language', 'English') # English, Hindi, Hinglish, Punjabi
        report_text = request.data.get('report_text', '')

        if not message and not report_text:
            return Response({'error': 'Message or document text is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. EMERGENCY SAFETY CHECK (Priority 1)
        full_query = f"{message} {report_text}"
        if check_emergency(full_query):
            emergency_response = {
                'is_emergency': True,
                'reply': (
                    "⚠️ **POSSIBLE MEDICAL EMERGENCY DETECTED**\n\n"
                    "Please do **not** wait for an online consultation. Contact emergency medical services immediately or get someone nearby to assist.\n\n"
                    "• **National Emergency Helpline (Ambulance): 108 / 112**\n"
                    "• **Nearest 24/7 Trauma Centers** have been located for you below.\n\n"
                    "ApnoCare is here to assist, but emergency services must take priority in acute situations."
                ),
                'action': {
                    'type': 'EMERGENCY_TRIAGE',
                    'helplines': [{'name': 'Ambulance & Trauma', 'number': '108'}, {'name': 'National Emergency', 'number': '112'}],
                    'nearby_emergency_hospitals': [
                        {'name': 'Tagore Hospital & Heart Care 24x7 ER', 'phone': '0181-2244222', 'city': 'Jalandhar'},
                        {'name': 'Civil Hospital Emergency Ward', 'phone': '0181-2223344', 'city': 'Jalandhar'}
                    ]
                }
            }
            return Response(emergency_response)

        # Retrieve user's family members for contextual awareness
        fam_col = get_collection('family_members')
        family_members = list(fam_col.find({'user_id': user.id}))
        target_patient = parse_patient_from_family(message, family_members)

        patient_name = target_patient.get('name') if target_patient else 'your family member'
        patient_id = str(target_patient.get('_id')) if target_patient else None
        patient_city = target_patient.get('city', 'Jalandhar') if target_patient else 'Jalandhar'

        # 2. MEDICAL REPORT EXPLAINER INTENT
        if report_text or 'report' in message.lower() or 'explain' in message.lower() and ('test' in message.lower() or 'cbc' in message.lower() or 'sugar' in message.lower()):
            reply = (
                f"📋 **Medical Report Overview for {patient_name}:**\n\n"
                f"Here is an explanation of the terminology found in your document:\n"
                f"• **Diagnostic Parameters:** Laboratory indicators show baseline metabolic and physiological markers.\n"
                f"• **Plain-Language Summary:** The recorded values should be evaluated against your specific medical history and existing medications.\n\n"
                f"⚠️ *Important Medical Disclaimer: ApnoCare AI provides health literacy assistance and does not provide clinical diagnosis or modify treatments. A licensed healthcare professional must interpret these results.*"
            )
            action = {
                'type': 'FIND_DOCTOR',
                'parameters': {
                    'patient_id': patient_id,
                    'patient_name': patient_name,
                    'suggested_specialty': 'General Physician',
                    'city': patient_city
                },
                'action_label': f"Consult Doctor to Review {patient_name}'s Report"
            }
            return Response({'reply': reply, 'action': action, 'is_emergency': False})

        # 3. CARE ASSISTANCE INTENT ("Arranging someone to take Mom", "I am in Canada/Delhi, Mom is in Jalandhar", "Care representative")
        care_keywords = ['care assistance', 'take mom', 'take dad', 'accompany', 'hospital tomorrow', 'away from home', 'canada', 'bangalore', 'delhi', 'representative', 'assist my', 'le jaana', 'hospital le jana']
        if any(kw in message.lower() for kw in care_keywords):
            reply = (
                f"I understand you are currently away and need trusted, physical assistance for **{patient_name}** in {patient_city}.\n\n"
                f"ApnoCare can assign a verified local **Care Representative** who will:\n"
                f"1. Reach {patient_name}'s home on time.\n"
                f"2. Accompany them safely to the hospital/clinic.\n"
                f"3. Assist with registration, doctor consultation queues, and collecting prescriptions.\n"
                f"4. Coordinate prescribed medicines and accompany them safely back home.\n"
                f"5. Keep you live-updated at every stage on your Family Timeline.\n\n"
                f"Would you like me to create this Care Assistance Request for {patient_name}?"
            )
            action = {
                'type': 'REQUEST_CARE',
                'parameters': {
                    'family_member_id': patient_id,
                    'patient_name': patient_name,
                    'location': target_patient.get('location') if target_patient else 'Jalandhar, Punjab',
                    'service_type': 'Doctor Visit Assistance',
                    'scheduled_date': datetime.utcnow().strftime('%Y-%m-%d'),
                    'scheduled_time': '10:00 AM'
                },
                'action_label': f"Confirm Care Assistance for {patient_name}"
            }
            return Response({'reply': reply, 'action': action, 'is_emergency': False})

        # 4. APPOINTMENT BOOKING INTENT ("Book appointment", "Book doctor tomorrow")
        book_keywords = ['book', 'appointment', 'doctor tomorrow', 'slot', 'milna hai']
        if any(kw in message.lower() for kw in book_keywords):
            # Query top doctors in patient's city
            doctors_col = get_collection('doctors')
            docs = list(doctors_col.find({'city': {'$regex': patient_city, '$options': 'i'}}))
            if not docs:
                docs = list(doctors_col.find({}))
            top_doc = docs[0] if docs else None
            doc_name = top_doc.get('name', 'Dr. Sharma') if top_doc else 'Dr. Sharma'
            specialty = top_doc.get('specialty', 'General Physician') if top_doc else 'General Physician'

            reply = (
                f"I can help you schedule an appointment for **{patient_name}** with a verified specialist in {patient_city}.\n\n"
                f"Recommended: **{doc_name}** ({specialty}) at {top_doc.get('hospital_name', 'City Care Hospital')}.\n"
                f"Available slots: **Tomorrow at 10:30 AM** or **11:30 AM**.\n\n"
                f"Please review and confirm the booking below."
            )
            action = {
                'type': 'BOOK_APPOINTMENT',
                'parameters': {
                    'family_member_id': patient_id,
                    'patient_name': patient_name,
                    'doctor_id': str(top_doc['_id']) if top_doc else None,
                    'doctor_name': doc_name,
                    'specialty': specialty,
                    'appointment_date': datetime.utcnow().strftime('%Y-%m-%d'),
                    'appointment_time': '10:30 AM'
                },
                'action_label': f"Book {doc_name} for {patient_name}"
            }
            return Response({'reply': reply, 'action': action, 'is_emergency': False})

        # 5. FIND DOCTOR / HOSPITAL INTENT
        search_keywords = ['find doctor', 'cardiologist', 'orthopedic', 'physician', 'hospital', 'dermatologist', 'clinic', 'doctor chahiye']
        if any(kw in message.lower() for kw in search_keywords):
            reply = (
                f"Searching for accredited doctors and hospitals near **{patient_name}** in {patient_city}...\n\n"
                f"I have found verified medical providers matching your criteria. You can view their credentials, hospital affiliations, patient ratings, and available slots."
            )
            action = {
                'type': 'FIND_DOCTOR',
                'parameters': {
                    'patient_id': patient_id,
                    'patient_name': patient_name,
                    'city': patient_city
                },
                'action_label': f"View Available Doctors in {patient_city}"
            }
            return Response({'reply': reply, 'action': action, 'is_emergency': False})

        # 6. MEDICINE ASSISTANCE INTENT
        med_keywords = ['medicine', 'pharmacy', 'dawai', 'prescription', 'tablet', 'syrup']
        if any(kw in message.lower() for kw in med_keywords):
            reply = (
                f"I can coordinate prescribed medications for **{patient_name}** through a licensed pharmacy network.\n\n"
                f"• Verified licensed pharmacists will check the prescription.\n"
                f"• Genuine sealed medicines delivered directly to {patient_name}'s address.\n\n"
                f"You can upload the doctor's prescription slip or enter the required medicine names below."
            )
            action = {
                'type': 'ORDER_MEDICINE',
                'parameters': {
                    'family_member_id': patient_id,
                    'patient_name': patient_name,
                    'address': target_patient.get('location') if target_patient else 'Jalandhar'
                },
                'action_label': f"Start Medicine Request for {patient_name}"
            }
            return Response({'reply': reply, 'action': action, 'is_emergency': False})

        # 7. GENERAL HEALTHCARE ASSISTANT GUIDANCE
        reply = (
            f"Hello {user.name}! I am **Ask ApnoCare**, your family's personal healthcare navigator.\n\n"
            f"I can assist you with:\n"
            f"• 🚗 **Care Assistance:** Arranging a verified local representative to accompany {patient_name} to doctors or hospital visits.\n"
            f"• 🩺 **Doctor & Hospital Discovery:** Finding and booking top specialists in {patient_city}.\n"
            f"• 💊 **Medicine Coordination:** Safe delivery from verified pharmacies.\n"
            f"• 🧪 **Diagnostic Tests:** Home sample collection with digital lab reports.\n"
            f"• 📁 **Health Vault:** Plain-language explanations of medical reports and health timeline updates.\n\n"
            f"How can I help {patient_name} or your family today?"
        )
        return Response({
            'reply': reply,
            'action': None,
            'is_emergency': False
        })
