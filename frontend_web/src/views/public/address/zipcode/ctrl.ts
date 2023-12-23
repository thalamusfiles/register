import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { EstablishmentDataSource } from '../../../../datasources/establishment';
import type { ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';

export class AddressZipcodeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable zipcode = '';
  @observable limit = 25;
  @observable page = 1;
  @observable waiting: boolean | null = null;
  @observable response: PartnerList | null = null;

  // Erros
  @observable erroMessages: string[] = [];
  @observable erros: ErrorListRecord = {};

  @action
  handleClear = () => {
    this.zipcode = '';
    this.page = 1;
    this.response = null;
  };

  @action
  handleDocument = (e: any) => {
    this.zipcode = e.target.value;
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
    historyReplace({ document: this.zipcode });

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new EstablishmentDataSource()
      .findByZipcode(this.zipcode, this.limit, this.page - 1)
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
    this.zipcode = '';

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new EstablishmentDataSource()
      .findByZipcodeRandom(this.limit, this.page - 1)
      .then((response) => {
        this.waiting = false;
        this.response = response?.data;
        this.zipcode = response?.data[0]?.zipcode;

        historyReplace({ document: this.zipcode });
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  handleOpenPersonLegal = (event: any, document: string) => {
    event.preventDefault();

    historyPush('person_legal_view', { open: true, document });

    return false;
  };
}

export const AddressZipcodeContext = createContext({} as AddressZipcodeCtrl);
export const AddressZipcodeProvider = AddressZipcodeContext.Provider;
export const useAddressZipcodeStore = (): AddressZipcodeCtrl => useContext(AddressZipcodeContext);
