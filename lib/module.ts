import utils            = require("mykoop-utils");
import controllerList   = require("./controllers/index");
import getLogger        = require("mykoop-logger");
import async            = require("async");
import Event            = require("./classes/Event");
import _                = require("lodash");
var logger = getLogger(module);

// Errors Type
var DatabaseError = utils.errors.DatabaseError;
var ApplicationError = utils.errors.ApplicationError;
var ResourceNotFoundError = ApplicationError.ResourceNotFoundError;

class Module extends utils.BaseModule implements mkevent.Module {
  private db: mkdatabase.Module;

  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  getEvents(
    params: mkevent.GetEvents.Params,
    callback: mkevent.GetEvents.Callback
  ) {
    this.callWithConnection(this.__getEvents, params, callback);
  }

  __getEvents(
    connection: mysql.IConnection,
    params: mkevent.GetEvents.Params,
    callback: mkevent.GetEvents.Callback
  ) {
    var isEndDateNull = params.isClosed && !params.startedOnly ? "NOT" : "";
    var isStartAmountNull = params.startedOnly ? "AND e.startAmount IS NOT NULL " : "";

    //Event is considered closed when endDate is not null
    connection.query(
      "SELECT \
        e.idEvent,\
        e.type,\
        e.startDate,\
        e.endDate,\
        e.startAmount,\
        e.endAmount,\
        name,\
        count(eu.idEvent) as countRegistered\
      FROM event e LEFT JOIN event_user eu ON eu.idEvent = e.idEvent\
      WHERE e.endDate IS " + isEndDateNull + " NULL " + isStartAmountNull +
      "GROUP BY e.idEvent " +
      "ORDER BY e.startDate, e.endDate",
      [],
      function(err, rows) {
        if (err) {
          return callback(new DatabaseError(err));
        }
        callback(null, {
          events: _.map(rows, function(row) {return new Event(row);})}
        );
      }
    );
  }

  addEvent(
    params: mkevent.AddEvent.Params,
    callback: mkevent.AddEvent.Callback
  ) {
    this.callWithConnection(this.__addEvent, params, callback);
  }

  __addEvent(
    connection: mysql.IConnection,
    params: mkevent.AddEvent.Params,
    callback: mkevent.AddEvent.Callback
  ) {
    var queryData: EventDbQueryStruct.NewEventData = {
      name: params.name,
      type: params.type,
      startDate: params.startDate,
      description: params.description
    };

    connection.query(
      "INSERT INTO event SET ?",
      [queryData],
      function(err, result) {
        callback(
          err && new DatabaseError(err),
          result && {id: result.insertId}
        );
      }
    );
  }

  endEvent(
    params: mkevent.EndEvent.Params,
    callback: mkevent.EndEvent.Callback
  ) {
    this.callWithConnection(this.__endEvent, params, callback);
  }

  __endEvent(
    connection: mysql.IConnection,
    params: mkevent.EndEvent.Params,
    callback: mkevent.EndEvent.Callback
  ) {
    var queryData = {
      endAmount : params.endAmount,
    };

    connection.query(
      "UPDATE event SET endDate=NOW(), ? WHERE idEvent = ?",
      [queryData, params.id],
      function(err, res) {
        if(err) {
          return callback(new DatabaseError(err));
        }
        if(res.affectedRows !== 1) {
          return callback(new ResourceNotFoundError(null, {id: "notFound"}));
        }
        callback();
      }
    );
  }

  startEvent(
    params: mkevent.StartEvent.Params,
    callback: mkevent.StartEvent.Callback
  ) {
    this.callWithConnection(this.__startEvent, params, callback);
  }

  __startEvent(
    connection: mysql.IConnection,
    params: mkevent.StartEvent.Params,
    callback: mkevent.StartEvent.Callback
  ) {
    var queryData = {
      startAmount : params.startAmount,
      startDate: new Date()
    };
    connection.query(
      "UPDATE event SET ? WHERE idEvent=?",
      [queryData, params.id],
      function(err, res) {
        if(err) {
          return callback(new DatabaseError(err));
        }
        if(res.affectedRows !== 1) {
          return callback(new ResourceNotFoundError(null, {id: "notFound"}));
        }
        callback();
      }
    );
  }

