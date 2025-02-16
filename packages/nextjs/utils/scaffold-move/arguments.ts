/**
 * Processes function arguments to handle JSON strings and arrays appropriately
 * @param args Array of arguments that might be strings, arrays, or JSON strings
 * @returns Processed array with parsed values where appropriate
 */
export const processArguments = (args: (string | any)[]): any[] => {
  console.log("args", args);
  return args.map(arg => {
    try {
      if (Array.isArray(arg)) {
        return arg;
      }

      // Try to parse as JSON
      const parsed = JSON.parse(arg);
      // Only return parsed value if it's different from the input
      // (meaning it was a valid JSON string representing an array/object)
      if (JSON.stringify(parsed) !== arg || Array.isArray(parsed)) {
        return parsed;
      }
      // Otherwise return original  as string
      return arg;
    } catch {
      // If parsing fails, return original
      return arg;
    }
  });
};
