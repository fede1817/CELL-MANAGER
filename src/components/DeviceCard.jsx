import { useState } from 'react'
import { FiNavigation, FiWifi, FiPower, FiMapPin } from 'react-icons/fi'
import { MdPerson, MdPhoneAndroid, MdUpdate, MdBatteryStd, MdLocationOn, MdPhone, MdPower, MdPowerOff } from 'react-icons/md'
import MapModal from './MapModal'

const DeviceCard = ({ device, isPhoneOn, getTimeAgo, getTimeColor, getPowerConfidence }) => {
  const [showMap, setShowMap] = useState(false)

  const formatImei = (imei) => {
    if (!imei) return 'N/A'
    const parts = imei.split('-')
    return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : imei
  }

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'No disponible'
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 9) {
      return `0${cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
    }
    return cleaned
  }

  const getBatteryColor = (battery) => {
    if (battery >= 70) return '#10B981'
    if (battery >= 40) return '#F59E0B'
    if (battery >= 20) return '#F59E0B'
    return '#EF4444'
  }

  const getPowerStatusColor = (isOn, confidence) => {
    if (!isOn) return '#EF4444'
    if (confidence === 'alta') return '#10B981'
    if (confidence === 'media') return '#F59E0B'
    if (confidence === 'baja') return '#F59E0B'
    return '#6B7280'
  }

  const getPowerStatusText = (isOn, confidence) => {
    if (!isOn) {
      if (confidence === 'datos_antiguos') return 'Apagado (>24 horas)'
      if (confidence === 'sin_datos') return 'Apagado (sin datos)'
      return 'Apagado/Sin conexión'
    }
    
    switch (confidence) {
      case 'alta': return 'Encendido ✓'
      case 'media': return 'Probablemente encendido'
      case 'baja': return 'Posiblemente encendido'
      default: return 'Estado incierto'
    }
  }

  const handleShowMap = () => {
    if (device.tracking?.latitud && device.tracking?.longitud) {
      setShowMap(true)
    }
  }

  const location = {
    latitud: device.tracking?.latitud,
    longitud: device.tracking?.longitud
  }

  const hasLocation = device.tracking?.latitud && device.tracking?.longitud

  const phoneOn = isPhoneOn(device)
  const confidence = getPowerConfidence(device)
  const timeAgo = getTimeAgo(device.tracking?.fechacaptura)
  const timeColor = getTimeColor(device.tracking?.fechacaptura)

  const styles = {
    card: {
      background: '#1e293b',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.4)',
      border: '1px solid #334155',
      transition: 'all 0.3s ease'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px',
      paddingBottom: '16px',
      borderBottom: '1px solid #334155'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      margin: '0 0 4px 0'
    },
    cardSubtitle: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: 0
    },
    powerBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 8px',
      borderRadius: '6px',
      color: 'white'
    },
    infoRow: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '16px',
      gap: '12px'
    },
    iconContainer: {
      color: '#94a3b8',
      fontSize: '16px',
      marginTop: '2px',
      flexShrink: 0
    },
    infoContent: {
      flex: 1
    },
    label: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: '0 0 4px 0',
      fontWeight: '500'
    },
    value: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#f1f5f9',
      margin: 0
    },
    batteryContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    batteryBar: {
      flex: 1,
      height: '6px',
      background: '#334155',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    batteryFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.5s ease'
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid #334155',
      fontSize: '11px',
      color: '#64748b'
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>
            {device.tracking?.usuario?.sucursal?.nombresucursal || 'Sucursal No Disponible'}
          </h3>
          <p style={styles.cardSubtitle}>
            {device.tracking?.usuario?.sucursal?.codsucursalerp || 'N/A'}
          </p>
        </div>
        <div style={{
          ...styles.powerBadge,
          background: getPowerStatusColor(phoneOn, confidence)
        }}>
          {phoneOn ? <MdPower size={12} /> : <MdPowerOff size={12} />}
          {getPowerStatusText(phoneOn, confidence)}
        </div>
      </div>

      <div>
        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdPerson size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>VENDEDOR</p>
            <p style={styles.value}>{device.tracking?.usuario?.nombrepersona || 'No asignado'}</p>
          </div>
        </div>

        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdPhoneAndroid size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>MODELO DEL DISPOSITIVO</p>
            <p style={{
              ...styles.value, 
              fontFamily: 'monospace', 
              background: '#334155', 
              padding: '10px 12px', 
              borderRadius: '6px', 
              fontSize: '16px',
              fontWeight: '800',
              letterSpacing: '0.5px',
              border: '2px solid #475569'
            }}>
              {formatImei(device.tracking?.imei)}
            </p>
          </div>
        </div>

        {/* VERSIÓN DE LA APP */}
        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdUpdate size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>VERSIÓN DE LA APP</p>
            <p style={styles.value}>v{device.tracking?.version || 'N/A'}</p>
          </div>
        </div>

        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdBatteryStd size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>NIVEL DE BATERÍA</p>
            <div style={styles.batteryContainer}>
              <div style={styles.batteryBar}>
                <div style={{
                  ...styles.batteryFill,
                  background: getBatteryColor(device.tracking?.bateria),
                  width: `${device.tracking?.bateria || 0}%`
                }}></div>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: getBatteryColor(device.tracking?.bateria),
                minWidth: '30px'
              }}>
                {device.tracking?.bateria || 0}%
              </span>
            </div>
          </div>
        </div>

        {device.tracking?.tipored && (
          <div style={styles.infoRow}>
            <div style={styles.iconContainer}>
              <FiWifi size={16} />
            </div>
            <div style={styles.infoContent}>
              <p style={styles.label}>TIPO DE RED</p>
              <p style={styles.value}>{device.tracking.tipored}</p>
            </div>
          </div>
        )}

        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdPhone size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>TELÉFONO DE CONTACTO</p>
            <p style={{
              ...styles.value,
              color: '#60a5fa',
              fontSize: '15px',
              fontWeight: '700'
            }}>
              {formatPhoneNumber(device.tracking?.nrotelefono)}
            </p>
          </div>
        </div>

        {/* Tiempo exacto desde la última actualización */}
        <div style={styles.infoRow}>
          <div style={styles.iconContainer}>
            <MdUpdate size={16} />
          </div>
          <div style={styles.infoContent}>
            <p style={styles.label}>ÚLTIMA ACTUALIZACIÓN</p>
            <p style={{
              ...styles.value,
              color: timeColor,
              fontWeight: '700'
            }}>
              {timeAgo}
            </p>
            
            {/* Botón para ver ubicación */}
             <button 
            style={{
              background: hasLocation ? '#3B82F6' : '#6B7280',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: hasLocation ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              marginTop: '12px', // ← Más separación
              width: 'fit-content'
            }}
            onClick={handleShowMap} // ← Usa la función corregida
            disabled={!hasLocation}
            title={hasLocation ? "Ver ubicación en el mapa" : "Ubicación no disponible"}
          >
            <FiMapPin size={14} />
            {hasLocation ? "Ver Ubicación en Mapa" : "Ubicación No Disponible"}
          </button>
          </div>
        </div>
      </div>

      <div style={styles.cardFooter}>
        <span>Fecha exacta: {device.tracking?.fechacaptura ? 
          new Date(device.tracking.fechacaptura).toLocaleString() : 
          'Sin datos'
        }</span>
      </div>

      {/* Modal del mapa */}
      <MapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        location={location}
      />
    </div>
  )
}

export default DeviceCard