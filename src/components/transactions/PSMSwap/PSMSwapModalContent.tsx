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
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { useModalContext } from 'src/hooks/useModal';

import {
  ComputedReserveData,
  useAppDataContext,
} from '../../../hooks/app-data-provider/useAppDataProvider';
import { CapType } from '../../caps/helper';
import { Link } from '../../primitives/Link';
import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { TxSuccessView } from '../FlowCommons/Success';
import { PSMSwapActions, PSMSwapActionType } from './PSMSwapActions';

export const PSMSwapModalContent = ({
  poolReserve,
  isWrongNetwork,
  hideSwitchSourceToken,
}: ModalWrapperProps) => {
  const { marketReferencePriceInUsd, reserves, chi, tin, tout } = useAppDataContext();
  const { gasLimit, mainTxState: supplyTxState, txError } = useModalContext();
  const { walletBalances } = useWalletBalances();

  const validTypes = new Map<string, Array<PSMSwapActionType>>(
    Object.entries({
      DAI: [PSMSwapActionType.SDAI_REDEEM, PSMSwapActionType.SELL_GEM],
      USDC: [PSMSwapActionType.BUY_GEM],
      sDAI: [PSMSwapActionType.SDAI_DEPOSIT],
    })
  );
  const typeSourceReserveMap = new Map<string, string>(
    Object.entries({
      [PSMSwapActionType.BUY_GEM]: 'DAI',
      [PSMSwapActionType.SELL_GEM]: 'USDC',
      [PSMSwapActionType.SDAI_DEPOSIT]: 'DAI',
      [PSMSwapActionType.SDAI_REDEEM]: 'sDAI',
    })
  );
  const exchangeRate = new Map<string, BigNumber>(
    Object.entries({
      [PSMSwapActionType.BUY_GEM]:
        tout != null ? new BigNumber(1).dividedBy(tout) : new BigNumber(1),
      [PSMSwapActionType.SELL_GEM]:
        tin != null ? new BigNumber(1).dividedBy(tin) : new BigNumber(1),
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
  const poolReserveSwapFrom = reserves.find(
    (reserve) => typeSourceReserveMap.get(type)! === reserve.symbol
  ) as ComputedReserveData;
  const sourceBalance =
    walletBalances[poolReserveSwapFrom.underlyingAsset.toLowerCase()]?.amount || '0';
  const currentExchangeRate = exchangeRate.get(type)!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTypeChange = (e: any) => {
    e.preventDefault();
    setType(currentValidTypes[(currentValidTypes.indexOf(type) + 1) % currentValidTypes.length]);
  };

  // Calculate max amount to supply
  const maxAmountToSwap = new BigNumber(sourceBalance);
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
        symbol={poolReserveSwapFrom.symbol}
      />
    );

  return (
    <>
      {currentValidTypes.length > 1 && !hideSwitchSourceToken ? (
        <Link sx={{ fontWeight: 'bold' }} href="#" onClick={handleTypeChange}>
          Switch Source Token
        </Link>
      ) : null}
      <AssetInput
        value={amount}
        onChange={handleChange}
        usdValue={amountInUsd.toString(10)}
        symbol={poolReserveSwapFrom.symbol}
        assets={[
          {
            balance: maxAmountToSwap.toString(10),
            symbol: poolReserveSwapFrom.symbol,
            iconSymbol: poolReserveSwapFrom.iconSymbol,
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
          symbol={poolReserve.symbol}
          iconSymbol={poolReserve.iconSymbol}
          visibleDecimals={2}
          value={currentExchangeRate.multipliedBy(amount ? amount : 0).toNumber()}
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
