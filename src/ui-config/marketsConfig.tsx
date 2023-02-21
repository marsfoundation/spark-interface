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
    marketTitle: 'Spark',
    v3: true,
    chainId: ChainId.mainnet,
    enabledFeatures: {
      incentives: false,
      collateralRepay: false,
      liquiditySwap: false,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB'.toLowerCase(),
      LENDING_POOL: '0xcdc9D7811974744355d74819D044b2B92D75b83e',
      WETH_GATEWAY: '0xF6a8aD553b265405526030c2102fda2bDcdDC177',
      WALLET_BALANCE_PROVIDER: '0x09120eAED8e4cD86D85a616680151DAA653880F2',
      UI_POOL_DATA_PROVIDER: '0x666432Ccb747B2220875cE185f487Ed53677faC9',
      UI_INCENTIVE_DATA_PROVIDER: '0xeC1BB74f5799811c0c1Bff94Ef76Fb40abccbE4a',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0x83f20f44975d03b1b09e64809b757c47f942beea',
    },
  },
  [CustomMarket.proto_spark_goerli_v3]: {
    marketTitle: 'Spark Lend Görli',
    v3: true,
    chainId: ChainId.goerli,
    enabledFeatures: {
      faucet: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x5EEE318E5668d578b820d3C80152482E01fcE5cA'.toLowerCase(),
      LENDING_POOL: '0xcce82ac5CE8Be2718a8112d2dD9155836b131C27',
      WETH_GATEWAY: '0x92b5E6Dd63beCCE038d79e93c3f5A942AeC72E81',
      FAUCET: '0x8F80DD3d4da2696272051593cDC69D7c0E826803',
      WALLET_BALANCE_PROVIDER: '0x2d7753D92d2Dbf4F6a3981cC11337898978C4bFF',
      UI_POOL_DATA_PROVIDER: '0x8e0872C40Ba6866CdE563Ea53D848F505973846d',
      UI_INCENTIVE_DATA_PROVIDER: '0x4d09464B8bee521Ff9Fca93B832DC53c6960D45f',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c',
    },
  },
} as const;
