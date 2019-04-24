const api = require('./bcb-api')
const axios = require('axios')

//olha jest o axios quando for chamado aqui ele não é o axios de verdade, eu quero passar uma versão desse axios aqui
jest.mock('axios')

test('Obter cotação', () => {
    //isso é o que nossa api responde
    const res = {
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    }
    axios.get.mockResolvedValue(res)//então ele não usa o axios real lá e sim esse nosso falso
    api.getCotacaoAPI('url').then(resp => {
        expect(resp).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})

test('extract Cotação', () => {
    const cotacao = api.extractCotacao({
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    })
    expect(cotacao).toBe(3.90)
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
        expect(today).toBe('1-1-2019')
    })
})


test('getUrl', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})


test('getCotacao', () => {
    const res = {
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    }

    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')

    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockResolvedValue(res)

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.90)

    api.pure
        .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
        .then(res => {
            expect(res).toBe(3.9)
        })
})

//em caso de erro
test('getCotacao', () => {
    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')

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