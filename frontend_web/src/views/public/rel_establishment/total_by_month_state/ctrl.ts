import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { RelEstabByMMAndStateList, RelEstablishmentDataSource } from '../../../../datasources/report';

export class TotalByMonthStateCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);

    this.months = Array(12)
      .fill(0)
      .map((v, idx: number) => DateTime.now().minus({ month: idx }).toFormat('yyyyMM'));
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable months: Array<string> = [];
  @observable wanted: boolean = false;
  @observable response: RelEstabByMMAndStateList | null = null;

  @action
  findReportLastMonth = () => {
    if (this.months) {
      this.findReport([this.months[this.months.length - 1]]);
    }
  };

  @action
  findReport = (months: Array<string>) => {
    this.wanted = false;
    this.response = null;

    new RelEstablishmentDataSource()
      .findTotalByMonthAndState(months)
      .then((response) => {
        this.wanted = true;
        this.response = response.data;
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        this.notifyExeption(ex);
      });
  };
}

export const TotalByMonthStateContext = createContext({} as TotalByMonthStateCtrl);
export const TotalByMonthStateProvider = TotalByMonthStateContext.Provider;
export const useTotalByMonthStateStore = (): TotalByMonthStateCtrl => useContext(TotalByMonthStateContext);
