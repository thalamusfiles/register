import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PersonDataSource, PersonFindByDocumentRespDto } from '../../../../datasources/person';

export class PersonPartnerCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable document = '';
  @observable wanted: boolean = false;
  @observable response: PersonFindByDocumentRespDto | null = null;

  @action
  handleDocument = (e: any) => {
    this.document = e.target.value;
  };

  @action
  findDocument = () => {
    this.wanted = false;
    new PersonDataSource()
      .findNaturalByDocument(this.document!)
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
    this.document = '';
    this.wanted = false;
    new PersonDataSource()
      .findLegalRandom()
      .then((response) => {
        this.wanted = true;
        this.response = response.data;
        this.document = response.data?.brGovDados?.document as string;
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        this.notifyExeption(ex);
      });
  };
}

export const PersonPartnerContext = createContext({} as PersonPartnerCtrl);
export const PersonPartnerProvider = PersonPartnerContext.Provider;
export const usePersonPartnerStore = (): PersonPartnerCtrl => useContext(PersonPartnerContext);
