import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { thalamusData } from '../../../../config/thalamus.data';
import { PersonDataSource, PersonFindByDocumentRespDto } from '../../../../datasources/person';

export class PersonLegalCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonLegal
  @observable document = '';
  @observable wanted: boolean = false;
  @observable response: PersonFindByDocumentRespDto | null = null;

  @action
  handleDocument = (e: any) => {
    this.document = e.target.value;
    this.response = null;
  };

  @action
  findDocument = () => {
    historyReplace({ document: this.document });

    this.wanted = false;
    this.response = null;

    new PersonDataSource()
      .findLegalByDocument(this.document!)
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

  @action
  findDocumentRandom = () => {
    if (Math.random() > Math.random() * 3) {
      this.document = thalamusData.THALAMUS_BR_DOC;
      this.findDocument();
      return;
    }

    this.document = '';
    this.wanted = false;
    this.response = null;

    new PersonDataSource()
      .findLegalRandom()
      .then((response) => {
        this.wanted = true;
        this.response = response.data;
        this.document = response.data?.brGovDados?.document as string;

        historyReplace({ document: this.document });
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        this.notifyExeption(ex);
      });
  };
}

export const PersonLegalContext = createContext({} as PersonLegalCtrl);
export const PersonLegalProvider = PersonLegalContext.Provider;
export const usePersonLegalStore = (): PersonLegalCtrl => useContext(PersonLegalContext);
