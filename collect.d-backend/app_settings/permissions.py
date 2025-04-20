from rest_framework import permissions

class IsCompanyOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a company to access its settings.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user
        # Write permissions are only allowed to the owner of the company
        return obj.user == request.user

class IsCompanyMember(permissions.BasePermission):
    """
    Custom permission to allow company members to access certain settings.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is a member of the company
        if hasattr(obj, 'company'):
            return obj.company.user == request.user
        return False

class IsSettingOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a setting to modify it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user
        # Write permissions are only allowed to the owner of the setting
        return obj.user == request.user

class IsAPICredentialOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an API credential to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user owns the company that owns the integration
        return obj.integration.company.user == request.user

class CanViewAuditLogs(permissions.BasePermission):
    """
    Custom permission to only allow authorized users to view audit logs.
    """
    def has_permission(self, request, view):
        # Only allow users with specific permissions to view audit logs
        return request.user.has_perm('settings.view_auditlog') 