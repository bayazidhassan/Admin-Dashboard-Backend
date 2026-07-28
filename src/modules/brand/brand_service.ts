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

export const BrandService = {
  createBrand,
};
