from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.utils import timezone
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
import random
from django.core.mail import send_mail
from django.conf import settings
import resend
from .managers import CustomUserManager
from django.db import transaction
from datetime import timedelta
import os
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class LowercaseEmailField(models.EmailField):
    """
    Override EmailField to convert emails to lowercase before saving.
    """
    def to_python(self, value):
        """
        Convert email to lowercase.
        """
        value = super(LowercaseEmailField, self).to_python(value)
        # Value can be None so check that it's a string before lowercasing.
        if isinstance(value, str):
            return value.lower()
        return value

class CustomUser(AbstractBaseUser, PermissionsMixin):
    # Réduire la longueur des champs indexés à 191 caractères max
    email = LowercaseEmailField( _("Email addresse"),unique=True, max_length=191)
    nom = models.CharField(max_length=150, null=True)
    prenom = models.CharField(max_length=150, null=True)
    username = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_email_verified = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    derniere_connexion = models.DateTimeField(null=True, blank=True)
    phone_regex = RegexValidator(
        regex=r'^\d{10}$',
        message="phone number should exactly be in 10 digits"
    )
    phone = models.CharField(max_length=150, validators=[phone_regex], blank=True, null=True)

    class Types(models.TextChoices):
        ADMIN = 'admin', 'Administrateur'
        CLIENT = 'client', 'Client'
        VENDEUR = 'vendeur', 'Vendeur'

    default_type = Types.CLIENT
    # Réduire la longueur du champ
    type_user = models.CharField(_("Type d'utilisateur"), max_length=50, choices=Types.choices, default=default_type)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['']

    objects = CustomUserManager()
    def send_verification_code(self):
        """Génère et envoie un code de vérification."""
        if not hasattr(self, 'email_verification'):
            EmailVerification.objects.create(user=self)
        self.email_verification.generate_code()
        self.email_verification.send_verification_email()

    def verify_email(self, code):
        """Vérifie si le code est correct."""
        if hasattr(self, 'email_verification') and self.email_verification.code == code:
            self.is_email_verified = True
            self.save()
            self.email_verification.delete()  # Supprime le code après vérification
            return True
        return False

    def __str__(self):
        return f"Informations de l'utilisateur {self.nom} {self.prenom} {self.email}"

    def update_last_login(self):
        """Met à jour la date de dernière connexion"""
        self.derniere_connexion = timezone.now()
        self.save(update_fields=['derniere_connexion'])

    def save(self, *args, **kwargs):
        is_new = not self.id
        # Sauvegarde initiale pour obtenir un ID
        super().save(*args, **kwargs)
        
        # Gestion des groupes en fonction de user_type
        if self.type_user == CustomUser.Types.VENDEUR:
            group_name = 'vendeur'
        elif self.type_user == CustomUser.Types.CLIENT:
            group_name = 'client'
        else:
            group_name = 'administrateur'
        
        # Récupérer ou créer le groupe correspondant
        group, created = Group.objects.get_or_create(name=group_name)
        
        # Ajouter l'instance au groupe si elle n'y est pas déjà
        if not self.groups.filter(name=group.name).exists():
            self.groups.add(group)
        super().save(*args, **kwargs)

class Clientadditional(models.Model):
    """
    Modèle pour les informations additionnelles des clients
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='client')
    adresse_livraison = models.TextField(null=True, blank=True)
    ville = models.CharField(max_length=100, null=True, blank=True)
    code_postal = models.CharField(max_length=20, null=True, blank=True)
    pays = models.CharField(max_length=100, null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Client"
        verbose_name_plural = "Clients"
    
    def __str__(self):
        return f"Client: {self.user.nom} {self.user.prenom}"


class Vendeuradditional(models.Model):
    """
    Modèle pour les vendeurs de la plateforme, extension des utilisateurs
    """
    STATUS_CHOICES = (
        ('en_attente', 'En attente'),
        ('valide', 'Validé'),
        ('refuse', 'Refusé'),
    )
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vendeur')
    nom_boutique = models.CharField(max_length=100, unique=True)
    description_boutique = models.TextField(null=True, blank=True)
    logo_boutique = models.ImageField(upload_to='media/logos/', null=True, blank=True)
    statut_validation = models.CharField(max_length=15, choices=STATUS_CHOICES, default='en_attente')
    date_validation = models.DateTimeField(null=True, blank=True)
    numero_rci = models.CharField(max_length=50, null=True, blank=True)  # Registre du Commerce
    certificat_activite = models.FileField(upload_to='media/documents/', null=True, blank=True)
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)  # 5% par défaut
    solde_actuel = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Vendeur"
        verbose_name_plural = "Vendeurs"
    
    def __str__(self):
        return self.nom_boutique
    
    def save(self, *args, **kwargs):
        # Si le vendeur est validé, enregistrer la date de validation
        if self.statut_validation == 'valide' and not self.date_validation:
            self.date_validation = timezone.now()
        super().save(*args, **kwargs)


class VendeurManager(models.Manager) : 
  def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(type_user = CustomUser.Types.VENDEUR)

class ClientManager(models.Manager) : 
  def get_queryset (self , *args, **kwargs) : 
    return super().get_queryset(*args , **kwargs).filter(type_user = CustomUser.Types.CLIENT)

#Definition des proxy
class Vendeur(CustomUser):
    objects = VendeurManager()
    
    class Meta:
        proxy = True
    
    def __str__(self):
        return f"Vendeur: {self.nom} {self.prenom}"
    
    @property
    def additional_info(self):
        return self.vendeur

class Client(CustomUser):
    objects = ClientManager()
    
    class Meta:
        proxy = True
    
    def __str__(self):
        return f"Client: {self.nom} {self.prenom}"  


class EmailVerification(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='email_verification')
    code = models.CharField(max_length=6, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def generate_code(self):
        """Génère un code à 6 chiffres et définit sa date d'expiration"""
        self.code = str(random.randint(100000, 999999))
        self.expires_at = timezone.now() + timedelta(minutes=30)  # Code valide pendant 24h
        self.save()
        return self.code
    
    def is_valid(self):
        """Vérifie si le code est toujours valide (non expiré)"""
        return self.expires_at > timezone.now() if self.expires_at else False
    
    def send_verification_email(self):
        
        
        
        # Configuration SMTP pour Gmail
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        smtp_username = settings.EMAIL_HOST_USER  # Votre adresse Gmail
        smtp_password = settings.EMAIL_HOST_PASSWORD  # Votre mot de passe ou mot de passe d'application
        
        # Création du message
        message = MIMEMultipart()
        message["From"] = smtp_username
        message["To"] = self.user.email
        message["Subject"] = "Vérification de votre email"
        
        # Contenu de l'email
        email_content = f"""
        Bonjour {self.user.prenom} {self.user.nom},
        
        Merci de vous être inscrit. Pour valider votre compte, veuillez utiliser le code de vérification suivant :
        
        {self.code}
        
        Ce code est valable pendant 30 minutes.
        
        Cordialement,
        L'équipe du site
        """
        
        # Attacher le contenu au message
        message.attach(MIMEText(email_content, "plain"))
        
        try:
            # Connexion au serveur SMTP
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()  # Sécuriser la connexion
            server.login(smtp_username, smtp_password)
            
            # Envoi de l'email
            server.send_message(message)
            server.quit()
            
            return True
        except Exception as e:
            # Gestion des erreurs
            print(f"Erreur lors de l'envoi de l'email: {str(e)}")
            return False

