import { ApiProperty } from '@nestjs/swagger';

/**
 * - `created` / `updated`: the server now holds this version.
 * - `unchanged`: the server already had exactly this version (a retried batch).
 * - `stale`: the server holds a newer edit; the device picks it up on its next pull.
 */
export const syncStatuses = [
  'created',
  'updated',
  'unchanged',
  'stale',
] as const;
export type SyncStatus = (typeof syncStatuses)[number];

export class SyncSnippetResult {
  @ApiProperty()
  clientId!: string;

  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ enum: syncStatuses })
  status!: SyncStatus;
}

export class SyncSnippetsResponse {
  @ApiProperty({ type: [SyncSnippetResult] })
  results!: SyncSnippetResult[];
}
