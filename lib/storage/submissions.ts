import { MenfessConfig } from '@/types/template';
import { MenfessSubmission, SubmissionStatus } from '@/types/admin';

const STORAGE_KEY = 'menfess_studio_submissions_v1';

export function formatInstagramCaption(submission: {
  code: string;
  config: MenfessConfig;
}): string {
  const { code, config } = submission;
  const sender = config.isAnonymous
    ? 'Anonim 🕵️‍♂️'
    : config.senderName
    ? `@${config.senderName.replace(/^@/, '')}`
    : 'Anonim';
  const recipient = config.recipientName ? `@${config.recipientName.replace(/^@/, '')}` : 'Semua Orang';
  const tags = config.hashtag
    ? config.hashtag
        .split(' ')
        .map((t) => (t.startsWith('#') ? t : `#${t}`))
        .join(' ')
    : '#menfess #curhat #menfessgram';

  return `📩 NEW MENFESS [${code}]
━━━━━━━━━━━━━━━━━━
"${config.message}"

Dari: ${sender}
Kepada: ${recipient}
Waktu: ${new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}

━━━━━━━━━━━━━━━━━━
💬 Tulis pendapat/responmu di kolom komentar!
📌 Mau kirim menfess juga secara anonim? Cek link di bio!

${tags} #menfessstudio #ceritahariini #editorial #aesthetic`;
}

const DEFAULT_SUBMISSIONS: MenfessSubmission[] = [
  {
    id: 'sub-demo-1',
    code: 'MF-042',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    config: {
      templateId: 'koran-tempo-dulu',
      message:
        'Untuk kamu yang sering duduk di sudut perpus sambil dengerin lagu jazz: senyummu waktu baca buku kemarin manis banget, semoga harimu selalu menyenangkan ya.',
      senderName: 'Pengagum Rahasia',
      isAnonymous: true,
      textAlignment: 'left',
      fontSize: 'md',
      recipientName: 'Anak Arsitektur angkatan 22',
      hashtag: '#perpustakaan #crush #menfesskampus',
    },
    status: 'pending',
    targetPlatform: 'instagram',
    caption: '',
  },
  {
    id: 'sub-demo-2',
    code: 'MF-041',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    config: {
      templateId: 'surat-cinta-retro',
      message:
        'Terima kasih sudah bertahan sampai hari ini di tengah skripsi dan revisi yang ga ada habisnya. Kamu hebat, jangan lupa makan dan istirahat yang cukup malam ini.',
      senderName: 'Teman seperjuanganmu',
      isAnonymous: false,
      textAlignment: 'center',
      fontSize: 'lg',
      recipientName: 'Dinda',
      hashtag: '#semangatskripsi #pejuangtugasakhir',
    },
    status: 'approved',
    targetPlatform: 'instagram',
    caption: '',
  },
  {
    id: 'sub-demo-3',
    code: 'MF-040',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    config: {
      templateId: 'classic-dark',
      message:
        'Kadang yang kita butuhkan cuma secangkir kopi hangat dan seseorang yang mendengarkan tanpa menghakimi.',
      senderName: 'KopiSenja',
      isAnonymous: true,
      textAlignment: 'center',
      fontSize: 'md',
      recipientName: '',
      hashtag: '#filosofikopi #malamhari #menfess',
    },
    status: 'uploaded',
    targetPlatform: 'instagram',
    caption: '',
    instagramUrl: 'https://instagram.com/p/menfess_studio_demo',
  },
];

export function getSubmissions(): MenfessSubmission[] {
  if (typeof window === 'undefined') return DEFAULT_SUBMISSIONS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default submissions if first time
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SUBMISSIONS));
      return DEFAULT_SUBMISSIONS;
    }
    const parsed: MenfessSubmission[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SUBMISSIONS;
  } catch {
    return DEFAULT_SUBMISSIONS;
  }
}

export function saveSubmissions(list: MenfessSubmission[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    // Dispatch storage event for other components
    window.dispatchEvent(new Event('menfess-submissions-updated'));
  } catch (err) {
    console.error('Failed to save submissions to localStorage:', err);
  }
}

export function addSubmission(config: MenfessConfig): MenfessSubmission {
  const current = getSubmissions();
  const nextNum = current.length + 42;
  const code = `MF-${String(nextNum).padStart(3, '0')}`;
  
  const newSubmission: MenfessSubmission = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code,
    createdAt: new Date().toISOString(),
    config,
    status: 'pending',
    targetPlatform: 'instagram',
    caption: formatInstagramCaption({ code, config }),
  };

  const updated = [newSubmission, ...current];
  saveSubmissions(updated);
  return newSubmission;
}

export function updateSubmission(
  id: string,
  partial: Partial<MenfessSubmission>
): MenfessSubmission[] {
  const current = getSubmissions();
  const updated = current.map((sub) => {
    if (sub.id !== id) return sub;
    const nextSub = { ...sub, ...partial };
    // If config was modified, refresh default caption if caption wasn't explicitly changed
    if (partial.config && !partial.caption) {
      nextSub.caption = formatInstagramCaption({ code: nextSub.code, config: nextSub.config });
    }
    return nextSub;
  });
  saveSubmissions(updated);
  return updated;
}

export function deleteSubmission(id: string): MenfessSubmission[] {
  const current = getSubmissions();
  const updated = current.filter((sub) => sub.id !== id);
  saveSubmissions(updated);
  return updated;
}
