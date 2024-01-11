export interface GetUserAPIResponse {
  cognitoSub: string;
  userId: string;
  email: string;
  name: string;
  surname: string;
  gender?: 'm' | 'f' | 'o';
  birthDate?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
  profilePictureS3Key?: string;
}

export interface GetOrganizationAPIResponse {
  cognitoSub: string;
  organizationId: string;
  email: string;
  name: string;
  profilePictureS3Key?: string;
  city?: string;
  country?: string;
  memberType?: 'active' | 'observer' | 'partner';
  contactPhone?: string;
}

export interface GetOrganizationsOfUserResponse {
  items: {
    organizationId: string;
    email: string;
    name: string;
    isPendingApproval?: boolean;
    joinedAt: string;
    profilePictureS3Key?: string;
    city?: string;
    country?: string;
    memberType?: 'active' | 'observer' | 'partner';
    contactPhone?: string;
  }[];
}

export interface GetAllOrganizationsAPIResponse {
  items: {
    organizationId: string;
    name: string;
    email: string;
    profilePictureS3Key?: string;
  }[];
}

export interface GetUsersOfOrganizationResponse {
  items: {
    userId: string;
    email: string;
    name: string;
    surname: string;
    joinedAt: string;
    isPendingApproval?: boolean;
    profilePictureS3Key?: string;
  }[];
}

export interface ListAllCertificatesAPIResponse {
  certificates: {
    certificateType: string;
    certId: string;
    title: string;
    isaId?: string;
    email?: string;
  }[];
  certificateLanguages: { [key: string]: string[] };
}

export interface SignedDocumentResponse {
  token: string;
  verificationUrl: string;
  expiresAt: string;
}

export interface UpdateProfilePictureBody {
  processingBucketKey: string | null;
}
