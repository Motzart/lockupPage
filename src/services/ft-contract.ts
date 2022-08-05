import { wallet } from '~utils/near-utils';
import { getAmount, getGas, IFunctionCallOptions } from '~services/near';
import getConfig from '~config';

const config = getConfig();

const TOKEN_CONTRACT_ID = config.TOKEN_CONTRACT_ID;

export const ftFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: IFunctionCallOptions) => {
  return wallet
    .account()
    .functionCall(
      TOKEN_CONTRACT_ID,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

export const ftViewFunction = (
  tokenId: string,
  { methodName, args }: PembViewFunctionOptions
) => {
  return wallet.account().viewFunction(tokenId, methodName, args);
};

export const ftGetBalance = (account_id) => {
  return ftViewFunction(TOKEN_CONTRACT_ID, {
    methodName: 'ft_balance_of',
    args: { account_id: account_id },
  }).catch(() => '0');
};
