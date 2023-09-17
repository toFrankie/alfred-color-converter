const path = require('node:path')
const fs = require('node:fs')
const {promisify} = require('node:util')

// eslint-disable-next-line import/no-extraneous-dependencies
const AdmZip = require('adm-zip')

const pkg = require('../package.json')

const readFileAsync = promisify(fs.readFile)

;(async function main() {
  const zip = new AdmZip()

  zip.addLocalFile(path.join(__dirname, '../src/asserts/hex.png'))
  zip.addLocalFile(path.join(__dirname, '../src/asserts/rgb.png'))
  zip.addLocalFile(path.join(__dirname, '../src/asserts/icon.png'))
  zip.addLocalFile(path.join(__dirname, '../dist/bundle.js'))
  zip.addFile('info.plist', await fillInfoPlist())

  zip.writeZip(`${pkg.name}.alfredworkflow`)
})()

async function fillInfoPlist() {
  const infoPlistPath = path.join(__dirname, '../src/info.plist')
  const changelogPath = path.join(__dirname, '../CHANGELOG.md')

  const infoPlist = await readFileAsync(infoPlistPath, 'utf8')
  const changelog = await readFileAsync(changelogPath, 'utf8')

  const replacedPlist = infoPlist
    .replace('$createdby', pkg.author.name)
    .replace('$version', pkg.version)
    .replace('$description', pkg.description)
    .replace('$webaddress', pkg.homepage)
    .replace('$readme', changelog)

  return Buffer.from(replacedPlist)
}
