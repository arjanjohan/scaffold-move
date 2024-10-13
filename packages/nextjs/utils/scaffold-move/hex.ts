export function isHex(text: string) {
    // if it's hex, and is <= (64 + 2 for 0x) char long
    return text.startsWith("0x") && text.length <= 66;
  }