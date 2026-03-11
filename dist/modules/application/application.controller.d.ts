import { Request } from "express";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ConsentDto } from "./dto/consent.dto";
import { ListApplicationsQueryDto } from "./dto/list-applications.dto";
export declare class ApplicationController {
    private readonly applicationService;
    constructor(applicationService: ApplicationService);
    list(query: ListApplicationsQueryDto): Promise<{
        items: import("./dto/list-applications.dto").ApplicationListItemDto[];
        page: number;
        limit: number;
        total: number;
    }>;
    create(dto: CreateApplicationDto, req: Request & {
        user: {
            user_id: string;
        };
    }): Promise<{
        application_id: string;
        current_state: string;
    }>;
    update(id: string, dto: UpdateApplicationDto, req: Request & {
        user: {
            user_id: string;
        };
    }): Promise<{
        application_id: string;
        current_state: string;
    }>;
    consent(id: string, dto: ConsentDto, req: Request & {
        user: {
            user_id: string;
        };
    }): Promise<{
        status: string;
    }>;
    submit(id: string, req: Request & {
        user: {
            user_id: string;
            role_id?: string;
        };
    }): Promise<{
        application_id: string;
        current_state: string;
    }>;
    getConsentTypes(): Promise<{
        id: string;
        consent_code: string;
        description: string;
        version: number;
    }[]>;
    duplicates(id: string): Promise<{
        duplicate_flag: boolean;
        matched_application_ids: string[];
    }>;
}
