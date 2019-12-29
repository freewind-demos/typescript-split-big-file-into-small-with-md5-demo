import fs, {WriteStream} from 'fs';

import crypto, {Hash} from 'crypto';
import SmallFileStream from './SmallFile';

const bigFilePath = './bigfile.bin';
const {size} = fs.statSync(bigFilePath);
console.log('### size', size);

const smallFileMaxSize = 500000;

const readStream = fs.createReadStream(bigFilePath);

let smallFileNumber = 0;
let smallFileStream: SmallFileStream | null = null;

const outDirPath = './smallFiles'

readStream.on('data', (data) => {
  if (smallFileStream !== null && smallFileStream.bytesWritten > smallFileMaxSize) {
    smallFileStream.end();
    smallFileStream = null;
  }

  if (smallFileStream === null) {
    smallFileStream = new SmallFileStream(outDirPath, smallFileNumber)
    smallFileNumber += 1;
  }

  smallFileStream.write(data);
});

readStream.on('end', () => {
  if (smallFileStream !== null) {
    smallFileStream.end();
  }
})
