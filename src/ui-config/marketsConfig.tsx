import { ChainId } from '@aave/contract-helpers';
import { ReactNode } from 'react';
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
  cachingServerUrl?: string;
  cachingWSServerUrl?: string;
  rpcOnly?: boolean;
  isFork?: boolean;
  permissionComponent?: ReactNode;
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
    },
  },
  [CustomMarket.proto_spark_goerli_v3]: {
    marketTitle: 'Spark Lend Görli',
    v3: true,
    chainId: ChainId.goerli,
    enabledFeatures: {
      // Note: We should remove this based on the addresses that you provide in the addresses below
      faucet: true,
      // governance: true,
      // staking: true,
      // incentives: true,
    },
    rpcOnly: true,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x5919a05a22d723A19FC13A84088b1F09663619D9'.toLowerCase(),
      LENDING_POOL: '0xE74b8755cD743d6aba31De89db523BFab0624A16',
      WETH_GATEWAY: '0x697b5041d9eB05b018D70BB57Fccd8D939D9E91b',
      FAUCET: '0x9Fee6aE83Beb0A85d2eB87d6762b645259d40f91',
      WALLET_BALANCE_PROVIDER: '0x71144e6A3EF5C7F99Be26715895FAFf58A2a7642',
      UI_POOL_DATA_PROVIDER: '0x153447b905BE178977D8cF5A652E5CD006afcd3c',
      UI_INCENTIVE_DATA_PROVIDER: '0x849e3dfC2BdEc61e10A3535B4675A888B0d0Aab6',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
    },
  },
} as const;
