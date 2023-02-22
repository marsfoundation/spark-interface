import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Warning } from 'src/components/primitives/Warning';
import { NetworkConfig } from 'src/ui-config/networksConfig';

import { Link } from '../../../../components/primitives/Link';

type WalletEmptyInfoProps = Pick<NetworkConfig, 'bridge' | 'name'> & {
  chainId: number;
  icon?: boolean;
  sx?: SxProps<Theme>;
  symbol?: string;
};

export function WalletEmptyInfo({ bridge, name, chainId, icon, sx, symbol }: WalletEmptyInfoProps) {
  const network = [ChainId.avalanche].includes(chainId) ? 'Ethereum & Bitcoin' : 'Ethereum';
  return (
    <Warning severity="info" icon={icon} sx={sx}>
      {bridge ? (
        <Trans>
          Your {name} wallet is empty. Purchase or transfer assets or use{' '}
          {<Link href={bridge.url}>{bridge.name}</Link>} to transfer your {network} assets.
        </Trans>
      ) : (
        <Trans>
          Your {name} wallet is empty. Purchase or transfer assets.{' '}
          {symbol === 'wstETH' && (
            <Link href="https://stake.lido.fi/wrap">Wrap your Lido stETH here.</Link>
          )}
        </Trans>
      )}
    </Warning>
  );
}
