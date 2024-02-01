class EndpointsConfigure {
  url = null as string | null;
  port = null as string | null;
  base = null as string | null;
  timeout = 10000;
  // Auth
  eAuth = null as string | null;
  eAuthIam = '/iam';
  eAuthToken = '/token';
  eAuthLogout = '/logout';
  // API Person
  ePerson = null as string | null;
  ePersonLegal = `/legal`;
  ePersonLegalRandom = `/legal/random`;
  ePersonNatural = `/natural`;
  ePersonNaturalRandom = `/natural/random`;
  ePersonSubsidiaries = `/matrizsubsidiary/subsidiaries`;

  // API Person
  eEstablishment = null as string | null;
  eEstablishmentZipcode = `/zipcode`;
  eEstablishmentZipcodeRandom = `/zipcode/random`;
  eEstablishmentBusinessType = `/businesstype`;
  eEstablishmentBusinessTypeRandom = `/businesstype/random`;

  // API Contact
  eContact = null as string | null;
  eContactFind = `/`;
  eContactFindRandom = `/random`;

  // API Person
  eAddress = null as string | null;
  eAddressState = `/state`;
  eAddressCity = `/city`;

  // API Rel Establishment
  eRelEstablishment = null as string | null;
  eRelEstablishmentTotalByMonthState = `/totalbymonthstate`;
  eRelEstablishmentTotalByMonthStateCrosstab = `/totalbymonthstate/crosstab`;
  eRelEstablishmentTotalByMonthNature = `/totalbymonthnature`;
  eRelEstablishmentTotalByMonthMainActivity = `/totalbymonthmainactivity`;

  // API TypeKeyValue
  eTypeKeyValue = null as string | null;
  eTypeKeyValueBrCnae = `/br/cnae`;

  configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
    const baseEndpoint = basePort ? `${baseUrl}:${basePort}` : baseUrl;

    // Auth
    const eAuth = `${baseEndpoint}/auth`;
    // Api
    const ePerson = `${baseEndpoint}/api/person`;
    const eAddress = `${baseEndpoint}/api/address`;
    const eEstablishment = `${baseEndpoint}/api/establishment`;
    const eContact = `${baseEndpoint}/api/contact`;
    const eTypeKeyValue = `${baseEndpoint}/api/keyvalue`;
    // API Relatórios
    const eRelEstablishment = `${baseEndpoint}/api/rel/establishment`;

    this.url = baseUrl;
    this.port = basePort;
    this.base = baseEndpoint;
    this.ePerson = ePerson;
    this.eAuth = eAuth;
    this.eAddress = eAddress;
    this.eEstablishment = eEstablishment;
    this.eContact = eContact;
    this.eTypeKeyValue = eTypeKeyValue;
    this.eRelEstablishment = eRelEstablishment;
  };
}

const Endpoints = new EndpointsConfigure();

export default Endpoints;
