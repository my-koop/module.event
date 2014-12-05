declare module mkevent {
  export interface Event {
    id: number;
    name: string;
    type: string;
    startDate: Date;
    endDate: Date;
    startAmount: number;
    endAmount: number;
  }

  module AddEvent {
    export interface Params {
      name: string;
      type: string;
      startDate: Date;
    }
    export interface Result {
      id: number;
    }
    export interface Callback {
      (err: Error, res?: Result): void;
    }
  }

  // All events
  module GetEvents {
    export interface Params {
      isClosed?: boolean;
      startedOnly?: boolean;
    }
    export interface Result {
      events: Event[];
    }
    export interface Callback {
      (err: Error, res?: Result): void;
    }
  }

  // one event
  module GetEvent {
    export interface Params {
      id: number;
    }
    export interface Result extends Event {}
    export interface Callback {
      (err: Error, res?: Result): void;
    }
  }

  module UpdateEvent {
    export interface Params extends Event {}
    export interface Callback {
      (err?: Error): void;
    }
  }

  module DeleteEvent {
    export interface Params {
      id: number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }

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
      startAmount: number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }

  module RegisterToEvent {
    export interface Params {
      idUser: number;
      idEvent: number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }
}
