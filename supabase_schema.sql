-- ==============================================================================
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
    status TEXT NOT NULL DEFAULT 'ongoing', -- 'upcoming', 'ongoing', 'completed'
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
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive'
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
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL TABULASI SUARA RAHASIA (VOTES)
-- Jaminan Integritas: Constraint UNIQUE (voter_id, election_id) mencegah 1 siswa memilih dua kali
CREATE TABLE IF NOT EXISTS public.votes (
    id TEXT PRIMARY KEY,
    voter_id TEXT NOT NULL REFERENCES public.voters(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    election_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_voter_election UNIQUE (voter_id, election_id)
);

-- 7. TABEL AUDIT LOG & AKTIVITAS SISTEM (AUDIT_LOGS)
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
-- AKTIFKAN ROW LEVEL SECURITY (RLS) DI SELURUH TABEL
-- ==============================================================================
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- KEBIJAKAN RLS (POLICIES) UNTUK AKSES PUBLIK (ANON) & AUTHENTICATED
-- ==============================================================================

-- 1. Settings Policies
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write settings" ON public.settings;
CREATE POLICY "Public write settings" ON public.settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. Elections Policies
DROP POLICY IF EXISTS "Public read elections" ON public.elections;
CREATE POLICY "Public read elections" ON public.elections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write elections" ON public.elections;
CREATE POLICY "Public write elections" ON public.elections FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Classes Policies
DROP POLICY IF EXISTS "Public read classes" ON public.classes;
CREATE POLICY "Public read classes" ON public.classes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write classes" ON public.classes;
CREATE POLICY "Public write classes" ON public.classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. Candidates Policies
DROP POLICY IF EXISTS "Public read candidates" ON public.candidates;
CREATE POLICY "Public read candidates" ON public.candidates FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write candidates" ON public.candidates;
CREATE POLICY "Public write candidates" ON public.candidates FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Voters Policies
DROP POLICY IF EXISTS "Public read voters" ON public.voters;
CREATE POLICY "Public read voters" ON public.voters FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public write voters" ON public.voters;
CREATE POLICY "Public write voters" ON public.voters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. Votes Policies (Insert & Read untuk Tabulasi & Berita Acara)
DROP POLICY IF EXISTS "Public read votes" ON public.votes;
CREATE POLICY "Public read votes" ON public.votes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public insert votes" ON public.votes;
CREATE POLICY "Public insert votes" ON public.votes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Public delete votes" ON public.votes;
CREATE POLICY "Public delete votes" ON public.votes FOR DELETE TO anon, authenticated USING (true);

-- 7. Audit Logs Policies
DROP POLICY IF EXISTS "Public read audit_logs" ON public.audit_logs;
CREATE POLICY "Public read audit_logs" ON public.audit_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public insert audit_logs" ON public.audit_logs;
CREATE POLICY "Public insert audit_logs" ON public.audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ==============================================================================
-- DATA AWAL RESMI (SEED DATA DEFAULT)
-- ==============================================================================

-- Pengaturan Sekolah
INSERT INTO public.settings (
    id, school_name, sub_title, address, village, district, regency, province,
    postal_code, academic_year, election_name, slogan, committee_contact,
    committee_phone, committee_chair, committee_secretary, osis_supervisor, principal, principal_nip
) VALUES (
    'config', 'SMP NEGERI 1 TEMBARAK', 'KABUPATEN TEMANGGUNG', 'Jalan Raya Tembarak, Desa Tembarak',
    'Tembarak', 'Kecamatan Tembarak', 'Kabupaten Temanggung', 'Jawa Tengah', '56261', '2026/2027',
    'Pemilihan Ketua dan Wakil Ketua OSIS', 'Suaramu Menentukan Masa Depan OSIS',
    'Sekretariat Panitia Pilketos (Ruang OSIS SMPN 1 Tembarak)', '0822-2756-3245',
    'Budi Santoso, S.Pd.', 'Rina Wijayanti, S.Pd.', 'Drs. H. Sugeng Supriyanto',
    'Dra. Hj. Sri Wahyuni, M.Pd.', '19710514 199702 2 001'
) ON CONFLICT (id) DO NOTHING;

-- Periode Pemilihan Aktif 2026/2027
INSERT INTO public.elections (
    id, election_name, academic_year, start_time, end_time, status
) VALUES (
    'active', 'Pemilihan Ketua dan Wakil Ketua OSIS Periode 2026/2027', '2026/2027',
    '2026-10-27 00:00:00+07', '2026-10-27 23:59:59+07', 'ongoing'
) ON CONFLICT (id) DO NOTHING;

-- Master 18 Kelas (7A-7F, 8A-8F, 9A-9F)
INSERT INTO public.classes (id, class_name, grade) VALUES
    ('cls-7a', '7A', 7), ('cls-7b', '7B', 7), ('cls-7c', '7C', 7),
    ('cls-7d', '7D', 7), ('cls-7e', '7E', 7), ('cls-7f', '7F', 7),
    ('cls-8a', '8A', 8), ('cls-8b', '8B', 8), ('cls-8c', '8C', 8),
    ('cls-8d', '8D', 8), ('cls-8e', '8E', 8), ('cls-8f', '8F', 8),
    ('cls-9a', '9A', 9), ('cls-9b', '9B', 9), ('cls-9c', '9C', 9),
    ('cls-9d', '9D', 9), ('cls-9e', '9E', 9), ('cls-9f', '9F', 9)
ON CONFLICT (id) DO NOTHING;

-- 3 Pasangan Calon Resmi OSIS
INSERT INTO public.candidates (
    id, candidate_number, chairman_name, vice_chairman_name, chairman_photo, tagline, vision, mission, programs, status
) VALUES
(
    'cand-01',
    1,
    'Ahmad Fauzi Nurcahyo',
    'Siti Rahmawati Putri',
    '/src/assets/images/paslon1_tembarak_1790867295706.jpg',
    'Berkarakter, Berprestasi, dan Berbudaya Lingkungan',
    'Mewujudkan OSIS SMP Negeri 1 Tembarak sebagai wadah aspirasi siswa yang berakhlak mulia, unggul dalam prestasi akademik maupun non-akademik, serta peduli terhadap kelestarian lingkungan sekolah.',
    '["Menumbuhkan nilai religius dan budi pekerti luhur melalui pembiasaan ibadah bersama dan peringatan hari besar keagamaan.","Mendukung program literasi, sains club, dan ekstrakurikuler sekolah untuk mencetak siswa berprestasi di tingkat kabupaten maupun provinsi.","Menggalakkan gerakan Sekolah Adiwiyata: pilah sampah organik-anorganik, penghijauan taman kelas, dan program Spensatem Bersih Bersemi.","Membangun komunikasi dua arah antara pengurus OSIS, perwakilan kelas, dan pihak dewan guru secara terbuka."]'::jsonb,
    '["Spensatem Islamic & Character Festival (SICF)","Green Campus & Bersih Kelasku Tiap Jumat Pagi","Pekan Prestasi & Bimbingan Minat Bakat (P2MB)","Kotak Aspirasi Digital Siswa via Mading Interaktif"]'::jsonb,
    'active'
),
(
    'cand-02',
    2,
    'Dimas Arya Pratama',
    'Annisa Nurul Hidayah',
    '/src/assets/images/paslon2_tembarak_1790867309212.jpg',
    'Kreatif, Kolaboratif, Mengabdi untuk Seluruh Siswa Spensatem',
    'Menjadikan OSIS SMP Negeri 1 Tembarak yang aktif, kreatif, berdaya saing global dengan tetap menjunjung tinggi kearifan lokal Temanggung serta semangat gotong royong.',
    '["Mengembangkan kreativitas seni, sastra, dan budaya lokal khas Temanggung (jaran kepang, tari daerah, dan batik lokal).","Menciptakan iklim belajar yang menyenangkan melalui program tutor sebaya antarkelas.","Meningkatkan jiwa kepemimpinan pengurus kelas melalui Latihan Dasar Kepemimpinan Siswa (LDKS) yang inovatif.","Mengoptimalkan pemanfaatan media digital sekolah yang santun, edukatif, dan positif."]'::jsonb,
    '["Spensatem Youth Cultural Festival (Pentas Seni Budaya Lokal)","Program Teman Belajar (Peer Tutoring & Diskusi Asyik)","Liga Olahraga & E-Sports Persahabatan Antarkelas","Buletin OSIS Berkala & Podcast Inspirasi Remaja"]'::jsonb,
    'active'
),
(
    'cand-03',
    3,
    'Muhammad Rizky Ramadhan',
    'Zahra Amalia Putri',
    '/src/assets/images/paslon3_tembarak_1790867319879.jpg',
    'OSIS Aspiratif: Wadah Kreasi, Prestasi, dan Teknologi Siswa',
    'Mewujudkan organisasi kesiswaan yang inklusif, adaptif terhadap teknologi digital, serta mendorong siswa SMP Negeri 1 Tembarak menjadi pribadi yang disiplin, mandiri, dan berwawasan luas.',
    '["Menghidupkan peran mading sekolah baik fisik maupun digital sebagai pusat informasi inspiratif siswa.","Mengadakan pelatihan keterampilan praktis (desain grafis dasar, public speaking, dan jurnalistik muda).","Mempererat persaudaraan antarsiswa tanpa membeda-bedakan latar belakang, serta kampanye anti-bullying dan anti-perundungan.","Bekerjasama dengan UKS dan PMR sekolah untuk mewujudkan pola hidup bersih dan sehat bagi seluruh warga sekolah."]'::jsonb,
    '["Spensatem Digital Workshop: Konten Positif & Public Speaking","Gerakan Senyum Sapa Salam & Duta Anti-Bullying Spensatem","Bulan Bahasa & Spensatem Book Review Competition","Donor Buku & Pojok Baca Nyaman di Tiap Lorong Kelas"]'::jsonb,
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Catatan Log Perdana
INSERT INTO public.audit_logs (
    id, user_id, user_name, action, description, ip_address
) VALUES (
    'log-init-01', 'admin', 'Administrator Panitia', 'DATABASE_INIT',
    'Inisialisasi skema database Supabase PostgreSQL & RLS E-Pilketos SMPN 1 Tembarak berhasil.',
    '127.0.0.1'
) ON CONFLICT (id) DO NOTHING;
