class EndpointsConfigure {
  url = null as string | null;
  port = null as string | null;
  base = null as string | null;
  timeout = 5000;
  // API Person
  ePerson = null as string | null;
  ePersonLegal = `/legal`;
  ePersonLegalRandom = `/legal/random`;
  ePersonNatural = `/natural`;
  ePersonNaturalRandom = `/natural/random`;

  // API Person
  eEstablishment = null as string | null;
  eEstablishmentZipcode = `/zipcode`;
  eEstablishmentZipcodeRandom = `/zipcode/random`;
  eEstablishmentBusinessType = `/businesstype`;

  // API Person
  eAddress = null as string | null;
  eAddressState = `/state`;
  eAddressCity = `/city`;
  
  // API TypeKeyValue
  eTypeKeyValue = null as string | null;
  eTypeKeyValueBrCnae = `/br/cnae`;

  configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
    const baseEndpoint = basePort ? `${baseUrl}:${basePort}` : baseUrl;

    const apiPerson = `${baseEndpoint}/api/person`;
    const eAddress = `${baseEndpoint}/api/address`;
    const eEstablishment = `${baseEndpoint}/api/establishment`;
    const eTypeKeyValue = `${baseEndpoint}/api/keyvalue`;

    this.url = baseUrl;
    this.port = basePort;
    this.base = baseEndpoint;
    this.ePerson = apiPerson;
    this.eAddress = eAddress;
    this.eEstablishment = eEstablishment;
    this.eTypeKeyValue = eTypeKeyValue;
  };
}

const Endpoints = new EndpointsConfigure();

export default Endpoints;
