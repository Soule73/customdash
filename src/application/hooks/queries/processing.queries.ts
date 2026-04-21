import { useMutation } from '@tanstack/react-query';
import { processingService } from '@services/index';
import { processingKeys } from './keys';
import type { DetectColumnsConfig } from '@type/processing.types';

export { processingKeys };

export function useDetectColumns() {
  return useMutation({
    mutationFn: (config: DetectColumnsConfig) => processingService.detectColumns(config),
  });
}
