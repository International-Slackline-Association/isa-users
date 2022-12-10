import { getValues } from 'core/certificates/spreadsheet';

const allRanges = [
  'Instructors',
  'Riggers',
  'Athletic Award(Contest)',
  'Athlete Certificate Of Exellence(Year)',
  'Contest Organizer',
  'ISA Membership',
  'World Records',
  'Honorary Members',
  'Approved Gear',
];

const membershipRange = ['ISA Membership'];

export const getAllUserCertificatesFromSpreadsheet = async (isaId: string, isaEmail: string) => {
  const valueRanges = await getValues(allRanges);

  const certificates: {
    range: string;
    headers?: string[];
    values: string[][];
  }[] = [];

  for (const valueRange of valueRanges) {
    const range = valueRange.range;
    const rangeData = valueRange.values;

    const rowHeaders = rangeData[0];
    const rows = rangeData.slice(1);
    const rowsOfUser = rows.filter((row) => isSpreadsheetRowMatching(row, isaId, isaEmail));
    if (rowsOfUser.length > 0) {
      certificates.push({ range, headers: rowHeaders, values: rowsOfUser });
    }
  }
  return certificates;
};

export const getAllISAMembersFromSpreadsheet = async () => {
  const valueRanges = await getValues(membershipRange);

  const isaMembers: {
    email: string;
    membership: string;
    name: string;
  }[] = [];

  for (const valueRange of valueRanges) {
    const range = valueRange.range;
    const rangeData = valueRange.values;

    const rows = rangeData.slice(1);
    for (const row of rows) {
      const email = row[1]?.toLowerCase();
      const membership = row[2]?.toLowerCase();
      const name = row[3]?.toLowerCase();
      isaMembers.push({ email, membership, name });
    }
  }
  return isaMembers;
};

const isSpreadsheetRowMatching = (rows: string[], isaId?: string, isaEmail?: string) => {
  const rId = rows[0]?.toLowerCase();
  const rEmail = rows[1]?.toLowerCase();

  if (!rId && !rEmail) {
    return false;
  }

  const id = isaId?.toLowerCase();
  const email = isaEmail?.toLowerCase();

  return rId === id || rEmail === email;
};
