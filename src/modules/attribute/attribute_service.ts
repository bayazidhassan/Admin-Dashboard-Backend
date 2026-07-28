import AppError from '../../errors/AppError';
import prisma from '../../lib/prisma';

const createAttribute = async (payload: {
  name: string;
  slug: string;
  type: 'dropdown' | 'radio' | 'checkbox' | 'color_swatch' | 'image_swatch';
}) => {
  const existingAttribute = await prisma.attribute.findFirst({
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

  if (existingAttribute) {
    throw new AppError(409, 'Attribute already exists');
  }

  const attribute = await prisma.attribute.create({
    data: {
      name: payload.name,
      slug: payload.slug,
      type: payload.type,
    },
  });

  return attribute;
};

export const AttributeService = {
  createAttribute,
};
