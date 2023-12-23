import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { ContactDataSource } from '../../../../datasources/contact';
import { exportXLS } from '../../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';

export class ContactCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable state = null as { code: string; name: string } | null;
  @observable city = null as { code: string; name: string } | null;
  @observable businessType = null as { key: string; value: { description: string } } | null;
  @observable limit = 25;
  @observable page = 1;
  @observable waiting: boolean | null = null;
  @observable response: PartnerList | null = null;

  // Erros
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @action
  init = () => {};

  @action
  handleClear = () => {
    this.state = null;
    this.city = null;
    this.businessType = null;
    this.page = 1;
    this.response = null;
  };

  @action
  handleState = (value: any) => {
    this.state = value;
  };

  @action
  handleCity = (value: any) => {
    this.city = value;
  };

  @action
  handleBusinessType = (value: any) => {
    this.businessType = value;
  };

  @action
  handleLimit = (e: any) => {
    this.limit = parseInt(e.target.value);
    if (isNaN(this.limit)) {
      this.limit = 0;
    }
  };

  @action
  handlePage = (e: any) => {
    this.page = parseInt(e.target.value);
    if (isNaN(this.page)) {
      this.page = 0;
    }
  };

  @action
  findDocument = () => {
    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new ContactDataSource()
      .find(this.businessType?.key!, this.city?.code!, this.limit, this.page - 1)
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

  @action
  findDocumentRandom = () => {
    this.state = null;
    this.city = null;
    this.businessType = null;

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new ContactDataSource()
      .findRandom(this.limit, this.page - 1)
      .then((response) => {
        this.waiting = false;
        this.response = response?.data;
        if (this.response.length) {
          this.businessType = { key: this.response[0].main_activity, value: this.response[0].main_activity };
        }
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  @action
  exportXLS = () => {
    if (this.response) {
      this.waiting = true;
      exportXLS(this.response, 'thalamus_register_contact');
      this.waiting = false;
    }
  };

  handleOpenPersonLegal = (event: any, document: string) => {
    event.preventDefault();

    historyPush('person_legal_view', { open: true, document });

    return false;
  };
}

export const ContactContext = createContext({} as ContactCtrl);
export const ContactProvider = ContactContext.Provider;
export const useTypeBusinessTypeStore = (): ContactCtrl => useContext(ContactContext);
