import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
}

export const ContentContainer = ({ children }: ContentContainerProps) => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        mt: { xs: '-32px', lg: '-46px', xl: '-44px', xxl: '-48px' },
        '&:after': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: theme.palette.mode === 'light' ? 'url("backgroundMain.jpg") #ebebeb' : null,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: '-1',
        },
      })}
    >
      <Container>{children}</Container>
    </Box>
  );
};
