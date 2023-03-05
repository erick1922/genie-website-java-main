var Factor = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;

    var ListMarca = function(){
        table = $("#tblMarca").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_factores",data:function(d){d.origen = $("#cboLiOrigen").val();d.destino = $("#cboLiDestino").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [5]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmMarca input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#cboUnidadOrigen",false);
        style_error_cbo_final("#cboUnidadDestino",false);
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Nuevo Factor de Conversión");
        $("#accion").val("save");
        $("#id").val("0");
        $("#cboUnidadOrigen").selectpicker('val','0');
        $("#cboUnidadDestino").selectpicker('val','0');
        $("#modalMarca").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_factor",
            dataType: 'json',
            data:$("#frmMarca").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalMarca").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){style_error_cbo_final("#cboUnidadOrigen",true);}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#cboUnidadDestino",true);}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#factor");uploadMsnSmall("El valor debe de ser mayor a cero.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#operacion");uploadMsnSmall("El tipo de operación debe de ser * o /.",'ALERTA');}
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
            url: "view_factor",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#factor").val(respJson.factorUnidad);
                    $("#operacion").val(respJson.operacion);
                    $("#cboUnidadOrigen").selectpicker('val',respJson.unidadOrigen.id);
                    $("#cboUnidadDestino").selectpicker('val',respJson.unidadDestino.id);
                    $("#titulo").html("Modificar Factor de Conversion");
                    $("#accion").val("update");
                    $("#modalMarca").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el factor de conversion?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_factor',
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
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#cboLiOrigen,#cboLiDestino").on("change",function () {table._fnDraw();});
        $("#cboUnidadOrigen").on("change",function(){style_error_cbo_final('#cboUnidadOrigen',false);});
        $("#cboUnidadDestino").on("change",function(){style_error_cbo_final('#cboUnidadDestino',false);});
        keyup_input_general_3("#frmMarca input", "#frmMarca", "#modalMarca");
        $.ajax({
            type: 'post',
            url: "mant_factor",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboLiDestino,#cboLiOrigen").html("<option value='0'>--TODOS--</option>"+data.htUnd);
                    $("#cboUnidadOrigen,#cboUnidadDestino").html("<option value='0'>--SELECCIONE--</option>"+data.htUnd);
                    $(".selectpicker").selectpicker("refresh");
                    ListMarca();
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
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
    Factor.init();
});