/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { OverviewPage } from './components/pages/OverviewPage.tsx';
import { DatasetPage } from './components/pages/DatasetPage.tsx';
import { ArchitecturePage } from './components/pages/ArchitecturePage.tsx';
import { EvaluationPage } from './components/pages/EvaluationPage.tsx';
import { PredictionPage } from './components/pages/PredictionPage.tsx';
import { TheoryPage } from './components/pages/TheoryPage.tsx';
import { VivaGuidePage } from './components/pages/VivaGuidePage.tsx';
import { PythonFilesPage } from './components/pages/PythonFilesPage.tsx';

import { DEFAULT_PIMA_DATASET } from './data/pimaData.ts';
import {
  PatientRecord,
  MLPConfig,
  TrainedModel,
  EvaluationResults,
  preprocessAndSplit,
  trainMLP,
  evaluateModel
} from './ml/mlpEngine.ts';

export default function App() {
  // Dataset state
  const [dataset, setDataset] = useState<PatientRecord[]>(DEFAULT_PIMA_DATASET);
  const [isCustomDataset, setIsCustomDataset] = useState(false);

  // Active page
  const [currentPage, setCurrentPage] = useState<string>('overview');

  // Hyperparameter configuration
  const [config, setConfig] = useState<MLPConfig>({
    hiddenLayers: [16, 8],
    activation: 'relu',
    learningRate: 0.01,
    maxEpochs: 400,
    alpha: 0.0001,
    seed: 42
  });

  // Trained model and evaluation results
  const [model, setModel] = useState<TrainedModel | null>(null);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [testSampleCount, setTestSampleCount] = useState<number>(0);

  // Training state & animation
  const [isTraining, setIsTraining] = useState(false);
  const [trainingEpoch, setTrainingEpoch] = useState(0);

  // Training routine
  const runTraining = useCallback((currentDataset: PatientRecord[], currentConfig: MLPConfig) => {
    setIsTraining(true);
    setTrainingEpoch(0);

    // Timeout allows UI to show spinner
    setTimeout(() => {
      try {
        // Step 1: Preprocess and Stratified Split
        const split = preprocessAndSplit(currentDataset, 0.20, currentConfig.seed);
        setTestSampleCount(split.testRecords.length);

        // Step 2: Train MLP
        const trained = trainMLP(
          split.X_train,
          split.y_train,
          currentConfig,
          split.preprocessor,
          (epoch) => setTrainingEpoch(epoch)
        );

        // Step 3: Evaluate on holdout test set
        const evalResults = evaluateModel(trained, split.X_test, split.y_test);

        setModel(trained);
        setResults(evalResults);
      } catch (err) {
        console.error('Error during MLP training:', err);
      } finally {
        setIsTraining(false);
      }
    }, 50);
  }, []);

  // Train automatically on mount with default parameters
  useEffect(() => {
    runTraining(dataset, config);
  }, []);

  const handleManualTrain = () => {
    runTraining(dataset, config);
  };

  const handleUploadDataset = (newRecords: PatientRecord[]) => {
    setDataset(newRecords);
    setIsCustomDataset(true);
    runTraining(newRecords, config);
  };

  const handleResetDataset = () => {
    setDataset(DEFAULT_PIMA_DATASET);
    setIsCustomDataset(false);
    runTraining(DEFAULT_PIMA_DATASET, config);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Application Header */}
      <Header
        onRetrain={handleManualTrain}
        isTraining={isTraining}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        totalRecords={dataset.length}
      />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar & Hyperparameters */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          config={config}
          onChangeConfig={setConfig}
          onTrain={handleManualTrain}
          isTraining={isTraining}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentPage === 'overview' && (
            <OverviewPage
              onNavigate={setCurrentPage}
              totalRecords={dataset.length}
            />
          )}

          {currentPage === 'dataset' && (
            <DatasetPage
              dataset={dataset}
              onUploadDataset={handleUploadDataset}
              onResetToDefault={handleResetDataset}
              isCustomDataset={isCustomDataset}
              testRatio={0.20}
              seed={config.seed}
            />
          )}

          {currentPage === 'architecture' && (
            <ArchitecturePage
              config={config}
              model={model}
              onTrain={handleManualTrain}
              isTraining={isTraining}
              trainingEpoch={trainingEpoch}
            />
          )}

          {currentPage === 'evaluation' && (
            <EvaluationPage
              results={results}
              testCount={testSampleCount}
            />
          )}

          {currentPage === 'prediction' && (
            <PredictionPage
              model={model}
            />
          )}

          {currentPage === 'theory' && (
            <TheoryPage />
          )}

          {currentPage === 'viva' && (
            <VivaGuidePage />
          )}

          {currentPage === 'python' && (
            <PythonFilesPage />
          )}
        </main>
      </div>
    </div>
  );
}
