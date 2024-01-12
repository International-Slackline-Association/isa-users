import { GetUserAPIResponse } from 'app/api/user-api';

/* --- STATE --- */
export interface UserState {
  userInfo?: GetUserAPIResponse;
}
