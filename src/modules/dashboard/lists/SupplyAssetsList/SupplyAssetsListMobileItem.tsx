import { Trans } from '@lingui/macro';
import { Box, Button } from '@mui/material';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { IncentivesCard } from '../../../../components/incentives/IncentivesCard';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { Row } from '../../../../components/primitives/Row';
import { useModalContext } from '../../../../hooks/useModal';
import { SpkAirdropNoteInline } from '../BorrowAssetsList/BorrowAssetsListItem';
import { ListItemCanBeCollateral } from '../ListItemCanBeCollateral';
import { ListMobileItemWrapper } from '../ListMobileItemWrapper';
import { ListValueRow } from '../ListValueRow';

export const SupplyAssetsListMobileItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  supplyCap,
  totalLiquidity,
  supplyAPY,
  aIncentivesData,
  isIsolated,
  usageAsCollateralEnabledOnUser,
  isActive,
  isFreezed,
  underlyingAsset,
  detailsAddress,
  showSwap,
  hideSupply,
}: DashboardReserve) => {
  const { currentMarket } = useProtocolDataContext();
  const { dsr } = useAppDataContext();
  const { openSupply, openPSMSwap } = useModalContext();

  // Hide the asset to prevent it from being supplied if supply cap has been reached
  const { supplyCap: supplyCapUsage } = useAssetCaps();
  if (supplyCapUsage.isMaxed) return null;

  return (
    <ListMobileItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      underlyingAsset={underlyingAsset}
      currentMarket={currentMarket}
      showDebtCeilingTooltips
    >
      <ListValueRow
        title={<Trans>Deposit balance</Trans>}
        value={Number(walletBalance)}
        subValue={walletBalanceUSD}
        disabled={Number(walletBalance) === 0}
        capsComponent={
          <CapsHint
            capType={CapType.supplyCap}
            capAmount={supplyCap}
            totalAmount={totalLiquidity}
            withoutText
          />
        }
      />

      <Row
        caption={
          symbol === 'sDAI' && dsr != null ? (
            <Trans>Dai Savings Rate APY</Trans>
          ) : (
            <Trans>Deposit APY</Trans>
          )
        }
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <IncentivesCard
          value={symbol === 'sDAI' && dsr != null ? dsr.toNumber() : Number(supplyAPY)}
          incentives={aIncentivesData}
          symbol={symbol}
          variant="secondary14"
        />
      </Row>

      {(symbol === 'ETH' || symbol === 'WETH') && (
        <SpkAirdropNoteInline
          tokenAmount={6}
          Wrapper={<Row caption="Airdrop" align="flex-start" captionVariant="description" mb={2} />}
        />
      )}

      <Row
        caption={<Trans>Can be collateral</Trans>}
        align="flex-start"
        captionVariant="description"
        mb={2}
      >
        <ListItemCanBeCollateral
          isIsolated={isIsolated}
          usageAsCollateralEnabled={usageAsCollateralEnabledOnUser}
        />
      </Row>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
        {!hideSupply && (
          <Button
            sx={(theme) => ({
              color: theme.palette.common.white,
              background: '#4caf50',
              '&:hover, &.Mui-focusVisible': {
                background: '#8bc34a',
              },
              mr: 1.5,
            })}
            disabled={!isActive || isFreezed || Number(walletBalance) <= 0}
            variant="contained"
            onClick={() => openSupply(underlyingAsset)}
            fullWidth
          >
            <Trans>Deposit</Trans>
          </Button>
        )}
        {showSwap && (
          <Button variant="contained" onClick={() => openPSMSwap(underlyingAsset)} fullWidth>
            <Trans>Swap</Trans>
          </Button>
        )}
        {!(showSwap && !hideSupply) && (
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
            fullWidth
          >
            <Trans>Details</Trans>
          </Button>
        )}
      </Box>
    </ListMobileItemWrapper>
  );
};
