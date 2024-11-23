export const LIST_PLUGIN_NAME = 'listVariable';

export const COMMANDS = {
  insert: 'new_list_insert',
  get_lists: 'get_lists'
};

export const EVENTS = {
  insert: 'insert_list_placeholder_click',
}

export const ATTRIBUTES = {
  paramName: 'data-param-name',
  iterator: 'data-iterator',
  separator: 'data-separator'
}

export const UI_ELEMENTS = {
  buttons: {
    insert: {
      name: 'insert_list',
      text: 'insert list variable',
    },
  }
};
