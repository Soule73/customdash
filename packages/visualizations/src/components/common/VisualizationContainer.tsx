import type { JSX, ReactNode, CSSProperties } from 'react';

export interface VisualizationContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Universal container component for all visualizations.
 * Ensures proper sizing (100% width/height) and adapts to parent container.
 * Used by dashboard grid items and widget form preview.
 */
export function VisualizationContainer({
  children,
  className = '',
  style,
}: VisualizationContainerProps): JSX.Element {
  return (
    <div
      className={`visualization-container w-full h-full min-w-0 min-h-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default VisualizationContainer;
