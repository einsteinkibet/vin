import React, { useState } from 'react';

const OptionsList = ({ vehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock options data - would come from API
  const options = [
    { code: 'S1CA', name: 'Selection COP relevant vehicles', category: 'performance', type: 'standard' },
    { code: 'S2VBA', name: 'Tyre pressure display', category: 'safety', type: 'optional' },
    { code: 'S3DZ', name: 'Without BMW line designation', category: 'exterior', type: 'standard' },
    { code: 'S4U0', name: 'Electroplated cover', category: 'interior', type: 'optional' },
    { code: 'S548', name: 'Kilometer-calibrated speedometer', category: 'instrumentation', type: 'standard' },
    { code: 'S6AC', name: 'Intelligent emergency call', category: 'safety', type: 'optional' },
    { code: 'S6AE', name: 'Teleservices', category: 'connectivity', type: 'optional' },
    { code: 'S6AK', name: 'ConnectedDrive Services', category: 'connectivity', type: 'optional' }
  ];

  const categories = ['all', 'performance', 'safety', 'exterior', 'interior', 'instrumentation', 'connectivity'];
  
  const filteredOptions = selectedCategory === 'all' 
    ? options 
    : options.filter(opt => opt.category === selectedCategory);

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'standard': return 'bg-success';
      case 'optional': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="mt-4">
      <h5>Factory Options & Packages</h5>
      
      <div className="d-flex flex-wrap gap-2 mb-3">
        {categories.map(category => (
          <button
            key={category}
            className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Code</th>
              <th>Option Name</th>
              <th>Category</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredOptions.map((option, index) => (
              <tr key={index}>
                <td><code>{option.code}</code></td>
                <td>{option.name}</td>
                <td>
                  <span className="badge bg-light text-dark">
                    {option.category}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getBadgeVariant(option.type)}`}>
                    {option.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOptions.length === 0 && (
        <div className="text-center text-muted py-4">
          <i className="fas fa-info-circle fa-2x mb-2"></i>
          <p>No options found in this category</p>
        </div>
      )}
    </div>
  );
};

export default OptionsList;