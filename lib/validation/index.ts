// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;
var Event    = require("../classes/Event");

var updateDataConstraint = {
  type: {
    presence: true
    //Fixme: add EventType restriction 
  },
  startDate: {
    presence: true
  },
  startAmount: {
    presence: true,
    numericality: {
      greaterThan: 0
    }
  },
  endAmount: {
    numericality: {
      greaterThan: 0
    }
  }
}

export function addEvent(obj) {
  return validate(obj, updateDataConstraint);
}