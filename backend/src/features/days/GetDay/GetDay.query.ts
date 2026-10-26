import { Query } from '@nestjs/cqrs';
import { GetDayRequest } from './GetDay.request';
import { GetDayResponse } from './GetDay.response';

export class GetDayQuery extends Query<GetDayResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: GetDayRequest,
  ) {
    super();
  }
}
