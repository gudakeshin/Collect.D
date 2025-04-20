export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface UserCredentials {
    id: number;
    user: User;
    api_key: string;
    secret_key?: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

export type LogType = 'auth' | 'error' | 'info' | 'debug';

export interface LogFile {
    id: number;
    user: User;
    file_name: string;
    file_path: string;
    log_type: LogType;
    size: number;
    created_at: string;
    last_modified: string;
    is_archived: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
} 