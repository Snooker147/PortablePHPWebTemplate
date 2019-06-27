"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
const ReadLine = require("readline");
class Utils {
    constructor() {
        this.inInterface = null;
        this.inInterface = ReadLine.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    waitForInput(msg) {
        return new Promise(res => {
            this.inInterface.question(msg, res);
        });
    }
    readFile(path) {
        return new Promise(res => {
            FS.readFile(path, { encoding: "utf8" }, (err, data) => {
                if (err) {
                    console.error(`Failed to read ${path} file! ${err}`);
                    return res(null);
                }
                res(data);
            });
        });
    }
    fileExists(path) {
        return new Promise(res => {
            FS.exists(path, res);
        });
    }
}
exports.default = new Utils();
