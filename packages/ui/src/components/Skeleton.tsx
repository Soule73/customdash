interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  className?: string;
  animate?: boolean;
}

const variantClasses = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: '',
  rounded: 'rounded-lg',
};

/**
 * Skeleton loading placeholder component
 */
export function Skeleton({
  width,
  height,
  variant = 'text',
  className = '',
  animate = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${animate ? 'animate-pulse' : ''}
        ${variantClasses[variant]}
        ${className}
      `}
      style={style}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

Skeleton.Text = function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height="0.875rem"
        />
      ))}
    </div>
  );
};

Skeleton.Avatar = function SkeletonAvatar({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
};

Skeleton.Card = function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton.Avatar size={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="40%" height="1rem" className="mb-2" />
          <Skeleton variant="text" width="60%" height="0.75rem" />
        </div>
      </div>
      <Skeleton.Text lines={3} />
    </div>
  );
};
