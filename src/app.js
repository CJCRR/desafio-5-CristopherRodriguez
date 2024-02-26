import express from 'express';
import routerProducts from './routes/products.js';
import routerCarts from './routes/carts.js';
import userRouter from './routes/users.router.js';
import viewsRoutes from './routes/views.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import "./dao/dbConfig.js";
//import { ProductManager } from './dao/file/manager/ProductManager.js'

//const productManager = new ProductManager('./src/dao/file/db/products.json')

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use("/", viewsRoutes);
app.use("/api/users", userRouter);

app.use((req, res) => {
  res.render("404");
});

// Handlebars configuracion
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views",`${__dirname}/views`);


const httpServer = app.listen(8090, () => {
  console.log("Escuchando puerto 8090");
});

const socketServer = new Server(httpServer)

import ProductManager from "./dao/mongooseManager/products.dao.js"
const productManager = new ProductManager()

import MessagesManager from "./dao/mongooseManager/messages.dao.js";
const messagesManager = new MessagesManager();

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado con id: ", socket.id);

  const listProducts = await productManager.getProducts({});
  socketServer.emit("sendProducts", listProducts);

  socket.on("addProduct", async (obj) => {
      await productManager.addProduct(obj);
      const listProducts = await productManager.getProducts({});
      socketServer.emit("sendProducts", listProducts);
  });

  socket.on("deleteProduct", async (id) => {
      await productManager.deleteProduct(id);
      const listProducts = await productManager.getProducts({});
      socketServer.emit("sendProducts", listProducts);
  });

  socket.on("nuevousuario",(usuario)=>{
          console.log("usuario" ,usuario)
          socket.broadcast.emit("broadcast",usuario)
         })
         socket.on("disconnect",()=>{
             console.log(`Usuario con ID : ${socket.id} esta desconectado `)
         })
     
         socket.on("mensaje", async (info) => {
          console.log(info)
          await messagesManager.createMessage(info);
          socketServer.emit("chat", await messagesManager.getMessages());
        });
});
