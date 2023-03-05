var Proveedor = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var table;
    var tblCompras;
    var ListProveedor = function(){
        table = $("#tblProveedor").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_proveedores",data:function(d){
                d.desc = $("#txtDesc").val();
                d.est = $("#cboBusEstado").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,2]},
                {'sClass':"centrado boton-tabla",'aTargets': [5]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmProveedor input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });  
        style_error_cbo_final("#estado",false);
    };
    
    var new_record = function(){
        Limpiar();
        $("#div-estado").hide();
        $("#titulo").html("Nuevo Proveedor");
        $("#accion").val("save");
        $("#id").val("0");
        $("#estado").selectpicker('val','H');
        $("#modalProveedor").modal("show");
    };
    
    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_proveedor",
            dataType: 'json',
            data:$("#frmProveedor").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalProveedor").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#ruc");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#razon");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#dir");}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#correo");}
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
            url: "view_proveedor",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#div-estado").show();
                    $("#id").val(respJson.id);
                    $("#ruc").val(respJson.docIdentidad);
                    $("#razon").val(respJson.razonSocial);
                    $("#dir").val(respJson.direccion);
                    $("#correo").val(respJson.email);
                    $("#tele").val(respJson.telefono);
                    $("#estado").selectpicker('val',respJson.estado);
                    $("#titulo").html("Modificar Proveedor");
                    $("#accion").val("update");
                    $("#modalProveedor").modal("show");
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
            message: "<strong>¿Esta Seguro que desea Eliminar el Proveedor?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_proveedor',
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

    var ListComprasxProveedor = function(){
        tblCompras = $("#tblCompras").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_comprasxproveedores",data:function(d){
                d.fecini = $("#busfecini").val();d.idprov = $("#idprov").val();
                d.fecfin = $("#busfecfin").val();d.idalm = $("#cboLiAlmacen").val();
                d.idusu = $("#cboLiUsuario").val();d.idtipdoc = $("#cboLiTipDoc").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,5]},
                {'sClass':"centrador",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var viewCompras = function(a){
        var titulo = $(a).attr("data-original-title");
        $("#tituloCompras").text(titulo);
        $("#idprov").val($(a).attr("id"));
        tblCompras._fnDraw();
        $("#viewCompras").modal("show");
    };

    var viewDetails = function(a){
        $.ajax({
            type: 'post',
            url: "view_compra",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#verusu").val(respJson.otbUsuario.nombres+ " "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#verprov").val(respJson.otbProveedor.razonSocial);
                    $("#vernum").val(respJson.numOrden);
                    $("#veralm").val(respJson.otbAlmacen.nombre);
                    $("#vertipodoc").val( (respJson.otbTipoDoc!==null?respJson.otbTipoDoc.nombre:"") + (respJson.numDocumento!==null?" "+respJson.numDocumento:"")  );
                    var fecreg = moment(respJson.fecGenerada).format('DD-MM-YYYY');
                    $("#verfecha").val(fecreg);
                    $("#verigv").val(Redondear2(respJson.preIgv));
                    $("#versub").val(Redondear2(respJson.preSub));
                    $("#vertot").val(Redondear2(respJson.preTotal));
                    var html = "";
                    var cantPro = 0;
                    for (var i = 0; i < respJson.tbDetallecompras.length; i++){
                        var deta = respJson.tbDetallecompras[i];
                        html+="<tr>";
                        html+="<td>"+deta.otbProducto.codigo+"</td>";
                        html+="<td>"+deta.otbProducto.desCategoria + " "+deta.otbProducto.desMarca+" "+deta.otbProducto.nombre + (deta.otbProducto.modelo !== null ? " "+deta.otbProducto.modelo:"")+"</td>";
                        html+="<td>"+Redondear2(deta.cantidad)+"</td>";
                        html+="<td>"+Redondear2(deta.preUni)+"</td>";
                        html+="<td>"+Redondear2(deta.preTotal)+"</td>";
                        html+="</tr>";
                        cantPro = cantPro + parseFloat(deta.cantidad);
                    }
                    html+="<tr>";
                    html+="<td class='text-right font-bold' colspan='2' style='font-size:13px;'>"+"TOTAL DE PRODUCTOS"+"</td>";
                    html+="<td colspan='3' class='font-bold' style='font-size:13px;'>"+Redondear2(cantPro)+"</td>";
                    html+="</tr>";
                    $("#listado").html(html);
                    $("#viewCompra").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin").val(fecAct);
        FormatoFecha($("#data_1"),"dd-mm-yyyy");
        FormatoFecha($("#data_2"),"dd-mm-yyyy");
        ListComprasxProveedor();
        ListProveedor();
        NumeroEntero($("#ruc"),11);
        $("#ruc").css("text-align","left");
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        keyup_input_general_3("#frmProveedor input", "#frmProveedor", "#modalProveedor");
        $("#btnSearchCompras").on("click",function () {
           tblCompras._fnDraw();
        });
        $("#cboBusEstado").on("change",function(){table._fnDraw();});
    };
    
    return {
        init: function(){
            Iniciando();
        },
        view_record:function(a){
            view_record(a);
        },
        delete_record:function(a){
            delete_record(a);
        },
        viewCompras:function (a) {
            viewCompras(a)
        },
        viewDetails:function (a) {
            viewDetails(a);
        }
    };
}();
jQuery(document).ready(function () {
    Proveedor.init();
});