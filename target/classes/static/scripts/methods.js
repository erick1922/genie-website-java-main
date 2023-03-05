var ObtenerAnioCopyright  = function () {
    var anio = moment().format("YYYY");
    $("#div-piepagina").html(" <strong>Copyright</strong> Hecho por JK Systems &copy; " + anio);
};

var convertArrayOctect = function (s)
{
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
};

var TransformArrayToString = function (arreglo) {
      var cadena = "";
      for(var i=0;i<arreglo.length;i++){
          cadena += arreglo[i] + ",";
      }
      if(arreglo.length > 0){
          cadena = cadena.substring(0, cadena.length - 1);
      }
      return cadena;
};

var ValidaNum = function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode <= 13) || (charCode >= 48 && charCode <= 57)) {
        return true;
    } else {
        return false;
    }
};

var LimpiarInputFormulario = function (formulario) {
    $.each($("#"+formulario+" input"), function () {
        $(this).val("");
        estilo_error(false, this);
    });
};

var RetornarNombreMesxAbre = function(mes){
    var valor_mes = "";
    if (mes == "Ene"){
        valor_mes = "Enero";
    } else if (mes == "Feb") {
        valor_mes = "Febrero";
    } else if (mes == "Mar") {
        valor_mes = "Marzo";
    } else if (mes == "Abr") {
        valor_mes = "Abril";
    } else if (mes == "May") {
        valor_mes = "Mayo";
    } else if (mes == "Jun") {
        valor_mes = "Junio";
    } else if (mes == "Jul") {
        valor_mes = "Julio";
    } else if (mes == "Ago") {
        valor_mes = "Agosto";
    } else if (mes == "Set") {
        valor_mes = "Septiembre";
    } else if (mes == "Oct") {
        valor_mes = "Octubre";
    } else if (mes == "Nov") {
        valor_mes = "Noviembre";
    } else if (mes == "Dic") {
        valor_mes = "Diciembre";
    }
    return valor_mes;
};

var RetornarNumeroMesxAbr = function(mes){
    var valor_mes = "";
    if (mes == "Ene"){
        valor_mes = 0;
    } else if (mes == "Feb") {
        valor_mes = 1;
    } else if (mes == "Mar") {
        valor_mes = 2;
    } else if (mes == "Abr") {
        valor_mes = 3;
    } else if (mes == "May") {
        valor_mes = 4;
    } else if (mes == "Jun") {
        valor_mes = 5;
    } else if (mes == "Jul") {
        valor_mes = 6;
    } else if (mes == "Ago") {
        valor_mes = 7;
    } else if (mes == "Set") {
        valor_mes = 8;
    } else if (mes == "Oct") {
        valor_mes = 9;
    } else if (mes == "Nov") {
        valor_mes = 10;
    } else if (mes == "Dic") {
        valor_mes = 11;
    }
    return valor_mes;
};

var RedondearFixed = function (numero,cantidad) {
    var num = parseFloat(numero);
    return num.toFixed(cantidad);
};

var Redondear0 = function(numero){
    var num = parseFloat(numero);
    return num.toFixed(0);
};

var Redondear2 = function(numero){
    var num = parseFloat(numero);
    return num.toFixed(2);
};

var Redondear2Decimales=function(n){
    var nd8="";
    var ndi=parseFloat(n).toFixed(4);
    var nd2 = ndi.split(".")[0];
    var nd3=ndi.split(".")[1];
    var nd4 =nd3.substring(0,1);
    var nd9 =nd3.substring(1,2);
    var nd5=nd3.substring(2,3);
    var nd6=nd9+"."+nd5;
    var nd7=Math.round(nd6).toString();
    if (nd9 == 9 && nd7 == 10) {
        nd4 = parseFloat(nd4) + 1;
        if (nd4 == 10) {
            nd8 = (parseFloat(nd2) + 1);
            nd8 = nd8 + ".00";
        } else {
            nd8 = nd2 + "." + nd4 + "0";
        }
    } else {
        nd8 = nd2 + "." + nd4 + "" + nd7;
    }
    return nd8;
};

var FormatoFechaStartDate = function(inFecha,format,date){
    $(inFecha).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        format:format,
        startDate:date
    });
};

var FormatoFechaStart = function(inFecha,format){
    $(inFecha).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        format:format,
        startDate:new Date()
    });
};

var FormatoFecha = function(inFecha,format){
    $(inFecha).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        format:format,
        endDate:new Date()
    });
};

var FormatoFechas = function(inFecha,format){
    $(inFecha).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        format:format
    });
};

