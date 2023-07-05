import { Trans } from '@lingui/macro';
import { ContentContainer } from 'src/components/ContentContainer';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { ModalWrapper } from 'src/components/transactions/FlowCommons/ModalWrapper';
import { PSMSwapModalContent } from 'src/components/transactions/PSMSwap/PSMSwapModalContent';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { MainLayout } from 'src/layouts/MainLayout';
import { SDAITopPanel } from 'src/modules/sdai/SDAITopPanel';

export default function SDAI() {
  const { loading, reserves } = useAppDataContext();

  const daiMarket = reserves.find((reserve) => reserve.symbol === 'DAI');
  const sDaiMarket = reserves.find((reserve) => reserve.symbol === 'sDAI');

  return (
    <>
      <>
        <SDAITopPanel />
        <ContentContainer>
          {!loading && daiMarket && (
            <ListWrapper titleComponent={'sDAI'}>
              <ModalWrapper
                title={<Trans>Swap to</Trans>}
                underlyingAsset={daiMarket.underlyingAsset.toString()}
              >
                {(params) => <PSMSwapModalContent {...params} />}
              </ModalWrapper>
            </ListWrapper>
          )}
        </ContentContainer>
      </>
    </>
  );
}

SDAI.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
