
const bcrypt = require('bcryptjs');

const hash = '$2a$10$vq6kevhn.si8MC79AUj/vOxQ.ohC/IGNBJ33.HaXfYlPIfeUpmz6m';
const input = '12345';

bcrypt.compare(input, hash).then(result => {
  console.log('Password match:', result);
});
