// Treat any dot-separated string as a potential ENS name
const ensRegex = /.+\..+/;
export const isENS = (address = "") => ensRegex.test(address);
