# Reyes — professeur d'espagnol

Petit site de chat inspiré des interfaces d'assistant IA, avec un backend Vercel qui garde la clé API côté serveur.

## Déploiement simple (GitHub + Vercel)

1. Téléverse les fichiers et le dossier `api` dans un nouveau dépôt GitHub. Garde le nom `index.html` et le dossier `api` à la racine.
2. Connecte-toi à Vercel et choisis **Add New → Project**, puis importe ce dépôt GitHub.
3. Dans la configuration du projet Vercel, ajoute une variable d'environnement :
   - **Name** : `OPENAI_API_KEY`
   - **Value** : ta clé API OpenAI
   Coche Production (et Preview si tu veux tester les previews). Ne mets jamais la clé dans `index.html`, dans GitHub, ni dans un nom commençant par `NEXT_PUBLIC_`.
4. Facultatif : ajoute `OPENAI_MODEL` avec un modèle disponible sur ton compte. Sinon le site utilise `gpt-5-mini` par défaut.
5. Clique sur **Deploy**. Après toute modification de variable, redéploie le projet.
6. Ouvre l'URL fournie par Vercel et envoie un message pour tester Reyes.

## Fonctionnalités

- Chat avec historique local dans le navigateur
- Mode traducteur, QCM et cartes mémoire
- Interface responsive téléphone/ordinateur
- API côté serveur, clé secrète non exposée au navigateur

## À savoir

- L'hébergement peut avoir une offre gratuite, mais les appels à l'API OpenAI peuvent être facturés séparément. Vérifie la facturation et les limites de ton compte API.
- L'historique est enregistré uniquement dans le navigateur utilisé. Il n'y a pas encore de compte utilisateur ni de synchronisation entre appareils.
- Cette version ne limite pas les dépenses API par utilisateur. Avant de rendre le site public, configure des limites de dépenses côté fournisseur et ajoute une authentification ou une protection contre l'abus.
- Le modèle configuré doit être disponible pour le compte API.
