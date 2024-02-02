const cnpjRegex = /(\d{7,8})(\d{4})(\d{2})/;

type DocumentTypes = 'cnpj' | 'cpf';
export function formatDocumentToSearch(type: DocumentTypes, document: string): string | null {
  switch (type) {
    case 'cnpj':
      const mathces = document.replace(/[\.\/-]/g, '').match(cnpjRegex);
      if (mathces) return `${mathces[1]}/${mathces[2]}-${mathces[3]}`;
      break;
    case 'cpf':
      return `***${document.substring(3, 9)}**`;
    default:
  }
  return null;
}

export function establishmentHashIdWhere(document: string) {
  return `hashtextextended('br:br_gov_dados:${document}', 1)`;
}

export function establishmentHash(document: string) {
  return `br:br_gov_dados:${document}`;
}
