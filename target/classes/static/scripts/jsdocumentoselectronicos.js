var Documentos = function(){
    var fecAct = moment().format('DD-MM-YYYY');
    var btnVerRep = Ladda.create(document.querySelector('#btnVerRep'));
    var table;

    var ListPedidos = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_documentos_electronicos",data:function(d){
                d.fecini = $("#busfecini").val();
                    d.fecfin = $("#busfecfin").val();d.idsuc = $("#cboLiSucursal").val();
                    d.idusu = $("#cboLiUsuario").val();d.est = $("#cboLiEstado").val();d.cli = $("#txtCliente").val();
                    d.idtipo = $("#cboLiTipoDoc").val();
                }},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0,1,2,7]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            },
            "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {

            }
        });
    };

    var imprimir_reporte = function() {
        btnVerRep.start();
        $.ajax({
            type:'POST',
            url:"/documentoselectronicos/saveReportDocElectronicos",
            contentType: "application/json",
            data: JSON.stringify({
                fechaInicio : $("#busfecini").val(),
                fechaFin : $("#busfecfin").val(),
                idSucursal : $("#cboLiSucursal").val(),
                idUsuario : $("#cboLiUsuario").val(),
                estado : $("#cboLiEstado").val(),
                cliente : $("#txtCliente").val(),
                idTipoDocumento : $("#cboLiTipoDoc").val()
            }),
            dataType:'json',
            success: function(respJson) {
                if(respJson.dato=='OK') {
                    var data = respJson.listado;
                    var listado = [["N°","Tipo de documento", "Sucursal","Serie","Correlativo","Cliente","Fecha de generado","Hora de generado","Monto","Valor de resumen","Estado"]];
                    for (var i = 0; i < data.length; i++) {
                        var item = [ (i+1), data[i].nombreTipoDocumento, data[i].nombreSucursal, data[i].serie, data[i].correlativo,
                            data[i].nombreCliente, data[i].fechaGenerado, data[i].horaGenerado, data[i].monto, data[i].valor, data[i].estado];

                        listado.push(item);
                    }
                    var wb = XLSX.utils.book_new();
                    wb.Props = {
                        Title: "SheetJS Tutorial",
                        Subject: "Test",
                        Author: "Red Stapler",
                        CreatedDate: new Date()
                    };
                    wb.SheetNames.push("Listado de documentos");
                    var ws = XLSX.utils.aoa_to_sheet(listado);
                    wb.Sheets["Listado de documentos"] = ws;
                    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                    saveAs(new Blob([convertArrayOctect(wbout)], { type: "application/octet-stream" }), 'cargos.xlsx');
                    btnVerRep.stop();
                    uploadMsnSmall(respJson.msj,'OK');
                }else if(respJson.dato=='VACIO'){
                    btnVerRep.stop();
                    uploadMsnSmall(respJson.msj,'ALERTA');
                }
            },
            error: function (jqXHR, status, error) {
                btnVerRep.stop();
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
    };

    var Iniciando = function(){
        $("#busfecini,#busfecfin").val(fecAct);
        FormatoFecha($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFecha($("#div-busfecfin"),"dd-mm-yyyy");
        $("#btnVerRep").on("click",imprimir_reporte);
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#cboLiSucursal,#cboLiUsuario,#cboLiEstado,#cboLiTipoDoc").on("change",function(){ table._fnDraw(); });
        $("#div-busfecini,#div-busfecfin").on("changeDate",function (){
            if(moment($("#busfecini").val(),"DD-MM-YYYY", true).isValid() &&
                moment($("#busfecfin").val(),"DD-MM-YYYY", true).isValid()){
                table._fnDraw();
            }
        });
        $("#txtCliente").on("keyup",function () {
            table._fnDraw();
        });
        $.ajax({
            type: 'post',
            url: "mant_documentos_electronicos",
            dataType: 'json',
            success: function (data) {
                if (data !== null) {
                    $("#cboLiSucursal").html((data.usu === "1" ? "<option value='0'>--TODOS--</option>":"")+data.htS);
                    $("#cboLiUsuario").html("<option value='0'>--TODOS--</option>"+data.htU);
                    $("#cboLiTipoDoc").html("<option value='0'>--TODOS--</option>"+data.htT);
                    $(".selectpicker").selectpicker("refresh");
                    ListPedidos();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall('¡Se encontró un problema en el servidor!','ERROR');
            }
        });
        $("#viewPedido").on("shown.bs.modal",ModalCompleto);
        $(window).on("resize", function(){
            $("#viewPedido:visible").each(ModalCompleto);
        });
    };

    return {
        init: function () {
            Iniciando();
        }
    };
}();
jQuery(document).ready(function () {
    Documentos.init();
});