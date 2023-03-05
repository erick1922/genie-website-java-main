var Model = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;

    var ListSeries = function(){
        table = $("#tblSerie").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_menues",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,5,6]},
                {'sClass':"centrado boton-tabla",'aTargets': [7]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmSerie input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#cboMenuPadre",false);
        style_error_cbo_final("#esvisible",false);
        style_error_cbo_final("#estado",false);
    };

    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Menu");
        $("#accion").val("save");
        $("#id").val("0");
        $("#cboMenuPadre").selectpicker('val','0');
        $("#esvisible").selectpicker('val','1');
        $("#estado").selectpicker('val','H');
        $("#modalSerie").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_menu",
            dataType: 'json',
            data:$("#frmSerie").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalSerie").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#serie");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#cboTipo",true);}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Seleccione un Almacen o Sucursal.","ERROR");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Seleccione un Almacen o Sucursal no ambos.","ERROR");}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E6"){estilo_error(true,"#corre");}
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
            url: "view_menu",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#cboMenuPadre").selectpicker('val',respJson.menuPadre!==null?respJson.menuPadre.id:'0');
                    $("#nompagina").val(respJson.nomPagina);
                    $("#parametro").val(respJson.nombre);
                    $("#link").val(respJson.link);
                    $("#esvisible").selectpicker('val',respJson.accesoOpcion);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Menu");
                    $("#accion").val("update");
                    $("#modalSerie").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Menu?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_serie',
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
        ListSeries();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        $("#esvisible").on("change",function(){style_error_cbo_final('#esvisible',false);});
        $("#cboMenuPadre").on("change",function(){style_error_cbo_final('#cboMenuPadre',false);});
        keyup_input_general_3("#frmSerie input", "#frmSerie", "#modalSerie");
        $.ajax({
            type:'post',
            url:"mant_menu",
            dataType:'json',
            success: function (respJson){
                if (respJson !== null){
                    $("#cboMenuPadre").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                    $(".selectpicker").selectpicker("refresh");
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
                if( $('#modalSerie').hasClass('in')){
                    if(!cargando.isLoading()){
                        $("#btnGuardar").trigger("click");
                        return false;
                    }
                }
            }
        });
    };

    return {
        init: function(){
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
    Model.init();
});