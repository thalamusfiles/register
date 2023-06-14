import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { EstablishmentDataSource } from '../../../../datasources/establishment';
import { AddressDataSource, CityList, StateList } from '../../../../datasources/address';

export class TypeBusinessTypeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable states = [] as StateList;
  @observable cities = [] as CityList;
  @observable zipcode = '';
  @observable limit = 25;
  @observable offset = 0;
  @observable wanted: boolean = false;
  @observable response: PartnerList | null = null;

  @action
  init = () => {
    this.findStates();
  };

  @action
  handleDocument = (e: any) => {
    this.zipcode = e.target.value;
    this.response = null;
  };

  @action
  handleLimit = (e: any) => {
    this.limit = parseInt(e.target.value);
    if (isNaN(this.limit)) {
      this.limit = 0;
    }
    this.response = null;
  };

  @action
  handleOffset = (e: any) => {
    this.offset = parseInt(e.target.value);
    if (isNaN(this.offset)) {
      this.offset = 0;
    }
    this.response = null;
  };

  @action
  findStates = () => {
    new AddressDataSource().findState().then((response) => {
      this.states = response.data;
    });
  };

  @action
  findCities = (stateCode: string) => {
    if (!stateCode) {
      this.cities = [];
    } else {
      new AddressDataSource().findCity(stateCode).then((response) => {
        this.cities = response.data;
      });
    }
  };

  @action
  findDocument = () => {
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
      })
      .catch((ex) => {
        this.wanted = true;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  handleOpenPersonLegal = (event: any, document: string) => {
    event.preventDefault();

    historyPush('person_legal', { open: true, search: { document } });

    return false;
  };
}

export const TypeBusinessTypeContext = createContext({} as TypeBusinessTypeCtrl);
export const TypeBusinessTypeProvider = TypeBusinessTypeContext.Provider;
export const useTypeBusinessTypeStore = (): TypeBusinessTypeCtrl => useContext(TypeBusinessTypeContext);
