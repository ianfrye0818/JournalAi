import { Controller, Get, Header, HttpCode, Post, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '@src/decorators/public.decorator';
import { UnsubscribeCommand } from './Unsubscribe/Unsubscribe.command';
import { UnsubscribeRequest } from './Unsubscribe/Unsubscribe.request';

const page = (body: string) =>
  `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>JournalAI</title></head><body style="max-width:480px;margin:48px auto;padding:0 16px;font-family:Georgia,serif;color:#26352c">${body}</body></html>`;

/** Opened from the recap email, so there is no session; the recap id authorises the change. */
@ApiExcludeController()
@Public()
@Controller('monthly-summary/unsubscribe')
export class MonthlySummaryController {
  constructor(private readonly commandBus: CommandBus) {}

  // GET only shows a confirm button: mail scanners prefetch links and must not unsubscribe anyone.
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  confirm(@Query() { id }: UnsubscribeRequest): string {
    return page(
      `<h1>Stop monthly recaps?</h1><p>You won't get the monthly recap email any more. You can turn it back on in the app's Settings.</p><form method="post" action="?id=${id}"><button type="submit" style="font-size:16px;padding:10px 16px">Unsubscribe</button></form>`,
    );
  }

  // Also the RFC 8058 one-click target from the List-Unsubscribe-Post header.
  @Post()
  @HttpCode(200)
  @Header('Content-Type', 'text/html; charset=utf-8')
  async unsubscribe(@Query() { id }: UnsubscribeRequest): Promise<string> {
    await this.commandBus.execute(new UnsubscribeCommand(id));
    return page(
      `<h1>You're unsubscribed</h1><p>No more monthly recap emails. You can turn them back on in the app's Settings.</p>`,
    );
  }
}
