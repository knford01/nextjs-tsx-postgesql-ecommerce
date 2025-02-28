// src/db/employee-data.tsx

'use server';
import { db, sql, QueryResult } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchEmployees(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
            SELECT 
                e.*,
                u.id AS user_id,
                u.first_name,
                u.middle_name,
                u.last_name,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.avatar,
                u.role,
                ur.display AS role_display,
                u.email, 
                CONCAT(
                    EXTRACT(DAY FROM (
                        CASE 
                            WHEN NULLIF(e.end_date, '') IS NOT NULL THEN CAST(NULLIF(e.end_date, '') AS DATE)
                            ELSE NOW()
                        END - CAST(NULLIF(e.start_date, '') AS DATE)
                    )), 
                    ' Days'
                ) AS time_employed,
                CASE 
                    WHEN e.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                d.name AS department_name,
                COALESCE(et.name, 'Not Available') AS type_name
            FROM employees e
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN employment_types et ON et.id = e.employment_type
            LEFT JOIN users u ON u.id = e.user_id
            LEFT JOIN user_roles ur ON ur.id = u.role
            ORDER BY u.first_name, u.last_name`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchActiveEmployees(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
            SELECT 
                e.*,
                u.id AS user_id,
                u.first_name,
                u.middle_name,
                u.last_name,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.avatar,
                u.role,
                ur.display AS role_display,
                u.email, 
                CONCAT(
                    EXTRACT(DAY FROM (
                        CASE 
                            WHEN NULLIF(e.end_date, '') IS NOT NULL THEN CAST(NULLIF(e.end_date, '') AS DATE)
                            ELSE NOW()
                        END - CAST(NULLIF(e.start_date, '') AS DATE)
                    )), 
                    ' Days'
                ) AS time_employed,
                CASE 
                    WHEN e.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                d.name AS department_name,
                COALESCE(et.name, 'Not Available') AS type_name
            FROM employees e
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN employment_types et ON et.id = e.employment_type
            LEFT JOIN users u ON u.id = e.user_id
            LEFT JOIN user_roles ur ON ur.id = u.role
            WHERE e.active = TRUE
            ORDER BY u.first_name, u.last_name`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchInactiveEmployees(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
            SELECT 
                e.*,
                u.id AS user_id,
                u.first_name,
                u.middle_name,
                u.last_name,
                CONCAT(u.first_name, ' ', u.last_name) AS name,
                u.avatar,
                u.role,
                ur.display AS role_display,
                u.email, 
                CONCAT(
                    EXTRACT(DAY FROM (
                        CASE 
                            WHEN NULLIF(e.end_date, '') IS NOT NULL THEN CAST(NULLIF(e.end_date, '') AS DATE)
                            ELSE NOW()
                        END - CAST(NULLIF(e.start_date, '') AS DATE)
                    )), 
                    ' Days'
                ) AS time_employed,
                CASE 
                    WHEN e.active = TRUE THEN 'Active'
                    ELSE 'Inactive'
                END AS active_status,
                d.name AS department_name,
                COALESCE(et.name, 'Not Available') AS type_name
            FROM employees e
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN employment_types et ON et.id = e.employment_type
            LEFT JOIN users u ON u.id = e.user_id
            LEFT JOIN user_roles ur ON ur.id = u.role
            WHERE e.active = FALSE
            ORDER BY u.first_name, u.last_name`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchEmployeeById(employeeId: any): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
            SELECT 
                e.*,
                u.id as user_id,
                u.first_name,
                u.middle_name,
                u.last_name,
                u.avatar,
                u.role,
                ur.display as role_display,
                u.email, 
                CONCAT(
                    EXTRACT(DAY FROM (
                        CASE 
                            WHEN NULLIF(e.end_date, '') IS NOT NULL THEN CAST(NULLIF(e.end_date, '') AS DATE)
                            ELSE NOW()
                        END - CAST(NULLIF(e.start_date, '') AS DATE)
                    )), 
                    ' Days'
                ) AS time_employed,
                CASE 
                    WHEN e.active = TRUE THEN 'Active'
                    ELSE 'In Active'
                END AS active_status,
                d.name AS department_name,
                COALESCE(et.name, 'Not Available') AS type_name
            FROM employees e
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN employment_types et ON et.id = e.employment_type
            LEFT JOIN users u on u.id = e.user_id
            LEFT JOIN user_roles ur on ur.id = u.role
            WHERE e.id = ${employeeId}`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchEmployeeByUserId(userId: any): Promise<any> {
    noStore();
    try {
        const data = await sql<any>` 
            SELECT 
                e.*,
                u.id as user_id,
                u.first_name,
                u.middle_name,
                u.last_name,
                u.avatar,
                u.role,
                ur.display as role_display,
                u.email, 
                CONCAT(
                    EXTRACT(DAY FROM (
                        CASE 
                            WHEN NULLIF(e.end_date, '') IS NOT NULL THEN CAST(NULLIF(e.end_date, '') AS DATE)
                            ELSE NOW()
                        END - CAST(NULLIF(e.start_date, '') AS DATE)
                    )), 
                    ' Days'
                ) AS time_employed,
                CASE 
                    WHEN e.active = TRUE THEN 'Active'
                    ELSE 'In Active'
                END AS active_status,
                d.name AS department_name,
                COALESCE(et.name, 'Not Available') AS type_name
            FROM users u
            LEFT JOIN employees e on e.user_id = u.id
            LEFT JOIN departments d ON d.id = e.department_id
            LEFT JOIN employment_types et ON et.id = e.employment_type
            left join user_roles ur on ur.id = u.role
            WHERE u.id = ${userId}`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employees.');
    }
}

export async function fetchEmployeeRow(employeeId: number): Promise<any> {
    noStore();
    try {
        const data = await sql`SELECT * FROM employees WHERE id = ${employeeId};`;

        return data.rows[0] || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch employee row.');
    }
}

export async function employeeHistory(action: string, employeeId: number, changeUser: number): Promise<void> {
    noStore();

    try {
        // Fetch current employee data
        const employeeData = await fetchEmployeeRow(employeeId);
        if (!employeeData) {
            throw new Error(`Employee with ID ${employeeId} not found.`);
        }

        // Convert the employee data to JSON format
        const newValue = JSON.stringify(employeeData);

        // Insert into history table
        await sql`
            INSERT INTO employee_history (history_id, action, new_value, change_user)
            VALUES (${employeeId}, ${action}, ${newValue}, ${changeUser});
        `;
    } catch (error) {
        console.error('Error logging employee history:', error);
        throw new Error('Failed to log employee history.');
    }
}

export async function createEmployee(employee: {
    user_id: number;
    department_id: number;
    dob: string;
    social_number?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    personal_email?: string;
    start_date: string;
    end_date?: string;
    active?: boolean;
}, sessionUser: { id: number }): Promise<any> {
    try {
        // Assign default values for missing fields
        const sanitizedEmployee = {
            user_id: employee.user_id,
            department_id: employee.department_id,
            dob: employee.dob || null,
            social_number: employee.social_number || null,
            address1: employee.address1 || null,
            address2: employee.address2 || null,
            city: employee.city || null,
            state: employee.state || null,
            zip: employee.zip || null,
            personal_email: employee.personal_email || null,
            start_date: employee.start_date || null,
            end_date: employee.end_date || null,
            active: employee.active ?? true, // Default to `true` if `active` is undefined
        };

        // Log the sanitized data
        console.log('Sanitized Employee Data:', sanitizedEmployee);

        const result = await sql`
            INSERT INTO employees (
                user_id, department_id, dob, social_number, address1, address2,
                city, state, zip, personal_email, start_date, end_date, active
            ) VALUES (
                ${sanitizedEmployee.user_id}, ${sanitizedEmployee.department_id}, ${sanitizedEmployee.dob}, ${sanitizedEmployee.social_number},
                ${sanitizedEmployee.address1}, ${sanitizedEmployee.address2}, ${sanitizedEmployee.city}, ${sanitizedEmployee.state},
                ${sanitizedEmployee.zip}, ${sanitizedEmployee.personal_email}, ${sanitizedEmployee.start_date},
                ${sanitizedEmployee.end_date}, ${sanitizedEmployee.active}
            )
            RETURNING *;
        `;

        await employeeHistory('Created', result.rows[0].id, sessionUser.id);

        return result.rows[0];
    } catch (error) {
        console.error('Error creating employee:', error);
        throw new Error('Failed to create employee.');
    }
}

export async function updateEmployee(employeeId: number, updates: {
    department_id?: number;
    dob?: string;
    social_number?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    personal_email?: string;
    start_date?: string;
    end_date?: string;
    active?: boolean;
}, sessionUser: { id: number }): Promise<any> {
    try {
        const result = await sql`
            UPDATE employees
            SET
                department_id = COALESCE(${updates.department_id}, department_id),
                dob = COALESCE(${updates.dob}, dob),
                social_number = COALESCE(${updates.social_number}, social_number),
                address1 = COALESCE(${updates.address1}, address1),
                address2 = COALESCE(${updates.address2}, address2),
                city = COALESCE(${updates.city}, city),
                state = COALESCE(${updates.state}, state),
                zip = COALESCE(${updates.zip}, zip),
                personal_email = COALESCE(${updates.personal_email}, personal_email), 
                start_date = COALESCE(${updates.start_date}, start_date),
                end_date = COALESCE(${updates.end_date}, end_date),
                active = COALESCE(${updates.active}, active)
            WHERE id = ${employeeId}
            RETURNING *;
        `;

        if (result.rowCount === 0) {
            throw new Error('Employee not found.');
        }

        await employeeHistory('Updated', result.rows[0].id, sessionUser.id);

        return result.rows[0];
    } catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee.');
    }
}

export async function fetchDepartments(): Promise<any> {
    noStore();
    try {
        const data = await sql<any>`
            SELECT 
                d.*, 
                case 
                    when d.active = TRUE then 'True'
                    else 'False'
                end as active_status
            FROM departments d`;

        return data.rows || null;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch departments.');
    }
}
