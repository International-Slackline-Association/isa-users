import { sheets_v4 } from 'googleapis';
import { CertificateType, getValues } from './spreadsheet';

const allRanges: CertificateType[] = [
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
  const valueRanges = await getValues(['ISA Membership']);

  const isaMembers = parseValues(valueRanges, (row) => {
    const email = row[1]?.toLowerCase() as string;
    const membership = row[2]?.toLowerCase() as string;
    const name = row[3]?.toLowerCase() as string;
    return { email, membership, name };
  });

  return isaMembers;
};

export const getAllInstructorsFromSpreadsheet = async () => {
  const valueRanges = await getValues(['Instructors']);

  const instructors = parseValues(valueRanges, (row) => {
    const isaId = row[0]?.toLowerCase().trim() as string;
    const email = row[1]?.trim() as string;
    const name = row[2]?.trim() as string;
    const surname = row[3]?.toLowerCase().trim() as string;
    const level = row[4]?.toLowerCase().trim() as string;
    const startDate = row[5]?.toLowerCase().trim() as string;
    const endDate = row[6]?.toLowerCase().trim() as string;
    const country = row[7]?.trim() as string;
    return { isaId, email, name, surname, level, startDate, endDate, country };
  });
  return instructors;
};

export const getAllRiggersFromSpreadsheet = async () => {
  const valueRanges = await getValues(['Riggers']);

  const instructors = parseValues(valueRanges, (row) => {
    const isaId = row[0]?.toLowerCase().trim() as string;
    const email = row[1]?.toLowerCase().trim() as string;
    const name = row[2]?.trim() as string;
    const surname = row[3]?.trim() as string;
    const level = row[4]?.toLowerCase().trim() as string;
    const startDate = row[5]?.toLowerCase().trim() as string;
    const endDate = row[6]?.toLowerCase().trim() as string;
    const country = row[7]?.trim() as string;
    return { isaId, email, name, surname, level, startDate, endDate, country };
  });

  return instructors;
};

const parseValues = <T>(valueRanges: sheets_v4.Schema$ValueRange[], parseRow: (row: any[]) => T) => {
  const data: T[] = [];

  for (const valueRange of valueRanges) {
    const range = valueRange.range;
    const rangeData = valueRange.values;

    const rows = rangeData.slice(1);
    for (const row of rows) {
      data.push(parseRow(row));
    }
  }
  return data;
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
