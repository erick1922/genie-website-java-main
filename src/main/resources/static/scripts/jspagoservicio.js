var PagoServicio = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var table;
    var id;

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pagoservicio",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.est = $("#cboLiEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"centrador",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $("#monto").val("0.00");
        $("#descripcion").val("");
        $('#div-fecinicie').datepicker('update',fecAct);
        $('#div-fecfincie').datepicker('update',fecAct);
        $('#div-fecvenc').datepicker('update',fecAct);
    };

    var new_record = function(){
        Limpiar();
        $("#titPago").html("Registrar Pago Servicio");
        $("#accion").val("save");
        $("#modalPago").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_pagoservicio",
            dataType: 'json',
            data:$("#frmPago").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#modalPago").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        cargando.stop();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++){
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Descripción Incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Fecha Inicio Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Fecha Fin Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Fecha Venc. Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Monto Incorrecto.","ALERTA");}
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
            url: "view_pagoservicio",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){console.log(respJson);
                    $("#titPago").html("Modificar Pago Servicio");
                    $("#accion").val("update");
                    $("#id").val(respJson.id);
                    $("#descripcion").val(respJson.descripcion);
                    $("#monto").val(Redondear2(respJson.monto));
                    var fecinicie = moment(respJson.fecInicio).format('DD-MM-YYYY');
                    $('#div-fecinicie').datepicker('update',fecinicie);
                    var fecfincie = moment(respJson.fecFin).format('DD-MM-YYYY');
                    $('#div-fecfincie').datepicker('update',fecfincie);
                    var fecvenc = moment(respJson.fecVencimiento).format('DD-MM-YYYY');
                    $('#div-fecvenc').datepicker('update',fecvenc);
                    $("#modalPago").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var confirm_pago = function(a){
        id = $(a).attr("id");
        var total = $(a).attr("data-total");
        var fecven = $(a).attr("data-fecven");
        $("#fecven").val(fecven);
        $("#total").val(Redondear2(total));
        $('#div-fecpago').datepicker('update',fecAct);
        $("#facturar").modal("show");
    };

    var GenDoc = function(){
        pago.start();
        $.ajax({
            type: 'POST',
            url: "conf_pago",
            dataType: 'json',
            data : {id:id,total:$("#total").val(),fecpago:$("#fecpago").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        $("#facturar").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        pago.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Monto Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Fecha de pago Incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        pago.stop();
                    }
                }else{
                    pago.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                pago.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Pago?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_pagoservicio',
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
        $("#busfecini,#busfecfin,#fecinicie,#fecfincie,#fecvenc,#fecpago").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecpago"),"dd-mm-yyyy");
        FormatoFechas($("#div-busfecfin"),"dd-mm-yyyy"); fecAct
        FormatoFechas($("#div-fecvenc"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecinicie"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecfincie"),"dd-mm-yyyy");
        NumeroDosDecimales($("#monto"));
        $("#monto").css("text-align","right");
        $("#btnNewSale").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#cboLiEstado").on("change",function(){ table._fnDraw(); });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        ListPedidos();
    };

    return {
        init: function () {
            Iniciando();
        },
        view_record:function(elem){
            view_record(elem);
        },
        Cancelar:function(elem){
            Cancelar(elem);
        },
        confirm_pago:function (a) {
            confirm_pago(a);
        }
    };
}();
jQuery(document).ready(function () {
    PagoServicio.init();
});