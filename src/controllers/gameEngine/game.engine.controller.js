const dotenv = require('dotenv');
dotenv.config();
const CommonHelper = require('../../helpers/common.helper');
const ResponseMessages = require('../../helpers/response.helper');
const WebSocket = require('ws');
const queryString = require('query-string');
const Constant = require('../../helpers/constant.helper');
const Tournament = require('../../models/tournament.model');

class GameEngineController {
    websocket = (expressServer) => {
        const socketServer = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });

        // socket server start for listening from user 
        socketServer.on('connection', (socketClient) => {
            console.log('connected');
            console.log('Number of clients: ', socketServer.clients.size);
            socketClient.send('You successfully connected to the websocket.');

            setInterval(() => {
                /* create a tournament  */
                const tournamentResult = Tournament.create();
                console.log(tournamentResult);
                // socketClient.send(tournamentResult);

                setInterval(()=>{
                                      
                })


                // setInterval(() => {
                //     let minNum = 0;
                //     let maxNum = 36;
                //     /* generate result number */
                //     let resultNumb, er = Math.floor(Math.random() * (maxNum - minNum) + minNum);
                //     socketClient.send(resultNumb);
                // }, Constant.WHEEL_TIME_INTERVAL_MINUTE * 60 * 1000)
                /* calculate the lowest */
            }, Constant.WHEEL_TIME_INTERVAL_MINUTE * 60 * 1000)

            // // get response from client
            // socketClient.on('message', (receivedMessage) => {
            //     //  send message to client on his recieved receivedMessage
            //     socketServer.broadcast('ye le bhai');
            //     console.log('Received: ' + receivedMessage)
            // });

        });

    }
}
module.exports = new GameEngineController();