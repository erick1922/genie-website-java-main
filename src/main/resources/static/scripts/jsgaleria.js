var ListarImagen = function(){
    var table = $("#tblGaleria").DataTable();
    table.destroy();
    $('#tblGaleria').DataTable({
        "bAutoWidth": false,
        "bFilter": false,
        "bSort": false,
        "bLengthChange": false,
        "bProcessing": true,
        "bServerSide" : true,
        "iDisplayLength":10,
        "ajax": {
            "type":"POST",
            "url":"controlador/ctrlImagen.php",
            "data": function (d) {d.accion = "listado";}
        }
    });
};
ListarImagen();
var new_record = function(){
    $("#titulo").html("Nueva Imagen");
    $("#idimagen").val("0");
    $("#accion").val("save");
    $("#desc").val("");
    $("#foto").val("");
    $("#estado").val("H");
    $("#imgFoto").html("");
    $("#imgFoto").hide();
    $("#cboTipo").val([]);
    $("#cboTipo").trigger("change");
};

$("#cboTipo").select2({
    placeholder: "Seleccione Tipo",
    allowClear: true,
    width: '100%'
});

var cargarcombo = function(){
    $.ajax({
        type: 'post',
        url: 'controlador/ctrlTipo.php',
        data: {"accion":"combo"},
        dataType: 'json',
        success: function(data){
            if(data!==null){
                if(data.dato === "OK"){
                     $("#cboTipo").html(data.html);
                }else if(data.dato === "ERROR"){
                    uploadMsn(data.mensaje,data.dato);
                }
            }else{
                uploadMsn('Problemas con el Sistema','ERROR');
            }
        },
        error: function (jqXHR, status, error){
            uploadMsn(jqXHR.responseText,'ERROR');
        }
    });
};
cargarcombo();

var save = function(){
    var cargando = $('#btnGuardar').ladda();
    cargando.ladda( 'start' );
    var datos = new FormData($("#frmImagen")[0]);
    datos.append('id',$("#idimagen").val());
    datos.append('accion',$("#accion").val());
    datos.append('desc',$("#desc").val());
    datos.append('idtipos',$("#cboTipo").val());
    datos.append('est',$('#estado').val());
    $.ajax({
        type: 'post',
        url: 'controlador/ctrlImagen.php',
        data:datos,
        dataType: 'json',
        contentType:false,
        processData:false,
        cache: false,
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',function(e){progressHandlingFunction(e,$("#barimagen"));}, false); // For handling the progress of the upload
            }
            return myXhr;
        },
        success: function(data){
            if(data!==null){
                if(data.dato==="OK"){
                    cargando.ladda('stop');
                    $("#newImagen").modal("hide");
                    ListarImagen();
                    uploadMsnSmall(data.mensaje,'OK');
                    reiniciar("barimagen");
                }else if(data.dato==="ERROR"){
                    cargando.ladda('stop');
                    reiniciar("barimagen");
                    uploadMsnSmall(data.mensaje,'ERROR');
                }
            }else{
                cargando.ladda('stop');
                reiniciar("barimagen");
                uploadMsnSmall('Problemas con el sistema','ERROR');
            }
        },
        error: function (jqXHR, status, error){
            cargando.ladda('stop');
            uploadMsnSmall(jqXHR.responseText,'ERROR');
            reiniciar("barimagen");
        }
    });
};
//http://stackoverflow.com/questions/26644619/why-is-my-html5-progress-bar-not-changing-with-jquery-ajax

var view = function(elem){
    $.ajax({
        type: 'post',
        url: "controlador/ctrlImagen.php",
        dataType: 'json',
        data:{accion:"view",id:$(elem).attr("id")},
        success:function(respJson){
            if(respJson!==null){
                if(respJson.dato==="OK"){
                    $("#titulo").html("Modificar Imagen");
                    $("#imgFoto").show();
                    $("#foto").val("");
                    $("#idimagen").val(respJson.record.id);
                    $("#desc").val(respJson.record.nombre);
                    var tipos = respJson.tipos;
                    var datos = [];
                    for (var i = 0; i < tipos.length; i++) {
                        datos.push(tipos[i].id);
                    }
                    $("#cboTipo").val(datos);
                    $("#imgFoto").html("<img  src='archivos/"+respJson.record.ruta+"' width='200px;' />");
                    $("#estado").val(respJson.record.estado);
                    $("#cboTipo").trigger("change");
                    $("#accion").val("update");
                    $("#newImagen").modal("show");
                }else if(respJson.dato==="ERROR"){
                    uploadMsnSmall(respJson.mensaje,'ERROR');
                }
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
        message: "<strong>¿Esta Seguro que desea Eliminar la Imagen?</strong>",
        size: 'small',
        buttons: {
            confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-primary btn-sm sbold"},
            cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
        },
        callback: function(result) {
            if(result){
                $.ajax({
                    type: 'post',
                    url: 'controlador/ctrlImagen.php',
                    data: {"accion" :"delete","id":$(elem).attr("id")},
                    dataType: 'json',
                    success: function(data){
                        if(data!==null){
                            if(data.dato === 'OK'){
                                uploadMsnSmall(data.mensaje,data.dato);
                                ListarImagen();
                            }else if(data.dato === "ERROR"){ 
                               uploadMsnSmall(data.mensaje,data.dato);
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