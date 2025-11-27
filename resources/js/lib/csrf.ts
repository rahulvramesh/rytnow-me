/**
 * Get CSRF token for fetch requests.
 * Tries multiple sources: meta tag, XSRF-TOKEN cookie
 */
export function getCsrfToken(): string {
    // First try the meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) {
        return metaToken;
    }

    // Fallback to XSRF-TOKEN cookie (needs URL decoding)
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN' && value) {
            return decodeURIComponent(value);
        }
    }

    return '';
}

/**
 * Create headers for fetch requests with CSRF token
 */
export function fetchHeaders(contentType: 'json' | 'form' = 'json'): HeadersInit {
    const headers: HeadersInit = {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': getCsrfToken(),
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (contentType === 'json') {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}
