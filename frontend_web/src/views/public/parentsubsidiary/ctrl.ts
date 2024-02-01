import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../commons/route';
import { PartnerList, PersonDataSource } from '../../../datasources/person';
import { notify } from '../../../components/Notification';
import { type ErrorListRecord } from '../../../commons/types/ErrorListRecord';
import { exportXLS } from '../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../commons/error';
import { isCPFSize } from '../../../commons/validators';

export class ParentSubsidiaryCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable document = '';
  @observable waiting: boolean | null = null;
  @observable response: PartnerList | null = null;

  // Erros
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @action
  handleClear = () => {
    this.document = '';
    this.response = null;
  };

  @action
  handleDocument = (e: any) => {
    this.document = e.target.value;
  };

  @action
  findDocument = () => {
    historyReplace({ document: this.document });

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    if (isCPFSize(this.document)) {
      notify.info(this.__('person.cpf_search'));
    }

    new PersonDataSource()
      .findSubsidiaryByParentDocument(this.document!)
      .then((response) => {
        this.waiting = false;
        this.response = response?.data;
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        const data = ex.response?.data;
        [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, { splitByConstraints: true }) as ErrosAsList;

        this.notifyExeption(ex);
      });
  };

  __!: Function;
  notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([400].includes(status)) return;
    if ([404].includes(status)) {
      notify.warn(this.__(`msg.error_${status}`));
    } else if ([400, 500].includes(status)) {
      notify.danger(this.__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
  };

  @action
  exportXLS = () => {
    if (this.response) {
      this.waiting = true;
      exportXLS(this.response, 'thalamus_register_contact');
      this.waiting = false;
    }
  };
}

export const ParentSubsidiaryContext = createContext({} as ParentSubsidiaryCtrl);
export const ParentSubsidiaryProvider = ParentSubsidiaryContext.Provider;
export const usePersonPartnerStore = (): ParentSubsidiaryCtrl => useContext(ParentSubsidiaryContext);
