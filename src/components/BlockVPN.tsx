/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import WalletConnectLogo from '/public/walletConnectLogo.svg';

export function BlockVPN({ children }: { children: React.ReactNode }): React.ReactElement {
  if (process.env.NEXT_PUBLIC_VPN_PROTECTION !== '1') {
    return <>{children}</>;
  }

  const [isVpn, setIsVpn] = useState(false);

  useEffect(() => {
    // executes only on client
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const geoip2 = (window as any).geoip2;

      geoip2.insights(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (insights: any) => {
          const isVpn = insights.traits.user_type.toLowerCase() === 'hosting';
          console.log('Vpn detected: ', isVpn);
          setIsVpn(isVpn);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any) => {
          console.error('Error while detecting VPN', error);
        }
      );
    }
  }, []);

  if (isVpn) {
    return <VPNDetected />;
  } else {
    return <>{children}</>;
  }
}

function VPNDetected() {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        display: 'flex',
        alignItems: 'center',
        justifyItems: 'center',
        flexDirection: 'column',
      }}
    >
      <WalletConnectLogo style={{ maxWidth: '250px' }} />
      <Typography variant="h1" sx={{ fontSize: 40 }}>
        Accessing this website via VPN is not allowed!
      </Typography>
      <Typography variant="h3" sx={{ fontSize: 20 }}>
        If you believe this is a mistake, contact us via email{' '}
        <Link href="mailto:contact@marsfoundation.xyz">contact@marsfoundation.xyz</Link>. Don't
        forget to send us your current IP address.
      </Typography>
    </Box>
  );
}
