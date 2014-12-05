// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./dbQueryStruct.d.ts" />
/// <reference path="./interfaces.d.ts" />

declare module mkevent {
  export interface Module extends mykoop.IModule {
    addEvent(
      params: mkevent.AddEvent.Params,
      callback: mkevent.AddEvent.Callback
    );
    __addEvent(
      connection: mysql.IConnection,
      params: mkevent.AddEvent.Params,
      callback: mkevent.AddEvent.Callback
    );

    getEvent(
      params: mkevent.GetEvent.Params,
      callback: mkevent.GetEvent.Callback
    );
    __getEvent(
      connection: mysql.IConnection,
      params: mkevent.GetEvent.Params,
      callback: mkevent.GetEvent.Callback
    );

    getEvents(
      params: mkevent.GetEvents.Params,
      callback: mkevent.GetEvents.Callback
    );
    __getEvents(
      connection: mysql.IConnection,
      params: mkevent.GetEvents.Params,
      callback: mkevent.GetEvents.Callback
    );

    updateEvent(
      params: mkevent.UpdateEvent.Params,
      callback: mkevent.UpdateEvent.Callback
    );
    __updateEvent(
      connection: mysql.IConnection,
      params: mkevent.UpdateEvent.Params,
      callback: mkevent.UpdateEvent.Callback
    );

    deleteEvent(
      params : mkevent.DeleteEvent.Params,
      callback: mkevent.DeleteEvent.Callback
    );
    __deleteEvent(
      connection: mysql.IConnection,
      params : mkevent.DeleteEvent.Params,
      callback: mkevent.DeleteEvent.Callback
    );

    registerToEvent(
      params: mkevent.RegisterToEvent.Params,
      callback: mkevent.RegisterToEvent.Callback
    );
    __registerToEvent(
      connection: mysql.IConnection,
      params: mkevent.RegisterToEvent.Params,
      callback: mkevent.RegisterToEvent.Callback
    );

    startEvent(
      params: StartEvent.Params,
      callback: StartEvent.Callback
    );
    __startEvent(
      connection: mysql.IConnection,
      params: StartEvent.Params,
      callback: StartEvent.Callback
    );

    endEvent(
      params: EndEvent.Params,
      callback: EndEvent.Callback
    );
    __endEvent(
      connection: mysql.IConnection,
      params: EndEvent.Params,
      callback: EndEvent.Callback
    );
  }
}
