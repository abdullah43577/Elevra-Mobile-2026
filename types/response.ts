export interface APIResponse<TData = unknown> {
  message: string;
  data: TData;
}
