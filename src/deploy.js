require('dotenv').config();
const FtpDeploy = require('ftp-deploy');
const path = require('path');
const fs = require('fs');

const baseConfig = {
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  port: '21',
  host: 'ftp.newtondreams.com',
  localRoot: path.resolve('./dist/'),
  remoteRoot: 'covid19/',
  include: ['*', '.*'],
  exclude: [],
  deleteRemote: false,
  forcePasv: false,
  sftp: true
};

// Create ftp object.
const ftp = new FtpDeploy();
ftp.on('uploading', data => {
  console.log(`${data.transferredFileCount + 1} - ${data.filename}`);
});

// Returns an object with all files and folders in the provided directory.
function listDir(dir) {
  return fs.readdirSync(dir).reduce(
    (a, file) => {
      if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
        a.dirs.push(file);
      } else {
        a.files.push(file);
      }
      return a;
    },
    { files: [], dirs: [] }
  );
}

async function upload() {
  const { files, dirs } = listDir(baseConfig.localRoot);

  // Sync files in the root folder. Do not delete all of it.
  console.log(`Folder - ${baseConfig.remoteRoot}`);
  await ftp.deploy({ ...baseConfig, include: files, exclude: dirs });

  // Sync files inside each folder. Here it can delete everything.
  await dirs.reduce(async (prevPromise, dir) => {
    await prevPromise;
    const remoteRoot = path.join(baseConfig.remoteRoot, dir);
    console.log(`Folder - ${remoteRoot}`);
    return ftp.deploy({
      ...baseConfig,
      localRoot: path.join(baseConfig.localRoot, dir),
      remoteRoot,
      deleteRemote: true
    });
  }, Promise.resolve());
}

if (process.env.FTP_USERNAME && process.env.FTP_PASSWORD) {
  if (fs.existsSync(baseConfig.localRoot)) {
    upload()
      .then(() => console.log('Finished!'))
      .catch(err => {
        throw err;
      });
  } else {
    throw new Error(`${baseConfig.localRoot} does not exist.`);
  }
} else {
  throw new Error('Credentials not set.');
}
