import { Router } from "express";
import { createOrder, getOrderHistory } from "../controllers/order.controller.js";

const router = Router()

router.route("/").post(createOrder)

router.route("/order-history").post(getOrderHistory)

export default router