import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button, Input, Alert } from '@customdash/ui';
import { useLogin } from '@hooks/index';
import { Logo } from '@components/common';
import { useAppTranslation } from '@hooks/useAppTranslation';

export function LoginPage() {
  const { t } = useAppTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const loginSchema = z.object({
    email: z.string().min(1, t('auth.emailRequired')).email(t('auth.emailInvalid')),
    password: z.string().min(1, t('auth.passwordRequired')).min(6, t('auth.passwordMinLength')),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        navigate('/dashboards');
      },
    });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" showText={false} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('auth.loginSubtitle')}</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error instanceof Error ? error.message : t('auth.genericError')}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t('auth.email')}
          type="email"
          placeholder="vous@exemple.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="********"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('auth.rememberMe')}</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" isLoading={isPending} className="w-full">
          {t('auth.login')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {t('auth.noAccount')}{' '}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {t('auth.createAccount')}
        </Link>
      </p>
    </div>
  );
}
