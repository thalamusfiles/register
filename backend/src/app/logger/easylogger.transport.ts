import * as TransportStream from 'winston-transport';
import * as http from 'http';
import * as https from 'https';

export default class EasyLoggerTransport extends TransportStream {
  isSSL: boolean;
  endpoint: string;
  index: string;

  constructor(props: { endpoint: string; index: string } & TransportStream.TransportStreamOptions) {
    super(props);

    this.endpoint = props.endpoint;
    this.index = props.index;

    this.isSSL = this.endpoint.startsWith('https');
  }

  log(info: any, next: () => void): void {
    const data = Object.assign(
      { level: info.level, message: info.message },
      typeof info.context === 'object' ? info.context : { context: info.context },
    );

    if (this.isSSL) {
      this.sendHttps(data);
    } else {
      this.sendHttp(data);
    }

    next();
  }

  async sendHttp(data: any): Promise<void> {
    const postData = JSON.stringify(data);

    const req = https.request({
      hostname: this.endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    });

    req.write(postData);
    req.end();
  }
  async sendHttps(data: any): Promise<void> {
    const postData = JSON.stringify(data);

    const req = http.request({
      hostname: this.endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
      },
    });

    req.write(postData);
    req.end();
  }
}
