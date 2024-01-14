import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { RelEstabByMMAndStateList, RelEstablishmentDataSource } from '../../../../datasources/report';
import { notify } from '../../../../components/Notification';
import { ChartBackgroundColor, ChartBorderColor } from '../../../../commons/chat.options';

export class TotalByMonthStateCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable month: string = '';
  @observable months: Array<string> = [];
  @observable wanted: boolean = false;
  @observable response: RelEstabByMMAndStateList | null = null;
  @observable chartData: any = {
    labels: [],
    datasets: [],
  };

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
      .totalByMonthAndState(months)
      .then((response) => {
        this.wanted = true;
        this.response = response?.data.sort((l, r) => r.total - l.total);

        this.formatChartData();
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        if (this.notifyExeption) this.notifyExeption(ex);
      });
  };

  @action
  formatChartData() {
    const labels = this.response?.map((resp) => resp.stateCode) || [];

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Novos registros',
          data: this.response?.map((resp) => resp.total),
          lineTension: 1,
          backgroundColor: ChartBackgroundColor,
          borderColor: ChartBorderColor,
          borderWidth: 1,
        },
      ],
    };
  }

  __!: Function;
  notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([404].includes(status)) {
      notify.warn(this.__(`msg.error_${status}`));
    } else if ([400, 500].includes(status)) {
      notify.danger(this.__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
  };
}

export const TotalByMonthStateContext = createContext({} as TotalByMonthStateCtrl);
export const TotalByMonthStateProvider = TotalByMonthStateContext.Provider;
export const useTotalByMonthStateStore = (): TotalByMonthStateCtrl => useContext(TotalByMonthStateContext);
