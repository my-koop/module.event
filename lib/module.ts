import utils = require("mykoop-utils");
import controllerList = require("./controllers/index");

var ApplicationError = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkevent.Module {
  init() {
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  addEvent(data: EventInterfaces.AddEventData, callback: (err?: Error) => void) {

  }
}

export = Module;
