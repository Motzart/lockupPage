const defaultEnv = process.env.NEAR_ENV || 'testnet';

export default function getConfig(env: string = defaultEnv) {
  switch (env) {
    case 'mainnet':
      return  {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        LOCKUP_CONTRACT_ID: 'lockup.pembrock.near',
        TOKEN_CONTRACT_ID: 'wrap.testnet',
        headers: {}
      }
    default:
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        LOCKUP_CONTRACT_ID: 'lockup.pembrock.near',
        TOKEN_CONTRACT_ID: 'wrap.testnet',
        headers: {}
      }
  }
}
