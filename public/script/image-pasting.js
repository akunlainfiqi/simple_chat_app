var socket = io();

$(function () {
    var file = null;
    document.onpaste = function(event){
        // fileInput.files = e.clipboardData.files;
        file = (event.clipboardData || event.originalEvent.clipboardData).files;
        if(file.length)
            $(".file-upload-notice").html(
                "<span style='font-size: 12px;'>'esc' to cancel</span><br>upload image.png... ");
    };
    document.body.onkeyup = function(k) {
        if(k.key == "Escape") {
            file = null;
            $(".file-upload-notice").html("");
        }
    }
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
        $(".file-upload-notice").html("");
    }
    $("#submitBtn").on("click", submitMsg);
    $("#textInput").on("keypress", function (e) {
        if (e.which == 13) // if enter
            submitMsg();
    });
})