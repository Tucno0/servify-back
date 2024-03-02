import { Router } from "express";
import { ProviderController } from "./controller";
import { ProvidersService } from "../services";

export class ProviderRoutes {
  
    static get routes() {
      const router = Router();
  
      const providerService = new ProvidersService();
      const controller = new ProviderController(providerService);
  
      //* /api/provider
      router.get('/', controller.getAllProviders);
  
      //* /api/provider/:id
      router.get('/:id', controller.getProviderById);

      //* /api/provider/:serviceId
      router.get('/service/:serviceId', controller.getProvidersByServiceId);
  
      //* /api/provider
      router.post('/', controller.createProvider);
  
      //* /api/provider/:id
      router.put('/:id', controller.updateProvider);
  
      //* /api/provider/:id
      router.delete('/:id', controller.deleteProvider);
  
      return router;
    }
}