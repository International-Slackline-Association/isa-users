import { SendEmailCommand } from '@aws-sdk/client-ses';
import { ses } from 'core/aws/clients';
import { logger } from 'core/logger';

export const sendEmail = async (opts: { address: string; subject: string; html: string; replyTo?: string }) => {
  const { address, subject, html, replyTo } = opts;
  await ses
    .send(
      new SendEmailCommand({
        Destination: {
          ToAddresses: [address],
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: subject,
          },
        },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Source: 'account@slacklineinternational.org',
      }),
    )
    .catch((error) => {
      logger.error(error.message, { opts });
    });
};
