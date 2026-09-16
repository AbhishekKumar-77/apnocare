import os
import random
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class MedicineOrderListCreateView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user = request.user
        med_col = get_collection('medicine_orders')
        query = {} if user.role == 'admin' else {'user_id': user.id}
        orders = med_col.find(query)
        sorted_orders = sorted(orders, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_orders))

    def post(self, request):
        user = request.user
        data = request.data

        family_member_id = data.get('family_member_id')
        medicine_names = data.get('medicines', '')
        delivery_address = data.get('delivery_address', '')

        file_obj = request.FILES.get('prescription_file')
        file_url = None

        if file_obj:
            presc_dir = os.path.join(settings.MEDIA_ROOT, 'prescriptions')
            os.makedirs(presc_dir, exist_ok=True)
            filename = f"med_{int(datetime.utcnow().timestamp())}_{file_obj.name}"
            filepath = os.path.join(presc_dir, filename)
            with open(filepath, 'wb+') as dest:
                for chunk in file_obj.chunks():
                    dest.write(chunk)
            file_url = f"{settings.MEDIA_URL}prescriptions/{filename}"

        patient_name = data.get('patient_name', 'Family Member')
        if family_member_id:
            fam_col = get_collection('family_members')
            try:
                fm = fam_col.find_one({'_id': ObjectId(family_member_id)})
            except Exception:
                fm = fam_col.find_one({'_id': family_member_id})
            if fm:
                patient_name = fm.get('name')
                if not delivery_address:
                    delivery_address = fm.get('location')

        order_code = f"MED-{random.randint(100000, 999999)}"
        now = datetime.utcnow()

        pharmacies = ['Apollo Pharmacy - GT Road, Jalandhar', 'MedPlus Health Care', 'City Chemist & Druggists']
        assigned_pharmacy = random.choice(pharmacies)

        order_doc = {
            'order_code': order_code,
            'user_id': user.id,
            'user_name': user.name,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'medicines_list': medicine_names,
            'prescription_url': file_url,
            'delivery_address': delivery_address or user.location or 'Model Town, Jalandhar',
            'pharmacy_name': assigned_pharmacy,
            'total_amount': random.randint(450, 1850),
            'status': 'Pharmacist Verified', # Prescription Received, Pharmacist Verified, Out for Delivery, Delivered
            'status_timeline': [
                {'status': 'Prescription Received', 'time': now.strftime('%I:%M %p')},
                {'status': 'Pharmacist Verified', 'time': now.strftime('%I:%M %p')}
            ],
            'created_at': now,
            'updated_at': now
        }

        med_col = get_collection('medicine_orders')
        res = med_col.insert_one(order_doc)
        order_doc['_id'] = res.inserted_id

        # Record in health timeline
        timeline_col = get_collection('health_timeline')
        timeline_col.insert_one({
            'user_id': user.id,
            'family_member_id': family_member_id,
            'patient_name': patient_name,
            'event_type': 'Medicine Coordination',
            'title': f"Medicines Ordered ({order_code})",
            'description': f"Coordinated with {assigned_pharmacy} for delivery to {patient_name}.",
            'status': 'Processing',
            'date': now.strftime('%Y-%m-%d'),
            'created_at': now
        })

        return Response(serialize_mongo_doc(order_doc), status=status.HTTP_201_CREATED)


class MedicineOrderDetailView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request, pk):
        med_col = get_collection('medicine_orders')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}
        doc = med_col.find_one(query)
        if not doc:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serialize_mongo_doc(doc))
