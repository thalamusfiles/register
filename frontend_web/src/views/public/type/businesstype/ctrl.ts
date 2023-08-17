import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { PartnerList } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { EstablishmentDataSource } from '../../../../datasources/establishment';

export class TypeBusinessTypeCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  notifyExeption!: Function;

  // PersonPartner
  @observable state = null as { code: string; name: string } | null;
  @observable city = null as { code: string; name: string } | null;
  @observable businessType = null as { key: string; value: { description: string } } | null;
  @observable limit = 25;
  @observable offset = 0;
  @observable wanted: boolean = false;
  @observable response: PartnerList | null = null;

  @action
  init = () => {};

  @action
  handleState = (value: any) => {
    this.state = value;
    this.response = null;
  };

  @action
  handleCity = (value: any) => {
    this.city = value;
    this.response = null;
  };

  @action
  handleBusinessType = (value: any) => {
    this.businessType = value;
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
  findDocument = () => {
    this.wanted = false;
    this.response = null;

    new EstablishmentDataSource()
      .findByBusinessType(this.businessType?.key!, this.city?.code!, this.limit, this.offset)
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

    historyPush('person_legal_view', { open: true, document });

    return false;
  };
}

export const TypeBusinessTypeContext = createContext({} as TypeBusinessTypeCtrl);
export const TypeBusinessTypeProvider = TypeBusinessTypeContext.Provider;
export const useTypeBusinessTypeStore = (): TypeBusinessTypeCtrl => useContext(TypeBusinessTypeContext);
