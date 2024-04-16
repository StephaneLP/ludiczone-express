Après clonage du projet depuis github :

1. Prérequis : existence d'une base de données (mariadb) nommée ludiczone
1. Installer les modules à l'aide de la commande : npm install
2. créer le dossier setting dans lequel seront créés les fichiers :
    - privateKeyLogin.js
        Ce fichier contient la clé privée utilisée pour la création et la vérification des tokens dans les fonctions déstinées à l'authentification.
        -> Ecrire la ligne suivante : module.exports = "*" ( * = chaine de caractères de votre choix)
    - privateKeySignUp.js
        Ce fichier contient la clé privée envoyée par mail pour vérifier l'adresse mail utilisée lors de la création d'un compte utilisateur.
        -> Ecrire la ligne suivante : module.exports = "*" ( * = chaine de caractères de votre choix)
    - privateKeyPassword.js
        Ce fichier contient la clé privée envoyée par mail pour modifier le mot de passe associé au compte utilisateur.
        -> Ecrire la ligne suivante : module.exports = "*" ( * = chaine de caractères de votre choix)
    - senderAddress.js
        Ce fichier contient l'adresse mail et le mot de passe, utilisés pour l'expédition des mails permettant
        de valider la création des comptes et de réinitialiser les mots de passe.
        -> Ecrire la ligne suivante : module.exports = {address: "...", password: "..."}