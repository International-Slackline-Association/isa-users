import axios from 'axios';

const api = axios.create({
  baseURL: `https://raw.githubusercontent.com/International-Slackline-Association/slackline-data/master/data`,
});

interface IsaMember {
  country: string;
  name: string;
  joinedDate?: string;
  email: string;
  infoUrl?: string;
  profilePictureUrl?: string;
  memberType: 'national' | 'observer' | 'partner' | 'associate';
}

const getIsaMembersList = async () => {
  const response = await api.get(`/communities/isa/members.json`);
  return response.data as IsaMember[];
};

export const slacklineDataApi = {
  getIsaMembersList,
};
