import { useEffect, useState } from 'react';
import { getLockupsPaged } from '~services/near';

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
    getLockupsPaged()
      .then((data: any) => {
        return setLockupPage(data);
      })
      .catch(e => console.log(e));
  }, []);

  return userLockupPage;
};
