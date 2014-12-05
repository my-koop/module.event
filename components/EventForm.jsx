var React = require("react/addons");

var BSInput = require("react-bootstrap/Input");
var BSButton = require("react-bootstrap/Button");

var MKDateTimePicker = require("mykoop-core/components/DateTimePicker");
var MKAlertTrigger   = require("mykoop-core/components/AlertTrigger");

var actions = require("actions");
var _ = require("lodash");
var language = require("language");
var __ = language.__;
var formatDate = language.formatDate;
var getCurrencySymbol = language.getCurrencySymbol;

var EventEditState = require("../lib/common/EventEditState");

var EventForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    id: React.PropTypes.number,
    onWarning: React.PropTypes.func.isRequired
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

  onStartDateChange: function(date, str) {
    this.setState({
      startDate: date
    });
  },

  onEndDateChange: function(date, str) {
    if(!date) {
      this.props.onWarning({key: "event::removeEndDateWarning"}, "warning");
    }
    this.setState({
      endDate: date,
      endAmount: date && this.state.endAmount || "",
      startAmount: this.state.startAmount || date ? this.state.startAmount : "0",
    });
  },

  render: function () {
    var self = this;
    var others = _.omit(this.props, _.keys(this.propTypes));
    var startAmountLink = {
      value: this.state.startAmount,
      requestChange: function(newValue) {
        if(newValue === "" && !self.state.endDate) {
          self.props.onWarning({key: "event::removeStartAmountWarning"}, "warning")
        }
        self.setState({
          startAmount: newValue
        });
      }
    };
    return (
      <div {...others} >
        <BSInput
          type="text"
          label={__("name")}
          valueLink={self.linkState("name")}
          key="name"
        />
        <BSInput
          type="select"
          label={__("event::type")}
          valueLink={self.linkState("type")}
          key="type"
        >
          <option value="workshop">{__("event::workshop")}</option>
          <option value="cashier">{__("event::cashier")}</option>
        </BSInput>
        <label
          htmlFor="startDatePicker"
          key="startDateLabel"
        >
          {__("event::startDate")}
        </label>
        <MKDateTimePicker
          key="startDate"
          id="startDatePicker"
          value={this.state.startDate}
          max={this.state.endDate || undefined}
          onChange={this.onStartDateChange}
        />
        {" "}
        {this.state.editState >= EventEditState.Started ?
          <BSInput
            type="number"
            label={__("event::startAmount")}
            valueLink={startAmountLink}
            addonAfter={getCurrencySymbol()}
            key="startAmount"
          />
        : null}
        {this.state.editState >= EventEditState.Ended ? [
          <label
            htmlFor="endDatePicker"
            key="endDateLabel"
          >
            {__("event::endDate")}
          </label>,
          <MKDateTimePicker
            key="endDate"
            id="endDatePicker"
            value={this.state.endDate}
            min={this.state.startDate || undefined}
            onChange={this.onEndDateChange}
          />,
          <BSInput
            type="number"
            label={__("event::endAmount")}
            valueLink={this.linkState("endAmount")}
            addonAfter={getCurrencySymbol()}
            key="endAmount"
          />
        ]
        : null}
      </div>
    );
  }
});

module.exports = EventForm;
