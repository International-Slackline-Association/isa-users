export interface UpdateOrganizationPostBody {
  name: string;
  profilePictureUrl?: string;
  city?: string;
  country?: string;
  contactPhone?: string;
}

export interface UpdateUserPostBody {
  name?: string;
  surname?: string;
  gender?: 'm' | 'f';
  birthDate?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
  profilePictureUrl?: string;
}

export interface SignPayloadBody {
  payload: any;
  expiresInSeconds?: number;
}
