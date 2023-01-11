import { USD_DECIMALS } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import React, { useRef, useState } from 'react';
import { AssetInput } from 'src/components/transactions/AssetInput';
import { GasEstimationError } from 'src/components/transactions/FlowCommons/GasEstimationError';
import {
  DetailsNumberLine,
  DetailsPSMSwap,
  TxModalDetails,
} from 'src/components/transactions/FlowCommons/TxModalDetails';
import { useModalContext } from 'src/hooks/useModal';

import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../hooks/app-data-provider/useAppDataProvider';
import { CapType } from '../../caps/helper';
import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { TxSuccessView } from '../FlowCommons/Success';
import { PSMSwapActions } from './PSMSwapActions';

export const PSMSwapModalContent = ({
  poolReserve,
  isWrongNetwork,
  tokenBalance,
}: ModalWrapperProps) => {
  const { marketReferencePriceInUsd, reserves } = useAppDataContext();
  const { gasLimit, mainTxState: supplyTxState, txError } = useModalContext();
  const poolReserveSwapTo = reserves.find(
    (reserve) =>
      (reserve.symbol === 'DAI' || reserve.symbol === 'USDC') &&
      reserve.symbol !== poolReserve.symbol
  ) as ComputedReserveData;

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

  if (supplyTxState.success)
    return (
      <TxSuccessView
        action={<Trans>Swapped</Trans>}
        amount={amountRef.current}
        symbol={poolReserve.symbol}
      />
    );

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

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine description={<Trans>Fee</Trans>} value={0} percent />
        <DetailsPSMSwap
          description={<Trans>You receive</Trans>}
          symbol={poolReserveSwapTo.symbol}
          iconSymbol={poolReserveSwapTo.iconSymbol}
          value={amount}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <PSMSwapActions
        buyGem={poolReserve.symbol === 'DAI'}
        poolReserve={poolReserve}
        amountToSwap={amount}
        isWrongNetwork={isWrongNetwork}
      />
    </>
  );
};
