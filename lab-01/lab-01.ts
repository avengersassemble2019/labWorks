import * as fs from "fs";
import * as readlineSync from "readline-sync";

const debtFile = "debts.txt";

let newDebt: string; //This will be the name of our new debt
let amountDebt: number; //This will be the amount of our new debt

while (true) {
  newDebt = readlineSync.question("Enter Debt Name: ");
  if (!newDebt) {
    console.log("Debt Name cannot be empty.");
  } else {
    break;
  }
}
while (true) {
  amountDebt = readlineSync.question("Enter Debt amount:");
  if (!amountDebt === true) {
    console.log("Please enter a valid number");
  } else {
    break;
  }
}
console.clear();
console.log(`\nAdding ${newDebt}...`, `${amountDebt}...`);

if (fs.existsSync("./debts") === false) {
  console.error("Error creating file");
} else {
  try {
    fs.appendFileSync("./debts", `${newDebt}\n`, "utf8");
    fs.appendFileSync("./debts", `${amountDebt}\n`, "utf8");
    console.log("\nAdded Successfully!");
  } catch (err) {
    console.error(`${err}`);
  }
}
