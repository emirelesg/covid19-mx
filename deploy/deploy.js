require('dotenv').config()
const FtpDeploy = require('ftp-deploy');
const path = require('path');
const ftp = new FtpDeploy();

const config = {
  user: process.env.FTP_USERNAME,
  password: process.env.FTP_PASSWORD,
  port: process.env.FTP_PORT,
  host: process.env.FTP_HOST,
  localRoot: path.resolve('./dist/'),
  remoteRoot: '/covid19/',
  include: ["*"],
  exclude: [],
  deleteRemote: true,
  forcePasv: false,
  sftp: true
};

ftp.deploy(config)
  .then(res => console.log(`Finished!`))
  .catch(err => console.error(err));

ftp.on("uploading", (data) => {
  console.log(`${data.transferredFileCount} / ${data.totalFilesCount} - ${data.filename}`);
});