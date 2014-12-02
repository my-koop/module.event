var EventEditState;
(function (EventEditState) {
    EventEditState[EventEditState["Created"] = 0] = "Created";
    EventEditState[EventEditState["Started"] = 1] = "Started";
    EventEditState[EventEditState["Ended"] = 2] = "Ended";
})(EventEditState || (EventEditState = {}));
;
var EventEditState;
(function (EventEditState) {
    function evaluateState(event) {
        if (event.endDate) {
            return 2 /* Ended */;
        }
        else if (event.startAmount) {
            return 1 /* Started */;
        }
        return 0 /* Created */;
    }
    EventEditState.evaluateState = evaluateState;
})(EventEditState || (EventEditState = {}));
module.exports = EventEditState;
