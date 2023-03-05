var Movimiento = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var entrega = Ladda.create(document.querySelector('#btnGenMov'));
    var recibir = Ladda.create(document.querySelector('#btnRecibir'));
    var entregaPro = Ladda.create(document.querySelector("#btnEntregaPro"));
    var searchCompra = Ladda.create(document.querySelector("#btnViewSearchCompra"));
    var table;
    var tableProducto;
    var stockSel = 0;
    var LisIdPro;
    var LisCant;
    var LisPreCom;
    var LisDesc;
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
    var ida;
    var idimpresion = 0;
    var listIdComBar = new Array();
    var busqueda = "";

    var ListMovimientos = function(){
        table = $("#tblMovimientos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_transferencias",data:function(d){d.fecini = $("#busfecini").val();
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
                }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass': " text-right", 'aTargets': [4,5,6]},
                {'sClass': " text-center", 'aTargets': [7]},
                {'sClass': "centrado boton-tabla", 'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback": function (oSettings) {
                //$(".addcompra").tooltip();
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
        fila = -1;
        acc = "";
        iddet = 0;
        LisIdPro = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisDesc = new Array();
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
                    $("#txtnum").val(respJson.num);
                    $("#txtven").val(respJson.nombres);
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
        $("#titulo").html("Registrar Movimiento");
        Accion = "R";
        var opt = $('option:selected',$("#cboLiAlMovimiento")).text();
        $("#txtalmacenori").val(opt);
        ida = $("#cboLiAlMovimiento").val();
        ObtenerNum();
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var addProducto = function(a){
        var fil = $(a).parents("tr");
        var cod = $(fil).find("td").eq(1).html();
        var sku = $(fil).find("td").eq(2).html();
        var nom = $(fil).find("td").eq(3).html();
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val(nom);
        $("#codetpro").val(cod);
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

    var AddItem = function(){
        agregar.start();
        if(validarItem()){
            LisIdPro.push($("#iddetpro").val());
            LisDesc.push($("#namepro").val());
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
            $("#codetpro,#namepro,#txtCanti,#txtPreCompra").val("");
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

    var updateItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            fila = pos;
            $("#btnOpenModalProducto").prop("disabled",true);
            iddet = LisIdmod[pos];
            acc = LisAcciones[pos];
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
                tip:$('option:selected', $("#tipmovimiento")).attr("data-tipo"),glosa:$('option:selected',$("#tipmovimiento")).attr("data-glosa")},
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
                    $("#titulo").html("Modificar Movimiento");
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
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisDesc.push(deta.otbProducto.desCategoria + " "+deta.otbProducto.desMarca+" "+deta.otbProducto.nombre);
                        LisCant.push(Redondear2(deta.cantidad));
                        LisPreCom.push(deta.preCompra!==null?deta.preCompra:"---");
                        LisSubTotal.push("---");
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
                    var totCant = 0;
                    for (var i = 0; i < respJson.tbDetallemovimientos.length; i++){
                        var deta = respJson.tbDetallemovimientos[i];
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        if(busqueda === "1"){
                            html+="<td>"+(deta.otbProducto.desCategoria!==null?deta.otbProducto.desCategoria+" ":"")+(deta.otbProducto.desMarca!==null?deta.otbProducto.desMarca+" ":"")+deta.otbProducto.nombre+(deta.otbProducto.desCaracteristica!==null?" "+deta.otbProducto.desCaracteristica:"")+(deta.otbProducto.modelo!==null?" "+deta.otbProducto.modelo:"")+"</td>";
                        } else if(busqueda === "2"){
                            html+="<td>"+(deta.otbProducto.desCategoria!==null?deta.otbProducto.desCategoria+" ":"")+(deta.otbProducto.desMarca!==null?deta.otbProducto.desMarca+" ":"")+(deta.otbProducto.modelo!==null?deta.otbProducto.modelo+" ":"")+(deta.otbProducto.desCaracteristica!==null?deta.otbProducto.desCaracteristica+" ":"")+deta.otbProducto.nombre+"</td>";
                        }
                        html+="<td>"+Redondear0(deta.cantidad)+"</td>";
                        html+="<td>"+"---"+"</td>";
                        html+="<td>"+"---"+"</td>";
                        html+="</tr>";
                        totCant+=parseInt(deta.cantidad);
                    }
                    $("#listado").html(html);
                    var footHt = "";
                    footHt+="<tr>";
                    footHt+="<td class='text-right' colspan='3'>TOTAL DE PRODUCTOS: </td>";
                    footHt+="<td colspan='3'>"+Redondear0(totCant)+"</td>";
                    footHt+="</tr>";
                    $("#footList").html(footHt);
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

    var GenerarProductoxTransferencia = function(){
        var method = "downloadTransferencia";
        var parameters = "id=" + idimpresion;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var addIdCompra = function(a){
        var idcom = $(a).attr("id");
        var fec = $(a).attr("data-fec");
        var alm = $(a).attr("data-alm");
        var num = $(a).attr("data-num");
        var tot = $(a).attr("data-tot");
        var numItem = listIdComBar.length + 1;
        var seagrega = "1";
        for(var i=0;i<listIdComBar.length;i++){
            if(idcom === listIdComBar[i]){
                seagrega = "0";
                i=listIdComBar.length+1;
            }
        }
        if(seagrega === "1"){
            listIdComBar.push(idcom);
            var html = "<tr id='fil_"+idcom+"' data-pos='"+(listIdComBar.length-1)+"'>";
            html+="<td>"+numItem+"</td>";
            html+="<td>"+fec+"</td>";
            html+="<td>"+alm+"</td>";
            html+="<td>"+num+"</td>";
            html+="<td>"+tot+"</td>";
            html+="<td style='padding-top:2px!important;padding-bottom:2px!important;'>"+ "<button type='button' id='"+idcom+"'  data-toggle='tooltip' data-placement='left' data-html='true' class='btn btn-sm btn-outline btn-danger quitarcompra' style='margin:0px!important;padding:2px 7px 2px 7px!important;font-size: 15px!important;' onclick=\"Movimiento.delIdCompra(this);\" title='<div style=\"width:180px!important;\">Quitar: " + num + "</div>' > <i class='fa fa-close' style='font-size:15px!important;'></i> </button>"+"</td>";
            html+="</tr>";
            $("#listadoCompBarcodes").append(html);
            $(".quitarcompra").tooltip();
        }else{
            uploadMsnSmall("Ya se agregado esa Compra","ALERTA");
        }
    };

    var delIdCompra = function (a) {
        var id = $(a).attr("id");
        var pos = $("#fil_"+id).attr("data-pos");
        $("#fil_"+id).remove();
        listIdComBar.splice(pos,1);
        for(var i=0;i<listIdComBar.length;i++){
            $("#fil_"+listIdComBar[i]).attr("data-pos",i);
        }
    };

    var printListCompras = function(){
        var idc = "";
        for (var i = 0 ; i < listIdComBar.length;i++){
            if( i === listIdComBar.length-1){
                idc+=listIdComBar[i];
            }else{
                idc+=listIdComBar[i]+",";
            }
        }
        var method = "downloadListComprasBarcodes";
        var parameters = "idcompras=" + idc;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var CargarComxRecibir = function () {
        $.ajax({
            type:'POST',
            url:"view_copmpras_rec",
            dataType: 'json',
            success: function(data){
                if(data !== null){
                    if ($.fn.DataTable.isDataTable('#tablaComPendientes')){
                        $("#tablaComPendientes").dataTable().fnDestroy();
                    }
                    var html = data.tabla;
                    $("#listComPendientes").html(html);
                    $("#tablaComPendientes").dataTable({
                        "bFilter": false,
                        "bSort": false,
                        "bLengthChange": false,
                        "processing": true,
                        "bAutoWidth": true,
                        "bPaginate": false,
                        "bInfo": false,
                        "aoColumnDefs": [
                            {'sClass': " text-center", 'aTargets': [0,1,3]},
                            {'sClass': " text-right", 'aTargets': [5]},
                            {'sClass': "centrado boton-tabla", 'aTargets': [6]},
                            {'orderable': false, 'aTargets': [0]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            $(".addcompra").tooltip();
                        },
                        "order": [
                            [1, "asc"]
                        ]
                    });
                   /* $('#tablaComPendientes tbody').on('click','tr',function(){
                        $(this).css("background-color",$(this).css("background-color") === "rgb(176, 190, 217)"?"#FFFFFF":"#B0BED9");
                    });*/
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var confirm_record_rec = function (a) {
        id = $(a).attr("id");
        $("#entfecgenpro").val($(a).attr("data-fec"));
        $('#data_5').datepicker('update',fecAct);
        $("#entregaProd").modal("show");
    };

    var RecibirPro = function(){
        entregaPro.start();
        $.ajax({
            type: 'POST',
            url: "recibir_compra_rec",
            dataType: 'json',
            data : {id:id,fec:$("#fecsalpro").val(),fecgen:$("#entfecgenpro").val()},
            success: function(data){
                if(data !==null){
                    if(data.dato === "OK"){
                        uploadMsnSmall("Compra confirmada correctamente.",data.dato);
                        $("#entregaProd").modal("hide");
                        CargarComxRecibir();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Fecha Recepcion es incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Compra incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Usuario incorrecto inicie session.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Fecha Recepcion es menor que la de registro.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                    }
                    entregaPro.stop();
                }else{
                    entregaPro.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
                entregaPro.stop();
            }
        });
    };

    var viewPrintDetails = function (a) {
        var method = "downloadProductxCompra";
        var parameters = "idcom=" + $(a).attr("data-id");
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var addPrductBarcode = function(elem){
        agregar.start();
        $.ajax({
            type: 'post',
            url: "addpro_barcode_almacen",
            dataType: 'json',
            data:{codepro:$(elem).val(),"alm":ida},
            success: function (respJson){
                if (respJson !== null) {
                    if(respJson.dato === "OK"){
                        $("#iddetpro").val(respJson.objeto.id);
                        $("#namepro").val(respJson.msj);
                        $("#codetpro").val(respJson.objeto.codigo);
                        var idpro = parseFloat($("#iddetpro").val());
                        var stock = parseFloat(respJson.objeto.stockActual);
                        stockSel = stock;
                        for (var i = 0; i < LisIdPro.length; i++) {
                            if(idpro === parseFloat(LisIdPro[i]) ){
                                stockSel = stockSel - LisCant[i];
                            }
                        }
                        $("#txtCanti").val("1.00");
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
                uploadMsnSmall('Â¡Se encontrÃ³ un problema en el servidor!','ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregmov").val(fecAct);
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
        $("#data_5").datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format:"dd-mm-yyyy",
            endDate:new Date(),
            todayHighlight: true
        });
        $("#btnEntregaPro").on("click",RecibirPro);
        NumeroDosDecimalesxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreCompra"));
        $("#div-fecregmov").datepicker().on('show.bs.modal', function(event){
            if ($("#div-movimientos").hasClass("bloqueDatos")){
                $('.datepicker-dropdown').each(function(){
                    this.style.setProperty('z-index','10070','important');
                });
            }
        });
        $("#btnViewCompras").on("click",function(){
            $("#viewListCompras").modal("show");
            CargarComxRecibir();
        });
        $("#btnViewPrintCompras").on("click",printListCompras);
        $("#btnViewSearchCompra").on("click",function () {
            searchCompra.start();
            $.ajax({
                type:'POST',
                url:"view_copmpras_sku",
                dataType: 'json',
                data : {numcom:$("#numCompra").val(),idalm:$("#cboCompLiAlmacen").val()},
                success: function(data){
                    if(data !== null){
                         var html = data.tabla;
                        $("#listadoCompras").html(html);
                        $(".addcompra").tooltip();
                        searchCompra.stop();
                    }else{
                        searchCompra.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    searchCompra.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnGenMov").on("click",GenDocMovimiento);
        $("#btnRecibir").on("click",RecibirMovimiento);
        $("#btnGuardar").on("click",function(){
            if(validarMovimiento()){save();}
        });
        $("#btnOpenModalProducto").on("click",function(){
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreCompra").val("");
            $('#modalSearchProducto').modal('show');
            $("#txtDescProducto").focus();
        });
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}});
        $("#btnAddItem").on("click",AddItem);
        $("#saltipoent").on("change",function(){
            LoadSerieAlm(ida);
        });
        $("#btnViewPrintProduct").on("click",GenerarProductoxTransferencia);
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#cboLiTipDoc,#cboLiTipMov,#cboLiUsuario,#cboLiEstado,#cboLiAlmacen").on("change",function(){
            table._fnDraw();
        });
        $("#txtBarcode").on("keypress",function(event){
            if(event.keyCode === 13){///CON EL LECTOR SE ESCRIBE EL CODIGO va generando un evento y al final da enter, se captura el enter y arroja todo el texto completo.
                if(!agregar.isLoading() && $("#btnOpenModalProducto").attr("disabled") !== "disabled" ){
                    addPrductBarcode($(this));
                }
            }
        });
        $("#viewMovimiento").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewMovimiento:visible").each(ModalCompleto);
        });
        $("#viewListCompras").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewListCompras:visible").each(ModalCompleto);
        });
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
        $("#modalSearchProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProducto:visible").each(ModalCompleto);
        });
        $('#newSale').on('shown.bs.modal',function(){
            $("#txtBarcode").focus();
        });
        $.ajax({
            type: 'post',
            url: "mant_movimiento",
            dataType: 'json',
            data:{i:2},
            success: function (respJson) {
                if (respJson !== null) {
                    busqueda = respJson.busqueda;
                    $("#cboLiAlMovimiento").html(respJson.htA);
                    $("#cboCompLiAlmacen").html(respJson.htTrasAlm);
                    $("#cboLiAlmacen").html((respJson.usu === "1" ? "<option value='0'>--TODOS--</option>" : "")+respJson.htA);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+respJson.htU);
                    $("#cboLiTipDoc").html("<option value='0'>--TODOS--</option>"+respJson.htT);
                    $("#cboLiTipMov").html( "<option value='0'>--TODOS--</option>"+respJson.htTMov);
                    $("#txttransporte").html("<option value='0'>--SELECCIONE--</option>"+respJson.htU);
                    $("#txtalmacendes").html("<option value='0'>--SELECCIONE--</option>"+respJson.htTrasAlm);
                    $("#saltipoent").html("<option value='0'>--SELECCIONE--</option>"+respJson.htSal);
                    $("#tipmovimiento").html( "<option value='0'>--SELECCIONE--</option>"+respJson.htRegTMov);
                    $(".selectpicker").selectpicker("refresh");
                    ListarsearchPro();
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
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#numCompra").on("keyup",function (e) {
            if(e.keyCode===13){
                $("#btnViewSearchCompra").trigger("click");
            }
        });
        $("#cboBuscar").on("change",function () {
            $("#txtDescProducto").focus();
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
        confirm_movimiento:function(a){
            confirm_movimiento(a);
        },
        viewDetails:function(a){
            viewDetails(a);
        },
        recepcion_movimiento:function(a) {
            recepcion_movimiento(a);
        },
        addIdCompra:function (a) {
            addIdCompra(a);
        },
        delIdCompra:function (a){
            delIdCompra(a);
        },
        confirm_record_rec:function (a) {
            confirm_record_rec(a);
        },
        viewPrintDetails:function (a) {
            viewPrintDetails(a);
        }
    };
}();
jQuery(document).ready(function () {
    Movimiento.init();
});