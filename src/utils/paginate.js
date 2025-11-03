/**
 * Simple pagination helper for Mongoose queries
 * @param {import('mongoose').Model} Model - Mongoose model
 * @param {Object} filter - Mongoose filter object
 * @param {Object} options - pagination options
 * @returns {Promise<{data: any[], page: number, limit: number, total: number}>}
 */
export async function paginate(Model, filter = {}, options = {}) {
  const {
    page = 1,
    limit = 10,
    sort = {},
    projection = null,
    populate = "",
  } = options;

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Model.find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate(populate),
    Model.countDocuments(filter),
  ]);

  return {
    data,
    page: Number(page),
    limit: Number(limit),
    total,
  };
}
