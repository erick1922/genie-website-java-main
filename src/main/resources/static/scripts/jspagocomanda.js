var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var entrega = Ladda.create(document.querySelector('#btnGenDocEnt'));
    var cliente = Ladda.create(document.querySelector('#btnGuardarCliente'));
    var consumo = Ladda.create(document.querySelector('#btnVerConsumo'));
    var btnVerDetalle = Ladda.create(document.querySelector('#btnVerDetalle'));
    var btnGenerarMov = Ladda.create(document.querySelector('#btnGenerarMov'));
    var table;
    var tableCliente;
    var tableProducto;
    var stockSel = 0;

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
    var fecCons = "";
    var pre3 = 0;
    var totalventa = 0;
    var descuento = 0;
    var opegratuita = "0";

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pedidos_restaurant",data:function(d){d.fecini = $("#busfecini").val();
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
            "ajax" : {type:'POST',url:"list_clientes_search",data:function(d){d.tipo="D";d.desc = $("#txtDescCliente").val();}},
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
            }
        });
        /*$('#tblProducto tbody').on('click', 'tr', function () {
         $(this).css("background-color",$(this).css("background-color") === "rgb(176, 190, 217)"?"#FFFFFF":"#B0BED9");
         });*/
        $("#tblProducto tbody").on("dblclick", "tr", function() {
            // $(this).css("background-color",$(this).css("background-color") === "rgb(176, 190, 217)"?"#FFFFFF":"#B0BED9");
            //$(this).css("background-color","#B0BED9");
            $("#"+$($(this).find("td").eq(8).html()).attr("id")).trigger("click");
            // var iPos = tableProducto.fnGetPosition( this );
            // var aData = tableProducto.fnGetData( iPos );
            // var iId = aData[1];
            // $('#edit'+iId).click(); //clicks a button on the first cell
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
        $("#txtsuc").val(opt);
        ids = $("#cboLiSuPedido").val();
        descuento = 0;
        ObtenerNum();
        $("#chkOpeGra").prop("checked",false);
        $("#chkOpeGra").val("0");
        $("#chkOpeGra").iCheck('update');
        $("#div-motivo").css("display","none");
        $("#tippago").selectpicker('val',1);
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var addProducto = function(a){
        var fil = $(a).parents("tr");
        var col3Name = $.trim($(fil).find("td").eq(3).html());
        var col1Cod = $.trim($(fil).find("td").eq(1).html());

        var desc = $(a).attr("data-desc");
        descuento = desc === null ? 0 : desc;
        opegratuita = "0";
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val(col3Name);
        $("#codetpro").val(col1Cod);
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
        $("#txtPreven").focus();
        $("#modalSearchProducto").modal("hide");
    };

    var AddItem = function(){
        agregar.start();
        if(validarItem()){
            LisIdPro.push($("#iddetpro").val());
            LisDesc.push($("#namepro").val());
            LisCodigo.push($("#codetpro").val());
            LisCant.push($("#txtCanti").val());
            LisPreCom.push($("#txtPreven").val());
            LisPre3.push(pre3);
            LisOpeGratuita.push(opegratuita);
            LisPorcDescuento.push(Redondear2(descuento*100));
            LisDescuento.push( Redondear2( (parseFloat($("#txtCanti").val())*parseFloat($("#txtPreven").val()))*descuento ));
            LisSubTotal.push(Redondear2( (parseFloat($("#txtCanti").val())*parseFloat($("#txtPreven").val()))*( 1-descuento) ));
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
        if(parseFloat($("#txtPreven").val())<pre3){
            uploadMsnSmall("El precio de venta minimo es "+pre3,"ALERTA");
            agregar.stop();
            return false;
        }
        return true;
    };

    var SelCli = function(id,name){
        $("#idselcliente").val(id);
        $("#namecli").val(name);
        $("#modalSearchCliente").modal("hide");
        $("#div-btn-cliente").show();
    };

    var CargarTabla = function(){
        $("#tblDetalles").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblDetalles").append("<tr>"+
                "<td class='text-center'>"+LisCodigo[i]+"</td>"+
                "<td class='text-left'>"+LisDesc[i]+"</td>"+
                "<td class='text-right'>"+LisCant[i]+"</td>"+
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
            $("#txtPreven").val(Redondear2(LisPreCom[pos]));
            LisIdPro.splice(pos,1);
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
                txtnum:$("#txtnum").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,
                "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,hora:hora,condpago:$("#condpago").val(),
                opegra:$("#chkOpeGra").val(),mot:$("#txtMotivoGrat").val(),"opegrat[]":LisOpeGratuita},
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
                        $(a).attr("data-total", Redondear2(parseFloat(data[2])));
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
            ///if(LisOpeGratuita[i] === "0") {
            tot += parseFloat(LisPreCom[i]*LisCant[i]);
            destot += parseFloat(LisDescuento[i]);
            imptot += parseFloat(LisSubTotal[i]);
            // }
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
                        var deta = respJson.tbDetalleventas[i];//console.log(deta);
                        LisIdPro.push(deta.otbProducto.id);
                        LisCodigo.push(deta.otbProducto.codigo);
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
        $("#idselcliente").val($(a).attr("data-id-cli"));
        $("#namecli").val($(a).attr("data-cli"));
        $("#btnDelCliente").show();
        $("#saltipo").selectpicker('val','0');
        $("#totaldescuento").val(totaldes);
        $("#totalventa").val(Redondear2(totalventa));
        $( nomtippago === "EFECTIVO"?"#totalefectivo":(nomtippago==="DEPOSITO" ? "#totaldeposito":"#totaltarjeta")).val(Redondear2(totalventa));
        $("#visa2").prop("checked",true);
        $("#facturar").modal("show");
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
            url: "gen_doc_comanda",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,totefe:$("#totalefectivo").val(),
                tottar:$("#totaltarjeta").val(),totventa : $("#totalventa").val(),tiptar:$("input[name=creditcard]:checked").val(),
                totdep:$("#totaldeposito").val(),idcli:$("#idselcliente").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        $.ajax({
                            type: 'get',
                            url: 'http://127.0.0.1:8000/print=1',
                            data: {"idpedido":id,"tipo":"2" },
                            success: function (data) {
                                var rpta = data.respuesta;
                                if(rpta === "OK"){
                                    $("#facturar").modal("hide");
                                    table._fnDraw();
                                    tableProducto._fnDraw();
                                    uploadMsnSmall(data.msj,'OK');
                                    pago.stop();
                                }else{
                                    uploadMsnSmall("Problemas al comunicar con la impresora","ERROR");
                                    //Repositorio.finishRefresh($('div.blockMe'));
                                    pago.stop();
                                }
                            },
                            error: function (jqXHR, status, error) {
                                //Repositorio.finishRefresh($('div.blockMe'));
                                pago.stop();
                                uploadMsnSmall(jqXHR.responseText, 'ERROR');
                            }
                        });
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
                                if(data.listado[i] === "E8"){uploadMsnSmall("Seleccionar un cliente.",'ALERTA');}
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
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    id = respJson.id;
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#vercli").val(respJson.otbCliente.nombre);
                    $("#vernum").val(respJson.numPedido);
                    $("#versuc").val(respJson.otbSucursal.nombre);
                    $("#vertipopag").val( respJson.otbFormaPago.nombre );
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
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
                        $("#modalCliente").modal("hide");
                        tableCliente._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
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

    var imprimir_ticket = function(){
        var method = "downloadTicket";
        var parameters = "idped="+id;
        var url = method + "?" + parameters;
        window.open(url,'_blank').print();
    };

    var addPrductBarcode = function(elem){
        var hora = moment().format('HH:mm:ss');
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
                        for (var i = 0; i < LisIdPro.length; i++) {
                            if(idpro === parseFloat(LisIdPro[i]) ){
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

    var VerDetalleProductos = function (a) {
        var loaddetalle = Ladda.create(document.querySelector("#"+$(a).attr("id")));
        loaddetalle.start();
        $.ajax({
            type: 'post',
            url: "listar_productoxinsumo",
            data:{"ids":ids,"fecha":fecCons,"idinsumo" : $(a).attr("data-id-insumo")},
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    var lista = data.lista;
                    var html = "";
                    /*for(var i=0;i<lista.length;i++){
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td>"+lista[i][1]+"</td>";
                        html+="<td>"+lista[i][2]+"</td>";
                        html+="<td>"+lista[i][5]+"</td>";
                        html+="<td>"+lista[i][4]+"</td>";
                        html+="<td>"+"PENDIENTE"+"</td>";
                        html += "<td class='text-center'><button type='button' name='btn_view_pro_" + i + "' id='btn_view_pro_" + i + "' data-pos='"+i+"' data-despacho='"+lista[i][0]+"' data-toggle='tooltip' data-placement='right'  title='' onclick='Pedido.VerDetalleProductos(this);' style='margin:0px 3px 0px 0px!important; padding:1px 4px 1px 4px !important;' data-style='zoom-in' data-spinner-size='30' class='btn btn-sm btn-primary ladda-button detalle' data-original-title='Ver Detalle'> <span class='ladda-label'> <i class='glyphicon glyphicon-list'></i> </span> </button> </td>";
                        html+="</tr>";
                    }*/
                  //  $("#bodyDetMov").html(html);
                    loaddetalle.stop();
                }else{
                    loaddetalle.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                loaddetalle.stop();
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregped,#fecnac,#fecconsumo").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecregped"),"dd-mm-yyyy");
        FormatoFecha($("#data_fecconsumo"),"dd-mm-yyyy");
        NumeroDosDecimalesxDefectoUno($("#txtCanti"));
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
        $("#div-btn-cliente").hide();
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
        $("#btnOpenModalProducto").on("click",function(){
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreven").val("");
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearchModalCliente").on("click",function(){tableCliente._fnDraw();});
        $("#txtDescCliente").on("keyup",function(e){tableCliente._fnDraw();});
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){tableProducto._fnDraw();});
        $("#saltipo").on("change",function(){LoadSerie(ids);});
        $("#saltipoent").on("change",function(){LoadSerieAlm(ids);});
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#btnGenDocEnt").on("click",function(){GenDocEntrega();});
        $("#btnNewCliente").on("click",NuevoCliente);
        $("#btnGuardarCliente").on("click",saveCliente);
        $("#cboLiSucursal,#cboLiUsuario,#cboLiEstado").on("change",function(){ table._fnDraw(); });
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
        $("#txtRecibido").on("keyup",function(){
            var venTot = parseFloat($("#totalventa").val());
            var efec = parseFloat($("#totalefectivo").val());
            var tarj = parseFloat($("#totaltarjeta").val());
            var recibo = parseFloat($("#txtRecibido").val());
            var vuelto = recibo - efec;
            $("#txtVuelto").val(Redondear2(vuelto));
        });
        $("#btnDelCliente").on("click",function () {
            $("#idselcliente").val("0");
            $("#namecli").val("");
            $("#div-btn-cliente").hide();
        });
        $("#btnTicket").on("click",imprimir_ticket);
        $.ajax({
            type: 'post',
            url: "mant_pago_comanda",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
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
        $(document).keydown(function(event){
            if(event.which == 112){ //F1
                if(!cargando.isLoading()){
                    new_record();
                    return false;
                }
            }
            if(event.which == 114){ //F3
                if( $('#newSale').hasClass('in')){
                    if(!cargando.isLoading()){
                        $("#btnGuardar").trigger("click");
                        return false;
                    }
                }
            }
            if(event.which == 13){ //ENTER
                if( $('#facturar').hasClass('in')){
                    if(!pago.isLoading()){
                        $("#btnGenDocPag").trigger("click");
                        return false;
                    }
                }
            }
        });
        $("#txtDescProducto").keydown(function(event){
            /*if(event.which == 38){
             var pos = parseInt($(this).attr("data-pos"))-1;
             if(pos >=0){ $("#usu_"+listUsu[pos]).focus();}
             return false;
             }*/
            if(event.which == 40){
                var filas = $('#tblProducto > tbody > tr').length;
                console.log(filas);

                for(var i=0;i<filas;i++){
                    var fil = i+1;
                    if( $("#add_prod_"+fil).length > 0 ){
                        $("#add_prod_"+fil).focus();
                        return false;
                    }
                    console.log(i);
                }

                //  uploadMsnSmall("BAJAR AL SIGUIENTE","ALERTA");
                //var pos = parseInt($(this).attr("data-pos"))+1;
                // if(pos <listUsu.length){ $("#usu_"+listUsu[pos]).focus();}
                return false;
            }
        });
        $("#btnVerConsumo").on("click",function () {
           // Limpiar();
           // $("#tblDetalles").html("");
           // $("#titulo").html("Registrar Pedido");
            var opt = $('option:selected',$("#cboLiSuPedido")).text();
            $("#txtsucConsumo").val(opt);
            ids = $("#cboLiSuPedido").val();
            fecCons = $("#fecconsumo").val();
            $("#modalConsumo").modal("show");
            $("#btnVerDetalle").trigger("click");
        });
        $("#data_fecconsumo").on("changeDate",function (){
            if(moment($("#fecconsumo").val(),"DD-MM-YYYY", true).isValid()){
                fecCons = $("#fecconsumo").val();
            }
        });
        $("#btnGenerarMov").on("click",function () {
            btnGenerarMov.start();
            $.ajax({
                type: 'post',
                url: "generar_movimiento_insumo",
                data:{"ids":ids,"fecha":fecCons},
                dataType: 'json',
                success: function (data) { console.log(data);
                    if (data !== null) {
                        var dato = data.dato;
                        if(dato === "OK"){
                            uploadMsnSmall("Movimiento generado correctamente.","OK");
                            $("#btnVerDetalle").trigger("click");
                        }else{
                            uploadMsnSmall(data.msj,"ALERTA");
                        }
                        btnGenerarMov.stop();
                    }else{
                        btnGenerarMov.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    btnGenerarMov.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
        });
        $("#btnVerDetalle").on("click",function () {
            btnVerDetalle.start();console.log(fecCons);console.log(ids);
            $.ajax({
                type: 'post',
                url: "listar_insumos_consumidos",
                data:{"ids":ids,"fecha":fecCons},
                dataType: 'json',
                success: function (data) { console.log(data);
                    if (data !== null) {
                        var lista = data.lista;
                        var html = "";
                        for(var i=0;i<lista.length;i++){
                            html+="<tr>";
                            html+="<td>"+(i+1)+"</td>";
                            html+="<td>"+lista[i][1]+"</td>";
                            html+="<td>"+lista[i][2]+"</td>";
                            html+="<td>"+lista[i][5]+"</td>";
                            html+="<td>"+lista[i][4]+"</td>";
                            html+="<td>"+( lista[i][6] === "P" ? "PENDIENTE" : "GENERADO" )+"</td>";
                            html += "<td class='text-center'><button type='button' name='btn_view_pro_" + i + "' id='btn_view_pro_" + i + "' data-pos='"+i+"' data-id-insumo='"+lista[i][0]+"' data-toggle='tooltip' data-placement='right'  title='' onclick='Pedido.VerDetalleProductos(this);' style='margin:0px 3px 0px 0px!important; padding:1px 4px 1px 4px !important;' data-style='zoom-in' data-spinner-size='30' class='btn btn-sm btn-primary ladda-button detalle' data-original-title='Ver Detalle'> <span class='ladda-label'> <i class='glyphicon glyphicon-list'></i> </span> </button> </td>";
                            html+="</tr>";
                        }
                        $("#bodyDetMov").html(html);
                        btnVerDetalle.stop();
                    }else{
                        btnVerDetalle.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    btnVerDetalle.stop();
                    uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
                }
            });
        });
        $("#modalConsumo").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalConsumo:visible").each(ModalCompleto);
        });
        /*$(".porcelCuota").keydown(function(event){
         if(event.which == 38){
         var pos = parseInt($(this).attr("data-pos"))-1;
         if(pos >=0){ $("#usu_"+listUsu[pos]).focus();}
         return false;
         }
         if(event.which == 40){
         var pos = parseInt($(this).attr("data-pos"))+1;
         if(pos <listUsu.length){ $("#usu_"+listUsu[pos]).focus();}
         return false;
         }
         });*/

        /*$(window).keyup(function (evt) {
         if (evt.keyCode == 38) { // up
         console.log("subir");
         $('#tblProducto tbody tr:not(:first).selected').removeClass('selected').prev().addClass('selected')
         }
         if (evt.keyCode == 40) { // down
         console.log("abajo");
         $('#tblProducto tbody tr:not(:last).selected').removeClass('selected').next().addClass('selected')
         }
         });*/
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
        SelCli:function(a,b){
            SelCli(a,b);
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
        VerDetalleProductos:function (a) {
            VerDetalleProductos(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});