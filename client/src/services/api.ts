import { ReportData, SystemHealth, TrendPoint, Biomarker, PatientMetadata, DoctorQuestion } from '../types/report';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Failed to fetch health check');
  return res.json();
}

export async function fetchReportsHistory(): Promise<{ reports: ReportData[] }> {
  const res = await fetch(`${API_BASE}/api/reports/history`);
  if (!res.ok) throw new Error('Failed to fetch report history');
  return res.json();
}

export async function fetchBiomarkerTrends(): Promise<{ trends: TrendPoint[] }> {
  const res = await fetch(`${API_BASE}/api/biomarkers/trends`);
  if (!res.ok) throw new Error('Failed to fetch biomarker trends');
  return res.json();
}

export interface StreamCallbacks {
  onInit: (data: { metadata: PatientMetadata; biomarkers: Biomarker[]; doctorQuestions: DoctorQuestion[] }) => void;
  onToken: (token: string) => void;
  onComplete: (report: ReportData) => void;
  onError: (error: string) => void;
}

export async function streamAnalyzeReport(
  payload: { text?: string; file?: File; language?: string },
  callbacks: StreamCallbacks
): Promise<void> {
  const lang = payload.language || 'en';
  let body: FormData | string;
  let headers: Record<string, string> = {
    Accept: 'text/event-stream',
  };

  if (payload.file) {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.language) formData.append('language', payload.language);
    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      text: payload.text || '',
      language: lang,
    });
  }

  try {
    const response = await fetch(`${API_BASE}/api/reports/analyze?stream=true&language=${lang}`, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errJson.error || 'Failed to analyze report');
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported by response');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let currentEvent = 'message';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.replace('event:', '').trim();
        } else if (trimmed.startsWith('data:')) {
          const rawData = trimmed.replace('data:', '').trim();
          try {
            const parsed = JSON.parse(rawData);
            if (currentEvent === 'init') {
              callbacks.onInit(parsed);
            } else if (currentEvent === 'token') {
              callbacks.onToken(parsed.token || '');
            } else if (currentEvent === 'complete') {
              callbacks.onComplete(parsed.report);
            }
          } catch (e) {
            console.error('Failed to parse SSE line JSON', e, rawData);
          }
        }
      }
    }
  } catch (err: any) {
    callbacks.onError(err.message || 'Error occurred during streaming analysis.');
  }
}

export async function streamChatWithReport(
  payload: { question: string; report: any; language?: string },
  callbacks: {
    onToken: (token: string) => void;
    onComplete: (fullAnswer: string) => void;
    onError: (error: string) => void;
  }
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/api/chat?stream=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errJson.error || 'Failed to get answer');
    }

    if (!response.body) throw new Error('ReadableStream not supported');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      let currentEvent = 'message';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        if (trimmed.startsWith('event:')) {
          currentEvent = trimmed.replace('event:', '').trim();
        } else if (trimmed.startsWith('data:')) {
          const rawData = trimmed.replace('data:', '').trim();
          try {
            const parsed = JSON.parse(rawData);
            if (currentEvent === 'token') {
              accumulated += parsed.token || '';
              callbacks.onToken(parsed.token || '');
            } else if (currentEvent === 'done') {
              callbacks.onComplete(parsed.answer || accumulated);
            }
          } catch (e) {}
        }
      }
    }
  } catch (err: any) {
    callbacks.onError(err.message || 'Error communicating with AI companion.');
  }
}
