"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bewss_1 = __importDefault(require("./bewss/bewss"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const logDir = path_1.default.resolve(process.cwd(), './', 'logs');
const lastSessionLog = path_1.default.resolve(logDir, 'last-session.log');
const allLog = path_1.default.resolve(logDir, 'all.log');
fs_1.default.mkdirSync(logDir, { recursive: true });
fs_1.default.writeFileSync(lastSessionLog, "");
if (!fs_1.default.existsSync(allLog)) {
    fs_1.default.writeFileSync(allLog, "");
    console.log("Creating New All Log");
}
const lastSession = fs_1.default.createWriteStream(lastSessionLog);
const allTime = fs_1.default.createWriteStream(allLog, { flags: "a" });
function writeStreams(item) {
    lastSession.write(item);
    allTime.write(item);
}
function closeStreams() {
    allTime.close();
    lastSession.close();
}
console.log = function () {
    process.stdout.write(util_1.default.format.apply(this, arguments) + '\n');
    writeStreams(Array.from(arguments).join(" ").replace(/\u001b\[.*?m/g, "") + "\n");
};
console.info = function () {
    process.stdout.write(util_1.default.format.apply(this, arguments) + '\n');
    writeStreams(Array.from(arguments).join(" ").replace(/\u001b\[.*?m/g, "") + "\n");
};
console.warn = function () {
    process.stdout.write(util_1.default.format.apply(this, arguments) + '\n');
    writeStreams(Array.from(arguments).join(" ").replace(/\u001b\[.*?m/g, "") + "\n");
};
console.debug = function () {
    process.stdout.write(util_1.default.format.apply(this, arguments) + '\n');
    writeStreams(Array.from(arguments).join(" ").replace(/\u001b\[.*?m/g, "") + "\n");
};
console.error = function () {
    process.stderr.write(util_1.default.format.apply(this, arguments) + '\n');
    writeStreams(Array.from(arguments).join(" ").replace(/\u001b\[.*?m/g, "") + "\n");
};
process.on('beforeExit', () => {
    closeStreams();
});
new bewss_1.default({
    port: 8080,
});
