export function isValidEnumValue(value: string, enumObject: Record<string, any>): boolean {
    const uppercaseValue = value.toUpperCase() as keyof typeof enumObject;
    return Object.keys(enumObject).includes(uppercaseValue);
  }