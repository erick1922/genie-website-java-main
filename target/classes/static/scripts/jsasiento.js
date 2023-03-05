var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var table;
    var stockSel = 0;

    var LisIdDet;
    var LisIdCuenta;
    var LisCodigo;
    var LisDesc;
    var LisDebe;
    var LisHaber;


    var LisEliminados;
    var LisIdmod;
    var LisAcciones;
    var Accion;
    var fila;
    var acc = "";
    var iddet;
    var id;
    var ids;
    var totalventa = 0;
    var LisUndVenta;
    var esimprimible = "";
    var aplicaDesc = "";

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_asientos",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,5]},
                {'sClass':"centrador",'aTargets': [6]},
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
        fila = -1;
        acc = "";
        iddet = 0;
        LisIdDet = new Array();
        LisIdCuenta = new Array();
        LisCodigo = new Array();
        LisDesc = new Array();
        LisDebe = new Array();
        LisHaber = new Array();

        LisEliminados = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();
    };

    var new_record = function(){
        Limpiar();
        $("#tblDetalles").html("");
        $("#titulo").html("Registrar Asiento Contable");
        Accion = "R";
        var opt = $('option:selected',$("#cboLiSuPedido")).text();
        $("#txtsuc").val(opt);
        ids = $("#cboLiSuPedido").val();
        $("#tippago").selectpicker('val',1);
        $("#newSale").modal("show");
    };

    var AddItem = function(){
        agregar.start();
        //if(validarItem()){
            LisIdDet.push("0");
            LisIdCuenta.push("0");
            LisCodigo.push("");
            LisDesc.push("");
            LisDebe.push("0.00");
            LisHaber.push("0.00");
            CargarTabla();
            agregar.stop();
            $("#codigo_"+(LisIdDet.length-1)).focus();
       // }
    };

    var validarItem = function(){
        if($("#iddetpro").val()==="" || $("#iddetpro").val() === "0"){
            uploadMsnSmall("No ha Seleccionado Producto","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtCanti").val()==="" || parseFloat($("#txtCanti").val())<=0){
            uploadMsnSmall("Cantidad Incorrecta","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtPreven").val()==="" || parseFloat($("#txtPreven").val())<=0){
            uploadMsnSmall("Precio Venta Incorrecto","ALERTA");
            agregar.stop();
            return false;
        }
        if(parseFloat($("#txtCanti").val())>parseFloat(stockSel)){
            uploadMsnSmall("No Existe Stock Suficiente","ALERTA");
            agregar.stop();
            return false;
        }
        return true;
    };

    var CargarTabla = function(){
        $("#tblDetalles").html("");
        for (var i = 0; i < LisIdDet.length; i++) {
            $("#tblDetalles").append("<tr>"+
                "<td class='text-left'>"+(i+1)+"</td>"+
                "<td class='text-center '><input type='text' onblur='Pedido.CargarCuenta(this);' class='input-sm form-control celdaInput' data-pos='"+i+"' name='codigo_"+i+"' id='codigo_"+i+"' value='"+LisCodigo[i]+"' /></td>"+
                "<td class='text-left '><input type='text' class='input-sm form-control celdaInput' name='desc_"+i+"' id='desc_"+i+"' value='"+LisDesc[i]+"' readonly='readonly' /></td>"+
                "<td class='text-right'><input type='text' class='input-sm form-control celdaInput' onkeyup='Pedido.CalcularDebe(this);' data-pos='"+i+"' name='debe_"+i+"' id='debe_"+i+"' value='"+LisDebe[i]+"' /></td>"+
                "<td class='text-right'><input type='text' class='input-sm form-control celdaInput' onkeyup='Pedido.CalcularHaber(this);' data-pos='"+i+"' name='haber_"+i+"' id='haber_"+i+"' value='"+LisHaber[i]+"' /></td>"+
                "<td class='text-center cabecera-table-padding' style='padding:3px!important;'>"+
                "<button type='button' class='btn btn-sm btn-danger' style='margin:0px 3px 0px 0px!important; padding:1px 4px 1px 4px !important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItem(this);});
            NumeroDosDecimales($("#debe_"+i));
            NumeroDosDecimales($("#haber_"+i));
        }
        cargarTotal();
    };

    var CargarCuenta = function(a){
        var pos = $(a).attr("data-pos");
        var val = $(a).val();
        if(val !== ""){
            $.ajax({
                type: 'post',
                url: "view_cuenta_codigo",
                data:{"codigo":$(a).val()},
                dataType: 'json',
                success: function (respJson) {
                    if (respJson !== null) {
                        var cuenta = respJson;
                        if (cuenta.id !== 0) {
                            LisCodigo[pos] = cuenta.codigo;
                            LisIdCuenta[pos] = cuenta.id;
                            LisDesc[pos] = cuenta.descripcion;
                            $("#desc_"+pos).val(cuenta.descripcion);
                            $("#debe_" + pos).focus();
                        } else {
                            $("#codigo_" + pos).focus();
                            uploadMsnSmall('No se encuentra articulo.', 'ALERTA');
                        }
                    } else {
                        uploadMsnSmall('Problemas con el sistema', 'ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    uploadMsnSmall('Â¡Se encontrÃ³ un problema en el servidor!', 'ERROR');
                }
            });
        }
    };

    var CalcularDebe = function (a) {
        var pos = $(a).attr("data-pos");
        LisDebe[pos] = parseFloat($(a).val());
        cargarTotal();
    };

    var CalcularHaber = function (a) {
        var pos = $(a).attr("data-pos");
        LisHaber[pos] = parseFloat($(a).val());
        cargarTotal();
    };

    var quitarItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            if(Accion === "M" && LisAcciones[pos]!=="N"){
                LisEliminados.push(LisIdmod[pos]);
            }
            LisIdPro.splice(pos,1);
            LisUndVenta.splice(pos,1);
            LisDesc.splice(pos,1);
            LisCodigo.splice(pos,1);
            LisCant.splice(pos,1);
            LisPreCom.splice(pos,1);
            LisPre3.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            var valor = "1";
            $("#div-motivo").css("display",valor==="1"?"block":"none");
            CargarTabla();
        }else{
            uploadMsnSmall("Aun falta agregar datos.","ALERTA");
        }
    };

    var validarAsiento = function(){
        if( $("#tippago").val() === "" || $("#tippago").val() === "0" ){
            uploadMsnSmall("No ha Seleccionado Tipo de Asiento.","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiSuPedido").val() === "" || $("#cboLiSuPedido").val() === "0" ){
            uploadMsnSmall("Sucursal Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if(!moment($("#fecregped").val(),"DD-MM-YYYY", true).isValid()){
            uploadMsnSmall("Fecha No es Valida","ALERTA");
            cargando.stop();
            return false;
        }
        if(LisIdDet.length === 0){
            uploadMsnSmall("No ha agregado ningun Item","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#btnOpenModalProducto").attr("disabled") === "disabled" ){
            uploadMsnSmall("Faltan Completar Operación.","ALERTA");
            cargando.stop();
            return false;
        }
        for (var i = 0; i < LisCodigo.length; i++) {
            var idcuenta = parseInt(LisIdCuenta[i]);
            var debe = parseFloat(LisDebe[i]);
            var haber = parseFloat(LisHaber[i]);
            if(idcuenta <= 0){
                uploadMsnSmall("Cuenta incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            /*if(debe <= 0){
                uploadMsnSmall("Cantidad Incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(haber <= 0){
                uploadMsnSmall("Precio Venta Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }*/
        }
        return true;
    };

    var save = function(){
        cargando.start();
        var url = Accion === "R"?"save_asiento":"update_asiento";
        var accion = Accion === "R"?"save":"update";
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idsuc:$("#cboLiSuPedido").val(),fec:$("#fecregped").val(),tipoasiento:$("#tippago").val(),
                "iddet[]":LisIdDet,"idcuenta[]":LisIdCuenta,"iddebe[]":LisDebe,"idhaber[]":LisHaber,accion:accion,
                "iddetmod[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,
                glosa:$("#txtMotivoGrat").val()},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#newSale").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        cargando.stop();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++){
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Tipo de Pago Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Usuario Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Operacion Incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Ingreso Motivo de venta Gratuita.","ALERTA");$("#txtMotivoGrat").focus();}
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

    var cargarTotal = function () {
        var tot = 0;
        var imptot = 0;
        for (var i = 0; i < LisIdDet.length; i++) {
            tot+=parseFloat(LisDebe[i]);
            imptot+=parseFloat(LisHaber[i]);
        }
        $("#txtMontoTotal").val(Redondear2(tot));
        $("#txtDescTot").val(Redondear2(imptot));
        $("#txtTotal").val(Redondear2(tot-imptot));
    };

    var view_record = function(elem){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_asiento",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#titulo").html("Modificar Pedido");
                    Accion = "M";
                    id = respJson.id;
                    $("#txtven").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#idcli").val(respJson.otbCliente.id);
                    $("#txtcli").val(respJson.otbCliente.nombre);
                    $("#txtnum").val(respJson.numPedido);
                    ids = respJson.otbSucursal.id;
                    $("#cboLiSuPedido").selectpicker('val',ids);
                    $("#txtsuc").val(respJson.otbSucursal.nombre);
                    $("#tippago").selectpicker('val',respJson.otbFormaPago.id);
                    $("#chkOpeGra").prop("checked",respJson.operacionGratuita === "1");
                    $("#chkOpeGra").val(respJson.operacionGratuita);
                    $("#chkOpeGra").iCheck('update');
                    $("#div-motivo").css("display",respJson.operacionGratuita === "1" ? "block" : "none");
                    $("#txtMotivoGrat").val(respJson.motivoOpeGratuita);
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $('#div-fecregped').datepicker('update',fecreg);
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++) {
                        var deta = respJson.tbDetalleventas[i];
                        LisIdPro.push(deta.otbProducto.id);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisUndVenta.push(deta.otbProducto.desUnidad);
                        LisDesc.push(deta.otbProducto.desCategoria + " "+deta.otbProducto.desMarca+" "+deta.otbProducto.nombre + (deta.otbProducto.modelo != null?" "+deta.otbProducto.modelo : ""));
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(Redondear2(deta.preUni+deta.descuentoItem));
                        LisPre3.push(deta.otbProducto.precioMayor3);
                        LisSubTotal.push(Redondear2(deta.preTotal));
                        LisIdmod.push(deta.id);
                        LisAcciones.push(deta.estado);
                    }
                    CargarTabla();
                    $("#newSale").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var confirm_pago = function(a){//PARA CONFIRMAR VENTA
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        totalventa = parseFloat($(a).attr("data-total"));
        var totaldes = $(a).attr("data-desc");
        var nomtippago = $(a).attr("data-tippago");
        $("#frmFactura")[0].reset();
        $("#saltipo").selectpicker('val','0');
        $("#totaldescuento").val(totaldes);
        $("#totalventa").val(Redondear2(totalventa));
        $( nomtippago === "EFECTIVO"?"#totalefectivo":(nomtippago==="DEPOSITO" ? "#totaldeposito":"#totaltarjeta")).val(Redondear2(totalventa));
        $("#visa2").prop("checked",true);
        $("#facturar").modal("show");
        var dd =  $("#div-tipodoc-venta").find("button");
        $(dd).trigger("click");
    };

    var GenDoc = function(){///OFICIAL ESTE ES
        pago.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "gen_doc",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,totefe:$("#totalefectivo").val(),
                tottar:$("#totaltarjeta").val(),totventa : $("#totalventa").val(), codven : $("#codVendedor").val(),tiptar:$("input[name=creditcard]:checked").val(),
                totdep:$("#totaldeposito").val(),recibido:$("#txtRecibido").val(),vuelto:$("#txtVuelto").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        $("#facturar").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        pago.stop();
                        ImpresionTicket(id);
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
        // var btnViewDeta =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        // btnViewDeta.start();
        $.ajax({
            type: 'post',
            url: "view_asiento",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    console.log(respJson);
                    id = respJson.id;

                    $("#vercli").val(respJson.glosaAsiento);
                    $("#vernum").val(respJson.glosaAsiento);
                    $("#versuc").val(respJson.glosaAsiento);
                    $("#vertipopag").val( respJson.tipoAsiento.nombre);
                    var fecreg = moment(respJson.fechaContable).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    //$("#verdestot").val(Redondear2(respJson.descuento));
                    //$("#verigv").val(Redondear2(respJson.montoIgv));
                    //$("#versub").val(Redondear2(respJson.montoSub));
                    //$("#vertot").val(Redondear2(respJson.montoTotal));
                    //$("#verdocped").val(respJson.tipoSerieImpresoVenta !== null ? respJson.tipoSerieImpresoVenta : "");
                    var html = "";
                    for (var i = 0; i < respJson.detalleAsientos.length; i++){
                        var deta = respJson.detalleAsientos[i];
                        html+="<tr>";
                        html+="<td>"+deta.cuenta.codigo+"</td>";
                        html+="<td>"+deta.cuenta.descripcion+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoDebe)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoHaber)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoDebe)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoHaber)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.montoDebe)+"</td>";
                        html+="</tr>";
                    }
                    $("#listado").html(html);
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

    var ImprimirBalance = function () {
        ///var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "view_balance_comprobacion";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregped,#fecnac").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecregped"),"dd-mm-yyyy");
        NumeroEnteroxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreven"));
        NumeroDosDecimales($("#totaldeposito"));
        NumeroDosDecimales($("#totaltarjeta"));
        NumeroDosDecimales($("#totalefectivo"));
        NumeroDosDecimales($("#totalventa"));
        NumeroDosDecimales($("#totaldescuento"));
        NumeroDosDecimales($("#txtRecibido"));
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
        $("#modalSearchCliente").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchCliente:visible").each(ModalCompleto);
        });
        $("#modalSearchProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProducto:visible").each(ModalCompleto);
        });
        $("#txtVuelto").css("text-align","right");
        NumeroEntero($("#ruc"),11);
        NumeroEntero($("#dni"),8);
        NumeroEntero($("#edad"),2);
        FormatoFecha($("#div-fecnac"),"dd-mm-yyyy");
        $("#ruc,#dni,#edad").css("text-align","right");
        NumeroEntero($("#codVendedor"),3);
        $("#codVendedor").css("text-align","left");
        $("#div-fecregped").datepicker().on('show.bs.modal', function (event) {
            if ($("#div-pedidos").hasClass("bloqueDatos")) {
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        $('#newSale').on('shown.bs.modal',function(){
            $("#txtBarcode").focus();
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnAddItem").on("click",AddItem);
        $("#btnGuardar").on("click",function(){
            if(validarAsiento()){save();}
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearchModalProducto").on("click",function(){
            btnSearchProd.start();
            Repositorio.refreshTable($('div.mdlTablaProducto'));
        });
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#cboLiUsuario,#cboLiEstado").on("change",function(){ table._fnDraw(); });
        $("#cboLiSucursal").on("change",function(){
            var valSuc = $(this).val();
            if(valSuc !== "0"){$("#cboLiSuPedido").selectpicker('val',valSuc);}
            table._fnDraw();
        });
        $("#cboLiSuPedido").on("change",function(){
            $("#cboLiSucursal").selectpicker('val',$(this).val());
            table._fnDraw();
        });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_asiento",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#saltipo").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#saltipoent").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#tippago").html("<option value='0'>--SELECCIONAR--</option>"+data.htTA);
                    $("#condpago").html(data.htCP);
                    $(".selectpicker").selectpicker("refresh");
                    ListPedidos();
                    $("#cboLiSuPedido").change();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#cboBuscar").on("change",function () {
            $("#btnSearchModalProducto").trigger("click");
            $("#txtDescProducto").focus();
        });
        $("#txtPreven").on("keyup",function(e){
            if (e.keyCode === 13) {
                $("#btnAddItem").trigger("click");
            }
        });
        $(document).keydown(function(event){
            if(event.which == 112){ //F1
                if(!cargando.isLoading()){
                    new_record();
                    return false;
                }
            }
            if(event.which == 113){ //F2
                if( $('#newSale').hasClass('in') && !$('#modalSearchCliente').hasClass('in')){
                    $("#btnAddCliente").trigger("click");
                    return false;
                }
            }
            if(event.which == 114){ //F3
                if( $('#newSale').hasClass('in') ){
                    if(!cargando.isLoading()){
                        $("#btnGuardar").trigger("click");
                        return false;
                    }
                }
            }
            if(event.which == 115){ //F4
                if( $('#newSale').hasClass('in') ){
                    if( $('#modalSearchCliente').hasClass('in') ){
                        if( !$('#modalCliente').hasClass('in') ){
                            $("#btnNewCliente").trigger("click");
                            return false;
                        }
                    }
                }
            }
            if(event.which == 116){ //F5
                if( $('#newSale').hasClass('in') && !$('#modalSearchProducto').hasClass('in') && !$('#modalSearchCliente').hasClass('in')){
                    $("#btnOpenModalProducto").trigger("click");
                    return false;
                }
            }
            if(event.which == 13){ //ENTER
                if( $('#facturar').hasClass('in')){
                    if(!pago.isLoading()){
                        if ($("#codVendedor").is(":focus") || $("#totalefectivo").is(":focus") || $("#totaltarjeta").is(":focus") || $("#txtRecibido").is(":focus") ) {
                            $("#btnGenDocPag").trigger("click");
                            return false;
                        }
                    }
                }
            }
        });
        $("#txtDescProducto").keydown(function(event){
            if(event.which == 38){return false;}
            if(event.which == 40){
                if(!btnSearchProd.isLoading()){
                    var cantFilas = $('#tblProducto > tbody > tr').length;
                    var filas = $('#tblProducto > tbody > tr');
                    jQuery.each( filas, function( i, val ) {$(filas[i]).css("background-color","#FFFFFF");});
                    if(cantFilas >0){
                        var ind = parseInt($(filas[0]).find("td").eq(0).html());
                        var existe = "0";
                        while(existe === "0" && cantFilas > 0){
                            if( $("#add_prod_"+ind).length > 0 ) {
                                existe = "1";
                                var filaSel = $("#add_prod_" + ind).parents("tr");
                                $(filaSel).css("background-color", "#B0BED9");
                                $("#add_prod_" + ind).focus();
                            }
                            cantFilas--;
                            ind++;
                        }
                        if(existe === "0"){
                            var SearchInput = $("#txtDescProducto");
                            var strLength= SearchInput.val().length;
                            SearchInput.focus();
                            SearchInput[0].setSelectionRange(0, strLength);
                        }
                    }
                    return false;
                }
            }
        });
        $("#btnOpenModalProducto").on("click",function () {
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreven").val("");
            $('#modalSearchProducto').modal('show');$('#btnSearchModalProducto').trigger('click');$('#txtDescProducto').focus();
        });
        $("#txtDescProducto").on("keyup",function(e){
            if(e.keyCode  != 38 && e.keyCode  != 40 && e.keyCode  != 37 && e.keyCode  != 39 && e.keyCode  != 27 /*ESC*/ ){
                btnSearchProd.start();
                Repositorio.refreshTable($('div.mdlTablaProducto'));
                return false;
            }
        });
        $("#btnAddCliente").on("click",function () {
            $('#modalSearchCliente').modal('show');
            var SearchInput = $("#txtDescCliente");
            var strLength= SearchInput.val().length;
            SearchInput.focus();
            SearchInput[0].setSelectionRange(0, strLength);
        });
        $("#btnBalance").on("click",function () {
            ImprimirBalance();
        });
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
        viewDetails:function(a){
            viewDetails(a);
        },
        confirm_pago:function(a){
            confirm_pago(a);
        },
        CargarCuenta:function(a){
            CargarCuenta(a);
        },
        CalcularDebe:function (a) {
            CalcularDebe(a);
        },
        CalcularHaber:function (a) {
            CalcularHaber(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});