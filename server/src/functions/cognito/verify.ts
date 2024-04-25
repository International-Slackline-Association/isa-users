import { SendEmailCommand } from '@aws-sdk/client-ses';
import { ses } from 'core/aws/clients';
import { isaToolsApi } from 'core/external-api/isa-tools-api';

import verifyEmailReminderHtml from './__static/verifyEmailReminderHtml';

export const sendEmailVerificationLink = async (username: string, email: string) => {
  const { token } = await isaToolsApi.signDocument({
    content: JSON.stringify({ username, email }),
    expiresInSeconds: 60 * 60 * 24 * 7, // 1 week
    subject: 'account-api.slacklineinternational.org',
    createHash: false,
  });
  const verificationUrl =
    'https://account-api.slacklineinternational.org/verify/confirm-email?token=' + token;

  const html = verifyEmailReminderHtml.replace(/{{VERIFICATION_URL}}/g, verificationUrl);
  await ses.send(
    new SendEmailCommand({
      Destination: {
        ToAddresses: [email],
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
          Data: 'Reminder: Verify your email address!',
        },
      },
      ReplyToAddresses: ['account@slacklineinternational.org'],
      Source: '"ISA Account" <account@slacklineinternational.org>',
    }),
  );
};
