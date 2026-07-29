type AttributeOption = {
  attributeId: string;
  attributeValueIds: string[];
};

export const generateVariantCombinations = (
  attributes: AttributeOption[],
): string[][] => {
  if (!attributes.length) return [];

  let result: string[][] = [[]];

  for (const attribute of attributes) {
    const temp: string[][] = [];

    for (const combination of result) {
      for (const valueId of attribute.attributeValueIds) {
        temp.push([...combination, valueId]);
      }
    }

    result = temp;
  }

  return result;
};
