import { Request, Response } from "express";
import { handleError } from "../../domain";
import { PaymentService } from '../services/payment.service';
import { CreateOrderDto } from '../../domain/index';

export class PaymentController {
  constructor(
    public readonly paymentService: PaymentService,
  ) {}

  public createOrder = async (req: Request, res: Response) => {
    const [error, createOrderDto] = CreateOrderDto.create(req.body);

    if (error) return res.status(400).json({ error });
    
    return this.paymentService.createOrder(createOrderDto!)
      .then( order => res.json(order))
      .catch( error => handleError(error, res));
  }

  public captureOrder = async (req: Request, res: Response) => {
    const { token } = req.query;

    return this.paymentService.captureOrder(token as string)
      .then( order => res.json(order))
      .catch( error => handleError(error, res));
  }

  public cancelOrder = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.paymentService.cancelOrder(id)
      .then( order => res.json(order))
      .catch( error => handleError(error, res));
  }
}