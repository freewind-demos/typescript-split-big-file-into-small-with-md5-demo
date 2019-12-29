import crypto, {Hash} from "crypto";
import path from 'path';
import fs, {WriteStream} from 'fs';

export default class SmallFileStream {
  private readonly filePath: string;
  private fileStream: WriteStream;
  private md5Stream: Hash;

  get bytesWritten(): number {
    return this.fileStream.bytesWritten;
  }

  constructor(outDir: string, fileNumber: number) {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    this.filePath = path.resolve(outDir, `${fileNumber}`);
    this.fileStream = fs.createWriteStream(this.filePath);
    this.md5Stream = crypto.createHash('md5').setEncoding('hex');
  }

  write(data: Buffer) {
    this.fileStream.write(data);
    this.md5Stream.write(data);
  }

  end() {
    this.fileStream.end();
    this.md5Stream.end();
    this.addMd5Suffix();
  }

  private addMd5Suffix() {
    const md5 = this.md5Stream.read();
    fs.renameSync(this.filePath, `${this.filePath}.${md5}`)
  }

}
