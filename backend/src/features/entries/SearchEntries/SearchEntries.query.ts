import { Query } from '@nestjs/cqrs';
import { SearchEntriesRequest } from './SearchEntries.request';
import { SearchEntriesResponse } from './SearchEntries.response';

export class SearchEntriesQuery extends Query<SearchEntriesResponse[]> {
  constructor(
    public readonly userId: string,
    public readonly request: SearchEntriesRequest,
  ) {
    super();
  }
}
