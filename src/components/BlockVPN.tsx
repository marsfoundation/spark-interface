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
      async function run() {
        const ip = await getMyIp();
        console.log('IP: ', ip);

        if (localStorage.getItem(getLocalStorageKey(ip)) === null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const geoip2 = (window as any).geoip2;
          const vpnStatus = await fetchVPNStatus(geoip2);
          localStorage.setItem(getLocalStorageKey(ip), JSON.stringify(vpnStatus));
        }
        const isVPN = JSON.parse(localStorage.getItem(getLocalStorageKey(ip)) ?? 'false');
        console.log('isVPN: ', isVPN);
        setIsVpn(isVPN);
      }

      run().catch(console.error);
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

async function getMyIp(): Promise<string> {
  const response = await fetch('https://api64.ipify.org?format=json');
  const jsonResponse = await response.json();
  return jsonResponse.ip;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchVPNStatus(geoip2: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    console.log('Fetching VPN status...');
    geoip2.insights(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (insights: any) => {
        const isVpn = insights.traits.user_type.toLowerCase() === 'hosting';
        resolve(isVpn);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reject
    );
  });
}

function getLocalStorageKey(ip: string): string {
  return `vpn_${ip}`;
}
