var growlMessage = function (msg, type, offset, delay) {
    $.bootstrapGrowl(msg, {
        ele: 'body', // which element to append to
        type: type, // (null, 'info', 'danger', 'success', 'warning')
        offset: {
            from: offset,
            amount: 500
        }, // 'top', or 'bottom'
        align: 'center', // ('left', 'right', or 'center')
        width: 'auto', // (integer, or 'auto')
        delay: delay, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
        allow_dismiss: true, // If true then will display a cross to close the popup.
        stackup_spacing: 10 // spacing between consecutively stacked growls.
    });
};

var viewMessageLoginLogout = function () {
    var tipo = $("#error").val();
    var msj_login = $("#msj_login").val();
    switch (tipo) {
        case "ERROR":
            growlMessage(msj_login, "danger", "top", 10000);
            break;
        case "EXIT":
            growlMessage("Error del Sistema!", "danger", "top", 10000);
            break;
        default:
        /* growlMessage("¡Se encontró un problema en el servidor!", "danger", "bottom", 10000);
         break;*/
    }
    /*var msj_logout = $("#msj_logout").val();
    if (msj_logout === "OK") {
        growlMessage("¡Se cerró sesión correctamente!", "success", "bottom", 10000);
    }*/
};
viewMessageLoginLogout();
/*$.getJSON("http://jsonip.com/?callback=?",function(data){
    alert("Mi ip: "+ data.ip);
});*/
/*$("#btnlogin").on("click",function(){logeo();});
$("#username").on("keyup",function(e){if(e.keyCode === 13){logeo();}});
$("#password").on("keyup",function(e){if(e.keyCode === 13){logeo();}});*/
var namenavigator = navigator.userAgent.toLowerCase();
var name = "";
if(namenavigator.indexOf('chrome') > -1){
    name = "Chrome";
}else if(namenavigator.indexOf('firefox') > -1){
    name = "Firefox";
}else if(namenavigator.indexOf('opera') > -1){
    name = "Opera";
}else if(namenavigator.indexOf('MSIE') > -1){
    name = "Internet Explorer";
}
$("#navi").val(name);
$.ajax({
    type: 'get',
    url: "http://jsonip.com/?callback=?",
    dataType: 'json',
    success: function(data){
        if(data!==null){
            $("#keykey").val(data.ip);
        }
    },
    error: function (jqXHR, status, error) {
        uploadMsnSmall(jqXHR.responseText,'ERROR');
    }
});

var anio = new Date().getFullYear();
$("#spanAnio").text(anio);