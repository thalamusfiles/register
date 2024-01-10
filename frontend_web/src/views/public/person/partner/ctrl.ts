import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { PartnerList, PersonDataSource } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { type ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { exportXLS } from '../../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';

export class PersonPartnerCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

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

    new PersonDataSource()
      .findNaturalByDocument(this.document!)
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
    this.document = '';

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new PersonDataSource()
      .findNaturalRandom()
      .then((response) => {
        this.waiting = false;
        this.response = response?.data;
        this.document = response?.data[0]?.partner_doc as string;

        historyReplace({ document: this.document });
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

export const PersonPartnerContext = createContext({} as PersonPartnerCtrl);
export const PersonPartnerProvider = PersonPartnerContext.Provider;
export const usePersonPartnerStore = (): PersonPartnerCtrl => useContext(PersonPartnerContext);
