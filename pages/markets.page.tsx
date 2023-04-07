import { ContentContainer } from 'src/components/ContentContainer';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { MainLayout } from 'src/layouts/MainLayout';
import { MarketAssetsListContainer } from 'src/modules/markets/MarketAssetsListContainer';
import { MarketsTopPanel } from 'src/modules/markets/MarketsTopPanel';
import { CustomMarket } from 'src/ui-config/marketsConfig';

export default function Markets() {
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  if (currentMarket === CustomMarket.proto_mainnet) setCurrentMarket(CustomMarket.proto_spark_v3);
  return (
    <>
      <MarketsTopPanel />
      <ContentContainer>
        <MarketAssetsListContainer />
      </ContentContainer>
    </>
  );
}

Markets.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
