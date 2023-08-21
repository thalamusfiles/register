import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { RelEstabByMMAndMainActivityList, RelEstablishmentDataSource } from '../../../../datasources/report';

export class TotalByMonthActivityCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable month: string = '';
  @observable months: Array<string> = [];
  @observable wanted: boolean = false;
  @observable response: RelEstabByMMAndMainActivityList | null = null;
  @observable responseChart: RelEstabByMMAndMainActivityList | null = null;

  @action
  fillMonths = (size: number = 12) => {
    this.months = Array(size)
      .fill(0)
      .map((v, idx: number) => DateTime.now().minus({ month: idx }).toFormat('yyyyMM'))
      .reverse();
  };

  @action
  handleChangeMonth = (month: string) => {
    this.month = month;
    this.findReport([month]);
  };

  @action
  findReportLastMonth = (pos = 1) => {
    if (this.months && pos < 5) {
      this.month = this.months[this.months.length - pos];
      if (this.months)
        this.findReport([this.month]).then(() => {
          if (!this.response?.length) {
            this.findReportLastMonth(++pos);
          }
        });
    }
  };

  @action
  findReport = (months: Array<string>) => {
    this.wanted = false;
    this.response = null;

    return new RelEstablishmentDataSource()
      .totalByMonthAndMainActivity(months)
      .then((response) => {
        this.wanted = true;
        this.response = response.data.sort((l, r) => r.total - l.total);
        this.responseChart = this.response.filter((_, idx) => idx < 35);
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        if (this.notifyExeption) this.notifyExeption(ex);
      });
  };
}

export const TotalByMonthActivityContext = createContext({} as TotalByMonthActivityCtrl);
export const TotalByMonthActivityProvider = TotalByMonthActivityContext.Provider;
export const useTotalByMonthActivityStore = (): TotalByMonthActivityCtrl => useContext(TotalByMonthActivityContext);
