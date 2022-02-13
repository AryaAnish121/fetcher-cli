#!/usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';

const fileUri = process.argv[2];
var logOrNot = process.argv[3];

if (logOrNot === 'true') {
  logOrNot = true;
} else {
  logOrNot = false;
}

const main = async () => {
  if (!fileUri) {
    return console.log(
      chalk.bold.bgRed.white('Please give a path to the file')
    );
  }

  if (!fs.existsSync(fileUri)) {
    return console.log(chalk.bold.bgRed.white('File does not exists'));
  }

  const contents = fs.readFileSync(fileUri, 'utf-8');
  const n = contents.split('\n').filter((s) => s.trim());
  const mainContent = [];
  var currentTimeout = 0;

  n.forEach((content) => {
    const f = content
      .trim()
      .replaceAll('\r', '')
      .replace(/ +(?= )/g, '');
    mainContent.push(f);
  });

  fs.writeFileSync('./response.json', '[]', 'utf-8');

  mainContent.forEach((mycontent, index) => {
    var content = mycontent;
    if (content.startsWith('WAIT')) {
      const timeout = Number(content.replace('WAIT', '').trim());
      if (isNaN(timeout)) {
        console.log(chalk.bold.bgRed.white('Please give a vaild number'));
      } else {
        currentTimeout += timeout;
      }
    }
    setTimeout(() => {
      var numberOfLoops = 1;

      if (content.startsWith('--loop')) {
        const words = content.split(' ');
        const loop = Number(words[0].replaceAll('--loop=', ''));
        if (isNaN(loop)) {
          return console.log(
            chalk.bold.red('Please provide a valid number of loops')
          );
        }
        content = content.replaceAll(`--loop=${loop}`, '').trim();
        numberOfLoops = loop;
      }
      if (content.startsWith('LOG')) {
        const data = content.replaceAll('LOG', '').trim();
        return console.log(data);
      }

      if (content.startsWith('#')) {
        return;
      }

      if (content.startsWith('WAIT')) {
        return;
      }

      for (let k = 0; k < numberOfLoops; k++) {
        const words = content.split(' ');
        const result = content.match(/[^{}]*(?=\})/gi);
        var header = {};
        var body;

        if (result) {
          const res = result.filter((s) => s.trim());
          var headers = res[0];
          var bodys = res[1];

          if (headers) {
            headers = headers.split(',');
            headers.forEach((h) => {
              const x = h.split(':');
              const n = x[0].replaceAll("'", '').replaceAll('"', '').trim();
              const v = x[1].replaceAll("'", '').replaceAll('"', '').trim();
              header[n] = v;
            });
          }

          if (bodys) {
            body = {};
            bodys = bodys.split(',');
            bodys.forEach((b) => {
              const x = b.split(':');
              const n = x[0].replaceAll("'", '').replaceAll('"', '').trim();
              const v = x[1].replaceAll("'", '').replaceAll('"', '').trim();
              body[n] = v;
            });
          }
        }

        const method = words[0];
        const uri = words[1];

        fetch(uri, {
          method,
          headers: header,
          body: JSON.stringify(body),
        })
          .then((res) => res.text())
          .then((res) => {
            if (logOrNot) {
              console.log(chalk.green.bold(res));
            }
            const jsonData = JSON.parse(
              fs.readFileSync('./response.json', 'utf-8')
            );
            jsonData.push(JSON.parse(res));
            fs.writeFileSync(
              './response.json',
              JSON.stringify(jsonData),
              'utf-8'
            );
          })
          .catch((err) => {
            console.error(chalk.bold.red(err));
          });
      }
    }, currentTimeout);
  });
};

main();
