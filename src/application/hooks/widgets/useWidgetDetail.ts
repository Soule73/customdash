import { useCallback, useState } from 'react';

interface UseWidgetDetailReturn {
  isDetailOpen: boolean;
  openDetail: () => void;
  closeDetail: () => void;
}

/**
 * Manages the open/close state of the widget detail modal.
 * The modal displays the full raw dataset of a widget in a DataGrid.
 */
export function useWidgetDetail(): UseWidgetDetailReturn {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openDetail = useCallback(() => setIsDetailOpen(true), []);
  const closeDetail = useCallback(() => setIsDetailOpen(false), []);

  return { isDetailOpen, openDetail, closeDetail };
}
