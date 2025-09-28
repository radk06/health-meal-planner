export default function paginate(array, page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, parseInt(limit, 10) || 10);
  const start = (p - 1) * l;
  const end = start + l;
  const items = array.slice(start, end);
  return {
    items,
    page: p,
    limit: l,
    total: array.length,
    totalPages: Math.ceil(array.length / l)
  };
}
