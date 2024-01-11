export type CertificateType =
  | 'instructor'
  | 'rigger'
  | 'athletic-award'
  | 'athlete-certificate-of-exellence'
  | 'contest-organizer'
  | 'isa-membership'
  | 'world-record'
  | 'honoraryMember'
  | 'approved-gear';

export interface CertificateItem {
  certId: string;
  certificateType: CertificateType;
  name: string;
  languages: string[];
  data: any;
}
