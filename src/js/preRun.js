var Module = {};
self.onmessage = function (event) {
    var message = event.data;

    switch(message.action) {
        case 'addFilesToRepository' :
            var fileList = message.fileList;
            for (var i = 0; i < fileList.length; i++) {
                var file = fileList[i];

                Module.addFileToRep(file.name, file.size, file);
            }
            break;


        case 'SFileSetLocale':
        case 'SFileGetLocale':
        case 'SFileOpenArchive':
            /* 1. Function parameters */
            var fileName = message.fileName;
            var priority = message.priority;
            var flags = message.flags;

            /* 2. Bloat code to pass parameters */                                                                                                                      22.
            var hMPQPtr = Module._malloc(4);
            var MPQPtrHeap = new Uint8Array(Module.HEAPU8.buffer, hMPQPtr, 4);

            var fileNameMem = Runtime.stackAlloc((fileName.length << 2) + 1);
            writeStringToMemory(fileName, fileNameMem);


            /* 3. Call funtion */
            var a = Module._SFileOpenArchive(fileNameMem, priority, flags, MPQPtrHeap.byteOffset);

            /* 4. Get function result */
            var callResult;
            if (a) {
                var hMpq = new Uint32Array(MPQPtrHeap.buffer, MPQPtrHeap.byteOffset, 1)[0];
                callResult = {hMpq : hMpq};
            } else {
                var errorCode = Module._GetLastError();
                callResult = { errorCode : errorCode };
            }

            /* 5. Send result */
            callResult.id = message.id;
            callResult.action = 'SFileOpenArchive';

            self.postMessage(callResult);

            break;

        case 'SFileCreateArchive':
        case 'SFileGetArchiveBitmap':
        case 'SFileFlushArchive':
        case 'SFileCloseArchive':

        case 'SFileAddListFile':

        case 'SFileSetCompactCallback':
        case 'SFileCompactArchive':

        case 'SFileGetMaxFileCount':
        case 'SFileSetMaxFileCount':
        case 'SFileGetAttributes':
        case 'SFileSetAttributes':
        case 'SFileUpdateFileAttributes':

        case 'SFileOpenPatchArchive':
        case 'SFileIsPatchedArchive':

        case 'SFileOpenFileEx':
            /* 1. Function parameters */
            var hMPQ = message.hMPQ;
            var fileName = message.fileName;
            var dwSearchScope = message.dwSearchScope;

            /* 2. Bloat code to pass parameters */                                                                                                                      22.
            var hFilePtr = Module._malloc(4);
            var filePtrHeap = new Uint8Array(Module.HEAPU8.buffer, hFilePtr, 4);

            var fileNameMem = Runtime.stackAlloc((fileName.length << 2) + 1);
            writeStringToMemory(fileName, fileNameMem);


            /* 3. Call function */
            var a = Module._SFileOpenFileEx(hMPQ, fileNameMem, dwSearchScope, filePtrHeap.byteOffset);

            /* 4. Get function result */
            var callResult;
            if (a) {
                var hFile = new Uint32Array(filePtrHeap.buffer, filePtrHeap.byteOffset, 1)[0];
                callResult = {hFile : hFile};
            } else {
                var errorCode = Module._GetLastError();
                callResult = { errorCode : errorCode };
            }

            /* 5. Send result */
            callResult.id = message.id;
            callResult.action = 'SFileOpenFileEx';

            self.postMessage(callResult);

            break;

        case 'SFileGetFileSize':
            /* 1. Function parameters */
            var hFile = message.hFile;

            /* 2. Bloat code to pass parameters */
            var fileSizePtr = Module._malloc(4);
            var fileSizePtrHeap = new Uint8Array(Module.HEAPU8.buffer, fileSizePtr, 4);

            /* 3. Call function */
            var a = Module._SFileGetFileSize(hFile, fileSizePtrHeap.byteOffset);

            /* 4. Get function result */
            var callResult;
            if (a != -1) {
                var fileSize = new Uint32Array(fileSizePtrHeap.buffer, fileSizePtrHeap.byteOffset, 1)[0];
                fileSize = fileSize*(256*256) + a;

                callResult = {fileSize : fileSize};
            } else {
                var errorCode = Module._GetLastError();
                callResult = { errorCode : errorCode };
            }

            /* 5. Send result */
            callResult.id = message.id;
            callResult.action = 'SFileGetFileSize';

            self.postMessage(callResult);


            break;
        case 'SFileSetFilePointer':
        case 'SFileReadFile':
            /* 1. Function parameters */
            var hFile = message.hFile;
            var dwToRead = message.dwToRead;

            /* 2. Bloat code to pass parameters */
            var dwReadPtr = Module._malloc(4);
            var dwReadPtrHeap = new Uint8Array(Module.HEAPU8.buffer, dwReadPtr, 4);

            var pBufferPtr = Module._malloc(dwToRead);
            var pBufferPtrHeap = new Uint8Array(Module.HEAPU8.buffer, pBufferPtr, dwToRead);

            /* 3. Call function */
            var a = Module._SFileReadFile(hFile, pBufferPtrHeap.byteOffset, dwToRead, dwReadPtrHeap.byteOffset, 0);

            /* 4. Get function result */
            if (a) {
                var dwRead = new Uint32Array(dwReadPtrHeap.buffer, dwReadPtrHeap.byteOffset, 1)[0];
                var result = new Uint8Array(dwRead);
                for (var i = 0; i < dwRead; i++) {
                    result[i] = pBufferPtrHeap[i];
                }
                callResult  = {dwRead : dwRead, buffer : result};

            } else {
                var errorCode = Module._GetLastError();
                callResult = { errorCode : errorCode };
            }

            /* 5. Send result */
            callResult.id = message.id;
            callResult.action = 'SFileReadFile';

            self.postMessage(callResult);

            break;
        case 'SFileCloseFile':

        case 'SFileHasFile':
        case 'SFileGetFileName':
        case 'SFileGetFileInfo':

        case 'SFileExtractFile':

        case 'SFileVerifyFile':
        case 'SFileVerifyRawData':
        case 'SFileVerifyArchive':

        case 'SFileFindFirstFile':
        case 'SFileFindNextFile':
        case 'SFileFindClose':

        case 'SListFileFindFirstFile':
        case 'SListFileFindNextFile':
        case 'SListFileFindClose':

        case 'SFileEnumLocales':

        case 'SFileCreateFile':
        case 'SFileWriteFile':
        case 'SFileFinishFile':
        case 'SFileAddFileEx':
        case 'SFileAddFile':
        case 'SFileAddWave':
        case 'SFileRemoveFile':
        case 'SFileRenameFile':
        case 'SFileSetFileLocale':
        case 'SFileSetDataCompression':
        case 'SFileSetAddFileCallback':

        case 'SCompImplode':
        case 'SCompExplode':
        case 'SCompCompress':
        case 'SCompDecompress':

            break;
    }

};

