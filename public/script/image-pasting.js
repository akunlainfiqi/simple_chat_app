var socket = io();

$(function () {
    var file = null;
    document.onpaste = function(event){
        // fileInput.files = e.clipboardData.files;
        file = (event.clipboardData || event.originalEvent.clipboardData).files;
    };
    function submitMsg() {
        let msg = $("#textInput").val();
        if (msg !== "" || file) {
            socket.emit("message sent", {
                name: name ? name : "Anonymous",
                message: msg,
                file: file
            });
            file = null;
        }
        document.getElementById("textInput").value = "";
    }
    $("#submitBtn").on("click", submitMsg);
    $("#textInput").on("keypress", function (e) {
        if (e.which == 13) // if enter
            submitMsg();
    });
})