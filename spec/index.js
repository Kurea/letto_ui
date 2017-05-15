import test from 'ava';
import '../src/index';
import {displayWorkflow, saveWorkflow} from '../src/wf_displayer';
import '../src/api';


test('boolean parse', t => {
  var testval = [{
    param: 'TrUe',
    return: true
  },
  {
    param: '1',
    return: true
  },
  {
    param: 'FaLse',
    return: false
  },
  {
    param: '0',
    return: false
  },
  {
    param: 'truc',
    return: undefined
  }];

  for (let i of testval) {
    t.is(Boolean.parse(i.param), i.return, i.param + ' is not converted to ' + i.return);
  }
});

test('save workflow', t => {
  displayWorkflow();
  var result = saveWorkflow();
  t.snapshot(WF);
});
