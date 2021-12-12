"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
async function getFiles(path) {
    const entries = fs_1.readdirSync(path).map((entries) => path_1.default.join(path, entries));
    const dirPath = entries.filter((entry) => fs_1.statSync(entry).isFile());
    const dirFiles = entries.filter((entry) => !dirPath.includes(entry)).reduce((entry, entries) => entry.concat(this.getFiles(entries)), []);
    return [...dirPath, ...dirFiles];
}
exports.default = getFiles;
