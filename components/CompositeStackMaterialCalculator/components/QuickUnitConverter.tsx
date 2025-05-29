import React, { useState } from 'react';

interface QuickUnitConverterProps {
  className?: string;
}

const QuickUnitConverter: React.FC<QuickUnitConverterProps> = ({ className }) => {
  const [conversionInput, setConversionInput] = useState<string>('');
  const [conversionType, setConversionType] = useState<string>('GPa_to_MPa');
  const [conversionResult, setConversionResult] = useState<string>('');
  const [copiedMessage, setCopiedMessage] = useState('');

  const handleConversion = () => {
    const value = parseFloat(conversionInput);
    if (isNaN(value)) {
      setConversionResult('Invalid input');
      return;
    }

    let result;
    let unit = '';
    switch (conversionType) {
      case 'GPa_to_MPa': result = value * 1000; unit = 'MPa'; break;
      case 'MPa_to_GPa': result = value / 1000; unit = 'GPa'; break;
      case 'GPa_to_psi': result = value * 145037.7377; unit = 'psi'; break;
      case 'psi_to_GPa': result = value / 145037.7377; unit = 'GPa'; break;
      case 'GPa_to_ksi': result = value * 145.0377377; unit = 'ksi'; break;
      case 'ksi_to_GPa': result = value / 145.0377377; unit = 'GPa'; break;
      case 'MPa_to_psi': result = value * 145.0377377; unit = 'psi'; break;
      case 'psi_to_MPa': result = value / 145.0377377; unit = 'MPa'; break;
      case 'MPa_to_ksi': result = value * 0.1450377377; unit = 'ksi'; break;
      case 'ksi_to_MPa': result = value / 0.1450377377; unit = 'MPa'; break;
      case 'g/cm³_to_kg/m³': result = value * 1000; unit = 'kg/m³'; break;
      case 'kg/m³_to_g/cm³': result = value / 1000; unit = 'g/cm³'; break;
      case 'mm_to_inches': result = value * 0.0393701; unit = 'inches'; break;
      case 'inches_to_mm': result = value * 25.4; unit = 'mm'; break;
      case 'N_to_lbf': result = value * 0.224809; unit = 'lbf'; break;
      case 'lbf_to_N': result = value * 4.44822; unit = 'N'; break;
      case 'N/mm_to_lbf/in': result = value * 5.71014715; unit = 'lbf/in'; break; // (N/mm) * (0.224809 lbf/N) / (0.0393701 in/mm)
      case 'lbf/in_to_N/mm': result = value * 0.175126837; unit = 'N/mm'; break;
      case 'C_to_F': result = (value * 9/5) + 32; unit = '°F'; break;
      case 'F_to_C': result = (value - 32) * 5/9; unit = '°C'; break;
      default:
        setConversionResult('Select a conversion type');
        return;
    }
    setConversionResult(`${result.toFixed(6)} ${unit}`); // .toFixed(6) for reasonable precision
  };

  const handleCopyConversion = () => {
    if (conversionResult && conversionResult !== 'Invalid input' && conversionResult !== 'Select a conversion type') {
      navigator.clipboard.writeText(conversionResult.split(' ')[0]); // Copy only the number
      setCopiedMessage('Value Copied!');
      setTimeout(() => {
        setCopiedMessage('');
      }, 2000);
    }
  };

  return (
    <div className={className}>
      <p className="text-xs sm:text-sm mb-3 sm:mb-4 text-base-content/70">
        Quickly convert between common units. The result can be copied.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end mb-3 sm:mb-4">
        <div className="form-control w-full">
          <label className="label pb-1">
            <span className="label-text text-xs sm:text-sm">Value to Convert</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="Enter value"
            className="input input-bordered input-sm sm:input-md w-full focus:outline-none focus:border-primary"
            value={conversionInput}
            onChange={(e) => setConversionInput(e.target.value)}
          />
        </div>
        <div className="form-control w-full">
          <label className="label pb-1">
            <span className="label-text text-xs sm:text-sm">Conversion Type</span>
          </label>
          <select
            className="select select-bordered select-sm sm:select-md w-full focus:outline-none focus:border-primary"
            value={conversionType}
            onChange={(e) => setConversionType(e.target.value)}
          >
            <optgroup label="Stress/Modulus">
              <option value="GPa_to_MPa">GPa to MPa</option>
              <option value="MPa_to_GPa">MPa to GPa</option>
              <option value="GPa_to_psi">GPa to psi</option>
              <option value="psi_to_GPa">psi to GPa</option>
              <option value="GPa_to_ksi">GPa to ksi</option>
              <option value="ksi_to_GPa">ksi to GPa</option>
              <option value="MPa_to_psi">MPa to psi</option>
              <option value="psi_to_MPa">psi to MPa</option>
              <option value="MPa_to_ksi">MPa to ksi</option>
              <option value="ksi_to_MPa">ksi to MPa</option>
            </optgroup>
            <optgroup label="Density">
              <option value="g/cm³_to_kg/m³">g/cm³ to kg/m³</option>
              <option value="kg/m³_to_g/cm³">kg/m³ to g/cm³</option>
            </optgroup>
            <optgroup label="Length/Thickness">
              <option value="mm_to_inches">mm to inches</option>
              <option value="inches_to_mm">inches to mm</option>
            </optgroup>
            <optgroup label="Force">
              <option value="N_to_lbf">N to lbf</option>
              <option value="lbf_to_N">lbf to N</option>
            </optgroup>
            <optgroup label="Force/Length (e.g., N/mm)">
              <option value="N/mm_to_lbf/in">N/mm to lbf/in</option>
              <option value="lbf/in_to_N/mm">lbf/in to N/mm</option>
            </optgroup>
            <optgroup label="Temperature">
              <option value="C_to_F">°C to °F</option>
              <option value="F_to_C">°F to °C</option>
            </optgroup>
          </select>
        </div>
      </div>
      <button 
        type="button" 
        onClick={handleConversion} 
        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto mb-3 sm:mb-4"
      >
        Convert
      </button>
      {conversionResult && (
        <div className="p-2 sm:p-3 bg-base-100 rounded-md flex justify-between items-center">
          <span className="text-sm sm:text-base font-semibold">Result: {conversionResult}</span>
          <div className="flex items-center">
            {copiedMessage && <span className="text-xs sm:text-sm text-success mr-2">{copiedMessage}</span>}
            <button
              type="button"
              onClick={handleCopyConversion}
              className="btn btn-ghost btn-xs sm:btn-sm"
              title="Copy numerical value"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickUnitConverter;
