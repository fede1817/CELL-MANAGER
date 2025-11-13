import { FiRefreshCw } from 'react-icons/fi'

const Error = ({ error, fetchTrackingData }) => {
  const styles = {
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
    button: {
      background: '#DC2626',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginLeft: '16px'
    }
  }

  return (
    <div style={styles.error}>
      <strong>Error al cargar datos:</strong> {error}
      <button 
        onClick={fetchTrackingData}
        style={styles.button}
      >
        <FiRefreshCw size={14} />
        Reintentar
      </button>
    </div>
  )
}

export default Error