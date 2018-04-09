import BIPBOP from 'bipbop-webservice';
import WebSocket from 'bipbop-websocket';
import humanInterval from 'human-interval';

import CMC7Validador from 'cmc7-validador';
import { CPF, CNPJ } from 'cpf_cnpj';
import ee from 'event-emitter';

function checkContent(objectResponse) {
  return new Promise((accept, reject) => {
    const errorMessage = BIPBOP.get(objectResponse, 'BPQL.header.exception');
    if (errorMessage) {
      return reject(new Error(errorMessage));
    }
    return accept(BIPBOP.get(objectResponse, 'BPQL.body'));
  });
}

export default class ICheques {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = new BIPBOP.WebService(apiKey);
    this.ee = ee();
    this.socket = new WebSocket(apiKey, e => this.ee.emit('message', e));
  }

  protestos(documento) { /* CCF + CARTÓRIO */
    return this.ws.request("SELECT FROM 'CCBUSCA'.'PROTESTOS'", {
      documento,
    })
      .then(response => response.text())
      .then(textResponse => BIPBOP.WebService.parse(textResponse))
      .then(objectResponse => checkContent(objectResponse));
  }

  pesquisaCadastral(documento) { /* TELEFONE + ENDEREÇO */
    return this.ws.request("SELECT FROM 'FINDER'.'CONSULTA'", {
      documento,
    })
      .then(response => response.text())
      .then(textResponse => BIPBOP.WebService.parse(textResponse))
      .then(objectResponse => checkContent(objectResponse));
  }

  chequeLegal(valor, vencimento, userCMC, documento) {
    const cmc = userCMC.replace(/[^\d]/g, '');
    if (!new CMC7Validador(cmc).isValid()) {
      throw new Error(`O número de CMC7 ${userCMC} não é válido, por tanto o cheque não pode ser cadastrado`);
    }

    if (!CPF.isValid(documento) && !CNPJ.isValid(documento)) {
      throw new Error(`O documento ${documento} não é um CPF ou CNPJ válido, por tanto o cheque não pode ser cadastrado`);
    }

    if (!vencimento || typeof vencimento.getMonth !== 'function') {
      throw new Error('O vencimento configurado não é uma data válida');
    }

    return this.ws.request("SELECT FROM 'ICHEQUES'.'CHECK'", {
      cmc,
      ammount: Math.ceil(valor * 100),
      expire: vencimento.getFullYear() + (`0${vencimento.getMonth()}`).slice(-2) + (`0${vencimento.getDate()}`).slice(-2),
      [CPF.isValid(documento) ? 'cpf' : 'cnpj']: documento,
    })
      .then(response => response.text())
      .then(textResponse => BIPBOP.WebService.parse(textResponse))
      .then(objectResponse => checkContent(objectResponse))
      .then(({ check }) => (check.situation ? check : new Promise((resolve, reject) => {
        let timeout;

        const event = ({ method, data }) => {
          if (method !== 'ichequeUpdate') return;
          if (!data.situation) return;
          if (cmc !== data.cmc) return;
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }

          resolve(data);
          this.ee.off('message', event);
        };

        timeout = setTimeout(() => {
          this.ee.off('message', event);
          reject(new Error(`Não foi possível pesquisar o cheque ${userCMC} em 3 minutos, tente novamente mais tarde`));
        }, humanInterval('3 minutes'));

        this.ee.on('message', event);
      })));
  }
}
