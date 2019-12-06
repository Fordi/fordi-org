const { readdir: fsReaddir, existsSync: exists, copyFile, mkdir, readFileSync } = require('fs');
const { dirname, join } = require('path');
const { URL } = require('url');
const { deployment } = require(join(dirname(__dirname), 'package.json'));
const source = join(dirname(__dirname), 'build');
const { Client } = require('ssh2');

const readdir = async (path, { recursive, ...options } = {}) => {
  const rd = (path, options) => {
    const opts = { ...options, withFileTypes: true, encoding: 'utf-8' };
    return new Promise((resolve, reject) => {
      fsReaddir(path, opts, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  };
  const pathlen = path.replace(/\/$/, '').length;
  const recurse = async (root, items) => {
    const ret = [];
    if (!items || !items.length) {
      return ret;
    }
    await Promise.all(items.map(async item => {
      item.name = join(root, item.name);
      ret.push(item);
      if (item.isDirectory()) {
        const kids = await recurse(item.name, await rd(item.name, options));
        kids.forEach(kid => ret.push(kid));
      }
    }));
    return ret;
  };
  const content = await rd(path, options);
  if (!recursive) {
    return content;
  } else {
    return (await recurse(path, content)).sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    }).map(entry => {
      entry.name = `.${entry.name.substr(pathlen)}`;
      return entry;
    });
  }
};

const unindent = (s) => {
  const bits = s.replace(/^[\r\n]+|[\r\n]+$/g, '').split('\n');
  const [lead] = bits[0].match(/^[\s\t]+/);
  const trimmed = bits.map(a => (
    a.substr(0, lead.length) === lead ? a.substr(lead.length) : a
  )).filter(a => a.trim() !== '');
  return trimmed.join('\n');
  //return bits.map(a => a.substr(n) === _ ? a.substr(4) : a).join('\n');
};
if (!deployment) {
  console.error(unindent(`
    package.json should contain a named list of deployable targets, e.g.,
      ...
      "deployment": {
        "staging": "/var/www/html",
        "production": "sftp://myuser@mydomain.com/home/myuser/www/mydomain.com/"
      },
      ...
  `, 2));
  process.exit(0);
}
const type = process.argv[2];
if (!type || !deployment[type]) {
  console.error(unindent(`
    Must specify a deployment target.  Available targets:
      ${Object.keys(deployment).join('\n      ')}
  `, 2));
  process.exit(0);
}
const target = deployment[type];

console.log(unindent(`
  Preparing to deploy app to ${type}
    from: ${source}
      to: ${target}
`));

const parseTarget = tgt => {
  try {
    return new URL(tgt);
  } catch (e) {
    if (exists(tgt)) {
      return new URL(target, 'file://');
    }
    throw e;
  }
};

const mkdirp = async (dest) => {
  return new Promise((resolve, reject) => {
    mkdir(dest, { recursive: true }, err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const copy = async (src, dest) => {
  return new Promise((resolve, reject) => {
    copyFile(src, dest, 0, err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const localCopy = async (src, tgt) => {
  const entries = await readdir(source, { recursive: true });
  const files = entries.filter(file => !file.isDirectory());
  const dirs = entries.filter(file => file.isDirectory());
  console.log('Copying...');
  await Promise.all(dirs.map(async dir => mkdirp(join(tgt, dir.name))));
  await Promise.all(files.map(async file => {
    const txt = `  ${file.name}`;
    console.log(txt);
    await copy(join(src, file.name), join(tgt, file.name));
  }));
};
class PClient {
  constructor() {
    this.client = new Client();
  }
  async connect(config) {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        this.client.sftp((err, sftp) => {
          if (err) reject(err);
          else {
            this.sftp = sftp;
            resolve();
          }
        });
      });
      this.client.connect(config);
    });
  }
  async mkdirp(tgtPath) {
    return new Promise((resolve, reject) => {
      this.sftp.mkdir(tgtPath, 0o777, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  async put(srcPath, tgtPath) {
    return new Promise((resolve, reject) => {
      this.sftp.fastPut(srcPath, tgtPath, {}, err => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  async stat(tgtPath) {
    return new Promise((resolve, reject) => {
      this.sftp.stat(tgtPath, (err, stats) => {
        if (err) reject(err);
        else resolve(stats);
      });
    });
  }
  async close() {
    this.client.end();
  }

}
const sshCopy = async (src, tgt) => {
  const entries = await readdir(source, { recursive: true });
  const files = entries.filter(file => !file.isDirectory());
  const dirs = entries.filter(file => file.isDirectory());
  const ssh = new PClient();

  const home = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  let privateKey;
  if (exists(join(home, '.ssh/id_rsa'))) {
    privateKey = readFileSync(join(home, '.ssh/id_rsa'), { encoding: 'utf-8' });
  }
  await ssh.connect({
    host: tgt.host,
    port: tgt.port,
    username: tgt.username,
    password: tgt.password,
    privateKey,
  });
  console.log('Uploading...');
  for (let i = 0; i < dirs.length; i++) {
    try {
      await ssh.stat(join(tgt.pathname, dirs[i].name));
    } catch (e) {
      await ssh.mkdirp(join(tgt.pathname, dirs[i].name));
    }
  }
  for (let i = 0; i < files.length; i++) {
    console.log(`  ${files[i].name}`);
    await ssh.put(join(src, files[i].name), join(tgt.pathname, files[i].name));
  }
  ssh.close();
};
(async () => {
  const remote = parseTarget(target);
  if (remote.protocol === 'file:') {
    await localCopy(source, target);
  } else if (remote.protocol === 'sftp:' || remote.protocol === 'ssh:' || remote.protocol === 'ftps:') {
    await sshCopy(source, remote);
  } else {
    throw new Error(`Unsupported protocol: ${remote.protocol.replace(/:$/, '')}`);
  }
})();
