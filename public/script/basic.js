var socket = io();
$(function () {
    $("span.nametag").append(name && name != "" ? name : "Anonymous");

    function loadMsg(msg) {
        msg.forEach(msg => {
            let content = `
            <div>
                <div>
                    <span ${msg.name == name ? 'style="color: red;"' : ""}>
                        ${msg.name}
                    </span>: ${msg.msg}
                </div>`;
                
            var img_size = 'max-width:50%; max-height:50%;';
            if(msg.files.length)
                msg.files.forEach(fname => {
                    content += `<div><img src="${document.URL}image/user/uploaded/${fname}" style="${img_size}"></div>`;
                })
            content += '</div>';
            
            $("div.msg-container").append(content);
        });
    }

    socket.on("load message", (msg) => {
        loadMsg(msg);
    });
    socket.on("new message", (msg) => {
        $("div.msg-container").empty();
        loadMsg(msg);
    });

    // maksimal orang yang di display "is typing"
    const max_people = 3;

    socket.on("is typing", (user) => {
        let u = user.replace(/-/g, " ");
        $("div.is-typing-container").prepend(`
        <span class="user" id="${user}">${u + ", "}
            </span>`);
        if ($("div.is-typing-container").find(".is-typing").length == 0)
        $("div.is-typing-container").append(
            '<span class="is-typing"> is typing...</span>'
        );

        if ($("div.is-typing-container").find(".user").length > max_people) {
        $("div.is-typing-container").find(".user").hide();
        $("div.is-typing-container").find(".is-typing").hide();
        $("div.is-typing-container").append(
            '<span class="people-is-typing">several people is typing...</span>'
        );
        }
    });

    socket.on("done typing", (user) => {
        $("div.is-typing-container").find(`#${user}`).remove();
        if ($("div.is-typing-container").find(".user").length < 1)
        $("div.is-typing-container").find(".is-typing").remove();

        if ($("div.is-typing-container").find(".user").length <= max_people) {
        $("div.is-typing-container").find(".user").show();
        $("div.is-typing-container").find(".is-typing").show();
        $("div.is-typing-container").find(".people-is-typing").remove();
        }
    });
    var isTypingTimeout;
    var typingFlag = true;
    $("#textInput").on("input", function () {
        // biar hanya emit sekali
        if (typingFlag)
        socket.emit("is typing", {
            name: name,
        });

        typingFlag = false;
        clearTimeout(isTypingTimeout);
        isTypingTimeout = setTimeout(doneTyping, 1000);
    });
    function doneTyping() {
        socket.emit("done typing", {
        name: name,
        });
        typingFlag = true;
    }
});