import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../../commons/route';
import { PartnerList, PersonDataSource } from '../../../../datasources/person';
import { historyPush } from '../../../../commons/route';
import { notify } from '../../../../components/Notification';
import { type ErrorListRecord } from '../../../../commons/types/ErrorListRecord';
import { exportXLS } from '../../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../../commons/error';
import { isCPFSize } from '../../../../commons/validators';
import { AxiosResponse } from 'axios';

export class PersonPartnerCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable document = '';
  @observable waiting: boolean | null = null;
  @observable response: PartnerList | null = null;
  @observable partners: PartnerList | null = null;
  @observable partnersOf: PartnerList | null = null;

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
  handleDocumentAndFind = (document: string | undefined) => {
    this.document = document || '';
    if (document) {
      // TODO: ;)
      setTimeout(this.findDocument, 0);
    }
  };

  @action
  findDocument = () => {
    historyPush('person_partner', { document: this.document });

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    if (isCPFSize(this.document)) {
      notify.info(this.__('person.cpf_search'));
    }

    new PersonDataSource()
      .findNaturalByDocument(this.document!)
      .then((response) => {
        this.waiting = false;
        this.groupByMemberType(response);
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
        this.groupByMemberType(response);
        this.document = response?.data[0]?.partner_doc as string;

        historyPush('person_partner', { document: this.document });
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        this.notifyExeption(ex);
      });
  };

  @action
  groupByMemberType = (response: AxiosResponse<PartnerList>) => {
    this.response = response?.data;
    this.partners = [];
    this.partnersOf = [];
    for (const line of response?.data) {
      if (line.document?.replace(/[./-]/g, '') === this.document?.replace(/[./-]/g, '')) {
        this.partners.push(line);
      } else {
        this.partnersOf.push(line);
      }
    }
  };

  __!: Function;
  notifyExeption = (ex: any) => {
    const status = ex.response?.status;
    if ([400].includes(status)) return;
    if ([404].includes(status)) {
      notify.warn(this.__(`msg.error_${status}`));
    } else if ([400, 500].includes(status)) {
      notify.danger(this.__(`msg.error_${status}`));
    } else {
      notify.danger(ex.message);
    }
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
