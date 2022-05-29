// Helpers for logging

import chalk from "chalk";

export const logWarn = (...args: unknown[]) => {
  console.log(chalk.hex("#FFA500")(...args));
};

export const logSuccess = (...args: unknown[]) => {
  console.log(chalk.green(...args));
};

export const logInfo = (...args: unknown[]) => {
  console.log(chalk.yellow(...args));
};

export const logError = (...args: unknown[]) => {
  console.log(chalk.red(...args));
};

export const logTrace = (...args: unknown[]) => {
  console.log(chalk.grey(...args));
};

export const logDebug = (...args: unknown[]) => {
  console.log(chalk.magenta(...args));
};

export const logFatal = (...args: unknown[]) => {
  console.log(chalk.redBright(...args));
};