class Categorie(models.Model):
    """
    Modèle pour les catégories de produits, avec possibilité de sous-catégories
    """
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='sous_categories')
    nom = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='media/categories', null=True, blank=True)
    ordre_affichage = models.IntegerField(default=0)
    statut = models.BooleanField(default=True)  # Actif ou Inactif
    slug = models.SlugField(max_length=120, unique=True)
    
    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['ordre_affichage', 'nom']
    
    def __str__(self):
        return self.nom
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('categorie_detail', kwargs={'slug': self.slug})


class AttributProduit(models.Model):
    """
    Modèle pour les attributs de produits (couleur, taille, etc.)
    """
    TYPE_CHOICES = (
        ('texte', 'Texte'),
        ('nombre', 'Nombre'),
        ('selection', 'Sélection'),
    )
    
    nom = models.CharField(max_length=50)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='texte')
    est_filtrable = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Attribut produit"
        verbose_name_plural = "Attributs produits"
    
    def __str__(self):
        return self.nom


class Produit(models.Model):
    """
    Modèle pour les produits du site e-commerce
    """
    vendeur = models.ForeignKey(Vendeur, on_delete=models.CASCADE, related_name='produits')
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name='produits')
    nom = models.CharField(max_length=200)
    description_courte = models.CharField(max_length=255, null=True, blank=True)
    description_complete = models.TextField()
    prix_original = models.DecimalField(max_digits=10, decimal_places=2)
    prix_promo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    quantite_stock = models.IntegerField(default=0)
    statut = models.BooleanField(default=True)  # Actif ou Inactif
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)
    poids = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)  # en kg
    dimensions = models.CharField(max_length=50, null=True, blank=True)  # format: LxlxH
    featured = models.BooleanField(default=False)  # Mis en avant
    meta_title = models.CharField(max_length=150, null=True, blank=True)  # SEO
    meta_description = models.TextField(null=True, blank=True)  # SEO
    slug = models.SlugField(max_length=250, unique=True)
    
    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ['-date_creation']
    
    def __str__(self):
        return self.nom
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
            # Vérification de l'unicité du slug
            original_slug = self.slug
            counter = 1
            while Produit.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('produit_detail', kwargs={'slug': self.slug})
    
    @property
    def prix_actuel(self):
        return self.prix_promo if self.prix_promo else self.prix_original
    
    @property
    def pourcentage_reduction(self):
        if self.prix_promo:
            return round((1 - self.prix_promo / self.prix_original) * 100)
        return 0
    
    @property
    def est_en_stock(self):
        return self.quantite_stock > 0


class ValeurAttributProduit(models.Model):
    """
    Modèle pour les valeurs des attributs de produits
    """
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='attributs')
    attribut = models.ForeignKey(AttributProduit, on_delete=models.CASCADE)
    valeur = models.CharField(max_length=100)
    
    class Meta:
        verbose_name = "Valeur d'attribut"
        verbose_name_plural = "Valeurs d'attributs"
        unique_together = ('produit', 'attribut')
    
    def __str__(self):
        return f"{self.attribut.nom}: {self.valeur}"


class ImageProduit(models.Model):
    """
    Modèle pour les images des produits
    """
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name='images')
    url_image = models.ImageField(upload_to='images/products')
    ordre_affichage = models.IntegerField(default=0)
    est_principale = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Image produit"
        verbose_name_plural = "Images produits"
        ordering = ['ordre_affichage']
    
    def __str__(self):
        return f"Image de {self.produit.nom} ({self.id})"
    
    def save(self, *args, **kwargs):
        # Si cette image est principale, s'assurer que les autres ne le sont pas
        if self.est_principale:
            ImageProduit.objects.filter(produit=self.produit).update(est_principale=False)
        super().save(*args, **kwargs)


