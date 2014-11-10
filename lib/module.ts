import utils            = require("mykoop-utils");
import controllerList   = require("./controllers/index");
import getLogger        = require("mykoop-logger");
var logger              = getLogger(module);
import async            = require("async");
import Event            = require("./classes/Event");
var DatabaseError       = utils.errors.DatabaseError;
var ApplicationError    = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkevent.Module {
  private db: mkdatabase.Module;

  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  addEvent(data: EventInterfaces.AddEventData, callback: (err?: Error) => void) {
    
    var queryData: EventDbQueryStruct.EventData = {
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
              callback(err ? new DatabaseError(err) : null, result);
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
