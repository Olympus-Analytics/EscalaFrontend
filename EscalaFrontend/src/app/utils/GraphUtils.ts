function getEnumEntries<T extends Record<string, string | number>>(enumType: T): Record<string, string> {
  const enumEntries = Object.entries(enumType)
    .filter(([key, value]) => isNaN(Number(key)))
    .reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);

  return enumEntries;
}
