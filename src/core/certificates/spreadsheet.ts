import { ssm } from 'core/aws/clients';
import { google, sheets_v4 } from 'googleapis';

export type CertificateType =
  | 'Instructors'
  | 'Riggers'
  | 'Athletic Award(Contest)'
  | 'Athlete Certificate Of Exellence(Year)'
  | 'Contest Organizer'
  | 'ISA Membership'
  | 'World Records'
  | 'Honorary Members'
  | 'Approved Gear';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const googleCredsSSMParameter = 'isa-users-google-credentials-json';
const spreadsheetIdSSMParameter = 'isa-users-certificates-spreadsheetId';

let sheets: sheets_v4.Sheets;
let cache: {
  googleCreds: any;
  spreadsheetId: string;
};

const loadSSMParameters = async () => {
  if (cache) {
    return cache;
  }
  const ssmParam = await ssm.getParameters({ Names: [googleCredsSSMParameter, spreadsheetIdSSMParameter] }).promise();
  const googleCreds = JSON.parse(ssmParam.Parameters.filter((p) => p.Name === googleCredsSSMParameter)[0].Value);
  const spreadsheetId = ssmParam.Parameters.filter((p) => p.Name === spreadsheetIdSSMParameter)[0].Value;
  cache = { googleCreds, spreadsheetId };
  return { googleCreds, spreadsheetId };
};

const authorize = async () => {
  if (!sheets) {
    const { googleCreds } = await loadSSMParameters();
    const client = new google.auth.JWT(googleCreds.client_email, null, googleCreds.private_key, SCOPES);
    await client.authorize();
    sheets = google.sheets({ version: 'v4', auth: client });
  }
};

export const getValues = async (ranges: CertificateType[]) => {
  await authorize();
  const { spreadsheetId } = await loadSSMParameters();

  const result = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
  });
  return result.data.valueRanges;
};
