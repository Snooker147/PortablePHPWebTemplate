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
const Sass = require("node-sass");
const Module_1 = require("./Module");
const PHPServer_1 = require("./PHPServer");
class SCSS extends Module_1.default {
    constructor() {
        super("scss");
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const css = yield this.compile();
            if (css) {
                PHPServer_1.default.setStyleSource(css);
            }
            return true;
        });
    }
    compile() {
        return new Promise(res => {
            Sass.render({
                file: "./www/style/style.scss",
                sourceMap: false,
            }, (err, result) => {
                if (err) {
                    console.log("SASS Error: " + err.message);
                    res(null);
                }
                else {
                    res(result.css.toString());
                }
            });
        });
    }
}
exports.default = new SCSS();
