Ok, ecco una bozza di Product Requirements Document (PRD) in inglese per un calcolatore specializzato per laminati compositi, basato sulle informazioni fornite nelle fonti.

***

**Product Requirements Document (PRD)**

**Product Name:** Composite Laminate Analysis Tool

**Version:** 1.0

**Date:** 2023-10-27

**1. Introduction**

This document outlines the requirements for a software tool designed to perform mechanical analysis of composite laminates. The tool will implement fundamental principles from Composite Laminate Theory (CLT) to predict the stiffness and strength characteristics of a laminate based on the properties, orientation, sequence, and number of its constituent plies (laminae). The goal is to provide engineers, designers, and students with a reliable means to analyze laminate behavior under various mechanical and environmental loads.

**2. Goal**

The primary goal is to create a specialized calculator that allows users to:
*   Define complex laminate structures.
*   Calculate the laminate's overall elastic stiffness properties (A, B, D matrices).
*   Determine the stress and strain state in each individual ply under given external loads, moments, and environmental conditions.
*   Predict the load or strain level at which the first ply failure (FPF) occurs using established failure criteria.

**3. Target Audience**

*   Composite Design Engineers
*   Structural Analysts
*   Materials Engineers
*   Students and Researchers in Composite Materials

**4. Functional Requirements**

**4.1. Material Database Management**

*   The tool must allow users to define and store properties for individual composite plies (laminae).
*   **Required Lamina Elastic Input Properties:** Longitudinal Young's Modulus (E1), Transverse Young's Modulus (E2), In-plane Shear Modulus (G12), Major Poisson's Ratio (v12). These are 4 elastic constants.
*   **Required Lamina Strength Input Properties:** Longitudinal Tensile Strength (XT), Longitudinal Compressive Strength (Xc), Transverse Tensile Strength (YT), Transverse Compressive Strength (Yc), In-plane Shear Strength (S). Note that Xc and Yc are typically negative values when referring to stress limits. These are 5 strength values needed if tensile and compressive strengths differ.
*   **Required Environmental Input Properties:** Coefficient of Thermal Expansion (α1, α2), Coefficient of Moisture Expansion (β1, β2).
*   Properties should be associable with a material name/identifier.
*   The tool should allow importing/exporting material properties.
*   *Source Note:* These properties are typically obtained experimentally as micromechanical models provide good predictions for E1 and v12 but are less accurate for E2, G12, and especially strengths.

**4.2. Laminate Definition**

*   The tool must allow users to define a laminate by specifying:
    *   The sequence of plies, ordered from bottom to top.
    *   The material type for each ply (linking to the Material Database).
    *   The thickness of each ply.
    *   The orientation angle (θ) of the principal material direction (direction 1, fiber direction) for each ply relative to the laminate's global x-axis (typically positive counter-clockwise).
*   The tool should allow defining the total laminate thickness.
*   The tool should provide options for defining symmetric laminates (ply sequence and properties mirrored about the mid-plane).
*   The tool should provide options for defining balanced laminates (containing ±θ plies).

**4.3. Laminate Stiffness Calculation**

*   The tool must calculate the 6x6 stiffness matrix of the laminate according to CLT. This matrix relates the load and moment vectors ({N}, {M}) to the mid-plane strain and curvature vectors ({ε₀}, {K}):
    { N } = [ A ] { ε₀ } + [ B ] { K }
    { M } = [ B ] { ε₀ } + [ D ] { K }
*   The tool must display the calculated [A], [B], and [D] matrices.
*   **Interpretation of Matrices:**
    *   [A]: In-plane stiffness matrix, relates in-plane forces to mid-plane strains. Non-zero A16 or A26 terms indicate normal-shear coupling.
    *   [B]: Coupling matrix, relates in-plane forces to curvatures and moments to mid-plane strains. **[B] is zero for symmetric laminates**.
    *   [D]: Bending stiffness matrix, relates moments to curvatures. Non-zero D16 or D26 terms indicate bending-twisting coupling.
*   *Source Note:* The calculation involves summing the contributions of each ply's transformed stiffness matrix (Q-bar, calculated from the ply's Q matrix and orientation angle) multiplied by its thickness and position relative to the mid-plane. The assumption of plane stress (σ3=0, τ23=τ31=0) is fundamental for the ply stiffness matrix. Kirchhoff's hypothesis (plane sections remain plane) is assumed, leading to linear strain variation through the thickness.

**4.4. Stress and Strain Analysis**

