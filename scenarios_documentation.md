# 10 Complex MIMS Test Scenarios

This document outlines 10 complex testing scenarios for the MIMS API. Each scenario combines multiple interaction modules (Drug-Drug, Health, Allergy, Pregnancy, etc.) to simulate realistic clinical situations.

**Note on GUIDs**: All Product references used below are taken from the provided `scenarios.json` to ensure they exist in the test database context.

---

## Scenario 1: "The Bleeding Risk" (Triple Threat)

**Theme**: A high-risk cardiovascular patient with a history of ulcers is prescribed meds that increase bleeding.
**Patient**: 65-year-old Female.
**Conditions**: Peptic Ulcer of site unspecified (`K27.0`).
**Modules Tested**: `Health`, `Drug-Drug Interaction (DDI)`.

- **Prescribed**: Warfarin (Anticoagulant)
- **Prescribing**: Celecoxib (NSAID)
- **Conflict**:
    1.  **DDI**: NSAIDs + Warfarin = Increased bleeding risk.
    2.  **Health**: NSAIDs contraindicated/caution in Peptic Ulcer disease.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{9C83B346-F698-44AB-B0E7-D11D5A92C52F}"> <!-- CeleBREX 200mg -->
        <Dosing>
            <Dose><Value>200</Value><Unit>mg</Unit></Dose>
            <Frequency name="once a day"/>
        </Dosing>
      </Product>
    </Prescribing>
    <Prescribed>
      <Product reference="{5BAABDD0-7868-413B-9BD7-D890EAADAED4}" /> <!-- Orfarin 5mg -->
    </Prescribed>
    <HealthIssueCodes>
      <HealthIssueCode code="K27.0" codeType="ICD10" /> <!-- Peptic Ulcer -->
    </HealthIssueCodes>
  </Interaction>
  <PatientProfile>
    <Gender>F</Gender>
    <Age><Year>65</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 2: "The Serotonin Syndrome"

**Theme**: Dangerous combination of psychiatric medications causing potential serotonin syndrome.
**Patient**: 40-year-old Male.
**Modules Tested**: `Drug-Drug Interaction (DDI)`.

- **Prescribed**: Selegiline (MAOI)
- **Prescribing**: Fentanyl (Opioid w/ serotonergic properties)
- **Conflict**: Concomitant use can precipitate serotonin syndrome (potentially fatal).

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{954BAEC4-015C-4AB7-9EE6-52932265932A}"> <!-- Abstral SL (Fentanyl) -->
      </Product>
    </Prescribing>
    <Prescribed>
      <Product reference="{FE38D085-B608-4C40-B70D-B6235F3050FB}" /> <!-- Selegiline 5mg -->
    </Prescribed>
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>40</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 3: "Duplicate Statins & Liver Risk"

**Theme**: Unintentional duplication of therapy with different brand names/combinations.
**Patient**: 55-year-old Male.
**Modules Tested**: `Duplicate Ingredient`, `Duplicate Therapy`.

- **Prescribed**: Vytorin (Simvastatin + Ezetimibe)
- **Prescribing**: Covastin (Simvastatin)
- **Conflict**:
    1.  **Duplicate Ingredient**: Both contain Simvastatin.
    2.  **Duplicate Therapy**: Both are HMG-CoA reductase inhibitors (Statins).

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{22CD5B4E-D7D7-434E-9CCD-2762030E5312}"> <!-- Covastin 10mg -->
      </Product>
    </Prescribing>
    <Prescribed>
      <Product reference="{E6EDB82B-4FE2-463C-A937-A37B6784BC55}" /> <!-- Vytorin 10/40 -->
    </Prescribed>
    <DuplicateTherapy checkSameDrug="true" />
    <DuplicateIngredient checkSameDrug="true" />
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>55</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 4: "The Pregnant Epileptic"

**Theme**: Teratogenic risk in a pregnant patient.
**Patient**: 25-year-old Female, 2 months pregnant.
**Condition**: Epilepsy (implied).
**Modules Tested**: `Pregnancy`.

- **Prescribing**: Methotrexate (Known teratogen/abortifacient)
- **Conflict**: Pregnancy Category X (Contraindicated).

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{0B0D0BE1-C5C8-47D8-9BE1-7D8B0DA615A9}"> <!-- Emthexate 2.5mg -->
      </Product>
    </Prescribing>
  </Interaction>
  <PatientProfile>
    <Gender>F</Gender>
    <Age><Year>25</Year></Age>
    <Pregnancy>
        <Month>2</Month>
    </Pregnancy>
  </PatientProfile>
