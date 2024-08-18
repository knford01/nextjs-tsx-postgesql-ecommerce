export function toUpperCamelCase(str: string): string {
    return str
        .toLowerCase() // Convert the entire string to lowercase
        .split('_')    // Split the string by underscores
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join('');     // Join the words back together without spaces
}

export function convertTo12Hour(time: string): string {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert '0' hours to '12'
    return `${hours}:${minute} ${suffix}`;
}

// Helper function to ensure time format is "HH:mm:ss"
export function formatTime(time: string): string {
    const timeParts = time.split(':');
    if (timeParts.length === 3) {
        return time; // Already in "HH:mm:ss" format
    } else if (timeParts.length === 2) {
        return `${time}:00`; // Add seconds if missing
    } else {
        return '00:00:00'; // Fallback to a default time
    }
}

export function getDayNames(dow: string): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dow.split(',').map(day => dayNames[parseInt(day, 10)]).join(', ');
}

// Get today's date in 'YYYY-MM-DD'
export function dateToday() {
    const today = new Date().toISOString().split('T')[0];
    return today;
}

export function timeNow() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; // Format as HH:mm:ss
}

