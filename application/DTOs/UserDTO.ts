export interface SaveUserDTO {
    username: string;
    userTypeId: number;
    password: string;
    email: string;
    active?: boolean;
}

export interface UpdateUserDTO {
    userId: number;
    username?: string;
    userTypeId?: number;
    password?: string;
    email?: string;
    active?: boolean;
}

export interface UserResponseDTO {
    userId: number;
    username: string;
    userTypeId: number;
    email: string;
    active: boolean;
    userType?: {
        userTypeId: number;
        name: string;
    };
}