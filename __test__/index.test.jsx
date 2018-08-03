import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import MultiSelect from '../src';

configure({ adapter: new Adapter() });

test('MultiSelect does not change list of selected and fixed options after term changed', () => {
  const options = [{
    label: 'group',
    children: [{
      value: 1,
      label: 'option',
    }, {
      value: 2,
      label: 'option 2',
    }],
  }, {
    value: 3,
    label: 'option 3',
  }];

  const select = shallow(
    <MultiSelect value={[3]} options={options} fixed={[1]} />
  );

  expect(shallowToJson(select)).toMatchSnapshot();

  select.find('input').simulate('change', {
    currentTarget: {
      value: 'text',
    },
    preventDefault() {},
  });

  expect(shallowToJson(select)).toMatchSnapshot();
});
