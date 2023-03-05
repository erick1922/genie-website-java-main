var Usuario = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var fecAct = moment().format('DD-MM-YYYY');
    var table;

    var ListUsuarios = function(){
        table = $("#tblUsuarios").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_usuarios",data:function(d){
                d.desc = $("#txtDesc").val();d.idc = $("#cboLiCargo").val();d.est = $("#cboBusEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,6]},
                {'sClass':"centrado boton-tabla",'aTargets': [7]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmUsuario input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        $.each($("#frmVendedor input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        style_error_cbo_final("#estado",false);
        style_error_cbo_final("#cboCargo",false);
        style_error_cbo_final("#cboSucursal",false);
        style_error_cbo_final("#genero",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Usuario");
        $('#div-fecnac').datepicker('update',fecAct);
        $('#div-fecing').datepicker('update',fecAct);
        $("#accion").val("save");
        $("#id").val("0");
        $("#cboCargo").selectpicker('val','0');
        $("#cboSucursal").selectpicker('val',[]);
        $("#genero").selectpicker('val','');
        $("#estado").selectpicker('val','H');
        $("#modalUsuario").modal("show");
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_usuario",
            dataType: 'json',
            data:$("#frmUsuario").serialize()+"&"+$("#frmVendedor").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalUsuario").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#dni");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#nombres");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#apepat");}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#apemat");}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#genero",true);}
                                if(respJson.listado[i] === "E6"){estilo_error(true,"#email");uploadMsnSmall("Email excede limite de caracteres.","ALERTA");}
                                if(respJson.listado[i] === "E7"){estilo_error(true,"#email");uploadMsnSmall("Email no es valido.","ALERTA");}
                                if(respJson.listado[i] === "E8"){estilo_error(true,"#direccion");}
                                if(respJson.listado[i] === "E9"){estilo_error(true,"#telefono");}
                                if(respJson.listado[i] === "E10"){estilo_error(true,"#celular");}
                                if(respJson.listado[i] === "E11"){style_error_cbo_final("#cboCargo",true);}
                                if(respJson.listado[i] === "E12"){estilo_error(true,"#usernameU");}
                                if(respJson.listado[i] === "E13"){estilo_error(true,"#passwordU");}
                                if(respJson.listado[i] === "E14"){style_error_cbo_final("#cboSucursal",true);}
                                if(respJson.listado[i] === "E15"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E16"){estilo_error(true,"#codVendedor");}
                                if(respJson.listado[i] === "E17"){uploadMsnSmall("Fecha de Nacimiento incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E18"){uploadMsnSmall("Fecha de Ingreso incorrecto.","ALERTA");}
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
            url: "view_usuario",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){console.log(respJson);
                if(respJson!==null){
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#dni").val(respJson.dni);
                    $("#nombres").val(respJson.nombres);
                    $("#apepat").val(respJson.apePat);
                    $("#apemat").val(respJson.apeMat);
                    $("#email").val(respJson.email!==null?respJson.email:"");
                    $("#direccion").val(respJson.direccion!==null?respJson.direccion:"");
                    $("#telefono").val(respJson.telefono!==null?respJson.telefono:"");
                    $("#celular").val(respJson.celular!==null?respJson.celular:"");
                    $("#codVendedor").val(respJson.codigoVendedor);
                    $("#usernameU").val(respJson.username);
                    $("#passwordU").val(respJson.password);
                    $("#basico").val(respJson.sueldoBasico!==null ? respJson.sueldoBasico : "");
                    var fecreg = moment(respJson.fecNacimiento).format('DD-MM-YYYY');
                    var fecing = moment(respJson.fecIngreso).format('DD-MM-YYYY');
                    $('#div-fecnac').datepicker('update',respJson.fecNacimiento!==null?fecreg:fecAct);
                    $('#div-fecing').datepicker('update',respJson.fecIngreso!==null?fecing:fecAct);
                    $("#genero").selectpicker('val',respJson.genero === null?"":respJson.genero);
                    $("#cboCargo").selectpicker('val',respJson.otbCargo.id);
                    var idsucs = new Array();
                    for (var i = 0; i < respJson.tbListAsig.length; i++) {
                        idsucs.push(respJson.tbListAsig[i].otbSucursal.id);
                    }
                    $("#cboSucursal").selectpicker('val',idsucs);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Usuario");
                    $("#accion").val("update");
                    $("#modalUsuario").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Usuario?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_usuario',
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
        NumeroEntero($("#dni"),8);
        NumeroEntero($("#codVendedor"),3);
        NumeroDosDecimales($("#basico"));
        $("#dni,#codVendedor").css("text-align","left");
        $("#fecnac,#fecing").val(fecAct);
        FormatoFecha($("#div-fecnac"),"dd-mm-yyyy");
        FormatoFecha($("#div-fecing"),"dd-mm-yyyy");
       /* $("#nombres").on("keypress",function (event) {
            var letras_latinas = /^[a-zA-ZáéíóúàèìòùÀÈÌÒÙÁÉÍÓÚñÑüÜ\s]+$/;
            if ($(this).val().match(letras_latinas)) {
            }else {
                event.stopPropagation();
                event.preventDefault();
            }
        });*/
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){table._fnDraw();});
        $("#estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#cboCargo").on("change",function(){ style_error_cbo_final('#cboCargo',false);});
        $("#cboSucursal").on("change",function(){ style_error_cbo_final('#cboSucursal',false);});
        $("#genero").on("change",function(){ style_error_cbo_final('#genero',false);});
        keyup_input_general_3("#frmUsuario input", "#frmUsuario", "#modalUsuario");
        keyup_input_general_3("#frmVendedor input", "#frmVendedor", "#modalUsuario");
        ListUsuarios();
        $("#cboLiCargo,#cboBusEstado").on("change",function(){table._fnDraw();});
        $.ajax({
            type: 'post',
            url: "mant_usuarios",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboCargo").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                    $("#cboLiCargo").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                    $("#cboSucursal").html(respJson.htS);
                    $(".selectpicker").selectpicker("refresh");
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
    Usuario.init();
});