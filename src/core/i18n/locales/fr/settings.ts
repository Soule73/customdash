export const settings = {
  title: 'Paramètres',
  subtitle: 'Gérez votre compte et vos préférences',
  defaultUser: 'Utilisateur',
  defaultEmail: 'email@exemple.com',
  saved: 'Paramètres enregistrés',
  syncing: 'Synchronisation...',
  sections: {
    profile: {
      name: 'Profil',
      description: 'Gérez vos informations personnelles',
    },
    security: {
      name: 'Sécurité',
      description: 'Mot de passe et authentification',
    },
    notifications: {
      name: 'Notifications',
      description: 'Préférences de notification',
    },
    appearance: {
      name: 'Apparence',
      title: 'Apparence et Thème',
      description: "Thème et personnalisation de l'interface",
      theme: {
        label: 'Thème',
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système',
      },
    },
    language: {
      name: 'Langue',
      title: "Langue de l'interface",
      description: "Choisissez la langue d'affichage",
    },
    formatting: {
      name: 'Formatage',
      title: 'Préférences de formatage',
      description: 'Configuration des formats de nombres, devises et dates',
      locale: {
        label: 'Locale',
        description: 'Format des nombres et dates',
      },
      currency: {
        label: 'Devise',
        description: 'Devise par défaut pour les montants',
      },
      decimals: {
        label: 'Décimales',
        description: 'Nombre de décimales par défaut',
      },
      dateFormat: {
        label: 'Format de date',
        description: "Style d'affichage des dates",
        short: 'Court',
        medium: 'Moyen',
        long: 'Long',
        full: 'Complet',
      },
      nullValue: {
        label: 'Valeur nulle',
        description: 'Représentation des valeurs manquantes',
      },
      includeTime: {
        label: "Inclure l'heure",
        description: "Afficher l'heure dans les dates",
      },
      preview: {
        title: 'Aperçu',
        number: 'Nombre',
        currency: 'Devise',
        date: 'Date',
      },
    },
  },
};
