import { Trans } from '@lingui/macro';
import { CircularProgress, Paper, PaperProps, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import WalletConnectLogo from '/public/walletConnectLogo.svg';
import WalletConnectLogoDark from '/public/walletConnectLogoDark.svg';

import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
}

export const ConnectWalletPaper = ({
  loading,
  description,
  sx,
  ...rest
}: ConnectWalletPaperProps) => {
  const theme = useTheme();
  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
        ...sx,
      }}
    >
      {theme.palette.mode === 'light' ? (
        <WalletConnectLogo style={{ marginBottom: '16px', maxWidth: '250px' }} />
      ) : (
        <WalletConnectLogoDark style={{ marginBottom: '16px', maxWidth: '250px' }} />
      )}
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {description ? (
              <Typography
                sx={{
                  mb: 6,
                  textAlign: 'left',
                  maxWidth: '700px',
                  marginBottom: '50px',
                  padding: '15px 20px',
                  borderRadius: '6px',
                }}
              >
                {description}
              </Typography>
            ) : (
              <Disclaimers />
            )}
            <ConnectWalletButton />
          </>
        )}
      </>
    </Paper>
  );
};

export const Disclaimers = () => {
  return (
    <Typography
      sx={{
        mb: 6,
        textAlign: 'left',
        maxWidth: '700px',
        marginBottom: '50px',
        padding: '15px 20px',
        borderRadius: '6px',
      }}
    >
      (
      <Trans>
        By using this Site, I have read and agree to the{' '}
        <a href="https://spark.fi/terms-of-use.html" target="blank">
          Terms of Use
        </a>{' '}
        and{' '}
        <a href="https://spark.fi/privacy-policy.html" target="blank">
          Privacy Policy
        </a>
        .
        <br />
        <br />- I am not the person or entities who reside in, are citizens of, are incorporated in,
        or have a registered office in the United States of America or any Prohibited Localities, as
        defined in the{' '}
        <a href="https://spark.fi/terms-of-use.html" target="blank">
          Terms of Use
        </a>
        .
        <br />- I will not in the future access this site while located within the United States or
        any Prohibited Localities, as defined in the{' '}
        <a href="https://spark.fi/terms-of-use.html" target="blank">
          Terms of Use
        </a>
        .
        <br />
        - I am not using, and will not in the future use, a VPN to mask my physical location from a
        restricted territory.
        <br />
        - I am lawfully permitted to access this site and use it&#39;s services under the laws of
        the jurisdiction in which I reside and am located.
        <br />- I understand the risks associated with entering into using the Spark.
      </Trans>
      )
    </Typography>
  );
};
