const api = require('./bcb-api')
const axios = require('axios')

//olha jest o axios quando for chamado aqui ele não é o axios de verdade, eu quero passar uma versão desse axios aqui
jest.mock('axios')

//chama a api com axios
test('Obter cotação', () => {
    //isso é o que nossa api responde
    const res = {
        data: [{
            bid: 3.9387
        }]
    }
    axios.get.mockResolvedValue(res)//então ele não usa o axios real lá e sim esse nosso falso
    api.getCotacaoAPI('url').then(resp => {
        expect(resp.bid).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})

test('extract Cotação', () => {
    const cotacao = api.extractCotacao({
        data: [{
            bid: 3.9387
        }]
    })

    expect(cotacao).toBe(3.9387)
})

test('getCotacao', () => {
    const res = {
        data: [{
            ask: 3.9387
        }]
    }

    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockResolvedValue(res)

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.9387)

    api.pure
        .getCotacao({ getCotacaoAPI, extractCotacao })()
        .then(res => {
            expect(res).toBe(3.9387)
        })
})

//em caso de erro na cotação
test('Erro em getCotacao', () => {
    const getCotacaoAPI = jest.fn()
    getCotacaoAPI.mockReturnValue(Promise.reject('err'))//fazer a aplicação quebrar

    const extractCotacao = jest.fn()
    extractCotacao.mockReturnValue(3.90)

    api.pure
        .getCotacao({ getCotacaoAPI, extractCotacao })()
        .then(res => {
            expect(res).toBe('')//recebeu uma string vazia
        })
})