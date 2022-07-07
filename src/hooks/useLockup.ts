import { useEffect, useState } from 'react';
import { getAllLockups, getLockupsPaged } from '~services/near';

export interface UserLockupsView {
  account_id: string,
  schedule: [],
  claimed_balance: string,
  termination_config: null,
  timestamp: number,
  total_balance: string,
  unclaimed_balance: string,
}

export const useLockup = () => {
  const [userLockupPage, setLockupPage] = useState<UserLockupsView>();

  useEffect(() => {
    getAllLockups()
      .then((data: any) => {
        return setLockupPage(data[0].concat(data[1]));
      })
      .catch(e => console.log(e));
  }, []);

  return userLockupPage;
};
