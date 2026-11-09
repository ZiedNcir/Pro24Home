export const providesList = <Tag extends string>(type: Tag) => [
  { type, id: 'LIST' },
];

export const invalidatesEntity = <Tag extends string>(type: Tag, id: string | number) => [
  { type, id },
  { type, id: 'LIST' },
];
