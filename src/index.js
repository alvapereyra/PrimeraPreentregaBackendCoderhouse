import express from "express"
import ProductRouter from "./router/product.routes.js"
import CartRouter from "./router/carts.routes.js"
import {engine} from "express-handlebars"
import * as path from "path"
import __dirname from "./util.js"
import ProductManager from './controller/ProductManager.js';
import viewRouter from "./router/views.routes.js" 
import { Server } from "socket.io";

const app = express()
const PORT = 8080
const product = new ProductManager()

const server = app.listen(PORT, ()=>{
    console.log(`Servidor Express Puerto ${PORT}`);
})

const io = new Server (server);

app.use(express.json())
app.use(express.urlencoded({extended: true}));

//handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))

//static
app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req,res) => {
    let allProducts = await product.getProducts()
    res.render("home", {
        title: "Express Avanzado",
        products : allProducts
    })
})

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)
app.use('/', viewRouter);

const emitirProductos = async () => {
    const productos = await product.getProducts();
    io.emit('products', productos);
}

io.on("connection", async socket => {
    console.log("Conectado");
    await emitirProductos();
    socket.on("addProduct", async data => {
        await product.addProducts(data)
        await emitirProductos();
    })
    socket.on("deleteProduct", async id => {
        await product.deleteProducts(id);
        await emitirProductos();
    })
})

