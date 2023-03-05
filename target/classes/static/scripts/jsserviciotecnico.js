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
    var table;
    var tableCliente;
    var tableProducto;
    var stockSel = 0;
    var tipImp = 0;

    var LisIdPro;
    var LisCategoria;
    var LisMarca;
    var LisModelo;
    var LisSerie;
    var LisFalla;
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

    var htmTipoServicio = "<option value='0'>--SELECCIONE--</option>";
    var htmMarca = "<option value='0'>--SELECCIONE--</option>";
    var htmCategoria = "<option value='0'>--SELECCIONE--</option>";

    var ConstruirTipoServicio = function (pos) {
        var html = "<select class='form-control input-sm selectpicker' name='cboTipoServicio_"+pos+"' id='cboTipoServicio_"+pos+"' data-live-search='true' data-pos='"+pos+"' onchange='Pedido.SeleccionarTipoServicio(this);' >";
        html+=htmTipoServicio;
        html+="</select>";
        return html;
    };

    var ConstruirCategoria = function (pos) {
        var html = "<select class='form-control input-sm selectpicker' name='cboCategoriaEquipo_"+pos+"' id='cboCategoriaEquipo_"+pos+"' data-live-search='true' data-pos='"+pos+"' onchange='Pedido.SeleccionarCategoriaEquipo(this);' >";
        html+=htmCategoria;
        html+="</select>";
        return html;
    };

    var ConstruirMarca = function (pos) {
        var html = "<select class='form-control input-sm selectpicker' name='cboMarcaEquipo_"+pos+"' id='cboMarcaEquipo_"+pos+"' data-live-search='true' data-pos='"+pos+"' onchange='Pedido.SeleccionarMarcaEquipo(event);' >";
        html+=htmMarca;
        html+="</select>";
        return html;
    };

    var SeleccionarTipoServicio = function (a) {
        var pos = $(a).attr("data-pos");
        LisIdPro[pos] = $(a).val();
        var btn = $("#cboCategoriaEquipo_"+pos).parents("div.btn-group").find("button");
        $(btn).trigger("click");
        return false;
    };

    var SeleccionarCategoriaEquipo = function (a) {
        var pos = $(a).attr("data-pos");
        LisCategoria[pos] = $(a).val();
        var btn = $("#cboMarcaEquipo_"+pos).parents("div.btn-group").find("button");
        $(btn).trigger("click");
    };

    var SeleccionarMarcaEquipo = function (e) {
        //e.stopPropagation();
        //e.cancelBubble = true;
        var elem = e.target;
        var pos = $(elem).attr("data-pos");
        LisMarca[pos] = $(elem).val();
        $("#txt_modelo_"+pos).focus();
    };

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_servicio_tecnico",data:function(d){d.fecini = $("#busfecini").val();
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
                    d.tipo = $("#cboBuscarCliente").val();d.desc = $("#txtDescCliente").val();}},
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
                            jQuery.each( filas, function( i, val ) {$(filas[i]).css("background-color","#FFFFFF");});
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
                            jQuery.each( filas, function( i, val ) {$(filas[i]).css("background-color","#FFFFFF");});
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
        $('#div-fecregped').datepicker('update',fecAct);
        fila = -1;
        acc = "";
        iddet = 0;
        pre3 = 0;
        LisIdPro = new Array();
        LisCategoria = new Array();
        LisMarca = new Array();
        LisModelo = new Array();
        LisSerie = new Array();
        LisFalla = new Array();
        LisUndVenta = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisPre3 = new Array();
        LisDesc = new Array();
        LisCodigo = new Array();
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
                    //$("#txtven").val(respJson.nombres);
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
        $("#txtPreven").removeAttr("readonly");
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var addProducto = function(a){
        var fil = $(a).parents("tr");
        var col3Name = $.trim($(fil).find("td").eq(3).html());
        var col1Cod = $.trim($(fil).find("td").eq(1).html());

        var desc = $(a).attr("data-desc");
        descuento = desc === null ? 0 : desc;
        if(aplicaDesc === "1"){
            descuento = parseInt($("#txtPorcDesGlobal").val())/100;
        }
        opegratuita = "0";
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val(col3Name);
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
            $("#codetpro,#namepro,#txtCanti,#txtPreven").val("");
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
            $("#txtCanti").val(LisCant[pos]);
            $("#namepro").attr("data_um",LisUndVenta[pos]);
            $("#txtPreven").val(Redondear2(LisPreCom[pos]));
            LisIdPro.splice(pos,1);
            LisUndVenta.splice(pos,1);
            LisDesc.splice(pos,1);
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
            uploadMsnSmall("No ha seleccionado cliente.","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboTecnico").val() === "" || $("#cboTecnico").val() === "0" ){
            uploadMsnSmall("No ha seleccionado un tecnico.","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiSuPedido").val() === "" || $("#cboLiSuPedido").val() === "0" ){
            uploadMsnSmall("Sucursal incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length < 8){
            uploadMsnSmall("Numero de pedido incorrecto","ALERTA");
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

        for (var i = 0; i < LisIdPro.length; i++) {
            var idpro = parseFloat(LisIdPro[i]);
            var idcat = parseInt(LisCategoria[i]);
            var idmar = parseInt(LisMarca[i]);
            var cant = parseFloat(LisCant[i]);
            var prec = parseFloat(LisSubTotal[i]);
            if(idpro <= 0){
                uploadMsnSmall("Producto incorrecto en el item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(idcat <= 0){
                uploadMsnSmall("Categoria de equipo incorrecta en el item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(idmar <= 0){
                uploadMsnSmall("Marca de equipo incorrecta en el item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(cant <= 0){
                uploadMsnSmall("Cantidad incorrecta en el item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(prec <= 0){
                uploadMsnSmall("Precio venta incorrecto en el item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                $("#totalserv_"+i).focus();
                return false;
                break;
            }
        }
        return true;
    };

    var save = function(){
        cargando.start();
        var url = Accion === "R"?"save_servicio_tecnico":"update_servicio_tecnico";
        var accion = Accion === "R"?"save":"update";
        var hora = moment().format('HH:mm:ss');
        console.log(url);
        console.log(accion);
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idcli:$("#idcli").val(),idsuc:$("#cboLiSuPedido").val(),fec:$("#fecregped").val(),forpag:$("#tippago").val(),
                txtnum:$("#txtnum").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,"pcategorias[]":LisCategoria,
                "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,hora:hora,condpago:$("#condpago").val(),
                opegra:"0",mot:$("#txtMotivoGrat").val(),"opegrat[]":LisOpeGratuita,"descGlobal":$("#txtPorcDesGlobal").val(),
                "pmarcas[]" : LisMarca,"pmodelos[]" : LisModelo,"pseries[]" : LisSerie,"pfallas[]" : LisFalla,"ptecnico": $("#cboTecnico").val()},
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
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Tipo de pago incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Usuario incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Operacion incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Ingreso motivo de venta gratuita.","ALERTA");$("#txtMotivoGrat").focus();}
                                if(respJson.listado[i] === "E7"){uploadMsnSmall("Tecnico incorrecto.","ALERTA");}
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
            tot+=parseFloat(LisPreCom[i]*LisCant[i]);
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
            success:function(respJson){ console.log(respJson);
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
                    $("#cboTecnico").selectpicker('val',respJson.tecnico.id);
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
                        LisCategoria.push(deta.categoriaEquipo.id);
                        LisMarca.push(deta.marcaEquipo.id);
                        LisModelo.push(deta.modeloEquipo!==null ? deta.modeloEquipo : "");
                        LisSerie.push(deta.serieEquipo!==null?deta.serieEquipo:"");
                        LisFalla.push(deta.fallaEquipo!==null?deta.fallaEquipo:"");
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
                    ConstruirTablaServicio(-1);
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
        $("#saltipo").selectpicker('val','0');
        $("#totaldescuento").val(totaldes);
        $("#totalventa").val(Redondear2(totalventa));
        $( nomtippago === "EFECTIVO"?"#totalefectivo":(nomtippago==="DEPOSITO" ? "#totaldeposito":"#totaltarjeta")).val(Redondear2(totalventa));
        $("#visa2").prop("checked",true);
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
            data : {"tipo":"S",idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,totefe:$("#totalefectivo").val(),
                tottar:$("#totaltarjeta").val(),totventa : $("#totalventa").val(), codven : $("#codVendedor").val(),tiptar:$("input[name=creditcard]:checked").val(),
                totdep:$("#totaldeposito").val(),recibido:$("#txtRecibido").val(),vuelto:$("#txtVuelto").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        $("#facturar").modal("hide");
                        table._fnDraw();
                        tableProducto._fnDraw();
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
        // var btnViewDeta =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        // btnViewDeta.start();
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    esimprimible = "1";
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
                    var html = "";
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++){
                        var deta = respJson.tbDetalleventas[i];
                        var descart = (deta.otbProducto.nombreGeneralProducto);

                        descart+=(deta.categoriaEquipo!==null?deta.categoriaEquipo.nombre+" ":"");
                        descart+=(deta.marcaEquipo!==null?deta.marcaEquipo.nombre+" ":"");
                        descart+=(deta.modeloEquipo!==null?deta.modeloEquipo+" ":"");
                        html+="<tr>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+$.trim(descart)+"</td>";
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
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
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
                    $.ajax({
                        type: 'get',
                        url: 'http://127.0.0.1:8000/print=1',
                        data: {"idped":idpedido,"tipo":"3"},
                        //dataType: 'json',
                        success: function (data) {
                            var rpta = data.respuesta;
                            if(rpta === "OK"){
                                UploadMsnSmallLeft("Documento enviado a imprimir","OK");
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

    var ConstruirTablaServicio = function(indice){
        $("#tblDetalles").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblDetalles").append("<tr>"+
                "<td class='text-left'>"+(i+1)+"</td>"+
                "<td class='text-right cell-padding-2'>"+ConstruirTipoServicio(i)+"</td>"+
                "<td class='text-left cell-padding-2'> "+ConstruirCategoria(i)+"</td>"+
                "<td class='text-right cell-padding-2'>"+ConstruirMarca(i)+"</td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_modelo_"+i+"' id='txt_modelo_"+i+"' value='"+LisModelo[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_serie_"+i+"' id='txt_serie_"+i+"' value='"+LisSerie[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_falla_"+i+"' id='txt_falla_"+i+"' value='"+LisFalla[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='totalserv_"+i+"' id='totalserv_"+i+"' value='"+LisSubTotal[i]+"' /></td>"+
                "<td class='text-center' style='padding:2px!important;'>"+
                "<button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItemServicio(this);});
        }
        for (var j = 0; j < LisIdPro.length; j++) {
            $("#cboTipoServicio_"+j).selectpicker("refresh");
            $("#cboTipoServicio_"+j).selectpicker("val",LisIdPro[j]);
            $("#cboCategoriaEquipo_"+j).selectpicker("refresh");
            $("#cboCategoriaEquipo_"+j).selectpicker("val",LisCategoria[j]);
            $("#cboMarcaEquipo_"+j).selectpicker("refresh");
            $("#cboMarcaEquipo_"+j).selectpicker("val",LisMarca[j]);
            $("#txt_modelo_"+j).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                if(e.keyCode === 13){
                    if($(this).val() !==""){
                        $("#txt_serie_"+pos).focus();
                    }
                }else {
                    LisModelo[pos] = $(this).val();
                }
            });
            $("#txt_serie_"+j).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                if(e.keyCode === 13){
                    $("#txt_falla_"+pos).focus();
                } else {
                    LisSerie[pos] = $(this).val();
                }
            });
            $("#txt_falla_"+j).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                if(e.keyCode === 13){
                    $("#totalserv_"+pos).focus();
                } else {
                    LisFalla[pos] = $(this).val();
                }
            });
            NumeroDosDecimales($("#totalserv_"+j));
            $("#totalserv_"+j).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                LisPreCom[pos] = $(this).val();
                LisSubTotal[pos] = $(this).val();
                cargarTotal();
            });
        }
        if(indice > -1){
            var btn = $("#cboTipoServicio_"+indice).parents("div.btn-group").find("button");
            $(btn).trigger("click");
        }
        cargarTotal();
    };

    var quitarItemServicio = function(a){
        var pos = $(a).attr("data-pos");
        if(Accion === "M" && LisAcciones[pos]!=="N"){
            LisEliminados.push(LisIdmod[pos]);
        }
        LisIdPro.splice(pos,1);
        LisCategoria.slice(pos,1);
        LisMarca.slice(pos,1);
        LisModelo.slice(pos,1);
        LisSerie.slice(pos,1);
        LisFalla.slice(pos,1);
        LisUndVenta.splice(pos,1);
        LisDesc.splice(pos,1);
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
        LisOpeGratuita.splice(pos,1);
        ConstruirTablaServicio(-1);
    };

    var AgregarEquipo = function () {
        LisIdPro.push("0");
        LisCategoria.push("0");
        LisMarca.push("0");
        LisModelo.push("");
        LisSerie.push("");
        LisFalla.push("");
        LisUndVenta.push("");
        LisDesc.push("");
        LisCodigo.push("");
        LisCant.push("1");
        LisPreCom.push("0");
        LisPre3.push(pre3);
        LisOpeGratuita.push(opegratuita);
        LisPorcDescuento.push("0");
        LisDescuento.push("0");
        LisSubTotal.push("0");
        if( Accion === "M" ){
            if ( acc !== "" ){
                LisIdmod.push(iddet);
                iddet = 0;
                if( acc === "P" ){
                    LisAcciones.push("U");
                    acc = "";
                } else {
                    LisAcciones.push(acc);
                    acc = "";
                }
            } else {
                LisIdmod.push(0);
                LisAcciones.push("N");
            }
        }else if(Accion === "R"){
            LisIdmod.push(0);
            LisAcciones.push("N");
        }
        //fila = -1;
        ConstruirTablaServicio(LisIdPro.length-1);
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
        $("#visa2,#mastercard2").on("click",function () {
            $("#totalefectivo").val("0.00");
            $("#totaltarjeta").val($("#totalventa").val());
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
        $.ajax({
            type: 'post',
            url: "mant_servicio_tecnico",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    tipImp = data.tipoImp;
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboTecnico").html("<option value='0'>--SELECCIONE--</option>"+data.htU);
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
                    var liTS = data.tiposervicios;
                    var liC = data.categoriasequipo;
                    var liM = data.marcasequipo;
                    for(var x=0;x<liTS.length;x++){
                        htmTipoServicio+="<option value='"+liTS[x].id+"'>"+liTS[x].nombre+"</option>";
                    }
                    for(var y=0;y<liC.length;y++){
                        htmCategoria+="<option value='"+liC[y].id+"'>"+liC[y].nombre+"</option>";
                    }
                    for(var z=0;z<liM.length;z++){
                        htmMarca+="<option value='"+liM[z].id+"'>"+liM[z].nombre+"</option>";
                    }
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
                /*if( $('#newSale').hasClass('in') && !$('#modalSearchProducto').hasClass('in') && !$('#modalSearchCliente').hasClass('in')){
                    $("#btnOpenModalProducto").trigger("click");
                    return false;
                }*/
                if( $('#newSale').hasClass('in') && !$('#modalSearchCliente').hasClass('in')){
                    AgregarEquipo();
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
        NumeroEntero($("#txtPorcDesGlobal"),3,0,99);
        $("#txtPorcDesGlobal").on("blur",function (e) {
            if($("#txtPorcDesGlobal").val() === ""){
                $("#txtPorcDesGlobal").val("0");
            }
            var despor = parseFloat($("#txtPorcDesGlobal").val());
            var desmonto = despor/100;
            for(var i=0;i<LisPorcDescuento.length;i++){
                LisPorcDescuento[i] = Redondear2(despor);
                LisDescuento[i] = Redondear2( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*desmonto );
                LisSubTotal[i] = Redondear2Decimales( (parseFloat(LisCant[i])*parseFloat(LisPreCom[i]))*( 1-desmonto));
            }
            CargarTabla();
        });
        $("#btnAddEquipo").on("click",function () {
            AgregarEquipo();
            return false;
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
        SeleccionarTipoServicio:function(a){
            SeleccionarTipoServicio(a);
        },
        SeleccionarCategoriaEquipo:function (a) {
            SeleccionarCategoriaEquipo(a);
        },
        SeleccionarMarcaEquipo:function (a) {
            SeleccionarMarcaEquipo(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});