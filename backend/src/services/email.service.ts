import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import { formatError, sleep } from '../lib/utils';
import { AppLogger } from './applogger.service';
import { ConfigService } from './configService/config.service';

type Attachment = {
  content?: string | Buffer;
  fileName?: string | false | undefined;
  contentType?: string;
  path?: string;
};

type EmailProps = {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
};

@Injectable()
export class EmailService {
  private readonly logger = new AppLogger(EmailService.name);
  private readonly transporter: nodeMailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    if (!nodeMailer) throw new Error('Nodemailer Module not loaded properly');
    this.transporter = nodeMailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  private static isValidEmail(email: any): boolean {
    if (typeof email !== 'string') return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) return false;

    if (email.toLowerCase().endsWith('@qocnc.org')) return false;

    return true;
  }

  public async sendEmail(props: EmailProps): Promise<void> {
    // if (this.configService.get('NODE_ENV') === 'development')
    //   return this.sendEmailDev(props);
    const isEmailList = Array.isArray(props.to);

    const to = isEmailList ? props.to : [props.to];

    for (const email of to) {
      if (!EmailService.isValidEmail(email)) {
        this.logger.error(`Invalid email address: ${email}. Skipping....`);
        continue;
      }

      const mailOptions: nodeMailer.SendMailOptions = {
        from: props.from || this.configService.get('FROM_EMAIL'),
        to: email,
        subject: props.subject,
        html: props.html,
        attachments: props.attachments,
      };

      try {
        const res = await this.transporter.sendMail(mailOptions);
        this.logger.log(
          `Email sent to ${email} successfully. Message ID: ${res.messageId}`,
        );
        await sleep(1000); // debounce for one second to avoid spamming email server
      } catch (error) {
        this.logger.error(
          `Error sending email to ${email}: ${formatError(error)}`,
        );
        throw error;
      }
    }
  }

  private sendEmailDev(props: EmailProps): void {
    this.logger.log(
      'Sending email in development mode... If this is a mistake, please update your env settings',
    );
    this.logger.log(JSON.stringify(props, null, 2));
  }
}
