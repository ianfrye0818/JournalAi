import { Query } from '@nestjs/cqrs';
import { GetStyleProfileResponse } from './GetStyleProfile.response';

export class GetStyleProfileQuery extends Query<GetStyleProfileResponse> {
  constructor(public readonly userId: string) {
    super();
  }
}
