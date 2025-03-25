const http = require('http');
const mysql = require('mysql');
const url = require('url');

// MySQL connection
const db = mysql.createConnection({
    host: 'possystem11.mysql.database.azure.com',
    user: 'posadmin11',
    password: 'Umateam11',
    database: 'possystem11',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (path === '/search' && req.method === 'GET') {
        const searchQuery = query.query || '';
        const minPrice = query.minPrice || 0;
        const maxPrice = query.maxPrice || 1000;
        const rating = query.rating || '';
        const category = query.category || '';

        // Construct the SQL query with filters
        let sql = 'SELECT * FROM Item WHERE Name LIKE ? AND Price BETWEEN ? AND ?';
        const params = [`%${searchQuery}%`, minPrice, maxPrice];

        if (rating) {
            sql += ' AND Rating >= ?';
            params.push(rating);
        }

        if (category) {
            sql += ' AND Category = ?';
            params.push(category);
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database query failed' }));
                return;
            }

            // Send the results as a JSON response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else {
        // Handle 404 for other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});