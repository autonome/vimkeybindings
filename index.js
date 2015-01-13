var utils = require('sdk/window/utils');

var actions = [
  {key: 'h', command: 'cmd_scrollLeft'},
  {key: 'j', command: 'cmd_scrollLineDown'},
  {key: 'k', command: 'cmd_scrollLineUp'},
  {key: 'l', command: 'cmd_scrollRight'},
  {key: 'g', command: 'cmd_scrollTop'},
  {key: 'G', command: 'cmd_scrollBottom'}
];

function currentAndFutureWindows(func) {
  var windows = require('sdk/windows').browserWindows,
      { viewFor } = require("sdk/view/core");
  for (let window of windows) {
    func(viewFor(window));
  }
  windows.on('open', function(window) {
    func(viewFor(window));
  });
}
  
function onWindow(window) {
  window.gBrowser.addEventListener("keypress", function(event) {
    var action = actions.find(function(value) {
      return value.key == event.key;
    });

    if (action) {
      runCommand(action.command);
    }
  }, false);
}

function runCommand(cmd) {
  var window = utils.getMostRecentBrowserWindow();
  var controller = window.document.commandDispatcher.getControllerForCommand(cmd);
  controller.doCommand(cmd);
}

currentAndFutureWindows(onWindow);
