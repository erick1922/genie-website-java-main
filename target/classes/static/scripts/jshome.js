var Home = function () {
    var rutaMov = "RecepcionMercaderia.html";
    var id = 0;
    var ctx2 = null;
    var newLine = null;
    var dataArtDia = [];
    var myPieChart = null;
    var dataSucChart = null;

    var CargarGraficoBarra = function(){
        var anio = moment().format('YYYY');
        var mes = (moment().format('MM'));
        mes = mes === "10" ? mes : mes.replace("0","");//1,2,3...10,11,12
        var dia = moment().format('DD');
        var fec = moment().format('DD-MM-YYYY');
        var montos = [];
        $.ajax({
            type: 'post',
            url: "home/report_inicio",
            data: {idsuc:id,anio:anio,mes:mes,dia:dia,fec:fec},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null) {
                    var documentos = respJson.docs_fac_notcred_facturas;
                    var guias = respJson.guias_pendientes;
                    $(respJson.par === "1" ? "#div-gastos":"#div-clientes").css("display","block");
                    $("#ventas").text("S./ "+Redondear2(respJson.venta));
                    $("#linkCliente").attr("data-count",(respJson.par === "1" ? 0:respJson.cli));
                    $(respJson.par === "1" ? "#gastos" : "#clientes").text(respJson.par === "1" ? "S./ "+Redondear2(respJson.gasto) : respJson.cli);
                    $("#devoluciones").text("S./ "+Redondear2(respJson.devoluciones));
                    $("#meta").text("S./ "+Redondear2(respJson.meta));
                    $("#desMetMes").text("META DEL MES: S./ "+Redondear2(respJson.metM));
                    $("#desVenMes").text("VENTA: S./ "+Redondear2(respJson.venM));
                    $("#cred_vencidos").text(respJson.vencidos);
                    $("#linkCreditos").attr("data-count",respJson.vencidos);
                    $("#linkViewDocSunat").attr("data-count",documentos.length);
                    $("#linkViewGuiasPend").attr("data-count",guias.length);
                    $("#docs_sunat").text(documentos.length);
                    $("#guias_pendientes").text(guias.length);

                    $("#div_hab_disp").text(respJson.activas);
                    $("#div_hab_ocu").text(respJson.ocupadas);
                    $("#div_tot_hab").text(respJson.total);
                    $("#div_cob_dia").text("S./ "+Redondear2(respJson.venta));

                    var html = "";
                    id = respJson.sel;
                    var sel = respJson.sel;
                    var lista = respJson.suc;

                    for(var i=0;i<lista.length;i++){
                        if(lista[i].id === sel){
                            $("#suc").val("SUCURSAL: "+lista[i].nombre);
                            if(lista[i].otbAlmacen.rubroNegocio.tipo === "VENTAROPA"){
                                $("#div_1_puntoventa").show();
                                $("#div_2_puntoventa").show();
                                $("#div_3_puntoventa").show();
                                $("#div_1_hotelero").hide();
                                $("#div_2_hotelero").hide();
                            } else if(lista[i].otbAlmacen.rubroNegocio.tipo === "HOTELERO"){
                                $("#div_1_puntoventa").hide();
                                $("#div_2_puntoventa").hide();
                                $("#div_3_puntoventa").hide();
                                $("#div_1_hotelero").show();
                                $("#div_2_hotelero").show();
                                var htAlq = "";
                                var lisAlq = respJson.alq_vencidos;
                                for(var x=0;x<lisAlq.length;x++){
                                    var ite = lisAlq[x];
                                    console.log(ite);

                                    var diferencia = 0;
                                    if(parseInt(ite[9]) > 1 ){
                                        var fi = moment();
                                        var fs = moment(ite[5],"DD-MM-YYYY");
                                        diferencia = fs.diff(fi,"days") + 1;
                                    }else{
                                        var fi = moment();
                                        var fs = moment(ite[5],"DD-MM-YYYY");
                                        diferencia = fs.diff(fi,"days") + 1;
                                    }
                                    var est = "<label class='label label-success'>POR VENCER "+(diferencia === 1 ? "1 DIA" : ( diferencia + " DIAS"))+"</label>";
                                    if(parseInt(ite[8]) > 0){
                                        est = "<label class='label label-danger'>POR COBRAR</label>";
                                    }
                                    htAlq+="<tr>";
                                    htAlq+="<td>"+(x+1)+"</td>";
                                    htAlq+="<td>"+ite[1]+"</td>";
                                    htAlq+="<td>"+ite[2]+"</td>";
                                    htAlq+="<td class='text-center'>"+( parseFloat(ite[3]) > 0 ? "<label class='label label-primary'>SI</label> " : "-")+"</td>";
                                    htAlq+="<td class='text-center' style='white-space: nowrap;'>"+( parseInt(ite[9]) === 1 ? "1 MES" : (ite[9]+" MESES") ) +"</td>";
                                    htAlq+="<td class='text-center'>"+ite[4] +"</td>";
                                    htAlq+="<td class='text-center'>"+ite[5]+"</td>";
                                    htAlq+="<td class='text-right'>"+Redondear2Decimales(ite[6])+"</td>";
                                    htAlq+="<td class='text-center'>"+( parseInt(ite[8]) > 0 ? ( parseInt(ite[8]) === 1 ? "1 dia" : ite[8]+" dias") : "-" )+"</td>";
                                    htAlq+="<td class='text-right'>"+Redondear2Decimales(ite[7])+"</td>";
                                    htAlq+="<td class='text-center'>"+est+"</td>";
                                    htAlq+="</tr>";
                                }
                                if(lisAlq.length === 0){
                                    htAlq+="<tr><td class='text-center font-bold' colspan='7'>No tiene alquileres vencidos.</td></tr>";
                                }
                                $("#body_alq_vencidos").html(htAlq);
                            }
                        }
                        html+="<li><a href='javascript:void(0);' data-rubro='"+lista[i].otbAlmacen.rubroNegocio.tipo+"' data-id='"+lista[i].id+"' data-nom='"+lista[i].nombre+"' onclick='Home.updateSuc(this);'><div><i class='fa fa-list-alt fa-fw'></i>&nbsp;&nbsp; "+lista[i].nombre+"</div></a></li>";
                        if(i!==lista.length-1){
                            html+="<li class='divider'></li>";
                        }
                    }
                    $("#listSuc").html(html);
                    if(lista.length > 1){
                        $("#div-suc").show();
                    }
                    if(respJson.usu === "1"){
                        if(respJson.cas === "1"){
                            rutaMov = "Movimiento.html";
                            $("#div-sucu").css("display","block");
                            var barSucData = {
                                labels: respJson.sucN,
                                datasets: [
                                    {
                                        label: "Venta",
                                        backgroundColor: 'rgba(26,179,148,0.5)',
                                        borderColor: "rgba(26,179,148,1)",
                                        borderWidth: 2,
                                        data: respJson.sucM
                                    }
                                ]
                            };
                            if(dataSucChart!=null){
                                dataSucChart.destroy();
                            }
                            dataSucChart = new Chart(document.getElementById("sucChart").getContext("2d"), {
                                type: 'bar',
                                data: barSucData,
                                options:{
                                    legend: {display: false},
                                    responsive: true,
                                    tooltips: {
                                        intersect: true,
                                        callbacks: {
                                            title: function(tooltipItems, data) {
                                                return "Sucursal: "+tooltipItems[0].xLabel;
                                            }
                                        }
                                    }
                                }
                            });
                        }else{
                            $("#div-ven").css("display","block");
                        }
                    }else{
                        $("#div-ven").css("display","block");
                    }
                    montos = respJson.montos;
                    dataArtDia = respJson.productos;
                    var barData = {
                        labels: respJson.colums,
                        datasets: [
                            {
                                label: "Venta",
                                backgroundColor: 'rgba(26,179,148,0.5)',
                                borderColor: "rgba(26,179,148,1)",
                                borderWidth: 2,
                                data: montos
                            }
                        ]
                    };
                    if(ctx2!=null){
                        ctx2.destroy();
                    }
                    ctx2 = new Chart(document.getElementById("barChart").getContext("2d"), {
                        type: 'bar',
                        data: barData,
                        options:{
                            legend: {display: false},
                            title:{
                                display:true,
                                text:respJson.tit,
                                fontSize:15
                            },
                            responsive: true,
                            tooltips: {
                                intersect: true,
                                callbacks:
                                {
                                    title: function(tooltipItems, data) {
                                        return "Dia "+tooltipItems[0].xLabel;
                                    },
                                    //label: function(tooltipItems, data) {
                                    //    return "Venta: "+montos[tooltipItems[0].xLabel - 1];
                                   // },
                                    footer: function(tooltipItems, data) {
                                        return "Articulos: " + dataArtDia[tooltipItems[0].xLabel - 1];
                                    }
                                }/*,
                                scales: {
                                    xAxes: [{
                                        display: true
                                    }],
                                    yAxes: [{
                                        display: true,
                                        ticks:
                                        {
                                            userCallback: function(value, index, values)
                                            {
                                                ///return format_number(value);
                                            }
                                        }
                                    }],
                                }*/
                            }
                        }
                    });

                    var lineData = {
                        labels: respJson.horas,
                        datasets: [
                            {
                                label: "Venta",
                                backgroundColor: 'rgba(26,179,148,0.5)',//"#1C84C6"
                                borderColor: "rgba(26,179,148,0.7)",
                                pointBackgroundColor: "rgba(26,179,148,1)",
                                pointBorderColor: "#fff",
                                data: respJson.ventaxhora
                            }
                        ]
                    };
                    if(newLine != null){
                        newLine.destroy();
                    }
                    newLine = new Chart(document.getElementById("lineChart").getContext("2d"), {type: 'line', data: lineData, options:{
                        legend: {
                            display: false,
                        },
                        title:{
                            display:true,
                            text:'Ventas por Hora del Día Actual',
                            fontSize:15
                        },
                        responsive: true
                    }});

                    var usuM = respJson.usuM;
                    var usuC = respJson.usuC;
                    var usuN = respJson.usuN;
                    var colores = ['#5CB85C','#E9573F','#63D3E9','#F6BB42','#36A2EB','#34537A'];
                    var col = new Array();
                    for(var v=0;v<usuC.length;v++){
                        col.push(colores[v]);
                    }

                    var barChartData = {labels: usuC,
                        datasets:[{ data: usuM,backgroundColor: col,hoverBackgroundColor:col},] };

                    var ctx = document.getElementById('chart-area').getContext('2d');

                    if(myPieChart != null){myPieChart.destroy();}
                    var eos_chart = {
                        type: 'pie',
                        data: barChartData,
                        options: {
                            responsive : true,
                            tooltips: {
                                mode: 'label',
                                intersect: true,
                                callbacks: {
                                    label: function(tooltipItem, data){
                                        var value = data.datasets[0].data[tooltipItem.index];
                                        var label = usuN[tooltipItem.index];
                                        return label + ': S/. ' + Redondear2(value);
                                    }
                                }
                            }
                        }
                    };
                    myPieChart = new Chart(ctx, eos_chart);
                    ///window.myPieChart = myPieChart;

                    var ventaUsuarios = respJson.ventaMesUsu;
                    var htmlVenUsu = "";
                    for(var cc=0;cc<ventaUsuarios.length;cc++){
                        htmlVenUsu+="<tr>";
                        htmlVenUsu+="<td class='text-center'>"+(cc+1)+"</td>";
                        htmlVenUsu+="<td class='text-center'>"+ventaUsuarios[cc].codigoVendedor+"</td>";
                        htmlVenUsu+="<td>"+ventaUsuarios[cc].nombres+"</td>";
                        htmlVenUsu+="<td class='text-right'>"+Redondear2(ventaUsuarios[cc].sueldoBasico)+"</td>";
                        htmlVenUsu+="</tr>";
                    }
                    $("#body_usuarios").html(htmlVenUsu);

                    var html = "";
                    for(var i=0;i<documentos.length;i++){
                        var item = documentos[i];
                        console.log(item);
                        var estadoDoc = "<label class='label label-warning'>POR ENVIAR</label>";
                        var btn = "";
                        if(item.otbTbDocumentoVentaReferencia !== null){
                            btn = "<button type='button' id='"+"btn_send_"+item.otbPedido.id+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Enviar nota: "+ item.serieElectronica+' '+item.correlativoElectronico +"</div>' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='enviar_notacredito_factura_sunat(this);' > <i class='fa fa-eject' style='font-size:15px!important;'></i> </button>";
                        }else{
                            btn = "<button type='button' id='"+"btn_send_"+item.otbPedido.id+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Enviar factura: "+ item.serieElectronica+' '+item.correlativoElectronico +"</div>' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='enviar_doc_sunat(this);' > <i class='fa fa-eject' style='font-size:15px!important;'></i> </button>";
                        }
                        var fecreg = moment(item.fecGenerado).format('DD-MM-YYYY');
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+fecreg+"</td>";
                        html+="<td>"+item.nomCliente+"</td>";
                        html+="<td>"+item.otbSucursal.nombre+"</td>";
                        html+="<td>"+item.otbTipoDocumento.nombre+": "+item.serieElectronica+" "+item.correlativoElectronico+"</td>";
                        html+="<td class='text-right'>"+Redondear2Decimales(item.monTotal)+"</td>";
                        if(item.rechazadoSunat !== null){
                            if(parseInt(item.rechazadoSunat) === 1){
                                estadoDoc = "<label class='label label-danger'>RECHAZADO</label>";
                                btn = "<button type='button' data-arc='"+item.otbSucursal.anexoSucursal+"/R-"+item.otbSucursal.empresa.ruc+"-"+item.otbTipoDocumento.codigoSunat+"-"+item.serieElectronica+"-"+item.correlativoElectronico+".ZIP"+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Descargar respuesta: "+ item.serieElectronica+' '+item.correlativoElectronico +"</div>'  style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='DescargarZIPRespuesta(this);'> <i class='fa fa-cloud-download' style='font-size:15px!important;'></i> </button>";
                            }
                        }
                        html+="<td class='text-center pt-2 pb-2'>"+estadoDoc+"</td>";
                        html+="<td class='text-center pt-1 pb-1'>"+btn+"</td>";
                        html+="</tr>";
                    }
                    $("#listado_docs_sunat_pe").html(html);
                    html = "";
                    for(var i=0;i<guias.length;i++){
                        var item = guias[i];
                        var btn = "<button type='button' data-fec='"+item[1]+"' data-toggle='tooltip' data-placement='left' class='btn btn-sm btn-success mensa' data-html='true' title='<div style=\"width:180px!important;\" >Ir al movimiento</div>' style='margin:0px!important;padding:3px 7px 3px 7px!important;font-size: 15px!important;' onclick='Home.ver_movimiento(this);' > Ir </button>";
                        html+="<tr>";
                        html+="<td>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+item[1]+"</td>";
                        html+="<td>"+item[0]+"</td>";
                        html+="<td>"+item[9]+"</td>";
                        html+="<td>"+(item[4] !== null ? item[4] + ": "+item[3] : "")+"</td>";
                        html+="<td>"+(item[2]!== null ? item[2] : "")+"</td>";
                        html+="<td>"+(item[5] === "P" ? "PENDIENTE" : "POR CONFIRMAR")+"</td>";
                        html+="<td class='text-center'>"+btn+"</td>";
                        html+="</tr>";
                    }
                    $("#listado_guias_pe").html(html);
                    $(".mensa").tooltip();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });

    };
    $.ajax({
        type: 'post',
        url: "consultar_pagos",
        dataType: 'json',
        success: function (respJson){
            if (respJson !== null){
                var dato = respJson.dato;
                if(dato === "OK"){
                    $("#txtPago").text("");
                }else if(dato === "ERROR"){
                    $("#txtPago").text(respJson.msj);
                }
            }else{
                uploadMsnSmall('Problemas con el sistema','ERROR');
            }
        },
        error: function (jqXHR, status, error) {
            uploadMsnSmall(jqXHR.responseText,'ERROR');
        }
    });

    var updateSuc = function (elem) {
        id = $(elem).attr("data-id");
        var nom = $(elem).attr("data-nom");
        $("#suc").val("SUCURSAL: "+nom);
        CargarGraficoBarra();
    };

    var ver_pedido = function(a){
        var fecha = $(a).attr("data-fec");
        var cli = $(a).attr("data-cliente");
        var href = "../Creditos.html?fec="+fecha+"&cli=" + cli;
        window.open(href,"_blank");
    };

    var ver_movimiento = function(a){
        var fecha = $(a).attr("data-fec");
        //var cli = $(a).attr("data-cliente");
        var href = "../"+rutaMov+"?fec="+fecha;
        window.open(href,"_blank");
    };

    return {
        init: function () {
            $("#linkViewGuiasPend").on("click",function(){
                var cant = parseInt($(this).attr("data-count"));
                if(cant > 0){
                    $("#tbl_docs_sunat_pe").hide();
                    $("#tbl_creditos").hide();
                    $("#tbl_clientes").hide();
                    $("#tbl_guias_pe").show();
                    $("#viewClientes").modal("show");
                }else{
                    uploadMsnSmall("No hay guias por confirmar.",'ALERTA');
                }
            });
            $("#linkViewDocSunat").on("click",function(){
                var cant = parseInt($(this).attr("data-count"));
                if(cant > 0){
                    $("#tbl_guias_pe").hide();
                    $("#tbl_creditos").hide();
                    $("#tbl_clientes").hide();
                    $("#tbl_docs_sunat_pe").show();
                    $("#viewClientes").modal("show");
                }else{
                    uploadMsnSmall("No hay documentos por enviar.",'ALERTA');
                }
            });
            $("#linkCliente").on("click",function () {
                var cant = parseInt($(this).attr("data-count"));
                var mes = (moment().format('MM'));
                var dia = moment().format('DD');
                $("#tbl_creditos").hide();
                $("#tbl_docs_sunat_pe").hide();
                $("#tbl_guias_pe").hide();
                $("#tit_modal_datos").text("Ver clientes");
                if(cant > 0) {
                    $.ajax({
                        type: 'post',
                        url: "home/listClienteMesxDia",
                        data: {mes: mes, dia: dia},
                        dataType: 'json',
                        success: function (respJson) {
                            if (respJson !== null) {
                                $("#listado_cli").html(respJson.ht);
                                $("#tbl_clientes").show();
                                $("#viewClientes").modal("show");
                            } else {
                                uploadMsnSmall('Problemas con el sistema', 'ERROR');
                            }
                        },
                        error: function (jqXHR, status, error) {
                            uploadMsnSmall(jqXHR.responseText, 'ERROR');
                        }
                    });
                }else{
                    uploadMsnSmall("No se  encontraron resultados.",'ALERTA');
                }
            });
            $("#linkCreditos").on("click",function(){
                var cant = parseInt($(this).attr("data-count"));
                if(cant > 0){
                    $("#tbl_clientes").hide();
                    $("#tbl_docs_sunat_pe").hide();
                    $("#tbl_guias_pe").hide();
                    $("#tit_modal_datos").text("Ver créditos vencidos");
                    $.ajax({
                        type: 'post',
                        url: "home/listCreditosVencidos",
                        data: {idsuc:id},
                        dataType: 'json',
                        success: function (respJson){
                            if (respJson !== null){
                                $("#tbl_creditos").show();
                                $("#listado_cre").html(respJson.ht);
                                $("#viewClientes").modal("show");
                            }else{
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function (jqXHR, status, error) {
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                }else{
                    uploadMsnSmall("No tiene créditos vencidos.",'ALERTA');
                }
            });
            CargarGraficoBarra();
        },
        updateSuc:function(elem){
            updateSuc(elem);
        },
        ver_pedido:function(a){
            ver_pedido(a);
        },
        ver_movimiento:function(a){
            ver_movimiento(a);
        }
    };
}();
jQuery(document).ready(function () {
    Home.init();
});