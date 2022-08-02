import { useEffect, useState } from 'react';
import { ftGetBalance } from '~services/ft-contract';

export interface IUserCurrentBalance {
  current_balance: string;
}

export const useCurrentBalance = (account_id: string) => {
  const [userCurrentBalance, setUserCurrentBalance] =
    useState<IUserCurrentBalance>();

  useEffect(() => {
    ftGetBalance(account_id)
      .then((data: any) => {
        return setUserCurrentBalance(data);
      })
      .catch((e) => console.log(e));
  }, [account_id]);
  return userCurrentBalance;
};
