import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  colors,
} from '@mui/material';
import { CircularProgress } from '@mui/material';

import { certificateApi } from 'app/api/certificate-api';

export function MyCertificates() {
  const { data: certificatesResponse, isLoading: isCertificatesLoading } =
    certificateApi.useListCertificatesQuery();

  const [generateCertificate, { data: generatedCertificate, isLoading: isGeneratingCertificate }] =
    certificateApi.useGenerateCertificateMutation();

  return (
    <Card>
      <CardHeader title="My Certificates" />
      <Typography variant="caption" color="textSecondary" sx={{ ml: 2, display: 'block' }}>
        Select a language to generate the certificate in PDF format. If you dont see any language,
        please contact us. Not all certificates are yet available via PDF.
      </Typography>
      <CardContent>
        {isCertificatesLoading ? (
          <CircularProgress />
        ) : certificatesResponse?.certificates.length === 0 ? (
          <Typography>You have no certificates</Typography>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: colors.grey[100] }}>
              <TableRow>
                <TableCell style={{ width: '75%' }}>Certificate Name</TableCell>
                <TableCell style={{ width: '25%' }}>Select Language</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificatesResponse?.certificates.map((certificate) => (
                <TableRow key={certificate.certId}>
                  <TableCell>{certificate.title}</TableCell>
                  <TableCell>
                    {isGeneratingCertificate ? (
                      <>
                        <Typography color="textSecondary">Generating PDF...</Typography>
                        <CircularProgress />
                      </>
                    ) : generatedCertificate?.certificateId === certificate.certId ? (
                      <Link href={generatedCertificate?.pdfUrl} target="_blank">
                        <Button variant="contained" startIcon={<OpenInNewIcon />}>
                          Open PDF
                        </Button>
                      </Link>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        {certificatesResponse.certificateLanguages[
                          certificate.certificateType
                        ]?.map((language) => (
                          <Button
                            key={language}
                            variant="outlined"
                            startIcon={<PictureAsPdfIcon />}
                            disabled={isGeneratingCertificate}
                            onClick={() => {
                              generateCertificate({
                                certificateType: certificate.certificateType,
                                certificateId: certificate.certId,
                                language,
                              });
                            }}
                          >
                            {language}
                          </Button>
                        ))}
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
