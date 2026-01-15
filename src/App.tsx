import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-600">CustomDash</h1>
        <p className="mt-4 text-gray-600">Plateforme de tableaux de bord personnalisables</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/login"
            className="rounded-lg p-8 bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="rounded-lg border border-blue-600 px-6 py-2 text-blue-600 hover:bg-blue-50"
          >
            Inscription
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
        <p className="text-gray-500 text-center">Page en construction</p>
      </div>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
        <p className="text-gray-500 text-center">Page en construction</p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page non trouvee</p>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Retour a l'accueil
      </Link>
    </div>
  );
}

export default App;
