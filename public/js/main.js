$(function () {
    //evento disparado no clique do botão
    $('#btn').click(function (e) {
        e.preventDefault();
        let quantidade = $('#quantidade').val()
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
    })
    $('.money').mask("#.##0,00", { reverse: true });
})