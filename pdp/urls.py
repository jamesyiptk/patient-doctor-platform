from django.urls import path
from django.views.generic import TemplateView

from pdp import views


urlpatterns = [
    path('api/patient-login/', views.patient_login, name='patient_login'),
    path('api/patient-register/', views.patient_register, name='patient_register'),
    path('api/doctor-login/', views.doctor_login, name='doctor_login'),
    path('api/doctor-register/', views.doctor_register, name='doctor_register'),

    # path('doctor-login/', TemplateView.as_view(template_name='index.html'), name='doctor_login'),
    path('doctor-logout/', views.doctor_logout, name='doctor_logout'),
    # path('doctor-register/', TemplateView.as_view(template_name='index.html'), name='doctor_register'),
    # path('patient-login', TemplateView.as_view(template_name='index.html'), name='patient_login'),
    # path('patient-register', TemplateView.as_view(template_name='index.html'), name='patient_register'),
    path('patient-logout', views.patient_logout, name='patient_logout'),

    path('global/', views.global_stream_view, name='global'),
    path('article/', views.article_stream_view, name='article'),
    path('create-post/', views.create_post, name='create_post'),
    path('add-comment/', views.add_comment, name='add-comment'),
    path('fetch-posts/', views.fetch_posts, name='fetch_posts'),
    
    # path('photo/<int:id>', views.get_photo, name='photo'),
]
