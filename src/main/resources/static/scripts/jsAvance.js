var AvanceMarca = function () {
    var anioAct = moment().format('YYYY');
    var mesAct = moment().format('MM');

    var id = 0;
    var ctx2 = null;
    var newLine = null;
    var dataArtDia = [];
    var myPieChart = null;
    var dataSucChart = null;

    var EliminarRepetidos = function (arreglo) {
        var arIngresos = new Array();
        var arIngresos2 = new Array();
        for (var n = 0; n < arreglo.length; n++) {
            arIngresos2.push(arreglo[n]);
        }
        for(var j=0;j<arreglo.length;j++){
            var seencuentra = "0";
            for(var x=0;x<arIngresos2.length;x++){
                if(arreglo[j] === arIngresos2[x]){
                    arIngresos2.splice(x,1);
                    seencuentra = "1";
                    x=x-1;
                }
            }
            if(seencuentra === "1" ){
                arIngresos.push(arreglo[j]);
            }
        }
        return arIngresos;
    };

    var CargarGraficoBarra = function(categorias,avancemeses){
        var anio = moment().format('YYYY');
        var mes = (moment().format('MM'));
        mes = mes === "10" ? mes : mes.replace("0","");
        var dia = moment().format('DD');
        var fec = moment().format('DD-MM-YYYY');

        $.ajax({
            type: 'post',
            url: "home/report_inicio",
            data: {idsuc:id,anio:anio,mes:mes,dia:dia,fec:fec},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null) {
                    var html = "";
                /*  var sel = respJson.sel;
                    var lista = respJson.suc;
                    if(respJson.usu === "1"){
                        if(respJson.cas === "1"){
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
                        }
                    }*/

                    var backGroundColorVC = ['rgb(92,184,92)','rgb(246,187,66)','rgb(99,211,233)','rgb(233,87,63)','rgb(54,162,235)','rgb(52,83,122)'];
                    var borderColorVC = ['rgb(92,184,92,0.7)','rgb(246,187,66,0.7)','rgb(99,211,233,0.7)','rgb(233,87,63,0.7)','rgb(54,162,235,0.7)','rgb(52,83,122,0.7)'];
                    var pointBackGroundColorVC = ['rgb(92,184,92,1)','rgb(246,187,66,1)','rgb(99,211,233,1)','rgb(233,87,63,1)','rgb(54,162,235,1)','rgb(52,83,122,1)'];

                    var arr_meses = new Array();
                    var arr_suc = new Array();

                    for(var j=0;j<avancemeses.length;j++){
                        arr_meses.push(avancemeses[j][1]);
                        arr_suc.push(avancemeses[j][3]);
                    }
                    arr_meses = EliminarRepetidos(arr_meses);
                    arr_suc = EliminarRepetidos(arr_suc);

                    var datasetsVM = new Array();
                    var arr_vent_suc = new Array();
                    for(var x=0;x<arr_suc.length;x++){
                        var montos = new Array();
                        var articulos = new Array();
                        for(var y=0;y<arr_meses.length;y++){
                            var seencontro = "0"
                            for(var z=0;z<avancemeses.length;z++){
                                if(arr_suc[x] === avancemeses[z][3] && arr_meses[y] === avancemeses[z][1] ){
                                    seencontro = "1";
                                    articulos.push(avancemeses[z][4]);
                                    montos.push(avancemeses[z][5]);
                                }
                            }
                            if(seencontro === "0"){
                                articulos.push(0);
                                montos.push(0);
                            }
                        }
                        datasetsVM.push({
                            label: arr_suc[x],
                            backgroundColor: backGroundColorVC[x],//"#1C84C6"
                            borderColor: borderColorVC[x],
                            pointBackgroundColor: pointBackGroundColorVC[x],
                            pointBorderColor: "#fff",
                            borderWidth:2,
                            data:montos
                        });
                        arr_vent_suc.push(articulos);
                    }

                    var barData = {
                        labels: arr_meses,
                        datasets: datasetsVM
                    };
                    if(ctx2!=null){
                        ctx2.destroy();
                    }
                    ctx2 = new Chart(document.getElementById("barChart").getContext("2d"), {
                        type: 'bar',
                        data: barData,
                        options:{
                            legend: {
                                position: 'right',
                            },
                            title:{
                                display:true,
                                text:'Ventas por Meses.'
                            },
                            responsive: true,
                            tooltips: {
                                intersect: true,
                                callbacks:
                                {
                                    //title: function(tooltipItems, data) {
                                      //  return "Dia "+tooltipItems[0].xLabel;
                                    //},
                                   // label: function(tooltipItems, data) {
                                     //   return "Venta: "+tooltipItems.yLabel;
                                    //},
                                    footer: function(tooltipItems, data) {
                                        return "Articulos: " + arr_vent_suc[tooltipItems[0].datasetIndex][tooltipItems[0].index];
                                    }
                                }
                            }
                        }
                    });

                    var arr_sucursal = new Array();
                    var arr_categegoria = new Array();
                    for(var i=0;i<categorias.length;i++){
                        arr_sucursal.push(categorias[i][1]);
                        arr_categegoria.push(categorias[i][3]);
                    }
                    arr_sucursal = EliminarRepetidos(arr_sucursal);
                    arr_categegoria = EliminarRepetidos(arr_categegoria);

                    var datasetsVC = new Array();
                    var arr_artxcat = new Array();
                    for(var x=0;x<arr_sucursal.length;x++){
                        var montos = new Array();
                        var articulos = new Array();
                        for(var y=0;y<arr_categegoria.length;y++){
                            var seencontro = "0"
                            for(var z=0;z<categorias.length;z++){
                                if(arr_sucursal[x] === categorias[z][1] && arr_categegoria[y] === categorias[z][3] ){
                                    seencontro = "1";
                                    articulos.push(categorias[z][4]);
                                    montos.push(categorias[z][5]);
                                }
                            }
                            if(seencontro === "0"){
                                montos.push(0);
                                articulos.push(0);
                            }
                        }
                        datasetsVC.push({
                            label: arr_sucursal[x],
                            backgroundColor: backGroundColorVC[x],//"#1C84C6"
                            borderColor: borderColorVC[x],
                            pointBackgroundColor: pointBackGroundColorVC[x],
                            pointBorderColor: "#fff",
                            data:montos
                        });
                        arr_artxcat.push(articulos);
                    }

                    var lineData = {
                        labels: arr_categegoria,
                        datasets: datasetsVC
                    };
                    if(newLine != null){
                        newLine.destroy();
                    }
                    newLine = new Chart(document.getElementById("lineChart").getContext("2d"),
                    {
                        type: 'horizontalBar',
                        data: lineData,
                        options:{
                            legend: {
                                position: 'right',
                            },
                            title:{
                                display:true,
                                text:'Ventas por Categoria del Mes.'
                            },
                            responsive: true,
                            tooltips: {
                                intersect: true,
                                callbacks:
                                {
                                    //title: function(tooltipItems, data) {
                                       // return "Dia "+tooltipItems[0].xLabel;
                                    //},
                                    label: function(tooltipItems, data) {
                                        return "Venta: "+tooltipItems.xLabel;
                                    },
                                    footer: function(tooltipItems,data){
                                        return "Articulos: " + arr_artxcat[tooltipItems[0].datasetIndex][tooltipItems[0].index];
                                    }
                                }
                            }
                        }
                    });

                    /*var usuM = respJson.usuM;
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
                                mode: 'label',intersect: true,
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
              */
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

    var RecargarGraficos = function(tipo){
        var aniSel = $("#cboLiAnio").val();
        var mesSel = $("#cboLiMesA").val();
        var feciniAnio = "01-01-"+aniSel;
        var fecfinAnio = "31-12-"+aniSel;
        var mes = mesSel === "10" ? mesSel : mesSel.replace("0","");
        var diasxmes = moment(mes+"-"+aniSel,"MM-YYYY").daysInMonth();
        var feciniMes = "01-"+mes+"-"+aniSel;
        var fecfinMes = diasxmes+"-"+mes+"-"+aniSel;

        var fe = moment(feciniMes,"DD-MM-YYYY").subtract(1,'months');
        var fec = fe.format("MM-YYYY");
        var diasxmesAnt = moment(fec,"MM-YYYY").daysInMonth();
        var iniMesAnt = "01-" +fec;
        var finMesAnt = diasxmesAnt+"-"+fec;
        $.ajax({
            type: 'post',
            url: "init_avances",
            data: {feciniAnio:feciniAnio,fecfinAnio:fecfinAnio,feciniMes:feciniMes,fecfinMes:fecfinMes,"idm":$("#idm").val(),
                iniMesAnt:iniMesAnt,finMesAnt:finMesAnt,"ids":$("#cboLiSucursal").val()},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null){
                    var categorias = respJson.categorias;
                    var lista = respJson.anual;
                    var mensual = respJson.mensual;
                    var ventadia = respJson.ventadia;
                    var mesanterior = respJson.mesanterior;
                    var avancemeses = respJson.avancemeses;
                    var vendidos = respJson.vendidos;
                    var valorizados = respJson.valorizados;
                    var htS = lista.length > 1 ? "<option value='0'>TODAS LAS SUCURSALES</option>" : "";
                    var canPro = 0;
                    var monVen = 0.00;
                    var canProMen = 0;
                    var monVenMen = 0.00;
                    var monVenDia = 0.00;
                    var monVenMesAnt = 0.00;
                    for(var i=0;i<lista.length;i++){
                        htS+="<option value='"+lista[i][0]+"' data-pro='"+lista[i][2]+"' data-venta='"+lista[i][3]+"' >"+lista[i][1]+"</option>";
                        canPro+=parseInt(lista[i][2]);
                        monVen+=parseFloat(lista[i][3]);
                    }
                    for(var j=0;j<mensual.length;j++){
                        canProMen+=parseInt(mensual[j][2]);
                        monVenMen+=parseFloat(mensual[j][3]);
                    }
                    for(var k=0;k<ventadia.length;k++){
                        monVenDia+=parseFloat(ventadia[k][3]);
                    }
                    for(var c=0;c<mesanterior.length;c++){
                        monVenMesAnt+=parseFloat(mesanterior[c][3]);
                    }
                    if(tipo === "A"){
                        if(htS === ""){
                            htS+="<option value='0'>NO HAY VENTAS</option>";
                        }
                        $("#cboLiSucursal").html(htS);
                    }

                    $("#cboLiSucursal").selectpicker('refresh');
                    $("#desMetMes").text("CANT. VENDIDA: " + canPro);
                    $("#desVenMes").text("VENTA ANUAL: S./ "+Redondear2(monVen));
                    $("#ventas").text("S./ "+monVenMen);
                    $("#devoluciones").text(canProMen);
                    $("#gastos").text("S./ "+monVenDia);
                    $("#meta").text("S./ "+monVenMesAnt);
                    var opt = $('option:selected',$("#cboLiMesA")).text();
                    $("#titProductoMasVend").text("Productos mas Vendidos del Mes de " + opt);
                    var htVen = "";
                    var htVal = "";
                    var valCV = 0;
                    var valCom = 0;
                    var valVen = 0;
                    var valUti = 0;
                    for(var n=0;n<vendidos.length;n++){
                        htVen+="<tr>";
                        htVen+="<td>"+(n+1)+"</td>";
                        htVen+="<td>"+(vendidos[n][0])+"</td>";
                        htVen+="<td>"+(vendidos[n][2])+"</td>";
                        htVen+="<td class='text-right'>"+(vendidos[n][3])+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][4]))+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][5]))+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][6]))+"</td>";
                        htVen+="</tr>";
                        valCV+=parseInt(vendidos[n][3]);
                        valCom+=parseFloat(vendidos[n][4]);
                        valVen+=parseFloat(vendidos[n][5]);
                        valUti+=parseFloat(vendidos[n][6]);
                    }
                    var htFVen="<tr>";
                    htFVen+="<td colspan='3' class='text-right'>MONTOS TOTALES:</td>";
                    htFVen+="<td class='text-right'>"+valCV+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valCom))+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valVen))+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valUti))+"</td>";
                    htFVen+="</tr>";
                    $("#listado").html(htVen);
                    $("#footListado").html(htFVen);

                    var valStock = 0;
                    var valValor = 0;
                    for(var m=0;m<valorizados.length;m++){
                        htVal+="<tr>";
                        htVal+="<td>"+(m+1)+"</td>";
                        htVal+="<td>"+(valorizados[m][1])+"</td>";
                        htVal+="<td class='text-right'>"+(valorizados[m][2])+"</td>";
                        htVal+="<td class='text-right'>"+(Redondear2(valorizados[m][3]))+"</td>";
                        htVal+="</tr>";
                        valStock+=parseInt(valorizados[m][2]);
                        valValor+=parseFloat(valorizados[m][3]);
                    }
                    var htFVal="<tr>";
                    htFVal+="<td colspan='2' class='text-right'>TOTAL DE PRODUCTOS: </td>";
                    htFVal+="<td class='text-right'>"+(valStock)+"</td>";
                    htFVal+="<td class='text-right'>"+(Redondear2(valValor))+"</td>";
                    htFVal+="</tr>";
                    $("#valorizado").html(htVal);
                    $("#footValorizado").html(htFVal);

                    CargarGraficoBarra(categorias,avancemeses);
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        var mes = (moment().format('MM'));
        mes = mes === "10" ? mes : mes.replace("0","");
        $("#cboLiAnio").on("change",function(){
            RecargarGraficos("A");
        });
        $("#cboLiMesA").selectpicker('val',mes);
        $("#cboLiMesA").on("change",function(){
            RecargarGraficos("M");
        });
        $("#cboLiSucursal").on("change",function(){
            RecargarGraficos("S");
        });
        var feciniAnio = "01-01-"+anioAct;
        var fecfinAnio = "31-12-"+anioAct;
        var feciniMes = "01-"+mesAct+"-"+anioAct;
        var fecfinMes = moment().format("DD-MM-YYYY");
        var fe = moment().subtract(1,'months');
        var fec = fe.format("MM-YYYY");
        var diasxmes = moment(fec,"MM-YYYY").daysInMonth();
        var iniMesAnt = "01-" +fec;
        var finMesAnt = diasxmes+"-"+fec;
        $.ajax({
            type: 'post',
            url: "init_avances",
            data: {feciniAnio:feciniAnio,fecfinAnio:fecfinAnio,feciniMes:feciniMes,fecfinMes:fecfinMes,"idm":$("#idm").val(),
                iniMesAnt:iniMesAnt,finMesAnt:finMesAnt,"ids":$("#cboLiSucursal").val()},
            dataType: 'json',
            success: function (respJson){
                if (respJson !== null){
                    var categorias = respJson.categorias;
                    var lista = respJson.anual;
                    var mensual = respJson.mensual;
                    var ventadia = respJson.ventadia;
                    var mesanterior = respJson.mesanterior;
                    var avancemeses = respJson.avancemeses;
                    var vendidos = respJson.vendidos;
                    var valorizados = respJson.valorizados;
                    var htS = lista.length > 1 ? "<option value='0'>TODAS LAS SUCURSALES</option>" : "";
                    var canPro = 0;
                    var monVen = 0.00;
                    var canProMen = 0;
                    var monVenMen = 0.00;
                    var monVenDia = 0.00;
                    var monVenMesAnt = 0.00;
                    for(var i=0;i<lista.length;i++){
                        htS+="<option value='"+lista[i][0]+"' data-pro='"+lista[i][2]+"' data-venta='"+lista[i][3]+"' >"+lista[i][1]+"</option>";
                        canPro+=parseInt(lista[i][2]);
                        monVen+=parseFloat(lista[i][3]);
                    }
                    for(var j=0;j<mensual.length;j++){
                        canProMen+=parseInt(mensual[j][2]);
                        monVenMen+=parseFloat(mensual[j][3]);
                    }
                    for(var k=0;k<ventadia.length;k++){
                        monVenDia+=parseFloat(ventadia[k][3]);
                    }
                    for(var c=0;c<mesanterior.length;c++){
                        monVenMesAnt+=parseFloat(mesanterior[c][3]);
                    }
                    $("#cboLiSucursal").html(htS);
                    $("#cboLiSucursal").selectpicker('refresh');
                    $("#desMetMes").text("CANT. VENDIDA: " + canPro);
                    $("#desVenMes").text("VENTA ANUAL: S./ "+Redondear2(monVen));
                    $("#ventas").text("S./ "+monVenMen);
                    $("#devoluciones").text(canProMen);
                    $("#gastos").text("S./ "+monVenDia);
                    $("#meta").text("S./ "+monVenMesAnt);
                    var opt = $('option:selected',$("#cboLiMesA")).text();
                    $("#titProductoMasVend").text("Productos mas Vendidos del Mes de " + opt);
                    var htVen = "";
                    var htVal = "";
                    var valCV = 0;
                    var valCom = 0;
                    var valVen = 0;
                    var valUti = 0;
                    for(var n=0;n<vendidos.length;n++){
                        htVen+="<tr>";
                        htVen+="<td>"+(n+1)+"</td>";
                        htVen+="<td>"+(vendidos[n][0])+"</td>";
                        htVen+="<td>"+(vendidos[n][2])+"</td>";
                        htVen+="<td class='text-right'>"+(vendidos[n][3])+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][4]))+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][5]))+"</td>";
                        htVen+="<td class='text-right'>"+(Redondear2(vendidos[n][6]))+"</td>";
                        htVen+="</tr>";
                        valCV+=parseInt(vendidos[n][3]);
                        valCom+=parseFloat(vendidos[n][4]);
                        valVen+=parseFloat(vendidos[n][5]);
                        valUti+=parseFloat(vendidos[n][6]);
                    }
                    var htFVen="<tr>";
                    htFVen+="<td colspan='3' class='text-right'>MONTOS TOTALES:</td>";
                    htFVen+="<td class='text-right'>"+valCV+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valCom))+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valVen))+"</td>";
                    htFVen+="<td class='text-right'>"+(Redondear2(valUti))+"</td>";
                    htFVen+="</tr>";
                    $("#listado").html(htVen);
                    $("#footListado").html(htFVen);

                    var valStock = 0;
                    var valValor = 0;
                    for(var m=0;m<valorizados.length;m++){
                        htVal+="<tr>";
                        htVal+="<td>"+(m+1)+"</td>";
                        htVal+="<td>"+(valorizados[m][1])+"</td>";
                        htVal+="<td class='text-right'>"+(valorizados[m][2])+"</td>";
                        htVal+="<td class='text-right'>"+(Redondear2(valorizados[m][3]))+"</td>";
                        htVal+="</tr>";
                        valStock+=parseInt(valorizados[m][2]);
                        valValor+=parseFloat(valorizados[m][3]);
                    }
                    var htFVal="<tr>";
                    htFVal+="<td colspan='2' class='text-right'>TOTAL DE PRODUCTOS: </td>";
                    htFVal+="<td class='text-right'>"+(valStock)+"</td>";
                    htFVal+="<td class='text-right'>"+(Redondear2(valValor))+"</td>";
                    htFVal+="</tr>";
                    $("#valorizado").html(htVal);
                    $("#footValorizado").html(htFVal);
                    var anios = respJson.anios;
                    var htAnios = "";
                    for(var q=0;q<anios.length;q++){
                        htAnios+="<option value='"+anios[q]+"'>"+anios[q]+"</option>";
                    }
                    $("#cboLiAnio").html(htAnios);
                    $("#cboLiAnio").selectpicker("refresh");
                    $("#cboLiAnio").selectpicker('val',anioAct);
                    CargarGraficoBarra(categorias,avancemeses);
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
        }
    };
}();
jQuery(document).ready(function () {
    AvanceMarca.init();
});