Module['printErr'] = function (text) {
    self.postMessage({action: 'printErr', text: text});
};

Module['preRun'] = function () {

    var devMinor = 178; //random number
    var devMajor = 0;
    var fileRepository = {};

    Module['addFileToRep'] = function (fileName, fileSize, fileObj) {

        var devId = FS.makedev(devMajor++, devMinor);
        var registeredDevice = FS.registerDevice(devId, {
            open: function (stream) {
                var path = NODEFS.realPath(stream.node);
                try {
                    var reader = new FileReaderSync();

                    stream.nfileReader = reader;
                    stream.nfile = fileObj;
                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
                }
            },
            close: function (stream) {
                try {

                } catch (e) {
                    if (!e.code) throw e;
                    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
                }
            },
            read: function (stream, buffer, offset, length, position) {
                if (length === 0) return 0; // node errors on 0 length reads

                var fileIsRead = false;

                if (!position) position = 0;

                var slice = stream.nfile.slice(position, position + length);
                var resultArrayBuff = stream.nfileReader.readAsArrayBuffer(slice);

                var view = new Uint8Array(resultArrayBuff);
                for (var i = 0; i < view.length; ++i) {
                    buffer[i + offset] = view[i];
                    fileIsRead = true;
                }
                var bytesRead = view.length;

                //Number of bytes read
                return bytesRead;
            },
            write: function (stream, buffer, offset, length, position) {
                // FIXME this is terrible.
                /*
                var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
                var res;
                try {
                    res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
                } catch (e) {
                    throw new FS.ErrnoError(ERRNO_CODES[e.code]);
                }
                return res;*/
            },
            llseek: function (stream, offset, whence) {
                return offset;
            }
        });

//     var node = FS.mkdev(fileName, 32768 | 438, devId);
        var node = FS.mkdev(fileName, devId);
        node.mode = 32768 | 438; //hack
        node.usedBytes = fileSize;
    }

};