declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ISA_USERS_TABLE: string;
      ISA_USERS_IMAGES_S3_BUCKET: string;
    }
  }
}

export {};
