import config from "config";

const mongoClient = require('mongodb').MongoClient;
const socketClient = require('socket.io').listen(4000).sockets;

const uri = config.get("mongoURI");

//connect mongo
mongoClient.connect(uri, function (err, client) {
    var col = client.db("mongoChat");
    if (err) {
        console.log('Error occurred while connecting to MongoDB...\n', err);

    }

    console.log('MongoDB Connected');

    //connect to socket.io
    socketClient.on("connection", (socket) => {
        let chat = col.collection('chats');

        //Create function to send status
        function sendStatus(s) {
            socket.emit('status', s);
        }

        // Get Chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {   //doesnt work yet
            if (err) {
                console.log('test');    //test for error spot
                throw err;
            }
            //emit messages
            socket.emit(('output', res));
        });

        socket.on('input', function (data) {
            let name = data.name;
            let message = data.message;

            //check for name and message
            if (name == '' || message == '') {
                sendStatus('Please enter a name and message');  //error message
            } else {
                //insert message
                chat, insert({ name: name, message: message }, function () {
                    SocketClient.emit('output', [data]);

                    //send status object
                    sendStatus({
                        message: 'Message Sent',
                        clear: true
                    });
                });
            }
        });

        //handle clearing
        socket.on('clear', function (data) {
            //remove all chats from collection
            chat.remove({}, function (s) {

                //emit clear
                socket.emit('cleared');
            });
        });
    });

    client.close();
});