*   The tool must allow users to input applied mechanical loads ({N}) and moments ({M}).
*   The tool must allow users to input environmental changes: change in temperature (ΔT) and change in humidity (ΔH).
*   The tool must calculate the resulting mid-plane strains ({ε₀}) and curvatures ({K}) using the inverse of the laminate stiffness matrix, considering both mechanical and environmental loads.
*   For each individual ply (k) at any specified through-thickness location (z):
    *   Calculate the total strain in the laminate coordinate system {ε(z)} based on {ε₀}, {K}, and z.
    *   Calculate the mechanical strain in the laminate coordinate system {ε_mech(z)} by subtracting the thermal/humidity free strains.
    *   Calculate the stress in the laminate coordinate system {σ(z)} using the ply's transformed stiffness matrix ([Q-bar]) and the mechanical strain {ε_mech(z)}.
    *   Transform the stress {σ(z)} and total strain {ε(z)} from the laminate coordinate system (x-y) to the ply's principal material coordinate system (1-2) using transformation matrices.
*   The tool must display the calculated {ε₀}, {K}, and for selected plies/locations, the stress and strain states in both laminate and material coordinate systems.

**4.5. First Ply Failure (FPF) Analysis**

*   The tool must allow users to select one or more failure criteria to apply.
*   **Supported Failure Criteria:**
    *   **Maximum Stress Criterion:** Checks if individual stress components (σ1, σ2, τ12) in the ply's material coordinate system exceed the corresponding allowables (XT, Xc, YT, Yc, S). This criterion is non-interactive. It predicts the failure mode (fiber tension/compression, matrix tension/compression, shear).
    *   **Tsai-Hill Criterion:** An interactive, energy-based criterion. It requires comparing a quadratic function of stresses (σ1, σ2, τ12) to material strengths. Typically assumes X=Y and tensile=compressive strengths in its basic form, but needs modification for orthotropic materials with different tensile/compressive strengths. *Source Note:* This criterion was initially developed for ductile materials and may not be fully accurate for brittle composite plies.
    *   **Hoffman Criterion:** A modified energy-based criterion addressing the difference between tensile and compressive strengths. Uses all five strengths (XT, Xc, YT, Yc, S).
    *   **Tsai-Wu Criterion:** A general quadratic criterion using strength tensors. Can require more input parameters, including a term F12 that needs biaxial testing to determine accurately.
*   For a defined loading scenario (e.g., fixed load distribution scaled by a factor α), the tool must calculate the scaling factor α at which the chosen failure criterion is first met in any ply at any location within that ply.
*   The tool must report:
    *   The calculated FPF load scale factor (α_FPF).
    *   The ply and the location within the ply (top/bottom surface, or max/min stress location) where FPF occurs.
    *   The predicted failure mode, if provided by the criterion (e.g., for Maximum Stress).
    *   The value of the failure index for each ply at the FPF load level.
*   *Source Note:* FPF represents the onset of non-linear behavior and damage accumulation, not necessarily ultimate laminate failure. The analysis is based on the linear elastic assumption up to the point of first failure.

**4.6. Output and Reporting**

*   Provide a clear visual display of the defined laminate stack-up.
*   Present the calculated A, B, D matrices in a user-friendly format.
*   Allow users to view stress and strain distributions through the thickness of the laminate (e.g., plots or tables).
*   Display FPF results prominently, indicating the load level, the failed ply, and the failure mode.
*   Generate reports summarizing the laminate definition, material properties used, applied loads, stiffness results, and FPF analysis results.

**5. Scope**

*   The calculator will perform analysis based on Classical Laminate Theory (CLT).
*   The analysis assumes linear elastic material behavior for each ply up to its individual failure point.
*   Perfect bonding (no delamination before FPF) between plies is assumed.
*   Plane stress state (σ3=0, τ23=τ31=0) is assumed for each ply in its material coordinate system.
*   Input material properties are assumed to be known (likely from experimental testing).

**6. Out of Scope**

*   Prediction of material properties using micromechanics from fiber/matrix properties.
*   Analysis of laminate behavior *after* first ply failure (Post-FPF analysis). This includes predicting ultimate laminate strength.
*   Modeling of damage progression or non-linear material behavior beyond the elastic limit of a ply.
*   Prediction or analysis of interlaminar failure (delamination) as a primary failure mode prediction method.
*   Buckling or stability analysis of the laminate.
*   Detailed modeling of manufacturing defects or residual stresses beyond what is accounted for in the input material properties or thermal/humidity loads.

**7. Future Considerations (Potential Enhancements)**

*   Implementation of ply property degradation models for post-FPF analysis and ultimate strength prediction.
*   Inclusion of more advanced or recently developed failure criteria.
*   Ability to analyze sandwich structures (not directly covered by standard CLT in the same way as homogeneous laminates).
*   Integration with testing data formats for material properties.
*   Visualization of failure envelopes for individual plies.

***

This PRD provides a detailed overview of the requirements for a specialized composite laminate calculator, focusing on the core functionalities supported by the provided sources, particularly the principles of Classical Laminate Theory and First Ply Failure analysis.