$.ajax({
    type: 'post',
    url: "upload_menu",
    dataType: 'json',
    success:function(respJson){
        if(respJson!==null){
            $("#side-menu").append(respJson.menu);
        }else{
            uploadMsnSmall('Problemas con el sistema','ERROR');
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        uploadMsnSmall(XMLHttpRequest.responseText,'ERROR');
    } 
});