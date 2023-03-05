var Movimiento = function(){
    var fecAct = moment().format('DD-MM-YYYY');  
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var entrega = Ladda.create(document.querySelector('#btnGenMov'));
    var recibir = Ladda.create(document.querySelector('#btnRecibir'));
    var entrada = Ladda.create(document.querySelector('#btnGuardarEnt'));
    var loadExcel = Ladda.create(document.querySelector("#btnLoadProductos"));
    var table;
    var tableProducto;
    var tableProductoVar;
    var stockSel = 0;
    var LisIdPro;
    var LisCant;
    var LisPreCom;
    var LisDesc;
    var LisSku;
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
    var ida = 0;
    var idimpresion = 0;
    var busqueda = "";
    var num_row = -1;

    var listPadre = new Array();
    var listColor = new Array();
    var listTalla = new Array();
    var listCantidad = new Array();
    var liGenerado = new Array();

    var ListMovimientos = function(){
        table = $("#tblMovimientos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_movimientos",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idalm = $("#cboLiAlmacen").val();
                d.idusu = $("#cboLiUsuario").val();d.idtipdoc = $("#cboLiTipDoc").val();
                d.est = $("#cboLiEstado").val();d.idtipmov = $("#cboLiTipMov").val();
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
    
    var ListarsearchPro = function(){
        tableProducto = $("#tblProducto").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_pro_movimiento_search",
                data:function(d){
                    d.idalm = ida;
                    d.desc = $("#txtDescProducto").val();
                    d.tipo = $("#cboLiTipo").val();
                    d.buspor = $("#cboBuscar").val();
                    d.stock = $("#example2").val();
                }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-right",'aTargets': [4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".producto").tooltip();
            }
        });
    };

    var ListarsearchProVariaciones = function(){
        tableProductoVar = $("#tblProductoVar").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_productos_search_variaciones",
                data:function(d){
                    d.idalm = ida;
                    d.desc = $("#txtDescProductoVar").val();
                    d.tipo = $("#cboLiTipoVar").val();
                    d.buspor = $("#cboBuscarVar").val();
                }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-right",'aTargets': [4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".producto").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $("#frmDataMovimiento")[0].reset();
        $("#frmDataProductos")[0].reset();
        $('#div-fecregmov').datepicker('update',fecAct);
        $("#txttransporte").selectpicker('val',"0");
        $("#tipmovimiento").selectpicker('val',"0");
        $("#txtalmacendes").selectpicker('val',"0");

        $("#frmDataMovimientoEnt")[0].reset();
        $("#frmDataProductosEnt")[0].reset();
        $('#div-fecregmovEnt').datepicker('update',fecAct);
        $("#txttransporteEnt").selectpicker('val',"0");
        $("#tipmovimientoEnt").selectpicker('val',"0");

        fila = -1;
        acc = "";
        iddet = 0;
        LisIdPro = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisDesc = new Array();
        LisSku = new Array();
        LisCodigo = new Array();
        LisSubTotal = new Array();
        LisEliminados = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();
    };
    
    var ObtenerNum = function(){
        $.ajax({
            type: 'post',
            url: "init_movimiento",
            dataType: 'json',
            data:{},
            success:function(respJson){
                if(respJson!==null){
                    $("#txtnum,#txtnumEnt").val(respJson.num);
                    $("#txtven,#txtvenEnt").val(respJson.nombres);
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
        if( $("#cboLiAlMovimiento").val()!== "0" ){
            Limpiar();
            $("#tblDetalles").html("");
            $("#titulo").html("Registrar Movimiento");
            Accion = "R";
            var opt = $('option:selected',$("#cboLiAlMovimiento")).text();
            $("#txtalmacenori").val(opt);
            ida = $("#cboLiAlMovimiento").val();
            ObtenerNum();
            tableProducto._fnDraw();
            $("#newSale").modal("show");
        }else {
            Swal.fire({
                title: 'No tiene un Almacen registrado',
                text: "Desea ir al registro de almacen?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Ahora Mismo!',
                cancelButtonText: 'Cancelar',
                allowOutsideClick: false
            }).then( function(result){
                if (result.value) {
                    var url = "PuntoVenta.html";
                    window.open(url,'_self');
                }
            });
        }
    };

    var new_entrada = function(){
        Limpiar();
        $("#tblDetallesEnt").html("");
        $("#tituloEnt").html("Registrar movimiento");
        Accion = "R";
        var opt = $('option:selected',$("#cboLiAlMovimiento")).text();
        $("#txtalmacenoriEnt").val(opt);
        ida = $("#cboLiAlMovimiento").val();
        ObtenerNum();
        tableProductoVar._fnDraw();
        $("#newEntrada").modal("show");
    };

    var addProducto = function(a){
        var fil = $(a).parents("tr");
        var cod = $(fil).find("td").eq(1).html();
        var sku = $(fil).find("td").eq(2).html();
        var nom = $(fil).find("td").eq(3).html();
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val(nom);
        $("#codetpro").val(cod);
        $("#codetpro").attr("data-sku",sku);
        var idpro = parseFloat($("#iddetpro").val());
        var stock = parseFloat($(a).attr("data-stock"));
        stockSel = stock;
        for (var i = 0; i < LisIdPro.length; i++) {
            if(idpro === parseFloat(LisIdPro[i]) ){
                stockSel = stockSel - LisCant[i];
            }
        }
        $("#txtCanti").val("1.00");
        $("#modalSearchProducto").modal("hide");
    };

    var addProductoEntrada = function(a){
        if(ValidarItemProducto($(a).attr("data-id"))){
            var id = $(a).attr("data-id");
            var fil = $(a).parents("tr");
            var cod = $(fil).find("td").eq(1).html();
            var sku = $(fil).find("td").eq(2).html();
            var nom = $(fil).find("td").eq(3).html();
            $("#txt_sku_"+num_row).val(sku);
            $("#txt_codigo_"+num_row).val(cod);
            $("#txt_nombre_"+num_row).val(nom);
            $("#txt_cantidad_"+num_row).val("1");
            $("#txt_cantidad_"+num_row).focus();
            LisIdPro[num_row] = id;
            LisDesc[num_row] = sku;
            LisSku[num_row] = sku;
            LisCodigo[num_row] = cod;
            LisCant[num_row] = "1";
            LisPreCom[num_row] = nom;
            $("#modalSearchVariaciones").modal("hide");
        }
    };

    var ValidarItemProducto = function(idpro){
        for(var i=0;i<LisIdPro.length;i++){
            if(LisIdPro[i].toString() === idpro){
                uploadMsnSmall("Este producto ya ha sido agregado.","ALERTA");
                return false;
                break;
            }
        }
        return true;
    };

    var AddItem = function(){
        agregar.start();
        if(validarItem()){
            LisIdPro.push($("#iddetpro").val());
            LisDesc.push($("#namepro").val());
            LisSku.push($("#codetpro").attr("data-sku"));
            LisCodigo.push($("#codetpro").val());
            LisCant.push($("#txtCanti").val());
            LisPreCom.push("---");
            LisSubTotal.push("---");
            //LisPreCom.push($("#txtPreCompra").val());
            //LisSubTotal.push(Redondear2(parseFloat($("#txtCanti").val())*parseFloat($("#txtPreCompra").val())));
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
            $("#codetpro").val("");
            $("#namepro").val("");
            $("#txtCanti").val("");
            $("#txtPreCompra").val("");
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
        /*if($("#txtPreCompra").val()==="" || parseFloat($("#txtPreCompra").val())<=0){
            uploadMsnSmall("Precio Venta Incorrecto","ALERTA");
            agregar.stop();
            return false;
        }*/
        if(parseFloat($("#txtCanti").val())>parseFloat(stockSel)){
            uploadMsnSmall("No Existe Stock Suficiente","ALERTA");
            agregar.stop();
            return false;
        }
        for (var i = 0; i < LisIdPro.length; i++) {
            if(LisIdPro[i].toString() === $("#iddetpro").val() ){
                uploadMsnSmall("Este Producto ya ha sido agregado","ALERTA");
                agregar.stop();
                return false;
                break;
            }
        }
        return true;
    };
    
    var CargarTabla = function(){
        $("#tblDetalles").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblDetalles").append("<tr>"+
            "<td class='text-center'>"+LisSku[i]+"</td>"+
            "<td class='text-center'>"+LisCodigo[i]+"</td>"+
            "<td class='text-left'>"+LisDesc[i]+"</td>"+
            "<td class='text-right'>"+LisCant[i]+"</td>"+
            "<td class='text-right'>"+LisPreCom[i]+"</td>"+
            "<td class='text-right'>"+LisSubTotal[i]+"</td>"+
            "<td class='text-center' style='padding:3px!important;'><button type='button' class='btn btn-sm btn-success' id='fnupd_"+i+"' data-pos='"+i+"' style='margin-right:3px!important;padding:4px 10px!important;' title='Modificar'>"+
            "<i class='glyphicon glyphicon-edit'></i></button>"+
            "<button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
            "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
            "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItem(this);});
            $("#fnupd_"+i).on("click",function(){updateItem(this);});
        }
    };
    
    var quitarItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            if(Accion === "M" && LisAcciones[pos]!=="N"){
                LisEliminados.push(LisIdmod[pos]);
            }
            LisIdPro.splice(pos,1);
            LisDesc.splice(pos,1);
            LisSku.splice(pos,1);
            LisCodigo.splice(pos,1);
            LisCant.splice(pos,1);
            LisPreCom.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            CargarTabla();
        }else{
            uploadMsnSmall("Aun falta agregar datos.","ALERTA");
        }
    };

    var quitarItemEntrada = function(a){
        var pos = $(a).attr("data-pos");
        if(Accion === "M" && LisAcciones[pos]!=="N"){
            LisEliminados.push(LisIdmod[pos]);
        }
        LisIdPro.splice(pos,1);
        LisSku.splice(pos,1);
        LisDesc.splice(pos,1);
        LisCodigo.splice(pos,1);
        LisCant.splice(pos,1);
        LisPreCom.splice(pos,1);
        LisSubTotal.splice(pos,1);
        LisIdmod.splice(pos,1);
        LisAcciones.splice(pos,1);
        CargarTablaEntradas(-1);
    };

    var updateItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            fila = pos;
            $("#btnOpenModalProducto").prop("disabled",true);
            iddet = LisIdmod[pos];
            acc = LisAcciones[pos];
            $("#iddetpro").val(LisIdPro[pos]);
            $("#codetpro").val(LisCodigo[pos]);
            $("#codetpro").attr("data-sku",LisSku[pos]);
            $("#namepro").val(LisDesc[pos]);
            $("#txtCanti").val(LisCant[pos]);
            $("#txtPreven").val(Redondear2(LisPreCom[pos]));
            LisIdPro.splice(pos,1);
            LisDesc.splice(pos,1);
            LisSku.splice(pos,1);
            LisCodigo.splice(pos,1);
            LisCant.splice(pos,1);
            LisPreCom.splice(pos,1);
            LisSubTotal.splice(pos,1);
            LisIdmod.splice(pos,1);
            LisAcciones.splice(pos,1);
            CargarTabla();
            var idpro = parseFloat($("#iddetpro").val());
            $.ajax({
                type: 'post',
                url: "view_stock_producto",
                dataType: 'json',
                data:{idpro:idpro,idalm:ida},
                success:function(respJson){
                    if(respJson!==null){
                        if(respJson.dato === "OK"){
                            var stock = parseFloat(respJson.msj);
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
    
    var validarMovimiento = function(){
        if( $("#tipmovimiento").val() === "" || $("#tipmovimiento").val() === "0" ){
            uploadMsnSmall("Tipo de Movimiento Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiAlMovimiento").val() === "" || $("#cboLiAlMovimiento").val() === "0" ){
            uploadMsnSmall("Almacen Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length < 7){
            uploadMsnSmall("Numero de Pedido Incorrecta","ALERTA");
            cargando.stop();
            return false;
        }
        if(!moment($("#fecregmov").val(),"DD-MM-YYYY", true).isValid()){
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
        }
        return true;
    };

    var ValidarMovimientoEnt = function(){
        if( $("#tipmovimientoEnt").val() === "" || $("#tipmovimientoEnt").val() === "0" ){
            uploadMsnSmall("Tipo de Movimiento Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiAlMovimiento").val() === "" || $("#cboLiAlMovimiento").val() === "0" ){
            uploadMsnSmall("Almacen Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnumEnt").val() === "" || $("#txtnumEnt").val().length < 7){
            uploadMsnSmall("Numero de Pedido Incorrecta","ALERTA");
            cargando.stop();
            return false;
        }
        if(!moment($("#fecregmovEnt").val(),"DD-MM-YYYY", true).isValid()){
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
            var cant = parseFloat(LisCant[i]);


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
            } else if( !$.isNumeric(cant)  ){
                uploadMsnSmall("Cantidad Incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }
        return true;
    };

    var SaveEntrada = function(){
        entrada.start();
        var url = Accion === "R"?"save_movimiento":"update_movimiento";
        var accion = Accion === "R"?"save":"update";
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idtipmov:$("#tipmovimientoEnt").val(),idalm:ida,fec:$("#fecregmovEnt").val(),idalmdes:0,
                txtnum:$("#txtnumEnt").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,motivo:$("#txtMotivoEnt").val(),
                "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,idusutra:$("#txttransporteEnt").val(),
                tip:$('option:selected',$("#tipmovimientoEnt")).attr("data-tipo"),glosa:$('option:selected',$("#tipmovimientoEnt")).attr("data-glosa")},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        entrada.stop();
                        $("#newEntrada").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Almacen origen incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Fecha registro incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Tipo movimiento incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Almacen destino incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Transportista incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Seleccione almacenes diferentes.",'ALERTA');}
                                if(respJson.listado[i] === "E7"){uploadMsnSmall("Ingrese una glosa.",'ALERTA');$("#txtMotivoEnt").focus();}
                                if(respJson.listado[i] === "E8"){uploadMsnSmall("El texto de la glosa excedio las 200 letras.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        entrada.stop();
                    }
                }else{
                    entrada.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                entrada.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save = function(){
        cargando.start();
        var url = Accion === "R"?"save_movimiento":"update_movimiento";
        var accion = Accion === "R"?"save":"update";
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idtipmov:$("#tipmovimiento").val(),idalm:ida,fec:$("#fecregmov").val(),idalmdes:$("#txtalmacendes").val(),
            txtnum:$("#txtnum").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,motivo:$("#txtMotivo").val(),
            "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id,idusutra:$("#txttransporte").val(),
                tip:$('option:selected',$("#tipmovimiento")).attr("data-tipo"),glosa:$('option:selected',$("#tipmovimiento")).attr("data-glosa")},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#newSale").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Almacen Origen Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Fecha Registro Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Tipo Movimiento Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Almacen Destino Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Transportista Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Seleccione Almacenes Diferentes.",'ALERTA');}
                                if(respJson.listado[i] === "E7"){uploadMsnSmall("Ingrese una Glosa.",'ALERTA');}
                                if(respJson.listado[i] === "E8"){uploadMsnSmall("El Texto de la glosa excedio las 200 letras.",'ALERTA');}
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
    
    var view_record = function(elem){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_movimiento",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    Limpiar();
                    $("#titulo").html("Modificar movimiento");
                    Accion = "M";
                    id = respJson.id;
                    $("#txtnum").val(respJson.numero);
                    $("#txtven").val(respJson.otbUsuarioGenera.nombres+ " "+respJson.otbUsuarioGenera.apePat+" "+respJson.otbUsuarioGenera.apeMat);
                    $("#txtalmacenori").val(respJson.otbAlmacenOrigen.nombre);
                    $("#tipmovimiento").selectpicker('val',respJson.otbTipoMovimiento.id);
                    $("#txtalmacendes").selectpicker('val',respJson.otbAlmacenDestino!==null?respJson.otbAlmacenDestino.id:"0");
                    $("#txttransporte").selectpicker('val',respJson.otbUsuarioTransporta!==null?respJson.otbUsuarioTransporta.id:"0");
                    ida = respJson.otbAlmacenOrigen.id;
                    $("#txtMotivo").val(respJson.motivoMovimiento !== null ? respJson.motivoMovimiento : "");
                    var fecreg = moment(respJson.fechaRegistro).format('DD-MM-YYYY');
                    $('#div-fecregmov').datepicker('update',fecreg);
                    for (var i = 0; i < respJson.tbDetallemovimientos.length; i++) {
                        var deta = respJson.tbDetallemovimientos[i];
                        LisIdPro.push(deta.otbProducto.id);
                        LisSku.push(deta.otbProducto.barcodeProducto);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisDesc.push(deta.otbProducto.nombreGeneralProducto);
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(deta.preCompra!==null?deta.preCompra:"---");
                        LisSubTotal.push("---");
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

    var view_record_entrada = function(elem){
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_movimiento",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#titulo").html("Modificar movimiento");
                    Accion = "M";
                    id = respJson.id;
                    $("#txtnumEnt").val(respJson.numero);
                    $("#txtvenEnt").val(respJson.otbUsuarioGenera.nombres+ " "+respJson.otbUsuarioGenera.apePat+" "+respJson.otbUsuarioGenera.apeMat);
                    $("#txtalmacenoriEnt").val(respJson.otbAlmacenOrigen.nombre);
                    $("#tipmovimientoEnt").selectpicker('val',respJson.otbTipoMovimiento.id);
                    ida = respJson.otbAlmacenOrigen.id;
                    $("#txtMotivoEnt").val(respJson.motivoMovimiento !== null ? respJson.motivoMovimiento : "");
                    var fecreg = moment(respJson.fechaRegistro).format('DD-MM-YYYY');
                    $('#div-fecregmovEnt').datepicker('update',fecreg);
                    for (var i = 0; i < respJson.tbDetallemovimientos.length; i++) {
                        var deta = respJson.tbDetallemovimientos[i];
                        LisIdPro.push(deta.otbProducto.id);
                        LisSku.push(deta.otbProducto.barcodeProducto);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisDesc.push(deta.otbProducto.barcodeProducto);
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(deta.otbProducto.nombreGeneralProducto);//PONERLO COMO LA DESCRIPCION DEL PRODUCTO.
                        LisSubTotal.push("---");
                        LisIdmod.push(deta.id);
                        LisAcciones.push("U");
                    }
                    CargarTablaEntradas(-1);
                    tableProductoVar._fnDraw();
                    $("#newEntrada").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var confirm_movimiento = function(a){ // SI ES TRANSFERENCIA CAMBIO ESTADO
        id = $(a).attr("id").split("-")[1];
        ida = $(a).attr("id").split("-")[0];
        $("#frmProMov")[0].reset();
        $("#saltipoent").selectpicker('val','0');
        $.ajax({
            type: 'POST',
            url: "confirm_movimiento",
            dataType: 'json',
            data : {id:id},
            success: function(data){
                if(data!==null){
                    if(data.dato === "OK"){
                        if(data.tipo === "SALIDA"){
                            $("#div-txtUsuTraMov").hide();
                            $("#div-txtAlmDesMov").hide();
                        }else if(data.tipo === "TRANSFERENCIA"){
                            $("#div-txtAlmDesMov").show();
                            $("#div-txtUsuTraMov").show();
                            $("#txtalmDesMov").val(data.destino);
                            $("#txtusutransMov").val(data.transporte);
                        }else if(data.tipo === "ENTRADA"){
                            $("#div-txtUsuTraMov").hide();
                            $("#div-txtAlmDesMov").hide();
                            $("#txtusutransMov").val(data.transporte);
                        }
                        $("#TituloEntrega").html(data.titulo);
                        $("#entrega").modal("show"); 
                    }else if(data.dato === "ERROR"){
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
    
    var LoadSerieAlm = function(alm){
        $.ajax({
            type: 'POST',
            url: "view_seriexalm_mov",
            dataType: 'json',
            data : {idtip:$("#saltipoent").val(),idalm:alm},
            success: function(data){
                if(data!==null){
                    if($("#saltipoent").val() !== "0"){
                        $("#numdocref").val(data.msj);
                    }else{
                        $("#numdocref").val("");
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

    var GenDocMovimiento = function(){
        entrega.start();
        $.ajax({
            type: 'POST',
            url: "gen_doc_movimiento",
            dataType: 'json',
            data : {idtip:$("#saltipoent").val(),id:id,txtnum:$("#numdocref").val()},
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
                                if(data.listado[i] === "E1"){uploadMsnSmall("Movimiento no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Seleccione Tipo de Documento.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                                //if(data.listado[i] === "E4"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Movimiento de Almacen?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_movimiento',
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
            url: "view_movimiento",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    idimpresion = respJson.id;
                    $("#vernum").val(respJson.numero);
                    $("#verusu").val(respJson.otbUsuarioGenera.nombres+ " "+respJson.otbUsuarioGenera.apePat+" "+respJson.otbUsuarioGenera.apeMat);
                    $("#veralmori").val(respJson.otbAlmacenOrigen.nombre);
                    $("#veralmdes").val(respJson.otbAlmacenDestino!==null?respJson.otbAlmacenDestino.nombre:"---");
                    $("#verusutrans").val(respJson.otbUsuarioTransporta!==null? (respJson.otbUsuarioTransporta.nombres+ " "+respJson.otbUsuarioTransporta.apePat+" "+respJson.otbUsuarioTransporta.apeMat):"---" );
                    $("#vertipdoc").val( (respJson.otbTipoDocumento!==null?respJson.otbTipoDocumento.nombre:"") + (respJson.documentoReferencia!==null?" "+respJson.documentoReferencia:"")  );
                    var fecreg = moment(respJson.fechaRegistro).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#vertipmov").val(respJson.otbTipoMovimiento.nombre);
                    $("#txtDescMotivo").val(respJson.motivoMovimiento !== null ?respJson.motivoMovimiento : "");
                    var html = "";
                    var cantidades = 0;
                    var totales = 0;
                    for (var i = 0; i < respJson.tbDetallemovimientos.length; i++){
                        var deta = respJson.tbDetallemovimientos[i];
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.nombreGeneralProducto+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td>"+(deta.unidadStock!== null ? deta.unidadStock.nombre : "---") +"</td>";
                        html+="<td class='text-right'>"+(deta.preCompra!==null? RedondearFixed(deta.preCompra,3):"---" )+"</td>";
                        html+="<td class='text-right'>"+(deta.preCompra!==null? Redondear2(deta.preCompra*deta.cantidad):"---" )+"</td>";
                        html+="</tr>";
                        cantidades+=parseFloat(deta.cantidad);
                        totales+=(parseFloat((deta.preCompra!==null ? deta.preCompra : 0.00))*parseFloat(deta.cantidad));
                    }
                    html+="<tr>";
                    html+="<td colspan='3' class='text-right'>Cantidad de Productos: </td>";
                    html+="<td class='text-right'>"+Redondear2(cantidades)+"</td>";
                    html+="<td colspan='2' class='text-right'>Monto Total: </td>";
                    html+="<td class='text-right'>"+Redondear2(totales)+"</td>";
                    html+="</tr>";
                    $("#listado").html(html);
                    $("#viewMovimiento").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };

    var GenerarProductoxMovimiento = function(){
        var method = "downloadTransferencia";
        var parameters = "id=" + idimpresion;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var recepcion_movimiento = function(a){
        id = $(a).attr("id").split("-")[1];
        ida = $(a).attr("id").split("-")[0];
        $.ajax({
            type: 'POST',
            url: "confirm_movimiento",
            dataType: 'json',
            data : {id:id},
            success: function(data){
                if(data!==null){
                    if(data.dato === "OK"){
                        $("#txtAlmDest").val(data.destino);
                        $("#txtUsuTrans").val(data.transporte);
                        $("#titRecepcion").html(data.titulo);
                        $("#recibir").modal("show");
                    }else if(data.dato === "ERROR"){
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

    var RecibirMovimiento = function(){
        recibir.start();
        $.ajax({
            type:'POST',
            url:"recibir_movimiento",
            dataType: 'json',
            data : {id:id},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        tableProducto._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#recibir").modal("hide");
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Movimiento no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Seleccione Tipo de Documento.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Numero de Documento Incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                    }
                    recibir.stop();
                }else{
                    recibir.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                recibir.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarTablaEntradas = function(indice){
        $("#tblDetallesEnt").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblDetallesEnt").append("<tr>"+
                "<td class='text-left'>"+(i+1)+"</td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_sku_"+i+"' id='txt_sku_"+i+"' ondblclick='Movimiento.VerListadoProductosVariaciones(this);' onkeypress='return ValidaNum(event);' maxlength='9' value='"+LisDesc[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_codigo_"+i+"' id='txt_codigo_"+i+"' maxlength='8' style='border: none!important;background: transparent;' readonly='readonly' value='"+LisCodigo[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_nombre_"+i+"' id='txt_nombre_"+i+"' maxlength='200' style='border: none!important;background: transparent;' readonly='readonly' value='"+LisPreCom[i]+"' /></td>"+
                "<td class='text-right cell-padding-2'><input type='text' class='form-control input-sm cell-input-34 cell-padding-lados-8' data-pos='"+i+"' name='txt_cantidad_"+i+"' id='txt_cantidad_"+i+"' maxlength='9' value='"+LisCant[i]+"' /></td>"+
                "<td class='text-center' style='padding:2px!important;'>"+
                "<button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItemEntrada(this);});
            $("#fndel_"+i).tooltip();
        }
        for (var j = 0; j < LisIdPro.length; j++) {
            $("#txt_cantidad_"+j).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                LisCant[pos] = $(this).val();
            });
            NumeroEnteroxDefectoUno($("#txt_cantidad_"+j));
        }
        if(indice > -1){
            var btn = $("#txt_sku_"+indice);
            $(btn).focus();
        }
        //cargarTotal();
    };

    var VerListadoProductosVariaciones = function(a){
        num_row = $(a).attr("data-pos");
        $("#modalSearchVariaciones").modal("show");
    };

    var ExportToTableMov = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls|.csv)$/;
        if (regex.test($("#excelfile_sal").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile_sal").val().toLowerCase().indexOf(".xlsx") > 0
                || $("#excelfile_sal").val().toLowerCase().indexOf(".csv") > 0) {
                xlsxflag = true;
            }
            loadExcel.start();
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        var workbook = XLS.read(data, {type: 'binary'});
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    /*This is used for restricting the script to consider only first sheet of excel*/
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        } else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt >= 0) {
                            BindTableMov(exceljson, '#exceltable', cnt);
                            cnt++;
                        }
                    });
                };
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($("#excelfile_sal")[0].files[0]);
                } else {
                    reader.readAsBinaryString($("#excelfile_sal")[0].files[0]);
                }
            } else {
                loadExcel.stop();
                uploadMsnSmall("Sorry! Your browser does not support HTML5!", "ERROR");
            }
        } else {
            loadExcel.stop();
            uploadMsnSmall("Por favor, cargar un excel valido!", "ERROR");
        }
    };

    var ExportToTable = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls|.csv)$/;
        if (regex.test($("#excelfile").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0
                || $("#excelfile").val().toLowerCase().indexOf(".csv") > 0) {
                xlsxflag = true;
            }
            loadExcel.start();
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        var workbook = XLS.read(data, {type: 'binary'});
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    /*This is used for restricting the script to consider only first sheet of excel*/
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        } else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt >= 0) {
                            BindTable(exceljson, '#exceltable', cnt);
                            cnt++;
                        }
                    });
                };
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
                } else {
                    reader.readAsBinaryString($("#excelfile")[0].files[0]);
                }
            } else {
                loadExcel.stop();
                uploadMsnSmall("Sorry! Your browser does not support HTML5!", "ERROR");
            }
        } else {
            loadExcel.stop();
            uploadMsnSmall("Por favor, cargar un excel valido!", "ERROR");
        }
    };

    var BindTableHeader = function(jsondata,tableid){
        var columnSet = [];
        for (var i = 0; i < jsondata.length; i++){
            var rowHash = jsondata[i];
            for (var key in rowHash){
                if (rowHash.hasOwnProperty(key)){
                    if ($.inArray(key, columnSet) == -1) { /*Adding each unique column names to a variable array*/
                        if(key !== "SKU PADRE" && key != "DESCRIPCION" && key != "COLOR" && key != "TALLA"
                            && key != "CANTIDAD" && key != "SKU"){
                            columnSet.push(key);
                        }
                    }
                }
            }
        }
        return columnSet;
    };

    var BindTable = function (jsondata, tableid, numHoja) {/*Function used to convert the JSON array to Html Table*/
        var columns = BindTableHeader(jsondata, tableid);
        var espacio_blanco = /\s/;

        listPadre = new Array();
        listColor = new Array();
        listTalla = new Array();
        listCantidad = new Array();
        liGenerado = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var skupadre = $.trim(jsondata[i]['SKU PADRE'])+"";
            var color = $.trim(jsondata[i]['COLOR'])+"";
            var talla = $.trim(jsondata[i]['TALLA'])+"";
            var cant = $.trim(jsondata[i]['CANTIDAD'])+"";

            cant = cant.replace(/,/g, '');

            listPadre.push(skupadre);
            listColor.push(color);
            listTalla.push(talla);
            listCantidad.push(cant);
            liGenerado.push("0");
        }

        if (listPadre.length > 0) {
            //Repositorio.refreshTable($('div.blockMe'));
            CargarProductos();
        }
    };

    var BindTableMov = function (jsondata, tableid, numHoja) {/*Function used to convert the JSON array to Html Table*/
        var columns = BindTableHeader(jsondata, tableid);
        var espacio_blanco = /\s/;

        LisIdPro = new Array();
        LisDesc = new Array();
        LisSku = new Array();
        LisCodigo = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisSubTotal = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();

        listPadre= new Array();
        listCantidad = new Array();
        liGenerado = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var skupadre = $.trim(jsondata[i]['SKU'])+"";
            var cant = $.trim(jsondata[i]['CANTIDAD'])+"";
            cant = cant.replace(/,/g, '');

            listPadre.push(skupadre);
            listCantidad.push(cant);
            liGenerado.push("0");
        }

        if (listPadre.length > 0) {
            //Repositorio.refreshTable($('div.blockMe'));
            CargarProductosMov();
        }
    };

    var CargarProductos = function(){
        EjecutarImportacionProductos();
    };

    var CargarProductosMov = function(){
        EjecutarImportacionProductosMov();
    };

    var ValidarItemExcel = function(idproducto,cantidad,indice){
        if(idproducto === "" || idproducto === "0"){
            uploadMsnSmall("No ha Seleccionado Producto.","ALERTA");
            return false;
        }
        if(cantidad==="" || parseFloat(cantidad)<=0){
            uploadMsnSmall("Cantidad incorrecta en el item " + (indice+1) + " de la lista.","ALERTA");
            return false;
        }
        for (var i = 0; i < LisIdPro.length; i++) {
            if(LisIdPro[i].toString() === idproducto.toString() ){
                uploadMsnSmall("El producto en el item "+(indice + 1)+" ya ha sido agregado.","ALERTA");
                return false;
                break;
            }
        }
        return true;
    };

    var EjecutarImportacionProductos = function(){
        var indice = 0;
        for(var m=0;m<liGenerado.length;m++){
            if(liGenerado[m] === "0"){
                var cantidad = listCantidad[m];
                $.ajax({
                    type: 'post',
                    url: "view_producto_movimiento",
                    data: {"skupadre": listPadre[m], "talla": listTalla[m],"color": listColor[m], "indice" : m},
                    dataType: 'json',
                    success: function (respJson) {
                        if (respJson !== null) {
                            var rpta = respJson;
                            if(rpta.dato === "OK"){
                                liGenerado[m] = "1";
                                var producto = rpta.objeto;

                                if(ValidarItemExcel(producto.id,cantidad,m)){
                                    LisIdPro.push(producto.id);
                                    LisDesc.push(producto.barcodeProducto);
                                    LisSku.push(producto.barcodeProducto);
                                    LisCodigo.push(producto.codigo);
                                    LisCant.push(cantidad);
                                    LisPreCom.push(producto.nombreGeneralProducto);
                                    LisSubTotal.push("---");
                                    LisIdmod.push(0);
                                    LisAcciones.push("N");
                                    CargarTablaEntradas(-1); //CAMBIAR POR AGREGAR FILA CON APPEND HTML.
                                    EjecutarImportacionProductos();
                                }else{
                                    liGenerado[m] = "1";
                                    EjecutarImportacionProductos();
                                }
                            }else if(rpta.dato === "ERROR") {
                                liGenerado[m] = "1";
                                uploadMsnSmall(rpta.msj,'ERROR');
                                EjecutarImportacionProductos();
                            }
                        } else {
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        uploadMsnSmall('¡Se encontró un problema en el servidor!', 'ERROR');
                    }
                });
                return false;
            }
        }
        for(var n=0;n<liGenerado.length;n++){
            if(liGenerado[n] === "0"){
                indice = 1;
            }
        }
        if(indice === 0){
            //Repositorio.finishRefresh($('div.blockMe'));
            loadExcel.stop();
            $("#excelfile").val("");
        }
    };

    var EjecutarImportacionProductosMov = function(){
        var indice = 0;
        for(var m=0;m<liGenerado.length;m++){
            if(liGenerado[m] === "0"){
                var cantidad = listCantidad[m];
                $.ajax({
                    type: 'post',
                    url: "addpro_barcode_almacen",
                    data: {"codepro": listPadre[m], "alm":ida, "indice" : m},
                    dataType: 'json',
                    success: function (respJson) {
                        if (respJson !== null) {
                            var rpta = respJson;
                            if(rpta.dato === "OK"){
                                liGenerado[m] = "1";
                                var producto = rpta.objeto;

                                if(ValidarItemExcel(producto.id,cantidad,m)){
                                    LisIdPro.push(producto.id);
                                    LisSku.push(producto.barcodeProducto);
                                    LisDesc.push(producto.nombreGeneralProducto);
                                    LisCodigo.push(producto.codigo);
                                    LisCant.push(cantidad);
                                    LisPreCom.push("---");
                                    LisSubTotal.push("---");
                                    LisIdmod.push(0);
                                    LisAcciones.push("N");
                                    CargarTabla();
                                    EjecutarImportacionProductosMov();
                                }else{
                                    liGenerado[m] = "1";
                                    EjecutarImportacionProductosMov();
                                }
                            }else if(rpta.dato === "ERROR") {
                                liGenerado[m] = "1";
                                uploadMsnSmall(rpta.msj,'ERROR');
                                EjecutarImportacionProductosMov();
                            }
                        } else {
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        uploadMsnSmall('¡Se encontró un problema en el servidor!', 'ERROR');
                    }
                });
                return false;
            }
        }
        for(var n=0;n<liGenerado.length;n++){
            if(liGenerado[n] === "0"){
                indice = 1;
            }
        }
        if(indice === 0){
            //Repositorio.finishRefresh($('div.blockMe'));
            loadExcel.stop();
            $("#excelfile").val("");
        }
    };

    var Iniciando = function(){
        if($("#cod_07").val() === "0"){
            $("#div_btn_07").remove();
        }
        if($("#cod_08").val() === "0"){
            $("#div_btn_08").remove();
        }
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
        $("#newEntrada").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newEntrada:visible").each(ModalCompleto);
        });
        $("#modalSearchProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProducto:visible").each(ModalCompleto);
        });
        $("#busfecini,#busfecfin,#fecregmov,#fecregmovEnt").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        $('#div-fecregmov').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            calendarWeeks: true,
            autoclose: true,
            format:"dd-mm-yyyy",
            endDate:new Date()
        });
        $('#div-fecregmovEnt').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            calendarWeeks: true,
            autoclose: true,
            format:"dd-mm-yyyy",
            endDate:new Date()
        });
        NumeroDosDecimalesxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreCompra"));
        $("#div-fecregmov").datepicker().on('show.bs.modal', function (event) {            
            if ($("#div-movimientos").hasClass("bloqueDatos")) {                
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }            
        });
        $("#div-fecregmovEnt").datepicker().on('show.bs.modal', function (event) {
            if ($("#div-movimientosEnt").hasClass("bloqueDatos")) {
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnNewEntrada").on("click",new_entrada);
        $("#btnGenMov").on("click",GenDocMovimiento);
        $("#btnGuardar").on("click",function(){
            if(validarMovimiento()){save();}
        });
        $("#btnGuardarEnt").on("click",function(){
            if(ValidarMovimientoEnt()){SaveEntrada();}
        });
        $("#btnOpenModalProducto").on("click",function(){
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreCompra").val("");
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}}); 
        $("#btnAddItem").on("click",AddItem);
        $("#saltipoent").on("change",function(){
            LoadSerieAlm(ida);
        });
        $("#cboLiAlmacen,#cboLiTipDoc,#cboLiTipMov,#cboLiUsuario,#cboLiEstado").on("change",function(){table._fnDraw();});
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#btnViewPrintProduct").on("click",GenerarProductoxMovimiento);
        $("#btnRecibir").on("click",RecibirMovimiento);
        $("#viewMovimiento").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewMovimiento:visible").each(ModalCompleto);
        });
        $.ajax({
            type: 'post',
            url: "mant_movimiento",
            dataType: 'json',
            data:{i:1},
            success: function (respJson) {
                if (respJson !== null) {
                    busqueda = respJson.busqueda;
                    $("#cboLiAlMovimiento").html(respJson.htA);
                    $("#cboLiAlmacen").html((respJson.usu === "1" ? "<option value='0'>--TODOS--</option>" : "")+respJson.htA);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+respJson.htU);
                    $("#cboLiTipDoc").html("<option value='0'>--TODOS--</option>"+respJson.htT);
                    $("#cboLiTipMov").html( "<option value='0'>--TODOS--</option>"+respJson.htTMov);
                    $("#txttransporte").html("<option value='0'>--SELECCIONE--</option>"+respJson.htU);
                    $("#txttransporteEnt").html("<option value='0'>--SELECCIONE--</option>"+respJson.htU);
                    $("#txtalmacendes").html("<option value='0'>--SELECCIONE--</option>"+respJson.htTrasAlm);
                    $("#saltipoent").html("<option value='0'>--SELECCIONE--</option>"+respJson.htSal);
                    $("#tipmovimiento").html( "<option value='0'>--SELECCIONE--</option>"+respJson.htRegTMov);
                    $("#tipmovimientoEnt").html( "<option value='0'>--SELECCIONE--</option>"+respJson.htmEnt);
                    $(".selectpicker").selectpicker("refresh");

                    var par = window.location.search;

                    if (par !== "") {
                        par = par.replace("?", "");
                        var arr = par.split('&');
                        var fec = arr[0];
                        //var cli = arr[1];
                        fec = fec.replace("fec=", "");
                        //cli = cli.replace("cli=", "");
                       // cli = cli.replaceAll("%20"," ");
                       // $("#txtCliente").val(cli);
                        $('#div-busfecini').datepicker('update',fec);
                        $('#div-busfecfin').datepicker('update',fec);
                        $("#cboLiTipMov").selectpicker('val','1');
                        ListMovimientos();
                    } else {
                        ListMovimientos();
                    }
                    ListarsearchPro();
                    ListarsearchProVariaciones();
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#btnAddItemEnt").on("click",function(){
            LisIdPro.push("0");
            LisDesc.push("");
            LisSku.push("");
            LisCodigo.push("");
            LisCant.push("");
            LisPreCom.push("---");//PONERLO COMO LA DESCRIPCION DEL PRODUCTO.
            LisSubTotal.push("---");
            LisIdmod.push(0);
            LisAcciones.push("N");
            CargarTablaEntradas(LisIdPro.length - 1);
        });
        $("#btnSearchModalProductoVar").on("click",function(){
            tableProductoVar._fnDraw();
        });
        $("#txtDescProductoVar").on("keyup",function(e){
            if(e.keyCode === 13){
                tableProductoVar._fnDraw();
            }
        });
        $("#btnLoadProductosSal").on("click",function(){
            $("#excelfile_sal").val("");
            $("#excelfile_sal").trigger("click");
        });
        $("#btnLoadProductos").on("click",function(){
            $("#excelfile").trigger("click");
        });
        $("#excelfile").on("change",function(evt){
            ExportToTable();
        });
        $("#excelfile_sal").on("change",function(evt){
            ExportToTableMov();
        });
        $("#example2").on("change",function(e){
            var val = e.currentTarget.checked;
            $("#example2").val( (val ? "1" : "0") );
            tableProducto._fnDraw();
        });
    };
    
    return {
        init: function () {
            Iniciando();
        },
        Cancelar:function(elem){
          Cancelar(elem);  
        },
        view_record:function(elem){
            view_record(elem);
        },
        addProducto:function(a){
            addProducto(a);
        },
        addProductoEntrada:function(a){
            addProductoEntrada(a);
        },
        confirm_movimiento:function(a){
            confirm_movimiento(a);
        },
        viewDetails:function(a){
            viewDetails(a);
        },
        recepcion_movimiento:function(a) {
            recepcion_movimiento(a);
        },
        VerListadoProductosVariaciones: function (a) {
            VerListadoProductosVariaciones(a);
        },
        view_record_entrada:function(a){
            view_record_entrada(a);
        }
    };
}();
jQuery(document).ready(function () {
    Movimiento.init();
});