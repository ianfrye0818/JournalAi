import { Query } from '@nestjs/cqrs';
import { GetMeResponse } from './GetMe.response';

export class GetMeQuery extends Query<GetMeResponse> {
  constructor(public readonly userId: string) {
    super();
  }
}
