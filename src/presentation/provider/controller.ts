import { Request, Response } from "express";
import { ProvidersService } from "../services";
import { handleError } from "../../domain";

export class ProviderController {
  constructor(private readonly providerService: ProvidersService) {}

  public getAllProviders = async (req: Request, res: Response) => {
    return this.providerService.getAllProviders()
      .then( providers => res.json(providers))
      .catch( error => handleError(error, res));
  }

  public getProviderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.providerService.getProviderById(id)
      .then( provider => res.json(provider))
      .catch( error => handleError(error, res));
  }

  public getProvidersByServiceId = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    return this.providerService.getProvidersByServiceId(serviceId)
      .then( providers => res.json(providers))
      .catch( error => handleError(error, res));
  }

  public createProvider = (req: Request, res: Response) => {
    // const [error, providerDto] = CreateProviderDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.providerService.createProvider(providerDto!)
    //   .then( provider => res.json(provider))
    //   .catch( error => handleError(error, res));
  }

  public updateProvider = (req: Request, res: Response) => {
    // const { id } = req.params;
    // const [error, providerDto] = UpdateProviderDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.providerService.updateProvider(id, providerDto!)
    //   .then( provider => res.json(provider))
    //   .catch( error => handleError(error, res));
  }

  public deleteProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const provider = await this.providerService.deleteProvider(id);
      return res.json(provider);
    } catch (error) {
      return handleError(error, res);
    }
  }
}