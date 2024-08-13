export type User = {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    role_display: string;
    emulating_user_id: string;
    emulating_user_name: string;
    theme: string;
    avatar: string;
    active: string;
};

export type UserRole = {
    id: number;
    role: string;
    display: string;
    active: number;
};

export interface UserProfile {
    userId: number;
    bio: string;
    avatarUrl: string;
}