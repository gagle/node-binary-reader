"use strict";

var assert = require ("assert");
var br = require ("../lib");
var fs = require ("fs");

var readOriginal = fs.read;
var readCalls = 0;
fs.read = function (){
  readCalls++;
  readOriginal.apply (null, arguments);
};

var openOriginal = fs.open;
var openCalls = 0;
fs.open = function (){
  openCalls++;
  openOriginal.apply (null, arguments);
};

var closeOriginal = fs.close;
var closeCalls = 0;
fs.close = function (){
  closeCalls++;
  closeOriginal.apply (null, arguments);
};

var file = __dirname + "/file";
var empty = __dirname + "/empty";
var small = { highWaterMark: 5 };

var tests = {
  "file size <= buffer size": function (done){
    br.open (file)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 1);
          readCalls = 0;
          done ();
        })
        .read (3, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 3);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2]));
        })
        .read (0, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 0);
          assert.deepEqual (buffer, new Buffer ([]));
        })
        .close ();
  },
  "case 2": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 1);
          readCalls = 0;
          done ();
        })
        .read (3, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 3);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2]));
        })
        .close ();
  },
  "case 2, multiple reads": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 2);
          readCalls = 0;
          done ();
        })
        .read (6, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 6);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2, 3, 4, 5]));
        })
        .close ();
  },
  "case 1": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 1);
          readCalls = 0;
          done ();
        })
        .read (3, function (){})
        .seek (0)
        .read (3, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 3);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2]));
        })
        .close ();
  },
  "case 3": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 2);
          readCalls = 0;
          done ();
        })
        .read (3, function (){})
        .read (3, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 3);
          assert.deepEqual (buffer, new Buffer ([3, 4, 5]));
        })
        .close ();
  },
  "case 3, multiple reads": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 3);
          readCalls = 0;
          done ();
        })
        .read (3, function (){})
        .read (8, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 8);
          assert.deepEqual (buffer, new Buffer ([3, 4, 5, 6, 7, 8, 9, 10]));
        })
        .close ();
  },
  "case 4": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 2);
          readCalls = 0;
          done ();
        })
        .seek (2)
        .read (3, function (){})
        .seek (0)
        .read (4, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 4);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2, 3]));
        })
        .close ();
  },
  "case 4, multiple reads": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 3);
          readCalls = 0;
          done ();
        })
        .seek (7)
        .read (3, function (){})
        .seek (0)
        .read (12, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 12);
          assert.deepEqual (buffer,
              new Buffer ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
        })
        .close ();
  },
  "case 5": function (done){
    br.open (file, small)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 3);
          readCalls = 0;
          done ();
        })
        .seek (3)
        .read (3, function (){})
        .seek (0)
        .read (9, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 9);
          assert.deepEqual (buffer, new Buffer ([0, 1, 2, 3, 4, 5, 6, 7, 8]));
        })
        .close ();
  },
  "case 5, multiple calls": function (done){
    br.open (file, { highWaterMark: 3 })
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (readCalls, 5);
          readCalls = 0;
          done ();
        })
        .seek (6)
        .read (3, function (){})
        .seek (0)
        .read (14, function (bytesRead, buffer){
          assert.strictEqual (bytesRead, 14);
          assert.deepEqual (buffer,
              new Buffer ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]));
        })
        .close ();
  },
  "open, seek, close": function (done){
    openCalls = 0;
    closeCalls = 0;
    br.open (file)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.strictEqual (openCalls, 0);
          assert.strictEqual (readCalls, 0);
          assert.strictEqual (closeCalls, 0);
          readCalls = 0;
          done ();
        })
        .seek (2)
        .close ();
  },
  "asynchronous callback": function (done){
    var n = 0;
    br.open (file)
        .on ("error", assert.ifError)
        .on ("close", done)
        .read (1, function (bytesRead, buffer, cb){
          process.nextTick (function (){
            assert.strictEqual (n++, 0);
            assert.deepEqual (buffer, new Buffer ([0]));
            cb ();
          });
        })
        .read (1, function (bytesRead, buffer){
          assert.strictEqual (n, 1);
          assert.deepEqual (buffer, new Buffer ([1]));
        })
        .close ();
  },
  "cancel": function (done){
    br.open (file)
        .on ("error", assert.ifError)
        .on ("close", function (){
          assert.ok (true);
          done ();
        })
        .read (1, function (bytesRead, buffer, cb){
          var me = this;
          process.nextTick (function (){
            me.cancel ();
          });
        })
        .read (1, function (bytesRead, buffer){
          assert.fail ();
        })
        .close ();
  },
  "cancel with error": function (done){
    br.open (file)
        .on ("error", function (error){
          assert.ok (error);

          br.open (file)
              .on ("error", function (error){
                assert.ok (error);
                done ();
              })
              .on ("close", function (){
                assert.fail ();
              })
              .read (1, function (){
                this.cancel (new Error ());
              })
              .close ();
        })
        .on ("close", function (){
          assert.fail ();
        })
        .seek (10, function (){
          this.cancel (new Error ());
        })
        .close ();
  },
  "directory": function (done){
    br.open (".")
        .on ("error", function (error){
          assert.ok (error);
          done ();
        })
        .on ("close", function (){
          assert.fail ();
        })
        .read (1, function (){})
        .close ();
  },
  "eof": function (done){
    readCalls = 0;
    br.open (file)
        .on ("error", assert.ifError)
        .on ("close", done)
        .seek (0, { end: true }, function (){
          assert.strictEqual (this.size () - 1, this.tell ());
        })
        .seek (999, function (){
          assert.ok (this.isEOF ());
        })
        .read (1, function (bytesRead, buffer){
          assert.strictEqual (readCalls, 0);
          assert.strictEqual (bytesRead, 0);
          assert.strictEqual (buffer.length, 0);
        })
        .close ();
  },
  "empty": function (done){
    br.open (empty)
        .on ("error", assert.ifError)
        .on ("close", done)
        .seek (999, function (){
          assert.ok (this.isEOF ());
        })
        .read (1, function (bytesRead, buffer){
          assert.strictEqual (readCalls, 0);
          assert.strictEqual (bytesRead, 0);
          assert.strictEqual (buffer.length, 0);
        })
        .close ();
  }
};

var keys = Object.keys (tests);
var keysLength = keys.length;

(function again (i){
  if (i<keysLength){
    var fn = tests[keys[i]];
    if (fn.length){
      fn (function (){
        again (i + 1);
      });
    }else{
      fn ();
      again (i + 1);
    }
  }
})(0);
