require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser')
const path = require("path");
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const corsOptions = {
  Credential: 'true',
};
const app = express();
app.use(express.json())
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser())

const {createServer}  = require("http");
const {Server} = require("socket.io");
const httpServer = createServer(app);
// const srver = require('http').createServer(app)
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://social-media-web-application.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors({
  origin: "https://social-media-web-application.vercel.app/",
  credentials:true,
  optionSuccessStatus:200
}));
const io = new Server(httpServer,{
  cors: {
    origin: 'https://social-media-web-application.vercel.app/',
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true,
    optionSuccessStatus:200
  },allowEIO3: true}
  );
  const PORT = process.env.PORT||3000;
  httpServer.listen(PORT, () => {
    console.log("socket Is Running Port: " + PORT);
   });

io.on('connection', socket => {
  console.log("connection with socket is established");
    SocketServer(socket);
})
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
if(process.env.NODE_ENV==="production"){
  const path = require("path");
  app.use(express.static(path.join(__dirname,"client/build")));
  app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'client','build','index.html'))
})
}
//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
//#endregion

// if(process.env.NODE_ENV==="production"){
//   app.use(express.static("frontend/build"));
//   const path = require("path");
//   app.use(express.static(path.join(__dirname, './my_final_project_front/build')))
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/build'))
// })
// }
// const URI = process.env.MONGODB_URL;
const URI = process.env.DB_LOCAL_URI;
console.log("url",`${process.env.DB_LOCAL_URI}`);

mongoose.connect(URI, {
  
    useNewUrlParser:true,
    useUnifiedTopology:true
}, err => {
    if(err) throw err;
    console.log("Database Connected!!")
})

// app.listen(`${process.env.PORT}`,()=>console.log(`server started at ${process.env.PORT} in ${process.env.NODE_ENV}`
// ));