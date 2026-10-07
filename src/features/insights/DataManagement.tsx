'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Panel } from '@/components/ui/Panel';
import { Card } from '@/components/ui/Card';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { fadeVariants, popVariants } from '@/lib/motion';
import { useFocusLabStore } from '@/store';
import { FeatureErrorBoundary } from '@/components/ui/FeatureErrorBoundary';

const DataManagementContent: React.FC = () => {
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
    <Panel variant="surface-2" className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-bold text-text font-display">Your data</h2>
        <p className="text-xs text-muted">
          All data remains strictly on your device. You can export a full copy, import a previous backup, or delete everything at any time.
        </p>
      </div>

      {importStatus && (
        <div
          role="status"
          className={`p-3 rounded-xs text-xs border ${
            importStatus.success
              ? 'bg-tier-strong/10 border-tier-strong text-tier-strong font-medium'
              : 'bg-tier-not-supported/10 border-tier-not-supported text-tier-not-supported font-medium'
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
          variant="danger"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-xs min-h-[44px]"
        >
          Delete all data
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <m.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <m.div
              variants={popVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-sm"
            >
              <Card className="w-full p-5 space-y-4 bg-surface border-border shadow-elevation">
                <h3 id="delete-dialog-title" className="text-base font-bold text-text">
                  Permanently delete all data?
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  This will erase all Focus Checks, sessions, activity logs, and experiments stored in this browser. This action cannot be undone.
                </p>
                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs min-h-[44px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    className="text-xs min-h-[44px]"
                  >
                    Confirm Delete
                  </Button>
                </div>
              </Card>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </Panel>
  );
};

export const DataManagement: React.FC = () => (
  <FeatureErrorBoundary featureName="Data Management">
    <DataManagementContent />
  </FeatureErrorBoundary>
);

export default DataManagement;
