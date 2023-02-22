import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useAssetCaps } from 'src/hooks/useAssetCaps';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';

import { CapsHint } from '../../../../components/caps/CapsHint';
import { CapType } from '../../../../components/caps/helper';
import { Link, ROUTES } from '../../../../components/primitives/Link';
import { ListAPRColumn } from '../ListAPRColumn';
import { ListButtonsColumn } from '../ListButtonsColumn';
import { ListItemWrapper } from '../ListItemWrapper';
import { ListValueColumn } from '../ListValueColumn';

export const SupplyAssetsListItem = ({
  symbol,
  iconSymbol,
  name,
  walletBalance,
  walletBalanceUSD,
  supplyCap,
  totalLiquidity,
  supplyAPY,
  aIncentivesData,
  underlyingAsset,
  isActive,
  isFreezed,
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
    <ListItemWrapper
      symbol={symbol}
      iconSymbol={iconSymbol}
      name={name}
      detailsAddress={detailsAddress}
      data-cy={`dashboardSupplyListItem_${symbol.toUpperCase()}`}
      currentMarket={currentMarket}
      showDebtCeilingTooltips
    >
      <ListValueColumn
        symbol={symbol}
        value={Number(walletBalance)}
        subValue={walletBalanceUSD}
        withTooltip={false}
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

      <ListAPRColumn
        value={symbol === 'sDAI' && dsr != null ? dsr.toNumber() : Number(supplyAPY)}
        incentives={aIncentivesData}
        symbol={symbol}
        tooltip={
          symbol === 'sDAI' && dsr != null ? (
            <Trans>
              This is the Dai Savings Rate, and not the supply rate. You earn this automatically
              when converting your DAI to sDAI.
            </Trans>
          ) : null
        }
      />

      <ListButtonsColumn>
        {showSwap && (
          <Button
            sx={(theme) => ({
              color: theme.palette.common.white,
              background: '#4caf50',
              '&:hover, &.Mui-focusVisible': {
                background: '#8bc34a',
              },
            })}
            variant="contained"
            onClick={() => openPSMSwap(underlyingAsset)}
          >
            <Trans>Swap</Trans>
          </Button>
        )}
        {!hideSupply && (
          <Button
            disabled={!isActive || isFreezed || Number(walletBalance) <= 0}
            variant="contained"
            onClick={() => openSupply(underlyingAsset)}
          >
            <Trans>Supply</Trans>
          </Button>
        )}
        {!(showSwap && !hideSupply) && (
          <Button
            variant="outlined"
            component={Link}
            href={ROUTES.reserveOverview(detailsAddress, currentMarket)}
          >
            <Trans>Details</Trans>
          </Button>
        )}
      </ListButtonsColumn>
    </ListItemWrapper>
  );
};
