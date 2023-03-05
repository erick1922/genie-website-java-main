var Producto = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var categoria = Ladda.create(document.querySelector("#btnGuardarCategoria"));
    var color = Ladda.create(document.querySelector("#btnGuardarColor"));
    var talla = Ladda.create(document.querySelector("#btnGuardarTalla"));
    var marca = Ladda.create(document.querySelector("#btnGuardarMarca"));
    var unidad = Ladda.create(document.querySelector("#btnGuardarUnidad"));
    var material = Ladda.create(document.querySelector("#btnGuardarMaterial"));
    var agregar = Ladda.create(document.querySelector("#btnAddInsumo"));
    var calcular = Ladda.create(document.querySelector("#btnCalcular"));
    var agregarVar = Ladda.create(document.querySelector("#btnAddVariacion"));
    var exportarCSV = document.getElementById('btnExcelCSV') ? Ladda.create(document.querySelector("#btnExcelCSV")) : null;
    var loadExcel = document.getElementById('btnLoadVariacion') ? Ladda.create(document.querySelector("#btnLoadVariacion")) : null;
    var loadExcel2 = document.getElementById('btnLoadNewProductos') ? Ladda.create(document.querySelector("#btnLoadNewProductos")) : null;
    var loadExcel3 = document.getElementById('btnLoadPrecios') ? Ladda.create(document.querySelector("#btnLoadPrecios")) : null;

    var table;
    var tableProd = null;
    var valor = 0;
    var busqueda = "";
    var propiedades = new Array();
    var tallasVar = new Array();
    var coloresVar = new Array();
    var listPadre = new Array();
    var listDescripcion = new Array();
    var listColor = new Array();
    var listTalla = new Array();
    var listCodUnico = new Array();
    var listCantidad = new Array();

    var listCategoria = new Array();
    var listMarca = new Array();
    var listModelo = new Array();
    var listPrecio1 = new Array();
    var listPrecio2 = new Array();
    var listPrecio3 = new Array();
    var listSku = new Array();

    var ListProductos = function(){
        table = $("#tblProductos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_productos",data:function(d){
                d.modulo = "1";d.desc = $("#txtDesc").val();d.tipo = $("#cboLiTipo").val();
                d.idm = $("#cboLiMarca").val();d.idc = $("#cboLiCategoria").val();
                d.idu = $("#cboLiUnidad").val();d.est = $("#cboBusEstado").val();
                d.buspor = $("#cboBuscar").val();d.idalm = $("#cboLiAlmacen").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,2,7]},
                {'sClass':"centrado px-0",'aTargets': [1]},
                {'sClass':"text-right",'aTargets': [4,5,6]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]} 
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListProductosParaCombo = function(){
        tableProd = $("#tblProductoParaCombo").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_productos",data:function(d){
                d.modulo = "2";d.desc = $("#txtDescProducto").val();d.tipo = $("#cboLiTipoProd").val();
                d.idm = "T";d.idc = "T";d.idu = "T";d.est = "H";
                d.buspor = $("#cboBuscarProd").val();d.idalm = $("#cboComboAlmacen").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"text-right",'aTargets': [4,5,6]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };
    
    var Limpiar = function(){
        $.each($("#frmProducto input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        $("#imgFoto").html("");
        style_error_cbo_final("#frmProducto #estado",false);
        style_error_cbo_final("#frmProducto #cboMarca",false);
        style_error_cbo_final("#frmProducto #cboCategoria",false);
        style_error_cbo_final("#frmProducto #cboUnidad",false);
        style_error_cbo_final("#frmProducto #cboCaracteristica",false);
        style_error_cbo_final("#frmProducto #cboTipoProducto",false);
    };

    var Limpiar_Categoria = function(){
        $.each($("#frmCategoria input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_talla = function(){
        $.each($("#frmTalla input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_color = function(){
        $.each($("#frmColor input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_Caracteristica = function(){
        $.each($("#frmMaterial input"),function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_Marca = function(){
        $.each($("#frmMarca input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };

    var Limpiar_Unidad = function(){
        $.each($("#frmUnidad input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
    };
    
    var new_record = function(){
        if( $("#cboLiAlmacen").val()!== "0" ){
            Limpiar();
            $("#imgFoto").html("");
            $("#div-tipo-producto").show();
            $("#frmProducto #div-estado").hide();
            $("#titulo").html("Nuevo Producto");
            $("#frmProducto #accion").val("save");
            $("#frmProducto #id").val("0");
            $("#cboMarca").selectpicker('val','0');
            $("#cboCategoria").selectpicker('val','0');
            $("#cboCaracteristica").selectpicker('val','0');
            $("#cboUnidad").selectpicker('val',valor);
            $("#cboUndCompra").selectpicker('val',valor);
            $("#cboUndAlmacen").selectpicker('val',valor);
            /// $("#cboTipoAfectacion").selectpicker('val',"0");//AFECTO DE IGV  POR DEFECTO.
            $("#minimo").val("1");
            $("#maximo").val("5");
            $("#frmProducto #estado").selectpicker('val','H');
            $("#chkSku").prop("checked",false);
            $("#chkSku").val("0");
            $("#chkSku").iCheck('update');
            $("#sku").attr("readonly","readonly");
            $("#cboTipoProducto").change();
            $("#modalProducto").modal("show");
        }else{
            Swal.fire({
                title: 'No tiene un Almacen registrado',
                text: "Desea ir al registro de almacen?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Ahora Mismo!',
                cancelButtonText: 'Cancelar',
                allowOutsideClick: false
            }).then( function(result){
                if (result.value) {
                    var url = "PuntoVenta.html";
                    window.open(url,'_self');
                }
            });
        }
    };

    var save = function(){
        cargando.start();
        var datos = new FormData($("#frmProducto")[0]);
       /* datos.append('accion',$("#frmProducto #accion").val());
        datos.append('id',$("#frmProducto #id").val());
        datos.append('cboTipoProducto',$("#cboTipoProducto").val());
        datos.append('cboCategoria',$("#cboCategoria").val());
        datos.append('cboMarca',$("#cboMarca").val());
        datos.append('cboUnidad',$("#cboUnidad").val());
        datos.append('cboUndCompra',$("#cboUndCompra").val());
        datos.append('cboUndAlmacen',$("#cboUndAlmacen").val());
        datos.append('cboCaracteristica',$("#cboCaracteristica").val());
        datos.append('desc',$('#frmProducto #desc').val());
        datos.append('modelo',$('#modelo').val());
        datos.append('minimo',$('#minimo').val());
        datos.append('maximo',$('#maximo').val());
        datos.append('precio1',$("#precio1").val());
        datos.append('precio2',$("#precio2").val());
        datos.append('precio3',$("#precio3").val());
        datos.append('estado',$("#estado").val());*/
        datos.append('chkSku',$("#chkSku").val());
        //datos.append('sku',$("#sku").val());
        var tallas = $("#cboTallas").val() !== null ? $("#cboTallas").val() : [];
        var colores = $("#cboColores").val() !== null ? $("#cboColores").val() : [];
        var cadtalla = TransformArrayToString(tallas);
        var cadcolor = TransformArrayToString(colores);
        datos.append('cadtalla',cadtalla);
        datos.append('cadcolor',cadcolor);
        console.log(datos);
        $.ajax({
            type: 'post',
            url: "save_producto",
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
                        $("#cboBuscar").selectpicker('val','N');
                        $("#cboLiTipo").selectpicker('val',$("#cboTipoProducto").val());
                        var desc_categoria = "";
                        var desc_marca = "";
                        var desc_caracteristica = "";
                        var desc_nombre = $('#frmProducto #desc').val()+"";
                        var desc_modelo = $("#modelo").val()+"";
                        if( $("#cboCategoria").val() !== "0" ){
                            desc_categoria = $('option:selected',$("#cboCategoria")).text()+"";
                        }
                        if( $("#cboMarca").val() !== "0" ){
                            desc_marca = $('option:selected',$("#cboMarca")).text()+ "";
                        }
                        if( $("#cboCaracteristica").val() !== "0" ){
                            desc_caracteristica = $('option:selected',$("#cboCaracteristica")).text()+"";
                        }
                        if(busqueda === "1"){
                            var desc_total = (desc_categoria+" "+desc_marca+" "+desc_nombre+" "+desc_modelo);
                        }else if(busqueda === "2"){
                            var desc_total = (desc_categoria+" "+desc_marca+" "+desc_modelo+" "+desc_caracteristica+" "+desc_nombre);
                        }
                        var texto = desc_total.split(/ /g);
                        var cadTexto = "";
                        for(var x=0;x<texto.length;x++){
                            if($.trim(texto[x]) !== ""){
                                cadTexto+=$.trim(texto[x])+" ";
                            }
                        }
                        $("#txtDesc").val($.trim(cadTexto));
                        cargando.stop();
                        $("#modalProducto").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                        reiniciar("bararchivo");
                        $("#txtDesc").focus();
                        $("#btnSearch").trigger("click");
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmProducto #desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#cboMarca",true);}
                                if(respJson.listado[i] === "E3"){style_error_cbo_final("#cboCategoria",true);}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#cboUnidad",true);}
                                if(respJson.listado[i] === "E5"){estilo_error(true,"#minimo");}
                                if(respJson.listado[i] === "E6"){estilo_error(true,"#maximo");}
                                if(respJson.listado[i] === "E7"){estilo_error(true,"#precio1");}
                                if(respJson.listado[i] === "E8"){estilo_error(true,"#precio2");}
                                if(respJson.listado[i] === "E9"){estilo_error(true,"#precio3");}
                                if(respJson.listado[i] === "E10"){style_error_cbo_final("#frmProducto #estado",true);}
                                if(respJson.listado[i] === "E11"){estilo_error(true,"#minimo");uploadMsnSmall("Stock Minimo debe de ser Menor que el Maximo.",'ALERTA');}
                                if(respJson.listado[i] === "E12"){estilo_error(true,"#precio1");}
                                if(respJson.listado[i] === "E13"){estilo_error(true,"#precio2");}
                                if(respJson.listado[i] === "E14"){estilo_error(true,"#precio3");}
                                if(respJson.listado[i] === "E15"){uploadMsnSmall("Seleccion SKU incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E16"){estilo_error(true,"#sku");}
                                if(respJson.listado[i] === "E17"){style_error_cbo_final("#cboUndCompra",true);}
                                if(respJson.listado[i] === "E18"){style_error_cbo_final("#cboUndAlmacen",true);}
                                if(respJson.listado[i] === "E19"){style_error_cbo_final("#cboCaracteristica",true);}
                                if(respJson.listado[i] === "E20"){estilo_error(true,"#modelo");}
                                if(respJson.listado[i] === "E21"){estilo_error(true,"#modelo");uploadMsnSmall("La descripcion del modelo debe de ser menor a 20 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E22"){uploadMsnSmall("Seleccione al menos un color.","ALERTA");}
                                if(respJson.listado[i] === "E23"){uploadMsnSmall("Seleccione al menos una talla.","ALERTA");}
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

    var view_record = function(elem){
        var pidprod = $(elem).attr("id").split("_")[2];
        Limpiar();
        var ver_pro = Ladda.create(document.querySelector('#' + $(elem).attr("id")));
        $("#" + $(elem).attr("id")).tooltip('hide');
        ver_pro.start();
        $.ajax({
            type: 'post',
            url: "view_producto",
            dataType: 'json',
            data:{id:pidprod},
            success:function(respJson){
                console.log(respJson);
                if(respJson!==null){
                    if(respJson.rutaImagen !== null){
                        $("#imgFoto").html(respJson.rutaImagen !==null?"<img src='' width='200px;' />":"");
                        var link = "data:"+GetTipoFileImage(respJson.rutaImagen)+";base64," + respJson.bytes64Imagen;
                        $("#imgFoto").find('img').attr('src',link);
                    }else{
                        $("#imgFoto").html("");
                    }

                    var colores = respJson.colores;
                    var tallas = respJson.tallas;
                    var subtipo = parseInt(respJson.subTipoProducto);
                    var arrColores = [];
                    var arrTallas = [];
                    if(subtipo === 0){
                        if(respJson.talla !== null){
                            arrTallas.push(respJson.talla.id);
                        }
                        if(respJson.color !== null){
                            arrColores.push(respJson.color.id);
                        }
                    }
                    if(subtipo === 1){
                        for(var i=0;i<colores.length;i++){
                            arrColores.push(colores[i].color.id);
                        }
                        for(var j=0;j<tallas.length;j++){
                            arrTallas.push(tallas[j].talla.id);
                        }
                    }
                    $("#frmProducto #accion").val("update");
                    $("#cboTipoProducto").selectpicker('val',respJson.oTipoProducto.id);
                    $("#cboTipoProducto").change();
                    $.ajax({
                        type: 'post',
                        url: "load_marca_categoria_xtipo",
                        dataType: 'json',
                        data:{idpro:respJson.oTipoProducto.id},
                        success: function (data) {
                            if(data !== null){
                                $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+data.htM);
                                $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+data.htC);
                                $("#cboMarca,#cboCategoria").selectpicker('refresh');
                                $("#cboMarca").selectpicker('val',respJson.otbMarca !== null ? respJson.otbMarca.id : "0");
                                $("#cboCategoria").selectpicker('val',respJson.otbCategoria !== null ? respJson.otbCategoria.id : "0");
                            }else{
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function (jqXHR, status, error) {
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                    $("#cboTallas").selectpicker('val',arrTallas);
                    $("#cboColores").selectpicker('val',arrColores);
                    $("#div-tipo-producto").hide();
                    $("#frmProducto #div-estado").show();
                    $("#frmProducto #id").val(respJson.id);
                    $("#frmProducto #desc").val(respJson.nombre);
                    $("#minimo").val(Redondear2(respJson.stockMinimo));
                    $("#maximo").val(Redondear2(respJson.stockMaximo));
                    $("#modelo").val(respJson.modelo);
                    $("#precio1").val(Redondear2(respJson.precioMenor1));
                    $("#precio2").val(Redondear2(respJson.precioInter2));
                    $("#precio3").val(Redondear2(respJson.precioMayor3));
                    $("#cboCaracteristica").selectpicker('val',respJson.caracteristica1 !== null ? respJson.caracteristica1.id : "0");
                    $("#cboUnidad").selectpicker('val',respJson.otbUnidad !== null ? respJson.otbUnidad.id : "0");
                    $("#cboUndCompra").selectpicker('val',respJson.unidadCompra!==null ? respJson.unidadCompra.id : "0");
                    $("#cboUndAlmacen").selectpicker('val',respJson.unidadStock!==null ? respJson.unidadStock.id : "0");
                    $("#cboTipoAfectacion").selectpicker('val',respJson.exoneradoIgv);
                    $("#frmProducto #estado").selectpicker('val',respJson.estado);
                    $("#sku").val(respJson.barcodeProducto);
                    $("#chkSku").prop("checked",true);
                    $("#chkSku").val("1");
                    if(respJson.barcodeProducto !== null){
                        $("#chkSku").prop("checked",false);
                        $("#chkSku").val("0");
                    }
                    $("#chkSku").iCheck('update');
                    $("#titulo").html("Modificar producto");
                    $("#modalProducto").modal("show");
                    ver_pro.stop();
                }else{
                    ver_pro.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                ver_pro.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_categoria = function(){
        categoria.start();
        $.ajax({
            type: 'post',
            url: "save_categoria",
            dataType: 'json',
            data:$("#frmCategoria").serialize()+"&estado=H&accion=save&cboTipoProducto="+$("#cboTipoProducto").val(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        categoria.stop();
                        $("#modalCategoria").modal("hide");
                        ReloadCategorias();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmCategoria #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmCategoria #desc");uploadMsnSmall("EL Nombre de Categoria debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        categoria.stop();
                    }
                }else{
                    categoria.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                categoria.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_talla = function(){
        talla.start();
        $.ajax({
            type: 'post',
            url: "save_talla",
            dataType: 'json',
            data:$("#frmTalla").serialize()+"&estado=1&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        talla.stop();
                        $("#modalTalla").modal("hide");
                        ReloadTallas();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmTalla #desc_talla");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmTalla #desc_talla");uploadMsnSmall("EL nombre de la talla debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        talla.stop();
                    }
                }else{
                    talla.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                talla.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_color = function(){
        color.start();
        $.ajax({
            type: 'post',
            url: "save_color",
            dataType: 'json',
            data:$("#frmColor").serialize()+"&estado=1&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        color.stop();
                        $("#modalColor").modal("hide");
                        ReloadColores();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmColor #desc_color");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmColor #desc_color");uploadMsnSmall("EL Nombre del color debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        color.stop();
                    }
                }else{
                    color.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                color.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_caracteristica = function(){
        material.start();
        $.ajax({
            type: 'post',
            url: "save_caracterisitica",
            dataType: 'json',
            data:$("#frmMaterial").serialize()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        material.stop();
                        $("#modalMaterial").modal("hide");
                        ReloadCaracteristica();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmMaterial #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmMaterial #descM");uploadMsnSmall("EL Nombre del Material debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        material.stop();
                    }
                }else{
                    material.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                material.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_marca = function(){
        marca.start();
        $.ajax({
            type: 'post',
            url: "save_marca",
            dataType: 'json',
            data:$("#frmMarca").serialize()+"&estado=H&accion=save&cboTipoProducto="+$("#cboTipoProducto").val(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        marca.stop();
                        $("#modalMarca").modal("hide");
                        ReloadMarcas();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmMarca #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmMarca #desc");uploadMsnSmall("EL Nombre de Marca debe de ser menos de 50 caracteres.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        marca.stop();
                    }
                }else{
                    marca.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                marca.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var save_unidad = function(){
        unidad.start();
        $.ajax({
            type: 'post',
            url: "save_unidad",
            dataType: 'json',
            data:$("#frmUnidad").serialize()+"&desc="+$("#descU").val()+"&estado=H&accion=save",
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        unidad.stop();
                        $("#modalUnidad").modal("hide");
                        ReloadUnidades();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#frmUnidad #desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#frmUnidad #desc");uploadMsnSmall("EL Nombre de Unidad de Medida debe de ser menos de 30 caracteres.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){estilo_error(true,"#abrev");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        unidad.stop();
                    }
                }else{
                    unidad.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                unidad.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };
    
    var delete_record = function(elem){
        var pidprod = $(elem).attr("id").split("_")[2];
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar el Producto?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_producto',
                        data: {"id":pidprod},
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

    var new_categoria = function(){
        Limpiar_Categoria();
        $("#modalCategoria").modal("show");
        $("#frmCategoria #desc").focus();
    };

    var new_color = function(){
        Limpiar_color();
        $("#modalColor").modal("show");
        $("#frmColor #desc_color").focus();
    };

    var new_talla = function(){
        Limpiar_talla();
        $("#modalTalla").modal("show");
        $("#frmTalla #desc_talla").focus();
    };

    var new_caracteristica = function () {
        Limpiar_Caracteristica();
        $("#modalMaterial").modal("show");
        $("#frmMaterial #descM").focus();
    };

    var new_marcas = function(){
        Limpiar_Marca();
        $("#modalMarca").modal("show");
        $("#frmMarca #desc").focus();
    };

    var new_unidades = function(){
        Limpiar_Unidad();
        $("#modalUnidad").modal("show");
        $("#frmUnidad #desc").focus();
    };

    var ReloadCaracteristica = function(){
        $.ajax({
            type: 'post',
            url: "select_caracteristica",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboCaracteristica").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htCar);
                    $("#cboCaracteristica").selectpicker("refresh");
                    var materiales = $("#cboCaracteristica option");
                    var mat = $("#frmMaterial #descM").val().toUpperCase();
                    var idmat = 0;
                    for(var i=0;i<materiales.length;i++){
                        if(materiales[i].text === mat){
                            idmat = parseInt(materiales[i].value);
                            $("#cboCaracteristica").selectpicker("val",idmat);
                            style_error_cbo_final("#cboCaracteristica",false);
                            i = materiales.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadCategorias = function(){
        $.ajax({
            type: 'post',
            url: "select_categoria",
            dataType: 'json',
            data:{idtippro:$("#cboTipoProducto").val()},
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                    $("#cboLiCategoria").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                    $("#cboCategoria,#cboLiCategoria").selectpicker("refresh");
                    var categorias = $("#cboCategoria option");
                    var cat = $("#frmCategoria #desc").val().toUpperCase();
                    var idcat = 0;
                    for(var i=0;i<categorias.length;i++){
                        if(categorias[i].text === cat){
                            idcat = parseInt(categorias[i].value);
                            $("#cboCategoria").selectpicker("val",idcat);
                            style_error_cbo_final("#cboCategoria",false);
                            i = categorias.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadTallas = function(){
        $.ajax({
            type: 'post',
            url: "select_tallas",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    var select = $("#cboTallas").val() !== null ? $("#cboTallas").val() : [];
                    var talla = $("#frmTalla #desc_talla").val().toUpperCase();
                    var idtal = "0";
                    var tallas = respJson.htTallas;
                    var htSel = "";
                    for(var i=0;i<tallas.length;i++){
                        htSel+="<option value='"+tallas[i].id+"'>"+tallas[i].nombre+"</option>";
                        if(talla === tallas[i].nombre){
                            idtal = tallas[i].id.toString();
                        }
                    }
                    $("#cboTallas").html(htSel);
                    $("#cboTallas").selectpicker("refresh");
                    select.push(idtal);
                    $("#cboTallas").selectpicker("val",select);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadColores = function(){
        $.ajax({
            type: 'post',
            url: "select_colores",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    var select = $("#cboColores").val() !== null ? $("#cboColores").val() : [];
                    var color = $("#frmColor #desc_color").val().toUpperCase();
                    var idcol = "0";
                    var colores = respJson.htCol;
                    var htCol = "";
                    for(var i=0;i<colores.length;i++){
                        htCol+="<option value='"+colores[i].id+"'>"+colores[i].nombre+"</option>";
                        if(color === colores[i].nombre){
                            idcol = colores[i].id.toString();
                        }
                    }
                    $("#cboColores").html(htCol);
                    $("#cboColores").selectpicker("refresh");
                    select.push(idcol);
                    $("#cboColores").selectpicker("val",select);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadMarcas = function(){
        $.ajax({
            type: 'post',
            url: "select_marca",
            dataType: 'json',
            data:{idtippro:$("#cboTipoProducto").val()},
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                    $("#cboLiMarca").html("<option value='T'>--TODOS--</option>"+respJson.htM);
                    $("#cboMarca,#cboLiMarca").selectpicker("refresh");
                    var marcas = $("#cboMarca option");
                    var mar = $("#frmMarca #desc").val().toUpperCase();
                    var idmar = 0;
                    for(var i=0;i<marcas.length;i++){
                        if(marcas[i].text === mar){
                            idmar = parseInt(marcas[i].value);
                            $("#cboMarca").selectpicker("val",idmar);
                            style_error_cbo_final("#cboMarca",false);
                            i = marcas.length + 2;
                        }
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ReloadUnidades = function(){
        $.ajax({
            type: 'post',
            url: "select_unidad",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    var idundventa = $("#cboUnidad").val();
                    var idundcompra = $("#cboUndCompra").val();
                    var idundalmacen = $("#cboUndAlmacen").val();
                    $("#cboUnidad").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUndCompra").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUndAlmacen").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboUnidad,#cboUndCompra,#cboUndAlmacen").selectpicker("refresh");
                    var tipo = $("#tipound").val();
                    var undVenta = $("#cboUnidad option");
                    var undCompra = $("#cboUndCompra option");
                    var undAlmacen = $("#cboUndAlmacen option");
                    var unidad = $.trim($("#frmUnidad #descU").val().toUpperCase());
                    var idund = 0;
                    if(tipo === "V"){
                        for(var i=0;i<undVenta.length;i++){
                            if(undVenta[i].text === unidad){
                                idund = parseInt(undVenta[i].value);
                                $("#cboUnidad").selectpicker("val",idund);
                                style_error_cbo_final("#cboUnidad",false);
                                i = undVenta.length + 2;
                            }
                        }
                        $("#cboUndCompra").selectpicker("val",idundcompra);
                        $("#cboUndAlmacen").selectpicker("val",idundalmacen);
                    }else if(tipo === "C"){
                        for(var x=0;x<undCompra.length;x++){
                            if(undCompra[x].text === unidad){
                                idund = parseInt(undCompra[x].value);
                                $("#cboUndCompra").selectpicker("val",idund);
                                style_error_cbo_final("#cboUndCompra",false);
                                x = undCompra.length + 2;
                            }
                        }
                        $("#cboUnidad").selectpicker("val",idundventa);
                        $("#cboUndAlmacen").selectpicker("val",idundalmacen);
                    }else if(tipo === "A"){
                        for(var c=0;c<undAlmacen.length;c++){
                            if(undAlmacen[c].text === unidad){
                                idund = parseInt(undAlmacen[c].value);
                                $("#cboUndAlmacen").selectpicker("val",idund);
                                style_error_cbo_final("#cboUndAlmacen",false);
                                c = undAlmacen.length + 2;
                            }
                        }
                        $("#cboUnidad").selectpicker("val",idundventa);
                        $("#cboUndCompra").selectpicker("val",idundcompra);
                    }
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };
    
    var view_kardex = function(a){
        var method = "downloadKardex";
        var pidpro = $(a).attr("id").split("_")[2];
        var parameters = "idpro="+pidpro+"&idalm="+$("#cboLiAlmacen").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var checkSku = function(e,a){
        var isChecked = e.currentTarget.checked;
        if(isChecked){
            $("#sku").removeAttr("readonly");
        }else{
            $("#sku").attr("readonly","readonly");
        }
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var view_details = function(a){
        var fil = $(a).parents("tr");
        var idpp = $(a).attr("id").split("_")[2];
        $("#namepro,#idprocombo,#txtCantIns,#txtUndMed").val("");
        $("#idpropadre").val(idpp);
        $("#titCombos").text($(a).attr("data-original-title")+ " - " +$.trim($(fil).find("td").eq(3).html()));
        RecargarInsumos(idpp,false);
    };

    var view_variaciones = function (a) {
        var fil = $(a).parents("tr");
        var idpp = $(a).attr("id").split("_")[2];
        $("#idpropadrevar").val(idpp);
        var sku = $(fil).find("td").eq(2).html();
        $("#txtSKUvariable").val(sku);
        var nom = $(fil).find("td").eq(3).html();
        $("#titVariaciones").text("Listado de variaciones de " + nom);
        $("#nameprovar").val(nom);
        $.ajax({
            type: 'post',
            url: "view_producto",
            dataType: 'json',
            data:{id:idpp},
            success:function(respJson){
                if(respJson!==null){
                    tallasVar = respJson.tallas;
                    coloresVar = respJson.colores;
                    RecargarVariaciones($("#idpropadrevar").val(), true);
                    $("#ViewVariaciones").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });


    };

    var add_record = function (a) {
        $("#idprocombo").val($(a).attr("data-id"));
        $("#txtUndMed").val($(a).attr("data-und"));
        var fil = $(a).parents("tr");
        $("#namepro").val($.trim($(fil).find("td").eq(3).html()));
        $("#modalSearchProducto").modal("hide");
    };

    var RecargarInsumos = function(idproducto,isOpening){
        $.ajax({
            type: 'post',
            url: "list_productosxcombo",
            dataType: 'json',
            data:{idpro:idproducto,"idalm":$("#cboComboAlmacen").val()},
            success:function(respJson){
                if(respJson!==null){
                    var listado = respJson.listado;
                    var html = "";
                    for(var k=0;k<listado.length;k++) {
                        html += "<tr >";
                        html += "<td class='text-center' >"+(k+1)+"</td>";
                        html += "<td class='text-left' >"+listado[k].insumo.codigo+"</td>";
                        html += "<td class='text-left' >"+listado[k].insumo.nombre+"</td>";
                        html += "<td class='text-center' >"+listado[k].cantidad+"</td>";
                        html += "<td class='text-center' >"+listado[k].unidadMedida.nombre+"</td>";
                        html += "<td class='text-center' >"+listado[k].insumo.stockActual+"</td>";
                        var del="<button type='button' data-toggle='tooltip' data-placement='right' data-id='"+listado[k].id+"' data-insumo='"+listado[k].insumo.id+"' data-style='zoom-in'  data-spinner-size='30'   title = 'Quitar Producto' onclick='Producto.QuitarProductoRelacionado(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger ladda-button delActivo' > <span class='ladda-label'> <i class='glyphicon glyphicon-trash'></i> </span> </button>";
                        html += "<td class='text-center' >"+del+"</td>";
                        html += "</tr>";
                    }
                    $("#listado").html(html);
                    $(".delActivo").tooltip();
                    if(!isOpening){$("#ViewIngredientes").modal("show");}
                    $("#btnCalcular").trigger("click");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var RecargarVariaciones = function(idproducto,isOpening){
        $.ajax({
            type: 'post',
            url: "list_productos_variaciones",
            dataType: 'json',
            data:{idpro:idproducto},
            success:function(respJson){
                if(respJson!==null){
                    var listado = respJson.listado;
                    var html = "";
                    var opcTalla = "<option value='0'>--SELECCIONE--</option>";
                    for(var x=0;x<tallasVar.length;x++){
                        opcTalla+="<option value='"+tallasVar[x].talla.id+"' >"+tallasVar[x].talla.nombre+"</option>";
                    }
                    var opcColor = "<option value='0'>--SELECCIONE--</option>";
                    for(var y=0;y<coloresVar.length;y++){
                        opcColor+="<option value='"+coloresVar[y].color.id+"'>"+coloresVar[y].color.nombre+"</option>";
                    }
                    for(var k=0;k<listado.length;k++) {
                        var selTalla="<select class='cbovariaciones_ form-control input-sm selectpicker' name='cbo_var_talla_"+listado[k].id+"' id='cbo_var_talla_"+listado[k].id+"'>"+opcTalla+"</select>";
                        var selColor="<select class='cbovariaciones_ form-control input-sm selectpicker' name='cbo_var_color_"+listado[k].id+"' id='cbo_var_color_"+listado[k].id+"'>"+opcColor+"</select>";

                        html += "<tr >";
                        html += "<td class='text-center' >"+(k+1)+"</td>";
                        html += "<td class='text-center' >"+listado[k].codigo+"</td>";
                        html += "<td class='text-center' >"+listado[k].barcodeProducto+"</td>";
                        html += "<td class='text-left' >"+listado[k].descripcionTicket+"</td>";
                        html += "<td class='text-center py-td-select' >"+selColor+"</td>";
                        html += "<td class='text-center py-td-select' >"+selTalla+"</td>";
                        var check="<button type='button' data-toggle='tooltip' data-placement='right' id='btn_check_var_"+listado[k].id+"' data-id='"+listado[k].id+"' data-style='zoom-in' data-spinner-size='30' title = 'Guardar cambios' onclick='Producto.GuardarCambiosVariacion(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-primary ladda-button delActivo' > <span class='ladda-label'> <i class='glyphicon glyphicon-ok'></i> </span> </button>";
                        var del="<button type='button' data-toggle='tooltip' data-placement='right' data-id='"+listado[k].id+"' data-style='zoom-in' data-spinner-size='30' title = 'Quitar variacion' onclick='Producto.QuitarProductoVariacion(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger ladda-button delActivo' > <span class='ladda-label'> <i class='glyphicon glyphicon-trash'></i> </span> </button>";
                        html += "<td class='text-center py-5' >"+check+del+"</td>";
                        html += "</tr>";
                    }
                    $("#listado_variaciones").html(html);
                    $(".delActivo").tooltip();
                    $(".cbovariaciones_").selectpicker("refresh");

                    for(var k=0;k<listado.length;k++) {
                        $("#cbo_var_talla_" + listado[k].id).selectpicker('val',(listado[k].talla !== null ? listado[k].talla.id : 0 ) )
                        $("#cbo_var_color_" + listado[k].id).selectpicker('val',(listado[k].color !== null ? listado[k].color.id : 0 ) )
                    }

                    if(!isOpening){$("#ViewVariaciones").modal("show");}
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var QuitarProductoRelacionado = function (a) {
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea quitar el Producto relacionado?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_insumo',
                        data: {"id":$(a).attr("data-id")},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    RecargarInsumos($("#idpropadre").val(), true);
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

    var GuardarCambiosVariacion = function (a) {
        var id = $(a).attr("id");
        var idvar = $(a).attr("data-id");
        var idtalla = $("#cbo_var_talla_" + idvar).val();
        var idcolor = $("#cbo_var_color_" + idvar).val();
        var agregarVar = Ladda.create(document.querySelector('#' + id));

        agregarVar.start();
        $.ajax({
            type: 'post',
            url: 'save_data_variacion',
            data: {"id":idvar,"idt": idtalla,"idc":idcolor},
            dataType: 'json',
            success: function(data){
                if(data!==null){
                    uploadMsnSmall(data.msj,data.dato);
                    if(data.dato === 'OK'){
                        RecargarVariaciones($("#idpropadrevar").val(), true);
                    }
                    agregarVar.stop();
                }else{
                    agregarVar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                agregarVar.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var ExportToTable = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        if (regex.test($("#excelfile").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0 ) {
                xlsxflag = true;
            }
            loadExcel.start();
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        var workbook = XLS.read(data, {type: 'binary'});
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    /*This is used for restricting the script to consider only first sheet of excel*/
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        } else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt >= 0) {
                            BindTable(exceljson, '#exceltable', cnt);
                            cnt++;
                        }
                    });
                };
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($("#excelfile")[0].files[0]);
                } else {
                    reader.readAsBinaryString($("#excelfile")[0].files[0]);
                }
            } else {
                loadExcel.stop();
                uploadMsnSmall("Disculpa tu navegador no tiene HTML5.", "ERROR");
            }
        } else {
            loadExcel.stop();
            uploadMsnSmall("Por favor, cargar un excel valido!", "ERROR");
        }
    };

    var ExportToTable3 = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        if (regex.test($("#excelfile3").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile3").val().toLowerCase().indexOf(".xlsx") > 0 ) {
                xlsxflag = true;
            }
            loadExcel3.start();
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        var workbook = XLS.read(data, {type: 'binary'});
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    /*This is used for restricting the script to consider only first sheet of excel*/
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        } else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt >= 0) {
                            BindTable3(exceljson, '#exceltable3', cnt);
                            cnt++;
                        }
                    });
                };
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($("#excelfile3")[0].files[0]);
                } else {
                    reader.readAsBinaryString($("#excelfile3")[0].files[0]);
                }
            } else {
                loadExcel3.stop();
                uploadMsnSmall("Disculpa tu navegador no tiene HTML5.", "ERROR");
            }
        } else {
            loadExcel3.stop();
            uploadMsnSmall("Por favor, cargar un excel valido!", "ERROR");
        }
    };

    var ExportToTable2 = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        if (regex.test($("#excelfile2").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile2").val().toLowerCase().indexOf(".xlsx") > 0 ) {
                xlsxflag = true;
            }
            loadExcel2.start();
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, {type: 'binary'});
                    } else {
                        var workbook = XLS.read(data, {type: 'binary'});
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    /*This is used for restricting the script to consider only first sheet of excel*/
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        } else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt >= 0) {
                            BindTable2(exceljson, '#exceltable2', cnt);
                            cnt++;
                        }
                    });
                };
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($("#excelfile2")[0].files[0]);
                } else {
                    reader.readAsBinaryString($("#excelfile2")[0].files[0]);
                }
            } else {
                loadExcel2.stop();
                uploadMsnSmall("Disculpa tu navegador no tiene HTML5.", "ERROR");
            }
        } else {
            loadExcel2.stop();
            uploadMsnSmall("Por favor, cargar un excel valido!", "ERROR");
        }
    };

    var BindTableHeader = function(jsondata,tableid){
        var columnSet = [];
        for (var i = 0; i < jsondata.length; i++){
            var rowHash = jsondata[i];
            for (var key in rowHash){
                if (rowHash.hasOwnProperty(key)){
                    if ($.inArray(key, columnSet) == -1) { /*Adding each unique column names to a variable array*/
                        if(key !== "SKU PADRE" && key != "DESCRIPCION" && key != "COLOR" && key != "TALLA" ){
                            columnSet.push(key);
                        }
                    }
                }
            }
        }
        return columnSet;
    };

    var BindTableHeader2 = function(jsondata,tableid){
        var columnSet = [];
        for (var i = 0; i < jsondata.length; i++){
            var rowHash = jsondata[i];
            for (var key in rowHash){
                if (rowHash.hasOwnProperty(key)){
                    if ($.inArray(key, columnSet) == -1) { /*Adding each unique column names to a variable array*/
                        if(key !== "CATEGORIA" && key != "MARCA" && key != "NOMBRE" && key != "MODELO" && key != "PRECIO1"
                            && key != "PRECIO2" && key != "PRECIO3" && key != "COLORES" && key != "TALLAS"){
                            columnSet.push(key);
                        }
                    }
                }
            }
        }
        return columnSet;
    };

    var BindTableHeader3 = function(jsondata,tableid){
        var columnSet = [];
        for (var i = 0; i < jsondata.length; i++){
            var rowHash = jsondata[i];
            for (var key in rowHash){
                if (rowHash.hasOwnProperty(key)){
                    if ($.inArray(key, columnSet) == -1) { /*Adding each unique column names to a variable array*/
                        if(key !== "SKU" && key != "PRECIO1" && key != "PRECIO2" && key != "PRECIO3"){
                            columnSet.push(key);
                        }
                    }
                }
            }
        }
        return columnSet;
    };

    var BindTable = function (jsondata, tableid, numHoja) {/*Function used to convert the JSON array to Html Table*/
        var columns = BindTableHeader(jsondata, tableid);
        var espacio_blanco = /\s/;

        listPadre = new Array();
        listDescripcion = new Array();
        listColor = new Array();
        listTalla = new Array();
        listCantidad = new Array();
        listCodUnico = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var skupadre = $.trim(jsondata[i]['SKU PADRE'])+"";
            var nombre = $.trim(jsondata[i]['DESCRIPCION'])+"";
            var color = $.trim(jsondata[i]['COLOR'])+"";
            var talla = $.trim(jsondata[i]['TALLA'])+"";
            //pre1 = pre1.replace(/,/g, '');
            listPadre.push(skupadre);
            listDescripcion.push(nombre);
            listColor.push(color);
            listTalla.push(talla);
        }

        if (listPadre.length > 0) {
            Repositorio.Loading($('div.blockTab'));
            ObtenerSKUPadre(listCodUnico,listCantidad,listPadre);
            CargarProductos();
        }
    };

    var BindTable3 = function (jsondata, tableid, numHoja) {/*Function used to convert the JSON array to Html Table*/
        var columns = BindTableHeader3(jsondata, tableid);
        var espacio_blanco = /\s/;

        listSku = new Array();
        listPrecio1 = new Array();
        listPrecio2 = new Array();
        listPrecio3 = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var sku = $.trim(jsondata[i]['SKU'])+"";
            var precio1 = $.trim(jsondata[i]['PRECIO1'])+"";
            var precio2 = $.trim(jsondata[i]['PRECIO2'])+"";
            var precio3 = $.trim(jsondata[i]['PRECIO3'])+"";

            precio1 = precio1.replace(/,/g, '');
            precio2 = precio2.replace(/,/g, '');
            precio3 = precio3.replace(/,/g, '');

            listSku.push(sku);
            listPrecio1.push(precio1);
            listPrecio2.push(precio2);
            listPrecio3.push(precio3);
        }

        if (listSku.length > 0) {
            Repositorio.Loading($('div.blockTab'));
            CargarNuevosPrecios();
        }
    };

    var BindTable2 = function (jsondata, tableid, numHoja) {/*Function used to convert the JSON array to Html Table*/
        var columns = BindTableHeader2(jsondata, tableid);
        var espacio_blanco = /\s/;

        listCategoria = new Array();
        listMarca = new Array();
        listDescripcion = new Array();
        listModelo = new Array();
        listPrecio1 = new Array();
        listPrecio2 = new Array();
        listPrecio3 = new Array();
        listColor = new Array();
        listTalla = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var categoria = $.trim(jsondata[i]['CATEGORIA'])+"";
            var marca = $.trim(jsondata[i]['MARCA'])+"";
            var nombre = $.trim(jsondata[i]['NOMBRE'])+"";
            var modelo = $.trim(jsondata[i]['MODELO'])+"";
            var color = $.trim(jsondata[i]['COLORES'])+"";
            var talla = $.trim(jsondata[i]['TALLAS'])+"";
            var precio1 = $.trim(jsondata[i]['PRECIO1'])+"";
            var precio2 = $.trim(jsondata[i]['PRECIO2'])+"";
            var precio3 = $.trim(jsondata[i]['PRECIO3'])+"";

            precio1 = precio1.replace(/,/g, '');
            precio2 = precio2.replace(/,/g, '');
            precio3 = precio3.replace(/,/g, '');

            listCategoria.push(categoria);
            listMarca.push(marca);
            listDescripcion.push(nombre);
            listModelo.push(modelo);
            listPrecio1.push(precio1);
            listPrecio2.push(precio2);
            listPrecio3.push(precio3);
            listColor.push(color);
            listTalla.push(talla);
        }

        if (listCategoria.length > 0) {
            Repositorio.Loading($('div.blockTab'));
            CargarNuevosProductos();
        }
    };

    var CargarProductos = function(){
        $.ajax({
            type: 'post',
            url: "load_products_variacion",
            dataType: 'json',
            data:{"listPadre[]":listPadre,"listColor[]":listColor,"listTalla[]":listTalla,"listCodUnico[]":listCodUnico,
                "listCantidad[]":listCantidad},
            success: function (respJson) {
                if(respJson !== null){
                    uploadMsnSmall(respJson.msj,respJson.dato);
                    loadExcel.stop();
                    $("#excelfile").val("");
                    Repositorio.finishRefresh($('div.blockTab'));
                }else{
                    Repositorio.finishRefresh($('div.blockTab'));
                    $("#excelfile").val("");
                    loadExcel.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                Repositorio.finishRefresh($('div.blockTab'));
                $("#excelfile").val("");
                loadExcel.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarNuevosPrecios = function(){
        $.ajax({
            type: 'post',
            url: "load_nuevo_products_precios",
            dataType: 'json',
            data:{"listSku[]":listSku, "listPrecio1[]":listPrecio1,"listPrecio2[]" : listPrecio2,"listPrecio3[]" : listPrecio3},
            success: function (respJson) {
                if(respJson !== null){
                    var rpta = respJson.dato;
                    if(rpta === "OK"){
                        uploadMsnSmall(respJson.msj,respJson.dato);
                        loadExcel3.stop();
                        $("#excelfile3").val("");
                        $("#btnSearch").trigger("click");
                        Repositorio.finishRefresh($('div.blockTab'));
                    } else if(rpta === "ERROR"){
                        Repositorio.finishRefresh($('div.blockTab'));
                        uploadMsnSmall(respJson.msj,respJson.dato);
                        loadExcel3.stop();
                        $("#excelfile3").val("");
                    }
                }else{
                    Repositorio.finishRefresh($('div.blockTab'));
                    $("#excelfile3").val("");
                    loadExcel3.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                Repositorio.finishRefresh($('div.blockTab'));
                $("#excelfile3").val("");
                loadExcel3.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarNuevosProductos = function(){
        $.ajax({
            type: 'post',
            url: "load_nuevo_products",
            dataType: 'json',
            data:{"listCategoria[]":listCategoria,"listMarca[]":listMarca,"listDescripcion[]":listDescripcion,
                "listModelo[]":listModelo, "listPrecio1[]":listPrecio1,"listPrecio2[]" : listPrecio2,
                "listPrecio3[]" : listPrecio3,"listColor[]" : listColor,"listTalla[]" : listTalla
            },
            success: function (respJson) {
                if(respJson !== null){
                    var rpta = respJson.dato;
                    if(rpta === "OK"){
                        var msj2 = respJson.msj2;
                        uploadMsnSmall(respJson.msj,respJson.dato);
                        if(msj2 !== ""){
                            uploadMsnSmall(respJson.msj2,"ALERTA");
                        }
                        loadExcel2.stop();
                        $("#excelfile2").val("");
                        Repositorio.finishRefresh($('div.blockTab'));
                    } else if(rpta === "ERROR"){
                        Repositorio.finishRefresh($('div.blockTab'));
                        uploadMsnSmall(respJson.msj,respJson.dato);
                        loadExcel2.stop();
                        $("#excelfile2").val("");
                    }
                }else{
                    Repositorio.finishRefresh($('div.blockTab'));
                    $("#excelfile2").val("");
                    loadExcel2.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                Repositorio.finishRefresh($('div.blockTab'));
                $("#excelfile2").val("");
                loadExcel2.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var QuitarProductoVariacion = function(a){
        var fila = $(a).parents("tr");
        var codigo = $(fila).find("td").eq(2).html();
        var idv = $(a).attr("data-id");

        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el producto con código "+codigo+" ?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_producto_variacion',
                        data: {"id":idv},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    RecargarVariaciones($("#idpropadrevar").val(), true);
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
        var col = 0;
        if($("#cod_04").val() === "0"){
            $("#div_btn_04").remove();
            col++;
        }
        if($("#cod_05").val() === "0"){
            $("#div_btn_05").remove();
            col++;
        }
        if($("#cod_06").val() === "0"){
            $("#div_btn_06").remove();
            col++;
        }
        if($("#cod_09").val() === "0"){
            $("#div_btn_09").remove();
            col++;
        }
        if(col > 0){
            if(col === 1){
                $("#tit_header").removeClass("col-lg-2 col-md-2 col-sm-2");
                $("#tit_header").addClass("col-lg-4 col-md-4 col-sm-4");
            }else if(col === 2){
                $("#tit_header").removeClass("col-lg-2 col-md-2 col-sm-2");
                $("#tit_header").addClass("col-lg-6 col-md-6 col-sm-6");
            }else if(col === 3){
                $("#tit_header").removeClass("col-lg-2 col-md-2 col-sm-2");
                $("#tit_header").addClass("col-lg-8 col-md-8 col-sm-8");
            }else if(col === 4){
                $("#tit_header").removeClass("col-lg-2 col-md-2 col-sm-2");
                $("#tit_header").addClass("col-lg-10 col-md-10 col-sm-10");
            }
        }
        NumeroEntero($("#minimo"));
        NumeroEntero($("#maximo"));
        NumeroEntero($("#txtCantIns"));
        NumeroDosDecimales($("#precio1"));
        NumeroDosDecimales($("#precio2"));
        NumeroDosDecimales($("#precio3"));
        $("#addBtnCategoria").on("click",new_categoria);
        $("#btnGuardarCategoria").on("click",save_categoria);
        $("#addBtnMarca").on("click",new_marcas);
        $("#btnGuardarMarca").on("click",save_marca);
        $("#btnGuardarColor").on("click",save_color);
        $("#addBtnColor").on("click",new_color);
        $("#btnGuardarTalla").on("click",save_talla);
        $("#addBtnTallas").on("click",new_talla);
        $("#addBtnUnidad").on("click",function () {
            new_unidades();
            $("#tipound").val("V");
        });
        $("#addBtnUnidadCompra").on("click",function () {
            new_unidades();
            $("#tipound").val("C");
        });
        $("#addBtnUnidadAlmacen").on("click",function () {
            new_unidades();
            $("#tipound").val("A");
        });
        $("#btnGuardarUnidad").on("click",save_unidad);
        $("#addBtnCaracteristica").on("click",new_caracteristica);
        $("#btnGuardarMaterial").on("click",save_caracteristica);
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#cboMarca").on("change",function(){ style_error_cbo_final('#cboMarca',false);});
        $("#cboCategoria").on("change",function(){ style_error_cbo_final('#cboCategoria',false);});
        $("#cboUnidad").on("change",function(){ style_error_cbo_final('#cboUnidad',false);});
        $("#cboCaracteristica").on("change",function(){ style_error_cbo_final('#cboCaracteristica',false);});
        $("#cboUndCompra").on("change",function(){ style_error_cbo_final('#cboUndCompra',false);});
        $("#cboUndAlmacen").on("change",function(){ style_error_cbo_final('#cboUndAlmacen',false);});
        keyup_input_general_3("#frmProducto input", "#frmProducto", "#modalProducto");
        $("#cboLiCategoria,#cboLiMarca,#cboLiUnidad,#cboBusEstado,#cboLiAlmacen").on("change",function(){table._fnDraw();});
        $("#cboLiTipo").on("change",function () {
            var cod = $(this).val();
            $.ajax({
                type: 'post',
                url: "load_marca_categoria_xtipo",
                dataType: 'json',
                data:{idpro:cod},
                success: function (respJson) {
                    if(respJson !== null){
                        $("#cboLiMarca").html("<option value='T'>--TODOS--</option>"+respJson.htM);
                        $("#cboLiCategoria").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                        $("#cboLiMarca,#cboLiCategoria").selectpicker('refresh');
                        table._fnDraw();
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $('#chkSku').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkSku(event,$(this));
        });
        $("#modalProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalProducto:visible").each(ModalCompleto);
        });
        $("#cboTipoProducto").on("change",function(){
            var value = $(this).val();
            var listaProp = new Array();
            for(var k=0;k<propiedades.length;k++) {
                if (propiedades[k].tipoProducto.id == value) {
                    listaProp.push(propiedades[k]);
                }
            }
            //VALORES POR DEFECTO
            $("#cboTipoAfectacion").selectpicker('val',"0");
            //////////////////////////////////////////////////
            $("#div-categoria").hide();
            $("#div-marca").hide();
            $("#div-material").hide();
            $("#div-unidad").hide();
            $("#div-und-compra").hide();
            $("#div-und-almacen").hide();
            $("#div-modelo").hide();
            $("#div-minimo").hide();
            $("#div-maximo").hide();
            $("#div-precio1").hide();
            $("#div-precio2").hide();
            $("#div-precio3").hide();
            $("#div-sku").hide();
            $("#div-colores").hide();
            $("#div-tallas").hide();
            $("#div_tipo_afectacion").hide();
            for(var i=0;i<listaProp.length;i++){
                if(listaProp[i].propiedad.nombre === "CATEGORIA"){
                    $("#div-categoria").show();
                }
                if(listaProp[i].propiedad.nombre === "MARCA"){
                    $("#div-marca").show();
                }
                if(listaProp[i].propiedad.nombre === "MATERIAL"){
                    $("#div-material").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO1"){
                    $("#div-precio1").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO2"){
                    $("#div-precio2").show();
                }
                if(listaProp[i].propiedad.nombre === "PRECIO3"){
                    $("#div-precio3").show();
                }
                if(listaProp[i].propiedad.nombre === "MODELO"){
                    $("#div-modelo").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADVENTA"){
                    $("#div-unidad").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADCOMPRA"){
                    $("#div-und-compra").show();
                }
                if(listaProp[i].propiedad.nombre === "UNIDADSTOCK"){
                    $("#div-und-almacen").show();
                }
                if(listaProp[i].propiedad.nombre === "SKU"){
                    $("#div-sku").show();
                }
                if(listaProp[i].propiedad.nombre === "COLOR"){
                    $("#div-colores").show();
                }
                if(listaProp[i].propiedad.nombre === "TALLA"){
                    $("#div-tallas").show();
                }
                if(listaProp[i].propiedad.nombre === "TIPOAFECTACION"){
                    $("#div_tipo_afectacion").show();
                    $("#cboTipoAfectacion").selectpicker('val',listaProp[i].valorDefecto);
                }
            }
            var acc = $("#frmProducto #accion").val();
            if(acc === "save"){
                var cod = $(this).val();
                $.ajax({
                    type: 'post',
                    url: "load_marca_categoria_xtipo",
                    dataType: 'json',
                    data:{idpro:cod},
                    success: function (respJson) {
                        if(respJson !== null){
                            $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                            $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                            $("#cboMarca,#cboCategoria").selectpicker('refresh');
                        }else{
                            uploadMsnSmall('Problemas con el sistema','ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        uploadMsnSmall(jqXHR.responseText,'ERROR');
                    }
                });
            }
        });
        $("#btnOpenModalProducto").on("click",function(){
            $('#modalSearchProducto').modal('show');
            $('#btnSearchModalProducto').trigger('click');
            $('#txtDescProducto').focus();
        });
        $("#btnSearchModalProducto").on("click",function () {
             tableProd._fnDraw();
        });
        $("#cboBuscarProd").on("change",function () {
            $("#txtDescProducto").focus();
        });
        $("#txtDescProducto").on("keyup",function (e) {
            tableProd._fnDraw();
        });
        $("#btnAddInsumo").on("click",function () {
            var prod = $("#namepro").val();
            if(prod !== "") {
                agregar.start();
                $.ajax({
                    type: 'post',
                    url: "add_productoparacombo",
                    dataType: 'json',
                    data: {id: $("#idpropadre").val(), idins: $("#idprocombo").val(), cant : $("#txtCantIns").val(),"idalm":$("#cboComboAlmacen").val()},
                    success: function (respJson) {
                        if (respJson !== null) {
                            if (respJson.dato === "OK") {
                                uploadMsnSmall(respJson.msj,"OK");
                                RecargarInsumos($("#idpropadre").val(), true);
                                $("#namepro,#txtCantIns,#txtUndMed").val("");
                                $("#idprocombo").val("0");
                                agregar.stop();
                            }else if(respJson.dato==="ERROR"){
                                if(respJson.listado.length>0){
                                    for (var i = 0; i < respJson.listado.length; i++) {
                                        if(respJson.listado[i] === "E1"){uploadMsnSmall("Seleccione un Combo.","ALERTA");}
                                        if(respJson.listado[i] === "E2"){uploadMsnSmall("Seleccion un producto para el combo.","ALERTA");}
                                        if(respJson.listado[i] === "E3"){uploadMsnSmall("Cantidad incorrecta.","ALERTA");}
                                    }
                                }else{
                                    uploadMsnSmall(respJson.msj,'ERROR');
                                }
                                agregar.stop();
                            }
                        } else {
                            agregar.stop();
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        agregar.stop();
                        uploadMsnSmall(XMLHttpRequest.responseText, 'ERROR');
                    }
                });
            } else {
                uploadMsnSmall('Seleccione un Producto.', 'ALERTA');
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_productos",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    busqueda = respJson.busqueda;
                    valor = respJson.valor;
                    propiedades = respJson.prop;
                    console.log(propiedades);
                    $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                    $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                    $("#cboUnidad,#cboUndCompra,#cboUndAlmacen").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htSelUni);
                    $("#cboCaracteristica").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htCar);
                    $("#cboLiMarca").html("<option value='T'>--TODOS--</option>"+respJson.htM);
                    $("#cboLiCategoria").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                    $("#cboLiUnidad").html("<option value='T'>--TODOS--</option>"+respJson.htU);
                    $("#cboLiAlmacen,#cboComboAlmacen").html(respJson.htLiAlm);
                    $("#cboLiTipo").html(respJson.htTipProMueve);
                    $("#cboTipoProducto").html(respJson.htTipProMueve);
                    var colores = respJson.colores;
                    var tallas = respJson.tallas;
                    var htSel = "";
                    for(var i=0;i<colores.length;i++){
                        htSel+="<option value='"+colores[i].id+"'>"+colores[i].nombre+"</option>";
                    }
                    $("#cboColores").html(htSel);
                    htSel = "";
                    for(var j=0;j<tallas.length;j++){
                        htSel+="<option value='"+tallas[j].id+"'>"+tallas[j].nombre+"</option>";
                    }
                    $("#cboTallas").html(htSel);
                    $(".selectpicker").selectpicker("refresh");
                    ListProductos();
                    $("#cboTipoProducto").change();
                    ListProductosParaCombo();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#btnCalcular").on("click",function () {
            calcular.start();
            $.ajax({
                type:'post',
                url:"calcular_stock_combo",
                dataType: 'json',
                data:{"idalm":$("#cboComboAlmacen").val(),"idpro":$("#idpropadre").val()},
                success: function (respJson) {
                    if(respJson !== null){
                        calcular.stop();
                        $("#txtStockActual").val(respJson.msj);
                    }else{
                        calcular.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    calcular.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#cboComboAlmacen").on("change",function () {
            RecargarInsumos($("#idpropadre").val(),true);
        });
        $("#frmMarca #desc").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnGuardarMarca").trigger("click");
            }
        });
        $("#frmCategoria #desc").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnGuardarCategoria").trigger("click");
            }
        });
        $("#frmMaterial #descM").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnGuardarMaterial").trigger("click");
            }
        });
        $("#desc_color").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnGuardarColor").trigger("click");
            }
        });
        $("#desc_talla").on("keyup",function (e) {
            if(e.keyCode === 13){
                $("#btnGuardarTalla").trigger("click");
            }
        });
        $("#cboBuscar").on("change",function(){
            $("#txtDesc").focus();
        });
        $("#btnAddVariacion").on("click",function () {
            var prod = $("#nameprovar").val();
            if(prod !== "") {
                agregarVar.start();
                $.ajax({
                    type: 'post',
                    url: "add_producto_variacion",
                    dataType: 'json',
                    data: {id: $("#idpropadrevar").val()},
                    success: function (respJson) {
                        if (respJson !== null) {
                            if (respJson.dato === "OK") {
                                uploadMsnSmall(respJson.msj,"OK");
                                RecargarVariaciones($("#idpropadrevar").val(), true);
                                agregarVar.stop();
                            }else if(respJson.dato==="ERROR"){
                                if(respJson.listado.length>0){
                                    for (var i = 0; i < respJson.listado.length; i++) {
                                        if(respJson.listado[i] === "E1"){uploadMsnSmall("Seleccione un Combo.","ALERTA");}
                                        if(respJson.listado[i] === "E2"){uploadMsnSmall("Seleccion un producto para el combo.","ALERTA");}
                                        if(respJson.listado[i] === "E3"){uploadMsnSmall("Cantidad incorrecta.","ALERTA");}
                                    }
                                }else{
                                    uploadMsnSmall(respJson.msj,'ERROR');
                                }
                                agregarVar.stop();
                            }
                        } else {
                            agregarVar.stop();
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        agregarVar.stop();
                        uploadMsnSmall(XMLHttpRequest.responseText, 'ERROR');
                    }
                });
            } else {
                uploadMsnSmall('Seleccione un Producto.', 'ALERTA');
            }
        });

        $("#btnExcelCSV").on("click",function () {
            Repositorio.Loading($('div.blockTab'));
            exportarCSV.start();
            $.ajax({
                type:'POST',
                url:"saveReportProductos",
                data:{idalm:"0"},
                dataType:'json',
                success: function(respJson){
                    if(respJson.dato=='OK'){
                        window.location.href = 'downloadReportVentas?fileName='+respJson.fileName;
                        Repositorio.finishRefresh($('div.blockTab'));
                        exportarCSV.stop();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato=='VACIO' || respJson.dato=='ERROR'){
                        Repositorio.finishRefresh($('div.blockTab'));
                        exportarCSV.stop();
                        uploadMsnSmall(respJson.msj,(respJson.dato === "VACIO" ? 'ALERTA' : 'ERROR') );
                    }
                },
                error: function (jqXHR, status, error) {
                    Repositorio.finishRefresh($('div.blockTab'));
                    exportarCSV.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });

        $("#btnLoadVariacion").on("click",function(){
           $("#excelfile").trigger("click");
        });
        $("#btnLoadNewProductos").on("click",function(){
            $("#excelfile2").trigger("click");
        });
        $("#btnLoadPrecios").on("click",function(){
            $("#excelfile3").trigger("click");
        });
        $("#excelfile").on("change",function () {
            ExportToTable();
        });
        $("#excelfile2").on("change",function () {
            ExportToTable2();
        });
        $("#excelfile3").on("change",function () {
            ExportToTable3();
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
        view_kardex:function(elem){
            view_kardex(elem);
        },
        view_details:function (a) {
            view_details(a);
        },
        add_record:function(a){
            add_record(a);
        },
        QuitarProductoRelacionado:function (a) {
            QuitarProductoRelacionado(a);
        },
        view_variaciones: function(a){
            view_variaciones(a);
        },
        GuardarCambiosVariacion:function(a){
            GuardarCambiosVariacion(a);
        },
        QuitarProductoVariacion:function(a){
            QuitarProductoVariacion(a);
        }
    };
}();
jQuery(document).ready(function () {
    Producto.init();
});