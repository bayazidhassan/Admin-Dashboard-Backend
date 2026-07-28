import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createBrand = async (payload: {
  name: string;
  slug: string;
  logo?: string;
  status?: boolean;
  description?: string;
}) => {
  const existingBrand = await prisma.brand.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug: payload.slug,
        },
      ],
    },
  });

  if (existingBrand) {
    throw new AppError(409, 'Brand already exists');
  }

  const brand = await prisma.brand.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      logo: payload.logo,
      status: payload.status,
      description: payload.description,
    },
  });

  return brand;
};

const getBrands = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        slug: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  if (query.status !== undefined) {
    where.status = query.status === 'true';
  }

  const [items, total] = await prisma.$transaction([
    prisma.brand.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.brand.count({
      where,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

export const BrandService = {
  createBrand,
  getBrands,
};
