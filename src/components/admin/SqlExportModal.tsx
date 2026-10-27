import React, { useState } from 'react';
import { X, Download, Copy, Check, Database, Server, Code, Zap, ExternalLink } from 'lucide-react';

interface SqlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlExportModal: React.FC<SqlExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'supabase' | 'sql' | 'php' | 'deploy'>('supabase');

  if (!isOpen) return null;

  const supabaseSchema = `-- ==============================================================================
-- SKEMA BASIS DATA SUPABASE (POSTGRESQL) & KEBIJAKAN ROW LEVEL SECURITY (RLS)
-- E-PILKETOS SMP NEGERI 1 TEMBARAK TAHUN PELAJARAN 2026/2027
-- ==============================================================================
-- CARA PENGGUNAAN DI SUPABASE:
-- 1. Buka dashboard proyek Supabase Anda: https://supabase.com/dashboard
-- 2. Pilih menu "SQL Editor" di bilah kiri.
-- 3. Klik "New query", tempelkan seluruh isi file ini, lalu klik "Run" (atau Ctrl+Enter).
-- 4. Semua tabel, relasi, indeks, dan kebijakan keamanan RLS (anon) akan aktif seketika.
-- ==============================================================================

-- 1. TABEL PENGATURAN SEKOLAH (SETTINGS)
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'config',
    school_name TEXT NOT NULL DEFAULT 'SMP NEGERI 1 TEMBARAK',
    sub_title TEXT DEFAULT 'KABUPATEN TEMANGGUNG',
    address TEXT DEFAULT 'Jalan Raya Tembarak, Desa Tembarak',
    village TEXT DEFAULT 'Tembarak',
    district TEXT DEFAULT 'Kecamatan Tembarak',
    regency TEXT DEFAULT 'Kabupaten Temanggung',
    province TEXT DEFAULT 'Jawa Tengah',
    postal_code TEXT DEFAULT '56261',
    academic_year TEXT DEFAULT '2026/2027',
    election_name TEXT DEFAULT 'Pemilihan Ketua dan Wakil Ketua OSIS',
    slogan TEXT DEFAULT 'Suaramu Menentukan Masa Depan OSIS',
    committee_contact TEXT DEFAULT 'Sekretariat Panitia Pilketos (Ruang OSIS SMPN 1 Tembarak)',
    committee_phone TEXT DEFAULT '0822-2756-3245',
    committee_chair TEXT DEFAULT 'Budi Santoso, S.Pd.',
    committee_secretary TEXT DEFAULT 'Rina Wijayanti, S.Pd.',
    osis_supervisor TEXT DEFAULT 'Drs. H. Sugeng Supriyanto',
    principal TEXT DEFAULT 'Dra. Hj. Sri Wahyuni, M.Pd.',
    principal_nip TEXT DEFAULT '19710514 199702 2 001',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PERIODE & JADWAL PEMILIHAN (ELECTIONS)
CREATE TABLE IF NOT EXISTS public.elections (
    id TEXT PRIMARY KEY DEFAULT 'active',
    election_name TEXT NOT NULL DEFAULT 'Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027',
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    start_time TIMESTAMPTZ NOT NULL DEFAULT '2026-10-27 00:00:00+07',
    end_time TIMESTAMPTZ NOT NULL DEFAULT '2026-10-27 23:59:59+07',
    status TEXT NOT NULL DEFAULT 'ongoing',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL ROMBEL KELAS (CLASSES)
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    class_name TEXT NOT NULL UNIQUE,
    grade INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PASANGAN CALON (CANDIDATES)
CREATE TABLE IF NOT EXISTS public.candidates (
    id TEXT PRIMARY KEY,
    candidate_number INTEGER NOT NULL UNIQUE,
    chairman_name TEXT NOT NULL,
    vice_chairman_name TEXT NOT NULL,
    chairman_photo TEXT NOT NULL,
    vice_chairman_photo TEXT,
    tagline TEXT,
    vision TEXT NOT NULL,
    mission JSONB NOT NULL DEFAULT '[]'::jsonb,
    programs JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL DPT SISWA PEMILIH (VOTERS)
CREATE TABLE IF NOT EXISTS public.voters (
    id TEXT PRIMARY KEY,
    nisn TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    class_id TEXT,
    class_name TEXT NOT NULL,
    pin TEXT NOT NULL,
    has_voted BOOLEAN NOT NULL DEFAULT FALSE,
    voted_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL TABULASI SUARA RAHASIA (VOTES)
CREATE TABLE IF NOT EXISTS public.votes (
    id TEXT PRIMARY KEY,
    voter_id TEXT NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    election_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_voter_election UNIQUE (voter_id, election_id)
);

-- 7. TABEL AUDIT LOG (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT,
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- AKTIFKAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- KEBIJAKAN RLS (POLICIES) UNTUK AKSES PUBLIK ANON & AUTHENTICATED
-- ==============================================================================
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write settings" ON public.settings;
CREATE POLICY "Public write settings" ON public.settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read elections" ON public.elections;
CREATE POLICY "Public read elections" ON public.elections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write elections" ON public.elections;
CREATE POLICY "Public write elections" ON public.elections FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read classes" ON public.classes;
CREATE POLICY "Public read classes" ON public.classes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write classes" ON public.classes;
CREATE POLICY "Public write classes" ON public.classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read candidates" ON public.candidates;
CREATE POLICY "Public read candidates" ON public.candidates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write candidates" ON public.candidates;
CREATE POLICY "Public write candidates" ON public.candidates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read voters" ON public.voters;
CREATE POLICY "Public read voters" ON public.voters FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write voters" ON public.voters;
CREATE POLICY "Public write voters" ON public.voters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read votes" ON public.votes;
CREATE POLICY "Public read votes" ON public.votes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public insert votes" ON public.votes;
CREATE POLICY "Public insert votes" ON public.votes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete votes" ON public.votes;
CREATE POLICY "Public delete votes" ON public.votes FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public read audit_logs" ON public.audit_logs;
CREATE POLICY "Public read audit_logs" ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public insert audit_logs" ON public.audit_logs;
CREATE POLICY "Public insert audit_logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- DATA AWAL 18 KELAS
INSERT INTO public.classes (id, class_name, grade) VALUES
    ('cls-7a', '7A', 7), ('cls-7b', '7B', 7), ('cls-7c', '7C', 7),
    ('cls-7d', '7D', 7), ('cls-7e', '7E', 7), ('cls-7f', '7F', 7),
    ('cls-8a', '8A', 8), ('cls-8b', '8B', 8), ('cls-8c', '8C', 8),
    ('cls-8d', '8D', 8), ('cls-8e', '8E', 8), ('cls-8f', '8F', 8),
    ('cls-9a', '9A', 9), ('cls-9b', '9B', 9), ('cls-9c', '9C', 9),
    ('cls-9d', '9D', 9), ('cls-9e', '9E', 9), ('cls-9f', '9F', 9)
ON CONFLICT (id) DO NOTHING;
`;

  const sqlSchema = `-- ============================================================
-- DATABASE SCHEMA & SEED DATA E-PILKETOS SMP NEGERI 1 TEMBARAK
-- TAHUN PELAJARAN 2026/2027
-- Target Engine: MariaDB / MySQL 5.7+ / 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`epilketos_tembarak\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`epilketos_tembarak\`;

CREATE TABLE IF NOT EXISTS \`classes\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`class_name\` VARCHAR(20) NOT NULL UNIQUE,
  \`grade\` TINYINT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`elections\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`election_name\` VARCHAR(150) NOT NULL,
  \`academic_year\` VARCHAR(20) NOT NULL,
  \`start_time\` DATETIME NOT NULL,
  \`end_time\` DATETIME NOT NULL,
  \`status\` ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`candidates\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`candidate_number\` TINYINT UNSIGNED NOT NULL UNIQUE,
  \`chairman_name\` VARCHAR(100) NOT NULL,
  \`vice_chairman_name\` VARCHAR(100) NOT NULL,
  \`chairman_photo\` VARCHAR(255) NOT NULL,
  \`vice_chairman_photo\` VARCHAR(255) DEFAULT NULL,
  \`tagline\` VARCHAR(255) DEFAULT NULL,
  \`vision\` TEXT NOT NULL,
  \`mission\` JSON NOT NULL,
  \`programs\` JSON NOT NULL,
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`voters\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`nisn\` VARCHAR(20) NOT NULL UNIQUE,
  \`name\` VARCHAR(120) NOT NULL,
  \`class_id\` VARCHAR(64) NOT NULL,
  \`class_name\` VARCHAR(50) NOT NULL,
  \`pin\` VARCHAR(255) NOT NULL,
  \`has_voted\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`voted_at\` DATETIME DEFAULT NULL,
  \`status\` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`votes\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`voter_id\` VARCHAR(64) NOT NULL,
  \`candidate_id\` VARCHAR(64) NOT NULL,
  \`election_id\` VARCHAR(64) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_voter_election\` (\`voter_id\`, \`election_id\`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`audit_logs\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`user_id\` VARCHAR(50) NOT NULL,
  \`user_name\` VARCHAR(100),
  \`action\` VARCHAR(50) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`ip_address\` VARCHAR(45) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;

  const phpSnippet = `<?php
