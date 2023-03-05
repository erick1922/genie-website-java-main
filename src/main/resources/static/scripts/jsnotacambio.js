var NotaCambio = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var updateItem = Ladda.create(document.querySelector('#btnUpdateValor'));
    var data = null;
    var btnSearchDocumento = Ladda.create(document.querySelector('#btnAddDocumento'));
    var btnGuardarDevolucion = Ladda.create(document.querySelector('#btnGuardarDevolucion'));
    var pago = Ladda.create(document.querySelector('#btnGenDoc'));
    var verRepImpresa = Ladda.create(document.querySelector('#btnGenRepImpresa'));
    var table = null;
    var tblPedido = null;
    var liIdDet = new Array();
    var liIdPro = new Array();
    var liCodPro = new Array();
    var liDesPro = new Array();
    var liCant = new Array();
    var liPreUni = new Array();
    var liCantValida = new Array();
    var liPreUniValida = new Array();
    var iddoc = 0;
    var idped = 0;
    var ids = 0;
    var esNotaElectronica = "0";
    var Accion = "R";
    var liNotCred = null;
    var liNotDeb = null;
    var htmlNotCred = "";
    var htmlNotDeb = "";

    var ListDevoluciones = function(){
        tblPedido = $("#tblDevolucion").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_devoluciones",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,6]},
                {'sClass':"centrador",'aTargets': [7]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListComprasxProducto = function(){
        table = $("#tblCompraxProducto").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide": true,
            "bAutoWidth": false,
            "ajax": {
                type: 'POST',
                url: "listar_items_compras",
                data: function(d){
                    d.tipbus = $("#cboTipBusqueda").val();
                    d.descbus = $("#txtDescBusqueda").val();
                    d.numorden = $("#txtordcompra").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"text-right",'aTargets': [2,4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'orderable': false, 'aTargets': [0,1,2,4,5,6,7,8]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
                ///buscando.stop();
            },
            "order":[
                [3, "asc"]
            ]
        });
    };

    var imprimir_reporte = function(){
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadFacturacion";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&nom="+opt;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Cancelar = function(a){
        var idnot = $(a).attr("id").split("_")[2];
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar la devolución?</strong>",
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
                        data: {"id":idnot},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    tblPedido._fnDraw();
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

    var viewDetails = function(a) {
        var idnot = $(a).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:idnot},
            success:function(respJson){
                if(respJson!==null){
                    console.log(respJson);
                    idped = respJson.id;
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#vercli").val(respJson.otbCliente.nombre);
                    $("#vernum").val(respJson.numPedido);
                    $("#versuc").val(respJson.otbSucursal.nombre);
                    $("#vertipopag").val( respJson.otbFormaPago.nombre );
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#verigv").val(Redondear2(respJson.montoIgv));
                    $("#versub").val(Redondear2(respJson.montoSub));
                    $("#vertot").val(Redondear2(respJson.montoTotal));
                    $("#vertipodocref").val(respJson.otbTbPedidoReferencia.descdocumentoVenta);
                    if(respJson.tipoNota !== null){
                        $("#div_tipo_nota_credeb").show();
                        $("#div_tipo_nota_credeb_2").show();
                        $("#vertipnotacredeb").val(respJson.tipoNota.codigoSunat + " - "+respJson.tipoNota.descripcion);
                        $("#versustentocredeb").val(respJson.sustentoMotivo);
                    }else{
                        $("#div_tipo_nota_credeb").hide();
                        $("#div_tipo_nota_credeb_2").hide();
                    }
                    if(respJson.esDocumentoElectronico === "1"){
                        $("#btnGenRepImpresa").show();
                    }else{
                        $("#btnGenRepImpresa").hide();
                    }
                    var html = "";
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++){
                        var deta = respJson.tbDetalleventas[i];
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.nombreGeneralProducto+"</td>";
                        html+="<td>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td>"+Redondear2(deta.preUni)+"</td>";
                        html+="<td>"+Redondear2(deta.preTotal)+"</td>";
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

    var Limpiar = function () {
        iddoc = 0;
        idped = 0;
        liIdDet = new Array();
        liIdPro = new Array();
        liCodPro = new Array();
        liDesPro = new Array();
        liCant = new Array();
        liPreUni = new Array();
    };

    var cargar_combo_tiponota = function(){
        var sel = $("#cboTipoNota").val();
        var lista = null;
        if(sel === "D"){
            lista = liNotCred;
        }else if(sel === "V"){
            lista = liNotDeb;
        }
        if(lista !== null){
            var htLista = "<option value='0'>--SELECCIONE--</option>";
            for(var i=0;i<lista.length;i++){
                htLista+="<option value='"+lista[i].id+"'>"+lista[i].codigoSunat+" - "+lista[i].descripcion+"</option>";
            }
            $("#cboTipoNotaCred").html(htLista);
            $("#cboTipoNotaCred").selectpicker("refresh");
            $("#cboTipoNotaCred").selectpicker('val',"0");
        }
    };

    var new_record = function(){
        var sel = $("#cboTipoNota").val();
        if(sel === "C"){
            $("#modalSearchComprasxProducto").modal("show");
        }else if(sel === "D"){
            $("#div_nota_credito").hide();
            Accion = "R";
            $("#txtTotal").val("0.00");
            $("#frmDataDevolucion")[0].reset();
            $('#div-fecregdev').datepicker('update',fecAct);
            $("#titulo").html("Registrar nota de cambio");
            $("#tipdocventa").selectpicker('val',"0");
            $("#tblDetalles").html("");
            Limpiar();
            $("#newDevolucion").modal("show");
        }else if(sel === "V"){
            $("#div_nota_credito").hide();
            Accion = "R";
            $("#txtTotal").val("0.00");
            $("#frmDataDevolucion")[0].reset();
            $('#div-fecregdev').datepicker('update',fecAct);
            $("#titulo").html("Registrar nota de cambio");
            $("#tipdocventa").selectpicker('val',"0");
            $("#tblDetalles").html("");
            Limpiar();
            $("#newDevolucion").modal("show");
        }else{
            uploadMsnSmall("Seleccione una opcion Valida.","ALERTA");
        }
        cargar_combo_tiponota();
    };

    var LoadSerieSuc = function(sucu){
        $.ajax({
            type: 'POST',
            url: "view_seriexsuc_pedido",
            dataType: 'json',
            data : {idtip:$("#saltipo").val(),idsuc:sucu,idped: idped},
            success: function(data){
                if(data!==null){
                    if($("#saltipo").val() !== "0"){
                        $("#numdocu").attr("data-serint",data.msj);
                        $("#numdocu").attr("data-serelec",data.msj3);
                        $("#numdocu").val(data.msj);
                        if(esNotaElectronica === "1"){
                            $("#div_emision_electronica").show();
                        }else{
                            $("#div_emision_electronica").hide();
                        }
                    }else{
                        $("#numdocu").val("");
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var confirm_devolucion = function(a){//PARA CONFIRMAR VENTA
        idped = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        esNotaElectronica = $(a).attr("data-tiponota");
        $("#example3").prop("checked",false);
        $("#example3").val("0");
        $("#example3").change();
        var tipo = $(a).attr("data-tipo");
        if(tipo === "D"){
            $("#saltipo").html("<option value='0'>SELECCIONAR</option>"+htmlNotCred);
        }else{
            $("#saltipo").html("<option value='0'>SELECCIONAR</option>"+htmlNotDeb);
        }
        $("#saltipo").selectpicker("refresh");
        $("#saltipo").selectpicker('val','0');
        $("#numdocu").val("");
        $("#totalventa").val($(a).attr("data-total"));
        $("#mdlGenDocumento").modal("show");
    };

    var save = function(){
        $.ajax({
            type: 'post',
            url: "save_devolucion",//,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados
            dataType: 'json',
            data:{iddoc:iddoc,idped:idped,fec:$("#fecregdev").val(),"idprods[]":liIdPro, "idcan[]":liCant,
            "idpre[]":liPreUni,accion:"I","iddet[]":liIdDet,"tiponota": $("#cboTipoNotaCred").val(),
                "motivoSustento" : $("#txtSustento").val(),"tipo" : $("#cboTipoNota").val()},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        var doc_elc = "0"
                        if($("#div_nota_credito").is(":visible")){
                            doc_elc = "1";
                        }
                        btnGuardarDevolucion.stop();
                        $("#newDevolucion").modal("hide");
                        tblPedido._fnDraw();
                        uploadMsnSmall("Nota registrada correctamente.",'OK');
                        var a = document.createElement('a');
                        a.id = ids+"-"+respJson.objeto;
                        $(a).attr("data-total",$("#txtTotal").val());
                        $(a).attr("data-tiponota",doc_elc);
                        $(a).attr("data-tipo",$("#cboTipoNota").val());
                        confirm_devolucion($(a));
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
                        btnGuardarDevolucion.stop();
                    }
                }else{
                    btnGuardarDevolucion.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                btnGuardarDevolucion.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var GenDocumento = function(){///OFICIAL ESTE ES
        pago.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "gen_doc_devolucion",
            dataType: 'json',
            data:{idsuc:ids,idtip:$("#saltipo").val(),id:idped,txtnum:$("#numdocu").val(),
                hora:hora,esElectronica:$("#example3").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        tblPedido._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#mdlGenDocumento").modal("hide");
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

    var buscarComprasxProducto = function () {
        if(table !==null){
            table._fnDraw();
        }else{
            ListComprasxProducto();
        }
    };

    var update_item_compra = function (elem){
        data = elem;
        $("#modalUpdateCompra").modal("show");
    };

    var update = function(){///OFICIAL ESTE ES
        updateItem.start();
        $.ajax({
            type:'POST',
            url: "save_notacambio_compra",
            dataType: 'json',
            data : {idstock:$(data).attr("data-idstock"),id:$(data).attr("id"),valcam:$("#valorCampo").val(),
                tipcam:$("#cboTipoCampo").val(),camcam : $("#cboCambioCantidad").val()},
            success: function(data){console.log(data);
                if(data !== null){
                    if(data.dato === "OK"){
                        $("#modalUpdateCompra").modal("hide");
                        buscarComprasxProducto();
                        uploadMsnSmall(data.msj,'OK');
                        updateItem.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                               if(data.listado[i] === "E1"){uploadMsnSmall("Seleccione Tipo de Valor.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Seleccione Accion.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("El Valor del campo debe de ser diferente de cero.",'ALERTA');}
                               /* if(data.listado[i] === "E4"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Monto total Incorrecto",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("Monto efectivo o tarjeta Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("Los Montos no coinciden.",'ALERTA');}*/
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        updateItem.stop();
                    }
                }else{
                    updateItem.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                updateItem.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var RecargarTabla = function () {
        $("#tblDetalles").html("");
        for (var i=0;i<liCodPro.length;i++){
            var html="<tr>";
            html+="<td class='text-center'>"+(i+1)+"</td>";
            html+="<td class='text-center'>"+liCodPro[i]+"</td>";
            html+="<td>"+liDesPro[i]+"</td>";
            html+="<td class='text-center py-1'><input type='text' class='form-control input-sm ' name='can_"+i+"' id='can_"+i+"' data-pos='"+i+"' data-tipo='cant_' onkeyup='NotaCambio.update_item(this);' value='"+Redondear2(liCant[i])+"' style='text-align:right;' /></td>";
            html+="<td class='text-center py-1'><input type='text' class='form-control input-sm' name='puni_"+i+"' id='puni_"+i+"' data-pos='"+i+"' data-tipo='puni_' onkeyup='NotaCambio.update_item(this);' value='"+Redondear2(liPreUni[i])+"' style='text-align:right;' /></td>";
            html+="<td class='text-center py-1'><input type='text' class='form-control input-sm' name='presub_"+i+"' id='presub_"+i+"' value='"+Redondear2(liCant[i]*liPreUni[i])+"' style='text-align:right;border-width:0;background: #F8FAFB;' readonly='readonly' /></td>";
            html+="<td class='text-center py-1'><button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' name='btndel_"+i+"' id='btndel_"+i+"' data-pos='"+i+"' onclick='NotaCambio.delete_item(this);' ><i class='glyphicon glyphicon-trash'></i></button></td>";
            html+="</tr>";
            $("#tblDetalles").append(html);
            NumeroDosDecimales($("#can_"+i));
            NumeroDosDecimales($("#puni_"+i));
            NumeroDosDecimales($("#presub_"+i));
        }
        CalcularTotal();
    };

    var delete_item = function (elem) {
        var pos = $(elem).attr("data-pos");
        liIdPro.splice(pos,1);
        liCodPro.splice(pos,1);
        liDesPro.splice(pos,1);
        liCant.splice(pos,1);
        liPreUni.splice(pos,1);
        liIdDet.splice(pos,1);
        liCantValida.splice(pos,1);
        liPreUniValida.splice(pos,1);
        RecargarTabla();
    };

    var update_item = function (elem) {
        var pos = $(elem).attr("data-pos");
        var input = $(elem).attr("data-tipo");
        if(input ==="cant_"){
            if(liCantValida[pos] < Redondear2($("#can_"+pos).val()) ){
                uploadMsnSmall("Cantidad Incorrecta.","ALERTA");
                $("#can_"+pos).val(liCant[pos]);
            }else{
                liCant[pos] = Redondear2($("#can_"+pos).val());
            }
        }else if(input === "puni_"){
            if(liPreUniValida[pos] < Redondear2($("#puni_"+pos).val()) ){
                uploadMsnSmall("Precio Unitario Incorrecto.","ALERTA");
                $("#puni_"+pos).val(liPreUni[pos]);
            }else{
                liPreUni[pos] = Redondear2($("#puni_"+pos).val());
            }
        }
        $("#presub_"+pos).val(Redondear2(liCant[pos]*liPreUni[pos]));
        CalcularTotal();
    };

    var CalcularTotal = function () {
        var total = 0;
        for (var i=0;i<liCodPro.length;i++){
            total+=liCant[i]*liPreUni[i];
        }
        $("#txtTotal").val(Redondear2(total));
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

    var validarDevolucion = function () {
        if(iddoc === 0){
            uploadMsnSmall("No seleccionado un documento de venta.","ALERTA");
            btnGuardarDevolucion.stop();
            return false;
        }
        if(!moment($("#fecregdev").val(),"DD-MM-YYYY", true).isValid()){
            uploadMsnSmall("Fecha devolucion no es valida","ALERTA");
            btnGuardarDevolucion.stop();
            return false;
        }
        if(liIdPro.length === 0){
            uploadMsnSmall("No ha agregado ningun Item.","ALERTA");
            btnGuardarDevolucion.stop();
            return false;
        }
        for (var i = 0; i < liIdPro.length; i++) {
            var idpro = parseFloat(liIdPro[i]);
            var cant = parseFloat(liCant[i]);
            var prec = parseFloat(liPreUni[i]);
            if(idpro <= 0){
                uploadMsnSmall("Producto Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                btnGuardarDevolucion.stop();
                return false;
                break;
            }
            if(cant <= 0){
                uploadMsnSmall("Cantidad Incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                btnGuardarDevolucion.stop();
                return false;
                break;
            }
            if(prec <= 0){
                uploadMsnSmall("Precio Unitario Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                btnGuardarDevolucion.stop();
                return false;
                break;
            }
        }
        return true;
    };

    var enviar_notacredito_factura_sunat = function(a){
        var idp = $(a).attr("id").split("_")[2];
        var btnUpload = Ladda.create(document.querySelector('#' + $(a).attr("id")));
        btnUpload.start();
        $.ajax({
            type: 'post',
            url: 'send_notacredito_factura_sunat',
            data: {"id": idp},
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var rpta = data.dato;
                if (rpta === "OK") {
                    UploadMsnSmallLeft(data.msj, "OK");
                    tblPedido._fnDraw();
                    btnUpload.stop();
                } else {
                    UploadMsnSmallLeft(data.msj, "ERROR");
                    btnUpload.stop();
                }
            },
            error: function (jqXHR, status, error) {
                btnUpload.stop();
                uploadMsnSmall(jqXHR.responseText, 'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregdev").val(fecAct);
        $("#btnNewCambio").on("click",new_record);
        $("#btnSearchCompra").on("click",buscarComprasxProducto);
        $("#btnSearch").on("click",function () {
            tblPedido._fnDraw();
        });
        $("#txtDescBusqueda,#txtordcompra").on("keyup",function(e){if(e.keyCode===13){buscarComprasxProducto();}});
        $("#cboTipoCampo").on("change",function () {
            var valor = $(this).val();
            if(valor === "0" || valor === "P"){
                $("#div-cambio").hide();
                $("#valorCampo").val( $(data).attr("data-precom"));
            }else if(valor ==="C"){
                $("#div-cambio").show();
                $("#valorCampo").val("0.00");
            }
        });
        $("#btnUpdateValor").on("click",update);
        $("#btnGuardarDevolucion").on("click",function () {
            if(validarDevolucion()){
                btnGuardarDevolucion.start();
                save();
            }
        });
        $("#btnGenDoc").on("click",GenDocumento);
        $("#btnAddDocumento").on("click",function(){
            btnSearchDocumento.start();
            if(validarBusquedaDocumento()){
                var param = {
                    id:$("#cboLiSuNotaCambio").val(),
                    tipdoc:$("#tipdocventa").val(),
                    serie:$("#txtserie").val().toUpperCase(),
                    numero:$("#txtnum").val()
                };
                $.ajax({
                    type: 'post',
                    url: "view_docventaxtipdocxdev",
                    dataType: 'json',
                    data:param,
                    success: function(respJson) {
                        if (respJson !== null) {
                            if(respJson.dato === 'OK'){
                                var documento = respJson.objeto;
                                var pedido = documento.otbPedido;
                                iddoc = documento.id;
                                idped = pedido.id;
                                ids = documento.otbSucursal.id;
                                $("#txtcli").val(documento.nomCliente);
                                $("#txtven").val(pedido.otbUsuario.nombres+" "+pedido.otbUsuario.apePat+" "+pedido.otbUsuario.apeMat);
                                $("#txtsuc").val(pedido.otbSucursal.nombre);
                                $("#tippago").val(pedido.otbFormaPago.nombre);
                                if(documento.valorResumen !== null){
                                    $("#div_nota_credito").show();
                                }else{
                                    $("#div_nota_credito").hide();
                                }
                                var fecped = moment(pedido.fecha).format('DD-MM-YYYY');
                                $("#fecregped").val(fecped);
                                var detalles = pedido.tbDetalleventas;
                                liIdDet = new Array();
                                liIdPro = new Array();
                                liCodPro = new Array();
                                liDesPro = new Array();
                                liCant = new Array();
                                liPreUni = new Array();
                                liCantValida = new Array();
                                liPreUniValida = new Array();
                                for (var i=0;i<detalles.length;i++){
                                    liIdDet.push(detalles[i].id);
                                    liIdPro.push(detalles[i].otbProducto.id);
                                    liCodPro.push(detalles[i].otbProducto.codigo);
                                    liDesPro.push(detalles[i].otbProducto.desCategoria+" "+detalles[i].otbProducto.desMarca+" "+detalles[i].otbProducto.nombre+ (detalles[i].otbProducto.modelo != null?" "+detalles[i].otbProducto.modelo : ""));
                                    liCant.push(detalles[i].cantidad);
                                    liPreUni.push(detalles[i].preUni);
                                    liCantValida.push(detalles[i].cantidad);
                                    liPreUniValida.push(detalles[i].preUni);
                                }
                                RecargarTabla();
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
        $("#tipdocventa").on("change",function(){
            $("#txtserie").focus();
        });
        //$("#txtserie").inputmask({"mask": "(F|B|0)999"});
        $("#txtserie").on("blur",function(){
            //$(this).val( ("0000" + $(this).val()).slice(-4) );
        });
        $("#txtnum").on("blur",function(){
            $(this).val(("000000" + $(this).val()).slice(-6));
        });
        $("#saltipo").on("change",function(){LoadSerieSuc(ids);});
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecregdev"),"dd-mm-yyyy");
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                tblPedido._fnDraw();
            }
        });
        $("#btnVerRep").on("click",imprimir_reporte);
        $("#addUpdTippago").on("click",function(){
            var idpago = $("#idformapago").val();
            var monefe = $("#vermonefec").val();
            var montar = $("#vermontar").val();
            var montot = $("#vertot").val();
            $("#updmonefec").val(monefe);
            $("#updmontar").val(montar);
            $("#updmontot").val(montot);
            $("#updtipopago").selectpicker('val',idpago);
            $("#cambiopago").modal("show");
        });
        $("#btnGenRepImpresa").on("click",function(){
            verRepImpresa.start();
            $.ajax({
                type: 'post',
                url: 'ver_rep_impresa',
                data: {"id": idped},
                dataType: 'json',
                success: function (data) {
                    var rpta = data.dato;
                    if (rpta === "OK") {
                        verRepImpresa.stop();
                        var method = "downloadTicket";
                        var parameters = "idped="+idped;
                        var url = method + "?" + parameters;
                        window.open(url,'_blank').print();
                    } else {
                        UploadMsnSmallLeft("Problemas al abrir documento.", "ERROR");
                        verRepImpresa.stop();
                    }
                },
                error: function (jqXHR, status, error) {
                    verRepImpresa.stop();
                    uploadMsnSmall(jqXHR.responseText, 'ERROR');
                }
            });
        });
        $.ajax({
            type: 'post',
            url: "mant_notacambio",
            dataType: 'json',
            success: function(data){
                if (data !== null){
                    liNotCred = data.tiponotacred;
                    liNotDeb = data.tiponotadeb;
                    $("#cboTipoNotaCred").html("<option value='0'>SELECCIONE</option>");
                    $("#cboLiSuNotaCambio").html(data.htS);
                    $("#cboLiSucursal").html( (data.usu === "1" ? "<option value='0'>--TODOS--</option>" : "")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#tipdocventa").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    htmlNotCred = data.htTDNC;
                    htmlNotDeb = data.htTDND;
                   /// $("#saltipo").html("<option value='0'>--SELECCIONAR--</option>"+data.htTDNC);
                    $(".selectpicker").selectpicker("refresh");
                    ListDevoluciones();
                    buscarComprasxProducto();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#newDevolucion").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newDevolucion:visible").each(ModalCompleto);
        });
        $("#example3").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example3").val( (val ? "1" : "0") );
            if(val){
                $("#numdocu").val( $("#numdocu").attr("data-serelec") );
            }else{
                $("#numdocu").val( $("#numdocu").attr("data-serint") );
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
        update_item_compra:function(a){
            update_item_compra(a);
        },
        delete_item:function (a) {
            delete_item(a);
        },
        update_item:function (a) {
            update_item(a);
        },
        confirm_devolucion:function (a) {
            confirm_devolucion(a);
        },
        viewDetails:function (a) {
            viewDetails(a);
        },
        enviar_notacredito_factura_sunat:function(a){
            enviar_notacredito_factura_sunat(a);
        }
    };
}();
jQuery(document).ready(function () {
    NotaCambio.init();
});