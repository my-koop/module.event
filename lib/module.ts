import utils            = require("mykoop-utils");
import controllerList   = require("./controllers/index");
import getLogger        = require("mykoop-logger");
import async            = require("async");
import Event            = require("./classes/Event");
import _                = require("lodash");

var logger              = getLogger(module);
var DatabaseError       = utils.errors.DatabaseError;
var ApplicationError    = utils.errors.ApplicationError;


class Module extends utils.BaseModule implements mkevent.Module {
  private db: mkdatabase.Module;

  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  getEvents(callback: (err: Error, result?: Event[]) => void) {
    var events = [];

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }

      var query = connection.query(
        "SELECT ?? FROM ??",
        [Event.COLUMNS_DB, "event"],
        function(err, rows) {
          cleanup();

          if (err) {
            return callback(err);
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
}

export = Module;
