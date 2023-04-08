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
  proto_mainnet = 'proto_mainnet',
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
      liquiditySwap: true,
      collateralRepay: true,
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE'.toLowerCase(),
      LENDING_POOL: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
      WETH_GATEWAY: '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704',
      WALLET_BALANCE_PROVIDER: '0xd2AeF86F51F92E8e49F42454c287AE4879D1BeDc',
      UI_POOL_DATA_PROVIDER: '0xF028c2F4b19898718fD0F77b9b881CbfdAa5e8Bb',
      UI_INCENTIVE_DATA_PROVIDER: '0xA7F8A757C4f7696c015B595F51B2901AC0121B18',
      COLLECTOR: '0xb137E7d16564c81ae2b0C8ee6B55De81dd46ECe5',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0x83f20f44975d03b1b09e64809b757c47f942beea',
      V3_MIGRATOR: '0x8899e0510a152144826385D44c9C963B5168c7d8',
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
      COLLECTOR: '0x0D56700c90a690D8795D6C148aCD94b12932f4E3',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0xd8134205b0328f5676aaefb3b2a0dc15f4029d8c',
    },
  },
  [CustomMarket.proto_mainnet]: {
    marketTitle: 'Ethereum',
    chainId: ChainId.mainnet,
    enabledFeatures: {
    },
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5'.toLowerCase(),
      LENDING_POOL: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
      WETH_GATEWAY: '0xEFFC18fC3b7eb8E676dac549E0c693ad50D1Ce31',
      WALLET_BALANCE_PROVIDER: '0x8E8dAd5409E0263a51C0aB5055dA66Be28cFF922',
      UI_POOL_DATA_PROVIDER: '0x00e50FAB64eBB37b87df06Aa46b8B35d5f1A4e1A',
      UI_INCENTIVE_DATA_PROVIDER: '0xD01ab9a6577E1D84F142e44D49380e23A340387d',
      COLLECTOR: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
      CHAINLOG: '0xdA0Ab1e0017DEbCd72Be8599041a2aa3bA7e740F',
      SAVINGS_DAI: '0x83f20f44975d03b1b09e64809b757c47f942beea',
      V3_MIGRATOR: '0x8899e0510a152144826385D44c9C963B5168c7d8',
    },
  },
} as const;
