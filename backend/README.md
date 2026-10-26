<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Monthly journal email

EmailService uses the Resend HTTP API with `RESEND_API_KEY` and `FROM_EMAIL`.
Set `FROM_EMAIL` to an address on your verified Resend domain. For initial testing,
Resend's `onboarding@resend.dev` sender can send to your Resend account address.
See [Resend's sending API](https://resend.com/docs/api-reference/emails/send-email).

Recaps are opt-in: a user turns them on under Settings → Monthly recap email
(`PATCH /auth/me` with `monthlyRecap`). The monthly job loads active, opted-in
users and sends each recap to that user’s saved email address using only their
own journal data and timezone. Every recap carries a "Stop these emails" link and
RFC 8058 `List-Unsubscribe` headers pointing at
`/api/monthly-summary/unsubscribe?id=<recap id>` (built from `API_URL`). The GET
shows a confirm button and the POST unsubscribes, so link scanners can't
unsubscribe anyone.
Configure `RESEND_API_KEY` and `FROM_EMAIL`, then restart the backend.
No recipient environment variable is needed.

Apply the database migration before starting the updated server:

```bash
npx prisma migrate deploy
npm run build
```

The in-process cron checks hourly, becoming due at 9am on the first day of the
month in the journal account's timezone. It summarizes the previous calendar
month using session dates (including the account's journal day rollover rules).
The backend must be running; downtime is caught up on the next hourly check in
the same month. Older missed months are not backfilled automatically.

Recaps include nondeleted snippet counts, days with snippets or an entry,
finalized entries, longest streak within the month, AI summary, tentative mood,
themes, highlights, and a reflection question. Months without content are skipped.
Exact counts cover all records; AI input uses at most 6,000 characters per day
and 100,000 total, with an excerpt notice when truncated.

Database leases coordinate replicas; generated email content is cached before
sending and successful delivery is recorded. Failures retry hourly using the
same Resend idempotency key and payload. Resend keeps idempotency keys for 24
hours; a crash after provider acceptance but before recording success can cause
a duplicate if recovery occurs after that window. Retained email content is
removed when the owning account is deleted.

Tests mock email and AI providers; they do not send real journal emails.

## Password reset

`POST /api/auth/password/forgot` with `{ email }` always returns 204, so it can't
be used to find out which emails have accounts. For an active account it emails
a 6-digit code through Resend (needs `RESEND_API_KEY` and `FROM_EMAIL`), at most
once a minute. Only a sha256 hash of the code is kept, in Redis, for 15 minutes.

`POST /api/auth/password/reset` with `{ email, code, password }` sets the new
password, uses up the code, revokes every existing token, and returns a fresh
`{ token, user }` so the app signs straight in. Each account gets 10 wrong codes
per hour, counted across all codes issued that hour, so asking for new codes
doesn't buy more guesses. Both routes are also limited per IP like login.
