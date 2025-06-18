const http = require('http');
const url = require('url');

// In-memory users storage (for testing)
const users = [];
let nextId = 1;

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJSON(res, statusCode, data) {
  corsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    corsHeaders(res);
    res.statusCode = 200;
    res.end();
    return;
  }

  // Get request body for POST requests
  if (method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        handleRequest(path, method, data, res);
      } catch (e) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
  } else {
    handleRequest(path, method, null, res);
  }
});

function handleRequest(path, method, data, res) {
  // Test endpoint
  if (path === '/api/test' && method === 'GET') {
    sendJSON(res, 200, { message: 'Mock API is working' });
    return;
  }

  // Register endpoint
  if (path === '/api/register' && method === 'POST') {
    const { name, email, password, role = 'customer' } = data || {};

    // Basic validation
    if (!name || !email || !password) {
      sendJSON(res, 422, {
        errors: {
          name: !name ? ['The name field is required.'] : [],
          email: !email ? ['The email field is required.'] : [],
          password: !password ? ['The password field is required.'] : []
        }
      });
      return;
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      sendJSON(res, 422, {
        errors: {
          email: ['The email has already been taken.']
        }
      });
      return;
    }

    // Create new user
    const user = {
      id: nextId++,
      name,
      email,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(user);

    // Mock token
    const token = Buffer.from(`${user.id}:${email}:${Date.now()}`).toString('base64');

    sendJSON(res, 201, {
      message: 'User registered successfully',
      user,
      token,
      token_type: 'Bearer'
    });
    return;
  }

  // Login endpoint
  if (path === '/api/login' && method === 'POST') {
    const { email, password } = data || {};

    // Basic validation
    if (!email || !password) {
      sendJSON(res, 422, {
        errors: {
          email: !email ? ['The email field is required.'] : [],
          password: !password ? ['The password field is required.'] : []
        }
      });
      return;
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      sendJSON(res, 401, {
        message: 'Invalid credentials'
      });
      return;
    }

    // Mock token
    const token = Buffer.from(`${user.id}:${email}:${Date.now()}`).toString('base64');

    sendJSON(res, 200, {
      message: 'Login successful',
      user,
      token,
      token_type: 'Bearer'
    });
    return;
  }

  // 404 for other routes
  sendJSON(res, 404, { error: 'Not found' });
}

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});