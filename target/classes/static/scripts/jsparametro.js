var Parametro = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var ListParametro = function(){
        table = $("#tblParametro").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_parametros",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmParametro input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#estado",false);
        $("#desc").val("");
    };

    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Parametro");
        $("#accion").val("save");
        $("#id").val("0");
        $("#estado").selectpicker('val','H');
        $("#modalParametro").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_parametro",
            dataType: 'json',
            data:$("#frmParametro").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalParametro").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#codigo");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#codigo");uploadMsnSmall("EL Codigo debe de tener solo 3 digitos.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#nombre");}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#nombre");uploadMsnSmall("EL Nombre del Parametro debe de ser menor a 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#valor");}
                                if(respJson.listado[i] === "E6"){estilo_error(true,"#valor");uploadMsnSmall("EL Valor del parametro debe de ser menor a 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E7"){style_error_cbo_final("#estado",true);}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        cargando.stop();
                    }
                }else{
                    cargando.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cargando.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var view_record = function(elem){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_parametro",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#codigo").val(respJson.codigo);
                    $("#nombre").val(respJson.nombre);
                    $("#valor").val(respJson.valor);
                    $("#desc").val(respJson.descripcion);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Parametro");
                    $("#accion").val("update");
                    $("#modalParametro").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var delete_record = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Parametro?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_parametro',
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

    var Iniciando = function(){
        ListParametro();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        keyup_input_general_3("#frmParametro input", "#frmParametro", "#modalParametro");
    };

    return {
        init: function () {
            Iniciando();
        },
        view_record:function(elem){
            view_record(elem);
        },
        delete_record:function(elem){
            delete_record(elem);
        }
    };
}();
jQuery(document).ready(function () {
    Parametro.init();
});