export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  layout: LayoutItem[];
  visibility: 'private' | 'public' | 'shared';
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LayoutItem {
  widgetId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface CreateDashboardData {
  name: string;
  description?: string;
  visibility?: 'private' | 'public' | 'shared';
}

export interface UpdateDashboardData {
  name?: string;
  description?: string;
  layout?: LayoutItem[];
  visibility?: 'private' | 'public' | 'shared';
  sharedWith?: string[];
}
