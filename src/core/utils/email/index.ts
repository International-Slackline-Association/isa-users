import { ses } from 'core/aws/clients';
import { logger } from 'core/logger';

export const addEmailToSES = async (email: string) => {
  await ses
    .verifyEmailIdentity({ EmailAddress: email })
    .promise()
    .catch((error) => {
      logger.error(error.message, { email });
    });
};

export const sendEmail = async (opts: { address: string; subject: string; html: string; replyTo?: string }) => {
  const { address, subject, html, replyTo } = opts;
  await ses
    .sendEmail({
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
    })
    .promise()
    .catch((error) => {
      logger.error(error.message, { opts });
    });
};
