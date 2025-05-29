import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { IoClose, IoInformationCircleOutline, IoCheckmarkCircleOutline, IoWarningOutline, IoAddCircleOutline, IoRemoveCircleOutline, IoStar, IoStarOutline, IoSave, IoHeart, IoHeartOutline, IoTrash, IoFolderOpen } from 'react-icons/io5'; // Import icons
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'; // Import Recharts components
import { matrix, multiply, add, subtract, zeros, transpose, inv } from 'mathjs'; // Import specific mathjs functions for matrix operations
import QuickUnitConverter from './components/QuickUnitConverter';

// Define the schema for a single ply
const plySchema = z.object({
  materialName: z.string().min(1, "Material name is required"),
  thickness: z.number().positive("Thickness must be positive"),
  orientation: z.number({ invalid_type_error: "Orientation must be a number" }), // Angle in degrees
});

// Define the schema for material properties (simplified for now, will need expansion)
const materialPropertiesSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  Ef: z.number().positive("Fiber E (Ef) must be positive"),
  vf: z.number().min(0, "Fiber nu (vf) must be non-negative").max(0.5, "Fiber nu (vf) must be <= 0.5"),
  Gf: z.number().positive("Fiber G (Gf) must be positive"),
  Em: z.number().positive("Matrix E (Em) must be positive"),
  vm: z.number().min(0, "Matrix nu (vm) must be non-negative").max(0.5, "Matrix nu (vm) must be <= 0.5"),
  Vf: z.number().min(0, "Fiber Volume Fraction (Vf) must be between 0 and 1").max(1, "Fiber Volume Fraction (Vf) must be between 0 and 1"),
  rhof: z.number().positive("Fiber Density (rhof) must be positive"),
  rhom: z.number().positive("Matrix Density (rhom) must be positive"),
  // Add material strength properties for failure criteria
  Xt: z.number().positive("Longitudinal Tensile Strength (Xt) must be positive"),
  Xc: z.number().positive("Longitudinal Compressive Strength (Xc) must be positive"),
  Yt: z.number().positive("Transverse Tensile Strength (Yt) must be positive"),
  Yc: z.number().positive("Transverse Compressive Strength (Yc) must be positive"),
  S12: z.number().positive("In-plane Shear Strength (S12) must be positive"),
});

// Define the main form schema for the laminate and loads
const formSchema = z.object({
  plies: z.array(plySchema).min(1, "At least one ply is required"),
  materials: z.array(materialPropertiesSchema).min(1, "At least one material is required"),
  N: z.array(z.number({ invalid_type_error: "Load must be a number" })).length(3, "N must have 3 components [Nx, Ny, Nxy]"),
  M: z.array(z.number({ invalid_type_error: "Moment must be a number" })).length(3, "M must have 3 components [Mx, My, Mxy]"),
  deltaT: z.number({ invalid_type_error: "Delta T must be a number" }),
  deltaH: z.number({ invalid_type_error: "Delta H must be a number" }),
  failureCriterion: z.enum(["Maximum Stress", "Tsai-Hill", "Hoffman", "Tsai-Wu"]), // Add failure criterion selection
});

type FormData = z.infer<typeof formSchema>;
type MaterialProperties = z.infer<typeof materialPropertiesSchema>;

// Create an atom to store favorite materials in localStorage
const favoriteMaterialsAtom = atomWithStorage<MaterialProperties[]>('favorite-materials', []);

// Interface for data points in through-thickness profile charts
interface ThroughThicknessPoint {
  z: number; // z-coordinate (e.g., in mm)
  sigma1: number; // Stress in material direction 1 (e.g., MPa)
  sigma2: number; // Stress in material direction 2 (e.g., MPa)
  tau12: number;  // Shear stress in material 1-2 plane (e.g., MPa)
  epsilon1: number; // Strain in material direction 1
  epsilon2: number; // Strain in material direction 2
  gamma12: number; // Shear strain in material 1-2 plane
}

// Define types for results (will be expanded)
interface CalculationResults {
  A: number[][];
  B: number[][];
  D: number[][];
  ABD_inv: number[][]; // Inverse of the [ABD] matrix
  epsilon0: number[]; // Mid-plane strains {ε₀}
  kappa: number[]; // Curvatures {K}
  plyResults: PlyCalculationResult[]; // Stress and strain results for each ply
  fpfResult: FPFResult | null; // First Ply Failure analysis result
  throughThicknessProfile: ThroughThicknessPoint[]; // Data for stress/strain distribution charts
  plyFailureEnvelopes: PlyFailureEnvelopeResult[]; // Failure envelope data for each ply and criterion
  globalFailureEnvelope: {
    maxStressEnvelope: FailureEnvelopePoint[];
    tsaiHillEnvelope: FailureEnvelopePoint[];
    hoffmanEnvelope: FailureEnvelopePoint[];
    tsaiWuEnvelope: FailureEnvelopePoint[];
  }; // Combined failure envelope for the entire laminate
}

interface FailureEnvelopePoint {
  sigma1: number;
  sigma2: number;
}

interface PlyFailureEnvelopeResult {
  plyIndex: number;
  materialName: string;
  // Envelope data for each criterion (tau12 = 0)
  maxStressEnvelope: FailureEnvelopePoint[];
  tsaiHillEnvelope: FailureEnvelopePoint[];
  hoffmanEnvelope: FailureEnvelopePoint[];
  tsaiWuEnvelope: FailureEnvelopePoint[];
  // Applied stress states for this ply
  appliedStressTop: { sigma1: number; sigma2: number };
  appliedStressBottom: { sigma1: number; sigma2: number };
}

interface PlyCalculationResult {
  plyIndex: number;
  materialName: string;
  orientation: number;
  thickness: number;
  z_top: number; // z-coordinate of the top surface of the ply
  z_bottom: number; // z-coordinate of the bottom surface of the ply
  stress_laminate_top: number[]; // Stress in laminate coordinates at top surface
  strain_laminate_top: number[]; // Strain in laminate coordinates at top surface
  stress_material_top: number[]; // Stress in material coordinates at top surface
  strain_material_top: number[]; // Strain in material coordinates at top surface
  stress_laminate_bottom: number[]; // Stress in laminate coordinates at bottom surface
  strain_laminate_bottom: number[]; // Strain in laminate coordinates at bottom surface
  stress_material_bottom: number[]; // Stress in material coordinates at bottom surface
  strain_material_bottom: number[]; // Strain in material coordinates at bottom surface
}

interface FPFResult {
  loadFactor: number;
  failingPlyIndex: number;
  failingLocation: 'top' | 'bottom';
  criterion: string;
  failureMode?: string; // For criteria that predict mode (e.g., Max Stress)
  failureIndex: number; // The index value at failure load factor 1
}

