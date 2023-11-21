import { JsonRpcProvider } from '@ethersproject/providers'
import axios, { AxiosResponse } from 'axios'

const { REACT_APP_TENDERLY_PROJECT_SLUG, REACT_APP_TENDERLY_ACCESS_KEY, REACT_APP_TENDERLY_USERNAME } = process.env

export async function aTenderlyFork(fork: TenderlyForkRequest): Promise<TenderlyForkProvider> {
  const forkResponse = await tenderlyBaseApi.post(
    `account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}/fork/`,
    fork
  )

  const forkId = forkResponse.data.root_transaction.fork_id

  const rpcUrl = `https://rpc.tenderly.co/fork/${forkId}`
  const forkProvider = new JsonRpcProvider(rpcUrl)

  const blockNumberStr = (forkResponse.data.root_transaction.receipt.blockNumber as string).replace('0x', '')
  const blockNumber = Number.parseInt(blockNumberStr, 16)
  const privateUrl = `https://dashboard.tenderly.co/account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}/fork/${forkId}`
  const publicUrl = `https://dashboard.tenderly.co/shared/fork/${forkId}/transactions`

  console.info(
    `\nForked ${fork.network_id} 
  at block ${blockNumber} 
  with chain ID ${fork.chain_config?.chain_id}
  fork ID: ${forkId} 
`
  )
  console.info('Fork:', privateUrl)

  return {
    rpcUrl,
    provider: forkProvider,
    blockNumber,
    forkUUID: forkId,
    removeFork: () => removeFork(forkId),
    networkId: fork.network_id as any,
    publicUrl,
    privateUrl,
    chainId: forkResponse.data.simulation_fork.chain_config.chain_id,
    baseChainId: fork.network_id,
  }
}

async function removeFork(forkId: string) {
  console.log('Removing test fork', forkId)
  return await tenderlyBaseApi.delete(
    `account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT_SLUG}/fork/${forkId}`
  )
}

const tenderlyBaseApi = axios.create({
  baseURL: `https://api.tenderly.co/api/v1/`,
  headers: {
    'X-Access-Key': REACT_APP_TENDERLY_ACCESS_KEY || '',
    'Content-Type': 'application/json',
  },
})

type TenderlyForkRequest = {
  shared?: boolean
  block_number?: number
  network_id: string
  transaction_index?: number
  initial_balance?: number
  alias?: string
  description?: string
  chain_config?: {
    chain_id?: number
    homestead_block?: number
    dao_fork_support?: boolean
    eip_150_block?: number
    eip_150_hash?: string
    eip_155_block?: number
    eip_158_block?: number
    byzantium_block?: number
    constantinople_block?: number
    petersburg_block?: number
    istanbul_block?: number
    berlin_block?: number
  }
}

export type TenderlyForkProvider = {
  rpcUrl: string
  provider: JsonRpcProvider
  forkUUID: string
  blockNumber: number
  chainId: number
  networkId: number
  publicUrl: string
  privateUrl: string
  baseChainId: string
  /**
   * map from address to given address' balance
   */
  removeFork: () => Promise<AxiosResponse<any>>
}