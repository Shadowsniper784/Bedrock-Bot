"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = __importDefault(require("child_process"));
const pluginAPI_1 = __importDefault(require("./pluginapi/pluginAPI"));
const axios_1 = __importDefault(require("axios"));
class pluginManager {
    constructor(bewss) {
        this.plugins = new Map();
        this.pluginNames = [];
        this.latestInterface = "https://raw.githubusercontent.com/PMK744/Node-BEWSS/main/src/bewss/%40interface/bewss.i.ts";
        this.root = path_1.default.resolve(process.cwd());
        this.pluginsPath = path_1.default.resolve(this.root, './plugins');
        this.bewss = bewss;
    }
    async onEnabled() {
        await this.loadAll();
        return;
    }
    async onDisabled() {
        for (const [path, { config, plugin }] of this.plugins.entries()) {
            try {
                plugin.onDisabled();
            }
            catch (error) {
                this.error(`Plugin "${config.name || path}". Uncaught Exception(s):\n`, error);
            }
        }
        return;
    }
    async loadAll() {
        return new Promise(async (res) => {
            if (!fs_1.default.existsSync(this.pluginsPath)) {
                this.warn("ENOENT: Plugins folder does not exist. Creating plugins folder:", `"${this.pluginsPath}"`);
                fs_1.default.mkdirSync(this.pluginsPath, { recursive: true });
                return res();
            }
            const pluginsDirs = [];
            for (const item of fs_1.default.readdirSync(this.pluginsPath)) {
                if (!fs_1.default.statSync(path_1.default.resolve(this.pluginsPath, item)).isDirectory())
                    continue;
                pluginsDirs.push(item);
            }
            if (pluginsDirs.length < 1) {
                this.info('No plugins found!');
                return res();
            }
            for (const plugin of pluginsDirs) {
                await this.register(path_1.resolve(this.pluginsPath, plugin));
            }
            return res();
        });
    }
    async register(path) {
        return new Promise(async (res) => {
            try {
                const confPath = path_1.resolve(path, "package.json");
                if (!fs_1.default.existsSync(confPath)) {
                    this.error(`ENOENT: package.json does not exist in "${path}". Skipping plugin!`);
                    return res();
                }
                const config = await Promise.resolve().then(() => __importStar(require(confPath)));
                if (!this.verifyConfig(path, config))
                    return res();
                const entryPoint = path_1.resolve(path, config.main);
                const request = await axios_1.default.get(this.latestInterface);
                if (!fs_1.default.existsSync(path_1.resolve(path, "src", "@interface")))
                    fs_1.default.mkdirSync(path_1.resolve(path, "src", "@interface"));
                fs_1.default.writeFileSync(path_1.resolve(path, "src", "@interface", "bewss.i.ts"), request.data);
                let neededUpdate = false;
                let succeededUpdate = false;
                let buildSuccess = true;
                let alreadyBuilt = false;
                if (!fs_1.default.existsSync(path_1.resolve(path, "node_modules")) && (config.dependencies || config.devDependencies)) {
                    neededUpdate = true;
                    succeededUpdate = await this.update(path, config);
                }
                if (neededUpdate && !succeededUpdate) {
                    this.error(`Skipping plugin "${config.displayName || path}". Failed to install dependencies.`);
                    return res();
                }
                if (!fs_1.default.existsSync(path_1.resolve(path, "dist"))) {
                    buildSuccess = await this.build(path, config);
                    alreadyBuilt = true;
                }
                if (config.devMode !== false && !alreadyBuilt) {
                    this.warn(`Plugin "${config.displayName || path}" is in dev mode. Set devMode to false in package.json to disable`);
                    buildSuccess = await this.build(path, config);
                }
                if (!buildSuccess) {
                    this.error(`Skipping plugin "${config.displayName || path}". Failed to build.`);
                    return res();
                }
                try {
                    const plugin = require(entryPoint);
                    const newPlugin = new plugin(new pluginAPI_1.default(this.bewss, config, path));
                    this.info(`Successfully loaded plugin "${config.displayName || path}"`);
                    this.pluginNames.push(config.displayName || config.name || path);
                    this.plugins.set(path, {
                        config,
                        plugin: newPlugin,
                    });
                    try {
                        newPlugin.onEnabled();
                    }
                    catch (error) {
                        this.error(`Plugin "${config.displayName || path}". Uncaught Exception(s):\n`, error);
                    }
                }
                catch (error) {
                    this.error(`Plugin "${config.displayName || path}". Uncaught Exception(s):\n`, error);
                }
            }
            catch (error) {
                this.error(`Failed to load plugin "${path}". Recieved Error(s):\n`, error);
            }
            return res();
        });
    }
    unregister(name) {
        const plugin = this.plugins.get(name) || Array.from(this.plugins.values()).find(({ config }) => config.name === name);
        if (!plugin)
            return;
        const path = this.getByValue(this.plugins, plugin);
        if (!path)
            return;
        plugin.plugin.onDisabled();
        try {
            delete require.cache[require.resolve(path_1.resolve(path))];
            delete require.cache[require.resolve(path_1.resolve(path, "package.json"))];
            delete require.cache[require.resolve(path_1.resolve(path, plugin.config.main))];
        }
        catch { }
        this.plugins.delete(path);
        return path;
    }
    async reload(name) {
        const unregister = this.unregister(name);
        if (unregister) {
            await this.register(unregister);
            return Promise.resolve();
        }
    }
    async reloadAll() {
        await this.bewss.getCommandManager().reloadAll();
        const plugins = [...this.plugins.keys()];
        for (const plugin of plugins) {
            await this.reload(plugin);
        }
        return Promise.resolve();
    }
    async reIndex() {
        const pluginsDirs = [];
        for (const item of fs_1.default.readdirSync(this.pluginsPath)) {
            if (!fs_1.default.statSync(path_1.default.resolve(this.pluginsPath, item)).isDirectory())
                continue;
            pluginsDirs.push(item);
        }
        if (pluginsDirs.length < 1) {
            this.info('No plugins found! Unregistering all currently registered');
            for (const plugin of this.plugins.keys()) {
                this.unregister(plugin);
            }
            return Promise.resolve();
        }
        const currentPlugins = Array.from(this.plugins.keys());
        for (const plugin of pluginsDirs) {
            const path = path_1.resolve(this.pluginsPath, plugin);
            if (currentPlugins.includes(path))
                continue;
            this.info(`[ReIndex] New Plugin Found "${plugin}"`);
            await this.register(path);
        }
        const pluginDirz = [];
        for (const dir of pluginsDirs) {
            pluginDirz.push(path_1.resolve(this.pluginsPath, dir));
        }
        for (const plugin of currentPlugins) {
            if (pluginDirz.includes(plugin))
                continue;
            this.info(`[ReIndex] Could not resolve "${plugin}".. Unregistering`);
            this.unregister(plugin);
        }
        return Promise.resolve();
    }
    getByValue(map, searchValue) {
        for (const [k, v] of map.entries()) {
            if (v === searchValue)
                return k;
        }
    }
    async update(path, config) {
        return new Promise((res) => {
            this.info(`Installing dependencies for "${config.displayName || path}"`);
            child_process_1.default.exec('npm i', {
                cwd: path,
            }, (err, out, s) => {
                if (err) {
                    this.error(`Failed to install dependencies for "${config.displayName || path}". Recieved Error(s):\n`, out, s);
                    res(false);
                }
                else {
                    this.info(`Finished installing dependencies for "${config.displayName || path}"`);
                    res(true);
                }
            });
        });
    }
    async build(path, config) {
        return new Promise((res) => {
            this.info(`Attempting to build "${config.displayName || path}"`);
            child_process_1.default.exec('npm run build', {
                cwd: path,
            }, (err, out) => {
                if (err) {
                    this.error(`Failed to build "${config.displayName || path}". Recieved Error(s):\n`, out);
                    res(false);
                }
                else {
                    this.info(`Successfully built "${config.displayName || path}"`);
                    res(true);
                }
            });
        });
    }
    verifyConfig(path, config) {
        if (config.displayName == undefined)
            this.warn(`@${config.author}, your plugin is missing "displayName" in your package.json. Your plugin will be refered as "${path}"`);
        if (!config.version)
            this.warn(`plugin "${config.displayName || path}" missing version prop in package.json`);
        if (config.devMode === undefined)
            this.info(`plugin "${config.displayName || path}" missing devMode prop in package.json. Auto defaults to true!`);
        if (!config.main) {
            this.error(`plugin "${config.displayName || path}" missing main prop in package.json. Cannot start plugin without valid path to main file!`);
            return false;
        }
        if (!config.scripts) {
            this.error(`plugin "${config.displayName || path}" missing scripts in package.json. Cannot start plugin without needed scripts!`);
            return false;
        }
        if (!config.scripts.build) {
            this.error(`plugin "${config.displayName || path}" missing scripts.build in package.json. Cannot start plugin without needed scripts!`);
            return false;
        }
        if (!config.dependencies && !config.devDependencies) {
            this.info(`WOW @${config.author || config.displayName || path}, your plugin has absolutely no depedencies! However, you should probably add "@types/node" as a devdependency.`);
        }
        if (!config.devDependencies) {
            this.warn(`plugin "${config.displayName || path}" does not have @types/node. This is known to cause issues for some people. Please add "@types/node" as a devdependency to your project`);
        }
        if (config.devDependencies) {
            const devDependencies = Object.keys(config.devDependencies);
            if (!devDependencies.includes("@types/node")) {
                this.warn(`plugin "${config.displayName || path}" does not have @types/node. This is known to cause issues for some people. Please add "@types/node" as a devdependency to your project`);
            }
        }
        if (config.devDependencies && !config.dependencies) {
            const devDependencies = Object.keys(config.devDependencies);
            const filterTypes = devDependencies.filter(d => d !== "@types/node");
            if (filterTypes.length < 1) {
                this.info(`Great job @${config.author || config.displayName || path}! your plugin has absolutely no depedencies!`);
            }
        }
        if (config.dependencies) {
            const dependencies = Object.keys(config.dependencies);
            const dependencyFilter = dependencies.filter(i => i !== "ts-node" && i !== "typescript");
            let onlyTypes = true;
            if (config.devDependencies) {
                const devDependencies = Object.keys(config.devDependencies);
                const filterTypes = devDependencies.filter(d => d !== "@types/node");
                if (filterTypes.length > 1) {
                    onlyTypes = false;
                }
            }
            if (dependencyFilter.length < 1 && onlyTypes) {
                this.info(`Congrats @${config.author || config.displayName || path}, your plugin does not use any dependencies other than the needed ones!`);
            }
        }
        return true;
    }
    getPlugins() {
        return this.pluginNames;
    }
    info(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginManager]")} ${chalk_1.default.cyan("[Info]")}`, ...content);
    }
    warn(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginManager]")} ${chalk_1.default.yellow("[Warn]")}`, ...content);
    }
    error(...content) {
        console.log(`${chalk_1.default.gray(moment_1.default().format("HH:mm:ss"))} ${chalk_1.default.blue("[PluginManager]")} ${chalk_1.default.red("[Error]")}`, ...content);
    }
}
exports.default = pluginManager;
