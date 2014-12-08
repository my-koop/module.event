var React = require("react");

var BSCol = require("react-bootstrap/Col");
var BSRow = require("react-bootstrap/Row");
var BSButton = require("react-bootstrap/Button");
var BSOverlayTrigger = require("react-bootstrap/OverlayTrigger");
var BSPopover = require("react-bootstrap/Popover");
var BSPanel = require("react-bootstrap/Panel");

var ReactCalendar = require('react-calendar');
var Calendar = ReactCalendar.Calendar;
var Month = ReactCalendar.Month;
var Week = ReactCalendar.Week;
var Day = ReactCalendar.Day;

var MKIcon = require("mykoop-core/components/Icon");
var MKTableSorter = require("mykoop-core/components/TableSorter");
var MKListModButtons = require("mykoop-core/components/ListModButtons");

var localSession = require("session").local;
var language = require("language");
var __ = language.__;
var formatDate = language.formatDate;
var actions = require("actions");
var moment = require("moment");

var EventsPublic = React.createClass({
  getInitialState: function() {
    return {
      events: [],
      selectedDate: null,
      selectedEvents: null
    }
  },

  componentWillMount: function() {
    var self = this;

    actions.event.public({
      i18nErrors: {},
      alertErrors: true,
      data: {isClosed : false}
    }, function (err, res) {
      if (err) {
        return;
      }

      var events = res.events;
      _.forEach(events, function(event) {
        event.startDate = new Date(event.startDate);
      });

      self.setState({events: events});
    });
  },

  blurPopoverIfRequired: function(e) {
    for (
      var element = e.target;
      element != document.body;
      element = element.parentNode
    ) {
      if (element.classList && element.classList.contains("event-popover")) {
        // Inside, so don't blur.
        return;
      }
    }

    // Outside, so blur.
    this.setState({
      selectedDate: null,
      selectedEvents: null
    });
  },

  componentDidMount: function() {
    document.body.addEventListener(
      "click",
      this.blurPopoverIfRequired,
      // MDN recommends explicting useCapture even if optional for better
      // compatibility with older browsers.
      false
    );
  },

  componentWillUnmount: function() {
    document.body.removeEventListener(
      "click",
      this.blurPopoverIfRequired,
      false
    );
  },

  register: function(event) {
    var self = this;
    var id = localSession.user.id;
    actions.event.register({
      i18nErrors: {},
      alertErrors: true,
      data: {
        idUser: id,
        idEvent: event.idEvent
      }
    }, function(err, res) {
      if(!err) {
        event.registered = 1;
        self.setState({
          events: self.state.events
        });
      }
    });
  },

  unregister: function(event) {
    var self = this;
    var id = localSession.user.id;
    actions.event.unregister({
      i18nErrors: {},
      alertErrors: true,
      data: {
        idUser: id,
        idEvent: event.idEvent
      }
    }, function(err, res) {
      if(!err) {
        event.registered = 0;
        self.setState({
          events: self.state.events
        });
      }
    });
  },

  render: function() {
    var self = this;
    var userId = localSession.user && localSession.user.id || null;
    var eventTriggers = _(this.state.events)
      .groupBy(function(event) {
        var startDate = moment(event.startDate);
        return startDate.year() + "-" + startDate.dayOfYear();
      })
      .map(function(eventList, key) {
        var thisDate = eventList[0].startDate;
        function onSelect(day, moment, e) {
          if(self.state.selectedDate === thisDate) {
            return self.setState({
              selectedDate: null,
              selectedEvents: null
            });
          }
          var elem = e.target;
          while(elem.tagName !== "DIV") {
            elem = elem.parentElement;
          }
          var rect = elem.getBoundingClientRect();
          return self.setState({
            selectedDate: thisDate,
            selectedEvents: eventList,
            popoverLeft: rect.left + rect.width/2,
            popoverTop: rect.bottom
          }, function() {
            self.refs.trigger.show();
          });
        }
        return (
          <Day
            key="key"
            date={moment(thisDate)}
            onClick={onSelect}
            classes={{"calendar-event": true}}
          />
        );
      })
      .value();

    if(this.state.selectedDate) {
      var eventList = _(this.state.selectedEvents)
        .sortBy("startDate")
        .map(function(event) {

          return (
            <BSPanel>
              <BSRow key="title">
                <BSCol xs={12}>
                  <strong>{event.name}</strong>
                  <span className="pull-right">
                    {formatDate(event.startDate, "LT")}
                  </span>
                </BSCol>
              </BSRow>
              <BSRow key="description" className="top-margin-7">
                <BSCol xs={12}>{event.description}</BSCol>
              </BSRow>
              {userId !== null ?
                <BSRow key="register" className="top-margin-10">
                  <BSCol xs={12}>
                    {!event.registered ?
                      <BSButton
                        block
                        bsStyle="success"
                        onClick={_.partial(self.register, event)}
                      >
                        <MKIcon glyph="check" fixedWidth />
                        {" "}
                        {__("event::register")}
                      </BSButton>
                    : <BSButton
                        block
                        bsStyle="danger"
                        onClick={_.partial(self.unregister, event)}
                      >
                        <MKIcon glyph="close" fixedWidth />
                        {" "}
                        {__("event::unregister")}
                      </BSButton>
                    }
                  </BSCol>
                </BSRow>
              : null}
            </BSPanel>
          );
        }
      );
      var overlay = (
        <BSPopover
          title={__("event::eventList")}
          placement="bottom"
          className="event-popover"
        >
          {eventList}
        </BSPopover>
      );
      var overlayTrigger = (
        <BSOverlayTrigger
          overlay={overlay}
          trigger="manual"
          ref="trigger"
          placement="bottom"
        >
          <span
            style={{
              position: "absolute",
              left: this.state.popoverLeft,
              top: this.state.popoverTop + document.body.scrollTop
            }}
          ></span>
        </BSOverlayTrigger>
      );
    }

    return (
      <div className="calendar">
        <Calendar
          date={moment()}
          size={12}
          firstMonth={moment().month() + 1}
          weekNumbers={true}
        >
          <Day date={moment()}
               modifiers={{current: true}} />
          {eventTriggers}
        </Calendar>
        {overlayTrigger}
      </div>
    );
  }
});

module.exports = EventsPublic;
