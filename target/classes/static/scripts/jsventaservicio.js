var Producto = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var categoria = Ladda.create(document.querySelector("#btnGuardarCategoria"));
    var marca = Ladda.create(document.querySelector("#btnGuardarMarca"));
    var unidad = Ladda.create(document.querySelector("#btnGuardarUnidad"));
    var material = Ladda.create(document.querySelector("#btnGuardarMaterial"));
    var agregar = Ladda.create(document.querySelector('#btnAddInsumo'));
    var table;
    var valor = "";
    var propiedades = new Array();
    var idprod = 0;

    var ListProductos = function(){
        table = $("#tblProductos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_producto_ventaservicio",data:function(d){
                d.desc = $("#txtDesc").val();d.tipo = $("#cboLiTipo").val();
                d.idm = $("#cboLiMarca").val();d.idc = $("#cboLiCategoria").val();
                d.idu = $("#cboLiUnidad").val();d.est = $("#cboBusEstado").val();
                d.buspor = $("#cboBuscar").val();d.idtipoprod = $("#cboLiTipoProducto").val();
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
        $.each($("#frmProducto input"),function(){
            $(this).val("");
            estilo_error(false, this);
        });
        $("#imgFoto").html("");
        style_error_cbo_final("#frmProducto #estado",false);
        style_error_cbo_final("#frmProducto #cboMarca",false);
        style_error_cbo_final("#frmProducto #cboCategoria",false);
        style_error_cbo_final("#frmProducto #cboUnidad",false);
        style_error_cbo_final("#frmProducto #cboCaracteristica",false);
        style_error_cbo_final("#frmProducto #cboUndCompra",false);
        style_error_cbo_final("#frmProducto #cboUndAlmacen",false);
    };

    var Limpiar_Categoria = function(){
        $.each($("#frmCategoria input"), function () {
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
        Limpiar();
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
        $("#minimo").val("1");
        $("#maximo").val("5");
        $("#cboTipoProducto").change();
        $("#frmProducto #estado").selectpicker('val','H');
        $("#chkSku").prop("checked",false);
        $("#chkSku").val("0");
        $("#chkSku").iCheck('update');
        $("#sku").attr("readonly","readonly");
        $("#modalProducto").modal("show");
    };

    var save = function(){
        cargando.start();
        var datos = new FormData($("#frmProducto")[0]);
        /*datos.append('accion',$("#frmProducto #accion").val());
        datos.append('id',$("#frmProducto #id").val());
        datos.append('cboTipoProducto',$("#cboTipoProducto").val());
        datos.append('cboCategoria',$("#cboCategoria").val());
        datos.append('cboMarca',$("#cboMarca").val());
        datos.append('cboUnidad',$("#cboUnidad").val());
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
       /// datos.append('sku',$("#sku").val());
        datos.append('cadtalla',"");
        datos.append('cadcolor',"");
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
                        $("#cboLiTipoProducto").selectpicker('val',$("#cboTipoProducto").val());
                        $("#modalProducto").modal("hide");
                        cargando.stop();
                        uploadMsnSmall(respJson.msj,'OK');
                        var descat = "";
                        var desmar = "";
                        var desmat = "";
                        var desnom = "";
                        if( $("#cboCategoria").val() !== "0" ){
                            descat = $('option:selected',$("#cboCategoria")).text()+ " ";
                        }
                        if( $("#cboMarca").val() !== "0" ){
                            desmar = $('option:selected',$("#cboMarca")).text()+ " ";
                        }
                        if( $('#frmProducto #desc').val() !== "" ){
                            desnom = $('#frmProducto #desc').val()+ " ";
                        }
                        if( $("#cboCaracteristica").val() !== "0" ){
                            desmat = $('option:selected',$("#cboCaracteristica")).text();
                        }
                        var texto = descat+desmar+desnom+desmat;
                        $("#txtDesc").val(texto);
                        reiniciar("bararchivo");
                        $("#txtDesc").focus();
                        table._fnDraw();
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
        Limpiar();
        $.ajax({
            type: 'post',
            url: "view_producto",
            dataType: 'json',
            data:{id:$(elem).attr("id").split("_")[2]},
            success:function(respJson){
                if(respJson!==null){
                    $("#cboTipoProducto").selectpicker('val',respJson.oTipoProducto.id);
                    $("#cboTipoProducto").change();
                    $("#frmProducto #div-estado").show();
                    $("#imgFoto").html(respJson.rutaImagen !==null?"<img src='resources/images/"+respJson.rutaImagen+"' width='200px;' />":"");
                    $("#frmProducto #id").val(respJson.id);
                    $("#frmProducto #desc").val(respJson.nombre);
                    $("#minimo").val(Redondear2(respJson.stockMinimo));
                    $("#maximo").val(Redondear2(respJson.stockMaximo));
                    $("#modelo").val(respJson.modelo);
                    $("#precio1").val(Redondear2(respJson.precioMenor1));
                    $("#precio2").val(Redondear2(respJson.precioInter2));
                    $("#precio3").val(Redondear2(respJson.precioMayor3));
                    $("#cboCaracteristica").selectpicker('val',respJson.caracteristica1 !== null ? respJson.caracteristica1.id : "0");
                    $("#cboMarca").selectpicker('val',respJson.otbMarca!==null ? respJson.otbMarca.id : "0");
                    $("#cboCategoria").selectpicker('val',respJson.otbCategoria!==null?respJson.otbCategoria.id:"0");
                    $("#cboUnidad").selectpicker('val',respJson.otbUnidad != null ? respJson.otbUnidad.id : "0");
                    $("#cboUndCompra").selectpicker('val',respJson.unidadCompra!==null ? respJson.unidadCompra.id : "0");
                    $("#cboUndAlmacen").selectpicker('val',respJson.unidadStock!==null ? respJson.unidadStock.id : "0");
                    $("#frmProducto #estado").selectpicker('val',respJson.estado);
                    $("#sku").val(respJson.barcodeProducto);
                    $("#chkSku").prop("checked",true);
                    $("#chkSku").val("1");
                    $("#chkSku").iCheck('update');
                    $("#titulo").html("Modificar Producto");
                    $("#frmProducto #accion").val("update");
                    $("#modalProducto").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
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
            data:$("#frmCategoria").serialize()+"&estado=H&accion=save",
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
            data:$("#frmMarca").serialize()+"&estado=H&accion=save",
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
            data:$("#frmUnidad").serialize()+"&estado=H&accion=save",
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
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Estado incorrecto.",'ALERTA');}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#desc");uploadMsnSmall("EL Nombre de Unidad de Medida debe de ser menos de 30 caracteres.",'ALERTA');}
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
                        data: {"id":$(elem).attr("id").split("_")[2]},
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

    var ReloadMarcas = function(){
        $.ajax({
            type: 'post',
            url: "select_marca",
            dataType: 'json',
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
                    $("#cboUnidad").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htU);
                    $("#cboLiUnidad").html("<option value='T'>--TODOS--</option>"+respJson.htU);
                    $("#cboUnidad,#cboLiUnidad").selectpicker("refresh");
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
        var parameters = "idpro="+$(a).attr("id")+"&idalm="+$("#cboLiAlmacen").val();
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

    var ViewIngredientes = function (a) {
        idprod = $(a).attr("id").split("_")[2];
        RecargarInsumos(idprod, false);
    };

    var RecargarInsumos = function(idproducto,isOpening){
        $.ajax({
            type: 'post',
            url: "list_insumoxproducto",
            dataType: 'json',
            data:{id:idproducto},
            success:function(respJson){
                if(respJson!==null){
                    var listado = respJson.listado;
                    var html = "";
                    for(var k=0;k<listado.length;k++) {
                        html += "<tr >";
                        html += "<td style='width:7%;' class='text-center' >"+(k+1)+"</td>";
                        html += "<td style='width:10%;' class='text-left' >"+listado[k].insumo.codigo+"</td>";
                        html += "<td style='width:43%;' class='text-left' >"+listado[k].insumo.nombre+"</td>";
                        html += "<td style='width:12%;' class='text-center' >"+listado[k].cantidad+"</td>";
                        html += "<td style='width:16%;' class='text-center' >"+listado[k].unidadMedida.nombre+"</td>";
                        var del="<button  type='button' data-toggle='tooltip' data-placement='right' data-id='"+listado[k].id+"' data-producto='"+listado[k].producto.Id+"' data-insumo='"+listado[k].insumo.id+"' data-style='zoom-in'  data-spinner-size='30'   title = 'Quitar Insumo' onclick='Producto.QuitarInsumo(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger ladda-button delActivo' > <span class='ladda-label'> <i class='glyphicon glyphicon-trash'></i> </span> </button>";
                        html += "<td style='width:12%;' class='text-center' >"+del+"</td>";
                        html += "</tr>";
                    }
                    $("#listado").html(html);
                    $(".delActivo").tooltip();
                    if(!isOpening){$("#ViewIngredientes").modal("show");}
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var QuitarInsumo = function (a) {
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea quitar el Insumo?</strong>",
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
                                    RecargarInsumos($(a).attr("data-producto"), true);
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
        NumeroEntero($("#minimo"));
        NumeroEntero($("#maximo"));
        NumeroDosDecimales($("#precio1"));
        NumeroDosDecimales($("#precio2"));
        NumeroDosDecimales($("#precio3"));
        $("#addBtnCategoria").on("click",new_categoria);
        $("#btnGuardarCategoria").on("click",save_categoria);
        $("#addBtnMarca").on("click",new_marcas);
        $("#btnGuardarMarca").on("click",save_marca);
        $("#addBtnUnidad").on("click",new_unidades);
        $("#btnGuardarUnidad").on("click",save_unidad);
        $("#addBtnCaracteristica").on("click",new_caracteristica);
        $("#btnGuardarMaterial").on("click",save_caracteristica);
        $("#btnNuevo").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#cboLiTipoProducto").on("change",function () {table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){ style_error_cbo_final('#estado',false);});
        $("#cboMarca").on("change",function(){ style_error_cbo_final('#cboMarca',false);});
        $("#cboCategoria").on("change",function(){ style_error_cbo_final('#cboCategoria',false);});
        $("#cboUnidad").on("change",function(){ style_error_cbo_final('#cboUnidad',false);});
        $("#cboUndCompra").on("change",function(){ style_error_cbo_final('#cboUndCompra',false);});
        $("#cboUndAlmacen").on("change",function(){ style_error_cbo_final('#cboUndAlmacen',false);});
        $("#cboCaracteristica").on("change",function(){ style_error_cbo_final('#cboCaracteristica',false);});
        keyup_input_general_3("#frmProducto input", "#frmProducto", "#modalProducto");
        $("#cboLiCategoria,#cboLiMarca,#cboLiUnidad,#cboLiTipo,#cboBusEstado,#cboLiAlmacen").on("change",function(){table._fnDraw();});
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
            for(var k=0;k<propiedades.length;k++){
                if(propiedades[k].tipoProducto.id == value){
                    listaProp.push(propiedades[k]);
                }
            }
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
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_venta_servicio",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    valor = respJson.valor;//valor unidad
                    propiedades = respJson.prop;
                    $("#cboMarca").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htM);
                    $("#cboCategoria").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htC);
                    $("#cboUnidad,#cboUndCompra,#cboUndAlmacen").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htSelUni);
                    $("#cboUnidadConsumo").html(respJson.htU);
                    $("#cboCaracteristica").html("<option value='0'>--SELECCIONAR--</option>"+respJson.htCar);
                    $("#cboLiMarca").html("<option value='T'>--TODOS--</option>"+respJson.htM);
                    $("#cboLiCategoria").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                    $("#cboLiUnidad").html("<option value='T'>--TODOS--</option>"+respJson.htU);
                    $("#cboLiAlmacen").html("<option value='0'>--SELECCIONE--</option>");
                    $("#cboLiTipoProducto,#cboTipoProducto").html(respJson.htTipPro);
                    $("#cboLiInsumos").html(respJson.htProd);
                    $(".selectpicker").selectpicker("refresh");
                    ListProductos();
                    $("#cboTipoProducto").change();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#cboLiInsumos").on("change",function(){
            var val = $('option:selected', $(this)).attr('data-und');
            $.ajax({
                type: 'post',
                url: "select_factor_unidad",
                dataType: 'json',
                data:{"id":val},
                success: function (respJson) {
                    if(respJson !== null){
                        var lista = respJson.factores;
                        var html = "";
                        for(var i=0;i<lista.length;i++){
                            html+="<option data-cant='"+lista[i].factorUnidad+"' value='"+lista[i].unidadDestino.id+"'>"+lista[i].unidadDestino.nombre+"</option>";
                        }
                        $("#cboUnidadConsumo").html(html);
                        $("#cboUnidadConsumo").selectpicker("refresh");
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#cboUnidadConsumo").on("change",function () {
            var cant = $('option:selected', $(this)).attr('data-cant');
            $("#txtCantIns").val(cant);
        });
        $("#btnAddInsumo").on("click",function () {
            var act = $("#cboLiInsumos").val();
            if(act !== "") {
                agregar.start();
                $.ajax({
                    type: 'post',
                    url: "add_insumoxproducto",
                    dataType: 'json',
                    data: {id: idprod, idins: $("#cboLiInsumos").val(), idunddes : $("#cboUnidadConsumo").val(), cant : $("#txtCantIns").val()},
                    success: function (respJson) {
                        if (respJson !== null) {
                            uploadMsnSmall(respJson.msj, respJson.dato);
                            if (respJson.dato === "OK") {
                                $("#cboLiInsumos").selectpicker('val','');
                                RecargarInsumos(idprod, true);
                            }
                            agregar.stop();
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
                uploadMsnSmall('Seleccione un Insumo.', 'ALERTA');
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
        },
        view_kardex:function(elem){
            view_kardex(elem);
        },
        ViewIngredientes:function (a) {
            ViewIngredientes(a);
        },
        QuitarInsumo:function (a) {
            QuitarInsumo(a);
        }
    };
}();
jQuery(document).ready(function () {
    Producto.init();
});