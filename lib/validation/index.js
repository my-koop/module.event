// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;
var Event = require("../classes/Event");
var _ = require("lodash");
function eventObject(obj) {
    var dataConstraint = {
        name: {
            presence: { message: "^empty" }
        },
        type: {
            presence: { message: "^empty" },
            inclusion: {
                within: ["workshop", "cashier"],
                message: "^invalid"
            }
        },
        startDate: {
            presence: { message: "^empty" },
            datetime: { message: "^invalid" }
        },
        endDate: {
            datetime: {
                message: "^invalid",
                earliest: obj.startDate
            },
        },
        startAmount: {
            presence: obj.endDate ? { message: "^empty" } : undefined,
            numericality: {
                greaterThanOrEqualTo: 0,
                message: "^error"
            }
        },
        endAmount: {
            presence: obj.endDate ? { message: "^empty" } : undefined,
            numericality: {
                greaterThanOrEqualTo: 0,
                message: "^error"
            }
        }
    };
    return validate(obj, dataConstraint);
}
exports.eventObject = eventObject;
