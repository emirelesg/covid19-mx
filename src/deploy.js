if (process.env.FTP_USERNAME && process.env.FTP_PASSWORD) {
  console.log('Credentials set.');
} else {
  console.log('Credentials not set.');
}
