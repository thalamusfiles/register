import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PersonDataSource, PersonFindByDocumentRespDto } from '../../../../datasources/person';

export class PersonLegalCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonLegal
  @observable document = '';
  @observable response: PersonFindByDocumentRespDto | null = null;

  @action
  handleDocument = (e: any) => {
    this.document = e.target.value;
  };

  @action
  findDocument = () => {
    new PersonDataSource().findLegalByDocument(this.document!).then((response) => {
      this.response = response.data;
    });
  };
}

export const PersonLegalContext = createContext({} as PersonLegalCtrl);
export const PersonLegalProvider = PersonLegalContext.Provider;
export const usePersonLegalStore = (): PersonLegalCtrl => useContext(PersonLegalContext);
