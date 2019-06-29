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
const node_fetch_1 = require("node-fetch");
const AdmZip = require("adm-zip");
const Utils_1 = require("../Utils");
const fs_1 = require("fs");
const path_1 = require("path");
const Module_1 = require("./Module");
class PHPMyAdmin extends Module_1.default {
    constructor() {
        super("phpmyadmin");
        this.indexPath = "./www/phpmyadmin/index.php";
        this.url = "https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-english.zip";
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield Utils_1.default.fileExists(this.indexPath)) {
                console.log("PHP My Admin found, skipping download");
                return true;
            }
            console.log(`Downloading PHPMyAdmin from ${this.url}...`);
            const f = yield node_fetch_1.default(this.url, { method: "GET" });
            if (!f.ok) {
                console.error(`Failed to download PHPMyAdmin: ${f.statusText}`);
                return false;
            }
            console.log("Extracting...");
            const admZip = new AdmZip(yield f.buffer());
            const entry = admZip.getEntries().find(e => {
                if (!e.isDirectory) {
                    return false;
                }
                return e.entryName.match(/phpMyAdmin-([\d\.]*)-english/g).length > 0;
            });
            if (!entry) {
                console.error("Corrupted download of PHPMyAdmin");
                return false;
            }
            if (!admZip.extractEntryTo(entry.entryName, "www")) {
                console.error("Failed to extract PHPMyAdmin");
                return false;
            }
            fs_1.renameSync(`www/${entry.entryName}`, "www/phpmyadmin");
            fs_1.copyFileSync(path_1.join("control", "cfg", "config.inc.php"), "www/phpmyadmin/config.inc.php");
            return true;
        });
    }
}
exports.default = new PHPMyAdmin();
