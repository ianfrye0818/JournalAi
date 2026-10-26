import { Card, EmptyState } from '@/components/ui';
import { ApiError } from '@/lib/api/client';

export type RetryCardProps = {
  error: unknown;
  title?: string;
  onRetry: () => void;
};

/** What went wrong, in the server's words when it gave any, with a retry. */
export function RetryCard({ error, title = 'Something went wrong', onRetry }: RetryCardProps) {
  return (
    <Card>
      <EmptyState
        icon={{ ios: 'exclamationmark.triangle', android: 'error', web: 'error' }}
        title={title}
        description={describeError(error)}
        actionLabel="Try again"
        onAction={onRetry}
      />
    </Card>
  );
}

export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    // The AI call failed upstream; the server's message is technical.
    if (error.status === 502) return "The writing assistant didn't answer. It usually works on a second try.";
    return error.message;
  }
  return 'Please try again.';
}
