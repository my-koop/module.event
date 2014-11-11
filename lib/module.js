var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var controllerList = require("./controllers/index");
var getLogger = require("mykoop-logger");
var async = require("async");
var Event = require("./classes/Event");
var _ = require("lodash");

var logger = getLogger(module);
var DatabaseError = utils.errors.DatabaseError;
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

    Module.prototype.getEvents = function (callback) {
        var events = [];

        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(err);
            }

            var query = connection.query("SELECT ?? FROM ??", [Event.COLUMNS_DB, "event"], function (err, rows) {
                // We cleanup already because we don't need the connection anymore.
                cleanup();

                callback(err && new DatabaseError(err), _.map(rows, function (row) {
                    return new Event(row);
                }));
            });
        });
    };

    Module.prototype.addEvent = function (data, callback) {
        var queryData = {
            type: data.type,
            startDate: data.startDate,
            endDate: data.endDate,
            startAmount: data.startAmount,
            endAmount: data.endAmount
        };

        //When textbox is empty, it returns 0 instead of null, which is timestamp  for January 1 1969
        if (queryData.endDate.getFullYear() == 1969) {
            queryData.endDate = null;
        }

        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                logger.error("Couldn't add new event");
                return callback(new DatabaseError(err));
            }

            async.waterfall([
                function (callback) {
                    logger.verbose("adding new event", queryData);
                    connection.query("INSERT INTO event SET ?", [queryData], function (err, result) {
                        callback(err && new DatabaseError(err), result);
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
