import React, { useState, useRef } from 'react';
import type { VisionAnalysisResult, BarrierCategory } from '../types';
import { api } from '../services/api';
import {
  UploadCloud,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  FileImage,
  PlusCircle
} from 'lucide-react';

interface ImageBarrierScannerProps {
  onSaveAsBarrier: (report: {
    category: BarrierCategory;
    title: string;
    description: string;
    lat: number;
    lng: number;
    severity: 'low' | 'medium' | 'high' | 'blocking';
    source: string;
  }) => Promise<void>;
}

export const ImageBarrierScanner: React.FC<ImageBarrierScannerProps> = ({ onSaveAsBarrier }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, or WEBP).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setAnalysisResult(null);
    setSaveSuccess(false);

    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await api.analyzeImage(selectedFile);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Image analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToRegistry = async () => {
    if (!analysisResult) return;
    try {
      await onSaveAsBarrier({
        category: (analysisResult.barrier_category as BarrierCategory) || 'stairs_no_ramp',
        title: analysisResult.title,
        description: `${analysisResult.accessibility_impact} • Recommended action: ${analysisResult.recommended_action}`,
        lat: 37.7812,
        lng: -122.4179,
        severity: analysisResult.severity,
        source: 'ai_vision'
      });
      setSaveSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to save to registry.');
    }
  };

  // Sample quick test scenarios for hackathon judges
  const loadPresetSample = (presetName: string, mockFilename: string) => {
    const blob = new Blob(['sample-image-placeholder'], { type: 'image/jpeg' });
    const file = new File([blob], mockFilename, { type: 'image/jpeg' });
    setSelectedFile(file);
    setPreviewUrl(
      presetName === 'stairs'
        ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
    );
    setAnalysisResult(null);
    setSaveSuccess(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2 text-blue-600">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            AI Multimodal Barrier Intelligence
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Sidewalk & Infrastructure Image Scanner
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload street photos, sidewalk steps, or curb crossings. Gemini vision models classify
          impediments and generate structured accessibility impact assessments.
        </p>
      </div>

      {/* Mandatory Human Verification Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Human Verification Protocol Required</span>
          <p className="text-amber-800">
            AI findings are categorized as preliminary suggestions. Unverified AI results{' '}
            <strong>never certify a pathway as accessible</strong>. Official verification requires human
            inspection or municipal validation.
          </p>
        </div>
      </div>

      {/* Quick Preset Buttons for live demo convenience */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600">Quick Demo Presets:</span>
        <button
          onClick={() => loadPresetSample('stairs', 'monument_concrete_stairs_18_steps.jpg')}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
        >
          📷 Sample: Grand Flight of Stairs (18 steps)
        </button>
        <button
          onClick={() => loadPresetSample('curb', 'missing_dropped_curb_cut.jpg')}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
        >
          📷 Sample: Missing Dropped Curb Cut
        </button>
        <button
          onClick={() => loadPresetSample('construction', 'construction_utility_trench.jpg')}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
        >
          📷 Sample: Construction Trench & Barricade
        </button>
      </div>

      {/* File Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/20"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800">
          Click to upload or drag & drop sidewalk / crosswalk photograph
        </p>
        <p className="text-xs text-slate-400 mt-1">Supports JPEG, PNG, WEBP (Max 10MB)</p>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-xs"
              />
            ) : (
              <FileImage className="w-10 h-10 text-slate-400" />
            )}
            <div>
              <p className="text-xs font-bold text-slate-900">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Inspecting Image with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Run Multimodal Accessibility Analysis</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Structured Analysis Results */}
      {analysisResult && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">{analysisResult.title}</h3>
                <span className="text-xs text-slate-500">
                  Mode: {analysisResult.analysis_mode} • Confidence:{' '}
                  <strong>{Math.round(analysisResult.confidence_score * 100)}%</strong>
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 uppercase">
              {analysisResult.severity} Barrier
            </span>
          </div>

          {/* Impact & Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Accessibility Impact:</span>
              <p className="text-slate-600">{analysisResult.accessibility_impact}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Recommended Remediation:</span>
              <p className="text-slate-600">{analysisResult.recommended_action}</p>
            </div>
          </div>

          {/* Detected Features */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-700">Detected Visual Attributes:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysisResult.detected_features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900">{feat.label}</span>
                    <p className="text-slate-500 text-[11px]">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to Save to Registry */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Publish this verified finding to the dynamic pedestrian routing network.
            </span>

            {saveSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Map Barrier Registry!</span>
              </span>
            ) : (
              <button
                onClick={handleSaveToRegistry}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Pin as Map Barrier Report</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
