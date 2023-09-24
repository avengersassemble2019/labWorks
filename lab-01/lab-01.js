"use strict";
exports.__esModule = true;
var fs = require("fs");
var readlineSync = require("readline-sync");
var debtFile = "debts.txt";
var newDebt; //This will be the name of our new debt
var amountDebt; //This will be the amount of our new debt
while (true) {
    newDebt = readlineSync.question("Enter Debt Name: ");
    if (!newDebt) {
        console.log("Debt Name cannot be empty.");
    }
    else {
        break;
    }
}
while (true) {
    amountDebt = readlineSync.question("Enter Debt amount:");
    if (!amountDebt === true) {
        console.log("Please enter a valid number");
    }
    else {
        break;
    }
}
console.clear();
console.log("\nAdding ".concat(newDebt, "..."), "".concat(amountDebt, "..."));
if (fs.existsSync("./debts") === false) {
    console.error("Error creating file");
}
else {
    try {
        fs.appendFileSync("./debts", "".concat(newDebt, "\n"), "utf8");
        fs.appendFileSync("./debts", "".concat(amountDebt, "\n"), "utf8");
        console.log("\nAdded Successfully!");
    }
    catch (err) {
        console.error("".concat(err));
    }
}
