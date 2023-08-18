import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { EstablishmentDataSource } from '../../../../datasources/establishment';

export class AddressZipcodeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable zipcode = '';
  @observable limit = 25;
  @observable offset = 0;
  @observable wanted: boolean = false;
  @observable response: PartnerList | null = null;

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
  handleOffset = (e: any) => {
    this.offset = parseInt(e.target.value);
    if (isNaN(this.offset)) {
      this.offset = 0;
    }
  };

  @action
  findDocument = () => {
    historyReplace({ document: this.zipcode });

    this.wanted = false;
    this.response = null;

    new EstablishmentDataSource()
      .findByZipcode(this.zipcode, this.limit, this.offset)
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
    this.zipcode = '';
    this.wanted = false;
    this.response = null;

    new EstablishmentDataSource()
      .findByZipcodeRandom(this.limit, this.offset)
      .then((response) => {
        this.wanted = true;
        this.response = response.data;
        this.zipcode = response.data[0]?.zipcode;

        historyReplace({ document: this.zipcode });
      })
      .catch((ex) => {
        this.wanted = true;
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
