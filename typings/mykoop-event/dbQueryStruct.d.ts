declare module EventDbQueryStruct {
  export interface NewEventData {
    name        : string;
    type        : string;
    startDate   : Date;
    description : string;
  }

  export interface EventData extends NewEventData{
    endDate         : Date;
    startAmount     : number;
    endAmount       : number;
  }

  export interface EventUserData {
    idUser          : number;
    idEvent         : number;
  }
}
