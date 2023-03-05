var Model = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var permisos = Ladda.create(document.querySelector('#btnGuardarPermisos'));
    var table;

    var ListCargos = function(){
        table = $("#tblCargo").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_rubro_negocio",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [4]},
                {'bSearchable': false, 'aTargets': [0,1,2,3,4]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmCargo input"), function(){
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#estado",false);
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Nuevo Rubro de Negocio");
        $("#accion").val("save");
        $("#id").val("0");
        $("#estado").selectpicker('val','H');
        $("#modalCargo").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_rubronegocio",
            dataType: 'json',
            data:$("#frmCargo").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalCargo").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#tipo");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#tipo");uploadMsnSmall("Tipo de Rubro debe de tener menos de 30 caracteres.","ALERTA");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#estado",true);}
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
            url: "view_rubronegocio",
            dataType: 'json',
            data:{id:$(elem).attr("id").split("_")[2]},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#desc").val(respJson.nombre);
                    $("#tipo").val(respJson.tipo);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Rubro de Negocio");
                    $("#accion").val("update");
                    $("#modalCargo").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Rubro de Negocio?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_rubronegocio',
                        data: {"id":$(elem).attr("id").split("_")[2]},
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

    var viewPropiedades = function(elem){
        var idtip = $(elem).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_tipoprod_rubro",
            dataType: 'json',
            data:{id:idtip},
            success:function(respJson){
                if(respJson!==null){console.log(respJson);
                    var lista = respJson.lista;
                    var html = "";
                    for(var i=0;i<lista.length;i++){
                        var val = (lista[i].estado === "H") ? "1" : "0";
                        var check = (lista[i].estado === "H") ? "checked" : "";
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td>"+lista[i].tipoProducto.nombre+"</td>";
                        html+="<td>" + "<div class='i-checks text-center'><label class=\"text-center\"><input type=\"checkbox\" name=\"chkOpe\" class=\"icheck chkGeneral\" value='"+val+"' "+check+" data-id='"+lista[i].id+"' data-checkbox=\"icheckbox_flat-blue\"/><span></span></label></div>" + "</td>";
                        html+="</tr>";
                    }
                    $("#tblDetalles").html(html);
                    $('.chkGeneral').iCheck({checkboxClass:'icheckbox_square-green'}).on('ifChanged',function(event){
                        checkGeneral(event,$(this));
                    });
                    $("#viewPermisos").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var checkGeneral = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var SavePermisos = function(){
        permisos.start();
        var ids = new Array();
        var vals = new Array();
        $("#frmViewPermisos input[type='checkbox']").each(function(){
            ids.push($(this).attr("data-id"));
            vals.push($(this).val());
        });
        $.ajax({
            type: 'post',
            url: "save_tipoprod_rubro",
            data:{"ids[]":ids,"vals[]":vals},
            dataType: 'json',
            success: function (respJson) {console.log(respJson);
                if (respJson !== null) {
                    if(respJson.dato==="OK"){
                        $("#viewPermisos").modal("hide");
                        uploadMsnSmall(respJson.msj,'OK');
                        permisos.stop();
                    }else if(respJson.dato==="ERROR"){
                        uploadMsnSmall(respJson.msj,'ERROR');
                        permisos.stop();
                    }
                }else{
                    permisos.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                permisos.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        ListCargos();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnGuardarPermisos").on("click",SavePermisos);
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        $("#nivel").on("change",function(){style_error_cbo_final('#nivel',false);});
        keyup_input_general_3("#frmCargo input", "#frmCargo", "#modalCargo");
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
        },
        viewPropiedades:function(elem){
            viewPropiedades(elem);
        }
    };
}();
jQuery(document).ready(function () {
    Model.init();
});