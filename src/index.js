import React, { useState, useEffect } from 'react'
import {
  computeLatitude,
  getEclipticObliquity,
  getGMST,
  getHourAngle,
  getJulianDate,
  getSunEclipticPosition,
  getSunEquatorialPosition
} from './utils'
import { Polygon } from 'react-leaflet'

export const NightRegion = (props) => {
  const [positions, setpositions] = useState([])

  const getNightRegionPositions = specificDate => {
    const date = specificDate || new Date()
    const julianDate = getJulianDate(date)
    const gst = getGMST(julianDate)
    const latLng = []
    const sunEclPos = getSunEclipticPosition(julianDate)
    const eclObliq = getEclipticObliquity(julianDate)
    const sunEqPos = getSunEquatorialPosition(sunEclPos.lambda, eclObliq)
    const sunEqPosValue = sunEqPos.delta < 0 ? 90 : -90
    for (let i = 0; i <= 1440; i++) {
      const lng = -360 + i / 2
      const ha = getHourAngle(lng, sunEqPos, gst)
      latLng[i + 1] = [computeLatitude(ha, sunEqPos), lng]
    }

    latLng[0] = [sunEqPosValue, -360]
    latLng[latLng.length] = [sunEqPosValue, 360]

    return latLng
  }

  useEffect(() => {
    const nightRegionPositions = getNightRegionPositions()
    setpositions(nightRegionPositions)
  }, [])

  return (
    <Polygon
      positions={positions}
      {...props}
    />
  )
}
