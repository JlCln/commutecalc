# 🚇 Commute Calc - Backlog des User Stories

## 📱 Stack Technique
- Frontend : React, TypeScript, Vite
- Backend : Express, Node.js
- Base de données : MySQL
- Authentification : JWT
- Gestion d'état : React Context
- Intégration API : Endpoints REST
- UI/UX : Framer Motion

## 🎯 Légende :
✅ Implémenté

## 🔐 Thématique : Authentification Utilisateur
1. **Inscription Utilisateur** ✅
   - En tant que nouvel utilisateur
   - Je veux créer un compte
   - Afin d'accéder au calculateur de trajets
   - *Méthode d'implémentation :*
     - Utilisation de bcrypt pour le hachage des mots de passe
     - Validation côté client avec regex pour email et password
     - Stockage sécurisé dans MySQL avec contraintes d'unicité

2. **Connexion Utilisateur** ✅
   - En tant qu'utilisateur enregistré
   - Je veux me connecter à mon compte
   - Afin d'accéder à mes données de trajet
   - *Méthode d'implémentation :*
     - JWT pour l'authentification avec localStorage
     - Context API pour la gestion globale de l'état utilisateur
     - Système de refresh token automatique

## 📍 Thématique : Gestion des Transports
3. **Visualisation des Arrêts** ✅
   - En tant qu'utilisateur connecté
   - Je veux voir les arrêts disponibles
   - Afin de planifier mon trajet
   - *Méthode d'implémentation :*
     - Chargement asynchrone des arrêts depuis l'API
     - Custom Hook useTransportStops pour la gestion d'état
     - Composants réutilisables avec TypeScript

4. **Sélection d'Itinéraire** ✅
   - En tant que voyageur
   - Je veux sélectionner les points de départ et d'arrivée
   - Afin de calculer mon trajet
   - *Méthode d'implémentation :*
     - Système de formulaire contrôlé avec validation
     - Algorithme de calcul de distance avec formule haversine
     - Gestion d'erreurs avec feedback utilisateur

## ⏱ Thématique : Calculs des Trajets
5. **Calcul du Temps de Trajet** ✅
   - En tant que voyageur
   - Je veux calculer la durée du trajet
   - Afin de planifier mon emploi du temps
   - *Méthode d'implémentation :*
     - Algorithme personnalisé basé sur les coordonnées GPS
     - Stockage des résultats dans la base de données
     - Format de durée adaptatif (jours, heures, minutes)

6. **Planification des Horaires** ✅
   - En tant qu'utilisateur
   - Je veux définir les heures de départ
   - Afin d'organiser ma journée
   - *Méthode d'implémentation :*
     - Input de type datetime-local avec validation
     - Stockage UTC des horaires en base
     - Formatage localisé avec Intl.DateTimeFormat

## 📊 Thématique : Statistiques et Analyses
7. **Visualisation des Statistiques** ✅
   - En tant qu'utilisateur régulier
   - Je veux voir mes statistiques de trajet
   - Afin de suivre mes habitudes
   - *Méthode d'implémentation :*
     - Requêtes SQL optimisées pour les agrégations
     - Context dédié pour la gestion des stats
     - Animations Framer Motion pour l'affichage

8. **Gestion de Profil** ✅
   - En tant qu'utilisateur
   - Je veux personnaliser mon profil
   - Afin de le rendre unique
   - *Méthode d'implémentation :*
     - Upload d'avatar avec Multer
     - Stockage des images sur le serveur
     - Mise à jour réactive du profil avec Context

## 🎨 Thématique : Interface Utilisateur
9. **Design Responsive** ✅
   - En tant qu'utilisateur mobile
   - Je veux une interface adaptative
   - Afin d'utiliser l'app partout
   - *Méthode d'implémentation :*
     - CSS Grid et Flexbox pour la mise en page
     - Media queries pour les breakpoints
     - Composants adaptés au tactile

## 🔄 Thématique : Fonctionnalités Avancées
10. **Partage de Trajets** ✅
    - En tant qu'utilisateur
    - Je veux partager mes trajets
    - Afin d'informer mes contacts
    - *Méthode d'implémentation :*
      - Clipboard API pour copier les détails
      - Format de message personnalisé avec emojis
      - Feedback utilisateur pour confirmation