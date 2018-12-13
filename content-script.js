
const SCROLL_LINE_COUNT = 1;

const SCROLL_HORIZONTAL_PIXELS = 5;

const actions = [
  { keyCombination: 'h', command: 'cmd_scrollLeft' },
  { keyCombination: 'j', command: 'cmd_scrollLineDown' },
  { keyCombination: 'k', command: 'cmd_scrollLineUp' },
  { keyCombination: 'l', command: 'cmd_scrollRight' },
  { keyCombination: 'G', command: 'cmd_scrollFileBottom' },
  { keyCombination: 'gg', command: 'cmd_scrollFileTop' },
  { keyCombination: 'gt', command: 'cmd_activateNextTab' },
  { keyCombination: 'gT', command: 'cmd_activatePreviousTab' },
  /*
  {keyCombination: 'H', command: 'cmd_scrollScreenTop'},
  {keyCombination: 'M', command: 'cmd_scrollScreenMiddle'},
  {keyCombination: 'L', command: 'cmd_scrollScreenBottom'},
  */
];

const commands = {
  cmd_scrollLeft: function(repetition) {
    const repeat = repetition == "" ? 1 : +repetition;

    document.body.scrollLeft -= SCROLL_HORIZONTAL_PIXELS * repeat;
  },
  cmd_scrollRight: function(repetition) {
    const repeat = repetition == "" ? 1 : +repetition;

    document.body.scrollLeft += SCROLL_HORIZONTAL_PIXELS * repeat;
  },
  cmd_scrollLineDown: function(repetition) {
    const repeat = repetition == "" ? 1 : +repetition;

    window.scrollByLines(SCROLL_LINE_COUNT * repeat);
  },
  cmd_scrollLineUp: function(repetition) {
    const repeat = repetition == "" ? 1 : +repetition;

    window.scrollByLines(-SCROLL_LINE_COUNT * repeat);
  },
  cmd_scrollFileBottom: function() {
    window.scrollTo(window.scrollX, document.body.scrollHeight);
  },
  cmd_scrollFileTop: function() {
    window.scrollTo(window.scrollX, 0);
  },
  cmd_activateNextTab: function (repetition) {
    browser.runtime.sendMessage({
      message: {
        to: 'background',
        command: 'activateNextTab',
        repetition,
      }
    });
  },
  cmd_activatePreviousTab: function (repetition) {
    browser.runtime.sendMessage({
      message: {
        command: 'activatePreviousTab',
        repetition,
      }
    });
  }
};

//Store the longest action combination's length as the max length
const maxCombinationLength = actions.reduce((acc, curr) => Math.max(curr.keyCombination.length, acc), 0);
const numbers = [];
const validKeys = new Set();
let repetition = "";
let keyCombination = "";

//Stringify numbers
for (let i = 0; i < 10; ++i) {
  numbers.push(`${i}`);
}

actions.map(action => {
  for (let i = 0; i < action.keyCombination.length; ++i) {
    validKeys.add(action.keyCombination[i]);
  }
});

/**
 * Resets the repetition and key combination histories
 * @method
 */
function resetHistory() {
    repetition = "";
    keyCombination = "";
}

/**
 * Runs an action 
 * @param {VimBindings~action} action
 */
function runAction(action) {
  commands[action.command](repetition);
  resetHistory();
}

document.addEventListener("keypress", event => {
  //Check if a number key is pressed (for repetition)
  if (numbers.includes(event.key)) {
    repetition += event.key;
    return;
  }

  //If a non-command key is pressed, bail
  if (!validKeys.has(event.key)) {
    resetHistory();
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

  runAction(action);
}, false);

/**
 * @typedef VimBindings~action
 * @type {object}
 * @property {string} keyCombination The keystroke combination
 * @property {string} command The name of the command function
 */