interface ParamGroupProps {
  title: string;
  children: React.ReactNode;
}

/**
 * ParamGroup component for grouping related parameters
 */
export function ParamGroup({ title, children }: ParamGroupProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
