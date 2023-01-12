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
      LENDING_POOL_ADDRESS_PROVIDER: '0x9a92018Def4fF783B2c0B3dc0F5F42D6078f5e4A'.toLowerCase(),
      LENDING_POOL: '0xd0AE3f8a3baF66273a025fEBf90756e95252882D',
      WETH_GATEWAY: '0xDdE785Df606d4ddd9C5390d5907000040df11ad9',
      FAUCET: '0x0F6BfDB3f2410e85763e0e576fE8D56bbfE17a1e',
      WALLET_BALANCE_PROVIDER: '0xc30AE0D2a28047F4f8eCc26574A9A8991b2D8AE7',
      UI_POOL_DATA_PROVIDER: '0xF06D0a76CecEA047ad52dA0eA3ED773fF1F365EF',
      UI_INCENTIVE_DATA_PROVIDER: '0x9775ad0010880024Ae0979949A9db3a3eBcECaaC',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
    },
  },
} as const;
