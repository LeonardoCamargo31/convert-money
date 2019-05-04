const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const { convert, toMoney } = require('./lib/convert')
const apiBCB = require('./lib/bcb-api')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    const cotacao = await apiBCB.getCotacao()
    if (cotacao) {
        res.render('home', {
            cotacao: toMoney(cotacao)
        })
    } else {
        res.render('home', {
            cotacao: 'Não foi possivel obter a cotação'
        })
    }
})

app.get('/cotacao', async (req, res) => {
    const { cotacao, quantidade } = req.query
    if (cotacao && quantidade) {
        const resultado = convert(cotacao, quantidade)
        res.render('cotacao', {
            error: false,
            cotacao: toMoney(cotacao),
            quantidade: toMoney(quantidade),
            resultado: toMoney(resultado)
        })
    } else {
        res.render('cotacao', {
            error: 'Valores inválidos'
        })
    }
})

app.listen(port, (err) => {
    if (err) {
        console.log('Não foi possivel inicial o servidor.')
    } else {
        console.log(`Servidor rodando na porta : ${port}`)
    }
})