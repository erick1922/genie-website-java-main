var Copia = function(){
    var cargando = Ladda.create(document.querySelector('#btnNuevo'));
    var backup = Ladda.create(document.querySelector('#btnBackup'));
    var table;
    var ListCopias = function(){
        table = $("#tblCopias").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_backups",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [3]},
                {'bSearchable': false, 'aTargets': [0,1]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var download_file = function(elem){
        $.ajax({
            type: 'post',
            url: 'save_file',
            data: {"id":$(elem).attr("id"),"tipo":"2"},
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    if(data.dato === 'OK'){
                        var url = "downloadFile";
                        window.open(url,'_blank');
                    }else{
                        uploadMsnSmall(data.msj,"ERROR");
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var delete_record = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar la Copia de Seguridad?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_copia',
                        data: {"id":$(elem).attr("id")},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    table._fnDraw();
                                }
                            }else{
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function (jqXHR, status, error) {
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                }
            }
        });
    };


    var generar_backup = function () {
        cargando.start();
        $.ajax({
            type: 'post',
            url: "process_backup",
            dataType: 'json',
            success: function (respJson) {console.log(respJson);
                if(respJson !== null){
                    if(respJson.dato === "OK"){
                        table._fnDraw();
                        cargando.stop();
                        uploadMsnSmall('Copia generada correctamente.','OK');
                    }else if(respJson.dato === "ERROR"){
                        uploadMsnSmall('Problemas al generar','ERROR');
                        cargando.stop();
                    }
                }else{
                    cargando.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargando.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var generar_backup2 = function () {
        backup.start();
        $.ajax({
            type: 'post',
            url: "process_backup2",
            dataType: 'json',
            success: function (respJson) {console.log(respJson);
                if(respJson !== null){
                    if(respJson.dato === "OK"){
                        table._fnDraw();
                        backup.stop();
                        uploadMsnSmall('Copia generada correctamente.','OK');
                    }else if(respJson.dato === "ERROR"){
                        uploadMsnSmall('Problemas al generar','ERROR');
                        backup.stop();
                    }
                }else{
                    backup.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                backup.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        ListCopias();
        $("#btnNuevo").on("click",generar_backup);
        $("#btnBackup").on("click",generar_backup2);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $.ajax({
            type: 'post',
            url: "returnValor",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                   console.log(respJson);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    return {
        init: function(){
            Iniciando();
        },
        delete_record:function (elem) {
            delete_record(elem);
        },
        download_file:function (a) {
            download_file(a);
        }
    };
}();
jQuery(document).ready(function () {
    Copia.init();
});