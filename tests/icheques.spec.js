/* global it, describe */

const ICheques = require('../bundle');
const { apiKey, documento, CMC } = process.env;


describe('cadastro na iCheques', function iChequesTest() {
  const iCheques = new ICheques(apiKey);
  this.timeout(5000000);
  it('cheque', () => iCheques.chequeLegal(
    100.00, /* VALOR */
    new Date('2018-09-01'), /* VENCIMENTO */
    CMC, /* CMC7 */
    documento, /* CPF ou CNPJ */
  ).then(data => console.log(data))); /* DADOS DO CHEQUE */

  it('protestos', () => iCheques.protestos(documento).then(data => console.log(data))); /* DADOS DO CPF */  
  it('pesquisaCadastral', () => iCheques.pesquisaCadastral(documento).then(data => console.log(data))); /* DADOS DO CPF */  
});
