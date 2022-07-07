import { utils } from 'near-api-js';
import BN from 'bn.js';
import { functionCall } from 'near-api-js/lib/transaction';
import { wallet } from '~utils/near-utils';
import getConfig from '../config'
import { currentStorageBalance } from '~services/account';

const config = getConfig();

const LOCKUP_CONTRACT_ID = config.LOCKUP_CONTRACT_ID;
const LOCKUP_LP_CONTRACT_ID = config.LOCKUP_LP_CONTRACT_ID;
const TOKEN_CONTRACT_ID = config.TOKEN_CONTRACT_ID;

export const NEW_ACCOUNT_STORAGE_COST: string = '0.00125';

export const getGas = (gas: string) =>
  gas ? new BN(gas) : new BN('100000000000000');

export const getAmount = (amount: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

export interface IViewFunctionOptions {
  methodName: string;
  args?: object;
}

export interface IFunctionCallOptions extends IViewFunctionOptions {
  gas?: string;
  amount?: string;
}

export const viewFunction = ({
  methodName,
  args,
}: IViewFunctionOptions) => {
 return wallet.account().viewFunction(LOCKUP_CONTRACT_ID, methodName, args);
};

export const viewLPFunction = ({ methodName, args }: IViewFunctionOptions) => {
  return wallet.account().viewFunction(LOCKUP_LP_CONTRACT_ID, methodName, args);
};

export interface Transaction {
  receiverId: string;
  functionCalls: IFunctionCallOptions[];
}

export const lockUpFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: IFunctionCallOptions) => {
  return wallet
    .account()
    .functionCall(
      LOCKUP_CONTRACT_ID,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

export const getUserLockups = (): Promise<[]> => {
  return viewFunction({
    methodName: 'get_account_lockups',
    args: { account_id: wallet.getAccountId() },
  });
}

export const getUserLpLockups = (): Promise<[]> => {
  return viewLPFunction({
    methodName: 'get_lockups_paged',
    args: { from_index: 0, limit: 100 },
  });
};

export const getLockupsPaged = (): Promise<[]> => {
  return viewFunction({
    methodName: 'get_lockups_paged',
    args: { from_index: 0, limit: 100 },
  });
}

export const getAllLockups = async () => {
  let tasks: any[] = [];
  tasks.push(getLockupsPaged());
  tasks.push(getUserLpLockups());

  return Promise.all(tasks);
};

export const claim = async () => {
  const transactions: Transaction[] = [];

  const balance = await currentStorageBalance();

  if (!balance || balance.total === '0') {

    // claim
    transactions.unshift({
      receiverId: LOCKUP_CONTRACT_ID,
      functionCalls: [
        {
          methodName: 'claim',
          args: {},
          gas: getGas('100000000000000').toString(),
        },
      ],
    });

    // call storage
    transactions.unshift({
      receiverId: TOKEN_CONTRACT_ID,
      functionCalls: [
        {
          methodName: 'storage_deposit',
          args: {
            account_id: wallet.getAccountId(),
            registration_only: true,
          },
          amount: NEW_ACCOUNT_STORAGE_COST,
          gas: '30000000000000',
        },
      ],
    });

    return executeMultipleTransactions(transactions);
  } else {
    return lockUpFunctionCall({
      methodName: 'claim',
      args: {},
      gas: getGas('100000000000000').toString(),
    })
  }
}

export const executeMultipleTransactions = async (
  transactions: Transaction[],
  callbackUrl?: string
) => {
  const nearTransactions = await Promise.all(
    transactions.map((t, i) => {
      return wallet.createTransaction({
        receiverId: t.receiverId,
        nonceOffset: i + 1,
        actions: t.functionCalls.map((fc) =>
          functionCall(
            fc.methodName,
            fc.args,
            getGas(fc.gas),
            getAmount(fc.amount)
          )
        ),
      });
    })
  );

  return wallet.requestSignTransactions(nearTransactions, callbackUrl);
};
