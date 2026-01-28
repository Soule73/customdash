export interface DashboardStyles {
  backgroundColor?: string;
  backgroundGradient?: string;
  padding?: string;
  gap?: string;
  titleFontSize?: string;
  titleColor?: string;
}

export interface LayoutItemStyles {
  backgroundColor?: string;
  backgroundGradient?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
  padding?: string;
  textColor?: string;
  labelColor?: string;
  gridColor?: string;
}

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  layout: LayoutItem[];
  styles?: DashboardStyles;
  visibility: 'private' | 'public' | 'shared';
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LayoutItem {
  i: string;
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  styles?: LayoutItemStyles;
}

export interface CreateDashboardData {
  title: string;
  description?: string;
  layout?: LayoutItem[];
  styles?: DashboardStyles;
  visibility?: 'private' | 'public' | 'shared';
}

export interface UpdateDashboardData {
  title?: string;
  description?: string;
  layout?: LayoutItem[];
  styles?: DashboardStyles;
  visibility?: 'private' | 'public' | 'shared';
  sharedWith?: string[];
}
