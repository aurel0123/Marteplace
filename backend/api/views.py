from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes , action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, EmailVerification, Vendeuradditional, Clientadditional ,Categorie
from .serializers import CustomUserSerializer, CategorieSerializer
from rest_framework import viewsets, permissions, status, filters
from django_filters.rest_framework import DjangoFilterBackend

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Inscription d'un nouvel utilisateur"""
    try:
        with transaction.atomic():
            # Récupération des données du formulaire
            user_data = {
                'email' : request.data.get('email') ,
                'password': request.data.get('password'),
                'nom' : request.data.get('nom') , 
                'prenom' : request.data.get('prenom') ,
                'phone' : request.data.get('phone', '') , 
                'type_user' : request.data.get('type_user', 'client')
            }
            
            # Vérifier si l'email existe déjà
            if CustomUser.objects.filter(email=user_data['email']).exists():
                return Response(
                    {'error': 'Un compte avec cette adresse email existe déjà'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            

            # Créer l'utilisateur
            user = CustomUser.objects.create_user(**user_data)
            
            # Créer les informations additionnelles selon le type d'utilisateur
            if user_data['type_user'] == 'vendeur':
                nom_boutique = request.data.get('nom_boutique', '')
                description_boutique = request.data.get('description_boutique', '')
                
                if not nom_boutique:
                    return Response(
                        {'error': 'Le nom de la boutique est obligatoire pour un vendeur'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                Vendeuradditional.objects.create(
                    user=user,
                    nom_boutique=nom_boutique,
                    description_boutique=description_boutique
                )
            elif user_data['type_user'] == 'client':
                # Initialiser les informations client (vides pour le moment)
                Clientadditional.objects.create(user=user)

            
            
            # Générer et envoyer le code de vérification
            user.send_verification_code()
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Inscription réussie! Veuillez vérifier votre email.',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': CustomUserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
            
            #Creation d'un superutilisateur 
            if user_data['type_user'] == 'admin' :
                user = CustomUser.objects.create_superuser(**user_data)
                # Générer les tokens JWT
                refresh = RefreshToken.for_user(user)

                return Response({
                    'message': 'Inscription réussie! Veuillez vérifier votre email.',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': CustomUserSerializer(user).data
                }, status=status.HTTP_201_CREATED)


    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Connexion d'un utilisateur"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = CustomUser.objects.get(email=email)
        
        # Vérifier le mot de passe
        if not user.check_password(password):
            return Response(
                {'error': 'Identifiants incorrects'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Vérifier si l'email a été vérifié
        if not user.is_email_verified:
            return Response(
                {
                    'error': 'Email non vérifié',
                    'message': 'Veuillez vérifier votre email avant de vous connecter.',
                    'need_verification': True,
                    'email': email
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Mettre à jour la dernière connexion
        user.update_last_login()
        
        # Tout est bon, générer les tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Connexion réussie',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)
        
    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'Identifiants incorrects'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def send_verification_code(request):
    """Envoie un code de vérification par e-mail."""
    email = request.data.get('email')
    try:
        user = CustomUser.objects.get(email=email)
        user.send_verification_code()
        return Response(
            {"message": "Code de vérification envoyé à votre adresse email"},
            status=status.HTTP_200_OK
        )
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Aucun compte associé à cette adresse email"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_code(request):
    """Vérifie le code de vérification."""
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response(
            {"error": "Email et code requis"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = CustomUser.objects.get(email=email)
        
        if user.is_email_verified:
            return Response(
                {"message": "Email déjà vérifié"},
                status=status.HTTP_200_OK
            )
        
        if user.verify_email(code):
            # Générer des tokens si la vérification réussit
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Email vérifié avec succès",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": CustomUserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Code incorrect ou expiré"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except CustomUser.DoesNotExist:
        return Response(
            {"error": "Aucun compte associé à cette adresse email"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Récupère le profil de l'utilisateur connecté"""
    user = request.user
    serializer = CustomUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification(request):
    """Renvoie un code de vérification pour l'utilisateur connecté"""
    user = request.user
    if user.is_email_verified:
        return Response(
            {"message": "Votre email est déjà vérifié"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.send_verification_code()
    return Response(
        {"message": "Un nouveau code de vérification a été envoyé"},
        status=status.HTTP_200_OK
    )


class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    """  lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['nom', 'description']
    filterset_fields = ['parent', 'statut']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    @action(detail=True, methods=['get'])
    def produits(self, request, slug=None):
        categorie = self.get_object()
        produits = Produit.objects.filter(categorie=categorie, statut=True)
        page = self.paginate_queryset(produits)
        
        if page is not None:
            serializer = ProduitSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProduitSerializer(produits, many=True)
        return Response(serializer.data)
"""