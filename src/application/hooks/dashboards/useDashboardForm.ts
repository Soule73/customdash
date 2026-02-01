import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDashboardFormStore } from '@stores/dashboardFormStore';
import { useAppStore } from '@stores/appStore';
import { dashboardFormService } from '@/core/dashboards';
import type { Widget } from '@type/widget.types';
import { useAppTranslation, useNotifications, useErrorHandler } from '../common';
import { useCreateDashboard, useUpdateDashboard, useDashboard, useWidgets } from '../queries';

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
  const { t } = useAppTranslation();
  const { showSuccess, showError } = useNotifications();
  const { handleApiError } = useErrorHandler();

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
  const setLayoutStyles = useAppStore(s => s.setLayoutStyles);
  const resetLayoutStyles = useAppStore(s => s.resetLayoutStyles);

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
      resetLayoutStyles();
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

      if (dashboard.styles) {
        setLayoutStyles({
          backgroundColor: dashboard.styles.backgroundColor,
          backgroundGradient: dashboard.styles.backgroundGradient,
          padding: dashboard.styles.padding,
        });
      }
    }
  }, [
    dashboard,
    allWidgets,
    isCreateMode,
    initializeForm,
    setEditMode,
    setLayoutStyles,
    resetLayoutStyles,
  ]);

  useEffect(() => {
    return () => {
      isInitializedRef.current = false;
      resetLayoutStyles();
    };
  }, [dashboardId, resetLayoutStyles]);

  const save = useCallback(async () => {
    const validationErrors = dashboardFormService.validateConfig(config, {
      titleRequired: t('dashboards.validation.titleRequired'),
      titleMinLength: t('dashboards.validation.titleMinLength'),
      titleMaxLength: t('dashboards.validation.titleMaxLength'),
      autoRefreshInterval: t('dashboards.validation.autoRefreshInterval'),
    });

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
          styles: payload.styles,
          visibility: payload.visibility,
        });
        showSuccess(t('dashboards.notifications.createSuccess'));
        navigate(`/dashboards/${newDashboard.id}`);
      } else if (dashboardId) {
        await updateMutation.mutateAsync({
          id: dashboardId,
          data: {
            title: payload.title,
            description: payload.description,
            layout: payload.layout,
            styles: payload.styles,
            visibility: payload.visibility,
          },
        });
        showSuccess(t('dashboards.notifications.updateSuccess'));
        markClean();
        setEditMode(false);
      }
    } catch (error) {
      handleApiError(error, 'save');
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
    handleApiError,
    markClean,
    setEditMode,
    t,
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
