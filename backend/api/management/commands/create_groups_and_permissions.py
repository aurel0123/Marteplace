from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Create groups and assign permissions for e-commerce system'
    
    def handle(self, *args, **kwargs):
        groups_permissions = {
            'client': [
                
            ],
            'vendeur': [
                
            ],
            'administrateur': [
                
            ],
            'service_client': [
                
            ],
            'gestionnaire_produit': [
                
            ],
            'gestionnaire_vendeur': [
                
            ],
            'finance': [
                
            ]
        }
        
        # Créer d'abord les permissions personnalisées qui ne sont pas standards
        #self.create_custom_permissions()
        
        # Créer les groupes et assigner les permissions
        for group_name, perms in groups_permissions.items():
            group, created = Group.objects.get_or_create(name=group_name)
            
            # Nettoyer les permissions existantes
            #group.permissions.clear()
            
            for perm_codename in perms:
                try:
                    permission = Permission.objects.get(codename=perm_codename)
                    group.permissions.add(permission)
                    self.stdout.write(self.style.SUCCESS(f"Permission {perm_codename} ajoutée au groupe {group_name}"))
                except Permission.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f"Attention: La permission {perm_codename} n'existe pas"))
            
            self.stdout.write(self.style.SUCCESS(f"Groupe {group_name} mis à jour avec ses permissions."))
    
    """  def create_custom_permissions(self):
        #Crée des permissions personnalisées qui ne sont pas générées automatiquement par Django
        from django.contrib.contenttypes.models import ContentType
        from django.apps import apps
        
        # Définir les permissions personnalisées pour chaque modèle
        custom_permissions = {
            'produit': [
                ('promouvoir_produit', 'Peut promouvoir un produit en page d\'accueil'),
            ],
            'vendeur': [
                ('valider_vendeur', 'Peut valider un compte vendeur'),
                ('view_statistiques_vendeur', 'Peut voir les statistiques vendeur'),
            ],
            'commande': [
                ('traiter_remboursement', 'Peut traiter les demandes de remboursement'),
            ],
        }
        
        # Obtenir le nom de l'application
        app_name = self.get_app_name()
        
        # Créer chaque permission personnalisée
        for model_name, perms in custom_permissions.items():
            try:
                # Obtenir le content type pour le modèle
                content_type = ContentType.objects.get(app_label=app_name, model=model_name)
                
                # Créer les permissions
                for codename, name in perms:
                    permission, created = Permission.objects.get_or_create(
                        codename=codename,
                        name=name,
                        content_type=content_type
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f"Permission personnalisée créée: {codename}"))
            except ContentType.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Le modèle {model_name} n'existe pas"))
    
    def get_app_name(self):
        #Récupère le nom de l'application à partir des settings
        # Remplacez 'ecommerce' par le nom de votre application Django
        return 'ecommerce'
    
    def get_app_label_for_permission(self, perm_codename):
        #Détermine le app_label pour une permission donnée
        # Permissions personnalisées
        custom_permissions = {
            'promouvoir_produit': self.get_app_name(),
            'valider_vendeur': self.get_app_name(),
            'view_statistiques_vendeur': self.get_app_name(),
            'traiter_remboursement': self.get_app_name(),
        }
        
        # Si c'est une permission personnalisée, retourner l'app_label correspondant
        if perm_codename in custom_permissions:
            return custom_permissions[perm_codename]
        
        # Pour les permissions standard, déterminer le app_label en fonction du modèle
        model_name = perm_codename.split('_')[1]  # Ex: view_produit -> produit
        return self.get_app_name() """