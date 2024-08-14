type Address = {
    id?: number; // Optional for when creating a new address
    company?: string; // Optional because it can be NULL in the database
    name?: string; // Optional because it can be NULL in the database
    address1: string;
    address2: string;
    city: string;
    state_province?: string; // Optional because it can be NULL in the database
    postal_code?: string; // Optional because it can be NULL in the database
    country: string;
    phone: string;
    email: string;
    date_created?: string; // Optional because it is auto-generated
};

type Permission = {
    id: number;
    area: string;
    sub_areas: string;
    active: number;
    role_id: number;
    permission_id: number;
    access: string;
};

type CombinedPermission = {
    area: string;
    access: string[];
};