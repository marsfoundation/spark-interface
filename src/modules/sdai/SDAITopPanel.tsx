import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';

import NetAPYIcon from '../../../public/icons/markets/net-apy-icon.svg';
import PieIcon from '../../../public/icons/markets/pie-icon.svg';
import WalletIcon from '../../../public/icons/markets/wallet-icon.svg';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { DSRTooltip } from './DSRTooltip';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';

export const SDAITopPanel = () => {
  const { loading: appDataLoading, dsr, sDaiTotalAssets, reserves } = useAppDataContext();
  const { loading: walletLoading, walletBalances } = useWalletBalances();
  const loading = appDataLoading || walletLoading;
  const sDaiReserve = reserves.find((reserve) => reserve.symbol === 'sDAI');
  const sDaiBalance = walletBalances[sDaiReserve?.underlyingAsset!]?.amount;

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel pageTitle={<Trans>sDAI</Trans>}>
      <TopInfoPanelItem icon={<PieIcon />} title={<Trans>sDAI Market cap</Trans>} loading={loading}>
        {sDaiTotalAssets && (
          <FormattedNumber
            value={sDaiTotalAssets}
            symbol="DAI"
            variant={valueTypographyVariant}
            visibleDecimals={2}
            compact
            symbolsColor="#A5A8B6"
            symbolsVariant={symbolsVariant}
          />
        )}
      </TopInfoPanelItem>

      <TopInfoPanelItem
        icon={<NetAPYIcon />}
        title={
          <div style={{ display: 'flex' }}>
            <Trans>DSR Rate</Trans>
            <DSRTooltip />
          </div>
        }
        loading={loading}
      >
        {dsr && (
          <FormattedNumber
            value={dsr}
            variant={valueTypographyVariant}
            visibleDecimals={2}
            percent
            symbolsColor="#A5A8B6"
            symbolsVariant={symbolsVariant}
          />
        )}
      </TopInfoPanelItem>

      <TopInfoPanelItem
        icon={<WalletIcon />}
        title={<Trans>Your sDAI balance</Trans>}
        loading={loading}
      >
        {sDaiBalance && (
          <FormattedNumber
            value={sDaiBalance}
            symbol="sDAI"
            variant={valueTypographyVariant}
            visibleDecimals={2}
            compact
            symbolsColor="#A5A8B6"
            symbolsVariant={symbolsVariant}
          />
        )}
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
