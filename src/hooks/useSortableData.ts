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
  const [newLookups, setnewLookups] = useState([]);

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
      } else {
        const findItem = newArr.find(
          (a) => a[1].account_id === items[1].account_id
        );

        if (!findItem) {
          newArr.push(items);
        } else {
          var a = new BN(findItem[1].claimed_balance);
          var b = new BN(items[1].claimed_balance);
          const summ = String(a.add(b));

          findItem[1].claimed_balance = summ;
        }
      }
    });
    setnewLookups(newArr);
  }, []);

  const sortedItems = useMemo(() => {
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
