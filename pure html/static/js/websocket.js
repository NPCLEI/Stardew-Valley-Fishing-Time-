var ws = new WebSocket(`ws://${serverhost}/dataChannels`)

$(window).bind('unload',function(){
    ws.close();
});

ws.onmessage = function(e){
    // console.log(e);
    var data = JSON.parse(e.data);
    switch(data.type){
        case "scanedres":scanedResHandle(data);break;
        case "error":wsWarning(data.content);break;
        default:console.log(data);
    }
}

function wsWarning(content){
    swal({
        title:"出现错误!",
        text:content,
        icon:"error"
    });
}