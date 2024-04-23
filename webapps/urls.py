"""
URL configuration for webapps project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls.py import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls.py'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from pdp import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),

    path('api/articles/', views.ArticleListView.as_view(), name='article-list'),

    path('api/posts/', views.PostViewSet.as_view({'get': 'list', 'post': 'create'}), name='post-list'),
    path('api/categories/', views.CategoryViewSet.as_view({'get': 'list'}), name='caregory'),
    path('comments/', views.CreateCommentView.as_view(), name='create_comment'),
    path('api/comments/', views.CommentCreateAPIView.as_view(), name='create-comment'),
    path('api/doctors/', views.DoctorListView.as_view(), name='api_doctors'),
    # path('', views.index, name='index'),
    path("admin/", admin.site.urls),

    path('', include('pdp.urls')),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),

]
