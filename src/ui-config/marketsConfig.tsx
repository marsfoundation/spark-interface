import { ChainId } from '@aave/contract-helpers';
import { ReactNode } from 'react';

// Enable for premissioned market
// import { PermissionView } from 'src/components/transactions/FlowCommons/PermissionView';

export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  // the network the market operates on
  chainId: ChainId;
  enabledFeatures?: {
    liquiditySwap?: boolean;
    staking?: boolean;
    governance?: boolean;
    faucet?: boolean;
    collateralRepay?: boolean;
    incentives?: boolean;
    permissions?: boolean;
  };
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    L2_ENCODER?: string;
    UI_POOL_DATA_PROVIDER: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
    COLLECTOR?: string;
    CHAINLOG: string;
    SAVINGS_DAI: string;
    V3_MIGRATOR?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated aave for healtfactor warning notification
   * the integration doesn't follow aave market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};

export enum CustomMarket {
  // v3 test networks
  proto_spark_goerli_v3 = 'proto_spark_goerli_v3',
  // v3 mainnets
  proto_spark_v3 = 'proto_spark_v3',
  // external
  // permissioned_market = 'permissioned_market',
}

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.proto_spark_v3]: {
    marketTitle: 'Spark Protocol',
    v3: true,
    chainId: ChainId.mainnet,
    enabledFeatures: {
      incentives: false,
      collateralRepay: false,
      liquiditySwap: false,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: ''.toLowerCase(),
      LENDING_POOL: '',
      WETH_GATEWAY: '',
      WALLET_BALANCE_PROVIDER: '',
      UI_POOL_DATA_PROVIDER: '',
      UI_INCENTIVE_DATA_PROVIDER: '',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0x83f20f44975d03b1b09e64809b757c47f942beea',
    },
  },
  [CustomMarket.proto_spark_goerli_v3]: {
    marketTitle: 'Spark Protocol Görli',
    v3: true,
    chainId: ChainId.goerli,
    enabledFeatures: {
      faucet: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x026a5B6114431d8F3eF2fA0E1B2EDdDccA9c540E'.toLowerCase(),
      LENDING_POOL: '0x26ca51Af4506DE7a6f0785D20CD776081a05fF6d',
      WETH_GATEWAY: '0xe6fC577E87F7c977c4393300417dCC592D90acF8',
      FAUCET: '0xe2bE5BfdDbA49A86e27f3Dd95710B528D43272C2',
      WALLET_BALANCE_PROVIDER: '0x261135877A92B42183c998bFB8580558a28377a6',
      UI_POOL_DATA_PROVIDER: '0x36eddc380C7f370e5f05Da5Bd7F970a27f063e39',
      UI_INCENTIVE_DATA_PROVIDER: '0x1472B7d120ab62D60f60e1D804B3858361c3C475',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c',
    },
  },
} as const;
