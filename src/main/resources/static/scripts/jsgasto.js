var Gasto = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var ids;

    var ListGastos = function(){
        table = $("#tblGastos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_gastos",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.tipgas = $("#cboTipGasto").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Gasto?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_gasto',
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

    var view_record = function(a){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_gasto",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val($(a).attr("id"));
                    $("#titulo").html("Modificar Gasto");
                    $("#tipdoc").selectpicker('val',respJson.otbTbTipoDocumento.id);
                    $("#tipoGatos").selectpicker('val',respJson.oTipoGasto.id);
                    $("#accion").val("update");
                    $("#tipogasto").selectpicker('val',respJson.tipoGasto);
                    $("#txtnum").val(respJson.numGasto);
                    $("#txtDesGasto").val(respJson.descripcion);
                    $("#txtNumDocGasto").val(respJson.numDocumento!==null?respJson.numDocumento:"");
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $('#div-fecreggasto').datepicker('update',fecreg);
                    $("#txtTotGasto").val(Redondear2(respJson.montoTotal));
                    $("#newGasto").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_gasto",
            dataType: 'json',
            data:$("#frmGastos").serialize()+"&idsuc="+$("#cboLiSuGasto").val(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#newGasto").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#txtnum");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#tipdoc",true);}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Sucursal Incorrecta.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#txtTotGasto");}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#txtDesGasto");}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#tipogasto",true);}
                                if(respJson.listado[i] === "E7"){style_error_cbo_final("#tipoGatos",true);}
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

    var Limpiar = function(){
        $.each($("#frmGastos input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#tipogasto",false);
        style_error_cbo_final("#tipdoc",false);
        style_error_cbo_final("#tipoGatos",false);
        $('#div-fecreggasto').datepicker('update',fecAct);
    };
    
    var ObtenerNum = function(){
        $.ajax({
            type: 'post',
            url: "init_gasto",
            dataType: 'json',
            data:{ids:$("#cboLiSuGasto").val()},
            success:function(respJson){
                if(respJson!==null){
                    $("#txtnum").val(respJson.num);
                    $("#txtven").val(respJson.nombres);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Registrar Gasto");
        $("#accion").val("save");
        $("#tipoGatos").selectpicker('val','0');
        $("#tipdoc").selectpicker('val','0');
        ids = $("#cboLiSuPedido").val();
        ObtenerNum();
        $("#newGasto").modal("show");
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecreggasto").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecreggasto"),"dd-mm-yyyy");
        NumeroDosDecimales($("#txtTotGasto"));
        $("#txtTotGasto").css("text-align","left");
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnNewGasto").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#tipdoc").on("change",function(){style_error_cbo_final('#tipdoc',false);});
        $("#tipoGatos").on("change",function(){style_error_cbo_final('#tipoGatos',false);});
        $("#tipogasto").on("change",function(){style_error_cbo_final('#tipogasto',false);});
        keyup_input_general_3("#frmGastos input", "#frmGastos", "#newGasto");
        $("#btnPrint").on("click",function () {
            var opt = $('option:selected', $("#cboLiSuGasto")).text();
            var method = "downloadGastos";
            var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc"+$("#cboLiSucursal").val()+"&tipgas="+$("#cboTipGasto").val()+"&nom="+opt;
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });
        $("#cboLiSucursal,#cboLiUsuario,#cboLiEstado,#cboTipGasto").on("change",function(){ table._fnDraw(); });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_gasto",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboTipGasto").html( data.usu === "1" ? "<option value='T'>--TODOS--</option><option value='D'>DIARIA</option><option value='M'>MENSUAL</option>" : "<option value='D'>DIARIA</option>" );
                    $("#cboLiSucursal").html( (data.usu === "1" ? "<option value='0'>--TODOS--</option>" : "" )+data.htS);
                    $("#cboLiSuGasto").html(data.htS);
                    $("#cboLiUsuario").html( "<option value='0'>--TODOS--</option>"+data.htU);
                    $("#tipdoc").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#tipoGatos").html("<option value='0'>--SELECCIONAR--</option>"+data.htTG);
                    $(".selectpicker").selectpicker("refresh");
                    ListGastos();
                }else{
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
        Cancelar:function(elem){
            Cancelar(elem);
        },
        view_record:function(a){
            view_record(a);
        }
    };
}();
jQuery(document).ready(function () {
    Gasto.init();
});