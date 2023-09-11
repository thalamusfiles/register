import * as TransportStream from 'winston-transport';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

export default class EasyLoggerTransport extends TransportStream {
  isSSL: boolean;
  endpoint: URL;
  index: string;

  constructor(props: { endpoint: string; index: string } & TransportStream.TransportStreamOptions) {
    super(props);

    this.endpoint = new URL(props.endpoint);
    this.index = props.index;
    this.isSSL = props.endpoint.startsWith('https');
  }

  log(info: any, next: () => void): void {
    const data = Object.assign(
      { level: info.level, message: info.message },
      typeof info.context === 'object' ? info.context : { context: info.context },
    );
    const postData = JSON.stringify(data);

    try {
      const options = this.requestOptions(postData);
      if (this.isSSL) {
        this.sendHttps(options, postData);
      } else {
        this.sendHttp(options, postData);
      }
    } catch (ex) {
      console.error(ex);
    }
    next();
  }

  requestOptions(postData: string): https.RequestOptions | http.RequestOptions {
    const path = `${this.endpoint.pathname}/${this.index}`;

    return {
      hostname: this.endpoint.hostname,
      port: this.endpoint.port,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
      },
    };
  }

  async sendHttp(options: http.RequestOptions, postData: any): Promise<void> {
    const req = http.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.write(postData);
    req.end();
  }

  async sendHttps(options: https.RequestOptions, postData: any): Promise<void> {
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.write(postData);
    req.end();
  }
}
