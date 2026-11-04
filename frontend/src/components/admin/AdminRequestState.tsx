import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export const AdminRequestError: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({ message, onRetry }) => {
  const canRetry = !message.startsWith('You do not have permission') &&
    !message.startsWith('Your session is no longer valid');

  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto h-6 w-6 text-red-600" />
      <p className="mt-2 text-sm font-semibold text-red-800">{message}</p>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#102137] hover:bg-[#183B5B] px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
        >
          <RotateCw className="h-3.5 w-3.5 shrink-0" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export const getAdminRequestError = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') return fallback;

  const response = 'response' in error ? error.response : undefined;
  const status =
    response && typeof response === 'object' && 'status' in response
      ? response.status
      : undefined;

  if (status === 401) return 'Your session is no longer valid. Sign in again to continue.';
  if (status === 403) return 'You do not have permission to view this information.';
  if (!response || typeof response !== 'object') {
    return 'The server could not be reached. Check your connection and retry.';
  }

  const responseData = 'data' in response ? response.data : undefined;
  const data = responseData && typeof responseData === 'object'
    ? responseData
    : undefined;
  const message = data && 'message' in data ? data.message : undefined;
  return typeof message === 'string' && message.trim() ? message : fallback;
};
