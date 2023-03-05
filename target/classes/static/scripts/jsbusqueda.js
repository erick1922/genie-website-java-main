var Busqueda = function(){
    var agregar = Ladda.create(document.querySelector('#btnAddCantidad'));
    var table;
    var idAlm = 0;
    var LisIdPro = new Array();
    var LisNomPro = new Array();
    var LisCant = new Array();
    var idpro = 0;
    var nompro = "";
    var cant = "";
    var LisCantidad = new Array();
    var LisPrecio = new Array();

    var ListProductos = function(){
        table = $("#tblProductos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',
                url:"list_pro_busqueda_search",
                data:function(d){
                    d.desc = $("#txtDesc").val();
                    d.tipo = $("#cboLiTipo").val();d.idm = $("#cboLiMarca").val();d.idc = $("#cboLiCategoria").val();
                    d.idu = $("#cboLiUnidad").val();d.idalm = $("#cboLiAlmacen").val();d.buspor = $("#cboBuscar").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2]},
                {'sClass':"text-right",'aTargets': [4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var viewDetails = function(elem){
        var btnSearch = Ladda.create(document.querySelector('#'+$(elem).attr("id")));
        $("#id").val($(elem).attr("data-id"));
        $("#tblStock,#tblAlmacen").html("");
        btnSearch.start();
        $.ajax({
            type: 'post',
            url: "view_stock_productoxalmacen",
            dataType: 'json',
            data:{id:$(elem).attr("data-id"),idalm:idAlm},
            success:function(respJson){
                if(respJson!==null){
                    $("#tblAlmacen").html(respJson.htmlLiDetalle);
                    $("#accion").val(respJson.rutaImagen === "" ? "SAVE" : "UPDATE");
                    if(respJson.rutaImagen !== ""){
                        var link = "data:"+GetTipoFileImage(respJson.rutaImagen)+";base64," + respJson.img64Bytes;
                        $("#imgProducto").attr('src',link);
                    }else{
                        $("#imgProducto").attr('src',"/resources/images/logo_producto.png");
                    }
                    $("#viewStocks").modal("show");
                    btnSearch.stop();
                }else{
                    btnSearch.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                btnSearch.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            } 
        });
    };

    var imprimir_listaproduct = function(){
        var method = "downloadListProduct";
        var parameters = "idcat=" + $("#cboLiCategoria").val() + "&idmar=" + $("#cboLiMarca").val()+ "&idalm=" + $("#cboLiAlmacen").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var view_barcodes = function(){
        generar_lista();
        var method = "downloadListBarcodePDF";
        var parameters = "idprods=" + nompro + "&cants=" + cant;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var generar_lista = function () {
        nompro = "";
        cant = "";
        for (var i = 0 ; i < LisIdPro.length;i++){
            if( i === LisIdPro.length-1){
                nompro+=LisIdPro[i];
                cant+=LisCant[i];
            }else{
                nompro+=LisIdPro[i]+",";
                cant+=LisCant[i]+",";
            }
        }
    };

    var addProduct = function(elem){
        idpro = $(elem).attr("data-id");
        nompro = $(elem).attr("data-name");
        $("#modalCantidad").modal("show");
        $("#txtCantidad").focus();
    };
    
    var cargarProduct = function(){
        agregar.start();
        var posicion = true;
        for (var i=0;i < LisIdPro.length;i++){
            if(LisIdPro[i] === idpro){
                posicion = false;
                LisCant[i] = LisCant[i] + parseFloat($("#txtCantidad").val());
                i = LisIdPro.length + 1;
            }
        }
        if(posicion){
            LisIdPro.push(idpro);
            LisNomPro.push(nompro);
            LisCant.push(parseFloat($("#txtCantidad").val()));
        }
        CargarTabla();
        $("#modalCantidad").modal("hide");
        agregar.stop();
        $("#txtCantidad").val("");
    };

    var quitarItem = function(elem){
        var pos = $(elem).attr("data-pos");
        LisIdPro.splice(pos,1);
        LisNomPro.splice(pos,1);
        LisCant.splice(pos,1);
        CargarTabla();
    };

    var quitarItemTblPrecios = function(elem){
        var pos = $(elem).attr("data-pos");
        LisCantidad.splice(pos,1);
        LisPrecio.splice(pos,1);
        CargarTablaPrecios();
    };

    var CargarTabla = function () {
        $("#tblBarcodeProducto").html("");
        for (var i = 0; i < LisIdPro.length; i++) {
            $("#tblBarcodeProducto").append("<tr>"+
                "<td class='text-center'>"+(i+1)+"</td>"+
                "<td class='text-left'>"+LisNomPro[i]+"</td>"+
                "<td class='text-right'>"+Redondear2(LisCant[i])+"</td>"+
                "<td><button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_"+i).on("click",function(){quitarItem(this);});
        }
    };

    var CargarTablaPrecios = function () {
        $("#tblBarcodePrecios").html("");
        for (var i = 0; i < LisCantidad.length; i++) {
            $("#tblBarcodePrecios").append("<tr>"+
                "<td class='text-center'>"+(i+1)+"</td>"+
                "<td class='text-left'><input type='text' class='form-control input-sm' name='txt_cant_ip_"+i+"' id='txt_cant_ip_"+i+"' data-pos='"+i+"' value='"+LisCantidad[i]+"' /></td>"+
                "<td class='text-left'><input type='text' class='form-control input-sm' name='txt_pre_ip_"+i+"' id='txt_pre_ip_"+i+"' data-pos='"+i+"' value='"+LisPrecio[i]+"' /></td>"+
                "<td><button type='button' class='btn btn-sm btn-danger' style='padding:4px 10px!important;' id='fndel_pre_"+i+"' data-pos='"+i+"' title='Quitar'>"+
                "<i class='glyphicon glyphicon-trash'></i></button>"+"</td>"+
                "</tr>");
            $("#fndel_pre_"+i).on("click",function(){
                quitarItemTblPrecios(this);
            });
            NumeroEntero( $("#txt_cant_ip_"+i),5,1,99999);
            NumeroDosDecimales( $("#txt_pre_ip_"+i));
            $("#txt_cant_ip_"+i).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                LisCantidad[pos] = $(this).val();
            });
            $("#txt_pre_ip_"+i).on("keyup",function (e) {
                e.stopPropagation();
                var pos = $(this).attr("data-pos");
                LisPrecio[pos] = $(this).val();
            });
        }
    };

    var view_reservas = function(){
        var method = "downloadProductosReservados";
        var parameters = "idsuc=" + $("#cboLiAlmacen").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };
    
    var Iniciando = function(){
        $("#btnNewBarcode").on("click",function() {
            if(LisIdPro.length > 0){
                $("#modalBarcodeProduct").modal("show");
            }else{
                uploadMsnSmall("Aún no se ha agregado ningun Producto.","ALERTA");
            }
        });
        $("#btnNewBarcodePrecios").on("click",function(){
            $("#modalBarcodePrecios").modal("show");
        });
        NumeroEntero($("#txtCantidad"),4,1,9999);
        $("#btnPrintProduct").on("click",imprimir_listaproduct);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#cboLiAlmacen").on("change",function(){idAlm = this.value;table._fnDraw();});
        $("#btnAddCantidad").on("click",cargarProduct);
        $("#btnGenBarcode").on("click",view_barcodes);
        $("#btnPrintReserva").on("click",view_reservas);
        $("#cboLiCategoria,#cboLiMarca,#cboLiUnidad").on("change",function (){table._fnDraw();});
        $("#btnAddPrecioTbl").on("click",function(){
            LisCantidad.push("");
            LisPrecio.push("");
            CargarTablaPrecios();
        });
        $.ajax({
            type: 'post',
            url: "mant_busqueda",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboLiMarca").html("<option value='T'>--TODOS--</option>"+respJson.htLiM);
                    $("#cboLiCategoria").html("<option value='T'>--TODOS--</option>"+respJson.htLiC);
                    $("#cboLiUnidad").html("<option value='T'>--TODOS--</option>"+respJson.htLiU);
                    $("#cboLiAlmacen").html(respJson.htLiAlm);
                    $(".selectpicker").selectpicker("refresh");
                    idAlm = $("#cboLiAlmacen").val();
                    ListProductos();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#txtCantidad").on("keyup",function (e) {
            if(e.keyCode===13){
                $("#btnAddCantidad").trigger("click");
            }
        });
        $("#btnGenBarcodePrec").on("click",function(){
            var idc = "";
            var idp = "";
            for (var i = 0 ; i < LisCantidad.length;i++){
                if( i === LisCantidad.length-1){
                    idc+=LisCantidad[i];
                    idp+=LisPrecio[i];
                } else {
                    idc+=LisCantidad[i]+",";
                    idp+=LisPrecio[i]+",";
                }
            }
            var method = "downloadListPreciosBarcode";
            var parameters = "cantidades=" + idc + "&precios="+idp;
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });

        $("#btnSubirImagenProducto").on("click",function(){
            $("#fileImgProducto").trigger("click");
        });

        $("#fileImgProducto").on("change",function(event){
            var reader = new FileReader(); // HTML5 FileReader API
            if (event.target.files && event.target.files[0]) {
                if (ValidarImagen(event.target.files[0])) {
                    var fileFoto = event.target.files[0];
                    reader.addEventListener("load", function () {
                        $("#imgProducto").attr("src",reader.result);
                    }, false);
                    if (fileFoto){
                        reader.readAsDataURL(fileFoto);
                    }
                    Repositorio.refreshTable($('div.mdlUpdateImgProducto'));
                    var datos = new FormData($("#frmFotoProducto")[0]);
                    $.ajax({
                        type: 'post',
                        url: "update_img_producto",
                        data:datos,
                        dataType: 'json',
                        contentType:false,
                        processData:false,
                        cache: false,
                        xhr: function() {
                            var myXhr = $.ajaxSettings.xhr();
                            if(myXhr.upload){
                                myXhr.upload.addEventListener('progress',function(e){progressHandlingFunction(e,$("#bar_fotoproducto"));}, false); // For handling the progress of the upload
                            }
                            return myXhr;
                        },
                        success:function(respJson){
                            if(respJson!==null){
                                if(respJson.dato==="OK"){
                                    Repositorio.finishRefresh($('div.mdlUpdateImgProducto'));
                                    uploadMsnSmall(respJson.msj,'OK');
                                    reiniciar("bar_fotoproducto");
                                }else if(respJson.dato==="ERROR"){
                                    if(respJson.listado.length>0){
                                        for (var i = 0; i < respJson.listado.length; i++) {
                                            if(respJson.listado[i] === "E1"){estilo_error(true,"#frmProducto #desc");}
                                            if(respJson.listado[i] === "E2"){style_error_cbo_final("#cboMarca",true);}
                                        }
                                    }else{
                                        uploadMsnSmall(respJson.msj,'ERROR');
                                    }
                                    Repositorio.finishRefresh($('div.mdlUpdateImgProducto'));
                                    reiniciar("bar_fotoproducto");
                                }
                            }else{
                                Repositorio.finishRefresh($('div.mdlUpdateImgProducto'));
                                reiniciar("bar_fotoproducto");
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            Repositorio.finishRefresh($('div.mdlUpdateImgProducto'));
                            uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                            reiniciar("bar_fotoproducto");
                        }
                    });
                }else{
                    $("#uploadFileProducto").val("");
                }
            }
        });
    };
    
    return {
        init: function () {
            Iniciando();
        },
        viewDetails:function(elem){
            viewDetails(elem);
        },
        addProduct:function(elem){
            addProduct(elem);
        }
    };
}();
jQuery(document).ready(function () {
    Busqueda.init();
});