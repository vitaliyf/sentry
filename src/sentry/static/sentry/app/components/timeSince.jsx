import React from "react";
import moment from "moment";

var TimeSince = React.createClass({
  propTypes: {
    date: React.PropTypes.any.isRequired,
    suffix: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      suffix: 'ago'
    };
  },

  componentDidMount() {
    var delay = 2600;

    this.ticker = setInterval(this.ensureValidity, delay);
  },

  componentWillUnmount() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  },

  ensureValidity() {
    // TODO(dcramer): this should ensure we actually *need* to update the value
    this.forceUpdate();
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.date !== nextProps.date;
  },

  render() {
    var date = this.props.date;

    if (typeof date === "string" || typeof date === "number") {
      date = new Date(date);
    }

    return (
      <time
        dateTime={date.toISOString()}
        title={date.toString()}>{moment(date).fromNow(true)} {this.props.suffix || ''}</time>
    );
  }
});

export default TimeSince;

