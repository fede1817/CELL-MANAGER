const Stats = ({ filteredData, isPhoneOn }) => {
  const styles = {
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
    }
  }

  return (
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
  )
}

export default Stats