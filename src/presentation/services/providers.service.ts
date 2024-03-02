import { UuidAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { CustomError, ProviderEntity } from "../../domain";

export class ProvidersService {
  
    public getAllProviders = async () => {
      const providers = await prisma.provider.findMany({
        include: { user: true }
      });
  
      return providers.map( provider => {
        const { user: { password, ...userEntity}, ...providerEntity} = ProviderEntity.fromObject(provider);
        return { ...providerEntity, user: userEntity};
      });
    }
  
    public getProviderById = async (id: string) => {
      if (!UuidAdapter.validate(id)) throw CustomError.badRequest('Invalid id');
  
      const provider = await prisma.provider.findUnique({
        where: { id },
        include: {
          user: true
        },
      });
  
      if (!provider) throw CustomError.notFound('Provider not found');

      const { user: { password, ...userEntity}, ...providerEntity} = ProviderEntity.fromObject(provider);
      return { ...providerEntity, user: userEntity};
    }

    public getProvidersByServiceId = async (serviceId: string) => {
      if (!UuidAdapter.validate(serviceId)) throw CustomError.badRequest('Invalid id');
  
      const serviceProviders = await prisma.service_provider.findMany({
        where: {
          service_id: serviceId
        },
        include: {
          provider: {
            include: {
              user: true
            }
          }
        }
      });
  
      return serviceProviders.map( serviceProvider => {
        const { user, ...providerEntity} = ProviderEntity.fromObject(serviceProvider.provider!);
        const { password, ...userEntity} = user;
  
        return {
          ...providerEntity,
          user: userEntity,
        };
      });
    }
  
    public createProvider = async (provider: any) => {
      return {
        msg: 'Provider created'
      };
    }
  
    public updateProvider = async (id: string, provider: any) => {
      return {
        msg: 'Provider updated'
      };
    }
  
    public deleteProvider = async (id: string) => {
      return {
        msg: 'Provider deleted'
      };
    }
}