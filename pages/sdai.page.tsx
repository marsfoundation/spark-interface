import { Trans } from '@lingui/macro';
import { Box, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import { useState } from 'react';
import { Disclaimers } from 'src/components/ConnectWalletPaper';
import { ContentContainer } from 'src/components/ContentContainer';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Warning } from 'src/components/primitives/Warning';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from 'src/components/TopInfoPanel/TopInfoPanelItem';
import { ModalWrapper } from 'src/components/transactions/FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from 'src/components/transactions/PSMSwap/PSMSwapModalContent';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { MainLayout } from 'src/layouts/MainLayout';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { AddTokenToWallet } from 'src/modules/sdai/AddTokenToWallet';
import { SDAIEtherscanLink } from 'src/modules/sdai/SDAIEtherscanLink';
import { SDAITopPanel } from 'src/modules/sdai/SDAITopPanel';
import { CustomMarket } from 'src/ui-config/marketsConfig';

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
  const { currentMarket: market, setCurrentMarket } = useProtocolDataContext();

  if (market !== CustomMarket.proto_spark_v3) {
    return (
      <>
        <TopInfoPanel
          titleComponent={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PageTitle
                pageTitle={<Trans>sDAI</Trans>}
                withMarketSwitcher={true}
                withMigrateButton={false}
              />
            </Box>
          }
        >
          <TopInfoPanelItem hideIcon title={null}>
            <Warning severity="warning">
              <Trans>
                sDAI is not available in this market, please switch to{' '}
                <Link
                  component="button"
                  onClick={() => setCurrentMarket(CustomMarket.proto_spark_v3)}
                >
                  mainnet
                </Link>
                .
              </Trans>
            </Warning>
          </TopInfoPanelItem>
        </TopInfoPanel>
        <ContentContainer />
      </>
    );
  }

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
                <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ width: '100%' }}
                  >
                    <AddTokenToWallet
                      address={sDaiMarket.underlyingAsset}
                      decimals={sDaiMarket.decimals}
                      symbol={sDaiMarket.symbol}
                      image={sDaiIconUrl}
                      imageLink="/icons/tokens/sdai.svg"
                      style={{ marginRight: '5px' }}
                    />
                    {''}
                    <SDAIEtherscanLink />
                  </Stack>
                </>
              }
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', px: 5 }}>
                <Typography variant="h2" sx={{ fontSize: '1.6125rem', textAlign: 'center' }}>
                  Deposit your DAI to SavingsDAI and earn{' '}
                  <span style={gradientAccentStyle}>{formatPercent(dsr)}</span> APY
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

// sDAI svg encoded as base64
const sDaiIconUrl =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iLjUiIHgyPSIuNSIgeTE9IjEuMTQyIiB5Mj0iLS4xMDUiIGdyYWRpZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0Y2FmNTAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4YmMzNGEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIgZmlsbD0idXJsKCNhKSIgZGF0YS1uYW1lPSJFbGxpcHNlIDEyNzEiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMzkuODI1IDIwLjg3NWgtMi45NjdjLTEuNjMzLTQuNTMzLTYuMDI1LTcuNjQyLTExLjgxNy03LjY0MmgtOS41MjV2Ny42NDJoLTMuMzA4djIuNzQyaDMuMzA4djIuODc1aC0zLjMwOHYyLjc0MWgzLjMwOHY3LjU1aDkuNTI1YzUuNzI1IDAgMTAuMDgzLTMuMDgzIDExLjc1OC03LjU1aDMuMDI1di0yLjc0MmgtMi4zNThhMTIuNDMzIDEyLjQzMyAwIDAgMCAuMDkyLTEuNDgzdi0uMDY3YzAtLjQ1LS4wMjUtLjg5Mi0uMDY3LTEuMzI1aDIuMzQydi0yLjc0MnptLTIxLjY0Mi01LjJoNi44NThjNC4yNSAwIDcuNDA4IDIuMDkyIDguODY3IDUuMTkySDE4LjE4M3ptNi44NTggMTguNjQyaC02Ljg1OHYtNS4wOTJoMTUuNzA4Yy0xLjQ2NiAzLjA1LTQuNjE2IDUuMDkxLTguODUgNS4wOTF6bTkuNzU4LTkuMjVhOS44NTkgOS44NTkgMCAwIDEtLjEgMS40MTdIMTguMTgzdi0yLjg3NWgxNi41MjVhMTAuODQgMTAuODQgMCAwIDEgLjA5MiAxLjM5MnoiIGRhdGEtbmFtZT0iUGF0aCA3NTM2Ii8+PC9zdmc+Cg==';
