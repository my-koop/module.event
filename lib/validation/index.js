// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;
var __ = require("language").__;
var Event = require("../classes/Event");

var updateDataConstraint = {
    id: {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0
        }
    },
    type: {
        presence: true,
        //Fixme add type restriction
        message: __("event::illegalEventType")
    },
    startDate: {
        presence: true,
        message: __("event::startDateInvalid")
    },
    endDate: {
        presence: true,
        message: __("event::endDateInvalid")
    },
    startAmount: {
        presence: true,
        numericality: {
            greaterThan: 0,
            message: __("event::startAmountInvalid")
        }
    },
    endAmount: {
        presence: true,
        numericality: {
            greaterThan: 0,
            message: __("event::endAmountInvalid")
        }
    }
};
function updateEvent(obj) {
    return validate(obj, updateDataConstraint);
}
exports.updateEvent = updateEvent;
