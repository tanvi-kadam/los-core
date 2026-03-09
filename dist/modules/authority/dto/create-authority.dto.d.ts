export declare class CreateAuthorityDto {
    role_id: string;
    max_loan_amount: number;
    max_deviation_percent?: number;
    allowed_products?: string[];
    allowed_geographies?: string[];
    effective_from: string;
    effective_to?: string;
}
