export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}

export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
}
