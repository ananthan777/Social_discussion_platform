from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('create_community/', views.create_community, name='create_community'),
    path('list-communities/', views.list_communities, name='list_communities'),
    path('communities/<int:pk>/like/', views.CommunityLikeView.as_view(), name='community-like'),
    path('communities/<int:pk>/dislike/', views.CommunityDislikeView.as_view(), name='community-dislike'),

    
    path('logout/', views.logout, name='logout'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('communities/<int:pk>/', views.community_detail, name='community_detail'),
    path('communities/<int:pk>/edit/', views.update_community, name='update_community'),
    path('delete-community/<int:pk>/', views.delete_community, name='delete_community'),
    path('create_post/', views.create_post, name='create-post'),
]