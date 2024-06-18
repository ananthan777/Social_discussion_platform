from rest_framework import serializers
from .models import Community,profileAuth
from django.contrib.auth.models import User







class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name','last_name']
                  
class CommunitySerializer(serializers.ModelSerializer):
    liked = serializers.SerializerMethodField()
    disliked = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'image', 'likes_count', 'dislikes_count', 'liked', 'disliked']

    def get_liked(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.liked_users.filter(id=user.id).exists()

    def get_disliked(self, obj):
        user = self.context['request'].user
        return user.is_authenticated and obj.disliked_users.filter(id=user.id).exists()
    


from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',]
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'community', 'created_by', 'created_at', 'updated_at']
        