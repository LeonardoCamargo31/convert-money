const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
const getCotacaoAPI = (url) => axios.get(url)
const extractCotacao = res => res.data.value[0].cotacaoVenda
const getToday = () => {
    const today = new Date()
    return (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear()
}
//coloquei uma ()= > ou seja a primeira vez passo as dependencias , e quando chamar novamente, ai sim executa a função de verdade
//const { getToday, getUrl, getCotacaoAPI, extractCotacao } = deps //deps.getToday uso o destruct
//já destruturar ele nos parametros
const getCotacao = ({ getToday, getUrl, getCotacaoAPI, extractCotacao }) => async () => {
    try {
        const today = getToday()
        const url = getUrl(today)
        const res = await getCotacaoAPI(url)
        const cotacao = extractCotacao(res)
        return cotacao
    }
    catch (err) {
        return ''
    }
}

module.exports = {
    getUrl,
    getToday,
    getCotacaoAPI,
    getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao }),//já passo as dependencias
    extractCotacao,
    pure: { getCotacao } //passando ele puro, sem as dependencias
}