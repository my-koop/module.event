// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;
var Event = require("../classes/Event");

var dataConstraint = {
    name: {
        presence: true
    },
    type: {
        presence: true,
        inclusion: ["workshop", "cashier"]
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
};

function addEvent(obj) {
    return validate(obj, dataConstraint);
}
exports.addEvent = addEvent;
