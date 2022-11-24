import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

const verificationApi: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('Event:', JSON.stringify(event));

  // const payload = verifySignedPayload(event.body);
  return {
    statusCode: 200,
    body: '<html><body><h1>Test</h1></body></html>',
    headers: {
      'Content-Type': 'application/json',
    },
  };
};

const verifySignedPayload = (body: string) => {
  try {
    return null;
  } catch (error) {
    return null;
  }
};

export const main = verificationApi;
