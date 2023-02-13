import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
}

export const TopInfoPanel = ({ children }: TopInfoPanelProps) => {
  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.background.header,
        pt: { xs: 10, md: 12 },
        pb: { xs: 18, md: 20, lg: '94px', xl: '92px', xxl: '96px' },
        color: '#F1F1F3',
      })}
    >
      <Container sx={{ pb: 0 }}>
        <Box sx={{ px: { xs: 4, xsm: 6 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, xsm: 8 },
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
