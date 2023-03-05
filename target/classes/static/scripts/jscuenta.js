var Cuenta = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var arbol = $("#jstree1");

    var ListCuenta = function(){
        table = $("#tblCuenta").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_cuentas",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [5]},
                {'bSearchable': false, 'aTargets': [0,1,2,3,4,5]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmCuenta input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });  
        style_error_cbo_final("#cboTipoCuenta",false);
        style_error_cbo_final("#estado",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#titulo").html("Nueva Cuenta");
        $("#accion").val("save");
        $("#id").val("0");
        $("#estado").selectpicker('val','H');
        $("#cboTipoCuenta").selectpicker('val','0');
        $("#cboCuentaSuperior").selectpicker('val','0');
        $("#modalCuenta").modal("show");
        $("#codigo").focus();
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_cuenta",
            dataType: 'json',
            data:$("#frmCuenta").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalCuenta").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){ estilo_error(true,"#codigo");}
                                if(respJson.listado[i] === "E2"){ style_error_cbo_final("#cboTipoCuenta",true);}
                                if(respJson.listado[i] === "E3"){ estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E4"){ style_error_cbo_final("#estado",true);}
                             /*  if(respJson.listado[i] === "E5"){ style_error_cbo_final("#cboNivel",true);}
                                if(respJson.listado[i] === "E6"){ uploadMsnSmall("Nivel Incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E7"){ style_error_cbo_final("#cboCuentaSuperior",true);}*/
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
            url: "view_cuenta",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#codigo").val(respJson.codigo);
                    $("#desc").val(respJson.descripcion);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Cuenta");
                    $("#accion").val("update");
                    $("#modalCuenta").modal("show");
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
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        $("#cboTipoCuenta").on("change",function(){style_error_cbo_final("#cboTipoCuenta",false);});
        $("#cboCuentaSuperior").on("change",function(){style_error_cbo_final('#cboCuentaSuperior',false);});
        keyup_input_general_3("#frmCuenta input", "#frmCuenta", "#modalCuenta");
        $.ajax({
            type: 'post',
            url: "mant_cuentas",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboTipoCuenta").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htT);
                    $("#cboLiTipoCuenta").html("<option value='T'>--TODOS--</option>"+respJson.htT);
                    $("#cboCuentaSuperior").html(respJson.htC);
                    $(".selectpicker").selectpicker("refresh");
                    ListCuenta();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#btnAtras").on("click",function () {
            $("#btnAtras").hide();
            $("#div-plan-contable").hide();
            $("#btnViewPlan").show();
            $("#btnNuevo").show();
            $("#div-busqueda-cuentas").show();
            $("#div-cuentas-contables").show();
            $("#btnSearch").trigger("click");
        });
        $("#btnViewPlan").on("click",function () {
            var ids = new Array();
            var newestados = new Array();
            var links = new Array();
            var posiciones = new Array();
            $("#titPermisos").text("CUENTAS CONTABLES");
            arbol.jstree("destroy");
            var idC = 1;
            $.ajax({
                type: 'post',
                url: "view_arbol_cuenta",
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
                            //'plugins': ["wholerow", "checkbox", "types","changed","search"],
                            'core' : {
                                "animation" : 0,
                                "check_callback" : true,
                                "themes" : { "stripes" : true },
                                'data' : respJson
                            },
                            "types" : {
                                "#" : {
                                    "max_children" : 1,
                                    "max_depth" : 4,
                                    "valid_children" : ["root"]
                                },
                                "root" : {
                                    "icon" : "/static/3.3.8/assets/images/tree_icon.png",
                                    "valid_children" : ["default"]
                                },
                                "default" : {
                                    "valid_children" : ["default","file"]
                                },
                                "file" : {
                                    "icon" : "glyphicon glyphicon-file",
                                    "valid_children" : []
                                }
                            },


                            "plugins" : [
                                "contextmenu", "dnd", "search",
                                "state", "types", "wholerow"
                            ]/*,
                            "search": {
                                "case_insensitive": true,
                                "show_only_matches" : true
                            }*/
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
                        $("#btnViewPlan").hide();
                        $("#btnNuevo").hide();
                        $("#btnAtras").show();
                        $("#div-busqueda-cuentas").hide();
                        $("#div-cuentas-contables").hide();
                        $("#div-plan-contable").show();
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
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
    Cuenta.init();
});