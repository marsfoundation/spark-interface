import { Trans } from '@lingui/macro';
import { useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import NetAPYIcon from '../../../public/icons/markets/net-apy-icon.svg';
import PieIcon from '../../../public/icons/markets/pie-icon.svg';
import WalletIcon from '../../../public/icons/markets/wallet-icon.svg';
import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { DSRTooltip } from './DSRTooltip';
import { LiveSDAIBalance } from './LiveSDAIBalance';

export const SDAITopPanel = () => {
  const { loading: appDataLoading, dsr, daiInDSR, reserves } = useAppDataContext();
  const { loading: walletLoading, walletBalances } = useWalletBalances();
  const { currentAccount } = useWeb3Context();
  const sDaiReserve = reserves.find((reserve) => reserve.symbol === 'sDAI');
  const sDaiBalance = walletBalances[sDaiReserve?.underlyingAsset!]?.amount;
  const displayPersonalInfo = currentAccount && sDaiBalance !== '0';

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';

  return (
    <TopInfoPanel pageTitle={<Trans>sDAI</Trans>}>
      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>DAI in DSR</Trans>}
        loading={appDataLoading}
      >
        {daiInDSR && (
          <FormattedNumber
            value={daiInDSR.toString()}
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
        loading={appDataLoading}
      >
        {dsr && (
          <FormattedNumber
            value={dsr.toString()}
            variant={valueTypographyVariant}
            visibleDecimals={2}
            percent
            symbolsColor="#A5A8B6"
            symbolsVariant={symbolsVariant}
            style={gradientAccentStyle}
          />
        )}
      </TopInfoPanelItem>

      {displayPersonalInfo && (
        <TopInfoPanelItem
          icon={<WalletIcon />}
          title={<Trans>Your sDAI balance</Trans>}
          loading={walletLoading}
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
      )}
      {displayPersonalInfo && <LiveSDAIBalance />}
    </TopInfoPanel>
  );
};

const gradientAccentStyle = {
  background: '-webkit-linear-gradient(#ce7c00, #ffe073)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};
