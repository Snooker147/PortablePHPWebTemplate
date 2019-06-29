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
const CommandExists = require("command-exists");
const AdmZip = require("adm-zip");
const node_fetch_1 = require("node-fetch");
const Utils_1 = require("../Utils");
const path_1 = require("path");
const Module_1 = require("./Module");
const SCSS_1 = require("./SCSS");
const fs_1 = require("fs");
class PHPServer extends Module_1.default {
    constructor() {
        super("phpserver");
        this.running = false;
        this.server = null;
        this.styleSource = "";
        this.scriptSource = "";
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const phpPortable = yield Utils_1.default.fileExists("bin/php/php.exe");
            if (phpPortable) {
                console.log("We've found a portable edition of PHP inside bin/php, delete it if you have PHP already installed on your system.");
            }
            else {
                if ((yield this.installPHP()) === false) {
                    return false;
                }
            }
            const middle = (req, res, next) => {
                const path = req.path;
                const hasDot = path.indexOf(".") !== -1;
                res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private'); // Disable caching
                if (!hasDot && !path.endsWith("/")) {
                    res.redirect(`${req.url}/`);
                }
                else {
                    if (path === "/") {
                        next();
                        return;
                    }
                    else if (path === "/compiled.js") {
                        res.send(this.scriptSource);
                    }
                    else if (path === "/compiled.css") {
                        SCSS_1.default.compile().then(css => {
                            if (css) {
                                this.styleSource = css;
                            }
                            res.contentType("text/css");
                            res.send(this.styleSource);
                        });
                    }
                    else {
                        let filePath = path;
                        if (!hasDot && path.endsWith("/")) {
                            filePath = `${path}/index.php`;
                        }
                        const fl = `www/${filePath}`;
                        if (fs_1.existsSync(fl)) {
                            next();
                        }
                        else {
                            res.redirect("/404.php");
                        }
                    }
                }
            };
            return new Promise(res => {
                const config = {
                    port: 8000,
                    ini_config: "./php.ini",
                    bin: phpPortable ? "bin/php/php.exe" : "php",
                    root: "./www",
                    middleware: [middle],
                    output: {
                        ip: false,
                        date: false,
                        os: false,
                        browser: false,
                        device: false,
                        statusCode: false,
                        method: false
                    },
                    ini_set: {}
                };
                if (phpPortable) {
                    config.ini_set["extension_dir"] = path_1.join(process.cwd(), "bin", "php", "ext");
                }
                try {
                    this.server = require("node-php-awesome-server")(config);
                }
                catch (e) {
                    console.log(e);
                    res(false);
                }
                this.server.on("error", (e) => {
                    console.log(e);
                    res(false);
                });
                this.server.on("close", () => {
                    this.running = false;
                });
                this.server.on("connect", () => {
                    this.running = true;
                    res(true);
                });
            });
        });
    }
    close() {
        this.server.close();
    }
    checkPHP() {
        return new Promise(res => {
            CommandExists("php", (err, exists) => {
                if (err) {
                    res(false);
                }
                else {
                    res(exists);
                }
            });
        });
    }
    installPHP() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkPHP()) {
                console.log("We've detected PHP installed on your system, carrying on");
                return true;
            }
            console.log("We couldn't find PHP executable installed on your system");
            const answer = yield Utils_1.default.waitForInput("Do you want to download a portable PHP binaries now? (Y/n) ");
            if (answer.toLowerCase() !== "y") {
                console.log("We can't run a PHP website without PHP, install PHP, reset bash and start this app again.");
                return false;
            }
            console.log(`Preparing for download... Platform: ${process.platform}`);
            if (process.platform !== "win32") {
                console.log("PHP downloading is currently only avaible on Windows");
                console.log("If you're on Linux use: `apt-get install php` or similiar command to install PHP and then restart this App");
                console.log("If you're using Mac OS download PHP redistributable or build PHP yourself then restart this App");
                console.log("Aborting...");
                return false;
            }
            const is64 = process.arch === "x64";
            console.log(`Using x64 version?: ${is64 ? "yes" : "no"}`);
            const downloadInfo = JSON.parse(yield Utils_1.default.readFile("bin/download.json"));
            const url = is64 ? downloadInfo.x64 : downloadInfo.x86;
            console.log(`Downloading ${url}...`);
            const f = yield node_fetch_1.default(url, {
                method: "GET"
            });
            if (!f.ok) {
                console.error(`Failed to download PHP binaries: ${f.statusText}`);
                return false;
            }
            const zip = new AdmZip(yield f.buffer());
            console.log("Extracting...");
            return new Promise(res => {
                zip.extractAllToAsync("bin/php", true, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(`Failed to extract PHP binaries from zip file: ${err}`);
                        res(false);
                    }
                    else {
                        console.log("Done, creating link...");
                        res(true);
                    }
                }));
            });
        });
    }
    setScriptString(src) {
        this.scriptSource = src;
    }
    setStyleSource(src) {
        this.styleSource = src;
    }
    isRunning() { return this.running; }
}
exports.default = new PHPServer();
