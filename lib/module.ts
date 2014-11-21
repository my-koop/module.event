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


      //Event is considered closed when endDate is not null
      var isNull = data.isClosed ? "NOT" : "";

      var query = connection.query(
        "SELECT e.idEvent, e.type, e.startDate, e.endDate, e.startAmount, e.endAmount, name, count(eu.idEvent) as countRegistered " +
        "FROM event e LEFT JOIN event_user eu ON eu.idEvent = e.idEvent WHERE e.endDate IS " + isNull + " NULL GROUP BY e.idEvent",
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
      endAmount     : data.endAmount,
      isClosed      : data.isClosed
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

}

export = Module;
