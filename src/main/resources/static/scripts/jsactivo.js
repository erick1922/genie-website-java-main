var Activo = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var activo = Ladda.create(document.querySelector("#btnGuardarActivo"));
    var table;
    var tableProveedor;
    var idalm = 0 ;
    var id;

    var ListCompras = function(){
        table = $("#tblCompras").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_comp_activos",data:function(d){
                d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idalm = $("#cboLiAlmacen").val();
                d.idusu = $("#cboLiUsuario").val();d.idtipdoc = $("#cboLiTipDoc").val();
                d.tipo = $("#cboLiTipoM").val();
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

    var ListarsearchActivos = function(){
        tableProveedor = $("#tblProveedor").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_search_activos",data:function(d){d.desc = $("#txtDescProveedor").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,3]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmDetaActivo input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#frmDetaActivo #cboActivo",false);
        style_error_cbo_final("#frmDetaActivo #tipdoc",false);
        $('#div-fecregmov').datepicker('update',fecAct);
    };

    var Limpiar_Activo = function(){
        $.each($("#frmActivo input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#frmActivo #estado",false);
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Registrar Movimiento");
        $("#frmDetaActivo #accion").val("save");
        $("#cboActivo").selectpicker('val','0');
        $("#tipomov").selectpicker('val','E');
        $("#frmDetaActivo #id").val("0");
        $("#txtalmacen").val($('option:selected',$("#cboLiAlCompra")).text());
        idalm = $("#cboLiAlCompra").val();
        $("#txtCantidad").val("0.00");
        $("#txtPrecio").val("0.00");
        $("#txtTotGasto").val("0.00");
        $("#newSale").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_detactivo",
            dataType: 'json',
            data: $("#frmDetaActivo").serialize()+"&idalm="+idalm,
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
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Activo Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Almacen Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Inicie Session Usuario en una nueva pestaña.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Fecha Incorrecta.",'ALERTA');}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Cantidad Incorrecta.",'ALERTA');}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Precio Unitario Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E7"){uploadMsnSmall("Monto Total Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E8"){uploadMsnSmall("Tipo Movimiento Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E9"){uploadMsnSmall("Motivo Incorrecto.",'ALERTA');}
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
            url: "view_detactivo",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#titulo").html("Modificar Movimiento");
                    $("#frmDetaActivo #accion").val("update");
                    $("#frmDetaActivo #id").val(respJson.id);
                    idalm = respJson.otbAlmacen.id;
                    $("#txtalmacen").val(respJson.otbAlmacen.nombre);
                    var fecreg = moment(respJson.fecha).format('DD-MM-YYYY');
                    $('#div-fecregmov').datepicker('update',fecreg);
                    $("#tipomov").selectpicker('val',respJson.tipoDetalle);
                    $("#cboActivo").selectpicker('val',respJson.otbActivo.id);
                    $("#tipdoc").selectpicker('val',respJson.otbTbTipoDocumento.id);
                    $("#txtNumDocGasto").val(respJson.numDocumento);
                    $("#txtMotivo").val(respJson.motivoDetalle);
                    $("#txtCantidad").val(Redondear2(respJson.cantidad));
                    $("#txtPrecio").val(Redondear2(respJson.preUnitario));
                    $("#txtTotGasto").val(Redondear2(respJson.montoTotal));
                    $("#tipomov").change();
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

    var view_record_activo = function (elem) {
        Limpiar_Activo();
        $.ajax({
            type: 'post',
            url: "view_activo",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#div-estado-activo").show();
                    $("#frmActivo #id").val(respJson.id);
                    $("#frmActivo #desc").val(respJson.descripcion);
                    $("#frmActivo #estado").selectpicker('val',respJson.estado);
                    $("#titActivo").html("Modificar Activo");
                    $("#frmActivo #accion").val("update");
                    $("#modalActivo").modal("show");
                    $("#frmActivo #desc").focus();
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Movimiento de Compra?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_detactivo',
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

    var delete_record_activo = function (elem) {
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Activo?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_activo',
                        data: {"id":$(elem).attr("id")},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    tableProveedor._fnDraw();
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

    var new_activo = function(){
        Limpiar_Activo();
        $("#div-estado-activo").hide();
        $("#titActivo").html("Registrar Activo");
        $("#frmActivo #accion").val("save");
        $("#frmActivo #desc").val("");
        $("#frmActivo #estado").selectpicker('val','H');
        $("#modalActivo").modal("show");
        $("#frmActivo #desc").focus();
    };

    var ReloadActivos = function(){
        $.ajax({
            type: 'post',
            url: "select_activo",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboActivo").html(respJson.htAc);
                    $("#cboActivo").selectpicker("refresh");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var save_activo = function(){
        activo.start();
        $.ajax({
            type: 'post',
            url: "save_activo",
            dataType: 'json',
            data:$("#frmActivo").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        activo.stop();
                        $("#modalActivo").modal("hide");
                        ReloadActivos();
                        uploadMsnSmall(respJson.msj,'OK');
                        tableProveedor._fnDraw();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmActivo #desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#frmActivo #estado",true);}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmActivo #desc");uploadMsnSmall("EL Nombre de Activo debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        activo.stop();
                    }
                }else{
                    activo.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                activo.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecregmov").val(fecAct);
        FormatoFecha($("#data_1"),"dd-mm-yyyy");
        FormatoFecha($("#data_2"),"dd-mm-yyyy");
        $('#div-fecregmov').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            calendarWeeks: true,
            autoclose: true,
            format:"dd-mm-yyyy",
            endDate:new Date(),
            todayHighlight: true
        });
        $("#data_3").datepicker().on('show.bs.modal', function(event){
            if ($("#div-compras").hasClass("bloqueDatos")){
                $('.datepicker-dropdown').each(function(){
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        NumeroDosDecimales($("#txtCantidad"));
        NumeroDosDecimales($("#txtPrecio"));
        NumeroDosDecimales($("#txtTotGasto"));
        $("#addBtnActivo").on("click",new_activo);
        $("#btnGuardarActivo").on("click",save_activo);
        $("#btnNewSale").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){
            $("#modalSearchActivos").modal("show");
        });
        $("#btnPrint").on("click",function () {
            var opt = $('option:selected', $("#cboLiAlCompra")).text();
            var method = "downloadActivos";
            var parameters = "idalm="+$("#cboLiAlCompra").val()+"&nom="+opt;
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });
        $("#btnSearchModalProveedor").on("click",function(){tableProveedor._fnDraw();});
        $("#txtDescProveedor").on("keyup",function(e){if(e.keyCode===13){tableProveedor._fnDraw();}});
        $("#frmProducto #estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#cboMarca").on("change",function(){ style_error_cbo_final('#cboMarca',false);});
        $("#cboCategoria").on("change",function(){ style_error_cbo_final('#cboCategoria',false);});
        $("#cboUnidad").on("change",function(){ style_error_cbo_final('#cboUnidad',false);});
        keyup_input_general_3("#frmProducto input", "#frmProducto", "#modalProducto");
        $("#frmProveedor #estado").on("change",function(){style_error_cbo_final('#estado',false);});
        keyup_input_general_3("#frmProveedor input", "#frmProveedor", "#modalProveedor");
        $("#cboLiAlmacen,#cboLiTipDoc,#cboLiUsuario,#cboLiTipoM").on("change",function(){table._fnDraw();});
        $("#data_1,#data_2").on("changeDate",function(){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#tipomov").on("change",function () {
            var val = $(this).val();
            if(val === "E"){
                $("#div-motivo").hide();
            }else if(val === "S"){
                $("#div-motivo").show();
            }
        });
        $("#txtCantidad,#txtPrecio").on("keyup",function(){
             var valor = parseFloat($("#txtCantidad").val())*parseFloat($("#txtPrecio").val());
             $("#txtTotGasto").val(Redondear2(valor));
        });
        $.ajax({
            type: 'post',
            url: "mant_activo",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboLiAlCompra").html(data.htA);
                    $("#cboLiAlmacen").html( (data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htA);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboLiTipDoc").html("<option value='0'>--TODOS--</option>"+data.htT);
                    $("#tipdoc").html("<option value='0'>--SELECCIONE--</option>"+data.htT);
                    $("#cboActivo").html("<option value='0'>--SELECCIONE--</option>"+data.htAc);
                    $(".selectpicker").selectpicker("refresh");
                    ListCompras();
                    ListarsearchActivos();
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
        delete_record_activo:function (a) {
            delete_record_activo(a);
        },
        view_record_activo:function (a) {
            view_record_activo(a);
        }
    };
}();
jQuery(document).ready(function () {
    Activo.init();
});