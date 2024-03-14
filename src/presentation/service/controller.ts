import { Request, Response } from "express";
import { ServiceService } from "../services";
import { handleError } from "../../domain";


export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  public getAllServices = async (req: Request, res: Response) => {
    return this.serviceService.getAllServices()
      .then( services => res.json(services))
      .catch( error => handleError(error, res));
  }

  public getServiceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.serviceService.getServiceById(id)
      .then( service => res.json(service))
      .catch( error => handleError(error, res));
  }

  public getServicesByProviderId = async (req: Request, res: Response) => {
    const { providerId } = req.params;

    return this.serviceService.getServicesByProviderId(providerId)
      .then( services => res.json(services))
      .catch( error => handleError(error, res));
  }

  public createService = (req: Request, res: Response) => {
    // const [error, serviceDto] = CreateServiceDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.serviceService.createService(serviceDto!)
    //   .then( service => res.json(service))
    //   .catch( error => handleError(error, res));
  }

  public updateService = (req: Request, res: Response) => {
    // const { id } = req.params;
    // const [error, serviceDto] = UpdateServiceDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.serviceService.updateService(id, serviceDto!)
    //   .then( service => res.json(service))
    //   .catch( error => handleError(error, res));
  }

  public deleteService = (req: Request, res: Response) => {
    const { id } = req.params;
    return this.serviceService.deleteService(id)
      .then( service => res.json(service))
      .catch( error => handleError(error, res));
  }

}