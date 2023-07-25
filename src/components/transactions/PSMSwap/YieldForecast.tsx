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
  const isEmpty = sharesAmount.isZero();

  return (
    <Box sx={{ pt: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography color="text.secondary">Yield Forecast</Typography>
        <YieldTooltip />
        {isEmpty && <div style={{ marginLeft: '5px' }}>-</div>}
      </Box>

      {!isEmpty && (
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
            <Typography variant="secondary12">Duration</Typography>
            <Typography variant="secondary12">Earnings</Typography>
            <Typography variant="secondary12">Net value</Typography>
            {forecast.map((row) => (
              <>
                <p>{row.caption}</p>

                <p>
                  <FormattedNumber
                    value={row.earned.toString()}
                    variant="secondary14"
                    sx={{ ml: 1, fontSize: '16px', fontVariantNumeric: 'tabular-nums' }}
                  />{' '}
                  DAI
                </p>

                <p>
                  <FormattedNumber
                    value={row.daiValue.toString()}
                    variant="secondary14"
                    sx={{ ml: 1, fontSize: '16px', fontVariantNumeric: 'tabular-nums' }}
                  />{' '}
                  DAI
                </p>
              </>
            ))}
          </Box>
        </Box>
      )}
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
  const baseValue = convertToAssets(shares, rho, dsr, chi, now);

  const thirtyDays = convertToAssets(
    new BigNumber(shares),
    rho,
    dsr,
    chi,
    now.plus(new BigNumber(DAY * 30))
  );
  const ninetyDays = convertToAssets(
    new BigNumber(shares),
    rho,
    dsr,
    chi,
    now.plus(new BigNumber(DAY * 90))
  );
  const oneYear = convertToAssets(
    new BigNumber(shares),
    rho,
    dsr,
    chi,
    now.plus(new BigNumber(DAY * 365))
  );

  return [
    {
      caption: '30 days',
      daiValue: thirtyDays,
      earned: thirtyDays.minus(baseValue),
    },
    {
      caption: '90 days',
      daiValue: ninetyDays,
      earned: ninetyDays.minus(baseValue),
    },
    {
      caption: '1 year',
      daiValue: oneYear,
      earned: oneYear.minus(baseValue),
    },
  ];
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
