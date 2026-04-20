import { httpClient } from './http.client';
import type { DetectColumnsConfig, DetectColumnsResult } from '@type/processing.types';

export const processingService = {
  async detectColumns(config: DetectColumnsConfig): Promise<DetectColumnsResult> {
    return httpClient.post<DetectColumnsResult>('/processing/detect-columns', config);
  },
};
