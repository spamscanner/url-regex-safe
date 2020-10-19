export type Options = Partial<{
    exact: boolean;
    strict: boolean;
    auth: boolean;
    localhost: boolean;
    parens: boolean;
    apostrophes: boolean;
    trailingPeriod: boolean;
    ipv4: boolean;
    ipv6: boolean;
    tlds: string[];
    returnString: boolean;
}>;
export default function createUrlRegExp (options?: Options): RegExp;