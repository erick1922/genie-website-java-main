var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var validar = Ladda.create(document.querySelector('#btnValidarDNI'));
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var entrega = Ladda.create(document.querySelector('#btnGenDocEnt'));
    var cliente = Ladda.create(document.querySelector('#btnGuardarCliente'));
    var genticket = Ladda.create(document.querySelector('#btnTicket'));
    var btnSearchProd = Ladda.create(document.querySelector('#btnSearchModalProducto'));
    var verRepImpresa = Ladda.create(document.querySelector('#btnGenRepImpresa'));
    var genCDRFactura = Ladda.create(document.querySelector('#btnDownloadCDRFactura'));
    var table;
    var tableCliente;
    var tableProducto;
    var stockSel = 0;
    var tipImp = 0;
    var esDocElectronico = "";

    var serieyCorElectronico = "";

    var LisSKU;
    var LisIdPro;
    var LisCant;
    var LisPreCom;
    var LisPre3;
    var LisDesc;
    var LisPorcDescuento;
    var LisDescuento;
    var LisOpeGratuita;
    var LisCodigo;
    var LisSubTotal;
    var LisEliminados;
    var LisIdmod;
    var LisAcciones;
    var Accion;
    var fila;
    var acc = "";
    var iddet;
    var id;
    var ids;
    var pre3 = 0;
    var totalventa = 0;
    var descuento = 0;
    var opegratuita = "0";
    var LisUndVenta;

    var esimprimible = "";
    var rolUsu = "";

    var aplicaDesc = "";

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pedidos",data:function(d){d.fecini = $("#busfecini").val();
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
    
    var ListarsearchCli = function(){
        tableCliente = $("#tblCliente").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_clientes_search",data:function(d){
                d.tipo = $("#cboBuscarCliente").val();
                d.desc = $("#txtDescCliente").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback": function (oSettings) {
                $(".cliente").tooltip();
            }
        });
    };
    
    var ListarsearchPro = function(){
        Repositorio.refreshTable($('div.mdlTablaProducto'));
        tableProducto = $("#tblProducto").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pro_venta_search",data:function(d){
                d.idsuc = $("#cboLiSuPedido").val();
                d.tipo = $("#cboLiTipo").val();
                d.desc = $("#txtDescProducto").val();
                d.buspor = $("#cboBuscar").val();
                d.fecha = moment().format('DD-MM-YYYY');
                d.hora = moment().format('HH:mm:ss');
                d.stock = $("#example2").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,2]},
                {'sClass':"text-right",'aTargets': [4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback": function (oSettings) {
                $(".producto").tooltip();
                $(".producto_image").tooltip();
                $(".producto").each(function (e) {
                    $(this).keydown(function(evt){
                        if(evt.keyCode == 40){ // HACIA ABAJO
                            evt.preventDefault();
                            var filas = $('#tblProducto > tbody > tr');
                            jQuery.each( filas, function( i, val ) {
                                $(filas[i]).css("background-color","#FFFFFF");
                                $(filas[i]).css("cursor","pointer");
                            });
                            var rowindex = $(this).parents('tr');
                            var ind = parseInt($(rowindex).find("td").eq(0).html()) + 1;
                            var cantFilas = filas.length;
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
                                $("#txtDescProducto").focus();
                            }
                            return false;
                        }else if (evt.keyCode == 38){ // HABIA ARRIBA
                            evt.preventDefault();
                            var filas = $('#tblProducto > tbody > tr');
                            jQuery.each( filas, function( i, val ) {
                                $(filas[i]).css("background-color","#FFFFFF");
                                $(filas[i]).css("cursor","pointer");
                            });
                            var rowindex = $(this).parents('tr');
                            var ind = parseInt($(rowindex).find("td").eq(0).html()) - 1;
                            var cantFilas = filas.length;
                            var existe = "0";
                            while(existe === "0" && cantFilas > 0 && ind >= 0){
                                if( $("#add_prod_"+ind).length > 0 ) {
                                    existe = "1";
                                    var filaSel = $("#add_prod_" + ind).parents("tr");
                                    $(filaSel).css("background-color", "#B0BED9");
                                    $("#add_prod_" + ind).focus();
                                }
                                cantFilas--;
                                ind--;
                            }
                            if(existe === "0"){
                                var SearchInput = $("#txtDescProducto");
                                var strLength= SearchInput.val().length;
                                SearchInput.focus();
                                SearchInput[0].setSelectionRange(0, strLength);
                            }
                            return false;
                        }
                    });
                });
                Repositorio.finishRefresh($('div.mdlTablaProducto'));
                btnSearchProd.stop();
            }
        });
        $("#tblProducto tbody").on("dblclick", "tr", function() {
             var filas = $('#tblProducto > tbody > tr');
             jQuery.each( filas, function(i,val) {
                $(filas[i]).css("background-color","#FFFFFF");
             });
             if($("#"+$($(this).find("td").eq(8).html()).attr("id")).length > 0){
                 $(this).css("background-color","#B0BED9");
                 $("#"+$($(this).find("td").eq(8).html()).attr("id")).trigger("click");
             }
        });
    };
    
    var Limpiar = function(){
        $("#txtTotal,#txtMontoTotal,#txtDescTot").val("0.00");
        $("#frmDataPed")[0].reset();
        $("#frmDataProductos")[0].reset();
        $("#txtObservacionPedido").val("");
        $("#txtMotivoGrat").val("");
        $('#div-fecregped').datepicker('update',fecAct);
        fila = -1;
        acc = "";
        iddet = 0;
        pre3 = 0;
        LisIdPro = new Array();
        LisUndVenta = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisPre3 = new Array();
        LisDesc = new Array();
        LisCodigo = new Array();
        LisSKU = new Array();
        LisPorcDescuento = new Array();
        LisDescuento = new Array();
        LisOpeGratuita = new Array();
        LisSubTotal = new Array();
        LisEliminados = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();
    };
    
    var ObtenerNum = function(){
        $.ajax({
            type: 'post',
            url: "init_pedido",
            dataType: 'json',
            data:{ids:$("#cboLiSuPedido").val()},
            success:function(respJson){
                if(respJson!==null){
                    $("#txtnum").val(respJson.num);
                    $("#txtven").val(respJson.nombres);
                    $("#idcli").val(respJson.idcliente);
                    $("#txtcli").val(respJson.nomcliente);
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
        $("#tblDetalles").html("");
        $("#titulo").html("Registrar Pedido");
        Accion = "R";
        var opt = $('option:selected',$("#cboLiSuPedido")).text();
        aplicaDesc = $('option:selected',$("#cboLiSuPedido")).attr("data-aplidesc");
        $("#txtsuc").val(opt);
        ids = $("#cboLiSuPedido").val();
        descuento = 0;
        ObtenerNum();
        $("#chkOpeGra").prop("checked",false);
        $("#chkOpeGra").val("0");
        $("#chkOpeGra").iCheck('update');
        $("#div-motivo").css("display","none");
        $("#tippago").selectpicker('val',1);
        $("#txtPorcDesGlobal").val("0");
        $("#txtMontoDesGlobal").val("0.00");
        $("#txtPreven").removeAttr("readonly");
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };
    
    var addProducto = function(a){
        var fil = $(a).parents("tr");
        var col3Name = $.trim($(fil).find("td").eq(3).html());
        var colSku = $.trim($(fil).find("td").eq(2).html());
        var col1Cod = $.trim($(fil).find("td").eq(1).html());

        var desc = $(a).attr("data-desc");
        descuento = desc === null ? 0 : desc;
        if(aplicaDesc === "1"){
            descuento = parseInt($("#txtPorcDesGlobal").val())/100;
        }
        opegratuita = "0";
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val(col3Name);
        $("#skudetpro").val(colSku);
        $("#codetpro").val(col1Cod);
        $("#namepro").attr("data_um",$(a).attr("data-undven"));
        var idpro = parseFloat($("#iddetpro").val());
        var stock = parseFloat($(a).attr("data-stock"));
        pre3 = parseFloat($(a).attr("data-pre3"));
        stockSel = stock;
        for (var i = 0; i < LisIdPro.length; i++) {
            if(idpro === parseFloat(LisIdPro[i]) ){
                stockSel = stockSel - LisCant[i];
            }
        }
        if(descuento > 0.00){
            $("#txtPreven").attr("readonly","readonly");
        }else{
            $("#txtPreven").removeAttr("readonly");
        }  
        $("#txtCanti").val("1.00");
        $("#txtPreven").val($(a).attr("data-pre"));
        $("#modalSearchProducto").modal("hide");
        $("#txtPreven").focus();
    };
    
    var AddItem = function(){
        agregar.start();
        if(validarItem()){
            LisIdPro.push($("#iddetpro").val());
            LisUndVenta.push($("#namepro").attr("data_um"));
            LisDesc.push($("#namepro").val());
            LisCodigo.push($("#codetpro").val());
            LisSKU.push($("#skudetpro").val());
            LisCant.push($("#txtCanti").val());
            LisPreCom.push($("#txtPreven").val());
            LisPre3.push(pre3);
            LisOpeGratuita.push(opegratuita);
            LisPorcDescuento.push(Redondear2(descuento*100));
            LisDescuento.push(Redondear2((parseFloat($("#txtCanti").val())*parseFloat($("#txtPreven").val()))*descuento));
            LisSubTotal.push(Redondear2Decimales((parseFloat($("#txtCanti").val())*parseFloat($("#txtPreven").val()))*( 1-descuento)));
            if(Accion === "M"){
                if( acc !== ""){
                    LisIdmod.push(iddet);iddet = 0;
                    if(acc === "P"){
                        LisAcciones.push("U");acc = "";
                    }else{
                        LisAcciones.push(acc);acc = "";
                    }
                }else{
                    LisIdmod.push(0);
                    LisAcciones.push("N");
                }
            }else if(Accion === "R"){
                LisIdmod.push(0);
                LisAcciones.push("N");
            }
            $("#iddetpro").val("0");
            $("#codetpro,#namepro,#txtCanti,#txtPreven,#skudetpro").val("");
            $("#btnOpenModalProducto").prop("disabled",false);
            fila = -1;
            var valor = "1";
            if(LisOpeGratuita.length !== 0) {
                for (var i = 0; i < LisOpeGratuita.length; i++) {
                    if (LisOpeGratuita[i] === "0") {valor = "0";}
                }
            }else{
                valor = "0";
            }
            $("#chkOpeGra").prop("checked",valor==="1");
            $("#chkOpeGra").val(valor);
            $("#chkOpeGra").iCheck('update');
            $("#div-motivo").css("display",valor==="1"?"block":"none");
            CargarTabla();
            agregar.stop();
            $("#txtPreven").removeAttr("readonly");
            $("#txtBarcode").focus();
        }
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
        if( parseInt(rolUsu) > 2 ) {
            if(parseFloat($("#txtPreven").val())<pre3){
                uploadMsnSmall("El precio de venta minimo es "+pre3,"ALERTA");
                agregar.stop();
                return false;
            }
        }
        return true;
    };
    
    var SelCli = function(a){
        var fil = $(a).parents("tr");
        $("#idcli").val($(a).attr("data-id"));
        $("#txtcli").val($.trim($(fil).find("td").eq(1).html()));
        $("#modalSearchCliente").modal("hide");
        $("#newSale").modal("show");
        $("#txtBarcode").focus();
    };
    
    var CargarTabla = function(){
        $("#tblDetalles").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblDetalles").append("<tr>"+
            "<td class='text-center'>"+LisSKU[i]+"</td>"+
            "<td class='text-center'>"+LisCodigo[i]+"</td>"+
            "<td class='text-left'>"+LisDesc[i]+"</td>"+
            "<td class='text-right'>"+LisCant[i]+"</td>"+
            "<td class='text-left'> "+LisUndVenta[i]+" </td>"+
            "<td class='text-right'>"+LisPreCom[i]+"</td>"+
            "<td class='text-right'>"+LisPorcDescuento[i]+"%</td>"+
            "<td class='text-right'>"+LisDescuento[i]+"</td>"+
            "<td class='text-right'>"+LisSubTotal[i]+"</td>"+
            "<td class='text-right boton-tabla'>"+" <div class='i-checks text-center del-padding-lados'>"+
            "<label class='text-center text-primary sbold del-padding-lados' style='margin-bottom:0px!important;'>"+
            "<input type='checkbox' name='chkDetOpeGra'  class='icheck chkDetalleOpe' disabled='disabled' data-pos='"+i+"' value='"+LisOpeGratuita[i]+"' "+(LisOpeGratuita[i] === "1" ? "checked":"")+"  data-checkbox='icheckbox_flat-blue' >"+
            "<span></span>"+
            "</label>"+
            "</div>"+"</td>"+
            "<td class='text-center' style='padding:3px!important;'><button type='button' class='btn btn-sm btn-success' id='fnupd_"+i+"' data-pos='"+i+"' style='margin-right:3px!important;padding:4px 10px!important;' title='Modificar'>"+
            "<i class='glyphicon glyphicon-edit'></i></button>"+
            "<button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
            "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
            "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItem(this);});
            $("#fnupd_"+i).on("click",function(){updateItem(this);});
        }
        $(".chkDetalleOpe").iCheck({checkboxClass:'icheckbox_square-green'}).on('ifChanged',function(event){
            checkDetalleOpeGrat(event,$(this));
        });
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
            LisSKU.splice(pos,1);
            LisCodigo.splice(pos,1);
            LisCant.splice(pos,1);
            LisOpeGratuita.splice(pos,1);
            LisPreCom.splice(pos,1);
            LisPre3.splice(pos,1);
            LisPorcDescuento.splice(pos,1);
            LisDescuento.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            var valor = "1";
            if(LisOpeGratuita.length !== 0) {
                for (var i = 0; i < LisOpeGratuita.length; i++) {
                    if (LisOpeGratuita[i] === "0") {
                        valor = "0";
                    }
                }
            }else{
                valor = "0";
            }
            $("#chkOpeGra").prop("checked",valor==="1");
            $("#chkOpeGra").val(valor);
            $("#chkOpeGra").iCheck('update');
            $("#div-motivo").css("display",valor==="1"?"block":"none");
            CargarTabla();
        }else{
            uploadMsnSmall("Aun falta agregar datos.","ALERTA");
        }
    };
    
    var updateItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            fila = pos;
            $("#btnOpenModalProducto").prop("disabled",true);
            iddet = LisIdmod[pos];
            acc = LisAcciones[pos];
            pre3 = LisPre3[pos];
            descuento = LisPorcDescuento[pos];
            opegratuita = LisOpeGratuita[pos];
            $("#iddetpro").val(LisIdPro[pos]);
            $("#namepro").val(LisDesc[pos]);
            $("#codetpro").val(LisCodigo[pos]);
            $("#skudetpro").val(LisSKU[pos]);
            $("#txtCanti").val(LisCant[pos]);
            $("#namepro").attr("data_um",LisUndVenta[pos]);
            $("#txtPreven").val(Redondear2(LisPreCom[pos]));
            LisIdPro.splice(pos,1);
            LisUndVenta.splice(pos,1);
            LisDesc.splice(pos,1);
            LisSKU.splice(pos,1);
            LisCodigo.splice(pos,1);
            LisCant.splice(pos,1);
            LisPreCom.splice(pos,1);
            LisPre3.splice(pos,1);
            LisPorcDescuento.splice(pos,1);
            LisDescuento.splice(pos,1);
            LisOpeGratuita.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            CargarTabla();
            var idpro = parseFloat($("#iddetpro").val());
            var hora = moment().format('HH:mm:ss');
            var fecha = moment().format('DD-MM-YYYY');  
            $.ajax({
                type: 'post',
                url: "view_stock_producto",
                dataType: 'json',
                data:{idpro:idpro,idsuc:ids,hora:hora,fecha:fecha},
                success:function(respJson){
                    if(respJson!==null){//SACAR DESCUENTO.
                        if(respJson.dato === "OK"){
                            var stock = parseFloat(respJson.msj);
                            descuento = respJson.objeto;
                            if(aplicaDesc === "1"){
                                descuento = parseInt($("#txtPorcDesGlobal").val())/100;
                            }
                            if(descuento > 0.00){
                                $("#txtPreven").attr("readonly","readonly");
                            }else{
                                $("#txtPreven").removeAttr("readonly");
                            }
                            stockSel = stock;
                            for (var i = 0; i < LisIdPro.length; i++) {
                                if(idpro === parseFloat(LisIdPro[i]) ){
                                    stockSel = stockSel - LisCant[i];
                                }
                            }
                        }else if(respJson.dato==="ERROR"){
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                } 
            });
        }else{
            uploadMsnSmall("Aun falta agregar datos.","ALERTA");
        }
    };
    
    var validarPedido = function(){
        if( $("#idcli").val() === "" || $("#idcli").val() === "0" ){
            uploadMsnSmall("No ha Seleccionado Cliente.","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiSuPedido").val() === "" || $("#cboLiSuPedido").val() === "0" ){
            uploadMsnSmall("Sucursal Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length < 8){
            uploadMsnSmall("Numero de Pedido Incorrecta","ALERTA");
            cargando.stop();
            return false;
        }
        if(!moment($("#fecregped").val(),"DD-MM-YYYY", true).isValid()){
            uploadMsnSmall("Fecha No es Valida","ALERTA");
            cargando.stop();
            return false;
        }
        if(LisIdPro.length === 0){
            uploadMsnSmall("No ha agregado ningun Item","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#btnOpenModalProducto").attr("disabled") === "disabled" ){
            uploadMsnSmall("Faltan Completar Operación.","ALERTA");
            cargando.stop();
            return false;
        }
        for (var i = 0; i < LisIdPro.length; i++) {
            var idpro = parseFloat(LisIdPro[i]);
            var cant = parseFloat(LisCant[i]);
            var prec = parseFloat(LisPreCom[i]);
            if(idpro <= 0){
                uploadMsnSmall("Producto Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(cant <= 0){
                uploadMsnSmall("Cantidad Incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(prec <= 0){
                uploadMsnSmall("Precio Venta Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }
        return true;
    };
    
    var save = function(){
        cargando.start();
        var url = Accion === "R"?"save_pedido":"update_pedido";
        var accion = Accion === "R"?"save":"update";
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idcli:$("#idcli").val(),idsuc:$("#cboLiSuPedido").val(),fec:$("#fecregped").val(),forpag:$("#tippago").val(),
            txtnum:$("#txtnum").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,observacion:$("#txtObservacionPedido").val(),
            "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,hora:hora,condpago:$("#condpago").val(),
                opegra:$("#chkOpeGra").val(),mot:$("#txtMotivoGrat").val(),"opegrat[]":LisOpeGratuita,"descGlobal":$("#txtPorcDesGlobal").val()},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#newSale").modal("hide");
                        table._fnDraw();
                        tableProducto._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        cargando.stop();
                        var a = document.createElement('a');
                        var data = respJson.objeto;
                        if(data !== null){
                            data = data.split("-");
                        }
                        a.id = $("#cboLiSuPedido").val()+"-"+data[0];
                        $(a).attr("data-tippago",$('option:selected', $("#tippago")).text());
                        $(a).attr("data-total", Redondear2Decimales(parseFloat(data[2])));
                        $(a).attr("data-desc",Redondear2(data[1]));
                        confirm_pago($(a));
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
        var destot = 0;
        for (var i = 0; i < LisIdPro.length; i++) {
            tot+=parseFloat(LisPreCom[i] * LisCant[i]);
            destot+=parseFloat(LisDescuento[i]);
            imptot+=parseFloat(LisSubTotal[i]);
        }
        $("#txtMontoTotal").val(Redondear2(tot));
        $("#txtDescTot").val(Redondear2(destot));
        $("#txtTotal").val(Redondear2(imptot));
    };
    
    var view_record = function(elem){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    aplicaDesc = respJson.otbSucursal.aplicaPorcDescuento;
                    if(aplicaDesc === "1"){
                        $("#txtPorcDesGlobal").show();
                        $("#txtPorcDesGlobal").val(respJson.porcDescuento);
                    } else {
                        $("#txtPorcDesGlobal").hide();
                        $("#txtPorcDesGlobal").val("0");
                    }
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
                        LisSKU.push(deta.otbProducto.barcodeProducto);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisUndVenta.push(deta.otbProducto.desUnidad);
                        LisDesc.push(deta.otbProducto.nombreGeneralProducto);
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(Redondear2(deta.preUni+deta.descuentoItem));
                        LisPre3.push(deta.otbProducto.precioMayor3);
                        LisPorcDescuento.push(Redondear2(deta.porcDescuentoItem)); 
                        LisDescuento.push(Redondear2(deta.descuentoItem*deta.cantidad)); 
                        LisSubTotal.push(Redondear2(deta.preTotal));
                        LisOpeGratuita.push(deta.opeGratuita);
                        LisIdmod.push(deta.id);
                        LisAcciones.push(deta.estado);
                    }
                    CargarTabla();
                    tableProducto._fnDraw();
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
        $("#div_emision_electronica").hide();
        $("#saltipo").selectpicker('val','0');
        $("#totaldescuento").val(totaldes);
        $("#totalventa").val(Redondear2(totalventa));
        $( nomtippago === "EFECTIVO"?"#totalefectivo":(nomtippago==="DEPOSITO" ? "#totaldeposito":"#totaltarjeta")).val(Redondear2(totalventa));
        $("#visa2").prop("checked",true);

        $("#example3").prop("checked",false);
        $("#example3").val("0");
        $("#example3").change();
        $("#numdocu").val("");
        $("#facturar").modal("show");
        var dd =  $("#div-tipodoc-venta").find("button");
        $(dd).trigger("click");
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
                        esimprimible = data.objeto;
                        //console.log(data);
                        if(data.msj2 === "1"){
                            $("#div_emision_electronica").show();
                           // serieyCorElectronico = data.msj3;
                            $("#numdocu").attr("data-elec",data.msj3);
                            $("#numdocu").attr("data-noelec",data.msj);
                        }else{
                            $("#div_emision_electronica").hide();
                            //serieyCorElectronico = "";
                            $("#numdocu").attr("data-elec","");
                            $("#numdocu").attr("data-noelec",data.msj);
                        }
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
            url: "gen_doc",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,totefe:$("#totalefectivo").val(),
            tottar:$("#totaltarjeta").val(),totventa : $("#totalventa").val(), codven : $("#codVendedor").val(),
                tiptar:$("input[name=creditcard]:checked").val(),
                totdep:$("#totaldeposito").val(),recibido:$("#txtRecibido").val(),vuelto:$("#txtVuelto").val(),
            esElectronica:$("#example3").val() },
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        $("#facturar").modal("hide");
                        table._fnDraw();
                        tableProducto._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        esDocElectronico = data.objeto;
                        if(esDocElectronico === "1"){
                            esimprimible = "1";
                        }
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

    var confirm_entrega = function(a){
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        $("#frmEntrega")[0].reset();
        $("#saltipoent").selectpicker('val','0');
        $("#entrega").modal("show");
    };
    
    var LoadSerieAlm = function(alm){
        $.ajax({
            type: 'POST',
            url: "view_seriexalm",
            dataType: 'json',
            data : {idtip:$("#saltipoent").val(),idsuc:alm},
            success: function(data){
                if(data!==null){
                    if($("#saltipoent").val() !== "0"){
                        $("#numdocent").val(data.msj);
                    }else{
                        $("#numdocent").val("");
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

    var GenDocEntrega = function(){
        entrega.start();
        $.ajax({
            type: 'POST',
            url: "gen_doc_entrega",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipoent").val(),id:id,txtnum:$("#numdocent").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        tableProducto._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#entrega").modal("hide");
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione Tipo de Documento.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                    }
                    entrega.stop();
                }else{
                    entrega.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                entrega.stop();
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
        var idPedDet = $(a).attr("id").split("_")[2];
        var cdr = $(a).attr("data-cdr");
        var btnViewDeta =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        btnViewDeta.start();
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:idPedDet},
            success:function(respJson){
                console.log(respJson);
                if(respJson!==null){
                    esimprimible = "1";
                    $("#btnDownloadCDRFactura").hide();
                    if(respJson.esDocumentoElectronico === "1"){
                        if(respJson.tipoSerieImpresoVenta !== null){
                            if(respJson.tipoSerieImpresoVenta.includes("FACTURA")){
                                if(cdr === "ERROR")
                                {
                                    $("#btnDownloadCDRFactura").show();
                                }
                            }
                        }
                        $("#btnTicket").hide();
                        $("#btnPrintDocElec").show();
                        $("#btnGenRepImpresa").show();
                    } else if(respJson.esDocumentoElectronico === "0"){
                        $("#btnPrintDocElec").hide();
                        $("#btnGenRepImpresa").hide();
                        $("#btnTicket").show();
                    }
                    id = respJson.id;
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#vercli").val(respJson.otbCliente.nombre);
                    $("#vernum").val(respJson.numPedido);
                    $("#versuc").val(respJson.otbSucursal.nombre);
                    $("#vertipopag").val( respJson.otbFormaPago.nombre);
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#vermontot").val(Redondear2(respJson.montoTotal+respJson.descuento));
                    $("#verdestot").val(Redondear2(respJson.descuento));
                    $("#verigv").val(Redondear2(respJson.montoIgv));
                    $("#versub").val(Redondear2(respJson.montoSub));
                    $("#vertot").val(Redondear2(respJson.montoTotal));
                    $("#verdocped").val(respJson.tipoSerieImpresoVenta !== null ? respJson.tipoSerieImpresoVenta : "");

                    if(respJson.operacionGratuita === "1"){
                        $("#vermot").val(respJson.motivoOpeGratuita);
                        $("#txt_lbl_mot").show();
                        $("#txt_text_mot").show();
                    }else{
                        $("#vermot").val("");
                        $("#txt_lbl_mot").hide();
                        $("#txt_text_mot").hide();
                    }

                    if(respJson.observacionPedido !== null){
                        $("#txt_lbl_obs").show();
                        $("#txt_text_obs").show();
                        $("#verobs").val(respJson.observacionPedido);
                    }else{
                        $("#txt_lbl_obs").hide();
                        $("#txt_text_obs").hide();
                        $("#verobs").val("");
                    }

                    var html = "";
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++){
                        var deta = respJson.tbDetalleventas[i];
                        html+="<tr>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.nombreGeneralProducto+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preUni + deta.descuentoItem)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.porcDescuentoItem)+"%</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.descuentoItem*deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preTotal)+"</td>";
                        html+="</tr>";
                    }
                    var htP = "";
                    for (var i = 0; i < respJson.tbLetraCobrars.length; i++){
                        var deta = respJson.tbLetraCobrars[i];
                        htP+="<tr>";
                        htP+="<td class='text-center'>"+(i+1)+"</td>";
                        htP+="<td class='text-left'>"+deta.otbFormaPago.nombre+"</td>";
                        htP+="<td class='text-right'>"+Redondear2(deta.monto)+"</td>";
                        htP+="</tr>";
                    }
                    $("#pagos").html(htP);
                    $("#listado").html(html);
                    $("#viewPedido").modal("show");
                    btnViewDeta.stop();
                }else{
                    btnViewDeta.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                btnViewDeta.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };
    
    var NuevoCliente = function(){
        $.each($("#frmCliente input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });  
        style_error_cbo_final("#genero",false);
        style_error_cbo_final("#tipo",false);
        style_error_cbo_final("#estado",false);
        $("#accion").val("save");
        $("#id").val("0");
        $("#div-estado").hide();
        $('#div-fecnac').datepicker('update',fecAct);
        $("#tipo").selectpicker('val','N');
        $("#genero").selectpicker('val',''); 
        $("#estado").selectpicker('val','H');
        $("#modalCliente").modal("show");
        $("#dni").focus();
    };
    
    var saveCliente = function(){
        cliente.start();
        $.ajax({
            type: 'post',
            url: "save_cliente",
            dataType: 'json',
            data:$("#frmCliente").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cliente.stop();
                        $("#txtDescCliente").val($.trim($("#nombres").val()));
                        $("#modalCliente").modal("hide");
                        tableCliente._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        $("#txtDescCliente").focus();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#nombres");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#ruc");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#dni");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#genero",true);}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#tipo",true);}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#estado",true);}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        cliente.stop();
                    }
                }else{
                    cliente.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cliente.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };

    var ImpresionTicket = function (idpedido) {
        if(tipImp === "1"){
            if(esimprimible === "1"){
                if(IsMobile()){
                    triggerAppOpen(idpedido);
                } else {
                    genticket.start();
                    var tipoDoc = esDocElectronico === "1" ? "5" : "3";
                    $.ajax({
                        type: 'get',
                        url: 'http://127.0.0.1:8000/print=1',
                        data: {"idped":idpedido,"tipo":tipoDoc},
                        success: function (data) {
                            var rpta = data.respuesta;
                            if(rpta === "OK"){
                                UploadMsnSmallLeft("Documento enviado a imprimir.","OK");
                                // Repositorio.finishRefresh($('div.blockMe'));
                                genticket.stop();
                            }else{
                                UploadMsnSmallLeft("Problemas al comunicar con la impresora.","ERROR");
                                //Repositorio.finishRefresh($('div.blockMe'));
                                genticket.stop();
                            }
                        },
                        error: function (jqXHR, status, error) {
                            //Repositorio.finishRefresh($('div.blockMe'));
                            genticket.stop();
                            uploadMsnSmall(jqXHR.responseText, 'ERROR');
                        }
                    });
                }
            }
        } else if(tipImp === "2"){
            imprimir_ticket();
        }
    };

    var imprimir_ticket = function(){
        var method = "downloadTicket";
        var parameters = "idped="+id;
        var url = method + "?" + parameters;
        window.open(url,'_blank').print();
    };
    
    var addPrductBarcode = function(elem){
        var hora = moment().format('HH:mm:ss');  //PONER EL PARAMETRO DE BUSQUEDA SKU O CODIGO.PRODUCTO.
        var fecha = moment().format('DD-MM-YYYY');  
        agregar.start();
        $.ajax({
            type: 'post',
            url: "addpro_barcode",
            dataType: 'json',
            data:{codepro:$(elem).val(),suc:$("#cboLiSuPedido").val(),fecha:fecha,hora:hora},
            success: function (respJson){
                if (respJson !== null) {
                    if(respJson.dato === "OK"){
                        opegratuita = "0";
                        $("#iddetpro").val(respJson.objeto.id);
                        $("#namepro").val(respJson.msj);
                        $("#codetpro").val(respJson.objeto.codigo);
                        $("#skudetpro").val(respJson.objeto.barcodeProducto);
                        var idpro = parseFloat($("#iddetpro").val());
                        var stock = parseFloat(respJson.objeto.stockActual);
                        pre3 = parseFloat(respJson.objeto.precioMayor3); 
                        stockSel = stock;
                        descuento = respJson.objeto.descuento;
                        if(aplicaDesc === "1"){
                            descuento = parseInt($("#txtPorcDesGlobal").val())/100;
                        }
                        for (var i = 0; i < LisIdPro.length; i++) {
                           if(idpro === parseFloat(LisIdPro[i])){
                               stockSel = stockSel - LisCant[i];
                           }
                        }
                        $("#txtCanti").val("1.00");
                        $("#txtPreven").val(Redondear2(respJson.objeto.precioMenor1));
                        AddItem();
                        $("#txtBarcode").val("");
                        $("#txtBarcode").focus();
                        agregar.stop();
                    }else if(respJson.dato === "ERROR"){
                        agregar.stop();
                        uploadMsnSmall(respJson.msj,'ERROR');
                    }
                }else{
                    agregar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                agregar.stop();
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        }); 
    };

    var checkOperacionGrat = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
        $("#div-motivo").css("display",isChecked?"block":"none");
        for(var i=0;i<LisOpeGratuita.length;i++){
            LisOpeGratuita[i] = isChecked?"1":"0";
        }
        CargarTabla();
    };

    var checkDetalleOpeGrat = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
        var pos = $(a).attr("data-pos");
        LisOpeGratuita[pos] = isChecked?"1":"0";
        cargarTotal();
        var valor = "1";
        for(var i=0;i<LisOpeGratuita.length;i++){
            if(LisOpeGratuita[i] === "0"){
                valor = "0";
            }
        }
        $("#chkOpeGra").prop("checked",valor==="1");
        $("#chkOpeGra").val(valor);
        $("#chkOpeGra").iCheck('update');
        $("#div-motivo").css("display",valor==="1"?"block":"none");
    };

    var viewImageProducto = function (elem) {
        $("#titImagen").text($(elem).attr("data-codigo")+": "+$(elem).attr("data-name"));
        if($(elem).attr("data-id") !== ""){
            $("#viewProductoImagen").html("<img src='resources/images/"+$(elem).attr("data-id")+"' width='500px;'/>");
        }else{
            $("#viewProductoImagen").html("NO TIENE IMAGEN.");
        }
        $("#modalViewImage").modal("show");
    };

    var enviar_factura_sunat = function(a){
        var idp = $(a).attr("id").split("_")[2];
        var btnUpload = Ladda.create(document.querySelector('#' + $(a).attr("id")));
        btnUpload.start();
        $.ajax({
            type: 'post',
            url: 'send_factura_sunat',
            data: {"id": idp},
            dataType: 'json',
            success: function (data) {
                console.log(data);
                var rpta = data.dato;
                if (rpta === "OK") {
                    UploadMsnSmallLeft(data.msj, "OK");
                    table._fnDraw();
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
        $("#viewPedido").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPedido:visible").each(ModalCompleto);
        });
        $("#modalSearchCliente").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchCliente:visible").each(ModalCompleto);
        });
        $("#modalSearchProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProducto:visible").each(ModalCompleto);
        });
        $("#visa2,#mastercard2").on("click",function () {
            $("#totalefectivo").val("0.00");
            $("#totaltarjeta").val($("#totalventa").val());
        });
        $("#txtVuelto").css("text-align","right");
        NumeroEntero($("#ruc"),11);
        $("#dni").on("keypress",function(e){
            AccepWithNumber(e);
        });
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
        $('#chkOpeGra').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkOperacionGrat(event,$(this));
        });
        $('#newSale').on('shown.bs.modal',function(){
            $("#txtBarcode").focus();
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnAddItem").on("click",AddItem);
        $("#btnGuardar").on("click",function(){
            if(validarPedido()){save();}
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearchModalCliente").on("click",function(){tableCliente._fnDraw();});
        $("#txtDescCliente").on("keyup",function(e){
            if(e.keyCode  != 38 && e.keyCode  != 40 && e.keyCode  != 37 && e.keyCode  != 39 && e.keyCode  != 27 /*ESC*/ ){
                //btnSearchProd.start();
                //Repositorio.refreshTable($('div.mdlTablaProducto'));
                tableCliente._fnDraw();
                return false;
            }
        });
        $("#btnSearchModalProducto").on("click",function(){
            btnSearchProd.start();
            Repositorio.refreshTable($('div.mdlTablaProducto'));
            tableProducto._fnDraw();
        });
        $("#saltipo").on("change",function(){LoadSerie(ids);});
        $("#saltipoent").on("change",function(){LoadSerieAlm(ids);});
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#btnGenDocEnt").on("click",function(){GenDocEntrega();});
        $("#btnNewCliente").on("click",NuevoCliente);
        $("#btnGuardarCliente").on("click",saveCliente);
        $("#cboLiUsuario,#cboLiEstado").on("change",function(){ table._fnDraw(); });
        $("#cboLiSucursal").on("change",function(){
            var valSuc = $(this).val();
            if(valSuc !== "0"){$("#cboLiSuPedido").selectpicker('val',valSuc);}
            table._fnDraw();
        });
        $("#cboLiSuPedido").on("change",function(){
            $("#cboLiSucursal").selectpicker('val',$(this).val());
            table._fnDraw();
            aplicaDesc = $('option:selected',$(this)).attr("data-aplidesc");
            if(aplicaDesc === "1"){
                $("#div-porcdescuento").show();
            } else if(aplicaDesc === "0"){
                $("#div-porcdescuento").hide();
            }
        });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#txtBarcode").on("keypress",function(event){
            if(event.keyCode === 13){///CON EL LECTOR SE ESCRIBE EL CODIGO va generando un evento y al final da enter, se captura el enter y arroja todo el texto completo.
                if(!agregar.isLoading() && $("#btnOpenModalProducto").attr("disabled") !== "disabled" ){
                    addPrductBarcode($(this));
                }
            }
        });
        $("#txtRecibido").on("keyup",function(e){
            var venTot = parseFloat($("#totalventa").val());
            var efec = parseFloat($("#totalefectivo").val());
            var tarj = parseFloat($("#totaltarjeta").val());
            var recibo = parseFloat($("#txtRecibido").val());
            var vuelto = recibo - efec;
            $("#txtVuelto").val(Redondear2(vuelto));
        });
        $("#btnTicket").on("click",function (){
            if(tipImp === "1"){
                //if(esimprimible === "1"){
                    if(IsMobile()){
                        triggerAppOpen(id);
                    } else {
                        genticket.start();
                        $.ajax({
                            type: 'get',
                            url: 'http://127.0.0.1:8000/print=1',
                            data: {"idped": id, "tipo": "3"},
                            //dataType: 'json',
                            success: function (data) {
                                console.log(data);
                                var rpta = data.respuesta;
                                if (rpta === "OK") {
                                    UploadMsnSmallLeft("Documento enviado a imprimir", "OK");
                                    // Repositorio.finishRefresh($('div.blockMe'));
                                    genticket.stop();
                                } else {
                                    UploadMsnSmallLeft("Problemas al comunicar con la impresora.", "ERROR");
                                    //Repositorio.finishRefresh($('div.blockMe'));
                                    genticket.stop();
                                }
                            },
                            error: function (jqXHR, status, error) {
                                //Repositorio.finishRefresh($('div.blockMe'));
                                genticket.stop();
                                uploadMsnSmall(jqXHR.responseText, 'ERROR');
                            }
                        });
                    }
                //}
            } else if(tipImp === "2"){
                imprimir_ticket();
            }
        });
        $("#btnPrintDocElec").on("click",function (){
            if(tipImp === "1"){
                //if(esimprimible === "1"){
                if(IsMobile()){
                    triggerAppOpen(id);
                } else {
                    genticket.start();
                    $.ajax({
                        type: 'get',
                        url: 'http://127.0.0.1:8000/print=1',
                        data: {"idped": id, "tipo": "5"},
                        //dataType: 'json',
                        success: function (data) {
                            var rpta = data.respuesta;
                            if (rpta === "OK") {
                                UploadMsnSmallLeft("Documento enviado a imprimir", "OK");
                                // Repositorio.finishRefresh($('div.blockMe'));
                                genticket.stop();
                            } else {
                                UploadMsnSmallLeft("Problemas al comunicar con la impresora.", "ERROR");
                                //Repositorio.finishRefresh($('div.blockMe'));
                                genticket.stop();
                            }
                        },
                        error: function (jqXHR, status, error) {
                            //Repositorio.finishRefresh($('div.blockMe'));
                            genticket.stop();
                            uploadMsnSmall(jqXHR.responseText, 'ERROR');
                        }
                    });
                }
                //}
            } else if(tipImp === "2"){
                imprimir_ticket();
            }
        });
        $("#btnGenRepImpresa").on("click",function(){
            verRepImpresa.start();
            $.ajax({
                type: 'post',
                url: 'ver_rep_impresa',
                data: {"id": id},
                dataType: 'json',
                success: function (data) {
                    var rpta = data.dato;
                    if (rpta === "OK") {
                        verRepImpresa.stop();
                        var method = "downloadTicket";
                        var parameters = "idped="+id;
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
        $("#btnDownloadCDRFactura").on("click",function(){
            genCDRFactura.start();
            $.ajax({
                type: 'post',
                url: 'gen_cdr_factura',
                data: {"id": id},
                dataType: 'json',
                success: function (data) {
                    var rpta = data.dato;
                    if (rpta === "OK") {
                        genCDRFactura.stop();
                        UploadMsnSmallLeft("Documento enviado a SUNAT.", "OK");
                    } else {
                        UploadMsnSmallLeft("Problemas al abrir documento.", "ERROR");
                        genCDRFactura.stop();
                    }
                },
                error: function (jqXHR, status, error) {
                    genCDRFactura.stop();
                    uploadMsnSmall(jqXHR.responseText, 'ERROR');
                }
            });
        });
        $.ajax({
            type: 'post',
            url: "mant_pedido",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    tipImp = data.tipoImp;
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#saltipo").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#saltipoent").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#tippago").html(data.htFP);
                    $("#condpago").html(data.htCP);
                    $(".selectpicker").selectpicker("refresh");
                    ListPedidos();
                    ListarsearchCli();
                    ListarsearchPro();
                    var tipos = $("#tippago option");
                    for(var i=0;i<tipos.length;i++){
                        if(tipos[i].value === "4"){$("#div-deposito").css("display","block");}
                    }
                    rolUsu = data.rol;
                    $("#cboLiSuPedido").change();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#div-fecnac").on("changeDate",function (){
            if(moment($("#fecnac").val(),"DD-MM-YYYY", true).isValid()){
                var act = moment();
                var fecnac = moment($("#fecnac").val(),"DD-MM-YYYY");
                var diaAct = act.format("DD");
                var mesAct = act.format("MM");
                var anioAct = act.format("YYYY");
                var diaNac = fecnac.format("DD");
                var mesNac = fecnac.format("MM");
                var anioNac = fecnac.format("YYYY");
                var edad = parseInt(anioAct) - parseInt(anioNac);
                if( (parseInt(mesAct) - parseInt(mesNac)) === 0 ){
                    if( (parseInt(diaAct) - parseInt(diaNac)) < 0 ){
                        edad--;
                    }
                }else if( (parseInt(mesAct) - parseInt(mesNac)) < 0 ){
                    edad--;
                }
                $("#edad").val(edad);
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
                    jQuery.each( filas, function( i, val ) {$(filas[i]).css("background-color","#FFFFFF");
                        $(filas[i]).css("cursor","pointer");});
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
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreven,#skudetpro").val("");
            $('#modalSearchProducto').modal('show');$('#btnSearchModalProducto').trigger('click');$('#txtDescProducto').focus();
        });
        $("#btnValidarDNI").on("click",function () {
            Repositorio.ValidarDniCliente(validar,$("#nombres"),$("#dni").val());
        });
        $("#dni").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnValidarDNI").trigger("click");
            }
        });
        $("#txtDescProducto").on("keyup",function(e){
            if(e.keyCode  != 38 && e.keyCode  != 40 && e.keyCode  != 37 && e.keyCode  != 39 && e.keyCode  != 27 /*ESC*/ ){
                btnSearchProd.start();
                Repositorio.refreshTable($('div.mdlTablaProducto'));
                tableProducto._fnDraw();
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
        NumeroPorcentajeDecimales($("#txtPorcDesGlobal"),3,0,99);
        NumeroDosDecimales($("#txtMontoDesGlobal"));
        $("#txtPorcDesGlobal").on("blur",function(e){
            if($("#txtPorcDesGlobal").val() === ""){
                $("#txtPorcDesGlobal").val("0");
            }
            var despor = parseFloat($("#txtPorcDesGlobal").val());
            var desmonto = despor/100;
            var destotal = 0.00;
            for(var i=0;i<LisPorcDescuento.length;i++){
                LisPorcDescuento[i] = Redondear2(despor);
                LisDescuento[i] = Redondear2( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*desmonto );
                LisSubTotal[i] = Redondear2Decimales( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*( 1-desmonto));
                destotal+=((parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*desmonto);
            }
            CargarTabla();
            $("#txtMontoDesGlobal").val(Redondear2Decimales(destotal));
        });
        $("#txtMontoDesGlobal").on("blur",function (e) {
            if($("#txtMontoDesGlobal").val() === ""){
                $("#txtMontoDesGlobal").val("0");
            }
            var porcenTotal = (parseFloat($("#txtMontoTotal").val()) > 0 ? ((parseFloat($("#txtMontoDesGlobal").val())*100)/ parseFloat($("#txtMontoTotal").val())) : 0.00 );
           // 80 -> 100%
            ///40 -> x%
            $("#txtPorcDesGlobal").val(porcenTotal);
            var despor = parseFloat($("#txtPorcDesGlobal").val());
            var desmonto = despor/100;
            var destotal = 0.00;
            for(var i=0;i<LisPorcDescuento.length;i++){
                LisPorcDescuento[i] = Redondear2(despor);
                LisDescuento[i] = Redondear2( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*desmonto );
                LisSubTotal[i] = Redondear2Decimales( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*( 1-desmonto));
                destotal+=((parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*desmonto);
            }
            CargarTabla();
            $("#txtMontoDesGlobal").val(Redondear2Decimales(destotal));
        });
        $("#example2").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example2").val( (val ? "1" : "0") );
            tableProducto._fnDraw();
        });
        $("#example3").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example3").val( (val ? "1" : "0") );
            if(val){
                $("#numdocu").val( $("#numdocu").attr("data-elec") );
            }else{
                $("#numdocu").val( $("#numdocu").attr("data-noelec") );
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
        Cancelar:function(elem){
            Cancelar(elem);
        },
        SelCli:function(a){
            SelCli(a);
        },
        addProducto:function(a){
            addProducto(a);
        },
        viewDetails:function(a){
            viewDetails(a);
        },
        confirm_pago:function(a){
            confirm_pago(a);
        },
        confirm_entrega:function(a){
            confirm_entrega(a);
        },
        viewImageProducto:function (a) {
            viewImageProducto(a);
        },
        enviar_factura_sunat:function(a){
            enviar_factura_sunat(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});