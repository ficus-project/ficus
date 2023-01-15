export const convertSnakeCaseToCamelCase = (snakeCaseObject: any): any => {
  if (typeof snakeCaseObject !== 'object') return snakeCaseObject;

  const entries = Object.entries(snakeCaseObject);
  return entries.reduce((acc, [key, value]) => ({
    ...acc,
    [key.replace(/_([a-zA-Z])/g, (_, group) => group.toUpperCase())]: convertSnakeCaseToCamelCase(value),
  }), {});
};
