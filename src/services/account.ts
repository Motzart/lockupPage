import { wallet } from '~utils/near-utils';
import { ftViewFunction } from '~services/ft-contract';

export interface AccountStorageView {
  total: string;
  available: string;
}

export const currentStorageBalance = (): Promise<AccountStorageView> => {
  return ftViewFunction({
    methodName: 'storage_balance_of',
    args: { account_id: wallet.getAccountId() },
  });
};
