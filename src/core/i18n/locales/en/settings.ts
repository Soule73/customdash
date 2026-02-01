export const settings = {
  title: 'Settings',
  subtitle: 'Manage your account and preferences',
  defaultUser: 'User',
  defaultEmail: 'email@example.com',
  saved: 'Settings saved',
  sections: {
    profile: {
      name: 'Profile',
      description: 'Manage your personal information',
    },
    security: {
      name: 'Security',
      description: 'Password and authentication',
    },
    notifications: {
      name: 'Notifications',
      description: 'Notification preferences',
    },
    appearance: {
      name: 'Appearance',
      title: 'Appearance & Theme',
      description: 'Theme and interface customization',
      theme: {
        label: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
    },
    language: {
      name: 'Language',
      title: 'Interface Language',
      description: 'Choose the display language',
    },
    formatting: {
      name: 'Formatting',
      title: 'Formatting Preferences',
      description: 'Configure number, currency and date formats',
      locale: {
        label: 'Locale',
        description: 'Number and date format',
      },
      currency: {
        label: 'Currency',
        description: 'Default currency for amounts',
      },
      decimals: {
        label: 'Decimals',
        description: 'Default number of decimals',
      },
      dateFormat: {
        label: 'Date Format',
        description: 'Date display style',
        short: 'Short',
        medium: 'Medium',
        long: 'Long',
        full: 'Full',
      },
      nullValue: {
        label: 'Null Value',
        description: 'Representation of missing values',
      },
      includeTime: {
        label: 'Include Time',
        description: 'Show time in dates',
      },
      preview: {
        title: 'Preview',
        number: 'Number',
        currency: 'Currency',
        date: 'Date',
      },
    },
  },
};
