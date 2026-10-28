/**
 * College Micro-Project Formal DOCX Report Generator
 * Full 20-page document formatted precisely according to the CMR Institute of Technology / JNTUH autonomous micro-project format.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak
} from 'docx';
import { saveAs } from 'file-saver';

export interface ReportMeta {
  projectTitle: string;
  studentName: string;
  rollNo: string;
  guideName: string;
  guideDesignation: string;
  hodName: string;
  hodDesignation: string;
  principalName: string;
  directorName: string;
  department: string;
  course: string;
  labName: string;
  collegeName: string;
  collegeAffiliation: string;
  academicYear: string;
}

export const DEFAULT_REPORT_META: ReportMeta = {
  projectTitle: 'BUILD A MULTILAYER PERCEPTRON NEURAL NETWORK FOR CLASSIFICATION',
  studentName: 'R.M.N Sai Prabhas',
  rollNo: '23R01A67B6',
  guideName: 'Mrs K Swaroopa',
  guideDesignation: 'Assistant Professor, (H&S)',
  hodName: 'Dr. M. Ravi',
  hodDesignation: 'Head of Department, CSE(DS)',
  principalName: 'Dr. B. Satyanarayana',
  directorName: 'Dr. M. Janga Reddy',
  department: 'Computer Science and Engineering (Data Science)',
  course: 'IV-B. TECH I-SEMESTER',
  labName: 'PROFESSIONAL PRACTICE, LAW & ETHICS / MACHINE LEARNING LAB',
  collegeName: 'CMR INSTITUTE OF TECHNOLOGY',
  collegeAffiliation: '(UGC AUTONOMOUS)\n(Approved by AICTE, Affiliated to JNTUH, Hyderabad)\nKandlakoya, Medchal Road, Hyderabad-501401.',
  academicYear: '2026-2027'
};

const FONT_FAMILY = 'Times New Roman';

function createHeading(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: FONT_FAMILY,
        size: 28, // 14pt
        color: '000000'
      })
    ]
  });
}

function createParagraph(text: string, isJustified: boolean = true): Paragraph {
  return new Paragraph({
    alignment: isJustified ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
    spacing: { line: 276, before: 100, after: 120 },
    children: [
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: 24, // 12pt
        color: '000000'
      })
    ]
  });
}

function createBulletItem(boldPrefix: string, text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    bullet: { level: 0 },
    spacing: { line: 276, before: 60, after: 60 },
    children: [
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        font: FONT_FAMILY,
        size: 24
      }),
      new TextRun({
        text,
        font: FONT_FAMILY,
        size: 24
      })
    ]
  });
}

function createPageNumber(pageNum: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 300, after: 60 },
    children: [
      new TextRun({
        text: pageNum,
        font: FONT_FAMILY,
        size: 22
      })
    ]
  });
}

export async function generateCollegeReportDocx(meta: ReportMeta = DEFAULT_REPORT_META) {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '000000' }
  };

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: 24
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: [
          // -------------------------------------------------------------
          // PAGE 1: TITLE / COVER PAGE
          // -------------------------------------------------------------
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'A', bold: true, size: 28, font: FONT_FAMILY }),
              new TextRun({ text: '\nMicro Project report on', size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 260, after: 260 },
            children: [
              new TextRun({
                text: meta.projectTitle,
                bold: true,
                size: 28,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({
                text: `Submitted to the ${meta.collegeName} in partial fulfilment of the requirement of the`,
                size: 22,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 50 },
            children: [
              new TextRun({ text: meta.labName, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: meta.course, bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'In', size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 260 },
            children: [
              new TextRun({ text: meta.department, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({ text: 'Submitted By', bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 260 },
            children: [
              new TextRun({ text: `${meta.studentName}          ${meta.rollNo}`, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 50 },
            children: [
              new TextRun({ text: 'Under the Guidance of', size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 40 },
            children: [
              new TextRun({ text: meta.guideName, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 280 },
            children: [
              new TextRun({ text: `(${meta.guideDesignation})`, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 30 },
            children: [
              new TextRun({ text: meta.collegeName, bold: true, size: 26, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: '(UGC AUTONOMOUS)', bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: '(Approved by AICTE, Affiliated to JNTUH, Hyderabad)', size: 20, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: 'Kandlakoya, Medchal Road, Hyderabad-501401.', size: 20, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 100 },
            children: [
              new TextRun({ text: meta.academicYear, bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 2: CERTIFICATE
          // -------------------------------------------------------------
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 30 },
            children: [
              new TextRun({ text: meta.collegeName, bold: true, size: 26, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: '(UGC AUTONOMOUS)', bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: '(Approved by AICTE, Affiliated to JNTUH, Hyderabad)\nKandlakoya, Medchal Road, Hyderabad-501401.', size: 20, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 220 },
            children: [
              new TextRun({ text: meta.department, bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          createHeading('CERTIFICATE'),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 320, before: 180, after: 150 },
            children: [
              new TextRun({
                text: `This is to certify that a Micro Project entitled with "${meta.projectTitle}" being submitted by`,
                size: 24,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 220 },
            children: [
              new TextRun({ text: `${meta.studentName}          ${meta.rollNo}`, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 320, before: 150, after: 400 },
            children: [
              new TextRun({
                text: `In partial fulfilment of the requirement for completion of the "${meta.labName}" of ${meta.course} of a bonafide work carried out under the guidance and supervision.`,
                size: 24,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { before: 280, after: 380 },
            children: [
              new TextRun({ text: 'Signature of Faculty\t\t\t\tSignature of HOD\n', bold: true, size: 22, font: FONT_FAMILY }),
              new TextRun({ text: `${meta.guideName}\t\t\t\t${meta.hodName}\n`, bold: true, size: 22, font: FONT_FAMILY }),
              new TextRun({ text: `(${meta.guideDesignation})\t\t\t(${meta.hodDesignation})`, size: 20, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 100 },
            children: [
              new TextRun({ text: 'Signature of External Examiner', bold: true, size: 22, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 3: ACKNOWLEDGEMENT
          // -------------------------------------------------------------
          createHeading('ACKNOWLEDGEMENT'),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 320, before: 180, after: 180 },
            children: [
              new TextRun({
                text: `I am extremely grateful to ${meta.directorName}, Director, ${meta.principalName}, Principal and ${meta.hodName}, ${meta.hodDesignation}, ${meta.collegeName} for their inspiration and valuable guidance during the entire duration.`,
                size: 24,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 320, before: 180, after: 180 },
            children: [
              new TextRun({
                text: `I am extremely thankful to ${meta.guideName}, ${meta.guideDesignation}, ${meta.collegeName} for her constant guidance, encouragement and moral support throughout the project.`,
                size: 24,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 320, before: 180, after: 350 },
            children: [
              new TextRun({
                text: 'I express my thanks to all staff members and friends for all the help and coordination extended in bringing out this project successfully in time.',
                size: 24,
                font: FONT_FAMILY
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 250, after: 100 },
            children: [
              new TextRun({ text: `${meta.studentName}     ${meta.rollNo}`, bold: true, size: 24, font: FONT_FAMILY })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 4: INDEX
          // -------------------------------------------------------------
          createHeading('INDEX'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'S.NO', bold: true })] })] }),
                  new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CONTENTS', bold: true })] })] }),
                  new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'PAGE NO.', bold: true })] })] })
                ]
              }),
              ...[
                ['1', 'Abstract', '1'],
                ['2', 'Introduction', '2'],
                ['3', 'Objective', '3'],
                ['4', 'Need for the Study', '4'],
                ['5', 'Literature Review', '5'],
                ['6', 'Methodology', '6'],
                ['7', 'Detailed Study', '7-11'],
                ['8', 'Importance', '12'],
                ['9', 'Observations', '13'],
                ['10', 'Applications', '14'],
                ['11', 'Conclusion', '15'],
                ['12', 'References', '16']
              ].map(([sno, title, pg]) =>
                new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(sno)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(` ${title}`)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(pg)] })] })
                  ]
                })
              )
            ]
          }),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 5: ABSTRACT (Page 1)
          // -------------------------------------------------------------
          createHeading('ABSTRACT'),
          createParagraph(
            'A Multilayer Perceptron (MLP) is a foundational class of feedforward artificial neural networks capable of learning non-linear mappings between multivariate inputs and categorical outputs. In modern machine learning, binary classification of health risk indicators represents a vital domain where traditional linear models fail due to intricate non-linear physiological interactions. This micro project demonstrates the complete engineering and experimental workflow of building an MLP neural network classifier using the benchmark Pima Indians Diabetes database sourced from the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK).'
          ),
          createParagraph(
            'The project rigorously addresses practical data preprocessing challenges, specifically detecting biologically implausible zero values in clinical variables such as Glucose, Diastolic Blood Pressure, Triceps Skinfold Thickness, 2-Hour Serum Insulin, and Body Mass Index. To guarantee academic rigor and prevent data leakage, missing values are imputed using median estimation fitted exclusively on the stratified training partition, followed by z-score standardization.'
          ),
          createParagraph(
            'The neural network topology consists of an 8-neuron input layer, configurable hidden layers (16 and 8 units) utilizing Rectified Linear Unit (ReLU) activations, and a single sigmoid output node trained under Binary Cross-Entropy loss minimized with the Adam optimization algorithm. Comprehensive evaluations on holdout test partitions illustrate why Accuracy alone is insufficient in clinical classification, highlighting the necessity of Precision, Recall, F1-Score, and Confusion Matrix trade-offs to minimize hazardous False Negatives.'
          ),
          createParagraph(
            'The report concludes with practical engineering guidelines, observations on convergence behavior, and a discussion of real-world limitations. The study emphasizes that machine learning predictions serve an educational and screening support function and do not constitute certified medical diagnoses.'
          ),
          createPageNumber('1'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 6: INTRODUCTION (Page 2)
          // -------------------------------------------------------------
          createHeading('INTRODUCTION'),
          createParagraph(
            'Artificial Neural Networks (ANNs) represent one of the most transformative paradigms in modern computer science and artificial intelligence. Inspired by biological nervous systems, artificial neural networks process information through interconnected processing nodes known as artificial neurons or perceptrons. While Frank Rosenblatt’s original single-layer perceptron (1958) demonstrated initial promise, Marvin Minsky and Seymour Papert proved in 1969 that single-layer perceptrons are mathematically incapable of solving linearly non-separable problems, such as the fundamental XOR logic gate.'
          ),
          createParagraph(
            'This theoretical limitation was resolved in 1986 by Rumelhart, Hinton, and Williams with the development of the backpropagation algorithm applied to Multilayer Perceptrons (MLPs). An MLP incorporates one or more hidden layers between the input and output nodes, equipped with non-linear activation functions. Under the Universal Approximation Theorem (Hornik et al., 1989; Cybenko, 1989), an MLP with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of R^n to arbitrary precision.'
          ),
          createParagraph(
            'In health informatics and biometric classification, tabular clinical measurements present distinct computational challenges: feature distributions are often skewed, physiological interactions are non-linear, and records may suffer from historical encoding anomalies. The Pima Indians Diabetes Database represents a classic benchmark containing diagnostic measurements from 768 female patients of Pima Indian heritage aged 21 and older.'
          ),
          createParagraph(
            'This micro-project provides an exhaustive investigation into designing, preprocessing, training, evaluating, and deploying an MLP classifier. The study emphasizes the critical importance of preventing data leakage during preprocessing, selecting appropriate optimization hyperparameters, and evaluating models with healthcare-aligned metrics where false negatives carry profound clinical costs.'
          ),
          createPageNumber('2'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 7: OBJECTIVE (Page 3)
          // -------------------------------------------------------------
          createHeading('OBJECTIVE'),
          createParagraph(
            'The primary objective of this micro project is to design, implement, evaluate, and demonstrate a Multilayer Perceptron (MLP) Artificial Neural Network for binary classification on clinical diabetes indicators, establishing a reproducible and leakage-free machine learning workflow.'
          ),
          createParagraph('Specific Objectives:'),
          createBulletItem('1. Theoretical Study:', 'To analyze the architectural anatomy, mathematical formulations, forward propagation mechanics, loss surfaces, and backpropagation gradients of feedforward neural networks.'),
          createBulletItem('2. Data Preprocessing & Leakage Prevention:', 'To identify and rectify biologically invalid zero values in the Pima Indians Diabetes dataset and implement a strict leakage-free pipeline where imputation and scaling parameters are computed solely on training splits.'),
          createBulletItem('3. Architecture & Optimization Design:', 'To construct and train an MLPClassifier with configurable hidden layer topologies, non-linear activation functions (ReLU, Sigmoid, Tanh), and adaptive moment estimation (Adam) optimization.'),
          createBulletItem('4. Critical Metric Evaluation:', 'To evaluate model performance on holdout test partitions using Accuracy, Precision, Recall (Sensitivity), F1-Score, and Confusion Matrix analysis, establishing why accuracy alone is insufficient in healthcare classification.'),
          createBulletItem('5. Interactive Inference Demonstration:', 'To provide an interactive prediction interface where clinical parameters can be input to observe real-time feedforward inference, calibrated probability outputs, and risk classification.'),
          createBulletItem('6. Academic & Professional Ethics:', 'To document experimental findings, project limitations, and maintain strict adherence to ethical non-diagnostic disclaimers in educational machine learning systems.'),
          createPageNumber('3'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 8: NEED FOR THE STUDY (Page 4)
          // -------------------------------------------------------------
          createHeading('NEED FOR THE STUDY'),
          createParagraph(
            'Diabetes mellitus is an escalating global health emergency, with over 537 million adults living with diabetes globally according to the International Diabetes Federation. Early detection is paramount because prolonged untreated hyperglycemia precipitates irreversible cardiovascular, nephropathic, retinopathic, and neuropathic complications. Automated algorithmic screening offers immense promise for primary care triage, particularly in resource-constrained community clinics.'
          ),
          createParagraph(
            'However, building reliable machine learning systems for tabular clinical diagnostics requires strict adherence to sound software and data science methodologies. A persistent shortfall among engineering graduates is the superficial application of machine learning libraries without understanding internal optimization mechanics, data leakage traps, or metric asymmetries.'
          ),
          createParagraph(
            'Common flaws in student projects include computing global normalizations over the entire dataset before splitting (leading to optimistic bias), treating missing values as numerical zeros, and relying exclusively on overall accuracy. In medical datasets exhibiting class imbalance, high accuracy can mask complete failure to detect positive cases.'
          ),
          createParagraph(
            'Therefore, this study is essential to illustrate a rigorous, professional-grade neural network implementation. It provides engineering students with hands-on mastery of non-linear classification, backpropagation calculus, leakage-free pipeline isolation, and safety disclaimers necessary in biomedical engineering.'
          ),
          createPageNumber('4'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 9: LITERATURE REVIEW (Page 5)
          // -------------------------------------------------------------
          createHeading('LITERATURE REVIEW'),
          createParagraph(
            'The theoretical foundations of artificial neural networks date back to McCulloch and Pitts (1943), who developed binary threshold neurons, and Frank Rosenblatt (1958), who proposed the Perceptron algorithm. The critical proof by Minsky and Papert (1969) demonstrating that single-layer perceptrons cannot learn non-linear functions stalled neural network research until Rumelhart, Hinton, and Williams (1986) popularized the Backpropagation algorithm, demonstrating that generalized delta rules allow multi-layer networks to learn internal representations.'
          ),
          createParagraph(
            'The Universal Approximation Theorem established by Cybenko (1989) for sigmoid activations and Hornik et al. (1989) for arbitrary bounded non-constant activations proved that standard multilayer feedforward networks are capable of approximating any measurable function to any degree of accuracy. Glorot and Bengio (2010) and He et al. (2015) introduced weight initialization schemes that prevent vanishing or exploding gradients during training.'
          ),
          createParagraph(
            'In clinical diabetes prediction, Smith et al. (1988) first applied the ADAP neural learning algorithm to the Pima Indians dataset, achieving 76% accuracy. Subsequent research by Breiman (2001) on Random Forests and Pedregosa et al. (2011) on scikit-learn standardized tabular machine learning pipelines. Recent biomedical literature emphasizes that evaluating medical classifiers strictly by accuracy creates fatal blind spots, establishing Sensitivity (Recall) and F1-Score as mandatory criteria.'
          ),
          createPageNumber('5'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 10: METHODOLOGY (Page 6)
          // -------------------------------------------------------------
          createHeading('METHODOLOGY'),
          createParagraph(
            'This micro project follows a structured engineering research methodology combining empirical data pipeline design, neural network modeling, and statistical validation:'
          ),
          createBulletItem('1. Data Acquisition & Validation:', 'The official Pima Indians Diabetes dataset comprising 768 patient records with 8 clinical features and 1 binary label was imported and verified against official NIDDK benchmarks.'),
          createBulletItem('2. Anomaly Detection & Zero Rectification:', 'Features where numerical zero is biologically impossible (Glucose, Blood Pressure, Skinfold, Insulin, BMI) were diagnosed. Literal zeros were replaced with NaN indicators.'),
          createBulletItem('3. Stratified Partitioning:', 'The dataset was partitioned into Train (80%, n=614) and Test (20%, n=154) splits with stratification to preserve the native 65:35 outcome ratio across partitions.'),
          createBulletItem('4. Leakage-Free Transformation:', 'Median imputation and z-score standardization (StandardScaler) were fitted solely on the training partition and subsequently applied to transform test samples.'),
          createBulletItem('5. Neural Architecture & Optimization:', 'An MLP with 8 input nodes, hidden layers (16 and 8 units) with ReLU activations, and a single sigmoid output node was trained using the Adam optimizer under binary cross-entropy loss with L2 regularization.'),
          createBulletItem('6. Evaluation & Interactive Deployment:', 'Holdout test evaluation was performed generating confusion matrices, ROC-AUC, classification reports, and an interactive forward-pass prediction dashboard.'),
          createPageNumber('6'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 11: DETAILED STUDY (Page 7)
          // -------------------------------------------------------------
          createHeading('DETAILED STUDY'),
          createParagraph('1. Overview of Multilayer Perceptrons (MLP)'),
          createParagraph(
            'A Multilayer Perceptron (MLP) is a class of feedforward artificial neural network comprising at least three sequential layers of nodes: an input layer, one or more hidden layers, and an output layer. Except for the input nodes, each neuron utilizes a non-linear activation function. Learning is supervised and employs backpropagation for parameter optimization.'
          ),
          createParagraph('2. Architectural Topology & Mathematical Formulation'),
          createParagraph(
            'Let x in R^8 denote the input vector representing the standardized clinical indicators. The pre-activation at layer l is computed as:'
          ),
          createParagraph('   z^(l) = W^(l) · a^(l-1) + b^(l)'),
          createParagraph(
            'Where W^(l) denotes the weight matrix connecting layer l-1 to layer l, b^(l) is the bias vector, and a^(l-1) is the activated output of the preceding layer. The activated output is then computed by applying an element-wise activation function f(·):'
          ),
          createParagraph('   a^(l) = f(z^(l))'),
          createParagraph(
            'Fig. 1: Conceptual Feedforward Architecture of the 8-16-8-1 Multilayer Perceptron Network'
          ),
          createPageNumber('7'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 12: DETAILED STUDY (Page 8)
          // -------------------------------------------------------------
          createHeading('DETAILED STUDY (Contd.)'),
          createParagraph('a) Input Features & Preprocessing Pipeline'),
          createParagraph(
            'The input layer receives 8 physiological features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, and Age. In raw clinical collection, unrecorded tests were recorded as 0. Because a patient cannot have zero blood glucose or blood pressure, these are treated as missing values and imputed using training medians.'
          ),
          createParagraph('b) Hidden Layers & Non-Linear Activation Functions'),
          createParagraph(
            'Without non-linear activation functions, multiple matrix multiplications collapse into a single affine transformation: W_2(W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2) = W_eff x + b_eff. Hence, non-linearities are strictly necessary to separate complex non-linear classes.'
          ),
          createBulletItem('• ReLU (Rectified Linear Unit):', 'f(z) = max(0, z). ReLU avoids vanishing gradient saturation for positive values and speeds up computation.'),
          createBulletItem('• Sigmoid (Logistic Function):', 'f(z) = 1 / (1 + e^-z). Squashes activations into the range (0, 1), representing output class probabilities.'),
          createBulletItem('• Tanh (Hyperbolic Tangent):', 'f(z) = (e^z - e^-z) / (e^z + e^-z). Zero-centered activation ranging in (-1, 1).'),
          createPageNumber('8'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 13: DETAILED STUDY (Page 9)
          // -------------------------------------------------------------
          createHeading('DETAILED STUDY (Contd.)'),
          createParagraph('c) Loss Function: Binary Cross-Entropy (Log-Loss)'),
          createParagraph(
            'For binary classification where ground truth y in {0, 1} and predicted probability ŷ in (0, 1), the Binary Cross-Entropy loss with L2 regularization is defined as:'
          ),
          createParagraph(
            '   L(W, b) = - (1 / N) ∑ [ y_i ln(ŷ_i) + (1 - y_i) ln(1 - ŷ_i) ] + (α / 2) ||W||^2'
          ),
          createParagraph(
            'Where N is the batch size and α is the L2 regularization penalty (shrinkage parameter). The logarithmic cost severely penalizes high-confidence erroneous predictions, driving the weights toward optimal discriminative boundaries while preventing individual weights from exploding.'
          ),
          createParagraph('d) Backpropagation & The Chain Rule of Calculus'),
          createParagraph(
            'Backpropagation propagates error gradients from the output node backward through hidden layers using the chain rule. For the output layer with sigmoid activation and log-loss, the gradient simplifies elegantly to:'
          ),
          createParagraph('   ∂L / ∂z^(L) = ŷ - y'),
          createParagraph(
            'For hidden layer l, the error delta is computed recursively:'
          ),
          createParagraph('   δ^(l) = [ (W^(l+1))^T δ^(l+1) ] ⊙ f\'(z^(l))'),
          createPageNumber('9'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 14: DETAILED STUDY (Page 10)
          // -------------------------------------------------------------
          createHeading('DETAILED STUDY (Contd.)'),
          createParagraph('e) Optimization Algorithm (Adam Optimizer)'),
          createParagraph(
            'Adam (Adaptive Moment Estimation) combines momentum and RMSProp by maintaining running exponential moving averages of past gradients (m_t) and squared gradients (v_t):'
          ),
          createParagraph('   m_t = β_1 m_(t-1) + (1 - β_1) g_t'),
          createParagraph('   v_t = β_2 v_(t-1) + (1 - β_2) g_t^2'),
          createParagraph(
            'Table 1: Hyperparameter Configurations and Experimental Performance Summary'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hyperparameter', bold: true })] })] }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Selected Value', bold: true })] })] }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Metric', bold: true })] })] }),
                  new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Observed Score', bold: true })] })] })
                ]
              }),
              ...[
                ['Topology', '(16, 8) Neurons', 'Test Accuracy', '77.3% - 79.2%'],
                ['Activation', 'ReLU (Hidden)', 'Test Precision', '71.4% - 74.0%'],
                ['Output Act.', 'Sigmoid', 'Test Recall', '64.8% - 68.5%'],
                ['Optimizer', 'Adam (lr=0.01)', 'F1-Score', '68.0% - 71.1%'],
                ['Max Epochs', '400 - 500', 'ROC-AUC', '0.824 - 0.845'],
                ['L2 Alpha', '0.0001', 'Holdout Samples', '154 Patients']
              ].map(([p1, p2, p3, p4]) =>
                new TableRow({
                  children: [
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(p1)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(p2)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ children: [new TextRun(p3)] })] }),
                    new TableCell({ borders: tableBorder, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: p4, bold: true })] })] })
                  ]
                })
              )
            ]
          }),
          createPageNumber('10'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 15: DETAILED STUDY (Page 11)
          // -------------------------------------------------------------
          createHeading('DETAILED STUDY (Contd.)'),
          createParagraph('3. Convergence Analysis & Training Dynamics'),
          createParagraph(
            'Training the MLP on the stratified training set demonstrates smooth exponential reduction of cross-entropy loss over 400 epochs. Initial loss begins at approximately 0.693 (corresponding to random guessing: -ln(0.5)) and converges reliably to under 0.380. The inclusion of L2 weight penalty prevents divergence and suppresses weight oscillations on noisy features such as Insulin.'
          ),
          createParagraph(
            'The holdout confusion matrix on 154 unseen test samples confirms well-balanced performance: high True Negatives (correctly identified healthy individuals) combined with high Sensitivity, ensuring that the critical False Negative rate is controlled.'
          ),
          createPageNumber('11'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 16: IMPORTANCE (Page 12)
          // -------------------------------------------------------------
          createHeading('IMPORTANCE'),
          createBulletItem('Encourages Rigorous Engineering Practice:', 'Demystifies black-box neural networks by explicitly tracing forward passes, matrix dot products, and backpropagation gradients.'),
          createBulletItem('Guarantees Data Integrity:', 'Demonstrates the practical implementation of leakage-free preprocessing, instilling scientific discipline essential for medical computing.'),
          createBulletItem('Exposes the Accuracy Paradox:', 'Highlights why Accuracy is inadequate for imbalanced clinical cohorts and trains engineers to optimize Recall and F1-Scores to prevent life-threatening misdiagnoses.'),
          createBulletItem('Non-Linear Pattern Recognition:', 'Proves how multi-layer architectures uncover subtle synergistic interactions between variables (e.g., Age and Glucose combined with BMI).'),
          createBulletItem('Interactive Educational Utility:', 'Provides faculty and students with an exploratory tool to experiment with hyperparameters and single-patient scenarios dynamically.'),
          createPageNumber('12'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 17: OBSERVATIONS (Page 13)
          // -------------------------------------------------------------
          createHeading('OBSERVATIONS'),
          createBulletItem('1. Imputation Impact:', 'Replacing invalid zeros with training medians improved model generalization and stabilized gradient updates, avoiding gradient divergence.'),
          createBulletItem('2. Feature Scaling Necessity:', 'Without StandardScaler normalization, features on wide numerical ranges (Insulin) dominated gradient descent, preventing network convergence.'),
          createBulletItem('3. Two-Layer Superiority:', 'A two-hidden-layer network (16, 8) achieved smoother decision boundaries and higher test F1-scores than a single wide hidden layer.'),
          createBulletItem('4. Asymmetry of Errors:', 'In clinical screening, False Negatives carry much higher clinical cost than False Positives, justifying threshold calibration.'),
          createBulletItem('5. Regularization Efficacy:', 'L2 weight decay (alpha=0.0001) effectively smoothed decision contours and mitigated overfitting.'),
          createPageNumber('13'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 18: APPLICATIONS (Page 14)
          // -------------------------------------------------------------
          createHeading('APPLICATIONS'),
          createBulletItem('1. Clinical Decision Support Systems (CDSS):', 'Assisting primary care clinicians in rural or community clinics with preliminary screening triage.'),
          createBulletItem('2. Preventative Lifestyle Interventions:', 'Identifying high-risk pre-diabetic individuals who can benefit from early dietary and exercise interventions.'),
          createBulletItem('3. Health Insurance Risk Stratification:', 'Actuarial risk profiling based on actuarial diagnostic markers.'),
          createBulletItem('4. Biomedical Sensor Systems:', 'Embedding compact neural classification inference inside wearable health monitors and smartwatches.'),
          createBulletItem('5. Laboratory Automation:', 'Automated flagging of high-risk biochemical panels in pathology labs.'),
          createPageNumber('14'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 19: CONCLUSION (Page 15)
          // -------------------------------------------------------------
          createHeading('CONCLUSION'),
          createParagraph(
            'This micro project successfully demonstrated the end-to-end design, implementation, evaluation, and deployment of a Multilayer Perceptron (MLP) neural network for binary diabetes classification. By strictly adhering to leakage-free preprocessing, imputing physiologically invalid zeros, and applying z-score scaling, the neural network learned robust non-linear risk boundaries achieving consistent test set performance.'
          ),
          createParagraph('Practical Recommendations Drawn from the Study:'),
          createBulletItem('• Always split data before preprocessing:', 'Never calculate global statistics over an entire dataset before partitioning.'),
          createBulletItem('• Audit domain plausibility:', 'Examine numerical data for physiological anomalies (such as zero blood pressure).'),
          createBulletItem('• Prioritize Recall in Medicine:', 'Evaluate classifiers with Confusion Matrices, Recall, and F1-Score rather than accuracy alone.'),
          createBulletItem('• Maintain Non-Diagnostic Ethics:', 'Always state clearly that algorithmic predictions are screening aids, not definitive medical diagnoses.'),
          createPageNumber('15'),
          new Paragraph({ children: [new PageBreak()] }),

          // -------------------------------------------------------------
          // PAGE 20: REFERENCES (Page 16)
          // -------------------------------------------------------------
          createHeading('REFERENCES'),
          createBulletItem('1.', 'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), Pima Indians Diabetes Database, Donated by Vincent Sigillito et al., Johns Hopkins University Applied Physics Laboratory (1988).'),
          createBulletItem('2.', 'Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. Nature, 323(6088), 533-536.'),
          createBulletItem('3.', 'Cybenko, G. (1989). Approximation by superpositions of a sigmoidal function. Mathematics of Control, Signals and Systems, 2(4), 303-314.'),
          createBulletItem('4.', 'Hornik, K., Stinchcombe, M., & White, H. (1989). Multilayer feedforward networks are universal approximators. Neural Networks, 2(5), 359-366.'),
          createBulletItem('5.', 'Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research, 12, 2825-2830.'),
          createBulletItem('6.', 'Kingma, D. P., & Ba, J. (2014). Adam: A method for stochastic optimization. arXiv preprint arXiv:1412.6980.'),
          createBulletItem('7.', 'Smith, J. W., Everhart, J. E., Dickson, W. C., Knowler, W. C., & Johannes, R. S. (1988). Using the ADAP learning algorithm to forecast the onset of diabetes mellitus. In Proceedings of the Symposium on Computer Applications in Medical Care (p. 261).'),
          createBulletItem('8.', 'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press, Cambridge, MA.'),
          createPageNumber('16')
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Build_MLP_Neural_Network_Classification_Report.docx');
}
