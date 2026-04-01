# 📄 Devis Manager — Frontend

Application web de gestion de devis freelance, construite avec Angular et NgRx.

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

## 📸 Captures d'écran

| Dashboard | Liste Devis | Formulaire Devis |
|---|---|---|
| ![Dashboard]() | ![Devis]() | ![Formulaire]() |

## 👨‍💻 Auteur

**Stéphane Verniere** — [GitHub](https://github.com/PhanDev34000/portfolio)