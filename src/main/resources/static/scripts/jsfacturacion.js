var Facturacion = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var updatePago = Ladda.create(document.querySelector('#btnGenTipoPag'));
    var correo = Ladda.create(document.querySelector('#btnEmail'));
    var updCodVend = Ladda.create(document.querySelector('#btnUpdCodVend'));
    var updDocumento = Ladda.create(document.querySelector('#btnUpdDocumento'));
    var listFP = new Array();
    var listNFP = new Array();
    var listMP = new Array();
    var table;
    var ids = 0;
    var firmarreporte = null;

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_documentos",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.cli = $("#txtCliente").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            },
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                if(aData[7] == "CANCELADO"){
                   // $(nRow).css("background-color", "#ddd");
                    //$(nRow).css("background-color", "#ccc");
                    ///$(nRow).css("background-color", "#FF6862");
                }
            }
        });
    };

    var imprimir_reporte = function(){
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadFacturacion";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var imprimir_utilidad = function(){
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadUtilidad";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var imprimir_balance = function () {
        var fec = moment().format('DD/MM/YYYY');
        var hora = moment().format('HH:mm:ss');
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadCaja";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt+"&fec="+fec+"&hora="+hora;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var imprimir_semanal = function () {
        var fec = moment().format('DD/MM/YYYY');
        var hora = moment().format('HH:mm:ss');
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadSemanal";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt+"&fec="+fec+"&hora="+hora;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el documento?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result){
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'cancel_documento',
                        data: {"id":$(elem).attr("id")},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                if(data.dato === 'OK'){
                                    uploadMsnSmall("Documento cancelado correctamente.","OK");
                                    table._fnDraw();
                                }else if(data.dato === "ERROR"){
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
            success:function(respJson){
                if(respJson!==null){
                    ids = $(a).attr("data_suc");
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#vercli").val(respJson.otbCliente.nombre);
                    $("#vernum").val(respJson.numPedido);
                    $("#versuc").val(respJson.otbSucursal.nombre);
                    $("#vercond").val(respJson.otbCondicionPago.nombre);
                    $("#vermontot").val(Redondear2(respJson.montoTotal+respJson.descuento));
                    $("#verdestot").val(Redondear2(respJson.descuento));
                    $("#idped").val(respJson.id);
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#verigv").val(Redondear2(respJson.montoIgv));
                    $("#versub").val(Redondear2(respJson.montoSub));
                    $("#vertot").val(Redondear2(respJson.montoTotal));
                    $("#verpeddoc").val(respJson.tipoSerieImpresoVenta);

                    if(respJson.operacionGratuita === "1"){
                        $("#vermot").val(respJson.motivoOpeGratuita);
                        $("#txt_gratuito").show();
                    }else{
                        $("#vermot").val("");
                        $("#txt_gratuito").hide();
                    }
                    if(respJson.observacionPedido !== null){
                        $("#txt_observaciones").show();
                        $("#verobs").val(respJson.observacionPedido);
                    }else{
                        $("#txt_observaciones").hide();
                        $("#verobs").val("");
                    }

                    var html = "";
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++){
                        var deta = respJson.tbDetalleventas[i];
                        var descart = deta.otbProducto.nombreGeneralProducto;
                        descart+=(deta.categoriaEquipo!==null?deta.categoriaEquipo.nombre+" ":"");
                        descart+=(deta.marcaEquipo!==null?deta.marcaEquipo.nombre+" ":"");
                        descart+=(deta.modeloEquipo!==null?deta.modeloEquipo+" ":"");
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+deta.otbProducto.codigo+"</td>";
                        html+="<td class='text-center'>"+deta.otbProducto.barcodeProducto+"</td>";
                        html+="<td>"+ (deta.habitacion !== null ? ($.trim(descart)+ " " + deta.habitacion.numHabitacion) : $.trim(descart) )+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preUni + deta.descuentoItem)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.porcDescuentoItem)+"%</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.descuentoItem)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preTotal)+"</td>";
                        html+="</tr>";
                    }
                    $("#listado").html(html);
                    var letras = respJson.tbLetraCobrars;
                    html = "";
                    for (var i = 0; i < letras.length; i++){
                        var letra = letras[i];
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+moment(letra.fechaPago).format('DD-MM-YYYY')+"</td>";
                        html+="<td class='text-left'>"+letra.otbUsuario.nombres+ " "+letra.otbUsuario.apePat+" "+letra.otbUsuario.apeMat+"</td>";
                        html+="<td>"+letra.otbTipoDocumento.nombre+": "+letra.numSerie+"</td>";
                        html+="<td>"+letra.otbFormaPago.nombre+"</td>";
                        html+="<td class='text-right'>"+Redondear2(letra.monto)+"</td>";
                        html+="</tr>";
                    }
                    $("#pagos").html(html);
                    listFP = new Array();
                    listNFP = new Array();
                    listMP = new Array();
                    var htmlPago = "";
                    $("#updtipopago option").each(function(){
                        listFP.push($(this).attr('value'));
                        listNFP.push($(this).text());
                        listMP.push("0.00");
                    });
                    for(var j=0;j<listFP.length;j++){
                        htmlPago+="<tr>";
                        htmlPago+="<td>"+(j+1)+"</td>";
                        htmlPago+="<td>"+listNFP[j]+"</td>";
                        for(var k=0;k<letras.length;k++){
                            var let = letras[k];
                            if(parseInt(listFP[j]) === parseInt(let.otbFormaPago.id)){
                                listMP[j] = Redondear2(let.monto);
                                k=letras.length + 1;
                            }
                        }
                        htmlPago+="<td><input type='text' class='form-control input-sm' name='fp_"+j+"' id='fp_"+j+"' data-pos='"+j+"' value='"+listMP[j]+"' /></td>";
                        htmlPago+="</tr>";
                    }
                    htmlPago+="<tr>";
                    htmlPago+="<td colspan='2' style='text-align: right;'>MONTO TOTAL</td>";
                    htmlPago+="<td><input type='text' class='form-control input-sm' name='updmontot' id='updmontot' value='"+Redondear2(respJson.montoTotal)+"' readonly='readonly' /></td>";
                    htmlPago+="</tr>";
                    $("#tblPago").html(htmlPago);
                    for(var j=0;j<listFP.length;j++){
                        NumeroDosDecimales($("#fp_"+j));
                    }
                    NumeroDosDecimales($("#updmontot"));
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
    
    var obtenerIp = function(){
        try {
            var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
            if (RTCPeerConnection) (
                function () {
                var rtc = new RTCPeerConnection({ iceServers: [] });
                if (1 || window.mozRTCPeerConnection) {
                    rtc.createDataChannel('', { reliable: false });
                };

                rtc.onicecandidate = function (evt) {
                    if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
                };
                rtc.createOffer(function (offerDesc) {
                    grepSDP(offerDesc.sdp);
                    rtc.setLocalDescription(offerDesc);
                }, function (e) { console.warn("offer failed", e); });
                    var addrs = Object.create(null);
                    addrs["0.0.0.0"] = false;
                    function updateDisplay(newAddr) {
                        if (newAddr in addrs) return;
                        else addrs[newAddr] = true;
                        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
                        var LgIpDynAdd = displayAddrs.join(" or perhaps ") || "n/a";
                        alert(LgIpDynAdd);
                    }

                    function grepSDP(sdp) {
                        var hosts = [];
                        sdp.split('\r\n').forEach(function (line) {
                            if (~line.indexOf("a=candidate")) {
                                var parts = line.split(' '),
                                    addr = parts[4],
                                    type = parts[7];
                                if (type === 'host') updateDisplay(addr);
                            } else if (~line.indexOf("c=")) {
                                var parts = line.split(' '),
                                    addr = parts[2];
                                alert(addr);
                            }
                        });
                    }
          })();
        }catch(ex){ 
        }  
    };

    var EnviarCorreo = function(){
        $.ajax({
            type: 'post',
            url: "send_correo",
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    correo.stop();
                }else{
                    correo.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                correo.stop();
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
    };
    
    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecfirmaciecaja").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecfirmaciecaja"),"dd-mm-yyyy");
        $("#btnVerRep").on("click",imprimir_reporte);
        $("#btnVerUtilidad").on("click",imprimir_utilidad);
        $("#btnVerCaja").on("click",imprimir_balance);
        $("#btnVerSemanal").on("click",imprimir_semanal);
        $("#btnCerrarCajaFirmarRep").on("click",function() {
            var opt = $('option:selected', $("#cboLiSucursal")).text();
            $("#nomsucursal").val(opt);
            $("#modalFechaCierreCaja").modal("show");
        });

        $("#btnGuardarFirma").on("click",function(){
            $("#modalFechaCierreCaja").modal("hide");
            var fec = moment().format('DD/MM/YYYY');
            var hora = moment().format('HH:mm:ss');
            var opt = $('option:selected', $("#cboLiSucursal")).text();
            firmarreporte.start();
            $.ajax({
                type: 'post',
                url: "generar_consolidado_firmado",
                data:{fecha : $("#fecfirmaciecaja").val(),idsuc: $("#cboLiSucursal").val(),
                    idusu: $("#cboLiUsuario").val(),nom: opt,fec : fec, hora : hora},
                dataType: 'json',
                success: function (data) {
                    if (data !== null) {
                        var ruta = data.msj2+"/"+data.msj;
                        var method = "downloadConsolidadoFirmado";
                        var parameters = "ruta=" + ruta;
                        var url = method + "?" + parameters;
                        window.open(url,'_blank');
                        firmarreporte.stop();
                    }else{
                        firmarreporte.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    firmarreporte.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnEmail").on("click",function(){
            correo.start();
            EnviarCorreo();
        });
        $("#addUpdTippago").on("click",function(){
            $("#cambiopago").modal("show");
        });
        $("#addUpdDocPago").on("click",function () {
            $("#verdocvend").val($("#verpeddoc").val());
            $("#saltipo").selectpicker('val','0');
            $("#numdocu").val("");
            $("#cambioDocumento").modal("show");
        });
        $("#btnUpdateVendedor").on("click",function () {
            $("#verusuvend").val($("#verusu").val());
            $("#vennuevo").val("");
            $("#cambioVendedor").modal("show");
            $("#vennuevo").focus();
        });
        $("#vennuevo").on("keyup",function (e) {
            if (e.keyCode === 13) { // up
                $("#btnUpdCodVend").trigger("click");
            }
        });
        $("#btnGenTipoPag").on("click",function () {
            updatePago.start();
            var idped = $("#idped").val();
            for(var i=0;i<listFP.length;i++){
                listMP[i] = parseFloat($("#fp_"+i).val());
            }
            $.ajax({
                type: 'post',
                url: "update_pago_pedido",
                dataType: 'json',
                data:{idped:idped,total:$("#updmontot").val(),"lifp[]":listFP,"limp[]":listMP},
                success: function(respJson){
                    if (respJson !== null) {
                        if(respJson.dato === 'OK'){
                            uploadMsnSmall("Tipo de Pago Cambiado Correctamente.","OK");
                            var button = document.createElement('button');
                            button.id = idped;
                            viewDetails($(button));
                            $("#cambiopago").modal("hide");
                            updatePago.stop();
                        }else if(respJson.dato === "ERROR"){
                            if(respJson.listado.length>0){
                                for (var i = 0; i < respJson.listado.length; i++){
                                    if(respJson.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                    if(respJson.listado[i] === "E2"){uploadMsnSmall("Monto de Pago Incorrecto.",'ALERTA');}
                                    if(respJson.listado[i] === "E3"){uploadMsnSmall("Monto total Incorrecto",'ALERTA');}
                                    if(respJson.listado[i] === "E4"){uploadMsnSmall("Monto efectivo o tarjeta Incorrecta.",'ALERTA');}
                                    if(respJson.listado[i] === "E5"){uploadMsnSmall("Los Montos no coinciden.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(respJson.msj,respJson.dato);
                            }
                            updatePago.stop();
                        }
                    }else{
                        updatePago.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    updatePago.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
        });
        $("#cboLiSucursal,#cboLiUsuario,#cboLiEstado").on("change",function(){ table._fnDraw(); });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#txtCliente").on("keyup",function () {
            table._fnDraw();
        });
        $.ajax({
            type: 'post',
            url: "mant_facturacion",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    var cod = $("#cod_11").val();
                    if(cod === "1"){
                        firmarreporte = Ladda.create(document.querySelector('#btnCerrarCajaFirmarRep'));
                        $("#div_firmar_rep_cerra_caja").show();
                    }else{
                        $("#div_firmar_rep_cerra_caja").remove();
                    }
                    var div = data.div;
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#saltipo").html("<option value='0'>--SELECCIONE--</option>"+data.htT);
                    $("#updtipopago").html(data.htFP);
                    $(".selectpicker").selectpicker("refresh");
                    if(div !== "0"){
                        $("#div-utilidad").css("display","block");
                    }else{
                        $("#div-utilidad").html("");
                    }
                    ListPedidos();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#saltipo").on("change",function(){
            $.ajax({
                type: 'POST',
                url: "view_seriexsuc",
                dataType: 'json',
                data : {idtip:$("#saltipo").val(),idsuc:ids},
                success: function(data){
                    if(data!==null){
                        if($("#saltipo").val() !== "0"){
                            $("#numdocu").val(data.msj);
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
        });
        $("#viewPedido").on("shown.bs.modal",ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPedido:visible").each(ModalCompleto);
        });
        $("#btnUpdateVendedor,#addUpdTippago,#addUpdDocPago").tooltip();
        $("#btnUpdCodVend").on("click",function () {
            updCodVend.start();
            var idped = $("#idped").val();
            $.ajax({
                type: 'post',
                url: "update_vendedor_pedido",
                dataType: 'json',
                data:{idped:idped,vend:$("#vennuevo").val()},
                success: function(respJson){
                    if (respJson !== null) {
                        if(respJson.dato === 'OK'){
                            uploadMsnSmall("Vendedor se cambio correctamente.","OK");
                            var button = document.createElement('button');
                            button.id = idped;
                            $(button).attr("data_suc",ids);
                            viewDetails($(button));
                            $("#cambioVendedor").modal("hide");
                            updCodVend.stop();
                        }else if(respJson.dato === "ERROR"){
                            if(respJson.listado.length>0){
                                for (var i = 0; i < respJson.listado.length; i++){
                                    if(respJson.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                    if(respJson.listado[i] === "E2"){uploadMsnSmall("Código de vendedor incorrecto.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(respJson.msj,respJson.dato);
                            }
                            updCodVend.stop();
                        }
                    }else{
                        updCodVend.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    updCodVend.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
        });
        $("#btnUpdDocumento").on("click",function () {
            updDocumento.start();
            var idped = $("#idped").val();
            $.ajax({
                type: 'post',
                url: "update_documento_pedido",
                dataType: 'json',
                data:{idped:idped,idtipo:$("#saltipo").val()},
                success: function(respJson){
                    if (respJson !== null) {
                        if(respJson.dato === 'OK'){
                            uploadMsnSmall("Documento se cambio correctamente.","OK");
                            var button = document.createElement('button');
                            button.id = idped;
                            $(button).attr("data_suc",ids);
                            viewDetails($(button));
                            $("#cambioDocumento").modal("hide");
                            $("#saltipo").selectpicker('val','0');
                            $("#numdocu").val("");
                            updDocumento.stop();
                        }else if(respJson.dato === "ERROR"){
                            if(respJson.listado.length>0){
                                for (var i = 0; i < respJson.listado.length; i++){
                                    if(respJson.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                    if(respJson.listado[i] === "E2"){uploadMsnSmall("Tipo Documento incorrecto.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(respJson.msj,respJson.dato);
                            }
                            updDocumento.stop();
                        }
                    }else{
                        updDocumento.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    updDocumento.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
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
        }
    };
}();
jQuery(document).ready(function () {
    Facturacion.init();
});