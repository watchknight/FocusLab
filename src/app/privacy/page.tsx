'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import {
  serializeExport,
  validateImportData,
  FocusLabDataExport,
} from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const checkLogs = useFocusStore((s) => s.checkLogs);
  const sessionLogs = useFocusStore((s) => s.sessionLogs);
  const theme = useFocusStore((s) => s.theme);
  const soundVolume = useFocusStore((s) => s.soundVolume);
  const importData = useFocusStore((s) => s.importData);
  const clearAllData = useFocusStore((s) => s.clearAllData);

  const handleExport = () => {
    const payload: FocusLabDataExport = {
      version: 1,
      exportedAt: new Date().toISOString(),
      checkLogs,
      sessionLogs,
      userPreferences: {
        theme,
        soundVolume,
      },
    };
    const jsonStr = serializeExport(payload);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focuslab-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string);
        const result = validateImportData(raw);
        if (result.success && result.data) {
          importData(result.data);
          setImportStatus('Data successfully validated and imported.');
        } else {
          setImportStatus(`Import rejected: ${result.error || 'Invalid file format'}`);
        }
      } catch {
        setImportStatus('Import failed: File contains invalid JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAll = () => {
    clearAllData();
    setShowDeleteConfirm(false);
    setImportStatus('All local FocusLab records have been permanently cleared.');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-content-primary">
          Local Data & Privacy
        </h1>
        <p className="text-xs text-content-secondary">
          FocusLab has no remote database, no user accounts, and zero analytics.
          All your self-checks and sessions reside strictly in your local browser storage.
        </p>
      </div>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Export Data (JSON)
        </h2>
        <p className="text-xs text-content-secondary">
          Download your complete history of check logs, practice sessions, and preferences into a standard JSON file.
        </p>
        <Button variant="secondary" onClick={handleExport}>
          Export JSON ({checkLogs.length} checks, {sessionLogs.length} sessions)
        </Button>
      </Card>

      <Card as="section" className="space-y-3">
        <h2 className="text-sm font-semibold text-content-primary">
          Import Data (Validated JSON)
        </h2>
        <p className="text-xs text-content-secondary">
          Restore or transfer your data from a previous FocusLab backup file. All structures are strictly validated prior to saving.
        </p>
        <div>
          <label
            htmlFor="import-file-input"
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded border border-surface-border bg-surface-primary hover:bg-surface-secondary text-content-primary inline-flex items-center cursor-pointer focus-within:ring-2 focus-within:ring-teal-accent"
          >
            <span>Select JSON Backup File</span>
            <input
              id="import-file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>
        {importStatus && (
          <p className="text-xs font-medium text-teal-accent pt-1">
            {importStatus}
          </p>
        )}
      </Card>

      <Card as="section" className="space-y-3 border-red-200 dark:border-red-900/50">
        <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
          Delete All Data
        </h2>
        <p className="text-xs text-content-secondary">
          Permanently erase all check logs and session records from this browser. This action cannot be undone.
        </p>
        {showDeleteConfirm ? (
          <div className="flex gap-2 items-center pt-1">
            <Button variant="danger" onClick={handleDeleteAll}>
              Confirm Permanent Erasure
            </Button>
            <Button variant="subtle" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Clear Local Data
          </Button>
        )}
      </Card>
    </div>
  );
}
