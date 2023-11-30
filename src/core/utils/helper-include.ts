export const getInclude = (include: string): any => {
  const includeObject = include.split(",").reduce((acc, field) => {
    if (field.includes(".")) {
      const [first, second] = field.split(".");
      return {
        ...acc,
        [first]: {
          include: {
            [second]: true,
          },
        },
      };
    }

    return {
      ...acc,
      [field.trim()]: true,
    };
  }, {});

  return {
    include: includeObject,
  };
};
