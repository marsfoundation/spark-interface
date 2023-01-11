import { Trans } from '@lingui/macro';
import { BoxProps } from '@mui/material';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useTxBuilderContext } from 'src/hooks/useTxBuilder';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { useTransactionHandler } from '../../../helpers/useTransactionHandler';
import { TxActionsWrapper } from '../TxActionsWrapper';

export interface PSMSwapActionProps extends BoxProps {
  amountToSwap: string;
  poolReserve: ComputedReserveData;
  isWrongNetwork: boolean;
  buyGem: boolean;
}

export const PSMSwapActions = ({
  amountToSwap,
  poolReserve,
  isWrongNetwork,
  buyGem,
  sx,
  ...props
}: PSMSwapActionProps) => {
  const { psmService } = useTxBuilderContext();
  const { currentAccount } = useWeb3Context();

  const { approval, action, requiresApproval, approvalTxState, mainTxState, loadingTxns } =
    useTransactionHandler({
      handleGetTxns: async () => {
        return buyGem
          ? psmService.buyGem({
              userAddress: currentAccount,
              usr: currentAccount,
              gemAmt: amountToSwap,
            })
          : psmService.sellGem({
              userAddress: currentAccount,
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
      handleApproval={() => approval(amountToSwap, poolReserve.underlyingAsset)}
      requiresApproval={requiresApproval}
      actionText={<Trans>Swap</Trans>}
      actionInProgressText={<Trans>Swapping</Trans>}
      sx={sx}
      {...props}
    />
  );
};
