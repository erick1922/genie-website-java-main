var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var nuevoResumen = Ladda.create(document.querySelector('#btnNewSale'));
    var nuevoComunicacion = Ladda.create(document.querySelector('#btnNewCom'));
    var btnSearchDocumento = Ladda.create(document.querySelector('#btnAddDocumento'));
    var table;
    var tableCobranzas;
    var tableProducto;
    var tipImp = "";

    var listIdDoc;
    var listNumItem;
    var listTipoDoc;
    var listSerie;
    var listCorrelativo;
    var listCliente;
    var listMotivo;
    var id;
    var idResumenDiarioConsulta = 0;
    var btnViewDetails = "";

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_resumenes_diarios",data:function(d){
                    d.fecini = $("#busfecini").val();
                    d.fecfin = $("#busfecfin").val();
                    d.idsuc = $("#cboLiSucursal").val();
                    d.idusu = 0;
                    d.est = $("#cboLiEstado").val();
                    d.cli = "";
                    d.buscarpor = "FG";
                }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"centrador",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListCobranzas = function(){
        tableCobranzas = $("#tblCobranzas").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',
                url:"list_comunicacion_baja",
                data:function(d){
                    d.fecini = $("#busfecini").val();
                    d.fecfin = $("#busfecfin").val();
                    d.idsuc = $("#cboLiSucursal").val();
                    d.idusu = 0;
                    d.est = $("#cboLiEstado").val();
                    d.cli = "";
                    d.buscarpor = "FG";
                }
            },
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"centrador",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $("#txtTotal,#txtMontoTotal,#txtDescTot").val("0.00");
    };

    var new_comunicacion = function () {
        nuevoComunicacion.start();
        var fecemi = $("#fechaemisionboletas").val();
        $.ajax({
            type: 'post',
            url: "view_correlativo_combaja",
            dataType: 'json',
            data:{sucursal : $("#cboLiSuPedido").val(),fecemi : fecemi},
            success:function(respJson){
                console.log(respJson);
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        nuevoComunicacion.stop();
                        table._fnDraw();
                        $("#vernumcb").val(respJson.msj);
                        $("#verfechacb").val(fecAct);
                        $("#verusugencb").val(respJson.msj2);
                        $("#verfechaemicb").val(fecemi);
                        $("#versuccb").val($('option:selected', $("#cboLiSuPedido")).text());

                        listIdDoc = new Array();
                        listNumItem = new Array();
                        listTipoDoc = new Array();
                        listSerie = new Array();
                        listCorrelativo = new Array();
                        listMotivo = new Array();
                        listCliente = new Array();

                        $("#newSale").modal("show");
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        nuevoComunicacion.stop();
                    }
                }else{
                    nuevoComunicacion.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                nuevoComunicacion.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var new_record = function(){
        nuevoResumen.start();
        var fecemi = $("#fechaemisionboletas").val();
        $.ajax({
            type: 'post',
            url: "save_resumen_diario",
            dataType: 'json',
            data:{sucursal : $("#cboLiSuPedido").val(),fecemi : fecemi},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        nuevoResumen.stop();
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        nuevoResumen.stop();
                    }
                }else{
                    nuevoResumen.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                nuevoResumen.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var validarPedido = function(){
        if( $("#cboLiSuPedido").val() === "" || $("#cboLiSuPedido").val() === "0" ){
            uploadMsnSmall("Sucursal incorrecta.","ALERTA");
            cargando.stop();
            return false;
        }
        if(listIdDoc.length === 0){
            uploadMsnSmall("No ha agregado ningun documento.","ALERTA");
            cargando.stop();
            return false;
        }
        for (var i = 0; i < listIdDoc.length; i++) {
            var idpro = listMotivo[i];
            if(idpro === ""){
                uploadMsnSmall("No ha ingresado el motivo para el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            } else if(idpro.length <= 15){
                uploadMsnSmall("El motivo para el Item N° "+(i+1).toString()+" debe de ser mayor a 15 caracteres.","ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }
        return true;
    };

    var save = function(){
        var fecemi = $("#fechaemisionboletas").val();
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_comunicacion_baja",
            dataType: 'json',
            data:{idsuc:$("#cboLiSuPedido").val(),fecemi:fecemi,"listIdDoc[]":listIdDoc,"listMotivo[]":listMotivo,
                "listNumItem[]":listNumItem},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#newSale").modal("hide");
                        table._fnDraw();
                        $("#cc").trigger("click");
                        uploadMsnSmall(respJson.msj,'OK');

                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Tipo de Pago Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Usuario Incorrecto.","ALERTA");}
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

    var enviar_resumen = function(a){//PARA CONFIRMAR VENTA
        var id_res = $(a).attr("id").split("_")[2];
       // Repositorio.refreshGrafic($("#divFacturar"));
        var btnSend =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        btnSend.start();
        $.ajax({
            type: 'POST',
            url: "send_resumen_diario",
            dataType: 'json',
            data : {id:id_res},
            success: function(data){
                console.log(data);
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#facturar").modal("hide");
                        btnSend.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione tipo de documento.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Numero de documento incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Selección de entrega incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("Fecha de entrega incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("Codigo de vendedor incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E8"){uploadMsnSmall("Fecha de vencimiento incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E9"){uploadMsnSmall("Seleccione forma de pago.",'ALERTA');}
                                if(data.listado[i] === "E10"){uploadMsnSmall("Abono inicial incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        btnSend.stop();
                    }
                }else{
                    Repositorio.finishRefresh($("#divFacturar"));
                    btnSend.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Repositorio.finishRefresh($("#divFacturar"));
                btnSend.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var consultar_resumen = function(a){
        var id_res = $(a).attr("id").split("_")[2];
        var btnSend =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        btnSend.start();
        $.ajax({
            type: 'POST',
            url: "consulta_resumen_diario",
            dataType: 'json',
            data : {id:id_res},
            success: function(data){
                console.log(data);
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#view_details_"+id_res).trigger("click");
                        btnSend.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione tipo de documento.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Numero de documento incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Selección de entrega incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("Fecha de entrega incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("Codigo de vendedor incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E8"){uploadMsnSmall("Fecha de vencimiento incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E9"){uploadMsnSmall("Seleccione forma de pago.",'ALERTA');}
                                if(data.listado[i] === "E10"){uploadMsnSmall("Abono inicial incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        btnSend.stop();
                    }
                }else{
                    Repositorio.finishRefresh($("#divFacturar"));
                    btnSend.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Repositorio.finishRefresh($("#divFacturar"));
                btnSend.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Cancelar = function(a){
        var idres = $(a).attr("id").split("_")[2];
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea cancelar el resumen diario generado?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_resumen_diario',
                        data: {"id":idres},
                        dataType: 'json',
                        success: function(data){
                            console.log(data);
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

    var viewDetails = function(a){
        idResumenDiarioConsulta = $(a).attr("id").split("_")[2];
        btnViewDetails = $(a);
        $.ajax({
            type: 'post',
            url: "view_resumen",
            dataType: 'json',
            data:{id:$(a).attr("id").split("_")[2]},
            success:function(respJson){
                if(respJson!==null){
                    id = respJson.id;
                    console.log(respJson);
                    var btn = "";
                    if(respJson.estado === "P"){
                        btn =  "<button type='button' class='btn btn-sm btn-success col-lg-12 ladda-button' name='btnEnviar' id='btnEnviar'";
                        btn+="data-style='zoom-in'  data-spinner-size='30'>";
                        btn+="<span class='ladda-label'>";
                        btn+="<i class='fa fa-send'></i> Enviar";
                        btn+="</span>";
                        btn+="</button>";
                        if(respJson.respuestaPresentacion != null){
                            if(respJson.respuestaPresentacion === "A"){
                                btn ="<button type='button' class='btn btn-sm btn-primary col-lg-12 ladda-button'";
                                btn+="data-style='zoom-in'  data-spinner-size='30'>";
                                btn+="<span class='ladda-label'>";
                                btn+="<i class='fa fa-check'></i> Aceptado";
                                btn+="</span>";
                                btn+="</button>";
                            } else if(respJson.respuestaPresentacion === "R"){
                                btn ="<button type='button' class='btn btn-sm btn-danger col-lg-12 ladda-button'";
                                btn+="data-style='zoom-in'  data-spinner-size='30'>";
                                btn+="<span class='ladda-label'>";
                                btn+="<i class='fa fa-check'></i> Rechazado";
                                btn+="</span>";
                                btn+="</button>";
                            }
                        }
                    }else if(respJson.estado === "I"){
                        btn =  "<button type='button' class='btn btn-sm btn-warning col-lg-12 ladda-button'";
                        btn+="data-style='zoom-in'  data-spinner-size='30'>";
                        btn+="<span class='ladda-label'>";
                        btn+="<i class='fa fa-check'></i> Por enviar";
                        btn+="</span>";
                        btn+="</button>";
                    }else if(respJson.estado === "C"){
                        btn ="<button type='button' class='btn btn-sm btn-danger col-lg-12 ladda-button'";
                        btn+="data-style='zoom-in'  data-spinner-size='30'>";
                        btn+="<span class='ladda-label'>";
                        btn+="<i class='fa fa-check'></i> Cancelado";
                        btn+="</span>";
                        btn+="</button>";
                    }
                    $("#div_btn_enviado").html(btn);
                    EventoBotonEnviar();
                    $("#verusugen").val(respJson.oUsuarioImporta.nombres+ " "+respJson.oUsuarioImporta.apePat+" "+respJson.oUsuarioImporta.apeMat);
                    $("#vernum").val(respJson.identificadorResumen);
                    $("#versuc").val(respJson.sucursal.nombre);
                    var codanexo = respJson.sucursal.anexoSucursal;
                    $("#vertipopag").val(respJson.otbFormaPago);
                    var fecreg = moment(respJson.fechaGeneracion).format('DD-MM-YYYY');
                    var fecemi = moment(respJson.fechaEmisionDocumento).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#verfechaemi").val(fecemi);
                    $("#vercli").val(respJson.oUsuarioProcesa !== null ? respJson.oUsuarioProcesa.nombres+ " "+respJson.oUsuarioProcesa.apePat+" "+respJson.oUsuarioProcesa.apeMat : "");
                    var montoGravado = 0.00;
                    var montoIGV = 0.00;
                    var montoTotal = 0.00;
                    var html = "";
                    for (var i = 0; i < respJson.detalleResumenDiarios.length; i++){
                        var deta = respJson.detalleResumenDiarios[i];
                        var docEstSunat = (deta.documentoVenta!== null?deta.documentoVenta.estadoSunat : 0);
                        var tipoDoc = "";
                        if(deta.tipoDocumento === "03"){
                            tipoDoc = "BOLETA";
                        } else if(deta.tipoDocumento === "07"){
                            tipoDoc = "NOTA DE CRÉDITO";
                        } else if(deta.tipoDocumento === "08"){
                            tipoDoc = "NOTA DE DEBITO";
                        }
                        html+="<tr>";
                        html+="<td class='text-center'>"+deta.numFila+"</td>";
                        html+="<td class='text-left'>"+tipoDoc+"</td>";
                        html+="<td class='text-center'>"+deta.numSerie+"</td>";
                        html+="<td>"+deta.numCorrelativo+"</td>";
                        html+="<td>"+(deta.codTipoDocAdquiriente !== null ? deta.numeroDocAdquiriente : "--------")+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoValorVentaOpeInafecto)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoValorVentaOpeExonerada)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoValorVentaOpeGratuita)+"</td>";
                        html+="<td class='text-right' >"+Redondear2(deta.montoValorVentaOpeGravada)+"</td>";
                        html+="<td class='text-right' >"+Redondear2(deta.montoIGV)+"</td>";
                        html+="<td class='text-right' >"+Redondear2(deta.montoTotal)+"</td>";
                        html+="<td class='text-center' >"+(deta.estado === "1" ? "EMITIDO" : (deta.estado === "3" ? "ANULADO" : "MODIFICADO"))+"</td>";

                        var htBtn="<button type=\"button\" id='btn_por_enviar_"+ (deta.documentoVenta!== null?deta.documentoVenta.id :"0")+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-primary ladda-button btn-details-sunat\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Enviar documento</div>' onclick=\"Pedido.actualizar_estado_documento(this);\" > <span class='ladda-label'> <i class='fa fa-send-o'></i> </span> </button>";
                        if(deta.documentoVenta === null){
                            htBtn = "";
                        }
                        html+="<td>"+(docEstSunat === 1 ? "<span class='label label-success'>ENVIADO</span>" : htBtn)+"</td>";
                        html+="</tr>";
                        montoGravado+=parseFloat(deta.montoValorVentaOpeGravada);
                        montoIGV+=parseFloat(deta.montoIGV);
                        montoTotal+=parseFloat(deta.montoTotal);
                    }
                    $("#listado").html(html);
                    $("#verigv").val(Redondear2(montoIGV));
                    $("#versub").val(Redondear2(montoGravado));
                    $("#vertot").val(Redondear2(montoTotal));
                    $(".btn-details-sunat").tooltip();
                    console.log(respJson.respuestaPresentacion);
                    if(respJson.descripcionRespuesta !== null){
                        var htPago = "<tr>";
                        htPago+="<td class='text-center'>"+(respJson.respuestaPresentacion!==null ? (respJson.respuestaPresentacion === "A" ? "ACEPTADO": (  "RECHAZADO") ) : "SIN RESPUESTA" )+"</td>";
                        htPago+="<td>"+respJson.descripcionRespuesta+"</td>";
                        htPago+="<td class='text-center'><button type='button' class='btn btn-sm btn-success' style='padding:4px 10px!important;' onclick='Pedido.DescargarXMLRD(this);' data-arc='"+codanexo+"/"+ respJson.nombreExtArchivoContanciaRecepcion+"' title='Decargar xml'>"+
                        "<i class='glyphicon glyphicon-download-alt'></i></button></td>";
                        htPago+="</tr>";
                        $("#pagos").html(htPago);
                    }else{
                        $("#pagos").html("");
                    }
                    $("#viewPedido").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var update_item_motivo = function(a){
        var pos = parseInt($(a).attr("data-pos"));
        listMotivo[pos] = $(a).val();
    };

    var delete_item = function(a){

    };

    var actualizar_estado_documento = function(a){
        var iddoc = $(a).attr("id").split("_")[3];
        $.ajax({
            type: 'post',
            url: 'update_documentoventa_estadosunat',
            data: {"id":iddoc},
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    uploadMsnSmall(data.msj,data.dato);
                    if(data.dato === "OK"){
                        $("#view_details_"+id).trigger("click");
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

    var checkPanel = function(a){
        var atr = $(a).attr("id");
        if(atr === "cc"){
            $("#btnNewSale").show();
            $("#btnNewCom").hide();
        }else if(atr === "ccb"){
            $("#btnNewCom").show();
            $("#btnNewSale").hide();
        }
    };

    var DescargarXMLRD = function(a){
        var nombre = $(a).attr("data-arc");
        var url = "downloadRD?name="+nombre;
        window.open(url,'_blank');
    };

    var validarBusquedaDocumento = function(){
        if( $("#tipdocventa").val() === "" || $("#tipdocventa").val() === "0" ){
            uploadMsnSmall("Tipo de Documento Incorrecto","ALERTA");
            btnSearchDocumento.stop();
            return false;
        }
        if( $("#txtserie").val() === "" || $("#txtserie").val().length > 4 || $("#txtnum").val() === "0000"){
            uploadMsnSmall("Serie de Documento Incorrecto.","ALERTA");
            btnSearchDocumento.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length > 6 || $("#txtnum").val() === "000000"){
            uploadMsnSmall("Numero de Documento Incorrecto.","ALERTA");
            btnSearchDocumento.stop();
            return false;
        }
        return true;
    };

    var RecargarTablaDocumentos = function(){
        $("#listadoDoc").html("");
        for (var i=0;i<listIdDoc.length;i++){
            var html="<tr>";
            html+="<td class='text-center'>"+listNumItem[i]+"</td>";
            html+="<td class='text-center'>"+listTipoDoc[i]+"</td>";
            html+="<td>"+listSerie[i]+"-"+listCorrelativo[i]+"</td>";
            html+="<td>"+listCliente[i]+"</td>";
            html+="<td class='text-center py-1'><input type='text' class='form-control input-sm ' name='txt_mot_"+i+"' id='txt_mot_"+i+"' data-pos='"+i+"' onkeyup='Pedido.update_item_motivo(this);' value='"+listMotivo[i]+"'  /></td>";
            html+="<td class='text-center py-1'><button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' name='btndel_"+i+"' id='btndel_"+i+"' data-pos='"+i+"' onclick='Pedido.delete_item(this);' ><i class='glyphicon glyphicon-trash'></i></button></td>";
            html+="</tr>";
            $("#listadoDoc").append(html);
        }
    };

    var EventoBotonEnviar = function(){
        $("#btnEnviar").on("click",function(){
            var btnSend =  Ladda.create(document.querySelector('#btnEnviar'));
            btnSend.start();
            Repositorio.refreshTable($("#modal_consulta_resumen"));
            $.ajax({
                type: 'POST',
                url: "consulta_resumen_diario",
                dataType: 'json',
                data : {id:idResumenDiarioConsulta},
                success: function(data){
                    console.log(data);
                    if(data !== null){
                        if(data.dato === "OK"){
                            Repositorio.finishRefresh($("#modal_consulta_resumen"));
                            table._fnDraw();
                            uploadMsnSmall(data.msj,'OK');
                            viewDetails($(btnViewDetails));
                            btnSend.stop();
                        }else if(data.dato === "ERROR"){
                            Repositorio.finishRefresh($("#modal_consulta_resumen"));
                            if(data.listado.length>0){
                                for (var i = 0; i < data.listado.length; i++) {
                                    if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                                    if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                                    if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione tipo de documento.",'ALERTA');}
                                    if(data.listado[i] === "E4"){uploadMsnSmall("Numero de documento incorrecto.",'ALERTA');}
                                    if(data.listado[i] === "E5"){uploadMsnSmall("Selección de entrega incorrecto.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(data.msj,data.dato);
                            }
                            btnSend.stop();
                        }
                    }else{
                        Repositorio.finishRefresh($("#modal_consulta_resumen"));
                        btnSend.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    Repositorio.finishRefresh($("#modal_consulta_resumen"));
                    btnSend.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fechaemisionboletas").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fechaemisionboletas"),"dd-mm-yyyy");
        $("#btnVerPendientes").on("click",function () {
            var opt = $('option:selected', $("#cboLiSuPedido")).text();
            var parameters = "idsuc="+$("#cboLiSuPedido").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt;
            imprimir_pdf("downloadCreditoPendientes",parameters);
        });
        $("#div-fecregped").datepicker().on('show.bs.modal', function (event) {
            if ($("#div-pedidos").hasClass("bloqueDatos")) {
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnNewCom").on("click",new_comunicacion);
        $("#btnGuardar").on("click",function(){
            if(validarPedido()){save();}
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearch2").on("click",function(){tableCobranzas._fnDraw();});
        $("#txtCliente").on("keyup",function () {
            table._fnDraw();
        });
        $("#txtCliente2").on("keyup",function () {
            tableCobranzas._fnDraw();
        });
        $.ajax({
            type: 'post',
            url: "mant_fact_electronica",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    tipImp = data.tipoImp;
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htSF);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboLiSucursal2").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htSF);
                    $("#cboLiUsuario2").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#tipdocventa").html(data.htTipDocComBaja);
                    $(".selectpicker").selectpicker("refresh");
                    ListPedidos();
                    ListCobranzas();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
        $("#viewPedido").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPedido:visible").each(ModalCompleto);
        });
        $("#btnAddDocumento").on("click",function(){
            btnSearchDocumento.start();
            if(validarBusquedaDocumento()){
                var param = {
                    id:$("#cboLiSuPedido").val(),
                    tipdoc:$("#tipdocventa").val(),
                    serie:$("#txtserie").val(),
                    numero:$("#txtnum").val()
                };
                console.log(param);
                $.ajax({
                    type: 'post',
                    url: "view_docventaxtipdocxdev_elec",
                    dataType: 'json',
                    data:param,
                    success: function(respJson) {
                        if (respJson !== null) {
                            if(respJson.dato === 'OK'){
                                console.log(respJson.objeto);
                                var documento = respJson.objeto;
                                var numitem = listIdDoc.length + 1;

                                listIdDoc.push(documento.id);
                                listNumItem.push(numitem);
                                listTipoDoc.push(documento.otbTipoDocumento.nombre);
                                listSerie.push(documento.serieElectronica);
                                listCorrelativo.push(documento.correlativoElectronico);
                                listMotivo.push("");
                                listCliente.push(documento.nomCliente);
                                RecargarTablaDocumentos();
                                btnSearchDocumento.stop();
                            }else if(respJson.dato === "ERROR"){
                                if(respJson.listado.length>0){
                                    for (var i = 0; i < respJson.listado.length; i++) {
                                        if(respJson.listado[i] === "E1"){uploadMsnSmall("Tipo de Documento Incorrecto.",'ALERTA');}
                                        if(respJson.listado[i] === "E2"){uploadMsnSmall("Serie de Documento Incorrecto.",'ALERTA');}
                                        if(respJson.listado[i] === "E3"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                                        if(respJson.listado[i] === "E4"){uploadMsnSmall("Sucursal Incorrecta.",'ALERTA');}
                                    }
                                }else{
                                    uploadMsnSmall(respJson.msj,'ERROR');
                                }
                                btnSearchDocumento.stop();
                            }
                        }else{
                            btnSearchDocumento.stop();
                            uploadMsnSmall('Problemas con el sistema','ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        btnSearchDocumento.stop();
                        uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                    }
                });
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
        viewDetails:function(a){
            viewDetails(a);
        },
        enviar_resumen:function(a){
            enviar_resumen(a);
        },
        consultar_resumen:function (a) {
            consultar_resumen(a);
        },
        DescargarXMLRD: function(a){
            DescargarXMLRD(a);
        },
        checkPanel:function(a){
            checkPanel(a);
        },
        update_item_motivo:function(a){
            update_item_motivo(a);
        },
        delete_item:function(a){
            delete_item(a);
        },
        actualizar_estado_documento:function(a){
            actualizar_estado_documento(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});