  updateEvent(
    params: mkevent.UpdateEvent.Params,
    callback: mkevent.UpdateEvent.Callback
  ) {
    this.callWithConnection(this.__updateEvent, params, callback);
  }

  __updateEvent(
    connection: mysql.IConnection,
    params: mkevent.UpdateEvent.Params,
    callback: mkevent.UpdateEvent.Callback
  ) {
    var queryData: EventDbQueryStruct.EventData = {
      name        : params.name,
      type        : params.type,
      startDate   : params.startDate,
      endDate     : params.endDate,
      startAmount : params.startAmount,
      endAmount   : params.endAmount,
      description : params.description
    };
    var id = params.id;

    connection.query(
      "UPDATE event SET ? WHERE idEvent = ?",
      [queryData, id],
      function(err, res) {
        if (err) {
          return callback(new DatabaseError(err));
        }
        if(res.affectedRows !== 1) {
          return callback(new ResourceNotFoundError(null, {id: "notFound"}));
        }
        callback();
      }
    );
  }

  deleteEvent(
      params : mkevent.DeleteEvent.Params,
      callback: mkevent.DeleteEvent.Callback
  ) {
    this.callWithConnection(this.__deleteEvent, params, callback);
  }

  __deleteEvent(
      connection: mysql.IConnection,
      params : mkevent.DeleteEvent.Params,
      callback: mkevent.DeleteEvent.Callback
  ) {
    connection.query(
      "DELETE from event WHERE idEvent = ?",
      [params.id],
      function(err, res) {
        if (err) {
          return callback(new DatabaseError(err));
        }
        if(res.affectedRows !== 1) {
          return callback(new ResourceNotFoundError(null, {id: "notFound"}));
        }
        callback();
      }
    );
  }

  registerToEvent(
    params: mkevent.RegisterToEvent.Params,
    callback: mkevent.RegisterToEvent.Callback
  ) {
    this.callWithConnection(this.__registerToEvent, params, callback);
  }

  __registerToEvent(
    connection: mysql.IConnection,
    params: mkevent.RegisterToEvent.Params,
    callback: mkevent.RegisterToEvent.Callback
  ) {
    var queryData: EventDbQueryStruct.EventUserData = {
      idUser     : params.idUser,
      idEvent    : params.idEvent,
    };
    connection.query(
      "INSERT INTO event_user SET ?",
      [queryData],
      function(err, result) {
        if(err) {
          if(err.code === "ER_DUP_ENTRY") {
            return callback(new ApplicationError(err, {idUser: "duplicate"}));
          }
          if(err.code === "ER_NO_REFERENCED_ROW_2" ||
            err.code === "ER_NO_REFERENCED_ROW_" ||
            err.code === "ER_NO_REFERENCED_ROW"
          ) {
            // We are not sure which is invalid, but it's most likely the event
            // since users make the request themselves and cannot be deleted
            return callback(new ResourceNotFoundError(err, {idEvent: "notFound"}));
          }
        }
        callback(err && new DatabaseError(err));
      }
    );
  }

  getEvent(
    params: mkevent.GetEvent.Params,
    callback: mkevent.GetEvent.Callback
  ) {
    this.callWithConnection(this.__getEvent, params, callback);
  }
  __getEvent(
    connection: mysql.IConnection,
    params: mkevent.GetEvent.Params,
    callback: mkevent.GetEvent.Callback
  ) {
    var event = null;
    connection.query(
      "SELECT * FROM event WHERE idEvent=?",
      [params.id],
      function(err, rows) {
        if (err) {
          return callback(new DatabaseError(err));
        }
        if(rows.length !== 1) {
          return callback(new ResourceNotFoundError(err, {id: "notFound"}));
        }
        callback(null, new Event(rows[0]));
      }
    );
  }

}

export = Module;
