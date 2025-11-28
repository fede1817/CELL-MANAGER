import { FiX, FiMap } from 'react-icons/fi'

const MapModal = ({ isOpen, onClose, location }) => {
  if (!isOpen || !location) return null

  const { latitud, longitud } = location
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitud-0.01}%2C${latitud-0.01}%2C${longitud+0.01}%2C${latitud+0.01}&layer=mapnik&marker=${latitud}%2C${longitud}`
  
  // 🔥 URL para Google Maps
  const googleMapsUrl = `https://www.google.com/maps?q=${latitud},${longitud}&z=15`

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
      overflow: 'hidden',
      marginBottom: '16px'
    },
    iframe: {
      width: '100%',
      height: '100%',
      border: 'none'
    },
    coordinates: {
      marginBottom: '16px',
      fontSize: '14px',
      color: '#94a3b8',
      textAlign: 'center'
    },
    // 🔥 ESTILOS PARA EL BOTÓN DE GOOGLE MAPS
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px'
    },
    googleMapsButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'linear-gradient(135deg, #4285F4, #34A853)',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    copyButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
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

  // 🔥 FUNCIÓN PARA COPIAR COORDENADAS AL PORTAPAPELES
  const copyToClipboard = async () => {
    const coordinates = `${latitud}, ${longitud}`
    try {
      await navigator.clipboard.writeText(coordinates)
      // Puedes agregar una notificación de éxito aquí si quieres
      alert('Coordenadas copiadas al portapapeles: ' + coordinates)
    } catch (err) {
      console.error('Error al copiar: ', err)
      // Fallback para navegadores más antiguos
      const textArea = document.createElement('textarea')
      textArea.value = coordinates
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Coordenadas copiadas al portapapeles: ' + coordinates)
    }
  }

  // 🔥 FUNCIÓN PARA ABRIR GOOGLE MAPS
  const openGoogleMaps = () => {
    window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')
  }

  // 🔥 EFECTO HOVER PARA BOTONES
  const handleButtonHover = (e, isGoogleMaps = false) => {
    if (isGoogleMaps) {
      e.target.style.transform = 'translateY(-2px)'
      e.target.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.3)'
    } else {
      e.target.style.transform = 'translateY(-2px)'
      e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)'
    }
  }

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)'
    e.target.style.boxShadow = 'none'
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
            <strong>Coordenadas:</strong> Lat: {latitud?.toFixed(6)}, Long: {longitud?.toFixed(6)}
          </div>

          {/* 🔥 BOTONES DE ACCIÓN */}
          <div style={styles.buttonContainer}>
            <button 
              style={styles.googleMapsButton}
              onClick={openGoogleMaps}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={handleButtonLeave}
              title="Abrir en Google Maps"
            >
              <FiMap size={16} />
              Abrir en Google Maps
            </button>
            
            <button 
              style={styles.copyButton}
              onClick={copyToClipboard}
              onMouseEnter={(e) => handleButtonHover(e, false)}
              onMouseLeave={handleButtonLeave}
              title="Copiar coordenadas"
            >
              📋 Copiar Coordenadas
            </button>
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

        /* 🔥 ESTILOS RESPONSIVOS PARA BOTONES */
        @media (max-width: 480px) {
          .button-container {
            flex-direction: column;
          }
          
          .google-maps-button, .copy-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}

export default MapModal