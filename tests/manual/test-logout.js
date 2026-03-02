const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/logout',
    method: 'POST',
    headers: {
        'Cookie': 'sb-iypvelkjrgzjtxrptmph-auth-token=some-token;'
    }
};

const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Body:', data));
});

req.on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
req.end();
