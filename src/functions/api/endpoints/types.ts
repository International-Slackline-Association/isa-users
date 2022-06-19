export interface CreateClubPostBody {
  clubId: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  city?: string;
  country?: string;
  memberType?: 'active' | 'observer' | 'partner';
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
}
