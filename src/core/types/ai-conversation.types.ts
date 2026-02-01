export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  widgetsGenerated?: number;
}

export interface ColumnSummary {
  name: string;
  type: string;
  uniqueValues?: number;
  sampleValues?: unknown[];
}

export interface DataSourceSummary {
  totalRows: number;
  columns: ColumnSummary[];
}

export interface AIConversation {
  id: string;
  userId: string;
  dataSourceId: string;
  title: string;
  messages: AIMessage[];
  dataSourceSummary?: DataSourceSummary;
  suggestions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAIConversationData {
  dataSourceId: string;
  title?: string;
  initialPrompt?: string;
}

export interface UpdateAIConversationData {
  title?: string;
}

export interface AddMessageData {
  content: string;
  role?: 'user' | 'assistant';
}
