import { useState, useEffect } from 'react';
import type { Dog, DogUpdate, Sponsorship } from './types';
import { mockDogs, mockSponsorships, mockUpdates } from './services/mockData';
import { Header } from './components/Header';
import { DogCard } from './components/DogCard';
import { DogDetailModal } from './components/DogDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OBEALanding } from './components/OBEALanding';
import { Heart, Search, Users, Sparkles } from 'lucide-react';
import { supabase } from './services/supabaseClient';

function App() {
  const [dogs, setDogs] = useState<Dog[]>(supabase ? [] : mockDogs);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>(supabase ? [] : mockSponsorships);
  const [updates, setUpdates] = useState<DogUpdate[]>(supabase ? [] : mockUpdates);
  const [publicSponsors, setPublicSponsors] = useState<{ dogId: string; sponsorName: string }[]>([]);
  
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'admin'>('home');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_sponsor' | 'partially_sponsored' | 'fully_sponsored'>('all');

  // Fetch Public Sponsor Names
  useEffect(() => {
    const fetchPublicSponsors = async () => {
      if (!supabase) {
        const active = mockSponsorships
          .filter(s => s.status === 'active')
          .map(s => ({ dogId: s.dogId, sponsorName: s.sponsorName }));
        setPublicSponsors(active);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('public_sponsors')
          .select('*');
        if (!error && data) {
          setPublicSponsors(data.map(d => ({ dogId: d.dog_id, sponsorName: d.sponsor_name })));
        }
      } catch (err) {
        console.error('Error fetching public sponsors:', err);
      }
    };

    fetchPublicSponsors();
  }, [sponsorships]);

  // Fetch Dogs and Updates on Mount
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      
      try {
        const { data: dogsData, error: dogsError } = await supabase
          .from('dogs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!dogsError && dogsData) {
          const mappedDogs: Dog[] = dogsData.map(d => ({
            id: d.id,
            name: d.name,
            description: d.description,
            breed: d.breed,
            age: d.age,
            gender: d.gender,
            status: d.status,
            targetMonthlySponsorship: d.target_monthly_sponsorship,
            currentMonthlySponsorship: d.current_monthly_sponsorship,
            mainImageUrl: d.main_image_url,
            medicalNeeds: d.medical_needs || undefined,
            createdAt: d.created_at
          }));
          setDogs(mappedDogs);
        }

        const { data: updatesData, error: updatesError } = await supabase
          .from('updates')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!updatesError && updatesData) {
          const mappedUpdates: DogUpdate[] = updatesData.map(u => ({
            id: u.id,
            dogId: u.dog_id,
            title: u.title,
            content: u.content,
            imageUrl: u.image_url || undefined,
            createdAt: u.created_at
          }));
          setUpdates(mappedUpdates);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      }
    };

    fetchData();
  }, []);

  // Fetch Sponsorships when in admin dashboard
  useEffect(() => {
    const fetchSponsorships = async () => {
      if (!supabase || currentView !== 'admin') return;
      
      try {
        const { data, error } = await supabase
          .from('sponsorships')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          const mappedSpons: Sponsorship[] = data.map(s => ({
            id: s.id,
            dogId: s.dog_id,
            sponsorName: s.sponsor_name,
            sponsorEmail: s.sponsor_email,
            monthlyAmount: s.monthly_amount,
            status: s.status,
            startDate: s.start_date,
            createdAt: s.created_at
          }));
          setSponsorships(mappedSpons);
        }
      } catch (err) {
        console.error('Error fetching sponsorships:', err);
      }
    };

    fetchSponsorships();
  }, [currentView]);

  // Handlers for App state
  const handleAddSponsorship = async (newSpons: Omit<Sponsorship, 'id' | 'createdAt' | 'status' | 'startDate'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('sponsorships')
          .insert([{
            dog_id: newSpons.dogId,
            sponsor_name: newSpons.sponsorName,
            sponsor_email: newSpons.sponsorEmail,
            monthly_amount: newSpons.monthlyAmount,
            status: 'pending'
          }])
          .select();

        if (!error && data && data[0]) {
          const s = data[0];
          const mapped: Sponsorship = {
            id: s.id,
            dogId: s.dog_id,
            sponsorName: s.sponsor_name,
            sponsorEmail: s.sponsor_email,
            monthlyAmount: s.monthly_amount,
            status: s.status,
            startDate: s.start_date,
            createdAt: s.created_at
          };
          setSponsorships(prev => [mapped, ...prev]);
        } else if (error) {
          console.error('Error inserting sponsorship:', error);
        }
      } catch (err) {
        console.error('Sponsorship insert exception:', err);
      }
    } else {
      const sponsorship: Sponsorship = {
        ...newSpons,
        id: `spons-${Date.now()}`,
        status: 'pending',
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setSponsorships((prev) => [sponsorship, ...prev]);
    }
  };

  const handleApproveSponsorship = async (id: string) => {
    if (supabase) {
      try {
        const spons = sponsorships.find(s => s.id === id);
        if (!spons || spons.status !== 'pending') return;

        // 1. Update sponsorship status
        const { error: sponsError } = await supabase
          .from('sponsorships')
          .update({ status: 'active' })
          .eq('id', id);

        if (sponsError) {
          console.error('Error updating sponsorship:', sponsError);
          return;
        }

        // 2. Find dog to compute new values
        const dog = dogs.find(d => d.id === spons.dogId);
        if (!dog) return;

        const newFunding = dog.currentMonthlySponsorship + spons.monthlyAmount;
        const newStatus = newFunding >= dog.targetMonthlySponsorship ? 'fully_sponsored' : 'partially_sponsored';

        // 3. Update dog funding in DB
        const { error: dogError } = await supabase
          .from('dogs')
          .update({
            current_monthly_sponsorship: newFunding,
            status: newStatus
          })
          .eq('id', dog.id);

        if (!dogError) {
          setSponsorships(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
          setDogs(prev => prev.map(d => d.id === dog.id ? { ...d, currentMonthlySponsorship: newFunding, status: newStatus } : d));
        } else {
          console.error('Error updating dog funding:', dogError);
        }
      } catch (err) {
        console.error('Approval exception:', err);
      }
    } else {
      setSponsorships((prevSpons) =>
        prevSpons.map((spons) => {
          if (spons.id === id && spons.status === 'pending') {
            setDogs((prevDogs) =>
              prevDogs.map((dog) => {
                if (dog.id === spons.dogId) {
                  const newFunding = dog.currentMonthlySponsorship + spons.monthlyAmount;
                  const newStatus = newFunding >= dog.targetMonthlySponsorship ? 'fully_sponsored' : 'partially_sponsored';
                  return { ...dog, currentMonthlySponsorship: newFunding, status: newStatus };
                }
                return dog;
              })
            );
            return { ...spons, status: 'active' };
          }
          return spons;
        })
      );
    }
  };

  const handleCancelSponsorship = async (id: string) => {
    if (supabase) {
      try {
        const spons = sponsorships.find(s => s.id === id);
        if (!spons) return;

        // 1. Update sponsorship status
        const { error: sponsError } = await supabase
          .from('sponsorships')
          .update({ status: 'cancelled' })
          .eq('id', id);

        if (sponsError) {
          console.error('Error cancelling sponsorship:', sponsError);
          return;
        }

        // 2. If it was active, subtract from dog funding
        if (spons.status === 'active') {
          const dog = dogs.find(d => d.id === spons.dogId);
          if (!dog) return;

          const newFunding = Math.max(0, dog.currentMonthlySponsorship - spons.monthlyAmount);
          const newStatus =
            newFunding >= dog.targetMonthlySponsorship
              ? 'fully_sponsored'
              : newFunding > 0
              ? 'partially_sponsored'
              : 'needs_sponsor';

          const { error: dogError } = await supabase
            .from('dogs')
            .update({
              current_monthly_sponsorship: newFunding,
              status: newStatus
            })
            .eq('id', dog.id);

          if (!dogError) {
            setDogs(prev => prev.map(d => d.id === dog.id ? { ...d, currentMonthlySponsorship: newFunding, status: newStatus } : d));
          } else {
            console.error('Error updating dog after cancel:', dogError);
          }
        }
        setSponsorships(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
      } catch (err) {
        console.error('Cancel exception:', err);
      }
    } else {
      setSponsorships((prevSpons) =>
        prevSpons.map((spons) => {
          if (spons.id === id && spons.status === 'active') {
            setDogs((prevDogs) =>
              prevDogs.map((dog) => {
                if (dog.id === spons.dogId) {
                  const newFunding = Math.max(0, dog.currentMonthlySponsorship - spons.monthlyAmount);
                  const newStatus =
                    newFunding >= dog.targetMonthlySponsorship
                      ? 'fully_sponsored'
                      : newFunding > 0
                      ? 'partially_sponsored'
                      : 'needs_sponsor';
                  return { ...dog, currentMonthlySponsorship: newFunding, status: newStatus };
                }
                return dog;
              })
            );
            return { ...spons, status: 'cancelled' };
          } else if (spons.id === id && spons.status === 'pending') {
            return { ...spons, status: 'cancelled' };
          }
          return spons;
        })
      );
    }
  };

  const handleAddDog = async (newDog: Omit<Dog, 'id' | 'createdAt' | 'currentMonthlySponsorship' | 'status'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('dogs')
          .insert([{
            name: newDog.name,
            breed: newDog.breed,
            age: newDog.age,
            gender: newDog.gender,
            description: newDog.description,
            medical_needs: newDog.medicalNeeds || null,
            target_monthly_sponsorship: newDog.targetMonthlySponsorship,
            main_image_url: newDog.mainImageUrl
          }])
          .select();

        if (!error && data && data[0]) {
          const d = data[0];
          const mapped: Dog = {
            id: d.id,
            name: d.name,
            description: d.description,
            breed: d.breed,
            age: d.age,
            gender: d.gender,
            status: d.status,
            targetMonthlySponsorship: d.target_monthly_sponsorship,
            currentMonthlySponsorship: d.current_monthly_sponsorship,
            mainImageUrl: d.main_image_url,
            medicalNeeds: d.medical_needs || undefined,
            createdAt: d.created_at
          };
          setDogs(prev => [mapped, ...prev]);
        } else if (error) {
          console.error('Error inserting dog:', error);
        }
      } catch (err) {
        console.error('Dog insert exception:', err);
      }
    } else {
      const dog: Dog = {
        ...newDog,
        id: `dog-${Date.now()}`,
        currentMonthlySponsorship: 0,
        status: 'needs_sponsor',
        createdAt: new Date().toISOString(),
      };
      setDogs((prev) => [dog, ...prev]);
    }
  };

  const handleEditDog = async (updatedDog: Dog) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('dogs')
          .update({
            name: updatedDog.name,
            breed: updatedDog.breed,
            age: updatedDog.age,
            gender: updatedDog.gender,
            description: updatedDog.description,
            medical_needs: updatedDog.medicalNeeds || null,
            target_monthly_sponsorship: updatedDog.targetMonthlySponsorship,
            main_image_url: updatedDog.mainImageUrl
          })
          .eq('id', updatedDog.id);

        if (!error) {
          setDogs(prev => prev.map((d) => (d.id === updatedDog.id ? updatedDog : d)));
        } else {
          console.error('Error updating dog:', error);
        }
      } catch (err) {
        console.error('Dog update exception:', err);
      }
    } else {
      setDogs((prev) => prev.map((d) => (d.id === updatedDog.id ? updatedDog : d)));
    }
  };

  const handleDeleteDog = async (id: string) => {
    if (supabase) {
      try {
        const { error } = await supabase
          .from('dogs')
          .delete()
          .eq('id', id);

        if (!error) {
          setDogs((prev) => prev.filter((d) => d.id !== id));
          setSponsorships((prev) => prev.filter((s) => s.dogId !== id));
          setUpdates((prev) => prev.filter((u) => u.dogId !== id));
        } else {
          console.error('Error deleting dog:', error);
        }
      } catch (err) {
        console.error('Dog delete exception:', err);
      }
    } else {
      setDogs((prev) => prev.filter((d) => d.id !== id));
      setSponsorships((prev) => prev.filter((s) => s.dogId !== id));
      setUpdates((prev) => prev.filter((u) => u.dogId !== id));
    }
  };

  const handleAddUpdate = async (newUpdate: Omit<DogUpdate, 'id' | 'createdAt'>) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('updates')
          .insert([{
            dog_id: newUpdate.dogId,
            title: newUpdate.title,
            content: newUpdate.content,
            image_url: newUpdate.imageUrl || null
          }])
          .select();

        if (!error && data && data[0]) {
          const u = data[0];
          const mapped: DogUpdate = {
            id: u.id,
            dogId: u.dog_id,
            title: u.title,
            content: u.content,
            imageUrl: u.image_url || undefined,
            createdAt: u.created_at
          };
          setUpdates(prev => [mapped, ...prev]);
        } else if (error) {
          console.error('Error inserting update:', error);
        }
      } catch (err) {
        console.error('Update insert exception:', err);
      }
    } else {
      const update: DogUpdate = {
        ...newUpdate,
        id: `update-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setUpdates((prev) => [update, ...prev]);
    }
  };

  // Seed Database with Demo Dogs
  const handleSeedDatabase = async () => {
    if (!supabase) return;
    
    try {
      for (const mockDog of mockDogs) {
        const { data, error } = await supabase
          .from('dogs')
          .insert([{
            name: mockDog.name,
            breed: mockDog.breed,
            age: mockDog.age,
            gender: mockDog.gender,
            description: mockDog.description,
            medical_needs: mockDog.medicalNeeds || null,
            target_monthly_sponsorship: mockDog.targetMonthlySponsorship,
            current_monthly_sponsorship: mockDog.currentMonthlySponsorship,
            main_image_url: mockDog.mainImageUrl
          }])
          .select();

        if (!error && data && data[0]) {
          const dogId = data[0].id;
          
          // Seed updates for this dog
          const dogUpdates = mockUpdates.filter(u => u.dogId === mockDog.id);
          for (const update of dogUpdates) {
            await supabase
              .from('updates')
              .insert([{
                dog_id: dogId,
                title: update.title,
                content: update.content,
                image_url: update.imageUrl || null
              }]);
          }

          // Seed sponsorships for this dog
          const dogSpons = mockSponsorships.filter(s => s.dogId === mockDog.id);
          for (const spons of dogSpons) {
            await supabase
              .from('sponsorships')
              .insert([{
                dog_id: dogId,
                sponsor_name: spons.sponsorName,
                sponsor_email: spons.sponsorEmail,
                monthly_amount: spons.monthlyAmount,
                status: spons.status
              }]);
          }
        }
      }
      
      // Reload page to re-fetch the new records
      window.location.reload();
    } catch (err) {
      console.error('Database seeding exception:', err);
    }
  };

  // Filter dogs list
  const filteredDogs = dogs.filter((dog) => {
    const matchesSearch =
      dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dog.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return dog.status === statusFilter && matchesSearch;
  });

  // Calculate statistics
  const totalDogsCount = dogs.length;
  const activeSponsorsCount = sponsorships.filter((s) => s.status === 'active').length;
  const totalMonthlyFunding = dogs.reduce((sum, d) => sum + d.currentMonthlySponsorship, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between selection:bg-obea-dark/20">
      
      <div>
        <Header currentView={currentView} setCurrentView={setCurrentView} />

        {currentView === 'home' ? (
          <OBEALanding onHelpClick={() => setCurrentView('gallery')} />
        ) : currentView === 'gallery' ? (
          // Visitor Gallery View
          <main className="space-y-16 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-obea-light/10 to-transparent dark:from-zinc-900/30">
              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-obea-light/20 text-obea-dark dark:bg-emerald-950/40 dark:text-emerald-400 border border-obea-light/10">
                  <Sparkles className="h-3.5 w-3.5" />
                  Apadrinhamento de Cães - OBEA
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1] max-w-3xl mx-auto">
                  Pelo conhecimento. Pela consciência. <span style={{ color: '#0E3B2E' }} className="dark:text-emerald-400">Pela responsabilidade.</span>
                </h1>
                <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                  Não há ética humana possível que ignore o sofrimento animal. No Observatório do Bem-Estar Animal (OBEA), acolhemos e protegemos cães com necessidades médicas especiais ou idades avançadas que dificultam a sua adoção. Ao apadrinhar com €10/mês, ajuda a garantir os seus tratamentos e qualidade de vida.
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <a
                    href="#dogs-list"
                    style={{ backgroundColor: '#0E3B2E' }}
                    className="px-6 py-3 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all transform hover:-translate-y-0.5"
                  >
                    Apadrinhar um Cão
                  </a>
                  <a
                    href="#how-it-works"
                    className="px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold rounded-xl transition-all"
                  >
                    Como Funciona
                  </a>
                </div>
              </div>

              {/* Decorative shapes */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-obea-light/5 rounded-full blur-3xl" />
              <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
            </section>

            {/* Impact Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm text-center">
                <div className="space-y-1.5 border-r border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                    {totalDogsCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Cães Protegidos
                  </div>
                </div>
                <div className="space-y-1.5 border-r border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-2xl sm:text-3xl font-black text-obea-light">
                    {activeSponsorsCount}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Padrinhos Ativos
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                    €{totalMonthlyFunding}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Apoio Mensal
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center space-y-2 mb-12">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Como Funciona o Apadrinhamento</h2>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Três passos simples para fazer a diferença</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {/* Step 1 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-3xl space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-obea-light/15 text-obea-dark font-black text-lg">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Escolha o Cão</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Explore a nossa galeria abaixo e conheça os cães do OBEA. Leia as suas histórias e consulte as suas necessidades médicas especiais para escolher o seu afilhado.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-3xl space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-obea-light/15 text-obea-dark font-black text-lg">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Registe o Apoio</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Clique em "Apadrinhar". Introduza os seus dados e configure uma transferência bancária periódica ou por MBWay no valor de €10/mês (ou o valor que desejar).
                  </p>
                </div>
                {/* Step 3 */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-3xl space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-obea-light/15 text-obea-dark font-black text-lg">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Acompanhe a Evolução</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Assim que confirmarmos o seu primeiro apoio, o seu apadrinhamento fica ativo. Receberá relatórios de saúde, exames e o diário de bordo do cão diretamente no site!
                  </p>
                </div>
              </div>
            </section>

            {/* Dogs list & filters */}
            <section id="dogs-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm">
                
                {/* Search */}
                <div className="relative w-full sm:max-w-xs flex items-center bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl overflow-hidden">
                  <Search className="absolute left-3.5 h-4.5 w-4.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou raça..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-sm focus:outline-none text-zinc-800 dark:text-zinc-200 font-medium"
                  />
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {[
                    { key: 'all', label: 'Todos os Cães' },
                    { key: 'needs_sponsor', label: 'Sem Padrinho' },
                    { key: 'partially_sponsored', label: 'Parcial' },
                    { key: 'fully_sponsored', label: 'Apadrinhados' },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setStatusFilter(filter.key as any)}
                      className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        statusFilter === filter.key
                          ? 'bg-obea-dark border-obea-dark text-white shadow-sm'
                          : 'bg-transparent border-zinc-200 hover:bg-zinc-50 text-zinc-600 dark:border-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dogs Gallery */}
              {filteredDogs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl">
                  <Users className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Nenhum cão encontrado</h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                    Tente ajustar os seus filtros ou o termo de pesquisa para encontrar um cão afilhado.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredDogs.map((dog) => (
                    <DogCard 
                      key={dog.id} 
                      dog={dog} 
                      sponsors={publicSponsors.filter(s => s.dogId === dog.id).map(s => s.sponsorName)}
                      onSelect={setSelectedDog} 
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Dog detail modal */}
            {selectedDog && (
              <DogDetailModal
                dog={selectedDog}
                updates={updates.filter((u) => u.dogId === selectedDog.id)}
                sponsors={publicSponsors.filter(s => s.dogId === selectedDog.id).map(s => s.sponsorName)}
                onClose={() => setSelectedDog(null)}
                onAddSponsorship={handleAddSponsorship}
              />
            )}
          </main>
        ) : (
          // Admin Dashboard View
          <main className="pb-20">
            <AdminDashboard
              dogs={dogs}
              sponsorships={sponsorships}
              onAddDog={handleAddDog}
              onEditDog={handleEditDog}
              onDeleteDog={handleDeleteDog}
              onApproveSponsorship={handleApproveSponsorship}
              onCancelSponsorship={handleCancelSponsorship}
              onAddUpdate={handleAddUpdate}
              onSeedDatabase={handleSeedDatabase}
            />
          </main>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg text-white">
              <Heart className="h-4.5 w-4.5 fill-current" />
            </div>
            <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white">
              Padrinhos <span style={{ color: '#0E3B2E' }} className="dark:text-emerald-400">OBEA</span>
            </span>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center font-medium leading-relaxed md:max-w-md">
            Garantir a proteção e qualidade de vida de cães com necessidades especiais. Criado em colaboração com o Observatório do Bem-Estar Animal.
          </p>

          <div className="flex gap-4 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
            <button 
              onClick={() => setCurrentView('home')}
              className="hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              Início
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('gallery')}
              className="hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              Conhecer os Cães
            </button>
            <span>•</span>
            <button 
              onClick={() => setCurrentView('admin')}
              className="hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
            >
              Acesso Restrito
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
