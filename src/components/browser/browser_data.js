/* eslint-disable no-useless-escape */
// The order of the following arrays is important, be careful if you change it.

const BROWSER_DATA = [{
  name: 'Chromium',
  group: 'Chrome',
  identifier: 'Chromium/([0-9\.]*)'
}, {
  name: 'Chrome Mobile',
  group: 'Chrome',
  identifier: 'Chrome/([0-9\.]*) Mobile',
  versionIdentifier: 'Chrome/([0-9\.]*)'
}, {
  name: 'Chrome',
  group: 'Chrome',
  identifier: 'Chrome/([0-9\.]*)'
}, {
  name: 'Chrome for iOS',
  group: 'Chrome',
  identifier: 'CriOS/([0-9\.]*)'
}, {
  name: 'Android Browser',
  group: 'Chrome',
  identifier: 'CrMo/([0-9\.]*)'
}, {
  name: 'Firefox',
  group: 'Firefox',
  identifier: 'Firefox/([0-9\.]*)'
}, {
  name: 'Opera Mini',
  group: 'Opera',
  identifier: 'Opera Mini/([0-9\.]*)'
}, {
  name: 'Opera',
  group: 'Opera',
  identifier: 'Opera ([0-9\.]*)'
}, {
  name: 'Opera',
  group: 'Opera',
  identifier: 'Opera/([0-9\.]*)',
  versionIdentifier: 'Version/([0-9\.]*)'
}, {
  name: 'IEMobile',
  group: 'Explorer',
  identifier: 'IEMobile/([0-9\.]*)'
}, {
  name: 'Internet Explorer',
  group: 'Explorer',
  identifier: 'MSIE ([a-zA-Z0-9\.]*)'
}, {
  name: 'Internet Explorer',
  group: 'Explorer',
  identifier: 'Trident/([0-9\.]*)',
  versionIdentifier: 'rv:([0-9\.]*)'
}, {
  name: 'Spartan',
  group: 'Spartan',
  identifier: 'Edge/([0-9\.]*)',
  versionIdentifier: 'Edge/([0-9\.]*)'
}, {
  name: 'Safari',
  group: 'Safari',
  identifier: 'Safari/([0-9\.]*)',
  versionIdentifier: 'Version/([0-9\.]*)'
}]

export default BROWSER_DATA
