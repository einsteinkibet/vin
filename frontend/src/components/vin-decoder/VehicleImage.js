import React from 'react';

const VehicleImage = ({ vehicle }) => {
  // This would typically come from an API based on the vehicle model
  const getImageUrl = (model) => {
    const modelImages = {
      '3 Series': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      '5 Series': 'https://images.unsplash.com/photo-1603712610494-7e0d50a08b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      '7 Series': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'X5': 'https://images.unsplash.com/photo-1549399542-7e82138ccf10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      'default': 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    };
    
    for (const [key, url] of Object.entries(modelImages)) {
      if (model.includes(key)) return url;
    }
    return modelImages.default;
  };

  return (
    <div className="text-center">
      <img 
        src={getImageUrl(vehicle.model)} 
        alt={vehicle.model}
        className="img-fluid rounded shadow"
        style={{ maxHeight: '200px', objectFit: 'cover' }}
      />
      <div className="mt-2">
        <small className="text-muted">{vehicle.model} {vehicle.model_year}</small>
      </div>
    </div>
  );
};

export default VehicleImage;
