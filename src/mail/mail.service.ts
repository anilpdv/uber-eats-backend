import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/jwt/jwt.constants';
import { EmailVar, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    console.log({ options });
  }

  private sendEmail(
    subject: string,
    to: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const form = new FormData();
    form.append('from', `Excited User <mailgun@${this.options.domain}>`);
    form.append('to', to);
    form.append('subject', subject);
    form.append('template', template);
    emailVars.forEach((eVar) => {
      form.append(`v:${eVar.key}`, eVar.value);
    });

    axios({
      url: `https://api.mailgun.net/v3/${this.options.domain}/messages`,
      method: 'post',
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${this.options.apiKey}`,
        ).toString('base64')}`,
      },
      data: form,
    })
      .then((res) => {
        console.log({ body: res });
      })
      .catch((err) => console.log({ err }));
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', email, 'basic_alert_template', [
      { key: 'username', value: email },
      { key: 'code', value: code },
    ]);
  }
}
