import { Request, Response } from "express";
import { ClientsService } from "../services";
import { handleError } from "../../domain";

export class ClientController {
  constructor(private readonly clientService: ClientsService) {}

  public getAllClients = async (req: Request, res: Response) => {
    return this.clientService.getAllClients()
      .then( clients => res.json(clients))
      .catch( error => handleError(error, res));
  }

  public getClientById = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.clientService.getClientById(id)
      .then( client => res.json(client))
      .catch( error => handleError(error, res));
  }

  public getClientByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    return this.clientService.getClientByUserId(userId)
      .then( client => res.json(client))
      .catch( error => handleError(error, res));
  }

  public createClient = async (req: Request, res: Response) => {
    return this.clientService.createClient(req.body)
      .then( client => res.json(client))
      .catch( error => handleError(error, res));
  }

  public updateClient = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.clientService.updateClient(id, req.body)
      .then( client => res.json(client))
      .catch( error => handleError(error, res));
  }

  public deleteClient = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.clientService.deleteClient(id)
      .then( client => res.json(client))
      .catch( error => handleError(error, res));
  }
}