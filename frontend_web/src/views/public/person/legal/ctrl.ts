import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import type { ErrorListRecord } from '../../../../commons//types/ErrorListRecord';
import { notify } from '../../../../components/Notification';
import { historyReplace } from '../../../../commons/route';
import { thalamusData } from '../../../../config/thalamus.data';
import { PersonDataSource, PersonFindByDocumentRespDto } from '../../../../datasources/person';

export class PersonLegalCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonLegal
  @observable document = '';
  @observable waiting: boolean | null = null;
  @observable response: PersonFindByDocumentRespDto | null = null;

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
    historyReplace({ document: this.document }, 'person_legal_view');

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new PersonDataSource()
      .findLegalByDocument(this.document!)
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
    if (Math.random() > Math.random() * 3) {
      this.document = thalamusData.THALAMUS_BR_DOC;
      this.findDocument();
      return;
    }

    this.document = '';

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new PersonDataSource()
      .findLegalRandom()
      .then((response) => {
        this.waiting = false;
        this.response = response?.data;
        this.document = response?.data?.brGovDados?.document as string;

        historyReplace({ document: this.document }, 'person_legal_view');
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

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

export const PersonLegalContext = createContext({} as PersonLegalCtrl);
export const PersonLegalProvider = PersonLegalContext.Provider;
export const usePersonLegalStore = (): PersonLegalCtrl => useContext(PersonLegalContext);
