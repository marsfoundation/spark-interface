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

        const isAllowed = await fetchIpStatus(ip);
        const isVPN = !isAllowed;

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

async function fetchIpStatus(ip: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_API_BASEURL}/ip/status?ip=${ip}`;
  const response = await fetch(url);
  const jsonResponse = await response.json();
  return jsonResponse.allowed;
}
