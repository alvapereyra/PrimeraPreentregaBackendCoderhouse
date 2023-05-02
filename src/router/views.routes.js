import { Router } from "express";
import ProductManager from "../controller/ProductManager.js"

const product = new ProductManager()
const viewRouter = Router();

viewRouter.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

export default viewRouter