#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

const argv = require('minimist')(process.argv.slice(2));
const prompts = require('prompts');

const args = process.argv.slice(2);
if (!args.length) {
    console.log("need to specify path");
    return;
}

const packageName = args[0];
const baseDestPath = path.join(cwd, packageName);

function copy(src, dest) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });

    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

function write(sourcePath, filename, destPath, content) {
    const targetPath = path.join(destPath, filename);

    if (content) {
        fs.writeFileSync(targetPath, content);
    } else {
        copy(path.join(sourcePath, filename), targetPath);
    }
}

  const templateDir = path.join(__dirname, 'template-express-sequelize');

  const files = fs.readdirSync(templateDir);
  fs.mkdirSync(baseDestPath, { recursive: true });

for (const file of files.filter((f) => f !== 'package.json')) {
    write(templateDir, file, baseDestPath)
}

const pkg = require(path.join(templateDir, `package.json`))
pkg.name = packageName;

write(null, 'package.json', templateDir, JSON.stringify(pkg, null, 2));
