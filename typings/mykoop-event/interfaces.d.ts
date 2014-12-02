declare module EventInterfaces {
  export interface AddEventData {
    name            : string;
    type            : string;
    startDate       : Date;
    endDate         : Date;
    startAmount     : number;
    endAmount       : number;
  }

  export interface RegisterEventData {
    idUser          : number;
    idEvent         : number;
  }

  export interface GetEventData {
    id              : number;
  }

  export interface UpdateEventData {
    id              : number;
    name            : string;
    type            : string;
    startDate       : Date;
    endDate         : Date;
    startAmount     : number;
    endAmount       : number;
  }

  export interface  GetEventsData {
    isClosed        : boolean;
  }
}

declare module mkevent {
  module EndEvent {
    export interface Params {
      id: number;
      endAmount: number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }

  module StartEvent {
    export interface Params {
      id: number;
      startAmount : number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }
}
