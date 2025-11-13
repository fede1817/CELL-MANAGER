import { FiSearch, FiRefreshCw } from 'react-icons/fi'

const SearchControls = ({
  searchTerm,
  setSearchTerm,
  selectedSucursal,
  setSelectedSucursal,
  selectedPowerStatus,
  setSelectedPowerStatus,
  sucursales,
  loading,
  fetchTrackingData
}) => {
  const styles = {
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
    }
  }

  return (
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
  )
}

export default SearchControls