/**
 * @fileoverview Build file
 * @author nzakas
 * @copyright 2016 Nicholas C. Zakas. All rights reserved.
 * MIT License. See LICENSE file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require("fs"),
    path = require("path"),
    childProcess = require("child_process");

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------


module.exports = {

    /**
     * Returns an environment object that has been modified to work with local
     * nod executables.
     * @param {string} [platform] Platform identifier (same values as process.platform).
     * @param {Object} [defaultEnv] The default environment object (mostly used for testing).
     * @returns {Object} a modified environment object.
     */
    getModifiedEnv: function(platform, defaultEnv) {

        platform = platform || process.platform;
        defaultEnv = defaultEnv || process.env;

        var env = {},
            pathSeparator = platform === "win32" ? ";" : ":";

        Object.keys(defaultEnv).forEach(function(key) {
            env[key] = defaultEnv[key];
        });

        // modify PATH to use local node_modules
        env.PATH = path.resolve(__dirname, "../node_modules/.bin") + pathSeparator + env.PATH;

        return env;
    },

    /**
     * Executes a command and returns the output instead of printing it to stdout.
     * @param {string} cmd The command string to execute.
     * @returns {string} The result of the executed command.
     * @throws {Error} If the command exits with a nonzero exit code.
     * @private
     */
    execSilent: function(cmd) {
        return childProcess.execSync(cmd, {
            cwd: process.cwd(),
            env: this.getModifiedEnv()
        }).toString();
    },

    /**
     * Executes a command.
     * @param {string} cmd The command to execute.
     * @returns {void}
     * @throws {Error} If the command exits with a nonzero exit code.
     * @private
     */
    exec: function(cmd) {
        var result = this.execSilent(cmd);
        console.log(result);
    },

    /**
     * Exits the process with the given code. This is just a wrapper around
     * process.exit to allow for easier stubbing and testing.
     * @param {int} code The exit code.
     * @returns {void}
     */
    exit: function(code) {
        process.exit(code);
    }
};