import { describe, it, expect, vi, beforeEach } from 'vitest';
import { drawShareCard, generateShareCardBlob, shareOrDownloadCard } from '@/lib/share-card';
import { CheckResult } from '@/store/types';

describe('Share Card Generation (docs/DESIGN-V3.md Section 10)', () => {
  const dummyResult: CheckResult = {
    id: 'check-test-1',
    ts: 1775736000000,
    context: 'baseline',
    preRatings: { alertness: 4, mindWandering: 2 },
    metrics: {
      medianRt: 238,
      lapses: 1,
      falseStarts: 0,
      meanReciprocal: 4.2,
    },
    trials: [],
  };

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('draws to a 1080 x 1350 canvas with user metrics, correct grammar, and date', () => {
    const mockCtx = {
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      fillText: vi.fn(),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      textAlign: '',
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      font: '',
    };

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn((type: string) => (type === '2d' ? mockCtx : null)),
    } as unknown as HTMLCanvasElement;

    drawShareCard(mockCanvas, dummyResult);

    expect(mockCanvas.width).toBe(1080);
    expect(mockCanvas.height).toBe(1350);

    const fillTextCalls = mockCtx.fillText.mock.calls.map((call) => call[0]);
    expect(fillTextCalls).toContain('FocusLab');
    expect(fillTextCalls).toContain('238');
    expect(fillTextCalls).toContain('ms');
    expect(fillTextCalls.some((t: string) => t.includes('1 lapse (≥355ms)'))).toBe(true);
    expect(fillTextCalls.some((t: string) => t.includes('0 false starts (<100ms)'))).toBe(true);

    const allDrawnText = fillTextCalls.join(' ');
    expect(allDrawnText).not.toContain('ADHD');
    expect(allDrawnText).not.toContain('boosts');
    expect(allDrawnText).not.toContain('diagnostic');
  });

  it('uses Web Share API when supported with file attachment', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    const mockCanShare = vi.fn().mockReturnValue(true);

    const mockCanvas = {
      width: 1080,
      height: 1350,
      getContext: vi.fn(() => ({
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        fillText: vi.fn(),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      })),
      toBlob: vi.fn((cb: (b: Blob) => void) => cb(new Blob(['fake-png'], { type: 'image/png' }))),
    };

    vi.stubGlobal('document', {
      createElement: vi.fn((tag: string) => (tag === 'canvas' ? mockCanvas : {})),
    });
    vi.stubGlobal('navigator', {
      share: mockShare,
      canShare: mockCanShare,
    });

    await shareOrDownloadCard(dummyResult);

    expect(mockShare).toHaveBeenCalled();
    const shareArg = mockShare.mock.calls[0][0];
    expect(shareArg.title).toContain('FocusLab');
    expect(shareArg.text).toContain('238 ms');
    expect(shareArg.files).toBeDefined();
    expect(shareArg.files.length).toBe(1);
  });

  it('executes download fallback when Web Share is not available', async () => {
    const mockToBlob = vi.fn((cb: (b: Blob) => void) => {
      cb(new Blob(['fake-png'], { type: 'image/png' }));
    });

    const mockAnchor = {
      href: '',
      download: '',
      click: vi.fn(),
    };

    const mockCanvas = {
      width: 1080,
      height: 1350,
      getContext: vi.fn(() => ({
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        fillText: vi.fn(),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      })),
      toBlob: mockToBlob,
    };

    const mockDocument = {
      createElement: vi.fn((tag: string) => {
        if (tag === 'canvas') return mockCanvas;
        if (tag === 'a') return mockAnchor;
        return {};
      }),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    };

    vi.stubGlobal('document', mockDocument);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    });

    await shareOrDownloadCard(dummyResult);

    expect(mockDocument.createElement).toHaveBeenCalledWith('canvas');
    expect(mockDocument.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockAnchor.download).toContain('focuslab-check-');
  });

  it('falls back to toDataURL when canvas.toBlob is not supported', async () => {
    const mockCanvas = {
      width: 1080,
      height: 1350,
      getContext: vi.fn(() => ({
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        stroke: vi.fn(),
        fill: vi.fn(),
        arc: vi.fn(),
        fillText: vi.fn(),
        createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      })),
      toBlob: undefined,
      toDataURL: vi.fn(() => 'data:image/png;base64,ZmFrZS1kYXRh'),
    };

    vi.stubGlobal('document', {
      createElement: vi.fn(() => mockCanvas),
    });

    const blob = await generateShareCardBlob(dummyResult);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  });
});
