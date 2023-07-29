import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/decorators/rules.decorator';
import { IUserType, User } from 'src/user/decorator/user.decorator';
import {
  BodyAddHomeDto,
  HomeResponceDto,
  MessageBodyDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeServce: HomeService) {}

  @Get()
  async getAllHomes(
    @Query('city') city: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('propertyType') propertyType: PropertyType,
  ): Promise<HomeResponceDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return await this.homeServce.getHomes(filters);
  }

  @Get(':id')
  async getHomeById(@Param('id') id: string): Promise<HomeResponceDto> {
    return await this.homeServce.getById(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  async addHome(@Body() body: BodyAddHomeDto, @User() user: IUserType) {
    return await this.homeServce.crerateHome(body, user.userId);
  }

  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: IUserType,
  ): Promise<HomeResponceDto> {
    const realtor = await this.homeServce.getRealtorByHomeId(id);

    if (realtor.realtor_id !== user.userId) throw new UnauthorizedException();
    return await this.homeServce.updateHomeById(id, body);
  }

  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: IUserType,
  ) {
    const realtor = await this.homeServce.getRealtorByHomeId(id);

    if (realtor.realtor_id !== user.userId) throw new UnauthorizedException();
    return this.homeServce.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post('inquire/:id')
  async addMessage(
    @Param('id', ParseIntPipe) id: number,
    @User() user: IUserType,
    @Body() body: MessageBodyDto,
  ) {
    return this.homeServce.inquire(user, body, id);
  }

  @Roles(UserType.REALTOR)
  @Get(':id/messages')
  async getAllMessages(
    @Param('id', ParseIntPipe) id: number,
    @User() user: IUserType,
  ) {

    const realtor = await this.homeServce.getRealtorByHomeId(id);

    console.log({realtor}, user);

    if (realtor.realtor_id != user.userId) throw new UnauthorizedException();

    return this.homeServce.getMessagesById(user, id)
  }
}
