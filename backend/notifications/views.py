from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.db import get_collection, serialize_mongo_doc
from core.permissions import IsAuthenticatedMongo

class NotificationListView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def get(self, request):
        user_id = request.user.id
        notif_col = get_collection('notifications')
        notifs = notif_col.find({'user_id': user_id})
        sorted_notifs = sorted(notifs, key=lambda x: x.get('created_at', datetime.min), reverse=True)
        return Response(serialize_mongo_doc(sorted_notifs))


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def put(self, request, pk):
        notif_col = get_collection('notifications')
        try:
            query = {'_id': ObjectId(pk), 'user_id': request.user.id}
        except Exception:
            query = {'_id': pk, 'user_id': request.user.id}
        notif_col.update_one(query, {'$set': {'read': True}})
        return Response({'message': 'Marked as read'})


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticatedMongo]

    def put(self, request):
        notif_col = get_collection('notifications')
        notifs = notif_col.find({'user_id': request.user.id, 'read': False})
        for n in notifs:
            notif_col.update_one({'_id': n['_id']}, {'$set': {'read': True}})
        return Response({'message': 'All marked as read'})
