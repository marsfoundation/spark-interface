import { Trans } from '@lingui/macro';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import { useState } from 'react';
import { ContentContainer } from 'src/components/ContentContainer';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { Warning } from 'src/components/primitives/Warning';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { ModalWrapper } from 'src/components/transactions/FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from 'src/components/transactions/PSMSwap/PSMSwapModalContent';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MainLayout } from 'src/layouts/MainLayout';
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

  return (
    <>
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
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                  >
                    <Typography component="div" variant="h2" sx={{ mr: 4 }}>
                      <Trans>Savings DAI</Trans>
                    </Typography>
                    <SDAIEtherscanLink />
                  </Stack>
                }
              >
                <Box sx={{ px: { xs: 4, xsm: 6 } }}>
                  <Warning severity="info">
                    sDAI is similar to DAI but with the added benefit of earning interest (currently
                    at <strong>{formatPercent(dsr)}</strong>). You can use it just like DAI - own,
                    transfer, and use it in the DeFi ecosystem. Swapping between sDAI and DAI incurs
                    no additional costs, and there is no slippage.
                  </Warning>
                </Box>

                <Box
                  sx={{
                    m: 10,
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
                        <Trans>DAI → sDAI</Trans>
                      </Typography>
                    </StyledToggleButton>
                    <StyledToggleButton value="sdai-to-dai" disabled={mode === 'sdai-to-dai'}>
                      <Typography variant="subheader1">
                        <Trans>sDAI → DAI</Trans>
                      </Typography>
                    </StyledToggleButton>
                  </StyledToggleButtonGroup>

                  <ModalWrapper
                    title={<Trans>Swap to</Trans>}
                    underlyingAsset={currentMarket.underlyingAsset.toString()}
                    key={mode} // forces component to be destroyed and recreated from scratch. These modal components are not written to handle re-renders with different props.
                  >
                    {(params) => <PSMSwapModalContent {...params} hideSwitchSourceToken />}
                  </ModalWrapper>
                </Box>
              </ListWrapper>
            </Box>
          )}
        </ContentContainer>
      </>
    </>
  );
}

SDAI.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

function formatPercent(value: BigNumber): string {
  return `${value.multipliedBy(100).toNumber().toFixed(2)}%`;
}
