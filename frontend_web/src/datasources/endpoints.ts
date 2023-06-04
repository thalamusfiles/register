class EndpointsConfigure {
  url = null as string | null;
  port = null as string | null;
  base = null as string | null;
  timeout = 5000;
  // API Person
  apiPerson = null as string | null;
  apiPersonLegal = `/legal`;
  apiPersonLegalRandom = `/legal/random`;
  apiPersonNatural = `/natural`;

  configureEndpoint = (baseUrl: string = 'localhost', basePort: string = '3000') => {
    const baseEndpoint = basePort ? `${baseUrl}:${basePort}` : baseUrl;

    const apiPerson = `${baseEndpoint}/api/person`;

    this.url = baseUrl;
    this.port = basePort;
    this.base = baseEndpoint;
    this.apiPerson = apiPerson;
  };
}

const Endpoints = new EndpointsConfigure();

export default Endpoints;
