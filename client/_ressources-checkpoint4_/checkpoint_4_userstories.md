# 🚇 Commute Calc - Backlog des User Stories

## 📱 Stack Technique
- Frontend : React, TypeScript, Vite
- Backend : Express, Node.js
- Base de données : MySQL
- Authentification : JWT
- Gestion d'état et des formulaires : React Context
- Intégration API : Endpoints REST
- Tests : Jest, Supertest

## 🎯 Légende :
- ✅ Implémenté
- 🚧 En cours
- 📝 Planifié
- ❌ Bloqué

## 🔐 Thématique : Authentification Utilisateur
1. **Inscription Utilisateur** ✅
   - En tant que nouvel utilisateur
   - Je veux créer un compte
   - Afin d'accéder au calculateur de trajets
   - *Critères d'acceptation :*
     - Validation d'email
     - Sécurité du mot de passe
     - Vérification d'unicité du nom d'utilisateur
     - Redirection réussie vers le tableau de bord

2. **Connexion Utilisateur** ✅
   - En tant qu'utilisateur enregistré
   - Je veux me connecter à mon compte
   - Afin d'accéder à mes données de trajet
   - *Critères d'acceptation :*
     - Génération sécurisée du token
     - Persistance de session
     - Gestion des erreurs d'identification

## 📍 Thématique : Gestion des Transports
3. **Visualisation des Arrêts** ✅
   - En tant qu'utilisateur connecté
   - Je veux voir les arrêts disponibles
   - Afin de planifier mon trajet
   - *Critères d'acceptation :*
     - Affichage de la liste des arrêts
     - Affichage des coordonnées
     - Gestion des états de chargement
     - Gestion des erreurs

4. **Sélection d'Itinéraire** ✅
   - En tant que voyageur
   - Je veux sélectionner les points de départ et d'arrivée
   - Afin de calculer mon trajet
   - *Critères d'acceptation :*
     - Validation des points différents
     - Sélection claire des emplacements
     - Mises à jour dynamiques

## ⏱ Thématique : Calculs des Trajets
5. **Calcul du Temps de Trajet** ✅
   - En tant que voyageur
   - Je veux calculer la durée du trajet
   - Afin de planifier mon emploi du temps
   - *Implémentation :*
     - Calcul des distances
     - Estimation du temps
     - Gestion des erreurs

6. **Planification des Horaires** ✅
   - En tant qu'utilisateur
   - Je veux définir les heures de départ
   - Afin d'organiser ma journée
   - *Fonctionnalités :*
     - Sélecteur de date
     - Sélection d'heure
     - Règles de validation

## 📊 Thématique : Statistiques et Analyses
7. **Visualisation des Statistiques Personnelles** ✅
   - En tant qu'utilisateur régulier
   - Je veux voir mes statistiques de trajet
   - Afin de suivre mes habitudes de déplacement
   - *Métriques :*
     - Durée quotidienne
     - Agrégation hebdomadaire
     - Synthèses mensuelles
     - Totaux annuels

8. **Analyse des Itinéraires** ✅
   - En tant que voyageur
   - Je veux analyser mes itinéraires fréquents
   - Afin d'optimiser mes déplacements
   - *Fonctionnalités :*
     - Routes les plus fréquentes
     - Durées moyennes
     - Nombre total de trajets

## 🎨 Thématique : Interface Utilisateur
9. **Design Responsive** ✅
   - En tant qu'utilisateur mobile
   - Je veux accéder à l'application sur tous les appareils
   - Afin de vérifier mes trajets en déplacement
   - *Implémentation :*
     - Design mobile-first
     - Mises en page flexibles
     - Contrôles tactiles

## 🔒 Thématique : Sécurité des Données
10. **Authentification Sécurisée** ✅
    - En tant qu'utilisateur
    - Je veux que mes données soient sécurisées
    - Afin de protéger mes informations
    - *Implémentation :*
      - Implémentation JWT
      - Hachage des mots de passe
      - Routes protégées
      - Gestion des sessions