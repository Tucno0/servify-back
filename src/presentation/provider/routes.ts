import { Router } from "express";
import { ProviderController } from "./controller";
import { ProvidersService } from "../services";

export class ProviderRoutes {
  
    static get routes() {
      const router = Router();
  
      const providerService = new ProvidersService();
      const controller = new ProviderController(providerService);
  
      //* /api/providers
      router.get('/', controller.getAllProviders);
  
      //* /api/providers/:id
      router.get('/:id', controller.getProviderById);

      //* /api/providers/service/:serviceId
      router.get('/service/:serviceId', controller.getProvidersByServiceId);

      //* /api/providers/user/:userId
      router.get('/user/:userId', controller.getProviderByUserId);
  
      //* /api/providers
      router.post('/', controller.createProvider);
  
      //* /api/providers/:id
      router.put('/:id', controller.updateProvider);
  
      //* /api/providers/:id
      router.delete('/:id', controller.deleteProvider);
  
      return router;
    }
}