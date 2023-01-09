import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React, { useRef, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { Asset, AssetInput } from 'src/components/transactions/AssetInput';
import { GasEstimationError } from 'src/components/transactions/FlowCommons/GasEstimationError';
import {
  DetailsHFLine,
  DetailsIncentivesLine,
  DetailsNumberLine,
  TxModalDetails,
} from 'src/components/transactions/FlowCommons/TxModalDetails';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useSwap } from 'src/hooks/useSwap';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { remainingCap } from 'src/utils/getMaxAmountAvailableToSupply';
import { calculateHFAfterSwap } from 'src/utils/hfUtils';

import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../hooks/app-data-provider/useAppDataProvider';
import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { TxSuccessView } from '../FlowCommons/Success';
import { ErrorType, flashLoanNotAvailable, useFlashloan } from '../utils';
import { PSMSwapActions } from './PSMSwapActions';
import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from '@aave/math-utils';
import { CapType } from '../../caps/helper';

export const PSMSwapModalContent = ({
  poolReserve,
  userReserve,
  isWrongNetwork,
  tokenBalance,
}: ModalWrapperProps) => {
  const { marketReferencePriceInUsd, reserves, user } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const { currentAccount } = useWeb3Context();
  const { gasLimit, mainTxState: supplyTxState, txError } = useModalContext();

  // states
  const [_amount, setAmount] = useState('');
  const amountRef = useRef<string>('');

  // Calculate max amount to supply
  const maxAmountToSupply = new BigNumber(tokenBalance);
  const isMaxSelected = _amount === '-1';
  const amount = isMaxSelected ? maxAmountToSupply.toString(10) : _amount;

  const handleChange = (value: string) => {
    const maxSelected = value === '-1';
    amountRef.current = maxSelected ? maxAmountToSupply.toString(10) : value;
    setAmount(value);
  };

  // Calculation of future HF
  const amountIntEth = new BigNumber(amount).multipliedBy(
    poolReserve.formattedPriceInMarketReferenceCurrency
  );
  // TODO: is it correct to ut to -1 if user doesnt exist?
  const amountInUsd = amountIntEth.multipliedBy(marketReferencePriceInUsd).shiftedBy(-USD_DECIMALS);
  const totalCollateralMarketReferenceCurrencyAfter = user
    ? valueToBigNumber(user.totalCollateralMarketReferenceCurrency).plus(amountIntEth)
    : '-1';

  return (
    <>
      <AssetInput
        value={amount}
        onChange={handleChange}
        usdValue={amountInUsd.toString(10)}
        symbol={poolReserve.symbol}
        assets={[
          {
            balance: maxAmountToSupply.toString(10),
            symbol: poolReserve.symbol,
            iconSymbol: poolReserve.iconSymbol,
          },
        ]}
        capType={CapType.supplyCap}
        isMaxSelected={isMaxSelected}
        disabled={supplyTxState.loading}
        maxValue={maxAmountToSupply.toString(10)}
      />

      <TxModalDetails gasLimit={gasLimit} />

      {txError && <GasEstimationError txError={txError} />}

      <PSMSwapActions
        poolReserve={poolReserve}
        amountToSwap={amount}
        symbol={poolReserve.symbol}
      />
    </>
  );
};
