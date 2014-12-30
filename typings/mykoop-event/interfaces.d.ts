declare module mkevent {
  export interface NewEvent {
    name: string;
    type: string;
    startDate: Date;
    description: string;
  }
  export interface UpdateEvent extends NewEvent {
    id: number;
    endDate: Date;
    startAmount: number;
    endAmount: number;
  }

  export interface Event extends UpdateEvent {
    countRegistered: number;
    noteCount?: number;
  }

  module AddEvent {
    export interface Params extends NewEvent {}
    export interface Result {
      id: number;
    }
    export interface Callback {
      (err: Error, res?: Result): void;
    }
  }

  module GetPublicEvents {
    export interface Params {
      idUser?: number;
    }
    export interface Result {
      events: {
        idEvent: number;
        name: string;
        description: string;
        startDate: Date;
        registered: number;
      }[];
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
    export interface Params extends UpdateEvent {}
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

  module UnregisterToEvent {
    export interface Params {
      idUser: number;
      idEvent: number;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }

  module GetRegisteredUsers {
    export interface Params {
      // event id
      id: number;
    }
    export interface Result {
      users: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
      }[];
    }
    export interface Callback {
      (err: Error, result?: Result): void;
    }
  }
}
