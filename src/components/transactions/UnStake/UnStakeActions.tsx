import { EthereumTransactionTypeExtended, GasType } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, BoxProps, Button, CircularProgress } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useTransactionHandler } from '../../../helpers/useTransactionHandler';
import { useGasStation } from 'src/hooks/useGasStation';
import { GasOption } from '../GasStation/GasStationProvider';
import { RightHelperText } from '../FlowCommons/RightHelperText';
import { TxState } from 'src/helpers/types';
import { useStakeTxBuilderContext } from 'src/hooks/useStakeTxBuilder';

export interface UnStakeActionProps extends BoxProps {
  amountToUnStake: string;
  isWrongNetwork: boolean;
  setTxState: Dispatch<SetStateAction<TxState>>;
  customGasPrice?: string;
  handleClose: () => void;
  setGasLimit: Dispatch<SetStateAction<string | undefined>>;
  symbol: string;
  blocked: boolean;
  selectedToken: string;
}

export const UnStakeActions = ({
  amountToUnStake,
  setTxState,
  handleClose,
  setGasLimit,
  isWrongNetwork,
  sx,
  symbol,
  blocked,
  selectedToken,
  ...props
}: UnStakeActionProps) => {
  const { currentAccount, chainId: connectedChainId } = useWeb3Context();
  const { state, gasPriceData } = useGasStation();
  const stakingService = useStakeTxBuilderContext(selectedToken);

  const { action, loading, mainTxState } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () => {
      const tx: EthereumTransactionTypeExtended[] = await stakingService.redeem(
        currentAccount,
        amountToUnStake.toString()
      );
      const gas: GasType | null = await tx[tx.length - 1].gas();
      setGasLimit(gas?.gasLimit);
      return tx;
    },
    customGasPrice:
      state.gasOption === GasOption.Custom
        ? state.customGas
        : gasPriceData.data?.[state.gasOption].legacyGasPrice,
    skip: !amountToUnStake || parseFloat(amountToUnStake) === 0 || blocked,
    deps: [amountToUnStake],
  });

  const hasAmount = amountToUnStake && amountToUnStake !== '0';

  useEffect(() => {
    setTxState({
      success: !!mainTxState.txHash,
      txError: mainTxState.txError,
      gasEstimationError: mainTxState.gasEstimationError,
    });
  }, [setTxState, mainTxState]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }} {...props}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}
      >
        <RightHelperText
          actionHash={mainTxState.txHash}
          chainId={connectedChainId}
          action="unstake"
        />
      </Box>
      {!hasAmount && (
        <Button variant="outlined" disabled>
          <Trans>ENTER AN AMOUNT</Trans>
        </Button>
      )}
      {hasAmount && !mainTxState.txHash && !mainTxState.txError && (
        <Button
          variant="contained"
          onClick={action}
          disabled={loading || isWrongNetwork || blocked || !!mainTxState.gasEstimationError}
        >
          {loading ? (
            <>
              <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
              <Trans>UNSTAKE</Trans>
            </>
          ) : (
            <Trans>UNSTAKE {symbol}</Trans>
          )}
        </Button>
      )}
      {(mainTxState.txHash || mainTxState.txError) && (
        <Button onClick={handleClose} variant="contained">
          {!mainTxState.txError && <Trans>OK, </Trans>}
          <Trans>CLOSE</Trans>
        </Button>
      )}
    </Box>
  );
};