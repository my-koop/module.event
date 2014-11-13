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

  export interface UpdateEventData {
  	id				      : number;
    name            : string;
    type            : string;
    startDate       : Date;
    endDate         : Date;
    startAmount     : number;
    endAmount       : number;
  }
}