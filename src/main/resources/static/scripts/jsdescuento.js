var Descuento = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var updateDesc = Ladda.create(document.querySelector('#btnUpdDesc'));
    var savedesCat = Ladda.create(document.querySelector('#btnSaveDescCat'));
    var savedesMar = Ladda.create(document.querySelector('#btnSaveDescMar'));
    var actualizar = Ladda.create(document.querySelector('#btnActualizar'));
    var data = null;
    var updPorcentaje = Ladda.create(document.querySelector('#btnUpdPorc'));
    var terminar = Ladda.create(document.querySelector("#btnTerDesc"));
    var saveDescPro = Ladda.create(document.querySelector("#btnSaveDescPro"));
    var tblPedido = null;
    var tblProDesc = null;
    var tblTipoDescProd = null;
    var Accion = "R";
    var listIdCategoria = new Array();
    var listNomCategoria = new Array();
    var listIdMarca = new Array();
    var listNomMarca = new Array();

    var ListDevoluciones = function(){
        tblPedido = $("#tblDevolucion").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_descuentos",data:function(d){
                d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();
                d.est = $("#cboLiEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,3,7]},
                {'sClass':"text-right",'aTargets': [4,5,6]},
                {'sClass':"centrador",'aTargets': [9]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListProductoxDescTipoProd = function(){
        tblTipoDescProd = $("#tblviewTipoProdDesc").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide": true,
            "bAutoWidth": false,
            "ajax": {
                type: 'POST',
                url: "list_detallesxiddesc",
                data: function(d){
                    d.tipbus = $("#cboTipBusDesPro").val();
                    d.descbus = $("#txtDescBusqDesPro").val();
                    d.iddesc = $("#iddesc").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"text-center",'aTargets': [0,1]},
                {'sClass':"text-right",'aTargets': [4,5,6,7,8]},
                {'sClass':"centrado boton-tabla",'aTargets': [9]},
                {'orderable': false, 'aTargets': [0,1,2,4,5,6,7,8]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            },
            "order":[
                [2, "asc"]
            ]
        });
    };

    var ListProductoxDescuento = function(){
        tblProDesc = $("#tblviewProdDesc").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide": true,
            "bAutoWidth": false,
            "ajax": {
                type: 'POST',
                url: "list_detallesxiddesc",
                data: function(d){
                    d.tipbus = $("#cboTipBusqueda").val();
                    d.descbus = $("#txtDescBusqueda").val();
                    d.iddesc = $("#iddesc").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"text-center",'aTargets': [0,1]},
                {'sClass':"text-right",'aTargets': [4,5,6,7,8]},
                {'sClass':"centrado boton-tabla",'aTargets': [9]},
                {'orderable': false, 'aTargets': [0,1,2,4,5,6,7,8]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            },
            "order":[
                [3, "asc"]
            ]
        });
    };

    var Cancelar = function(elem){
        var iddd = $(elem).attr("id").split("_")[2];
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Descuento?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_descuento',
                        data: {"id":iddd},
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

    var viewDetails = function(a){
        var iddd = $(a).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_descuento",
            dataType: 'json',
            data:{id:iddd},
            success:function(respJson){
                if(respJson!==null){
                    $("#iddesc").val(respJson.id);
                    var tipp = respJson.tipoDescuento;
                    if(tipp === "P"){
                        $("#viewDescuentoProductos").modal("show");
                        tblTipoDescProd._fnDraw();
                    }else {
                        tblProDesc._fnDraw();
                        $("#viewDescuento").modal("show");
                    }
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
        var sel = $("#cboTipoDescuento").val();
        Accion = "R";
        if(sel === "C"){
            listIdCategoria = new Array();
            listNomCategoria = new Array();
            $('#div-fecinidesc').datepicker('update',fecAct);
            $('#div-fecfindesc').datepicker('update',fecAct);
            $("#cboCategoria").selectpicker('val','0');
            $("#txtPorcentaje").val("");
            LoadTblCategoria();
            $("#modalDescCategoria").modal("show");
        }else if(sel === "M"){
            listIdMarca = new Array();
            listNomMarca = new Array();
            $('#div-fecinidescmarca').datepicker('update',fecAct);
            $('#div-fecfindescmarca').datepicker('update',fecAct);
            $("#cboMarca").selectpicker('val','0');
            $("#txtPorcentajeMarca").val("");
            LoadTblMarca();
            $("#modalDescMarca").modal("show");
        }else if(sel === "P"){
            $("#titRegDesPro").text("Nuevo descuento");
            $("#div-suc-descpro").show();
            $('#div-fecregproini').datepicker('update',fecAct);
            $('#div-fecregprofin').datepicker('update',fecAct);
            $("#cboSucursalDP").selectpicker('refresh');
            $("#txtRegPro").val("0.01");
            $("#updateDescuentoxProducto").modal("show");
        }else{
            uploadMsnSmall("Seleccione una opcion Valida.","ALERTA");
        }
    };

    var LoadTblMarca = function(){
        if ($.fn.DataTable.isDataTable('#tbMarca')){
            $("#tbMarca").dataTable().fnDestroy();
        }
        $("#tblMarcas").html("");
        for (var i = 0; i < listIdMarca.length; i++) {
            $("#tblMarcas").append("<tr>"+
                "<td class='text-center' style='padding:5px 2px 2px 5px!important;width: 10%;'>"+(i+1)+"</td>"+
                "<td class='text-left' style='padding:5px 2px 2px 10px!important;width: 80%;'>"+listNomMarca[i]+"</td>"+
                "<td class='text-center' style='padding:2px!important;width: 10%;'>"+
                "<button type='button' class='btn btn-sm btn-danger delMarca ladda-button' data-style='zoom-in' data-spinner-size='30' " +
                "style='padding:2px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<span class='ladda-label'><i class='glyphicon glyphicon-trash'></i></span></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItemMarca(this);});
        }
        $("#tbMarca").dataTable({
            "bFilter": true,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bAutoWidth": true,
            "bPaginate": true,
            "bInfo": true,
            "language": {"search": "<span style='font-weight: bold;'>Buscar en los registros:</span>"},
            "aoColumnDefs": [
                {'sClass':"text-center",'aTargets': [0]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".delMarca").tooltip();
            }
        });
    };

    var confirm_descuento = function(a){
        var iddd = $(a).attr("id").split("_")[2];
        var fecreg = moment($(a).attr("fec-finf")).format('DD-MM-YYYY');
        $("#iddesc").val(iddd);
        $('#div-fecregped').datepicker('update',fecreg);
        $("#mdlTerDescuento").modal("show");
    };

    var saveDescxMarca = function(){
        savedesMar.start();
        var idmarca = "";
        for (var i = 0 ; i < listIdMarca.length;i++){
            if( i === listIdMarca.length-1){
                idmarca+=listIdMarca[i];
            }else{
                idmarca+=listIdMarca[i]+",";
            }
        }
        $.ajax({
            type: 'POST',
            url: "save_descuentos",
            dataType: 'json',
            data:{fecini:$("#fecinidescmarca").val(),fecfin:$("#fecfindescmarca").val(),porcentaje:$("#txtPorcentajeMarca").val(),
                "idmarca":idmarca,tipodesc:$("#cboTipoDescuento").val(),"suc":$("#cboSelSucursalM").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        tblPedido._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#modalDescMarca").modal("hide");
                        savedesMar.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Almacen no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Porcentaje Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Fechas Incorrectas.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Inicie Session en una nueva ventana.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Tipo de Descuento Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E7"){uploadMsnSmall("No ha agregado ninguna marca.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        savedesMar.stop();
                    }
                }else{
                    savedesMar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                savedesMar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var saveDescxCategoria = function(){
        savedesCat.start();
        var idcate = "";
        for (var i = 0 ; i < listIdCategoria.length;i++){
            if( i === listIdCategoria.length-1){
                idcate+=listIdCategoria[i];
            }else{
                idcate+=listIdCategoria[i]+",";
            }
        }
        $.ajax({
            type: 'POST',
            url: "save_descuentos",
            dataType: 'json',
            data:{fecini:$("#fecinidesc").val(),fecfin:$("#fecfindesc").val(),porcentaje:$("#txtPorcentaje").val(),
                "idcate":idcate,tipodesc:$("#cboTipoDescuento").val(),"suc":$("#cboSelSucursal").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        tblPedido._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#modalDescCategoria").modal("hide");
                        savedesCat.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Sucursal no Encontrada.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Porcentaje Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Fechas Incorrectas.",'ALERTA');}
                                if(data.listado[i] === "E4"){uploadMsnSmall("Inicie Session en una nueva ventana.",'ALERTA');}
                                if(data.listado[i] === "E5"){uploadMsnSmall("Tipo de Descuento Incorrecto.",'ALERTA');}
                                if(data.listado[i] === "E6"){uploadMsnSmall("No ha agregado ninguna categoria.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        savedesCat.stop();
                    }
                }else{
                    savedesCat.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                savedesCat.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var saveDescProducto = function(){
        if(Accion === "R"){
            saveDescPro.start();
            $.ajax({
                type: 'POST',
                url: "save_descuentos",
                dataType: 'json',
                data:{fecini:$("#fecregproini").val(),fecfin:$("#fecregprofin").val(),porcentaje:$("#txtRegPro").val(),
                    tipodesc:$("#cboTipoDescuento").val(),"suc":$("#cboSucursalDP").val(),"hini":$("#horIniRegPro").val(),
                    "hfin":$("#horFinRegPro").val()},
                success: function(data){
                    if(data !== null){
                        if(data.dato === "OK"){
                            tblPedido._fnDraw();
                            uploadMsnSmall(data.msj,'OK');
                            $("#updateDescuentoxProducto").modal("hide");
                            saveDescPro.stop();
                        }else if(data.dato === "ERROR"){
                            if(data.listado.length>0){
                                for (var i = 0; i < data.listado.length; i++) {
                                    if(data.listado[i] === "E1"){uploadMsnSmall("Sucursal no Encontrada.",'ALERTA');}
                                    if(data.listado[i] === "E2"){uploadMsnSmall("Porcentaje Incorrecta.",'ALERTA');}
                                    if(data.listado[i] === "E3"){uploadMsnSmall("Fechas Incorrectas.",'ALERTA');}
                                    if(data.listado[i] === "E4"){uploadMsnSmall("Inicie Session en una nueva ventana.",'ALERTA');}
                                    if(data.listado[i] === "E5"){uploadMsnSmall("Tipo de Descuento Incorrecto.",'ALERTA');}
                                    if(data.listado[i] === "E6"){uploadMsnSmall("No ha agregado ninguna categoria.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(data.msj,data.dato);
                            }
                            saveDescPro.stop();
                        }
                    }else{
                        saveDescPro.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    saveDescPro.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        }else if(Accion === "M"){
            saveDescPro.start();
            $.ajax({
                type: 'POST',
                url: "update_descuento",
                dataType: 'json',
                data:{iddesc:$("#iddesc").val(),fecini:$("#fecregproini").val(),fecfin:$("#fecregprofin").val(),
                    porcentaje:$("#txtRegPro").val(),horini:$("#horIniRegPro").val(),horfin:$("#horFinRegPro").val(),chk:"0"},
                success: function(data){
                    if(data !== null){
                        if(data.dato === "OK"){
                            tblPedido._fnDraw();
                            uploadMsnSmall(data.msj,'OK');
                            $("#updateDescuentoxProducto").modal("hide");
                            saveDescPro.stop();
                        }else if(data.dato==="ERROR"){
                            if(data.listado.length>0){
                                for (var i = 0; i < data.listado.length; i++) {
                                    if(data.listado[i] === "E1"){uploadMsnSmall("Hora inicio incorrecto.","ALERTA");}
                                    if(data.listado[i] === "E2"){uploadMsnSmall("Hora fin incorrecto.","ALERTA");}
                                    if(data.listado[i] === "E3"){uploadMsnSmall("Seleccion incorrecta.","ALERTA");}
                                }
                            }else{
                                uploadMsnSmall(data.msj,'ERROR');
                            }
                            saveDescPro.stop();
                        }
                    }else{
                        saveDescPro.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    saveDescPro.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        }
    };

    var ActualizarDescuentos = function(){
        actualizar.start();
        $.ajax({
            type: 'POST',
            url: "add_new_descuentos",
            dataType: 'json',
            data:{iddesc:$("#iddesc").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        tblProDesc._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        actualizar.stop();
                    }else if(data.dato === "ERROR"){
                        uploadMsnSmall(data.msj,data.dato);
                        actualizar.stop();
                    }
                }else{
                    actualizar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                actualizar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var delete_item = function (elem) {
        var iddd = $(elem).attr("id").split("_")[2];
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea quitar el Producto?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result){
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_detadescuento',
                        data: {"id":iddd},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    tblProDesc._fnDraw();
                                    tblTipoDescProd._fnDraw();
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

    var update_descuento = function(){
        updateDesc.start();
        $.ajax({
            type: 'POST',
            url: "update_descuento",
            dataType: 'json',
            data:{iddesc:$("#iddesc").val(),fecini:$("#fecupdini").val(),fecfin:$("#fecupdfin").val(),
                porcentaje:$("#txtupdPorc").val(),horini:$("#horIni").val(),horfin:$("#horFin").val(),
                chk:$("#chkMod").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        tblPedido._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#updateDescuento").modal("hide");
                        updateDesc.stop();
                    }else if(data.dato==="ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Hora Inicio Incorrecto.","ALERTA");}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Hora Fin Incorrecto.","ALERTA");}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Seleccion Incorrecta.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(data.msj,'ERROR');
                        }
                        updateDesc.stop();
                    }
                }else{
                    updateDesc.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                updateDesc.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var view_record = function(a){
        var iddd = $(a).attr("id").split("_")[2];
        $("#iddesc").val(iddd);
        Accion = "M";
        $.ajax({
            type: 'POST',
            url: "view_deta_descuento",
            dataType: 'json',
            data:{id:iddd},
            success: function(data){
                if(data !== null){
                    var tipo = data.tipo;
                    var lista = data.lista;
                    if(tipo === "P"){
                        $("#titRegDesPro").text("Modificar descuento");
                        $('#div-fecregproini').datepicker('update',$(a).attr("data-feci"));
                        $('#div-fecregprofin').datepicker('update',$(a).attr("data-fecf"));
                        $("#horIniRegPro").val($(a).attr("data-horini"));
                        $("#horFinRegPro").val($(a).attr("data-horfin"));
                        $("#txtRegPro").val($(a).attr("data-por"));
                        $("#div-suc-descpro").hide();
                        $("#updateDescuentoxProducto").modal("show");
                    }else {
                        $('#div-fecupdini').datepicker('update',$(a).attr("data-feci"));
                        $('#div-fecupdfin').datepicker('update',$(a).attr("data-fecf"));
                        $("#horIni").val($(a).attr("data-horini"));
                        $("#horFin").val($(a).attr("data-horfin"));
                        $("#txtupdPorc").val($(a).attr("data-por"));
                        $("#chkMod").prop("checked",false);
                        $("#chkMod").val("0");
                        $("#chkMod").iCheck('update');
                        $("#txtupdPorc").attr("readonly","readonly");
                        $("#tblAddDetalles").html("");
                        for (var i = 0; i < lista.length; i++) {
                            $("#tblAddDetalles").append("<tr>"+
                                "<td class='text-center'>"+(i+1)+"</td>"+
                                "<td class='text-left'>"+lista[i].nombre+"</td>"+
                                "<td class='text-center' style='padding:3px!important;'>"+
                                "<button type='button' class='btn btn-sm btn-success' style='padding:4px 10px!important;' id='fnadd_"+i+"' data-id='"+lista[i].id+"' data-pos='"+i+"' title='Agregar'>"+
                                "<i class='glyphicon glyphicon-plus'></i></button>"+"</td>"+
                                "</tr>");
                            $("#fnadd_"+i).on("click",function(){AddItemFaltante(this);});
                        }
                        $("#updateDescuento").modal("show");
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

    var AddItemFaltante = function (a) {
        var id = $(a).attr("data-id");
        $.ajax({
            type: 'POST',
            url: "save_deta_descuento",
            dataType: 'json',
            data:{id:id,iddesc:$("#iddesc").val()},
            success: function(data){
                if(data !== null){
                    var lista = data.lista;
                    $("#tblAddDetalles").html("");
                    for (var i = 0; i < lista.length; i++) {
                        $("#tblAddDetalles").append("<tr>"+
                            "<td class='text-center'>"+(i+1)+"</td>"+
                            "<td class='text-left'>"+lista[i].nombre+"</td>"+
                            "<td class='text-center' style='padding:3px!important;'>"+
                            "<button type='button' class='btn btn-sm btn-success' style='padding:4px 10px!important;' id='fnadd_"+i+"' data-id='"+lista[i].id+"' data-pos='"+i+"' title='Agregar'>"+
                            "<i class='glyphicon glyphicon-plus'></i></button>"+"</td>"+
                            "</tr>");
                        $("#fnadd_"+i).on("click",function(){AddItemFaltante(this);});
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

    var LoadTblCategoria = function(){
        if ($.fn.DataTable.isDataTable('#tbCategoria')){
            $("#tbCategoria").dataTable().fnDestroy();
        }
        $("#tblCategorias").html("");
        for (var i = 0; i < listIdCategoria.length; i++) {
            $("#tblCategorias").append("<tr>"+
                "<td class='text-center' style='padding:5px 2px 2px 5px!important;width: 10%;'>"+(i+1)+"</td>"+
                "<td class='text-left' style='padding:5px 2px 2px 10px!important;width: 80%;'>"+listNomCategoria[i]+"</td>"+
                "<td class='text-center' style='padding:2px!important;width: 10%;'>"+
                "<button type='button' class='btn btn-sm btn-danger delCategoria ladda-button' data-style='zoom-in'  data-spinner-size='30' " +
                "style='padding:2px 10px!important;' id='fndelcat_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<span class='ladda-label'><i class='glyphicon glyphicon-trash'></i></span></button>"+"</td>"+
                "</tr>");
            $("#fndelcat_"+i).on("click",function(){quitarItemCategoria(this);});
        }
        $("#tbCategoria").dataTable({
            "bFilter": true,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bAutoWidth": true,
            "bPaginate": true,
            "bInfo": true,
            "language": {"search": "<span style='font-weight: bold;'>Buscar en los registros:</span>"},
            "aoColumnDefs": [
                {'sClass':"text-center",'aTargets': [0]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".delCategoria").tooltip();
            }
        });
    };

    var quitarItemCategoria = function (a) {
        var loaddetalle = Ladda.create(document.querySelector("#"+$(a).attr("id")));
        loaddetalle.start();
        var pos = $(a).attr("data-pos");
        listIdCategoria.splice(pos,1);
        listNomCategoria.splice(pos,1);
        LoadTblCategoria();
    };

    var quitarItemMarca = function (a) {
        var loaddetalle = Ladda.create(document.querySelector("#"+$(a).attr("id")));
        loaddetalle.start();
        var pos = $(a).attr("data-pos");
        listIdMarca.splice(pos,1);
        listNomMarca.splice(pos,1);
        LoadTblMarca();
    };

    var TerminarDescuento = function () {
        terminar.start();
        $.ajax({
            type: 'post',
            url: "finish_descuento",
            data:{iddesc:$("#iddesc").val()},
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    if(respJson.dato==="OK"){
                        terminar.stop();
                        $("#mdlTerDescuento").modal("hide");
                        tblPedido._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Descuento Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Fechas Incorrectas.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Usuario Incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        terminar.stop();
                    }
                }else{
                    terminar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                terminar.stop();
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
    };

    var view_item = function (a) {
        $("#iddp").val($(a).attr("id"));
        $("#updpor").val($(a).attr("data-porc"));
        $("#updatePorcentaje").modal("show");
        $("#updpor").focus();
    };

    var save_porcentaje = function(){
        updPorcentaje.start();
        $.ajax({
            type: 'post',
            url: "update_detdescuento",
            data:{iddp:$("#iddp").val(),por:$("#updpor").val()},
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    if(respJson.dato==="OK"){
                        updPorcentaje.stop();
                        $("#updatePorcentaje").modal("hide");
                        tblProDesc._fnDraw();
                        tblTipoDescProd._fnDraw();
                        uploadMsnSmall("Porcentaje Modificado.",'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Item Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Porcentaje Incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        updPorcentaje.stop();
                    }
                }else{
                    updPorcentaje.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                updPorcentaje.stop();
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
    };

    var checkPorc = function(e,a){
        var isChecked = e.currentTarget.checked;
        if(isChecked){
            $("#txtupdPorc").removeAttr("readonly");
        }else{
            $("#txtupdPorc").attr("readonly","readonly");
        }
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var viewDetaDetails = function (a) {
        var iddd = $(a).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "list_resumenxid",
            dataType: 'json',
            data:{iddesc:iddd},
            success:function(respJson){
                if(respJson!==null){
                    var data = respJson.lista;
                    var html = "";
                    var cantvendida = 0.00;
                    var montovendido = 0.00;
                    var descvendido = 0.00;
                    for(var i=0;i<data.length;i++){
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td>"+data[i].otbProducto.codigo+"</td>";
                        html+="<td>"+data[i].otbProducto.desCategoria + " "+data[i].otbProducto.desMarca+" "+data[i].otbProducto.nombre + (data[i].otbProducto.modelo != null?" "+data[i].otbProducto.modelo : "")+"</td>";
                        html+="<td class='text-right'>"+Redondear2(data[i].cantidadVendida)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(parseFloat(data[i].montototalVendida) + parseFloat(data[i].descuentototalVendida))+"</td>";
                        html+="<td class='text-right'>"+Redondear2(data[i].montototalVendida)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(data[i].descuentototalVendida)+"</td>";
                        html+="<td class='text-right'>"+Redondear2(data[i].porcentajeItem)+"%</td>";
                        html+="</tr>";
                        cantvendida+=parseFloat(data[i].cantidadVendida);
                        montovendido+=parseFloat(data[i].montototalVendida);
                        descvendido+=parseFloat(data[i].descuentototalVendida);
                    }
                    html+="<tr>";
                    html+="<td class='text-right' style='font-weight: bold;' colspan='3'>RESUMEN TOTAL: </td>";
                    html+="<td class='text-right' style='font-weight: bold;'>"+Redondear2(cantvendida)+"</td>";
                    html+="<td class='text-right' style='font-weight: bold;'>"+Redondear2(montovendido + descvendido)+"</td>";
                    html+="<td class='text-right' style='font-weight: bold;'>"+Redondear2(montovendido)+"</td>";
                    html+="<td class='text-right' style='font-weight: bold;'>"+Redondear2(descvendido)+"</td>";
                    html+="<td class='text-right' style='font-weight: bold;'></td>";
                    html+="</tr>";
                    $("#detdescuentos").html(html);
                    $("#viewDetalleDescuento").modal("show");
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
        $("#busfecini,#busfecfin,#fecinidesc,#fecfindesc,#fecregter,#fecinidescmarca,#fecfindescmarca,#fecupdini,#fecupdfin,#fecregproini,#fecregprofin").val(fecAct);
        $("#btnNewDescuento").on("click",new_record);
        $("#btnSearchProDesc").on("click",function () {
            tblProDesc._fnDraw();
        });
        $("#txtDescBusqueda").on("keyup",function () {
            tblProDesc._fnDraw();
        });
        $("#txtDescBusqDesPro").on("keyup",function () {
            tblTipoDescProd._fnDraw();
        });
        $("#txtDescBusqDesPro").on("change",function(){
            tblTipoDescProd._fnDraw();
        });
        $("#btnSearchProDescPro").on("click",function(){
            tblTipoDescProd._fnDraw();
        });
        $("#cboTipBusDesPro").on("change",function(){
            tblTipoDescProd._fnDraw();
        });
        $("#cboLiEstado,#cboLiSucursal").on("change",function () {
            tblPedido._fnDraw();
        });
        $("#horIni").val("10:00:00");
        $("#horFin").val("22:00:00");
        $("#horIniRegPro").val("10:00:00");
        $("#horFinRegPro").val("22:00:00");
        $("#horIni,#horFin,#horIniRegPro,#horFinRegPro").clockpicker({
            autoclose : true
        });
        $("#chkAllCategoria").iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(e){
            var isChecked = e.currentTarget.checked;
            $(this).prop("checked",isChecked);
            $(this).val(isChecked?"1":"0");
            $(this).iCheck('update');
            listIdCategoria = new Array();
            listNomCategoria = new Array();
            if(isChecked){
                $("#cboCategoria option").each(function(){
                    var sel = $(this);
                    if(sel.attr("value") !== "0") {
                        listIdCategoria.push(sel.attr("value"));
                        listNomCategoria.push(sel.text());
                    }
                });
                $("#cboCategoria").selectpicker('val',"0");
            }
            LoadTblCategoria();
        });
        $("#chkAllMarca").iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(e){
            var isChecked = e.currentTarget.checked;
            $(this).prop("checked",isChecked);
            $(this).val(isChecked?"1":"0");
            $(this).iCheck('update');
            listIdMarca = new Array();
            listNomMarca = new Array();
            if(isChecked){
                $("#cboMarca option").each(function(){
                    var sel = $(this);
                    if(sel.attr("value") !== "0") {
                        listIdMarca.push(sel.attr("value"));
                        listNomMarca.push(sel.text());
                    }
                });
                $("#cboMarca").selectpicker('val',"0");
            }
            LoadTblMarca();
        });
        $("#btnSearch").on("click",function () {
            tblPedido._fnDraw();
        });
        $("#btnSaveDescPro").on("click",saveDescProducto);
        $("#btnSaveDescCat").on("click",saveDescxCategoria);
        $("#btnSaveDescMar").on("click",saveDescxMarca);
        $("#btnActualizar").on("click",ActualizarDescuentos);
        $("#btnTerDesc").on("click",TerminarDescuento);
        $("#btnUpdDesc").on("click",update_descuento);
        FormatoFecha($("#div-fecregter"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecinidesc"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecfindesc"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecinidescmarca"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecfindescmarca"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecupdini"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecupdfin"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecregproini"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecregprofin"),"dd-mm-yyyy");
        NumeroEntero($("#txtupdPorc"),3,1,100);
        NumeroEntero($("#txtPorcentaje"),3,1,100);
        NumeroEntero($("#txtPorcAdd"),3,1,100);
        NumeroEntero($("#txtRegPro"),3,1,100);
        NumeroEntero($("#txtPorcentajeMarca"),3,1,100);
        NumeroEntero($("#updpor"),3,1,100);
        $("#btnUpdPorc").on("click",save_porcentaje);
        $("#addBtnCategoria").on("click",function(){
            var idcat = $("#cboCategoria").val();
            var nomcat =  $('option:selected', $("#cboCategoria")).text();
            var existe = "0";
            for (var i = 0; i < listIdCategoria.length; i++) {
                if(listIdCategoria[i] === idcat){
                    existe = "1";
                    i = listIdCategoria.length + 1;
                }
            }
            if(existe === "0"){
                if(idcat !== "0"){
                    listIdCategoria.push(idcat);
                    listNomCategoria.push(nomcat);
                    LoadTblCategoria();
                }else{
                    uploadMsnSmall("La categoria es incorrecta.","ALERTA");
                }
            }else if (existe === "1"){
                uploadMsnSmall("La categoria ya se encuentra en la lista.","ALERTA");
            }
        });
        $("#addBtnMarca").on("click",function(){
            var idmar = $("#cboMarca").val();
            var nommar =  $('option:selected', $("#cboMarca")).text();
            var existe = "0";
            for (var i = 0; i < listIdMarca.length; i++) {
                if(listIdMarca[i] === idmar){
                    existe = "1";
                    i = listIdMarca.length + 1;
                }
            }
            if(existe === "0"){
                if(idmar !== "0"){
                    listIdMarca.push(idmar);
                    listNomMarca.push(nommar);
                    LoadTblMarca();
                }else{
                    uploadMsnSmall("La marca es incorrecta.","ALERTA");
                }
            }else if (existe === "1"){
                uploadMsnSmall("La marca ya se encuentra en la lista.","ALERTA");
            }
        });
        $('#chkMod').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkPorc(event,$(this));
        });
        $.ajax({
            type: 'post',
            url: "mant_descuento",
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    $("#cboLiSucursal").html((respJson.usu === "1" ? "<option value='T'>--TODOS--</option>" : "")+respJson.htS);
                    $("#cboSelSucursal,#cboSelSucursalM,#cboSucursalDP").html(respJson.htS);
                    $("#cboLiUsuario").html("<option value='T'>--TODOS--</option>"+respJson.htU);
                    $("#cboMarca").html("<option value='0'>--SELECCIONE--</option>"+respJson.htM);
                    $("#cboCategoria").html("<option value='0'>--SELECCIONE--</option>"+respJson.htC);
                    $(".selectpicker").selectpicker("refresh");
                    ListDevoluciones();
                    ListProductoxDescuento();
                    ListProductoxDescTipoProd();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#modalDescCategoria").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalDescCategoria:visible").each(ModalCompleto);
        });
        $("#modalDescMarca").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalDescMarca:visible").each(ModalCompleto);
        });
        $("#viewDescuento").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewDescuento:visible").each(ModalCompleto);
        });
        $("#updateDescuento").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#updateDescuento:visible").each(ModalCompleto);
        });
        $("#btnAddPorDesItem").on("click",function(){
            var idde = $("#iddesc").val();
            var sku = $("#txtSkuAdd").val();
            var porc = $("#txtPorcAdd").val();
            $.ajax({
                type: 'post',
                url: "add_detadesc_prod_sku",
                dataType: 'json',
                data:{iddesc:idde,sku: sku,porc:porc},
                success:function(respJson){
                    if(respJson!==null){
                        var rpta = respJson.dato;
                        if(rpta === "OK"){
                            $("#cboTipBusDesPro").val("S");
                            $("#txtDescBusqDesPro").val(sku);
                            tblTipoDescProd._fnDraw();
                            $("#txtSkuAdd").val("");
                            $("#txtSkuAdd").focus();
                            uploadMsnSmall(respJson.msj,"OK");
                        } else if(rpta === "ERROR"){
                            uploadMsnSmall(respJson.msj,"ERROR");
                        }
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });
        $("#txtSkuAdd").on("keyup",function(e){
             if(e.keyCode === 13){
                 $("#btnAddPorDesItem").trigger("click");
             }
        });
        $("#txtPorcAdd").on("keyup",function(e){
            if(e.keyCode === 13){
                $("#btnAddPorDesItem").trigger("click");
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
        delete_item:function (a) {
            delete_item(a);
        },
        confirm_descuento:function (a) {
            confirm_descuento(a);
        },
        viewDetails:function (a) {
            viewDetails(a);
        },
        view_record:function (a) {
            view_record(a);
        },
        view_item:function (a) {
            view_item(a);
        },
        viewDetaDetails:function (a) {
            viewDetaDetails(a);
        }
    };
}();
jQuery(document).ready(function () {
    Descuento.init();
});