var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var controllerList = require("./controllers/index");
var getLogger = require("mykoop-logger");
var Event = require("./classes/Event");
var _ = require("lodash");
var logger = getLogger(module);
// Errors Type
var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;
var ResourceNotFoundError = ApplicationError.ResourceNotFoundError;
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
    }
    Module.prototype.init = function () {
        this.db = this.getModuleManager().get("database");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
    };
    Module.prototype.getPublicEvents = function (params, callback) {
        this.callWithConnection(this.__getPublicEvents, params, callback);
    };
    Module.prototype.__getPublicEvents = function (connection, params, callback) {
        if (_.isNumber(params.idUser)) {
            var userQuery = "LEFT JOIN (\
        SELECT idEvent, idUser\
          FROM event_user\
          WHERE idUser=?\
      ) eu on e.idEvent=eu.idEvent";
            var idUserQuery = "idUser";
        }
        else {
            var idUserQuery = "null";
            var userQuery = "";
        }
        connection.query(" SELECT ??, !isnull(" + idUserQuery + ") AS registered\
        FROM event e " + userQuery + " WHERE endDate IS NULL && type='workshop'\
        GROUP BY e.idEvent", [
            ["e.idEvent", "description", "name", "startDate"],
            params.idUser
        ], function (err, rows) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            callback(null, { events: _.map(rows, function (row) {
                return row;
            }) });
        });
    };
    Module.prototype.getEvents = function (params, callback) {
        this.callWithConnection(this.__getEvents, params, callback);
    };
    Module.prototype.__getEvents = function (connection, params, callback) {
        var isEndDateNull = params.isClosed && !params.startedOnly ? "NOT" : "";
        var isStartAmountNull = params.startedOnly ? "AND e.startAmount IS NOT NULL " : "";
        //Event is considered closed when endDate is not null
        connection.query("SELECT \
        e.idEvent,\
        e.type,\
        e.startDate,\
        e.endDate,\
        e.startAmount,\
        e.endAmount,\
        e.name,\
        e.description,\
        count(eu.idEvent) as countRegistered,\
        en.noteCount\
      FROM event e \
      LEFT JOIN event_user eu ON eu.idEvent = e.idEvent\
      LEFT JOIN (\
        SELECT targetId, count(targetId) as noteCount\
          FROM event_notes\
          GROUP BY targetId\
      ) en ON en.targetId = e.idEvent\
      WHERE e.endDate IS " + isEndDateNull + " NULL " + isStartAmountNull + "GROUP BY e.idEvent\
      ORDER BY e.startDate, e.endDate", [], function (err, rows) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            callback(null, {
                events: _.map(rows, function (row) {
                    return new Event(row);
                })
            });
        });
    };
    Module.prototype.getEvent = function (params, callback) {
        this.callWithConnection(this.__getEvent, params, callback);
    };
    Module.prototype.__getEvent = function (connection, params, callback) {
        var event = null;
        connection.query("SELECT * FROM event WHERE idEvent=?", [params.id], function (err, rows) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (rows.length !== 1) {
                return callback(new ResourceNotFoundError(err, { id: "notFound" }));
            }
            callback(null, new Event(rows[0]));
        });
    };
    Module.prototype.addEvent = function (params, callback) {
        this.callWithConnection(this.__addEvent, params, callback);
    };
    Module.prototype.__addEvent = function (connection, params, callback) {
        var queryData = {
            name: params.name,
            type: params.type,
            startDate: params.startDate,
            description: params.description
        };
        connection.query("INSERT INTO event SET ?", [queryData], function (err, result) {
            callback(err && new DatabaseError(err), result && { id: result.insertId });
        });
    };
    Module.prototype.endEvent = function (params, callback) {
        this.callWithConnection(this.__endEvent, params, callback);
    };
    Module.prototype.__endEvent = function (connection, params, callback) {
        var queryData = {
            endAmount: params.endAmount,
        };
        connection.query("UPDATE event SET endDate=NOW(), ? WHERE idEvent = ?", [queryData, params.id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback();
        });
    };
    Module.prototype.startEvent = function (params, callback) {
        this.callWithConnection(this.__startEvent, params, callback);
    };
    Module.prototype.__startEvent = function (connection, params, callback) {
        var queryData = {
            startAmount: params.startAmount,
            startDate: new Date()
        };
        connection.query("UPDATE event SET ? WHERE idEvent=?", [queryData, params.id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback();
        });
    };
    Module.prototype.updateEvent = function (params, callback) {
        this.callWithConnection(this.__updateEvent, params, callback);
    };
    Module.prototype.__updateEvent = function (connection, params, callback) {
        var queryData = {
            name: params.name,
            type: params.type,
            startDate: params.startDate,
            endDate: params.endDate,
            startAmount: params.startAmount,
            endAmount: params.endAmount,
            description: params.description
        };
        var id = params.id;
        connection.query("UPDATE event SET ? WHERE idEvent = ?", [queryData, id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback();
        });
    };
    Module.prototype.deleteEvent = function (params, callback) {
        this.callWithConnection(this.__deleteEvent, params, callback);
    };
    Module.prototype.__deleteEvent = function (connection, params, callback) {
        connection.query("DELETE from event WHERE idEvent = ?", [params.id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback();
        });
    };
    Module.prototype.registerToEvent = function (params, callback) {
        this.callWithConnection(this.__registerToEvent, params, callback);
    };
    Module.prototype.__registerToEvent = function (connection, params, callback) {
        var queryData = {
            idUser: params.idUser,
            idEvent: params.idEvent,
        };
        connection.query("INSERT INTO event_user SET ?", [queryData], function (err, result) {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return callback(new ApplicationError(err, { idUser: "duplicate" }));
                }
                if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW_" || err.code === "ER_NO_REFERENCED_ROW") {
                    // We are not sure which is invalid, but it's most likely the event
                    // since users make the request themselves and cannot be deleted
                    return callback(new ResourceNotFoundError(err, { idEvent: "notFound" }));
                }
            }
            callback(err && new DatabaseError(err));
        });
    };
    Module.prototype.unregisterToEvent = function (params, callback) {
        this.callWithConnection(this.__unregisterToEvent, params, callback);
    };
    Module.prototype.__unregisterToEvent = function (connection, params, callback) {
        connection.query("DELETE FROM event_user WHERE idEvent=? AND idUser=?", [params.idEvent, params.idUser], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.affectedRows !== 1) {
                return callback(new ResourceNotFoundError(null, {}));
            }
            callback();
        });
    };
    Module.prototype.getRegisteredUsers = function (params, callback) {
        this.callWithConnection(this.__getRegisteredUsers, params, callback);
    };
    Module.prototype.__getRegisteredUsers = function (connection, params, callback) {
        connection.query("SELECT\
        email, \
        idUser AS id, \
        firstname AS firstName,\
        lastname AS lastName\
      FROM event_user\
      INNER JOIN user on idUser=id\
      WHERE idEvent=?", [params.id], function (err, rows) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            var users = _.map(rows, function (row) {
                return row;
            });
            callback(null, { users: users });
        });
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
