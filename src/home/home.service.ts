import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserType } from 'src/user/decorator/user.decorator';
import { HomeResponceDto, MessageBodyDto } from './dto/home.dto';
import { ICreateHome, IFilters, IUpdateHome } from './home.interface';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: IFilters): Promise<HomeResponceDto[]> {
    return await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        number_of_badroms: true,
        number_of_bathroms: true,
        city: true,
        listed_date: true,
        land_size: true,
        price: true,
        propertyType: true,
        created_at: true,
        updated_at: true,
        realtor_id: true,
        images: {
          select: {
            url: true,
          },
        },
      },
      where: filters,
    });
  }

  async getById(id: string): Promise<HomeResponceDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id: +id },
      select: {
        id: true,
        address: true,
        number_of_badroms: true,
        number_of_bathroms: true,
        city: true,
        listed_date: true,
        land_size: true,
        price: true,
        propertyType: true,
        created_at: true,
        updated_at: true,
        realtor_id: true,
        images: {
          select: {
            url: true,
          },
        },
        realtor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!home) throw new BadRequestException('Home not found');
    return home;
  }

  async crerateHome(
    {
      address,
      number_of_badroms,
      number_of_bathroms,
      city,
      price,
      land_size,
      propertyType,
      images,
    }: ICreateHome,
    id: number,
  ): Promise<HomeResponceDto> {
    const newHome = await this.prismaService.home.create({
      data: {
        address,
        number_of_badroms,
        number_of_bathroms,
        city,
        price,
        land_size,
        realtor_id: id,
        propertyType,
      },
    });

    const getImages = images.map((image) => {
      return { ...image, home_id: newHome.id };
    });

    await this.prismaService.image.createMany({
      data: getImages,
    });
    return newHome;
  }

  async updateHomeById(
    id: number,
    body: IUpdateHome,
  ): Promise<HomeResponceDto> {
    const existHome = await this.prismaService.home.findUnique({
      where: { id },
    });
    if (!existHome) throw new BadRequestException('Home not found.');

    const updateHome = await this.prismaService.home.update({
      where: { id },
      data: body,
    });

    return updateHome;
  }

  async deleteHome(id: number) {
    return await this.prismaService.home.deleteMany({ where: { id } });
  }

  async getRealtorByHomeId(id: number) {
    return await this.prismaService.home.findUnique({
      where: {
        id,
      },
    });
  }

  async inquire(user: IUserType, body: MessageBodyDto, id: number) {
    const realtor = await this.getRealtorByHomeId(id);

    console.log(id, body, realtor);

    return await this.prismaService.message.create({
      data: {
        userId: user.userId,
        realtor_id: realtor.realtor_id,
        home_id: id,
        message: body.mesage,
      },
    });
  }

  async getMessagesById(user: IUserType, id: number) {
    return this.prismaService.message.findMany({
      where: {
        home_id : id,
      },
    });
  }
}
