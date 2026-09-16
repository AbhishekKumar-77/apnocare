from rest_framework.permissions import BasePermission

class IsAuthenticatedMongo(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'is_authenticated', False))

class IsAdminUserMongo(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            getattr(request.user, 'is_authenticated', False) and 
            getattr(request.user, 'role', '') == 'admin'
        )

class IsRepresentativeMongo(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            getattr(request.user, 'is_authenticated', False) and 
            getattr(request.user, 'role', '') in ['care_representative', 'admin']
        )
