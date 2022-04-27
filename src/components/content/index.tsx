import React, { useState, useEffect } from 'react';
import { useLockup } from '~hooks/useLockup';
import { separation, toPrecision, toReadableNumber } from '~utils/numbers';

export const Content = () => {
  const [sort, setSort] = useState({ field: 'claimed_balance', desc: true });
  const lookups = useLockup();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (lookups) {
      setData(lookups?.map((item: any) => ({ ...item[1] })));
    }
  }, [lookups]);

  useEffect(() => {
    setData((prevData) => [...prevData].sort(sortFunction));
  }, [sort]);

  const sortFunction = (a: any, b: any) =>
    sort.desc ? a[sort.field] - b[sort.field] : b[sort.field] - a[sort.field];

  const balance = (data: any, field: any): any => {
    let total: number = 0;
    data.map((item: any) => {
      const number = toPrecision(toReadableNumber(18, item[field]), 0);
      total += Number(number);
    });

    return total;
  };

  return (
    <div className="container pt-1">
      <div className="row">
        <div className="col-md-12">
          <br />
          <br />
          {lookups && showData(data, sort, setSort, balance)}
        </div>
      </div>
    </div>
  );
};

const showData = (data: any, sort: any, setSort: any, balance: any): any => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Account Id</th>
            <th
              scope="col"
              onClick={() => {
                setSort({
                  field: 'claimed_balance',
                  desc: sort.field === 'claimed_balance' ? !sort.desc : true,
                });
              }}
            >
              Claimed Balance
            </th>
            <th
              scope="col"
              onClick={() => {
                setSort({
                  field: 'total_balance',
                  desc: sort.field === 'total_balance' ? !sort.desc : true,
                });
              }}
            >
              Total Balance
            </th>
            <th
              scope="col"
              onClick={() => {
                setSort({
                  field: 'unclaimed_balance',
                  desc: sort.field === 'unclaimed_balance' ? !sort.desc : true,
                });
              }}
            >
              Unclaimed Balance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col"></th>
            <th scope="col">Total</th>
            <th scope="col">{separation(balance(data, 'claimed_balance'))}</th>
            <th scope="col">{separation(balance(data, 'total_balance'))}</th>
            <th scope="col">
              {separation(balance(data, 'unclaimed_balance'))}
            </th>
          </tr>
          {data.map((item: any, index: any) => {
            return (
              <tr key={item.account_id}>
                <th scope="row">{index + 1}</th>
                <td>{item.account_id}</td>
                <td>
                  {separation(
                    toPrecision(toReadableNumber(18, item.claimed_balance), 0)
                  )}
                </td>
                <td>
                  {separation(
                    toPrecision(toReadableNumber(18, item.total_balance), 0)
                  )}
                </td>
                <td>
                  {separation(
                    toPrecision(toReadableNumber(18, item.unclaimed_balance), 0)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
