import DeviceCard from './DeviceCard'

const DeviceGrid = ({ filteredData, 
  isPhoneOn, 
  getTimeAgo, 
  getTimeColor,
  getPowerConfidence }) => {
  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    }
  }

  return (
  <div style={styles.grid}>
      {filteredData.map((device, index) => (
        <DeviceCard 
          key={device.tracking?.codtracking || index} 
          device={device}
          isPhoneOn={isPhoneOn}
          getTimeAgo={getTimeAgo}
          getTimeColor={getTimeColor}
          getPowerConfidence={getPowerConfidence}
        />
      ))}
    </div>
  )
}

export default DeviceGrid