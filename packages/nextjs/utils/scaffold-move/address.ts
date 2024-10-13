export function isValidAccountAddress(accountAddr: string): boolean {
    // account address is 0x{64 hex characters}
    // with multiple options - 0X, 0x001, 0x1, 0x01
    // can start with that and see if any fails to parsing
    return /^(0[xX])?[a-fA-F0-9]{1,64}$/.test(accountAddr);
  }