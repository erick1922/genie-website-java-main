var jsDatos = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var mesAct = moment().format("MM");
    var anioAct = moment().format('YYYY');
    var cargando = Ladda.create(document.querySelector('#btnGuardar'));
    var cierre = Ladda.create(document.querySelector('#btnCierreCuota'));
    var table;

    var ListMetas = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_metas",data:function(d){d.fecini = $("#busfecini").val();
                d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.tipmeta = $("#cboTipo").val();
            }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'sClass':"text-right",'aTargets': [4,5,6]},
                {'sClass':"centrador",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var Limpiar = function(){
        $.each($("#frmMeta input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        $('#div-fecmeta').datepicker('update',fecAct);
    };

    var new_record = function(){
        Limpiar();
        $("#titulo").html("Registrar Meta");
        var opt = $('option:selected', $("#cboLiSuPedido")).text();
        $("#txtSucu").val(opt);
        $("#ids").val($("#cboLiSuPedido").val());
        $("#tipo").selectpicker('val','D');
        $("#anioMeta").selectpicker('val',anioAct);
        $("#mesMeta").selectpicker('val',parseInt(mesAct));
        $("#div-fecha").css("display","block");
        $("#div-mes").css("display","none");
        $("#div-anio").css("display","none");
        $("#accion").val("save");
        $("#modalMeta").modal("show");
    };

    var save = function(){
        var tipo = $("#tipo").val();
        var fecini = $("#fecmeta").val();
        var fecfin = "";
        var mes = $("#mesMeta").val();
        var anio = $("#anioMeta").val();
        if(tipo === "M"){
            if( mes.length === 1 ){mes = "0"+mes;}
            fecini = "01-"+mes+"-"+anio;
            var diasxmes = moment(mes+"-"+anio,"MM-YYYY").daysInMonth();
            fecfin = (moment(fecini,'DD-MM-YYYY').add( (diasxmes-1) ,'days')).format("DD-MM-YYYY");
        }else if(tipo === "D"){
            var fecmeta = moment(fecini,'DD-MM-YYYY');
            mes = fecmeta.format('MM');
            anio = fecmeta.format('YYYY');
            fecfin = fecini;
        }else if(tipo === "S"){
            var fecmeta = moment(fecini,'DD-MM-YYYY');
            mes = fecmeta.format('MM');
            anio = fecmeta.format('YYYY');
            fecmeta.add(6,'days');
            fecfin = fecmeta.format('DD-MM-YYYY');
        }
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_meta",
            dataType: 'json',
            data:$("#frmMeta").serialize()+"&fecmes="+fecini+"&fecfin="+fecfin+"&mes="+mes+"&anio="+anio,
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalMeta").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Usuario Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("Monto Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Bono Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E5"){uploadMsnSmall("Fecha Incorrecta.","ALERTA");}
                                if(respJson.listado[i] === "E6"){uploadMsnSmall("Tipo de Meta Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E7"){uploadMsnSmall("Mes de Meta Incorrecto.","ALERTA");}
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
            url: "view_meta",
            dataType: 'json',
            data:{id:$(elem).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(respJson.id);
                    $("#titulo").html("Modificar Meta");
                    $("#txtSucu").val(respJson.otbSucursal.nombre);
                    $("#ids").val(respJson.otbSucursal.id);
                    $("#accion").val("update");
                    $("#tipo").selectpicker('val',respJson.tipoMeta);
                    $("#tipo").change();
                    $("#anioMeta").selectpicker('val',respJson.anioMeta);
                    $("#mesMeta").selectpicker('val',respJson.mesMeta);
                    $("#monto").val(respJson.montoMeta);
                    $("#bono").val(respJson.bonoMeta);
                    var fecmeta = moment(respJson.fecha).format('DD-MM-YYYY');
                    $('#div-fecmeta').datepicker('update',fecmeta);
                    $("#modalMeta").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var CerrarMeta = function(){///OFICIAL ESTE ES
        cierre.start();
        $.ajax({
            type: 'POST',
            url: "cierre_meta",
            dataType: 'json',
            data : {id:$("#id").val(),monto:$("#proymonto").val(),bono:$("#proybono").val()},
            success: function(data){
                if(data !== null){
                    if(data.dato === "OK"){
                        table._fnDraw();
                        uploadMsnSmall(data.msj,'OK');
                        $("#mdlProyeccion").modal("hide");
                        cierre.stop();
                    }else if(data.dato === "ERROR"){
                        if(data.listado.length>0){
                            for (var i = 0; i < data.listado.length; i++) {
                                if(data.listado[i] === "E1"){uploadMsnSmall("Pedido no Encontrado.",'ALERTA');}
                                if(data.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecta.",'ALERTA');}
                                if(data.listado[i] === "E3"){uploadMsnSmall("Monto Bono incorrecto.",'ALERTA');}
                            }
                        }else{
                            uploadMsnSmall(data.msj,data.dato);
                        }
                        cierre.stop();
                    }
                }else{
                    cierre.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                cierre.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var viewProyeccion = function(a){
        var id = $(a).attr("id");
        var fec = $(a).attr("data-fec");
        var mont = $(a).attr("data-mon");
        var bono = $(a).attr("data-bono");
        $.ajax({
            type: 'post',
            url: "view_ventaxfecha",
            dataType: 'json',
            data:{fec:fec,ids:$(a).attr("data-suc"),id:id},
            success:function(respJson){
                if(respJson!==null){
                    $("#id").val(id);
                    $("#proyfecha").val(fec);
                    $("#proymonto").val(mont);
                    $("#proybono").val(bono);
                    $("#proyventa").val(respJson.objeto);
                    $("#mdlProyeccion").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea Eliminar la Meta?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    $.ajax({
                        type: 'post',
                        url: 'delete_meta',
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

    var viewDetails = function(a){
        $.ajax({
            type: 'post',
            url: "view_avance_meta",
            dataType: 'json',
            data:{id:$(a).attr("id")},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato === "OK") {
                        $("#verfec").val(respJson.fec);
                        $("#versuc").val(respJson.suc);
                        $("#vertipmeta").val(respJson.tip === "D" ? "DIARIA":(respJson.tip === "M" ? "MENSUAL" : "SEMANAL"));
                        $("#verbono").val(Redondear2(respJson.bono));
                        $("#vermeta").val(Redondear2(respJson.monto));
                        $("#vermontot").val(Redondear2(respJson.venta));
                        $("#porcavance").val( (parseFloat(respJson.venta) === 0 ? "0.00" :Redondear2(parseFloat(respJson.venta)*100/parseFloat(respJson.monto))) +"%" );
                        var html = "";
                        for (var i = 0; i < respJson.lista.length; i++){
                            var deta = respJson.lista[i];
                            html+="<tr>";
                            html+="<td class='text-center'>"+(i+1)+"</td>";
                            html+="<td class='text-center'>"+deta[1]+"</td>";
                            html+="<td>"+deta[2]+"</td>";
                            html+="<td class='text-right'>"+Redondear2(deta[3])+"</td>";
                            html+="</tr>";
                        }
                        $("#listado").html(html);
                        $("#viewMeta").modal("show");
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

    var imprimir_metas = function () {
        var opt = $('option:selected', $("#cboLiSucursal")).text();
        var method = "downloadMeta";
        var parameters = "fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val() + "&idsuc="+$("#cboLiSucursal").val()+"&idusu="+$("#cboLiUsuario").val()+"&tipo="+$("#cboTipo").val()+"&nom="+opt;
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#fecmeta").val(fecAct);
        FormatoFechas($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFechas($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFechas($("#div-fecmeta"),"dd-mm-yyyy");
        NumeroDosDecimales($("#monto"));
        NumeroDosDecimales($("#bono"));
        NumeroDosDecimales($("#proymonto"));
        NumeroDosDecimales($("#proybono"));
        NumeroDosDecimales($("#proyventa"));
        $("#tipo").on("change",function () {
            var val = $(this).val();
            $("#div-mes").css("display",val === "M" ? "block" : "none");
            $("#div-anio").css("display",val === "M" ? "block" : "none");
            $("#div-fecha").css("display",val === "M" ? "none" : "block");
        });
        $("#cboLiSucursal,#cboLiUsuario,#cboLiEstado,#cboTipo").on("change",function(){ table._fnDraw(); });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#btnNewMeta").on("click",new_record);
        $("#btnGuardar").on("click",save);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#btnCierreCuota").on("click",CerrarMeta);
        $("#btnPrint").on("click",imprimir_metas);
        keyup_input_general_3("#frmMeta input", "#frmMeta", "#modalMeta");
        $.ajax({
            type: 'post',
            url: "mant_metas",
            dataType: 'json',
            success: function (respJson) {
                if (respJson !== null) {
                    var anioAct = parseInt(moment().format("YYYY"));
                    $("#cboLiSuPedido").html(respJson.htS);
                    $("#cboLiSucursal").html( (respJson.usu === "1" ? "<option value='0'>--TODOS--</option>" : "")+respJson.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+respJson.htU);
                    var anios = respJson.htAnios;
                    var htAnios = "";
                    var exiAnio = "0";
                    for(var i=0;i<anios.length;i++){
                        htAnios+="<option value='"+anios[i]+"'>"+anios[i]+"</option>";
                        if(anioAct === parseInt(anios[i])){
                            exiAnio = "1";
                        }
                    }
                    if(exiAnio === "0"){
                        htAnios+="<option value='"+anioAct+"'>"+anioAct+"</option>";
                    }
                    $("#anioMeta").html(htAnios);
                    $(".selectpicker").selectpicker("refresh");
                    ListMetas();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $(document).keydown(function(event){
            if(event.which == 112){ //F1
                if(!cargando.isLoading()){
                    new_record();
                    return false;
                }
            }
            if(event.which == 114){ //F3
                if( $('#modalMeta').hasClass('in')){
                    if(!cargando.isLoading()){
                        $("#btnGuardar").trigger("click");
                        return false;
                    }
                }
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
        Cancelar:function(elem){
            Cancelar(elem);
        },
        viewDetails:function(a){
            viewDetails(a);
        },
        viewProyeccion:function(a){
            viewProyeccion(a);
        }
    };
}();
jQuery(document).ready(function () {
    jsDatos.init();
});