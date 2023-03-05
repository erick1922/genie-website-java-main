var Compra = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var entrega = Ladda.create(document.querySelector('#btnEntrega'));
    var entregaPro = Ladda.create(document.querySelector("#btnEntregaPro"));
    var producto = Ladda.create(document.querySelector('#btnGuardarProducto'));
    var proveedor = Ladda.create(document.querySelector('#btnGuardarProveedor'));
    var categoria = Ladda.create(document.querySelector("#btnGuardarCategoria"));
    var marca = Ladda.create(document.querySelector("#btnGuardarMarca"));
    var unidad = Ladda.create(document.querySelector("#btnGuardarUnidad"));
    var material = Ladda.create(document.querySelector("#btnGuardarMaterial"));
    var table;
    var tableProveedor;
    var tableProducto;
    var LisIdPro;
    var LisCant;
    var LisUndPro;
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
    var defrecepcion = 0;
    var valor = "";
    var busqueda = "";
    var propiedades = new Array();

    var ListCompras = function(){
        table = $("#tblCompras").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_compras_insumo",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idalm = $("#cboLiAlmacen").val();
                d.idusu = $("#cboLiUsuario").val();d.idtipdoc = $("#cboLiTipDoc").val();
                d.est = $("#cboLiEstado").val();d.prov = $("#txtBusProveedor").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-right",'aTargets': [6]},
                {'sClass':"centrador",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListarsearchProveedores = function(){
        tableProveedor = $("#tblProveedor").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_search_proveedores",data:function(d){d.desc = $("#txtDescProveedor").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [4]},
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
            "ajax" : {type:'POST',url:"list_insumos_search",data:function(d){d.tipoprod = $("#cboLiTipoProducto").val();
                d.desc = $("#txtDescProducto").val();d.tipo = $("#cboLiTipo").val();
                d.buspor = $("#cboBuscar").val()}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
        $("#tblProducto tbody").on("dblclick", "tr", function() {
            /* var buttons = $(this).find("td").eq(6).html();
             console.log(buttons);
             // var btn = $(buttons).find("button").eq(0).html();
             var arr = jQuery.makeArray( buttons );
             console.log(arr[0]);*/
            //$("#"+$($(this).find("td").eq(6).html()).attr("id")).trigger("click");
        });
    };

    var Limpiar = function(){
        $("#frmDataCompra")[0].reset();
        $("#frmDataProductos")[0].reset();
        $('#data_3').datepicker('update',fecAct);
        fila = -1;
        acc = "";
        iddet = 0;
        LisIdPro = new Array();
        LisUndPro = new Array();
        LisCant = new Array();
        LisPreCom = new Array();
        LisDesc = new Array();
        LisCodigo = new Array();
        LisSubTotal = new Array();
        LisEliminados = new Array();
        LisIdmod = new Array();
        LisAcciones = new Array();
    };

    var Limpiar_Categoria = function(){
        $.each($("#frmCategoria input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_Marca = function(){
        $.each($("#frmMarca input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_Unidad = function(){
        $.each($("#frmUnidad input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var ObtenerNum = function(){
        $.ajax({
            type: 'post',
            url: "init_compra",
            dataType: 'json',
            data:{id:$("#cboLiAlCompra").val()},
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
        $("#titulo").html("Registrar Compra");
        Accion = "R";
        var opt = $('option:selected', $("#cboLiAlCompra")).text();
        $("#txtalmacen").val(opt);
        $("#txtTotal").val("0.00");
        ObtenerNum();
        $("#btnOpenModalProducto").prop("disabled",false);
        $("#newSale").modal("show");
    };

    var addProducto = function(a){
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val($(a).attr("data-name"));
        $("#codetpro").val($(a).attr("data-codigo"));
        $("#unddetpro").val($(a).attr("data-undcom"));
        $("#txtCanti").val("1");
        $("#modalSearchProducto").modal("hide");
        $("#txtCanti").focus();
    };

    var addProveedor = function(a){
        $("#idprov").val($(a).attr("data-id"));
        $("#txtproveedor").val($(a).attr("data-name"));
        $("#modalSearchProveedor").modal("hide");
    };

    var AddItem = function(){
        agregar.start();
        if(validarItem()){
            LisIdPro.push($("#iddetpro").val());
            LisUndPro.push($("#unddetpro").val());
            LisDesc.push($("#namepro").val());
            LisCodigo.push($("#codetpro").val());
            LisCant.push($("#txtCanti").val());
            LisPreCom.push($("#txtPreCom").val());
            LisSubTotal.push(Redondear2(parseFloat($("#txtCanti").val())*parseFloat($("#txtPreCom").val())));
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
            $("#txtPreCom").val("");
            $("#btnOpenModalProducto").prop("disabled",false);
            fila = -1;
            CargarTabla();
            agregar.stop();
        }
    };

    var validarCompra = function(){
        if( $("#idprov").val() === "" || $("#idprov").val() === "0" ){
            uploadMsnSmall("No ha Seleccionado Proveedor","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#cboLiAlCompra").val() === "" || $("#cboLiAlCompra").val() === "0" ){
            uploadMsnSmall("Almacen Incorrecto","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length < 9){
            uploadMsnSmall("Numero de Orden Incorrecta","ALERTA");
            cargando.stop();
            return false;
        }
        if(!moment($("#fecregcom").val(),"DD-MM-YYYY", true).isValid()){
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
                uploadMsnSmall("Precio Compra Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }
        return true;
    };

    var quitarItem = function(a){
        if(fila < 0 && $("#namepro").val()===""){
            var pos = $(a).attr("data-pos");
            if(Accion === "M" && LisAcciones[pos]!=="N"){
                LisEliminados.push(LisIdmod[pos]);
            }
            LisIdPro.splice(pos,1);
            LisUndPro.splice(pos,1);
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
            $("#unddetpro").val(LisUndPro[pos]);
            $("#txtCanti").val(LisCant[pos]);
            $("#txtPreCom").val(Redondear2(LisPreCom[pos]));
            LisIdPro.splice(pos,1);
            LisUndPro.splice(pos,1);
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

    var CargarTabla = function(){
        $("#tblDetalles").html("");
        var total = 0;
        for (var i = 0; i < LisIdPro.length; i++) {
            total+=parseFloat(LisSubTotal[i]);
            $("#tblDetalles").append("<tr>"+
                "<td class='text-center'>"+LisCodigo[i]+"</td>"+
                "<td class='text-left'>"+LisDesc[i]+"</td>"+
                "<td class='text-right'>"+LisCant[i]+"</td>"+
                "<td class='text-left'>"+LisUndPro[i]+"</td>"+
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
        $("#txtTotal").val(Redondear2(total));
    };

    var validarItem = function(){
        if($("#iddetpro").val() === "" || $("#iddetpro").val() === "0"){
            uploadMsnSmall("No ha Seleccionado Producto","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtCanti").val()==="" || parseFloat($("#txtCanti").val())<=0){
            uploadMsnSmall("Cantidad Incorrecta","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtPreCom").val()==="" || parseFloat($("#txtPreCom").val())<=0){
            uploadMsnSmall("Precio Compra Incorrecto","ALERTA");
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

    var save = function(){
        cargando.start();
        var url = Accion === "R"?"save_compra":"update_compra";
        var accion = Accion === "R"?"save":"update";
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data:{idprov:$("#idprov").val(),idalm:$("#cboLiAlCompra").val(),fec:$("#fecregcom").val(),
                txtnum:$("#txtnum").val(),"idprods[]":LisIdPro,"idcan[]":LisCant,"idpre[]":LisPreCom,accion:accion,
                "iddet[]":LisIdmod,"idacciones[]":LisAcciones,"eliminados[]":LisEliminados,id:id},
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
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Proveedor Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Almacen Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Inicie Session Usuario en una nueva pestaña.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Compra Incorrecta.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Fecha Incorrecta.",'ALERTA');}
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
            url: "view_compra",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#titulo").html("Modificar Compra");
                    Accion = "M";
                    id = respJson.id;
                    $("#txtven").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#idprov").val(respJson.otbProveedor.id);
                    $("#txtproveedor").val(respJson.otbProveedor.razonSocial);
                    $("#txtnum").val(respJson.numOrden);
                    $("#txtalmacen").val(respJson.otbAlmacen.nombre);
                    $("#tippago").selectpicker('val',respJson.otbFormaPago.id);
                    var fecreg = moment(respJson.fecGenerada).format('DD-MM-YYYY');
                    $('#data_3').datepicker('update',fecreg);
                    for (var i = 0; i < respJson.tbDetallecompras.length; i++) {
                        var deta = respJson.tbDetallecompras[i];
                        LisIdPro.push(deta.otbProducto.id);
                        LisUndPro.push(deta.otbProducto.unidadCompra.nombre);
                        LisCodigo.push(deta.otbProducto.codigo);
                        LisDesc.push((deta.otbProducto.desCategoria !== null ? (deta.otbProducto.desCategoria+" ") : "" )+(deta.otbProducto.desMarca !== null ? (deta.otbProducto.desMarca+" ") : "" )+" "+deta.otbProducto.nombre + (deta.otbProducto.modelo !== null ? " "+deta.otbProducto.modelo:""));
                        LisCant.push(Redondear0(deta.cantidad));
                        LisPreCom.push(Redondear2(deta.preUni));
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

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar la Compra?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_compra',
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

    var confirm_record = function(a){
        id = $(a).attr("id");
        $("#frmEntrega")[0].reset();
        $("#entfecgen").val($(a).attr("data-fec"));
        $("#saltipo").selectpicker('val','0');
        $('#data_4').datepicker('update',fecAct);
        $("#chkRecep").prop("checked",!(defrecepcion > 1));
        $("#chkRecep").val(defrecepcion > 1 ? "0" : "1");
        $("#chkRecep").iCheck('update');
        $("#entrega").modal("show");
    };

    var confirm_record_rec = function(a){
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
                        table._fnDraw();
                        $("#entregaProd").modal("hide");
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

    var Recibir = function(){
        entrega.start();
        $.ajax({
            type: 'POST',
            url: "recibir_compra",
            dataType: 'json',
            data : {id:id,num:$("#numdocu").val(),fec:$("#fecsal").val(),idtip:$("#saltipo").val(),fecgen:$("#entfecgen").val(),chkRec:$("#chkRecep").val()},
            success: function(data){
                if(data !==null){
                    if(data.dato === "OK"){
                        uploadMsnSmall("Compra confirmada correctamente.",data.dato);
                        table._fnDraw();
                        $("#entrega").modal("hide");
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Tipo de Documento Incorrecto",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Fecha Incorrecta",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Fecha Recepcion es menor que la de registro.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Selección de recepcion incorrecta.",'ALERTA');}
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
                uploadMsnSmall(jqXHR.responseText,'ERROR');
                entrega.stop();
            }
        });
    };

    var viewDetails = function(a){
        $.ajax({
            type: 'post',
            url: "view_compra",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    id = $(a).attr("id");
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#verprov").val(respJson.otbProveedor.razonSocial);
                    $("#vernum").val(respJson.numOrden);
                    $("#veralm").val(respJson.otbAlmacen.nombre);
                    $("#vertipodoc").val( (respJson.otbTipoDoc!==null?respJson.otbTipoDoc.nombre:"") + (respJson.numDocumento!==null?" "+respJson.numDocumento:"")  );
                    var fecreg = moment(respJson.fecGenerada).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#verigv").val(Redondear2(respJson.preIgv));
                    $("#versub").val(Redondear2(respJson.preSub));
                    $("#vertot").val(Redondear2(respJson.preTotal));
                    var html = "";
                    var cantPro = 0;
                    for (var i = 0; i < respJson.tbDetallecompras.length; i++){
                        var deta = respJson.tbDetallecompras[i];
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+deta.otbProducto.codigo+"</td>";
                        html+="<td class='text-center'>"+deta.otbProducto.barcodeProducto+"</td>";
                        html+="<td>"+ (deta.otbProducto.desCategoria !== null ? (deta.otbProducto.desCategoria+" ") : "" ) +(deta.otbProducto.desMarca !== null ? (deta.otbProducto.desMarca+" ") : "" )+" "+deta.otbProducto.nombre + (deta.otbProducto.modelo !== null ? " "+deta.otbProducto.modelo:"")+"</td>";
                        html+="<td class='text-right'>"+Redondear0(deta.cantidad)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preUni)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(deta.preTotal)+"</td>";
                        html+="</tr>";
                        cantPro = cantPro + parseFloat(deta.cantidad);
                    }
                    html+="<tr>";
                    html+="<td class='text-right font-bold' colspan='4' style='font-size:13px;'>"+"TOTAL DE PRODUCTOS"+"</td>";
                    html+="<td colspan='3' class='font-bold' style='font-size:13px;'>"+Redondear0(cantPro)+"</td>";
                    html+="</tr>";
                    $("#listado").html(html);
                    $("#viewCompra").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var LimpiarProducto = function () {
        $.each($("#frmProducto input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var NuevoProducto = function(){
        LimpiarProducto();
        $("#imgFoto").html("");
        $("#titProducto").text("Nuevo Producto");
        style_error_cbo_final("#cboMarca",false);
        style_error_cbo_final("#cboCategoria",false);
        style_error_cbo_final("#cboUnidad",false);
        style_error_cbo_final("#cboUndCompra",false);
        style_error_cbo_final("#cboUndAlmacen",false);
        style_error_cbo_final("#cboCaracteristica",false);
        style_error_cbo_final("#cboTipoProducto",false);
        $("#div-tipo-producto").show();
        $("#accion").val("save");
        $("#frmProducto #id").val("0");
        $("#cboMarca").selectpicker('val','0');
        $("#cboCategoria").selectpicker('val','0');
        $("#cboCaracteristica").selectpicker('val','0');
        $("#cboUnidad").selectpicker('val',valor);
        $("#cboUndCompra").selectpicker('val',valor);
        $("#cboUndAlmacen").selectpicker('val',valor);
        $("#minimo").val("1");
        $("#maximo").val("5");
        $("#chkSku").prop("checked",false);
        $("#chkSku").val("0");
        $("#chkSku").iCheck('update');
        $("#cboTipoProducto").change();
        $("#sku").attr("readonly","readonly");
        $("#modalProducto").modal("show");
    };

    var NuevoProveedor = function(){
        $.each($("#frmProveedor input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        $("#modalProveedor").modal("show");
    };

    var SaveProducto = function(){
        producto.start();
        var datos = new FormData($("#frmProducto")[0]);
        datos.append('accion',$("#accion").val());
        datos.append('id',$("#frmProducto #id").val());
        datos.append('cboTipoProducto',$("#cboTipoProducto").val());
        datos.append('cboCategoria',$("#cboCategoria").val());
        datos.append('cboMarca',$("#cboMarca").val());
        datos.append('cboUnidad',$("#cboUnidad").val());
        datos.append('cboUndCompra',$("#cboUndCompra").val());
        datos.append('cboUndAlmacen',$("#cboUndAlmacen").val());
        datos.append('cboCaracteristica',$("#cboCaracteristica").val());
        datos.append('desc',$('#frmProducto #desc').val());
        datos.append('modelo',$('#modelo').val());
        datos.append('minimo',$('#minimo').val());
        datos.append('maximo',$('#maximo').val());
        datos.append('precio1',$("#precio1").val());
        datos.append('precio2',$("#precio2").val());
        datos.append('precio3',$("#precio3").val());
        datos.append('estado',"H");
        datos.append('chkSku',$("#chkSku").val());
        datos.append('sku',$("#sku").val());
        $.ajax({
            type: 'post',
            url: "save_producto",
            data:datos,
            dataType: 'json',
            contentType:false,
            processData:false,
            cache: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',function(e){progressHandlingFunction(e,$("#bararchivo"));}, false); // For handling the progress of the upload
                }
                return myXhr;
            },
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#cboBuscar").selectpicker('val','N');
                        $("#cboLiTipoProducto").selectpicker('val',$("#cboTipoProducto").val());
                        var descat = "";
                        var desmar = "";
                        var desmat = "";
                        var desnom = "";
                        if( $("#cboCategoria").val() !== "0" ){
                            descat = $('option:selected',$("#cboCategoria")).text()+ " ";
                        }
                        if( $("#cboMarca").val() !== "0" ){
                            desmar = $('option:selected',$("#cboMarca")).text()+ " ";
                        }
                        if( $('#frmProducto #desc').val() !== "" ){
                            desnom = $('#frmProducto #desc').val()+ " ";
                        }
                        if( $("#cboCaracteristica").val() !== "0" ){
                            desmat = $('option:selected',$("#cboCaracteristica")).text();
                        }
                        var texto = descat+desmar+desnom+desmat;
                        $("#txtDescProducto").val(texto);
                        producto.stop();
                        $("#modalProducto").modal("hide");
                        tableProducto._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        reiniciar("bararchivo");
                        $("#txtDescProducto").focus();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmProducto #desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#cboMarca",true);}
                                if(respJson.listado[i] === "E3"){style_error_cbo_final("#cboCategoria",true);}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#cboUnidad",true);}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#minimo");}
                                if(respJson.listado[i] === "E6"){estilo_error(true,"#maximo");}
                                if(respJson.listado[i] === "E7"){estilo_error(true,"#precio1");}
                                if(respJson.listado[i] === "E8"){estilo_error(true,"#precio2");}
                                if(respJson.listado[i] === "E9"){estilo_error(true,"#precio3");}
                                if(respJson.listado[i] === "E10"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E11"){estilo_error(true,"#minimo");uploadMsnSmall("Stock Minimo debe de ser Menor que el Maximo.",'ALERTA');}
                                if(respJson.listado[i] === "E12"){estilo_error(true,"#precio1");}
                                if(respJson.listado[i] === "E13"){estilo_error(true,"#precio2");}
                                if(respJson.listado[i] === "E14"){estilo_error(true,"#precio3");}
                                if(respJson.listado[i] === "E15"){uploadMsnSmall("Seleccion SKU incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E16"){estilo_error(true,"#sku");}
                                if(respJson.listado[i] === "E17"){style_error_cbo_final("#cboUndCompra",true);}
                                if(respJson.listado[i] === "E18"){style_error_cbo_final("#cboUndAlmacen",true);}
                                if(respJson.listado[i] === "E19"){style_error_cbo_final("#cboCaracteristica",true);}
                                if(respJson.listado[i] === "E20"){estilo_error(true,"#modelo");}
                                if(respJson.listado[i] === "E21"){estilo_error(true,"#modelo");uploadMsnSmall("La descripcion del modelo debe de ser menor a 20 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        producto.stop();
                        reiniciar("bararchivo");
                    }
                }else{
                    producto.stop();
                    reiniciar("bararchivo");
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                producto.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                reiniciar("bararchivo");
            }
        });
    };

    var SaveProveedor = function(){
        proveedor.start();
        $.ajax({
            type: 'post',
            url: "save_proveedor",
            dataType: 'json',
            data:$("#frmProveedor").serialize()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        proveedor.stop();
                        $("#txtDescProveedor").val($("#razon").val());
                        $("#modalProveedor").modal("hide");
                        tableProveedor._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#ruc");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#razon");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#dir");}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#correo");}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        proveedor.stop();
                    }
                }else{
                    proveedor.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                proveedor.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var new_categoria = function(){
        Limpiar_Categoria();
        $("#modalCategoria").modal("show");
        $("#frmCategoria #desc").focus();
    };

    var new_marcas = function(){
        Limpiar_Marca();
        $("#modalMarca").modal("show");
        $("#frmMarca #desc").focus();
    };

    var new_unidades = function(){
        Limpiar_Unidad();
        $("#modalUnidad").modal("show");
        $("#frmUnidad #desc").focus();
    };

    var ReloadCategorias = function(){
        $.ajax({
            type: 'post',
            url: "select_categoria",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                    $("#cboCategoria").selectpicker("refresh");
                    var categorias = $("#cboCategoria option");
                    var cat = $("#frmCategoria #desc").val().toUpperCase();
                    var idcat = 0;
                    for(var i=0;i<categorias.length;i++){
                        if(categorias[i].text === cat){
                            idcat = parseInt(categorias[i].value);
                            $("#cboCategoria").selectpicker("val",idcat);
                            style_error_cbo_final("#cboCategoria",false);
                            i = categorias.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadMarcas = function(){
        $.ajax({
            type: 'post',
            url: "select_marca",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                    $("#cboMarca").selectpicker("refresh");
                    var marcas = $("#cboMarca option");
                    var mar = $("#frmMarca #desc").val().toUpperCase();
                    var idmar = 0;
                    for(var i=0;i<marcas.length;i++){
                        if(marcas[i].text === mar){
                            idmar = parseInt(marcas[i].value);
                            $("#cboMarca").selectpicker("val",idmar);
                            style_error_cbo_final("#cboMarca",false);
                            i = marcas.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadUnidades = function(){
        $.ajax({
            type: 'post',
            url: "select_unidad",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    var idundventa = $("#cboUnidad").val();
                    var idundcompra = $("#cboUndCompra").val();
                    var idundalmacen = $("#cboUndAlmacen").val();
                    $("#cboUnidad").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUndCompra").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUndAlmacen").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUnidad,#cboUndCompra,#cboUndAlmacen").selectpicker("refresh");
                    var tipo = $("#tipound").val();
                    var undVenta = $("#cboUnidad option");
                    var undCompra = $("#cboUndCompra option");
                    var undAlmacen = $("#cboUndAlmacen option");
                    var unidad = $.trim($("#frmUnidad #descU").val().toUpperCase());
                    var idund = 0;
                    if(tipo === "V"){
                        for(var i=0;i<undVenta.length;i++){
                            if(undVenta[i].text === unidad){
                                idund = parseInt(undVenta[i].value);
                                $("#cboUnidad").selectpicker("val",idund);
                                style_error_cbo_final("#cboUnidad",false);
                                i = undVenta.length + 2;
                            }
                        }
                        $("#cboUndCompra").selectpicker("val",idundcompra);
                        $("#cboUndAlmacen").selectpicker("val",idundalmacen);
                    }else if(tipo === "C"){
                        for(var x=0;x<undCompra.length;x++){
                            if(undCompra[x].text === unidad){
                                idund = parseInt(undCompra[x].value);
                                $("#cboUndCompra").selectpicker("val",idund);
                                style_error_cbo_final("#cboUndCompra",false);
                                x = undCompra.length + 2;
                            }
                        }
                        $("#cboUnidad").selectpicker("val",idundventa);
                        $("#cboUndAlmacen").selectpicker("val",idundalmacen);
                    }else if(tipo === "A"){
                        for(var c=0;c<undAlmacen.length;c++){
                            if(undAlmacen[c].text === unidad){
                                idund = parseInt(undAlmacen[c].value);
                                $("#cboUndAlmacen").selectpicker("val",idund);
                                style_error_cbo_final("#cboUndAlmacen",false);
                                c = undAlmacen.length + 2;
                            }
                        }
                        $("#cboUnidad").selectpicker("val",idundventa);
                        $("#cboUndCompra").selectpicker("val",idundcompra);
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var save_categoria = function(){
        categoria.start();
        $.ajax({
            type: 'post',
            url: "save_categoria",
            dataType: 'json',
            data:$("#frmCategoria").serialize()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        categoria.stop();
                        $("#modalCategoria").modal("hide");
                        ReloadCategorias();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmCategoria #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmCategoria #desc");uploadMsnSmall("EL Nombre de Categoria debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        categoria.stop();
                    }
                }else{
                    categoria.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                categoria.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_caracteristica = function(){
        material.start();
        $.ajax({
            type: 'post',
            url: "save_caracterisitica",
            dataType: 'json',
            data:$("#frmMaterial").serialize()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        material.stop();
                        $("#modalMaterial").modal("hide");
                        ReloadCaracteristica();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmMaterial #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmMaterial #descM");uploadMsnSmall("EL Nombre del Material debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        material.stop();
                    }
                }else{
                    material.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                material.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_marca = function(){
        marca.start();
        $.ajax({
            type: 'post',
            url: "save_marca",
            dataType: 'json',
            data:$("#frmMarca").serialize()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        marca.stop();
                        $("#modalMarca").modal("hide");
                        ReloadMarcas();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmMarca #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmMarca #desc");uploadMsnSmall("EL Nombre de Marca debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        marca.stop();
                    }
                }else{
                    marca.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                marca.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_unidad = function(){
        unidad.start();
        $.ajax({
            type: 'post',
            url: "save_unidad",
            dataType: 'json',
            data:$("#frmUnidad").serialize()+"&desc="+$("#descU").val()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        unidad.stop();
                        $("#modalUnidad").modal("hide");
                        ReloadUnidades();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#desc");uploadMsnSmall("EL Nombre de Unidad de Medida debe de ser menos de 30 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#abrev");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        unidad.stop();
                    }
                }else{
                    unidad.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                unidad.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var GenerarProductoxCompra = function(){
        var method = "downloadProductxCompra";
        var parameters = "idcom=" + id;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
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

    var checkSku = function(e,a){
        var isChecked = e.currentTarget.checked;
        if(isChecked){
            $("#sku").removeAttr("readonly");
        }else{
            $("#sku").attr("readonly","readonly");
        }
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var checkRecepcion = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var Limpiar_Caracteristica = function(){
        $.each($("#frmMaterial input"),function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var new_caracteristica = function () {
        Limpiar_Caracteristica();
        $("#modalMaterial").modal("show");
        $("#frmMaterial #descM").focus();
    };

    var ReloadCaracteristica = function(){
        $.ajax({
            type: 'post',
            url: "select_caracteristica",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboCaracteristica").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htCar);
                    $("#cboCaracteristica").selectpicker("refresh");
                    var materiales = $("#cboCaracteristica option");
                    var mat = $("#frmMaterial #descM").val().toUpperCase();
                    var idmat = 0;
                    for(var i=0;i<materiales.length;i++){
                        if(materiales[i].text === mat){
                            idmat = parseInt(materiales[i].value);
                            $("#cboCaracteristica").selectpicker("val",idmat);
                            style_error_cbo_final("#cboCaracteristica",false);
                            i = materiales.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var view_record_insumo = function (a) {
        LimpiarProducto();
        $.ajax({
            type:'post',
            url:"view_producto",
            dataType:'json',
            data:{id:$(a).attr("data-id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#cboTipoProducto").selectpicker('val',respJson.oTipoProducto.id);
                    $("#cboTipoProducto").change();
                    $("#div-tipo-producto").hide();
                    $("#frmProducto #div-estado").show();
                    $("#imgFoto").html(respJson.rutaImagen !==null?"<img src='resources/images/"+respJson.rutaImagen+"' width='200px;' />":"");
                    $("#frmProducto #id").val(respJson.id);
                    $("#frmProducto #desc").val(respJson.nombre);
                    $("#minimo").val(Redondear2(respJson.stockMinimo));
                    $("#maximo").val(Redondear2(respJson.stockMaximo));
                    $("#modelo").val(respJson.modelo);
                    $("#precio1").val(Redondear2(respJson.precioMenor1));
                    $("#precio2").val(Redondear2(respJson.precioInter2));
                    $("#precio3").val(Redondear2(respJson.precioMayor3));
                    $("#cboCaracteristica").selectpicker('val',respJson.caracteristica1 !== null ? respJson.caracteristica1.id : "0");
                    $("#cboMarca").selectpicker('val',respJson.otbMarca!== null ? respJson.otbMarca.id : "0");
                    $("#cboCategoria").selectpicker('val',respJson.otbCategoria!==null? respJson.otbCategoria.id : "0");
                    $("#cboUnidad").selectpicker('val',respJson.otbUnidad!==null ? respJson.otbUnidad.id : "0");
                    $("#cboUndCompra").selectpicker('val',respJson.unidadCompra!==null ? respJson.unidadCompra.id : "0");
                    $("#cboUndAlmacen").selectpicker('val',respJson.unidadStock!==null ? respJson.unidadStock.id : "0");
                    $("#frmProducto #estado").selectpicker('val',respJson.estado);
                    $("#sku").val(respJson.barcodeProducto);
                    $("#chkSku").prop("checked",true);
                    $("#chkSku").val("1");
                    $("#chkSku").iCheck('update');
                    $("#titProducto").html("Modificar Producto");
                    $("#frmProducto #accion").val("update");
                    $("#modalProducto").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregcom,#fecsal").val(fecAct);
        FormatoFecha($("#data_1"),"dd-mm-yyyy");
        FormatoFecha($("#data_2"),"dd-mm-yyyy");
        FormatoFecha($("#data_3"),"dd-mm-yyyy");
        FormatoFecha($("#data_4"),"dd-mm-yyyy");
        FormatoFecha($("#data_5"),"dd-mm-yyyy");
        $("#data_3").datepicker().on('show.bs.modal', function(event){
            if ($("#div-compras").hasClass("bloqueDatos")){
                $('.datepicker-dropdown').each(function(){
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        NumeroEntero($("#ruc"),11);
        $("#ruc").css("text-align","left");
        NumeroEnteroxDefectoUno($("#txtCanti"));
        NumeroDosDecimales($("#txtPreCom"));
        NumeroEntero($("#minimo"));
        NumeroEntero($("#maximo"));
        NumeroDosDecimales($("#precio1"));
        NumeroDosDecimales($("#precio2"));
        NumeroDosDecimales($("#precio3"));
        $("#addBtnCaracteristica").on("click",new_caracteristica);
        $("#btnGuardarMaterial").on("click",save_caracteristica);
        $("#addBtnCategoria").on("click",new_categoria);
        $("#btnGuardarCategoria").on("click",save_categoria);
        $("#addBtnMarca").on("click",new_marcas);
        $("#btnGuardarMarca").on("click",save_marca);
        $("#addBtnUnidad").on("click",function () {
            new_unidades();
            $("#tipound").val("V");
        });
        $("#addBtnUnidadCompra").on("click",function () {
            new_unidades();
            $("#tipound").val("C");
        });
        $("#addBtnUnidadAlmacen").on("click",function () {
            new_unidades();
            $("#tipound").val("A");
        });
        $("#btnGuardarUnidad").on("click",save_unidad);
        $("#btnNewSale").on("click",new_record);
        $("#btnEntrega").on("click",Recibir);
        $("#btnEntregaPro").on("click",RecibirPro);
        $("#btnGuardar").on("click",function(){
            if(validarCompra()){save();}
        });
        $("#btnOpenModalProducto").on("click",function(){
            $("#iddetpro,#namepro,#codetpro,#txtCanti,#txtPreCom").val("");
        });
        $("#txtBusProveedor").on("keyup",function(){table._fnDraw();});
        $("#btnPrint").on("click",function () {
            var opt = $('option:selected', $("#cboLiAlmacen")).text();
            var method = "downloadCompras";
            var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idalm="+$("#cboLiAlmacen").val()+"&nom="+opt+"&prov="+$("#txtBusProveedor").val();
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });
        $("#btnSearchModalProveedor").on("click",function(){tableProveedor._fnDraw();});
        $("#txtDescProveedor").on("keyup",function(e){if(e.keyCode===13){tableProveedor._fnDraw();}});
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#txtDescProducto").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}});
        $("#btnAddItem").on("click",AddItem);
        $("#btnNewProducto").on("click",NuevoProducto);
        $("#btnNewProveedor").on("click",NuevoProveedor);
        $("#btnGuardarProducto").on("click",SaveProducto);
        $("#btnGuardarProveedor").on("click",SaveProveedor);
        $("#cboMarca").on("change",function(){ style_error_cbo_final('#cboMarca',false);});
        $("#cboCategoria").on("change",function(){ style_error_cbo_final('#cboCategoria',false);});
        $("#cboUnidad").on("change",function(){ style_error_cbo_final('#cboUnidad',false);});
        keyup_input_general_3("#frmProducto input", "#frmProducto", "#modalProducto");
        $("#btnViewPrintProduct").on("click",GenerarProductoxCompra);
        $('#chkSku').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkSku(event,$(this));
        });
        $("#chkRecep").iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkRecepcion(event,$(this));
        });
        keyup_input_general_3("#frmProveedor input", "#frmProveedor", "#modalProveedor");
        $("#cboLiAlmacen,#cboLiTipDoc,#cboLiUsuario,#cboLiEstado").on("change",function(){table._fnDraw();});
        $("#data_1,#data_2").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#cboTipoProducto").on("change",function(){
            var value = $(this).val();
            var listaProp = new Array();
            for(var k=0;k<propiedades.length;k++){
                if(propiedades[k].tipoProducto.id == value){
                    listaProp.push(propiedades[k]);
                }
            }
            $("#div-categoria").hide();
            $("#div-marca").hide();
            $("#div-material").hide();
            $("#div-unidad").hide();
            $("#div-und-compra").hide();
            $("#div-und-almacen").hide();
            $("#div-modelo").hide();
            $("#div-minimo").hide();
            $("#div-maximo").hide();
            $("#div-precio1").hide();
            $("#div-precio2").hide();
            $("#div-precio3").hide();
            $("#div-sku").hide();
            for(var i=0;i<listaProp.length;i++){
                if(listaProp[i].propiedad.nombre === "CATEGORIA"){
                    $("#div-categoria").show();
                }
                if(listaProp[i].propiedad.nombre === "MARCA"){
                    $("#div-marca").show();
                }
                if(listaProp[i].propiedad.nombre === "MATERIAL"){
                    $("#div-material").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO1"){
                    $("#div-precio1").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO2"){
                    $("#div-precio2").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO3"){
                    $("#div-precio3").show();
                }
                if(listaProp[i].propiedad.nombre === "MODELO"){
                    $("#div-modelo").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADVENTA"){
                    $("#div-unidad").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADCOMPRA"){
                    $("#div-und-compra").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADSTOCK"){
                    $("#div-und-almacen").show();
                }
                if(listaProp[i].propiedad.nombre === "SKU"){
                    $("#div-sku").show();
                }
            }
        });
        $("#cboLiTipoProducto").on("change",function () {
            $("#btnSearchModalProducto").trigger("click");
        });
        $.ajax({
            type: 'post',
            url: "mant_compra_insumo",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    busqueda = data.busqueda;
                    valor = data.valor;
                    propiedades = data.prop;
                    $("#cboLiTipoProducto,#cboTipoProducto").html(data.htTipPro);
                    $("#cboLiAlCompra").html(data.htA);
                    $("#cboLiAlmacen").html( (data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htA);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboLiTipDoc").html("<option value='0'>--TODOS--</option>"+data.htT);
                    $("#saltipo").html("<option value='0'>--SELECCIONE--</option>"+data.htT);
                    $("#cboMarca").html("<option value='0'>--SELECCIONE--</option>"+data.htM);
                    $("#cboCategoria").html("<option value='0'>--SELECCIONE--</option>"+data.htC);
                    $("#cboCaracteristica").html("<option value='0'>--SELECCIONAR--</option>"+data.htCar);
                    $("#cboUnidad,#cboUndCompra,#cboUndAlmacen").html("<option value='0'>--SELECCIONE--</option>"+data.htUn);
                    $(".selectpicker").selectpicker("refresh");
                    ListCompras();
                    ListarsearchProveedores();
                    ListarsearchPro();
                    defrecepcion = $("#cboLiAlCompra")[0].length;
                    $("#cboTipoProducto").change();
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
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
        $("#viewCompra").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewCompra:visible").each(ModalCompleto);
        });
        $("#modalSearchProveedor").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProveedor:visible").each(ModalCompleto);
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
        addProveedor:function(a){
            addProveedor(a);
        },
        confirm_record:function(a){
            confirm_record(a);
        },
        viewDetails:function(a){
            viewDetails(a);
        },
        viewImageProducto:function (a) {
            viewImageProducto(a);
        },
        confirm_record_rec:function (a) {
            confirm_record_rec(a);
        },
        view_record_insumo:function (a) {
            view_record_insumo(a);
        }
    };
}();
jQuery(document).ready(function () {
    Compra.init();
});