export interface ResponseBase<T> {
  ok: boolean;
  result?: T;
  error?: string;
}
