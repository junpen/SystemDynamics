export function isValidSyntax(input: any): {
    error: boolean;
    line: any;
    char: any;
    token: any;
} | {
    error: boolean;
    token: any;
    line?: undefined;
    char?: undefined;
} | {
    error: boolean;
    line?: undefined;
    char?: undefined;
    token?: undefined;
};
