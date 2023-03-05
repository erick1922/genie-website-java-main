var Bitacora = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var saveExcel = Ladda.create(document.querySelector('#btnGuardarExcel'));
    var tablaMC = null;
    var tableMU = null;

    var listProd = new Array();
    var listPre1 = new Array();
    var listPre2 = new Array();
    var listPre3 = new Array();
    var listModelo = new Array();
    var listMarca = new Array();
    var listCategoria = new Array();
    var listUnidad = new Array();
    var listStock = new Array();
    var listProveedor = new Array();
    var listCompra = new Array();
    var listDireccion = new Array();
    var listRuc = new Array();

    var ExportToTable = function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        if (regex.test($("#excelfile").val().toLowerCase())) {
            var xlsxflag = false;
            /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#excelfile").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
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
                saveExcel.stop();
                uploadMsnSmall("Sorry! Your browser does not support HTML5!", "ERROR");
            }
        } else {
            saveExcel.stop();
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
                        if(key !== "CODIGO" && key != "VENDEDOR" ){ //&& key != "ADICIONAL" && key != "MOVILIDAD" && key != "PDV"
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

        listProd = new Array();
        listPre1 = new Array();
        listPre2 = new Array();
        listPre3 = new Array();
        listModelo = new Array();
        listMarca = new Array();
        listCategoria = new Array();
        listUnidad = new Array();
        listStock = new Array();
        listProveedor = new Array();
        listCompra = new Array();
        listDireccion = new Array();
        listRuc = new Array();

        for (var i = 0; i < jsondata.length; i++) {
            var prod = $.trim(jsondata[i]['PRODUCTO'])+"";
            var pre1 = $.trim(jsondata[i]['PRECIO1'])+"";
            var pre2 = $.trim(jsondata[i]['PRECIO2'])+"";
            var pre3 = $.trim(jsondata[i]['PRECIO3'])+"";
            var mmodelo = $.trim(jsondata[i]['MODELO'])+"";
            var marca = $.trim(jsondata[i]['MARCA'])+"";
            var categoria = $.trim(jsondata[i]['CATEGORIA'])+"";
            var unidad = $.trim(jsondata[i]['UNIDAD'])+"";
            var stock = $.trim(jsondata[i]['STOCK'])+"";
            var proveedor = $.trim(jsondata[i]['PROVEEDOR'])+"";
            var compra = $.trim(jsondata[i]['COMPRA'])+"";
            var direccion = $.trim(jsondata[i]['DIRECCION'])+"";
            var ruc = $.trim(jsondata[i]['RUC'])+"";

            pre1 = pre1.replace(/,/g, '');
            pre2 = pre2.replace(/,/g, '');
            pre3 = pre3.replace(/,/g, '');
            stock = stock.replace(/,/g, '');
            compra = compra.replace(/,/g, '');

            listProd.push(prod);
            listPre1.push(pre1);
            listPre2.push(pre2);
            listPre3.push(pre3);
            listModelo.push(mmodelo);
            listMarca.push(marca);
            listCategoria.push(categoria);
            listUnidad.push(unidad);
            listStock.push(stock);
            listProveedor.push(proveedor);
            listCompra.push(compra);
            listDireccion.push(direccion);
            listRuc.push(ruc);
        }

        if (listProd.length > 0) {
            //Repositorio.refreshTable($('div.blockMe'));
            CargarProductos();
        }
    };

    var CargarProductos = function(){
        $.ajax({
            type: 'post',
            url: "load_products",
            dataType: 'json',
            data:{"listProd[]":listProd,"listPre1[]":listPre1,"listPre2[]":listPre2,"listPre3[]":listPre3,"listModelo[]":listModelo,
            "listMarca[]":listMarca,"listCategoria[]":listCategoria,"listUnidad[]":listUnidad,"listStock[]":listStock,"idalm":$("#cboAlmacen").val(),
            "listProveedor[]":listProveedor,"listCompra[]":listCompra,"listDireccion[]":listDireccion,"listRuc[]":listRuc},
            success: function (respJson) {
                if(respJson !== null){
                    console.log(respJson);
                    saveExcel.stop();
                }else{
                    saveExcel.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                saveExcel.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfeciniPMV,#busfecfinPMV,#busfeciniMU,#busfecfinMU").val(fecAct);
        FormatoFecha($("#div-busfeciniPMV"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfinPMV"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfeciniMU"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfinMU"),"dd-mm-yyyy");
        $("#vistaPMV").on("click",function () {
            if(tablaMC !== null){
                tablaMC._fnDraw();
            }else {
                tablaMC = $("#tblProductosPMV").dataTable({
                    "bFilter": false,
                    "bSort": false,
                    "bLengthChange": false,
                    "processing": true,
                    "bServerSide": true,
                    "bAutoWidth": false,
                    "bPaginate": false,
                    "bInfo": false,
                    "ajax": {
                        type: 'POST', url: "list_mov_caja", data: function (d) {
                            d.fecini = $("#busfeciniPMV").val();
                            d.fecfin = $("#busfecfinPMV").val();
                            d.idsuc = $("#cboSucursalPMV").val();
                        }
                    },
                    "aoColumnDefs": [
                        {'sClass': "centrado", 'aTargets': [0,2,3]}
                    ],
                    "fnDrawCallback": function (oSettings) {
                        // $(".mensa").tooltip();
                    }
                });
            }
        });
        $("#vistaMU").on("click",function(){
            if(tableMU !== null){
                tableMU._fnDraw();
            }else {
                tableMU = $("#tblProductosMU").dataTable({
                    "bFilter": false,
                    "bSort": false,
                    "bLengthChange": false,
                    "processing": true,
                    "bServerSide": true,
                    "bAutoWidth": false,
                    "bInfo": false,
                    "ajax": {
                        type: 'POST', url: "list_accesos_sistema", data: function (d) {
                            d.fecini = $("#busfeciniMU").val();
                            d.fecfin = $("#busfecfinMU").val();
                            d.idusu = $("#cboSucursalMU").val();
                        }
                    },
                    "aoColumnDefs": [
                        {'sClass': "text-center", 'aTargets': [4]}
                    ],
                    "fnDrawCallback": function (oSettings) {
                        // $(".mensa").tooltip();
                    }
                });
            }
        });
        $.ajax({
            type: 'post',
            url: "mant_generales",
            dataType: 'json',
            success: function (respJson) {
                if(respJson !== null){
                    $("#cboAlmacen").html("<option value='0'>--SELECCIONE--</option>"+respJson.htA);
                    $("#cboSucursalPMV").html("<option value='T'>--TODOS--</option>"+respJson.htS);
                    $(".selectpicker").selectpicker("refresh");
                    $("#vistaPMV").click();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#btnGuardarExcel").on("click",function () {
            saveExcel.start();
            ExportToTable();
        });
    };

    return {
        init: function () {
            Iniciando();
        }
    };

}();
jQuery(document).ready(function () {
    Bitacora.init();
});