/**
 * Contoh Koneksi Database PDO (config/database.php)
 * Menggunakan Prepared Statements untuk keamanan penuh dari SQL Injection
 */

declare(strict_types=1);

$host = '127.0.0.1';
$db   = 'epilketos_tembarak';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\\PDOException $e) {
    throw new \\PDOException($e->getMessage(), (int)$e->getCode());
}
`;

  const deployGuide = `# PANDUAN DEPLOYMENT KE SUPABASE ATAU WEB HOSTING SEKOLAH

1. DEPLOYMENT SUPABASE (SANGAT DIREKOMENDASIKAN):
   - Masuk ke dashboard Supabase: https://supabase.com/dashboard
   - Buka proyek Supabase Anda -> Klik menu "SQL Editor"
   - Tempel skema dari tab "⚡ Supabase (PostgreSQL + RLS)"
   - Klik "Run" (atau Ctrl + Enter)
   - Seluruh tabel & kebijakan RLS otomatis aktif. Sinkronisasi antar perangkat langsung berjalan 100% real-time!

2. HOSTING CPANEL / MYSQL TRADISIONAL:
   - Buat database MySQL di cPanel phpMyAdmin.
   - Import file "database.sql".
   - Konfigurasi kredensial koneksi di PHP.
`;

  const copyToClipboard = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Arsitektur Database &amp; Sinkronisasi Supabase</h3>
              <p className="text-xs text-slate-300">
                Skema SQL PostgreSQL + Kebijakan RLS (Row Level Security) untuk akses anon &amp; real-time
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1 shrink-0 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'supabase' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ Supabase PostgreSQL + RLS</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sql' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL / MariaDB</span>
          </button>

          <button
            onClick={() => setActiveTab('php')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'php' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>PHP 8+ PDO</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'deploy' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Panduan Deployment</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-4 flex-1 font-mono text-xs">
          {activeTab === 'supabase' && (
            <div className="space-y-3 font-sans">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">Petunjuk Cepat 1-Menit di Supabase:</p>
                  <p className="text-xs text-blue-800 mt-0.5">
                    1. Salin skrip di bawah &rarr; 2. Buka Supabase SQL Editor &rarr; 3. Klik "New Query" &rarr; 4. Tempel &amp; Klik <strong>Run</strong>.
                  </p>
                </div>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka Supabase</span>
                </a>
              </div>

              <div className="flex items-center justify-between no-print">
                <span className="text-slate-500 font-sans text-xs">
                  Skrip PostgreSQL lengkap dengan RLS Policies untuk role <code>anon</code> dan <code>authenticated</code>.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(supabaseSchema, 'supabase')}
                    className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1"
                  >
                    {copiedTab === 'supabase' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTab === 'supabase' ? 'Tersalin' : 'Salin Skrip Supabase'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('supabase_schema.sql', supabaseSchema)}
                    className="px-3 py-1 text-white bg-blue-900 hover:bg-blue-800 rounded text-xs font-sans font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download supabase_schema.sql</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
                {supabaseSchema}
              </pre>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between no-print">
                <span className="text-slate-500 font-sans text-xs">
                  File SQL MariaDB/MySQL lengkap untuk hosting sekolah cPanel/phpMyAdmin.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(sqlSchema, 'sql')}
                    className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1"
                  >
                    {copiedTab === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTab === 'sql' ? 'Tersalin' : 'Salin SQL'}</span>
                  </button>
                  <button
                    onClick={() => downloadFile('database.sql', sqlSchema)}
                    className="px-3 py-1 text-white bg-blue-900 hover:bg-blue-800 rounded text-xs font-sans font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download database.sql</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'php' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans text-xs">
                  Implementasi transaksi aman anti-double-voting dengan PDO Prepared Statements.
                </span>
                <button
                  onClick={() => copyToClipboard(phpSnippet, 'php')}
                  className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1 font-sans"
                >
                  {copiedTab === 'php' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'php' ? 'Tersalin' : 'Salin Kode PHP'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-300 rounded-xl overflow-x-auto text-[11px] leading-relaxed font-mono">
                {phpSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">
                  Petunjuk langkah demi langkah konfigurasi Supabase dan web server.
                </span>
                <button
                  onClick={() => copyToClipboard(deployGuide, 'deploy')}
                  className="px-3 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copiedTab === 'deploy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTab === 'deploy' ? 'Tersalin' : 'Salin Petunjuk'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                {deployGuide}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
