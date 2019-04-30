const axios = require('axios')
const dateFns = require('date-fns')
const pt = require('date-fns/locale/pt')

const getCotacaoAPI = (url) => axios.get(url)
const extractCotacao = res => res.data[0]
//coloquei uma ()= > ou seja a primeira vez passo as dependencias , e quando chamar novamente, ai sim executa a função de verdade
//const { getCotacaoAPI, extractCotacao } = deps //deps.getToday uso o destruct
//já destruturar ele nos parametros
const getCotacao = ({ getCotacaoAPI, extractCotacao }) => async () => {
    const url = 'https://economia.awesomeapi.com.br/USD-BRL/1?format=json';
    try {
        const res = await getCotacaoAPI(url)
        const cotacao = extractCotacao(res)
        return cotacao
    }
    catch (err) {
        return ''
    }
}

const getData= (lastUpdate)=>{
    return dateFns.distanceInWords(
        lastUpdate,
        new Date(),
        { locale: pt }
    )
}

module.exports = {
    getData,
    getCotacaoAPI,
    getCotacao: getCotacao({ getCotacaoAPI, extractCotacao }),//já passo as dependencias
    extractCotacao,
    pure: { getCotacao } //passando ele puro, sem as dependencias
}