export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  layout: LayoutItem[];
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
}

export interface CreateDashboardData {
  title: string;
  description?: string;
  layout?: LayoutItem[];
  visibility?: 'private' | 'public' | 'shared';
}

export interface UpdateDashboardData {
  title?: string;
  description?: string;
  layout?: LayoutItem[];
  visibility?: 'private' | 'public' | 'shared';
  sharedWith?: string[];
}
