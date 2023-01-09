import {
  FaucetService,
  IncentivesControllerInterface,
  IncentivesControllerV2Interface,
  LendingPool,
  PoolInterface,
  PsmService,
} from '@aave/contract-helpers';
import React, { useContext } from 'react';

export interface TxBuilderContextInterface {
  lendingPool: LendingPool | PoolInterface;
  faucetService: FaucetService;
  incentivesTxBuilder: IncentivesControllerInterface;
  incentivesTxBuilderV2: IncentivesControllerV2Interface;
  psmService: PsmService;
}

export const TxBuilderContext = React.createContext({} as TxBuilderContextInterface);
export const useTxBuilderContext = () => useContext(TxBuilderContext);