var NumeroDosDecimales = function(inNumero){
    $(inNumero).inputmask("decimal",{
        min:0.00,
        integerDigits: 7,
        allowMinus: false,
        digits: 2
    });
    $(inNumero).on("blur",function(){
        if($(this).val()!==""){$(this).val(Redondear2($(this).val()));}
    }); 
};

var NumeroDosDecimalesNegativo = function(inNumero){
    $(inNumero).inputmask("decimal",{
         integerDigits: 7,
         digits: 2,
         digitsOptional: false,
         groupSeparator: '.',
         radixPoint: ','
    });
};

var NumeroEnteroxDefectoUno = function(inNumero){
    $(inNumero).inputmask("decimal",{
        min:0.00,
        integerDigits: 7,
        allowMinus: false
    });
    $(inNumero).on("blur",function(){
        if($(this).val()===""){$(this).val("1");}else{$(this).val(Redondear0($(this).val()));}
    });
};

var NumeroDosDecimalesxDefectoUno = function(inNumero){
    $(inNumero).inputmask("decimal",{
        min:0.00,
        integerDigits: 7,
        allowMinus: false,
        digits: 2
    });
    $(inNumero).on("blur",function(){
        if($(this).val()===""){$(this).val("1.00");}else{$(this).val(Redondear2($(this).val()));}
    }); 
};

var NumeroPorcentajeDecimales = function(inNumero,totDigitos,numMin,numMax){
    $(inNumero).inputmask("decimal",{
        min:numMin,
        max:numMax,
        integerDigits: totDigitos,
        allowMinus: false
    });
};

var NumeroEntero = function(inNumero){
    $(inNumero).inputmask("integer",{
        min:0,
        integerDigits: 7,
        allowMinus: false
    });
};

var NumeroEntero = function(inNumero,totDigitos){
    $(inNumero).inputmask("integer",{
        min:0,
        integerDigits: totDigitos,
        allowMinus: false
    });
};

var NumeroEntero = function(inNumero,totDigitos,numMin,numMax){
    $(inNumero).inputmask("integer",{
        min:numMin,
        max:numMax,
        integerDigits: totDigitos,
        allowMinus: false
    });
};

var uploadAviso = function(mensaje){
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "3000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };  
    toastr.warning(mensaje, 'Alerta del Sistema');
    ///toastr["warning"](mensaje);
};

var uploadMsn = function(mensaje,tipo){
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-full-width",
        showMethod: 'slideDown',
        hideMethod: "fadeOut",
        timeOut: 8000
    };
    if(tipo === "OK"){
        toastr.success(mensaje, 'Exito');
    }else if(tipo === "ERROR"){
        toastr.error(mensaje, 'ERROR');
    }
};

var uploadMsnSmall = function(mensaje,tipo){
    toastr.options = {
        closeButton: true,
        showMethod: 'slideDown',
        positionClass: "toast-top-left",
        hideMethod: "fadeOut",
        timeOut: 6000
    };
    if(tipo === "OK"){
        toastr.success(mensaje, 'Exito');
    }else if(tipo === "ERROR"){
        toastr.error(mensaje, 'ERROR');
    }else if(tipo === "ALERTA"){
        toastr.warning(mensaje, 'Alerta del Sistema');
    }
};

var UploadMsnSmallLeft = function(mensaje,tipo){
    toastr.options = {
        closeButton: true,
        showMethod: 'slideDown',
        positionClass: "toast-top-left",
        hideMethod: "fadeOut",
        timeOut: 5000
    };
    if(tipo === "OK"){
        toastr.success(mensaje, 'Exito');
    }else if(tipo === "ERROR"){
        toastr.error(mensaje, 'ERROR');
    }else if(tipo === "ALERTA"){
        toastr.warning(mensaje, 'Alerta del Sistema');
    }
};

var progressHandlingFunction = function (e,elemento){
    if(e.lengthComputable){
        var percentComplete = Math.ceil((e.loaded/e.total)*100);
        $(elemento).width(((e.loaded/e.total)*100)+'%'); //dynamicaly change the progress bar width
        $(elemento).attr("aria-valuenow", percentComplete); 
        $(elemento).html( ((e.loaded/e.total)*100).toFixed()+'%'); // show the percentage number
    }
};

var reiniciar = function(id){
    $("#"+id).width('0%');
    $("#"+id).attr("aria-valuenow", '0'); 
    $("#"+id).html('');
};

var CerrarSession = function(){
    $("#form_logout").submit();
};

$("#btnSalir").on("click",function(){
    bootbox.confirm({
        message: "<strong>¿Esta Seguro que desea Salir del Sistema?</strong>",
        buttons: {
            confirm: {
               label: "<i class='fa fa-check'></i> Si",className: "btn-primary btn-sm sbold"
            },
            cancel: {
               label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"
            }
        },
        callback: function(result) {
            if(result){CerrarSession();}
        }
    });
});

