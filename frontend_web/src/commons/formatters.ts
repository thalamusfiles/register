import moment from 'moment';
import numeral from 'numeral';

export const formatBoolean = (value: string | number | boolean): string => {
  return value ? 'Sim' : 'Não';
};

export const formatInteger = (number: string | number): string => {
  const f = numeral(number);
  return f.format();
};

export const formatDecimal = (number: string | number /*, decimals: number | null = null*/): string => {
  const f = numeral(number);
  return f.format();
};

//Todo: Alterar formato de datas ao alterar idioma
export const formatDatetime = (number: string | moment.Moment /*, decimals: number | null = null*/): string => {
  const f = moment(number);
  return f.isValid() ? f.format('L LT') : '';
};

//Todo: Alterar formato de datas ao alterar idioma
export const formatDate = (number: string | moment.Moment): string => {
  const f = moment(number);
  return f.isValid() ? f.format('L') : '';
};

export const formatTime = (number: string | moment.Moment): string => {
  const f = moment(number);
  return f.isValid() ? f.format('LT') : '';
};

export const formatCurrency = (number: string | number /*, decimals: number | null = null*/, currency: string): string => {
  return currency + ' ' + formatDecimal(number);
};

type DocumentTypes = 'cnpj' | 'cpf';
const cnpjRegex = /(\d{7,8})(\d{4})(\d{2})/;
export function formatDocumentToSearch(type: DocumentTypes | null, document: string): string {
  document = document.replace(/[./-]/g, '');
  if (!type) {
    type = document.length === 14 ? 'cnpj' : null;
  }
  switch (type) {
    case 'cnpj':
      const mathces = document.match(cnpjRegex);
      if (mathces) return `${mathces[1]}/${mathces[2]}-${mathces[3]}`;
      break;
    case 'cpf':
      return document;
    default:
      return document;
  }
  return '';
}
