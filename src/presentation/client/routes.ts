import { Router } from "express";
import { ClientController } from "./controller";
import { ClientsService } from "../services";

export class ClientRoutes {
  
    static get routes() {
      const router = Router();
  
      const clientService = new ClientsService();
      const controller = new ClientController(clientService);
  
      //* /api/client
      router.get('/', controller.getAllClients);
  
      //* /api/client/:id
      router.get('/:id', controller.getClientById);

      //* /api/client/user/:userId
      router.get('/user/:userId', controller.getClientByUserId);
  
      //* /api/client
      router.post('/', controller.createClient);
  
      //* /api/client/:id
      router.put('/:id', controller.updateClient);
  
      //* /api/client/:id
      router.delete('/:id', controller.deleteClient);
  
      return router;
    }
}

