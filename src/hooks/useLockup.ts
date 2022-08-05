import { useEffect, useState } from 'react';
import { getAllLockups } from '~services/near';
import BN from 'bn.js';
import { ftGetBalance } from '~services/ft-contract';

export interface UserLockupsView {
  account_id: string;
  schedule: [];
  claimed_balance: string;
  termination_config: null;
  timestamp: number;
  total_balance: string;
  unclaimed_balance: string;
}

export interface IUserLockupsData {
  account_id: string;
  claimed_balance: string;
  total_balance: string;
  unclaimed_balance: string;
}

export interface IUserLockupsWithBalance {
  account_id: string;
  claimed_balance: string;
  current_balance: string;
  total_balance: string;
  unclaimed_balance: string;
}

export const useLockup = () => {
  const [userLockupPage, setLockupPage] = useState<IUserLockupsWithBalance[]>();

  useEffect(() => {
    getAllLockups()
      .then((data: any) => {
        return data[0].concat(data[1])
      }).then(combinedData => {
        // make normal array from given object
        const normalizedArray = combinedData.map((item) => item[1]);

        // find uniq item in array
        const uniqueAccountId = new Set(normalizedArray.map(v => v.account_id));
        // resulted array
        const arrayWithSum: any = [];

        uniqueAccountId.forEach(item => {
          // all objects with current account id
          const arr = normalizedArray.filter((ob: UserLockupsView) => ob.account_id === item);
          const claimedBalance = sumBN(arr, 'claimed_balance');
          const totalBalance = sumBN(arr, 'total_balance');
          const unclaimedBalance = sumBN(arr, 'unclaimed_balance');

          arrayWithSum.push({
            account_id: item,
            claimed_balance: claimedBalance.toString(),
            total_balance: totalBalance.toString(),
            unclaimed_balance: unclaimedBalance.toString()
          });
        })
        return arrayWithSum;
    }).then(data => {
        const userLockupWithBalance = data.map(async(item: IUserLockupsData) => {
          const balance = await ftGetBalance(item.account_id);
          return {...item, current_balance: balance}
        })
        return Promise.all(userLockupWithBalance)
      }).then(data => setLockupPage(data))
      .catch((e) => console.log(e));
  }, []);

  return userLockupPage;
};

const sumBN = (data: [], field: string) => {
  return data.reduce((sum: BN, item: any) => {
    return sum.add(new BN(item[field]));
  }, new BN(0));
}
