"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var http = require("node:http");
var pg_1 = require("pg");
var crypto = require("crypto");
var pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'labs',
    password: 'BASILA2001',
    port: 5432
});
function sendToDatabase(formData) {
    return __awaiter(this, void 0, void 0, function () {
        var query, values, client, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n  INSERT INTO loans (name, email, phone_number, loan_amount, reason, token)\n  VALUES ($1, $2, $3, $4, $5, $6)\n\n  RETURNING *\n";
                    values = [formData.name, formData.email, formData.phone_number, formData.loan_amount, formData.reason, formData.token];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _a.sent();
                    result = client.query(query, values);
                    console.log('Data sent to db');
                    return [2 /*return*/, result];
                case 3:
                    err_1 = _a.sent();
                    console.log('Error connecting to the database:', err_1);
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var server = http.createServer(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var method, url, htmlContents, contents, html, body_1, loanStatusHtml, body_2;
    return __generator(this, function (_a) {
        method = request.method, url = request.url;
        if (url === '/apply-loan') {
            htmlContents = './ui.html';
            try {
                contents = fs.readFileSync(htmlContents, 'utf-8');
                response
                    .writeHead(200, { 'Content-Type': 'text/html' })
                    .end(contents);
            }
            catch (error) {
                console.error('Error reading HTML file:', error);
                response
                    .writeHead(500, { 'Content-Type': 'text/plain' })
                    .end('Internal Server Error');
            }
        }
        else if (url === '/apply-loan-success' && method === 'POST') {
            html = "\n      <!DOCTYPE html>\n      <html lang=\"en\">\n      <head>\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Document</title>\n      </head>\n      <body>\n        Date and time right now: ".concat(new Date().toLocaleString(), "\n      </body>\n      </html>\n    ");
            response.writeHead(200, { 'Content-Type': 'text/html' }).end(html);
            body_1 = '';
            request.on('data', function (chunk) {
                body_1 += chunk.toString();
            });
            request.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                var formData, name, email, phone_number, loanAmount, reason, loanAmountInt, phoneNumberInt, token, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            formData = new URLSearchParams(body_1);
                            name = formData.get('name') || '';
                            email = formData.get('email') || '';
                            phone_number = formData.get('phone_number') || '';
                            loanAmount = formData.get('loan_amount') || '';
                            reason = formData.get('reason') || '';
                            loanAmountInt = parseInt(loanAmount);
                            phoneNumberInt = parseFloat(phone_number);
                            token = crypto.randomBytes(20).toString('base64url');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, sendToDatabase({
                                    token: token,
                                    name: name,
                                    email: email,
                                    phone_number: phoneNumberInt,
                                    loan_amount: loanAmountInt,
                                    reason: reason
                                })];
                        case 2:
                            result = _a.sent();
                            if (result) {
                                console.log('Data inserted:', result.rows);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        }
        else if (url === '/loan-status' && method === 'GET') {
            loanStatusHtml = "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Loan Status</title>\n    </head>\n    <body>\n      <form action='/loan-info' method='POST'>\n      <h1>Loan Status</h1>\n      token: <input  id= 'token' type='text' name='token'><button type='submit'>Search Loan</button>\n      \n    </body>\n    </html>\n  ";
            try {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(loanStatusHtml);
            }
            catch (err) {
                response.writeHead(500, { "Error": err });
                response.end(err);
            }
        }
        else if (url === '/loan-info' && method === 'POST') {
            body_2 = '';
            request.on('data', function (chunk) {
                body_2 += chunk.toString();
            });
            request.on('end', function () { return __awaiter(void 0, void 0, void 0, function () {
                var inputData, token, client, result, data, html, err_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            inputData = new URLSearchParams(body_2);
                            token = inputData.get('token') || '';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, pool.connect()];
                        case 2:
                            client = _a.sent();
                            return [4 /*yield*/, client.query("SELECT * FROM loans WHERE token = '".concat(token, "'"))];
                        case 3:
                            result = _a.sent();
                            data = result.rows;
                            return [4 /*yield*/, generateLoanStatusHtml(data)];
                        case 4:
                            html = _a.sent();
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(html);
                            return [3 /*break*/, 6];
                        case 5:
                            err_2 = _a.sent();
                            console.error(err_2);
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            }); });
        }
        return [2 /*return*/];
    });
}); });
;
// DONT TOUCH TIS CODE
function generateLoanStatusHtml(loanData) {
    var loanStatusHtml = /* html */ "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Loan Status</title>\n    </head>\n    <body>\n      <h1>Loan Status</h1>\n      Loan status: <input type=\"text\" name=\"loan_amount\"><button type=\"submit\">Search Loan</button>\n      <ul>\n        <li>".concat(loanData.map(function (loan) { return "\n          <li> Name: ".concat(loan.name, "</li> \n          <li> Email: ").concat(loan.email, " </li> \n          <li> Phone: ").concat(loan.phone_number, "</li> \n          <li> Amount: ").concat(loan.loan_amount, " </li> \n          <li> Reason: ").concat(loan.reason, "</li> \n          <li> token: ").concat(loan.token, "</li> \n          <li> Date and time right now: ").concat(new Date().toLocaleString(), "</li> \n          <li> </li>\n        "); }).join(' '), "\n      </ul>\n    </body>\n    </html>\n  ");
    return loanStatusHtml;
}
function fetchLoanDataFromDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var client, query, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    query = 'SELECT * FROM loans';
                    return [4 /*yield*/, client.query(query)];
                case 2:
                    result = _a.sent();
                    client.release();
                    return [2 /*return*/, result.rows];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error fetching loan data:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
server.listen(3000, function () {
    console.log('Server started at http://localhost:3000');
});
