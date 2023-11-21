export function xuidToUuid(xuidHex: string): string | false {
    if (!xuidHex.startsWith("0009") || xuidHex.length !== 16) {
        return false;
    }

    // Prepend the required prefix 00000000-0000-0000- and insert a hyphen after the first four characters
    const uuid = `00000000-0000-0000-${xuidHex.substring(0, 4)}-${xuidHex.substring(4)}`;

    return uuid;
}