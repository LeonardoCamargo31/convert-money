const axios = require('axios')
const dateFns = require('date-fns')
const pt = require('date-fns/locale/pt')

const getUrl = data => `http://economia.awesomeapi.com.br/json/USD-BRL/?start_date=${data}&end_date=${data}`
const getCotacaoAPI = (url) => axios.get(url)
const extractCotacao = res => res.data[0]
const getToday = () => {
    const today = new Date()
    const day = ("0" + today.getDate()).slice(-2)
    const month = ("0" + (today.getMonth()+1)).slice(-2)
    const year = today.getFullYear()
    return year+''+month+''+day
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

const getData= (lastUpdate)=>{
    return dateFns.distanceInWords(
        lastUpdate,
        new Date(),
        { locale: pt }
    )
}

module.exports = {
    getUrl,
    getData,
    getToday,
    getCotacaoAPI,
    getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao }),//já passo as dependencias
    extractCotacao,
    pure: { getCotacao } //passando ele puro, sem as dependencias
}