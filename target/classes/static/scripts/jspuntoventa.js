var Almacen = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar')); 
    var sucursal = Ladda.create(document.querySelector("#btnGuardarSucursal"));
    var borrarSucursal = Ladda.create(document.querySelector("#btnGuardarDelSucursal"));
    var table;
    var btnViewCaja = null;

    var ListProductos = function(){
        table = $("#tblProductos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax":{type:'POST', url:"list_almacenes",
                data:function(d){d.desc = $("#txtDesc").val();d.est = $("#cboBusEstado").val();}
            },
            "aoColumnDefs":[
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmRegistro input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#frmRegistro #estado",false);
    };

    var Limpiar_Sucursal = function(){
        $.each($("#frmSucursal input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#frmSucursal #estadosucursal",false);
        $('#div-fecinicie').datepicker('update',fecAct);
        $('#div-fecfincie').datepicker('update',fecAct);
    };

    var new_record = function(){
        Limpiar();
        $("#frmRegistro #div-estado").hide();
        $("#titulo").html("Nuevo Almacen");
        $("#frmRegistro #accion").val("save");
        $("#frmRegistro #id").val("0");
        $("#frmRegistro #estado").selectpicker('val','H');
        $("#chkSku").prop("checked",false);
        $("#chkSku").val("0");
        $("#chkSku").iCheck('update');
        $("#sku").attr("readonly","readonly");
        $("#modalAlmacen").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_alamcen",
            dataType: 'json',
            data:$("#frmRegistro").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalAlmacen").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#direccion");}
                                if(respJson.listado[i] === "E3"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#desc");uploadMsnSmall("EL Nombre de Almacen debe de ser menos de 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#direccion");uploadMsnSmall("La Dirección de Almacen debe de ser menos de 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#cboRubro",true);}
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
        var pidalm =$(elem).attr("id").split("_")[3];
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_almacen",
            dataType: 'json',
            data:{id:pidalm},
            success:function(respJson){
                if(respJson!==null){
                    $("#frmRegistro #div-estado").show();
                    $("#frmRegistro #id").val(respJson.id);
                    $("#frmRegistro #desc").val(respJson.nombre);
                    $("#direccion").val(respJson.direccion);
                    $("#frmRegistro #estado").selectpicker('val',respJson.estado);
                    $("#cboRubro").selectpicker('val',respJson.rubroNegocio.id);
                    $("#chkSku").prop("checked",true);
                    $("#chkSku").val("1");
                    $("#chkSku").iCheck('update');
                    $("#titulo").html("Modificar Almacen");
                    $("#frmRegistro #accion").val("update");
                    $("#modalAlmacen").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_sucursal = function(){
        sucursal.start();
        $.ajax({
            type: 'post',
            url: "save_sucursal",
            dataType: 'json',
            data:$("#frmSucursal").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#modalSucursal").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        sucursal.stop();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmSucursal #descripcion");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#frmSucursal #dirsucursal");}
                                if(respJson.listado[i] === "E3"){style_error_cbo_final("#frmSucursal #estadosucursal",true);}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#frmSucursal #descripcion");uploadMsnSmall("EL Nombre de la Sucursal debe de ser menos de 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#frmSucursal #dirsucursal");uploadMsnSmall("La direccion de la sucursal debe de ser menos de 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Almacen es incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        sucursal.stop();
                    }
                }else{
                    sucursal.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                sucursal.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var delete_record = function(elem){
        var pidalm =$(elem).attr("id").split("_")[3];
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el almacen?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_almacen',
                        data: {"id":pidalm},
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
    
    var delete_sucursal = function(elem){
        borrarSucursal.start();
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar la Sucursal?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result){
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_sucursal',
                        data: {"id":$("#frmSucursal #id").val()},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    $("#modalSucursal").modal("hide");
                                    table._fnDraw();
                                    borrarSucursal.stop();
                                }else{
                                    borrarSucursal.stop();
                                }
                            }else{
                                borrarSucursal.stop();
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function (jqXHR, status, error) {
                            borrarSucursal.stop();
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                }else {
                    borrarSucursal.stop();
                }
            }
        });
    };

    var new_sucursal = function(){
        Limpiar_Sucursal();
        $("#div-estado-sucursal").hide();
        $("#frmSucursal #accion").val("save");
        $("#frmSucursal #descripcion").val("");
        $("#frmSucursal #dirsucursal").val("");
        $("#frmSucursal #estadosucursal").selectpicker('val','H');
        $("#modalSucursal").modal("show");
        $("#titSucursal").text("Registrar sucursal");
        $("#frmSucursal #descripcion").focus();
    };

    var view_kardex = function(a){
        var method = "downloadKardex";
        var parameters = "idpro="+$(a).attr("id");
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var checkSku = function(e,a){
        var isChecked = e.currentTarget.checked;
        if (isChecked){
            $("#sku").removeAttr("readonly");
        }else{
            $("#sku").attr("readonly","readonly");
        }
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var viewMovimientoCaja = function(a){
        btnViewCaja = $(a);
        var idsuc = parseFloat($(a).attr("data-idsuc"));
        $.ajax({
            type: 'post',
            url: "listarMovimientosCajaxSucursal",
            data: {idsuc:idsuc},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null){
                    $("#listado_mov_caja").html(respJson.ht);
                    $(".mensa").tooltip();
                    $("#viewMovimientodeCaja").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ver_consolidado = function(a){
        var ruta = $(a).attr("data-ruta");
        var method = "downloadConsolidadoFirmado";
        var parameters = "ruta=" + ruta;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var eliminar_consolidado  = function(a){
        var idcaja = $(a).attr("data-idcaja");
        var ruta = $(a).attr("data-ruta");
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el consolidado seleccionado?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result){
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'borrar_consolidado',
                        data: {"id":idcaja,"ruta":ruta},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    $(btnViewCaja).trigger("click");
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

    var viewSucursal = function (elem){
        var idsuc = parseFloat($(elem).attr("data-idsuc"));
        if(idsuc === 0){
            $("#btnGuardarDelSucursal").hide();
            new_sucursal();
            $("#idalm").val($(elem).attr("id").split("_")[3]);
        }else{
            $("#btnGuardarDelSucursal").show();
            $("#idalm").val($(elem).attr("id").split("_")[3]);
            $.ajax({
                type: 'post',
                url: "view_sucursal",
                dataType: 'json',
                data:{id:idsuc},
                success: function (respJson) {
                    if(respJson !== null){
                        $("#titSucursal").text("Modificar Sucursal");
                        $("#frmSucursal #accion").val("update");
                        $("#frmSucursal #id").val(respJson.id); 
                        $("#frmSucursal #descripcion").val(respJson.nombre);
                        $("#frmSucursal #dirsucursal").val(respJson.direccion);
                        $("#horaInicio").val(respJson.horaInicio);
                        $("#horaFin").val(respJson.horaFin);
                        $("#descuentos").selectpicker('val',respJson.aplicaPorcDescuento);
                        $("#eliminadoc").selectpicker('val',respJson.eliminaDocUsuario);
                        var fecini = moment(respJson.fecIniCierre).format('DD-MM-YYYY');
                        $('#div-fecinicie').datepicker('update',fecini);
                        var fecfin = moment(respJson.fecFinCierre).format('DD-MM-YYYY');
                        $('#div-fecfincie').datepicker('update',fecfin);
                        $("#estadosucursal").selectpicker("val",respJson.estado);
                        $("#modalSucursal").modal("show");
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        }
    };

    var Iniciando = function(){
        $("#fecinicie,#fecfincie").val(fecAct);
        FormatoFechas($("#div-fecinicie"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecfincie"),"dd-mm-yyyy");
        $("#btnGuardarDelSucursal").on("click",delete_sucursal);
        $("#btnGuardarSucursal").on("click",save_sucursal);
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#cboRubro").on("change",function(){ style_error_cbo_final('#cboRubro',false);});
        keyup_input_general_3("#frmRegistro input", "#frmRegistro", "#modalAlmacen");
        $('#chkSku').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkSku(event,$(this));
        });
        $("#horaInicio,#horaFin").inputmask("hh:mm:ss", {
                placeholder: "HH:MM:SS",
                insertMode: false,
                showMaskOnHover: false//,
                //hourFormat: 24
            }
        );
        $.ajax({
            type: 'post',
            url: "mant_puntoventa",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboRubro").html("<option value='0'>--SELECCIONE--</option>"+respJson.htRubro);
                    $(".selectpicker").selectpicker("refresh");
                    ListProductos();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#cboBusEstado").on("change",function () {
            table._fnDraw();
        });
    };

    return {
        init: function () {
            Iniciando();
        },
        view_record:function(a){
            view_record(a);
        },
        delete_record:function(a){
            delete_record(a);
        },
        view_kardex:function(a){
            view_kardex(a);
        },
        viewSucursal:function (a){
            viewSucursal(a);
        },
        viewMovimientoCaja:function (a) {
            viewMovimientoCaja(a);
        },
        ver_consolidado:function(a){
            ver_consolidado(a);
        },
        eliminar_consolidado :function(a){
            eliminar_consolidado(a);
        }
    };
}();
jQuery(document).ready(function () {
    Almacen.init();
});