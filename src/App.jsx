import { useState, useEffect } from 'react'
import { FiSearch, FiRefreshCw, FiNavigation, FiWifi, FiPower } from 'react-icons/fi'
import { MdPerson, MdPhoneAndroid, MdUpdate, MdBatteryStd, MdLocationOn, MdPhone, MdPower, MdPowerOff } from 'react-icons/md'

function App() {
  const [trackingData, setTrackingData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSucursal, setSelectedSucursal] = useState('')
  const [selectedPowerStatus, setSelectedPowerStatus] = useState('')

  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      setError(null)
      const credentials = btoa(`${"federico.britez@surcomercial.com.py"}:${"Surcomercial.fb"}`)
      
      const response = await fetch(
        `https://apps.mobile.com.py:8443/mbusiness/rest/private/rastreo/resumenzona?codusuario=3542`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
        }
      )

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      
      const data = await response.json()
      const devicesArray = Array.isArray(data) ? data : [data]
      setTrackingData(devicesArray)
      setFilteredData(devicesArray)
      
    } catch (error) {
      console.error("❌ Error:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para determinar si el teléfono está prendido
 const isPhoneOn = (device) => {
  const tracking = device.tracking
  
  // Si no hay datos de tracking, definitivamente está apagado
  if (!tracking) return false
  
  // Verificar si los datos son muy antiguos (más de 24 horas)
  const isDataRecent = tracking?.fechacaptura && 
    (Date.now() - tracking.fechacaptura) < (24 * 60 * 60 * 1000) // 24 horas
  
  // Si los datos tienen más de 24 horas, considerar apagado
  if (!isDataRecent) return false
  
  // CRITERIOS ESTRICTOS para considerar el teléfono prendido:
  
  // 1. GPS ACTIVO + datos recientes (máxima confianza)
  if (tracking.gpsactivo === true) {
    return true
  }
  
  // 2. Batería mayor a 0% + IMEI presente
  if ((tracking.bateria > 0) && tracking.imei) {
    return true
  }
  
  // 3. Tipo de red reportado + batería reportada
  if (tracking.tipored && tracking.bateria !== undefined) {
    return true
  }
  
  // En cualquier otro caso, considerar apagado
  return false
}

  // Filtrar dispositivos
  useEffect(() => {
    let filtered = trackingData
    
    if (searchTerm) {
      const batteryMatch = searchTerm.match(/(\d+)%?|bateria\s*(\d+)|carga\s*(\d+)/i)
      const batteryValue = batteryMatch ? parseInt(batteryMatch[1] || batteryMatch[2] || batteryMatch[3]) : null
      
      if (batteryValue !== null && !isNaN(batteryValue)) {
        filtered = filtered.filter(device => {
          const deviceBattery = device.tracking?.bateria || 0
          const minBattery = Math.max(0, batteryValue - 5)
          const maxBattery = Math.min(100, batteryValue + 5)
          return deviceBattery >= minBattery && deviceBattery <= maxBattery
        })
      } else {
        filtered = filtered.filter(device => 
          device.tracking?.usuario?.nombrepersona?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.tracking?.usuario?.sucursal?.nombresucursal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.tracking?.imei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.tracking?.nrotelefono?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
    }
    
    // Filtro por sucursal
    if (selectedSucursal) {
      filtered = filtered.filter(device => 
        device.tracking?.usuario?.sucursal?.nombresucursal === selectedSucursal
      )
    }
    
    // Filtro por estado de encendido/apagado
    if (selectedPowerStatus) {
      filtered = filtered.filter(device => {
        const phoneOn = isPhoneOn(device)
        if (selectedPowerStatus === 'encendido') return phoneOn
        if (selectedPowerStatus === 'apagado') return !phoneOn
        return true
      })
    }
    
    setFilteredData(filtered)
  }, [searchTerm, selectedSucursal, selectedPowerStatus, trackingData])

  // Obtener lista única de sucursales
  const sucursales = [...new Set(trackingData
    .map(device => device.tracking?.usuario?.sucursal?.nombresucursal)
    .filter(Boolean)
  )].sort()

  // Función para formatear el tiempo transcurrido
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Sin datos'
    
    const now = Date.now()
    const diff = now - timestamp
    
    // Convertir a segundos
    const seconds = Math.floor(diff / 1000)
    
    if (seconds < 60) {
      return `hace ${seconds} segundos`
    }
    
    // Convertir a minutos
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    }
    
    // Convertir a horas
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    }
    
    // Convertir a días
    const days = Math.floor(hours / 24)
    if (days < 30) {
      return `hace ${days} día${days > 1 ? 's' : ''}`
    }
    
    // Convertir a meses
    const months = Math.floor(days / 30)
    if (months < 12) {
      return `hace ${months} mes${months > 1 ? 'es' : ''}`
    }
    
    // Años
    const years = Math.floor(months / 12)
    return `hace ${years} año${years > 1 ? 's' : ''}`
  }

  // Función para obtener el color según la antigüedad
  // Función para obtener el color según la antigüedad
const getTimeColor = (timestamp) => {
  if (!timestamp) return '#EF4444'
  
  const diff = Date.now() - timestamp
  const hours = Math.floor(diff / (60 * 60 * 1000))
  
  if (hours < 1) return '#10B981'      // Verde: menos de 1 hora
  if (hours < 6) return '#F59E0B'      // Amarillo: menos de 6 horas
  if (hours < 12) return '#F97316'     // Naranja: menos de 12 horas
  if (hours < 24) return '#DC2626'     // Rojo: menos de 24 horas
  return '#EF4444'                     // Marrón: más de 24 horas
}

  // Estilos CSS en objeto - MODO OSCURO
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#f8fafc'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    subtitle: {
      color: '#94a3b8',
      marginBottom: '24px'
    },
    controls: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: '24px'
    },
    searchContainer: {
      position: 'relative',
      minWidth: '300px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 40px',
      border: '1px solid #334155',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s',
      background: '#1e293b',
      color: '#f1f5f9'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    },
    filterSelect: {
      padding: '12px 16px',
      border: '1px solid #334155',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      background: '#1e293b',
      color: '#f1f5f9',
      minWidth: '180px'
    },
    button: {
      background: '#3B82F6',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    stats: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '24px'
    },
    statCard: {
      background: '#1e293b',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      minWidth: '120px',
      border: '1px solid #334155'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '500'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
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
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 8px',
      borderRadius: '6px',
      background: '#10B981',
      color: 'white'
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
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#94a3b8',
      fontSize: '16px'
    },
    error: {
      background: '#7f1d1d',
      border: '1px solid #dc2626',
      color: '#fecaca',
      padding: '16px 24px',
      borderRadius: '8px',
      marginBottom: '24px',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto 24px'
    },
    noResults: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94a3b8'
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

  const DeviceCard = ({ device }) => {
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

    const getZoneColor = (inZone) => {
      return inZone ? '#10B981' : '#EF4444'
    }

    // Función para determinar el nivel de confianza del estado
    const getPowerConfidence = (device) => {
  const tracking = device.tracking
  if (!tracking) return 'sin_datos'
  
  const isDataRecent = tracking?.fechacaptura && 
    (Date.now() - tracking.fechacaptura) < (24 * 60 * 60 * 1000) // 24 horas
  
  if (!isDataRecent) return 'datos_antiguos'
  
  if (tracking.gpsactivo === true) return 'alta'
  if (tracking.bateria > 0 && tracking.imei) return 'media'
  if (tracking.tipored && tracking.bateria !== undefined) return 'baja'
  
  return 'insuficiente'
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

    const phoneOn = isPhoneOn(device)
    const confidence = getPowerConfidence(device)
    const timeAgo = getTimeAgo(device.tracking?.fechacaptura)
    const timeColor = getTimeColor(device.tracking?.fechacaptura)

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

          <div style={styles.infoRow}>
            <div style={styles.iconContainer}>
              <MdLocationOn size={16} />
            </div>
            <div style={styles.infoContent}>
              <p style={styles.label}>UBICACIÓN</p>
              <p style={{
                ...styles.value,
                color: getZoneColor(device.inzona)
              }}>
                {device.inzona ? '🟢 En zona de trabajo' : '🔴 Fuera de zona'}
              </p>
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
            </div>
          </div>
        </div>

        <div style={styles.cardFooter}>
          <span>Fecha exacta: {device.tracking?.fechacaptura ? 
            new Date(device.tracking.fechacaptura).toLocaleString() : 
            'Sin datos'
          }</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    fetchTrackingData()
    const interval = setInterval(fetchTrackingData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FiNavigation size={32} />
          Sistema de Rastreo
        </h1>
        <p style={styles.subtitle}>Monitoreo en tiempo real de dispositivos móviles</p>
        
        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <FiSearch size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por vendedor, sucursal, modelo, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <select
            value={selectedSucursal}
            onChange={(e) => setSelectedSucursal(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Todas las sucursales</option>
            {sucursales.map(sucursal => (
              <option key={sucursal} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>

          <select
            value={selectedPowerStatus}
            onChange={(e) => setSelectedPowerStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="encendido">🟢 Encendidos</option>
            <option value="apagado">🔴 Apagados</option>
          </select>
          
          <button 
            style={styles.button}
            onClick={fetchTrackingData}
            disabled={loading}
          >
            <FiRefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{filteredData.length}</div>
            <div style={styles.statLabel}>DISPOSITIVOS</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {filteredData.filter(d => isPhoneOn(d)).length}
            </div>
            <div style={styles.statLabel}>ENCENDIDOS</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {filteredData.filter(d => d.inzona).length}
            </div>
            <div style={styles.statLabel}>EN ZONA</div>
          </div>
        </div>
      </div>

      {loading && filteredData.length === 0 && (
        <div style={styles.loading}>
          <FiRefreshCw size={24} style={{animation: 'spin 1s linear infinite', marginBottom: '16px'}} />
          <div>Cargando dispositivos...</div>
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <strong>Error al cargar datos:</strong> {error}
          <button 
            onClick={fetchTrackingData}
            style={{...styles.button, background: '#DC2626', marginLeft: '16px', padding: '8px 16px'}}
          >
            <FiRefreshCw size={14} />
            Reintentar
          </button>
        </div>
      )}

      {filteredData.length > 0 ? (
        <div style={styles.grid}>
          {filteredData.map((device, index) => (
            <DeviceCard key={device.tracking?.codtracking || index} device={device} />
          ))}
        </div>
      ) : (
        !loading && !error && (
          <div style={styles.noResults}>
            <FiSearch size={48} style={{marginBottom: '16px', color: '#475569'}} />
            <h3 style={{color: '#94a3b8', marginBottom: '8px'}}>No se encontraron dispositivos</h3>
            <p style={{color: '#64748b'}}>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          input:focus, select:focus {
            border-color: #3B82F6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
          }
          button:hover:not(:disabled) {
            background: #2563EB !important;
            transform: translateY(-1px);
          }
          div[style*="background: #1e293b"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6) !important;
          }
        `}
      </style>
    </div>
  )
}

export default App