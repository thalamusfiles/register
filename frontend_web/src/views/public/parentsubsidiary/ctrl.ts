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

const NODE_X_STEP = 190;
const NODE_Y_STEP = 150;

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

  responseData: Array<SubsidiaryByParent> | null = null;
  nestedSearched: Array<string> = [];

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
    this.nestedSearched = [];
    this.erroMessages = [];
    this.erros = {};

    if (isCPFSize(this.document)) {
      notify.info(this.__('person.cpf_search'));
    }

    new PersonDataSource()
      .findCorporateCompanyByParentDocument(this.document!)
      .then((response) => {
        this.waiting = false;

        // Salva o retorno para uso posterior
        this.responseData = response?.data;

        // Identifica relações entre os itens
        const itens = this.makeRelations(this.responseData);
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

  @action
  findNested = (document: string) => {
    if (!document || this.nestedSearched.includes(document)) {
      return;
    }
    this.waiting = true;
    this.erroMessages = [];
    this.erros = {};

    new PersonDataSource().findCorporateCompanyByParentDocument(document).then((response) => {
      this.waiting = false;
      this.nestedSearched.push(document);

      // Filtra a própria empresa utilizada na busca
      const responseData = response?.data.filter((line) => line.parentDoc);

      // Concatena com a lista anterior
      this.responseData = this.responseData!.concat(responseData);

      // Identifica relações entre os itens
      const itens = this.makeRelations(this.responseData);
      const { nodes, edges } = this.formateNodesAndEdges(itens);

      this.response = itens;
      this.nodes = nodes;
      this.edges = edges;
    });
  };

  makeRelations = (responseData: Subsidiaries) => {
    responseData = JSON.parse(JSON.stringify(responseData));

    const parentGrouped = responseData.reduce((prev: any, curr: any) => {
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
    const ungroup = (itens: SubsidiaryByParentInfo[], level: number = 1, itemIdx: number = 0) => {
      if (!itens.length) {
        return;
      }
      //let itemIdx = 0;
      //const childs = [];
      for (const item of itens) {
        //Previne referência cíclica
        if (item._processed) {
          item.childs = [];
          continue;
        }

        formated.push(item);

        item._itemIdx = itemIdx;
        item._level = level;
        item._processed = true;

        //childs.push(...item.childs);
        ungroup([...item.childs], level + 1, itemIdx);

        itemIdx += 1 + (item.childs.length ? item.childs.length - 1 : 0);
      }
    };

    if (parentGrouped['']) {
      ungroup(parentGrouped[''].childs);
    }

    return formated;
  };

  formateNodesAndEdges = (itens: Array<SubsidiaryByParentInfo>) => {
    const nodes: Array<Node> = [];
    const edges: Array<Edge> = [];

    // Quantidade de itens por linha
    const rowQtdItens = itens.reduce((prev, curr) => {
      prev[curr._level] = Math.max(curr._itemIdx + 1, prev[curr._level] || 1);
      return prev;
    }, [] as number[]);

    // Maior numéro de colunas nas linhas abaixo da linha.
    let last = 0;
    const rowQtdItensMax = [...rowQtdItens]
      .reverse()
      .map((value) => (last = Math.max(value, last)))
      .reverse();

    for (const item of itens) {
      const centerIn = rowQtdItensMax[item._level] - rowQtdItens[item._level];
      const appendLeft = (centerIn * NODE_X_STEP) / 2;

      const x = item._itemIdx * NODE_X_STEP + appendLeft;
      const y = (item._level - 1) * NODE_Y_STEP;

      const node: Node = {
        //
        id: '' + item.subsidiaryHashId,
        type: 'company',
        data: {
          ...item,
          label: `${item.subsidiary || ''}: ${item.subsidiaryDoc}`,
        },
        position: { x, y },
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
