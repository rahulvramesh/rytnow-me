/**
 * Get XSRF token from cookie (preferred for AJAX - stays fresh with session)
 */
export function getXsrfToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'XSRF-TOKEN' && value) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

/**
 * Get CSRF token from meta tag (can become stale on long-lived pages)
 */
export function getCsrfToken(): string {
    const metaToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (metaToken) {
        return metaToken;
    }
    return getXsrfToken() || '';
}

/**
 * Create headers for fetch requests with CSRF token
 * Uses X-XSRF-TOKEN from cookie (preferred) with fallback to X-CSRF-TOKEN from meta
 */
export function fetchHeaders(
    contentType: 'json' | 'form' = 'json',
): HeadersInit {
    const xsrfToken = getXsrfToken();

    const headers: HeadersInit = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    };

    // Prefer XSRF-TOKEN from cookie (stays fresh), fallback to meta tag
    if (xsrfToken) {
        headers['X-XSRF-TOKEN'] = xsrfToken;
    } else {
        const metaToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        if (metaToken) {
            headers['X-CSRF-TOKEN'] = metaToken;
        }
    }

    if (contentType === 'json') {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}
