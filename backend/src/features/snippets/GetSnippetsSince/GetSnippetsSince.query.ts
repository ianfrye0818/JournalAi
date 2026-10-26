import { Query } from '@nestjs/cqrs';
import { GetSnippetsSinceRequest } from './GetSnippetsSince.request';
import { GetSnippetsSinceResponse } from './GetSnippetsSince.response';

export class GetSnippetsSinceQuery extends Query<GetSnippetsSinceResponse> {
  constructor(
    public readonly userId: string,
    public readonly request: GetSnippetsSinceRequest,
  ) {
    super();
  }
}
