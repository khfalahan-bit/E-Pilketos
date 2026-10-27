import React, { useState, useEffect } from 'react';
import { db, CloudSyncInfo } from './services/db';
import { supabase } from './services/supabase';
import { Candidate, Election, SchoolSettings, Voter } from './types';
import { AlertCircle, Database, RefreshCw, Zap, Shield } from 'lucide-react';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentLoginModal } from './components/StudentLoginModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { VoteConfirmModal } from './components/VoteConfirmModal';
import { VoteSuccessModal } from './components/VoteSuccessModal';

// Admin Components
import { AdminGuard } from './components/admin/AdminGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { VoterManagement } from './components/admin/VoterManagement';
import { ClassManagement } from './components/admin/ClassManagement';
import { CandidateManagement } from './components/admin/CandidateManagement';
import { VoteResults } from './components/admin/VoteResults';
import { ImportVoters } from './components/admin/ImportVoters';
import { BeritaAcara } from './components/admin/BeritaAcara';
import { AuditLogView } from './components/admin/AuditLogView';
import { SettingsView } from './components/admin/SettingsView';
import { SqlExportModal } from './components/admin/SqlExportModal';

export default function App() {
  const [dataVersion, setDataVersion] = useState(0);

  // 1. Loading & Cloud Sync Lifecycle
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cloudSyncInfo, setCloudSyncInfo] = useState<CloudSyncInfo | null>(null);

  // 2. Admin Auth State with Persistent Session Verification
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isViewingPublicSite, setIsViewingPublicSite] = useState<boolean>(() => {
    try {
      return localStorage.getItem('epilketos_view_mode') === 'public';
    } catch {
      return false;
    }
  });

  // Core Data
  const [settings, setSettings] = useState<SchoolSettings>(db.getSettings());
  const [election, setElection] = useState<Election>(db.getElection());
  const [candidates, setCandidates] = useState<Candidate[]>(db.getCandidates());

  // Student Auth State
  const [currentStudent, setCurrentStudent] = useState<Voter | null>(null);

  // Navigation State
  const [activeSection, setActiveSection] = useState<string>('home');
  const [adminTab, setAdminTabState] = useState<string>(() => {
    try {
      return localStorage.getItem('epilketos_admin_tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const setAdminTab = (tab: string) => {
    try {
      localStorage.setItem('epilketos_admin_tab', tab);
    } catch {}
    setAdminTabState(tab);
  };

  // Modals
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [selectedCandidateForDetail, setSelectedCandidateForDetail] = useState<Candidate | null>(null);
  const [candidateToVote, setCandidateToVote] = useState<Candidate | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteSuccessData, setVoteSuccessData] = useState<{ votedAt: string; digitalToken: string } | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);

  // Sync state whenever dataVersion changes
  const refreshData = () => {
    setDataVersion((v) => v + 1);
    setSettings(db.getSettings());
    setElection(db.getElection());
    setCandidates(db.getCandidates());

    // If student is logged in, refresh their voter record
    if (currentStudent) {
      const freshRecord = db.getVoterById(currentStudent.id);
      if (freshRecord) {
        setCurrentStudent(freshRecord);
      }
    }
  };

  // SINKRONISASI PEMBACAAN SESI ADMIN (Supabase Auth & Persistent Local Session)
  useEffect(() => {
    let isMounted = true;

    async function checkAdminSession() {
      setIsAuthChecking(true);
      try {
        // 1. Cek sesi Supabase Auth
        const { data: authData, error: authErr } = await supabase.auth.getSession();
        if (authData?.session && !authErr) {
          if (isMounted) {
            setIsAdminLoggedIn(true);
            setAdminUser(authData.session.user);
            const viewMode = localStorage.getItem('epilketos_view_mode');
            setIsViewingPublicSite(viewMode === 'public');
          }
          return;
        }

        // 2. Cek token sesi admin persisten di localStorage
        const storedSession = localStorage.getItem('epilketos_admin_session');
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            if (parsed && parsed.token && (parsed.role === 'admin' || parsed.username === 'admin')) {
              if (isMounted) {
                setIsAdminLoggedIn(true);
                setAdminUser(parsed);
                const viewMode = localStorage.getItem('epilketos_view_mode');
                setIsViewingPublicSite(viewMode === 'public');
              }
              return;
            }
          } catch (e) {
            console.warn('Gagal membaca token sesi admin:', e);
          }
        }

        // 3. Jika sesi kosong / tidak valid
        if (isMounted) {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
          setIsViewingPublicSite(false);
        }
      } catch (err) {
        console.warn('Pengecekan sesi admin mengalami galat:', err);
        if (isMounted) {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    }

    checkAdminSession();

    // 4. Pasang listener Supabase onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (session) {
        setIsAdminLoggedIn(true);
        setAdminUser(session.user);
        setIsAuthChecking(false);
      } else if (event === 'SIGNED_OUT') {
        const hasLocal = localStorage.getItem('epilketos_admin_session');
        if (!hasLocal) {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // INITIAL DATA LOAD: Fetch directly from Supabase
  useEffect(() => {
    let isMounted = true;

    async function bootstrapFromSupabase() {
      setIsInitialLoading(true);
      const syncResult = await db.loadFromSupabase();
      if (isMounted) {
        setCloudSyncInfo(syncResult);
        setSettings(db.getSettings());
        setElection(db.getElection());
        setCandidates(db.getCandidates());
        setIsInitialLoading(false);
      }
    }

    bootstrapFromSupabase();

    // Realtime postgres changes listener
    const unsubscribe = db.subscribeToChanges(() => {
      if (isMounted) {
        refreshData();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleStudentLoginSuccess = (voter: Voter) => {
    setCurrentStudent(voter);
    setActiveSection('portal');
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setActiveSection('home');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsViewingPublicSite(false);
    try {
      localStorage.setItem('epilketos_view_mode', 'admin');
    } catch {}
  };

  const handleAdminLogout = async () => {
    try {
      localStorage.removeItem('epilketos_admin_session');
      localStorage.removeItem('epilketos_view_mode');
      localStorage.removeItem('epilketos_admin_tab');
    } catch {}
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setIsViewingPublicSite(false);

    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }

    await db.addAuditLog('admin', 'LOGOUT_ADMIN', 'Administrator telah keluar dari sesi panel panitia.');
  };

  const handleOpenPublicSite = () => {
    setIsViewingPublicSite(true);
    try {
      localStorage.setItem('epilketos_view_mode', 'public');
    } catch {}
  };

  const handleReturnToAdminPanel = () => {
    setIsViewingPublicSite(false);
    try {
      localStorage.setItem('epilketos_view_mode', 'admin');
    } catch {}
  };

  // Voting Flow
  const handleRequestVote = (candidate: Candidate) => {
    if (currentStudent?.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      return;
    }
    setCandidateToVote(candidate);
  };

  const handleConfirmVote = async () => {
    if (!currentStudent || !candidateToVote || isSubmittingVote) return;

    // Strict validation: Re-query database to ensure single vote integrity
    const freshRecord = db.getVoterById(currentStudent.id);
    if (!freshRecord || freshRecord.hasVoted) {
      alert('Hak suara Anda telah digunakan dan tidak dapat memilih kembali.');
      setCandidateToVote(null);
      refreshData();
      return;
    }

    setIsSubmittingVote(true);
    try {
      const result = await db.castVote(currentStudent.id, candidateToVote.id);
      setIsSubmittingVote(false);

      if (result.success) {
        setCandidateToVote(null);
        setVoteSuccessData({
          votedAt: result.votedAt || new Date().toISOString(),
          digitalToken: result.digitalToken || 'SPENSA-SUCCESS',
        });
        refreshData();
      } else {
        alert(result.message);
        setCandidateToVote(null);
        refreshData();
      }
    } catch (e: any) {
      setIsSubmittingVote(false);
      alert('Terjadi kesalahan saat memproses suara: ' + (e?.message || 'Koneksi terputus'));
      setCandidateToVote(null);
      refreshData();
    }
  };

  const handleFinishVoteSuccess = () => {
    setVoteSuccessData(null);
    handleStudentLogout();
  };

  // Loading Screen: Melindungi halaman saat pengecekan auth atau inisialisasi awal database
  if (isAuthChecking || isInitialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 selection:bg-amber-400 selection:text-blue-950">
        <div className="flex flex-col items-center gap-5 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-2xl shadow-xl shadow-amber-400/20 animate-pulse">
            <Zap className="w-8 h-8 fill-blue-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">E-Pilketos SMPN 1 Tembarak</h2>
            <p className="text-xs text-blue-200 mt-1">
              {isAuthChecking ? 'Memeriksa & Memulihkan Sesi Login Admin...' : 'Mengambil Data Langsung dari Server Supabase...'}
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-blue-500 rounded-full animate-pulse w-3/4"></div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
            <span>{isAuthChecking ? 'Sinkronisasi otentikasi admin...' : 'Memvalidasi tabel & izin akses...'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Tentukan apakah menampilkan Admin Portal:
  // Admin harus terotentikasi (isAdminLoggedIn) dan tidak sedang dalam mode preview siswa
  const shouldShowAdminPortal = isAdminLoggedIn && !isViewingPublicSite;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-900 selection:text-amber-300">
      {/* Top Banner if Supabase tables are missing */}
      {cloudSyncInfo && !cloudSyncInfo.tablesReady && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              <strong>Perhatian Panitia:</strong> Skema database Supabase belum terpasang di proyek Supabase Anda. Aplikasi berjalan dengan penyimpanan lokal darurat.
            </span>
          </div>
          <button
            onClick={() => setIsSqlModalOpen(true)}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            Lihat Skrip SQL Supabase &amp; RLS
          </button>
        </div>
      )}

      {/* Admin Portal Protected Route dengan AdminGuard */}
      {shouldShowAdminPortal ? (
        <AdminGuard
          isAuthChecking={isAuthChecking}
          isAdminLoggedIn={isAdminLoggedIn}
          onUnauthorizedRedirect={() => setIsViewingPublicSite(true)}
        >
          <AdminLayout
            currentTab={adminTab}
            setCurrentTab={setAdminTab}
            onLogout={handleAdminLogout}
            onOpenPublicSite={handleOpenPublicSite}
            settings={settings}
          >
            {adminTab === 'dashboard' && (
              <AdminDashboard
                settings={settings}
                election={election}
                onRefreshData={refreshData}
                onNavigateTab={(tab) => setAdminTab(tab)}
              />
            )}

            {adminTab === 'voters' && (
              <VoterManagement onRefreshData={refreshData} />
            )}

            {adminTab === 'classes' && (
              <ClassManagement onRefreshData={refreshData} />
            )}

            {adminTab === 'candidates' && (
              <CandidateManagement
                onRefreshData={refreshData}
                onPreviewCandidate={(cand) => setSelectedCandidateForDetail(cand)}
              />
            )}

            {adminTab === 'results' && (
              <VoteResults
                settings={settings}
                onOpenBeritaAcara={() => setAdminTab('berita-acara')}
              />
            )}

            {adminTab === 'import' && (
              <ImportVoters onRefreshData={refreshData} />
            )}

            {adminTab === 'berita-acara' && (
              <BeritaAcara
                settings={settings}
                onBack={() => setAdminTab('results')}
              />
            )}

            {adminTab === 'audit-log' && <AuditLogView />}

            {adminTab === 'settings' && (
              <SettingsView
                settings={settings}
                election={election}
                onRefreshData={refreshData}
                onOpenSqlModal={() => setIsSqlModalOpen(true)}
              />
            )}
          </AdminLayout>
        </AdminGuard>
      ) : (
        /* Public & Student Portal */
        <div className="flex-1 flex flex-col">
          <Navbar
            currentStudent={currentStudent}
            isAdmin={isAdminLoggedIn}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onStudentLogout={handleStudentLogout}
            onAdminLogout={handleAdminLogout}
            onOpenAdminPanel={handleReturnToAdminPanel}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isElectionOngoing={election.status === 'ongoing'}
          />

          <main className="flex-1">
            {currentStudent ? (
              <StudentDashboard
                currentStudent={currentStudent}
                election={election}
                candidates={candidates}
                onOpenCandidateDetail={(cand) => setSelectedCandidateForDetail(cand)}
                onRequestVote={handleRequestVote}
                onLogout={handleStudentLogout}
              />
            ) : (
              <LandingPage
                settings={settings}
                election={election}
                candidates={candidates}
                onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
                onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
                onOpenCandidateDetail={(cand) => setSelectedCandidateForDetail(cand)}
              />
            )}
          </main>

          <Footer
            settings={settings}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />
        </div>
      )}

      {/* MODALS */}
      {/* 1. Student Login Modal */}
      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        onLoginSuccess={handleStudentLoginSuccess}
      />

      {/* 2. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 3. Candidate Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidateForDetail}
        onClose={() => setSelectedCandidateForDetail(null)}
        onSelectCandidate={(cand) => handleRequestVote(cand)}
        currentStudent={currentStudent}
        isElectionOngoing={election.status === 'ongoing'}
      />

      {/* 4. Vote Confirm Modal */}
      <VoteConfirmModal
        candidate={candidateToVote}
        onCancel={() => setCandidateToVote(null)}
        onConfirm={handleConfirmVote}
        isSubmitting={isSubmittingVote}
      />

      {/* 5. Vote Success Modal */}
      {voteSuccessData && (
        <VoteSuccessModal
          votedAt={voteSuccessData.votedAt}
          digitalToken={voteSuccessData.digitalToken}
          onFinish={handleFinishVoteSuccess}
          schoolName={settings.schoolName}
        />
      )}

      {/* 6. SQL & PHP Deployment Modal */}
      <SqlExportModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />
    </div>
  );
}
