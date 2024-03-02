import { UuidAdapter } from "../../config";
import { prisma } from "../../data/postgres";
import { CustomError, ServiceEntity } from "../../domain";
export class ServiceService {

  public getAllServices = async () => {
    // Se buscan todos los servicios en la base de datos
    const services = await prisma.service.findMany({
      include: {
        category: true,
        service_images: true
      }
    });
    // Se retorna un arreglo de servicios encontrados
    return services.map( service => ServiceEntity.fromObject(service));
  }

  public getServiceById = async (id: string) => {
    // Se valida que el id sea un uuid
    if (!UuidAdapter.validate(id)) throw CustomError.badRequest('Invalid id');
    // Se busca el servicio por id en la base de datos
    // Devuelve el servicio con el id especificado incluyendo la categoria asociada y sus imagenes
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        service_images: true
      },
    });
    
    // Se valida que el servicio exista en la base de datos
    if (!service) throw CustomError.notFound('Service not found');

    // Se retorna el servicio encontrado si existe
    return ServiceEntity.fromObject(service);
  }

  public createService = async (service: any) => {
    return {};
  }

  public updateService = async (id: string, service: any) => {
    return {};
  }

  public deleteService = async (id: string) => {
    return {};
  }
}