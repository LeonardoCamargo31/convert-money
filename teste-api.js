const axios = require('axios')
const url = 'ohttps://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%2704-22-2019%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao'
axios.get(url)
    .then(resultado => console.log(resultado.data.value[0]))
    .catch(err => console.log(err))