var Inventario = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnNewSale'));
    var agregar = Ladda.create(document.querySelector('#btnAddItem'));
    var cantidad = Ladda.create(document.querySelector('#btnAddCantidad'));

    var table;
    var tableProducto;
    var idpro = 0;
    var id;
    var ida;

    var ListMovimientos = function(){
        table = $("#tblMovimientos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_inventarios",data:function(d){
                d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idalm = $("#cboLiAlmacen").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1]},
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
            "ajax" : {type:'POST',url:"list_productosxinventario",data:function(d){
                d.tipo = $("#cboBuscar").val();
                d.idinv = $("#idinv").val();
                d.desc = $("#namepro").val();
                d.est =  $("#cboEstadoPro").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-right",'aTargets': [4,5]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $("#frmDataMovimiento")[0].reset();
        $("#frmDataProductos")[0].reset();
        $('#div-fecreginv').datepicker('update',fecAct);
        $("#txttransporte").selectpicker('val',"0");
    };

    var new_record = function()
    {
        Limpiar();
        $("#tblDetalles").html("");
        $("#titulo").html("Inicio de inventario");
        ida = $("#cboLiAlMovimiento").val();
        $("#modalCategorias").modal("show");
    };

    var validarCantidad = function(){
        if($("#cboAccion").val()!=="A" && $("#cboAccion").val() !== "D"){
            uploadMsnSmall("No ha Seleccionado la Accion correcta.","ALERTA");
            cantidad.stop();
            return false;
        }
        if($("#txtCantidad").val()==="" || parseFloat($("#txtCantidad").val())<=0){
            uploadMsnSmall("Cantidad Incorrecta","ALERTA");
            cantidad.stop();
            return false;
        }
        return true;
    };

    var count_products = function(a){
        $("#idinv").val($(a).attr("id"));
        $("#txtnum").val($(a).attr("data-num"));
        $("#txtalmacen").val($(a).attr("data-alm"));
        $("#txtven").val($(a).attr("data-usu"));
        tableProducto._fnDraw();
        $("#newSale").modal("show");
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Inventario de Almacen?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_inventario',
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

    var addPrductBarcode = function(elem){
        agregar.start();
        $.ajax({
            type: 'post',
            url: "addpro_inventario",
            dataType: 'json',
            data:{codepro:$(elem).val(),idinv:$("#idinv").val()},
            success: function (respJson){
                if (respJson !== null) {
                    if(respJson.dato === "OK"){
                        var pro = respJson.objeto;
                        $("#namepro").val(pro.desCategoria + " "+ pro.desMarca+ " "+pro.nombre + (pro.modelo!==null?" "+pro.modelo:""));
                        $("#txtBarcode").val("");
                        tableProducto._fnDraw();
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

    var addCantidad = function(elem){
        idpro = $(elem).attr("id");
        $("#cboAccion").selectpicker('val',"A");
        $("#txtCantidad").val("");
        $("#modalCantidad").modal("show");
    };

    var imprimir_inventario = function(){
        var method = "downloadInventario";
        var parameters = "idinv=" + $("#idinv").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecreginv").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        $('#div-fecreginv').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            //forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format:"dd-mm-yyyy",
            endDate:new Date()
        });
        NumeroDosDecimales($("#txtCantidad"));
        $("#div-fecreginv").datepicker().on('show.bs.modal', function (event) {
            if ($("#div-movimientos").hasClass("bloqueDatos")) {
                $('.datepicker-dropdown').each(function () {
                    this.style.setProperty('z-index', '10070', 'important');
                });
            }
        });
        $("#btnAddCategorias").on("click",function(){
            var hora = moment().format('HH:mm:ss');
            var val = $("#cboCategoria").val();
            if(val === null){
                uploadMsnSmall("Seleccionar al menos una categoria.", "ALERTA");
                return;
            }
            var cat = "";
            for (var i = 0; i < val.length;i++) {
                cat+=val[i] + ",";
            }
            cat = cat.substring(0, cat.length - 1);
            cargando.start();
            $.ajax({
                type: 'post',
                url: "save_inventario",
                dataType: 'json',
                data:{ida:ida,fec:$("#fecreginv").val(),hora:hora,categorias:cat},
                success:function(respJson){
                    if(respJson !== null) {
                        if (respJson.dato === "OK") {
                            $("#modalCategorias").modal("hide");
                            $("#chkAllCategoria").prop("checked",false);
                            $("#chkAllCategoria").val("0");
                            $("#chkAllCategoria").iCheck('update');
                            $('#cboCategoria').selectpicker('deselectAll');
                            table._fnDraw();
                            uploadMsnSmall(respJson.msj,'OK');
                            cargando.stop();
                        } else if (respJson.dato === "ERROR") {
                            if (respJson.listado.length > 0) {
                                for (var i = 0; i < respJson.listado.length; i++) {
                                    if (respJson.listado[i] === "E1") {
                                        uploadMsnSmall("Almacen Incorrecto.", "ALERTA");
                                    }
                                    if (respJson.listado[i] === "E2") {
                                        uploadMsnSmall("Usuario Incorrecto.", "ALERTA");
                                    }
                                    if (respJson.listado[i] === "E3") {
                                        uploadMsnSmall("Fecha Incorrecta.", "ALERTA");
                                    }
                                    if (respJson.listado[i] === "E4") {
                                        uploadMsnSmall("Hora Incorrecta.", "ALERTA");
                                    }
                                }
                            } else {
                                uploadMsnSmall(respJson.msj, 'ERROR');
                            }
                            cargando.stop();
                        }
                    }else{
                        uploadMsnSmall("PROBLEMAS EN EL SERVIDOR.", 'ERROR');
                        cargando.stop();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    cargando.stop();
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });
        $("#btnNewSale").on("click",new_record);
        $("#btnAddCantidad").on("click",function(){
            if(validarCantidad()) {
                cantidad.start();
                $.ajax({
                    type: 'post',
                    url: "addpro_inventario",
                    dataType: 'json',
                    data: {codepro: idpro, idinv: $("#idinv").val(), accion: $("#cboAccion").val(), cant: $("#txtCantidad").val()},
                    success: function (respJson) {
                        if (respJson !== null) {
                            if (respJson.dato === "OK") {
                                $("#modalCantidad").modal("hide");
                                var pro = respJson.objeto;
                                $("#namepro").val(pro.desCategoria + " " + pro.desMarca + " " + pro.nombre + (pro.modelo !== null ? " " + pro.modelo : ""));
                                tableProducto._fnDraw();
                                cantidad.stop();
                                $("#txtBarcode").focus();
                            } else if (respJson.dato === "ERROR") {
                                cantidad.stop();
                                uploadMsnSmall(respJson.msj, 'ERROR');
                            }
                        } else {
                            cantidad.stop();
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        agregar.stop();
                        uploadMsnSmall('¡Se encontró un problema en el servidor!', 'ERROR');
                    }
                });
            }
        });
        $("#btnOpenModalProducto").on("click",function(){
            tableProducto._fnDraw();
        });
        $("#txtBarcode").on("keypress",function(event){
            if(event.keyCode === 13){///CON EL LECTOR SE ESCRIBE EL CODIGO va generando un evento y al final da enter, se captura el enter y arroja todo el texto completo.
                if(!agregar.isLoading()){
                    addPrductBarcode($(this));
                }
            }
        });
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#namepro").on("keyup",function(e){if(e.keyCode===13){tableProducto._fnDraw();}});
        $("#btnAddItem").on("click",function () {
            if(!agregar.isLoading()){
                addPrductBarcode($("#txtBarcode"));
            }
        });
        $("#btnImprimir").on("click",imprimir_inventario);
        $.ajax({
            type: 'post',
            url: "mant_inventario",
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    $("#cboLiAlMovimiento").html(respJson.htA);
                    $("#cboLiAlmacen").html((respJson.usu === "1" ? "<option value='0'>--TODOS--</option>" : "")+respJson.htA);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+respJson.htU);
                    $("#cboLiTipDoc").html("<option value='0'>--TODOS--</option>"+respJson.htT);
                    $("#txttransporte").html("<option value='0'>--SELECCIONE--</option>"+respJson.htU);
                    $("#txtalmacendes").html("<option value='0'>--SELECCIONE--</option>"+respJson.htA);
                    $("#cboCategoria").html(respJson.htC);
                    $(".selectpicker").selectpicker("refresh");
                    ListMovimientos();
                    ListarsearchPro();
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#chkAllCategoria").iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(e){
            var isChecked = e.currentTarget.checked;
            $(this).prop("checked",isChecked);
            $(this).val(isChecked?"1":"0");
            $(this).iCheck('update');
            if(isChecked){
                $('#cboCategoria').selectpicker('selectAll');
            } else{
                $('#cboCategoria').selectpicker('deselectAll');
            }
        });
        $("#newSale").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#newSale:visible").each(ModalCompleto);
        });
    };

    return {
        init: function () {
            Iniciando();
        },
        Cancelar:function(elem){
            Cancelar(elem);
        },
        count_products:function(a){
            count_products(a);
        },
        addCantidad:function(a) {
            addCantidad(a);
        }
    };
}();
jQuery(document).ready(function () {
    Inventario.init();
});