"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PHPServer_1 = require("./module/PHPServer");
const SQL_1 = require("./module/SQL");
const PHPMyAdmin_1 = require("./module/PHPMyAdmin");
const SCSS_1 = require("./module/SCSS");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        const modules = [
            PHPServer_1.default,
            PHPMyAdmin_1.default,
            SQL_1.default,
            SCSS_1.default
        ];
        for (const m of modules) {
            console.log(`Starting ${m.getName()}...`);
            if (!(yield m.start())) {
                console.error(`\x1b[31m --- Failed to start ${m.getName()} ---\x1b[0m`);
                process.exit(-1);
            }
            console.log(`${m.getName()} is running!`);
        }
        console.log("\x1b[32m --- All up and running! ---\x1b[0m");
    });
}
main();
