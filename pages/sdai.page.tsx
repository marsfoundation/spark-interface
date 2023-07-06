import { Trans } from '@lingui/macro';
import { Warning } from 'src/components/primitives/Warning';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ContentContainer } from 'src/components/ContentContainer';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { ModalWrapper } from 'src/components/transactions/FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from 'src/components/transactions/PSMSwap/PSMSwapModalContent';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MainLayout } from 'src/layouts/MainLayout';
import { SDAITopPanel } from 'src/modules/sdai/SDAITopPanel';
import { BigNumber } from 'bignumber.js';

export default function SDAI() {
  const { loading: globalLoading, reserves, dsr } = useAppDataContext();

  const daiMarket = reserves.find((reserve) => reserve.symbol === 'DAI')!;
  const sDaiMarket = reserves.find((reserve) => reserve.symbol === 'sDAI')!;

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
                  <Typography component="div" variant="h2" sx={{ mr: 4 }}>
                    <Trans>Savings DAI</Trans>
                  </Typography>
                }
              >
                <Box sx={{ px: { xs: 4, xsm: 6 } }}>
                  <Warning severity="info">
                    <Trans>
                      sDAI is similar to DAI but with the added benefit of earning interest
                      (currently at <strong>{formatPercent(dsr)}</strong>). You can use it just like
                      DAI - own, transfer, and use it in the DeFi ecosystem. Swapping between sDAI
                      and DAI incurs no additional costs, and there is no slippage.
                    </Trans>
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
                  <ModalWrapper
                    title={<Trans>Swap to</Trans>}
                    underlyingAsset={daiMarket.underlyingAsset.toString()}
                  >
                    {(params) => <PSMSwapModalContent {...params} />}
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
