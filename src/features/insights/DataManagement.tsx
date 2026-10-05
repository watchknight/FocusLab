'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useFocusLabStore } from '@/store';

export const DataManagement: React.FC = () => {
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = useFocusLabStore((state) => state.exportData);
  const importData = useFocusLabStore((state) => state.importData);
  const deleteAll = useFocusLabStore((state) => state.deleteAll);

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focuslab-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const success = importData(content);
      if (success) {
        setImportStatus({ success: true, msg: 'Data imported and validated successfully.' });
      } else {
        setImportStatus({
          success: false,
          msg: 'Failed to import: file does not match the required FocusLab schema.',
        });
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmDelete = () => {
    deleteAll();
    setShowDeleteConfirm(false);
    setImportStatus({ success: true, msg: 'All local data has been permanently cleared.' });
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <Card className="p-4 sm:p-5 space-y-4 bg-surface-2 border-border">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-text">Data Privacy & Local Storage</h2>
        <p className="text-xs text-muted">
          All data remains strictly on your device. You can export a full copy, import a previous backup, or delete everything at any time.
        </p>
      </div>

      {importStatus && (
        <div
          className={`p-3 rounded text-xs border ${
            importStatus.success
              ? 'bg-ok/10 border-ok text-ok'
              : 'bg-warn/10 border-warn text-warn'
          }`}
        >
          {importStatus.msg}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={handleExport} className="text-xs min-h-[44px]">
          Export JSON
        </Button>

        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs min-h-[44px]"
        >
          Import JSON (validated)
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,application/json"
          className="hidden"
          aria-label="Upload FocusLab JSON backup file"
        />

        <Button
          variant="subtle"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs min-h-[44px] text-warn hover:bg-warn/10 hover:text-warn border-border"
        >
          Delete all data
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm w-full p-5 space-y-4 bg-surface border-border shadow-xl">
            <h3 className="text-base font-bold text-text">Permanently delete all data?</h3>
            <p className="text-xs text-muted">
              This will erase all Focus Checks, sessions, activity logs, and experiments stored in this browser. This action cannot be reversed.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="subtle"
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs min-h-[44px]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                className="text-xs min-h-[44px] bg-warn border-warn text-white hover:opacity-90"
              >
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};
