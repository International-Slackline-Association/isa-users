import axios from 'axios';
import { logger } from 'core/logger';

interface ProcessImagePayload {
  input: {
    s3: {
      bucket?: string;
      key: string;
    };
  };
  output: {
    s3: {
      bucket: string;
      key: string;
    };
  };
  outputFormat: 'jpeg' | 'png' | 'webp';
  resize: {
    width: number;
    height: number;
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  quality: number;
  cacheControl?: string;
}
const api = axios.create({
  baseURL: `https://docs-api.slacklineinternational.org`,
  headers: {
    'x-api-key': process.env.ISA_DOCUMENTS_TRUSTED_SERVICE_API_KEY,
  },
});

const processImage = async (payload: ProcessImagePayload) => {
  return api
    .post(`image-processor/process`, payload)
    .then(() => true)
    .catch((err) => {
      logger.error('Error while processing image', { message: err.message });
      return false;
    });
};

const listCertificates = async (isaId: string, email: string) => {
  const query = `?isaId=${isaId}&email=${email}`;
  const response = await api.get(`certificate${query}`).then((res) => res.data);

  return response as {
    certificates: {
      certificateType: string;
      certId: string;
      title: string;
      isaId?: string;
      email?: string;
    }[];
    certificateLanguages: { [key: string]: string[] };
  };
};

const generateCertificate = async (payload: {
  certificateType: string;
  certificateId: string;
  subject: string;
  language: string;
}) => {
  const response = await api.post(`certificate/generate`, payload).then((res) => res.data);
  return response as {
    pdfUrl: string;
    certificateId: string;
  };
};

const signDocument = async (payload: {
  subject: string;
  expiresInSeconds: number;
  createHash?: boolean;
  content: string;
}) => {
  const response = await api.post(`sign`, payload).then((res) => res.data);
  return response as {
    token: string;
    verificationUrl: string;
    expiresAt: string;
  };
};

export const isaDocumentApi = {
  processImage,
  listCertificates,
  generateCertificate,
  signDocument,
};
