export const getIncludeTest = (include: string): any => {
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

export const getInclude = (include: string): any => {
  if (!include) return null;
  const includeObject = include.split(",").reduce((acc, field) => {
    let fieldObject;
    if (field.includes(".")) {
      const [first, ...rest] = field.split(".");
      fieldObject = {
        [first.trim()]: getInclude(rest.join(".")),
      };
    } else {
      fieldObject = {
        [field.trim()]: true,
      };
    }

    return {
      include: {
        ...acc["include"],
        ...fieldObject,
      },
    };
  }, {});

  return includeObject;
};
