import { Box, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { convertToAssets } from 'src/modules/sdai/LiveSDAIBalance';

interface YieldForecastProps {
  sharesAmount: BigNumber;
}

export function YieldForecast(props: YieldForecastProps) {
  const { loading, realDSR: dsr, rho, realChi: chi } = useAppDataContext();
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);

  if (loading || !dsr || !rho || !chi) {
    return null;
  }

  const forecast = forecastYields(
    props.sharesAmount,
    rho,
    dsr,
    chi,
    new BigNumber(currentTimestamp)
  );

  return (
    <Box sx={{ pt: 5 }}>
      <Typography sx={{ mb: 1 }} color="text.secondary">
        Yield Forecast
      </Typography>
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
        <Row caption="30 days" captionVariant="description" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <>
              <FormattedNumber value={forecast.thirtyDays} variant="secondary14" />{' '}
              <TokenIcon symbol={'DAI'} sx={{ ml: 1, fontSize: '16px' }} />
            </>
          </Box>
        </Row>

        <Row caption="90 days" captionVariant="description" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <>
              <FormattedNumber value={forecast.ninetyDays} variant="secondary14" />{' '}
              <TokenIcon symbol={'DAI'} sx={{ ml: 1, fontSize: '16px' }} />
            </>
          </Box>
        </Row>

        <Row caption="1 year" captionVariant="description" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <>
              <FormattedNumber value={forecast.oneYear} variant="secondary14" />{' '}
              <TokenIcon symbol={'DAI'} sx={{ ml: 1, fontSize: '16px' }} />
            </>
          </Box>
        </Row>
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
