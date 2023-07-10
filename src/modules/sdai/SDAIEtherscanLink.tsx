import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Button, SvgIcon, Typography } from '@mui/material';
import { DarkTooltip } from 'src/components/infoTooltips/DarkTooltip';
import { Link } from 'src/components/primitives/Link';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

export const SDAIEtherscanLink = () => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const { loading, reserves } = useAppDataContext();
  const sDaiReserve = reserves.find((reserve) => reserve.symbol === 'sDAI');
  const sDaiAddress = sDaiReserve?.underlyingAsset;

  if (loading) {
    return <></>;
  }

  return (
    <DarkTooltip title="sDAI Contract">
      <Button
        startIcon={
          <img
            src={'/icons/tokens/sdai.svg'}
            alt={currentNetworkConfig.name}
            style={{ width: 14, height: 14 }}
          />
        }
        endIcon={
          <SvgIcon sx={{ width: 14, height: 14 }}>
            <ExternalLinkIcon />
          </SvgIcon>
        }
        component={Link}
        href={currentNetworkConfig.explorerLinkBuilder({ address: sDaiAddress })}
        variant="outlined"
        size="small"
      >
        <Typography variant="buttonS">
          <Trans>sDAI Contract</Trans>
        </Typography>
      </Button>
    </DarkTooltip>
  );
};
