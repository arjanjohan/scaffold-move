// To be used in JSON.stringify when a field might be bigint, which JSON can't serialize
export const replacer = (_key: string, value: unknown) => (typeof value === "bigint" ? value.toString() : value);
