var Cargo = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var permisos = Ladda.create(document.querySelector('#btnGuardarPermisos'));
    var arbol = $("#jstree1");
    var table;
    var idC = 0;

    var ListCargos = function(){
        table = $("#tblCargo").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_cargos",data:function(d){d.desc = $("#txtDesc").val();}},
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
        style_error_cbo_final("#nivel",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#titulo").html("Nuevo Cargo");
        $("#accion").val("save");
        $("#id").val("0");
        $("#desc").val("");
        $("#nivel").selectpicker('val','0');
        $("#estado").selectpicker('val','H');
        $("#modalCargo").modal("show");
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_cargo",
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
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#nivel",true);}
                                if(respJson.listado[i] === "E3"){style_error_cbo_final("#estado",true);}
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
            url: "view_cargo",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#desc").val(respJson.nombre);
                    $("#nivel").selectpicker('val',respJson.jerarquia);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Cargo");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Cargo?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_cargo',
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

    var ViewOperaciones = function(a){
        $("#titPermisos").text($(a).attr("data-original-title"));
        idC = $(a).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_menu_operaciones",
            dataType: 'json',
            data:{id:idC},
            success:function(respJson){
                console.log(respJson);
                if(respJson!==null) {

                    $("#tblOperacionesxCargo").html(respJson.table);

                    $("#viewOperacionesxCargo").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };
    
    var viewPermisos = function(elem){
        var ids = new Array();
        var newestados = new Array();
        var links = new Array();
        var posiciones = new Array();
        $("#titPermisos").text($(elem).attr("data-original-title"));
        arbol.jstree("destroy");
        idC = $(elem).attr("id").split("_")[2];
        $.ajax({
            type: 'post',
            url: "view_permisos",
            dataType: 'json',
            data:{id:idC},
            success:function(respJson){
                if(respJson!==null) {
                    for (var i= 0 ; i<respJson.length ; i++){
                        ids.push(respJson[i].id);
                        newestados.push("I");
                        if(respJson[i].link === "#"){
                            posiciones.push(i);
                            links.push(respJson[i].id);
                        }
                    }
                    arbol.on("changed.jstree", function (e, data) {
                        // console.log(data.node.id);
                        // seleccionados = data.selected;
                    }).on('deselect_node.jstree Event', function (e, data) {
                    }).on('select_node.jstree Event', function (e, data) {
                        //console.log(data.node)
                    }).jstree({
                        'plugins': ["wholerow", "checkbox", "types","changed","search"],
                        'core' : {
                            'data' : respJson
                        },
                        "search": {
                            "case_insensitive": true,
                            "show_only_matches" : true
                        }
                    });
                    var to = false;
                    $('#plugins4_q').val("");
                    $('#plugins4_q').keyup(function () {
                        if(to) { clearTimeout(to); }
                        to = setTimeout(function () {
                            var v = $('#plugins4_q').val();
                            $('#jstree1').jstree(true).search(v);
                        }, 250);
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
    
    var SavePermisos = function(){
        permisos.start();
        var ids = new Array();
        ///Repositorio.refreshTable($('div.blockMe'));
        var nodes = arbol.jstree('get_selected', true);
        for (var i= 0 ; i<nodes.length ; i++){
            ids.push(nodes[i].id);
        }
        $.ajax({
            type: 'post',
            url: "save_permisos",
            data:{"ids[]":ids,"idc":idC},
            dataType: 'json',
            success: function (respJson) {
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
    
    /*var checkPermisos = function(e,a){
        var tipo = $(a).attr("name").split("_")[0];
        var id = $(a).attr("name").split("_")[1];
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
        if(tipo === "pri"){
            $("input[name='sec_"+id+"[]']").each(function(){
                $(this).prop("checked",isChecked);
                $(this).val(isChecked?"1":"0");
                $(this).iCheck('update');
            });
        }else if(tipo === "sec"){
            id = id.replace("[]","");
            var valor = "1";
            $("input[name='sec_"+id+"[]']").each(function(){
                if($(this).val() === "0"){valor = "0"; }
            });
            $("input[name='pri_"+id+"']").prop("checked",(valor==="1"?true:false));
            $("input[name='pri_"+id+"']").val(valor);
            $("input[name='pri_"+id+"']").iCheck('update');
        }
    };*/
    
    var Iniciando = function(){
        ListCargos();
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnGuardarPermisos").on("click",SavePermisos);
        $.ajax({
            type: 'post',
            url: "mant_cargos",
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    $("#nivel").html(respJson.htNi);
                    $("#nivel").selectpicker("refresh");
                } else {
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        $("#nivel").on("change",function(){style_error_cbo_final('#nivel',false);});
        keyup_input_general_3("#frmCargo input", "#frmCargo", "#modalCargo");
        $("#viewPermisos").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPermisos:visible").each(ModalCompleto);
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
        viewPermisos:function(elem){
            viewPermisos(elem);
        },
        ViewOperaciones:function(a){
            ViewOperaciones(a);
        }
    };
}();
jQuery(document).ready(function () {
    Cargo.init();
});