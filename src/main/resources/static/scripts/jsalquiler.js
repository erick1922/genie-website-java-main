var Pedido = function(){
    var cargando = Ladda.create(document.querySelector('#btnGuardarAlquiler'));
    var agregar = Ladda.create(document.querySelector('#btnAddHabitacion'));
    var abonar = Ladda.create(document.querySelector('#btnAddPago'));
    var cliente = Ladda.create(document.querySelector('#btnGuardarCliente'));
    var ventas = Ladda.create(document.querySelector('#btnGuardarVenta'));
    var facturar = Ladda.create(document.querySelector('#btnFacturaPago'));
    var addProducto = Ladda.create(document.querySelector('#btnGuardarPS'));
    var validar = Ladda.create(document.querySelector('#btnValidarDNI'));
    var validarRuc = null;//Ladda.create(document.querySelector('#btnValidarRUC'));
    var culminar =  Ladda.create(document.querySelector('#btnCulminarAlquiler'));
    var table = null;
    var fecAct = moment().format('DD-MM-YYYY');
    var tableHuesped = null;
    var tableCliente = null;
    var tableProducto = null;
    var liHabitacion = new Array();//NO BORRAR.
    var dethabitacion = new Array();
    var detdeshabitacion = new Array();
    var detfecinicio = new Array();
    var detgarantia = new Array();
    var detfecfin = new Array();
    var dethoraini = new Array();
    var dethorafin = new Array();
    var detcantidad = new Array();
    var detprecio = new Array();
    var dettiempo = new Array();
    var idtiempo = new Array();
    var dethuesped = new Array();
    var idHuespedes = new Array();

    var liidpro = new Array();
    var lidescpro = new Array();
    var licantidad = new Array();
    var liprecio = new Array();
    var litotal = new Array();
    var listock = new Array();

    var accionCliente = "";
    var idhotelSel = "";
    var idAlqDet = 0;
    var idAlqSel = 0;

    var liMontoGarDev = new Array();
    var liIdGarDev = new Array();
    var liEstGarDev = new Array();

    var accionCulRen = "C";

    var liTiempoFiltro = new Array();
    var btnViewDeta = null;
    var SaldoPendiente = 0.00;

    var ListProductos = function(){
        tableProducto = $("#tblProductos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_search_productos",data:function(d){d.desc = $("#txtDescCliente").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [4]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListAlquileres = function(){
        table = $("#tblPedidos").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {type:'POST',url:"list_alquileres",data:function(d){
                    d.idsuc = $("#cboLiSucursal").val();
                    d.desc = $("#txtDesc").val();
                    d.est = $("#cboEstAlquiler").val();
                }},
            "aoColumnDefs": [
                {'sClass':"centrado texto-tabla",'aTargets': [0]},
                {'sClass':"texto-tabla",'aTargets': [1,2,3,4,5,6,7]},
                {'sClass':"centrado boton-tabla",'aTargets': [8]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListClientes = function(){
        tableCliente = $("#tblCliente").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_huespedes_search",data:function(d){
                    d.tipo = "N";
                    d.desc = $("#txtDescCliente").val();
                }
            },
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ListHuespedes = function(){
        tableHuesped = $("#tblHuesped").dataTable({
            "bFilter": false,
            "bSort": false,
            "bLengthChange": false,
            "processing": true,
            "bServerSide" : true,
            "bAutoWidth": false,
            "ajax" : {
                type:'POST',url:"list_huespedes_search",data:function(d){
                    d.tipo = "N";
                    d.desc = $("#txtDescHuesped").val();}},
            "aoColumnDefs": [
                {'sClass':"centrado",'aTargets': [0]},
                {'sClass':"centrado boton-tabla",'aTargets': [6]},
                {'bSearchable': false, 'aTargets': [0,1,2,3]}
            ],
            "fnDrawCallback":function(oSettings){
                $(".mensa").tooltip();
            }
        });
    };

    var ValidarPago = function(){
        if( $("#tipoppago").val() === "" || $("#tipoppago").val() === "0" ){
            uploadMsnSmall("No ha Seleccionado Tipo Pago.","ALERTA");
            abonar.stop();
            return false;
        }
        if($("#txtMonto").val()==="" || parseFloat($("#txtMonto").val())<=0){
            uploadMsnSmall("Monto Incorrecto","ALERTA");
            abonar.stop();
            return false;
        }
        if( $("#idabo").val() === "" || $("#idabo").val() === "0"){
            uploadMsnSmall("Numero de Alquiler Incorrecta","ALERTA");
            abonar.stop();
            return false;
        }
        if(!moment($("#fecpago").val(),"DD-MM-YYYY", true).isValid()){
            uploadMsnSmall("Fecha Pago No es Valida","ALERTA");
            abonar.stop();
            return false;
        }
        return true;
    };

    var ValidarAlquiler = function(){
        if( $("#idcli").val() === "" || $("#idcli").val() === "0" ){
            uploadMsnSmall("No ha Seleccionado Cliente.","ALERTA");
            cargando.stop();
            return false;
        }
        if( $("#txtnum").val() === "" || $("#txtnum").val().length < 8){
            uploadMsnSmall("Numero de Pedido Incorrecta","ALERTA");
            cargando.stop();
            return false;
        }
        /* if(!moment($("#fecregped").val(),"DD-MM-YYYY", true).isValid()){
             uploadMsnSmall("Fecha No es Valida","ALERTA");
             cargando.stop();
             return false;
         }*/
        if(dethabitacion.length === 0){
            uploadMsnSmall("No ha agregado ninguna habitacion","ALERTA");
            cargando.stop();
            return false;
        }
        if( parseFloat($("#txtAdelanto").val()) > parseFloat($("#txtTotal").val())){
            uploadMsnSmall("El monto por adelanto debe de ser menor o igual que el monto a pagar.","ALERTA");
            cargando.stop();
            return false;
        }
        /*for (var i = 0; i < LisIdPro.length; i++) {
            var idpro = parseFloat(LisIdPro[i]);
            var cant = parseFloat(LisCant[i]);
            var prec = parseFloat(LisPreCom[i]);
            if(idpro <= 0){
                uploadMsnSmall("Producto Incorrecto en el Item NÂ° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(cant <= 0){
                uploadMsnSmall("Cantidad Incorrecta en el Item NÂ° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }*/
        return true;
    };

    var ValidarVenta = function(){
        if( !moment($("#fecventa").val(),"DD-MM-YYYY", true).isValid() ){
            uploadMsnSmall("Fecha incorrecta.","ALERTA");
            cargando.stop();
            return false;
        }

        if(liidpro.length === 0){
            uploadMsnSmall("No ha agregado ningun Producto","ALERTA");
            cargando.stop();
            return false;
        }
        for (var i = 0; i < liidpro.length; i++) {
            var idpro = parseFloat(liidpro[i]);
            var cant = parseFloat(licantidad[i]);
            var prec = parseFloat(liprecio[i]);
            if(idpro <= 0){
                uploadMsnSmall("Producto Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(cant <= 0){
                uploadMsnSmall("Cantidad Incorrecta en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
            if(prec <= 0){
                uploadMsnSmall("Precio Venta Incorrecto en el Item N° "+(i+1).toString(),"ALERTA");
                cargando.stop();
                return false;
                break;
            }
        }
        return true;
    };

    var ValidarItem = function(){
        if($("#idhabdetalle").val()==="" || $("#idhabdetalle").val() === "0"){
            uploadMsnSmall("No ha Seleccionado Habitacion","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtPrecio").val()==="" || parseFloat($("#txtPrecio").val())<=0){
            uploadMsnSmall("Precio Incorrecto","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtCantidad").val()==="" || parseFloat($("#txtCantidad").val())<=0){
            uploadMsnSmall("Cantidad Dias Incorrecta","ALERTA");
            agregar.stop();
            return false;
        }
        if($("#txtTotPre").val()==="" || parseFloat($("#txtTotPre").val())<=0){
            uploadMsnSmall("Total Incorrecto","ALERTA");
            agregar.stop();
            return false;
        }
        /*if(parseFloat($("#txtPreven").val())<pre3){
            uploadMsnSmall("El precio de venta minimo es "+pre3,"ALERTA");
            agregar.stop();
            return false;
        }*/
        return true;
    };

    var Limpiar = function(){
        dethabitacion = new Array();
        detdeshabitacion = new Array();
        detfecinicio = new Array();
        detgarantia = new Array();
        detfecfin = new Array();
        dethoraini = new Array();
        dethorafin = new Array();
        detcantidad = new Array();
        detprecio = new Array();
        idtiempo = new Array();
        dettiempo = new Array();
        dethuesped = new Array();
        idHuespedes = new Array();

        $("#observaciones").val("");
        $("#tblDetalles").html("");
        $("#txtcli").val("");
        $("#idcli").val("");
        $("#txtAdelanto").val("");
        $("#txtSubTotal").val("0.00");
        $("#txtIgv").val("0.00");
        $("#txtTotal").val("0.00");
        var valTie = 0;
        if(liTiempoFiltro.length > 0){
            valTie = liTiempoFiltro[0].id;
        }
        $("#tiempo").selectpicker('val',valTie);
        var hora = moment().format('HH:mm:ss');
        $("#txtHoraIng").val(hora);
        $('#div-fecing').datepicker('update',fecAct);
        $('#div-fecfin').datepicker('update',fecAct);
        $("#tiempo").change();
    };

    var LimpiarVenta = function(){
        liidpro = new Array();
        lidescpro = new Array();
        licantidad = new Array();
        liprecio = new Array();
        litotal = new Array();
        listock = new Array();
        $("#tblDetVenta").html("");
        $("#txtTotalVenta").val("0.00");
    };

    var new_record = function(){
        $.each($("#frmCliente input"), function () {
            $(this).val("");
            estilo_error(false, this);
        });
        $("#titulo").html("Nuevo cliente");
        $("#accion").val("save");
        $("#id").val("0");
        $("#fecing").val(fecAct);
        $("#estado").val("H");
        $("#modalCliente").modal("show");
    };

    var save = function(){
        cargando.start();
        $.ajax({
            type: 'post',
            url: "save_alquiler",
            dataType: 'json',
            data:{idcli:$("#idcli").val(),txtnum:$("#txtnum").val(),moneda:$("#moneda").val(),idsuc:$("#cboLiHotel").val(),
                "idhabi[]":dethabitacion,"idcan[]":detcantidad,"idpre[]":detprecio,"tie[]":idtiempo,formapago : $("#formaPagoAlq").val(),
                "horaini[]":dethoraini,"horafin[]":dethorafin,"detfecfin[]":detfecfin,"detfecinicio[]":detfecinicio,"detgarantia[]":detgarantia,
                "dethuespedes[]":idHuespedes,accion:"GUA", observaciones:$("#observaciones").val(), adelanto : $("#txtAdelanto").val()},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cargando.stop();
                        $("#modalAlquiler").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#estado",true);}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#desc");uploadMsnSmall("No ha seleccionado un hotel.",'ALERTA');}
                                if(respJson.listado[i] === "E4"){uploadMsnSmall("Ubicación incorrecta.",'ALERTA');}
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
        // Limpiar();
        $.ajax({
            type:'post',
            url: "view_alquiler",
            dataType: 'json',
            data:{id:$(elem).attr("id").split("_")[2]},
            success:function(respJson){
                if(respJson!==null){
                    // $("#div-estado").show();
                    // $("#id").val(respJson.id);
                    // $("#desc").val(respJson.descripcion);
                    // $("#ubicacion").selectpicker('val',respJson.ubicacion);
                    //$("#estado").selectpicker('val',respJson.estado);
                    /// $("#titulo").html("Modificar Alquiler");
                    // $("#accion").val("update");

                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var delete_pago = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el pago?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    var idd = $(elem).attr("id").split("_")[1];
                    $.ajax({
                        type: 'post',
                        url: 'delete_pago',
                        data: {"id":idd},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    ListarPagosxAlquiler();
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

    var ObtenerNumAlq = function(){
        Limpiar();
        var fec = moment().format('DD-MM-YYYY');
        $.ajax({
            type: 'post',
            url: "init_alquiler",
            dataType: 'json',
            data:{idh:$("#cboLiHotel").val(),"fecact":fec},
            success:function(respJson){
                if(respJson!==null){
                    $("#txtCantidad").val("1");
                    $("#idhabdetalle").val("0");
                    $("#txtnum").val(respJson.num);
                    $("#txtven").val(respJson.nombres);
                    liHabitacion = respJson.lihab;
                    CargarCuadroHabitaciones();
                    RecargarDetalles();
                    $("#modalAlquiler").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var SelCli = function (a) {
        var fil = $(a).parents('tr');
        if (accionCliente === "C") {
            $("#txtcli").val($(fil).find("td").eq(1).text());
            $("#idcli").val($(a).attr("data-id"));
            $("#modalSearchCliente").modal("hide");
        }else if(accionCliente === "H"){
            var posicionH = $("#posHuesped").val();
            var listaid = (idHuespedes[posicionH]).split(",");
            var existe = "0";
            for(var i=0;i<listaid.length;i++){
                if(listaid[i] === $(a).attr("data-id")){
                    existe = "1";
                    i = listaid.length + 2;
                }
            }
            if(existe === "0") {
                if (dethuesped.length > 0) {
                    dethuesped[posicionH] = dethuesped[posicionH] === "" ? $(fil).find("td").eq(1).text() : ( dethuesped[posicionH] + "," + $(fil).find("td").eq(1).text() );
                } else {
                    dethuesped[posicionH] = $(fil).find("td").eq(1).text();
                }
                if (idHuespedes.length > 0) {
                    idHuespedes[posicionH] = idHuespedes[posicionH] === "" ? $(a).attr("data-id") : (idHuespedes[posicionH] + "," + $(a).attr("data-id") );
                } else {
                    idHuespedes[posicionH] = $(a).attr("data-id");
                }
                RecargarDetalles();
                $("#modalSearchHuesped").modal("hide");
            }else {
                uploadMsnSmall("El huesped ya esta en la lista.","ALERTA");
            }
        }
    };

    var CargarCuadroHabitaciones = function () {
        var liPisos = new Array();
        for(var i=0;i<liHabitacion.length;i++){
            var objpiso = liHabitacion[i].piso;
            var esta = "0";
            for(var j=0;j<liPisos.length;j++){
                if(objpiso.id === liPisos[j].id){
                    esta="1";j=liPisos.length+2;
                }
            }
            if(esta === "0"){liPisos.push(objpiso);}
        }
        var html = "";
        for(var m=0;m<liPisos.length;m++){
            html+="<div class='col-lg-12 col-md-12' style='padding-bottom:0px!important;'>";
            for(var n=0;n<liHabitacion.length;n++){
                if(liPisos[m].id === liHabitacion[n].piso.id){
                    html+=" <button id='hab_"+liHabitacion[n].id+"' data-id='"+liHabitacion[n].id+"' "+(liHabitacion[n].estado === 'H' ? " onclick='Pedido.AddHabitacion(this);' " : "" )+"  class='btn "+(liHabitacion[n].estado === "H" ? "btn-primary" : "btn-danger" )+" btn-float mb-3' type='button'>";
                    html+="<div class='d-flex flex-column mt-2 mb-0'>";
                    html+="<i class='fa fa-users mb-2'></i> ";
                    html+="<span style='font-size: 10px!important;'>"+liHabitacion[n].tipoHabitacion.nombre+" ("+liHabitacion[n].numHabitacion+")</span>";
                    html+="</div>";
                    html+="</button>";
                }
            }
            html+="</div>";
        }
        $("#contHabitacion").html(html);
    };

    var AddHabitacion = function(a){
        ///RefreshTable($("#div-deta-alquiler"));
        var fec = moment($("#fecinicio").val(),"DD-MM-YYYY").format("DD-MM-YYYY");
        var idhab = $(a).attr("data-id");
        var tipohabiSel = "";
        for(var i=0;i<liHabitacion.length;i++){
            if(liHabitacion[i].id == idhab){
                tipohabiSel = liHabitacion[i];
                i = liHabitacion.length +2;
            }
        }
        var fecEntrada = moment($("#fecinicio").val(),"DD-MM-YYYY");
        var fecSalida =  moment($("#fecfin").val(),"DD-MM-YYYY");
        var diferencia = fecSalida.diff(fecEntrada,"days");
        $("#idhabdetalle").val(idhab);
        $("#txtDescHabi").val(tipohabiSel.numHabitacion + " - "+tipohabiSel.tipoHabitacion.nombre);
    };

    var AgregarDetalle = function () {
        var idh = $("#idhabdetalle").val();
        var undTie = $('option:selected', $("#tiempo")).attr('data-und');
        dethabitacion.push(idh);
        detdeshabitacion.push($("#txtDescHabi").val());
        detfecinicio.push($("#fecinicio").val());
        detgarantia.push("");
        dethoraini.push($("#txtHoraIng").val());
        dettiempo.push(undTie);
        idtiempo.push($("#tiempo").val());
        if(dethuesped.length >= 1){
            dethuesped.push("");
            idHuespedes.push("");
        } else {
            dethuesped.push($("#txtcli").val());
            idHuespedes.push($("#idcli").val());
        }
        detcantidad.push( parseInt($("#txtCantidad").val()) );
        detprecio.push($("#txtPrecio").val());

        if( undTie === "D"){
            var fefi = moment($("#fecinicio").val(),"DD-MM-YYYY").add(parseInt($("#txtCantidad").val()),'days');
            detfecfin.push(fefi.format('DD-MM-YYYY'));
            dethorafin.push($("#txtHoraIng").val());
        }else if(undTie === "H"){
            detfecfin.push($("#fecinicio").val());
            dethorafin.push(moment().add('hours',parseInt($("#txtCantidad").val())).format('HH:mm:ss'));
        }else if(undTie === "M"){
            var fefimes = moment($("#fecinicio").val(),"DD-MM-YYYY").add(parseInt($("#txtCantidad").val()),'months');
            detfecfin.push(fefimes.format('DD-MM-YYYY'));
            dethorafin.push($("#txtHoraIng").val());
        }
        var html = "";
        var monto = 0.00;
        for(var i=0;i<dethabitacion.length;i++){
            var descrtt = "";
            if(dettiempo[i] === "D"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "DIAS" : "DIA");
            }else if(dettiempo[i] === "H"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "HORAS" : "HORA");
            }else if(dettiempo[i] === "M"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "MESES" : "MES");
            }
            html+="<tr id='fil_hab_"+dethabitacion[i]+"'>";
            html+="<td class='del-padding-celda'>"+detdeshabitacion[i]+"</td>";
            if(dethuesped.length > 0){
                var listita = (dethuesped[i]).split(",");
                html+="<td class='del-padding-celda' nowrap >";
                for(var vb=0;vb<listita.length;vb++){
                    if( (listita.length - 1) === vb){
                        html+="<span>"+listita[vb]+  ( listita[vb] !== ""  ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='msndelhuespeddet' data-pos='"+i+"' data-poshue='"+vb+"' data-toggle='tooltip' data-placement='left' title='Quitar huesped' onclick='Pedido.QuitarHuespedDet(this);' ><i class='glyphicon glyphicon-trash' style='color: red;'></i></a>": "" )  +"</span>";
                    }else {
                        html+="<span>"+listita[vb]+  ( listita[vb] !== ""  ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='msndelhuespeddet' data-pos='"+i+"' data-poshue='"+vb+"' data-toggle='tooltip' data-placement='left' title='Quitar huesped' onclick='Pedido.QuitarHuespedDet(this);' ><i class='glyphicon glyphicon-trash' style='color: red;'></i></a>": "" )  +"</span><br>";
                    }
                }
                html+="</td>";
            } else {
                html+="<td nowrap >"+dethuesped[i]+"</td>";
            }
            html+="<td class='del-padding-celda' nowrap >"+detfecinicio[i]+" "+dethoraini[i]+"</td>";
            html+="<td class='del-padding-celda' nowrap >"+detfecfin[i]+" "+dethorafin[i]+"</td>";
            html+="<td class='del-padding-celda'>"+detcantidad[i]+" "+descrtt+"</td>";
            html+="<td class='del-padding-celda text-right'>"+Redondear2(detprecio[i])+"</td>";
            html+="<td class='del-padding-celda text-center py-1 px-2'>"+" <input type='text' name='txtGarantia_"+i+"' id='txtGarantia_"+i+"' class='form-control input-sm input_garantias'  value='"+detgarantia[i]+"'>  </td>";
            html+="<td class='centrador'>";
            html+="<button type='button' id='addhuespeded_"+dethabitacion[i]+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' title='Agregar Huespedes en Habitación: "+detdeshabitacion[i]+" ' onclick='Pedido.VerModalHuespedes(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-success mensaDeta'> <i class='glyphicon glyphicon-user'></i> </button>";
            html+="<button type='button' id='delhab_"+dethabitacion[i]+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' title='Quitar Habitación: "+detdeshabitacion[i]+" ' onclick='Pedido.Quitar_habitacion(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger mensaDeta'> <i class='glyphicon glyphicon-trash'></i> </button></td>";
            html+="</tr>";
            monto+=(parseFloat(detprecio[i])*parseInt(detcantidad[i]));
            if(detgarantia[i] !== ""){
                if(parseFloat(detgarantia[i]) > 0){
                    monto+=parseFloat(detgarantia[i]);
                }
            }
        }
        $("#tblDetalles").html(html);
        for(var j=0;j<liHabitacion.length;j++){
            if(liHabitacion[j].id == idh){
                liHabitacion[j].estado = "A";
            }
        }
        $(".mensaDeta").tooltip();
        $(".msndelhuespeddet").tooltip();
        var subtotal = monto/1.18;
        var igv = monto - subtotal;
        CargarCuadroHabitaciones();
        $("#txtTotal").val(Redondear2(monto));
        $("#txtSubTotal").val(Redondear2(subtotal));
        $("#txtIgv").val(Redondear2(igv));
        agregar.stop();
        LimpiarDetalle();
        NumeroDosDecimales($(".input_garantias"));

        $(".input_garantias").each(function(e){
            $(this).on("keyup",function(e){
                var pos = $(this).attr("id").split("_")[1];
                detgarantia[pos] = $(this).val();
                CargarTotales();
            });
        });
    };

    var RecargarDetalles = function () {
        var html = "";
        for(var i=0;i<dethabitacion.length;i++){
            var descrtt = "";
            if(dettiempo[i] === "D"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "DIAS" : "DIA");
            }else if(dettiempo[i] === "H"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "HORAS" : "HORA");
            }else if(dettiempo[i] === "M"){
                descrtt = (parseInt(detcantidad[i]) > 1 ? "MESES" : "MES");
            }
            html+="<tr id='fil_hab_"+dethabitacion[i]+"'>";
            html+="<td class='del-padding-celda'>"+detdeshabitacion[i]+"</td>";
            if(dethuesped.length > 0){
                var listita = (dethuesped[i]).split(",");
                html+="<td class='del-padding-celda' nowrap >";
                for(var vb=0;vb<listita.length;vb++){
                    if( (listita.length - 1) === vb){
                        html+="<span>"+listita[vb]+  ( listita[vb] !== ""  ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='msndelhuespeddet'  data-pos='"+i+"' data-poshue='"+vb+"' data-toggle='tooltip' data-placement='left' title='Quitar Huesped' onclick='Pedido.QuitarHuespedDet(this);' ><i class='glyphicon glyphicon-trash' style='color: red;'></i></a>": "" )  +"</span>";
                    }else {
                        html+="<span>"+listita[vb]+  ( listita[vb] !== ""  ? "&nbsp;&nbsp;&nbsp;<a href='javascript:void(0);' class='msndelhuespeddet'  data-pos='"+i+"' data-poshue='"+vb+"' data-toggle='tooltip' data-placement='left' title='Quitar Huesped' onclick='Pedido.QuitarHuespedDet(this);' ><i class='glyphicon glyphicon-trash' style='color: red;'></i></a>": "" )  +"</span><br>";
                    }
                }
                html+="</td>";
            } else {
                html+="<td nowrap >"+dethuesped[i]+"</td>";
            }
            html+="<td class='del-padding-celda' nowrap  >"+detfecinicio[i]+" "+dethoraini[i]+"</td>";
            html+="<td class='del-padding-celda' nowrap  >"+detfecfin[i]+" "+dethorafin[i]+"</td>";
            html+="<td class='del-padding-celda'>"+detcantidad[i]+" "+descrtt+"</td>";
            html+="<td class='del-padding-celda text-right'>"+Redondear2(detprecio[i])+"</td>";
            html+="<td class='del-padding-celda text-center py-1 px-2'> <input type='text' name='txtGarantia_"+i+"' id='txtGarantia_"+i+"' class='form-control input-sm input_garantias'  value='"+detgarantia[i]+"'> </td>";
            html+="<td class='centrador' style='vertical-align: middle!important;'>";
            html+="<button type='button' id='addhuespeded_"+dethabitacion[i]+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' title='Agregar huespedes en habitación: "+detdeshabitacion[i]+" ' onclick='Pedido.VerModalHuespedes(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-success mensaDeta'> <i class='glyphicon glyphicon-user'></i> </button>";
            html+="<button type='button' id='delhab_"+dethabitacion[i]+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' title='Quitar Habitación: "+detdeshabitacion[i]+" ' onclick='Pedido.Quitar_habitacion(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger mensaDeta'> <i class='glyphicon glyphicon-trash'></i> </button></td>";
            html+="</tr>";
        }
        if(dethabitacion.length === 0){
            html+="<tr><td colspan='8' class='text-center'>Aún no ha agregado habitaciones</td></tr>";
        }
        $("#tblDetalles").html(html);
        $(".mensaDeta").tooltip();
        $(".msndelhuespeddet").tooltip();
        NumeroDosDecimales($(".input_garantias"));

        $(".input_garantias").each(function(e){
            $(this).on("keyup",function(e){
                var pos = $(this).attr("id").split("_")[1];
                detgarantia[pos] = $(this).val();
                CargarTotales();
            });
        });
    };

    var QuitarHuespedDet = function (a) {
        var pos1 = parseInt($(a).attr("data-pos"));
        var pos2 = parseInt($(a).attr("data-poshue"));

        var listado = (dethuesped[pos1]).split(",");
        var listadoIds = (idHuespedes[pos1]).split(",");

        listado.splice(pos2,1);
        listadoIds.splice(pos2,1);
        var cadena = "";
        var ids = "";
        for(var i=0;i<listado.length;i++){
            cadena+=listado[i]+",";
            ids+=listadoIds[i]+",";
        }
        if(cadena.length > 0){
            cadena = cadena.substring(0, (cadena.length-1) );
        }
        if(ids.length > 0){
            ids = ids.substring(0, (ids.length-1) );
        }
        console.log(dethuesped[pos1]);
        dethuesped[pos1] = cadena;
        idHuespedes[pos1] = ids;
        RecargarDetalles();
    };

    var CargarTotales = function () {
        var monto = 0.00;
        for(var i=0;i<dethabitacion.length;i++){
            monto+=(parseFloat(detprecio[i])*parseFloat(detcantidad[i]));
            if(detgarantia[i] !== ""){
                if(parseFloat(detgarantia[i]) > 0){
                    monto+=parseFloat(detgarantia[i]);
                }
            }
        }
        var subtotal = monto/1.18;
        var igv = monto - subtotal;
        $("#txtTotal").val(Redondear2(monto));
        $("#txtSubTotal").val(Redondear2(subtotal));
        $("#txtIgv").val(Redondear2(igv));
    };

    var LimpiarDetalle = function(){
        $("#idhabdetalle").val("");
        $("#txtDescHabi").val("");
        var valTie = 0;
        if(liTiempoFiltro.length > 0){
            valTie = liTiempoFiltro[0].id;
        }
        $("#tiempo").selectpicker('val',valTie);
        var hora = moment().format('HH:mm:ss');
        $("#txtHoraIng").val(hora);
        $('#div-fecing').datepicker('update',fecAct);
        $('#div-fecfin').datepicker('update',fecAct);
        $("#txtCantidad").val("1");
        $("#txtPrecio").val("");
        $("#txtTotPre").val("");
        $("#tiempo").change();
    };

    var Quitar_habitacion = function (a) {
        var idhab = $(a).attr("id").split("_")[1];
        var pos = $(a).attr("data-pos");
        $("#fil_hab_"+idhab).remove();
        for(var j=0;j<liHabitacion.length;j++){
            if(liHabitacion[j].id == idhab){
                liHabitacion[j].estado = "H";
            }
        }
        dethabitacion.splice(pos,1);
        detdeshabitacion.splice(pos,1);
        detfecinicio.splice(pos,1);
        detfecfin.splice(pos,1);
        detgarantia.splice(pos,1);
        dethoraini.splice(pos,1);
        dethorafin.splice(pos,1);
        idtiempo.splice(pos,1);
        dettiempo.splice(pos,1);
        dethuesped.splice(pos,1);
        idHuespedes.splice(pos,1);
        detcantidad.splice(pos,1);
        detprecio.splice(pos,1);
        CargarCuadroHabitaciones();
        RecargarDetalles();
        CargarTotales();
    };

    var ValidarTiempo = function (a) {
        var tt = $('option:selected', $(a)).attr('data-und');
        var hora = moment().format('HH:mm:ss');
        $("#txtHoraIng").val(hora);
        var cant = parseInt($("#txtCantidad").val());
        if(tt === "D"){
           // $("#txtCantidad").attr("readonly","readonly");
            $("#div-inicio").show();
            $("#div-fin").show();
            $('#div-fecing').datepicker('update',fecAct);
            $('#div-fecfin').datepicker('update',fecAct);
            $("#div-horaing").hide();
        }else if(tt === "H"){
            //$("#txtCantidad").removeAttr("readonly");
            $("#div-inicio").hide();
            $("#div-fin").hide();
            $("#div-horaing").show();
            $("#div-cantidad").show();
        }else if(tt === "M"){
           // $("#txtCantidad").attr("readonly","readonly");
            $("#div-inicio").show();
            $("#div-fin").show();
            var fe1 = moment($("#fecinicio").val(),"DD-MM-YYYY").add(cant,'months');
            $('#div-fecfin').datepicker('update',fe1.format('DD-MM-YYYY'));
            $("#div-horaing").hide();
        }
       // RefreshTable($("#div-deta-alquiler"));
        var fec = moment($("#fecinicio").val(),"DD-MM-YYYY").format("DD-MM-YYYY");
        var idhab = $("#idhabdetalle").val();
        var tipohabiSel = "";
        for(var i=0;i<liHabitacion.length;i++){
            if(liHabitacion[i].id == idhab){
                tipohabiSel = liHabitacion[i];
                i = liHabitacion.length +2;
            }
        }
    };

    var ConstruirEstadoGarantia = function (pos) {
        var html = "<select class='form-control input-sm selectpicker selectgarantia' name='cboEstGarantia_"+pos+"' id='cboEstGarantia_"+pos+"' data-pos='"+pos+"' onchange='Pedido.SeleccionarEstadoGarantia(this);' >";
        html+="<option value='DT'>Devolución total</option>";
        html+="<option value='DP'>Devolución parcial</option>";
        html+="</select>";
        return html;
    };

    var checkPanelAlquiler = function(a){
        var tab = $(a).attr("id");
        if(tab === "tab_cul_alq"){
            $("#modal_dialog_termino").css("width","50%");
            accionCulRen = "C";
        }else if(tab === "tab_ren_alq"){
            $("#modal_dialog_termino").css("width","90%");
            accionCulRen = "R";
        }
    };

    var SeleccionarEstadoGarantia = function(a){
        var pos = $(a).attr("data-pos");
        var val = $(a).val();
        if(val === "DT"){
            $("#txt_mon_dev_gar_"+pos).attr("readonly","readonly");
            $("#txt_mon_dev_gar_"+pos).addClass("block_input");
            $("#txt_mon_dev_gar_"+pos).val($("#txt_mon_dev_gar_"+pos).attr("data-mon"));
        }else if(val === "DP"){
            $("#txt_mon_dev_gar_"+pos).removeAttr("readonly");
            $("#txt_mon_dev_gar_"+pos).removeClass("block_input");
            $("#txt_mon_dev_gar_"+pos).focus();
        }
        liEstGarDev[pos] = val;
    };

    var CargarTotalRenovacion = function(){
        var total = 0.00;
        for(var i=0;i<detcantidad.length;i++){
            total+=(parseInt(detcantidad[i])*parseFloat(detprecio[i]));
        }
        $("#txtTotalRen").val(Redondear2Decimales(total));
    };

    var QuitarHabitacionRenovar = function(a){
        var pos = $(a).attr("data-pos");
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea quitar la habitacion?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    dethabitacion.splice(pos,1);
                    detdeshabitacion.splice(pos,1);
                    detfecinicio.splice(pos,1);
                    detfecfin.splice(pos,1);
                    detgarantia.splice(pos,1);
                    dethoraini.splice(pos,1);
                    dethorafin.splice(pos,1);
                    idtiempo.splice(pos,1);
                    dettiempo.splice(pos,1);
                    dethuesped.splice(pos,1);
                    idHuespedes.splice(pos,1);
                    detcantidad.splice(pos,1);
                    detprecio.splice(pos,1);

                    CargarTablaRenovacion();
                }
            }
        });
    };

    var CargarTablaRenovacion = function(){
        var html = "";
        for(var i=0;i<dethabitacion.length;i++){
            var liHues = new Array();
            var nomHues = new Array();
            if(idHuespedes[i] !== ""){
                var arr = (idHuespedes[i]).split(",");
                var nomarr = (dethuesped[i]).split(",");
                liHues = arr;
                nomHues = nomarr;
            }
            html+="<tr>";
            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(i+1)+"</td>";
            html+="<td class='del-padding-celda' rowspan='"+liHues.length+"'>"+ detdeshabitacion[i]+"</td>";

            html+="<td class='del-padding-celda text-center py-1 px-2' rowspan='"+liHues.length+"'>";
            html+="<div id='div_fecinialq_"+i+"' class='input-group date'>";
            html+="<input name='fecinialq_"+i+"' id='fecinialq_"+i+"' class='form-control input-sm' type='text' value='"+detfecinicio[i]+"' readonly=''>";
            html+="<span class='input-group-addon'>";
            html+="<i class='fa fa-calendar'></i>";
            html+="</span>";
            html+="</div>";
            html+="</td>";

            html+="<td class='del-padding-celda text-center py-1 px-2' rowspan='"+liHues.length+"'>";
            html+="<div id='div_fecfinalq_"+i+"' class='input-group date'>";
            html+="<input name='fecfinalq_"+i+"' id='fecfinalq_"+i+"' class='form-control input-sm' type='text' value='"+detfecfin[i]+"' readonly=''>";
            html+="<span class='input-group-addon'>";
            html+="<i class='fa fa-calendar'></i>";
            html+="</span>";
            html+="</div>";
            html+="</td>";

            //html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>("+detalles[i].cantidad+") "+(detalles[i].tiempo !== null ? detalles[i].tiempo.undMedida : "")+"</td>";

            html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'>";
            html+="<input type='text' class='touchspin3' name='txtcantidadren_"+i+"' id='txtcantidadren_"+i+"' value='"+detcantidad[i] +"' readonly='readonly'>";
            html+="</td>";

            html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'>";
            html+="<input type='text' class='form-control input-sm' name='txtpreuniren_"+i+"' id='txtpreuniren_"+i+"' value='"+Redondear2Decimales(detprecio[i]) +"'>";
            html+="</td>";

            html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'><span id='sp_pretotren_"+i+"'>"+Redondear2Decimales(parseFloat(detprecio[i])*parseInt(detcantidad[i]))+"</span></td>";

            if(liHues.length > 1){
                html+="<td class='del-padding-celda'>"+nomHues[0]+"</td>";
                html+="<td class='centrado boton-tabla' rowspan='"+liHues.length+"' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+i+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion' onclick='Pedido.QuitarHabitacionRenovar(this);' > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                html+="</tr>";
                for(var j=1;j<liHues.length;j++){
                    html+="<tr>";
                    html+="<td class='del-padding-celda'>"+nomHues[j] +"</td>";
                    html+="</tr>";
                }
            } else {
                if(liHues.length === 0){
                    html+="<td class='del-padding-celda'>"+"" +"</td>";
                    html+="<td class='centrado boton-tabla' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+i+"' data-pos='"+i+"'  data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion' onclick='Pedido.QuitarHabitacionRenovar(this);' > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                }else{
                    html+="<td class='del-padding-celda'>"+nomHues[0] +"</td>";
                    html+="<td class='centrado boton-tabla' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+i+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion' onclick='Pedido.QuitarHabitacionRenovar(this);' > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                }
                html+="</tr>";
            }
        }

        $("#tblDetalleAlquilerRen").html(html);

        for(var x=0;x<=detcantidad.length;x++){
            var fecing = $("#fecinialq_"+x).val();
            var fecstart = moment(fecing,"DD-MM-YYYY");
            FormatoFechaStartDate($("#div_fecinialq_"+x),"dd-mm-yyyy",fecstart.toDate());
            FormatoFechaSinRestriccion($("#div_fecfinalq_"+x),"dd-mm-yyyy");
            $("#txtcantidadren_"+x).TouchSpin({
                min: 1,
                max: 100,
                step: 1,
                //decimals: 2,
                verticalbuttons: true,
                boostat: 5,
                maxboostedstep: 10,
                buttondown_class: 'btn btn-white',
                buttonup_class: 'btn btn-white'
            });
            NumeroDosDecimales($("#txtpreuniren_"+x));
            $("#txtpreuniren_"+x).on("keyup",function(){
                var pos = $(this).attr("id").split("_")[1];
                var tot = parseInt($("#txtcantidadren_"+pos).val())*parseFloat( ($(this).val()!=="" ? $(this).val() : 0) );
                $("#sp_pretotren_"+pos).text(Redondear2Decimales(tot));
                detprecio[pos] = Redondear2Decimales(parseFloat( ($(this).val()!=="" ? $(this).val() : 0) ));
                CargarTotalRenovacion();
            });
            $("#txtcantidadren_"+x).on('touchspin.on.startspin',function(){
                var pos = $(this).attr("id").split("_")[1];
                var tot = parseInt($(this).val())*parseFloat( ($("#txtpreuniren_"+pos).val()!=="" ? $("#txtpreuniren_"+pos).val() : 0) );
                $("#sp_pretotren_"+pos).text(Redondear2Decimales(tot));
                $("#div_fecinialq_"+pos).trigger("changeDate");
                detcantidad[pos] = parseInt($(this).val());
                CargarTotalRenovacion();
            });
            $("#div_fecinialq_"+x).on("changeDate",function (){
                var pos = $(this).attr("id").split("_")[2];
                var fefimes = moment($("#fecinialq_"+pos).val(),"DD-MM-YYYY").add(parseInt($("#txtcantidadren_"+pos).val()),'months');
                $('#div_fecfinalq_'+pos).datepicker('update',(fefimes.format('DD-MM-YYYY')));
                detfecinicio[pos] = $('#fecinialq_'+pos).val();
                detfecfin[pos] = $('#fecfinalq_'+pos).val();
            });
            $("#div_fecfinalq_"+x).on("changeDate",function (){
                var pos = $(this).attr("id").split("_")[2];
                var fefimes = moment($("#fecfinalq_"+pos).val(),"DD-MM-YYYY").subtract(parseInt($("#txtcantidadren_"+pos).val()),'months');
                $('#div_fecinialq_'+pos).datepicker('update',(fefimes.format('DD-MM-YYYY')));
                detfecinicio[pos] = $('#fecinialq_'+pos).val();
                detfecfin[pos] = $('#fecfinalq_'+pos).val();
            });
        }
        CargarTotalRenovacion();
    };

    var culminar_record = function(a){
        idAlqSel = $(a).attr("id").split("_")[2];
        var saldo = $(a).attr("data-saldo");
        var salida = $(a).attr("data-salida");
        $("#observacionesRen").val("");
        $("#txtMoraCul").val("");
        $("#txtMoraRen").val("");
        $("#txtAdelantoRen").val("");
        //VERIFICAR SI TIENE GARANTIA.
        liMontoGarDev = new Array();
        liIdGarDev = new Array();
        liEstGarDev = new Array();
        accionCulRen = "C";
        $("#tab_cul_alq").trigger("click");
        $.ajax({
            type: 'post',
            url: "view_detalle_alquiler",
            dataType: 'json',
            data:{id:idAlqSel},
            success: function (respJson) {
                console.log(respJson);
                if(respJson !== null){
                    if(respJson.dato === "OK"){
                        var data = respJson.alquiler.tbDetalleventas;
                        $("#txtSaldoCul").val(Redondear2Decimales(respJson.saldo));
                        $('#div-fecculmalq').datepicker('update',salida);
                        var detalles = respJson.alquiler.tbDetalleventas;
                        var html = "";
                        var numItem = -1;
                        var hora = moment().format('HH:mm:ss');
                        Limpiar();

                        for(var i=0;i<detalles.length;i++){
                            if(detalles[i].tiempo !== null){
                                dethabitacion.push(detalles[i].habitacion.id);
                                detdeshabitacion.push(detalles[i].habitacion.numHabitacion+ " - "+detalles[i].habitacion.tipoHabitacion.nombre);
                                detcantidad.push(detalles[i].cantidad);
                                detprecio.push(Redondear2Decimales(detalles[i].preUni));
                                idtiempo.push(detalles[i].tiempo.id);
                                dethoraini.push(hora);
                                dethorafin.push(hora);
                                if(detalles[i].garantia === null){
                                    detgarantia.push("0");
                                }else {
                                    detgarantia.push(detalles[i].garantia.id);
                                }

                                numItem++;
                                var liHues = detalles[i].detalleHuespedes;
                                var fecini = moment(detalles[i].fechaSalida).format('DD-MM-YYYY');
                                var fecsuma = moment(fecini,"DD-MM-YYYY").add(parseInt(detalles[i].cantidad),'months');
                                var fecsal = moment(fecsuma).format('DD-MM-YYYY');

                                detfecinicio.push(fecini);
                                detfecfin.push(fecsal);

                                html+="<tr>";
                                html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(numItem+1)+"</td>";
                                html+="<td class='del-padding-celda' rowspan='"+liHues.length+"'>"+ (detalles[i].habitacion.numHabitacion+ " - "+detalles[i].habitacion.tipoHabitacion.nombre)+"</td>";

                                html+="<td class='del-padding-celda text-center py-1 px-2' rowspan='"+liHues.length+"'>";
                                html+="<div id='div_fecinialq_"+numItem+"' class='input-group date'>";
                                html+="<input name='fecinialq_"+numItem+"' id='fecinialq_"+numItem+"' class='form-control input-sm' type='text' value='"+fecini+"' readonly=''>";
                                html+="<span class='input-group-addon'>";
                                html+="<i class='fa fa-calendar'></i>";
                                html+="</span>";
                                html+="</div>";
                                html+="</td>";

                                html+="<td class='del-padding-celda text-center py-1 px-2' rowspan='"+liHues.length+"'>";
                                html+="<div id='div_fecfinalq_"+numItem+"' class='input-group date'>";
                                html+="<input name='fecfinalq_"+numItem+"' id='fecfinalq_"+numItem+"' class='form-control input-sm' type='text' value='"+fecsal+"' readonly=''>";
                                html+="<span class='input-group-addon'>";
                                html+="<i class='fa fa-calendar'></i>";
                                html+="</span>";
                                html+="</div>";
                                html+="</td>";

                                //html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>("+detalles[i].cantidad+") "+(detalles[i].tiempo !== null ? detalles[i].tiempo.undMedida : "")+"</td>";

                                html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'>";
                                html+="<input type='text' class='touchspin3' name='txtcantidadren_"+numItem+"' id='txtcantidadren_"+numItem+"' value='"+RedondearFixed(detalles[i].cantidad,0) +"' readonly='readonly'>";
                                html+="</td>";

                                html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'>";
                                html+="<input type='text' class='form-control input-sm' name='txtpreuniren_"+numItem+"' id='txtpreuniren_"+numItem+"' value='"+Redondear2Decimales(detalles[i].preUni) +"'>";
                                html+="</td>";

                                html+="<td class='del-padding-celda text-center py-1' rowspan='"+liHues.length+"'><span id='sp_pretotren_"+numItem+"'>"+Redondear2Decimales(detalles[i].preTotal)+"</span></td>";

                                if(liHues.length === 0){
                                    idHuespedes.push("");
                                    dethuesped.push("");
                                }else {
                                    var cad = "";
                                    var cadnom = "";
                                    for(var j=0;j<liHues.length;j++){
                                        cad+=liHues[j].huesped.id+",";
                                        cadnom+=liHues[j].huesped.nombre+",";
                                    }
                                    cad = cad.substring(0,(cad.length-1));
                                    cadnom = cadnom.substring(0,(cadnom.length-1));
                                    idHuespedes.push(cad);
                                    dethuesped.push(cadnom);
                                }
                                if(liHues.length > 1){
                                    html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre+"</td>";
                                    html+="<td class='centrado boton-tabla' rowspan='"+liHues.length+"' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+numItem+"' data-pos='"+numItem+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion'  onclick='Pedido.QuitarHabitacionRenovar(this);'  > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                                    html+="</tr>";
                                    for(var j=1;j<liHues.length;j++){
                                        html+="<tr>";
                                        html+="<td class='del-padding-celda'>"+liHues[j].huesped.nombre +"</td>";
                                        html+="</tr>";
                                    }
                                } else {
                                    if(liHues.length === 0){
                                        html+="<td class='del-padding-celda'>"+"" +"</td>";
                                        html+="<td class='centrado boton-tabla' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+numItem+"' data-pos='"+numItem+"'  data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion' onclick='Pedido.QuitarHabitacionRenovar(this);' > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                                    }else{
                                        html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre +"</td>";
                                        html+="<td class='centrado boton-tabla' style='vertical-align: middle!important;'><button type='button' id='btn_del_item_hab_ren_"+numItem+"' data-pos='"+numItem+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar habitacion'  onclick='Pedido.QuitarHabitacionRenovar(this);' > <i class='glyphicon glyphicon-trash'></i> </button></td>";
                                    }
                                    html+="</tr>";
                                }
                            }
                        }
                        $("#tblDetalleAlquilerRen").html(html);
                        for(var x=0;x<=numItem;x++){
                            var fecing = $("#fecinialq_"+x).val();
                            var fecstart = moment(fecing,"DD-MM-YYYY");
                            FormatoFechaStartDate($("#div_fecinialq_"+x),"dd-mm-yyyy",fecstart.toDate());
                            FormatoFechaSinRestriccion($("#div_fecfinalq_"+x),"dd-mm-yyyy");
                            $("#txtcantidadren_"+x).TouchSpin({
                                min: 1,
                                max: 100,
                                step: 1,
                                //decimals: 2,
                                verticalbuttons: true,
                                boostat: 5,
                                maxboostedstep: 10,
                                buttondown_class: 'btn btn-white',
                                buttonup_class: 'btn btn-white'
                            });
                            NumeroDosDecimales($("#txtpreuniren_"+x));
                            $("#txtpreuniren_"+x).on("keyup",function(){
                                var pos = $(this).attr("id").split("_")[1];
                                var tot = parseInt($("#txtcantidadren_"+pos).val())*parseFloat( ($(this).val()!=="" ? $(this).val() : 0) );
                                $("#sp_pretotren_"+pos).text(Redondear2Decimales(tot));
                                detprecio[pos] = Redondear2Decimales(parseFloat( ($(this).val()!=="" ? $(this).val() : 0) ));
                                CargarTotalRenovacion();
                            });
                            $("#txtcantidadren_"+x).on('touchspin.on.startspin',function(){
                                var pos = $(this).attr("id").split("_")[1];
                                var tot = parseInt($(this).val())*parseFloat( ($("#txtpreuniren_"+pos).val()!=="" ? $("#txtpreuniren_"+pos).val() : 0) );
                                $("#sp_pretotren_"+pos).text(Redondear2Decimales(tot));
                                $("#div_fecinialq_"+pos).trigger("changeDate");
                                detcantidad[pos] = parseInt($(this).val());
                                CargarTotalRenovacion();
                            });
                            $("#div_fecinialq_"+x).on("changeDate",function (){
                                var pos = $(this).attr("id").split("_")[2];
                                var fefimes = moment($("#fecinialq_"+pos).val(),"DD-MM-YYYY").add(parseInt($("#txtcantidadren_"+pos).val()),'months');
                                $('#div_fecfinalq_'+pos).datepicker('update',(fefimes.format('DD-MM-YYYY')));
                                detfecinicio[pos] = $('#fecinialq_'+pos).val();
                                detfecfin[pos] = $('#fecfinalq_'+pos).val();
                            });
                            $("#div_fecfinalq_"+x).on("changeDate",function (){
                                var pos = $(this).attr("id").split("_")[2];
                                var fefimes = moment($("#fecfinalq_"+pos).val(),"DD-MM-YYYY").subtract(parseInt($("#txtcantidadren_"+pos).val()),'months');
                                $('#div_fecinialq_'+pos).datepicker('update',(fefimes.format('DD-MM-YYYY')));
                                detfecinicio[pos] = $('#fecinialq_'+pos).val();
                                detfecfin[pos] = $('#fecfinalq_'+pos).val();
                            });
                        }
                        CargarTotalRenovacion();
                        html = "";
                        var numord = 0;
                        for(var i=0;i<data.length;i++){
                            if(data[i].garantia !== null){
                                html+="<tr>";
                                html+="<td class='centrado'>"+(numord+1)+"</td>";
                                html+="<td class='text-center'>"+data[i].habitacion.numHabitacion+"</td>";
                                html+="<td class='text-center pt-1 pb-2'><input type='text' class='form-control input-sm input_mon_gara_cul block_input' name='txt_mon_dev_gar_"+numord+"' id='txt_mon_dev_gar_"+numord+"' data-pos='"+numord+"' readonly='readonly' data-mon='"+data[i].garantia.montoGarantia+"' value='"+Redondear2(data[i].garantia.montoGarantia)+"' /></td>";
                                html+="<td class='text-center pt-1 pb-2 px-2'>"+ConstruirEstadoGarantia(numord)+"</td>";
                                html+="</tr>";
                                liMontoGarDev.push(data[i].garantia.montoGarantia);
                                liIdGarDev.push(data[i].garantia.id);
                                liEstGarDev.push("DT");
                                numord++;
                            }
                        }
                        if(numord > 0){
                            $("#div_tabla_garantia_culminar").show();
                        }else{
                            $("#div_tabla_garantia_culminar").hide();
                        }
                        $("#tblCuadroGarantia").html(html);
                        $(".selectgarantia").selectpicker("refresh");
                        NumeroDosDecimales($(".input_mon_gara_cul"));
                        $(".input_mon_gara_cul").on("keyup",function(){
                            if(!$(this).hasClass("block_input")){
                                var pos = $(this).attr("data-pos");
                                var val = parseFloat($(this).val());
                                var monAnt = parseFloat($(this).attr("data-mon"));
                                console.log(pos);
                                console.log(val);
                                if(val > monAnt){
                                    liMontoGarDev[pos] = monAnt;
                                    $(this).val(monAnt);
                                }else{
                                    liMontoGarDev[pos] = val;
                                }

                            }
                        });
                        $("#modalTermino").modal("show");
                    } else if(respJson.dato === "ERROR"){
                        uploadMsnSmall(respJson.msj,'ERROR');
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

    var AbonarPago = function (a) {
        var ida = $(a).attr("id").split("_")[2];
        idhotelSel = $(a).attr("data-hot");
        $("#idabo").val(ida);
        ListarPagosxAlquiler();
    };

    var GuardarAbono = function () {
        abonar.start();
        var hora = moment().format('HH:mm:ss');
        $.ajax({
            type: 'post',
            url: "save_pago_alquiler",
            dataType: 'json',
            data:$("#frmPagos").serialize()+"&hora="+hora,
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        abonar.stop();
                        ListarPagosxAlquiler();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){uploadMsnSmall("FECHA PAGO INCORRECTA.","ALERTA");}
                                if(respJson.listado[i] === "E2"){uploadMsnSmall("TIPO DE PAGO INCORRECTO.","ALERTA");}
                                if(respJson.listado[i] === "E3"){uploadMsnSmall("MONTO INCORRECTO.","ALERTA");}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        abonar.stop();
                    }
                }else{
                    abonar.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                abonar.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var ListarPagosxAlquiler = function(){
        $.ajax({
            type: 'post',
            url: "view_detalle_alquiler",
            dataType: 'json',
            data:{id:$("#idabo").val()},
            success: function (respJson) {
                console.log(respJson);
                if(respJson !== null){
                    if(respJson.dato === "OK"){
                        var data = respJson.alquiler.tbLetraCobrars;
                        var tienedoc = respJson.tienedoc;
                        if(tienedoc === "1"){
                            $("#txtTipDocPagoView").val(respJson.doc);
                            $("#txtNumDocPagoView").val(respJson.num);
                            $("#div-doc-uno").hide();
                            $("#div-doc-dos").hide();
                            $("#div-doc-tres").show();
                        }else if(tienedoc === "0"){
                            $("#div-doc-tres").hide();
                            $("#div-doc-uno").show();
                            $("#div-doc-dos").show();
                        }
                        $("#acuenta").val(Redondear2(respJson.acuenta));
                        $("#saldo").val(Redondear2(respJson.saldo));
                        var html = "";
                        for(var i=0;i<data.length;i++){
                            console.log(data[i]);
                            html+="<tr>";
                            html+="<td class='centrado'>"+(i+1)+"</td>";
                            html+="<td>"+moment(data[i].fechaPago).format('DD-MM-YYYY')+"</td>";
                            html+="<td>"+data[i].otbFormaPago.nombre+"</td>";
                            html+="<td>"+data[i].otbUsuario.nombres + " "+data[i].otbUsuario.apePat+" "+data[i].otbUsuario.apeMat+"</td>";
                            html+="<td>"+Redondear2(data[i].monto)+"</td>";
                            //if(data[i].fechaImpreso !== null){
                                html+="<td>"+(data[i].glosaLetra !== null ? data[i].glosaLetra : "")+"</td>";
                           // }else {
                              //  html+="<td class='centrado boton-tabla'><input type='text' class='form-control input-sm' name='txt_glosa_imp_"+i+"' id='txt_glosa_imp_"+i+"' value='"+(data[i].glosaLetra !== null ? data[i].glosaLetra : "")+"' /></td>";
                            //}
                            html+="<td class='centrado boton-tabla'>";
                            if(data[i].fechaImpreso === null){
                                //html+="<button type='button' id='print_pago_"+data[i].id+"' data-pos='"+i+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-success mensa ladda-button' title='Imprimir pago' data-style='zoom-in'  data-spinner-size='30' onclick='Pedido.imprimir_pago(this);' ><span class='ladda-label'> <i class='glyphicon glyphicon-print'></i> </span></button>";
                            }else{
                                html+="<label class='label label-primary'>IMPRESO</label>";
                            }
                            if(data[i].fechaImpreso === null){
                                html+="<button type='button' id='pago_"+data[i].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensa' title='Eliminar pago: ' onclick='Pedido.delete_pago(this);' > <i class='glyphicon glyphicon-trash'></i> </button>";
                            }
                            html+="</td>";
                            html+="</tr>";
                        }
                        $("#listado").html(html);
                        $("#modalPagos").modal("show");
                    } else if(respJson.dato === "ERROR"){
                        uploadMsnSmall(respJson.msj,'ERROR');
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

    var saveCliente = function(){
        cliente.start();
        $.ajax({
            type: 'post',
            url: "save_cliente",
            dataType: 'json',
            data:$("#frmCliente").serialize(),
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        cliente.stop();
                        $("#modalCliente").modal("hide");
                        if (accionCliente === "C") {
                            $("#txtDescCliente").val($.trim($("#nombres").val()));
                            tableCliente._fnDraw();
                            $("#txtDescCliente").focus();
                        }else if(accionCliente === "H"){
                            $("#txtDescHuesped").val($.trim($("#nombres").val()));
                            tableHuesped._fnDraw();
                            $("#txtDescHuesped").focus();
                        }
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#nombres");}
                                if(respJson.listado[i] === "E2"){estilo_error(true,"#ruc");}
                                if(respJson.listado[i] === "E3"){estilo_error(true,"#dni");}
                                if(respJson.listado[i] === "E4"){style_error_cbo_final("#genero",true);}
                                if(respJson.listado[i] === "E5"){style_error_cbo_final("#tipo",true);}
                                if(respJson.listado[i] === "E6"){style_error_cbo_final("#estado",true);}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        cliente.stop();
                    }
                }else{
                    cliente.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                cliente.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var AddProducto = function(a){
        var fil = $(a).parents('tr');
        var idpro = parseInt($(a).attr("data-id"));
        var existepro = "0";
        for(var i=0;i<liidpro.length;i++){
            if(parseInt(idpro) === parseInt(liidpro[i])){
                existepro = "1";
                i = liidpro.length + 2;
            }
        }
        if(existepro === "0"){
            liidpro.push($(a).attr("data-id"));
            lidescpro.push($(fil).find("td").eq(1).text());
            licantidad.push(1);
            liprecio.push(0.00);
            litotal.push(0.00);
            listock.push(parseFloat($(fil).find("td").eq(3).text()));
            ConstruirTablaVenta();
        }else {
            uploadMsnSmall('Producto ya se encuentra en la lista.','ALERTA');
        }
    };

    var ConstruirTablaVenta = function () {
        var html = "";
        var monto = 0.00;
        $("#tblDetVenta").html("");
        for(var i=0;i<liidpro.length;i++){
            html="<tr id='fil_pro_"+liidpro[i]+"'>";
            html+="<td>"+(i+1)+"</td>";
            html+="<td>"+lidescpro[i]+"</td>";
            html+="<td class='text-center del-padding-lados-7'> <input type='text' class='form-control input-sm' name='can_"+i+"' id='can_"+i+"' data-pos='"+i+"' data-tipo='cant_' onkeyup='Pedido.update_item(this);' value='"+Redondear2(licantidad[i])+"' style='text-align:right;'></td>";
            html+="<td class='text-center del-padding-lados-7'><input type='text' class='form-control input-sm' name='puni_"+i+"' id='puni_"+i+"' data-pos='"+i+"' data-tipo='puni_' onkeyup='Pedido.update_item(this);' value='"+Redondear2(liprecio[i])+"' style='text-align:right;' /></td>";
            html+="<td class='text-center del-padding-lados-7'><input type='text' class='form-control input-sm' name='presub_"+i+"' id='presub_"+i+"' value='"+Redondear2(licantidad[i]*liprecio[i])+"' style='text-align:right;border-width:0;background: #F8FAFB;' readonly='readonly' /></td>";
            html+="<td class='text-center'><button type='button' id='delpro_"+liidpro[i]+"' name='delpro_"+liidpro[i]+"'  data-pos='"+i+"' data-toggle='tooltip' data-placement='right' title='Quitar Producto: "+lidescpro[i]+" ' onclick='Pedido.QuitarProducto(this);' style='margin:0px 3px 0px 0px!important; padding: 2px 4px 2px 4px !important;' class='btn btn-sm btn-danger mensa'> <i class='glyphicon glyphicon-trash'></i> </button></td>";
            html+="</tr>";
            monto+=parseFloat(litotal[i]);
            $("#tblDetVenta").append(html);
            NumeroDosDecimales($("#can_"+i));
            NumeroDosDecimales($("#puni_"+i));
            NumeroDosDecimales($("#presub_"+i));
        }
        $("#txtTotalVenta").val(Redondear2(monto));
    };

    var update_item = function (elem) {
        var pos = $(elem).attr("data-pos");
        var input = $(elem).attr("data-tipo");
        var stock = parseFloat(listock[pos]);
        if(input ==="cant_"){
            if(Redondear2($("#can_"+pos).val()) > stock){
                uploadMsnSmall('Stock insuficiente.','ALERTA');
                $("#can_"+pos).val(licantidad[pos]);
            }else{
                licantidad[pos] = Redondear2($("#can_"+pos).val());
            }
        }else if(input === "puni_"){
            liprecio[pos] = Redondear2($("#puni_"+pos).val());
        }
        litotal[pos] = Redondear2(licantidad[pos]*liprecio[pos]);
        $("#presub_"+pos).val(Redondear2(licantidad[pos]*liprecio[pos]));
        CargarTotalesVenta();
    };

    var CargarTotalesVenta = function () {
        var monto = 0.00;
        for(var i=0;i<liidpro.length;i++){
            monto+=parseFloat(litotal[i]);
        }
        $("#txtTotalVenta").val(Redondear2(monto));
    };

    var QuitarProducto = function (a) {
        var pos = $(a).attr("data-pos");
        liidpro.splice(pos,1);
        lidescpro.splice(pos,1);
        licantidad.splice(pos,1);
        liprecio.splice(pos,1);
        litotal.splice(pos,1);
        listock.splice(pos,1);
        ConstruirTablaVenta();
    };

    var VerModalHuespedes = function (a) {
        $("#posHuesped").val($(a).attr("data-pos"));
        accionCliente = "H";
        $("#modalSearchHuesped").modal("show");
        $('#txtDescHuesped').focus();
    };

    var GuardarVenta = function(){
        ventas.start();
        $.ajax({
            type: 'post',
            url: "save_venta",
            dataType: 'json',
            data:{accion:"R",fecventa:$("#fecventa").val(),idhotel:$("#cboLiHotel").val(),"idpro[]":liidpro,"idcan[]":licantidad,"idpre[]":liprecio,"stock[]":listock},
            success:function(respJson){
                if(respJson!==null){
                    if(respJson.dato==="OK"){
                        ventas.stop();
                        $("#modalVenta").modal("hide");
                        table._fnDraw();
                        uploadMsnSmall(respJson.msj,'OK');
                    }else if(respJson.dato==="ERROR"){
                        if(respJson.listado.length>0){
                            for (var i = 0; i < respJson.listado.length; i++) {
                                if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                if(respJson.listado[i] === "E2"){style_error_cbo_final("#estado",true);}
                            }
                        }else{
                            uploadMsnSmall(respJson.msj,'ERROR');
                        }
                        ventas.stop();
                    }
                }else{
                    ventas.stop();
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                ventas.stop();
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var imprimir_reporte = function(){
        var method = "downloadIngresos";
        var parameters = "fecini=" + $("#fecharepini").val() + "&fecfin=" + $("#fecharep").val()+"&idsuc=" + $("#cboLiHotel").val();
        var url = method + "?" + parameters;
        window.open(url,'_blank');
    };

    var Cancelar = function(elem){
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea eliminar el alquiler?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    var idd = $(elem).attr("id").split("_")[2];
                    $.ajax({
                        type: 'post',
                        url: 'delete_alquiler',
                        data: {"id":idd},
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

    var imprimir_pago = function(){//, una vez imprimido no se podra eliminar el pago
        bootbox.confirm({
            message: "<strong>¿Esta seguro que desea imprimir el recibo del pago?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result){
                if(result){
                    var idBtnAbono = Ladda.create(document.querySelector('#btnPrintTicket'));
                    //var val = await ValidarGlosa();
                    var glosa = $.trim($("#txtObsView").val())
                    if(glosa !== ""){
                        if(glosa.length > 12){
                            idBtnAbono.start();
                            $.ajax({
                                type: 'post',
                                url: 'imprimir_pago_alquiler',
                                data: {"id":idAlqDet,"glosa": $.trim($("#txtObsView").val()) },
                                dataType: 'json',
                                success: function(data){
                                    if(data!==null){
                                        if(data.dato === "OK"){
                                            table._fnDraw();
                                            $(btnViewDeta).trigger("click");
                                            $.ajax({
                                                type: 'get',
                                                url: 'http://127.0.0.1:8000/print=1',
                                                data: {"idped": idAlqDet, "tipo": "6"},
                                                success: function (data) {
                                                    console.log(data);
                                                    var rpta = data.respuesta;
                                                    if (rpta === "OK") {
                                                        UploadMsnSmallLeft("Documento enviado a imprimir", "OK");
                                                        // Repositorio.finishRefresh($('div.blockMe'));
                                                        idBtnAbono.stop();
                                                    } else {
                                                        UploadMsnSmallLeft("Problemas al comunicar con la impresora.", "ERROR");
                                                        //Repositorio.finishRefresh($('div.blockMe'));
                                                        idBtnAbono.stop();
                                                    }
                                                },
                                                error: function (jqXHR, status, error) {
                                                    //Repositorio.finishRefresh($('div.blockMe'));
                                                    idBtnAbono.stop();
                                                    uploadMsnSmall(jqXHR.responseText, 'ERROR');
                                                }
                                            });
                                        }else{
                                            idBtnAbono.stop();
                                            uploadMsnSmall(data.msj,'ERROR');
                                        }
                                    }else{
                                        uploadMsnSmall('Problemas con el sistema','ERROR');
                                    }
                                },
                                error: function (jqXHR, status, error) {
                                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                                }
                            });
                        }else{
                            uploadMsnSmall("La glosa debe de ser mayor a 12 caracteres.","ALERTA");
                            $("#txtObsView").focus();
                        }
                    }else{
                        uploadMsnSmall("Ingrese una glosa para el recibo","ALERTA");
                        $("#txtObsView").focus();
                    }
                }
            }
        });
    };

    var SolicitoProductoServico = function (listado,tipo,idhuesped) {
        var existe = "0";
        var posicion = -1;
        for(var i=0;i<listado.length;i++){
            if(idhuesped === listado[i][0]){
                existe = "1";
                posicion = i;
                i=listado.length+2;
            }
        }
        if(existe === "1"){
            existe = "0";
            if(tipo === "P"){
                if(parseInt(listado[posicion][1]) > 0 ){
                    existe = "1";
                }
            } else if(tipo === "S"){
                if(parseInt(listado[posicion][3]) > 0 ){
                    existe = "1";
                }
            } else if(tipo === "T"){
                if(parseInt(listado[posicion][5]) > 0 ){
                    existe = "1";
                }
            }
        }
        return (existe === "1");
    };

    var ActualizarDetails = function () {
        $.ajax({
            type:'post',
            url: "view_detalle_alquiler",
            dataType: 'json',
            data:{id:idAlqDet},
            success:function(data){
                if(data!==null){
                    var respJson = data.alquiler;
                    var ventas = data.detaventa;
                    var dethuesped = data.detahuesped;
                    $("#txtSubTotalDetAlq").val(respJson.montoSubTotal);
                    $("#txtIgvDetAlq").val(respJson.montoIgv);
                    $("#txtTotalDetAlq").val(respJson.montoTotal);
                    var detalles = respJson.detalleAlquileres;
                    var html = "";
                    var htVenta = "";
                    for(var i=0;i<detalles.length;i++){
                        var fecini = moment(respJson.fechaIngreso).format('DD-MM-YYYY');
                        var liHues = detalles[i].detalleHuespedes;
                        html+="<tr>";
                        html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(i+1)+"</td>";
                        html+="<td class='del-padding-celda' rowspan='"+liHues.length+"'>"+( detalles[i].habitacion !== null ? (detalles[i].habitacion.numHabitacion+ " - "+detalles[i].habitacion.tipoHabitacion.nombre) : "GARANTIA" )+"</td>";
                        html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+fecini+" - "+detalles[i].horaIngreso+"</td>";
                        html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>("+detalles[i].cantidad+") "+(detalles[i].tiempo === "D" ? "DIA" : "HORA")+"</td>";

                        if(liHues.length > 1){
                            html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre+"</td>";
                            html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[0].id+"' data-id='"+liHues[0].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio' > <i class='glyphicon glyphicon-check'></i> </button></td>";
                            html+="</tr>";
                            for(var j=1;j<liHues.length;j++){
                                html+="<tr>";
                                html+="<td class='del-padding-celda'>"+liHues[j].huesped.nombre +"</td>";
                                html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[j].id+"' data-id='"+liHues[j].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio'  > <i class='glyphicon glyphicon-check'></i> </button></td>";
                                html+="</tr>";
                            }
                        } else {
                            html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre +"</td>";
                            html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[0].id+"' data-id='"+liHues[0].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio' > <i class='glyphicon glyphicon-check'></i> </button></td>";
                            html+="</tr>";
                        }
                    }
                    $("#tblDetalleAlquiler").html(html);
                    for(var xx=0;xx<ventas.length;xx++){
                        htVenta+="<tr>";
                        htVenta+="<td class='del-padding-celda text-center'>"+(xx+1)+"</td>";
                        htVenta+="<td class='del-padding-celda'>"+ventas[xx].detalleHuesped.huesped.nombre+"</td>";
                        htVenta+="<td class='del-padding-celda'>"+(ventas[xx].producto.tipoProducto === "P" ? "PRODUCTO" : (ventas[xx].producto.tipoProducto === "S" ? "TOUR" : "TRANSPORTE") )+"</td>";
                        htVenta+="<td class='del-padding-celda'>"+ventas[xx].producto.nombre+"</td>";
                        htVenta+="<td class='del-padding-celda text-right'>"+ventas[xx].cantidad+"</td>";
                        htVenta+="<td class='del-padding-celda text-right'>"+ventas[xx].precio+"</td>";
                        htVenta+="<td class='del-padding-celda text-right'>"+ventas[xx].total+"</td>";
                        htVenta+="<td class='centrado boton-tabla'> <button type='button' id='iddelpro_"+ventas[xx].id+"' data-id='"+ventas[xx].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-danger mensaps' title='Quitar Producto o Servicio' onclick='Pedido.QuitarProductoServicio(this);' > <i class='glyphicon glyphicon-trash'></i> </button> </td>";
                        htVenta+="</tr>";
                    }
                    $("#tblDetalleVenta").html(htVenta);
                    //$(".mensaps").tooltip();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var ObtenerGarantia = function(detalles,idHabitacion){
        var montoGarantia = 0;
        for(var i=0;i<detalles.length;i++){
            if(detalles[i].tiempo === null) {
                if(detalles[i].habitacion !== null) {
                    if (parseInt(detalles[i].habitacion.id) === idHabitacion) {
                        montoGarantia = detalles[i].preTotal;
                    }
                }
            }
        }
        return Redondear2Decimales(montoGarantia);
    };

    var viewDetails = function (a) {
        btnViewDeta = $(a);
        $.ajax({
            type:'post',
            url: "view_detalle_alquiler",
            dataType: 'json',
            data:{id:$(a).attr("id").split("_")[2]},
            success:function(data){
                if(data!==null){
                    idAlqDet = $(a).attr("id").split("_")[2];
                    SaldoPendiente = data.saldo;
                    var respJson = data.alquiler;
                    var ventas = data.alquiler.tbDetalleventas;
                    var dethuesped = data.detahuesped;
                    $("#txtnumDetAlq").val(respJson.numPedido);
                    $("#txtvenDetAlq").val(respJson.otbUsuario.nombres+" "+respJson.otbUsuario.apePat+" "+respJson.otbUsuario.apeMat);
                    $("#monedaDetAlq").val(respJson.otbMoneda.nombre);
                    $("#txtcliDetAlq").val(respJson.otbCliente.nombre);
                    $("#txtSaldoDetAlq").val(Redondear2Decimales(respJson.saldo));
                    $("#txtAcuentaDetAlq").val(Redondear2Decimales(respJson.acuenta));
                    $("#txtTotalDetAlq").val(Redondear2Decimales(respJson.montoTotal));
                    $("#txtObsView").val(respJson.observacionPedido);
                    var detalles = respJson.tbDetalleventas;
                    var html = "";
                    var htOtros = "";
                    var numItem = 0;
                    for(var i=0;i<detalles.length;i++){
                        if(detalles[i].tiempo !== null){
                            numItem++;
                            var liHues = detalles[i].detalleHuespedes;
                            var fecini = moment(detalles[i].fechaIngreso).format('DD-MM-YYYY');
                            var fecsal = moment(detalles[i].fechaSalida).format('DD-MM-YYYY');

                            html+="<tr>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(numItem)+"</td>";
                            html+="<td class='del-padding-celda' rowspan='"+liHues.length+"'>"+( detalles[i].habitacion !== null ? (detalles[i].habitacion.numHabitacion+ " - "+detalles[i].habitacion.tipoHabitacion.nombre) : "GARANTIA" )+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+fecini+" - "+detalles[i].horaIngreso+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+fecsal+" - "+detalles[i].horaSalida+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>("+detalles[i].cantidad+") "+(detalles[i].tiempo !== null ? detalles[i].tiempo.undMedida : "")+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+Redondear2Decimales(detalles[i].preUni)+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+Redondear2Decimales(detalles[i].preTotal)+"</td>";
                            html+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(detalles[i].flagTieneGarantia !== null ? (detalles[i].flagTieneGarantia > 0 ? ObtenerGarantia(detalles,detalles[i].habitacion.id) : "-") : "-" )+"</td>";

                            if(liHues.length > 1){
                                html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre+"</td>";

                                html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[0].id+"' data-id='"+liHues[0].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio' > <i class='glyphicon glyphicon-check'></i> </button></td>";
                                html+="</tr>";
                                for(var j=1;j<liHues.length;j++){
                                    html+="<tr>";
                                    html+="<td class='del-padding-celda'>"+liHues[j].huesped.nombre +"</td>";
                                    html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[j].id+"' data-id='"+liHues[j].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio' > <i class='glyphicon glyphicon-check'></i> </button></td>";
                                    html+="</tr>";
                                }
                            } else {
                                if(liHues.length === 0){
                                    html+="<td class='del-padding-celda'>"+"" +"</td>";
                                    html+="<td class='centrado boton-tabla'><button type='button'  data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio'> <i class='glyphicon glyphicon-check'></i> </button></td>";
                                }else{
                                    html+="<td class='del-padding-celda'>"+liHues[0].huesped.nombre +"</td>";
                                    html+="<td class='centrado boton-tabla'><button type='button' id='iddethue_"+liHues[0].id+"' data-id='"+liHues[0].id+"' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Agregar Producto o Servicio'> <i class='glyphicon glyphicon-check'></i> </button></td>";
                                }
                                html+="</tr>";
                            }
                        }

                        if(detalles[i].tiempo === null && detalles[i].habitacion === null)
                        {
                            numItem++;
                            var liHues = detalles[i].detalleHuespedes;
                            var fecini = moment(detalles[i].fechaIngreso).format('DD-MM-YYYY');
                            var fecsal = moment(detalles[i].fechaSalida).format('DD-MM-YYYY');
                            htOtros+="<tr>";
                            htOtros+="<td class='del-padding-celda text-center' rowspan='"+liHues.length+"'>"+(numItem)+"</td>";
                            htOtros+="<td class='del-padding-celda'>"+detalles[i].otbProducto.nombre+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >"+fecini+" - "+detalles[i].horaIngreso+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >"+fecsal+" - "+detalles[i].horaSalida+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >("+detalles[i].cantidad+") "+(detalles[i].tiempo !== null ? detalles[i].tiempo.undMedida : "")+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >"+Redondear2Decimales(detalles[i].preUni)+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >"+Redondear2Decimales(detalles[i].preTotal)+"</td>";
                            htOtros+="<td class='del-padding-celda text-center' >-</td>";
                            htOtros+="<td class='del-padding-celda'>---</td>";
                            htOtros+="<td class='centrado boton-tabla'><button type='button' data-toggle='tooltip' data-placement='left' class='btn btn-xs btn-outline btn-primary mensaps' title='Pago adicional' > <i class='glyphicon glyphicon-check'></i> </button></td>";
                            htOtros+="</tr>";
                        }
                    }
                    $("#tblDetalleAlquiler").html(html+htOtros);

                    var letras = data.alquiler.tbLetraCobrars;
                    html = "";
                    var active_obs = "1";
                    for (var i = 0; i < letras.length; i++){
                        var letra = letras[i];
                        html+="<tr>";
                        html+="<td class='text-center'>"+(i+1)+"</td>";
                        html+="<td class='text-center'>"+moment(letra.fechaPago).format('DD-MM-YYYY')+"</td>";
                        html+="<td class='text-left'>"+letra.otbUsuario.nombres+ " "+letra.otbUsuario.apePat+" "+letra.otbUsuario.apeMat+"</td>";
                        html+="<td>"+letra.otbTipoDocumento.nombre+": "+letra.numSerie+"</td>";
                        html+="<td>"+letra.otbFormaPago.nombre+"</td>";
                        html+="<td class='text-right'>"+Redondear2(letra.monto)+"</td><td class='text-center'>";
                        if(letra.fechaImpreso === null){
                            html+="<label class='label label-warning'>PENDIENTE</label>";
                        }else{
                            html+="<label class='label label-primary'>IMPRESO</label>";
                            active_obs = "0";
                        }
                        html+="</td></tr>";
                    }
                    console.log(data);
                    if( parseFloat(SaldoPendiente) > 0 ){
                        $("#txtObsView").removeAttr("readonly");
                        $("#div_documento_entrega").hide();
                    }else{
                        if(active_obs === "1"){
                            $("#txtObsView").removeAttr("readonly");
                            $("#div_documento_entrega").hide();
                        }else{
                            $("#txtObsView").attr("readonly","readonly");
                            $("#div_documento_entrega").show();
                            $("#txtDocView").val(respJson.tipoSerieImpresoVenta);
                        }
                    }
                    $("#tblDetalleVenta").html(html);
                    //$(".mensaps").tooltip();
                    $("#modalDetalleAlquiler").modal("show");
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
            }
        });
    };

    var AddProductoServicio = function (a) {
        $("#iddethuespedPS").val($(a).attr("data-id"));
        $("#cantidadPS").val("");
        $("#precioPS").val("");
        $("#cboLiTipo").change();
        $("#modalAddProductoServicio").modal("show");
    };

    var ValidarProductoServicio = function () {
        if($("#cantidadPS").val()==="" || parseFloat($("#cantidadPS").val()) <= 0){
            uploadMsnSmall("Cantidad incorrecta.","ALERTA");
            addProducto.stop();
            return false;
        }
        if($("#precioPS").val()==="" || parseFloat($("#precioPS").val())<=0){
            uploadMsnSmall("Precio Incorrecto","ALERTA");
            addProducto.stop();
            return false;
        }
        return true;
    };

    var QuitarProductoServicio = function (a) {
        bootbox.confirm({
            message: "<strong>¿Esta Seguro que desea eliminar el Producto o Servicio?</strong>",
            size: 'small',
            buttons: {
                confirm: {label: "<i class='fa fa-check'></i> Si",className: "btn-success btn-sm sbold"},
                cancel: {label: "<i class='fa fa-times'></i> No",className: "btn-sm sbold"}
            },
            callback: function(result) {
                if(result){
                    var idd =$(a).attr("data-id");
                    $.ajax({
                        type: 'post',
                        url: 'delete_productoservicio',
                        data: {"id":idd},
                        dataType: 'json',
                        success: function(data){
                            if(data!==null){
                                uploadMsnSmall(data.msj,data.dato);
                                if(data.dato === 'OK'){
                                    table._fnDraw();
                                    ActualizarDetails();
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

    var RucPlg = function(campo) {
        this.campo = campo;
        var esNulo = function() {
            return (campo == null||campo=="");
        };

        var trim = function(cadena){
            cadena2 = "";
            len = cadena.length;
            for ( var i=0; i <= len ; i++ ) if ( cadena.charAt(i) != " " ){cadena2+=cadena.charAt(i);	}
            return cadena2;
        };

        var esNumero = function (){
            return !(isNaN( campo ));
        };
        var onceNumeros = function (){
            return campo.length == 11;
        };

        var tieneFormato = function(){
            var valor = trim(campo);
            var suma = 0;
            var digito = "";
            if ( esNumero( valor ) ) {
                if ( valor.length === 8 ){
                    for (var i=0; i<valor.length-1;i++){
                        digito = valor.charAt(i) - '0';
                        if ( i==0 ) suma += (digito*2)
                        else suma += (digito*(valor.length-i))
                    }
                    resto = suma % 11;
                    if ( resto == 1) resto = 11;
                    if ( resto + ( valor.charAt( valor.length-1 ) - '0' ) == 11 ){
                        return true
                    }
                } else if ( valor.length === 11 ){
                    x = 6
                    for (var i=0; i<valor.length-1;i++){
                        if ( i == 4 ) x = 8
                        digito = valor.charAt(i) - '0';
                        x--
                        if ( i==0 ) suma += (digito*x)
                        else suma += (digito*x)
                    }
                    resto = suma % 11;
                    resto = 11 - resto

                    if ( resto >= 10) resto = resto - 10;
                    if ( resto == valor.charAt( valor.length-1 ) - '0' ){
                        return true
                    }
                }
            }
            return false
        };
        this.esValido = function(){
            return (!( esNulo() || !esNumero() || !onceNumeros() || !tieneFormato() ));
        }
    };

    var ValidarNumeroRuc = function () {
        var ruc = new RucPlg($("#ruc").val());
        if(!ruc.esValido()){
            uploadMsnSmall("Por favor, ingrese numero de RUC valido.",'ALERTA');
            validarRuc.stop();
            return false;
        }
        return true;
    };

    var Iniciando = function(){
        $("#fecinicio,#fecfin,#fecpago,#fecventa,#busfecini,#busfecfin,#fecculmalq,#fecharep,#fecharepini").val(fecAct);
        FormatoFechaSinRestriccion($("#div-fecing"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecfin"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecpago"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecventa"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-busfecini"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-busfecfin"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecculmalq"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecharep"),"dd-mm-yyyy");
        FormatoFechaSinRestriccion($("#div-fecharepini"),"dd-mm-yyyy");
        NumeroDosDecimales($("#txtCantidad"));
        NumeroDosDecimales($("#txtPrecio"));
        NumeroDosDecimales($("#cantidadPS"));
        NumeroDosDecimales($("#precioPS"));
        NumeroDosDecimales($("#txtAdelanto"));
        NumeroDosDecimales($("#txtMonto"));
        NumeroDosDecimales($("#txtMoraCul"));
        NumeroDosDecimales($("#txtMoraRen"));
        NumeroDosDecimales($("#txtAdelantoRen"));
        $("#btnPrintTicket").on("click",function(){
            if( parseFloat(SaldoPendiente) > 0){
                uploadMsnSmall("Tiene un saldo pendiente de pago.","ALERTA");
            }else{
                imprimir_pago();
            }
        });
        $("#btnGuardarCliente").on("click",saveCliente);
        $("#btnReporte").on("click",imprimir_reporte);
        $("#txtPrecio").on("keyup",function(e){
            if($(this).val() !== ""){
                var total = parseFloat($("#txtCantidad").val())*parseFloat($(this).val());
                $("#txtTotPre").val(total);
            }else{
                $("#txtTotPre").val("");
            }
            if(e.keyCode === 13){
                $("#btnAddHabitacion").trigger("click");
            }
        });
        $("#btnCulminarAlquiler").on("click",function(){
            var sal =  parseFloat($("#txtSaldoCul").val());
            if(sal === 0){
                if(accionCulRen === "C"){
                    culminar.start();
                    var hora = moment().format('HH:mm:ss');
                    $.ajax({
                        type: 'POST',
                        url: "culminar_alquiler",
                        dataType: 'json',
                        data : {fecsal:$("#fecculmalq").val(),id:idAlqSel,hora:hora, mora : $("#txtMoraCul").val(),
                            "idservGar[]" : liIdGarDev,"montoGar[]" : liMontoGarDev,"estadoGar[]" : liEstGarDev},
                        success: function(data){
                            if(data !== null){
                                if(data.dato === "OK"){
                                    $("#modalTermino").modal("hide");
                                    table._fnDraw();
                                    uploadMsnSmall(data.msj,'OK');
                                    culminar.stop();
                                }else if(data.dato === "ERROR"){
                                    if(data.listado.length>0){
                                        for (var i = 0; i < data.listado.length; i++) {
                                            if(data.listado[i] === "E1"){uploadMsnSmall("Registro de Alquiler no encontrado.",'ALERTA');}
                                            if(data.listado[i] === "E2"){uploadMsnSmall("Tipo Documento incorrecto.",'ALERTA');}
                                        }
                                    }else{
                                        uploadMsnSmall(data.msj,data.dato);
                                    }
                                    culminar.stop();
                                }
                            }else{
                                culminar.stop();
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            culminar.stop();
                            uploadMsnSmall(jqXHR.responseText,'ERROR');
                        }
                    });
                } else if(accionCulRen === "R"){
                    console.log(dethabitacion);
                    console.log(detdeshabitacion);
                    console.log(detcantidad);
                    console.log(detprecio);
                    console.log(idtiempo);
                    console.log(dethoraini);
                    console.log(dethorafin);
                    console.log(detgarantia);
                    console.log(detfecinicio);
                    console.log(detfecfin);
                    console.log(idHuespedes);
                    console.log(dethuesped);

                    if(dethabitacion.length === 0){
                        uploadMsnSmall("No ha agregado habitaciones.","ALERTA");
                        return false;
                    }
                    if( parseFloat($("#txtTotalRen").val()) <= 0){
                        uploadMsnSmall("El monto a pagar debe ser diferente de cero.","ALERTA");
                        return false;
                    }
                    for (var i = 0; i < detfecinicio.length; i++) {
                        var fecini = detfecinicio[i];
                        var precio = detprecio[i];
                        var prec = parseFloat(detprecio[i]);
                        if(fecini === ""){
                            uploadMsnSmall("Fecha de ingreso incorrecta en el item N° "+(i+1).toString(),"ALERTA");
                            return false;
                            break;
                        }
                        if(precio === ""){
                            uploadMsnSmall("Precio incorrecto en el item N° "+(i+1).toString(),"ALERTA");
                            return false;
                            break;
                        }else if(prec <= 0){
                            uploadMsnSmall("Precio incorrecto en el item N° "+(i+1).toString(),"ALERTA");
                            return false;
                            break;
                        }
                    }
                    var dataRequest = {
                        idcli:1,txtnum:$("#txtnum").val(),moneda:$("#moneda").val(),idsuc:$("#cboLiHotel").val(),id:idAlqSel,mora : $("#txtMoraRen").val(),
                        "idhabi[]":dethabitacion,"idcan[]":detcantidad,"idpre[]":detprecio,"tie[]":idtiempo,formapago : $("#formaPagoAlqRen").val(),
                        "horaini[]":dethoraini,"horafin[]":dethorafin,"detfecfin[]":detfecfin,"detfecinicio[]":detfecinicio,"detgarantia[]":detgarantia,
                        "dethuespedes[]":idHuespedes,accion:"REN", observaciones:$("#observacionesRen").val(), adelanto : $("#txtAdelantoRen").val()
                    };
                    culminar.start();
                    $.ajax({
                        type: 'post',
                        url: "save_alquiler",
                        dataType: 'json',
                        data:dataRequest,
                        success:function(respJson){
                            if(respJson!==null){
                                if(respJson.dato==="OK"){
                                    culminar.stop();
                                    $("#modalTermino").modal("hide");
                                    table._fnDraw();
                                    uploadMsnSmall(respJson.msj,'OK');
                                }else if(respJson.dato==="ERROR"){
                                    if(respJson.listado.length>0){
                                        for (var i = 0; i < respJson.listado.length; i++) {
                                            if(respJson.listado[i] === "E1"){estilo_error(true,"#desc");}
                                            if(respJson.listado[i] === "E2"){style_error_cbo_final("#estado",true);}
                                            if(respJson.listado[i] === "E3"){estilo_error(true,"#desc");uploadMsnSmall("No ha seleccionado un hotel.",'ALERTA');}
                                            if(respJson.listado[i] === "E4"){uploadMsnSmall("Ubicación incorrecta.",'ALERTA');}
                                        }
                                    }else{
                                        uploadMsnSmall(respJson.msj,'ERROR');
                                    }
                                    culminar.stop();
                                }
                            }else{
                                culminar.stop();
                                uploadMsnSmall('Problemas con el sistema','ERROR');
                            }
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            culminar.stop();
                            uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                        }
                    });
                }
            }else{
                uploadMsnSmall("El cliente tiene saldo pendiente.",'ALERTA');
            }
        });
        $(".touchspin3").TouchSpin({
            min: 1,
            max: 100,
            step: 1,
            //decimals: 2,
            verticalbuttons: true,
            boostat: 5,
            maxboostedstep: 10,
            buttondown_class: 'btn btn-white',
            buttonup_class: 'btn btn-white'
        });
        $('#txtCantidad').on('touchspin.on.startspin', function () {
            var valor = $(this).val();
            $("#tiempo").change();
        });
        $.ajax({
            type: 'post',
            url: "mant_alquiler",
            dataType: 'json',
            success: function (respJson) {
                console.log(respJson);
                if(respJson !== null){
                    liTiempoFiltro = respJson.tiempo;
                    $("#moneda").html(respJson.htTM);
                    $("#cboLiHotel").html(respJson.htH);
                    $("#cboLiSucursal").html(respJson.htH);
                    $("#tipoppago").html(respJson.htFP);
                    $("#formaPagoAlq").html(respJson.htFP);
                    $("#formaPagoAlqRen").html(respJson.htFP);
                    $("#cboTipoDocPago").html("<option value='0'>--SELECCIONE--</option>"+respJson.htTD);
                    ListClientes();
                    ListHuespedes();
                    var htTiempo = "";
                    for(var i=0;i<liTiempoFiltro.length;i++){
                        htTiempo+="<option value='"+liTiempoFiltro[i].id+"' data-und='"+(liTiempoFiltro[i].undMedida).substring(0,1)+"'>"+liTiempoFiltro[i].nombre+"</option>";
                    }
                    $("#tiempo").html(htTiempo);
                    $(".selectpicker").selectpicker("refresh");
                    ListAlquileres();
                }else{
                    uploadMsnSmall('Problemas con el sistema','ERROR');
                }
            },
            error: function (jqXHR, status, error) {
                uploadMsnSmall(jqXHR.responseText,'ERROR');
            }
        });
        $("#cboTipoDocPago").on("change",function () {
            $.ajax({
                type: 'POST',
                url: "view_seriexhotel",
                dataType: 'json',
                data : {idtip:$("#cboTipoDocPago").val(),idhotel:idhotelSel},
                success: function(data){
                    if(data!==null){
                        if($("#cboTipoDocPago").val() !== "0"){
                            $("#txtNumDocPago").val(data.msj);
                        }else{
                            $("#txtNumDocPago").val("");
                        }
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#btnFacturaPago").on("click",function () {
            facturar.start();
            var hora = moment().format('HH:mm:ss');
            $.ajax({
                type: 'POST',
                url: "facturar_alquiler",
                dataType: 'json',
                data : {idtipo:$("#cboTipoDocPago").val(),id:$("#idabo").val(),hora:hora},
                success: function(data){
                    if(data !== null){
                        if(data.dato === "OK"){
                            //$("#facturar").modal("hide");
                            table._fnDraw();
                            uploadMsnSmall(data.msj,'OK');
                            facturar.stop();
                            //imprimir_ticket();
                            var datos = (data.objeto).split(":");
                            $("#txtTipDocPagoView").val(datos[0]);
                            $("#txtNumDocPagoView").val(datos[1]);
                            $("#div-doc-uno").hide();
                            $("#div-doc-dos").hide();
                            $("#div-doc-tres").show();
                        }else if(data.dato === "ERROR"){
                            if(data.listado.length>0){
                                for (var i = 0; i < data.listado.length; i++) {
                                    if(data.listado[i] === "E1"){uploadMsnSmall("Registro de Alquiler no encontrado.",'ALERTA');}
                                    if(data.listado[i] === "E2"){uploadMsnSmall("Tipo Documento incorrecto.",'ALERTA');}
                                }
                            }else{
                                uploadMsnSmall(data.msj,data.dato);
                            }
                            facturar.stop();
                        }
                    }else{
                        facturar.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    facturar.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#modalVenta").on("shown.bs.modal",AlignModal);
        $(window).on("resize", function(){
            $("#modalVenta:visible").each(AlignModal);
        });
        $("#modalAlquiler").on("shown.bs.modal",AlignModal);
        $(window).on("resize", function(){
            $("#modalAlquiler:visible").each(AlignModal);
        });
        $("#modalDetalleAlquiler").on("shown.bs.modal",AlignModal);
        $(window).on("resize", function(){
            $("#modalDetalleAlquiler:visible").each(AlignModal);
        });
        $("#btnNewAlquiler").on("click",ObtenerNumAlq);
        $("#btnSearchModalHuesped").on("click",function() {tableHuesped._fnDraw();});
        $("#btnSearchModalCliente").on("click",function() {tableCliente._fnDraw();});
        $("#txtDescHuesped").on("keyup",function(e){tableHuesped._fnDraw();});
        $("#txtDescCliente").on("keyup",function(e){tableCliente._fnDraw();});
        $("#btnSearch").on("click",function(){table._fnDraw();});
        $("#txtDesc").on("keyup",function(e){if(e.keyCode===13){table._fnDraw();}});
        $("#estado").on("change",function(){style_error_cbo_final('#estado',false);});
        keyup_input_general_3("#frmUsuario input", "#frmUsuario", "#modalUsuario");
        $("#ruc").on("keyup",function(e){if(e.keyCode===13){$("#btnValidarRUC").trigger("click");}});
        $("#dni").on("keyup",function(e){if(e.keyCode===13){$("#btnValidarDNI").trigger("click");}});
        $("#btnAddCliente").on("click",function(){
            accionCliente = "C";
            $("#modalSearchCliente").modal("show");
            $('#txtDescCliente').focus();
        });
        $("#btnAddHabitacion").on("click",function () {
            if($("#txtcli").val() !== ""){
                agregar.start();
                if(ValidarItem()){
                    AgregarDetalle();
                }
            }else{
                uploadMsnSmall("Seleccionar Cliente.","ALERTA");
            }
        });
        $("#btnGuardarAlquiler").on("click",function () {
            if(ValidarAlquiler()){
                save();
            }
        });
        $("#cboEstAlquiler").on("change",function () {
            table._fnDraw();
        });
        $("#tiempo").on("change",function () {
            ValidarTiempo(this);
        });
        $("#btnLimpiar").on("click",LimpiarDetalle);
        $("#btnAddPago").on("click",function () {
            abonar.start();
            if(ValidarPago()){
                GuardarAbono();
            }
        });
        $("#btnNewCliente,#btnNewHuesped").on("click",new_record);
        $("#btnNewVenta").on("click",function () {
            LimpiarVenta();
            tableCliente._fnDraw();
            $("#modalVenta").modal("show");
        });
        $("#btnGuardarVenta").on("click",function () {
            if(ValidarVenta()){
                GuardarVenta();
            }
        });
        $("#cboLiTipo").on("change",function () {
            $.ajax({
                type: 'post',
                url: "list_productosxtipo",
                dataType: 'json',
                data:{tipo:$(this).val()},
                success: function (respJson) {
                    if(respJson !== null){
                        var lista = respJson.data;
                        var html = "<option value='0' data-precio='0.00'>--SELECCIONE--</option>";
                        for(var i=0;i<lista.length;i++){
                            html+="<option value='"+lista[i].id+"' data-precio='"+lista[i].precio+"'>"+lista[i].nombre+"</option>";
                        }
                        $("#cboProductoServicio").html(html);
                        $("#cboProductoServicio").selectpicker("refresh");
                    }else{
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#cboProductoServicio").on("change",function () {
            var pre = $('option:selected', $(this)).attr('data-precio');
            $("#cantidadPS").val("1");
            $("#precioPS").val(pre);
        });
        $("#btnGuardarPS").on("click",function () {
            if(ValidarProductoServicio()){
                addProducto.start();
                $.ajax({
                    type: 'post',
                    url: "addproducto_huesped",
                    dataType: 'json',
                    data:$("#frmPS").serialize(),
                    success:function(respJson){
                        if(respJson!==null){
                            if(respJson.dato==="OK"){
                                addProducto.stop();
                                table._fnDraw();
                                ActualizarDetails();
                                $("#modalAddProductoServicio").modal("hide");
                                uploadMsnSmall(respJson.msj,'OK');
                            }else if(respJson.dato==="ERROR"){
                                if(respJson.listado.length>0){
                                    for (var i = 0; i < respJson.listado.length; i++) {
                                        if(respJson.listado[i] === "E1"){estilo_error(true,"#nombres");}
                                        if(respJson.listado[i] === "E2"){estilo_error(true,"#ruc");}
                                        if(respJson.listado[i] === "E3"){estilo_error(true,"#dni");}
                                        if(respJson.listado[i] === "E4"){style_error_cbo_final("#genero",true);}
                                    }
                                }else{
                                    uploadMsnSmall(respJson.msj,'ERROR');
                                }
                                addProducto.stop();
                            }
                        }else{
                            addProducto.stop();
                            uploadMsnSmall('Problemas con el sistema','ERROR');
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        addProducto.stop();
                        uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
                    }
                });
            }
        });
        $("#btnValidarDNI").on("click",function () {
            validar.start();
            $.ajax({
                type: 'post',
                url: 'validar_dni_cliente',
                data: {"dni":$("#dni").val()},
                dataType: 'json',
                success: function(data){
                    if(data!==null){
                        var dato = data.dato;
                        if(dato === "OK"){
                            estilo_error(false, $("#nombres"));
                            $("#nombres").val(data.rpta);
                            validar.stop();
                        }else if(dato === "ERROR") {
                            uploadMsnSmall(data.rpta,'ALERTA');
                            validar.stop();
                        }
                    }else{
                        validar.stop();
                        uploadMsnSmall('Problemas con el sistema','ERROR');
                    }
                },
                error: function (jqXHR, status, error) {
                    validar.stop();
                    uploadMsnSmall(jqXHR.responseText,'ERROR');
                }
            });
        });
        $("#btnValidarRUC").on("click",function(){
            if(ValidarNumeroRuc()) {
                validarRuc.start();
                $.ajax({
                    type: 'post',
                    url: 'validar_ruc_cliente',
                    data: {"ruc": $("#ruc").val()},
                    dataType: 'json',
                    success: function (data) {
                        $("#div-contenedor").html("");
                        if (data !== null) {
                            var dato = data.dato;
                            if (dato === "OK") {
                                var html = data.rpta;
                                html = html.replace(" ","");
                                html = html.replace("class=\"container\"","id=\"contenedor1\"");
                                html = html.replace("class=\"row\"","id=\"contenedor2\"");
                                html = html.replace("class=\"col-md-10 col-md-offset-1\"","id=\"contenedor3\"");
                                html = html.replace("class=\"panel panel-primary\"","id=\"contenedor4\"");

                                var cont1 = $(html).filter("#contenedor1").html();
                                var cont2 = $(cont1).filter("#contenedor2").html();
                                var cont3 = $(cont2).filter("#contenedor3").html();
                                var cont4 = $(cont3).filter("#contenedor4");
                                $("#div-contenedor").html(cont4);

                                var claves = new Array();
                                var valores =  new Array();
                                $(".list-group .col-sm-5").each(function() {
                                    claves.push($.trim($(this).html()));
                                });
                                $(".list-group .col-sm-7").each(function() {
                                    valores.push($.trim($(this).html()));
                                });
                                var nombre = ($(valores[0]).html()).split("-");
                                var direccion = $(valores[7]).html();
                                estilo_error(false, $("#nombres"));
                                $("#nombres").val($.trim(nombre[1]));
                                estilo_error(false, $("#direccion"));
                                $("#direccion").val(direccion);
                                validarRuc.stop();
                            } else if (dato === "ERROR") {
                                uploadMsnSmall(data.rpta, 'ALERTA');
                                validarRuc.stop();
                            }
                        } else {
                            validarRuc.stop();
                            uploadMsnSmall('Problemas con el sistema', 'ERROR');
                        }
                    },
                    error: function (jqXHR, status, error) {
                        validarRuc.stop();
                        uploadMsnSmall(jqXHR.responseText, 'ERROR');
                    }
                });
            }
        });
        $("#div-fecing").on("changeDate",function (){
            $("#tiempo").change();
        });
    };

    return {
        init: function () {
            Iniciando();
        },
        view_record:function(elem){
            view_record(elem);
        },
        SelCli:function(elem){
            SelCli(elem);
        },
        AddHabitacion:function (a) {
            AddHabitacion(a);
        },
        Quitar_habitacion:function (a) {
            Quitar_habitacion(a);
        },
        AbonarPago:function (a) {
            AbonarPago(a);
        },
        delete_pago:function (a) {
            delete_pago(a);
        },
        AddProducto:function (a) {
            AddProducto(a);
        },
        update_item:function (a) {
            update_item(a);
        },
        QuitarProducto:function (a) {
            QuitarProducto(a);
        },
        Cancelar:function (a) {
            Cancelar(a);
        },
        VerModalHuespedes:function (a) {
            VerModalHuespedes(a);
        },
        viewDetails:function (a) {
            viewDetails(a);
        },
        AddProductoServicio:function (a) {
            AddProductoServicio(a);
        },
        QuitarProductoServicio:function (a) {
            QuitarProductoServicio(a);
        },
        QuitarHuespedDet:function (a) {
            QuitarHuespedDet(a);
        },
        culminar_record:function(a){
            culminar_record(a);
        },
        checkPanelAlquiler:function(a){
            checkPanelAlquiler(a);
        },
        SeleccionarEstadoGarantia:function(a){
            SeleccionarEstadoGarantia(a);
        },
        QuitarHabitacionRenovar:function(a){
            QuitarHabitacionRenovar(a);
        }
    };
}();
jQuery(document).ready(function () {
    Pedido.init();
});