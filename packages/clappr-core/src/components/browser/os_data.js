/* eslint-disable no-useless-escape */
// The order of the following arrays is important, be careful if you change it.

const OS_DATA = [{
  name: 'Windows 2000',
  group: 'Windows',
  identifier: 'Windows NT 5.0',
  version: '5.0'
}, {
  name: 'Windows XP',
  group: 'Windows',
  identifier: 'Windows NT 5.1',
  version: '5.1'
}, {
  name: 'Windows Vista',
  group: 'Windows',
  identifier: 'Windows NT 6.0',
  version: '6.0'
}, {
  name: 'Windows 7',
  group: 'Windows',
  identifier: 'Windows NT 6.1',
  version: '7.0'
}, {
  name: 'Windows 8',
  group: 'Windows',
  identifier: 'Windows NT 6.2',
  version: '8.0'
}, {
  name: 'Windows 8.1',
  group: 'Windows',
  identifier: 'Windows NT 6.3',
  version: '8.1'
}, {
  name: 'Windows 10',
  group: 'Windows',
  identifier: 'Windows NT 10.0',
  version: '10.0'
}, {
  name: 'Windows Phone',
  group: 'Windows Phone',
  identifier: 'Windows Phone ([0-9\.]*)'
}, {
  name: 'Windows Phone',
  group: 'Windows Phone',
  identifier: 'Windows Phone OS ([0-9\.]*)'
}, {
  name: 'Windows',
  group: 'Windows',
  identifier: 'Windows'
}, {
  name: 'Chrome OS',
  group: 'Chrome OS',
  identifier: 'CrOS'
}, {
  name: 'Android',
  group: 'Android',
  identifier: 'Android',
  versionIdentifier: 'Android ([a-zA-Z0-9\.-]*)'
}, {
  name: 'iPad',
  group: 'iOS',
  identifier: 'iPad',
  versionIdentifier: 'OS ([0-9_]*)',
  versionSeparator: '[_|\.]'
}, {
  name: 'iPod',
  group: 'iOS',
  identifier: 'iPod',
  versionIdentifier: 'OS ([0-9_]*)',
  versionSeparator: '[_|\.]'
}, {
  name: 'iPhone',
  group: 'iOS',
  identifier: 'iPhone OS',
  versionIdentifier: 'OS ([0-9_]*)',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X High Sierra',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])13([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Sierra',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])12([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X El Capitan',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])11([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Yosemite',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])10([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Mavericks',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])9([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Mountain Lion',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])8([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Lion',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])7([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Snow Leopard',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])6([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Leopard',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])5([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Tiger',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])4([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Panther',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])3([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Jaguar',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])2([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Puma',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])1([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS X Cheetah',
  group: 'Mac OS',
  identifier: 'Mac OS X (10([_|\.])0([0-9_\.]*))',
  versionSeparator: '[_|\.]'
}, {
  name: 'Mac OS',
  group: 'Mac OS',
  identifier: 'Mac OS'
}, {
  name: 'Ubuntu',
  group: 'Linux',
  identifier: 'Ubuntu',
  versionIdentifier: 'Ubuntu/([0-9\.]*)'
}, {
  name: 'Debian',
  group: 'Linux',
  identifier: 'Debian'
}, {
  name: 'Gentoo',
  group: 'Linux',
  identifier: 'Gentoo'
}, {
  name: 'Linux',
  group: 'Linux',
  identifier: 'Linux'
}, {
  name: 'BlackBerry',
  group: 'BlackBerry',
  identifier: 'BlackBerry'
}]

export default OS_DATA
