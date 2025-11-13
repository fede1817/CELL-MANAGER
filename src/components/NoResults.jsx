import { FiSearch } from 'react-icons/fi'

const NoResults = () => {
  const styles = {
    noResults: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94a3b8'
    }
  }

  return (
    <div style={styles.noResults}>
      <FiSearch size={48} style={{marginBottom: '16px', color: '#475569'}} />
      <h3 style={{color: '#94a3b8', marginBottom: '8px'}}>No se encontraron dispositivos</h3>
      <p style={{color: '#64748b'}}>Intenta ajustar los filtros de búsqueda</p>
    </div>
  )
}

export default NoResults