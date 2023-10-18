const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
// Створення веб-сервера
const server = http.createServer((req, res) => {
    // Зчитування XML-документу з файлу 'data.xml'
    fs.readFile('data.xml', 'utf8', (err, data) => {
        if (err) {
             // Обробка помилки, якщо файл не може бути прочитаний
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        // Створення екземпляра парсера для розбору XML
        const parser = new XMLParser();
        // Розбір XML-документу в об'єкт
        const parsedData = parser.parse(data);
        // Пошук максимального обмінного курсу серед валют
        let maxRate = 0;
        parsedData.exchange.currency.forEach(currency => {
            if (parseFloat(currency.rate) > maxRate) {
                maxRate = parseFloat(currency.rate);
            }
        });
        // Створення екземпляра XML-білдера для XML-відповіді
        const builder = new XMLBuilder();
         // Побудова XML-відповіді з максимальним курсом
        const xmlContent = builder.build({ data: { max_rate: maxRate.toString() } });

        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.write(xmlContent);
        res.end();
    });
});

const host = "localhost";
const port = 8000;
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
