export function getPrecisePosition({
  timeoutMs = 12000,
  desiredAccuracy = 25,
  minSamples = 1,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Seu navegador não permite leitura de localização.'))
      return
    }

    let bestPosition = null
    let samples = 0
    let settled = false
    let watchId = null

    const finish = (position) => {
      if (settled) return
      settled = true
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
      clearTimeout(timer)
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy ?? 0),
        capturedAt: new Date().toISOString(),
      })
    }

    const fail = (error) => {
      if (settled) return
      if (bestPosition) {
        finish(bestPosition)
        return
      }
      settled = true
      if (watchId !== null) navigator.geolocation.clearWatch(watchId)
      clearTimeout(timer)
      reject(error)
    }

    const timer = setTimeout(() => {
      if (bestPosition) {
        finish(bestPosition)
        return
      }
      fail(new Error('Não foi possível obter uma localização precisa. Tente novamente.'))
    }, timeoutMs)

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        samples += 1
        const accuracy = position.coords.accuracy ?? Number.POSITIVE_INFINITY
        const bestAccuracy = bestPosition?.coords?.accuracy ?? Number.POSITIVE_INFINITY

        if (!bestPosition || accuracy < bestAccuracy) {
          bestPosition = position
        }

        if (samples >= minSamples && accuracy <= desiredAccuracy) {
          finish(position)
        }
      },
      () => fail(new Error('Permita o acesso à localização e tente novamente.')),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: timeoutMs,
      }
    )
  })
}
