class Event implements mkevent.Event {
  public static COLUMNS_DB = ["idEvent", "name", "type", "startDate", "endDate", "startAmount", "endAmount"];
  public  id                  : number;
  public  name                : string;
  public  type                : string;
  public  startDate           : Date;
  public  endDate             : Date;
  public  startAmount         : number;
  public  endAmount           : number;
  public  countRegistered     : number;

  constructor(row: any) {
    this.id                  = Number(row.idEvent);
    this.name                = row.name;
    this.type                = row.type;
    this.startDate           = row.startDate;
    this.endDate             = row.endDate;
    this.startAmount         = row.startAmount ? Number(row.startAmount) : null;;
    this.endAmount           = row.endAmount ? Number(row.endAmount) : null;
    this.countRegistered     = Number(row.countRegistered) || 0;
  }
}

export = Event;