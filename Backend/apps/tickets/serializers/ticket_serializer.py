from rest_framework import serializers
from tickets.models.ticket import Ticket

class TicketSerializer(serializers.ModelSerializer):
    creator = serializers.StringRelatedField(read_only=True)
    assignee = serializers.PrimaryKeyRelatedField(queryset=None, required=False, allow_null=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "creator",
            "assignee",
            "status",
            "priority",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "creator"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from django.contrib.auth import get_user_model
        self.fields["assignee"].queryset = get_user_model().objects.all()

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data.setdefault("creator", request.user)
        return super().create(validated_data)
