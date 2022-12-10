import organizationNotificationTemplate from 'core/__static/organizationNotificationTemplate';

export const userJoinNotificationEmailTemplate = (name: string, surname: string) => {
  const template = organizationNotificationTemplate;
  const html = template.replace(/{{HEADER_TEXT}}/g, `"${name} ${surname}" requested to join your organization.`);
  const subject = `A new user requested to join`;
  return { html, subject };
};

export const userLeaveNotificationEmailTemplate = (name: string, surname: string) => {
  const template = organizationNotificationTemplate;
  const html = template.replace(/{{HEADER_TEXT}}/g, `"${name} ${surname}" has left your organization.`);
  const subject = `User has left your organization`;
  return { html, subject };
};
