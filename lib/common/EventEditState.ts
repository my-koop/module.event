import Event = require("../classes/Event");

enum EventEditState {
  Created,
  Started,
  Ended
};

module EventEditState {
  export function evaluateState(event: Event) {
    if(event.endDate) {
      return EventEditState.Ended;
    } else if(event.startAmount) {
      return EventEditState.Started;
    }
    return EventEditState.Created;
  }
}

export = EventEditState;
