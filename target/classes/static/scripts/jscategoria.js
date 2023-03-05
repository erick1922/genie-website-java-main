var Categoria = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var ListCategoria = function(){
        table = $("#tblCategoria").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_categorias",data:function(d){
                d.tippro = $("#cboBusTipProd").val();
                d.desc = $("#txtDesc").val();
                d.est = $("#cboBusEstado").val();
            }},
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
    
    var Limpiar = function(){
        LimpiarInputFormulario("frmCategoria");
        style_error_cbo_final("#cboTipoProducto",false);
        style_error_cbo_final("#estado",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nueva Categoria");
        $("#accion").val("save");
        $("#id").val("0");
        $("#cboTipoProducto").selectpicker('val','0');
        $("#estado").selectpicker('val','H');
        $("#modalCategoria").modal("show");
        $("#desc").focus();
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_categoria",
            dataType: 'json',
            data:$("#frmCategoria").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalCategoria").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#desc");uploadMsnSmall("EL Nombre de Categoria debe de ser menos de 50 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#cboTipoProducto",true);}
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
            url: "view_categoria",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#desc").val(respJson.nombre);
                    $("#cboTipoProducto").selectpicker('val',respJson.tipoProducto.id);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Categoria");
                    $("#accion").val("update");
                    $("#modalCategoria").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };
    
    var delete_record = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar la Categoria?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_categoria',
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
    
    var Iniciando = function(){
        ListCategoria();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#cboTipoProducto").on("change",function(){style_error_cbo_final('#cboTipoProducto',false);});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        keyup_input_general_3("#frmCategoria input", "#frmCategoria", "#modalCategoria");
        $("#cboBusEstado").on("change",function(){table._fnDraw();});
        $.ajax({
            type:'post',
            url:"mant_marca",
            dataType:'json',
            success: function (respJson) {
                if (respJson !== null) {
                    $("#cboBusTipProd").html("<option value='T'>TODOS</option>"+respJson.htTipo);
                    $("#cboTipoProducto").html("<option value='0'>SELECCIONE</option>"+respJson.htTipo);
                    $("#cboBusTipProd,#cboTipoProducto").selectpicker('refresh');
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#desc").on("keyup",function(e){
            if(e.keyCode === 13){
                $("#btnGuardar").trigger("click");
            }
        });
        $("#cboBusTipProd").on("change",function () {
            table._fnDraw();
        });
    };
    
    return {
        init: function () {
            Iniciando();
        },
        view_record:function(elem){
            view_record(elem);
        },
        delete_record:function(elem){
            delete_record(elem);
        }
    };
}();
jQuery(document).ready(function () {
    Categoria.init();
});