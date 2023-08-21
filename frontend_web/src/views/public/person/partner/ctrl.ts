import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { PartnerList, PersonDataSource } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';

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

  @action
  handleDocument = (e: any) => {
    this.document = e.target.value;
  };

  @action
  findDocument = () => {
    historyReplace({ document: this.document });

    this.waiting = true;

    new PersonDataSource()
      .findNaturalByDocument(this.document!)
      .then((response) => {
        this.waiting = false;
        this.response = response.data;
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  @action
  findDocumentRandom = () => {
    this.document = '';
    this.waiting = true;

    new PersonDataSource()
      .findNaturalRandom()
      .then((response) => {
        this.waiting = false;
        this.response = response.data;
        this.document = response.data[0]?.partnerDoc as string;

        historyReplace({ document: this.document });
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

export const PersonPartnerContext = createContext({} as PersonPartnerCtrl);
export const PersonPartnerProvider = PersonPartnerContext.Provider;
export const usePersonPartnerStore = (): PersonPartnerCtrl => useContext(PersonPartnerContext);
