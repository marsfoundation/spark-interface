import { Trans } from '@lingui/macro';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import { useState } from 'react';
import { Disclaimers } from 'src/components/ConnectWalletPaper';
import { ContentContainer } from 'src/components/ContentContainer';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { ModalWrapper } from 'src/components/transactions/FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from 'src/components/transactions/PSMSwap/PSMSwapModalContent';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { SDAIEtherscanLink } from 'src/modules/sdai/SDAIEtherscanLink';
import { SDAITopPanel } from 'src/modules/sdai/SDAITopPanel';

export default function SDAI() {
  const { loading: globalLoading, reserves, dsr } = useAppDataContext();
  const [mode, setMode] = useState<'dai-to-sdai' | 'sdai-to-dai'>('dai-to-sdai');

  const daiMarket = reserves.find((reserve) => reserve.symbol === 'DAI')!;
  const sDaiMarket = reserves.find((reserve) => reserve.symbol === 'sDAI')!;
  const currentMarket = mode === 'dai-to-sdai' ? sDaiMarket : daiMarket;

  const loading = globalLoading || !dsr || !reserves;

  const { breakpoints } = useTheme();
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  const { currentAccount } = useWeb3Context();

  return (
    <>
      <SDAITopPanel />
      <ContentContainer>
        {!loading && (
          <Box
            sx={{ display: 'block', width: paperWidth, marginLeft: 'auto', marginRight: 'auto' }}
          >
            <ListWrapper
              titleComponent={
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  sx={{ width: '100%' }}
                >
                  <SDAIEtherscanLink />
                </Stack>
              }
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', px: 5 }}>
                <Typography variant="h2" sx={{ fontSize: '1.6125rem', textAlign: 'center' }}>
                  Deposit your DAI to SavingsDAI and earn{' '}
                  <span style={gradientAccentStyle}>{formatPercent(dsr)}</span> now
                </Typography>
              </Box>

              {currentAccount ? (
                <Box
                  sx={{
                    m: 5,
                    p: { xs: 4, xsm: 6 },
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                  }}
                >
                  <StyledToggleButtonGroup
                    color="primary"
                    value={mode}
                    exclusive
                    onChange={(_, value) => setMode(value)}
                    sx={{
                      width: '100%',
                      height: '44px',
                      marginBottom: '20px',
                    }}
                  >
                    <StyledToggleButton value="dai-to-sdai" disabled={mode === 'dai-to-sdai'}>
                      <Typography variant="subheader1">
                        <Trans>Deposit</Trans>
                      </Typography>
                    </StyledToggleButton>
                    <StyledToggleButton value="sdai-to-dai" disabled={mode === 'sdai-to-dai'}>
                      <Typography variant="subheader1">
                        <Trans>Withdraw</Trans>
                      </Typography>
                    </StyledToggleButton>
                  </StyledToggleButtonGroup>

                  <ModalWrapper
                    title={<Trans>Swap to</Trans>}
                    underlyingAsset={currentMarket.underlyingAsset.toString()}
                    key={mode} // forces component to be destroyed and recreated from scratch. These modal components are not written to handle re-renders with different props.
                    minimal
                  >
                    {(params) => <PSMSwapModalContent {...params} hideSwitchSourceToken />}
                  </ModalWrapper>
                </Box>
              ) : (
                <NotAuthorized />
              )}
            </ListWrapper>
          </Box>
        )}
      </ContentContainer>
    </>
  );
}

SDAI.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

function formatPercent(value: BigNumber): string {
  return `${value.multipliedBy(100).toNumber().toFixed(2)}%`;
}

function NotAuthorized() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        m: 5,
        backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'white',
        borderRadius: 2,
      }}
    >
      <Disclaimers />
      <ConnectWalletButton />
    </Box>
  );
}

const gradientAccentStyle = {
  fontWeight: 700,
  background: '-webkit-linear-gradient(#ce7c00, #D9BE62)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};
