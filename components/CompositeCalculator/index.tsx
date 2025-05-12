import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IoClose, IoInformationCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5'; // Import icons
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts components

// Define the schema for input validation
const formSchema = z.object({
  Em: z.number().positive("Must be a positive number"),
  vm: z.number().min(0, "Must be non-negative").max(0.5, "Must be less than or equal to 0.5"),
  Ef: z.number().positive("Must be a positive number"),
  vf: z.number().min(0, "Must be non-negative").max(0.5, "Must be less than or equal to 0.5"),
  Gf: z.number().positive("Must be a positive number"),
  Vf: z.number().min(0, "Volume fraction must be between 0 and 1").max(1, "Volume fraction must be between 0 and 1"),
  rhom: z.number().positive("Must be a positive number"),
  rhof: z.number().positive("Must be a positive number"),

  // New inputs for Tsai-Hill
  sigma1: z.number({ invalid_type_error: "Must be a number" }),
  sigma2: z.number({ invalid_type_error: "Must be a number" }),
  tau12: z.number({ invalid_type_error: "Must be a number" }),
  Xt: z.number().positive("Must be a positive number"),
  Xc: z.number().positive("Must be a positive number"),
  Yt: z.number().positive("Must be a positive number"),
  Yc: z.number().positive("Must be a positive number"),
  S12: z.number().positive("Must be a positive number"),
});

type FormData = z.infer<typeof formSchema>;

interface CalculationResults {
  rho_c: number;
  E1: number;
  E2_inv: number;
  E2_ht: number;
  G12_inv: number;
  G12_ht: number;
  v12: number;
  // New result for Tsai-Hill
  tsaiHillIndex: number;
  tsaiHillStatus: 'Safe' | 'Incipient Failure' | 'Failed';
  failureEnvelopeData: FailureEnvelopePoint[];
  appliedStress: { sigma1: number; sigma2: number };
}

interface FailureEnvelopePoint {
  sigma1: number;
  sigma2: number;
}

const calculateFailureEnvelope = (Xt: number, Xc: number, Yt: number, Yc: number): FailureEnvelopePoint[] => {
  const data: FailureEnvelopePoint[] = [];
  const numPoints = 100; // Number of points to generate for the envelope

  // Iterate through angles to generate points on the ellipse
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Determine X and Y based on the quadrant (sign of cos and sin)
    const X = cos >= 0 ? Xt : Xc;
    const Y = sin >= 0 ? Yt : Yc;

    // Solve the Tsai-Hill equation for sigma1 and sigma2 with tau12 = 0
    // (sigma1/X)^2 - (sigma1 * sigma2) / X^2 + (sigma2/Y)^2 = 1
    // This is a quadratic form. We can parameterize it using sigma1 = r * cos(angle) and sigma2 = r * sin(angle)
    // r^2 * (cos^2/X^2 - cos*sin/X^2 + sin^2/Y^2) = 1
    // r = 1 / sqrt(cos^2/X^2 - cos*sin/X^2 + sin^2/Y^2)

    const denominator = (cos * cos) / (X * X) - (cos * sin) / (X * X) + (sin * sin) / (Y * Y);

    if (denominator > 0) {
      const r = 1 / Math.sqrt(denominator);
      data.push({ sigma1: r * cos, sigma2: r * sin });
    }
  }
  return data;
};


