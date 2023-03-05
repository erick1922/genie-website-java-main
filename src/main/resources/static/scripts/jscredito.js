var Pedido = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var pago = Ladda.create(document.querySelector('#btnGenDocPag'));
    var abonar = Ladda.create(document.querySelector('#btnGenDocPag2'));
    var entrega = Ladda.create(document.querySelector('#btnGenDocEnt'));
    var cliente = Ladda.create(document.querySelector('#btnGuardarCliente'));
    var genticket = Ladda.create(document.querySelector('#btnTicket'));
    var validar = Ladda.create(document.querySelector('#btnValidarDNI'));
    var modalProducto = "";
    var table;
    var tableCobranzas;
    var tableCliente;
    var tableProducto;
    var stockSel = 0;
    var tipImp = "";

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
    var fila;
    var acc = "";
    var iddet;
    var id;
    var ids;
    var pre3 = 0;
    var totalventa = 0;
    var descuento = 0;

    var idBtnCambio = "";
    var filaCambio = "";
    var iddetalleCambio = 0;
    var codProdCambio = "";
    var idViewDetails = "0";

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_creditos",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.cli = $("#txtCliente").val();
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
                url:"list_pedido_cobranza",
                data:function(d){
                    d.fecini = $("#busfecini").val();
                    d.fecfin = $("#busfecfin").val();
                    d.idsuc = $("#cboLiSucursal2").val();
                    d.idusu = $("#cboLiUsuario2").val();
                    d.est = $("#cboLiEstado").val();
                    d.cli = $("#txtCliente2").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-center",'aTargets': [4]},
                {'sClass':"text-right",'aTargets': [5,6,7]},
                {'sClass':"centrador",'aTargets': [9]},
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
        tableProducto = $("#tblProducto").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_pro_venta_credito",data:function(d){
                d.idsuc = ids;
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
        modalProducto = "1";
        $("#tippago").selectpicker('val',1);
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var addProducto = function(a){
        if(modalProducto === "1"){
            var fil = $(a).parents("tr");
            var col3Name = $.trim($(fil).find("td").eq(3).html());
            var col1Cod = $.trim($(fil).find("td").eq(1).html());

            var desc = $(a).attr("data-desc");
            descuento = desc === null ? 0 : desc;
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
        } else {
            var fil = $("#"+idBtnCambio).parents("tr");
            var codSel = $.trim($(a).attr("data-codigo"));
            var idproSel = $(a).attr("data-id");
            codProdCambio = $(fil).find("td").eq(0).html();
            if(codProdCambio !== codSel){
                iddetalleCambio = $("#"+idBtnCambio).attr("data-id");
                filaCambio = $(fil).html();

                var preUni = parseFloat($(a).attr("data-pre"));
                var cant = parseInt($(fil).find("td").eq(2).html());
                var total = preUni*cant;
                var porcDesc = parseFloat(($(fil).find("td").eq(4).html()).replace("%",''))/100;
                var desc = total*porcDesc;

                $(fil).find("td").eq(0).html($(a).attr("data-codigo"));
                $(fil).find("td").eq(1).html($(a).attr("data-name"));
                $(fil).find("td").eq(3).html(Redondear2(preUni));
                $(fil).find("td").eq(2).html("<input type='text' class='form-control input-sm' name='txt_cant_det_"+iddetalleCambio+"' id='txt_cant_det_"+iddetalleCambio+"' data-prod='"+idproSel+"' value='"+cant+"' />");
                $($(fil).find("td").eq(2)).addClass("celda-cantidad");

                $(fil).find("td").eq(5).html(Redondear2(desc));
                $(fil).find("td").eq(6).html(Redondear2(total - desc));
                var htBtn="<button type=\"button\" id='guardar_cambio_"+iddetalleCambio+"'  data-id='"+iddetalleCambio+"' data-ped='"+id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-primary reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Confirmar cambio</div>' onclick=\"Pedido.guardar_cambio(this);\" > <span class='ladda-label'> <i class='fa fa-check fa-2' style='font-size:20px!important;'></i> </span> </button>";
                htBtn+="<button type='button' id='cancel_cambio_"+iddetalleCambio+"' data-id='"+iddetalleCambio+"' data-ped='"+id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-danger reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Cancelar cambio</div>' onclick=\"Pedido.cancelar_cambio(this);\" > <span class='ladda-label'> <i class='fa fa-window-close-o fa-2' style='font-size:20px!important;'></i> </span> </button>";

                $(fil).find("td").eq(7).html(htBtn);
                $("#modalSearchProducto").modal("hide");
                $(".reserva").tooltip();
                NumeroEnteroxDefectoUno($("#txt_cant_det_"+iddetalleCambio));
                $("#txt_cant_det_"+iddetalleCambio).on("keyup",function (e) {
                    var val = parseInt(($(this).val()!=="" ? $(this).val() : "0"));
                    var tot = val*preUni;
                    var desc = tot*porcDesc;
                    $(fil).find("td").eq(5).html(Redondear2(desc));
                    $(fil).find("td").eq(6).html(Redondear2(tot-desc));
                });
                $("#txt_cant_det_"+iddetalleCambio).focus();
            }else {
                uploadMsnSmall('El producto debe de ser diferente.',"ALERTA");
            }
        }
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
        if(parseFloat($("#txtPreven").val())<pre3){
            uploadMsnSmall("El precio de venta minimo es "+pre3,"ALERTA");
            agregar.stop();
            return false;
        }
        return true;
    };

    var SelCli = function(a){
        var fil = $(a).parents("tr");
        $("#idcli").val($(a).attr("data-id"));
        $("#txtcli").val($.trim($(fil).find("td").eq(1).html()));
        $("#modalSearchCliente").modal("hide");
        $("#newSale").modal("show")
        $("#txtBarcode").focus();
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
                "<td class='text-center' style='padding:3px!important;'><button type='button' class='btn btn-sm btn-success' id='fnupd_"+i+"' data-pos='"+i+"' style='margin-right:3px!important;padding:4px 10px!important;' title='Modificar'>"+
                "<i class='glyphicon glyphicon-edit'></i></button>"+
                "<button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItem(this);});
            $("#fnupd_"+i).on("click",function(){updateItem(this);});
        }
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
            LisPreCom.splice(pos,1);
            LisPre3.splice(pos,1);
            LisPorcDescuento.splice(pos,1);
            LisDescuento.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
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
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            CargarTabla();
            var idpro = parseFloat($("#iddetpro").val());
            var hora = moment().format('HH:mm:ss');
            var fecha = moment().format('DD-MM-YYYY');
            $.ajax({
                type: 'post',
                url: "view_stock_pro_credito",
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
            uploadMsnSmall("No ha Seleccionado cliente.","ALERTA");
            cargando.stop();
            return false;
        }else if($("#idcli").val() === "1"){
            uploadMsnSmall("Seleccione un cliente válido.","ALERTA");
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
                "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,hora:hora,condpago:$("#condpago").val(),opegra:"0",mot:""},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#newSale").modal("hide");
                        table._fnDraw();
                        tableProducto._fnDraw();
                        $("#cc").trigger("click");
                        uploadMsnSmall(respJson.msj,'OK');
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
        modalProducto = "1";
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
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $('#div-fecregped').datepicker('update',fecreg);
                    for (var i = 0; i < respJson.tbDetalleventas.length; i++) {
                        var deta = respJson.tbDetalleventas[i];
                        LisIdPro.push(deta.otbProducto.id);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisDesc.push(deta.otbProducto.nombreGeneralProducto);
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(Redondear2(deta.preUni+deta.descuentoItem));
                        LisPre3.push(deta.otbProducto.precioMayor3);
                        LisPorcDescuento.push(Redondear2(deta.porcDescuentoItem));
                        LisDescuento.push(Redondear2(deta.descuentoItem*deta.cantidad));
                        LisSubTotal.push(Redondear2(deta.preTotal));
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
        var tipoCob = $('option:selected', $("#condpago")).attr("data-tipocob");

        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        totalventa = $(a).attr("data-total");
        var totaldes = $(a).attr("data-desc");
        $("#frmFactura")[0].reset();
        $("#example2").prop("checked",false);
        $("#example2").val("0");
        $("#example2").change();
        $("#example3").prop("checked",false);
        $("#example3").val("0");
        if(tipoCob === "2"){
            $("#div-vencimiento").hide();
        } else {
            $("#div-vencimiento").show();
        }
        $("#chkEntrega").val(tipoCob === "2" ? "0" : "1");
        $("#chkEntrega").prop("checked",!(tipoCob === "2"));
        $('#chkEntrega').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkEntrega(event,$(this));
        });
        $("#saltipo").selectpicker('val','0');
        var tiposDocumentos = $("#saltipo option");
        var listaIdTipDocs = new Array();
        for(var i=0;i<tiposDocumentos.length;i++){
            if($(tiposDocumentos[i]).val() !== "0"){
                listaIdTipDocs.push($(tiposDocumentos[i]).val());
            }
        }
        if(listaIdTipDocs.length === 1){
            $("#saltipo").selectpicker('val',listaIdTipDocs[0]);
            $("#saltipo").change();
        }
        $("#totaldescuento").val(Redondear2(totaldes));
        $("#totalventa").val(Redondear2(totalventa));
        $('#div-fecent').datepicker('update',fecAct);
        $('#div-fecvenc').datepicker('update',fecAct);
        $("#facturar").modal("show");
    };

    var LoadSerieAbonar = function(sucu){
        $.ajax({
            type: 'POST',
            url: "view_seriexsuc",
            dataType: 'json',
            data : {idtip:$("#saltipo2").val(),idsuc:sucu},
            success: function(data){
                if(data!==null){
                    if($("#saltipo2").val() !== "0"){
                        $("#numdocu2").val(data.msj);
                    }else{
                        $("#numdocu2").val("");
                    }
                    $("#codVendedor2").focus();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var LoadSerie = function(sucu){
        Repositorio.refreshGrafic($("#divFacturar"));
        $.ajax({
            type: 'POST',
            url: "view_seriexsuc",
            dataType: 'json',
            data : {idtip:$("#saltipo").val(),idsuc:sucu},
            success: function(data){
                if(data!==null){
                    Repositorio.finishRefresh($("#divFacturar"));
                    if($("#saltipo").val() !== "0"){
                        $("#numdocu").val(data.msj);
                    }else{
                        $("#numdocu").val("");
                    }
                    $("#codVendedor").focus();
                }else{
                    Repositorio.finishRefresh($("#divFacturar"));
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Repositorio.finishRefresh($("#divFacturar"));
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var GenDoc = function(){///OFICIAL ESTE ES
        Repositorio.refreshGrafic($("#divFacturar"));
        pago.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "gen_doc_entrega",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo").val(),id:id,txtnum:$("#numdocu").val(),hora:hora,
                chkEntrega:$("#example3").val(), codven : $("#codVendedor").val(),fecent:$("#fecent").val(),
                fecvenc:$("#fecvenc").val(),abonoinicial:$("#abonoinicial").val(),formapagoAbono : $("#formaPago").val(),
            "chkAbono" : $("#example2").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        tableProducto._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#facturar").modal("hide");
                        pago.stop();
                        var tipoCob = $('option:selected', $("#condpago")).attr("data-tipocob");
                        if(tipoCob === "2"){
                            ImpresionTicket(id);
                        }
                        Repositorio.finishRefresh($("#divFacturar"));
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
                        pago.stop();
                        Repositorio.finishRefresh($("#divFacturar"));
                    }
                }else{
                    Repositorio.finishRefresh($("#divFacturar"));
                    pago.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                Repositorio.finishRefresh($("#divFacturar"));
                pago.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var confirm_entrega = function(a){
        var saldo = $(a).attr("data-sal");
        var tipoCob = $('option:selected', $("#condpago")).attr("data-tipocob");
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        $("#frmEntrega")[0].reset();
        $('#div-fecentPro').datepicker('update',fecAct);
        $('#div-fecvenc').datepicker('update',fecAct);
        $("#saltipoent").selectpicker('val','0');
        $("#txtSaldoDoc").val(saldo);
        if(tipoCob === "2"){
            $("#div-entrega-dos-pagos").show();
        } else {
            $("#div-entrega-dos-pagos").hide();
        }
        $("#entrega").modal("show");
        $("#codVendedorPro").focus();
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
        var horaAbono = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "gen_entrega",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipoent").val(),id:id,abonoFinal:$("#abonoFinal").val(),
                saldo: $("#txtSaldoDoc").val(),idFP:$("#formaPagoAbono").val(),fecent:$("#fecentPro").val(),
                codven:$("#codVendedorPro").val(),hora: horaAbono},
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
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione Entrega Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Fecha Entrega Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Codigo de Vendedor Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("Hora de abono incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("Abono final incorrecto.",'ALERTA');}
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
            message: "<strong>¿Esta seguro que desea eliminar el pedido?</strong>",
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

    var quitar_item_credito = function(a){
        var iddet = $(a).attr("data-id");
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea quitar el producto?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'POST',
                        url: "verificar_quitar_item_pedcredito",
                        dataType: 'json',
                        data : {id:iddet},
                        success: function(data){
                            if(data!==null){
                                console.log(data);
                                if(data.dato === "OK"){
                                    $("#"+idViewDetails).trigger("click");
                                } else if(data.dato === "ERROR"){
                                    uploadMsnSmall(data.msj,'ERROR');
                                }
                            }else{
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                }
            }
        });
    };

    var cambiar_item = function(a){
        $.ajax({
            type: 'POST',
            url: "validar_cambio_item",
            dataType: 'json',
            data : {id:$(a).attr("data-id")},
            success: function(data){
                if(data!==null){
                    if(data.dato === "OK"){
                        modalProducto = "2";
                        idBtnCambio = $(a).attr("id");
                        $("#modalSearchProducto").modal("show");
                    } else if(data.dato === "ERROR"){
                        uploadMsnSmall(data.msj,'ERROR');
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

    var viewDetails = function(a){
        idViewDetails = $(a).attr("id");
        $.ajax({
            type: 'post',
            url: "view_pedido",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    id = respJson.id;
                    ids = respJson.otbSucursal.id;
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
                        html+="<td class='text-center'>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.nombreGeneralProducto+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preUni + deta.descuentoItem)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.porcDescuentoItem)+"%</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.descuentoItem*deta.cantidad)+"</td>";
                        html+="<td class='text-right' >"+Redondear2(deta.preTotal)+"</td>";
                        if(respJson.estadoEntrega === "E"){
                            $("#columnDetalle").text("Estado");
                            html+="<td class='text-right'>ENTREGADO</td>";
                        } else {
                            if(respJson.estado === "P" || respJson.estado === "C"){
                                $("#columnDetalle").text("Estado");
                                html+="<td class='text-right'>PENDIENTE</td>";
                            } else {
                                $("#columnDetalle").text("Acciones");
                                if (deta.otbStockProducto === null){
                                    var cod10 = $("#cod_10").val();
                                    html+="<td class='text-center' style='padding-top:2px!important;padding-bottom:2px!important;'>";
                                    if(cod10 === "1"){
                                        html+="<button type=\"button\" id='reserva_item_"+deta.id+"' data-ped='"+id+"' data-id='"+deta.id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-success reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Reservar: " + deta.otbProducto.codigo + "</div>' onclick=\"Pedido.reservar_item(this);\" > <span class='ladda-label'> <i class='fa fa-linode fa-2' style='font-size:20px!important;'></i> </span> </button>";
                                    }
                                    html+="<button type='button' id='det_item_"+deta.id+"' data-id='"+deta.id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-warning reserva ladda-button btn-details-credito\" data-style='zoom-in' data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Cambiar producto: " + deta.otbProducto.codigo + "</div>' onclick=\"Pedido.cambiar_item(this);\" > <span class='ladda-label'> <i class='fa fa-repeat fa-2' style='font-size:20px!important;'></i> </span> </button>";
                                    html+="<button type='button' id='quitar_item_"+deta.id+"' data-id='"+deta.id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-danger reserva ladda-button btn-details-credito\" data-style='zoom-in' data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Quitar producto: " + deta.otbProducto.codigo + "</div>' onclick=\"Pedido.quitar_item_credito(this);\" > <span class='ladda-label'> <i class='fa fa-trash fa-2' style='font-size:20px!important;'></i> </span> </button></td>";
                                } else{
                                    html+="<td class='text-center' style='padding-top:2px!important;padding-bottom:2px!important;'>" + " <button type=\"button\" id='noreservar_item_"+deta.id+"' data-ped='"+id+"'  data-id='"+deta.id+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-danger reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title='<div style=\"width:180px!important;\">Quitar reserva: " + deta.otbProducto.codigo + "</div>' onclick=\"Pedido.quitar_reserva_item(this);\" > <span class='ladda-label'> <i class='fa fa-window-close-o fa-2' style='font-size:20px!important;'></i></span></button></td>";
                                }
                            }
                        }
                        html+="</tr>";
                    }

                    var htP = "";
                    for (var i = 0; i < respJson.tbLetraCobrars.length; i++){
                        var letra = respJson.tbLetraCobrars[i];
                        htP+="<tr>";
                        htP+="<td class='text-center'>"+(i+1)+"</td>";
                        htP+="<td class='text-center'>"+moment(letra.fechaPago).format('DD-MM-YYYY')+"</td>";
                        htP+="<td>"+letra.otbTipoDocumento.nombre+": "+letra.numSerie+"</td>";
                        htP+="<td>"+letra.otbFormaPago.nombre+"</td>";
                        htP+="<td class='text-right'>"+Redondear2(letra.monto)+"</td>";
                        htP+="</tr>";
                    }
                    $("#pagos").html(htP);
                    $("#listado").html(html);
                    $(".reserva").tooltip();
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
            estilo_error(false,this);
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

    var ValidarDataCliente = function (){
        if( $.trim( $("#ruc").val() ) === "" && $.trim( $("#dni").val() ) === "" ){
            uploadMsnSmall("Ingrese número de RUC o DNI.",'ALERTA');
            return false;
        }
        if( $.trim( $("#nombres").val()) === ""){
            uploadMsnSmall("Ingrese nombre del cliente.",'ALERTA');
            return false;
        }else if( ($.trim( $("#nombres").val())).length <= 12 ){
            uploadMsnSmall("El nombre del cliente debe de ser mayor de 12 carácteres.",'ALERTA');
            return false;
        }
        if( $.trim( $("#dir").val()) === ""){
            uploadMsnSmall("Ingrese dirección del cliente.",'ALERTA');
            return false;
        }else if( ($.trim( $("#dir").val())).length <= 20 ){
            uploadMsnSmall("La dirección del cliente debe de ser mayor de 20 carácteres.",'ALERTA');
            return false;
        }
        if( $.trim( $("#tele").val()) === ""){
            uploadMsnSmall("Ingrese teléfono del cliente.",'ALERTA');
            return false;
        }else if( ($.trim( $("#dir").val())).length <= 6 ){
            uploadMsnSmall("El teléfono del cliente debe de ser mayor de 6 carácteres.",'ALERTA');
            return false;
        }
        return true;
    };

    var saveCliente = function(){
         if(ValidarDataCliente()){
             cliente.start();
             $.ajax({
                 type: 'post',
                 url: "save_cliente",
                 dataType: 'json',
                 data:$("#frmCliente").serialize(),
                 success:function(respJson){
                     if(respJson!==null){
                         if(respJson.dato==="OK"){
                             $("#txtDescCliente").val($.trim( $("#nombres").val()));
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
         }
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
            url: "addpro_barcode_credito",
            dataType: 'json',
            data:{codepro:$(elem).val(),suc:$("#cboLiSuPedido").val(),fecha:fecha,hora:hora},
            success: function (respJson){
                if (respJson !== null) {
                    if(respJson.dato === "OK"){
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

    var checkEntrega = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var reservar_item = function(a){
        var cargar = Ladda.create(document.querySelector('#'+$(a).attr("id")));
        cargar.start();
        $.ajax({
            type: 'post',
            url: 'reservar_item',
            data: {"id":$(a).attr("data-id")},
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    if(data.dato==="OK"){
                        uploadMsnSmall(data.msj,'OK');
                        var idp = $(a).attr("data-ped");
                        var button = document.createElement('button');
                        button.id = idp;
                        viewDetails($(button));
                    }else if(data.dato==="ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Item Incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(data.msj,'ERROR');
                        }
                        cargar.stop();
                    }
                }else{
                    cargar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var quitar_reserva_item = function (a) {
        var cargar = Ladda.create(document.querySelector('#'+$(a).attr("id")));
        cargar.start();
        $.ajax({
            type: 'post',
            url: 'delete_reserva_item',
            data: {"id":$(a).attr("data-id")},
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    var idp = $(a).attr("data-ped");
                    var button = document.createElement('button');
                    button.id = idp;
                    viewDetails($(button));
                }else{
                    cargar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var cancelar_cambio = function (a) {
        var fil = $(a).parents("tr");
        var cod10 = $("#cod_10").val();
        var html = "";
        if(cod10 === "1"){
            html="<button type='button' id='reserva_item_"+iddetalleCambio+"' data-ped='"+id+"' data-id='"+iddetalleCambio+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-success reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Reservar: " + codProdCambio + "</div>' onclick=\"Pedido.reservar_item(this);\" > <span class='ladda-label'> <i class='fa fa-linode fa-2' style='font-size:20px!important;'></i> </span> </button>";
        }
        html+="<button type='button' id='det_item_"+iddetalleCambio+"' data-id='"+iddetalleCambio+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-warning reserva ladda-button btn-details-credito\"  data-style='zoom-in'  data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Cambiar producto: " + codProdCambio + "</div>' onclick=\"Pedido.cambiar_item(this);\" > <span class='ladda-label'> <i class='fa fa-repeat fa-2' style='font-size:20px!important;'></i> </span> </button>";
        html+="<button type='button' id='quitar_item_"+iddetalleCambio+"' data-id='"+iddetalleCambio+"' data-toggle='tooltip' data-placement='left' class=\"btn btn-sm btn-danger reserva ladda-button btn-details-credito\" data-style='zoom-in' data-spinner-size='30' data-html='true' title ='<div style=\"width:180px!important;\">Quitar producto: " + codProdCambio + "</div>' onclick=\"Pedido.quitar_item_credito(this);\" > <span class='ladda-label'> <i class='fa fa-trash fa-2' style='font-size:20px!important;'></i> </span> </button>";
        $(fil).html(filaCambio);
        $(fil).find("td").eq(7).html(html);
        $(".reserva").tooltip();
    };

    var guardar_cambio = function (a) {
        var cargar = Ladda.create(document.querySelector('#'+$(a).attr("id")));
        cargar.start();
        var fil = $(a).parents("tr");
        var idnewprod = $("#txt_cant_det_"+iddetalleCambio).attr("data-prod");
        var cant = $("#txt_cant_det_"+iddetalleCambio).val();
        var iddetven = $(a).attr("data-id");
        var preunitario = parseFloat($(fil).find("td").eq(3).html());

        $.ajax({
            type: 'post',
            url: "save_cambio_producto_credito",
            dataType: 'json',
            data:{idped:id,idprod:idnewprod,newcan:cant,iddetven:iddetven,preunitario: preunitario},
            success:function(respJson){
                if(respJson!==null){//SACAR DESCUENTO.
                    if(respJson.dato === "OK"){
                        var b = document.createElement('a');
                        b.id = id;
                        $(b).attr("data-id",id);
                        viewDetails($(b));
                    }else if(respJson.dato==="ERROR"){
                        cargar.stop();
                        uploadMsnSmall(respJson.msj,'ERROR');
                    }
                }else{
                    cargar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cargar.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var ImpresionTicket = function (idpedido) {
        if(tipImp === "1"){
            if(IsMobile()){
                triggerAppOpen(idpedido);
            } else {
                genticket.start();
                for(var i=0;i<2;i++){
                    $.ajax({
                        type: 'get',
                        url: 'http://127.0.0.1:8000/print=1',
                        data: {"idped":idpedido,"tipo":"4"},
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

    var AbonarLetraxPedido = function(a){//PARA CONFIRMAR VENTA
        id = $(a).attr("id").split("-")[1];
        ids = $(a).attr("id").split("-")[0];
        $("#frmFactura2")[0].reset();
        totalventa = $(a).attr("data-total");
        var totaldes = $(a).attr("data-desc");
        $("#acuenta").val($(a).attr("data-acu"));
        $("#saldo").val($(a).attr("data-saldo"));
        $("#saltipo2").selectpicker('val','0');

        var tiposDocumentos = $("#saltipo2 option");
        var listaIdTipDocs = new Array();
        for(var i=0;i<tiposDocumentos.length;i++){
            if($(tiposDocumentos[i]).val() !== "0"){
                listaIdTipDocs.push($(tiposDocumentos[i]).val());
            }
        }
        if(listaIdTipDocs.length === 1){
            $("#saltipo2").selectpicker('val',listaIdTipDocs[0]);
            $("#saltipo2").change();
        }
        $("#totaldescuento2").val(totaldes);
        $("#totalventa2").val(totalventa);
        $("#formPago").selectpicker('val','0');
        $('#div-fecvenc2').datepicker('update',fecAct);
        $("#AbonarPagoPedido").modal("show");
        $("#div-tipodoc-venta").find("button").trigger("click");
    };

    var GenDocAbono = function(){///OFICIAL ESTE ES
        abonar.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'POST',
            url: "abonar_pago",
            dataType: 'json',
            data : {idsuc:ids,idtip:$("#saltipo2").val(),id:id,txtnum:$("#numdocu2").val(),hora:hora,acuenta:$("#acuenta").val(),
                saldo:$("#saldo").val(),totventa : $("#totalventa2").val(), codven : $("#codVendedor2").val(),
                abonopago:$("#abonopago").val(),formPago:$("#formPago").val(),fecvenc:$("#fecvenc2").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        tableCobranzas._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#AbonarPagoPedido").modal("hide");
                        abonar.stop();
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
                        abonar.stop();
                    }
                }else{
                    abonar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                abonar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };


    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregped,#fecent,#fecentPro,#fecvenc,#fecnac,#fecvenc2").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecregped"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecent"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecentPro"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecvenc"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecvenc2"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecnac"),"dd-mm-yyyy");
        NumeroDosDecimalesxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreven"));
        NumeroDosDecimales($("#totaltarjeta"));
        NumeroDosDecimales($("#totalefectivo"));
        NumeroDosDecimales($("#totalventa"));
        NumeroDosDecimales($("#totaldescuento"));
        NumeroDosDecimales($("#abonoinicial"));
        NumeroDosDecimales($("#abonoFinal"));
        NumeroDosDecimales($("#txtSaldoDoc"));
        NumeroDosDecimales($("#totalventa2"));
        NumeroDosDecimales($("#totaldescuento2"));
        NumeroDosDecimales($("#abonopago"));
        NumeroDosDecimales($("#acuenta"));
        NumeroDosDecimales($("#saldo"));
        NumeroEntero($("#codVendedor2"),3);
        NumeroEntero($("#codVendedor"),3);
        NumeroEntero($("#edad"),2);
        NumeroEntero($("#ruc"),11);
        $("#dni").on("keypress",function(e){
            AccepWithNumber(e);
        });
        $("#codVendedor2").css("text-align","left");
        $("#btnValidarDNI").on("click",function () {
            Repositorio.ValidarDniCliente(validar,$("#nombres"),$("#dni").val());
        });
        $("#dni").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnValidarDNI").trigger("click");
            }
        });
        $("#btnVerPendientes").on("click",function () {
            var opt = $('option:selected', $("#cboLiSuPedido")).text();
            var parameters = "idsuc="+$("#cboLiSuPedido").val()+"&idusu="+$("#cboLiUsuario").val()+"&nom="+opt;
            imprimir_pdf("downloadCreditoPendientes",parameters);
        });
        $("#codVendedor").css("text-align","left");
        $("#codVendedor").on("keyup",function (e) {
            if(e.keyCode === 13){
                var btn = $("#formaPago").parents("div.btn-group").find("button");
                $(btn).trigger("click");
            }
        });
        $("#abonoinicial").on("keyup",function (e) {
            if($(this).val() !== ""){
                if(e.keyCode === 13){
                    if(!pago.isLoading()){
                        $("#btnGenDocPag").trigger("click");
                        return false;
                    }
                }
            }
        });
        $("#formaPago").on("change",function (e) {
            $("#abonoinicial").focus();
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
        $('#newSale').on('shown.bs.modal',function(){
            $("#txtBarcode").focus();
        });
        $('#chkEntrega').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkEntrega(event,$(this));
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
        $("#btnSearch2").on("click",function(){tableCobranzas._fnDraw();});
        $("#btnSearchModalCliente").on("click",function(){tableCliente._fnDraw();});
        $("#txtDescCliente").on("keyup",function(e){if(e.keyCode===13){tableCliente._fnDraw();}});
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}});
        $("#saltipo").on("change",function(){LoadSerie(ids);});
        $("#saltipoent").on("change",function(){LoadSerieAlm(ids);});
        $("#btnGenDocPag").on("click",function(){GenDoc();});
        $("#btnGenDocEnt").on("click",function(){GenDocEntrega();});
        $("#btnNewCliente").on("click",NuevoCliente);
        $("#btnGuardarCliente").on("click",saveCliente);
        $("#txtCliente").on("keyup",function () {
            table._fnDraw();
        });
        $("#txtCliente2").on("keyup",function () {
            tableCobranzas._fnDraw();
        });
        $("#txtBarcode").on("keypress",function(event){
            if(event.keyCode === 13){///CON EL LECTOR SE ESCRIBE EL CODIGO va generando un evento y al final da enter, se captura el enter y arroja todo el texto completo.
                if(!agregar.isLoading() && $("#btnOpenModalProducto").attr("disabled") !== "disabled" ){
                    addPrductBarcode($(this));
                }
            }
        });
        $("#btnTicket").on("click",function (){
            if(tipImp === "1"){
                if(IsMobile()){
                    triggerAppOpen(id);
                } else {
                    genticket.start();
                    $.ajax({
                        type: 'get',
                        url: 'http://127.0.0.1:8000/print=1',
                        data: {"idped": id, "tipo": "4"},
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
            } else if(tipImp === "2"){
                imprimir_ticket();
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_credito",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    tipImp = data.tipoImp;
                    $("#cboLiSuPedido").html(data.htS);
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboLiSucursal2").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario2").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#saltipo").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#saltipo2").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#saltipoent").html("<option value='0'>--SELECCIONAR--</option>"+data.htT);
                    $("#tippago,#formaPago,#formaPagoAbono").html(data.htFP);
                    $("#formPago").html("<option value='0'>--SELECCIONAR--</option>"+data.htFP);
                    $("#condpago").html(data.htCP);
                    $(".selectpicker").selectpicker("refresh");

                    ListarsearchCli();
                    ListarsearchPro();
                    ListCobranzas();
                    var par = window.location.search;

                    if (par !== "") {
                        par = par.replace("?", "");
                        var arr = par.split('&');
                        var fec = arr[0];
                        var cli = arr[1];
                        fec = fec.replace("fec=", "");
                        cli = cli.replace("cli=", "");
                        cli = cli.replaceAll("%20"," ");
                        $("#txtCliente").val(cli);
                        $('#div-busfecini').datepicker('update',fec);
                        $('#div-busfecfin').datepicker('update',fec);
                        ListPedidos();
                    } else {
                        ListPedidos();
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
        });
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
        $("#formPago").on("change",function () {
            $("#abonopago").focus();
        });
        $("#example2").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example2").val( (val ? "1" : "0") );
            if(val){
                $("#div-tipocobranza").show();
            }else{
                $("#div-tipocobranza").hide();
            }
        });
        $("#example3").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example3").val( (val ? "1" : "0") );
        });
        $("#saltipo2").on("change",function(){LoadSerieAbonar(ids);});
        $("#btnGenDocPag2").on("click",function(){GenDocAbono();});
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
        reservar_item:function (a) {
            reservar_item(a);
        },
        quitar_reserva_item:function (a) {
            quitar_reserva_item(a);
        },
        cambiar_item:function (a) {
            cambiar_item(a);
        },
        cancelar_cambio:function (a) {
            cancelar_cambio(a);
        },
        guardar_cambio:function (a) {
            guardar_cambio(a);
        },
        AbonarLetraxPedido:function(a){
            AbonarLetraxPedido(a);
        },
        quitar_item_credito:function(a){
            quitar_item_credito(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});