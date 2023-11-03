const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const server = http.createServer((req, res) => {
    // Зчитування XML-документу з файлу 'data.xml'
    fs.readFile('data.xml', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        const parser = new XMLParser();
        const parsedData = parser.parse(data); // Розбір XML-документу в об'єкт
        // Пошук максимального обмінного курсу серед валют
        if (Array.isArray(parsedData.exchange.currency)) {
            let maxRate = 0;
            parsedData.exchange.currency.forEach(currency => {
                if (parseFloat(currency.rate) > maxRate) {
                    maxRate = parseFloat(currency.rate);
                }
            });  
            const builder = new XMLBuilder();
            // Побудова XML-відповіді з максимальним курсом
            const xmlContent = builder.build({ data: { max_rate: maxRate.toString() } });
            res.writeHead(200, { 'Content-Type': 'application/xml' });
            res.write(xmlContent);
            res.end();
        } else {
            const builder = new XMLBuilder();
            const xmlContent = builder.build({ data: { max_rate: parsedData.exchange.currency.rate.toString() } });
            res.writeHead(200, { 'Content-Type': 'application/xml' });
            res.write(xmlContent);
            res.end();
        }
    });
});
const host = "localhost";
const port = 8000;
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
