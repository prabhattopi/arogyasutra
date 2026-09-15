import { IBiomarker } from '../models/Report';

interface BiomarkerDef {
  regex: RegExp;
  name: string;
  category: string;
  unit: string;
  defaultMin: number;
  defaultMax: number;
  explanation: string;
}

const KNOWN_BIOMARKERS: BiomarkerDef[] = [
  // Glycemic & Metabolic (Place HbA1c first to prevent collision with general Hemoglobin)
  {
    regex: /(?:HbA1c\b|Glycated Hemoglobin|Hemoglobin A1c)/i,
    name: 'HbA1c (Glycated Hb)',
    category: 'Metabolic',
    unit: '%',
    defaultMin: 4.0,
    defaultMax: 5.6,
    explanation: 'The gold-standard marker showing your three-month rolling average blood glucose concentration.',
  },
  {
    regex: /(?:Fasting Blood Glucose|Fasting Blood Sugar|FBS\b|Fasting Glucose)/i,
    name: 'Fasting Blood Glucose',
    category: 'Metabolic',
    unit: 'mg/dL',
    defaultMin: 70,
    defaultMax: 99,
    explanation: 'Amount of sugar circulating in blood after fasting overnight; fundamental marker for insulin sensitivity.',
  },
  {
    regex: /(?:Estimated Avg Glucose|eAG\b)/i,
    name: 'Estimated Average Glucose (eAG)',
    category: 'Metabolic',
    unit: 'mg/dL',
    defaultMin: 70,
    defaultMax: 117,
    explanation: 'Mathematical conversion of HbA1c into daily milligram-per-deciliter blood sugar terms.',
  },

  // Hematology (CBC)
  {
    regex: /(?:^|\s)(?:Hemoglobin\s*\(Hb\)|Hemoglobin\b(?!\s*A1c)|Hb\s*\(Hb\)|Hb\b(?!\w)|Hgb\b)/i,
    name: 'Hemoglobin (Hb)',
    category: 'Hematology',
    unit: 'g/dL',
    defaultMin: 12.0,
    defaultMax: 17.0,
    explanation: 'Iron-rich protein in red blood cells that carries vital oxygen from your lungs to the rest of your body.',
  },
  {
    regex: /(?:Red Blood Cell Count|RBC Count|Total RBC|RBC\b)/i,
    name: 'Red Blood Cells (RBC)',
    category: 'Hematology',
    unit: 'mill/cu.mm',
    defaultMin: 4.2,
    defaultMax: 5.9,
    explanation: 'Cells responsible for transporting oxygen throughout tissues and returning carbon dioxide to the lungs.',
  },
  {
    regex: /(?:Packed Cell Volume|PCV\b|Hematocrit|HCT\b)/i,
    name: 'Packed Cell Volume (PCV/HCT)',
    category: 'Hematology',
    unit: '%',
    defaultMin: 38.0,
    defaultMax: 50.0,
    explanation: 'The percentage of your total blood volume that consists of red blood cells.',
  },
  {
    regex: /(?:Mean Corpuscular Volume|MCV\b)/i,
    name: 'Mean Corpuscular Volume (MCV)',
    category: 'Hematology',
    unit: 'fL',
    defaultMin: 80.0,
    defaultMax: 100.0,
    explanation: 'Measures the average physical size of your red blood cells.',
  },
  {
    regex: /(?:Mean Corpuscular Hb\b|MCH\b)/i,
    name: 'Mean Corpuscular Hb (MCH)',
    category: 'Hematology',
    unit: 'pg',
    defaultMin: 27.0,
    defaultMax: 32.0,
    explanation: 'The average amount of oxygen-carrying hemoglobin inside each individual red blood cell.',
  },
  {
    regex: /(?:MCH Concentration|MCHC\b)/i,
    name: 'MCH Concentration (MCHC)',
    category: 'Hematology',
    unit: 'g/dL',
    defaultMin: 32.0,
    defaultMax: 36.0,
    explanation: 'Concentration of hemoglobin in a given volume of packed red blood cells.',
  },
  {
    regex: /(?:Red Cell Distrib Width|RDW\b)/i,
    name: 'Red Cell Distribution Width (RDW)',
    category: 'Hematology',
    unit: '%',
    defaultMin: 11.5,
    defaultMax: 14.5,
    explanation: 'Measures variation in the size and shape of circulating red blood cells.',
  },
  {
    regex: /(?:Total Leukocyte Count|White Blood Cell Count|WBC Count|WBC\b|TLC\b)/i,
    name: 'Total Leukocytes (WBC)',
    category: 'Hematology',
    unit: '/cu.mm',
    defaultMin: 4000,
    defaultMax: 11000,
    explanation: 'Immune response soldiers that defend your body against bacterial, viral, and inflammatory infections.',
  },
  {
    regex: /(?:Neutrophils\b|Polymorphs\b)/i,
    name: 'Neutrophils',
    category: 'Hematology',
    unit: '%',
    defaultMin: 40,
    defaultMax: 75,
    explanation: 'The most abundant type of white blood cell, rapidly responding to acute bacterial infections.',
  },
  {
    regex: /(?:Lymphocytes\b)/i,
    name: 'Lymphocytes',
    category: 'Hematology',
    unit: '%',
    defaultMin: 20,
    defaultMax: 45,
    explanation: 'Specialized immune cells (B & T cells) that fight viral infections and generate antibody immunity.',
  },
  {
    regex: /(?:Monocytes\b)/i,
    name: 'Monocytes',
    category: 'Hematology',
    unit: '%',
    defaultMin: 2,
    defaultMax: 8,
    explanation: 'Phagocytic cells that clear out dead tissue and support long-term immune protection.',
  },
  {
    regex: /(?:Eosinophils\b)/i,
    name: 'Eosinophils',
    category: 'Hematology',
    unit: '%',
    defaultMin: 1,
    defaultMax: 6,
    explanation: 'White blood cells actively involved in allergic reactions and defense against parasites.',
  },
  {
    regex: /(?:Basophils\b)/i,
    name: 'Basophils',
    category: 'Hematology',
    unit: '%',
    defaultMin: 0,
    defaultMax: 1,
    explanation: 'Granulocytes involved in early allergic symptoms and inflammatory response.',
  },
  {
    regex: /(?:Platelet Count|Platelets\b|PLT\b)/i,
    name: 'Platelet Count (PLT)',
    category: 'Hematology',
    unit: '/cu.mm',
    defaultMin: 150000,
    defaultMax: 450000,
    explanation: 'Tiny blood disc fragments that form clots to prevent and stop bleeding when vessels are injured.',
  },
  {
    regex: /(?:Mean Platelet Volume|MPV\b)/i,
    name: 'Mean Platelet Volume (MPV)',
    category: 'Hematology',
    unit: 'fL',
    defaultMin: 7.4,
    defaultMax: 10.4,
    explanation: 'Reflects the average size of platelets and rate of platelet production in bone marrow.',
  },

  // Renal & Kidney
  {
    regex: /(?:Serum Creatinine|Creatinine\b)/i,
    name: 'Serum Creatinine',
    category: 'Renal',
    unit: 'mg/dL',
    defaultMin: 0.6,
    defaultMax: 1.2,
    explanation: 'Normal muscle breakdown waste product filtered by the kidneys; higher levels suggest reduced kidney filtration.',
  },
  {
    regex: /(?:Blood Urea Nitrogen|BUN\b|Blood Urea)/i,
    name: 'Blood Urea Nitrogen (BUN)',
    category: 'Renal',
    unit: 'mg/dL',
    defaultMin: 7.0,
    defaultMax: 20.0,
    explanation: 'Waste product from dietary protein metabolism cleared by kidneys; also influenced by hydration.',
  },
  {
    regex: /(?:eGFR|Glomerular Filtration Rate)/i,
    name: 'eGFR (Kidney Filtration)',
    category: 'Renal',
    unit: 'mL/min',
    defaultMin: 90,
    defaultMax: 120,
    explanation: 'Estimated efficiency at which kidneys filter metabolic toxins from the bloodstream.',
  },
  {
    regex: /(?:Uric Acid\b)/i,
    name: 'Uric Acid',
    category: 'Renal',
    unit: 'mg/dL',
    defaultMin: 2.6,
    defaultMax: 6.5,
    explanation: 'Compound created when the body purges purines; elevated levels can form joint crystals (gout).',
  },

  // Hepatic & Liver
  {
    regex: /(?:SGPT|ALT\b|Alanine Aminotransferase)/i,
    name: 'SGPT / ALT (Liver)',
    category: 'Liver',
    unit: 'U/L',
    defaultMin: 10,
    defaultMax: 45,
    explanation: 'Key liver enzyme released into the blood when hepatic cells experience inflammation or stress.',
  },
  {
    regex: /(?:SGOT|AST\b|Aspartate Aminotransferase)/i,
    name: 'SGOT / AST (Liver/Heart)',
    category: 'Liver',
    unit: 'U/L',
    defaultMin: 10,
    defaultMax: 35,
    explanation: 'Enzyme found in liver, heart, and muscle tissue; rises with tissue irritation or heavy exertion.',
  },
  {
    regex: /(?:Alkaline Phosphatase|ALP\b)/i,
    name: 'Alkaline Phosphatase (ALP)',
    category: 'Liver',
    unit: 'U/L',
    defaultMin: 40,
    defaultMax: 130,
    explanation: 'Enzyme associated with biliary ducts in the liver and active bone development.',
  },
  {
    regex: /(?:Total Bilirubin\b)/i,
    name: 'Total Bilirubin',
    category: 'Liver',
    unit: 'mg/dL',
    defaultMin: 0.2,
    defaultMax: 1.2,
    explanation: 'Yellow pigment byproduct of normal red cell degradation processed by healthy liver bile.',
  },
  {
    regex: /(?:Serum Albumin|Albumin\b)/i,
    name: 'Serum Albumin',
    category: 'Liver',
    unit: 'g/dL',
    defaultMin: 3.5,
    defaultMax: 5.0,
    explanation: 'Major blood protein made by the liver to retain intravascular fluid and circulate hormones.',
  },

  // Lipid & Cardiovascular
  {
    regex: /(?:Total Cholesterol\b|Cholesterol,\s*Total)/i,
    name: 'Total Cholesterol',
    category: 'Lipid',
    unit: 'mg/dL',
    defaultMin: 125,
    defaultMax: 200,
    explanation: 'Overall amount of fat-like sterol molecules in circulation across all lipoprotein carriers.',
  },
  {
    regex: /(?:Triglycerides\b|Triglyceride\b)/i,
    name: 'Triglycerides',
    category: 'Lipid',
    unit: 'mg/dL',
    defaultMin: 50,
    defaultMax: 150,
    explanation: 'Main form of dietary fat stored in cells, providing long-term fuel between meals.',
  },
  {
    regex: /(?:HDL Cholesterol|HDL\b)/i,
    name: 'HDL Cholesterol (Good)',
    category: 'Lipid',
    unit: 'mg/dL',
    defaultMin: 40,
    defaultMax: 60,
    explanation: 'High-Density Lipoprotein that sweeps excess arterial cholesterol back to the liver for recycling.',
  },
  {
    regex: /(?:LDL Cholesterol|LDL\b)/i,
    name: 'LDL Cholesterol (Bad)',
    category: 'Lipid',
    unit: 'mg/dL',
    defaultMin: 50,
    defaultMax: 100,
    explanation: 'Low-Density Lipoprotein that transports fat to tissues; excess particles can accumulate in blood vessels.',
  },
  {
    regex: /(?:VLDL Cholesterol|VLDL\b)/i,
    name: 'VLDL Cholesterol',
    category: 'Lipid',
    unit: 'mg/dL',
    defaultMin: 5,
    defaultMax: 30,
    explanation: 'Very-Low-Density Lipoprotein containing highest ratio of triglycerides.',
  },
  {
    regex: /(?:hs-CRP|High-Sensitivity CRP|C-Reactive Protein)/i,
    name: 'hs-CRP (Inflammation)',
    category: 'Cardiovascular',
    unit: 'mg/L',
    defaultMin: 0.1,
    defaultMax: 1.0,
    explanation: 'High-sensitivity inflammatory biomarker reflecting systemic arterial wall stress and cardiac risk.',
  },

  // Thyroid
  {
    regex: /(?:Thyroid Stimulating Hormone|TSH\b)/i,
    name: 'Thyroid Hormone (TSH)',
    category: 'Thyroid',
    unit: 'uIU/mL',
    defaultMin: 0.45,
    defaultMax: 4.5,
    explanation: 'Pituitary messenger that instructs your thyroid gland how much energy-regulating hormone to produce.',
  },

  // Electrolytes
  {
    regex: /(?:Serum Sodium|Sodium\b|Na\+)/i,
    name: 'Serum Sodium (Na+)',
    category: 'Electrolytes',
    unit: 'mEq/L',
    defaultMin: 136,
    defaultMax: 145,
    explanation: 'Critical mineral that balances systemic fluid pressure, nerve impulses, and muscle firing.',
  },
  {
    regex: /(?:Serum Potassium|Potassium\b|K\+)/i,
    name: 'Serum Potassium (K+)',
    category: 'Electrolytes',
    unit: 'mEq/L',
    defaultMin: 3.5,
    defaultMax: 5.1,
    explanation: 'Essential electrolyte regulating cellular water balance, smooth nerve signaling, and steady heart rhythm.',
  },
];

