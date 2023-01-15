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
import { PSMSwapActions, PSMSwapActionType } from './PSMSwapActions';

export const PSMSwapModalContent = ({
  poolReserve,
  isWrongNetwork,
  tokenBalance,
}: ModalWrapperProps) => {
  const { marketReferencePriceInUsd, reserves, chi } = useAppDataContext();
  const { gasLimit, mainTxState: supplyTxState, txError } = useModalContext();

  const validTypes = new Map<string, Array<PSMSwapActionType>>(
    Object.entries({
      DAI: [PSMSwapActionType.BUY_GEM, PSMSwapActionType.SDAI_DEPOSIT],
      USDC: [PSMSwapActionType.SELL_GEM],
      sDAI: [PSMSwapActionType.SDAI_REDEEM],
    })
  );
  const typeTargetReserveMap = new Map<string, string>(
    Object.entries({
      [PSMSwapActionType.BUY_GEM]: 'USDC',
      [PSMSwapActionType.SELL_GEM]: 'DAI',
      [PSMSwapActionType.SDAI_DEPOSIT]: 'sDAI',
      [PSMSwapActionType.SDAI_REDEEM]: 'DAI',
    })
  );
  const exchangeRate = new Map<string, BigNumber>(
    Object.entries({
      [PSMSwapActionType.BUY_GEM]: new BigNumber(1),
      [PSMSwapActionType.SELL_GEM]: new BigNumber(1),
      [PSMSwapActionType.SDAI_DEPOSIT]: new BigNumber(chi != null ? chi : 0),
      [PSMSwapActionType.SDAI_REDEEM]: new BigNumber(
        chi != null ? new BigNumber(1).dividedBy(chi) : 0
      ),
    })
  );
  const currentValidTypes = validTypes.get(poolReserve.symbol)!;

  // states
  const [_amount, setAmount] = useState('');
  const amountRef = useRef<string>('');
  const [type, setType] = useState(currentValidTypes[0]);
  const poolReserveSwapTo = reserves.find(
    (reserve) => typeTargetReserveMap.get(type)! === reserve.symbol
  ) as ComputedReserveData;
  const currentExchangeRate = exchangeRate.get(type)!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTypeChange = (e: any) => {
    e.preventDefault();
    setType(currentValidTypes[(currentValidTypes.indexOf(type) + 1) % currentValidTypes.length]);
  };

  // Calculate max amount to supply
  const maxAmountToSwap = new BigNumber(tokenBalance);
  const isMaxSelected = _amount === '-1';
  const amount = isMaxSelected ? maxAmountToSwap.toString(10) : _amount;

  const handleChange = (value: string) => {
    const maxSelected = value === '-1';
    amountRef.current = maxSelected ? maxAmountToSwap.toString(10) : value;
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
            balance: maxAmountToSwap.toString(10),
            symbol: poolReserve.symbol,
            iconSymbol: poolReserve.iconSymbol,
          },
        ]}
        capType={CapType.supplyCap}
        isMaxSelected={isMaxSelected}
        disabled={supplyTxState.loading}
        maxValue={maxAmountToSwap.toString(10)}
      />

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={<Trans>Exchange Rate</Trans>}
          value={1}
          futureValue={currentExchangeRate.toNumber()}
          visibleDecimals={4}
        />
        <DetailsPSMSwap
          description={<Trans>You receive</Trans>}
          symbol={poolReserveSwapTo.symbol}
          iconSymbol={poolReserveSwapTo.iconSymbol}
          visibleDecimals={2}
          value={currentExchangeRate.multipliedBy(amount ? amount : 0).toNumber()}
          switchToHandle={currentValidTypes.length > 1 ? handleTypeChange : undefined}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      <PSMSwapActions
        type={type}
        poolReserve={poolReserve}
        amountToSwap={amount}
        isWrongNetwork={isWrongNetwork}
        exchangeRate={currentExchangeRate.toNumber()}
      />
    </>
  );
};
