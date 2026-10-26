import { ApiProperty } from '@nestjs/swagger';
import { SnippetResponse } from '../shared/snippet.response';

export class GetSnippetsSinceResponse {
  @ApiProperty({
    type: [SnippetResponse],
    description: 'Oldest change first, deleted snippets included',
  })
  snippets!: SnippetResponse[];

  @ApiProperty({
    description:
      'Call again with the last snippet as the cursor to get the rest',
  })
  hasMore!: boolean;
}
