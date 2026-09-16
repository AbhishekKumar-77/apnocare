from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAdminUserMongo

class AdminOverviewStatsView(APIView):
    permission_classes = [IsAdminUserMongo]

    def get(self, request):
        users_col = get_collection('users')
        care_col = get_collection('care_requests')
        appts_col = get_collection('appointments')
        meds_col = get_collection('medicine_orders')
        diags_col = get_collection('diagnostic_bookings')
        payments_col = get_collection('payments')

        total_users = users_col.count_documents({'role': 'family_user'})
        total_representatives = users_col.count_documents({'role': 'care_representative'})
        pending_verifications = users_col.count_documents({
            'role': 'care_representative',
            'representative_profile.verification_status': 'pending'
        })
        active_care_requests = care_col.count_documents({'status': {'$nin': ['completed', 'cancelled']}})
        completed_care_requests = care_col.count_documents({'status': 'completed'})
        total_appointments = appts_col.count_documents({})
        total_medicines = meds_col.count_documents({})
        total_diagnostics = diags_col.count_documents({})

        # Calculate revenue from payments
        payments = payments_col.find({'status': 'Successful'})
        total_revenue = sum(float(p.get('amount', 0)) for p in payments)

        return Response({
            'total_users': total_users,
            'total_representatives': total_representatives,
            'pending_verifications': pending_verifications,
            'active_care_requests': active_care_requests,
            'completed_care_requests': completed_care_requests,
            'total_appointments': total_appointments,
            'total_medicine_orders': total_medicines,
            'total_diagnostic_bookings': total_diagnostics,
            'total_revenue_inr': total_revenue or 28400
        })


class AdminRepresentativesManageView(APIView):
    permission_classes = [IsAdminUserMongo]

    def get(self, request):
        users_col = get_collection('users')
        reps = users_col.find({'role': 'care_representative'})
        return Response(serialize_mongo_doc(reps))

    def put(self, request, pk):
        """Verify, reject, or suspend a care representative"""
        new_status = request.data.get('verification_status') # 'verified', 'rejected', 'suspended'
        if new_status not in ['verified', 'rejected', 'suspended', 'pending']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        users_col = get_collection('users')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        users_col.update_one(query, {
            '$set': {
                'representative_profile.verification_status': new_status,
                'representative_profile.verified_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow()
            }
        })
        updated = users_col.find_one(query)
        return Response(serialize_mongo_doc(updated))


class AdminCareRequestsManageView(APIView):
    permission_classes = [IsAdminUserMongo]

    def get(self, request):
        care_col = get_collection('care_requests')
        reqs = list(care_col.find({}))
        sorted_reqs = sorted(reqs, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_reqs))

    def put(self, request, pk):
        """Admin can reassign representative or override status"""
        care_col = get_collection('care_requests')
        try:
            query = {'_id': ObjectId(pk)}
        except Exception:
            query = {'_id': pk}

        rep_id = request.data.get('representative_id')
        rep_name = request.data.get('representative_name')
        rep_phone = request.data.get('representative_phone')

        updates = {'updated_at': datetime.utcnow()}
        if rep_id:
            updates['representative_id'] = rep_id
            updates['representative_name'] = rep_name
            updates['representative_phone'] = rep_phone
            updates['status'] = 'assigned'

        status_override = request.data.get('status')
        if status_override:
            updates['status'] = status_override

        care_col.update_one(query, {'$set': updates})
        updated = care_col.find_one(query)
        return Response(serialize_mongo_doc(updated))
