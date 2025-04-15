from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import CategorieViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)

urlpatterns = [
    path('register/', views.register_user, name='register_user'),  # Inscription d'un nouvel utilisateur
    path('login/', views.login_user, name='login_user'),  # Connexion d'un utilisateur
    path('send-verification-code/', views.send_verification_code, name='send_verification_code'),  # Envoie un code de vérification
    path('verify-email/', views.verify_email_code, name='verify_email_code'),  # Vérifie le code de vérification
    path('profile/', views.get_user_profile, name='get_user_profile'),  # Récupère le profil de l'utilisateur connecté
    path('resend-verification/', views.resend_verification, name='resend_verification'),  # Renvoie un code de vérification pour l'utilisateur connecté
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),  # Ajoute les URL du routeur ici
]
