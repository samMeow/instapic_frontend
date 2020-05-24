export const size = {
  phone: '420px',
  tabletP: '768px',
  tabletL: '1024px',
  desktop: '1440px',
};

export const device = Object.entries(size).reduce(
  (memo, [k, v]) => ({
    ...memo,
    [k]: `(min-width: ${v})`,
  }),
  size,
);
