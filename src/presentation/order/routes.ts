import { Router } from "express";
import { OrderController } from "./controller";
import { OrdersService } from "../services";

export class OrderRoutes {
  
    static get routes() {
      const router = Router();
  
      const ordersService = new OrdersService();
      const controller = new OrderController(ordersService);

      //* /api/order
      router.get('/', controller.getAllOrders);

      //* /api/order/:id
      router.get('/:id', controller.getOrderById);

      //* /api/order
      router.post('/', controller.createOrder);

      //* /api/order/:id
      router.put('/:id', controller.updateOrder);

      //* /api/order/:id
      router.delete('/:id', controller.deleteOrder);

      return router;
    }
}

