import { useMediaQuery, useTheme } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TopInfoPanelItem } from 'src/components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';

import UptrendIcon from '../../../public/icons/markets/uptrend-icon.svg';

export function LiveSDAIBalance() {
  const {
    loading: appDataLoading,
    realDSR: dsr,
    rho,
    realChi: chi,
    reserves,
  } = useAppDataContext();
  const { loading: walletLoading, walletBalances } = useWalletBalances();
  const loading = appDataLoading || walletLoading;
  const sDaiReserve = reserves.find((reserve) => reserve.symbol === 'sDAI');
  const sDaiBalance = walletBalances[sDaiReserve?.underlyingAsset!]?.amount;
  const utcTimestamp = Math.floor(new Date().getTime() / 1000);

  const daiBalance =
    dsr &&
    rho &&
    chi &&
    convertToAssets(new BigNumber(sDaiBalance), rho, dsr, chi, new BigNumber(utcTimestamp));

  useRefresh(500);

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanelItem
      icon={<UptrendIcon />}
      title={<div style={{ display: 'flex' }}>Your sDAI worth</div>}
      loading={loading}
    >
      <FormattedNumber
        value={daiBalance ? daiBalance.toString() : 0}
        symbol="DAI"
        variant={valueTypographyVariant}
        visibleDecimals={getVisibleDecimals(daiBalance)}
        compact={false}
        symbolsColor="#A5A8B6"
        symbolsVariant={symbolsVariant}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      />
    </TopInfoPanelItem>
  );
}

export function convertToAssets(
  shares: BigNumber,
  rho: BigNumber,
  dsr: BigNumber,
  chi: BigNumber,
  now: BigNumber
): BigNumber {
  const updated_chi = dsr.dividedBy(RAY).pow(now.minus(rho)).multipliedBy(chi).dividedBy(RAY);
  return shares.multipliedBy(WEI).multipliedBy(updated_chi).dividedBy(WEI);
}

const WEI = new BigNumber(10).pow(18);
const RAY = new BigNumber(10).pow(27);

function useRefresh(ms: number) {
  const [_, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), ms);
    return () => {
      clearInterval(interval);
    };
  }, []);
}

const getVisibleDecimals = (daiBalance: BigNumber | undefined): number => {
  const changeRatio = 1.55e-9;
  const value = daiBalance?.multipliedBy(changeRatio);

  if (!value) {
    return 0;
  }

  const e = value.e;

  if (!e || e >= 0) return 0;

  const decimals = -e;

  if (decimals === 1) return 2;

  if (decimals > 6) return 7;

  return decimals;
};
