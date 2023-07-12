import { Trans } from '@lingui/macro';

import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';

export const PredictableAPYTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>Predictable interest rate is set by MakerDAO governance (Stability Scope).</Trans>
    </TextWithTooltip>
  );
};
