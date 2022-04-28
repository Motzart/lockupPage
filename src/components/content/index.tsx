import React from 'react';
import { separation, toPrecision, toReadableNumber } from '~utils/numbers';
import { useSortableData } from '~hooks/useSortableData';
import styles from './content.module.scss';

type Props = {
  lookups: [];
};

export const Content = (props: Props) => {
  const { lookups } = props;

  const { items, requestSort, sortConfig } = useSortableData(lookups);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const balance = (data: any, field: any): any => {
    let total: number = 0;
    data.map((item: any) => {
      const number = toPrecision(toReadableNumber(18, item[1][field]), 0);
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
          {showData(items, requestSort, getClassNamesFor, balance, sortConfig)}
        </div>
      </div>
    </div>
  );
};

const showData = (
  data: any,
  requestSort: Function,
  getClassNamesFor: Function,
  balance: any,
  sortConfig: any
) => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" style={{ backgroundColor: '#eaeaea' }}>
              Account Id
            </th>
            <th
              scope="col"
              onClick={() => requestSort('claimed_balance')}
              className={
                getClassNamesFor('claimed_balance') === undefined
                  ? styles.scending
                  : getClassNamesFor('claimed_balance') === 'ascending'
                  ? styles.ascending
                  : styles.descending
              }
              style={{ cursor: 'pointer', backgroundColor: 'lightgray' }}
            >
              Claimed Balance
            </th>
            <th
              scope="col"
              onClick={() => requestSort('total_balance')}
              className={
                getClassNamesFor('total_balance') === undefined
                  ? styles.scending
                  : getClassNamesFor('total_balance') === 'ascending'
                  ? styles.ascending
                  : styles.descending
              }
              style={{ cursor: 'pointer', backgroundColor: 'darkgrey' }}
            >
              Total Balance
            </th>
            <th
              scope="col"
              onClick={() => requestSort('unclaimed_balance')}
              className={
                getClassNamesFor('unclaimed_balance') === undefined
                  ? styles.scending
                  : getClassNamesFor('unclaimed_balance') === 'ascending'
                  ? styles.ascending
                  : styles.descending
              }
              style={{ cursor: 'pointer', backgroundColor: 'dimgray' }}
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
          {data.map((item, index) => {
            return (
              <tr key={item[1].account_id + index}>
                <th scope="row">{index + 1}</th>
                <td>{item[1].account_id}</td>
                <td>
                  {separation(
                    toPrecision(
                      toReadableNumber(18, item[1].claimed_balance),
                      0
                    )
                  )}
                </td>
                <td>
                  {separation(
                    toPrecision(toReadableNumber(18, item[1].total_balance), 0)
                  )}
                </td>
                <td>
                  {separation(
                    toPrecision(
                      toReadableNumber(18, item[1].unclaimed_balance),
                      0
                    )
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
