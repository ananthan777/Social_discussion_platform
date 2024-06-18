from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from django.core.validators import validate_email
from django.db.models import F

class profileAuth(models.Model):
    email = models.CharField(max_length=100, validators=[validate_email])
    password = models.CharField(max_length=50)

    def __str__(self):
        return self.email

class Community(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='media/', null=True)
    enabled = models.BooleanField(default=True)
    likes_count = models.IntegerField(default=0)
    dislikes_count = models.IntegerField(default=0)
    liked_users = models.ManyToManyField(User, related_name='liked_communities', blank=True)
    disliked_users = models.ManyToManyField(User, related_name='disliked_communities', blank=True)

    

    



    
class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4,editable=False)
    title = models.CharField(max_length=255)
    content = models.TextField()
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
