
const SCROLL_LINE_COUNT = 1;

const SCROLL_HORIZONTAL_PIXELS = 5;

const actions = [
  { keyCombination: 'h', command: 'cmd_scrollLeft' },
  { keyCombination: 'j', command: 'cmd_scrollLineDown' },
  { keyCombination: 'k', command: 'cmd_scrollLineUp' },
  { keyCombination: 'l', command: 'cmd_scrollRight' },
  { keyCombination: 'G', command: 'cmd_scrollFileBottom' },
  { keyCombination: 'gg', command: 'cmd_scrollFileTop' },
  /*
  {keyCombination: 'H', command: 'cmd_scrollScreenTop'},
  {keyCombination: 'M', command: 'cmd_scrollScreenMiddle'},
  {keyCombination: 'L', command: 'cmd_scrollScreenBottom'},
  */
];

const commands = {
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
  cmd_scrollFileTop: function() {
    window.scrollTo(window.scrollX, 0);
  }
};

//Store the longest action combination's length as the max length
const maxCombinationLength = actions.reduce((acc, curr) => Math.max(curr.keyCombination.length, acc), 0);
const numbers = [];
let repetition = "";
let keyCombination = "";

//Stringify numbers
for (let i = 0; i < 10; ++i) {
  numbers.push(`${i}`);
}

/**
 * Resets the repetition and key combination histories
 * @method
 */
function resetHistory() {
    repetition = "";
    keyCombination = "";
}

/**
 * Runs a command 
 * @param {string} command
 */
function runCommand(command) {
  const repeat = repetition == "" ? 1 : +repetition;

  for (let i = 0; i < repeat; ++i) {
    commands[command]();
  }

  resetHistory();
}

document.addEventListener("keypress", event => {
  // TODO: bail if unsupported modifiers

  //Check if a number key is pressed (for repetition)
  if (numbers.includes(event.key)) {
    repetition += event.key;
    return;
  }

  //Store the key
  keyCombination += event.key;

  // see if the key combination matches one of our vim command combinations
  const action = actions.find(value => value.keyCombination == keyCombination);
  
  // bail if not supported action
  if (!action) {
    //If the combination length is reached the max length, there are no possible actions left.
    if (keyCombination.length == maxCombinationLength) resetHistory();
    return;
  };

  // bail if in contenteditable elements, textareas, inputs, etc
  const contentEditable = event.target.getAttribute('contenteditable');
  const formElements = ['input', 'textarea', 'select'];
  const isFormElement = formElements.indexOf(event.target.tagName.toLowerCase()) != -1;

  if (contentEditable || isFormElement) {
    resetHistory();
    return;
  };

  runCommand(action.command);
}, false);