

export const getPagination = (query, defaultLimit = 6) => {

  const page = Number(query.page) || 1 ;

  const limit = Number(query.limit) || defaultLimit;

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const buildRegexSearch = (search, fields = []) => {
  const value = search?.trim();

  if (!value || fields.length === 0) {
    return null;
  }

  return {
    $or: fields.map((field) => ({
      [field]: {
        $regex: value,
        $options: "i",
      },
    })),
  };
};