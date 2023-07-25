import { Box, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { convertToAssets } from 'src/modules/sdai/LiveSDAIBalance';

interface YieldForecastProps {
  sharesAmount: BigNumber;
}

export function YieldForecast({ sharesAmount }: YieldForecastProps) {
  const { loading, realDSR: dsr, rho, realChi: chi } = useAppDataContext();
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);

  if (loading || !dsr || !rho || !chi) {
    return null;
  }

  const forecast = forecastYields(sharesAmount, rho, dsr, chi, new BigNumber(currentTimestamp));

  const rows = [
    {
      caption: '30 days',
      daiValue: forecast.thirtyDays,
    },
    {
      caption: '90 days',
      daiValue: forecast.ninetyDays,
    },
    {
      caption: '1 year',
      daiValue: forecast.oneYear,
    },
  ];

  return (
    <Box sx={{ pt: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography color="text.secondary">Yield Forecast</Typography>
        <YieldTooltip />
      </Box>
      <Box
        sx={(theme) => ({
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          '.MuiBox-root:last-of-type': {
            mb: 0,
          },
        })}
      >
        {rows.map((row, index) => (
          <Row caption={row.caption} captionVariant="description" mb={4} key={index}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <>
                <FormattedNumber
                  value={sharesAmount.toString()}
                  variant="secondary14"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                />{' '}
                <TokenIcon symbol={'sDAI'} sx={{ mx: 1, fontSize: '16px' }} /> worth{' '}
                <FormattedNumber
                  value={row.daiValue}
                  variant="secondary14"
                  sx={{ ml: 1, fontSize: '16px', fontVariantNumeric: 'tabular-nums' }}
                />{' '}
                <TokenIcon symbol={'DAI'} sx={{ ml: 1, fontSize: '16px' }} />
              </>
            </Box>
          </Row>
        ))}
      </Box>
    </Box>
  );
}

function forecastYields(
  shares: BigNumber,
  rho: BigNumber,
  dsr: BigNumber,
  chi: BigNumber,
  now: BigNumber
) {
  const DAY = 60 * 60 * 24;
  return {
    thirtyDays: convertToAssets(
      new BigNumber(shares),
      rho,
      dsr,
      chi,
      now.plus(new BigNumber(DAY * 30))
    ),
    ninetyDays: convertToAssets(
      new BigNumber(shares),
      rho,
      dsr,
      chi,
      now.plus(new BigNumber(DAY * 90))
    ),
    oneYear: convertToAssets(
      new BigNumber(shares),
      rho,
      dsr,
      chi,
      now.plus(new BigNumber(DAY * 365))
    ),
  };
}

function YieldTooltip() {
  return (
    <TextWithTooltip>
      <>
        Yield is calculated based on the current parameters of the MakerDAO protocol. These
        parameters can change based on the will of MakerDAO governance, rendering this forecast
        obsolete.
      </>
    </TextWithTooltip>
  );
}
