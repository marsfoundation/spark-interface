import { Button, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import { DarkTooltip } from 'src/components/infoTooltips/DarkTooltip';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

export function AddTokenToWallet({
  address,
  decimals,
  symbol,
  image,
  style,
  imageLink,
}: {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
  imageLink?: string;
  style?: CSSProperties | undefined;
}) {
  const { addERC20Token } = useWeb3Context();

  return (
    <DarkTooltip title={`Track ${symbol} holdings in your wallet`}>
      <Button
        startIcon={
          <img src={imageLink} alt={`Add ${symbol} to wallet`} style={{ width: 14, height: 14 }} />
        }
        onClick={() => {
          addERC20Token({
            address,
            decimals,
            symbol,
            image: image,
          });
        }}
        variant="outlined"
        size="small"
        style={style}
      >
        <Typography variant="buttonS">Add {symbol} to wallet</Typography>
      </Button>
    </DarkTooltip>
  );
}
