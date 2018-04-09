/* global it, describe */

const ICheques = require('../bundle');

const { apiKey } = process.env;


describe('cadastro na iCheques', () => {
  const iCheques = new ICheques(apiKey);

  it('cheque', () => iCheques.chequeLegal(
    100.00, /* VALOR */
    new Date('2019-01-01'), /* VENCIMENTO */
    '033387820180002625773010298955', /* CMC7 */
    '29554082800', /* CPF ou CNPJ */
  ).then(data => console.log(data))); /* DADOS DO CHEQUE */
});
