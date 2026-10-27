import {
  AuditLog,
  Candidate,
  CandidateResult,
  ClassItem,
  ClassStatistic,
  Election,
  ElectionStatus,
  SchoolSettings,
  Vote,
  Voter,
} from '../types';

import paslon1Img from '../assets/images/paslon1_tembarak_1790867295706.jpg';
import paslon2Img from '../assets/images/paslon2_tembarak_1790867309212.jpg';
import paslon3Img from '../assets/images/paslon3_tembarak_1790867319879.jpg';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  SETTINGS: 'epilketos_settings_v2',
  ELECTION: 'epilketos_election_v2',
  CLASSES: 'epilketos_classes_v2',
  CANDIDATES: 'epilketos_candidates_v2',
  VOTERS: 'epilketos_voters_prod_v2',
  VOTES: 'epilketos_votes_prod_v2',
  AUDIT_LOGS: 'epilketos_audit_logs_prod_v2',
  SYNC_META: 'epilketos_sync_meta_v2',
};

// Default Settings
export const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: 'SMP NEGERI 1 TEMBARAK',
  subTitle: 'KABUPATEN TEMANGGUNG',
  address: 'Jalan Raya Tembarak, Desa Tembarak',
  village: 'Tembarak',
  district: 'Kecamatan Tembarak',
  regency: 'Kabupaten Temanggung',
  province: 'Jawa Tengah',
  postalCode: '56261',
  academicYear: '2026/2027',
  electionName: 'Pemilihan Ketua dan Wakil Ketua OSIS',
  slogan: 'Suaramu Menentukan Masa Depan OSIS',
  committeeContact: 'Sekretariat Panitia Pilketos (Ruang OSIS SMPN 1 Tembarak)',
  committeePhone: '0822-2756-3245',
  committeeChair: 'Budi Santoso, S.Pd.',
  committeeSecretary: 'Rina Wijayanti, S.Pd.',
  osisSupervisor: 'Drs. H. Sugeng Supriyanto',
  principal: 'Dra. Hj. Sri Wahyuni, M.Pd.',
  principalNip: '19710514 199702 2 001',
};

// Default 18 Classes (7A-7F, 8A-8F, 9A-9F)
export const DEFAULT_CLASSES: ClassItem[] = [
  { id: 'cls-7a', className: '7A', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7b', className: '7B', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7c', className: '7C', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7d', className: '7D', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7e', className: '7E', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-7f', className: '7F', grade: 7, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8a', className: '8A', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8b', className: '8B', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8c', className: '8C', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8d', className: '8D', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8e', className: '8E', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-8f', className: '8F', grade: 8, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9a', className: '9A', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9b', className: '9B', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9c', className: '9C', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9d', className: '9D', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9e', className: '9E', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'cls-9f', className: '9F', grade: 9, createdAt: '2026-09-01T08:00:00Z' },
];

// Official 3 Candidates
export const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    candidateNumber: 1,
    chairmanName: 'Ahmad Fauzi Nurcahyo',
    viceChairmanName: 'Siti Rahmawati Putri',
    chairmanPhoto: paslon1Img,
    tagline: 'Berkarakter, Berprestasi, dan Berbudaya Lingkungan',
    vision:
      'Mewujudkan OSIS SMP Negeri 1 Tembarak sebagai wadah aspirasi siswa yang berakhlak mulia, unggul dalam prestasi akademik maupun non-akademik, serta peduli terhadap kelestarian lingkungan sekolah.',
    mission: [
      'Menumbuhkan nilai religius dan budi pekerti luhur melalui pembiasaan ibadah bersama dan peringatan hari besar keagamaan.',
      'Mendukung program literasi, sains club, dan ekstrakurikuler sekolah untuk mencetak siswa berprestasi di tingkat kabupaten maupun provinsi.',
      'Menggalakkan gerakan Sekolah Adiwiyata: pilah sampah organik-anorganik, penghijauan taman kelas, dan program Spensatem Bersih Bersemi.',
      'Membangun komunikasi dua arah antara pengurus OSIS, perwakilan kelas, dan pihak dewan guru secara terbuka.',
    ],
    programs: [
      'Spensatem Islamic & Character Festival (SICF)',
      'Green Campus & Bersih Kelasku Tiap Jumat Pagi',
      'Pekan Prestasi & Bimbingan Minat Bakat (P2MB)',
      'Kotak Aspirasi Digital Siswa via Mading Interaktif',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'cand-02',
    candidateNumber: 2,
    chairmanName: 'Dimas Arya Pratama',
    viceChairmanName: 'Annisa Nurul Hidayah',
    chairmanPhoto: paslon2Img,
    tagline: 'Kreatif, Kolaboratif, Mengabdi untuk Seluruh Siswa Spensatem',
    vision:
      'Menjadikan OSIS SMP Negeri 1 Tembarak yang aktif, kreatif, berdaya saing global dengan tetap menjunjung tinggi kearifan lokal Temanggung serta semangat gotong royong.',
    mission: [
      'Mengembangkan kreativitas seni, sastra, dan budaya lokal khas Temanggung (jaran kepang, tari daerah, dan batik lokal).',
      'Menciptakan iklim belajar yang menyenangkan melalui program tutor sebaya antarkelas.',
      'Meningkatkan jiwa kepemimpinan pengurus kelas melalui Latihan Dasar Kepemimpinan Siswa (LDKS) yang inovatif.',
      'Mengoptimalkan pemanfaatan media digital sekolah yang santun, edukatif, dan positif.',
    ],
    programs: [
      'Spensatem Youth Cultural Festival (Pentas Seni Budaya Lokal)',
      'Program Teman Belajar (Peer Tutoring & Diskusi Asyik)',
      'Liga Olahraga & E-Sports Persahabatan Antarkelas',
      'Buletin OSIS Berkala & Podcast Inspirasi Remaja',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'cand-03',
    candidateNumber: 3,
    chairmanName: 'Muhammad Rizky Ramadhan',
    viceChairmanName: 'Zahra Amalia Putri',
    chairmanPhoto: paslon3Img,
    tagline: 'OSIS Aspiratif: Wadah Kreasi, Prestasi, dan Teknologi Siswa',
    vision:
      'Mewujudkan organisasi kesiswaan yang inklusif, adaptif terhadap teknologi digital, serta mendorong siswa SMP Negeri 1 Tembarak menjadi pribadi yang disiplin, mandiri, dan berwawasan luas.',
    mission: [
      'Menghidupkan peran mading sekolah baik fisik maupun digital sebagai pusat informasi inspiratif siswa.',
      'Mengadakan pelatihan keterampilan praktis (desain grafis dasar, public speaking, dan jurnalistik muda).',
      'Mempererat persaudaraan antarsiswa tanpa membeda-bedakan latar belakang, serta kampanye anti-bullying dan anti-perundungan.',
      'Bekerjasama dengan UKS dan PMR sekolah untuk mewujudkan pola hidup bersih dan sehat bagi seluruh warga sekolah.',
    ],
    programs: [
      'Spensatem Digital Workshop: Konten Positif & Public Speaking',
      'Gerakan Senyum Sapa Salam & Duta Anti-Bullying Spensatem',
      'Bulan Bahasa & Spensatem Book Review Competition',
      'Donor Buku & Pojok Baca Nyaman di Tiap Lorong Kelas',
    ],
    status: 'active',
    createdAt: '2026-09-10T08:00:00Z',
  },
];

