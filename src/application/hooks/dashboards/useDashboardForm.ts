import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useDashboard, useCreateDashboard, useUpdateDashboard } from '@hooks/dashboard.queries';
import { useWidgets } from '@hooks/widget.queries';
import { dashboardFormService } from '@/core/dashboards';
import { useNotifications } from '../useNotifications';
import type { Widget } from '@type/widget.types';

interface UseDashboardFormOptions {
  dashboardId?: string;
}

interface UseDashboardFormReturn {
  isLoading: boolean;
  isSaving: boolean;
  isCreateMode: boolean;
  editMode: boolean;
  isDirty: boolean;
  title: string;
  description: string;
  errors: Record<string, string>;
  save: () => Promise<void>;
  cancel: () => void;
  toggleEditMode: () => void;
}

export function useDashboardForm(options: UseDashboardFormOptions = {}): UseDashboardFormReturn {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();

  const dashboardId = options.dashboardId || params.id;
  const isCreateMode = location.pathname.includes('/dashboards/create');

  const config = useDashboardFormStore(s => s.config);
  const editMode = useDashboardFormStore(s => s.editMode);
  const isDirty = useDashboardFormStore(s => s.isDirty);
  const errors = useDashboardFormStore(s => s.errors);
  const initializeForm = useDashboardFormStore(s => s.initializeForm);
  const setEditMode = useDashboardFormStore(s => s.setEditMode);
  const markClean = useDashboardFormStore(s => s.markClean);

  const createMutation = useCreateDashboard();
  const updateMutation = useUpdateDashboard();

  const { data: dashboard, isLoading: isDashboardLoading } = useDashboard(
    isCreateMode ? '' : dashboardId || '',
  );
  const { data: allWidgets } = useWidgets();

  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isCreateMode && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeForm({ isCreateMode: true });
      setEditMode(true);
      return;
    }

    if (!isCreateMode && dashboard && allWidgets && !isInitializedRef.current) {
      isInitializedRef.current = true;
      const dashboardWidgetIds = new Set(dashboard.layout?.map(item => item.widgetId) || []);
      const widgets = allWidgets.filter((w: Widget) => dashboardWidgetIds.has(w.widgetId));

      initializeForm({
        dashboard,
        widgets,
        isCreateMode: false,
      });
    }
  }, [dashboard, allWidgets, isCreateMode, initializeForm, setEditMode]);

  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
    };
  }, [dashboardId]);

  const save = useCallback(async () => {
    const validationErrors = dashboardFormService.validateConfig(config);

    if (Object.keys(validationErrors).length > 0) {
      showError(Object.values(validationErrors)[0]);
      return;
    }

    const payload = dashboardFormService.buildSavePayload(config);

    try {
      if (isCreateMode) {
        const newDashboard = await createMutation.mutateAsync({
          title: payload.title,
          description: payload.description,
          layout: payload.layout,
          visibility: payload.visibility,
        });
        showSuccess('Tableau de bord cree avec succes');
        navigate(`/dashboards/${newDashboard.id}`);
      } else if (dashboardId) {
        await updateMutation.mutateAsync({
          id: dashboardId,
          data: {
            title: payload.title,
            description: payload.description,
            layout: payload.layout,
            visibility: payload.visibility,
          },
        });
        showSuccess('Tableau de bord mis a jour');
        markClean();
        setEditMode(false);
      }
    } catch {
      showError('Erreur lors de la sauvegarde');
    }
  }, [
    config,
    isCreateMode,
    dashboardId,
    createMutation,
    updateMutation,
    navigate,
    showSuccess,
    showError,
    markClean,
    setEditMode,
  ]);

  const cancel = useCallback(() => {
    if (isCreateMode) {
      navigate('/dashboards');
    } else if (dashboard) {
      isInitializedRef.current = false;
      initializeForm({ dashboard, isCreateMode: false });
      setEditMode(false);
    }
  }, [isCreateMode, dashboard, navigate, initializeForm, setEditMode]);

  const toggleEditMode = useCallback(() => {
    setEditMode(!editMode);
  }, [setEditMode, editMode]);

  return {
    isLoading: isDashboardLoading,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isCreateMode,
    editMode,
    isDirty,
    title: config.title,
    description: config.description,
    errors,
    save,
    cancel,
    toggleEditMode,
  };
}
