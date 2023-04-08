import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { Warning } from 'src/components/primitives/Warning';

export const USDCMigrationWarning: React.FC = () => {
  return (
    <Warning
      icon={false}
      sx={{
        mb: 4,
      }}
      severity="error"
    >
      <Typography variant="caption" component="span">
        <Trans>Spark Protocol only supports DAI, so your USDC will be converted into DAI.</Trans>{' '}
      </Typography>
    </Warning>
  );
};