const CompositeCalculator: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Em: 3.5, // Example values (GPa)
      vm: 0.35, // Example values
      Ef: 230, // Example values (GPa)
      vf: 0.2, // Example values
      Gf: 80, // Example values (GPa)
      Vf: 0.6, // Example values (Volume fraction)
      rhom: 1.2, // Example values (g/cm³)
      rhof: 1.8, // Example values (g/cm³)
      // Example values for Tsai-Hill inputs
      sigma1: 100, // MPa
      sigma2: 10, // MPa
      tau12: 20, // MPa
      Xt: 1500, // MPa
      Xc: 1000, // MPa
      Yt: 40, // MPa
      Yc: 150, // MPa
      S12: 60, // MPa
    },
  });

  const [results, setResults] = React.useState<CalculationResults | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const calculateProperties = (data: FormData): CalculationResults => {
    const { Em, vm, Ef, vf, Gf, Vf, rhom, rhof, sigma1, sigma2, tau12, Xt, Xc, Yt, Yc, S12 } = data;
    const Vm = 1 - Vf;

    // Rule of Mixtures
    const rho_c = Vf * rhof + Vm * rhom;
    const E1 = Vf * Ef + Vm * Em;
    const v12 = Vf * vf + Vm * vm;

    // Inverse Rule of Mixtures
    const Gm = Em / (2 * (1 + vm)); // Matrix Shear Modulus
    const E2_inv = 1 / (Vf / Ef + Vm / Em);
    const G12_inv = 1 / (Vf / Gf + Vm / Gm);

    // Halpin-Tsai Model
    // E2
    const eta_E2 = ((Ef / Em) - 1) / ((Ef / Em) + 0.5); // xi = 2 for E2
    const E2_ht = Em * ((1 + 2 * Vf * eta_E2) / (1 - Vf * eta_E2));

    // G12
    const eta_G12 = ((Gf / Gm) - 1) / ((Gf / Gm) + 1); // xi = 1 for G12
    const G12_ht = Gm * ((1 + 1 * Vf * eta_G12) / (1 - Vf * eta_G12));

    // Tsai-Hill Failure Criterion
    // Select appropriate strengths based on stress sign
    const X = sigma1 >= 0 ? Xt : Xc;
    const Y = sigma2 >= 0 ? Yt : Yc;
    const S = S12; // S12 is typically used for both positive and negative shear

    // Calculate Tsai-Hill index
    const tsaiHillIndex =
      Math.pow(sigma1 / X, 2) +
      Math.pow(sigma2 / Y, 2) -
      (sigma1 * sigma2) / Math.pow(X, 2) + // Note: The original formula has X^2 here, which is standard for Tsai-Hill
      Math.pow(tau12 / S, 2);

    // Determine failure status
    let tsaiHillStatus: CalculationResults['tsaiHillStatus'];
    if (tsaiHillIndex < 1) {
      tsaiHillStatus = 'Safe';
    } else if (tsaiHillIndex === 1) {
      tsaiHillStatus = 'Incipient Failure';
    } else {
      tsaiHillStatus = 'Failed';
    }

    // Calculate failure envelope data
    const failureEnvelopeData = calculateFailureEnvelope(Xt, Xc, Yt, Yc);


    return {
      rho_c,
      E1,
      E2_inv,
      E2_ht,
      G12_inv,
      G12_ht,
      v12,
      tsaiHillIndex,
      tsaiHillStatus,
      failureEnvelopeData, // Include failure envelope data in results
      appliedStress: { sigma1: data.sigma1, sigma2: data.sigma2 }, // Include applied stress in results
    };
  };

  const onSubmit = (data: FormData) => {
    const calculatedResults = calculateProperties(data);
    setResults(calculatedResults);
    setIsModalOpen(true); // Open the modal on submit
  };

  return (
    <div className="card bg-base-100 border my-8 p-4 sm:p-6">
      <div className="card-body p-0">
        <h2 className="card-title text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Composite Lamina Property & Failure Calculator</h2>
        <p className="mb-6 text-center sm:text-left">
          This tool allows you to calculate key properties of a composite lamina and perform a Tsai-Hill failure analysis based on material properties and applied stresses.
          Enter the properties of the matrix and fiber materials, the fiber volume fraction, and the applied stresses to get the calculated composite properties and failure status.
        </p>

        {/* Limitations and Assumptions */}
        <div className="collapse collapse-arrow bg-base-200 mb-6">
          <input type="checkbox" />
          <div className="collapse-title text-lg sm:text-xl font-semibold">
            Limitations and Assumptions
          </div>
          <div className="collapse-content">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This calculator uses simplified models (Rule of Mixtures, Halpin-Tsai) and the Tsai-Hill failure criterion. Key assumptions include:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
              <li>The composite is a unidirectional lamina.</li>
              <li>Perfect bonding exists between the fibers and the matrix.</li>
              <li>Materials are homogeneous and isotropic within their respective phases (matrix and fiber).</li>
              <li>Calculations are based on linear elastic material behavior.</li>
              <li>The Tsai-Hill criterion is an interaction criterion and does not predict the mode of failure.</li>
            </ul>
          </div>
        </div>

        {/* Units and Conventions */}
        <div className="collapse collapse-arrow bg-base-200 mb-6">
          <input type="checkbox" />
          <div className="collapse-title text-lg sm:text-xl font-semibold">
            Units and Conventions
          </div>
          <div className="collapse-content">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please use the following units for inputs:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
              <li>Young's Modulus (E): GPa</li>
              <li>Shear Modulus (G): GPa</li>
              <li>Density (ρ): g/cm³</li>
              <li>Volume Fraction (Vf): Dimensionless (between 0 and 1)</li>
              <li>Poisson's Ratio (ν): Dimensionless</li>
              <li>Applied Stresses (σ₁, σ₂, τ₁₂): MPa</li>
              <li>Material Strengths (Xt, Xc, Yt, Yc, S12): MPa</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              The convention for material directions is:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 mt-2">
              <li>Direction 1: Longitudinal (along the fibers)</li>
              <li>Direction 2: Transverse (perpendicular to the fibers)</li>
            </ul>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Note on units: The calculator performs calculations assuming consistent units. Ensure all inputs are in the specified units (GPa, g/cm³, MPa) for accurate results. Conversions between GPa and MPa (1 GPa = 1000 MPa) may be necessary depending on your source data.
            </p>
          </div>
        </div>

        {/* Example Calculations */}
        <div className="collapse collapse-arrow bg-base-200 mb-6">
          <input type="checkbox" />
          <div className="collapse-title text-lg sm:text-xl font-semibold">
            Example Calculation
          </div>
          <div className="collapse-content">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Here is an example calculation using typical properties for a Carbon Fiber/Epoxy composite:
            </p>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm text-gray-700 dark:text-gray-300">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Matrix (Epoxy)</th>
                    <th>Fiber (Carbon)</th>
                    <th>Composite (Vf = 0.6)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Young's Modulus (E)</td>
                    <td>3.5 GPa</td>
                    <td>230 GPa</td>
                    <td>E1 (ROM): 139.4 GPa<br />E2 (Inv ROM): 8.33 GPa<br />E2 (Halpin-Tsai): 10.5 GPa</td>
                  </tr>
                  <tr>
                    <td>Poisson's Ratio (ν)</td>
                    <td>0.35</td>
                    <td>0.2</td>
                    <td>ν12 (ROM): 0.29</td>
                  </tr>
                  <tr>
                    <td>Shear Modulus (G)</td>
                    <td>1.3 GPa</td> {/* Calculated from Em and vm */}
                    <td>80 GPa</td>
                    <td>G12 (Inv ROM): 2.5 GPa<br />G12 (Halpin-Tsai): 4.3 GPa</td>
                  </tr>
                  <tr>
                    <td>Density (ρ)</td>
                    <td>1.2 g/cm³</td>
                    <td>1.8 g/cm³</td>
                    <td>ρc (ROM): 1.56 g/cm³</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
              Applied Stresses: σ₁ = 500 MPa, σ₂ = 20 MPa, τ₁₂ = 30 MPa<br />
              Material Strengths: Xt = 1500 MPa, Xc = 1000 MPa, Yt = 40 MPa, Yc = 150 MPa, S12 = 60 MPa
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
              Tsai-Hill Failure Index: 0.1111 (Safe)
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Matrix Properties */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold  pb-2">Matrix Properties</h3>
              {/* Em */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Young's Modulus (Em, GPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The Young's Modulus of the matrix material (Em) is a measure of its stiffness. It describes how the material deforms elastically under tensile or compressive stress. A higher value indicates a stiffer material."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Em"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.Em ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Em", { valueAsNumber: true })}
                />
                {errors.Em && <span className="text-red-500 text-sm">{errors.Em.message}</span>}
              </div>
              {/* vm */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Poisson's Ratio (νm)</span>
                  <span className="tooltip tooltip-left" data-tip="The Poisson's Ratio of the matrix material (νm) describes the ratio of transverse strain to axial strain when the material is subjected to axial stress. It quantifies the material's tendency to deform in directions perpendicular to the applied force."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="vm"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.vm ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("vm", { valueAsNumber: true })}
                />
                {errors.vm && <span className="text-red-500 text-sm">{errors.vm.message}</span>}
              </div>
              {/* rhom */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Density (ρm, g/cm³)</span >
                  <span className="tooltip tooltip-left" data-tip="The density of the matrix material (ρm) is its mass per unit volume. This parameter is essential for calculating the overall composite density and weight, which are important for structural applications."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="rhom"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.rhom ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("rhom", { valueAsNumber: true })}
                />
                {errors.rhom && <span className="text-red-500 text-sm">{errors.rhom.message}</span>}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold  pb-2">Fiber Properties</h3>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Young's Modulus (Ef, GPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The Young's Modulus of the fiber material (Ef) is a key indicator of the fiber's stiffness. Fibers are typically much stiffer and stronger than the matrix, and Ef represents their resistance to elastic deformation under tensile or compressive stress, contributing significantly to the composite's longitudinal strength."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Ef"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.Ef ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Ef", { valueAsNumber: true })}
                />
                {errors.Ef && <span className="text-red-500 text-sm">{errors.Ef.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Poisson's Ratio (νf)</span>
                  <span className="tooltip tooltip-left" data-tip="The Poisson's Ratio of the fiber material (νf) describes the ratio of transverse strain to axial strain for the fiber under axial load. It defines the fiber's transverse deformation characteristics and is used in composite property calculations."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="vf"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.vf ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("vf", { valueAsNumber: true })}
                />
                {errors.vf && <span className="text-red-500 text-sm">{errors.vf.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Shear Modulus (Gf, GPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The Shear Modulus of the fiber material (Gf) measures its resistance to deformation when subjected to shear stress. This property is important for predicting the composite's shear behavior."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Gf"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.Gf ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Gf", { valueAsNumber: true })}
                />
                {errors.Gf && <span className="text-red-500 text-sm">{errors.Gf.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Density (ρf, g/cm³)</span>
                  <span className="tooltip tooltip-left" data-tip="The density of the fiber material (ρf) is its mass per unit volume. Along with the matrix density and fiber volume fraction, it is used to calculate the overall composite density."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="rhof"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.rhof ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("rhof", { valueAsNumber: true })}
                />
                {errors.rhof && <span className="text-red-500 text-sm">{errors.rhof.message}</span>}
              </div>
            </div>


            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold  pb-2">Composite Properties</h3>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Fiber Volume Fraction (Vf)</span>
                  <span className="tooltip tooltip-left" data-tip="The fiber volume fraction (Vf) is the ratio of the volume of reinforcing fibers to the total volume of the composite material. This is a critical parameter that significantly influences the composite's mechanical properties, with higher Vf generally leading to increased strength and stiffness in the fiber direction."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Vf"
                  type="number"
                  step="0.01"
                  className={`input input-bordered w-full focus:outline-none ${errors.Vf ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Vf", { valueAsNumber: true })}
                />
                {errors.Vf && <span className="text-red-500 text-sm">{errors.Vf.message}</span>}
              </div>
            </div>
          </div>


          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold  pb-2">Applied Stresses (MPa)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Longitudinal Stress (σ₁, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The applied normal stress acting parallel to the fiber direction (longitudinal direction, denoted as 1) within the composite lamina. This stress is a key input for failure criteria like Tsai-Hill."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="sigma1"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.sigma1 ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("sigma1", { valueAsNumber: true })}
                />
                {errors.sigma1 && <span className="text-red-500 text-sm">{errors.sigma1.message}</span>}
              </div>
              {/* sigma2 */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Transverse Stress (σ₂, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The applied normal stress acting perpendicular to the fiber direction (transverse direction, denoted as 2) within the composite lamina. This stress is a key input for failure criteria like Tsai-Hill."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="sigma2"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.sigma2 ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("sigma2", { valueAsNumber: true })}
                />
                {errors.sigma2 && <span className="text-red-500 text-sm">{errors.sigma2.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Shear Stress (τ₁₂, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="The applied shear stress acting in the 1-2 plane of the composite lamina, where '1' is the longitudinal direction and '2' is the transverse direction. This stress is a key input for failure criteria like Tsai-Hill."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="tau12"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.tau12 ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("tau12", { valueAsNumber: true })}
                />
                {errors.tau12 && <span className="text-red-500 text-sm">{errors.tau12.message}</span>}
              </div>
            </div>
          </div>


          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold  pb-2">Material Strengths (MPa)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Longitudinal Tensile (Xₜ, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="Represents the ultimate tensile strength of the composite material in the longitudinal direction (along the fibers). This is the maximum tensile stress the composite can withstand in the fiber direction before failure."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Xt"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.Xt ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Xt", { valueAsNumber: true })}
                />
                {errors.Xt && <span className="text-red-500 text-sm">{errors.Xt.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Longitudinal Compressive (X꜀, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="Represents the ultimate compressive strength of the composite material in the longitudinal direction (along the fibers). This is the maximum compressive stress the composite can withstand in the fiber direction before failure."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Xc"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.Xc ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Xc", { valueAsNumber: true })}
                />
                {errors.Xc && <span className="text-red-500 text-sm">{errors.Xc.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Transverse Tensile (Yₜ, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="Represents the ultimate tensile strength of the composite material in the transverse direction (perpendicular to the fibers). This is the maximum tensile stress the composite can withstand perpendicular to the fiber direction before failure."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Yt"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.Yt ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Yt", { valueAsNumber: true })}
                />
                {errors.Yt && <span className="text-red-500 text-sm">{errors.Yt.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Transverse Compressive (Y꜀, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="Represents the ultimate compressive strength of the composite material in the transverse direction (perpendicular to the fibers). This is the maximum compressive stress the composite can withstand perpendicular to the fiber direction before failure."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="Yc"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.Yc ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("Yc", { valueAsNumber: true })}
                />
                {errors.Yc && <span className="text-red-500 text-sm">{errors.Yc.message}</span>}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">In-plane Shear (S₁₂, MPa)</span>
                  <span className="tooltip tooltip-left" data-tip="Represents the shear strength of the composite material within the 1-2 plane, which is crucial for predicting failure under shear loading. This is the maximum shear stress the composite can withstand in the plane defined by the fiber and transverse directions before failure."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                </label>
                <input
                  id="S12"
                  type="number"
                  step="0.1"
                  className={`input input-bordered w-full focus:outline-none ${errors.S12 ? 'border-red-500' : 'focus:border-primary'}`}
                  {...register("S12", { valueAsNumber: true })}
                />
                {errors.S12 && <span className="text-red-500 text-sm">{errors.S12.message}</span>}
              </div>
            </div>
          </div>


          <button type="submit" className="btn btn-neutral w-full mt-6 sm:mt-8">Calculate</button>
        </form>

        {/* Results Modal */}
        <dialog id="results_modal" className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>
                <IoClose className="w-6 h-6" />
              </button>
            </form>
            {results && (
              <div className="space-y-6">
                <h3 className="font-bold text-xl sm:text-2xl text-center mb-4">Calculated Properties & Failure Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg sm:text-xl font-semibold">Composite Properties</h4>
                    <p><strong>Composite Density (ρc):</strong> {results.rho_c.toFixed(4)} g/cm³</p>
                    <p><strong>Longitudinal Young's Modulus (E1):</strong> {results.E1.toFixed(4)} Gpa</p>
                    <p><strong>Major Poisson's Ratio (ν12):</strong> {results.v12.toFixed(4)}</p>
                    <p><strong>Transverse Young's Modulus (E2, Inverse ROM):</strong> {results.E2_inv.toFixed(4)} GPa</p>
                    <p><strong>Transverse Young's Modulus (E2, Halpin-Tsai):</strong> {results.E2_ht.toFixed(4)} GPa</p>
                    <p><strong>In-plane Shear Modulus (G12, Inverse ROM):</strong> {results.G12_inv.toFixed(4)} GPa</p>
                    <p><strong>In-plane Shear Modulus (G12, Halpin-Tsai):</strong> {results.G12_ht.toFixed(4)} GPa</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg sm:text-xl font-semibold">Tsai-Hill Failure Criterion</h4>
                    <p><strong>Failure Index (H):</strong> {results.tsaiHillIndex.toFixed(4)}</p>
                    <p>
                      <strong>Failure Status:</strong>{' '}
                      <span className={
                        results.tsaiHillStatus === 'Safe' ? 'text-green-600 dark:text-green-400' :
                          results.tsaiHillStatus === 'Incipient Failure' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                      }>
                        {results.tsaiHillStatus === 'Safe' && <IoCheckmarkCircleOutline className="inline-block ml-1 text-green-600 dark:text-green-400" />}
                        {results.tsaiHillStatus === 'Incipient Failure' && <IoWarningOutline className="inline-block ml-1 text-yellow-600 dark:text-yellow-400" />}
                        {results.tsaiHillStatus === 'Failed' && <IoClose className="inline-block ml-1 text-red-600 dark:text-red-400" />}
                        {results.tsaiHillStatus}
                      </span>
                    </p>
                  </div>
                </div>
                {/* Failure Envelope Plot */}
                <div className="mt-8">
                  <h3 className="font-bold text-xl sm:text-2xl text-center mb-4">Tsai-Hill Failure Envelope (τ₁₂ = 0)</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="sigma1"
                        name="σ₁ (MPa)"
                        unit="MPa"
                        domain={[
                          Math.min(...results.failureEnvelopeData.map(d => d.sigma1), results.appliedStress.sigma1) * 1.1,
                          Math.max(...results.failureEnvelopeData.map(d => d.sigma1), results.appliedStress.sigma1) * 1.1,
                        ]}
                      />
                      <YAxis
                        type="number"
                        dataKey="sigma2"
                        name="σ₂ (MPa)"
                        unit="MPa"
                        domain={[
                          Math.min(...results.failureEnvelopeData.map(d => d.sigma2), results.appliedStress.sigma2) * 1.1,
                          Math.max(...results.failureEnvelopeData.map(d => d.sigma2), results.appliedStress.sigma2) * 1.1,
                        ]}
                      />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend formatter={(value) => value} />
                      <Scatter name="Failure Envelope" data={results.failureEnvelopeData} fill="#8884d8" line />
                      <Scatter name="Applied Stress State" data={[results.appliedStress]} fill="#ff0000" shape="star" />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="tooltip tooltip-top text-left" data-tip="Tsai-Hill Failure Criterion: (σ₁/X)² - (σ₁ * σ₂) / X² + (σ₂/Y)² + (τ₁₂/S)² = 1; Applied Stress State: (σ₁, σ₂)">
                        The <strong>Tsai-Hill Failure Envelope</strong> represents the boundary in the stress space (σ₁, σ₂) within which the composite material is considered safe under a given shear stress (τ₁₂ = 0 in this plot). Points falling inside the envelope indicate a safe stress state, while points on or outside the envelope indicate incipient or actual failure according to the Tsai-Hill criterion. The red star represents the applied stress state (σ₁, σ₂) on the composite lamina. <IoInformationCircleOutline className="inline-block ml-1" />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default CompositeCalculator;
