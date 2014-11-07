var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var controllerList = require("./controllers/index");
var getLogger = require("mykoop-logger");
var logger = getLogger(module);
var async = require("async");

var ApplicationError = utils.errors.ApplicationError;

var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
    }
    Module.prototype.init = function () {
        this.db = this.getModuleManager().get("database");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
    };

    Module.prototype.addEvent = function (data, callback) {
        var queryData = {
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            startAmount: data.startAmount,
            endAmount: data.endAmount
        };

        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err);
            }

            async.waterfall([
                function (callback) {
                    logger.verbose("adding new event", queryData);
                    connection.query("INSERT INTO event SET ?", [queryData], function (err, result) {
                        callback(err, result ? result.insertId : null);
                    });
                }
            ], function (err) {
                cleanup();
                callback(err);
            });
        });
    };
    return Module;
})(utils.BaseModule);

module.exports = Module;
