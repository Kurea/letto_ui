export const SUPPORTED_TYPES = ['workflow', 'expression', 'operation'] // workflow is a handle, expression is a category of supported values and operation a category of functions
export const SUPPORTED_CATEGORY_TYPES = {
  'expression': ['value', 'array', 'hash'],
  'operation': ['api_call', 'boolean', 'compare', 'convert', 'extract', 'map', 'min', 'replace_pattern', 'sum']
}
export const NAME_FROM_TYPE = {
  'workflow': 'type',
  'expression': 'value_type',
  'operation': 'function'
}
export const EXPECTED_HANDLE_ARGS = {
  'workflow': {
    'type': 'workflow',
    'inputs': ['name', 'condition', 'action']
  }, // name is an inputfield, no output
  'value': {
    'type': 'expression',
    'name_arg': 'value_type',
    'inputs': ['value']
  }, // value is an inputfield
  'array': {
    'type': 'expression',
    'name_arg': 'value_type',
    'inputs': ['value']
  },
  'hash': {
    'type': 'expression',
    'name_arg': 'value_type',
    'inputs': ['value']
  },
  'api_call': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['verb', 'target', 'payload']
  },
  'boolean': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['operation', 'values']
  },
  'compare': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['value1', 'value2', 'operation']
  },
  'convert': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['value', 'target_type']
  },
  'extract': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['path', 'data']
  },
  'map': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['mapping_table', 'values']
  },
  'min': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['values']
  },
  'replace_pattern': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['source', 'pattern_type', 'pattern', 'replacement']
  },
  'sum': {
    'type': 'operation',
    'name_arg': 'function',
    'inputs': ['values']
  }
}
export const WF = {
  'name': 'setDueDateOnLabelChange',
  'type': 'workflow',
  'condition': {
    'type': 'operation',
    'function': 'boolean',
    'arguments': {
      'operation': {
        'type': 'expression',
        'value_type': 'value',
        'value': 'or'
      },
      'values': {
        'type': 'expression',
        'value_type': 'array',
        'value': [
          {
            'type': 'operation',
            'function': 'compare',
            'arguments': {
              'value1': {
                'type': 'expression',
                'value_type': 'value',
                'value': '{{ model.id }}'
              },
              'value2': {
                'type': 'expression',
                'value_type': 'value',
                'value': '57af3d3bf86d0a23b57b3ace'
              },
              'operation': {
                'type': 'expression',
                'value_type': 'value',
                'value': 'equality'
              }
            }
          },
          {
            'type': 'operation',
            'function': 'compare',
            'arguments': {
              'value1': {
                'type': 'expression',
                'value_type': 'value',
                'value': '{{ action.type }}'
              },
              'value2': {
                'type': 'expression',
                'value_type': 'array',
                'value': [
                  {
                    'type': 'expression',
                    'value_type': 'value',
                    'value': 'addLabelToCard'
                  },
                  {
                    'type': 'expression',
                    'value_type': 'value',
                    'value': 'commentCard'
                  }
                ]
              },
              'operation': {
                'type': 'expression',
                'value_type': 'value',
                'value': 'inclusion'
              }
            }
          }
        ]
      }
    }
  },
  'action': {
    'type': 'operation',
    'function': 'api_call',
    'arguments': {
      'verb': {
        'type': 'expression',
        'value_type': 'value',
        'value': 'PUT'
      },
      'target': {
        'type': 'expression',
        'value_type': 'value',
        'value': '/cards/{{ action.data.card.id }}'
      },
      'payload': {
        'type': 'expression',
        'value_type': 'hash',
        'value': {
          'due': {
            'type': 'operation',
            'function': 'sum',
            'arguments': {
              'values': {
                'type': 'expression',
                'value_type': 'array',
                'value': [
                  {
                    'type': 'operation',
                    'function': 'convert',
                    'arguments': {
                      'value': {
                        'type': 'expression',
                        'value_type': 'value',
                        'value': '{{ action.date }}'
                      },
                      'target_type': {
                        'type': 'expression',
                        'value_type': 'value',
                        'value': 'DateTime'
                      }
                    }
                  },
                  {
                    'type': 'operation',
                    'function': 'min',
                    'arguments': {
                      'values': {
                        'type': 'expression',
                        'value_type': 'array',
                        'value': [
                          {
                            'type': 'operation',
                            'function': 'map',
                            'arguments': {
                              'mapping_table': {
                                'type': 'expression',
                                'value_type': 'hash',
                                'value': {
                                  'active contact': {
                                    'type': 'expression',
                                    'value_type': 'value',
                                    'value': 30
                                  },
                                  'passive contact': {
                                    'type': 'expression',
                                    'value_type': 'value',
                                    'value': 60
                                  },
                                  'Action to take': {
                                    'type': 'expression',
                                    'value_type': 'value',
                                    'value': 7
                                  }
                                }
                              },
                              'values': {
                                'type': 'operation',
                                'function': 'extract',
                                'arguments': {
                                  'path': {
                                    'type': 'expression',
                                    'value_type': 'value',
                                    'value': 'name'
                                  },
                                  'data': {
                                    'type': 'operation',
                                    'function': 'api_call',
                                    'arguments': {
                                      'verb': {
                                        'type': 'expression',
                                        'value_type': 'value',
                                        'value': 'GET'
                                      },
                                      'target': {
                                        'type': 'expression',
                                        'value_type': 'value',
                                        'value': '/cards/{{ action.data.card.id }}/labels'
                                      },
                                      'payload': null
                                    }
                                  }
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
}
