import { getValues } from 'core/certificates/spreadsheet';

const ranges = [
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

export const getAllUserCertificates = async (isaId: string, isaEmail: string) => {
  const valueRanges = await getValues(ranges);

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
    const rowsOfUser = rows.filter((row) => row[0] === isaId || row[1] === isaEmail);
    if (rowsOfUser.length > 0) {
      certificates.push({ range, headers: rowHeaders, values: rowsOfUser });
    }
  }
  return certificates;
};