</Request>
```

---

## Scenario 5: "Pediatric Antibiotic Allergy"

**Theme**: Prescribing an antibiotic to a child with a known allergy to the class.
**Patient**: 5-year-old Boy.
**Modules Tested**: `Allergy`.

- **Prescribing**: Amoxicillin
- **Allergy History**: Amoxicillin (or Penicillins)
- **Conflict**: Anaphylaxis risk.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{3FF1EECF-EDA2-4086-8941-01469BCDA202}"> <!-- Synamox Oral Susp -->
      </Product>
    </Prescribing>
    <Allergies>
      <!-- Reference for Amoxicillin as the allergen -->
      <Product reference="{3FF1EECF-EDA2-4086-8941-01469BCDA202}" />
    </Allergies>
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>5</Year></Age>
    <Weight>18</Weight>
  </PatientProfile>
</Request>
```

---

## Scenario 6: "The Cardiac Cascade"

**Theme**: Multiple cardiac meds interacting with each other and the patient's condition.
**Patient**: 70-year-old Male.
**Condition**: Bradycardia (Slow heart rate) `R00.1`.
**Modules Tested**: `DDI`, `Health`.

- **Prescribed**: Amiodarone
- **Prescribing**: Digoxin
- **Conflict**:
    1.  **DDI**: Amiodarone increases Digoxin levels (requires dose reduction).
    2.  **Health**: Digoxin may worsen Bradycardia.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{A229DE8D-8337-4809-B072-7149BC2FBC78}"> <!-- Lanoxin PG Elixir -->
      </Product>
    </Prescribing>
    <Prescribed>
      <Product reference="{7211E99E-8A09-40CB-A20F-8FD840BEC083}" /> <!-- Cordarone Inj -->
    </Prescribed>
    <HealthIssueCodes>
      <HealthIssueCode code="R00.1" codeType="ICD10" /> <!-- Bradycardia, unspecified -->
    </HealthIssueCodes>
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>70</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 7: "Renal Risk Double Hit"

**Theme**: Two drugs that compete for renal excretion, increasing toxicity.
**Patient**: 50-year-old Female.
**Modules Tested**: `DDI`.

- **Prescribed**: Probenecid
- **Prescribing**: Methotrexate
- **Conflict**: Probenecid inhibits renal excretion of Methotrexate, leading to severe toxicity (Bone marrow suppression).

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{0B0D0BE1-C5C8-47D8-9BE1-7D8B0DA615A9}"> <!-- Emthexate 2.5mg -->
      </Product>
    </Prescribing>
    <Prescribed>
      <GGPI reference="{36FD4873-6C2A-430C-85F1-676619C443C9}" /> <!-- Probenecid 500mg -->
    </Prescribed>
  </Interaction>
  <PatientProfile>
    <Gender>F</Gender>
    <Age><Year>50</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 8: "The Nursing Mother"

**Theme**: Medication safety during lactation.
**Patient**: 28-year-old Female, Nursing.
**Modules Tested**: `Lactation`.

- **Prescribing**: Amiodarone (Excreted in breast milk, causes thyroid dysfuntion in infant).
- **Conflict**: Contraindicated/Caution in lactation.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{7211E99E-8A09-40CB-A20F-8FD840BEC083}"> <!-- Cordarone Inj -->
      </Product>
    </Prescribing>
  </Interaction>
  <PatientProfile>
    <Gender>F</Gender>
    <Age><Year>28</Year></Age>
    <Nursing>true</Nursing>
  </PatientProfile>
</Request>
```

---

## Scenario 9: "Beta-Blocker Overload"

**Theme**: Duplicate therapy class check.
**Patient**: 60-year-old Male.
**Modules Tested**: `Duplicate Therapy`.

- **Prescribed**: Propranolol
- **Prescribing**: Nebivolol
- **Conflict**: Both are Beta-blocking agents.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <Product reference="{CFE66993-A07C-4857-95C7-68A6092D9272}"> <!-- Nebilet 5mg -->
      </Product>
    </Prescribing>
    <Prescribed>
      <Product reference="{DEEFE9E8-83F3-4A94-A736-A21BFCA80B31}" /> <!-- Inderal 10mg -->
    </Prescribed>
    <DuplicateTherapy checkSameDrug="true" />
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>60</Year></Age>
  </PatientProfile>
</Request>
```

---

## Scenario 10: "Massive Overdose"

**Theme**: Checking dose safety limits.
**Patient**: 40-year-old Male.
**Modules Tested**: `Dose`.

- **Prescribing**: Colchicine
- **Dose**: 30mg (Standard is ~1-2mg).
- **Conflict**: Fatal overdose risk.

```xml
<Request>
  <Interaction>
    <Prescribing>
      <GenericItem reference="{B43550AD-945E-461B-E034-080020E1DD8C}"> <!-- Colchicine -->
        <Dosing>
            <Dose><Value>30</Value><Unit>mg</Unit></Dose> <!-- 30mg is massive -->
            <Frequency name="once a day"/>
            <Duration><Day>1</Day></Duration>
        </Dosing>
      </GenericItem>
    </Prescribing>
  </Interaction>
  <PatientProfile>
    <Gender>M</Gender>
    <Age><Year>40</Year></Age>
    <Weight>70</Weight>
  </PatientProfile>
</Request>
```
