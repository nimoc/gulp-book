'use strict';

var executable = require('executable');
var spawn = require('child_process').spawn;

/**
 * Check if a executable is working correctly by checking it's exit code
 *
 * @param {String} bin
 * @param {Array} cmd
 * @param {Function} cb
 * @api public
 */

module.exports = function (bin, cmd, cb) {
    if (typeof cmd === 'function') {
        cb = cmd;
        cmd = ['--help'];
    }

    executable(bin, function (err, w) {
        if (err) {
            cb(err);
            return;
        }

        if (w) {
            spawn(bin, cmd)
                .on('error', function (err) {
                    cb(err);
                    return;
                })
                .on('exit', function (code) {
                    cb(null, code === 0 ? true : false);
                    return;
                });
        } else {
            cb(new Error('Couldn\'t execute the `' + bin + '` binary. Make sure it has the right permissions.'));
            return;
        }
    });
};
