# 📄 Devis Manager — Frontend

Application web de gestion de devis freelance, construite avec Angular et NgRx.

## 📸 Captures d'écran

| Dashboard | Mon Espace |
|---|---|
| ![Dashboard](https://github.com/user-attachments/assets/506d457a-4b61-4799-a09f-23c7a86d8bea) | ![Mon Espace](https://github.com/user-attachments/assets/bc60cee0-4022-4de3-b7af-3f5b8cd7a4fb) |

| Liste Devis | Formulaire Devis |
|---|---|
| ![Devis](https://github.com/user-attachments/assets/f67b0ff8-e056-4923-82d2-872a37a13d27) | ![Formulaire](https://github.com/user-attachments/assets/07dfa8af-7f4e-4ea9-9e70-f0cf99995e38) |
```

---


## 🚀 Stack technique

- **Angular 19** (standalone components, lazy loading)
- **NgRx** (gestion d'état : store, actions, reducers, effects, selectors)
- **RxJS** (programmation réactive)
- **SCSS** (styles)
- **jsPDF** (export PDF)
- **TypeScript**

## ✨ Fonctionnalités

- 🔐 Authentification JWT (inscription, connexion, déconnexion)
- 👥 Gestion des clients (CRUD complet)
- 📋 Gestion des devis avec lignes dynamiques (FormArray)
- 💶 Calculs HT/TVA/TTC en temps réel
- 📊 Statuts de devis (brouillon, envoyé, accepté, refusé)
- 🏠 Dashboard avec KPI et statistiques
- 👤 Profil utilisateur (infos société + logo)
- 📄 Export PDF professionnel généré côté client (jsPDF)
  - Logo de la société
  - Coordonnées émetteur et client
  - Tableau des prestations avec calculs HT/TVA/TTC
  - Mention légale "Bon pour accord"

## 📁 Structure du projet
```
frontend/src/app/
├── core/
│   ├── guards/            # Auth guard
│   ├── interceptors/      # JWT interceptor
│   └── services/          # Services HTTP
├── features/
│   ├── auth/              # Login, Register, Profil
│   ├── clients/           # Liste + Formulaire clients
│   ├── dashboard/         # Dashboard KPI
│   └── quotes/            # Liste + Formulaire + Détail devis
├── shared/                # Composants réutilisables
└── store/
    ├── auth/              # NgRx Auth
    ├── clients/           # NgRx Clients
    └── quotes/            # NgRx Quotes
```

## 🧠 Architecture NgRx

Chaque feature suit le pattern :
```
Action → Effect → API → Success/Failure Action → Reducer → State → Selector → Component
```

## ⚙️ Installation locale
```bash
# Cloner le repo
git clone https://github.com/PhanDev34000/devis-manager-frontend.git
cd devis-manager-frontend

# Installer les dépendances
npm install

# Lancer en développement
ng serve
```

## 🔧 Configuration

**Développement** — dans `src/environments/environment.ts` :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**Production** — dans `src/environments/environment.ts` :
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://devis-manager-backend.onrender.com/api'
};
```

## 🌐 Déploiement

L'application est déployée sur **Vercel** :
- URL : `https://devis-manager-frontend.vercel.app`

## 👨‍💻 Auteur

**Stéphane Verniere** — [GitHub](https://github.com/PhanDev34000/portfolio)
