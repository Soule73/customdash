import { useState, useCallback, useRef } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Modal, Button, Input } from '@customdash/ui';
import { useUploadCsv } from '@hooks/index';
import { useAppTranslation } from '@hooks/useAppTranslation';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CsvUploadModal({ isOpen, onClose, onSuccess }: CsvUploadModalProps) {
  const { t } = useAppTranslation();
  const uploadCsv = useUploadCsv();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFile(null);
    setName('');
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      setError(null);
      const validTypes = ['text/csv', 'application/vnd.ms-excel'];
      const isValidType =
        validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv');

      if (!isValidType) {
        setError(t('datasources.upload.invalidType'));
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError(t('datasources.upload.fileTooLarge'));
        return;
      }

      setFile(selectedFile);
      setName(prev => prev || selectedFile.name.replace(/\.csv$/i, ''));
    },
    [t],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles[0]);
      }
    },
    [handleFileSelect],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError(t('datasources.upload.selectFile'));
      return;
    }

    try {
      await uploadCsv.mutateAsync({ file, name: name.trim() || undefined });
      handleClose();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('datasources.upload.uploadError'));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('datasources.upload.title')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/vnd.ms-excel"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="space-y-3">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                  {t('datasources.upload.dropHere')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('datasources.upload.orClickToBrowse')}
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('datasources.upload.csvOnly')}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <DocumentIcon className="h-8 w-8 text-green-500" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <Input
          label={t('datasources.upload.sourceName')}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t('datasources.upload.sourceNamePlaceholder')}
          helperText={t('datasources.upload.sourceNameHelp')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            isLoading={uploadCsv.isPending}
            disabled={!file || uploadCsv.isPending}
          >
            {t('datasources.upload.import')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
