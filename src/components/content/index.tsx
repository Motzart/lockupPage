import React from 'react';
import { separation, toPrecision, toReadableNumber } from '~utils/numbers';
import { useSortableData } from '~hooks/useSortableData';

type Props = {
  lookups: []
}

export const Content = (props: Props) => {
  const { lookups } = props;

  const { items, requestSort, sortConfig } = useSortableData(lookups);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div className="container pt-1">
      <div className="row">
        <div className="col-md-12">
          <br/>
          <br />
          {showData(items, requestSort, getClassNamesFor)}
        </div>
      </div>
    </div>
  );
}

const showData = (data: any, requestSort: Function, getClassNamesFor: Function) => {
  return (
    <div>
      <table className="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Account Id</th>
          <th scope="col"
              onClick={() => requestSort('claimed_balance')}
              className={getClassNamesFor('claimed_balance')}
          >
            Claimed Balance
          </th>
          <th scope="col"
              onClick={() => requestSort('total_balance')}
              className={getClassNamesFor('total_balance')}
          >
            Total Balance
          </th>
          <th scope="col"
              onClick={() => requestSort('unclaimed_balance')}
              className={getClassNamesFor('unclaimed_balance')}
          >
            Unclaimed Balance
          </th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => {
          return (
            <tr key={item[1].account_id + index}>
              <th scope="row">{index + 1}</th>
              <td>{item[1].account_id}</td>
              <td>{separation(toPrecision(toReadableNumber(18, item[1].claimed_balance), 0))}</td>
              <td>{separation(toPrecision(toReadableNumber(18, item[1].total_balance), 0))}</td>
              <td>{separation(toPrecision(toReadableNumber(18, item[1].unclaimed_balance), 0))}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  )
}
