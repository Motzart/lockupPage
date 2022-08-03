import { useMemo, useState, useEffect } from 'react';
import { useCurrentBalance } from '~hooks/useCurrentBalance';
import BN from 'bn.js';

type SortConfig = {
  key: string;
  direction: string | undefined;
} | null;

export const useSortableData = (items: any[], config: SortConfig = null) => {
  const [sortConfig, setSortConfig] = useState(config);
  const [listLookups, setListLookups] = useState([items]);
  const [newLookups, setNewLookups] = useState([]);

  items?.map((result) => {
    const currentBalance = useCurrentBalance(result[1].account_id);

    result[1].current_balance = currentBalance;

    useEffect(() => {
      setListLookups((prev) => [...prev, result]);
    }, [result]);
  });

  useEffect(() => {
    const newArr = [];

    listLookups[0].forEach((items, idx) => {
      if (idx === 0) {
        newArr.push(items);
        // setNewLookups([...newLookups, items]);
      } else {
        const findItem = newLookups.find(
          (a) => a[1].account_id === items[1].account_id
        );

        if (!findItem) {
          newArr.push(items);
          // setNewLookups([...newLookups, items]);
        } else {
          var a_claimed_balance = new BN(findItem[1].claimed_balance);
          var b_claimed_balance = new BN(items[1].claimed_balance);
          const summ_claimed_balance = String(
            a_claimed_balance.add(b_claimed_balance)
          );

          var a_total_balance = new BN(findItem[1].total_balance);
          var b_total_balance = new BN(items[1].total_balance);
          const summ_total_balance = String(
            a_total_balance.add(b_total_balance)
          );

          var a_unclaimed_balance = new BN(findItem[1].unclaimed_balance);
          var b_unclaimed_balance = new BN(items[1].unclaimed_balance);
          const summ_unclaimed_balance = String(
            a_unclaimed_balance.add(b_unclaimed_balance)
          );

          findItem[1].claimed_balance = summ_claimed_balance;
          findItem[1].total_balance = summ_total_balance;
          findItem[1].unclaimed_balance = summ_unclaimed_balance;
        }
      }
    });
    setNewLookups([newArr]);
  }, []);

  const sortedItems = useMemo(() => {
    console.log(newLookups);

    let sortableItems = [...listLookups[0]];

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (+a[1][sortConfig.key] < +b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (+a[1][sortConfig.key] > +b[1][sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