export class ExtractorService {
  /**
   * Extracts structured biomarker metrics from raw text report
   */
  public static extractBiomarkers(rawText: string): IBiomarker[] {
    const lines = rawText.split(/\r?\n/);
    const extracted: IBiomarker[] = [];
    const matchedNames = new Set<string>();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---')) continue;

      for (const def of KNOWN_BIOMARKERS) {
        if (matchedNames.has(def.name)) continue;

        if (def.regex.test(trimmed)) {
          const parsed = this.parseBiomarkerLine(trimmed, def);
          if (parsed) {
            extracted.push(parsed);
            matchedNames.add(def.name);
            break;
          }
        }
      }
    }

    return extracted;
  }

  /**
   * Parses single line containing a biomarker result
   */
  private static parseBiomarkerLine(line: string, def: BiomarkerDef): IBiomarker | null {
    // Locate where the biomarker name appeared in the line
    const nameMatch = def.regex.exec(line);
    const searchArea = nameMatch ? line.substring(nameMatch.index + nameMatch[0].length) : line;

    // Look for numeric values in the line area after the biomarker name
    const numberPattern = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/g;
    const matches = [...searchArea.matchAll(numberPattern)];

    if (!matches || matches.length === 0) return null;

    // The first numeric match following the biomarker name is the result
    const rawValStr = matches[0][0].replace(/,/g, '');
    const value = parseFloat(rawValStr);

    if (isNaN(value)) return null;

    // Detect range from line if available (e.g. 13.0 - 17.0 or 150,000 - 450,000)
    let refMin = def.defaultMin;
    let refMax = def.defaultMax;
    let refText = `${refMin} - ${refMax} ${def.unit}`;

    // Replace comma inside numbers e.g. 150,000 -> 150000 to match range properly
    const cleanLine = line.replace(/(\d+),(\d{3})/g, '$1$2');
    const rangeRegex = /(\d+(?:\.\d+)?)\s*[-–—to]+\s*(\d+(?:\.\d+)?)/i;
    const rangeMatch = cleanLine.match(rangeRegex);
    if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
      const parsedMin = parseFloat(rangeMatch[1]);
      const parsedMax = parseFloat(rangeMatch[2]);
      if (!isNaN(parsedMin) && !isNaN(parsedMax) && parsedMax >= parsedMin) {
        // Only override if sensible
        refMin = parsedMin;
        refMax = parsedMax;
        refText = `${refMin} - ${refMax} ${def.unit}`;
      }
    }

    // Determine status
    let status: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' = 'NORMAL';

    // Check textual flag first
    const upperLine = line.toUpperCase();
    if (upperLine.includes(' CRITICAL') || upperLine.includes('ALERT')) {
      status = 'CRITICAL';
    } else if (upperLine.includes(' HIGH') || upperLine.includes('ELEVATED')) {
      status = 'HIGH';
    } else if (upperLine.includes(' LOW') || upperLine.includes('REDUCED')) {
      status = 'LOW';
    } else if (upperLine.includes(' NORMAL') || upperLine.includes('DESIRABLE') || upperLine.includes('OPTIMAL')) {
      status = 'NORMAL';
    } else if (value < refMin) {
      // Numerical check
      const diffRatio = (refMin - value) / refMin;
      status = diffRatio > 0.4 ? 'CRITICAL' : 'LOW';
    } else if (value > refMax) {
      const diffRatio = (value - refMax) / refMax;
      status = diffRatio > 0.6 ? 'CRITICAL' : 'HIGH';
    }

    return {
      name: def.name,
      category: def.category,
      value,
      unit: def.unit,
      referenceMin: refMin,
      referenceMax: refMax,
      referenceText: refText,
      status,
      plainExplanation: def.explanation,
    };
  }

  /**
   * Extracts patient metadata if present in report text
   */
  public static extractMetadata(rawText: string) {
    let patientName = 'Anonymous Patient';
    let patientAge = '';
    let patientSex = '';
    let reportType = 'Diagnostic Lab Panel';

    const nameMatch = rawText.match(/PATIENT\s*NAME\s*[:\-]\s*([A-Za-z\s\.]+)(?:\s{2,}|\n|$)/i);
    if (nameMatch && nameMatch[1]) {
      patientName = nameMatch[1].trim();
    }

    const ageSexMatch = rawText.match(/AGE\s*\/?\s*SEX\s*[:\-]\s*(\d+\s*(?:Yrs|Years)?)\s*\/?\s*(Male|Female|M|F)?/i);
    if (ageSexMatch) {
      if (ageSexMatch[1]) patientAge = ageSexMatch[1].trim();
      if (ageSexMatch[2]) patientSex = ageSexMatch[2].trim();
    }

    if (rawText.includes('COMPLETE BLOOD COUNT') || rawText.includes('CBC')) {
      reportType = 'Complete Blood Count (CBC)';
    } else if (rawText.includes('METABOLIC') || rawText.includes('GLYCEMIC')) {
      reportType = 'Metabolic & Renal Profile';
    } else if (rawText.includes('LIPID')) {
      reportType = 'Cardiovascular & Lipid Panel';
    }

    return { patientName, patientAge, patientSex, reportType };
  }
}
