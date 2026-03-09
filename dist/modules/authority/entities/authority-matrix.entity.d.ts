export declare class AuthorityMatrix {
    id: string;
    roleId: string;
    maxLoanAmount: string;
    maxDeviationPercent: string | null;
    allowedProducts: string[] | null;
    allowedGeographies: string[] | null;
    effectiveFrom: Date;
    effectiveTo: Date | null;
}
