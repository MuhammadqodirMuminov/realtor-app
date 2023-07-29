import { Test, TestingModule } from '@nestjs/testing';
import { PropertyType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeService } from './home.service';

const mockReturnData = [
  {
    id: 1,
    address: 'Tahkent',
    number_of_badroms: 2,
    number_of_bathroms: 1,
    city: 'Tashkent',
    listed_date: '2023-07-22T13:55:46.825Z',
    land_size: 60,
    price: 120,
    propertyType: PropertyType.CONDO,
    created_at: '2023-07-22T13:55:46.825Z',
    updated_at: '2023-07-22T13:55:46.825Z',
    realtor_id: 4,
    images: [
      {
        url: 'https://img1.com',
      },
    ],
  },
];

const mockHome = {
  id: 1,
  address: 'Tahkent',
  number_of_badroms: 2,
  number_of_bathroms: 1,
  city: 'Tashkent',
  listed_date: '2023-07-22T13:55:46.825Z',
  land_size: 60,
  price: 120,
  propertyType: PropertyType.CONDO,
};

const mockImages = [
  {
    id: 1,
    url: 'img1',
  },
  {
    id: 2,
    url: 'img2',
  },
];

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        {
          provide: PrismaService,
          useValue: {
            home: {
              findMany: jest.fn().mockReturnValue(mockReturnData),
              create: jest.fn().mockReturnValue(mockHome),
            },
            image: {
              createMany: jest.fn().mockReturnValue(mockImages),
            },
          },
        },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getAllHomes', () => {
    const filters = {
      city: 'toshkent',
      price: {
        gte: 100,
        lte: 200,
      },
      propertyType: PropertyType.CONDO,
    };
    it('should call prisma home.findMany with correct params', async () => {
      const mockPrismaFindManyHomes = jest.fn();

      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      await service.getHomes(filters);

      expect(mockPrismaFindManyHomes).toBeCalledWith({
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
    });
  });

  describe('crerateHome',() => {
    it('should call prisma home.create with the correct payload', async () => {
      
    });
  });
});
