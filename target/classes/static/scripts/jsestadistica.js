var Estadistica = function(){
    var flujocaja = Ladda.create(document.querySelector('#btnFlujoCaja'));
    var anioAct = moment().format('YYYY');
    var mesAct = moment().format('MM');
    var chartVD = null;
    var chartVM = null;
    var dataV_VD = [];
    var dataP_VD = [];
    var dataV_VM = [];
    var dataP_VM = [];
    var tableCM = null;
    var tableProducto = null;

    var ListarsearchPro = function(){
        tableProducto = $("#tblProducto").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_productos_reporte",data:function(d){
                    d.desc = $("#txtDescProducto").val();d.tipo = $("#cboLiTipoProd").val();
                    d.buspor = $("#cboBuscar").val();d.tipoprod = $("#cboLiTipoProducto").val()}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"text-right",'aTargets': [3,4,5]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var CargarGrafico = function(){
        var montos = [];
        var datos = [];
        $.ajax({
            type: 'post',
            url: "report_estadistico",
            data: {idsuc:$("#cboLiSucursal").val(),anio:$("#cboLiAnio").val(),mes:$("#cboLiMes").val(),tiporep:$("#cboLiTipo").val()},
            dataType: 'json',
            success: function (respJson){console.log(respJson);
                if (respJson !== null) {
                    montos = respJson.montos;
                    datos.push({"name":"MONTO TOTAL","type":"bar","data":montos});
                    var myChart = echarts.init(document.getElementById("echarts_bar"));
                        option = null;
                        option = {
                           // title:{
                            //    text:'Reporte de Ingresos'
                            //},
                            tooltip: {
                                show: true//,
                                //trigger: 'axis'
                            },
                            toolbox: {
                                show : true,
                                x: 'left',
                                feature : {
                                    //mark : {show: true},
                                    //dataView : {show: true, readOnly: false},
                                   // magicType : {show: true, type: ['line', 'bar']},
                                    restore : {show: true},
                                    saveAsImage : {show: true}
                                }
                            },
                            grid: {
                                left: '3333%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            //calculable : true,
                           // renderer : 'canvas',
                            //legend: {
                            //    data:['TOTAL SOLES MENSUAL']
                           // },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"] //["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"]
                                }
                            ],
                            yAxis : [
                                {type : 'value',splitArea : {show : true}}
                            ],
                            series : datos
                        };
                    myChart.setOption(option, true);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarVentaDiaria = function(){
        $.ajax({
            type: 'post',
            url: "report_ventadiaria",
            data: {idsuc:$("#cboSucursalVD").val(),anio:$("#cboLiAnioVD").val(),mes:$("#cboLiMesVD").val(),idcat:$("#cboLiCategoriaVD").val(),idmar:$("#cboLiMarcaVD").val()},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null) {
                    dataV_VD = respJson.montos;
                    dataP_VD = respJson.productos;
                    var barData = {
                        labels: respJson.colums,
                        datasets: [{
                            label: "Venta",
                            backgroundColor: 'rgba(26,179,148,0.5)',
                            borderColor: "rgba(26,179,148,1)",
                            borderWidth: 2,
                            data: dataV_VD
                        }]
                    };
                    if(chartVD!=null){
                        chartVD.destroy();
                    }
                    chartVD = new Chart(document.getElementById("chartVD").getContext("2d"), {
                        type: 'bar',
                        data: barData,
                        options:{
                            legend: {display: false},
                            responsive: true,
                            tooltips: {
                                intersect: true,
                                callbacks: {
                                    title: function(tooltipItems, data) {
                                        return "Dia "+tooltipItems[0].xLabel;
                                    },
                                    footer: function(tooltipItems, data) {
                                        return "Articulos: " + dataP_VD[tooltipItems[0].xLabel - 1];
                                    }
                                }
                            }
                        }
                    });
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarVentaMensual = function(){
        $.ajax({
            type: 'post',
            url: "report_ventamensual",
            data: {idsuc:$("#cboSucursalVM").val(),anio:$("#cboLiAnioVM").val(),idcat:$("#cboLiCategoriaVM").val(),idmar:$("#cboLiMarcaVM").val()},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null) {
                    dataV_VM = respJson.montos;
                    dataP_VM = respJson.productos;
                    var barData = {
                        labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Set","Oct","Nov","Dic"],
                        datasets: [{
                            label: "Venta",
                            backgroundColor: 'rgba(26,179,148,0.5)',
                            borderColor: "rgba(26,179,148,1)",
                            borderWidth: 2,
                            data: dataV_VM
                        }]
                    };
                    if(chartVM!=null){
                        chartVM.destroy();
                    }
                    chartVM = new Chart(document.getElementById("chartVM").getContext("2d"), {
                        type: 'bar',
                        data: barData,
                        options:{
                            legend: {display: false},
                            responsive: true,
                            tooltips: {
                                intersect: true,
                                callbacks: {
                                    title: function(tooltipItems, data) {
                                        return "Mes: "+RetornarNombreMesxAbre(tooltipItems[0].xLabel);
                                    },
                                    footer: function(tooltipItems, data) {
                                        return "Articulos: " + dataP_VM[RetornarNumeroMesxAbr(tooltipItems[0].xLabel)];
                                    }
                                }
                            }
                        }
                    });
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var CargarReporteGeneral = function () {
        var method = "downloadReporteGeneral";
        var parameters = "anio="+$("#cboLiAnioRG").val()+"&mes="+$("#cboLiMesRG").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var CargarComprasxMes = function () {
        var method = "downloadReporteCompraxMes";
        var parameters = "anio="+$("#cboLiAnioCM").val()+"&mes="+$("#cboLiMesCM").val()+"&idalm="+$("#cboAlmacenCM").val()+"&idcat="+$("#cboLiCategoriaCM").val()+"&idmar="+$("#cboLiMarcaCM").val()+"&idprod="+$("#iddetpro").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var addProducto = function(a){
        $("#div-btn-producto").show();
        $("#iddetpro").val($(a).attr("data-id"));
        $("#namepro").val($(a).attr("data-name"));
        $("#modalSearchProducto").modal("hide");
    };

    var viewImageProducto = function (elem) {
        $("#titImagen").text($(elem).attr("data-codigo")+": "+$(elem).attr("data-name"));
        if($(elem).attr("data-id") !== ""){
            $("#viewProductoImagen").html("<img src='resources/images/"+$(elem).attr("data-id")+"' width='500px;'/>");
        }else{
            $("#viewProductoImagen").html("NO TIENE IMAGEN.");
        }
        $("#modalViewImage").modal("show");
    };

    var CerrarPeriodoContable = function(a){
        var btnViewDeta =  Ladda.create(document.querySelector('#' + $(a).attr("id") ));
        btnViewDeta.start();
        var idc = $(a).attr("id").split("_")[2];
        var fecha = moment().format('DD-MM-YYYY');
        var fecultimo=moment().endOf('month').format('DD-MM-YYYY');
        console.log(fecultimo);
        console.log(fecha);
        var anio = $(a).attr("data-anio");
        var mes = $(a).attr("data-mes");
        var idsuc = $(a).attr("data-suc");
        $.ajax({
            type: 'post',
            url: 'close_periodo_contable',
            dataType: 'json',
            data:{idc:idc,idsuc:idsuc,fec:fecha,anio:anio,mes:mes,fecultimo:fecultimo},
            success:function(respJson){
                console.log(respJson);
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        $("#cboSucursalFC").change();
                        uploadMsnSmall(respJson.msj,'OK');
                        btnViewDeta.stop();
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++){
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("Cliente Incorrecto.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("Sucursal Incorrecto.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        btnViewDeta.stop();
                    }
                }else{
                    btnViewDeta.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                btnViewDeta.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#btnSearch").on("click",CargarGrafico);
        $("#btnPrintVD").on("click",CargarVentaDiaria);
        $("#btnPrintVM").on("click",CargarVentaMensual);
        $("#cboLiMesVD,#cboLiMesRG,#cboLiMesCM").selectpicker('val',mesAct);
        $("#btnSearchModalProducto").on("click",function(){tableProducto._fnDraw();});
        $("#btnGeneral").on("click",CargarReporteGeneral);
        $("#vistaCM").on("click",CargarComprasxMes);
        $("#div-btn-producto").hide();
        $("#btnDelProducto").on("click",function () {
            $("#iddetpro").val("0");
            $("#namepro").val("");
            $("#div-btn-producto").hide();
        });
        $("#vistaVD").on("click",function(){
            var method = "download_venxdia";
            var parameters = "anio="+$("#cboLiAnioVD").val()+"&mes="+$("#cboLiMesVD").val()+"&idsuc="+$("#cboSucursalVD").val()+"&idcat="+$("#cboLiCategoriaVD").val()+"&idmar="+$("#cboLiMarcaVD").val();
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });
        $("#btnPrintCM").on("click",function(){
            if(tableCM !== null){
                tableCM._fnDraw();
            }else {
                tableCM = $("#tblProductosCM").dataTable({
                    "bFilter": false,
                    "bSort": false,
                    responsive: true,
                    dom: '<"html5buttons"B>lTfgitp',
                    buttons: [
                        {extend: 'copy'},
                        {extend: 'excel', title: 'Reporte Lista de Productos'},
                        {extend: 'pdf', title: 'Reporte Lista de Productos'}
                    ],
                    "bLengthChange": false,
                    "processing": true,
                    "bServerSide": true,
                    "bAutoWidth": false,
                    "bPaginate": false,
                    "bInfo": false,
                    "ajax": {
                        type: 'POST', url: "list_cm", data: function (d) {
                            d.idcat = $("#cboLiCategoriaCM").val();
                            d.idmar = $("#cboLiMarcaCM").val();
                            d.idalm = $("#cboAlmacenCM").val();
                            d.mes = $("#cboLiMesCM").val();
                            d.anio = $("#cboLiAnioCM").val();
                            d.idpro = $("#iddetpro").val();
                        }
                    },
                    "aoColumnDefs": [
                        {'sClass': "centrado", 'aTargets': [0, 1, 2]},
                        {'sClass': "text-right", 'aTargets': [4]}
                    ],
                    "fnDrawCallback": function (oSettings) {
                        // $(".mensa").tooltip();
                    }
                });
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_estadistica",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboLiSucursal,#cboSucursalVD,#cboSucursalVM,#cboLiSucursalRG").html("<option value='0'>--TODOS--</option>"+respJson.htLiSuc);
                    $("#cboSucursalFC").html("<option value='0'>--TODOS--</option>"+respJson.htLiSuc);
                    $("#cboLiCategoriaVD,#cboLiCategoriaVM").html("<option value='0'>--TODOS--</option>"+respJson.htC);
                    $("#cboLiMarcaVD,#cboLiMarcaVM").html("<option value='0'>--TODOS--</option>"+respJson.htM);
                    $("#cboAlmacenCM").html(respJson.htA);
                    $("#cboLiTipoProducto").html(respJson.htTipPro);
                    var anios = respJson.htAnios;
                    var htAnios = "";
                    for(var i=0;i<anios.length;i++){
                        htAnios+="<option value='"+anios[i]+"'>"+anios[i]+"</option>";
                    }
                    $("#cboLiAnio,#cboLiAnioVM,#cboLiAnioVD,#cboLiAnioRG,#cboLiAnioCM,#cboAnioFC").html(htAnios);
                    $(".selectpicker").selectpicker("refresh");
                    $("#cboLiAnio,#cboLiAnioVM,#cboLiAnioVD,#cboLiAnioRG,#cboLiAnioCM,#cboAnioFC").selectpicker("val",anioAct);
                    ListarsearchPro();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#modalSearchProducto").on("shown.bs.modal", ModalCompleto);
        $(window).on("resize", function(){
            $("#modalSearchProducto:visible").each(ModalCompleto);
        });
        $("#cboLiTipoProducto").on("change",function () {
            $("#btnSearchModalProducto").trigger("click");
        });
        $("#cboBuscar").on("change",function () {
            $("#btnSearchModalProducto").trigger("click");
        });
        $("#txtDescProducto").on("keyup",function(e){
            if(e.keyCode === 13){
                $("#btnSearchModalProducto").trigger("click");
            }
        });
        $("#btnFlujoCaja").on("click",function(){
            flujocaja.start();
            $.ajax({
                type: 'post',
                url: "listar_registros_cierre",
                dataType: 'json',
                data:{idsuc:$("#cboSucursalFC").val(),anio:$("#cboAnioFC").val()},
                success:function(respJson){
                    if(respJson!==null){
                        var html = respJson.html;
                        $("#listado").html(html);
                        $(".mensa").tooltip();
                        $("#ViewPeriodos").modal("show");
                        flujocaja.stop();
                    }else{
                        flujocaja.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    flujocaja.stop();
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });
        $("#cboSucursalFC,#cboAnioFC").on("change",function(){
            $.ajax({
                type: 'post',
                url: "listar_registros_cierre",
                dataType: 'json',
                data:{idsuc:$("#cboSucursalFC").val(),anio:$("#cboAnioFC").val()},
                success:function(respJson){
                    if(respJson!==null){
                        var html = respJson.html;
                        $("#listado").html(html);
                        $(".mensa").tooltip();
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                }
            });
        });


        $("#btnTicket").on("click",function(){
            var opt = $('option:selected', $("#cboSucursalFC")).text();
            var method = "downloadFlujoCaja";
            var parameters = "idsuc="+$("#cboSucursalFC").val()+"&nom="+opt+"&anio="+$("#cboAnioFC").val();
            var url = method + "?" + parameters;
            window.open(url,'_blank');
        });
    };
    
    return {
        init: function () {
            Iniciando();
        },
        addProducto:function (a) {
            addProducto(a);
        },
        viewImageProducto:function (a) {
            viewImageProducto(a);
        },
        CerrarPeriodoContable: function(a){
            CerrarPeriodoContable(a);
        }
    };
    
}();
jQuery(document).ready(function () {
    Estadistica.init();
});