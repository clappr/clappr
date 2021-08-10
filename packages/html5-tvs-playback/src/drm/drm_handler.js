import { Log } from '@clappr/core'

const MESSAGE_TYPE = 'application/vnd.ms-playready.initiator+xml'
const DRM_SYSTEM_ID = 'urn:dvb:casystemid:19219'

export const getFullChallengeMessageTemplate = header => {
  const template = '<?xml version="1.0" encoding="utf-8"?>'
  + '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">'
  + '<LicenseAcquisition>'
  + '<Header>'
  + `${header}`
  + '</Header>'
  + '</LicenseAcquisition>'
  + '</PlayReadyInitiator>'
  return template
}

export const getLicenseOverrideMessageTemplate = licenseServerURL => {
  const template = '<?xml version="1.0" encoding="utf-8"?>'
  + '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">'
  + '<LicenseServerUriOverride>'
  + `<LA_URL>${licenseServerURL}</LA_URL>`
  + '</LicenseServerUriOverride>'
  + '</PlayReadyInitiator>'
  return template
}

export const getClearMessageTemplate = () => {
  const template = '<?xml version="1.0" encoding="utf-8"?>'
  + '<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">'
  + '</PlayReadyInitiator>'
  return template
}

export const createDrmAgent = () => {
  const drmElement = document.createElement('object')

  drmElement.id = 'oipfdrmagent'
  drmElement.type = 'application/oipfdrmagent'
  drmElement.style.visibility = 'hidden'
  drmElement.style.position = 'absolute'
  drmElement.style.top = '0'
  drmElement.style.left = '0'
  drmElement.style.width = '0'
  drmElement.style.height = '0'

  return drmElement
}

/* eslint-disable-next-line func-style */
export function sendLicenseRequest(config = {}, onSuccess = () => {}, onFail = () => {}) {
  const successCallback = onSuccess.bind(this)
  const errorCallback = onFail.bind(this)
  let oipfdrmagent = document.getElementById('oipfdrmagent')

  if (!oipfdrmagent) {
    oipfdrmagent = createDrmAgent()
    this && this.el
      ? this.el.appendChild(oipfdrmagent)
      : document.body.appendChild(oipfdrmagent)
  }

  const xmlLicenceAcquisition = config.xmlLicenceAcquisition
    ? getFullChallengeMessageTemplate(config.xmlLicenceAcquisition)
    : getLicenseOverrideMessageTemplate(config.licenseServerURL)

  const drmRightsErrorHandler = resultCode => {
    const errorMessage = {
      0: 'DRM: No license error',
      1: 'DRM: Invalid license error',
      2: 'DRM: License valid',
    }

    if (resultCode < 2) {
      Log.error('DRMHandler', 'Error at onDRMRightsError call', errorMessage[resultCode])
      return errorCallback(errorMessage[resultCode])
    }
  }

  const drmMessageResultHandler = (messageID, resultMessage, resultCode) => {
    Log.info('DRMHandler', 'onDRMMessageResult messageID', messageID)
    Log.info('DRMHandler', 'onDRMMessageResult resultMessage', resultMessage)
    Log.info('DRMHandler', 'onDRMMessageResult resultCode', resultCode)

    const errorMessage = {
      1: 'DRM: Unspecified error',
      2: 'DRM: Cannot process request',
      3: 'DRM: Wrong format',
      4: 'DRM: User Consent Needed',
      5: 'DRM: Unknown DRM system',
    }

    if (resultCode !== 0) {
      Log.error('DRMHandler', 'Error at onDRMMessageResult call', errorMessage[resultCode])
      return errorCallback(errorMessage[resultCode])
    }

    return successCallback()
  }

  try {
    oipfdrmagent.onDRMRightsError = drmRightsErrorHandler
    oipfdrmagent.onDRMMessageResult = drmMessageResultHandler
    oipfdrmagent.sendDRMMessage(MESSAGE_TYPE, xmlLicenceAcquisition, DRM_SYSTEM_ID)
  } catch (error) {
    Log.error('DRMHandler', 'Error at sendDRMMessage call', error.message)
    return errorCallback(error.message)
  }
}

/* eslint-disable-next-line func-style */
export function clearLicenseRequest(onSuccess = () => {}, onFail = () => {}) {
  const successCallback = onSuccess.bind(this)
  const errorCallback = onFail.bind(this)
  const oipfdrmagent = document.getElementById('oipfdrmagent')

  if (!oipfdrmagent) {
    Log.warn('DRMHandler', 'No one DRM license has been configured before. It\'s not necessary to clear any license server.')
    return
  }

  const xmlLicenceAcquisition = getClearMessageTemplate()

  try {
    oipfdrmagent.onDRMRightsError = successCallback

    oipfdrmagent.onDRMMessageResult = () => {
      oipfdrmagent.remove()
      successCallback()
    }

    oipfdrmagent.sendDRMMessage(MESSAGE_TYPE, xmlLicenceAcquisition, DRM_SYSTEM_ID)
  } catch (error) {
    Log.error('DRMHandler', 'Error at sendDRMMessage call', error.message)
    errorCallback(error.message)
  }
}

const DRMHandler = {
  sendLicenseRequest,
  clearLicenseRequest,
}

export default DRMHandler
