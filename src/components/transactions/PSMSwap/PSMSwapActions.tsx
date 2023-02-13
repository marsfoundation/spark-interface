import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { useTransactionHandler } from '../../../helpers/useTransactionHandler';
import { TxActionsWrapper } from '../TxActionsWrapper';

export interface PSMSwapActionProps extends BoxProps {
  amountToSwap: string;
  exchangeRate: number;
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  type: PSMSwapActionType;
}

export enum PSMSwapActionType {
  BUY_GEM = 'buyGem',
  SELL_GEM = 'sellGem',
  SDAI_DEPOSIT = 'sDAIDeposit',
  SDAI_REDEEM = 'sDAIRedeem',
}

export const PSMSwapActions = ({
  amountToSwap,
  exchangeRate,
  poolReserve,
  isWrongNetwork,
  type,
  sx,
  ...props
}: PSMSwapActionProps) => {
  const { buyGem, sellGem, sDAIDeposit, sDAIRedeem } = useRootStore();
  const { currentAccount } = useWeb3Context();

  const { approval, action, requiresApproval, approvalTxState, mainTxState, loadingTxns } =
    useTransactionHandler({
      handleGetTxns: async () => {
        switch (type) {
          case PSMSwapActionType.BUY_GEM:
            return buyGem({
              usr: currentAccount,
              gemAmt: amountToSwap,
            });
          case PSMSwapActionType.SELL_GEM:
            return sellGem({
              usr: currentAccount,
              gemAmt: amountToSwap,
            });
          case PSMSwapActionType.SDAI_DEPOSIT:
            return sDAIDeposit({
              receiver: currentAccount,
              assets: amountToSwap,
            });
          case PSMSwapActionType.SDAI_REDEEM:
            return sDAIRedeem({
              receiver: currentAccount,
              owner: currentAccount,
              shares: amountToSwap,
            });
        }
      },
      skip:
        !amountToSwap || parseFloat(amountToSwap) === 0 || exchangeRate === 0 || !currentAccount,
      deps: [amountToSwap, type],
    });

  return (
    <TxActionsWrapper
      mainTxState={mainTxState}
      approvalTxState={approvalTxState}
      preparingTransactions={loadingTxns}
      handleAction={action}
      requiresAmount
      amount={amountToSwap}
      isWrongNetwork={isWrongNetwork}
      handleApproval={() =>
        approval([{ amount: amountToSwap, underlyingAsset: poolReserve.underlyingAsset }])
      }
      requiresApproval={requiresApproval}
      actionText={<Trans>Swap</Trans>}
      actionInProgressText={<Trans>Swapping</Trans>}
      sx={sx}
      {...props}
    />
  );
};
