import { ExclamationIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, SvgIcon } from '@mui/material';

import { ContentWithTooltip } from '../ContentWithTooltip';
import { Link } from '../primitives/Link';

interface FrozenTooltipProps {
  symbol?: string;
  currentMarket?: string;
}

export const getFrozenProposalLink = (
  symbol: string | undefined,
  currentMarket: string | undefined
): string => {
  symbol;
  currentMarket; // Prevent warnings
  return 'https://vote.makerdao.com/polling';
};

export const FrozenTooltip = ({ symbol, currentMarket }: FrozenTooltipProps) => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <Trans>
            This asset is frozen due to an Spark Protocol Governance decision.{' '}
            <Link
              href={getFrozenProposalLink(symbol, currentMarket)}
              sx={{ textDecoration: 'underline' }}
            >
              <Trans>More details</Trans>
            </Link>
          </Trans>
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: '20px', color: 'error.main', ml: 2 }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