var keyup_input_general_3 = function (elemento, form, modal) {
    $.each($(elemento), function () {
        $(this).on("keyup", function () {
            estilo_error(false, this);
        });
    });
};
    
var estilo_error = function (estilo, elemento){
    if (estilo === true) {
        $(elemento).closest('.form-group').addClass('has-error');
        $(elemento).addClass('error-input');
    } else {
        $(elemento).closest('.form-group').removeClass('has-error');
        $(elemento).removeClass('error-input');
    }
};
    
var style_error_cbo_final = function (id_cbo, condition) {
    if (condition === true) {
        $(id_cbo).closest('.form-group').addClass('has-error');
    } else {
        $(id_cbo).closest('.form-group').removeClass('has-error');
    }
    var style_remove = condition ? "style_cbo" : "red error-input";
    var style_add = condition ? "red error-input" : "style_cbo";
    $(id_cbo).selectpicker('setStyle', style_remove, 'remove');
    $(id_cbo).selectpicker({style: style_add, size: 5});
    $(id_cbo).selectpicker('refresh');
};

var AccepWithNumber = function (event) {
    var theEvent = event || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    ///var regex = /[0-9]|\./;
    var regex = /[0-9]/;
    if (!regex.test(key)) {
        theEvent.preventDefault ? theEvent.preventDefault() : (theEvent.returnValue = false);
    }
};

function acceptLet(a){
    tecla=document.all?a.keyCode:a.which;
    if(8==tecla)return!0;
    patron=/[A-Za-z\u00f1\u00d1\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\s]/;
    te=String.fromCharCode(tecla);
    return patron.test(te)
}

var validarPerfil = function(){
    var sevalido = "1";
    if( $("#claveanterior").val() === "" ){
        estilo_error(true,'#claveanterior');
        sevalido = "0";
    }
    if( $("#clavenueva").val() === ""){
        estilo_error(true,'#clavenueva');
        sevalido = "0";
    }
    if( $("#reclavenueva").val() === "" ){
        estilo_error(true,'#reclavenueva');
        sevalido = "0";
    }
    if( $("#clavenueva").val() !== "" && $("#reclavenueva").val() !== ""  ){
        if($("#clavenueva").val() !== $("#reclavenueva").val()){
            estilo_error(true,'#reclavenueva');
            uploadMsnSmall('Las Claves deben de ser Iguales.', 'ERROR');
            sevalido = "0";
        }
    }
    return sevalido === "1";
};

$("#btnGuardarMyPerfil").on("click",function(){
    var tip = $("#tippan").val();
    if(tip === "cc"){
        if(validarPerfil()) {
            var cargando = Ladda.create(document.querySelector('#btnGuardarMyPerfil'));
            var anterior = $("#claveanterior").val();
            var nueva = $("#clavenueva").val();
            var renueva = $("#reclavenueva").val();
            cargando.start();
            $.ajax({
                type: 'post',
                url: 'save_myperfil',
                data: {anterior: anterior, nueva: nueva, renueva: renueva},
                dataType: 'json',
                success: function (data) {
                    if (data !== null) {
                        if(data.dato==="OK"){
                            $("#modalMyPerfil").modal("hide");
                            cargando.stop();
                            uploadMsnSmall("La clave se cambio correctamente",'OK');
                        }else if(data.dato==="ERROR"){
                            if(data.listado.length>0){
                                for (var i = 0; i < data.listado.length; i++) {
                                    if(data.listado[i] === "E1"){estilo_error(true,"#claveanterior");}
                                    if(data.listado[i] === "E2"){estilo_error(true,"#clavenueva");}
                                    if(data.listado[i] === "E3"){estilo_error(true,"#reclavenueva");}
                                    if(data.listado[i] === "E4"){estilo_error(true,"#reclavenueva");uploadMsnSmall("Las Claves deben de ser iguales.",'OK');}
                                }
                            }else{
                                uploadMsnSmall(data.msj,'ERROR');
                            }
                            cargando.stop();
                        }
                    } else {
                        cargando.stop();
                        uploadMsnSmall('Problemas con el sistema', 'ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    cargando.stop();
                    uploadMsnSmall(jqXHR.responseText, 'ERROR');
                }
            });
        }
    } else if(tip === "ccb"){
        var cargando = Ladda.create(document.querySelector('#btnGuardarMyPerfil'));
        cargando.start();
        $.ajax({
            type: 'post',
            url: 'save_bardoce_usuario',
            data: {barcode: $("#cboTipoImpresion").val()},
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    if(data.dato==="OK"){
                        $("#modalMyPerfil").modal("hide");
                        cargando.stop();
                        uploadMsnSmall("Se actualizo el tipo de impresion.",'OK');
                    }else if(data.dato==="ERROR"){
                        uploadMsnSmall(data.msj,'ERROR');
                        cargando.stop();
                    }
                } else {
                    cargando.stop();
                    uploadMsnSmall('Problemas con el sistema', 'ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargando.stop();
                uploadMsnSmall(jqXHR.responseText, 'ERROR');
            }
        });
    } else if(tip === "ci"){
        var cargando = Ladda.create(document.querySelector('#btnGuardarMyPerfil'));
        cargando.start();
        var datos = new FormData($("#frmFotoPerfil")[0]);

        $.ajax({
            type: 'post',
            url: "save_img_perfil",
            data:datos,
            dataType: 'json',
            contentType:false,
            processData:false,
            cache: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',
                        function(e){progressHandlingFunction(e,$("#bar_fotoperfil"));}, false);
                }
                return myXhr;
            },
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#ftp_perfil").attr("src",respJson.objeto);
                        $("#logo_perfil_init").attr("src",respJson.objeto);
                        cargando.stop();
                        $("#modalMyPerfil").modal("hide");
                        uploadMsnSmall(respJson.msj,'OK');
                        reiniciar("bar_fotoperfil");
                        //ACTUALIZAR IMAGENES.
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("No ha seleccionado una imagen.",'ALERTA');}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("No ha seleccionado una imagen.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Seleccione una imagen diferente.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        cargando.stop();
                        reiniciar("bar_fotoperfil");
                    }
                }else{
                    cargando.stop();
                    reiniciar("bar_fotoperfil");
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cargando.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                reiniciar("bar_fotoperfil");
            }
        });
    }
});

