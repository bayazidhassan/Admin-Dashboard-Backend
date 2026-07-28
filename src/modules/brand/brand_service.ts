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

const getBrandById = async (id: string) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  if (!brand) {
    throw new AppError(404, 'Brand not found');
  }

  return brand;
};

const updateBrand = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    logo?: string;
    status?: boolean;
    description?: string;
  },
) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  if (!brand) {
    throw new AppError(404, 'Brand not found');
  }

  if (payload.name || payload.slug) {
    const existingBrand = await prisma.brand.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          payload.name
            ? {
                name: payload.name,
              }
            : {},
          payload.slug
            ? {
                slug: payload.slug,
              }
            : {},
        ],
      },
    });

    if (existingBrand) {
      throw new AppError(409, 'Brand name or slug already exists');
    }
  }

  return await prisma.brand.update({
    where: {
      id,
    },
    data: payload,
  });
};

export const BrandService = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
};