const CompositeStackMaterialCalculator: React.FC = () => {
  const [favoriteMaterials, setFavoriteMaterials] = useAtom(favoriteMaterialsAtom);
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plies: [{ materialName: 'Carbon/Epoxy', thickness: 0.125, orientation: 0 }], // Example default ply
      materials: [{
        name: 'Carbon/Epoxy',
        Ef: 230, // Fiber Young's Modulus (GPa)
        vf: 0.2,  // Fiber Poisson's Ratio
        Gf: 25,   // Fiber Shear Modulus (GPa)
        Em: 3.5,  // Matrix Young's Modulus (GPa)
        vm: 0.35, // Matrix Poisson's Ratio
        Vf: 0.6,  // Fiber Volume Fraction
        rhof: 1.8, // Fiber Density (g/cm^3)
        rhom: 1.2, // Matrix Density (g/cm^3)
        // Default strength values (example values, should be updated by user)
        Xt: 1500, // MPa
        Xc: 1000, // MPa
        Yt: 40, // MPa
        Yc: 150, // MPa
        S12: 60, // MPa
      }], // Example material
      N: [0, 0, 0], // Default applied loads
      M: [0, 0, 0], // Default applied moments
      deltaT: 0, // Default temperature change
      deltaH: 0, // Default humidity change
      failureCriterion: "Maximum Stress", // Default failure criterion
    },
  });

  const { fields: plyFields, append: appendPly, remove: removePly } = useFieldArray({
    control,
    name: "plies"
  });

  const { fields: materialFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({
    control,
    name: "materials"
  });

  const watchedMaterials = watch("materials"); // Watch the materials array for live updates

  const [results, setResults] = React.useState<CalculationResults | null>(null);
  const [isModalState, setIsModalState] = useState(false);
  const [showGlobalEnvelope, setShowGlobalEnvelope] = useState(false);
  const [showFavoritesDropdown, setShowFavoritesDropdown] = useState<number | false>(false);

  // Function to find material properties by name
  const findMaterial = (materialName: string, materials: MaterialProperties[]): MaterialProperties | undefined => {
    return materials.find(mat => mat.name === materialName);
  };

  // Function to save a material to favorites
  const saveMaterialToFavorites = (material: MaterialProperties) => {
    // Check if material with same name already exists in favorites
    const existingIndex = favoriteMaterials.findIndex(mat => mat.name === material.name);
    
    if (existingIndex >= 0) {
      // Update existing material
      const updatedFavorites = [...favoriteMaterials];
      updatedFavorites[existingIndex] = material;
      setFavoriteMaterials(updatedFavorites);
    } else {
      // Add new material to favorites
      setFavoriteMaterials([...favoriteMaterials, material]);
    }
  };
  
  // Function to check if a material is in favorites
  const isInFavorites = (materialName: string): boolean => {
    return favoriteMaterials.some(mat => mat.name === materialName);
  };
  
  // Function to delete a material from favorites
  const deleteFromFavorites = (materialName: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent triggering parent button click
    }
    const updatedFavorites = favoriteMaterials.filter(mat => mat.name !== materialName);
    setFavoriteMaterials(updatedFavorites);
  };

  // Function to apply a favorite material to the form
  const applyFavoriteMaterial = (material: MaterialProperties, index: number) => {
    // Update the material at the specified index
    const updatedMaterials = [...watch('materials')];
    updatedMaterials[index] = material;
    setValue('materials', updatedMaterials);
  };

  // Helper function to calculate the Q matrix for an orthotropic ply
  const getQMatrix = (material: MaterialProperties): number[][] => {
    const { Ef, vf, Gf, Em, vm, Vf } = material;
    const Vm = 1 - Vf; // Matrix Volume Fraction

    // Calculate Matrix Shear Modulus (Gm)
    const Gm = Em / (2 * (1 + vm));

    // Calculate Lamina Engineering Constants using Micromechanics
    // E1 (Longitudinal Young's Modulus) - Rule of Mixtures
    const E1 = Vf * Ef + Vm * Em;

    // v12 (Major Poisson's Ratio) - Rule of Mixtures
    const v12 = Vf * vf + Vm * vm;

    // E2 (Transverse Young's Modulus) - Halpin-Tsai (xi = 2 for circular fibers)
    const eta_E2 = ((Ef / Em) - 1) / ((Ef / Em) + 2); // xi = 2 for E2
    const E2 = Em * ((1 + 2 * Vf * eta_E2) / (1 - Vf * eta_E2));

    // G12 (In-plane Shear Modulus) - Halpin-Tsai (xi = 1)
    const eta_G12 = ((Gf / Gm) - 1) / ((Gf / Gm) + 1); // xi = 1 for G12
    const G12 = Gm * ((1 + 1 * Vf * eta_G12) / (1 - Vf * eta_G12));

    // Now calculate Q matrix components using derived E1, E2, G12, v12
    const v21 = (v12 * E2) / E1; // Calculate v21 using Maxwell's relation
    const denominator = 1 - v12 * v21;

    const Q11 = E1 / denominator;
    const Q12 = (v12 * E2) / denominator;
    const Q22 = E2 / denominator;
    const Q66 = G12;

    return [
      [Q11, Q12, 0],
      [Q12, Q22, 0],
      [0, 0, Q66],
    ];
  };

  // Helper function to calculate the Q-bar matrix (transformed stiffness)
  const getQBarMatrix = (Q: number[][], orientation: number): number[][] => {
    const theta = orientation * (Math.PI / 180); // Convert degrees to radians
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const c2 = c * c;
    const s2 = s * s;
    const cs = c * s;

    // Transformation matrix for strain (T_epsilon)
    const T_epsilon = [
        [c2, s2, cs],
        [s2, c2, -cs],
        [-2 * cs, 2 * cs, c2 - s2]
    ];

    // The inverse of the stress transformation matrix T_sigma is:
     const T_sigma_inv = [
        [c2, s2, -2 * cs],
        [s2, c2, 2 * cs],
        [cs, -cs, c2 - s2]
    ];

    // Q_bar = T_sigma_inv * Q * T_epsilon
    // Using mathjs for matrix operations
    const Q_matrix = matrix(Q);
    const T_sigma_inv_matrix = matrix(T_sigma_inv);
    const T_epsilon_matrix = matrix(T_epsilon);

    const Qbar_matrix = multiply(multiply(T_sigma_inv_matrix, Q_matrix), T_epsilon_matrix);

    return Qbar_matrix.toArray() as number[][];
  };

  // Helper function to calculate thermal and moisture strains in material coordinates
  const getEnvironmentalStrains = (material: MaterialProperties, deltaT: number, deltaH: number): number[] => {
    // const { alpha1, alpha2, beta1, beta2 } = material; // These properties are no longer defined at the material level
    // Strains in material coordinates {ε_T + ε_H} = [α1, α2, 0]^T * ΔT + [β1, β2, 0]^T * ΔH
    
    // Hygrothermal properties (alpha1, alpha2, beta1, beta2) are currently not defined for individual materials.
    // Returning zero strains for now.
    // TODO: Re-evaluate how hygrothermal effects should be handled if required.
    return [
      0, // alpha1 * deltaT + beta1 * deltaH,
      0, // alpha2 * deltaT + beta2 * deltaH,
      0 // Shear strain is typically assumed zero for thermal/moisture expansion
    ];
  };

  // Helper function to transform a strain vector from material to laminate coordinates
  const transformStrainToLaminate = (strain: number[], orientation: number): number[] => {
     const theta = orientation * (Math.PI / 180); // Convert degrees to radians
     const c = Math.cos(theta);
     const s = Math.sin(theta);
     const c2 = c * c;
     const s2 = s * s;
     const cs = c * s;

     // Transformation matrix for strain (T_epsilon)
     const T_epsilon = [
        [c2, s2, cs],
        [s2, c2, -cs],
        [-2 * cs, 2 * cs, c2 - s2]
    ];

    // Strain in laminate coordinates {ε_xy} = T_epsilon * {ε_12}
    const strain_matrix = matrix([[strain[0]], [strain[1]], [strain[2]]]);
    const T_epsilon_matrix = matrix(T_epsilon);

    const strain_laminate_matrix = multiply(T_epsilon_matrix, strain_matrix);

    return (strain_laminate_matrix.toArray() as number[][]).flat(); // Flatten to a 1D array
  };

  // Helper function to transform a stress vector from laminate to material coordinates
   const transformStressToMaterial = (stress: number[], orientation: number): number[] => {
     const theta = orientation * (Math.PI / 180); // Convert degrees to radians
     const c = Math.cos(theta);
     const s = Math.sin(theta);
     const c2 = c * c;
     const s2 = s * s;
     const cs = c * s;

     // Transformation matrix for stress (T_sigma)
     const T_sigma = [
        [c2, s2, 2 * cs],
        [s2, c2, -2 * cs],
        [-cs, cs, c2 - s2]
    ];

    // Stress in material coordinates {σ_12} = T_sigma * {σ_xy}
    const stress_matrix = matrix([[stress[0]], [stress[1]], [stress[2]]]);
    const T_sigma_matrix = matrix(T_sigma);

    const stress_material_matrix = multiply(T_sigma_matrix, stress_matrix);

    return (stress_material_matrix.toArray() as number[][]).flat(); // Flatten to a 1D array
  };

   // Helper function to transform a strain vector from laminate to material coordinates
   const transformStrainToMaterial = (strain: number[], orientation: number): number[] => {
     const theta = orientation * (Math.PI / 180); // Convert degrees to radians
     const c = Math.cos(theta);
     const s = Math.sin(theta);
     const c2 = c * c;
     const s2 = s * s;
     const cs = c * s;

     // Transformation matrix for strain (T_sigma_inverse, which is T_epsilon_transpose)
     const T_epsilon_transpose = [
        [c2, s2, -2 * cs],
        [s2, c2, 2 * cs],
        [cs, -cs, c2 - s2]
    ];

    // Strain in material coordinates {ε_12} = T_epsilon_transpose * {ε_xy}
    const strain_matrix = matrix([[strain[0]], [strain[1]], [strain[2]]]);
    const T_epsilon_transpose_matrix = matrix(T_epsilon_transpose);

    const strain_material_matrix = multiply(T_epsilon_transpose_matrix, strain_matrix);

    return (strain_material_matrix.toArray() as number[][]).flat(); // Flatten to a 1D array
  };

  // --- Failure Criteria Helper Functions ---

  // Maximum Stress Criterion
  const maxStressCriterion = (stress_material: number[], material: MaterialProperties): { index: number, mode?: string } => {
      const [sigma1, sigma2, tau12] = stress_material;
      const { Ef, vf, Gf, Em, vm, Vf, rhof, rhom } = material;

      let index = 0;
      let mode: string | undefined = undefined;

      // Longitudinal Stress (sigma1)
      if (sigma1 > 0) { // Tension
          const tensionIndex = Math.abs(sigma1 / Ef);
          if (tensionIndex > index) {
              index = tensionIndex;
              mode = 'Fiber Tension';
          }
      } else { // Compression
           const compressionIndex = Math.abs(sigma1 / Em); // Em is used for compression
           if (compressionIndex > index) {
               index = compressionIndex;
               mode = 'Fiber Compression';
           }
      }

      // Transverse Stress (sigma2)
      if (sigma2 > 0) { // Tension
          const tensionIndex = Math.abs(sigma2 / Em);
           if (tensionIndex > index) {
               index = tensionIndex;
               mode = 'Matrix Tension';
           }
      } else { // Compression
          const compressionIndex = Math.abs(sigma2 / Em); // Em is used for compression
           if (compressionIndex > index) {
               index = compressionIndex;
               mode = 'Matrix Compression';
           }
      }

      // Shear Stress (tau12)
      const shearIndex = Math.abs(tau12 / Gf);
       if (shearIndex > index) {
           index = shearIndex;
           mode = 'In-plane Shear';
       }

      return { index, mode };
  };

  // Tsai-Hill Criterion
  const tsaiHillCriterion = (stress_material: number[], material: MaterialProperties): { index: number } => {
      const [sigma1, sigma2, tau12] = stress_material;
      const { Ef, vf, Gf, Em, vm, Vf, rhof, rhom } = material;

      // Use appropriate strengths based on stress sign (simplified Tsai-Hill often uses absolute values or assumes X=Y, but PRD mentions different tensile/compressive)
      // For a more accurate Tsai-Hill with different tensile/compressive, a modified form is needed.
      // Let's use the form from the PRD source note: (sigma1/X)^2 - (sigma1 * sigma2) / X^2 + (sigma2/Y)^2 + (tau12/S)^2 = 1
      // Note: The PRD source note formula seems to have a typo in the interaction term (sigma1*sigma2)/X^2.
      // The standard Tsai-Hill for orthotropic materials is:
      // (sigma1/X)^2 - (sigma1*sigma2)/X^2 + (sigma2/Y)^2 + (tau12/S)^2 = 1  <-- This is incorrect, interaction term is different
      // Correct Tsai-Hill for orthotropic materials:
      // (sigma1/X)^2 - (sigma1*sigma2)/(X*Y) + (sigma2/Y)^2 + (tau12/S)^2 = 1  <-- This is also not the most common form
      // The most common form of Tsai-Hill for orthotropic materials is:
      // (sigma1/X)^2 - (sigma1*sigma2)/X_t*X_c + (sigma2/Y)^2 + (tau12/S)^2 = 1  <-- This is also not quite right

      // Let's use the form that accounts for different tensile/compressive strengths as implied by the PRD,
      // which is often a modification of Tsai-Hill or related to criteria like Tsai-Wu or Hoffman.
      // A common approach for Tsai-Hill with different strengths is to use the positive strength for positive stress and negative strength for negative stress.
      const X = sigma1 >= 0 ? Ef : Em;
      const Y = sigma2 >= 0 ? Em : Em;
      const S_val = Gf; // Shear strength is typically the same for positive and negative shear

      // Using the form from the PRD source note, despite potential typo, to match the requirement:
      // (sigma1/X)^2 - (sigma1 * sigma2) / X^2 + (sigma2/Y)^2 + (tau12/S)^2
       const index =
          Math.pow(sigma1 / X, 2) -
          (sigma1 * sigma2) / Math.pow(X, 2) + // Using X^2 as per PRD source note, though this is unusual
          Math.pow(sigma2 / Y, 2) +
          Math.pow(tau12 / S_val, 2);


      return { index };
  };

  // Hoffman Criterion
  const hoffmanCriterion = (stress_material: number[], material: MaterialProperties): { index: number } => {
      const [sigma1, sigma2, tau12] = stress_material;
      const { Ef, vf, Gf, Em, vm, Vf, rhof, rhom } = material;

      // Hoffman criterion: F1*sigma1 + F2*sigma2 + F11*sigma1^2 + F22*sigma2^2 + F66*tau12^2 + F12*sigma1*sigma2 = 1
      // Where coefficients are related to strengths:
      // F1 = 1/XT + 1/Xc
      // F2 = 1/YT + 1/Yc
      // F11 = 1/(XT * Xc)
      // F22 = 1/(YT * Yc)
      // F66 = 1/S^2
      // F12 = -1/(XT * Xc) or determined experimentally (often approximated)

      const F1 = 1/Ef + 1/Em;
      const F2 = 1/Em + 1/Em;
      const F11 = 1/(Ef * Em);
      const F22 = 1/(Em * Em);
      const F66 = 1/(Gf * Gf);
      // Approximating F12 - a common approximation is F12 = -0.5 * sqrt(F11 * F22) or related to Poisson's ratio
      // Let's use a common approximation F12 = -1/(2*Ef*Em) or similar, but the PRD doesn't specify.
      // A simpler approach for implementation based on common forms:
      // (sigma1^2)/(Ef*Em) + (sigma2^2)/(Em*Em) - sigma1*sigma2/(Ef*Em) + tau12^2/Gf^2 + (1/Ef + 1/Em)*sigma1 + (1/Em + 1/Em)*sigma2 = 1
      // Let's use the form: F1(sigma1) + F2(sigma2) + F11(sigma1^2) + F22(sigma2^2) + F66(tau12^2) + F12(sigma1*sigma2) = 1
      // With F12 often taken as -1/(Ef*Em) or similar. Without a specified F12, we might omit the interaction term or use a common approximation.
      // Let's use the form: (sigma1^2)/(Ef*Em) + (sigma2^2)/(Em*Em) + (tau12^2)/Gf^2 + (1/Ef + 1/Em)*sigma1 + (1/Em + 1/Em)*sigma2 = 1 (omitting F12*sigma1*sigma2)
      // This is a simplified Hoffman. The full Hoffman includes the F12 term.

      const term1 = Math.pow(sigma1, 2) / (Ef * Em);
      const term2 = Math.pow(sigma2, 2) / (Em * Em);
      const term3 = Math.pow(tau12, 2) / (Gf * Gf);
      const term4 = (1/Ef + 1/Em) * sigma1;
      const term5 = (1/Em + 1/Em) * sigma2;

      const index = term1 + term2 + term3 + term4 + term5; // Omitting F12*sigma1*sigma2

      return { index };
  };

  // Tsai-Wu Criterion
  const tsaiWuCriterion = (stress_material: number[], material: MaterialProperties): { index: number } => {
      const [sigma1, sigma2, tau12] = stress_material;
      const { Ef, vf, Gf, Em, vm, Vf, rhof, rhom } = material;

      // Tsai-Wu criterion: F_i*sigma_i + F_ij*sigma_i*sigma_j = 1 (using Einstein summation)
      // For plane stress (1, 2, 6): F1*sigma1 + F2*sigma2 + F6*tau12 + F11*sigma1^2 + F22*sigma2^2 + F66*tau12^2 + 2*F12*sigma1*sigma2 = 1
      // F1 = 1/Ef + 1/Em
      // F2 = 1/Em + 1/Em
      // F6 = 0 (assuming symmetric shear strength)
      // F11 = 1/(Ef * Em)
      // F22 = 1/(Em * Em)
      // F66 = 1/(Gf * Gf)
      // F12 needs to be determined experimentally (biaxial testing). Often approximated.
      // A common approximation for F12 is F12 = -0.5 * sqrt(F11 * F22)

      const F1 = 1/Ef + 1/Em;
      const F2 = 1/Em + 1/Em;
      const F11 = 1/(Ef * Em);
      const F22 = 1/(Em * Em);
      const F66 = 1/(Gf * Gf);
      // Approximating F12 as -0.5 * sqrt(F11 * F22)
      const F12 = -0.5 * Math.sqrt(F11 * F22);


      const index =
          F1 * sigma1 +
          F2 * sigma2 +
          F11 * Math.pow(sigma1, 2) +
          F22 * Math.pow(sigma2, 2) +
          F66 * Math.pow(tau12, 2) +
          2 * F12 * sigma1 * sigma2;

      return { index };
  };

  interface FailureEnvelopePoint {
    sigma1: number;
    sigma2: number;
  }

  // --- Failure Envelope Helper Functions (tau12 = 0) ---

  // Calculate points for the Maximum Stress failure envelope (tau12 = 0)
  const getMaxStressEnvelope = (material: MaterialProperties): FailureEnvelopePoint[] => {
    const { Xt, Xc, Yt, Yc, S12 } = material;
    const envelopePoints: FailureEnvelopePoint[] = [];
    
    // Sample points around the envelope
    // We'll use a parametric approach with angles from 0 to 2π
    envelopePoints.push({ sigma1: Xt, sigma2: Yt });
    envelopePoints.push({ sigma1: -Xc, sigma2: Yt });
    envelopePoints.push({ sigma1: -Xc, sigma2: -Yc });
    envelopePoints.push({ sigma1: Xt, sigma2: -Yc });
    envelopePoints.push({ sigma1: Xt, sigma2: Yt }); // Close the loop

    return envelopePoints;
  };

  // Calculate points for the Tsai-Hill failure envelope (tau12 = 0)
  const getTsaiHillEnvelope = (material: MaterialProperties): FailureEnvelopePoint[] => {
      const { Xt, Xc, Yt, Yc } = material;
      const envelopePoints: FailureEnvelopePoint[] = [];
      const numPoints = 100; // Number of points to generate for the ellipse

      // Use appropriate strengths for each quadrant
      const getX = (sigma1: number) => sigma1 >= 0 ? Xt : Xc;
      const getY = (sigma2: number) => sigma2 >= 0 ? Yt : Yc;

      // Iterate through angles to generate points on the ellipse
      for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * 2 * Math.PI;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          // Solve the Tsai-Hill equation for sigma1 and sigma2 with tau12 = 0
          // (sigma1/X)^2 - (sigma1 * sigma2) / X^2 + (sigma2/Y)^2 = 1
          // Parameterize using sigma1 = r * cos(angle) and sigma2 = r * sin(angle)
          // r^2 * (cos^2/X^2 - cos*sin/X^2 + sin^2/Y^2) = 1
          // r = 1 / sqrt(cos^2/X^2 - cos*sin/X^2 + sin^2/Y^2)

          const X = getX(cos); // Use strength based on the sign of the projected stress
          const Y = getY(sin); // Use strength based on the sign of the projected stress

          const denominator = (cos * cos) / (X * X) - (cos * sin) / (X * X) + (sin * sin) / (Y * Y);

          if (denominator > 1e-9) { // Avoid division by zero or near-zero
              const r = 1 / Math.sqrt(denominator);
              envelopePoints.push({ sigma1: r * cos, sigma2: r * sin });
          }

      }
      return envelopePoints;
  };

  // Calculate points for the Hoffman failure envelope (tau12 = 0)
  const getHoffmanEnvelope = (material: MaterialProperties): FailureEnvelopePoint[] => {
    const { Xt, Xc, Yt, Yc } = material;
    const envelopePoints: FailureEnvelopePoint[] = [];
    const numPoints = 100;

    const F1 = 1/Xt - 1/Xc;
    const F2 = 1/Yt - 1/Yc;
    const F11 = 1/(Xt * Xc);
    const F22 = 1/(Yt * Yc);
    // F12 needs to be determined experimentally. Using a common approximation.
    const F12 = -0.5 * Math.sqrt(F11 * F22); // Approximation

    // Hoffman criterion (tau12 = 0): F1*sigma1 + F2*sigma2 + F11*sigma1^2 + F22*sigma2^2 + F12*sigma1*sigma2 = 1
    // This is a quadratic form in sigma1 and sigma2.
    // To plot the envelope, we can iterate through sigma1 values and solve for sigma2, or iterate through angles.
    // Iterating through angles is generally more reliable for plotting ellipses/quadratics.
    // Let sigma1 = r * cos(angle), sigma2 = r * sin(angle)
    // F1*r*cos + F2*r*sin + F11*r^2*cos^2 + F22*r^2*sin^2 + F12*r^2*cos*sin = 1
    // r^2 * (F11*cos^2 + F22*sin^2 + F12*cos*sin) + r * (F1*cos + F2*sin) - 1 = 0
    // This is a quadratic equation in r: A*r^2 + B*r + C = 0, where
    // A = F11*cos^2 + F22*sin^2 + F12*cos*sin
    // B = F1*cos + F2*sin
    // C = -1

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const A = F11 * cos * cos + F22 * sin * sin + F12 * cos * sin;
      const B = F1 * cos + F2 * sin;
      const C = -1;

      // Solve for r using the quadratic formula: r = (-B ± sqrt(B^2 - 4AC)) / 2A
      const discriminant = B * B - 4 * A * C;

      if (discriminant >= 0) {
        const r1 = (-B + Math.sqrt(discriminant)) / (2 * A);
        const r2 = (-B - Math.sqrt(discriminant)) / (2 * A);

        // Choose the positive root for the envelope
        const r = Math.max(r1, r2);

        if (!isNaN(r) && isFinite(r)) {
          envelopePoints.push({ sigma1: r * cos, sigma2: r * sin });
        }
      }
    }
    
    return envelopePoints;
  };

  // Calculate points for the Tsai-Wu failure envelope (tau12 = 0)
  const getTsaiWuEnvelope = (material: MaterialProperties): FailureEnvelopePoint[] => {
    const { Xt, Xc, Yt, Yc, S12 } = material;
    const envelopePoints: FailureEnvelopePoint[] = [];
    const numPoints = 100;

    // Tsai-Wu parameters
    const F1 = 1/Xt - 1/Xc;
    const F2 = 1/Yt - 1/Yc;
    const F11 = 1/(Xt * Xc);
    const F22 = 1/(Yt * Yc);
    const F66 = 1/(S12 * S12);
    // F12 needs to be determined experimentally. Using a common approximation.
    const F12 = -0.5 * Math.sqrt(F11 * F22); // Approximation

    // Tsai-Wu criterion (tau12 = 0): F1*sigma1 + F2*sigma2 + F11*sigma1^2 + F22*sigma2^2 + F12*sigma1*sigma2 = 1
    // This is a quadratic form in sigma1 and sigma2.
    // To plot the envelope, we can iterate through angles.
    // Let sigma1 = r * cos(angle), sigma2 = r * sin(angle)
    // F1*r*cos + F2*r*sin + F11*r^2*cos^2 + F22*r^2*sin^2 + F12*r^2*cos*sin = 1
    // r^2 * (F11*cos^2 + F22*sin^2 + F12*cos*sin) + r * (F1*cos + F2*sin) - 1 = 0
    // This is a quadratic equation in r: A*r^2 + B*r + C = 0, where
    // A = F11*cos^2 + F22*sin^2 + F12*cos*sin
    // B = F1*cos + F2*sin
    // C = -1

    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const A = F11 * cos * cos + F22 * sin * sin + F12 * cos * sin;
      const B = F1 * cos + F2 * sin;
      const C = -1;

      // Solve for r using the quadratic formula: r = (-B ± sqrt(B^2 - 4AC)) / 2A
      const discriminant = B * B - 4 * A * C;

      if (discriminant >= 0) {
        const r1 = (-B + Math.sqrt(discriminant)) / (2 * A);
        const r2 = (-B - Math.sqrt(discriminant)) / (2 * A);

        // Choose the positive root for the envelope
        const r = Math.max(r1, r2);

        if (!isNaN(r) && isFinite(r)) {
          envelopePoints.push({ sigma1: r * cos, sigma2: r * sin });
        }
      }
    }
    
    return envelopePoints;
  };

  // Main function to calculate laminate properties
  const calculateLaminateProperties = (data: FormData): CalculationResults => {
    console.log("Calculating laminate properties with data:", data);

    // ... (rest of the code remains the same)
    const numPlies = data.plies.length;
    let totalThickness = 0;
    data.plies.forEach(ply => {
      totalThickness += ply.thickness;
    });

    // Calculate z coordinates for each ply interface
    const z_coords: number[] = [];
    let current_z = -totalThickness / 2;
    z_coords.push(current_z);
    data.plies.forEach(ply => {
      current_z += ply.thickness;
      z_coords.push(current_z);
    });

    // Initialize A, B, D matrices (3x3)
    let A = (zeros(3, 3) as any).toArray() as number[][];
    let B = (zeros(3, 3) as any).toArray() as number[][];
    let D = (zeros(3, 3) as any).toArray() as number[][];

    // Initialize equivalent environmental load vectors
    let NT = (zeros(3, 1) as any).toArray() as number[][];
    let MT = (zeros(3, 1) as any).toArray() as number[][];
    let NH = (zeros(3, 1) as any).toArray() as number[][];
    let MH = (zeros(3, 1) as any).toArray() as number[][];

    // Initialize through-thickness profile data
    const throughThicknessProfile: ThroughThicknessPoint[] = [];
    const plyFailureEnvelopes: PlyFailureEnvelopeResult[] = []; // Initialize array for failure envelopes

    // Iterate through plies (k from 1 to N)
    for (let k = 0; k < numPlies; k++) {
      const ply = data.plies[k];
      const materialFound = findMaterial(ply.materialName, data.materials);

      if (!materialFound) {
        console.error(`Material "${ply.materialName}" not found.`);
        continue;
      }

      // Calculate failure envelope data for the current ply's material
      const maxStressEnvelope = getMaxStressEnvelope(materialFound);
      const tsaiHillEnvelope = getTsaiHillEnvelope(materialFound);
      const hoffmanEnvelope = getHoffmanEnvelope(materialFound);
      const tsaiWuEnvelope = getTsaiWuEnvelope(materialFound);

      // Store applied stress states for this ply (will be populated later in the loop)
      let appliedStressTop: { sigma1: number; sigma2: number } = { sigma1: 0, sigma2: 0 };
      let appliedStressBottom: { sigma1: number; sigma2: number } = { sigma1: 0, sigma2: 0 };
      
      // Store the failure envelope data for this ply
      plyFailureEnvelopes.push({
        plyIndex: k,
        materialName: ply.materialName,
        maxStressEnvelope,
        tsaiHillEnvelope,
        hoffmanEnvelope,
        tsaiWuEnvelope,
        appliedStressTop,
        appliedStressBottom
      });

      const material = findMaterial(ply.materialName, data.materials);

      if (!material) {
        console.error(`Material "${ply.materialName}" not found.`);
        continue;
      }

      const Q = getQMatrix(material);
      const Qbar = getQBarMatrix(Q, ply.orientation);

      const hk = z_coords[k + 1]; // Top surface z-coordinate of ply k
      const hk_1 = z_coords[k]; // Bottom surface z-coordinate of ply k

      // Calculate contributions to A, B, D
      const delta_h = hk - hk_1; // Ply thickness (should be equal to ply.thickness)
      const h_avg = (hk + hk_1) / 2; // Mid-plane z-coordinate of ply k

      // A_k = Qbar * (h_k - h_{k-1})
      // B_k = (1/2) * Qbar * (h_k^2 - h_{k-1}^2)
      // D_k = (1/3) * Qbar * (h_k^3 - h_{k-1}^3)

      const Qbar_matrix = matrix(Qbar);

      const Ak = (multiply(Qbar_matrix, delta_h) as any).toArray() as number[][];
      const Bk = (multiply(Qbar_matrix, 0.5 * (Math.pow(hk, 2) - Math.pow(hk_1, 2))) as any).toArray() as number[][];
      const Dk = (multiply(Qbar_matrix, (1/3) * (Math.pow(hk, 3) - Math.pow(hk_1, 3))) as any).toArray() as number[][];

      // Sum contributions
      A = (add(matrix(A), matrix(Ak)) as any).toArray() as number[][];
      B = (add(matrix(B), matrix(Bk)) as any).toArray() as number[][];
      D = (add(matrix(D), matrix(Dk)) as any).toArray() as number[][];

      // Calculate environmental strains for the current ply
      const environmentalStrains_material = getEnvironmentalStrains(material, data.deltaT, data.deltaH);
      const environmentalStrains_laminate = transformStrainToLaminate(environmentalStrains_material, ply.orientation);
      const environmentalStrains_laminate_matrix = transpose(matrix([environmentalStrains_laminate])) as any; // Column vector {ex_env, ey_env, gxy_env}

      // Calculate contributions to environmental loads
      // N_env_k = Qbar * epsilon_env_laminate * (h_k - h_{k-1})
      // M_env_k = Qbar * epsilon_env_laminate * (1/2) * (h_k^2 - h_{k-1}^2)

      const N_env_k = (multiply(Qbar_matrix, environmentalStrains_laminate_matrix, delta_h) as any).toArray() as number[][];
      const M_env_k = (multiply(Qbar_matrix, environmentalStrains_laminate_matrix, 0.5 * (Math.pow(hk, 2) - Math.pow(hk_1, 2))) as any).toArray() as number[][];

      // Sum environmental load contributions (assuming NT and NH are combined, same for MT and MH)
      NT = (add(matrix(NT), matrix(N_env_k)) as any).toArray() as number[][];
      MT = (add(matrix(MT), matrix(M_env_k)) as any).toArray() as number[][];
    }

    // Combine A, B, D into the [ABD] matrix (6x6)
    const ABD = [
      [...A[0], ...B[0]],
      [...A[1], ...B[1]],
      [...A[2], ...B[2]],
      [...B[0], ...D[0]],
      [...B[1], ...D[1]],
      [...B[2], ...D[2]],
    ];

    // Combine applied mechanical loads and moments into a single vector (6x1)
    const mechanicalLoads = [
      [data.N[0]],
      [data.N[1]],
      [data.N[2]],
      [data.M[0]],
      [data.M[1]],
      [data.M[2]],
    ];

    // Combine environmental loads into a single vector (6x1)
     const environmentalLoads = [
      [NT[0][0]],
      [NT[1][0]],
      [NT[2][0]],
      [MT[0][0]],
      [MT[1][0]],
      [MT[2][0]],
    ];

    // Calculate effective loads {N*} = {N_applied} - {N_environmental}
    const effectiveLoads = (subtract(matrix(mechanicalLoads), matrix(environmentalLoads)) as any).toArray() as number[][];

    // Calculate the inverse of the [ABD] matrix
    const ABD_matrix = matrix(ABD);
    let ABD_inv: number[][] = [];
    try {
        const ABD_inv_matrix = inv(ABD_matrix);
        ABD_inv = (ABD_inv_matrix as any).toArray() as number[][];
    } catch (e) {
        console.error("Matrix inversion failed:", e);
        // Handle singular matrix case - perhaps set results to null or show an error message
        // For now, return empty matrices and vectors
         return {
            A,
            B,
            D,
            ABD_inv: (zeros(6, 6) as any).toArray() as number[][],
            epsilon0: (zeros(3, 1) as any).toArray() as number[],
            kappa: (zeros(3, 1) as any).toArray() as number[],
            plyResults: [],
            fpfResult: null,
            throughThicknessProfile: [],
            plyFailureEnvelopes: [],
            globalFailureEnvelope: {
              maxStressEnvelope: [],
              tsaiHillEnvelope: [],
              hoffmanEnvelope: [],
              tsaiWuEnvelope: []
            }
        };
    }

    // Calculate mid-plane strains {ε₀} and curvatures {K}
    // { ε₀ }   [ A  B ]^-1 { N* }
    // { K  } = [ B  D ]    { M* }
    const strain_curvature_vector = (multiply(matrix(ABD_inv), matrix(effectiveLoads)) as any).toArray() as number[][];

    // Extract epsilon0 and kappa
    const epsilon0 = strain_curvature_vector.slice(0, 3).flat();
    const kappa = strain_curvature_vector.slice(3, 6).flat();

    // --- Stress and Strain Analysis per Ply ---
    const plyResults: PlyCalculationResult[] = [];

    for (let k = 0; k < numPlies; k++) {
        const ply = data.plies[k];
        const material = findMaterial(ply.materialName, data.materials);

        if (!material) {
            console.error(`Material "${ply.materialName}" not found.`);
            continue;
        }

        const Q = getQMatrix(material);
        const Qbar = getQBarMatrix(Q, ply.orientation);
        const T_sigma = [ // Stress transformation matrix from laminate to material
            [Math.cos(ply.orientation * (Math.PI / 180))**2, Math.sin(ply.orientation * (Math.PI / 180))**2, 2 * Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180))],
            [Math.sin(ply.orientation * (Math.PI / 180))**2, Math.cos(ply.orientation * (Math.PI / 180))**2, -2 * Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180))],
            [-Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180)), Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180)), Math.cos(ply.orientation * (Math.PI / 180))**2 - Math.sin(ply.orientation * (Math.PI / 180))**2]
        ];
         const T_epsilon = [ // Strain transformation matrix from material to laminate
            [Math.cos(ply.orientation * (Math.PI / 180))**2, Math.sin(ply.orientation * (Math.PI / 180))**2, Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180))],
            [Math.sin(ply.orientation * (Math.PI / 180))**2, Math.cos(ply.orientation * (Math.PI / 180))**2, -Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180))],
            [-2 * Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180)), 2 * Math.cos(ply.orientation * (Math.PI / 180)) * Math.sin(ply.orientation * (Math.PI / 180)), Math.cos(ply.orientation * (Math.PI / 180))**2 - Math.sin(ply.orientation * (Math.PI / 180))**2]
        ];

        const Qbar_matrix = matrix(Qbar);
        const T_sigma_matrix = matrix(T_sigma);
        const T_epsilon_matrix = matrix(T_epsilon);

        const z_top = z_coords[k + 1];
        const z_bottom = z_coords[k];

        // Calculate strain and stress at top and bottom surfaces
        const locations = [
            { z: z_top, surface: 'top' as 'top' | 'bottom' },
            { z: z_bottom, surface: 'bottom' as 'top' | 'bottom' },
        ];

        const plyResult: Partial<PlyCalculationResult> = {
            plyIndex: k,
            materialName: ply.materialName,
            orientation: ply.orientation,
            thickness: ply.thickness,
            z_top,
            z_bottom,
        };

        const environmentalStrains_material = getEnvironmentalStrains(material, data.deltaT, data.deltaH);
        const environmentalStrains_laminate = transformStrainToLaminate(environmentalStrains_material, ply.orientation);
        const environmentalStrains_laminate_matrix = transpose(matrix([environmentalStrains_laminate])) as any; // Column vector {ex_env, ey_env, gxy_env}

        for (const location of locations) {
            const z = location.z;

            // Total strain in laminate coordinates {ε(z)} = {ε₀} + z * {K}
            const epsilon0_matrix = matrix([[epsilon0[0]], [epsilon0[1]], [epsilon0[2]]]);
            const kappa_matrix = matrix([[kappa[0]], [kappa[1]], [kappa[2]]]);

            const totalStrain_laminate_matrix = (add(epsilon0_matrix, multiply(z, kappa_matrix)) as any).toArray() as number[][];
            const totalStrain_laminate = totalStrain_laminate_matrix.flat();

            // Mechanical strain in laminate coordinates {ε_mech(z)} = {ε(z)} - {ε_environmental_laminate}
            const mechanicalStrain_laminate_matrix = (subtract(transpose(matrix([totalStrain_laminate])) as any, environmentalStrains_laminate_matrix) as any).toArray() as number[][];
            const mechanicalStrain_laminate = mechanicalStrain_laminate_matrix.flat();

            // Stress in laminate coordinates {σ(z)} = [Q-bar] * {ε_mech(z)}
            const stress_laminate_matrix = (multiply(Qbar_matrix, transpose(matrix([mechanicalStrain_laminate])) as any) as any).toArray() as number[][];
            const stress_laminate = stress_laminate_matrix.flat();

            // Transform total strain to material coordinates {ε_12(z)} = T_sigma * {ε_xy(z)}
            const totalStrain_laminate_matrix_col = transpose(matrix([totalStrain_laminate])) as any;
            const totalStrain_material_matrix = (multiply(T_sigma_matrix, totalStrain_laminate_matrix_col) as any).toArray() as number[][];
            const totalStrain_material = totalStrain_material_matrix.flat();

            // Transform stress to material coordinates {σ_12(z)} = T_sigma * {σ_xy(z)}
            const stress_laminate_matrix_col = transpose(matrix([stress_laminate])) as any;
            const stress_material_matrix = (multiply(T_sigma_matrix, stress_laminate_matrix_col) as any).toArray() as number[][];
            const stress_material = stress_material_matrix.flat();

            if (location.surface === 'top') {
                plyResult.stress_laminate_top = stress_laminate;
                plyResult.strain_laminate_top = totalStrain_laminate;
                plyResult.stress_material_top = stress_material;
                plyResult.strain_material_top = totalStrain_material;
                
                // Update applied stress state for the top surface in the failure envelope data
                const envelopeData = plyFailureEnvelopes.find(env => env.plyIndex === k);
                if (envelopeData) {
                  envelopeData.appliedStressTop = { 
                    sigma1: stress_material[0], 
                    sigma2: stress_material[1] 
                  };
                }
            } else { // bottom
                plyResult.stress_laminate_bottom = stress_laminate;
                plyResult.strain_laminate_bottom = totalStrain_laminate;
                plyResult.stress_material_bottom = stress_material;
                plyResult.strain_material_bottom = totalStrain_material;
                
                // Update applied stress state for the bottom surface in the failure envelope data
                const envelopeData = plyFailureEnvelopes.find(env => env.plyIndex === k);
                if (envelopeData) {
                  envelopeData.appliedStressBottom = { 
                    sigma1: stress_material[0], 
                    sigma2: stress_material[1] 
                  };
                }
            }
        }

        // Populate data for through-thickness profile charts
        // Ensure these are in material coordinates as intended for the chart
        if (plyResult.stress_material_bottom && plyResult.strain_material_bottom) {
            throughThicknessProfile.push({
                z: plyResult.z_bottom!,
                sigma1: plyResult.stress_material_bottom[0],
                sigma2: plyResult.stress_material_bottom[1],
                tau12: plyResult.stress_material_bottom[2],
                epsilon1: plyResult.strain_material_bottom[0],
                epsilon2: plyResult.strain_material_bottom[1],
                gamma12: plyResult.strain_material_bottom[2],
            });
        }
        if (plyResult.stress_material_top && plyResult.strain_material_top) {
            throughThicknessProfile.push({
                z: plyResult.z_top!,
                sigma1: plyResult.stress_material_top[0],
                sigma2: plyResult.stress_material_top[1],
                tau12: plyResult.stress_material_top[2],
                epsilon1: plyResult.strain_material_top[0],
                epsilon2: plyResult.strain_material_top[1],
                gamma12: plyResult.strain_material_top[2],
            });
        }

        plyResults.push(plyResult as PlyCalculationResult);
    }

    // Sort the profile by z-coordinate to ensure lines are drawn correctly
    throughThicknessProfile.sort((a, b) => a.z - b.z);

    // --- First Ply Failure Analysis ---
    let minLoadFactor = Infinity;
    let fpfResult: FPFResult | null = null;

    const selectedCriterion = data.failureCriterion;

    for (const plyResult of plyResults) {
        const material = findMaterial(plyResult.materialName, data.materials);

        if (!material) continue; // Should not happen due to earlier check

        const locations = [
            { stress_material: plyResult.stress_material_top, surface: 'top' as 'top' | 'bottom' },
            { stress_material: plyResult.stress_material_bottom, surface: 'bottom' as 'top' | 'bottom' },
        ];

        for (const location of locations) {
            const stress_material = location.stress_material;
            let failureIndex = 0;
            let failureMode: string | undefined = undefined;
            let criterionName = selectedCriterion;

            switch (selectedCriterion) {
                case "Maximum Stress":
                    const maxStress = maxStressCriterion(stress_material, material);
                    failureIndex = maxStress.index;
                    failureMode = maxStress.mode;
                    break;
                case "Tsai-Hill":
                    failureIndex = tsaiHillCriterion(stress_material, material).index;
                    break;
                case "Hoffman":
                    failureIndex = hoffmanCriterion(stress_material, material).index;
                    break;
                case "Tsai-Wu":
                    failureIndex = tsaiWuCriterion(stress_material, material).index;
                    break;
            }

            if (failureIndex > 1e-9) { // Check if failure is predicted (index > 0, allowing for floating point inaccuracies)
                const loadFactor = 1 / Math.sqrt(failureIndex); // For quadratic criteria, alpha = 1/sqrt(Index)
                                                              // For linear criteria (like Max Stress components), alpha = 1/abs(stress/strength)
                                                              // The index calculation for Max Stress already gives the ratio, so alpha = 1/index

                let currentLoadFactor;
                 if (selectedCriterion === "Maximum Stress") {
                     currentLoadFactor = 1 / failureIndex;
                 } else {
                     currentLoadFactor = 1 / Math.sqrt(failureIndex);
                 }

                if (currentLoadFactor < minLoadFactor) {
                    minLoadFactor = currentLoadFactor;
                    fpfResult = {
                        loadFactor: minLoadFactor,
                        failingPlyIndex: plyResult.plyIndex,
                        failingLocation: location.surface,
                        criterion: criterionName,
                        failureMode: failureMode,
                        failureIndex: failureIndex,
                    };
                }
            }
        }
    }

    // Calculate global failure envelope based on the most conservative values from all plies
    // For each failure criterion, find the most restrictive envelope
    const globalMaxStressEnvelope: FailureEnvelopePoint[] = [];
    const globalTsaiHillEnvelope: FailureEnvelopePoint[] = [];
    const globalHoffmanEnvelope: FailureEnvelopePoint[] = [];
    const globalTsaiWuEnvelope: FailureEnvelopePoint[] = [];
    
    // Generate a set of angles to sample the envelopes
    const envelopePoints = 72; // Sample at 5-degree intervals
    for (let i = 0; i < envelopePoints; i++) {
      const angle = (i * 2 * Math.PI) / envelopePoints;
      
      // Initialize with large values
      let minMaxStressRadius = Number.MAX_VALUE;
      let minTsaiHillRadius = Number.MAX_VALUE;
      let minHoffmanRadius = Number.MAX_VALUE;
      let minTsaiWuRadius = Number.MAX_VALUE;
      
      // Find the minimum radius at this angle across all plies
      for (const plyEnvelope of plyFailureEnvelopes) {
        // For each envelope type, find the radius at this angle
        for (const point of plyEnvelope.maxStressEnvelope) {
          const pointAngle = Math.atan2(point.sigma2, point.sigma1);
          const angleDiff = Math.abs(((pointAngle - angle + Math.PI) % (2 * Math.PI)) - Math.PI);
          if (angleDiff < 0.1) { // Approximate match within ~5 degrees
            const radius = Math.sqrt(point.sigma1 * point.sigma1 + point.sigma2 * point.sigma2);
            minMaxStressRadius = Math.min(minMaxStressRadius, radius);
          }
        }
        
        for (const point of plyEnvelope.tsaiHillEnvelope) {
          const pointAngle = Math.atan2(point.sigma2, point.sigma1);
          const angleDiff = Math.abs(((pointAngle - angle + Math.PI) % (2 * Math.PI)) - Math.PI);
          if (angleDiff < 0.1) {
            const radius = Math.sqrt(point.sigma1 * point.sigma1 + point.sigma2 * point.sigma2);
            minTsaiHillRadius = Math.min(minTsaiHillRadius, radius);
          }
        }
        
        for (const point of plyEnvelope.hoffmanEnvelope) {
          const pointAngle = Math.atan2(point.sigma2, point.sigma1);
          const angleDiff = Math.abs(((pointAngle - angle + Math.PI) % (2 * Math.PI)) - Math.PI);
          if (angleDiff < 0.1) {
            const radius = Math.sqrt(point.sigma1 * point.sigma1 + point.sigma2 * point.sigma2);
            minHoffmanRadius = Math.min(minHoffmanRadius, radius);
          }
        }
        
        for (const point of plyEnvelope.tsaiWuEnvelope) {
          const pointAngle = Math.atan2(point.sigma2, point.sigma1);
          const angleDiff = Math.abs(((pointAngle - angle + Math.PI) % (2 * Math.PI)) - Math.PI);
          if (angleDiff < 0.1) {
            const radius = Math.sqrt(point.sigma1 * point.sigma1 + point.sigma2 * point.sigma2);
            minTsaiWuRadius = Math.min(minTsaiWuRadius, radius);
          }
        }
      }
      
      // Add the points to the global envelopes
      if (minMaxStressRadius !== Number.MAX_VALUE) {
        globalMaxStressEnvelope.push({
          sigma1: minMaxStressRadius * Math.cos(angle),
          sigma2: minMaxStressRadius * Math.sin(angle)
        });
      }
      
      if (minTsaiHillRadius !== Number.MAX_VALUE) {
        globalTsaiHillEnvelope.push({
          sigma1: minTsaiHillRadius * Math.cos(angle),
          sigma2: minTsaiHillRadius * Math.sin(angle)
        });
      }
      
      if (minHoffmanRadius !== Number.MAX_VALUE) {
        globalHoffmanEnvelope.push({
          sigma1: minHoffmanRadius * Math.cos(angle),
          sigma2: minHoffmanRadius * Math.sin(angle)
        });
      }
      
      if (minTsaiWuRadius !== Number.MAX_VALUE) {
        globalTsaiWuEnvelope.push({
          sigma1: minTsaiWuRadius * Math.cos(angle),
          sigma2: minTsaiWuRadius * Math.sin(angle)
        });
      }
    }
    
    // Sort the envelope points by angle for proper rendering
    globalMaxStressEnvelope.sort((a, b) => Math.atan2(a.sigma2, a.sigma1) - Math.atan2(b.sigma2, b.sigma1));
    globalTsaiHillEnvelope.sort((a, b) => Math.atan2(a.sigma2, a.sigma1) - Math.atan2(b.sigma2, b.sigma1));
    globalHoffmanEnvelope.sort((a, b) => Math.atan2(a.sigma2, a.sigma1) - Math.atan2(b.sigma2, b.sigma1));
    globalTsaiWuEnvelope.sort((a, b) => Math.atan2(a.sigma2, a.sigma1) - Math.atan2(b.sigma2, b.sigma1));
    
    return {
      A,
      B,
      D,
      ABD_inv,
      epsilon0,
      kappa,
      plyResults,
      fpfResult,
      throughThicknessProfile,
      plyFailureEnvelopes,
      globalFailureEnvelope: {
        maxStressEnvelope: globalMaxStressEnvelope,
        tsaiHillEnvelope: globalTsaiHillEnvelope,
        hoffmanEnvelope: globalHoffmanEnvelope,
        tsaiWuEnvelope: globalTsaiWuEnvelope
      }
    };
  };

  const onSubmit = (data: FormData) => {
    // Basic validation check for material names in plies
    for (const ply of data.plies) {
      if (!findMaterial(ply.materialName, data.materials)) {
        alert(`Material "${ply.materialName}" not found.`);
        return;
      }
    }

    const calculatedResults = calculateLaminateProperties(data);
    setResults(calculatedResults);
    setIsModalState(true); // Open the modal on submit
  };

  return (
    <div className="card bg-base-100 border my-8 p-4 sm:p-6">
      <div className="card-body p-0">
        <h2 className="card-title text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Composite Stack Material Calculator</h2>
        <p className="mb-6 text-center sm:text-left">
          Define your composite laminate stack-up by adding plies with specified materials, thicknesses, and orientations.
          Define the properties of the materials used in the stack.
          Then, apply mechanical loads, moments, and environmental changes to analyze the laminate's stiffness and predict first ply failure.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Unit Conversion Utility - Expandable */}
          <div className="collapse collapse-arrow bg-base-200 mb-6">
            <input type="checkbox" />
            <div className="collapse-title text-md sm:text-lg font-semibold">
              Quick Unit Converter
            </div>
            <div className="collapse-content">
              <QuickUnitConverter />
            </div>
          </div>

          {/* Material Database Management */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold pb-2">Material Properties Database</h3>
            {materialFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Material {index + 1}</h4>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      className="btn btn-sm btn-circle btn-ghost text-success tooltip tooltip-left flex items-center justify-center" 
                      onClick={() => saveMaterialToFavorites(watch(`materials.${index}`))} 
                      data-tip={isInFavorites(watch(`materials.${index}.name`)) ? "Update in favorites" : "Save to favorites"}
                    >
                      {isInFavorites(watch(`materials.${index}.name`)) ? 
                        <IoStar className="w-5 h-5 flex-shrink-0 text-yellow-500" /> : 
                        <IoStarOutline className="w-5 h-5 flex-shrink-0" />}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-circle btn-ghost text-primary tooltip tooltip-left flex items-center justify-center" 
                      onClick={() => setShowFavoritesDropdown(prev => prev === index ? false : index)}
                      data-tip="Load from favorites"
                    >
                      <IoFolderOpen className="w-5 h-5 flex-shrink-0" />
                    </button>
                    <button type="button" className="btn btn-sm btn-circle btn-ghost flex items-center justify-center" onClick={() => removeMaterial(index)}>
                      <IoRemoveCircleOutline className="w-5 h-5 flex-shrink-0" />
                    </button>
                  </div>
                  
                  {/* Favorites dropdown */}
                  {showFavoritesDropdown === index && favoriteMaterials.length > 0 && (
                    <div className="absolute right-8 mt-8 z-10 bg-base-100 border rounded-md shadow-lg p-2 w-64 max-h-60 overflow-y-auto">
                      <h4 className="text-sm font-semibold mb-2">Favorite Materials</h4>
                      {favoriteMaterials.map((material, favIndex) => (
                        <div key={favIndex} className="flex justify-between items-center hover:bg-base-200 rounded-md">
                          <button
                            type="button"
                            className="text-left p-2 flex-grow text-sm"
                            onClick={() => {
                              applyFavoriteMaterial(material, index);
                              setShowFavoritesDropdown(false);
                            }}
                          >
                            {material.name}
                          </button>
                          <button 
                            type="button"
                            className="p-1 text-error tooltip tooltip-left"
                            onClick={(e) => deleteFromFavorites(material.name, e)}
                            data-tip="Delete from favorites"
                          >
                            <IoTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Material Name */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Material Name</span>
                      <span className="tooltip tooltip-left" data-tip="A unique name to identify this material in the ply definition (e.g., 'Carbon/Epoxy T300/976')."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="text"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.name ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.name`)}
                    />
                    {errors.materials?.[index]?.name && <span className="text-red-500 text-sm">{errors.materials[index].name.message}</span>}
                  </div>
                   {/* Ef */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Ef (GPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Young's Modulus of the Fiber (Ef) in GigaPascals (GPa). Represents the fiber's stiffness in its longitudinal direction."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Ef ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Ef`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Ef && <span className="text-red-500 text-sm">{errors.materials[index].Ef.message}</span>}
                  </div>
                   {/* vf */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">vf</span>
                      <span className="tooltip tooltip-left" data-tip="Poisson's Ratio of the Fiber (νf). Dimensionless. Describes the fiber's tendency to contract (or expand) perpendicularly to the direction of stretching (or compressing)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.vf ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.vf`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.vf && <span className="text-red-500 text-sm">{errors.materials[index].vf.message}</span>}
                  </div>
                   {/* Gf */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Gf (GPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Shear Modulus of the Fiber (Gf) in GigaPascals (GPa). Represents the fiber's resistance to shear deformation."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Gf ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Gf`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Gf && <span className="text-red-500 text-sm">{errors.materials[index].Gf.message}</span>}
                  </div>
                   {/* Em */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Em (GPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Young's Modulus of the Matrix (Em) in GigaPascals (GPa). Represents the matrix material's stiffness."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Em ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Em`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Em && <span className="text-red-500 text-sm">{errors.materials[index].Em.message}</span>}
                  </div>
                   {/* vm */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">vm</span>
                      <span className="tooltip tooltip-left" data-tip="Poisson's Ratio of the Matrix (νm). Dimensionless. Describes the matrix's tendency to contract (or expand) perpendicularly to the direction of stretching (or compressing)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.vm ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.vm`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.vm && <span className="text-red-500 text-sm">{errors.materials[index].vm.message}</span>}
                  </div>
                   {/* Vf */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Vf</span>
                      <span className="tooltip tooltip-left" data-tip="Fiber Volume Fraction (Vf). Dimensionless ratio (0 to 1) of fiber volume to the total composite volume. Crucial for determining overall composite properties."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Vf ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Vf`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Vf && <span className="text-red-500 text-sm">{errors.materials[index].Vf.message}</span>}
                  </div>
                   {/* rhof */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Fiber Density (ρf, g/cm³)</span>
                      <span className="tooltip tooltip-left" data-tip="Density of the Fiber material (ρf) in grams per cubic centimeter (g/cm³). Used for calculating composite density."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.rhof ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.rhof`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.rhof && <span className="text-red-500 text-sm">{errors.materials[index].rhof.message}</span>}
                  </div>
                   {/* rhom */}
                   <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Matrix Density (ρm, g/cm³)</span>
                      <span className="tooltip tooltip-left" data-tip="Density of the Matrix material (ρm) in grams per cubic centimeter (g/cm³). Used for calculating composite density."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.rhom ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.rhom`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.rhom && <span className="text-red-500 text-sm">{errors.materials[index].rhom.message}</span>}
                  </div>
                  {/* Xt */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Xt (MPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Longitudinal Tensile Strength (Xt) in MegaPascals (MPa)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Xt ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Xt`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Xt && <span className="text-red-500 text-sm">{errors.materials[index].Xt.message}</span>}
                  </div>
                  {/* Xc */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Xc (MPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Longitudinal Compressive Strength (Xc) in MegaPascals (MPa)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Xc ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Xc`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Xc && <span className="text-red-500 text-sm">{errors.materials[index].Xc.message}</span>}
                  </div>
                  {/* Yt */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Yt (MPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Transverse Tensile Strength (Yt) in MegaPascals (MPa)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Yt ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Yt`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Yt && <span className="text-red-500 text-sm">{errors.materials[index].Yt.message}</span>}
                  </div>
                  {/* Yc */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Yc (MPa)</span>
                      <span className="tooltip tooltip-left" data-tip="Transverse Compressive Strength (Yc) in MegaPascals (MPa)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.Yc ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.Yc`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.Yc && <span className="text-red-500 text-sm">{errors.materials[index].Yc.message}</span>}
                  </div>
                  {/* S12 */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">S12 (MPa)</span>
                      <span className="tooltip tooltip-left" data-tip="In-plane Shear Strength (S12) in MegaPascals (MPa)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.materials?.[index]?.S12 ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`materials.${index}.S12`, { valueAsNumber: true })}
                    />
                    {errors.materials?.[index]?.S12 && <span className="text-red-500 text-sm">{errors.materials[index].S12.message}</span>}
                  </div>
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <button type="button" onClick={() => appendMaterial({
                name: 'New Material',
                Ef: 200,
                vf: 0.2,
                Gf: 20,
                Em: 3.0,
                vm: 0.35,
                Vf: 0.6,
                rhof: 1.8,
                rhom: 1.2,
                Xt: 1500,
                Xc: 1000,
                Yt: 40,
                Yc: 150,
                S12: 60,
              })} className="btn btn-outline btn-primary btn-sm mt-2 w-full">
                <IoAddCircleOutline className="w-5 h-5 mr-1" /> Add Material
              </button>
              
              {favoriteMaterials.length > 0 && (
                <div className="mt-4 border rounded-md p-3">
                  <h4 className="text-sm font-semibold mb-2">Load from Favorites</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {favoriteMaterials.map((material, favIndex) => (
                      <div key={favIndex} className="flex justify-between items-center hover:bg-base-200 rounded-md mb-1">
                        <button
                          type="button"
                          className="text-left p-2 flex-grow text-sm flex items-center"
                          onClick={() => {
                            appendMaterial(material);
                          }}
                        >
                          <IoStar size={16} className="mr-2 text-yellow-500" />
                          {material.name}
                        </button>
                        <button 
                          type="button"
                          className="p-1 text-error tooltip tooltip-left"
                          onClick={(e) => deleteFromFavorites(material.name, e)}
                          data-tip="Delete from favorites"
                        >
                          <IoTrash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
             {errors.materials?.root && <span className="text-red-500 text-sm">{errors.materials.root.message}</span>}
          </div>

          {/* Laminate Definition */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold pb-2">Laminate Stack-up (Bottom to Top)</h3>
            <p className="text-sm text-gray-500">Define plies from bottom to top of the laminate.</p>
            {plyFields.map((item, index) => (
              <div key={item.id} className="border p-4 rounded-md space-y-4">
                 <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Ply {index + 1}</h4>
                  <button type="button" className="btn btn-sm btn-circle btn-ghost" onClick={() => removePly(index)}>
                    <IoRemoveCircleOutline className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {/* Material Type */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Material</span>
                    </label>
                     <select
                      className={`select select-bordered w-full focus:outline-none ${errors.plies?.[index]?.materialName ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`plies.${index}.materialName`)}
                    >
                      <option value="">Select Material</option>
                      {watchedMaterials && watchedMaterials.map((material, idx) => (
                        // Use watchedMaterials for dynamic options.
                        // materialFields[idx].id can be used for a stable key if materialFields is guaranteed to be in sync.
                        <option key={materialFields[idx]?.id || idx} value={material.name}>
                          {material.name || `(Unnamed Material ${idx + 1})`}
                        </option>
                      ))}
                    </select>
                    {errors.plies?.[index]?.materialName && <span className="text-red-500 text-sm">{errors.plies[index].materialName.message}</span>}
                  </div>
                  {/* Thickness */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Thickness (e.g., mm)</span>
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      className={`input input-bordered w-full focus:outline-none ${errors.plies?.[index]?.thickness ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`plies.${index}.thickness`, { valueAsNumber: true })}
                    />
                    {errors.plies?.[index]?.thickness && <span className="text-red-500 text-sm">{errors.plies[index].thickness.message}</span>}
                  </div>
                  {/* Orientation */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Orientation (θ, degrees)</span>
                      <span className="tooltip tooltip-left" data-tip="Orientation angle (θ) of the fibers in this ply, in degrees, relative to the laminate's primary reference axis (typically the x-axis). 0° is usually aligned with the x-axis."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`input input-bordered w-full focus:outline-none ${errors.plies?.[index]?.orientation ? 'border-red-500' : 'focus:border-primary'}`}
                      {...register(`plies.${index}.orientation`, { valueAsNumber: true })}
                    />
                    {errors.plies?.[index]?.orientation && <span className="text-red-500 text-sm">{errors.plies[index].orientation.message}</span>}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline btn-primary w-full" onClick={() => appendPly({ materialName: '', thickness: 0.125, orientation: 0 })}>
              <IoAddCircleOutline className="w-5 h-5" /> Add Ply
            </button>
             {errors.plies?.root && <span className="text-red-500 text-sm">{errors.plies.root.message}</span>}
          </div>

          {/* Applied Loads and Environmental Changes */}
           <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold pb-2">Applied Loads and Environmental Changes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Applied Loads {N} */}
              <div className="space-y-4">
                <h4 className="font-semibold">Applied Loads {`{N}`} (Force/Length, e.g., N/mm)</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Nx</span>
                        <span className="tooltip tooltip-left" data-tip="Applied in-plane normal load per unit width in the laminate's x-direction (e.g., N/mm or lb/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.N?.[0] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`N.0`, { valueAsNumber: true })}
                      />
                       {errors.N?.[0] && <span className="text-red-500 text-sm">{errors.N[0].message}</span>}
                    </div>
                     <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Ny</span>
                        <span className="tooltip tooltip-left" data-tip="Applied in-plane normal load per unit width in the laminate's y-direction (e.g., N/mm or lb/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.N?.[1] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`N.1`, { valueAsNumber: true })}
                      />
                       {errors.N?.[1] && <span className="text-red-500 text-sm">{errors.N[1].message}</span>}
                    </div>
                     <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Nxy</span>
                        <span className="tooltip tooltip-left" data-tip="Applied in-plane shear load per unit width in the laminate's xy-plane (e.g., N/mm or lb/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.N?.[2] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`N.2`, { valueAsNumber: true })}
                      />
                       {errors.N?.[2] && <span className="text-red-500 text-sm">{errors.N[2].message}</span>}
                    </div>
                 </div>
              </div>
               {/* Applied Moments {M} */}
              <div className="space-y-4">
                <h4 className="font-semibold">Applied Moments {`{M}`} (Moment/Length, e.g., N*mm/mm)</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Mx</span>
                        <span className="tooltip tooltip-left" data-tip="Applied bending moment per unit width about the laminate's y-axis (e.g., N*mm/mm or lb*in/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.M?.[0] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`M.0`, { valueAsNumber: true })}
                      />
                       {errors.M?.[0] && <span className="text-red-500 text-sm">{errors.M[0].message}</span>}
                    </div>
                     <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">My</span>
                        <span className="tooltip tooltip-left" data-tip="Applied bending moment per unit width about the laminate's x-axis (e.g., N*mm/mm or lb*in/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.M?.[1] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`M.1`, { valueAsNumber: true })}
                      />
                       {errors.M?.[1] && <span className="text-red-500 text-sm">{errors.M[1].message}</span>}
                    </div>
                     <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Mxy</span>
                        <span className="tooltip tooltip-left" data-tip="Applied twisting moment per unit width in the laminate's xy-plane (e.g., N*mm/mm or lb*in/in)."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                      </label>
                       <input
                        type="number"
                        step="any"
                        className={`input input-bordered w-full focus:outline-none ${errors.M?.[2] ? 'border-red-500' : 'focus:border-primary'}`}
                        {...register(`M.2`, { valueAsNumber: true })}
                      />
                       {errors.M?.[2] && <span className="text-red-500 text-sm">{errors.M[2].message}</span>}
                    </div>
                 </div>
              </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Delta T */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Change in Temperature (ΔT)</span>
                    <span className="tooltip tooltip-left" data-tip="Change in temperature from the stress-free (cure) temperature to the operating temperature (e.g., °C or °F). Used for calculating thermal stresses if hygrothermal properties are defined for materials."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    className={`input input-bordered w-full focus:outline-none ${errors.deltaT ? 'border-red-500' : 'focus:border-primary'}`}
                    {...register("deltaT", { valueAsNumber: true })}
                  />
                  {errors.deltaT && <span className="text-red-500 text-sm">{errors.deltaT.message}</span>}
                </div>
                 {/* Delta H */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Change in Humidity (ΔH)</span>
                    <span className="tooltip tooltip-left" data-tip="Change in moisture content (e.g., % weight gain). Used for calculating moisture-induced stresses if hygrothermal properties are defined for materials."><IoInformationCircleOutline className="inline-block ml-1" /></span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    className={`input input-bordered w-full focus:outline-none ${errors.deltaH ? 'border-red-500' : 'focus:border-primary'}`}
                    {...register("deltaH", { valueAsNumber: true })}
                  />
                  {errors.deltaH && <span className="text-red-500 text-sm">{errors.deltaH.message}</span>}
                </div>
             </div>
          </div>

           {/* Failure Criterion Selection */}
           <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-semibold pb-2">Failure Criterion</h3>
                <div className="form-control w-full">
                    <select 
                        className="select select-bordered w-full"
                        {...register("failureCriterion")}
                    >
                        <option value="Maximum Stress">Maximum Stress</option>
                        <option value="Tsai-Hill">Tsai-Hill</option>
                        <option value="Hoffman">Hoffman</option>
                        <option value="Tsai-Wu">Tsai-Wu</option>
                    </select>
                    {errors.failureCriterion && <span className="text-red-500 text-sm">{errors.failureCriterion.message}</span>}
                </div>
           </div>

          <button type="submit" className="btn btn-neutral w-full mt-6 sm:mt-8">Calculate Laminate Properties</button>
        </form>

        {/* Results Modal */}
        <dialog id="results_modal" className={`modal ${isModalState ? 'modal-open' : ''}`}>
          <div className="modal-box w-11/12 max-w-6xl">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsModalState(false)}>
                <IoClose className="w-6 h-6" />
              </button>
            </form>
            {results && (
              <div role="tablist" className="tabs tabs-lifted">
                <input type="radio" name="results_tabs" role="tab" className="tab" aria-label="Stiffness Matrices" defaultChecked />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                  <h3 className="font-bold text-xl sm:text-2xl text-center mb-4">Calculated Stiffness Matrices</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">[A] Matrix (In-plane Stiffness)</h4>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <tbody>
                            {results.A.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((val, colIndex) => (
                                  <td key={colIndex}>{val.toFixed(4)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div>
                      <h4 className="text-lg font-semibold mb-2">[B] Matrix (Coupling Stiffness)</h4>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <tbody>
                            {results.B.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((val, colIndex) => (
                                  <td key={colIndex}>{val.toFixed(4)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                     <div>
                      <h4 className="text-lg font-semibold mb-2">[D] Matrix (Bending Stiffness)</h4>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <tbody>
                            {results.D.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((val, colIndex) => (
                                  <td key={colIndex}>{val.toFixed(4)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <input type="radio" name="results_tabs" role="tab" className="tab" aria-label="Stress/Strain Analysis" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                   <h3 className="font-bold text-xl sm:text-2xl text-center mb-4">Stress and Strain Analysis per Ply</h3>
                   {results.plyResults.length > 0 ? (
                       <div className="space-y-6">
                           {results.plyResults.map((plyResult, index) => (
                               <div key={index} className="border p-4 rounded-md space-y-4">
                                   <h4 className="font-semibold">Ply {plyResult.plyIndex + 1} ({plyResult.materialName}, {plyResult.orientation}°):</h4>
                                   {/* Stress and Strain at Top Surface */}
                                   <div>
                                       <h5 className="font-medium mb-2">Top Surface (z = {plyResult.z_top.toFixed(4)})</h5>
                                       <div className="overflow-x-auto mb-4">
                                            <table className="table table-zebra table-xs">
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>σ₁ / ε₁</th>
                                                        <th>σ₂ / ε₂</th>
                                                        <th>τ₁₂ / γ₁₂</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Laminate Stress (MPa)</td>
                                                        <td>{plyResult.stress_laminate_top[0].toFixed(4)}</td>
                                                        <td>{plyResult.stress_laminate_top[1].toFixed(4)}</td>
                                                        <td>{plyResult.stress_laminate_top[2].toFixed(4)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Laminate Strain</td>
                                                        <td>{plyResult.strain_laminate_top[0].toFixed(6)}</td>
                                                        <td>{plyResult.strain_laminate_top[1].toFixed(6)}</td>
                                                        <td>{plyResult.strain_laminate_top[2].toFixed(6)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Material Stress (MPa)</td>
                                                        <td>{plyResult.stress_material_top[0].toFixed(4)}</td>
                                                        <td>{plyResult.stress_material_top[1].toFixed(4)}</td>
                                                        <td>{plyResult.stress_material_top[2].toFixed(4)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Material Strain</td>
                                                        <td>{plyResult.strain_material_top[0].toFixed(6)}</td>
                                                        <td>{plyResult.strain_material_top[1].toFixed(6)}</td>
                                                        <td>{plyResult.strain_material_top[2].toFixed(6)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                       </div>
                                   </div>
                                    {/* Stress and Strain at Bottom Surface */}
                                   <div>
                                       <h5 className="font-medium mb-2">Bottom Surface (z = {plyResult.z_bottom.toFixed(4)})</h5>
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra table-xs">
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>σ₁ / ε₁</th>
                                                        <th>σ₂ / ε₂</th>
                                                        <th>τ₁₂ / γ₁₂</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Laminate Stress (MPa)</td>
                                                        <td>{plyResult.stress_laminate_bottom[0].toFixed(4)}</td>
                                                        <td>{plyResult.stress_laminate_bottom[1].toFixed(4)}</td>
                                                        <td>{plyResult.stress_laminate_bottom[2].toFixed(4)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Laminate Strain</td>
                                                        <td>{plyResult.strain_laminate_bottom[0].toFixed(6)}</td>
                                                        <td>{plyResult.strain_laminate_bottom[1].toFixed(6)}</td>
                                                        <td>{plyResult.strain_laminate_bottom[2].toFixed(6)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Material Stress (MPa)</td>
                                                        <td>{plyResult.stress_material_bottom[0].toFixed(4)}</td>
                                                        <td>{plyResult.stress_material_bottom[1].toFixed(4)}</td>
                                                        <td>{plyResult.stress_material_bottom[2].toFixed(4)}</td>
                                                    </tr>
                                                     <tr>
                                                        <td>Material Strain</td>
                                                        <td>{plyResult.strain_material_bottom[0].toFixed(6)}</td>
                                                        <td>{plyResult.strain_material_bottom[1].toFixed(6)}</td>
                                                        <td>{plyResult.strain_material_bottom[2].toFixed(6)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <p>No ply stress/strain results available.</p>
                   )}
                </div>

                <input type="radio" name="results_tabs" role="tab" className="tab" aria-label="FPF Analysis" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                   <h3 className="font-bold text-xl sm:text-2xl text-center mb-4">First Ply Failure (FPF) Analysis</h3>
                   {results.fpfResult ? (
                       <div className="space-y-4">
                           <p><strong>Selected Criterion:</strong> {results.fpfResult.criterion}</p>
                           <p><strong>FPF Load Factor (α):</strong> {results.fpfResult.loadFactor.toFixed(4)}</p>
                           <p><strong>Failing Ply:</strong> Ply {results.fpfResult.failingPlyIndex + 1} ({results.plyResults[results.fpfResult.failingPlyIndex].materialName}, {results.plyResults[results.fpfResult.failingPlyIndex].orientation}°)</p>
                           <p><strong>Failing Location:</strong> {results.fpfResult.failingLocation === 'top' ? 'Top Surface' : 'Bottom Surface'} (z = {results.fpfResult.failingLocation === 'top' ? results.plyResults[results.fpfResult.failingPlyIndex].z_top.toFixed(4) : results.plyResults[results.fpfResult.failingPlyIndex].z_bottom.toFixed(4)})</p>
                           <p><strong>Failure Index at α=1:</strong> {results.fpfResult.failureIndex.toFixed(4)}</p>
                           {results.fpfResult.failureMode && (
                               <p><strong>Predicted Failure Mode:</strong> {results.fpfResult.failureMode}</p>
                           )}
                           <div className="mt-6 text-sm text-gray-600">
                               <p>Interpretation: The laminate is predicted to experience first ply failure when the applied loads and moments are scaled by a factor of {results.fpfResult.loadFactor.toFixed(4)}. Failure is predicted to initiate in Ply {results.fpfResult.failingPlyIndex + 1} at the {results.fpfResult.failingLocation} surface according to the {results.fpfResult.criterion} criterion.</p>
                               {results.fpfResult.criterion !== "Maximum Stress" && (
                                   <p className="mt-2 italic">Note: The {results.fpfResult.criterion} criterion is an interaction criterion and does not predict the specific mode of failure (e.g., fiber or matrix failure).</p>
                               )}
                           </div>
                       </div>
                   ) : (
                       <p>No FPF results available. This may occur if the matrix inversion failed or if no failure is predicted under the given loads (failure index = 0 for all plies/locations).</p>
                   )}
                </div>

                <input type="radio" name="results_tabs" role="tab" className="tab min-w-max" aria-label="Stress Profile" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-4 text-center">Stress Distribution (Material Coordinates)</h4>
                  {results.throughThicknessProfile && results.throughThicknessProfile.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={results.throughThicknessProfile} margin={{ top: 5, right: 30, left: 30, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="z" name="z" unit="mm" label={{ value: 'Laminate Thickness (z, mm)', position: 'insideBottom', offset: -15 }} domain={['dataMin', 'dataMax']} />
                          <YAxis allowDataOverflow={true} label={{ value: 'Stress (MPa)', angle: -90, position: 'insideLeft', offset: -10 }} />
                          <Tooltip formatter={(value: number) => value.toFixed(2)} />
                          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                          <Line type="monotone" dataKey="sigma1" name="σ₁ (Longitudinal)" stroke="#8884d8" activeDot={{ r: 6 }} dot={{r:2}} />
                          <Line type="monotone" dataKey="sigma2" name="σ₂ (Transverse)" stroke="#82ca9d" activeDot={{ r: 6 }} dot={{r:2}} />
                          <Line type="monotone" dataKey="tau12" name="τ₁₂ (Shear)" stroke="#ffc658" activeDot={{ r: 6 }} dot={{r:2}} />
                        </LineChart>
                      </ResponsiveContainer>
                      <p className="text-sm mt-4 text-center">This chart shows the distribution of stresses (σ₁, σ₂, τ₁₂) in material coordinates through the laminate thickness. Stresses are evaluated at the top and bottom surfaces of each ply.</p>
                    </>
                  ) : <p className="text-center">No stress profile data available.</p>}
                </div>

                <input type="radio" name="results_tabs" role="tab" className="tab min-w-max" aria-label="Strain Profile" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-4 text-center">Strain Distribution (Material Coordinates)</h4>
                  {results.throughThicknessProfile && results.throughThicknessProfile.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={results.throughThicknessProfile} margin={{ top: 5, right: 30, left: 30, bottom: 25 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="z" name="z" unit="mm" label={{ value: 'Laminate Thickness (z, mm)', position: 'insideBottom', offset: -15 }} domain={['dataMin', 'dataMax']} />
                          <YAxis allowDataOverflow={true} label={{ value: 'Strain', angle: -90, position: 'insideLeft', offset: -10 }}  tickFormatter={(tick) => tick.toExponential(1)} />
                          <Tooltip formatter={(value: number) => value.toExponential(3)} />
                          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                          <Line type="monotone" dataKey="epsilon1" name="ε₁ (Longitudinal)" stroke="#8884d8" activeDot={{ r: 6 }} dot={{r:2}} />
                          <Line type="monotone" dataKey="epsilon2" name="ε₂ (Transverse)" stroke="#82ca9d" activeDot={{ r: 6 }} dot={{r:2}} />
                          <Line type="monotone" dataKey="gamma12" name="γ₁₂ (Shear)" stroke="#ffc658" activeDot={{ r: 6 }} dot={{r:2}} />
                        </LineChart>
                      </ResponsiveContainer>
                      <p className="text-sm mt-4 text-center">This chart shows the distribution of strains (ε₁, ε₂, γ₁₂) in material coordinates through the laminate thickness. Strains are evaluated at the top and bottom surfaces of each ply.</p>
                    </>
                  ) : <p className="text-center">No strain profile data available.</p>}
                </div>

                <input type="radio" name="results_tabs" role="tab" className="tab min-w-max" aria-label="Failure Envelopes" />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                  <h4 className="text-lg sm:text-xl font-semibold mb-4 text-center">Failure Envelopes (τ₁₂ = 0)</h4>
                  
                  {/* View toggle buttons */}
                  <div className="flex justify-center mb-6">
                    <div className="btn-group">
                      <button 
                        className={`btn btn-sm ${!showGlobalEnvelope ? 'btn-active' : ''}`}
                        onClick={() => setShowGlobalEnvelope(false)}
                      >
                        Individual Plies
                      </button>
                      <button 
                        className={`btn btn-sm ${showGlobalEnvelope ? 'btn-active' : ''}`}
                        onClick={() => setShowGlobalEnvelope(true)}
                      >
                        Global Stack
                      </button>
                    </div>
                  </div>
                  
                  {/* Global envelope view */}
                  {showGlobalEnvelope && results.globalFailureEnvelope ? (
                    <div className="border p-4 rounded-md space-y-4">
                      <h5 className="font-semibold text-center">
                        Global Laminate Failure Envelope
                      </h5>
                      
                      <div className="tabs tabs-boxed justify-center mb-4">
                        <a className="tab tab-sm tab-active" onClick={(e) => {
                          // Toggle active class for tabs
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const tabs = parent.querySelectorAll('.tab');
                            tabs.forEach(tab => tab.classList.remove('tab-active'));
                            e.currentTarget.classList.add('tab-active');
                          }
                          
                          // Show the corresponding envelope
                          const envelopeContainers = document.querySelectorAll('.global-envelope-container');
                          envelopeContainers.forEach(container => {
                            (container as HTMLElement).style.display = 'none';
                          });
                          document.querySelector('.global-tsai-hill-envelope')!.setAttribute('style', 'display: block');
                        }}>Tsai-Hill</a>
                        
                        <a className="tab tab-sm" onClick={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const tabs = parent.querySelectorAll('.tab');
                            tabs.forEach(tab => tab.classList.remove('tab-active'));
                            e.currentTarget.classList.add('tab-active');
                          }
                          
                          const envelopeContainers = document.querySelectorAll('.global-envelope-container');
                          envelopeContainers.forEach(container => {
                            (container as HTMLElement).style.display = 'none';
                          });
                          document.querySelector('.global-max-stress-envelope')!.setAttribute('style', 'display: block');
                        }}>Max Stress</a>
                        
                        <a className="tab tab-sm" onClick={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const tabs = parent.querySelectorAll('.tab');
                            tabs.forEach(tab => tab.classList.remove('tab-active'));
                            e.currentTarget.classList.add('tab-active');
                          }
                          
                          const envelopeContainers = document.querySelectorAll('.global-envelope-container');
                          envelopeContainers.forEach(container => {
                            (container as HTMLElement).style.display = 'none';
                          });
                          document.querySelector('.global-hoffman-envelope')!.setAttribute('style', 'display: block');
                        }}>Hoffman</a>
                        
                        <a className="tab tab-sm" onClick={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const tabs = parent.querySelectorAll('.tab');
                            tabs.forEach(tab => tab.classList.remove('tab-active'));
                            e.currentTarget.classList.add('tab-active');
                          }
                          
                          const envelopeContainers = document.querySelectorAll('.global-envelope-container');
                          envelopeContainers.forEach(container => {
                            (container as HTMLElement).style.display = 'none';
                          });
                          document.querySelector('.global-tsai-wu-envelope')!.setAttribute('style', 'display: block');
                        }}>Tsai-Wu</a>
                      </div>
                      
                      {/* Tsai-Hill Global Envelope */}
                      <div className="global-envelope-container global-tsai-hill-envelope" style={{ display: 'block' }}>
                        <h6 className="text-center font-medium mb-2">Tsai-Hill Global Failure Envelope</h6>
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
                                Math.min(...results.globalFailureEnvelope.tsaiHillEnvelope.map(d => d.sigma1)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.tsaiHillEnvelope.map(d => d.sigma1)) * 1.1,
                              ]}
                            />
                            <YAxis
                              type="number"
                              dataKey="sigma2"
                              name="σ₂ (MPa)"
                              unit="MPa"
                              domain={[
                                Math.min(...results.globalFailureEnvelope.tsaiHillEnvelope.map(d => d.sigma2)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.tsaiHillEnvelope.map(d => d.sigma2)) * 1.1,
                              ]}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend formatter={(value) => value} />
                            <Scatter name="Global Failure Envelope" data={results.globalFailureEnvelope.tsaiHillEnvelope} fill="#8884d8" line />
                          </ScatterChart>
                        </ResponsiveContainer>
                        <p className="text-sm mt-2 text-center">
                          The Global Tsai-Hill Failure Envelope represents the most conservative boundary in the stress space (σ₁, σ₂) within which the entire laminate is considered safe (τ₁₂ = 0).
                          This envelope is derived from the most restrictive points of all individual ply envelopes.
                          <span className="tooltip tooltip-top inline-flex items-center ml-1" data-tip="(σ₁/Xt)² - (σ₁·σ₂)/(Xt·Yt) + (σ₂/Yt)² + (τ₁₂/S₁₂)² = 1">
                            <IoInformationCircleOutline className="w-4 h-4 text-primary cursor-help" />
                          </span>
                        </p>
                      </div>
                      
                      {/* Max Stress Global Envelope */}
                      <div className="global-envelope-container global-max-stress-envelope" style={{ display: 'none' }}>
                        <h6 className="text-center font-medium mb-2">Maximum Stress Global Failure Envelope</h6>
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
                                Math.min(...results.globalFailureEnvelope.maxStressEnvelope.map(d => d.sigma1)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.maxStressEnvelope.map(d => d.sigma1)) * 1.1,
                              ]}
                            />
                            <YAxis
                              type="number"
                              dataKey="sigma2"
                              name="σ₂ (MPa)"
                              unit="MPa"
                              domain={[
                                Math.min(...results.globalFailureEnvelope.maxStressEnvelope.map(d => d.sigma2)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.maxStressEnvelope.map(d => d.sigma2)) * 1.1,
                              ]}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend formatter={(value) => value} />
                            <Scatter name="Global Failure Envelope" data={results.globalFailureEnvelope.maxStressEnvelope} fill="#8884d8" line />
                          </ScatterChart>
                        </ResponsiveContainer>
                        <p className="text-sm mt-2 text-center">
                          The Global Maximum Stress Failure Envelope represents the most conservative boundary in the stress space (σ₁, σ₂) within which the entire laminate is considered safe (τ₁₂ = 0).
                          This envelope is derived from the most restrictive points of all individual ply envelopes.
                          <span className="tooltip tooltip-top inline-flex items-center ml-1" data-tip="σ₁/Xt = 1 or σ₁/Xc = -1 or σ₂/Yt = 1 or σ₂/Yc = -1 or |τ₁₂|/S₁₂ = 1">
                            <IoInformationCircleOutline className="w-4 h-4 text-primary cursor-help" />
                          </span>
                        </p>
                      </div>
                      
                      {/* Hoffman Global Envelope */}
                      <div className="global-envelope-container global-hoffman-envelope" style={{ display: 'none' }}>
                        <h6 className="text-center font-medium mb-2">Hoffman Global Failure Envelope</h6>
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
                                Math.min(...results.globalFailureEnvelope.hoffmanEnvelope.map(d => d.sigma1)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.hoffmanEnvelope.map(d => d.sigma1)) * 1.1,
                              ]}
                            />
                            <YAxis
                              type="number"
                              dataKey="sigma2"
                              name="σ₂ (MPa)"
                              unit="MPa"
                              domain={[
                                Math.min(...results.globalFailureEnvelope.hoffmanEnvelope.map(d => d.sigma2)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.hoffmanEnvelope.map(d => d.sigma2)) * 1.1,
                              ]}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend formatter={(value) => value} />
                            <Scatter name="Global Failure Envelope" data={results.globalFailureEnvelope.hoffmanEnvelope} fill="#8884d8" line />
                          </ScatterChart>
                        </ResponsiveContainer>
                        <p className="text-sm mt-2 text-center">
                          The Global Hoffman Failure Envelope represents the most conservative boundary in the stress space (σ₁, σ₂) within which the entire laminate is considered safe (τ₁₂ = 0).
                          This envelope is derived from the most restrictive points of all individual ply envelopes.
                          <span className="tooltip tooltip-top inline-flex items-center ml-1" data-tip="C₁σ₁² + C₂σ₂² + C₁₁τ₁₂² + C₆σ₁σ₂ + C₇σ₁ + C₈σ₂ = 1, where C₁=(1/Xt)(1/Xc), C₂=(1/Yt)(1/Yc), etc.">
                            <IoInformationCircleOutline className="w-4 h-4 text-primary cursor-help" />
                          </span>
                        </p>
                      </div>
                      
                      {/* Tsai-Wu Global Envelope */}
                      <div className="global-envelope-container global-tsai-wu-envelope" style={{ display: 'none' }}>
                        <h6 className="text-center font-medium mb-2">Tsai-Wu Global Failure Envelope</h6>
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
                                Math.min(...results.globalFailureEnvelope.tsaiWuEnvelope.map(d => d.sigma1)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.tsaiWuEnvelope.map(d => d.sigma1)) * 1.1,
                              ]}
                            />
                            <YAxis
                              type="number"
                              dataKey="sigma2"
                              name="σ₂ (MPa)"
                              unit="MPa"
                              domain={[
                                Math.min(...results.globalFailureEnvelope.tsaiWuEnvelope.map(d => d.sigma2)) * 1.1,
                                Math.max(...results.globalFailureEnvelope.tsaiWuEnvelope.map(d => d.sigma2)) * 1.1,
                              ]}
                            />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend formatter={(value) => value} />
                            <Scatter name="Global Failure Envelope" data={results.globalFailureEnvelope.tsaiWuEnvelope} fill="#8884d8" line />
                          </ScatterChart>
                        </ResponsiveContainer>
                        <p className="text-sm mt-2 text-center">
                          The Global Tsai-Wu Failure Envelope represents the most conservative boundary in the stress space (σ₁, σ₂) within which the entire laminate is considered safe (τ₁₂ = 0).
                          This envelope is derived from the most restrictive points of all individual ply envelopes.
                          <span className="tooltip tooltip-top inline-flex items-center ml-1" data-tip="F₁σ₁ + F₂σ₂ + F₁₁σ₁² + F₂₂σ₂² + F₆₆τ₁₂² + 2F₁₂σ₁σ₂ = 1, where F₁=1/Xt-1/Xc, F₂=1/Yt-1/Yc, F₁₁=1/(Xt·Xc), etc.">
                            <IoInformationCircleOutline className="w-4 h-4 text-primary cursor-help" />
                          </span>
                        </p>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Individual ply envelopes view */}
                  {!showGlobalEnvelope && results.plyFailureEnvelopes && results.plyFailureEnvelopes.length > 0 ? (
                    <div className="space-y-8">
                      {results.plyFailureEnvelopes.map((envelopeData, index) => (
                        <div key={index} className="border p-4 rounded-md space-y-4">
                          <h5 className="font-semibold text-center">
                            Ply {envelopeData.plyIndex + 1} ({envelopeData.materialName}, {results.plyResults[envelopeData.plyIndex].orientation}°)
                          </h5>
                          
                          <div className="tabs tabs-boxed justify-center mb-4">
                            <a className="tab tab-sm tab-active" onClick={(e) => {
                              // Toggle active class for tabs within this ply section
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const tabs = parent.querySelectorAll('.tab');
                                tabs.forEach(tab => tab.classList.remove('tab-active'));
                                e.currentTarget.classList.add('tab-active');
                              }
                              
                              // Show the corresponding envelope
                              const envelopeContainers = document.querySelectorAll(`.envelope-container-${index}`);
                              envelopeContainers.forEach(container => {
                                (container as HTMLElement).style.display = 'none';
                              });
                              document.querySelector(`.tsai-hill-envelope-${index}`)!.setAttribute('style', 'display: block');
                            }}>Tsai-Hill</a>
                            
                            <a className="tab tab-sm" onClick={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const tabs = parent.querySelectorAll('.tab');
                                tabs.forEach(tab => tab.classList.remove('tab-active'));
                                e.currentTarget.classList.add('tab-active');
                              }
                              
                              const envelopeContainers = document.querySelectorAll(`.envelope-container-${index}`);
                              envelopeContainers.forEach(container => {
                                (container as HTMLElement).style.display = 'none';
                              });
                              document.querySelector(`.max-stress-envelope-${index}`)!.setAttribute('style', 'display: block');
                            }}>Max Stress</a>
                            
                            <a className="tab tab-sm" onClick={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const tabs = parent.querySelectorAll('.tab');
                                tabs.forEach(tab => tab.classList.remove('tab-active'));
                                e.currentTarget.classList.add('tab-active');
                              }
                              
                              const envelopeContainers = document.querySelectorAll(`.envelope-container-${index}`);
                              envelopeContainers.forEach(container => {
                                (container as HTMLElement).style.display = 'none';
                              });
                              document.querySelector(`.hoffman-envelope-${index}`)!.setAttribute('style', 'display: block');
                            }}>Hoffman</a>
                            
                            <a className="tab tab-sm" onClick={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const tabs = parent.querySelectorAll('.tab');
                                tabs.forEach(tab => tab.classList.remove('tab-active'));
                                e.currentTarget.classList.add('tab-active');
                              }
                              
                              const envelopeContainers = document.querySelectorAll(`.envelope-container-${index}`);
                              envelopeContainers.forEach(container => {
                                (container as HTMLElement).style.display = 'none';
                              });
                              document.querySelector(`.tsai-wu-envelope-${index}`)!.setAttribute('style', 'display: block');
                            }}>Tsai-Wu</a>
                          </div>
                          
                          {/* Tsai-Hill Envelope */}
                          <div className={`envelope-container-${index} tsai-hill-envelope-${index}`} style={{ display: 'block' }}>
                            <h6 className="text-center font-medium mb-2">Tsai-Hill Failure Envelope</h6>
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
                                    Math.min(...envelopeData.tsaiHillEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                    Math.max(...envelopeData.tsaiHillEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                  ]}
                                />
                                <YAxis
                                  type="number"
                                  dataKey="sigma2"
                                  name="σ₂ (MPa)"
                                  unit="MPa"
                                  domain={[
                                    Math.min(...envelopeData.tsaiHillEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                    Math.max(...envelopeData.tsaiHillEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                  ]}
                                />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend formatter={(value) => value} />
                                <Scatter name="Failure Envelope" data={envelopeData.tsaiHillEnvelope} fill="#8884d8" line />
                                <Scatter name="Top Surface Stress" data={[envelopeData.appliedStressTop]} fill="#ff0000" shape="star" />
                                <Scatter name="Bottom Surface Stress" data={[envelopeData.appliedStressBottom]} fill="#00ff00" shape="triangle" />
                              </ScatterChart>
                            </ResponsiveContainer>
                            <p className="text-sm mt-2 text-center">
                              The Tsai-Hill Failure Envelope represents the boundary in the stress space (σ₁, σ₂) within which the composite material is considered safe (τ₁₂ = 0).
                              The red star represents the stress state at the top surface, and the green triangle represents the stress state at the bottom surface.
                            </p>
                          </div>
                          
                          {/* Max Stress Envelope */}
                          <div className={`envelope-container-${index} max-stress-envelope-${index}`} style={{ display: 'none' }}>
                            <h6 className="text-center font-medium mb-2">Maximum Stress Failure Envelope</h6>
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
                                    Math.min(...envelopeData.maxStressEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                    Math.max(...envelopeData.maxStressEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                  ]}
                                />
                                <YAxis
                                  type="number"
                                  dataKey="sigma2"
                                  name="σ₂ (MPa)"
                                  unit="MPa"
                                  domain={[
                                    Math.min(...envelopeData.maxStressEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                    Math.max(...envelopeData.maxStressEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                  ]}
                                />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend formatter={(value) => value} />
                                <Scatter name="Failure Envelope" data={envelopeData.maxStressEnvelope} fill="#8884d8" line />
                                <Scatter name="Top Surface Stress" data={[envelopeData.appliedStressTop]} fill="#ff0000" shape="star" />
                                <Scatter name="Bottom Surface Stress" data={[envelopeData.appliedStressBottom]} fill="#00ff00" shape="triangle" />
                              </ScatterChart>
                            </ResponsiveContainer>
                            <p className="text-sm mt-2 text-center">
                              The Maximum Stress Failure Envelope represents the boundary in the stress space (σ₁, σ₂) within which the composite material is considered safe (τ₁₂ = 0).
                              The red star represents the stress state at the top surface, and the green triangle represents the stress state at the bottom surface.
                            </p>
                          </div>
                          
                          {/* Hoffman Envelope */}
                          <div className={`envelope-container-${index} hoffman-envelope-${index}`} style={{ display: 'none' }}>
                            <h6 className="text-center font-medium mb-2">Hoffman Failure Envelope</h6>
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
                                    Math.min(...envelopeData.hoffmanEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                    Math.max(...envelopeData.hoffmanEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                  ]}
                                />
                                <YAxis
                                  type="number"
                                  dataKey="sigma2"
                                  name="σ₂ (MPa)"
                                  unit="MPa"
                                  domain={[
                                    Math.min(...envelopeData.hoffmanEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                    Math.max(...envelopeData.hoffmanEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                  ]}
                                />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend formatter={(value) => value} />
                                <Scatter name="Failure Envelope" data={envelopeData.hoffmanEnvelope} fill="#8884d8" line />
                                <Scatter name="Top Surface Stress" data={[envelopeData.appliedStressTop]} fill="#ff0000" shape="star" />
                                <Scatter name="Bottom Surface Stress" data={[envelopeData.appliedStressBottom]} fill="#00ff00" shape="triangle" />
                              </ScatterChart>
                            </ResponsiveContainer>
                            <p className="text-sm mt-2 text-center">
                              The Hoffman Failure Envelope represents the boundary in the stress space (σ₁, σ₂) within which the composite material is considered safe (τ₁₂ = 0).
                              The red star represents the stress state at the top surface, and the green triangle represents the stress state at the bottom surface.
                            </p>
                          </div>
                          
                          {/* Tsai-Wu Envelope */}
                          <div className={`envelope-container-${index} tsai-wu-envelope-${index}`} style={{ display: 'none' }}>
                            <h6 className="text-center font-medium mb-2">Tsai-Wu Failure Envelope</h6>
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
                                    Math.min(...envelopeData.tsaiWuEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                    Math.max(...envelopeData.tsaiWuEnvelope.map(d => d.sigma1), 
                                            envelopeData.appliedStressTop.sigma1,
                                            envelopeData.appliedStressBottom.sigma1) * 1.1,
                                  ]}
                                />
                                <YAxis
                                  type="number"
                                  dataKey="sigma2"
                                  name="σ₂ (MPa)"
                                  unit="MPa"
                                  domain={[
                                    Math.min(...envelopeData.tsaiWuEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                    Math.max(...envelopeData.tsaiWuEnvelope.map(d => d.sigma2), 
                                            envelopeData.appliedStressTop.sigma2,
                                            envelopeData.appliedStressBottom.sigma2) * 1.1,
                                  ]}
                                />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend formatter={(value) => value} />
                                <Scatter name="Failure Envelope" data={envelopeData.tsaiWuEnvelope} fill="#8884d8" line />
                                <Scatter name="Top Surface Stress" data={[envelopeData.appliedStressTop]} fill="#ff0000" shape="star" />
                                <Scatter name="Bottom Surface Stress" data={[envelopeData.appliedStressBottom]} fill="#00ff00" shape="triangle" />
                              </ScatterChart>
                            </ResponsiveContainer>
                            <p className="text-sm mt-2 text-center">
                              The Tsai-Wu Failure Envelope represents the boundary in the stress space (σ₁, σ₂) within which the composite material is considered safe (τ₁₂ = 0).
                              The red star represents the stress state at the top surface, and the green triangle represents the stress state at the bottom surface.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center">No failure envelope data available.</p>
                  )}
                </div>

              </div>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default CompositeStackMaterialCalculator;
