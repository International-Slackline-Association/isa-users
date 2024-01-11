import { AnyAction, Reducer } from '@reduxjs/toolkit';
import type { AppState } from 'app/slices/app/types';
import type { OrganizationState } from 'app/slices/organization/types';
import type { UserState } from 'app/slices/user/types';

// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

export type RequiredRootState = Required<RootState>;

export type RootStateKeyType = keyof RootState;

export type InjectedReducersType = {
  [P in OptionalKeys<RootState>]?: Reducer<RequiredRootState[P], AnyAction>;
};

export type StaticReducersType = {
  [P in RequiredKeys<RootState>]: Reducer<RootState[P], AnyAction>;
};

/* 
  Because we inject your reducers asynchronously somewhere in your code
  You have to declare them here manually :(
*/
export interface RootState {
  api: any;
  app?: AppState;
  user?: UserState;
  organization?: OrganizationState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
