class Event implements mkevent.Event {
  public static COLUMNS_DB = ["id", "type", "startDate", "endDate", "startAmount", "endAmount"];
  public  id              : number;
  public  name            : string;
  public  type            : string;
  public  startDate       : Date;
  public  endDate         : Date;
  public  startAmount     : number;
  public  endAmount       : number;

  constructor(row: any) {
    this.id           = Number(row.id);
    this.name         = row.name;
    this.type         = row.type;
    this.startDate    = row.startDate;
    this.endDate      = row.endDate;
    this.startAmount  = Number(row.startAmount) || 0.00;
    this.endAmount    = Number(row.endAmount) || 0.00;
  }
}

export = Event;