$("#myperfil").on("click",function(){
    $.ajax({
        type: 'post',
        url: 'view_par_barcode_usuario',
        dataType: 'json',
        success: function (data) {
            if (data !== null) {
                if(data.dato==="OK"){
                    $("#frmMyPerfil")[0].reset();
                    estilo_error(false,'#claveanterior');
                    estilo_error(false,'#clavenueva');
                    estilo_error(false,'#reclavenueva');
                    $("#cboTipoImpresion").selectpicker('val',data.codigo);
                    var ruta = data.rutafoto;
                    $("#imgUsuario").attr("src",ruta);
                    $("#modalMyPerfil").modal("show");
                }else if(data.dato==="ERROR"){
                    uploadMsnSmall(data.msj,'ERROR');
                }
            } else {
                uploadMsnSmall('Problemas con el sistema', 'ERROR');
            }
        },
        error: function (jqXHR, status, error) {
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
});

$("#btnConfiguracion").on("click",function(){
    var fecAct = moment().format('DD-MM-YYYY');
    $.ajax({
        type: 'post',
        url: 'view_caja',
        dataType: 'json',
        success: function (data) {
            if (data !== null) {
                if(data.dato==="OK"){
                    $("#parEnvioSun").val(data.envio);
                    $("#div-sub-caja").css("display",data.div === "1" ? "block":"none");
                    $("#div-monto-caja").css("display",data.mon === "1" ? "block":"none");
                    $("#div-feccaja").datepicker('update',data.div === "1" ? fecAct:data.dato1 );
                    $("#modalCaja").modal("show");
                }else if(data.dato==="ERROR"){
                    uploadMsnSmall(data.msj,'ERROR');
                }
            } else {
                uploadMsnSmall('Problemas con el sistema', 'ERROR');
            }
        },
        error: function (jqXHR, status, error) {
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
});

var DescargarZIPRespuesta = function(a){
    var nombre = $(a).attr("data-arc");
    var url = "downloadRD?name="+nombre;
    window.open(url,'_blank');
};

var enviar_doc_sunat = function(a){
    var idp = $(a).attr("id").split("_")[2];
    var btnUpload = Ladda.create(document.querySelector('#' + $(a).attr("id")));
    btnUpload.start();
    $.ajax({
        type: 'post',
        url: 'send_factura_sunat',
        data: {"id": idp},
        dataType: 'json',
        success: function (data) {
            var rpta = data.dato;
            if (rpta === "OK") {
                UploadMsnSmallLeft(data.msj, "OK");
                $("#viewEnvioSunat").modal("hide");
                btnUpload.stop();
            } else {
                UploadMsnSmallLeft(data.msj, "ERROR");
                btnUpload.stop();
            }
        },
        error: function (jqXHR, status, error) {
            btnUpload.stop();
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
};

var enviar_notacredito_factura_sunat = function(a){
    var idp = $(a).attr("id").split("_")[2];
    var btnUpload = Ladda.create(document.querySelector('#' + $(a).attr("id")));
    btnUpload.start();
    $.ajax({
        type: 'post',
        url: 'send_notacredito_factura_sunat',
        data: {"id": idp},
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var rpta = data.dato;
            if (rpta === "OK") {
                UploadMsnSmallLeft(data.msj, "OK");
                $("#viewEnvioSunat").modal("hide");
                btnUpload.stop();
            } else {
                UploadMsnSmallLeft(data.msj, "ERROR");
                btnUpload.stop();
            }
        },
        error: function (jqXHR, status, error) {
            btnUpload.stop();
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
};

var crear_resumen_diario = function(a){
    var btnUpload = Ladda.create(document.querySelector('#' + $(a).attr("id")));
    btnUpload.start();
    var fecemi = $(a).attr("data-fecha");
    var idsuc  = $(a).attr("data-suc");
    $.ajax({
        type: 'post',
        url: "save_resumen_diario",
        dataType: 'json',
        data:{sucursal:idsuc,fecemi : fecemi},
        success:function(respJson){
            if(respJson!==null){
                if(respJson.dato==="OK"){
                    btnUpload.stop();
                    $("#btnGuardarConfiguracion").trigger("click");
                    uploadMsnSmall(respJson.msj,'OK');
                }else if(respJson.dato==="ERROR"){
                    if(respJson.listado.length>0){
                        for (var i = 0; i < respJson.listado.length; i++) {
                            if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente incorrecto.","ALERTA");}
                        }
                    }else{
                        uploadMsnSmall(respJson.msj,'ERROR');
                    }
                    btnUpload.stop();
                }
            }else{
                btnUpload.stop();
                uploadMsnSmall('Problemas con el sistema','ERROR');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            btnUpload.stop();
            uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
        }
    });
};

var enviar_resumen_diario = function(a){
    var id_res = $(a).attr("data-res");
    var btnSend =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
    btnSend.start();
    $.ajax({
        type: 'POST',
        url: "send_resumen_diario",
        dataType: 'json',
        data : {id:id_res},
        success: function(data){
            console.log(data);
            if(data !== null){
                if(data.dato === "OK"){
                    //table._fnDraw();
                    $("#btnGuardarConfiguracion").trigger("click");
                    uploadMsnSmall(data.msj,'OK');
                    //$("#facturar").modal("hide");
                    btnSend.stop();
                }else if(data.dato === "ERROR"){
                    if(data.listado.length>0){
                        for (var i = 0; i < data.listado.length; i++) {
                            if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                            if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione tipo de documento.",'ALERTA');}
                            if(data.listado[i] === "E4"){uploadMsnSmall("Numero de documento incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E5"){uploadMsnSmall("Selección de entrega incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E6"){uploadMsnSmall("Fecha de entrega incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E7"){uploadMsnSmall("Codigo de vendedor incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E8"){uploadMsnSmall("Fecha de vencimiento incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E9"){uploadMsnSmall("Seleccione forma de pago.",'ALERTA');}
                            if(data.listado[i] === "E10"){uploadMsnSmall("Abono inicial incorrecto.",'ALERTA');}
                        }
                    }else{
                        uploadMsnSmall(data.msj,data.dato);
                    }
                    btnSend.stop();
                }
            }else{
                Repositorio.finishRefresh($("#divFacturar"));
                btnSend.stop();
                uploadMsnSmall('Problemas con el sistema','ERROR');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            Repositorio.finishRefresh($("#divFacturar"));
            btnSend.stop();
            uploadMsnSmall(jqXHR.responseText,'ERROR');
        }
    });
};

var consultar_resumen_diario = function(a){
    var id_res = $(a).attr("data-res");
    var btnSend =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
    btnSend.start();
    $.ajax({
        type: 'POST',
        url: "consulta_resumen_diario",
        dataType: 'json',
        data : {id:id_res},
        success: function(data){
            console.log(data);
            if(data !== null){
                if(data.dato === "OK"){
                    $("#btnGuardarConfiguracion").trigger("click");
                    uploadMsnSmall(data.msj,'OK');
                    ///$("#view_details_"+id_res).trigger("click");
                    btnSend.stop();
                }else if(data.dato === "ERROR"){
                    if(data.listado.length>0){
                        for (var i = 0; i < data.listado.length; i++) {
                            if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no encontrado.",'ALERTA');}
                            if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E3"){uploadMsnSmall("Seleccione tipo de documento.",'ALERTA');}
                            if(data.listado[i] === "E4"){uploadMsnSmall("Numero de documento incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E5"){uploadMsnSmall("Selección de entrega incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E6"){uploadMsnSmall("Fecha de entrega incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E7"){uploadMsnSmall("Codigo de vendedor incorrecto.",'ALERTA');}
                            if(data.listado[i] === "E8"){uploadMsnSmall("Fecha de vencimiento incorrecta.",'ALERTA');}
                            if(data.listado[i] === "E9"){uploadMsnSmall("Seleccione forma de pago.",'ALERTA');}
                            if(data.listado[i] === "E10"){uploadMsnSmall("Abono inicial incorrecto.",'ALERTA');}
                        }
                    }else{
                        uploadMsnSmall(data.msj,data.dato);
                    }
                    btnSend.stop();
                }
            }else{
                Repositorio.finishRefresh($("#divFacturar"));
                btnSend.stop();
                uploadMsnSmall('Problemas con el sistema','ERROR');
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            Repositorio.finishRefresh($("#divFacturar"));
            btnSend.stop();
            uploadMsnSmall(jqXHR.responseText,'ERROR');
        }
    });
};


$("#btnGuardarConfiguracion").on("click",function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardarConfiguracion'));
    cargando.start();
    var anio = moment().format("YYYY");
    var fecini = "01-01-"+(parseInt(anio)-1);
    var envio = $("#parEnvioSun").val();
    var fechafin = (moment($("#feccaja").val(),"DD-MM-YYYY").add(-1,'days')).format("DD-MM-YYYY");
    if(envio === "1"){
        $.ajax({
            type: 'post',
            url: 'listar_facturas_electronicas',
            data:{fecha:fechafin,fecini : fecini, ids:$("#cboSubCaja").val()},
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    console.log(data);
                    if(data.dato==="OK"){
                        var listado = data.listado;
                        var boletas = data.boletas;
                        $("#div_docs_facturas").hide();
                        $("#div_docs_boletas").hide();
                        if(listado.length > 0 || boletas.length){
                            var html = "";
                            for(var i=0;i<listado.length;i++){
                                var item = listado[i];
                                var btn = "";
                                if(item.otbTbDocumentoVentaReferencia !== null){
                                    btn = "<button type='button' id='"+"btn_send_"+item.otbPedido.id+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Enviar nota: "+ item.serie+' '+item.numero +"</div>' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='enviar_notacredito_factura_sunat(this);' > <i class='fa fa-eject' style='font-size:15px!important;'></i> </button>";
                                }else{
                                    btn = "<button type='button' id='"+"btn_send_"+item.otbPedido.id+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Enviar factura: "+ item.serie+' '+item.numero +"</div>' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='enviar_doc_sunat(this);' > <i class='fa fa-eject' style='font-size:15px!important;'></i> </button>";
                                }
                                var fecreg = moment(item.fecGenerado).format('DD-MM-YYYY');
                                html+="<tr>";
                                html+="<td>"+(i+1)+"</td>";
                                html+="<td class='text-center'>"+fecreg+"</td>";
                                html+="<td>"+item.nomCliente+"</td>";
                                html+="<td>"+item.otbSucursal.nombre+"</td>";
                                html+="<td>"+item.otbTipoDocumento.nombre+": "+item.serie+" "+item.numero+"</td>";
                                html+="<td class='text-right'>"+Redondear2Decimales(item.monTotal)+"</td>";
                                html+="<td>POR ENVIAR</td>";
                                html+="<td class='text-center'>"+btn+"</td>";
                                html+="</tr>";
                            }
                            $("#listado_docs_sunat").html(html);
                            if(listado.length > 0)
                            {
                               $("#div_docs_facturas").show();
                            }
                            var htmlBoletas = "";
                            for(var j=0;j<boletas.length;j++){
                                var item = boletas[j];
                                var btn = "";
                                var estado = "";
                                if(item[5] > 0){
                                    if(item[6] !== null || item[7] === "P"){

                                        estado = "POR CONSULTAR";
                                        btn = "<button type='button' id='"+"btn_send_"+(j)+"' data-res='"+item[5]+"' data-fecha='"+item[0]+"' data-suc='"+item[2]+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-primary genresumen' data-html='true' title='Consultar resumen diario' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='consultar_resumen_diario(this);' > <i class='fa fa-check' style='font-size:15px!important;'></i> </button>";
                                    }else{
                                        estado = "POR ENVIAR";
                                        btn = "<button type='button' id='"+"btn_send_"+(j)+"' data-res='"+item[5]+"' data-fecha='"+item[0]+"' data-suc='"+item[2]+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-warning genresumen' data-html='true' title='Enviar resumen diario' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='enviar_resumen_diario(this);' > <i class='fa fa-send' style='font-size:15px!important;'></i> </button>";
                                    }
                                }else{
                                    btn = "<button type='button' id='"+"btn_send_"+(j)+"' data-res='"+item[5]+"' data-fecha='"+item[0]+"' data-suc='"+item[2]+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success genresumen' data-html='true' title='Crear resumen diario' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='crear_resumen_diario(this);' > <i class='fa fa-check' style='font-size:15px!important;'></i> </button>";
                                    estado = "POR GENERAR";
                                }
                                htmlBoletas+="<tr>";
                                htmlBoletas+="<td>"+(j+1)+"</td>";
                                htmlBoletas+="<td class='text-center'>"+item[0]+"</td>";
                                htmlBoletas+="<td>"+item[3]+"</td>";
                                htmlBoletas+="<td>"+item[4]+"</td>";
                                htmlBoletas+="<td>"+(item[9] !== null ? item[9] : "")+"</td>";
                                htmlBoletas+="<td class='text-right'>"+(item[6] !== null ? item[6] : "")+"</td>";
                                htmlBoletas+="<td>"+estado+"</td>";
                                htmlBoletas+="<td class='text-center'>"+btn+"</td>";
                                htmlBoletas+="</tr>";
                            }
                            $(".genresumen").tooltip();
                            if(boletas.length > 0)
                            {
                                $("#div_docs_boletas").show();
                            }
                            $("#listado_resumenes_sunat").html(htmlBoletas);
                            $("#viewEnvioSunat").modal("show");
                            cargando.stop();
                        }else{
                            //ACTUALIZANDO CAJA EN CASO NO HAY NADA POR ENVIAR.
                            $.ajax({
                                type: 'post',
                                url: 'save_caja',
                                data:{fecha:$("#feccaja").val(),mon:$("#monIni").val(),ids:$("#cboSubCaja").val()},
                                dataType: 'json',
                                success: function (data) {
                                    if (data !== null) {
                                        if(data.dato==="OK") {
                                            uploadMsnSmall("Datos actualizados correctamente.",'OK');
                                            $("#modalCaja").modal("hide");
                                            cargando.stop();
                                        }else if(data.dato==="ERROR"){
                                            uploadMsnSmall(data.msj,'ERROR');
                                            cargando.stop();
                                        }
                                    } else {
                                        cargando.stop();
                                        uploadMsnSmall('Problemas con el sistema', 'ERROR');
                                    }
                                },
                                error: function (jqXHR, status, error) {
                                    cargando.stop();
                                    uploadMsnSmall(jqXHR.responseText, 'ERROR');
                                }
                            });

                        }
                    }else if(data.dato==="ERROR"){
                        uploadMsnSmall(data.msj,'ERROR');
                        cargando.stop();
                    }
                } else {
                    cargando.stop();
                    uploadMsnSmall('Problemas con el sistema', 'ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargando.stop();
                uploadMsnSmall(jqXHR.responseText, 'ERROR');
            }
        });
    }else{
        //ACTUALIZANDO CAJA EN CASO NO HAY NADA POR ENVIAR.
        $.ajax({
            type: 'post',
            url: 'save_caja',
            data:{fecha:$("#feccaja").val(),mon:$("#monIni").val(),ids:$("#cboSubCaja").val()},
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    if(data.dato==="OK"){
                        uploadMsnSmall("Datos actualizados correctamente.",'OK');
                        $("#modalCaja").modal("hide");
                        cargando.stop();
                    }else if(data.dato==="ERROR"){
                        uploadMsnSmall(data.msj,'ERROR');
                        cargando.stop();
                    }
                } else {
                    cargando.stop();
                    uploadMsnSmall('Problemas con el sistema', 'ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                cargando.stop();
                uploadMsnSmall(jqXHR.responseText, 'ERROR');
            }
        });
    }
});

$("#btnCollapse").on("click",function(){
    if( $("#demo").hasClass("in")){
        $(this).children().removeClass("fa fa-chevron-up").addClass("fa fa-chevron-down");
    }else{
        $(this).children().removeClass("fa fa-chevron-down").addClass("fa fa-chevron-up");
    }
});

keyup_input_general_3("#frmMyPerfil input", "#frmMyPerfil", "#modalMyPerfil");

var reloadSession = function () {
    $.ajax({
        type: 'post',
        url: 'reload_session',
        dataType: 'json',
        success: function (data) {
            if (data !== null) {
                if(data.dato==="OK"){
                    console.log("Session activa.");
                }else if(data.dato==="ERROR"){
                    uploadMsnSmall(data.msj,'ERROR');
                }
            } else {
                uploadMsnSmall('Problemas con el sistema', 'ERROR');
            }
        },
        error: function (jqXHR, status, error) {
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
};

var ModalCompleto = function(){
    var modalDialog = $(this).find(".modal-dialog");
    modalDialog.css("margin-top",0);
};

var loadCaja = function () {
    $.ajax({
        type: 'post',
        url: 'load_caja',
        dataType: 'json',
        success: function (data) {
            if (data !== null) {
                if(data.dato==="OK"){
                    var d = data.div;
                    $("#cboSubCaja").html(d === "0" ? "<option value='0'>--SELECCIONE--</option>" : data.suc);
                    $("#cboSubCaja").css("display", d === "0" ? "none":"block");
                    $("#cboSubCaja").selectpicker("refresh");
                    $("#ftp_perfil").attr("src",data.rutafoto);
                    $("#logo_perfil_init").attr("src",data.rutafoto);
                }else if(data.dato==="ERROR"){
                    uploadMsnSmall(data.msj,'ERROR');
                }
            } else {
                uploadMsnSmall('Problemas con el sistema', 'ERROR');
            }
        },
        error: function (jqXHR, status, error) {
            uploadMsnSmall(jqXHR.responseText, 'ERROR');
        }
    });
};

var RefreshTable = function(div){
    $(div).block({
        message: '<i class="icon-spinner4 spinner"></i>',
        css: {
            top: '10%',
            border: 0,
            padding: 0,
            backgroundColor: 'transparent'
        },
        overlayCSS: {
            backgroundColor:'#2F4050',
            opacity: 0.6,
            cursor: 'wait'
        }
    });
};

var FinishRefresh = function (div) {
    $(div).unblock();
};

var AlignModal = function(){
    var modalDialog = $(this).find(".modal-dialog");
    modalDialog.css("margin-top",0);
};

var FormatoFechaSinRestriccion = function(inFecha,format){
    $(inFecha).datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        todayHighlight: true,
        autoclose: true,
        format:format
    });
};

var GetTipoFileImage = function(nombre_archivo){
    var ext = nombre_archivo.split(".")[1];
    return "image/"+ext;
};

var ValidarImagen = function(file) {
    var accettype = "0";
    var arreglo = ["image/jpg", "image/jpeg","image/png"];
    var tamfoto = file.size;
    var tampred =  1 * 1024 * 1024;//1MB

    for (var i = 0; i < arreglo.length; i++) {
        if (arreglo[i] === file.type) {
            accettype = "1";
            break;
        }
    }
    if (accettype === "0") {
        uploadMsnSmall("La extensión del archivo es incorrecta.", 'ALERTA');
        return false;
    }
    if (tamfoto > tampred ) {
        uploadMsnSmall("La imagen excede el tamaño máximo permitido.", 'ALERTA');
        return false;
    }
    return true;
};

loadCaja();
FormatoFecha($("#div-feccaja"),"dd-mm-yyyy");
NumeroDosDecimales($("#monIni"));
setInterval(reloadSession,600000);
ObtenerAnioCopyright();

$("#btnSubirImagen").on("click",function(){
   $("#uploadFileUsuario").trigger("click");
});

$("#uploadFileUsuario").on("change",function(event){
    var reader = new FileReader(); // HTML5 FileReader API
    if (event.target.files && event.target.files[0]) {
        if (ValidarImagen(event.target.files[0])) {
            var fileFoto = event.target.files[0];
            reader.addEventListener("load", function () {
                $("#imgUsuario").attr("src",reader.result);
            }, false);
            if (fileFoto){
                reader.readAsDataURL(fileFoto);
            }
        }
    }
});

var IsMobile = function(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
};

var fallbackToStore = function() {
    window.location.replace('market://details?id=system.com.appimpresion');
};
var openApp = function(idped) {
    window.location.replace('bernillamio://tresb.us-east-2.elasticbeanstalk.com/'+idped);
};
var triggerAppOpen = function(idped) {
    openApp(idped);
    setTimeout(fallbackToStore, 250);
};

var imprimir_pdf = function(urlResource,parameters){
    window.open(urlResource + "?" + parameters,'_blank');
};
$("#cboTipoImpresion").selectpicker("refresh");
var checkPanel = function (a) {
    $("#tippan").val($(a).attr("id"));
};

var ObtenerSKUPadre = function(listSkuUnico,listCantidad,listPadre){
    var arreglo1 = new Array();
    var arreglo2 = new Array();

    for(var i=0;i < listPadre.length;i++){
        arreglo1.push(listPadre[i]);
        arreglo2.push(listPadre[i]);
    }
    for(var j=0;j<arreglo1.length;j++){
        var seencuentra = "0";
        var cantidad = 0;
        for(var x=0;x < arreglo2.length;x++){
            if(arreglo1[j] === arreglo2[x] ){
                arreglo2.splice(x,1);
                seencuentra = "1";
                x=x-1;
                cantidad++;
            }
        }
        if(seencuentra === "1"){
            listSkuUnico.push(arreglo1[j]);
            listCantidad.push(cantidad);
        }
    }
};