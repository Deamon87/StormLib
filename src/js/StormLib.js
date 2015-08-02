'use strict';
function StormLib(){

}

StormLib.prototype = {
    init: function () {
        var self = this;
        this.tableOfDeferreds = {};
        this.worker = new Worker('./StormLib_worker.min.js');
        this.worker.onmessage = function (e) {
            var message = e.data;
            switch (message.action) {
                case 'printErr' :
                    console.error(message.text);
                    break;

                /* Storm lib functions */
                case 'SFileSetLocale':
                case 'SFileGetLocale':
                case 'SFileOpenArchive':
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
                case 'SFileGetFileSize':
                case 'SFileSetFilePointer':
                case 'SFileReadFile':
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
                    var promise = self.tableOfDeferreds[message.id];
                    delete self.tableOfDeferreds[message.id];

                    promise.resolve(message);

                    break;
            }
        };
    },
    getUniqueId : function () {
        var id = new Date().getUTCMilliseconds();
        return id;
    },

    /* The library interface */
    addFilesToRepository : function (files) {
        this.worker.postMessage({
            action: 'addFilesToRepository',
            fileList: files
        });
    },
    SFileSetLocale: function () {
    },
    SFileGetLocale: function () {
    },
    SFileOpenArchive: function (fileName, priority, flags) {
        var deferred = Q.defer();
        var requestId = this.getUniqueId();
        this.tableOfDeferreds[requestId] = deferred;

        this.worker.postMessage({
            action: 'SFileOpenArchive',
            id: requestId,
            fileName: fileName,
            priority: priority,
            flags: flags
        });

        return deferred.promise;

        //return {hMPQ : value} when succeed
        //return {errorCode : value} when failed
    },
    SFileCreateArchive: function () {
    },
    SFileGetArchiveBitmap: function () {
    },
    SFileFlushArchive: function () {
    },
    SFileCloseArchive: function () {
    },

    SFileAddListFile: function () {
    },

    SFileSetCompactCallback: function () {
    },
    SFileCompactArchive: function () {
    },

    SFileGetMaxFileCount: function () {
    },
    SFileSetMaxFileCount: function () {
    },
    SFileGetAttributes: function () {
    },
    SFileSetAttributes: function () {
    },
    SFileUpdateFileAttributes: function () {
    },

    SFileOpenPatchArchive: function () {
    },
    SFileIsPatchedArchive: function () {
    },

    SFileOpenFileEx: function (hMPQ, fileName, dwSearchScope) {
        var deferred = Q.defer();
        var requestId = this.getUniqueId();
        this.tableOfDeferreds[requestId] = deferred;

        this.worker.postMessage({
            action: 'SFileOpenFileEx',
            id: requestId,
            hMPQ: hMPQ,
            fileName: fileName,
            dwSearchScope: dwSearchScope
        });

        return deferred.promise;

        //return {hFile : value} when succeed
        //return {errorCode : value} when failed
    },
    SFileGetFileSize: function (hFile) {
        var deferred = Q.defer();
        var requestId = this.getUniqueId();
        this.tableOfDeferreds[requestId] = deferred;

        this.worker.postMessage({
            action: 'SFileGetFileSize',
            id: requestId,
            hFile: hFile
        });

        return deferred.promise;

        //return {fileSize : value} when succeed
        //return {errorCode : value} when failed
    },
    SFileSetFilePointer: function () {
    },
    SFileReadFile: function (hFile, dwToRead) {
        var deferred = Q.defer();
        var requestId = this.getUniqueId();
        this.tableOfDeferreds[requestId] = deferred;

        this.worker.postMessage({
            action: 'SFileReadFile',
            id: requestId,
            hFile: hFile,
            dwToRead: dwToRead
        });

        return deferred.promise;


        //return {dwRead : value, buffer : value} when succeed
        //return {errorCode : value} when failed
    },
    SFileCloseFile: function () {
    },

    SFileHasFile: function () {
    },
    SFileGetFileName: function () {
    },
    SFileGetFileInfo: function () {
    },

    SFileExtractFile: function () {
    },

    SFileVerifyFile: function () {
    },
    SFileVerifyRawData: function () {
    },
    SFileVerifyArchive: function () {
    },

    SFileFindFirstFile: function () {
    },
    SFileFindNextFile: function () {
    },
    SFileFindClose: function () {
    },

    SListFileFindFirstFile: function () {
    },
    SListFileFindNextFile: function () {
    },
    SListFileFindClose: function () {
    },

    SFileEnumLocales: function () {
    },

    SFileCreateFile: function () {
    },
    SFileWriteFile: function () {
    },
    SFileFinishFile: function () {
    },
    SFileAddFileEx: function () {
    },
    SFileAddFile: function () {
    },
    SFileAddWave: function () {
    },
    SFileRemoveFile: function () {
    },
    SFileRenameFile: function () {
    },
    SFileSetFileLocale: function () {
    },
    SFileSetDataCompression: function () {
    },
    SFileSetAddFileCallback: function () {
    },

    SCompImplode: function () {
    },
    SCompExplode: function () {
    },
    SCompCompress: function () {
    },
    SCompDecompress: function () {
    }
};