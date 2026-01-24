import { UserCircleIcon, KeyIcon, BellIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { Card, Avatar } from '@customdash/ui';
import { useAuthStore } from '@stores/authStore';

const settingsSections = [
  {
    id: 'profile',
    name: 'Profil',
    description: 'Gerez vos informations personnelles',
    icon: UserCircleIcon,
  },
  {
    id: 'security',
    name: 'Securite',
    description: 'Mot de passe et authentification',
    icon: KeyIcon,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Preferences de notification',
    icon: BellIcon,
  },
  {
    id: 'appearance',
    name: 'Apparence',
    description: 'Theme et personnalisation',
    icon: PaintBrushIcon,
  },
];

export function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Parametres</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gerez votre compte et vos preferences
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <Avatar size="xl" name={user?.username || 'Utilisateur'} />
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {user?.username || 'Utilisateur'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || 'email@exemple.com'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {settingsSections.map(section => (
          <Card
            key={section.id}
            className="cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <section.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{section.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
