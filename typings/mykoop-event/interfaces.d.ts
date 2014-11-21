declare module EventInterfaces {
  export interface AddEventData {
    name            : string;
    type            : string;
    startDate       : Date;
    endDate         : Date;
    startAmount     : number;
    endAmount       : number;
    isClosed        : boolean;
  }

  export interface RegisterEventData {
    idUser          : number;
    idEvent         : number;
  }

  export interface  GetEventsData {
    isClosed        : boolean;
  }
}
