import { useState, useEffect } from 'react'
import { FiNavigation } from 'react-icons/fi'
import SearchControls from './components/SearchControls'
import Stats from './components/Stats'
import DeviceGrid from './components/DeviceGrid'
import Loading from './components/Loading'
import Error from './components/Error'
import NoResults from './components/NoResults'

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

 // En App.js, actualiza la función getTimeAgo:

// Función para formatear el tiempo transcurrido
const getTimeAgo = (timestamp) => {
  if (!timestamp) return 'Sin datos'
  
  const now = Date.now()
  const diff = now - timestamp
  
  // Si el timestamp está en el futuro (diff negativo)
  if (diff < 0) {
    const futureDiff = Math.abs(diff)
    const seconds = Math.floor(futureDiff / 1000)
    
    if (seconds < 60) return `en ${seconds} segundos`
    
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `en ${minutes} minuto${minutes > 1 ? 's' : ''}`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `en ${hours} hora${hours > 1 ? 's' : ''}`
    
    return 'en el futuro'
  }
  
  // Timestamp en el pasado (comportamiento normal)
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `hace ${seconds} segundos`
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
  
  const days = Math.floor(hours / 24)
  if (days < 30) return `hace ${days} día${days > 1 ? 's' : ''}`
  
  const months = Math.floor(days / 30)
  if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  
  const years = Math.floor(months / 12)
  return `hace ${years} año${years > 1 ? 's' : ''}`
}


// Función para obtener el color según la antigüedad
// Función para obtener el color según la antigüedad
const getTimeColor = (timestamp) => {
  if (!timestamp) return '#EF4444'
  
  const now = Date.now()
  const diff = now - timestamp
  
  // Si el timestamp está en el futuro, usar color especial
  if (diff < 0) {
    return '#8B5CF6' // Color violeta para timestamps futuros
  }
  
  // Timestamp en el pasado (comportamiento normal)
  const hours = Math.floor(diff / (60 * 60 * 1000))
  
  if (hours < 1) return '#10B981'
  if (hours < 6) return '#F59E0B'
  if (hours < 12) return '#F97316'
  if (hours < 24) return '#DC2626'
  return '#DC2626'
}

// Función para determinar el nivel de confianza del estado
const getPowerConfidence = (device) => {
  const tracking = device.tracking
  if (!tracking) return 'sin_datos'
  
  const now = Date.now()
  const isDataRecent = tracking?.fechacaptura && 
    (now - tracking.fechacaptura) < (24 * 60 * 60 * 1000) &&
    (now - tracking.fechacaptura) >= 0 // Asegurar que no sea futuro
  
  // Si el timestamp está en el futuro, considerar como datos antiguos
  if (tracking?.fechacaptura && (now - tracking.fechacaptura) < 0) {
    return 'datos_antiguos'
  }
  
  if (!isDataRecent) return 'datos_antiguos'
  
  if (tracking.gpsactivo === true) return 'alta'
  if (tracking.bateria > 0 && tracking.imei) return 'media'
  if (tracking.tipored && tracking.bateria !== undefined) return 'baja'
  
  return 'insuficiente'
}

  // Función para determinar si el teléfono está prendido
  const isPhoneOn = (device) => {
    const tracking = device.tracking
    
    if (!tracking) return false
    
    const isDataRecent = tracking?.fechacaptura && 
      (Date.now() - tracking.fechacaptura) < (24 * 60 * 60 * 1000)
    
    if (!isDataRecent) return false
    
    if (tracking.gpsactivo === true) return true
    if ((tracking.bateria > 0) && tracking.imei) return true
    if (tracking.tipored && tracking.bateria !== undefined) return true
    
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
    
    if (selectedSucursal) {
      filtered = filtered.filter(device => 
        device.tracking?.usuario?.sucursal?.nombresucursal === selectedSucursal
      )
    }
    
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

  useEffect(() => {
    fetchTrackingData()
    const interval = setInterval(fetchTrackingData, 30000)
    return () => clearInterval(interval)
  }, [])

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
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <FiNavigation size={32} />
          Sistema de Rastreo
        </h1>
        <p style={styles.subtitle}>Monitoreo en tiempo real de dispositivos móviles</p>
        
        <SearchControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSucursal={selectedSucursal}
          setSelectedSucursal={setSelectedSucursal}
          selectedPowerStatus={selectedPowerStatus}
          setSelectedPowerStatus={setSelectedPowerStatus}
          sucursales={sucursales}
          loading={loading}
          fetchTrackingData={fetchTrackingData}
        />

       <Stats 
  filteredData={filteredData}
  isPhoneOn={isPhoneOn}
/>
      </div>

      {loading && filteredData.length === 0 && <Loading />}

      {error && (
        <Error 
          error={error} 
          fetchTrackingData={fetchTrackingData} 
        />
      )}

      {filteredData.length > 0 ? (
   <DeviceGrid 
  filteredData={filteredData}
  isPhoneOn={isPhoneOn}
  getTimeAgo={getTimeAgo}
  getTimeColor={getTimeColor}
  getPowerConfidence={getPowerConfidence}
/>
      ) : (
        !loading && !error && <NoResults />
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