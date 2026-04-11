import { useState } from "react";
import { FileText, ExternalLink, Loader, AlertCircle } from "lucide-react";

export default function ReportViewer({ reportLink, teamName }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!reportLink) {
    return (
      <div className="bg-void-800/40 border border-dashed border-ink-800 rounded-2xl p-10 text-center">
        <AlertCircle className="w-8 h-8 text-ink-600 mx-auto mb-3" />
        <p className="text-ink-500 text-sm">No report available</p>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    // Google Drive: /file/d/ID/view → /file/d/ID/preview
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;

    // Google Drive: ?id=ID
    const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match2) return `https://drive.google.com/file/d/${match2[1]}/preview`;

    return url;
  };

  return (
    <div className="bg-void-800/40 border border-ink-900/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-900/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-ink-200 font-medium">Final Report</p>
            <p className="text-xs text-ink-500">{teamName}</p>
          </div>
        </div>
        <a href={reportLink} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/20 transition-all">
          <ExternalLink className="w-3 h-3" />
          New Tab
        </a>
      </div>

      {/* Embed */}
      <div className="relative bg-void-900">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-void-900 z-10">
            <Loader className="w-6 h-6 text-ember-400 animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-900 z-10">
            <AlertCircle className="w-8 h-8 text-ink-600 mb-3" />
            <p className="text-ink-400 text-sm mb-4">Could not load preview</p>
            <a href={reportLink} target="_blank" rel="noreferrer"
              className="px-5 py-2.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all">
              Open Report
            </a>
          </div>
        )}
        <iframe
          src={getEmbedUrl(reportLink)}
          className="w-full border-0"
          style={{ height: "600px" }}
          title={`Report - ${teamName}`}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          allow="autoplay"
        />
      </div>
    </div>
  );
}