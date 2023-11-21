import { useWeb3React } from '@web3-react/core'
import { aTenderlyFork, TenderlyForkProvider } from 'components/Web3Status/tenderly-fork-api'
import { removeTenderlyChainIdPrefix, TENDERLY_CHAIN_FORK_PREFIX } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { ethers } from 'ethers'
import { atom } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useCallback } from 'react'

const provider = atom<TenderlyForkProvider | undefined>(undefined)
const providerState = atom<'CREATING' | 'RUNNING'>('RUNNING')

export function useActiveTenderlyFork() {
  return { tenderlyFork: useAtomValue(provider) != null, forkProvider: useAtomValue(provider) || undefined }
}

export function useTenderlyPlayground(): {
  playgroundProvider?: TenderlyForkProvider
  isPlayground: boolean
  aNewPlayground: (chainId?: number) => Promise<void>
  discardPlayground: () => Promise<void>
} {
  const prov = useAtomValue(provider)
  return {
    playgroundProvider: prov,
    isPlayground: !!prov,
    aNewPlayground: useNewFork(),
    discardPlayground: useRemoveFork(),
  }
}

function useNewFork() {
  const currentProvider = useAtomValue(provider)
  const updateProvider = useUpdateAtom(provider)
  const updateProviderState = useUpdateAtom(providerState)
  const currentChainId = useWeb3React().chainId

  return useCallback(
    async (chainId: number | undefined = -1) => {
      if (currentProvider) {
        console.log('removing provider', currentProvider.rpcUrl)
        try {
          await currentProvider.removeFork()
        } catch (error) {
          console.warn('Errored out when deleting the old fork', error)
        }
      } else {
        console.log('no fork provider')
      }

      updateProviderState('CREATING')

      if (chainId == -1 && currentChainId) {
        chainId = currentChainId
      }
      chainId = removeTenderlyChainIdPrefix(chainId)
      const _forkProvider = await aTenderlyFork({
        network_id: '' + chainId,
        chain_config: { chain_id: Number.parseInt(`${TENDERLY_CHAIN_FORK_PREFIX}${chainId}`) },
        shared: true,
      })
      updateProvider(_forkProvider)
      await addForkToMetamask(_forkProvider)
      await topUpConnectedSigner(_forkProvider)
    },
    [currentProvider, updateProvider, updateProviderState, currentChainId]
  )
}

async function topUpConnectedSigner(forkProvider: TenderlyForkProvider) {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    console.log('Address', await signer.getAddress())
    console.log('top up: Fork provider', forkProvider.rpcUrl)

    await forkProvider.provider.send('tenderly_setBalance', [
      [await signer.getAddress()],
      ethers.utils.hexValue(ethers.utils.parseUnits('100', 'ether').toHexString()),
    ])

    const balanceRead = await forkProvider.provider.send('eth_getBalance', [await signer.getAddress(), 'latest'])

    console.log(`Balance of ${signer.getAddress()} is ${balanceRead}`)
  }
}

async function addForkToMetamask(forkProvider: TenderlyForkProvider) {
  const forkUrl = forkProvider.rpcUrl
  if (!forkUrl) {
    console.log('No Fork')
    return
  }

  if (typeof window.ethereum !== 'undefined') {
    const noc = nativeOnChain(forkProvider.chainId)
    //@ts-ignore
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${forkProvider.chainId.toString(16)}`,
          rpcUrls: [forkUrl],
          chainName: `Forked ${forkProvider.chainId}`,
          nativeCurrency: {
            name: noc.name,
            symbol: noc.symbol,
            decimals: noc.decimals,
          },
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ],
    })
  } else {
    console.log('Metamask is not installed')
  }
}

function useRemoveFork() {
  const currentProvider = useAtomValue(provider)
  const setProvider = useUpdateAtom(provider)
  return useCallback(async () => {
    await currentProvider?.removeFork()
    setProvider(undefined)
  }, [currentProvider, setProvider])
}