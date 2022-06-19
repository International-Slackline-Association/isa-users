declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ISA_USERS_TABLE: string;
    }
  }
}

export {};
