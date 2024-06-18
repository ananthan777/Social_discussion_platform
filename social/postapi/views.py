from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from postapi.forms import CustomUserCreationForm
from .serializers import CommunitySerializer,PostSerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics,permissions


# User Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = CustomUserCreationForm(data=request.data)
    if form.is_valid():
        user = form.save()
        return Response({"detail": "Account created successfully"}, status=status.HTTP_201_CREATED)
    return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            is_superuser = user.is_superuser
            return Response({'token': token.key, 'is_superuser': is_superuser}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        pass
    return Response({'error': 'Invalid Credentials'}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommunitySerializer
from .models import Community


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_community(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = CommunitySerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_communities(request):
    communities = Community.objects.all()
    serializer = CommunitySerializer(communities, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def community_detail(request, pk):
    community = get_object_or_404(Community, pk=pk)
    serializer = CommunitySerializer(community)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_community(request, pk):
    community = get_object_or_404(Community, pk=pk)
    serializer = CommunitySerializer(community, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  


@api_view(['POST'])
def like_community(request, community_id):
    try:
        community = Community.objects.get(id=community_id)
        user = request.user

        if user in community.liked_users.all():
            community.liked_users.remove(user)
            community.likes_count -= 1
        else:
            if user in community.disliked_users.all():
                community.disliked_users.remove(user)
                community.dislikes_count -= 1
            community.liked_users.add(user)
            community.likes_count += 1

        community.save()
        return Response({'likes_count': community.likes_count, 'dislikes_count': community.dislikes_count})
    except Community.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def dislike_community(request, community_id):
    try:
        community = Community.objects.get(id=community_id)
        user = request.user

        if user in community.disliked_users.all():
            community.disliked_users.remove(user)
            community.dislikes_count -= 1
        else:
            if user in community.liked_users.all():
                community.liked_users.remove(user)
                community.likes_count -= 1
            community.disliked_users.add(user)
            community.dislikes_count += 1

        community.save()
        return Response({'likes_count': community.likes_count, 'dislikes_count': community.dislikes_count})
    except Community.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)                                                                                                                  
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Community

class CommunityLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        community = Community.objects.get(pk=pk)
        user = request.user
        if user in community.liked_users.all():
            community.liked_users.remove(user)
            community.likes_count -= 1
        else:
            community.liked_users.add(user)
            community.likes_count += 1
        community.save()
        return Response({'status': 'like updated', 'likes_count': community.likes_count})

class CommunityDislikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        community = Community.objects.get(pk=pk)
        user = request.user
        if user in community.disliked_users.all():
            community.disliked_users.remove(user)
            community.dislikes_count -= 1
        else:
            community.disliked_users.add(user)
            community.dislikes_count += 1
        community.save()
        return Response({'status': 'dislike updated', 'dislikes_count': community.dislikes_count})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_community(request, pk):
    community = get_object_or_404(Community, pk=pk)
    community.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
@permission_classes([AllowAny])
def create_post(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



           


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response({'success': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
