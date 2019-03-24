"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage = require("@google-cloud/storage");
class GoogleStorage {
    constructor(config) {
        let projectId = require(config.serviceAccountPath).project_id;
        this.directory = config.directory;
        this.bucketName = projectId + '.appspot.com';
        this.storage = new Storage({
            projectId,
            keyFilename: config.serviceAccountPath
        });
    }
    getSubDirUri() {
        return `https://storage.googleapis.com/${this.bucketName}/${this.directory}`;
    }
    getGsuitUri() {
        return `gs://${this.bucketName}/${this.directory}`;
    }
    async exist(filePath) {
        return new Promise((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).exists().then(data => resolve(data[0]));
        });
    }
    async uploadBuffer(filePath, buffer, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = '', mimetype = '') {
        filePath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise(async (resolve, reject) => {
            if (await this.exist(filePath))
                await this.deleteFile(filePath);
            let file = this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`);
            let option = {
                metadata: {
                    cacheControl
                }
            };
            if (mimetype)
                option.metadata.contentType = mimetype;
            let writeStream = file.createWriteStream(option);
            writeStream.on('error', (err) => {
                reject(err);
            });
            writeStream.on('finish', async () => {
                if (makePublic)
                    await this.makePublic(filePath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${filePath}`);
            });
            writeStream.end(buffer);
        });
    }
    async uploadFile(filePath, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = '') {
        let destPath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise(async (resolve, reject) => {
            if (await this.exist(destPath))
                await this.deleteFile(destPath);
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                let fileName = filePath.substr(filePath.lastIndexOf('/') + 1, filePath.length);
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic)
                    await this.makePublic(destPath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async uploadFile2Folder(filePath, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = '') {
        let splited = splitPathAndFileName(filePath);
        let fileName = splited.file;
        let destPath = prefix ? `${prefix}/${fileName}` : fileName;
        return new Promise(async (resolve, reject) => {
            if (await this.exist(destPath))
                await this.deleteFile(destPath);
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic)
                    await this.makePublic(destPath);
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async getDownloadUrl(filePath, prefix = '') {
        let destPath = prefix ? prefix + '/' + filePath : filePath;
        let file = this.storage.bucket(this.bucketName).file(`${this.directory}/${destPath}`);
        return new Promise((resolve) => {
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }).then(signedUrls => {
                return resolve(signedUrls[0]);
            });
        });
    }
    async downloadFile(filePath, localPath) {
        return new Promise((resolve, reject) => {
            let options = {
                destination: localPath,
            };
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).download(options).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async deleteFile(filePath) {
        return new Promise((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).delete().then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }
    async getMetaData(filePath) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).getMetadata().then((results) => {
                resolve(results[0]);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async makePublic(filePath) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).makePublic().then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async moveFile(filePath, fileDestPath) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).move(`${this.directory}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async moveUploadedFile(filename, fileDestPath) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(filename).move(`${this.directory}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async copyFile(filePath, fileDestPath) {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).copy(this.storage.bucket(this.bucketName).file(`${this.directory}/${fileDestPath}`)).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }
    async listFiles(prefix, delimiter) {
        let options = {
            prefix: prefix
        };
        if (delimiter) {
            options.delimiter = delimiter;
        }
        ;
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).getFiles(options).then(result => {
                let files = result[0];
                resolve(files.map(file => {
                    return {
                        name: file.name
                    };
                }));
            }).catch(err => reject(err));
        });
    }
    createBucket(bucketName) {
        return new Promise((resolve, reject) => {
            this.storage.createBucket(bucketName).then(() => { resolve(true); })
                .catch(err => { reject(err); });
        });
    }
    listBucketNames() {
        return new Promise((resolve, reject) => {
            this.storage.getBuckets().then(result => {
                let buckets = result[0];
                resolve(buckets.map(bucket => bucket.name));
            }).catch(err => reject(err));
        });
    }
}
exports.GoogleStorage = GoogleStorage;
function splitPathAndFileName(fullPath) {
    return {
        file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
        path: fullPath.slice(0, fullPath.lastIndexOf('/'))
    };
}
//# sourceMappingURL=storage.js.map