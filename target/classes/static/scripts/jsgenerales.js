var Generales = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var btnvistaLP = Ladda.create(document.querySelector('#vistaLP'));
    var btnvistaPMV = Ladda.create(document.querySelector('#vistaPMV'));
    var btnvistaSVP = Ladda.create(document.querySelector('#vistaSVP'));
    var btnvistaVDP = Ladda.create(document.querySelector('#vistaVDP'));
    var btnvistaVPC = Ladda.create(document.querySelector('#vistaVPC'));
    var btnvistaVVU = Ladda.create(document.querySelector('#vistaVVU'));
    var btnvistaVDU = Ladda.create(document.querySelector('#btnExcelVDU'));

    var tablePMV = null;
    var tableLP = null;
    var tableSVP = null;
    var tableVDP = null;
    var tableVPC = null;
    var tableVVU = null;

    var checkTodAlm = function(e,a){
        var isChecked = e.currentTarget.checked;
        $(a).prop("checked",isChecked);
        $(a).val(isChecked?"1":"0");
        $(a).iCheck('update');
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin,#busfeciniPMV,#busfecfinPMV,#busfecfinVDU,#busfeciniVDU,#busfeciniVPC,#busfecfinVPC").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfeciniPMV"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfinPMV"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfeciniVDU"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfinVDU"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfeciniVPC"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfinVPC"),"dd-mm-yyyy");
        $("#btnPrintSVP,#btnPrintPMV,#btnPrintLP,#btnPrintVDP,#btnPrintVDU,#btnPrintVPC").on("click",function(){
            var tipo = $(this).attr("name");
            if(tipo === "PMV"){
                var method = "downloadMasVendido";
                var parameters = "can="+$("#cboCantidadPMV").val()+"&idcat="+$("#cboLiCategoriaPMV").val()+"&idmar="+$("#cboLiMarcaPMV").val()+"&fecini=" + $("#busfeciniPMV").val() + "&fecfin=" + $("#busfecfinPMV").val() + "&idsuc=" + $("#cboSucursalPMV").val();
                var url = method + "?" + parameters;
                window.open(url,'_blank');
            }else if(tipo === "SVP"){
                var method = "StockValorizado";
                var parameters = "idcat="+$("#cboLiCategoriaSVP").val()+"&idmar="+$("#cboLiMarcaSVP").val()+"&idalm="+$("#cboLiAlmacenSVP").val();
                var url = method + "?" + parameters;
                window.open(url,'_blank');
            }else if(tipo === "LP"){
                var chk = $("#chkTodAlm").val();
                if(chk === "0"){
                    var method = "downloadListProduct";
                    var parameters = "idcat="+$("#cboLiCategoriaLP").val()+"&idmar="+$("#cboLiMarcaLP").val()+"&idalm="+$("#cboLiAlmacenLP").val();
                    var url = method + "?" + parameters;
                    window.open(url,'_blank');
                }else if(chk === "1"){
                    var method = "downloadListAlmancenes";
                    var parameters = "idcat="+$("#cboLiCategoriaLP").val()+"&idmar="+$("#cboLiMarcaLP").val();
                    var url = method + "?" + parameters;
                    window.open(url,'_blank');
                }
            }else if(tipo === "VDP"){
                var method = "downloadListVentaProduct";
                var parameters = "idcat="+$("#cboLiCategoriaVDP").val()+"&idmar="+$("#cboLiMarcaVDP").val()+"&fecini=" + $("#busfecini").val() + "&fecfin=" + $("#busfecfin").val()+ "&idsuc=" + $("#cboSucursalVDP").val();
                var url = method + "?" + parameters;
                window.open(url,'_blank');
            }else if(tipo === "VDU"){
                if( $("#cboSucursalVDU").val() !== "0"){
                    var method = "downloadVentaxUsu";
                    var parameters = "fecini=" + $("#busfeciniVDU").val() + "&fecfin=" + $("#busfecfinVDU").val() + "&idsuc=" + $("#cboSucursalVDU").val();
                    var url = method + "?" + parameters;
                    window.open(url,'_blank');
                }else {
                    uploadMsnSmall("Seleccione solo una sucursal.","ALERTA");
                }
            }else if(tipo === "VPC"){
                var method = "downloadVentaxCliente";
                var parameters = "fecini=" + $("#busfeciniVPC").val() + "&fecfin=" + $("#busfecfinVPC").val() + "&idsuc=" + $("#cboSucursalVPC").val();
                var url = method + "?" + parameters;
                window.open(url,'_blank');
            }
        });
        $("#vistaPMV,#vistaLP,#vistaSVP,#vistaVDP,#vistaVPC,#btnExcelVDU,#vistaVVU").on("click",function () {
            var tipo = $(this).attr("name");
            Repositorio.refreshGrafic($('div.blockTab'));
            if(tipo === "PMV"){
                btnvistaPMV.start();
                if(tablePMV !== null){
                    tablePMV._fnDraw();
                }else {
                    tablePMV = $("#tblProductosPMV").dataTable({
                        "bFilter": false,
                        "bSort": false,
                        "bLengthChange": false,
                        responsive: true,
                        dom: '<"html5buttons"B>lTfgitp',
                        buttons: [
                            {extend: 'copy'},
                            //{extend: 'csv'},
                            {extend: 'excel', title: 'Reporte Producto mas Vendido'},
                            {extend: 'pdf', title: 'Reporte Producto mas Vendido'}/*,
                            {extend: 'print',
                                customize: function (win){
                                    $(win.document.body).addClass('white-bg');
                                    $(win.document.body).css('font-size', '10px');
                                    $(win.document.body).find('table').addClass('compact').css('font-size', 'inherit');
                                }
                            }*/
                        ],
                        "processing": true,
                        "bServerSide": true,
                        "bAutoWidth": false,
                        "bPaginate": false,
                        "ajax": {
                            type: 'POST', url: "list_pmv", data: function (d) {
                                d.can = $("#cboCantidadPMV").val();
                                d.idcat = $("#cboLiCategoriaPMV").val();
                                d.idmar = $("#cboLiMarcaPMV").val();
                                d.fecini = $("#busfeciniPMV").val();
                                d.fecfin = $("#busfecfinPMV").val();
                                d.idsuc = $("#cboSucursalPMV").val();
                            }
                        },
                        "aoColumnDefs": [
                            {'sClass': "centrado", 'aTargets': [0, 1, 2]},
                            {'sClass': "text-right", 'aTargets': [4,5,6,7]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaPMV.stop();
                        }
                    });
                }
            }else if(tipo === "LP"){
                btnvistaLP.start();
                if(tableLP !== null){
                    tableLP._fnDraw();
                }else {
                    tableLP = $("#tblProductosLP").dataTable({
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
                            type: 'POST', url: "list_lp", data: function (d) {
                                d.idcat = $("#cboLiCategoriaLP").val();
                                d.idmar = $("#cboLiMarcaLP").val();
                                d.idalm = $("#cboLiAlmacenLP").val();
                            }
                        },
                        "aoColumnDefs": [
                            {'sClass': "centrado", 'aTargets': [0, 1, 2]},
                            {'sClass': "text-right", 'aTargets': [4]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaLP.stop();
                        }
                    });
                }
            }else if(tipo === "SVP"){
                btnvistaSVP.start();
                if(tableSVP !== null){
                    tableSVP._fnDraw();
                }else {
                    tableSVP = $("#tblProductosSVP").dataTable({
                        "bFilter": false,
                        "bSort": false,
                        responsive: true,
                        dom: '<"html5buttons"B>lTfgitp',
                        buttons: [
                            {extend: 'copy'},
                            {extend: 'excel', title: 'Reporte Stock Valorizado'},
                            {extend: 'pdf', title: 'Reporte Stock Valorizado'}
                        ],
                        "bLengthChange": false,
                        "processing": true,
                        "bServerSide": true,
                        "bAutoWidth": false,
                        "bPaginate": false,
                        "bInfo": false,
                        "ajax": {
                            type: 'POST', url: "list_svp", data: function (d) {
                                d.idcat = $("#cboLiCategoriaSVP").val();
                                d.idmar = $("#cboLiMarcaSVP").val();
                                d.idalm = $("#cboLiAlmacenSVP").val();
                            }
                        },
                        "aoColumnDefs": [
                            {'sClass': "centrado", 'aTargets': [0, 1, 2]},
                            {'sClass': "text-right", 'aTargets': [7,8,9]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaSVP.stop();
                        }
                    });
                }
            }else if(tipo === "VDU"){
                btnvistaVDU.start();
                $.ajax({
                    type:'POST',
                    url:"saveReportVentas",
                    data:{fecini:$("#busfeciniVDU").val(),fecfin:$("#busfecfinVDU").val(),idsuc:$("#cboSucursalVDU").val()},
                    dataType:'json',
                    success: function(respJson){ console.log(respJson);
                        if(respJson.dato=='OK'){
                            window.location.href = 'downloadReportVentas?fileName='+respJson.fileName;
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVDU.stop();
                            uploadMsnSmall(respJson.msj,'OK');
                        }else if(respJson.dato=='VACIO'){
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVDU.stop();
                            uploadMsnSmall(respJson.msj,'ALERTA');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        Repositorio.finishRefresh($('div.blockTab'));
                        btnvistaVDU.stop();
                        uploadMsnSmall(jqXHR.responseText,'ERROR');
                    }
                });
            }else if(tipo === "VDP"){
                btnvistaVDP.start();
                if(tableVDP !== null){
                    tableVDP._fnDraw();
                }else {
                    tableVDP = $("#tblProductosVDP").dataTable({
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
                            type: 'POST', url: "list_vdp", data: function (d) {
                                d.idcat = $("#cboLiCategoriaVDP").val();
                                d.idmar = $("#cboLiMarcaVDP").val();
                                d.fecini = $("#busfecini").val();
                                d.fecfin = $("#busfecfin").val();
                                d.idsuc = $("#cboSucursalVDP").val();
                            }
                        },
                        "aoColumnDefs": [
                            {'sClass': "centrado", 'aTargets': [0, 1, 2]},
                            {'sClass': "text-right", 'aTargets': [4]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVDP.stop();
                        }
                    });
                }
            }else if(tipo === "VPC"){
                btnvistaVPC.start();
                if(tableVPC !== null){
                    tableVPC._fnDraw();
                }else {
                    tableVPC = $("#tblProductosVPC").dataTable({
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
                            type: 'POST', url: "list_vpc", data: function (d) {
                                d.fecini = $("#busfeciniVPC").val();
                                d.fecfin = $("#busfecfinVPC").val();
                                d.idsuc = $("#cboSucursalVPC").val();
                            }
                        },
                        "aoColumnDefs": [
                            {'sClass': "centrado", 'aTargets': [0,2,3]},
                            {'sClass': "text-right", 'aTargets': [4,5,6]}
                        ],
                        "fnDrawCallback": function (oSettings) {
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVPC.stop();
                        }
                    });
                }
            }else if(tipo === "VVU"){
                btnvistaVVU.start();
                console.log("ola");
                $.ajax({
                    type:'POST',
                    url:"cab_usuarios",
                    data:{
                        fecini:$("#busfeciniVDU").val(),
                        fecfin:$("#busfecfinVDU").val(),
                        idsuc:$("#cboSucursalVDU").val()
                    },
                    dataType:'json',
                    success: function(respJson){
                        if ($.fn.DataTable.isDataTable('#tblProductosVDU')){
                            $("#tblProductosVDU").dataTable().fnDestroy();
                        }
                        $("#head_usuarios").html("");
                        $("#body_usuarios").html("");
                        console.log(respJson);
                        var lista = respJson.usuarios;
                        var head = "<tr>";
                        head+="<th class=\"text-center\" width=\"6%;\">N°</th>";
                        head+="<th width=\"12%;\">Fecha</th>";
                        var width = 70;
                        var colum = 70/lista.length;
                        var usuarios = lista.length;
                        for(var i=0;i<lista.length;i++){
                            head+="<th >"+lista[i].codigoVendedor+"</th>";
                        }
                        head+="<th class=\"text-center\" width=\"12%;\">Total</th>";
                        head+="</tr>";
                        $("#head_usuarios").html(head);

                            tableVVU = $("#tblProductosVDU").dataTable({
                                "bFilter": false,
                                "bSort": false,
                                responsive: true,
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    {extend: 'copy'},
                                    {extend: 'excel', title: 'Reporte de ventas por usuarios'},
                                    {extend: 'pdf', title: 'Reporte de ventas por ususarios'}
                                ],
                                "bLengthChange": false,
                                "processing": true,
                                "bServerSide": true,
                                "bAutoWidth": false,
                                "bPaginate": false,
                                "bInfo": false,
                                "ajax": {
                                    type: 'POST', url: "list_vvu", data: function (d) {
                                        d.fecini = $("#busfeciniVDU").val();
                                        d.fecfin = $("#busfecfinVDU").val();
                                        d.idsuc = $("#cboSucursalVDU").val();
                                        d.cantidad = usuarios;
                                    }
                                },
                                "aoColumnDefs": [
                                    {'sClass': "centrado", 'aTargets': [0]}//,
                                   // {'sClass': "text-right", 'aTargets': [1]}
                                ],
                                "fnDrawCallback": function (oSettings)
                                {
                                    Repositorio.finishRefresh($('div.blockTab'));
                                    btnvistaVVU.stop();
                                }
                            });


                       /* if(respJson.dato=='OK'){
                            window.location.href = 'downloadReportVentas?fileName='+respJson.fileName;
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVDU.stop();
                            uploadMsnSmall(respJson.msj,'OK');
                        }else if(respJson.dato=='VACIO'){
                            Repositorio.finishRefresh($('div.blockTab'));
                            btnvistaVDU.stop();
                            uploadMsnSmall(respJson.msj,'ALERTA');
                        }*/
                    },
                    error: function (jqXHR, status, error) {
                        Repositorio.finishRefresh($('div.blockTab'));
                        btnvistaVVU.stop();
                        uploadMsnSmall(jqXHR.responseText,'ERROR');
                    }
                });
            }
        });
        $('#chkTodAlm').iCheck({checkboxClass: 'icheckbox_square-green'}).on('ifChanged',function(event){
            checkTodAlm(event,$(this));
        });
        $.ajax({
            type: 'post',
            url: "mant_generales",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboLiCategoriaLP,#cboLiCategoriaPMV,#cboLiCategoriaSVP,#cboLiCategoriaVDP").html("<option value='T'>--TODOS--</option>"+respJson.htC);
                    $("#cboLiMarcaLP,#cboLiMarcaPMV,#cboLiMarcaSVP,#cboLiMarcaVDP").html("<option value='T'>--TODOS--</option>"+respJson.htM);
                    $("#cboLiAlmacenLP,#cboLiAlmacenSVP").html(respJson.htA);
                    $("#cboSucursalPMV,#cboSucursalVDP,#cboSucursalVPC").html(respJson.htS);
                    $("#cboSucursalVDU").html("<option value='0'>--TODOS--</option>"+respJson.htS);
                    $(".selectpicker").selectpicker("refresh");
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
        init: function () {
            Iniciando();
        }
    };

}();
jQuery(document).ready(function () {
    Generales.init();
});