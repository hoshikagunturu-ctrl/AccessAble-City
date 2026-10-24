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
  PlusCircle,
  Cpu,
  Scan,
  Activity
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

  // Sample quick test scenarios
  const loadPresetSample = (presetName: string, mockFilename: string) => {
    const blob = new Blob(['sample-image-placeholder'], { type: 'image/jpeg' });
    const file = new File([blob], mockFilename, { type: 'image/jpeg' });
    setSelectedFile(file);
    setPreviewUrl(
      presetName === 'stairs'
        ? 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=600&q=80'
        : presetName === 'curb'
        ? 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=600&q=80'
    );
    setAnalysisResult(null);
    setSaveSuccess(false);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl text-white space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            AI Multimodal Computer Vision
          </span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1">
          Sidewalk & Physical Infrastructure Inspector
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload street photos, stairs, or curbs. Gemini vision models classify physical obstacles and
          generate structured accessibility assessments.
        </p>
      </div>

      {/* Human Verification Protocol Disclaimer */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/80 flex items-start space-x-3 text-xs text-indigo-200">
        <ShieldAlert className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white">Human Verification Protocol</span>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            AI findings are categorized strictly as <strong>preliminary suggestions</strong>. Unverified AI outputs{' '}
            <strong>never certify a pathway as accessible</strong>. Ground-truth accessibility certification requires on-site human inspection or municipal audit.
          </p>
        </div>
      </div>

      {/* Demo Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-400 text-[11px]">Audit Presets:</span>
        <button
          onClick={() => loadPresetSample('stairs', 'monument_concrete_stairs_18_steps.jpg')}
          className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs cursor-pointer transition-all"
        >
          📷 Sample: 18-Step Concrete Stairs
        </button>
        <button
          onClick={() => loadPresetSample('curb', 'missing_dropped_curb_cut.jpg')}
          className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs cursor-pointer transition-all"
        >
          📷 Sample: Missing Dropped Curb Cut
        </button>
        <button
          onClick={() => loadPresetSample('construction', 'construction_utility_trench.jpg')}
          className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs cursor-pointer transition-all"
        >
          📷 Sample: Construction Trench & Barricade
        </button>
      </div>

      {/* File Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-teal-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/60 hover:bg-slate-950"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs sm:text-sm font-bold text-slate-200">
          Click to upload or drag & drop sidewalk / crosswalk photograph
        </p>
        <p className="text-[11px] text-slate-500 mt-1">Supports JPEG, PNG, WEBP (Max 10MB)</p>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow-xs"
              />
            ) : (
              <FileImage className="w-10 h-10 text-slate-400" />
            )}
            <div>
              <p className="text-xs font-bold text-white">{selectedFile.name}</p>
              <p className="text-[11px] text-slate-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-md shadow-indigo-900/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Scanning Physical Geometry...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Run Multimodal Barrier Inspection</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Structured Analysis Results */}
      {analysisResult && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">{analysisResult.title}</h3>
                <span className="text-[11px] text-slate-400">
                  Inspection Mode: <strong>{analysisResult.analysis_mode}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Confidence: {Math.round(analysisResult.confidence_score * 100)}%
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                {analysisResult.severity}
              </span>
            </div>
          </div>

          {/* Impact & Action */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300">Accessibility Impact:</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {analysisResult.accessibility_impact}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300">Remediation Action:</span>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {analysisResult.recommended_action}
              </p>
            </div>
          </div>

          {/* Visual Attributes */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
              Detected Visual Attributes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysisResult.detected_features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white text-[11px]">{feat.label}</span>
                    <p className="text-slate-400 text-[10px]">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save to Registry Action */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Pin this verified finding into the dynamic pedestrian routing network.
            </span>

            {saveSuccess ? (
              <span className="text-xs font-bold text-teal-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Added to Map Barrier Registry</span>
              </span>
            ) : (
              <button
                onClick={handleSaveToRegistry}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Pin as Barrier Report</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
