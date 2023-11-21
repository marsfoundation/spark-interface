// PlaygroundControls.tsx
import { useWeb3React } from '@web3-react/core'
import useSelectChain from 'hooks/useSelectChain'
import useSyncChainQuery from 'hooks/useSyncChainQuery'
import { useTenderlyPlayground } from 'hooks/useTenderlyFork'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components/macro'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'

export default function PlaygroundControls() {
  const { chainId } = useWeb3React()
  const {
    aNewPlayground: aNewTenderlyForkProvider,
    playgroundProvider: tenderlyForkProvider,
    isPlayground,
    discardPlayground,
  } = useTenderlyPlayground()
  const selectChain = useSelectChain()
  const blockNumber = useBlockNumber()
  useSyncChainQuery()

  const createPlayground = useCallback(async () => {
    await aNewTenderlyForkProvider(chainId)
  }, [chainId, aNewTenderlyForkProvider])

  const blockExternalLinkHref = useMemo(() => {
    if (!chainId || !blockNumber) {
      return ''
    }

    if (tenderlyForkProvider) {
      return tenderlyForkProvider?.publicUrl || ''
    }

    return getExplorerLink(chainId, blockNumber.toString(), ExplorerDataType.BLOCK)
  }, [chainId, tenderlyForkProvider, blockNumber])

  const connectChain = useCallback(async () => {
    if (!tenderlyForkProvider) {
      return
    }
    await selectChain(Number.parseInt(tenderlyForkProvider.baseChainId))
    await discardPlayground()
  }, [discardPlayground, tenderlyForkProvider, selectChain])

  return (
    <ControlsPane>
      <Button href={blockExternalLinkHref}>Explorer</Button>
      {!isPlayground && <Button onClick={createPlayground}>Playground</Button>}
      {isPlayground && <Button onClick={createPlayground}>Clear Playground</Button>}
      {isPlayground && <Button onClick={connectChain}>Back To Network</Button>}
    </ControlsPane>
  )
}

const ControlsPane = styled.a`
  display: inline-flex;
  height: 70px;
  padding: 16px;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;

  border-radius: 16px;
  border: 1px solid #e5e4ef;
  background: #fff;
  margin-top: 50px;
  position: absolute;
  bottom: 30px;
`

const Button = styled.a`
  display: flex;
  padding: 10px 24px;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid #e4e3ee;
  background: #f5f6fc;
  box-shadow: 0px 1px 4px 0px rgba(23, 23, 24, 0.07);
  border-radius: 8px;
  border: 1px solid #e4e3ee;
  background: #f5f6fc;
  box-shadow: 0px 1px 4px 0px rgba(23, 23, 24, 0.07);
  color: #38363a;
  font-size: 14px;
  font-family: Inter;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
`