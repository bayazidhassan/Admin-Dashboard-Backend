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

const getAttributes = async (query: Record<string, unknown>) => {
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
        type: {
          contains: String(query.search),
          mode: 'insensitive',
        },
      },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.attribute.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        values: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            mediaAttachments: {
              include: {
                media: true,
              },
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            values: true,
          },
        },
      },
    }),

    prisma.attribute.count({
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

const getAttributeById = async (id: string) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
    include: {
      values: {
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          mediaAttachments: {
            include: {
              media: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      },
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  return attribute;
};

const updateAttribute = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    type?: 'dropdown' | 'radio' | 'checkbox' | 'color_swatch' | 'image_swatch';
  },
) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  if (payload.name || payload.slug) {
    const existingAttribute = await prisma.attribute.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: [
          ...(payload.name ? [{ name: payload.name }] : []),
          ...(payload.slug ? [{ slug: payload.slug }] : []),
        ],
      },
    });

    if (existingAttribute) {
      throw new AppError(409, 'Attribute name or slug already exists');
    }
  }

  return await prisma.attribute.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteAttribute = async (id: string) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id,
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  const attributeInUse = await prisma.attribute.findFirst({
    where: {
      id,
      values: {
        some: {
          variants: {
            some: {},
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (attributeInUse) {
    throw new AppError(
      409,
      'Cannot delete attribute because it is used by one or more product variants',
    );
  }

  await prisma.attribute.delete({
    where: {
      id,
    },
  });

  return null;
};

const addAttributeValue = async (
  attributeId: string,
  payload: {
    value: string;
    slug: string;
    referenceValue?: string;
  },
) => {
  const attribute = await prisma.attribute.findUnique({
    where: {
      id: attributeId,
    },
  });

  if (!attribute) {
    throw new AppError(404, 'Attribute not found');
  }

  const existingValue = await prisma.attributeValue.findUnique({
    where: {
      attributeId_value: {
        attributeId,
        value: payload.value,
      },
    },
  });

  if (existingValue) {
    throw new AppError(
      409,
      'Attribute value already exists for this attribute',
    );
  }

  return await prisma.attributeValue.create({
    data: {
      ...payload,
      attributeId,
    },
  });
};

const updateAttributeValue = async (
  valueId: string,
  payload: {
    value?: string;
    slug?: string;
    referenceValue?: string;
  },
) => {
  const value = await prisma.attributeValue.findUnique({
    where: {
      id: valueId,
    },
  });

  if (!value) {
    throw new AppError(404, 'Attribute value not found');
  }

  if (payload.value) {
    const exists = await prisma.attributeValue.findUnique({
      where: {
        attributeId_value: {
          attributeId: value.attributeId,
          value: payload.value,
        },
      },
    });

    if (exists && exists.id !== valueId) {
      throw new AppError(
        409,
        'Attribute value already exists for this attribute',
      );
    }
  }

  return await prisma.attributeValue.update({
    where: {
      id: valueId,
    },
    data: payload,
  });
};

const deleteAttributeValue = async (valueId: string) => {
  const value = await prisma.attributeValue.findUnique({
    where: {
      id: valueId,
    },
  });

  if (!value) {
    throw new AppError(404, 'Attribute value not found');
  }

  const attributeValueInUse = await prisma.attributeValue.findFirst({
    where: {
      id: valueId,
      variants: {
        some: {},
      },
    },
    select: {
      id: true,
    },
  });

  if (attributeValueInUse) {
    throw new AppError(
      409,
      'Cannot delete attribute value because it is used by one or more product variants',
    );
  }

  await prisma.attributeValue.delete({
    where: {
      id: valueId,
    },
  });

  return null;
};

export const AttributeService = {
  createAttribute,
  getAttributes,
  getAttributeById,
  updateAttribute,
  deleteAttribute,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};
