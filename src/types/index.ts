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

// src/types/Customer.ts

type Customer = {
    id: number;
    status_id?: number;
    manager_id?: number;
    industry_id?: number;
    source_id?: number;
    source_note?: string;
    name: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    vendor_number?: string;
    isa_qualifier?: string;
    isa_id?: string;
    version?: number;
    delimiter?: string;
    terms?: string;
    logo?: string;
    lead?: number;
    date_converted?: string;
    strength?: number;
    frequency?: number;
    parent_company?: number;
    avatar?: string;
    active: number;
    date_created: string;
};

type Contact = {
    id: number;
    customer_id: number;
    main: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    ext: string;
    email: string;
    active: number;
};

interface Notice {
    id: number;
    importance_id: number;
    subject: string;
    notice: string;
    user_id: number;
    date_created: string;
    name?: string;
    color?: string;
    date_viewed: string;
}

