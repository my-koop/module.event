class Event implements mkevent.Event {
  public static COLUMNS_DB = ["id", "type", "startDate", "endDate", "startAmount", "endAmount"];
  public  id              : number;
  public  type            : string;
  public  startDate       : Date;
  public  endDate         : Date;
  public  startAmount     : number;
  public  endAmount       : number;

  constructor(row: any) {
    this.id           = Number(row.id);
    this.type         = row.type;
    this.startDate    = Date(row.startDate);
    this.endDate      = Date(row.endDate);
    this.startAmount  = Number(row.startAmount) || 0.00;
    this.endAmount    = Number(row.endAmount) || 0.00;
  }

  public EventTypeEnum = {
    workshop: "workshop",
    cashier: "cashier"
  };
}


export = Event;
