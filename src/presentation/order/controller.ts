import { Request, Response } from "express";
import { OrdersService } from "../services";
import { handleError } from "../../domain";

export class OrderController {

  constructor(private readonly ordersService: OrdersService) {}

  public getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.ordersService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  public getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await this.ordersService.getOrderById(id);
      res.status(200).json(order);
    } catch (error) {
      handleError(error, res);
    }
  }

  public getOrdersByClientId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const orders = await this.ordersService.getOrdersByClientId(id);
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  public getOrdersByProviderId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const orders = await this.ordersService.getOrdersByProviderId(id);
      res.status(200).json(orders);
    } catch (error) {
      handleError(error, res);
    }
  }

  public createOrder = async (req: Request, res: Response) => {
    try {
      const order = req.body;
      const result = await this.ordersService.createOrder(order);
      res.status(201).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  public updateOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = req.body;
      const result = await this.ordersService.updateOrder(id, order);
      res.status(200).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }

  public deleteOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.ordersService.deleteOrder(id);
      res.status(200).json(result);
    } catch (error) {
      handleError(error, res);
    }
  }
}