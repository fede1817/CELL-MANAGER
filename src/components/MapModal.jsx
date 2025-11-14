import { FiX } from 'react-icons/fi'

const MapModal = ({ isOpen, onClose, location }) => {
  if (!isOpen || !location) return null

  const { latitud, longitud } = location
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud-0.01}%2C${latitud-0.01}%2C${longitud+0.01}%2C${latitud+0.01}&layer=mapnik&marker=${latitud}%2C${longitud}`

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease-out'
    },
    modal: {
      background: '#1e293b',
      borderRadius: '12px',
      padding: '20px',
      width: '90%',
      maxWidth: '800px',
      maxHeight: '90vh',
      border: '1px solid #334155',
      animation: 'slideIn 0.3s ease-out'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#f1f5f9',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '24px',
      padding: '4px',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mapContainer: {
      width: '100%',
      height: '400px',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none'
    },
    coordinates: {
      marginTop: '12px',
      fontSize: '14px',
      color: '#94a3b8',
      textAlign: 'center'
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleCloseButtonHover = (e) => {
    e.target.style.color = '#f1f5f9'
    e.target.style.background = 'rgba(148, 163, 184, 0.1)'
  }

  const handleCloseButtonLeave = (e) => {
    e.target.style.color = '#94a3b8'
    e.target.style.background = 'none'
  }

  return (
    <>
      <div 
        style={styles.overlay} 
        onClick={handleOverlayClick}
      >
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h3 style={styles.title}>📍 Ubicación del Dispositivo</h3>
            <button 
              style={styles.closeButton} 
              onClick={onClose}
              onMouseEnter={handleCloseButtonHover}
              onMouseLeave={handleCloseButtonLeave}
            >
              <FiX />
            </button>
          </div>
          
          <div style={styles.mapContainer}>
            <iframe
              style={styles.iframe}
              src={osmUrl}
              title="Ubicación del dispositivo"
              allowFullScreen
            />
          </div>
          
          <div style={styles.coordinates}>
            Lat: {latitud?.toFixed(6)}, Long: {longitud?.toFixed(6)}
          </div>
        </div>
      </div>

      {/* Estilos CSS para las animaciones */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  )
}

export default MapModal