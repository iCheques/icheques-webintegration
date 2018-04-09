# icheques-webintegration@1.0.0


Integração rápida Java Script para os serviços iCheques.


## Installation
Download node at [nodejs.org](http://nodejs.org) and install it, if you haven't already.

```sh
npm install icheques-webintegration --save
```

```js
const ICheques = require('icheques-webintegration');

const apiKey = '/* MINHA APIKEY */'
const documento = '/* cpf/cnpj do cheque */'
const CMC = '/* cmc7 do cheque */' 

const iCheques = new ICheques(apiKey);

iCheques.chequeLegal(
    100.00, /* VALOR */
    new Date('2018-09-01'), /* VENCIMENTO */
    CMC, /* CMC7 */
    documento, /* CPF ou CNPJ */
).then(data => console.log(data)); /* DADOS DO CHEQUE */

iCheques.protestos(documento).then(data => console.log(data)); /* DADOS DO CPF */  
iCheques.pesquisaCadastral(documento).then(data => console.log(data)); /* DADOS DO CPF */  
 
```

This package is provided in these module formats:

- UMD

## Dependencies

- bipbop-webservice
- bipbop-websocket](https://github.com/bipbop/bipbop-websocket): Connect to bipbop websocket endpoint.

## Dev Dependencies

- [cmc7-validador](): 
- [cpf_cnpj](https://github.com/fnando/cpf_cnpj.js): Validate, generate and format CPF/CNPJ numbers
- [eslint](): 
- [eslint-config-airbnb-base](https://github.com/airbnb/javascript): Airbnb's base JS ESLint config, following our styleguide
- [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import): Import with sanity.
- [event-emitter](https://github.com/medikoo/event-emitter): Environment agnostic event emitter
- [human-interval](https://github.com/rschmukler/human-interval): Human readable time measurements
- [rollup-plugin-buble](): 
- [rollup-plugin-commonjs](): 
- [rollup-plugin-node-resolve](): 


## License
[MIT]()
