export const getInclude = (include: string): any => {
  return {
    include: Object.fromEntries(
      include.split(",").map((field) => [field, true])
    ),
  };
};
