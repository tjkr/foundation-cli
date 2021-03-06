#!/usr/bin/env node

var nopt       = require('nopt');
var update     = require('update-notifier');
var pkg        = require('../package.json');
var foundation = require('../lib/foundationCLI');

// Options that can be passed to commands
// new --libsass will switch to the libsass compiler
// new --version x.x.x will specify a version of Foundation for Apps to use
// --version will show the version of the CLI
var options = {
  "libsass": Boolean,
  "version": String
}
// -v is a shorthand for --version
var shorthands = {
  "v": "version"
}
var parsed = nopt(options);
// cmd.args contains basic commands like "new" and "help"
// cmd.opts contains options, like --libsass and --version
var cmd = {
  args: parsed.argv.remain,
  opts: parsed
}

// Check for updates once a day
var notifier = update({
  packageName: pkg.name,
  packageVersion: pkg.version
});
notifier.notify();

// No other arguments given
if (typeof cmd.args[0] === 'undefined') {
  // If -v or --version was passed, show the version of the CLI
  if (typeof cmd.opts.version !== 'undefined') {
    process.stdout.write("Foundation CLI version " + require('../package.json').version + '\n');
  }
  // Otherwise, just show the help screen
  else {
    foundation.help();
  }
}
// Arguments given
else {
  // If the command typed in doesn't exist, show the help screen
  if (typeof foundation[cmd.args[0]] == 'undefined') {
    foundation.help();
  }
  // Otherwise, just run it already!
  else {
    // Every command function is passed secondary commands, and options
    // So if the user types "foundation new myApp --libsass", "myApp" is a secondary command,
    // and "--libsass" is an option
    foundation[cmd.args[0]](cmd.args.slice(1), cmd.opts);
  }
}