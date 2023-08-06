import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { EstablishmentDataSource } from '../../../../datasources/establishment';
import { AddressDataSource, CityList, StateList } from '../../../../datasources/address';
import { BRCNAEList, TypeKeyValueDataSource } from '../../../../datasources/typekeyvalue';

export class TypeBusinessTypeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable states = [] as StateList;
  @observable cities = [] as CityList;
  @observable businessTypes = [] as BRCNAEList;
  @observable state = null as string | null;
  @observable city = null as string | null;
  @observable businessType = null as string | null;
  @observable limit = 25;
  @observable offset = 0;
  @observable wanted: boolean = false;
  @observable response: PartnerList | null = null;

  @action
  init = () => {
    this.findStates();
    this.findBusunissType();
  };

  @action
  handleState = (e: any) => {
    this.state = e.target.value;
    this.response = null;

    this.findCities(this.state);
  };

  @action
  handleCity = (e: any) => {
    this.city = e.target.value;
    this.response = null;
  };

  @action
  handleBusinessType = (e: any) => {
    this.businessType = e.target.value;
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
    new AddressDataSource()
      .findState()
      .then((response) => {
        this.states = response.data;
      })
      .catch(() => {});
  };

  @action
  findCities = (stateCode: string | null) => {
    if (!stateCode) {
      this.cities = [];
    } else {
      new AddressDataSource()
        .findCity(stateCode)
        .then((response) => {
          this.cities = response.data;
        })
        .catch(() => {});
    }
  };

  @action
  findBusunissType = () => {
    new TypeKeyValueDataSource()
      .findBRCNAES()
      .then((response) => {
        this.businessTypes = response.data;
      })
      .catch(() => {});
  };

  @action
  findDocument = () => {
    this.wanted = false;
    this.response = null;

    new EstablishmentDataSource()
      .findByBusinessType(this.businessType!, this.city!, this.limit, this.offset)
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
    this.state = null;
    this.city = null;
    this.businessType = null;

    this.wanted = false;
    this.response = null;

    new EstablishmentDataSource()
      .findByBusinessTypeRandom(this.limit, this.offset)
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

  handleOpenPersonLegal = (event: any, document: string) => {
    event.preventDefault();

    historyPush('person_legal', { open: true, search: { document } });

    return false;
  };
}

export const TypeBusinessTypeContext = createContext({} as TypeBusinessTypeCtrl);
export const TypeBusinessTypeProvider = TypeBusinessTypeContext.Provider;
export const useTypeBusinessTypeStore = (): TypeBusinessTypeCtrl => useContext(TypeBusinessTypeContext);