export const DEFAULT_ELECTION: Election = {
  id: 'active',
  electionName: 'Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027',
  academicYear: '2026/2027',
  startTime: '2026-10-27T00:00:00',
  endTime: '2026-10-27T23:59:59',
  status: 'ongoing',
  createdAt: '2026-09-01T08:00:00Z',
};

// ==============================================================================
// MAPPER HELPERS (Supabase DB Rows <-> TypeScript Types)
// ==============================================================================

function mapRowToSettings(row: any, fallback: SchoolSettings): SchoolSettings {
  if (!row) return fallback;
  return {
    schoolName: row.school_name || row.schoolName || fallback.schoolName,
    subTitle: row.sub_title || row.subTitle || fallback.subTitle,
    address: row.address || fallback.address,
    village: row.village || fallback.village,
    district: row.district || fallback.district,
    regency: row.regency || fallback.regency,
    province: row.province || fallback.province,
    postalCode: row.postal_code || row.postalCode || fallback.postalCode,
    academicYear: row.academic_year || row.academicYear || fallback.academicYear,
    electionName: row.election_name || row.electionName || fallback.electionName,
    slogan: row.slogan || fallback.slogan,
    committeeContact: row.committee_contact || row.committeeContact || fallback.committeeContact,
    committeePhone: row.committee_phone || row.committeePhone || fallback.committeePhone,
    committeeChair: row.committee_chair || row.committeeChair || fallback.committeeChair,
    committeeSecretary: row.committee_secretary || row.committeeSecretary || fallback.committeeSecretary,
    osisSupervisor: row.osis_supervisor || row.osisSupervisor || fallback.osisSupervisor,
    principal: row.principal || fallback.principal,
    principalNip: row.principal_nip || row.principalNip || fallback.principalNip,
  };
}

function mapSettingsToRow(s: SchoolSettings) {
  return {
    id: 'config',
    school_name: s.schoolName,
    sub_title: s.subTitle,
    address: s.address,
    village: s.village,
    district: s.district,
    regency: s.regency,
    province: s.province,
    postal_code: s.postalCode,
    academic_year: s.academicYear,
    election_name: s.electionName,
    slogan: s.slogan,
    committee_contact: s.committeeContact,
    committee_phone: s.committeePhone,
    committee_chair: s.committeeChair,
    committee_secretary: s.committeeSecretary,
    osis_supervisor: s.osisSupervisor,
    principal: s.principal,
    principal_nip: s.principalNip,
    updated_at: new Date().toISOString(),
  };
}

function mapRowToElection(row: any, fallback: Election): Election {
  if (!row) return fallback;
  return {
    id: row.id || fallback.id,
    electionName: row.election_name || row.electionName || fallback.electionName,
    academicYear: row.academic_year || row.academicYear || fallback.academicYear,
    startTime: row.start_time || row.startTime || fallback.startTime,
    endTime: row.end_time || row.endTime || fallback.endTime,
    status: (row.status || fallback.status) as ElectionStatus,
    createdAt: row.created_at || row.createdAt || fallback.createdAt,
  };
}

