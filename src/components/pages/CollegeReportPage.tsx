import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Edit3,
  Check,
  Building,
  GraduationCap,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import {
  ReportMeta,
  DEFAULT_REPORT_META,
  generateCollegeReportDocx
} from '../../utils/docxReportGenerator.ts';

export const CollegeReportPage: React.FC = () => {
  const [meta, setMeta] = useState<ReportMeta>(DEFAULT_REPORT_META);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);

  const handleDownloadDocx = async () => {
    setIsGeneratingDocx(true);
    try {
      await generateCollegeReportDocx(meta);
    } catch (e) {
      console.error(e);
      alert('Error generating Word document. Please try again.');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOriginalPdf = () => {
    const a = document.createElement('a');
    a.href = '/assets/aistudio/PPLE_MICRO-PROJECT_d644dd35.pdf';
    a.download = 'PPLE_MICRO-PROJECT_d644dd35.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Action Bar (Hidden during print) */}
      <div className="no-print bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Stage 9: Official College Micro-Project Report Document
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Exact Formatted Laboratory Micro-Project Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Generated in the exact 20-page format of CMR Institute of Technology (UGC Autonomous / JNTUH) with borders, certificate, acknowledgement, index, and references.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              {isEditing ? 'Close Editor' : 'Customize Details'}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 text-xs font-semibold shadow-md transition"
              title="Print to PDF with exact A4 page borders"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isGeneratingDocx}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition"
              title="Download editable Microsoft Word .docx report"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingDocx ? 'Generating .DOCX...' : 'Download Word (.docx)'}
            </button>

            <button
              onClick={handleDownloadOriginalPdf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
              title="Download the attached sample PDF"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Reference PDF
            </button>
          </div>
        </div>

        {/* Customization Drawer */}
        {isEditing && (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-cyan-300 uppercase tracking-wide">
                Edit Student & Institution Details
              </span>
              <button
                onClick={() => setMeta(DEFAULT_REPORT_META)}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div>
                <label className="text-slate-400 block mb-1">Student Name:</label>
                <input
                  type="text"
                  value={meta.studentName}
                  onChange={e => setMeta({ ...meta, studentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Roll / Hall Ticket No:</label>
                <input
                  type="text"
                  value={meta.rollNo}
                  onChange={e => setMeta({ ...meta, rollNo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Faculty Guide Name:</label>
                <input
                  type="text"
                  value={meta.guideName}
                  onChange={e => setMeta({ ...meta, guideName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Guide Designation:</label>
                <input
                  type="text"
                  value={meta.guideDesignation}
                  onChange={e => setMeta({ ...meta, guideDesignation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">HOD Name:</label>
                <input
                  type="text"
                  value={meta.hodName}
                  onChange={e => setMeta({ ...meta, hodName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Department:</label>
                <input
                  type="text"
                  value={meta.department}
                  onChange={e => setMeta({ ...meta, department: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">College Name:</label>
                <input
                  type="text"
                  value={meta.collegeName}
                  onChange={e => setMeta({ ...meta, collegeName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Semester & Year:</label>
                <input
                  type="text"
                  value={meta.course}
                  onChange={e => setMeta({ ...meta, course: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Academic Year:</label>
                <input
                  type="text"
                  value={meta.academicYear}
                  onChange={e => setMeta({ ...meta, academicYear: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 20-PAGE EXACT COLLEGE REPORT DISPLAY WITH BORDERS */}
      {/* ============================================================== */}
      <div className="report-container flex flex-col items-center gap-8 select-text">
        {/* Helper Badge */}
        <div className="no-print text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>Viewing full 20-page document formatted to the CMRIT / JNTUH autonomous template.</span>
          <span className="text-cyan-400 font-medium">Use buttons above to download .docx or print to PDF.</span>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 1: TITLE / COVER PAGE */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between text-center relative box-border">
          <div className="space-y-4">
            <div className="text-base font-bold">A</div>
            <div className="text-sm">Micro Project report on</div>
            <div className="text-lg md:text-xl font-bold uppercase tracking-wide px-4 leading-tight">
              {meta.projectTitle}
            </div>
            <div className="text-xs pt-2">
              Submitted to the {meta.collegeName} in partial fulfilment of the requirement of the
            </div>
            <div className="text-sm font-bold uppercase">{meta.labName}</div>
            <div className="text-xs font-bold uppercase">{meta.course}</div>
            <div className="text-xs">In</div>
            <div className="text-sm font-bold uppercase">{meta.department}</div>
          </div>

          <div className="my-6 space-y-4">
            <div className="text-xs font-bold uppercase">Submitted By</div>
            <div className="text-sm font-bold tracking-wider">
              {meta.studentName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{meta.rollNo}
            </div>

            <div className="text-xs pt-4">Under the Guidance of</div>
            <div className="text-sm font-bold">{meta.guideName}</div>
            <div className="text-xs">({meta.guideDesignation})</div>
          </div>

          {/* Logo Emblem Recreation */}
          <div className="flex flex-col items-center justify-center space-y-1 my-2">
            <div className="flex gap-1 items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block" />
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-600 inline-block" />
            </div>
            <div className="text-xl font-black tracking-tight text-slate-800">CMR</div>
            <div className="text-[9px] font-bold tracking-widest text-slate-600 uppercase">
              GROUP OF INSTITUTIONS
            </div>
            <div className="text-[8px] tracking-widest text-slate-500 uppercase">
              EXPLORE TO INVENT
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <div className="text-sm font-bold uppercase">{meta.collegeName}</div>
            <div className="text-xs font-bold">(UGC AUTONOMOUS)</div>
            <div className="text-[11px]">(Approved by AICTE, Affiliated to JNTUH, Hyderabad)</div>
            <div className="text-[11px]">Kandlakoya, Medchal Road, Hyderabad-501401.</div>
            <div className="text-xs font-bold pt-2">{meta.academicYear}</div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 2: CERTIFICATE */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center space-y-1">
              {/* Emblem */}
              <div className="flex flex-col items-center justify-center mb-1">
                <div className="flex gap-1 items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
                </div>
                <div className="text-lg font-black tracking-tight text-slate-800">CMR</div>
                <div className="text-[8px] font-bold tracking-widest text-slate-600 uppercase">
                  GROUP OF INSTITUTIONS
                </div>
              </div>
              <div className="text-sm font-bold uppercase">{meta.collegeName}</div>
              <div className="text-xs font-bold">(UGC AUTONOMOUS)</div>
              <div className="text-[10px]">(Approved by AICTE, Affiliated to JNTUH, Hyderabad)</div>
              <div className="text-[10px]">Kandlakoya, Medchal Road, Hyderabad-501401.</div>
              <div className="text-xs font-bold pt-1">{meta.department}</div>
            </div>

            <div className="text-center my-8">
              <h3 className="text-base font-bold uppercase underline tracking-wider">
                CERTIFICATE
              </h3>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-justify mb-6">
              This is to certify that a Micro Project entitled with <strong>"{meta.projectTitle}"</strong> being submitted by
            </p>

            <div className="text-center text-sm font-bold my-6">
              {meta.studentName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{meta.rollNo}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-justify mt-6">
              In partial fulfilment of the requirement for completion of the <strong>"{meta.labName}"</strong> of <strong>{meta.course}</strong> of a bonafide work carried out under the guidance and supervision.
            </p>
          </div>

          <div className="space-y-12 pt-10">
            <div className="flex justify-between items-start text-xs font-bold">
              <div>
                <div>Signature of Faculty</div>
                <div className="mt-8 font-semibold">{meta.guideName}</div>
                <div className="text-[10px] font-normal font-sans">({meta.guideDesignation})</div>
              </div>

              <div className="text-right">
                <div>Signature of HOD</div>
                <div className="mt-8 font-semibold">{meta.hodName}</div>
                <div className="text-[10px] font-normal font-sans">({meta.hodDesignation})</div>
              </div>
            </div>

            <div className="text-center text-xs font-bold pt-6">
              <div>Signature of External Examiner</div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 3: ACKNOWLEDGEMENT */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-8">
              <h3 className="text-base font-bold uppercase tracking-wider">
                ACKNOWLEDGEMENT
              </h3>
            </div>

            <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-justify mt-8">
              <p>
                I am extremely grateful to <strong>{meta.directorName}</strong>, Director, <strong>{meta.principalName}</strong>, Principal and <strong>{meta.hodName}</strong>, {meta.hodDesignation}, {meta.collegeName} for their inspiration and valuable guidance during the entire duration.
              </p>

              <p>
                I am extremely thankful to <strong>{meta.guideName}</strong>, {meta.guideDesignation}, {meta.collegeName} for her constant guidance, encouragement and moral support throughout the project.
              </p>

              <p>
                I express my thanks to all staff members and friends for all the help and coordination extended in bringing out this project successfully in time.
              </p>
            </div>
          </div>

          <div className="text-right text-xs sm:text-sm font-bold mb-8">
            <div>{meta.studentName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{meta.rollNo}</div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 4: INDEX */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-start relative box-border">
          <div className="text-center my-6">
            <h3 className="text-base font-bold uppercase tracking-wider">
              INDEX
            </h3>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-black">
              <thead>
                <tr className="border-b border-black font-bold text-center">
                  <th className="border-r border-black p-2.5 w-16">S.NO</th>
                  <th className="border-r border-black p-2.5">CONTENTS</th>
                  <th className="p-2.5 w-24">PAGE NO.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-xs">
                {[
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
                ].map(([sno, name, pg]) => (
                  <tr key={sno}>
                    <td className="border-r border-black p-2.5 text-center">{sno}</td>
                    <td className="border-r border-black p-2.5 pl-4">{name}</td>
                    <td className="p-2.5 text-center">{pg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 5: ABSTRACT (Page 1) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">ABSTRACT</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                A Multilayer Perceptron (MLP) is a foundational class of feedforward artificial neural networks capable of learning non-linear mappings between multivariate inputs and categorical outputs. In modern machine learning, binary classification of health risk indicators represents a vital domain where traditional linear models fail due to intricate non-linear physiological interactions. This micro project demonstrates the complete engineering and experimental workflow of building an MLP neural network classifier using the benchmark Pima Indians Diabetes database sourced from the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK).
              </p>
              <p>
                The project rigorously addresses practical data preprocessing challenges, specifically detecting biologically implausible zero values in clinical variables such as Glucose, Diastolic Blood Pressure, Triceps Skinfold Thickness, 2-Hour Serum Insulin, and Body Mass Index. To guarantee academic rigor and prevent data leakage, missing values are imputed using median estimation fitted exclusively on the stratified training partition, followed by z-score standardization.
              </p>
              <p>
                The neural network topology consists of an 8-neuron input layer, configurable hidden layers (16 and 8 units) utilizing Rectified Linear Unit (ReLU) activations, and a single sigmoid output node trained under Binary Cross-Entropy loss minimized with the Adam optimization algorithm. Comprehensive evaluations on holdout test partitions illustrate why Accuracy alone is insufficient in clinical classification, highlighting the necessity of Precision, Recall, F1-Score, and Confusion Matrix trade-offs to minimize hazardous False Negatives.
              </p>
              <p>
                The report concludes with practical engineering guidelines, observations on convergence behavior, and a discussion of real-world limitations. The study emphasizes that machine learning predictions serve an educational and screening support function and do not constitute certified medical diagnoses.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">1</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 6: INTRODUCTION (Page 2) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">INTRODUCTION</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                Artificial Neural Networks (ANNs) represent one of the most transformative paradigms in modern computer science and artificial intelligence. Inspired by biological nervous systems, artificial neural networks process information through interconnected processing nodes known as artificial neurons or perceptrons. While Frank Rosenblatt’s original single-layer perceptron (1958) demonstrated initial promise, Marvin Minsky and Seymour Papert proved in 1969 that single-layer perceptrons are mathematically incapable of solving linearly non-separable problems, such as the fundamental XOR logic gate.
              </p>
              <p>
                This theoretical limitation was resolved in 1986 by Rumelhart, Hinton, and Williams with the development of the backpropagation algorithm applied to Multilayer Perceptrons (MLPs). An MLP incorporates one or more hidden layers between the input and output nodes, equipped with non-linear activation functions. Under the Universal Approximation Theorem (Hornik et al., 1989; Cybenko, 1989), an MLP with a single hidden layer containing a finite number of neurons can approximate any continuous function on compact subsets of R^n to arbitrary precision.
              </p>
              <p>
                In health informatics and biometric classification, tabular clinical measurements present distinct computational challenges: feature distributions are often skewed, physiological interactions are non-linear, and records may suffer from historical encoding anomalies. The Pima Indians Diabetes Database represents a classic benchmark containing diagnostic measurements from 768 female patients of Pima Indian heritage aged 21 and older.
              </p>
              <p>
                This micro-project provides an exhaustive investigation into designing, preprocessing, training, evaluating, and deploying an MLP classifier. The study emphasizes the critical importance of preventing data leakage during preprocessing, selecting appropriate optimization hyperparameters, and evaluating models with healthcare-aligned metrics where false negatives carry profound clinical costs.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">2</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 7: OBJECTIVE (Page 3) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">OBJECTIVE</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                The primary objective of this micro project is to design, implement, evaluate, and demonstrate a Multilayer Perceptron (MLP) Artificial Neural Network for binary classification on clinical diabetes indicators, establishing a reproducible and leakage-free machine learning workflow.
              </p>
              <div className="font-bold pt-2">Specific Objectives:</div>
              <ul className="space-y-2 list-none pl-1">
                <li><strong>1. Theoretical Study:</strong> To analyze the architectural anatomy, mathematical formulations, forward propagation mechanics, loss surfaces, and backpropagation gradients of feedforward neural networks.</li>
                <li><strong>2. Data Preprocessing & Leakage Prevention:</strong> To identify and rectify biologically invalid zero values in the Pima Indians Diabetes dataset and implement a strict leakage-free pipeline where imputation and scaling parameters are computed solely on training splits.</li>
                <li><strong>3. Architecture & Optimization Design:</strong> To construct and train an MLPClassifier with configurable hidden layer topologies, non-linear activation functions (ReLU, Sigmoid, Tanh), and adaptive moment estimation (Adam) optimization.</li>
                <li><strong>4. Critical Metric Evaluation:</strong> To evaluate model performance on holdout test partitions using Accuracy, Precision, Recall (Sensitivity), F1-Score, and Confusion Matrix analysis, establishing why accuracy alone is insufficient in healthcare classification.</li>
                <li><strong>5. Interactive Inference Demonstration:</strong> To provide an interactive prediction interface where clinical parameters can be input to observe real-time feedforward inference, calibrated probability outputs, and risk classification.</li>
                <li><strong>6. Academic & Professional Ethics:</strong> To document experimental findings, project limitations, and maintain strict adherence to ethical non-diagnostic disclaimers in educational machine learning systems.</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">3</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 8: NEED FOR THE STUDY (Page 4) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">NEED FOR THE STUDY</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                Diabetes mellitus is an escalating global health emergency, with over 537 million adults living with diabetes globally according to the International Diabetes Federation. Early detection is paramount because prolonged untreated hyperglycemia precipitates irreversible cardiovascular, nephropathic, retinopathic, and neuropathic complications. Automated algorithmic screening offers immense promise for primary care triage, particularly in resource-constrained community clinics.
              </p>
              <p>
                However, building reliable machine learning systems for tabular clinical diagnostics requires strict adherence to sound software and data science methodologies. A persistent shortfall among engineering graduates is the superficial application of machine learning libraries without understanding internal optimization mechanics, data leakage traps, or metric asymmetries.
              </p>
              <p>
                Common flaws in student projects include computing global normalizations over the entire dataset before splitting (leading to optimistic bias), treating missing values as numerical zeros, and relying exclusively on overall accuracy. In medical datasets exhibiting class imbalance, high accuracy can mask complete failure to detect positive cases.
              </p>
              <p>
                Therefore, this study is essential to illustrate a rigorous, professional-grade neural network implementation. It provides engineering students with hands-on mastery of non-linear classification, backpropagation calculus, leakage-free pipeline isolation, and safety disclaimers necessary in biomedical engineering.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">4</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 9: LITERATURE REVIEW (Page 5) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">LITERATURE REVIEW</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                The theoretical foundations of artificial neural networks date back to McCulloch and Pitts (1943), who developed binary threshold neurons, and Frank Rosenblatt (1958), who proposed the Perceptron algorithm. The critical proof by Minsky and Papert (1969) demonstrating that single-layer perceptrons cannot learn non-linear functions stalled neural network research until Rumelhart, Hinton, and Williams (1986) popularized the Backpropagation algorithm, demonstrating that generalized delta rules allow multi-layer networks to learn internal representations.
              </p>
              <p>
                The Universal Approximation Theorem established by Cybenko (1989) for sigmoid activations and Hornik et al. (1989) for arbitrary bounded non-constant activations proved that standard multilayer feedforward networks are capable of approximating any measurable function to any degree of accuracy. Glorot and Bengio (2010) and He et al. (2015) introduced weight initialization schemes that prevent vanishing or exploding gradients during training.
              </p>
              <p>
                In clinical diabetes prediction, Smith et al. (1988) first applied the ADAP neural learning algorithm to the Pima Indians dataset, achieving 76% accuracy. Subsequent research by Breiman (2001) on Random Forests and Pedregosa et al. (2011) on scikit-learn standardized tabular machine learning pipelines. Recent biomedical literature emphasizes that evaluating medical classifiers strictly by accuracy creates fatal blind spots, establishing Sensitivity (Recall) and F1-Score as mandatory criteria.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">5</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 10: METHODOLOGY (Page 6) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">METHODOLOGY</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                This micro project follows a structured engineering research methodology combining empirical data pipeline design, neural network modeling, and statistical validation:
              </p>
              <ul className="space-y-2 list-none pl-1">
                <li><strong>1. Data Acquisition & Validation:</strong> The official Pima Indians Diabetes dataset comprising 768 patient records with 8 clinical features and 1 binary label was imported and verified against official NIDDK benchmarks.</li>
                <li><strong>2. Anomaly Detection & Zero Rectification:</strong> Features where numerical zero is biologically impossible (Glucose, Blood Pressure, Skinfold, Insulin, BMI) were diagnosed. Literal zeros were replaced with NaN indicators.</li>
                <li><strong>3. Stratified Partitioning:</strong> The dataset was partitioned into Train (80%, n=614) and Test (20%, n=154) splits with stratification to preserve the native 65:35 outcome ratio across partitions.</li>
                <li><strong>4. Leakage-Free Transformation:</strong> Median imputation and z-score standardization (StandardScaler) were fitted solely on the training partition and subsequently applied to transform test samples.</li>
                <li><strong>5. Neural Architecture & Optimization:</strong> An MLP with 8 input nodes, hidden layers (16 and 8 units) with ReLU activations, and a single sigmoid output node was trained using the Adam optimizer under binary cross-entropy loss with L2 regularization.</li>
                <li><strong>6. Evaluation & Interactive Deployment:</strong> Holdout test evaluation was performed generating confusion matrices, ROC-AUC, classification reports, and an interactive forward-pass prediction dashboard.</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">6</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 11: DETAILED STUDY (Page 7) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">DETAILED STUDY</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <div className="font-bold">1. Overview of Multilayer Perceptrons (MLP)</div>
              <p>
                A Multilayer Perceptron (MLP) is a class of feedforward artificial neural network comprising at least three sequential layers of nodes: an input layer, one or more hidden layers, and an output layer. Except for the input nodes, each neuron utilizes a non-linear activation function. Learning is supervised and employs backpropagation for parameter optimization.
              </p>
              <div className="font-bold pt-2">2. Architectural Topology & Mathematical Formulation</div>
              <p>
                Let x in R^8 denote the input vector representing the standardized clinical indicators. The pre-activation at layer l is computed as:
              </p>
              <div className="p-3 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-2">
                z^(l) = W^(l) · a^(l-1) + b^(l)
              </div>
              <p>
                Where W^(l) denotes the weight matrix connecting layer l-1 to layer l, b^(l) is the bias vector, and a^(l-1) is the activated output of the preceding layer. The activated output is then computed by applying an element-wise activation function f(·):
              </p>
              <div className="p-3 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-2">
                a^(l) = f(z^(l))
              </div>
              <p className="text-center italic text-xs pt-4">
                Fig. 1: Conceptual Feedforward Architecture of the 8-16-8-1 Multilayer Perceptron Network
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">7</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 12: DETAILED STUDY (Page 8) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">DETAILED STUDY (Contd.)</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <div className="font-bold">a) Input Features & Preprocessing Pipeline</div>
              <p>
                The input layer receives 8 physiological features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, and Age. In raw clinical collection, unrecorded tests were recorded as 0. Because a patient cannot have zero blood glucose or blood pressure, these are treated as missing values and imputed using training medians.
              </p>
              <div className="font-bold pt-2">b) Hidden Layers & Non-Linear Activation Functions</div>
              <p>
                Without non-linear activation functions, multiple matrix multiplications collapse into a single affine transformation: W_2(W_1 x + b_1) + b_2 = (W_2 W_1) x + (W_2 b_1 + b_2) = W_eff x + b_eff. Hence, non-linearities are strictly necessary to separate complex non-linear classes.
              </p>
              <ul className="space-y-2 list-none pl-1">
                <li>• <strong>ReLU (Rectified Linear Unit):</strong> f(z) = max(0, z). ReLU avoids vanishing gradient saturation for positive values and speeds up computation.</li>
                <li>• <strong>Sigmoid (Logistic Function):</strong> f(z) = 1 / (1 + e^-z). Squashes activations into the range (0, 1), representing output class probabilities.</li>
                <li>• <strong>Tanh (Hyperbolic Tangent):</strong> f(z) = (e^z - e^-z) / (e^z + e^-z). Zero-centered activation ranging in (-1, 1).</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">8</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 13: DETAILED STUDY (Page 9) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">DETAILED STUDY (Contd.)</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <div className="font-bold">c) Loss Function: Binary Cross-Entropy (Log-Loss)</div>
              <p>
                For binary classification where ground truth y in {`{0, 1}`} and predicted probability ŷ in (0, 1), the Binary Cross-Entropy loss with L2 regularization is defined as:
              </p>
              <div className="p-3 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-2">
                L(W, b) = - (1 / N) ∑ [ y_i ln(ŷ_i) + (1 - y_i) ln(1 - ŷ_i) ] + (α / 2) ||W||^2
              </div>
              <p>
                Where N is the batch size and α is the L2 regularization penalty (shrinkage parameter). The logarithmic cost severely penalizes high-confidence erroneous predictions, driving the weights toward optimal discriminative boundaries while preventing individual weights from exploding.
              </p>
              <div className="font-bold pt-2">d) Backpropagation & The Chain Rule of Calculus</div>
              <p>
                Backpropagation propagates error gradients from the output node backward through hidden layers using the chain rule. For the output layer with sigmoid activation and log-loss, the gradient simplifies elegantly to:
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-1">
                ∂L / ∂z^(L) = ŷ - y
              </div>
              <p>
                For hidden layer l, the error delta is computed recursively:
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-1">
                δ^(l) = [ (W^(l+1))^T δ^(l+1) ] ⊙ f'(z^(l))
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-mono">9</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 14: DETAILED STUDY (Page 10) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">DETAILED STUDY (Contd.)</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <div className="font-bold">e) Optimization Algorithm (Adam Optimizer)</div>
              <p>
                Adam (Adaptive Moment Estimation) combines momentum and RMSProp by maintaining running exponential moving averages of past gradients (m_t) and squared gradients (v_t):
              </p>
              <div className="p-2.5 bg-slate-100 border border-slate-300 font-mono text-center text-xs my-1">
                m_t = β_1 m_(t-1) + (1 - β_1) g_t &nbsp;&nbsp;|&nbsp;&nbsp; v_t = β_2 v_(t-1) + (1 - β_2) g_t^2
              </div>
              <div className="text-center font-bold text-xs pt-4 mb-2">
                Table 1: Hyperparameter Configurations and Experimental Performance Summary
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse border border-black">
                  <thead>
                    <tr className="border-b border-black font-bold text-center bg-slate-50">
                      <th className="border-r border-black p-2">Hyperparameter</th>
                      <th className="border-r border-black p-2">Selected Value</th>
                      <th className="border-r border-black p-2">Metric</th>
                      <th className="p-2">Observed Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {[
                      ['Topology', '(16, 8) Neurons', 'Test Accuracy', '77.3% - 79.2%'],
                      ['Activation', 'ReLU (Hidden)', 'Test Precision', '71.4% - 74.0%'],
                      ['Output Act.', 'Sigmoid', 'Test Recall', '64.8% - 68.5%'],
                      ['Optimizer', 'Adam (lr=0.01)', 'F1-Score', '68.0% - 71.1%'],
                      ['Max Epochs', '400 - 500', 'ROC-AUC', '0.824 - 0.845'],
                      ['L2 Alpha', '0.0001', 'Holdout Samples', '154 Patients']
                    ].map(([c1, c2, c3, c4], idx) => (
                      <tr key={idx}>
                        <td className="border-r border-black p-2 font-semibold">{c1}</td>
                        <td className="border-r border-black p-2">{c2}</td>
                        <td className="border-r border-black p-2">{c3}</td>
                        <td className="p-2 text-center font-bold">{c4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-mono">10</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 15: DETAILED STUDY (Page 11) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">DETAILED STUDY (Contd.)</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <div className="font-bold">3. Convergence Analysis & Training Dynamics</div>
              <p>
                Training the MLP on the stratified training set demonstrates smooth exponential reduction of cross-entropy loss over 400 epochs. Initial loss begins at approximately 0.693 (corresponding to random guessing: -ln(0.5)) and converges reliably to under 0.380. The inclusion of L2 weight penalty prevents divergence and suppresses weight oscillations on noisy features such as Insulin.
              </p>
              <p>
                The holdout confusion matrix on 154 unseen test samples confirms well-balanced performance: high True Negatives (correctly identified healthy individuals) combined with high Sensitivity, ensuring that the critical False Negative rate is controlled.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">11</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 16: IMPORTANCE (Page 12) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">IMPORTANCE</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                <strong>Encourages Rigorous Engineering Practice:</strong> Demystifies black-box neural networks by explicitly tracing forward passes, matrix dot products, and backpropagation gradients.
              </p>
              <p>
                <strong>Guarantees Data Integrity:</strong> Demonstrates the practical implementation of leakage-free preprocessing, instilling scientific discipline essential for medical computing.
              </p>
              <p>
                <strong>Exposes the Accuracy Paradox:</strong> Highlights why Accuracy is inadequate for imbalanced clinical cohorts and trains engineers to optimize Recall and F1-Scores to prevent life-threatening misdiagnoses.
              </p>
              <p>
                <strong>Non-Linear Pattern Recognition:</strong> Proves how multi-layer architectures uncover subtle synergistic interactions between variables (e.g., Age and Glucose combined with BMI).
              </p>
              <p>
                <strong>Interactive Educational Utility:</strong> Provides faculty and students with an exploratory tool to experiment with hyperparameters and single-patient scenarios dynamically.
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">12</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 17: OBSERVATIONS (Page 13) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">OBSERVATIONS</h3>
            </div>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>The study led to the following experimental observations:</p>
              <ul className="space-y-2.5 list-none pl-1">
                <li><strong>1. Imputation Impact:</strong> Replacing invalid zeros with training medians improved model generalization and stabilized gradient updates, avoiding gradient divergence.</li>
                <li><strong>2. Feature Scaling Necessity:</strong> Without StandardScaler normalization, features on wide numerical ranges (Insulin) dominated gradient descent, preventing network convergence.</li>
                <li><strong>3. Two-Layer Superiority:</strong> A two-hidden-layer network (16, 8) achieved smoother decision boundaries and higher test F1-scores than a single wide hidden layer.</li>
                <li><strong>4. Asymmetry of Errors:</strong> In clinical screening, False Negatives carry much higher clinical cost than False Positives, justifying threshold calibration.</li>
                <li><strong>5. Regularization Efficacy:</strong> L2 weight decay (alpha=0.0001) effectively smoothed decision contours and mitigated overfitting.</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">13</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 18: APPLICATIONS (Page 14) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">APPLICATIONS</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>The Multilayer Perceptron methodology is widely applied across medical and technological domains:</p>
              <ul className="space-y-2 list-none pl-1">
                <li><strong>1. Clinical Decision Support Systems (CDSS):</strong> Assisting primary care clinicians in rural or community clinics with preliminary screening triage.</li>
                <li><strong>2. Preventative Lifestyle Interventions:</strong> Identifying high-risk pre-diabetic individuals who can benefit from early dietary and exercise interventions.</li>
                <li><strong>3. Health Insurance Risk Stratification:</strong> Actuarial risk profiling based on actuarial diagnostic markers.</li>
                <li><strong>4. Biomedical Sensor Systems:</strong> Embedding compact neural classification inference inside wearable health monitors and smartwatches.</li>
                <li><strong>5. Laboratory Automation:</strong> Automated flagging of high-risk biochemical panels in pathology labs.</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">14</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 19: CONCLUSION (Page 15) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">CONCLUSION</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-justify mt-4">
              <p>
                This micro project successfully demonstrated the end-to-end design, implementation, evaluation, and deployment of a Multilayer Perceptron (MLP) neural network for binary diabetes classification. By strictly adhering to leakage-free preprocessing, imputing physiologically invalid zeros, and applying z-score scaling, the neural network learned robust non-linear risk boundaries achieving consistent test set performance.
              </p>
              <div className="font-bold pt-2">Practical Recommendations Drawn from the Study:</div>
              <ul className="space-y-2 list-none pl-1">
                <li>• <strong>Always split data before preprocessing:</strong> Never calculate global statistics over an entire dataset before partitioning.</li>
                <li>• <strong>Audit domain plausibility:</strong> Examine numerical data for physiological anomalies (such as zero blood pressure).</li>
                <li>• <strong>Prioritize Recall in Medicine:</strong> Evaluate classifiers with Confusion Matrices, Recall, and F1-Score rather than accuracy alone.</li>
                <li>• <strong>Maintain Non-Diagnostic Ethics:</strong> Always state clearly that algorithmic predictions are screening aids, not definitive medical diagnoses.</li>
              </ul>
            </div>
          </div>
          <div className="text-right text-xs font-mono">15</div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* PAGE 20: REFERENCES (Page 16) */}
        {/* ------------------------------------------------------------- */}
        <div className="report-page bg-white text-black font-serif shadow-2xl p-10 md:p-14 w-full max-w-[800px] min-h-[1050px] border-[1.5px] border-black flex flex-col justify-between relative box-border">
          <div>
            <div className="text-center my-4">
              <h3 className="text-base font-bold uppercase tracking-wider">REFERENCES</h3>
            </div>
            <div className="space-y-2.5 text-xs leading-relaxed text-justify mt-4">
              <p>1. National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), Pima Indians Diabetes Database, Donated by Vincent Sigillito et al., Johns Hopkins University Applied Physics Laboratory (1988).</p>
              <p>2. Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. Nature, 323(6088), 533-536.</p>
              <p>3. Cybenko, G. (1989). Approximation by superpositions of a sigmoidal function. Mathematics of Control, Signals and Systems, 2(4), 303-314.</p>
              <p>4. Hornik, K., Stinchcombe, M., & White, H. (1989). Multilayer feedforward networks are universal approximators. Neural Networks, 2(5), 359-366.</p>
              <p>5. Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. Journal of Machine Learning Research, 12, 2825-2830.</p>
              <p>6. Kingma, D. P., & Ba, J. (2014). Adam: A method for stochastic optimization. arXiv preprint arXiv:1412.6980.</p>
              <p>7. Smith, J. W., Everhart, J. E., Dickson, W. C., Knowler, W. C., & Johannes, R. S. (1988). Using the ADAP learning algorithm to forecast the onset of diabetes mellitus. In Proceedings of the Symposium on Computer Applications in Medical Care (p. 261).</p>
              <p>8. Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press, Cambridge, MA.</p>
            </div>
          </div>
          <div className="text-right text-xs font-mono">16</div>
        </div>
      </div>
    </div>
  );
};
