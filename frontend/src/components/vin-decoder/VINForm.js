// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { decodeVIN } from '../../redux/slices/vinSlice';
// import { toast } from 'react-toastify';
// 
// const VINForm = () => {
//   const [vin, setVin] = useState('');
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();
//   const { isAuthenticated, user } = useSelector(state => state.auth);
// 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     
//     if (!vin || vin.length !== 17) {
//       toast.error('Please enter a valid 17-character VIN');
//       return;
//     }
// 
//     setLoading(true);
//     
//     try {
//       await dispatch(decodeVIN(vin)).unwrap();
//       toast.success('VIN decoded successfully!');
//     } catch (error) {
//       toast.error(error || 'Failed to decode VIN');
//     } finally {
//       setLoading(false);
//     }
//   };
// 
//   const handleExampleVIN = () => {
//     setVin('WBA7E2C30FG123456'); // Example BMW VIN
//   };
// 
//   return (
//     <div className="card">
//       <div className="card-body p-4">
//         <h2 className="card-title text-center mb-4">
//           <i className="fas fa-search me-2"></i>
//           Decode Your BMW VIN
//         </h2>
//         
//         <p className="text-center text-muted mb-4">
//           Enter your 17-character BMW VIN to get detailed vehicle information, 
//           specifications, and factory options.
//         </p>
// 
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="vin" className="form-label fw-bold">
//               Vehicle Identification Number (VIN)
//             </label>
//             <input
//               type="text"
//               className="form-control form-control-lg"
//               id="vin"
//               placeholder="e.g., WBA7E2C30FG123456"
//               value={vin}
//               onChange={(e) => setVin(e.target.value.toUpperCase())}
//               maxLength={17}
//               disabled={loading}
//               style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
//             />
//             <div className="form-text">
//               The VIN is 17 characters long and can be found on your vehicle's dashboard or door jamb.
//             </div>
//           </div>
// 
//           <div className="d-grid gap-2">
//             <button 
//               type="submit" 
//               className="btn btn-primary btn-lg"
//               disabled={loading || vin.length !== 17}
//             >
//               {loading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" />
//                   Decoding...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-bolt me-2"></i>
//                   Decode VIN
//                 </>
//               )}
//             </button>
//             
//             <button 
//               type="button" 
//               className="btn btn-outline-secondary"
//               onClick={handleExampleVIN}
//               disabled={loading}
//             >
//               <i className="fas fa-eye me-2"></i>
//               View Example
//             </button>
//           </div>
//         </form>
// 
//         {!isAuthenticated && (
//           <div className="alert alert-info mt-4">
//             <div className="d-flex align-items-center">
//               <i className="fas fa-info-circle me-2"></i>
//               <div>
//                 <strong>Free account required:</strong> Sign up to decode unlimited VINs 
//                 and access premium features.
//               </div>
//             </div>
//           </div>
//         )}
// 
//         {isAuthenticated && !user.premium_status && (
//           <div className="alert alert-warning mt-4">
//             <div className="d-flex align-items-center">
//               <i className="fas fa-crown me-2"></i>
//               <div>
//                 <strong>Upgrade to Premium:</strong> Unlock detailed vehicle reports, 
//                 option packages, and full specifications.
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// 
// export default VINForm;


const VINForm = () => {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateVIN = (vin) => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    
    if (!vin) return 'Please enter a VIN';
    if (vin.length !== 17) return 'VIN must be 17 characters long';
    if (!vinRegex.test(vin)) return 'Invalid characters in VIN';
    
    // Basic BMW VIN validation (starts with WBA, WBS, WBX)
    const bmwPrefixes = ['WBA', 'WBS', 'WBX', 'WBY', 'WB1', 'WB2', 'WB3'];
    const isBMW = bmwPrefixes.some(prefix => vin.toUpperCase().startsWith(prefix));
    
    if (!isBMW) {
      return 'This doesn\'t appear to be a BMW VIN. BMW VINs usually start with WBA, WBS, or WBX';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateVIN(vin);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setValidationError('');
    setLoading(true);
    
    try {
      await dispatch(decodeVIN(vin)).unwrap();
      toast.success('VIN decoded successfully!');
    } catch (error) {
      toast.error(error || 'Failed to decode VIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body p-4">
        <h2 className="card-title text-center mb-4">
          <i className="fas fa-search me-2"></i>
          Decode Your BMW VIN
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vin" className="form-label fw-bold">
              Enter BMW VIN Number
            </label>
            <input
              type="text"
              className={`form-control form-control-lg ${validationError ? 'is-invalid' : ''}`}
              id="vin"
              placeholder="e.g., WBA7E2C30FG123456"
              value={vin}
              onChange={(e) => {
                setVin(e.target.value.toUpperCase());
                setValidationError('');
              }}
              maxLength={17}
              disabled={loading}
              style={{ fontFamily: 'monospace', letterSpacing: '1px' }}
            />
            {validationError && (
              <div className="invalid-feedback">{validationError}</div>
            )}
            <div className="form-text">
              <i className="fas fa-info-circle me-1"></i>
              Find VIN on dashboard, door jamb, or registration documents
            </div>
          </div>

          {/* BMW VIN Help */}
          <div className="alert alert-info">
            <h6 className="alert-heading">
              <i className="fas fa-lightbulb me-2"></i>
              BMW VIN Format Help
            </h6>
            <ul className="mb-0 small">
              <li>Starts with <strong>WBA</strong> (3/4/5 Series), <strong>WBS</strong> (M Series), or <strong>WBX</strong> (X Series)</li>
              <li>17 characters long - numbers and letters only</li>
              <li>No I, O, or Q letters (to avoid confusion with numbers)</li>
            </ul>
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={loading || vin.length !== 17}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Decoding BMW VIN...
                </>
              ) : (
                <>
                  <i className="fas fa-bolt me-2"></i>
                  Decode VIN Now
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
