$(function () {
    //evento disparado no clique do botão
    $('#btn').click(function () {
        let quantidade = $('#quantidade').val()
        if (quantidade !== "") {
            if (!isNaN(quantidade)) {
                //caso digite o valor correto
                //envio os dados
                send(quantidade)
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


function getBaseUrl() {
    var getUrl = window.location;
    return getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
}

function send(quantidade) {
    var base_url = getBaseUrl();
    $('form').hide()
    $.ajax({
        type: "POST",
        url: base_url + "cotacao",
        data: { quantidade },
        success: function (data) {
            if (!data.error) {
                $('.cotacao').show()
                $('.vl_quantidade').html('$ '+data.quantidade)
                $('.vl_cotacao').html('R$ '+data.cotacao+' (atualizada '+data.data+')')
                $('.vl_resultado').html('R$ '+data.resultado)
            } else {
                $('.erro').show()
            }
        },
        error: function (data) {
            $('.erro').show()
        }
    });
}