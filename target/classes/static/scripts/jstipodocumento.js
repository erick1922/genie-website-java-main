var TipoDocumento = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var ListTipoDocumento = function(){
        table = $("#tblTipoDocumento").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_tipodocumentos",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1]},
                {'sClass':"centrado boton-tabla",'aTargets': [5]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmTipoDocumento input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#estado",false);
        style_error_cbo_final("#lugar",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Tipo Documento");
        $("#accion").val("save");
        $("#id").val("0");
        $("#estado").selectpicker('val','H');
        $("#modalTipoDocumento").modal("show");
        $("#desc").focus();
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_tipodocumento",
            dataType: 'json',
            data:$("#frmTipoDocumento").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalTipoDocumento").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#codigo");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#lugar",true);}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#seimprime",true);}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#tieneigv",true);}
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
            url: "view_tipodocumento",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){console.log(respJson);
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#div-estado").show();
                    $("#desc").val(respJson.nombre);
                    $("#codigo").val(respJson.codigo);
                    $("#lugar").selectpicker('val',respJson.lugarUso);
                    $("#seimprime").selectpicker('val',respJson.imprimible);
                    $("#tieneigv").selectpicker('val',respJson.tieneIgv);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Tipo Documento");
                    $("#accion").val("update");
                    $("#modalTipoDocumento").modal("show");
                    $("#desc").focus();
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Tipo de Documento?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_tipodocumento',
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
        ListTipoDocumento();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado,#lugar,#seimprime,#tieneigv").on("change",function(){style_error_cbo_final($(this),false);});
        keyup_input_general_3("#frmTipoDocumento input", "#frmTipoDocumento", "#modalTipoDocumento");
        $(document).keydown(function(event){
            if(event.which == 112){ //F1
                if(!cargando.isLoading()){
                    new_record();
                    return false;
                }
            }
            if(event.which == 114){ //F3
                if( $('#modalTipoDocumento').hasClass('in')){
                    if(!cargando.isLoading()){
                        $("#btnGuardar").trigger("click");
                        return false;
                    }
                }
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_tipodocumento",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboMovContable").html(respJson.htMovCon);
                    $("#cboMovContable").selectpicker("refresh");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
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
    TipoDocumento.init();
});