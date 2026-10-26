import { Injectable } from '@nestjs/common';
import { ConfigService } from './configService/config.service';

type EmailProps = {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
  attachments?: {
    content?: string | Buffer;
    fileName?: string | false;
    contentType?: string;
    path?: string;
  }[];
};

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  async sendEmail(props: EmailProps): Promise<void> {
    const to = Array.isArray(props.to) ? props.to : [props.to];
    if (
      !to.length ||
      to.some((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    ) {
      throw new Error('Invalid email recipient');
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: `Bearer ${this.config.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
        ...(props.idempotencyKey
          ? { 'Idempotency-Key': props.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from: props.from ?? this.config.get('FROM_EMAIL'),
        to,
        subject: props.subject,
        html: props.html,
        text: props.text,
        attachments: props.attachments?.map((attachment) => ({
          filename: attachment.fileName || undefined,
          content: Buffer.isBuffer(attachment.content)
            ? attachment.content.toString('base64')
            : attachment.content,
          content_type: attachment.contentType,
          path: attachment.path,
        })),
      }),
    });
    if (!response.ok) {
      // Avoid logging journal contents or provider responses containing personal data.
      throw new Error(`Resend rejected email (HTTP ${response.status})`);
    }
  }
}
