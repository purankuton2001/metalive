function ColorToHex(color: number) {
    const hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

export function ConvertRGBtoHex(red: number, green: number, blue: number) : string {
    return "#" + ColorToHex(red * 255) + ColorToHex(green * 255) + ColorToHex(blue * 255);
}