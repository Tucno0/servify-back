import { Router } from "express";
import { ServiceController } from "./controller";
import { ServiceService } from '../services/services.service';

export class ServiceRoutes {
  
    static get routes() {
      const router = Router();
  
      const serviceService = new ServiceService();
      const controller = new ServiceController(serviceService);
  
      //* /api/service
      router.get('/', controller.getAllServices);
  
      //* /api/service/:id
      router.get('/:id', controller.getServiceById);

      //* /api/service/provider/:providerId
      router.get('/provider/:providerId', controller.getServicesByProviderId);
  
      //* /api/service
      // router.post('/', controller.createService);
  
      //* /api/service/:id
      // router.put('/:id', controller.updateService);
  
      //* /api/service/:id
      // router.delete('/:id', controller.deleteService);
  
      return router;
    }
}