// Import external-modules
import * as Storage from '@google-cloud/storage';

// Import peer-modules
// Import sub-modules
import { GoogleStorageConfig } from './interfaces/google_storage_config';
import { splitPathAndFileNameFromUrl } from './services/split_path_filename_from_url';

class GoogleStorage {
    private bucketName: string;
    private directory: string;
    private storage: Storage;

    constructor(config: GoogleStorageConfig) {
        const projectId = require(config.serviceAccountPath).project_id;

        this.directory = config.directory;
        this.bucketName = projectId + '.appspot.com';
        this.storage = new Storage({
            projectId,
            keyFilename: config.serviceAccountPath,
        });
    }

    getSubDirUri(): string {
        return `https://storage.googleapis.com/${this.bucketName}/${this.directory}`;
    }

    getGsuitUri(): string {
        return `gs://${this.bucketName}/${this.directory}`;
    }

    async exist(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).exists().then(data => resolve(data[0]));
        });
    }

    async uploadBuffer(filePath: string, buffer: Buffer, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = '', mimetype = ''): Promise<string> {
        filePath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(filePath)) {
                await this.deleteFile(filePath);
            }

            const file = this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`);
            const option: {metadata} = {
                metadata: {
                    cacheControl,
                },
            };
            if (mimetype) {
                option.metadata.contentType = mimetype;
            }
            const writeStream = file.createWriteStream(option);

            writeStream.on('error', (err) => {
                reject(err);
            });
            writeStream.on('finish', async () => {
                if (makePublic) {
                    await this.makePublic(filePath);
                }
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${filePath}`);
            });
            writeStream.end(buffer);
        });
    }

    async uploadFile(filePath: string, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = ''): Promise<string> {
        const destPath = prefix ? prefix + '/' + filePath : filePath;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(destPath)) {
                await this.deleteFile(destPath);
            }
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                const fileName = filePath.substr(filePath.lastIndexOf('/') + 1, filePath.length);
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic) {
                    await this.makePublic(destPath);
                }
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async uploadFile2Folder(filePath: string, makePublic = false, cacheControl = 'no-cache, no-store, max-age=0', prefix = ''): Promise<string> {
        const splited = splitPathAndFileNameFromUrl(filePath);
        const fileName = splited.file;
        const destPath = prefix ? `${prefix}/${fileName}` : fileName;
        return new Promise<string>(async (resolve, reject) => {
            if (await this.exist(destPath)) {
                await this.deleteFile(destPath);
            }
            this.storage.bucket(this.bucketName).upload(filePath, {
                gzip: false,
                metadata: {
                    cacheControl,
                },
            }).then(async () => {
                await this.moveUploadedFile(fileName, destPath);
                if (makePublic) {
                    await this.makePublic(destPath);
                }
                resolve(`https://storage.googleapis.com/${this.bucketName}/${this.directory}/${destPath}`);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async getDownloadUrl(filePath: string, prefix = ''): Promise<string> {
        const destPath = prefix ? prefix + '/' + filePath : filePath;
        const file = this.storage.bucket(this.bucketName).file(`${this.directory}/${destPath}`);
        return new Promise<string>((resolve) => {
            file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            }).then(signedUrls => {
                return resolve(signedUrls[0]);
            });
        });
    }

    async downloadFile(filePath: string, localPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const options = {
                destination: localPath,
            };
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).download(options).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async deleteFile(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).delete().then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }

    async getMetaData(filePath: string): Promise<{
        name, bucket, storageClass, id, size,
        cacheControl, contentType, contentEncoding,
        mediaLink, metadata
    }> {
        return new Promise((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).getMetadata().then((results) => {
                resolve(results[0]);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async makePublic(filePath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).makePublic().then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async moveFile(filePath: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).move(`${this.directory}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async moveUploadedFile(filename: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(filename).move(`${this.directory}/${fileDestPath}`).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async copyFile(filePath: string, fileDestPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.bucket(this.bucketName).file(`${this.directory}/${filePath}`).copy(
                this.storage.bucket(this.bucketName).file(`${this.directory}/${fileDestPath}`)
            ).then(() => {
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async listFiles(prefix: string, delimiter?: string): Promise<Array<{ name }>> {
        const options: { prefix, delimiter?} = {
            prefix,
        };
        if (delimiter) {
            options.delimiter = delimiter;
        }

        return new Promise<Array<{ name }>>((resolve, reject) => {
            this.storage.bucket(this.bucketName).getFiles(options).then(result => {
                const files = result[0];
                resolve(files.map(file => {
                    return {
                        name: file.name,
                    };
                }));
            }).catch(err => reject(err));
        });
    }

    protected createBucket(bucketName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.storage.createBucket(bucketName).then(() => { resolve(true); })
                .catch(err => { reject(err); });
        });
    }

    protected listBucketNames(): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            this.storage.getBuckets().then(result => {
                const buckets = result[0];
                resolve(buckets.map(bucket => bucket.name));
            }).catch(err => reject(err));
        });
    }
}

export {
    GoogleStorageConfig,
    GoogleStorage,
};