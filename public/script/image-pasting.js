var socket = io();
// const getFile = document.onpaste = function(event){
//     var items = (event.clipboardData || event.originalEvent.clipboardData).items;
//     console.log(JSON.stringify(items)); // will give you the mime types
//     for (index in items) {
//       var item = items[index];
//       if (item.kind === 'file') {
//         var blob = item.getAsFile();
//         var reader = new FileReader();
//         reader.onload = function(event) {
//         // ini base64URI
//           return event.target.result
//         }; 
//         reader.readAsDataURL(blob);
//       }
//     }
// }

$(function () {
    function getFile() {
        const fileInput = document.getElementById("attachment");
        window.addEventListener('paste', e => {
            fileInput.files = e.clipboardData.files;;
        });
        return fileInput.files;
    }
    function submitMsg() {
        let msg = $("#textInput").val();
        let file = getFile();
        if (msg !== "" || file.length)
        socket.emit("message sent", {
            name: name ? name : "Anonymous",
            message: msg,
            file: file.length ? file : null
        });
        document.getElementById("textInput").value = "";
    }
    $("#submitBtn").on("click", submitMsg);
    $("#textInput").on("keypress", function (e) {
        if (e.which == 13) // if enter
            submitMsg();
    });
})