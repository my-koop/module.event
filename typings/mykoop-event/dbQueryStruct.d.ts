declare module EventDbQueryStruct {
  export interface EventData {
    name			      : string;
  	type            : string;
  	startDate       : Date;
  	endDate         : Date;
  	startAmount     : number;
  	endAmount       : number;
  }
}