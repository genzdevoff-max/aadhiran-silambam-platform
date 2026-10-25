import React from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

export const AdminRequestError: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({ message, onRetry }) => {
  const canRetry = !message.startsWith('You do not have permission') &&
    !message.startsWith('Your session is no longer valid');

  return (
    <div role="alert" className="rounded-2xl border border-crimson-700/60 bg-crimson-950/60 p-6 text-center">
      <AlertCircle className="mx-auto h-5 w-5 text-crimson-300" />
      <p className="mt-2 text-sm font-semibold text-crimson-200">{message}</p>
      {canRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border border-charcoal-700 bg-charcoal-800 px-4 py-2 text-xs font-semibold text-white hover:bg-charcoal-700"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Retry
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
