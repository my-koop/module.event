// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;
var Event    = require("../classes/Event");

var dataConstraint = {
  name: {
    presence: true
  },
  type: {
    presence: {message: "^empty"},
    inclusion: ["workshop", "cashier"]
  },
  startDate: {
    presence: true
  },
  startAmount: {
    numericality: {
      greaterThan: 0,
      message: "^error"
    }
  },
  endAmount: {
    numericality: {
      greaterThan: 0,
      message: "^error"
    }
  }
}

export function addEvent(obj) {
  return validate(obj, dataConstraint);
}