"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const homedir = os_1.default.homedir();
const foundDirs = [];
function fileExists(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield promises_1.default.access(filePath);
            return true;
        }
        catch (e) {
            return false;
        }
    });
}
function removeFileOrDir(dirs) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < dirs.length; i++) {
            if (yield fileExists(dirs[i])) {
                yield promises_1.default.rm(dirs[i], { recursive: true });
                console.log(dirs[i], 'removed');
            }
        }
    });
}
function getDirSize(dirPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let totalSize = 0;
        let children;
        try {
            children = yield promises_1.default.readdir(dirPath);
        }
        catch (error) {
            return;
        }
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childPath = path_1.default.join(dirPath, child);
            const res = yield promises_1.default.lstat(childPath);
            // 如果是软连接
            if (res.isSymbolicLink()) {
                break;
            }
            if (res.isDirectory()) {
                totalSize += yield getDirSize(childPath);
            }
            else {
                totalSize += res.size;
            }
            return totalSize;
        }
    });
}
function searchDir(dirPath, searchName) {
    return __awaiter(this, void 0, void 0, function* () {
        let children;
        try {
            children = yield promises_1.default.readdir(dirPath);
        }
        catch (error) {
            return;
        }
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // console.log('child',child)
            const childPath = path_1.default.join(dirPath, child);
            const res = yield promises_1.default.lstat(childPath);
            // 如果是软连接
            if (res.isSymbolicLink()) {
                break;
            }
            if (res.isDirectory() && !child.startsWith('.')) {
                if (child === 'node_modules') {
                    console.log('childPath', childPath);
                    foundDirs.push(childPath);
                }
                else {
                    yield searchDir(childPath, searchName);
                }
            }
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // await searchDir(homedir, 'node_modules')
        // await fs.writeFile('./found', foundDirs.join(os.EOL))
        // const size = await getDirSize('./node_modules')
        // console.log('size', size)
        const str = yield promises_1.default.readFile('./found', { encoding: 'utf-8' });
        const dirs = str.split(os_1.default.EOL);
        yield removeFileOrDir(dirs);
        console.log('done');
    });
}
main();
//# sourceMappingURL=index.js.map