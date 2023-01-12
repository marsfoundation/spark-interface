import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';

import { useTransactionHandler } from '../../../helpers/useTransactionHandler';
import { TxActionsWrapper } from '../TxActionsWrapper';

export interface PSMSwapActionProps extends BoxProps {
  amountToSwap: string;
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  buyGemMode: boolean;
}

export const PSMSwapActions = ({
  amountToSwap,
  poolReserve,
  isWrongNetwork,
  buyGemMode,
  sx,
  ...props
}: PSMSwapActionProps) => {
  const { buyGem, sellGem } = useRootStore();
  const { currentAccount } = useWeb3Context();

  const { approval, action, requiresApproval, approvalTxState, mainTxState, loadingTxns } =
    useTransactionHandler({
      handleGetTxns: async () => {
        return buyGemMode
          ? buyGem({
              usr: currentAccount,
              gemAmt: amountToSwap,
            })
          : sellGem({
              usr: currentAccount,
              gemAmt: amountToSwap,
            });
      },
      skip: !amountToSwap || parseFloat(amountToSwap) === 0 || !currentAccount,
      deps: [amountToSwap],
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
        approval({ amount: amountToSwap, underlyingAsset: poolReserve.underlyingAsset })
      }
      requiresApproval={requiresApproval}
      actionText={<Trans>Swap</Trans>}
      actionInProgressText={<Trans>Swapping</Trans>}
      sx={sx}
      {...props}
    />
  );
};
