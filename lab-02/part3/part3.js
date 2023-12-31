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
exports.generateLoanStatusHtml = void 0;
var database_1 = require("./database");
function generateLoanStatusHtml(loanData) {
    return __awaiter(this, void 0, void 0, function () {
        var loanStatusHtml;
        return __generator(this, function (_a) {
            loanStatusHtml = "\n    <!DOCTYPE html>\n    <html lang=\"en\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Loan Status</title>\n    </head>\n    <body>\n      <h1>Loan Status</h1>\n      Loan status: <input type=\"text\" name=\"loan_amount\"><button type=\"submit\">Search Loan</button>\n      <ul>\n        <li>".concat(loanData.map(function (loan) { return "\n          <li> Name: ".concat(loan.name, "</li> \n          <li> Email: ").concat(loan.email, " </li> \n          <li> Phone: ").concat(loan.phone_number, "</li> \n          <li> Amount: ").concat(loan.loan_amount, " </li> \n          <li> Reason: ").concat(loan.reason, "</li> \n          <li> token: ").concat(loan.token, "</li> \n          <li> Date and time right now: ").concat(new Date().toLocaleString(), "</li> \n          <li> </li>\n        "); }).join(' '), "\n      </ul>\n    </body>\n    </html>\n  ");
            return [2 /*return*/, loanStatusHtml];
        });
    });
}
exports.generateLoanStatusHtml = generateLoanStatusHtml;
function fetchLoanDataFromDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var client, query, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.pool.connect()];
                case 1:
                    client = _a.sent();
                    query = 'SELECT * FROM loans';
                    return [4 /*yield*/, client.query(query)];
                case 2:
                    result = _a.sent();
                    client.release();
                    return [2 /*return*/, result.rows];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching loan data:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
