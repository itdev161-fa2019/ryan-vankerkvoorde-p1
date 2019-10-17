import express from "express";
import config from "config";
import connectDatabase from "./config/db";
import { check, validationResult } from 'express-validator';

const client = require('socket.io').listen(4000).sockets;
const MongoClient = require('mongodb').MongoClient;

//Init express application
//const app = express();

//Connect db
//connectDatabase();

const uri = config.get("mongoURI");

MongoClient.connect(uri, function (err, db) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);

    }

    console.log('MongoDBAtlas Connected');

    //connect to socket.io
    client.on("connection", function (socket) {
        let chat = db.collection('chats');

        //Create function to send status
        sendStatus = function (s) {
            socket.emit('status', s);
        }

        // Get Chats from mongo collection
        chat.find().limit(100).sort({ _id: 1 }).toArray(function (err, res) {
            if (err) {
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
                    client.emit('output', [data]);

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

});




//  Configure Middleware
//app.use(express.json({ extended: false }));

//API endpoints
/**
 * @route GET /
 * @desc Test endpoint
 */
//app.get("/", (req, res) =>
//    res.send("http get request sent to root api endpoint")
//);

/**
 * @route POST api/users
 * @desc Register user
 */
//Connection Listener
//const port = 5000;

//app.listen(port, () => console.log(`Express server running on port ${port}`));
