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
const PHPServer_1 = require("./PHPServer");
const SQL_1 = require("./SQL");
const PHPMyAdmin_1 = require("./PHPMyAdmin");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = new PHPServer_1.default();
        if (!(yield server.start())) {
            console.error("Failed to start PHP Server");
            process.exit(-1);
        }
        if (!(yield PHPMyAdmin_1.default.start())) {
            console.error("Failed to download PHPMyAdmin");
            process.exit(-1);
        }
        if (!(yield SQL_1.default.start())) {
            console.error("Failed to start MySQL server");
            process.exit(-1);
        }
        console.log("All up and running!");
    });
}
main();
