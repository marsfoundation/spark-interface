import { BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import { ReactNode } from 'react';
import { ROUTES } from 'src/components/primitives/Link';
import { ENABLE_TESTNET } from 'src/utils/marketsAndNetworksConfig';

import DiscordIcon from '/public/icons/discord.svg';
import GithubIcon from '/public/icons/github.svg';

import { MarketDataType } from '../marketsConfig';

interface Navigation {
  link: string;
  title: string;
  isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.dashboard,
    title: t`Dashboard`,
    dataCy: 'menuDashboard',
  },
  {
    link: ROUTES.markets,
    title: t`Markets`,
    dataCy: 'menuMarkets',
  },
  {
    link: ROUTES.sDAI,
    title: `sDAI`,
    dataCy: 'menuSDAI',
  },
  {
    link: ROUTES.staking,
    title: t`Stake`,
    dataCy: 'menuStake',
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true' &&
      process.env.NEXT_PUBLIC_ENV === 'prod' &&
      !ENABLE_TESTNET,
  },
  {
    link: ROUTES.governance,
    title: t`Governance`,
    dataCy: 'menuGovernance',
    isVisible: () =>
      process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === 'true' &&
      process.env.NEXT_PUBLIC_ENV === 'prod' &&
      !ENABLE_TESTNET,
  },
  {
    link: ROUTES.faucet,
    title: t`Faucet`,
    isVisible: () => process.env.NEXT_PUBLIC_ENV === 'staging' || ENABLE_TESTNET,
  },
];

interface MoreMenuItem extends Navigation {
  icon: ReactNode;
  makeLink?: (walletAddress: string) => string;
}

const moreMenuItems: MoreMenuItem[] = [
  {
    link: 'https://docs.sparkprotocol.io/faq/',
    title: t`FAQ`,
    icon: <QuestionMarkCircleIcon />,
  },
  {
    link: 'https://docs.sparkprotocol.io/hub/',
    title: t`Developers`,
    icon: <BookOpenIcon />,
  },
  {
    link: 'https://discord.gg/sqDWzqvdUc',
    title: t`Discord`,
    icon: <DiscordIcon />,
  },
  {
    link: 'https://github.com/phoenixlabsresearch/spark-interface',
    title: t`Github`,
    icon: <GithubIcon />,
  },
];

export const moreMenuExtraItems: MoreMenuItem[] = [];
export const moreMenuMobileOnlyItems: MoreMenuItem[] = [];

export const moreNavigation: MoreMenuItem[] = [...moreMenuItems, ...moreMenuExtraItems];

export const mobileNavigation: Navigation[] = [
  ...navigation,
  ...moreMenuItems,
  ...moreMenuMobileOnlyItems,
];
