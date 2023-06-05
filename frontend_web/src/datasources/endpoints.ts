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

  configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
    const baseEndpoint = basePort ? `${baseUrl}:${basePort}` : baseUrl;

    const apiPerson = `${baseEndpoint}/api/person`;
    const eEstablishment = `${baseEndpoint}/api/establishment`;

    this.url = baseUrl;
    this.port = basePort;
    this.base = baseEndpoint;
    this.ePerson = apiPerson;
    this.eEstablishment = eEstablishment;
  };
}

const Endpoints = new EndpointsConfigure();

export default Endpoints;
