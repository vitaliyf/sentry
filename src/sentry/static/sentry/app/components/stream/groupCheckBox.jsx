import React from "react";
import Reflux from "reflux";

import SelectedGroupStore from "../../stores/selectedGroupStore";

var GroupCheckBox = React.createClass({
  mixins: [
    Reflux.listenTo(SelectedGroupStore, "onSelectedGroupChange")
  ],

  propTypes: {
    id: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      isSelected: SelectedGroupStore.isSelected(this.props.id)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.id != this.props.id) {
      this.setState({
        isSelected: SelectedGroupStore.isSelected(nextProps.id)
      });
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.isSelected !== this.state.isSelected);
  },

  onSelectedGroupChange() {
    var isSelected = SelectedGroupStore.isSelected(this.props.id);
    if (isSelected !== this.state.isSelected) {
      this.setState({
        isSelected: isSelected,
      });
    }
  },

  onSelect() {
    var id = this.props.id;
    SelectedGroupStore.toggleSelect(id);
  },

  render() {
    return (
      <input type="checkbox" className="chk-select" value={this.props.id}
             checked={this.state.isSelected}
             onChange={this.onSelect} />
    );
  }
});

export default GroupCheckBox;
