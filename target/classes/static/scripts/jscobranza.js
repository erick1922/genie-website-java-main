var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var table;
    var tableProducto;
    var LisIdPro;
    var LisCant;
    var LisPreCom;
    var LisPre3;
    var LisDesc;
    var LisPorcDescuento;
    var LisDescuento;
    var LisCodigo;
    var LisSubTotal;
    var LisEliminados;
    var LisIdmod;
    var LisAcciones;
    var Accion;
    var id;
    var ids;
    var totalventa = 0;
    var descuento = 0;

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pedido_cobranza",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.cli = $("#txtCliente").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,6]},
                {'sClass':"centrador",'aTargets': [9]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $("#txtTotal,#txtMontoTotal,#txtDescTot").val("0.00");
        $("#frmDataPed")[0].reset();
        $("#frmDataProductos")[0].reset();
        $('#div-fecregped').datepicker('update',fecAct);
        LisIdPro = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisPre3 = new Array();
        LisDesc = new Array();
        LisCodigo = new Array();
        LisPorcDescuento = new Array();
        LisDescuento = new Array();
        LisSubTotal = new Array();
        LisEliminados = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();
    };

    var new_record = function(){
        Limpiar();
        $("#tblDetalles").html("");
        $("#titulo").html("Registrar Pedido");
        Accion = "R";
        var opt = $('option:selected',$("#cboLiSuPedido")).text();
        $("#txtsuc").val(opt);
        ids = $("#cboLiSuPedido").val();
        descuento = 0;
        $("#tippago").selectpicker('val',1);
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var confirm_pago = function(a){//PARA CONFIRMAR VENTA
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        $("#frmFactura")[0].reset();
        totalventa = $(a).attr("data-total");
        var totaldes = $(a).attr("data-desc");
        $("#acuenta").val($(a).attr("data-acu"));
        $("#saldo").val($(a).attr("data-saldo"));
        $("#saltipo2").selectpicker('val','0');
        $("#totaldescuento").val(totaldes);
        $("#totalventa").val(totalventa);
        $("#formPago").selectpicker('val','0');
        $('#div-fecvenc').datepicker('update',fecAct);
        $("#facturar").modal("show");
        $("#div-tipodoc-venta").find("button").trigger("click");
    };

    var LoadSerie = function(sucu){
        $.ajax({
            type: 'POST',
            url: "view_seriexsuc",
            dataType: 'json',
            data : {idtip:$("#saltipo").val(),idsuc:sucu},
            success: function(data){
                if(data!==null){
                    if($("#saltipo").val() !== "0"){
                        $("#numdocu").val(data.msj);
                    }else{
                        $("#numdocu").val("");
                    }
                    $("#codVendedor").focus();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var GenDoc = function(){///OFICIAL ESTE ES
        pago.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "abonar_pago",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,acuenta:$("#acuenta").val(),
                saldo:$("#saldo").val(),totventa : $("#totalventa").val(), codven : $("#codVendedor").val(),
                abonopago:$("#abonopago").val(),formPago:$("#formPago").val(),fecvenc:$("#fecvenc").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#facturar").modal("hide");
                        pago.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione Tipo de Documento.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Monto total Incorrecto",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("Monto efectivo o tarjeta Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("Los Montos no coinciden.",'ALERTA');}
                                if(data.listado[i] === "E8"){uploadMsnSmall("Codigo de Vendedor Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E9"){uploadMsnSmall("Monto de Abono Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E10"){uploadMsnSmall("Fecha de Pago Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E11"){uploadMsnSmall("Forma de Pago Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E12"){uploadMsnSmall("Fecha de Vencimiento Incorrecta.",'ALERTA');}
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

    var confirm_entrega = function(a){
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        $("#frmEntrega")[0].reset();
        $("#saltipoent").selectpicker('val','0');
        $("#entrega").modal("show");
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Pedido?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_pedido',
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

    var viewDetails = function(a){
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){console.log(respJson);
                if(respJson!==null){
                    id = respJson.id;
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#vercli").val(respJson.otbCliente.nombre);
                    $("#vernum").val(respJson.numPedido);
                    $("#versuc").val(respJson.otbSucursal.nombre);
                    $("#vertipopag").val( respJson.otbFormaPago.nombre );
                    var fecreg = moment(respJson.fecGenerada).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#vermontot").val(Redondear2(respJson.montoTotal+respJson.descuento));
                    $("#verdestot").val(Redondear2(respJson.descuento));
                    $("#verigv").val(Redondear2(respJson.montoIgv));
                    $("#versub").val(Redondear2(respJson.montoSub));
                    $("#vertot").val(Redondear2(respJson.montoTotal));
                    var html = "";
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++){
                        var deta = respJson.tbDetalleventas[i];
                        html+="<tr>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.desCategoria + " "+deta.otbProducto.desMarca+" "+deta.otbProducto.nombre+(deta.otbProducto.modelo !== null?" "+deta.otbProducto.modelo:"")+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preUni + deta.descuentoItem)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.porcDescuentoItem)+"%</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.descuentoItem*deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preTotal)+"</td>";
                        html+="</tr>";
                    }
                    $("#listado").html(html);
                    html = "";
                    for (var i = 0; i < respJson.tbLetraCobrars.length; i++){
                        var letra = respJson.tbLetraCobrars[i];
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+moment(letra.fechaPago).format('DD-MM-YYYY')+"</td>";
                        html+="<td>"+letra.otbTipoDocumento.nombre+": "+letra.numSerie+"</td>";
                        html+="<td>"+letra.otbFormaPago.nombre+"</td>";
                        html+="<td class='text-right'>"+Redondear2(letra.monto)+"</td>";
                        html+="</tr>";
                    }
                    $("#pagos").html(html);
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

    var imprimir_ticket = function(){
        var method = "downloadTicket";
        var parameters = "idped="+id;
        var url = method + "?" + parameters;
        window.open(url,'_blank').print();
    };

    var imprimir_creditos = function () {
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadCreditoPendientes";
        var parameters = "idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregped,#fecvenc").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecregped"),"dd-mm-yyyy");
        FormatoFechaStart($("#div-fecvenc"),"dd-mm-yyyy");
        NumeroDosDecimalesxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreven"));
        NumeroDosDecimales($("#totaltarjeta"));
        NumeroDosDecimales($("#totalefectivo"));
        NumeroDosDecimales($("#totalventa"));
        NumeroDosDecimales($("#totaldescuento"));
        NumeroDosDecimales($("#abonopago"));
        NumeroDosDecimales($("#acuenta"));
        NumeroDosDecimales($("#saldo"));
        NumeroEntero($("#codVendedor"),3);
        $("#codVendedor").css("text-align","left");
        $("#div-fecregped").datepicker().on('show.bs.modal', function (event) {
            if ($("#div-pedidos").hasClass("bloqueDatos")) {
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        $("#btnVerPendientes").on("click",imprimir_creditos);
        $("#btnNewSale").on("click",new_record);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}});
        $("#saltipo").on("change",function(){LoadSerie(ids);});
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#btnTicket").on("click",imprimir_ticket);
        $("#txtCliente").on("keyup",function () {
            table._fnDraw();
        });
        $.ajax({
            type: 'post',
            url: "mant_credito",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#saltipo").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#saltipoent").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#tippago").html(data.htFP);
                    $("#formPago").html("<option value='0'>--SELECCIONAR--</option>"+data.htFP);
                    $("#condpago").html(data.htCP);
                    $(".selectpicker").selectpicker("refresh");
                    ListPedidos();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#formPago").on("change",function () {
            $("#abonopago").focus();
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
        confirm_pago:function(a){
            confirm_pago(a);
        },
        confirm_entrega:function(a){
            confirm_entrega(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});