#!/usr/bin/env node

var argv = require('yargs/yargs')(process.argv.slice(2))
             .usage('Usage: $0 <command> [options]')
             .alias('u', 'url')
             .nargs('u', 1)
             .describe('u', 'url to check for version')
             .demandOption(['u'])
             .alias('p', 'prefix')
             .nargs('p', 1)
             .describe('p', 'prefix of filename to check for, eg: u-boot\n for u-boot-2021.10.tar.bz2')
             .demandOption(['p'])
             .alias('e', 'ending')
             .nargs('e', 1)
             .describe('e', 'ending of filename to check for, eg: .tar.bz2\n for u-boot-2021.10.tar.bz2')
             .demandOption(['e'])
             .alias('b', 'brief')
             .describe('b', 'only output version number found')
             .help('h')
             .alias('h', 'help')
             .argv;
var compose = require('request-compose')
var Request = compose.Request
var Response = compose.Response
const cheerio = require('cheerio');
require('pro-array');
var vlist = new Array();

if (!argv.brief) {
  console.log('checking: ', argv.url);
}

;(async () => {
  try {
    var {res, body} = await compose(
      Request.defaults({headers: {'user-agent': 'request-compose'}}),
      Request.url(argv.url),
      Request.send(),
      Response.buffer(),
      Response.string(),
      Response.parse(),
    )()
    if (!argv.brief) {
      console.log(res.statusCode, res.statusMessage)
      console.log(res.headers['x-ratelimit-remaining'])
    }
  }
  catch (err) {
    console.error(err)
    process.exit(1);
  }

  var $ = cheerio.load(body);
  // get link texts
  $('a').each(function(i, element){
    var a = $(this).prev();
    var txt = a.text();
    if (txt.startsWith(argv.prefix) && txt.indexOf('-rc') == -1 && txt.endsWith(argv.ending)) {
      vlist.push(txt);
    }
  });
  if (vlist.length) {
    vlist.natsort();
    var ver = vlist.pop();
    // create version variable with prefix and ending striped, strip first char if no a number
    var aver = ver.slice(argv.prefix.length, ver.length - argv.ending.length)
    if (isNaN(aver.charAt(0))) {
      aver = aver.slice(1,aver.length);
    }
    // strip end to first number
    var i = aver.length;
    aslice = 0;
    while (i--) {
      if(! isNaN(aver.charAt(i))) {
        break;
      } else {
        aslice = i;
      }
    }
    if (aslice) {
      aver = aver.slice(0, aslice);
    }
    // print out the version
    if (argv.brief) {
      console.log(aver);
    } else {
      console.log('latest version from: ',ver);
      console.log('is: ', aver);
    }
  }
})()
