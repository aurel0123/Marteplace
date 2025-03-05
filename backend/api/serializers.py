from rest_framework import serializers
from .models import CustomUser, Vendeuradditional, Clientadditional

class VendeuradditionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendeuradditional
        fields = ['nom_boutique', 'description_boutique', 'statut_validation', 'commission_percentage', 'solde_actuel']

class ClientadditionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientadditional
        fields = ['adresse_livraison', 'ville', 'code_postal', 'pays']

class CustomUserSerializer(serializers.ModelSerializer):
    vendeur = VendeuradditionalSerializer(read_only=True)
    client = ClientadditionalSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'nom', 'prenom', 'phone', 'type_user', 'is_email_verified', 'date_joined', 'vendeur', 'client']
        read_only_fields = ['id', 'date_joined', 'is_email_verified']