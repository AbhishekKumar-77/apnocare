import random
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class PaymentCheckoutView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def post(self, request):
        user = request.user
        data = request.data

        amount = float(data.get('amount', 0))
        item_type = data.get('item_type', 'Service Fee') # 'care_assistance', 'appointment', 'medicine', 'diagnostic'
        item_id = data.get('item_id', '')
        payment_method = data.get('payment_method', 'UPI / Google Pay')

        if amount <= 0:
            return Response({'error': 'Valid payment amount required'}, status=status.HTTP_400_BAD_REQUEST)

        txn_id = f"TXN-{random.randint(10000000, 99999999)}"
        receipt_no = f"REC-APNO-{random.randint(10000, 99999)}"
        now = datetime.utcnow()

        payment_doc = {
            'transaction_id': txn_id,
            'receipt_number': receipt_no,
            'user_id': user.id,
            'user_name': user.name,
            'amount': amount,
            'currency': 'INR',
            'item_type': item_type,
            'item_id': item_id,
            'payment_method': payment_method,
            'status': 'Successful',
            'created_at': now
        }

        payments_col = get_collection('payments')
        res = payments_col.insert_one(payment_doc)
        payment_doc['_id'] = res.inserted_id

        return Response(serialize_mongo_doc(payment_doc), status=status.HTTP_201_CREATED)


class PaymentHistoryView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user = request.user
        payments_col = get_collection('payments')
        query = {} if user.role == 'admin' else {'user_id': user.id}
        txns = payments_col.find(query)
        sorted_txns = sorted(txns, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_txns))
