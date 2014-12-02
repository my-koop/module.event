import utils            = require("mykoop-utils");
import controllerList   = require("./controllers/index");
import getLogger        = require("mykoop-logger");
import async            = require("async");
import Event            = require("./classes/Event");

var logger              = getLogger(module);
var DatabaseError       = utils.errors.DatabaseError;
var ApplicationError    = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkevent.Module {
  private db: mkdatabase.Module;

  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  getEvents(data: EventInterfaces.GetEventsData, callback: (err: Error, result?: Event[]) => void) {
    var events = [];

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }

      var isEndDateNull = data.isClosed && !data.startedOnly ? "NOT" : "";
      var isStartAmountNull = data.startedOnly ? "AND e.startAmount IS NOT NULL " : "";

      //Event is considered closed when endDate is not null
      var query = connection.query(
        "SELECT e.idEvent, e.type, e.startDate, e.endDate, e.startAmount, e.endAmount, name, count(eu.idEvent) as countRegistered " +
        "FROM event e LEFT JOIN event_user eu ON eu.idEvent = e.idEvent " +
        "WHERE e.endDate IS " + isEndDateNull + " NULL " + isStartAmountNull +
        "GROUP BY e.idEvent " +
        "ORDER BY e.startDate, e.endDate",
        [],
        function(err, rows) {
          cleanup();

          if (err) {
            return callback(new DatabaseError(err));
          }

          for (var i in rows) {
             events.push(new Event(rows[i]));
          }

          callback(null, events);
      });
    });
  }

  addEvent(data: EventInterfaces.AddEventData, callback: (err?: Error) => void) {
    var queryData: EventDbQueryStruct.EventData = {
      name          : data.name,
      type          : data.type,
      startDate     : data.startDate,
      endDate       : data.endDate,
      startAmount   : data.startAmount,
      endAmount     : data.endAmount
    };

    //When textbox is empty, it returns 0 instead of null, which is timestamp  for January 1 1969
    if(queryData.endDate.getFullYear() == 1969){
      queryData.endDate = null;
    }

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        logger.error("Couldn't add new event");
        return callback(new DatabaseError(err));
      }

      async.waterfall([
        function(callback) {
          logger.verbose("adding new event", queryData);
          connection.query(
            "INSERT INTO event SET ?",
            [queryData],
            function(err, result) {
              callback(err && new DatabaseError(err), result);
            }
          );
        }
      ], function(err) {
        cleanup();
        callback(err);
      })
    });
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
      function(err) {
        callback(err && new DatabaseError(err));
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
    };

    connection.query(
      "UPDATE event SET startDate=NOW(), ? WHERE idEvent = ?",
      [queryData, params.id],
      function(err) {
        callback(err && new DatabaseError(err));
      }
    );
  }

  updateEvent(data: EventInterfaces.UpdateEventData, callback: (err?: Error) => void) {
    var queryData: EventDbQueryStruct.EventData = {
      name          : data.name,
      type          : data.type,
      startDate     : data.startDate,
      endDate       : data.endDate,
      startAmount   : data.startAmount,
      endAmount     : data.endAmount
    };

    var id = data.id;

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }

      var query = connection.query(
        "UPDATE event SET ? WHERE idEvent = ?",
        [queryData, id],
        function(err) {
          cleanup();

          if (err) {
            return callback(new DatabaseError(err));
          }

          callback();
      });
    });
  }

  deleteEvent(id: Number, callback: (err?: Error, result?: boolean) => void) {
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(err);
      }
      var query = connection.query(
        "DELETE from event WHERE idEvent = ?",
        [id],
        function(err, res) {
          cleanup();

          if (err) {
            return callback(new DatabaseError(err));
          }

          callback(null, res.affectedRows !== 0);
      });
    });
  }

  registerToEvent(
    data: EventInterfaces.RegisterEventData,
    callback: (err?: Error, result?: {success: boolean}) => void
  ) {
    var queryData: EventDbQueryStruct.EventUserData = {
      idUser     : data.idUser,
      idEvent    : data.idEvent,
      registered : true
    };

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }

      async.waterfall([
        // FIXME:: make sure idUser and idEvent exists and are valid
        function(callback) {
          logger.verbose("Registering to event", queryData);
          connection.query(
            "INSERT INTO event_user SET ?",
            [queryData],
            function(err, result) {
              if(err && err.code === "ER_DUP_ENTRY") {
                return callback(new ApplicationError(
                  err,
                  {
                    name: "duplicate"
                  }
                ));
              }
              callback(err && new DatabaseError(err));
            }
          );
        }
      ], function(err, result: any) {
        cleanup();
        callback(err, {success: result && result.affectedRows === 1});
      })
    });
  }

  getEvent(data: EventInterfaces.GetEventData, callback: (err: Error, result?: Event) => void) {
    var event = null;

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }
      var query = connection.query(
        "SELECT * FROM event WHERE idEvent=?",
        [data.id],
        function(err, rows) {
          cleanup();

          if (err) {
            return callback(new DatabaseError(err));
          }

          if(rows.length == 1){
            event = new Event(rows[0]);
            callback(null, event);
          }else{
            return callback(new DatabaseError(err));
          }
      });
    });
  }

}

export = Module;
