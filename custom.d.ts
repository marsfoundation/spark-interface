declare module '*/locales/en/messages.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ProcessEnv {
    CACHE_PATH: string;
    NEXT_PUBLIC_ENABLE_GOVERNANCE: string;
    NEXT_PUBLIC_ENABLE_STAKING: string;
    NEXT_PUBLIC_ENV: string;
    NEXT_PUBLIC_API_BASEURL: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: string;
    NEXT_PUBLIC_FORK_BASE_CHAIN_ID?: string;
    NEXT_PUBLIC_FORK_CHAIN_ID?: string;
    NEXT_PUBLIC_FORK_URL_RPC?: string;
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
    NEXT_PUBLIC_VPN_PROTECTION: string;
    NEXT_PUBLIC_DISABLE_SDAI_MARKET?: '1' | '0';
    NEXT_PUBLIC_HIDE_USDC_DEPOSITS?: '1' | '0';
    NEXT_PUBLIC_ENABLE_GNOSIS?: '1' | '0';
  }
}
