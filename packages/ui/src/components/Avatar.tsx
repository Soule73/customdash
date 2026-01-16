import type { ImgHTMLAttributes } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: AvatarSize;
  name?: string;
  status?: AvatarStatus;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
};

const statusSizeClasses: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5',
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
};

const statusColors: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Avatar component for displaying user profile images or initials
 */
export function Avatar({
  size = 'md',
  name,
  status,
  src,
  alt,
  className = '',
  ...props
}: AvatarProps) {
  const showFallback = !src;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {showFallback ? (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium ${sizeClasses[size]}`}
        >
          {name ? getInitials(name) : '?'}
        </div>
      ) : (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={`rounded-full object-cover ${sizeClasses[size]}`}
          {...props}
        />
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900 ${statusSizeClasses[size]} ${statusColors[status]}`}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
}

Avatar.Group = function AvatarGroup({ children, max = 4, size = 'md' }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleChildren}
      {remainingCount > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium ring-2 ring-white dark:ring-gray-900 ${sizeClasses[size]}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
