declare module EventDbQueryStruct {

  export interface EventData {
	type            : string;
	startDate       : Date;
	endDate         : Date;
	startAmount     : number;
	endAmount       : number;
  }
}