import { Trans } from '@lingui/macro';
import { TextWithTooltip, TextWithTooltipProps } from 'src/components/TextWithTooltip';

export const DSRTooltip = ({ ...rest }: TextWithTooltipProps) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>
        The yield comes from fees paid by DAI borrowers. The DSR rate is subject to change based on
        MakerDAO governance votes.
      </Trans>
    </TextWithTooltip>
  );
};
