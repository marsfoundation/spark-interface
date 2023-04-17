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
        <WalletConnectLogo style={{ marginBottom: '16px', maxWidth: '500px' }} />
      ) : (
        <WalletConnectLogoDark style={{ marginBottom: '16px', maxWidth: '500px' }} />
      )}
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h2" sx={{ mb: 2 }}>
              <Trans>Please, connect your wallet</Trans>
            </Typography>
            <Typography sx={{ mb: 6 }} color="text.secondary">
              {description || (
                <Trans>
                  !!! By connecting your wallet you confirm that you are not a US citizen !!!
                </Trans>
              )}
            </Typography>
            <ConnectWalletButton />
          </>
        )}
      </>
    </Paper>
  );
};
