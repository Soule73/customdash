interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={config.icon}
        height={config.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="logoAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#logoGradient)" />
        <path
          d="M14 32V20C14 18.8954 14.8954 18 16 18H18C19.1046 18 20 18.8954 20 20V32C20 33.1046 19.1046 34 18 34H16C14.8954 34 14 33.1046 14 32Z"
          fill="white"
          fillOpacity="0.9"
        />
        <path
          d="M22 32V16C22 14.8954 22.8954 14 24 14H26C27.1046 14 28 14.8954 28 16V32C28 33.1046 27.1046 34 26 34H24C22.8954 34 22 33.1046 22 32Z"
          fill="white"
        />
        <path
          d="M30 32V24C30 22.8954 30.8954 22 32 22H34C35.1046 22 36 22.8954 36 24V32C36 33.1046 35.1046 34 34 34H32C30.8954 34 30 33.1046 30 32Z"
          fill="white"
          fillOpacity="0.7"
        />
        <circle cx="38" cy="12" r="4" fill="url(#logoAccent)" />
      </svg>
      {showText && (
        <span className={`font-semibold tracking-tight ${config.text}`}>
          <span className="text-foreground">Custom</span>
          <span className="gradient-text">Dash</span>
        </span>
      )}
    </div>
  );
}
