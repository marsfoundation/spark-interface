import { CustomMarket } from 'src/ui-config/marketsConfig';

import { useProtocolDataContext } from './useProtocolDataContext';

export const useShowAirdropInfo = () => {
  const { currentMarket } = useProtocolDataContext();

  return (
    currentMarket === CustomMarket.proto_spark_v3 ||
    currentMarket === ('fork_proto_spark_v3' as any) // workaround to make it work on fork mainnet too
  );
};
