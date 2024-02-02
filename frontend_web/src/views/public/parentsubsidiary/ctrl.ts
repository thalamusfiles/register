import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../commons/route';
import { PartnerList, PersonDataSource } from '../../../datasources/person';
import { notify } from '../../../components/Notification';
import { type ErrorListRecord } from '../../../commons/types/ErrorListRecord';
import { exportXLS } from '../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../commons/error';
import { isCPFSize } from '../../../commons/validators';
import { formatDocumentToSearch } from '../../../commons/formatters';

export class ParentSubsidiaryCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable document = '';
  @observable waiting: boolean | null = null;
  @observable response: PartnerList | null = null;

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
    historyReplace({ document: this.document });

    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    if (isCPFSize(this.document)) {
      notify.info(this.__('person.cpf_search'));
    }

    new PersonDataSource()
      .findSubsidiaryByParentDocument(this.document!)
      .then((response) => {
        this.waiting = false;
        this.response = this.formatTree(response?.data);
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        const data = ex.response?.data;
        [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, { splitByConstraints: true }) as ErrosAsList;

        this.notifyExeption(ex);
      });
  };

  formatTree = (response: PartnerList) => {
    const parentGrouped = response.reduce((prev, curr) => {
      // Formata os documentos
      curr.parentDoc = formatDocumentToSearch(null, curr.parentDoc);

      // Inicializa o objeto da matriz caso não exista
      if (!prev[curr.parentDoc]) {
        prev[curr.parentDoc] = { childs: [] };
      }
      // Inicializa o objeto da subsidiaria caso não exista
      if (!prev[curr.subsidiaryDoc]) {
        prev[curr.subsidiaryDoc] = curr;
      }

      curr.childs = prev[curr.subsidiaryDoc].childs || [];
      prev[curr.subsidiaryDoc] = curr;

      prev[curr.parentDoc].childs.push(curr);
      return prev;
    }, {});

    const formated = [] as any[];
    const ungroup = (itens: any[], level: number = 1) => {
      for (const item of itens) {
        //Previne referência cíclica
        if (item._processed) {
          item.childs = [];
          continue;
        }

        formated.push(item);

        item._level = level;
        item._pag = ' -'.repeat(level - 1) + '>';
        item._processed = true;

        ungroup(item.childs, ++level);
      }
    };

    ungroup(parentGrouped[''].childs);
    return formated;
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
}

export const ParentSubsidiaryContext = createContext({} as ParentSubsidiaryCtrl);
export const ParentSubsidiaryProvider = ParentSubsidiaryContext.Provider;
export const usePersonPartnerStore = (): ParentSubsidiaryCtrl => useContext(ParentSubsidiaryContext);
