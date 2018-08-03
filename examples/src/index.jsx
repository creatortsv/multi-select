import React, { Component } from 'react';
import { render} from 'react-dom';
import MultiSelect from '../../src';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      selected: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected, name) {
    this.setState({selected});
  }

  render() {
    const { selected } = this.state;
    const props = {
      name: 'multi-select',
      options: [{
        value: 1,
        label: 'Option 1',
      }, {
        label: 'Group 1',
        children: [{
          label: 'Subgroup of Group 1',
          children: [{
            value: 2,
            label: 'Option 2',
          }, {
            value: 3,
            label: 'Option 3',
          }, {
            value: 4,
            label: 'Option 4',
          }],
        }, {
          value: 4,
          label: 'Option 4',
        }],
      }, {
        value: 3,
        label: 'Option 3',
      }, {
        value: 4,
        label: 'Option 4',
      }],
      value: selected,
      fixed: [1],
    };

    return <MultiSelect {...props} onChange={this.handleChange}/>;
  }
}

render(<App />, document.getElementById('app'));
