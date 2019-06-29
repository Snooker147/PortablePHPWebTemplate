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
const fs_1 = require("fs");
const AdmZip = require("adm-zip");
const Utils_1 = require("../Utils");
const path_1 = require("path");
const Module_1 = require("./Module");
const mysqlServer = require("mysql-server");
class SQL extends Module_1.default {
    constructor() {
        super("mysql");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const zipPath = "node_modules/mysql-server/lib/xampp.zip";
                console.log(`Checking ${zipPath}`);
                if (yield Utils_1.default.fileExists(zipPath)) {
                    console.log("Unpacking mysql server...");
                    const adm = new AdmZip(zipPath);
                    adm.extractEntryTo("xampp/", "node_modules/mysql-server/lib");
                    fs_1.unlinkSync(zipPath);
                }
                const configPath = "node_modules/mysql-server/lib/xampp/mysql/bin/my.ini.backup";
                const dstConfigPath = "node_modules/mysql-server/lib/xampp/mysql/bin/my.ini";
                console.log(`Updating MySQL ${configPath}...`);
                if (yield Utils_1.default.fileExists(dstConfigPath)) {
                    console.log("Config file already exists, skipping updation");
                }
                else {
                    let cfg = yield Utils_1.default.readFile(configPath);
                    console.log("Adding skip-grant-tables and FULLDIR to configuration file...");
                    cfg = cfg.replace("[mysqld]", "[mysqld]\nskip-grant-tables");
                    cfg = cfg.replace(/#FULLDIR#/g, path_1.join(process.cwd(), "node_modules", "mysql-server").replace(/\\/g, "/"));
                    fs_1.writeFileSync(dstConfigPath, cfg);
                    console.log("Done");
                }
                mysqlServer.start();
                return true;
            }
            catch (e) {
                console.error(`Failed to start MySQL server: ${e}`);
                return false;
            }
        });
    }
}
exports.default = new SQL();
