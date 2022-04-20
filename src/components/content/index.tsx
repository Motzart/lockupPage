import React from 'react';
import { useLockup } from '~hooks/useLockup';
import { separation, toPrecision, toReadableNumber } from '~utils/numbers';

export const Content = () => {
  const lookups = useLockup();

  return (
    <div className="container pt-1">
      <div className="row">
        <div className="col-md-12">
          <br/>
          <br />
          {lookups && showData(lookups)}
        </div>
      </div>
    </div>
  );
}

const showData = (data: any) => {
  return (
    <div>
      <table className="table">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Account Id</th>
          <th scope="col">Claimed Balance</th>
          <th scope="col">Total Balance</th>
          <th scope="col">Unclaimed Balance</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => {
          return (
            <tr key={item[1].account_id}>
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
