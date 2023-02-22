import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { Box, Tooltip } from '@mui/material';
import { ReactNode } from 'react';

import { IncentivesCard } from '../../../components/incentives/IncentivesCard';
import { ListColumn } from '../../../components/lists/ListColumn';

interface ListAPRColumnProps {
  value: number;
  incentives?: ReserveIncentiveResponse[];
  symbol: string;
  tooltip?: ReactNode;
}

export const ListAPRColumn = ({ value, incentives, symbol, tooltip }: ListAPRColumnProps) => {
  return (
    <ListColumn>
      {tooltip != null ? (
        <Tooltip
          title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {tooltip}
            </Box>
          }
          arrow
          placement="top"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IncentivesCard
              value={value}
              incentives={incentives}
              symbol={symbol}
              data-cy={`apyType`}
            />
            <div style={{ paddingLeft: '3px' }}>*</div>
          </Box>
        </Tooltip>
      ) : (
        <IncentivesCard value={value} incentives={incentives} symbol={symbol} data-cy={`apyType`} />
      )}
    </ListColumn>
  );
};
