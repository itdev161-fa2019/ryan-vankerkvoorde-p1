(function () {
    var element = function (id) {
        return document.getElementById(id);
    }

    //Get Elements
    var status = element('status');
    var messages = element('messages');
    var textarea = element('textarea');
    var username = element('username');
    var clearBtn = element('clear');

    //set default status
    var statusDefault = status.textContent;

    var setStatus = function (s) {
        //  Set Status
        status.textContent = s;
        if (s !== statusDefault) {
            var delay = setTimeout(function () {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    //connect to socket.io
    var socket = io.connect('http://127.0.0.1:4000');

    //check for connection
    if (socket !== undefined) {
        console.log("Connected to socket...")

        //handle output
        socket.on('output', function (data) {
            console.log(data);

            if (data.length) {
                for (var x = 0; x < data.length; x++) {
                    // Build out message div
                    var message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.textContent = data[x].name + ": " + data[x].message;
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);
                }
            }
        });

        // Get Status From Server
        socket.on('status', function (data) {
            // get message status
            setStatus((typeof data === 'object') ? data.message : data);
            // If status is clear, clear text
            if (data.clear) {
                textarea.value = '';
            }
        });

        // Handle Input
        textarea.addEventListener('keydown', function (event) {
            if (event.which === 13 && event.shiftKey == false) {
                // Emit to server input
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });
                event.preventDefault();
            }
        })

        // Handle Chat Clear
        clearBtn.addEventListener('click', function () {
            socket.emit('clear');
        });
        // Clear Message
        socket.on('cleared', function () {
            messages.textContent = '';
        });
    }



})();