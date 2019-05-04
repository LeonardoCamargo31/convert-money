$(function () {
    //evento disparado no clique do botão
    $('#btn').click(function (e) {
        e.preventDefault();

        let quantidade = $('#quantidade').val()
        let cotacao =  $('#cotacao').val()

        if (!isNaN(cotacao)) {
            if (quantidade !== "") {
                if (!isNaN(quantidade)) {
                    //caso digite o valor correto
                    //envio os dados
                    $('#form').submit();
                }
                else {
                    //caso digite letras, exibe a mensagem de erro
                    $('.form-control-quantidade').addClass('error')
                    $('.invalid-feedback').html('Insira somente números')
                }
            } else {
                //caso o input esteja vazio, remove a classe de erro e metros recebe 0
                $('.form-control-quantidade').addClass('error')
                $('.invalid-feedback').html('Insira algum valor')
            }
        }
        else{
            $('.form-control-cotacao').addClass('error')
            $('.invalid-feedback').html('Não foi possivel obter a cotação, tente mais tarde.')
        }
    })
    $('.money').mask("#.##0,00", { reverse: true });
})