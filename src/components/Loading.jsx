import { FiRefreshCw } from 'react-icons/fi'

const Loading = () => {
  const styles = {
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: '#94a3b8',
      fontSize: '16px'
    }
  }

  return (
    <div style={styles.loading}>
      <FiRefreshCw size={24} style={{animation: 'spin 1s linear infinite', marginBottom: '16px'}} />
      <div>Cargando dispositivos...</div>
    </div>
  )
}

export default Loading