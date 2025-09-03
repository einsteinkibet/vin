import React from 'react';

const Specifications = ({ vehicle }) => {
  const specSections = [
    {
      title: 'Engine & Performance',
      specs: [
        { label: 'Engine Code', value: vehicle.engine_code },
        { label: 'Horsepower', value: vehicle.horsepower ? `${vehicle.horsepower} HP` : 'N/A' },
        { label: 'Torque', value: vehicle.torque ? `${vehicle.torque} Nm` : 'N/A' },
        { label: '0-60 mph', value: vehicle.acceleration_0_60 ? `${vehicle.acceleration_0_60} sec` : 'N/A' },
        { label: 'Top Speed', value: vehicle.top_speed ? `${vehicle.top_speed} mph` : 'N/A' }
      ]
    },
    {
      title: 'Transmission & Drivetrain',
      specs: [
        { label: 'Transmission', value: vehicle.transmission_type },
        { label: 'Drive Type', value: vehicle.drive_type },
        { label: 'Fuel Type', value: vehicle.fuel_type }
      ]
    },
    {
      title: 'Dimensions & Weight',
      specs: [
        { label: 'Body Type', value: vehicle.body_type },
        { label: 'Base Price', value: vehicle.base_price ? `$${vehicle.base_price}` : 'N/A' }
      ]
    }
  ];

  return (
    <div className="mt-4">
      <h5>Technical Specifications</h5>
      
      <div className="row">
        {specSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-light">
                <h6 className="mb-0">{section.title}</h6>
              </div>
              <div className="card-body">
                <dl className="mb-0">
                  {section.specs.map((spec, specIndex) => (
                    <React.Fragment key={specIndex}>
                      <dt className="text-muted small">{spec.label}</dt>
                      <dd className="mb-2">{spec.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specifications;