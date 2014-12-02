var React             = require("react/addons");
var BSInput           = require("react-bootstrap/Input");
var MKDateTimePicker  = require("mykoop-core/components/DateTimePicker");
var MKAlertTrigger    = require("mykoop-core/components/AlertTrigger");
var actions           = require("actions");
var _                 = require("lodash");
var __                = require("language").__;
var formatDate        = require("language").formatDate;

var EventEditForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    id : React.PropTypes.number
  },

  getEvent: function() {
    return {
      name        : this.state.name,
      type        : this.state.type,
      startDate   : this.state.startDate ? this.state.startDate.toISOString() : "",
      endDate     : this.state.endDate ? this.state.endDate.toISOString() : "",
      startAmount : this.state.startAmount,
      endAmount   : this.state.endAmount
    }
  },

  getInitialState: function() {
    return {
      eventObj: null,
      id: null,
      type: "cashier"
    }
  },

  componentWillMount: function() {
    if(this.props.id != null){
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
      res.startDate = new Date(res.startDate);
      res.endDate = res.endDate ? new Date(res.endDate) : null;
      self.setState(res);
    });
  },

  isDate: function(date){
    var d = date ? new Date(date) : null;

    if ( Object.prototype.toString.call(d) === "[object Date]" && !(isNaN(d.getTime()))){
      return true;
    }

    return false;
  },

  isValidForm: function(){
    var self = this;
    var event = self.getEvent();
    var isValidForm = self.isDate(event.startDate) && (!event.endDate || self.isDate(event.endDate));

    if(event.startAmount && !event.startDate){
      isValidForm = false;
    }

    if((!event.endAmount && event.endDate) || (event.endAmount && !event.endDate)){
      isValidForm = false;
    }

    return isValidForm;
  },

  render: function () {
    var self = this;
    var others = _.omit(this.props, 'event');

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
        <label>
          {__("event::startDate")}
          <MKDateTimePicker
            value={this.state.startDate}
            onChange={function(date, str) {
              self.setState({
                startDate: date
              });
            }}
          />
        </label>
        <label>
          {__("event::endDate")}
          <MKDateTimePicker
            value={this.state.endDate}
            onChange={function(date, str) {
              self.setState({
                endDate: date
              });
            }}
          />
        </label>
        <BSInput
          type="number"
          label={__("event::startAmount")}
          valueLink={this.linkState("startAmount")}
        />
        <BSInput
          type="number"
          label={__("event::endAmount")}
          valueLink={this.linkState("endAmount")}
        />
      </div>
    );
  }
});

module.exports = EventEditForm;
