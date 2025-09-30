export const snakeToCamel = (str: string) =>
    str.replace(/(_\w)/g, (m) => m[1].toUpperCase());