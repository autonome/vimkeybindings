
const SCROLL_LINE_COUNT = 1;

const SCROLL_HORIZONTAL_PIXELS = 5;

var actions = [
  {key: 'h', command: 'cmd_scrollLeft'},
  {key: 'j', command: 'cmd_scrollLineDown'},
  {key: 'k', command: 'cmd_scrollLineUp'},
  {key: 'l', command: 'cmd_scrollRight'},
  {key: 'G', command: 'cmd_scrollFileBottom'},
  /*
  {key: 'gg', command: 'cmd_scrollFileTop'},
  {key: 'H', command: 'cmd_scrollScreenTop'},
  {key: 'M', command: 'cmd_scrollScreenMiddle'},
  {key: 'L', command: 'cmd_scrollScreenBottom'}
  */
];

var commands = {
  cmd_scrollLeft: function() {
    document.body.scrollLeft -= SCROLL_HORIZONTAL_PIXELS;
  },
  cmd_scrollRight: function() {
    document.body.scrollLeft += SCROLL_HORIZONTAL_PIXELS;
  },
  cmd_scrollLineDown: function() {
    window.scrollByLines(SCROLL_LINE_COUNT);
  },
  cmd_scrollLineUp: function() {
    window.scrollByLines(-SCROLL_LINE_COUNT);
  },
  cmd_scrollFileBottom: function() {
    window.scrollTo(window.scrollX, document.body.scrollHeight);
  },
  /*
  cmd_scrollFileTop: function() {
    window.scrollTo(window.scrollX, 0);
  }
  */
};

document.addEventListener("keypress", function(event) {
  // TODO: bail if unsupported modifiers

  // TODO: support multichar comments, eg "gg"


  // see if the key matches one of our vim command keys
  var action = actions.find(function(value) {
    return value.key == event.key;
  });
  
  // bail if not supported action
  if (!action) {
    return;
  }

  // bail if in contenteditable elements, textareas, inputs, etc
  var contentEditable = event.target.getAttribute('contenteditable');
  if (contentEditable) {
    return;
  }

  commands[action.command]();
}, false);
