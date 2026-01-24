import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { Button } from '@customdash/ui';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Erreur 404
        </p>
        <h1 className="mt-2 text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Page introuvable
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Desole, la page que vous recherchez n'existe pas.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="secondary" leftIcon={<HomeIcon className="h-4 w-4" />}>
              Retour a l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