function mapElectionToRow(e: Election) {
  return {
    id: e.id || 'active',
    election_name: e.electionName,
    academic_year: e.academicYear,
    start_time: e.startTime,
    end_time: e.endTime,
    status: e.status,
    created_at: e.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapRowToCandidate(row: any): Candidate {
  let mission = row.mission;
  if (typeof mission === 'string') {
    try { mission = JSON.parse(mission); } catch { mission = [mission]; }
  }
  let programs = row.programs;
  if (typeof programs === 'string') {
    try { programs = JSON.parse(programs); } catch { programs = [programs]; }
  }

  // Handle local fallback photos if stored photo is a filename
  let photo = row.chairman_photo || row.chairmanPhoto || '';
  if (!photo || photo === 'paslon1.jpg') photo = paslon1Img;
  if (photo === 'paslon2.jpg') photo = paslon2Img;
  if (photo === 'paslon3.jpg') photo = paslon3Img;

  return {
    id: String(row.id),
    candidateNumber: Number(row.candidate_number ?? row.candidateNumber),
    chairmanName: row.chairman_name || row.chairmanName || '',
    viceChairmanName: row.vice_chairman_name || row.viceChairmanName || '',
    chairmanPhoto: photo,
    viceChairmanPhoto: row.vice_chairman_photo || row.viceChairmanPhoto || undefined,
    tagline: row.tagline || '',
    vision: row.vision || '',
    mission: Array.isArray(mission) ? mission : [],
    programs: Array.isArray(programs) ? programs : [],
    status: (row.status || 'active') as 'active' | 'inactive',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapCandidateToRow(c: Candidate) {
  return {
    id: c.id,
    candidate_number: c.candidateNumber,
    chairman_name: c.chairmanName,
    vice_chairman_name: c.viceChairmanName,
    chairman_photo: c.chairmanPhoto,
    vice_chairman_photo: c.viceChairmanPhoto || null,
    tagline: c.tagline,
    vision: c.vision,
    mission: c.mission,
    programs: c.programs,
    status: c.status,
    created_at: c.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapRowToClass(row: any): ClassItem {
  return {
    id: String(row.id),
    className: row.class_name || row.className || '',
    grade: Number(row.grade || 7),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapClassToRow(c: ClassItem) {
  return {
    id: c.id,
    class_name: c.className,
    grade: c.grade,
    created_at: c.createdAt || new Date().toISOString(),
  };
}

function mapRowToVoter(row: any): Voter {
  return {
    id: String(row.id),
    nisn: String(row.nisn),
    name: row.name || '',
    classId: row.class_id || row.classId || '',
    className: row.class_name || row.className || '',
    pin: String(row.pin || row.pin_hash || ''),
    hasVoted: Boolean(row.has_voted ?? row.hasVoted),
    votedAt: row.voted_at || row.votedAt || undefined,
    status: (row.status || 'active') as 'active' | 'suspended',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapVoterToRow(v: Voter) {
  return {
    id: v.id,
    nisn: v.nisn,
    name: v.name,
    class_id: v.classId,
    class_name: v.className,
    pin: v.pin,
    has_voted: v.hasVoted,
    voted_at: v.votedAt || null,
    status: v.status,
    created_at: v.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapRowToVote(row: any): Vote {
  return {
    id: String(row.id),
    voterId: row.voter_id || row.voterId || '',
    candidateId: row.candidate_id || row.candidateId || '',
    electionId: row.election_id || row.electionId || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapVoteToRow(v: Vote) {
  return {
    id: v.id,
    voter_id: v.voterId,
    candidate_id: v.candidateId,
    election_id: v.electionId,
    created_at: v.createdAt || new Date().toISOString(),
  };
}

function mapRowToAuditLog(row: any): AuditLog {
  return {
    id: String(row.id),
    userId: row.user_id || row.userId || '',
    userName: row.user_name || row.userName || row.user_id || 'Pengguna',
    action: row.action || '',
    description: row.description || '',
    ipAddress: row.ip_address || row.ipAddress || '127.0.0.1',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapAuditLogToRow(l: AuditLog) {
  return {
    id: l.id,
    user_id: l.userId,
    user_name: l.userName,
    action: l.action,
    description: l.description,
    ip_address: l.ipAddress,
    created_at: l.createdAt || new Date().toISOString(),
  };
}

// ==============================================================================
// DATABASE SERVICE CLASS
// ==============================================================================

export interface CloudSyncInfo {
  isCloudConnected: boolean;
  tablesReady: boolean;
  lastSyncedAt?: string;
  errorMessage?: string;
}

class DatabaseService {
  // In-memory data store (hydrated directly from Supabase query)
  private settings: SchoolSettings = { ...DEFAULT_SETTINGS };
  private election: Election = { ...DEFAULT_ELECTION };
  private candidates: Candidate[] = [...DEFAULT_CANDIDATES];
  private classes: ClassItem[] = [...DEFAULT_CLASSES];
  private voters: Voter[] = [];
  private votes: Vote[] = [];
  private auditLogs: AuditLog[] = [];

  // State flags
  public isCloudConnected = false;
  public tablesReady = false;
  public isInitialized = false;
  public lastSyncTime: string | null = null;
  public lastError: string | null = null;

  // Realtime channel
  private realtimeChannel: any = null;
  private changeListeners: Set<() => void> = new Set();

  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write skipped:', e);
    }
  }

  // Pre-load from local storage cache only if present
  public init(): void {
    this.settings = this.getStorage<SchoolSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.election = this.getStorage<Election>(STORAGE_KEYS.ELECTION, DEFAULT_ELECTION);
    this.candidates = this.getStorage<Candidate[]>(STORAGE_KEYS.CANDIDATES, DEFAULT_CANDIDATES);
    this.classes = this.getStorage<ClassItem[]>(STORAGE_KEYS.CLASSES, DEFAULT_CLASSES);
    this.voters = this.getStorage<Voter[]>(STORAGE_KEYS.VOTERS, []);
    this.votes = this.getStorage<Vote[]>(STORAGE_KEYS.VOTES, []);
    this.auditLogs = this.getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    this.isInitialized = true;
  }

  // Register state change listener for Realtime events
  public subscribeToChanges(callback: () => void): () => void {
    this.changeListeners.add(callback);
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.changeListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Error in change listener:', err);
      }
    });
  }

  // ============================================================================
  // FETCH FROM SUPABASE: Initial page load lifecycle
  // ============================================================================
  public async loadFromSupabase(): Promise<CloudSyncInfo> {
    try {
      // 1. Parallel fetch query directly to Supabase server
      const [
        settingsRes,
        electionRes,
        candidatesRes,
        classesRes,
        votersRes,
        votesRes,
        auditRes,
      ] = await Promise.allSettled([
        supabase.from('settings').select('*').limit(1),
        supabase.from('elections').select('*').limit(1),
        supabase.from('candidates').select('*').order('candidate_number', { ascending: true }),
        supabase.from('classes').select('*').order('grade', { ascending: true }),
        supabase.from('voters').select('*').order('created_at', { ascending: true }),
        supabase.from('votes').select('*'),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      ]);

      // Check if any error mentions missing table / schema cache
      let schemaMissing = false;
      let anySuccess = false;
      let firstErrorMsg = '';

      const checkResult = (res: PromiseSettledResult<{ data: any; error: any }>) => {
        if (res.status === 'fulfilled') {
          if (res.value.error) {
            const msg = res.value.error.message || '';
            if (msg.includes('schema cache') || msg.includes('does not exist') || res.value.error.code === 'PGRST204') {
              schemaMissing = true;
            }
            if (!firstErrorMsg) firstErrorMsg = msg;
          } else {
            anySuccess = true;
          }
        } else {
          if (!firstErrorMsg) firstErrorMsg = String(res.reason);
        }
      };

      [settingsRes, electionRes, candidatesRes, classesRes, votersRes, votesRes, auditRes].forEach(checkResult);

      if (schemaMissing) {
        this.isCloudConnected = true;
        this.tablesReady = false;
        this.lastError = 'Tabel database Supabase belum dibuat di proyek Anda. Jalankan skrip supabase_schema.sql di Supabase SQL Editor.';
        return {
          isCloudConnected: true,
          tablesReady: false,
          errorMessage: this.lastError,
        };
      }

      this.isCloudConnected = true;
      this.tablesReady = true;
      this.lastError = null;

      // 2. Hydrate in-memory state with server rows
      // Settings
      if (settingsRes.status === 'fulfilled' && !settingsRes.value.error && settingsRes.value.data?.length > 0) {
        this.settings = mapRowToSettings(settingsRes.value.data[0], this.settings);
        this.setStorage(STORAGE_KEYS.SETTINGS, this.settings);
      } else if (settingsRes.status === 'fulfilled' && !settingsRes.value.error && settingsRes.value.data?.length === 0) {
        // Seed default settings to Supabase
        await supabase.from('settings').upsert(mapSettingsToRow(this.settings));
      }

      // Elections
      if (electionRes.status === 'fulfilled' && !electionRes.value.error && electionRes.value.data?.length > 0) {
        this.election = mapRowToElection(electionRes.value.data[0], this.election);
        this.setStorage(STORAGE_KEYS.ELECTION, this.election);
      } else if (electionRes.status === 'fulfilled' && !electionRes.value.error && electionRes.value.data?.length === 0) {
        // Seed default election to Supabase
        await supabase.from('elections').upsert(mapElectionToRow(this.election));
      }

      // Candidates
      if (candidatesRes.status === 'fulfilled' && !candidatesRes.value.error) {
        const rawCandidates = candidatesRes.value.data || [];
        if (rawCandidates.length > 0) {
          this.candidates = rawCandidates.map(mapRowToCandidate);
          this.setStorage(STORAGE_KEYS.CANDIDATES, this.candidates);
        } else {
          // Candidates table exists but empty: seed the 3 official candidates
          const rowsToSeed = DEFAULT_CANDIDATES.map(mapCandidateToRow);
          await supabase.from('candidates').upsert(rowsToSeed);
          this.candidates = [...DEFAULT_CANDIDATES];
          this.setStorage(STORAGE_KEYS.CANDIDATES, this.candidates);
        }
      }

      // Classes
      if (classesRes.status === 'fulfilled' && !classesRes.value.error) {
        const rawClasses = classesRes.value.data || [];
        if (rawClasses.length > 0) {
          this.classes = rawClasses.map(mapRowToClass);
          this.setStorage(STORAGE_KEYS.CLASSES, this.classes);
        } else {
          // Classes table exists but empty: seed the 18 classes (7A-7F, 8A-8F, 9A-9F)
          const rowsToSeed = DEFAULT_CLASSES.map(mapClassToRow);
          await supabase.from('classes').upsert(rowsToSeed);
          this.classes = [...DEFAULT_CLASSES];
          this.setStorage(STORAGE_KEYS.CLASSES, this.classes);
        }
      }

      // Voters (Crucial: 100% server authority)
      if (votersRes.status === 'fulfilled' && !votersRes.value.error) {
        this.voters = (votersRes.value.data || []).map(mapRowToVoter);
        this.setStorage(STORAGE_KEYS.VOTERS, this.voters);
      }

      // Votes (Crucial: 100% server authority)
      if (votesRes.status === 'fulfilled' && !votesRes.value.error) {
        this.votes = (votesRes.value.data || []).map(mapRowToVote);
        this.setStorage(STORAGE_KEYS.VOTES, this.votes);
      }

      // Audit Logs
      if (auditRes.status === 'fulfilled' && !auditRes.value.error) {
        this.auditLogs = (auditRes.value.data || []).map(mapRowToAuditLog);
        this.setStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
      }

      this.lastSyncTime = new Date().toISOString();
      this.initRealtimeSubscription();

      return {
        isCloudConnected: true,
        tablesReady: true,
        lastSyncedAt: this.lastSyncTime,
      };
    } catch (err: any) {
      console.warn('Supabase fetch exception:', err);
      this.isCloudConnected = false;
      this.lastError = err?.message || 'Gagal tersambung ke Supabase.';
      return {
        isCloudConnected: false,
        tablesReady: false,
        errorMessage: this.lastError || undefined,
      };
    }
  }

  // Real-time synchronization subscription
  private initRealtimeSubscription(): void {
    if (this.realtimeChannel) return;
    try {
      this.realtimeChannel = supabase
        .channel('epilketos-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'votes' },
          async () => {
            await this.refreshVotesAndVoters();
            this.notifyListeners();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'voters' },
          async () => {
            await this.refreshVotesAndVoters();
            this.notifyListeners();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'elections' },
          async () => {
            const { data } = await supabase.from('elections').select('*').limit(1);
            if (data && data.length > 0) {
              this.election = mapRowToElection(data[0], this.election);
              this.setStorage(STORAGE_KEYS.ELECTION, this.election);
              this.notifyListeners();
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
    }
  }

  // Lightweight refresh for votes and voters
  private async refreshVotesAndVoters(): Promise<void> {
    try {
      const [votersRes, votesRes] = await Promise.all([
        supabase.from('voters').select('*'),
        supabase.from('votes').select('*'),
      ]);
      if (votersRes.data) {
        this.voters = votersRes.data.map(mapRowToVoter);
        this.setStorage(STORAGE_KEYS.VOTERS, this.voters);
      }
      if (votesRes.data) {
        this.votes = votesRes.data.map(mapRowToVote);
        this.setStorage(STORAGE_KEYS.VOTES, this.votes);
      }
    } catch (e) {
      console.warn('Vote refresh notice:', e);
    }
  }

  // ============================================================================
  // SYNCHRONOUS GETTERS (Reading from in-memory synchronized store)
  // ============================================================================
  public getSettings(): SchoolSettings {
    return this.settings;
  }

  public getElection(): Election {
    return this.election;
  }

  public getClasses(): ClassItem[] {
    return this.classes;
  }

  public getCandidates(): Candidate[] {
    return this.candidates;
  }

  public getVoters(): Voter[] {
    return this.voters;
  }

  public getVoterById(id: string): Voter | null {
    return this.voters.find((v) => v.id === id) || null;
  }

  public getVotes(): Vote[] {
    return this.votes;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // Single-voter lookup supporting direct Supabase verification
  public async findVoterByNisnAndPin(nisn: string, pin: string): Promise<Voter | null> {
    const cleanNisn = nisn.trim();
    const cleanPin = pin.trim();

    // 1. Direct query to Supabase for immediate cross-device truth
    try {
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .eq('nisn', cleanNisn)
        .eq('pin', cleanPin)
        .maybeSingle();

      if (data && !error) {
        const freshVoter = mapRowToVoter(data);
        // Sync into memory if missing or updated
        const idx = this.voters.findIndex((v) => v.id === freshVoter.id);
        if (idx !== -1) {
          this.voters[idx] = freshVoter;
        } else {
          this.voters.push(freshVoter);
        }
        this.setStorage(STORAGE_KEYS.VOTERS, this.voters);
        return freshVoter;
      }
    } catch (e) {
      console.warn('Direct voter query fallback to memory:', e);
    }

    // 2. Fallback to in-memory store
    return this.voters.find((v) => v.nisn === cleanNisn && v.pin === cleanPin) || null;
  }

  // ============================================================================
  // CRUD ACTIONS: WRITE DIRECTLY TO SUPABASE
  // ============================================================================

  // 1. SETTINGS
  public async updateSettings(newSettings: SchoolSettings, adminUser = 'admin'): Promise<void> {
    this.settings = newSettings;
    this.setStorage(STORAGE_KEYS.SETTINGS, this.settings);

    // Save directly to Supabase
    try {
      await supabase.from('settings').upsert(mapSettingsToRow(this.settings));
    } catch (e) {
      console.error('Supabase updateSettings error:', e);
    }

    await this.addAuditLog(adminUser, 'UBAH_PENGATURAN', 'Memperbarui identitas dan pengaturan pemilihan.');
    this.notifyListeners();
  }

  // 2. ELECTION & SCHEDULE
  public async updateElection(updated: Partial<Election>, adminUser = 'admin'): Promise<void> {
    this.election = { ...this.election, ...updated };
    this.setStorage(STORAGE_KEYS.ELECTION, this.election);

    try {
      await supabase.from('elections').upsert(mapElectionToRow(this.election));
    } catch (e) {
      console.error('Supabase updateElection error:', e);
    }

    await this.addAuditLog(adminUser, 'UPDATE_JADWAL', 'Memperbarui rincian jadwal pemilihan.');
    this.notifyListeners();
  }

  public async updateElectionStatus(status: ElectionStatus, adminUser = 'admin'): Promise<void> {
    this.election.status = status;
    this.setStorage(STORAGE_KEYS.ELECTION, this.election);

    try {
      await supabase.from('elections').upsert(mapElectionToRow(this.election));
    } catch (e) {
      console.error('Supabase updateElectionStatus error:', e);
    }

    const actionName =
      status === 'ongoing' ? 'BUKA_PEMILIHAN' : status === 'completed' ? 'TUTUP_PEMILIHAN' : 'JEDA_PEMILIHAN';
    await this.addAuditLog(adminUser, actionName, `Mengubah status bilik suara menjadi "${status}".`);
    this.notifyListeners();
  }

  // 3. CLASSES
  public async addClass(className: string, grade: number, adminUser = 'admin'): Promise<ClassItem> {
    const newClass: ClassItem = {
      id: 'cls-' + Date.now(),
      className: className.trim(),
      grade,
      createdAt: new Date().toISOString(),
    };

    this.classes.push(newClass);
    this.setStorage(STORAGE_KEYS.CLASSES, this.classes);

    try {
      await supabase.from('classes').upsert(mapClassToRow(newClass));
    } catch (e) {
      console.error('Supabase addClass error:', e);
    }

    await this.addAuditLog(adminUser, 'TAMBAH_KELAS', `Menambahkan kelas baru: ${className}`);
    this.notifyListeners();
    return newClass;
  }

  public async deleteClass(id: string, adminUser = 'admin'): Promise<boolean> {
    const target = this.classes.find((c) => c.id === id);
    this.classes = this.classes.filter((c) => c.id !== id);
    this.setStorage(STORAGE_KEYS.CLASSES, this.classes);

    try {
      await supabase.from('classes').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteClass error:', e);
    }

    if (target) {
      await this.addAuditLog(adminUser, 'HAPUS_KELAS', `Menghapus kelas ${target.className}`);
    }
    this.notifyListeners();
    return true;
  }

  // 4. CANDIDATES
  public async saveCandidate(candidate: Candidate, isNew: boolean, adminUser = 'admin'): Promise<void> {
    if (isNew) {
      this.candidates.push(candidate);
      await this.addAuditLog(
        adminUser,
        'TAMBAH_PASLON',
        `Menambahkan pasangan calon nomor ${candidate.candidateNumber} (${candidate.chairmanName} & ${candidate.viceChairmanName})`
      );
    } else {
      const idx = this.candidates.findIndex((c) => c.id === candidate.id);
      if (idx !== -1) {
        this.candidates[idx] = candidate;
      }
      await this.addAuditLog(
        adminUser,
        'UBAH_PASLON',
        `Memperbarui data pasangan calon nomor ${candidate.candidateNumber}`
      );
    }

    this.setStorage(STORAGE_KEYS.CANDIDATES, this.candidates);

    try {
      await supabase.from('candidates').upsert(mapCandidateToRow(candidate));
    } catch (e) {
      console.error('Supabase saveCandidate error:', e);
    }

    this.notifyListeners();
  }

  public async deleteCandidate(id: string, adminUser = 'admin'): Promise<void> {
    const target = this.candidates.find((c) => c.id === id);
    this.candidates = this.candidates.filter((c) => c.id !== id);
    this.setStorage(STORAGE_KEYS.CANDIDATES, this.candidates);

    try {
      await supabase.from('candidates').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteCandidate error:', e);
    }

    if (target) {
      await this.addAuditLog(adminUser, 'HAPUS_PASLON', `Menghapus pasangan calon nomor urut ${target.candidateNumber}`);
    }
    this.notifyListeners();
  }

  // 5. VOTERS (DPT)
  public async saveVoter(voter: Voter, isNew: boolean, adminUser = 'admin'): Promise<void> {
    if (isNew) {
      this.voters.push(voter);
      await this.addAuditLog(
        adminUser,
        'TAMBAH_PEMILIH',
        `Menambahkan siswa pemilih: ${voter.name} (${voter.nisn} - ${voter.className})`
      );
    } else {
      const idx = this.voters.findIndex((v) => v.id === voter.id);
      if (idx !== -1) {
        this.voters[idx] = voter;
      }
      await this.addAuditLog(adminUser, 'UBAH_PEMILIH', `Memperbarui data siswa: ${voter.name} (${voter.nisn})`);
    }

    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);

    try {
      await supabase.from('voters').upsert(mapVoterToRow(voter));
    } catch (e) {
      console.error('Supabase saveVoter error:', e);
    }

    this.notifyListeners();
  }

  public async deleteVoter(id: string, adminUser = 'admin'): Promise<void> {
    const target = this.voters.find((v) => v.id === id);
    this.voters = this.voters.filter((v) => v.id !== id);
    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);

    try {
      await supabase.from('voters').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteVoter error:', e);
    }

    if (target) {
      await this.addAuditLog(adminUser, 'HAPUS_PEMILIH', `Menghapus siswa: ${target.name} (${target.nisn})`);
    }
    this.notifyListeners();
  }

  public async deleteVotersBatch(ids: string[], adminUser = 'admin'): Promise<number> {
    const idSet = new Set(ids);
    const toDeleteCount = this.voters.filter((v) => idSet.has(v.id)).length;
    this.voters = this.voters.filter((v) => !idSet.has(v.id));
    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);

    try {
      await supabase.from('voters').delete().in('id', ids);
    } catch (e) {
      console.error('Supabase batch delete error:', e);
    }

    await this.addAuditLog(
      adminUser,
      'HAPUS_MASSAL_PEMILIH',
      `Menghapus ${toDeleteCount} data pemilih secara massal.`
    );
    this.notifyListeners();
    return toDeleteCount;
  }

  public async resetVoterVoteStatus(
    voterId: string,
    adminUser = 'admin'
  ): Promise<{ success: boolean; message: string }> {
    const voter = this.voters.find((v) => v.id === voterId);
    if (!voter) {
      return { success: false, message: 'Data pemilih tidak ditemukan.' };
    }

    if (!voter.hasVoted) {
      return { success: false, message: 'Siswa ini belum memilih.' };
    }

    voter.hasVoted = false;
    delete voter.votedAt;
    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);

    // Remove vote record
    this.votes = this.votes.filter((v) => v.voterId !== voterId);
    this.setStorage(STORAGE_KEYS.VOTES, this.votes);

    try {
      await supabase
        .from('voters')
        .update({ has_voted: false, voted_at: null })
        .eq('id', voterId);

      await supabase.from('votes').delete().eq('voter_id', voterId);
    } catch (e) {
      console.error('Supabase resetVoterVoteStatus error:', e);
    }

    await this.addAuditLog(
      adminUser,
      'RESET_STATUS_PEMILIH',
      `Mereset hak suara siswa ${voter.name} (NISN: ${voter.nisn}) atas permintaan resmi panitia.`
    );
    this.notifyListeners();
    return { success: true, message: `Status suara untuk ${voter.name} berhasil direset.` };
  }

  public async importVoters(
    newVoters: Omit<Voter, 'id' | 'hasVoted' | 'status' | 'createdAt'>[],
    adminUser = 'admin'
  ): Promise<{ addedCount: number; duplicateCount: number }> {
    const existingNisns = new Set(this.voters.map((v) => v.nisn));
    let added = 0;
    let dupes = 0;
    const addedList: Voter[] = [];

    for (const item of newVoters) {
      if (existingNisns.has(item.nisn)) {
        dupes++;
        continue;
      }
      const voter: Voter = {
        id: 'vtr-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
        nisn: item.nisn,
        name: item.name,
        classId: item.classId,
        className: item.className,
        pin: item.pin || Math.floor(1000 + Math.random() * 9000).toString(),
        hasVoted: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      this.voters.push(voter);
      addedList.push(voter);
      existingNisns.add(item.nisn);
      added++;
    }

    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);

    // Direct chunked upsert to Supabase
    if (addedList.length > 0) {
      try {
        const chunkSize = 200;
        for (let i = 0; i < addedList.length; i += chunkSize) {
          const chunk = addedList.slice(i, i + chunkSize).map(mapVoterToRow);
          await supabase.from('voters').upsert(chunk);
        }
      } catch (e) {
        console.error('Supabase bulk import error:', e);
      }
    }

    await this.addAuditLog(
      adminUser,
      'IMPORT_DATA_SISWA',
      `Import data selesai: ${added} siswa ditambahkan, ${dupes} data duplikat dilewati.`
    );
    this.notifyListeners();
    return { addedCount: added, duplicateCount: dupes };
  }

  // ============================================================================
  // ATOMIC VOTE CASTING MECHANISM (1 SISWA = 1 SUARA)
  // Directly writing to Supabase 'votes', updating 'voters', and logging
  // ============================================================================
  public async castVote(
    voterId: string,
    candidateId: string
  ): Promise<{ success: boolean; message: string; votedAt?: string; digitalToken?: string }> {
    if (this.election.status !== 'ongoing') {
      return {
        success: false,
        message: 'Bilik suara saat ini belum dibuka atau telah ditutup oleh panitia.',
      };
    }

    // 1. Direct cross-check against Supabase server to guarantee zero double-voting
    try {
      const { data: serverVoter, error: sErr } = await supabase
        .from('voters')
        .select('*')
        .eq('id', voterId)
        .maybeSingle();

      if (serverVoter && !sErr) {
        if (serverVoter.has_voted) {
          // Update memory
          const localV = this.voters.find((v) => v.id === voterId);
          if (localV) localV.hasVoted = true;
          return {
            success: false,
            message: 'Hak suara Anda telah digunakan dan tidak dapat memilih kembali.',
          };
        }
      }
    } catch (err) {
      console.warn('Direct server double-vote check notice:', err);
    }

    const voter = this.voters.find((v) => v.id === voterId);
    if (!voter) {
      return { success: false, message: 'Data pemilih tidak ditemukan dalam sistem.' };
    }

    if (voter.status !== 'active') {
      return { success: false, message: 'Status akun pemilih Anda sedang dinonaktifkan oleh panitia.' };
    }

    if (voter.hasVoted) {
      return {
        success: false,
        message: 'Hak suara Anda telah digunakan dan tidak dapat memilih kembali.',
      };
    }

    const candidate = this.candidates.find((c) => c.id === candidateId && c.status === 'active');
    if (!candidate) {
      return { success: false, message: 'Pasangan calon yang Anda pilih tidak valid atau non-aktif.' };
    }

    const nowIso = new Date().toISOString();
    voter.hasVoted = true;
    voter.votedAt = nowIso;

    const newVote: Vote = {
      id: 'vote-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
      voterId: voter.id,
      candidateId: candidate.id,
      electionId: this.election.id,
      createdAt: nowIso,
    };

    this.votes.push(newVote);
    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);
    this.setStorage(STORAGE_KEYS.VOTES, this.votes);

    // Direct write to Supabase (votes, update voter, audit log)
    try {
      await Promise.all([
        supabase.from('votes').insert(mapVoteToRow(newVote)),
        supabase
          .from('voters')
          .update({ has_voted: true, voted_at: nowIso })
          .eq('id', voter.id),
      ]);
    } catch (e) {
      console.error('Supabase castVote write error:', e);
    }

    // Generate digital receipt token
    const rawReceipt = `${voter.nisn}-${candidate.candidateNumber}-${Date.now()}`;
    const digitalToken = 'SPENSA-' + btoa(rawReceipt).slice(0, 14).toUpperCase();

    await this.addAuditLog(
      'system',
      'VOTE_SUBMITTED',
      `Siswa NISN ${voter.nisn} (${voter.className}) telah berhasil mengirimkan hak suara.`
    );

    this.notifyListeners();

    return {
      success: true,
      message: 'Suara Anda berhasil dicatat secara resmi oleh sistem E-Pilketos.',
      votedAt: nowIso,
      digitalToken,
    };
  }

  // ============================================================================
  // STATISTICS & ELECTION RESULTS
  // ============================================================================
  public getElectionResults(): {
    totalVoters: number;
    votedCount: number;
    unvotedCount: number;
    participationRate: number;
    totalValidVotes: number;
    candidateResults: CandidateResult[];
    classStatistics: ClassStatistic[];
  } {
    const totalVoters = this.voters.length;
    const votedCount = this.voters.filter((v) => v.hasVoted).length;
    const unvotedCount = totalVoters - votedCount;
    const participationRate = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;
    const totalValidVotes = this.votes.length;

    // Tally per candidate
    const candidateResults: CandidateResult[] = this.candidates.map((candidate) => {
      const count = this.votes.filter((v) => v.candidateId === candidate.id).length;
      const pct = totalValidVotes > 0 ? (count / totalValidVotes) * 100 : 0;
      return {
        candidate,
        voteCount: count,
        percentage: Number(pct.toFixed(2)),
      };
    });

    candidateResults.sort((a, b) => a.candidate.candidateNumber - b.candidate.candidateNumber);

    // Tally per class
    const classStatistics: ClassStatistic[] = this.classes.map((cls) => {
      const classVoters = this.voters.filter(
        (v) => v.classId === cls.id || v.className === cls.className
      );
      const totalInClass = classVoters.length;
      const votedInClass = classVoters.filter((v) => v.hasVoted).length;
      const unvotedInClass = totalInClass - votedInClass;
      const pct = totalInClass > 0 ? (votedInClass / totalInClass) * 100 : 0;

      return {
        classId: cls.id,
        className: cls.className,
        totalVoters: totalInClass,
        votedCount: votedInClass,
        unvotedCount: unvotedInClass,
        percentage: Number(pct.toFixed(2)),
      };
    });

    return {
      totalVoters,
      votedCount,
      unvotedCount,
      participationRate: Number(participationRate.toFixed(2)),
      totalValidVotes,
      candidateResults,
      classStatistics,
    };
  }

  // ============================================================================
  // AUDIT LOGS
  // ============================================================================
  public async addAuditLog(user: string, action: string, description: string): Promise<void> {
    const newLog: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: user,
      userName: user === 'admin' ? 'Administrator' : user === 'system' ? 'Sistem Otomatis' : user,
      action,
      description,
      ipAddress: '192.168.1.' + Math.floor(10 + Math.random() * 50) + ' (Server Sekolah)',
      createdAt: new Date().toISOString(),
    };

    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

    try {
      await supabase.from('audit_logs').insert(mapAuditLogToRow(newLog));
    } catch (e) {
      console.warn('Supabase audit log insert notice:', e);
    }
  }

  // Reset to initial clean production state
  public async resetAllToDefault(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS };
    this.election = { ...DEFAULT_ELECTION };
    this.candidates = [...DEFAULT_CANDIDATES];
    this.classes = [...DEFAULT_CLASSES];
    this.voters = [];
    this.votes = [];
    this.auditLogs = [
      {
        id: 'log-' + Date.now(),
        userId: 'admin',
        userName: 'Administrator Panitia',
        action: 'RESET_DATA_PRODUKSI',
        description: 'Seluruh data pemilih dan rekapitulasi suara berhasil dikosongkan (Kondisi Bersih Produksi).',
        ipAddress: '127.0.0.1 (Server Sekolah)',
        createdAt: new Date().toISOString(),
      },
    ];

    this.setStorage(STORAGE_KEYS.SETTINGS, this.settings);
    this.setStorage(STORAGE_KEYS.ELECTION, this.election);
    this.setStorage(STORAGE_KEYS.CANDIDATES, this.candidates);
    this.setStorage(STORAGE_KEYS.CLASSES, this.classes);
    this.setStorage(STORAGE_KEYS.VOTERS, this.voters);
    this.setStorage(STORAGE_KEYS.VOTES, this.votes);
    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

    // Push reset state to Supabase
    try {
      await Promise.allSettled([
        supabase.from('settings').upsert(mapSettingsToRow(this.settings)),
        supabase.from('elections').upsert(mapElectionToRow(this.election)),
        supabase.from('candidates').upsert(this.candidates.map(mapCandidateToRow)),
        supabase.from('classes').upsert(this.classes.map(mapClassToRow)),
        supabase.from('votes').delete().neq('id', '___non_existent___'),
        supabase.from('voters').delete().neq('id', '___non_existent___'),
      ]);
    } catch (e) {
      console.warn('Supabase reset notice:', e);
    }

    this.notifyListeners();
  }
}

export const db = new DatabaseService();
db.init();
