var Cliente = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var update = Ladda.create(document.querySelector('#btnUpdateYear'));
    var publicidad = Ladda.create(document.querySelector('#btnSendPublicidad'));
    var validar = Ladda.create(document.querySelector('#btnValidarDNI'));
    var fecAct = moment().format('DD-MM-YYYY');
    var table;

    var ListCliente = function(){
        table = $("#tblCliente").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_clientes",data:function(d){d.tipo=$("#cboBuscar").val();d.desc = $("#txtDesc").val();d.est = $("#cboBusEstado").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,2,3]},
                {'sClass':"centrado boton-tabla",'aTargets': [7]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmCliente input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });  
        style_error_cbo_final("#genero",false);
        style_error_cbo_final("#tipo",false);
        style_error_cbo_final("#estado",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Cliente");
        $("#accion").val("save");
        $("#id").val("0");
        $('#div-fecnac').datepicker('update',fecAct);
        $("#tipo").selectpicker('val','N');
        $("#genero").selectpicker('val',''); 
        $("#estado").selectpicker('val','H');
        $("#modalCliente").modal("show");
        $("#dni").focus();
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_cliente",
            dataType: 'json',
            data:$("#frmCliente").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalCliente").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#nombres");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#ruc");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#dni");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#genero",true);}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#tipo",true);}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E7"){estilo_error(true,"#nombres");uploadMsnSmall("El Nombre solo debe de tener letras.",'ALERTA');}
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
            url: "view_cliente",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){ console.log(respJson);
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#tipo").selectpicker('val',respJson.tipoCliente);
                    $("#dni").val(respJson.dni);
                    $("#ruc").val(respJson.ruc);
                    $("#nombres").val(respJson.nombre);
                    $("#dir").val(respJson.direccion);
                    $("#email").val(respJson.email);
                    $("#genero").selectpicker('val',respJson.genero);
                    $("#tele").val(respJson.telefono);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#edad").val(respJson.edad !== null ? respJson.edad : "");
                    var fecnac = moment(respJson.fecNacimiento).format('DD-MM-YYYY');
                    $('#div-fecnac').datepicker('update',respJson.fecNacimiento!==null?fecnac:fecAct);
                    $("#titulo").html("Modificar Proveedor");
                    $("#accion").val("update");
                    $("#modalCliente").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Cliente?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_cliente',
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

    var update_years = function(){
        update.start();
        $.ajax({
            type: 'post',
            url: 'update_edades',
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    uploadMsnSmall(data.msj,data.dato);
                    if(data.dato === 'OK'){
                        update.stop();
                        table._fnDraw();
                    }else{
                        update.stop();
                    }
                }else{
                    update.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                update.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var downloadExcel = function(){
        var method = "download_clixedad";
        window.location.href = method;
    };
    
    var Iniciando = function(){
        ListCliente();
        NumeroEntero($("#ruc"),11);
        $("#dni").on("keypress",function(e){
            AccepWithNumber(e);
        });
        NumeroEntero($("#edad"),2);
        $("#fecnac").val(fecAct);
        $("#btnExcel").on("click",downloadExcel);
        FormatoFecha($("#div-fecnac"),"dd-mm-yyyy");
        $("#ruc,#dni,#edad").css( "text-align","left" );
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){table._fnDraw();});
        $("#genero").on("change",function(){style_error_cbo_final('#genero',false);});
        $("#estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#tipo").on("change",function(){ style_error_cbo_final('#tipo',false);});
        $("#cboBusEstado,#cboBuscar").on("change",function () {
           table._fnDraw();
        });
        $("#btnViewRegalo").on("click",function () {
            $.ajax({
                type: 'post',
                url: "view_regalo_cliente",
                dataType: 'json',
                success:function(respJson){
                    if(respJson!==null){
                        $("#regalos").html(respJson.ht);
                        $("#viewRegalos").modal("show");
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });
        keyup_input_general_3("#frmCliente input", "#frmCliente", "#modalCliente");
        $("#btnUpdateYear").on("click",update_years);
        $("#div-fecnac").on("changeDate",function (){
            if(moment($("#fecnac").val(),"DD-MM-YYYY", true).isValid()){
                var act = moment();
                var fecnac = moment($("#fecnac").val(),"DD-MM-YYYY");
                var diaAct = act.format("DD");
                var mesAct = act.format("MM");
                var anioAct = act.format("YYYY");
                var diaNac = fecnac.format("DD");
                var mesNac = fecnac.format("MM");
                var anioNac = fecnac.format("YYYY");
                var edad = parseInt(anioAct) - parseInt(anioNac);
                if( (parseInt(mesAct) - parseInt(mesNac)) === 0 ){
                    if( (parseInt(diaAct) - parseInt(diaNac)) < 0 ){
                        edad--;
                    }
                }else if( (parseInt(mesAct) - parseInt(mesNac)) < 0 ){
                    edad--;
                }
                $("#edad").val(edad);
            }
        });
        $("#btnSendPublicidad").on("click",function () {
            publicidad.start();
            $.ajax({
                type: 'post',
                url: "send_publicidad_cliente",
                dataType: 'json',
                success:function(respJson){
                    if(respJson!==null){
                        publicidad.stop();


                    }else{
                        publicidad.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    publicidad.stop();
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });
        $("#btnValidarDNI").on("click",function () {
            Repositorio.ValidarDniCliente(validar,$("#nombres"),$("#dni").val());

            //btnValidar.start();
            /*$.ajax({
                type: 'get',
                url: 'http://entity.fitcoders.com:5000/v1/all',
                data: { "key": "5c439fb437f5b465040ad66c", "service": "DNI", "id": "47518622" },
               // dataType: 'json',
                'Content-Type': "application/json",
                success: function(data){
                    console.log(data);
                },
                error: function (jqXHR, status, error) {
                   /// btnValidar.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });*/

        });
        $("#dni").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnValidarDNI").trigger("click");
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
    Cliente.init();
});