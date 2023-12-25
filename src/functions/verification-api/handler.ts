import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getVerifiableDocument } from 'core/documentVerification';
import htmlTemplate from 'core/__static/verificationHtmlTemplate';

const verificationApi: APIGatewayProxyHandlerV2 = async (event) => {
  console.log('Event:', JSON.stringify(event));

  const path = event.rawPath;
  const documentId = event.queryStringParameters?.id;
  const documentToken = event.queryStringParameters?.token;

  const result = await verifyDocument(path, documentId, documentToken);
  let html = (htmlTemplate as string).replaceAll('[VERIFICATION_HEADER]', result.verificationHeader);
  html = html.replaceAll('[META_HEADER]', result.metaHeader);
  html = html.replaceAll('[CONTENT_TEXT]', result.contentText);
  if (!result.isVerified) {
    html = html.replaceAll('color:#13a89e', 'color:#E74027');
  }

  return {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html',
    },
  };
};

const verifyDocument = async (path: string, documentId: string, documentToken: string) => {
  if (path === '/document' && (documentId || documentToken)) {
    try {
      const document = await getVerifiableDocument(documentId, documentToken);
      return {
        isVerified: true,
        verificationHeader: 'Verification Successful ✓',
        metaHeader: `This document was issued to "${document.subject}" on date "${document.issuedAt}" and expires at "${document.expiresAt}"`,
        contentText: document.payload.content,
      };
    } catch (error) {
      let errorMessage = "This document couldn't be verified.";
      switch (error.message) {
        case 'NotFound':
          errorMessage = 'The document could not be found or it has expired.';
          break;
        case 'Invalid':
          errorMessage = 'The document is NOT signed by Internatinal Slackline Association.';
          break;
        case 'Expired':
          errorMessage = 'The document has expired';
          break;
      }
      return {
        isVerified: false,
        verificationHeader: 'Verification FAILED ❌',
        metaHeader: 'International Slackline Association is unable to verify this document.',
        contentText: errorMessage,
      };
    }
  } else {
    return {
      verificationHeader: 'Incorrect Verification Method ❌',
      metaHeader: 'This verification method is not supported',
      contentText: 'Please provide required parameters to verify the document.',
    };
  }
};

export const main = verificationApi;
