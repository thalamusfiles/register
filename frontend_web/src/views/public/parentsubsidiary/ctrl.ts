import { action, makeObservable, observable } from 'mobx';
import { createContext, useContext } from 'react';
import { historyReplace } from '../../../commons/route';
import { PersonDataSource, Subsidiaries, SubsidiaryByParent } from '../../../datasources/person';
import { notify } from '../../../components/Notification';
import { type ErrorListRecord } from '../../../commons/types/ErrorListRecord';
import { exportXLS } from '../../../commons/tools';
import { ErrosAsList, getFormExceptionErrosToObject } from '../../../commons/error';
import { isCPFSize } from '../../../commons/validators';
import { formatDocumentToSearch } from '../../../commons/formatters';
import { Node, Edge } from 'reactflow';

type SubsidiaryByParentInfo = SubsidiaryByParent & {
  _level: number;
  _itemIdx: number;
  _pag: string;
  _processed: boolean;
  childs: Array<SubsidiaryByParentInfo>;
};

export class ParentSubsidiaryCtrl {
  constructor() {
    // Modifica classe pra ser observável
    makeObservable(this);
  }

  // PersonPartner
  @observable document = '';
  @observable waiting: boolean | null = null;
  @observable response: Array<SubsidiaryByParentInfo> | null = null;
  @observable nodes: Array<Node> = [];
  @observable edges: Array<Edge> = [];

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

        const itens = this.formatTree(response?.data);
        const { nodes, edges } = this.formateNodesAndEdges(itens);

        this.response = itens;
        this.nodes = nodes;
        this.edges = edges;
      })
      .catch((ex) => {
        this.waiting = false;
        this.response = null;

        const data = ex.response?.data;
        [this.erroMessages, this.erros] = getFormExceptionErrosToObject(data, { splitByConstraints: true }) as ErrosAsList;

        this.notifyExeption(ex);
      });
  };

  formatTree = (response: Subsidiaries) => {
    const parentGrouped = response.reduce((prev: any, curr: any) => {
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

    const formated: Array<SubsidiaryByParentInfo> = [];

    const ungroup = (itens: SubsidiaryByParentInfo[], level: number = 1) => {
      let itemIdx = 0;
      for (const item of itens) {
        //Previne referência cíclica
        if (item._processed) {
          item.childs = [];
          continue;
        }

        formated.push(item);

        item._itemIdx = itemIdx++;
        item._level = level;
        item._pag = ' -'.repeat(level - 1) + '>';
        item._processed = true;

        ungroup(item.childs, ++level);
      }
    };

    ungroup(parentGrouped[''].childs);
    return formated;
  };

  formateNodesAndEdges = (itens: Array<SubsidiaryByParentInfo>) => {
    const nodes: Array<Node> = [];
    const edges: Array<Edge> = [];

    for (const item of itens) {
      const node: Node = {
        //
        id: '' + item.subsidiaryHashId,
        data: { label: `${item.subsidiary || ''}: ${item.subsidiaryDoc}` },
        position: { x: item._itemIdx * 200, y: (item._level - 1) * 60 },
      };

      nodes.push(node);

      for (const child of item.childs) {
        if (item.subsidiaryHashId === child.subsidiaryHashId) {
          continue;
        }

        const edge: Edge = {
          //
          id: Math.random().toString(32),
          source: '' + item.subsidiaryHashId,
          target: '' + child.subsidiaryHashId,
        };

        edges.push(edge);
      }
    }

    return { nodes, edges };
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