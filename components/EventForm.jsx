var React = require("react/addons");

var BSInput = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");

var MKDateTimePicker = require("mykoop-core/components/DateTimePicker");
var MKAlertTrigger   = require("mykoop-core/components/AlertTrigger");

var actions    = require("actions");
var _          = require("lodash");
var __         = require("language").__;
var formatDate = require("language").formatDate;

var EventEditState = require("../lib/common/EventEditState");

var EventForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    id : React.PropTypes.number
  },

  getEvent: function() {
    return {
      name        : this.state.name,
      type        : this.state.type,
      startDate   : this.state.startDate,
      endDate     : this.state.endDate,
      startAmount : this.state.startAmount,
      endAmount   : this.state.endAmount
    }
  },

  getInitialState: function() {
    return {
      id: null,
      type: "cashier",
      name: "",
      startDate: null,
      endDate: null,
      startAmount: null,
      endAmount: null,

      editState: EventEditState.Created
    }
  },

  componentWillMount: function() {
    if(_.isNumber(this.props.id) && !isNaN(this.props.id)){
      this.getEventFromDb();
    }
  },

  getEventFromDb: function() {
    var self = this;
    actions.event.get({
      data: {
        id : this.props.id
      }
    }, function (err, res) {
      if (err) {
        MKAlertTrigger.showAlert(__("errors::error", {context: err.context}));
        console.error(err);
        return;
      }
      res.startDate = res.startDate ? new Date(res.startDate) : null;
      res.endDate = res.endDate ? new Date(res.endDate) : null;
      if(res.startDate && isNaN(res.startDate.getTime())) {
        res.startDate = null;
      }
      if(res.endDate && isNaN(res.endDate.getTime())) {
        res.endDate = null;
      }

      var editState = EventEditState.evaluateState(res);
      self.setState(_.merge(res, {editState: editState}));
    });
  },

  render: function () {
    var self = this;
    var others = _.omit(this.props, _.keys(this.propTypes));

    return (
      <div {...others} >
        <BSInput
          type="text"
          label={__("name")}
          valueLink={self.linkState("name")}
        />
        <BSInput
          type="select"
          label={__("event::type")}
          valueLink={self.linkState("type")}
        >
          <option value="workshop">{__("event::workshop")}</option>
          <option value="cashier">{__("event::cashier")}</option>
        </BSInput>
        <label htmlFor="startDatePicker">
          {__("event::startDate")}
        </label>
        <MKDateTimePicker
          id="startDatePicker"
          value={this.state.startDate}
          max={this.state.endDate || undefined}
          onChange={function(date, str) {
            self.setState({
              startDate: date
            });
          }}
        />
        {this.state.editState >= EventEditState.Started ?
          <BSInput
            type="number"
            label={__("event::startAmount")}
            valueLink={this.linkState("startAmount")}
          />
        : <BSButton
            bsStyle="primary"
            key="startEventButton"
            onClick={function() {
              self.setState({editState: EventEditState.Started});
            }}
          >
            {__("event::startEvent")}
          </BSButton>
        }
        {this.state.editState >= EventEditState.Ended ? [
          <label htmlFor="endDatePicker">
            {__("event::endDate")}
          </label>,
          <MKDateTimePicker
            id="endDatePicker"
            value={this.state.endDate}
            min={this.state.startDate || undefined}
            onChange={function(date, str) {
              self.setState({
                endDate: date
              });
            }}
          />,
          <BSInput
            type="number"
            label={__("event::endAmount")}
            valueLink={this.linkState("endAmount")}
          />
        ]: this.state.editState === (EventEditState.Ended - 1) ?
          <BSButton
            bsStyle="primary"
            key="endEventButton"
            onClick={function() {
              self.setState({editState: EventEditState.Ended});
            }}
          >
            {__("event::endEvent")}
          </BSButton>
        : null
        }
      </div>
    );
  }
});

module.exports = EventForm;
