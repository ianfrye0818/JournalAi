import { IsUUID } from 'class-validator';
export class UnsubscribeRequest {
  /** A recap id is random and only ever sent to its owner, so it doubles as the unsubscribe token. */
  @IsUUID()
  id!: string;
}
