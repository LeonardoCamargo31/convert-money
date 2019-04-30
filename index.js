const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const { convert, toMoney } = require('./lib/convert')
const apiBCB = require('./lib/bcb-api')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', async (req, res) => {
    const cotacao = await apiBCB.getCotacao()
    res.render('home', {
        cotacao: toMoney(cotacao.ask),
        data: apiBCB.getData(cotacao.create_date)
    })
})

app.post('/cotacao', async (req, res) => {
    const { quantidade } = req.body
    const cotacao = await apiBCB.getCotacao()
    if (cotacao && quantidade) {
        const resultado = convert(cotacao.ask, quantidade)

        res.json({
            error: false,
            cotacao: toMoney(cotacao.ask),
            quantidade: toMoney(quantidade),
            resultado: toMoney(resultado),
            data: apiBCB.getData(cotacao.create_date)
        })
    } else {
        res.json({
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