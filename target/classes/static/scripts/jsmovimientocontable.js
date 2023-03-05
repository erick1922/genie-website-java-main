var Model = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var permisos = Ladda.create(document.querySelector('#btnGuardarPermisos'));
    var table;
    var listaTipDoc = new Array();

    var ListCargos = function(){
        table = $("#tblCargo").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_movimientos_contables",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,2]},
                {'sClass':"centrado boton-tabla",'aTargets': [5]},
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
        style_error_cbo_final("#stock",false);
        style_error_cbo_final("#armado",false);
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Nuevo Tipo de Producto");
        $("#accion").val("save");
        $("#id").val("0");
        $("#stock").selectpicker('val','0');
        $("#armado").selectpicker('val','0');
        $("#estado").selectpicker('val','H');
        $("#modalCargo").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_tipoproducto",
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
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#abrev");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#abrev");uploadMsnSmall("Abreviatura debe de tener un digito.","ALERTA");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#stock",true);}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#estado",true);}
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
            url: "view_tipoproducto",
            dataType: 'json',
            data:{id:$(elem).attr("id").split("_")[2]},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#desc").val(respJson.nombre);
                    $("#abrev").val(respJson.abreviatura);
                    $("#stock").selectpicker('val',respJson.mueveStock);
                    $("#armado").selectpicker('val',respJson.esCombo);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Tipo Producto");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Tipo de Producto?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_tipoproducto',
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

    var viewTipoDocumentos = function(elem){
        var idtip = $(elem).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_tipodoc_movcontable",
            dataType: 'json',
            data:{id:idtip},
            success:function(respJson){
                if(respJson!==null){
                    var lista = respJson.lista;
                    console.log(lista);
                    var html = "";
                    for(var i=0;i<listaTipDoc.length;i++){
                        var val = "0";
                        var check = "";
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td>"+listaTipDoc[i].nombre+"</td>";
                        var celda = "0";
                        for(var j=0;j<lista.length;j++){
                            if(lista[j].tipoDocumento.id === listaTipDoc[i].id ){
                                celda = "1";
                                val = "1";
                                check = "checked";
                                html+="<td style='padding-bottom: 3px!important;padding-top: 4px!important;'>" + "<div class='i-checks text-center'><label class=\"text-center\"><input type=\"checkbox\" name=\"chkOpe\" id='chk_act_"+i+"' class=\"icheck chkGeneral\" value='"+val+"' "+check+" data-pos='"+i+"' data-id='"+listaTipDoc[i].id+"' data-checkbox=\"icheckbox_flat-blue\"/><span></span></label></div>" + "</td>";
                                j=lista.length + 1;
                            }
                        }
                        if(celda === "0"){
                            html+="<td style='padding-bottom: 3px!important;padding-top: 4px!important;'>" + "<div class='i-checks text-center'><label class=\"text-center\"><input type=\"checkbox\" name=\"chkOpe\" id='chk_act_"+i+"' class=\"icheck chkGeneral\" value='"+val+"'  data-pos='"+i+"' data-id='"+listaTipDoc[i].id+"' data-checkbox=\"icheckbox_flat-blue\"/><span></span></label></div>" + "</td>";
                        }
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

    var checkObligatorio = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
        var pos = $(a).attr("data-pos");
        $("#chk_act_"+pos).attr("data-ob",$(a).val());
    };

    var SavePermisos = function(){
        permisos.start();
        var ids = new Array();
        var vals = new Array();
        var valob = new Array();
        $("#frmViewPermisos input[name='chkOpe']").each(function(){
            ids.push($(this).attr("data-id"));
            vals.push($(this).val());
            valob.push($(this).attr("data-ob"));
        });
        $.ajax({
            type: 'post',
            url: "save_propiedades",
            data:{"ids[]":ids,"vals[]":vals,"valob[]":valob},
            dataType: 'json',
            success: function (respJson){
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
        $("#stock").on("change",function(){style_error_cbo_final('#stock',false);});
        $("#armado").on("change",function(){style_error_cbo_final('#armado',false);});
        $("#viewPermisos").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPermisos:visible").each(ModalCompleto);
        });
        keyup_input_general_3("#frmCargo input", "#frmCargo", "#modalCargo");
        $.ajax({
            type: 'post',
            url: "mant_mov_contable",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    listaTipDoc = respJson.liTipDoc;
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
        },
        viewTipoDocumentos:function(elem){
            viewTipoDocumentos(elem);
        }
    };
}();
jQuery(document).ready(function () {
    Model.init();
});