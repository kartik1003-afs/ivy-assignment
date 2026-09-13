const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://solve.ivy.homes';
const API_KEY = import.meta.env.VITE_API_KEY || 'IVY26-DD7ADA724ED4';

export async function request(path, options = {}) {
  const { method = 'GET', body, token, queryParams } = options;
  
  let url = `${BASE_URL}${path}`;
  if (queryParams) {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.append(k, v);
      }
    });
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = {
    'X-API-Key': API_KEY,
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let bodyData = undefined;
  if (body) {
    headers['Content-Type'] = 'application/json';
    bodyData = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: bodyData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const error = new Error(data?.detail || `HTTP Error ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error [${method} ${path}]:`, err);
    throw err;
  }
}

export async function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
}

export async function refreshToken(refresh_token) {
  return request('/auth/refresh', {
    method: 'POST',
    body: { refresh_token }
  });
}

export async function fetchListings(token, queryParams = {}) {
  // Correct API pagination parameters (offset, limit)
  return request('/v1/listings', {
    token,
    queryParams
  });
}

export async function fetchListingById(token, listingId) {
  // Plural endpoint /v1/listings/{id}
  return request(`/v1/listings/${listingId}`, { token });
}

export async function fetchRentals(token, queryParams = {}) {
  return request('/v1/rentals', {
    token,
    queryParams
  });
}

export async function fetchProjects(token, queryParams = {}) {
  return request('/v1/projects', {
    token,
    queryParams
  });
}
