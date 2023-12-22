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

const cache: {
  id?: {
    valueRanges: sheets_v4.Schema$ValueRange[];
    expiresIn?: number;
  };
} = {};

export const getAllUserCertificatesFromSpreadsheet = async (
  isaId: string,
  isaEmail: string,
  opts: {
    filterCertificateId?: string;
  } = {},
) => {
  let valueRanges = cache.id?.valueRanges || [];
  if (valueRanges.length === 0 || cache.id?.expiresIn < Date.now()) {
    valueRanges = await getValues(allRanges);
    cache.id = {
      valueRanges,
      expiresIn: Date.now() + 1000 * 60 * 5, // 5 minutes
    };
  }

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
    const rowsOfUser = rows.filter((row) => isSpreadsheetRowMatching(row, isaId, isaEmail, opts.filterCertificateId));
    if (rowsOfUser.length > 0) {
      certificates.push({ range, headers: rowHeaders, values: rowsOfUser });
    }
  }
  return certificates;
};

export const getAllISAMembersFromSpreadsheet = async () => {
  const valueRanges = await getValues(['ISA Membership']);

  const isaMembers = parseValues(valueRanges, (row) => {
    const email = row[2]?.toLowerCase() as string;
    const membership = row[3]?.toLowerCase() as string;
    const name = row[4]?.toLowerCase() as string;
    return { email, membership, name };
  });

  return isaMembers;
};

export const getInstructorsFromSpreadsheet = async (certId?: string) => {
  const valueRanges = await getValues(['Instructors']);

  const values = parseValues(valueRanges, (row) => {
    const certId = row[0]?.trim() as string;
    const isaId = row[1]?.toLowerCase().trim() as string;
    const email = row[2]?.trim() as string;
    const name = row[3]?.trim() as string;
    const surname = row[4]?.trim() as string;
    const level = row[5]?.trim() as string;
    const startDate = row[6]?.toLowerCase().trim() as string;
    const endDate = row[7]?.toLowerCase().trim() as string;
    const country = row[8]?.trim() as string;
    return { certId, isaId, email, name, surname, level, startDate, endDate, country };
  });
  if (certId) {
    return values.filter((i) => i.certId === certId);
  }
  return values;
};

export const getRiggersFromSpreadsheet = async (certId?: string) => {
  const valueRanges = await getValues(['Riggers']);

  const values = parseValues(valueRanges, (row) => {
    const certId = row[0]?.trim() as string;
    const isaId = row[1]?.toLowerCase().trim() as string;
    const email = row[2]?.toLowerCase().trim() as string;
    const name = row[3]?.trim() as string;
    const surname = row[4]?.trim() as string;
    const level = row[5]?.trim() as string;
    const startDate = row[6]?.toLowerCase().trim() as string;
    const endDate = row[7]?.toLowerCase().trim() as string;
    const country = row[8]?.trim() as string;
    return { certId, isaId, email, name, surname, level, startDate, endDate, country };
  });

  if (certId) {
    return values.filter((i) => i.certId === certId);
  }
  return values;
};

export const getWorldRecordsFromSpreadsheet = async (certId?: string) => {
  const valueRanges = await getValues(['World Records']);

  const values = parseValues(valueRanges, (row) => {
    const certId = row[0]?.trim() as string;
    const isaId = row[1]?.toLowerCase().trim() as string;
    const email = row[2]?.toLowerCase().trim() as string;
    const recordType = row[3]?.trim() as string;
    const specs = row[4]?.trim() as string;
    const name = row[5]?.trim() as string;
    const category = row[6]?.trim() as string;
    const date = row[7]?.toLowerCase().trim() as string;
    return { certId, isaId, email, name, recordType, specs, category, date };
  });

  if (certId) {
    return values.filter((i) => i.certId === certId);
  }
  return values;
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

const isSpreadsheetRowMatching = (rows: string[], isaId?: string, isaEmail?: string, certificateId?: string) => {
  const rCertificateId = rows[0]?.toLowerCase();
  const rId = rows[1]?.toLowerCase();
  const rEmail = rows[2]?.toLowerCase();

  if (!rId && !rEmail) {
    return false;
  }

  const id = isaId?.toLowerCase();
  const email = isaEmail?.toLowerCase();
  if (certificateId && rCertificateId !== certificateId) {
    return false;
  }
  return rId === id || rEmail === email;
};
