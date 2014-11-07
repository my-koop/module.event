import utils = require("mykoop-utils");
import controllerList = require("./controllers/index");
import getLogger = require("mykoop-logger");
var logger = getLogger(module);
import async = require("async");
// import validation = require("./validation/index");
import Event = require("./classes/Event");

var ApplicationError = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkevent.Module {
	private db: mkdatabase.Module;

  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  addEvent(data: EventInterfaces.AddEventData, callback: (err?: Error) => void) {
  	var queryData: EventDbQueryStruct.EventData = {
  	  type      	  : data.type,
  	  startDate   	: data.startDate,
  	  endDate     	: data.endDate,
  	  startAmount 	: data.startAmount,
  	  endAmount   	: data.endAmount
    };

    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        logger.error("Couldn't add new event");
        return callback(err);
      }

      async.waterfall([
        function(callback) {
          logger.verbose("adding new event", queryData);
          connection.query(
            "INSERT INTO event SET ?",
            [queryData],
            function(err, result) {
              callback(err, result ? result.insertId : null);
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
