import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { RelEstabByMMAndStateCrosstabList, RelEstablishmentDataSource } from '../../../../datasources/report';

export class TotalByMonthStateHistoryCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable months: Array<string> = [];
  @observable wanted: boolean = false;
  @observable response: RelEstabByMMAndStateCrosstabList | null = null;

  @action
  fillMonths = (size: number = 12) => {
    this.months = Array(size)
      .fill(0)
      .map((v, idx: number) => DateTime.now().minus({ month: idx }).toFormat('yyyyMM'))
      .reverse();
  };

  @action
  findReport = () => {
    this.wanted = false;
    this.response = null;

    new RelEstablishmentDataSource()
      .totalByMonthAndStateCrosstab(this.months)
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

export const TotalByMonthStateHistoryContext = createContext({} as TotalByMonthStateHistoryCtrl);
export const TotalByMonthStateHistoryProvider = TotalByMonthStateHistoryContext.Provider;
export const useTotalByMonthStateHistoryStore = (): TotalByMonthStateHistoryCtrl => useContext(TotalByMonthStateHistoryContext);
