import { Trans } from '@lingui/macro';
import React from 'react';
import { BasicModal } from 'src/components/primitives/BasicModal';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';

import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from './PSMSwapModalContent';

export const PSMSwapModal = () => {
  const { type, close, args } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;
  return (
    <BasicModal open={type === ModalType.PSMSwap} setOpen={close}>
      <ModalWrapper title={<Trans>Swap</Trans>} underlyingAsset={args.underlyingAsset}>
        {(params) => <PSMSwapModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};
