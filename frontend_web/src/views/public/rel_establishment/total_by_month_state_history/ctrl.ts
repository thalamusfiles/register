import { DateTime } from 'luxon';
import { action, makeObservable, observable } from 'mobx';
import { notify } from '../../../../components/Notification';
import { createContext, useContext } from 'react';
import { RelEstabByMMAndStateCrosstabList, RelEstablishmentDataSource } from '../../../../datasources/report';
import { ChartBackgroundColor, ChartBorderColor } from '../../../../commons/chat.options';
import { statesCode } from '../../../../datasources/commons';

export class TotalByMonthStateHistoryCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable months: Array<string> = [];
  @observable wanted: boolean = false;
  @observable response: RelEstabByMMAndStateCrosstabList | null = null;
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
  findReport = () => {
    this.wanted = false;
    this.response = null;

    new RelEstablishmentDataSource()
      .totalByMonthAndStateCrosstab(this.months)
      .then((response) => {
        this.wanted = true;
        this.response = response?.data;

        this.formatChartData();
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  @action
  formatChartData() {
    const response = this.response|| [];
    const labels = response?.map((resp) => `${resp.date.substring(4)}/${resp.date.substring(0, 4)}`);

    this.chartData = {
      labels: labels,
      datasets: statesCode.map((code, idx) => ({
        label: code.toLocaleUpperCase(),
        data: response?.map((resp: any) => resp[code]),
        lineTension: 1,
        backgroundColor: ChartBorderColor[idx % (ChartBackgroundColor.length - 1)],
        borderColor: ChartBackgroundColor[idx % (ChartBackgroundColor.length - 1)],
        borderWidth: 2,
      })),
    };
  }

  __!: Function;
  notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([400].includes(status)) return;
    if ([404].includes(status)) {
      notify.warn(this.__(`msg.error_${status}`));
    } else if ([400, 429, 500].includes(status)) {
      notify.danger(this.__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
  };
}

export const TotalByMonthStateHistoryContext = createContext({} as TotalByMonthStateHistoryCtrl);
export const TotalByMonthStateHistoryProvider = TotalByMonthStateHistoryContext.Provider;
export const useTotalByMonthStateHistoryStore = (): TotalByMonthStateHistoryCtrl => useContext(TotalByMonthStateHistoryContext);
