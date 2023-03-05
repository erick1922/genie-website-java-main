var Repositorio = function(){

    var refreshTable = function(div){
        $(div).block({
            message: "",
            css: {
                top: '10%',
                border: '0',
                padding: '0',
                backgroundColor: 'none'
            },
            overlayCSS: {
                backgroundColor:'#2F4050',
                opacity: 0.3,
                cursor: 'wait'
            }
        });
    };

    var Loading = function(div){
        var html = "<div class=\"spiner-example\">" +
            "<div class=\"sk-spinner sk-spinner-three-bounce\">" +
            "<div class=\"sk-bounce1\"></div>" +
            "<div class=\"sk-bounce2\"></div>" +
            "<div class=\"sk-bounce3\"></div>" +
            "</div>" +
            "</div>";
        $(div).block({
            message: html,
            css: {
                top: '10%',
                border: '0',
                padding: '0',
                backgroundColor: 'none'
            },
            overlayCSS: {
                backgroundColor:'#2F4050',
                opacity: 0.3,
                cursor: 'wait'
            }
        });
    };

    var refreshGrafic = function(div){
        $(div).block({
            message: "<div class='sk-spinner sk-spinner-circle'>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle1 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle2 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle3 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle4 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle5 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle6 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle7 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle8 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle9 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle10 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle11 sk-circle'></div>" +
            "<div style='width:30px!important;height:30px!important;' class='sk-circle12 sk-circle'></div>" +
            "</div>",
            css: {
                top: '10%',
                border: '0',
                padding: '0',
                backgroundColor: 'none'
            },
            overlayCSS: {
                backgroundColor:'#2F4050',
                opacity: 0.3,
                cursor: 'wait'
            }
        });
    };
    var finishRefresh = function (div) {
        $(div).unblock();
    };

    var ValidarDniCliente = function(btnValidar,txtNombre,pNumDni){
        btnValidar.start();
        //  "http://api.ateneaperu.com/api/Reniec/Dni?sNroDocumento={0}",dni);
        $.ajax({
            type: 'get',
            headers: {  'Access-Control-Allow-Origin': 'http://localhost:8080/'},
            crossDomain: true,
            url: 'http://api.ateneaperu.com/api/Reniec/Dni',
            data: {"dni":pNumDni},
            ///dataType: 'json',
            success: function(data){
                console.log(data);
               /* if(data!==null){
                    var dato = data.dato;
                    if(dato === "OK"){
                        estilo_error(false, $(txtNombre));
                        $(txtNombre).val(data.rpta.nombre_o_razon_social);
                        btnValidar.stop();
                    }else if(dato === "ERROR") {
                        uploadMsnSmall(data.rpta,'ALERTA');
                        btnValidar.stop();
                    }
                }else{
                    btnValidar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }*/
            },
            error: function (jqXHR, status, error) {
                btnValidar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    return {
        refreshTable:function(div){
            refreshTable(div);
        },
        refreshGrafic:function(div){
            refreshGrafic(div);
        },
        finishRefresh:function(div){
            finishRefresh(div);
        },
        ValidarDniCliente: function(btnValidar,txtNombre,pNumDni){
            ValidarDniCliente(btnValidar,txtNombre,pNumDni);
        },
        Loading: function (div) {
            Loading(div);
        }
    };
}();