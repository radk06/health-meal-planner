export function paginate(list, { page = 1, limit = 10 }) {
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Math.min(100, Number(limit)));
  const start = (p - 1) * l;
  const data = list.slice(start, start + l);
  return { meta: { total: list.length, page: p, limit: l, pages: Math.ceil(list.length / l) || 1 }, data };
}
