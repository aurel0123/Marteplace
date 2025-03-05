import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def test_gmail_smtp():
    # Configuration SMTP pour Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_username = "maximilienkodjogbe4@gmail.com"  # Remplacez par votre adresse Gmail
    smtp_password = "qfyj cfea mscp mwvd"   # Mot de passe d'application
    recipient_email = "kodjogbeaurel4@example.com"  # Remplacez par l'adresse du destinataire
    
    # Création du message
    message = MIMEMultipart()
    message["From"] = smtp_username
    message["To"] = recipient_email
    message["Subject"] = "Test SMTP Gmail"
    
    # Contenu de l'email
    email_content = """
    Ceci est un email de test pour vérifier la configuration SMTP.
    
    Si vous recevez cet email, la configuration fonctionne correctement!
    """
    
    # Attacher le contenu au message
    message.attach(MIMEText(email_content, "plain"))
    
    try:
        # Connexion au serveur SMTP
        print("Connexion au serveur SMTP...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.set_debuglevel(1)  # Activer le mode debug pour voir les détails de la connexion
        
        print("Démarrage TLS...")
        server.starttls()  # Sécuriser la connexion
        
        print("Tentative de connexion avec identifiants...")
        server.login(smtp_username, smtp_password)
        
        print("Envoi de l'email...")
        server.send_message(message)
        
        print("Déconnexion du serveur...")
        server.quit()
        
        print("Email envoyé avec succès!")
        return True
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email: {str(e)}")
        return False

# Exécuter le test
if __name__ == "__main__":
    test_gmail_smtp()