import { Trans } from '@lingui/macro';
import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { usePermissions } from 'src/hooks/usePermissions';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { CustomMarket } from 'src/ui-config/marketsConfig';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { DashboardContentWrapper } from '../src/modules/dashboard/DashboardContentWrapper';
import { DashboardTopPanel } from '../src/modules/dashboard/DashboardTopPanel';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { uiConfig } from 'src/uiConfig';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';

export default function Home() {
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  useEffect(() => {
    if (currentMarket === CustomMarket.proto_mainnet) setCurrentMarket(CustomMarket.proto_spark_v3);
  }, [setCurrentMarket, currentMarket]);

  // @todo improve this
  // if (loading) return null;

  return (
    <>
      <TopInfoPanel>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <Typography component="div" variant="h1" sx={{ mr: 4 }}>
            Welcome to
          </Typography>
          <Box
            sx={{
              lineHeight: 0,
              mr: 3,
              transition: '0.3s ease all',
              '&:hover': { opacity: 0.7 },
            }}
          >
            <img src={uiConfig.appLogo} alt="An SVG of the Spark logo" height={50} />
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <Typography component="div" variant="h3" sx={{ mr: 4, fontWeight: 'normal' }}>
            The advanced lending engine powered by
          </Typography>
          <Box
            sx={{
              lineHeight: 0,
              mr: 3,
              transition: '0.3s ease all',
              '&:hover': { opacity: 0.7 },
            }}
          >
            <img src={uiConfig.makerLogo} alt="An SVG of the Spark logo" height={20} />
          </Box>
        </Box>
      </TopInfoPanel>

      <ContentContainer>
        <ContentWrapper />
      </ContentContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

const ContentWrapper = () => {
  const { breakpoints } = useTheme();
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  return (
    <Box
      sx={{
        display: isDesktop ? 'flex' : 'block',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ width: paperWidth }}>
        <BorrowPaper />
      </Box>

      <Box sx={{ width: paperWidth }}>
        <SDaiPaper />
      </Box>
    </Box>
  );
};

function BorrowPaper() {
  const { reserves, loading } = useAppDataContext();
  if (loading) {
    return null;
  }

  const daiReserve = reserves.find((reserve) => reserve.symbol === 'DAI')!;
  const daiBorrowRate = daiReserve.variableBorrowRate;
  const daiBorrowRateHumanReadable =
    (parseInt(daiReserve.variableBorrowRate.slice(0, 3)) / 100).toFixed(2) + '%';

  return (
    <Paper
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        '&:before': {
          content: "''",
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.03)',
          borderRadius: '8px',
        },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: 10,
        }}
      >
        <Typography component="div" variant="h3" sx={{ fontWeight: 'normal' }}>
          Borrow DAI at <span style={{ fontWeight: 'bold' }}>{daiBorrowRateHumanReadable}</span>!
        </Typography>

        <Link href="/dashboard">
          <Button variant="contained" sx={{ mt: 5 }}>
            <Trans>Borrow</Trans>
          </Button>
        </Link>
      </Box>
    </Paper>
  );
}

function SDaiPaper() {
  const { reserves, loading } = useAppDataContext();
  if (loading) {
    return null;
  }

  const daiReserve = reserves.find((reserve) => reserve.symbol === 'DAI')!;
  const daiBorrowRate = daiReserve.variableBorrowRate;

  return (
    <Paper
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        '&:before': {
          content: "''",
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.03)',
          borderRadius: '8px',
        },
      })}
    >
      <h2>sDAI</h2>
    </Paper>
  );
}
