 var Model = function(){
    var table;
     var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var urlDonwload = "";

    var ListCopias = function(){
        table = $("#tblCopias").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_repositorios",data:function(d){d.desc = $("#txtDesc").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [4]},
                {'bSearchable': false, 'aTargets': [0,1]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var download_file = function(elem){
        window.open(urlDonwload+"descargarArchivoDropbox?nomfile="+$(elem).attr("id"),'_blank');
    };

    var delete_record = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el archivo?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_archivo',
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

     var save = function() {
         cargando.start();
         var datos = new FormData($("#frmArchivo")[0]);
        // datos.append('accion',$("#frmArchivo #accion").val());
        // datos.append('id',$("#frmArchivo #id").val());
       //  datos.append('desc',$('#frmArchivo #desc').val());
         datos.append('estado',$("#estado").val());
         $.ajax({
             type: 'post',
             url: "save_archivo",
             data:datos,
             dataType: 'json',
             contentType:false,
             processData:false,
             cache: false,
             xhr: function() {
                 var myXhr = $.ajaxSettings.xhr();
                 if(myXhr.upload){
                     myXhr.upload.addEventListener('progress',function(e){progressHandlingFunction(e,$("#bararchivo"));}, false); // For handling the progress of the upload
                 }
                 return myXhr;
             },
             success:function(respJson){
                 if(respJson!==null){
                     if(respJson.dato==="OK"){
                         cargando.stop();
                         $("#modalArchivo").modal("hide");
                         table._fnDraw();
                         uploadMsnSmall(respJson.msj,'OK');
                         reiniciar("bararchivo");
                         $("#txtDesc").focus();
                         $("#btnSearch").trigger("click");
                     }else if(respJson.dato==="ERROR"){
                         if(respJson.listado.length>0){
                             for (var i = 0; i < respJson.listado.length; i++) {
                                 if(respJson.listado[i] === "E1"){estilo_error(true,"#frmArchivo #desc");}
                                 if(respJson.listado[i] === "E2"){estilo_error(true,"#frmArchivo #desc");}
                                 if(respJson.listado[i] === "E3"){estilo_error(true,"#frmArchivo #desc");}
                                 if(respJson.listado[i] === "E4"){estilo_error(true,"#frmArchivo #desc");}
                             }
                         }else{
                             uploadMsnSmall(respJson.msj,'ERROR');
                         }
                         cargando.stop();
                         reiniciar("bararchivo");
                     }
                 }else{
                     cargando.stop();
                     reiniciar("bararchivo");
                     uploadMsnSmall('Problemas con el sistema','ERROR');
                 }
             },
             error: function(XMLHttpRequest, textStatus, errorThrown) {
                 cargando.stop();
                 uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                 reiniciar("bararchivo");
             }
         });
     };

    var Iniciando = function(){
        ListCopias();
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#btnNuevo").on("click",function(){
             $("#titulo").html("Nuevo Archivo");
             LimpiarInputFormulario("frmArchivo");
             $("#imgFoto").html("");
             $("#frmArchivo #accion").val("save");
             $("#frmArchivo #id").val("0");
             $("#modalArchivo").modal("show");
             $("#frmArchivo #desc").focus();
        });
        $("#btnGuardar").on("click",save);
        $.ajax({
            type: 'post',
            url: "mant_repositorios",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    urlDonwload = respJson.par;
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
        init: function(){
            Iniciando();
        },
        delete_record:function (elem) {
            delete_record(elem);
        },
        download_file:function (a) {
            download_file(a);
        }
    };
}();
jQuery(document).ready(function () {
    Model.init();
});