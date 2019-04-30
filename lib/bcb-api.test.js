const api = require('./bcb-api')
const axios = require('axios')

//olha jest o axios quando for chamado aqui ele não é o axios de verdade, eu quero passar uma versão desse axios aqui
jest.mock('axios')

test('Obter cotação', () => {
    //isso é o que nossa api responde
    const res = {
        data: [{
            ask: 3.9387
        }]
    }
    axios.get.mockResolvedValue(res)//então ele não usa o axios real lá e sim esse nosso falso
    api.getCotacaoAPI('url').then(resp => {
        expect(resp.ask).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})

test('extract Cotação', () => {
    const cotacao = api.extractCotacao({
        data: [{
            ask: 3.9387
        }]
    })
    expect(cotacao).toEqual({
        ask: 3.9387
    })
})

//describe para agrupar varios testes
describe('getToday', () => {
    const RealDate = Date

    //podemos fixar a data
    function mockDate(date) {
        global.Date = class extends RealDate {
            constructor() {
                return new RealDate(date)
            }
        }
    }
    afterEach(() => {
        global.Date = RealDate
    })

    test('getToday', () => {
        mockDate('2019-01-01T12:00:00z')
        const today = api.getToday()
        expect(today).toBe('20190101')
    })
})


test('getUrl', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe('http://economia.awesomeapi.com.br/json/USD-BRL/?start_date=MINHA-DATA&end_date=MINHA-DATA')
})


test('getCotacao', () => {
    const res = {
        data: [{
            ask: 3.9387
        }]
    }

    const getToday = jest.fn()
    getToday.mockReturnValue('30042019')

    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockResolvedValue(res)

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.9387)

    api.pure
        .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
        .then(res => {
            expect(res).toBe(3.9387)
        })
})

//em caso de erro
test('Erro em getCotacao', () => {
    const getToday = jest.fn()
    getToday.mockReturnValue('30042019')

    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockReturnValue(Promise.reject('err'))//fazer a aplicação quebrar

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.90)

    api.pure
        .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
        .then(res => {
            expect(res).toBe('')//recebeu uma string vazia
        })
})