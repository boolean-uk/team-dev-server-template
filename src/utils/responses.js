const STATUS_MESSAGES = {
  200: 'success',
  201: 'success',
  400: 'fail',
  500: 'error'
}

export function sendDataResponse(res, statusCode, payload) {
  return res.status(statusCode).json({
    status: STATUS_MESSAGES[statusCode],
    data: payload
  })
}

export function sendMessageResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    status: STATUS_MESSAGES[statusCode],
    message
  })
}
