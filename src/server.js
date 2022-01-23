const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');
const tournamentRouter = require('./routes/tournament.route');
const websockets = require('./controllers/gameEngine/game.engine.controller');
const GameEngineController=require('./controllers/gameEngine/game.engine.controller');
// Init express
const app = express();

// Init environment
dotenv.config();

// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());

// enabling cors for all requests by using cors middleware
app.use(cors());

// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);

app.use(`/api/v1/users`, userRouter);
app.use(`/api/v1/tournament`, tournamentRouter);

// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// // starting the server
// const server = app.listen(port, () =>
//     console.log(`🚀 Server running on port ${port}!`));


const server = app.listen(port, () => {
    if (process.send) {
      process.send(`Server running at http://localhost:${port}\n\n`);
    }
  });

GameEngineController.websocket(server);

module.exports = app;