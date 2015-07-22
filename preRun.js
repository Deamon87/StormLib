 Module['preRun'] = function() {
   
  var devMinor = 178; //random number
  var devMajor = 0;
  var fileRepository = {
  };

  Module['addFileToRep'] = function(fileName, fileObj) {
    
    var devId = FS.makedev(devMajor++, devMinor);
    var registeredDevice = FS.registerDevice(devId, {
      open: function (stream) {
        var path = NODEFS.realPath(stream.node);
        try {
          if (FS.isFile(stream.node.mode)) {
            stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
      },
      close: function (stream) {
        try {
          if (FS.isFile(stream.node.mode) && stream.nfd) {
            fs.closeSync(stream.nfd);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
      },
      read: function (stream, buffer, offset, length, position) {
        if (length === 0) return 0; // node errors on 0 length reads
        // FIXME this is terrible.
        /*var nbuffer = new Buffer(length);
        var res;
        try {
          res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        if (res > 0) {
          for (var i = 0; i < res; i++) {
            buffer[offset + i] = nbuffer[i];
          }
        }*/
        return res;
      },
      write: function (stream, buffer, offset, length, position) {
        // FIXME this is terrible.
        var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
        var res;
        try {
          res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return res;
      },
      llseek: function (stream, offset, whence) {
        var position = offset;
        if (whence === 1) {  // SEEK_CUR.
          position += stream.position;
        } else if (whence === 2) {  // SEEK_END.
          if (FS.isFile(stream.node.mode)) {
            try {
              var stat = fs.fstatSync(stream.nfd);
              position += stat.size;
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES[e.code]);
            }
          }
        }
      }     
    });
    
    FS.mkdev(fileName, 32768, devId);
  }
  
};