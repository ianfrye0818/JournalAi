import { Query } from '@nestjs/cqrs';
import { ListDaysRequest } from './ListDays.request';
import { ListDaysResponse } from './ListDays.response';

export class ListDaysQuery extends Query<ListDaysResponse[]> {
  constructor(
    public readonly userId: string,
    public readonly request: ListDaysRequest,
  ) {
    super();
  }
}
