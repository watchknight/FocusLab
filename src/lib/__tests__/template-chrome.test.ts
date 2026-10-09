import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Avoid Template Chrome Invariants (AGENTS.md)', () => {
  it('verifies share card HUD uses sentence-case eyebrows and comma separators', () => {
    const filePath = path.resolve(__dirname, '../share-card.ts');
    const content = fs.readFileSync(filePath, 'utf8');

    expect(content).not.toContain('PVT-B REACTION TEST');
    expect(content).not.toContain('MEDIAN REACTION TIME');
    expect(content).not.toContain('·');
    expect(content).toContain("'Check (PVT-B)'");
    expect(content).toContain("'Median reaction time'");
  });

  it('verifies IfThenPlanEditor and IntentionStep do not contain arrow characters in labels', () => {
    const ifThenPath = path.resolve(__dirname, '../../features/session/IfThenPlanEditor.tsx');
    const intentionPath = path.resolve(__dirname, '../../features/session/IntentionStep.tsx');
    const ifThenContent = fs.readFileSync(ifThenPath, 'utf8');
    const intentionContent = fs.readFileSync(intentionPath, 'utf8');

    expect(ifThenContent).not.toContain('→');
    expect(intentionContent).not.toContain('→');
  });

  it('verifies MythCard uses rotating plus glyph instead of downward arrow glyph', () => {
    const mythPath = path.resolve(__dirname, '../../features/learn/MythCard.tsx');
    const mythContent = fs.readFileSync(mythPath, 'utf8');

    expect(mythContent).not.toContain('▼');
    expect(mythContent).toContain('+');
  });

  it('verifies measurement readouts use unified divided plates rather than identical card rows', () => {
    const resultsPath = path.resolve(__dirname, '../../features/check/ResultsView.tsx');
    const insightsPath = path.resolve(__dirname, '../../features/insights/InsightsOverview.tsx');
    const timeOfDayPath = path.resolve(__dirname, '../../features/insights/TimeOfDayChart.tsx');

    const resultsContent = fs.readFileSync(resultsPath, 'utf8');
    const insightsContent = fs.readFileSync(insightsPath, 'utf8');
    const timeOfDayContent = fs.readFileSync(timeOfDayPath, 'utf8');

    expect(resultsContent).toContain('divide-y sm:divide-y-0 sm:divide-x divide-border');
    expect(insightsContent).toContain('grid grid-cols-2 sm:grid-cols-4 shadow-xs overflow-hidden');
    expect(timeOfDayContent).toContain('rounded-[16px] bg-surface border border-border grid grid-cols-2 sm:grid-cols-4 shadow-xs overflow-hidden');
  });

  it('verifies user-facing copy in en.json and bn.json never writes "objective" about the Check', () => {
    const enPath = path.resolve(__dirname, '../../i18n/en.json');
    const bnPath = path.resolve(__dirname, '../../i18n/bn.json');
    const enContent = fs.readFileSync(enPath, 'utf8').toLowerCase();
    const bnContent = fs.readFileSync(bnPath, 'utf8');

    expect(enContent).not.toContain('objective');
    // Bengali translation for "objective" was "বস্তুনিষ্ঠ"
    expect(bnContent).not.toContain('বস্তুনিষ্ঠ');
  });
});
