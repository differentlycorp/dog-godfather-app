import React, { useState, useEffect } from 'react';
import type { Dog, DogUpdate, Sponsorship } from '../types';
import { PlusCircle, FileText, CheckCircle, XCircle, Trash2, Edit3, Lock, ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AdminDashboardProps {
  dogs: Dog[];
  sponsorships: Sponsorship[];
  onAddDog: (dog: Omit<Dog, 'id' | 'createdAt' | 'currentMonthlySponsorship' | 'status'>) => void;
  onEditDog: (dog: Dog) => void;
  onDeleteDog: (id: string) => void;
  onApproveSponsorship: (id: string) => void;
  onCancelSponsorship: (id: string) => void;
  onAddUpdate: (update: Omit<DogUpdate, 'id' | 'createdAt'>) => void;
  onSeedDatabase?: () => Promise<void>;
}

type Tab = 'dogs' | 'sponsorships' | 'updates';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  dogs,
  sponsorships,
  onAddDog,
  onEditDog,
  onDeleteDog,
  onApproveSponsorship,
  onCancelSponsorship,
  onAddUpdate,
  onSeedDatabase,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  const [activeTab, setActiveTab] = useState<Tab>('dogs');

  // Check active session or local auth timestamp on mount
  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        }
      } else {
        const savedAuth = localStorage.getItem('paws_admin_auth_timestamp');
        if (savedAuth) {
          const timestamp = parseInt(savedAuth);
          const ONE_HOUR = 60 * 60 * 1000;
          if (Date.now() - timestamp < ONE_HOUR) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('paws_admin_auth_timestamp');
          }
        }
      }
    };
    checkSession();
  }, []);

  // Dog Form State
  const [isAddingDog, setIsAddingDog] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [dogAge, setDogAge] = useState('');
  const [dogGender, setDogGender] = useState<'male' | 'female'>('male');
  const [dogDescription, setDogDescription] = useState('');
  const [dogMedical, setDogMedical] = useState('');
  const [dogTarget, setDogTarget] = useState<number>(30);
  const [dogImage, setDogImage] = useState('');

  // Update Form State
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateDogId, setUpdateDogId] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateImage, setUpdateImage] = useState('');

  const [isUploadingDogImage, setIsUploadingDogImage] = useState(false);
  const [isUploadingUpdateImage, setIsUploadingUpdateImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploadingDogImage(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Deve selecionar uma imagem para carregar.');
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from('dog-photos')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('dog-photos')
          .getPublicUrl(filePath);

        setDogImage(data.publicUrl);
      } else {
        // Fallback for local preview
        const localUrl = URL.createObjectURL(file);
        setDogImage(localUrl);
      }
    } catch (error: any) {
      alert(`Erro no upload: ${error.message || error}`);
    } finally {
      setIsUploadingDogImage(false);
    }
  };

  const handleUpdateImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploadingUpdateImage(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Deve selecionar uma imagem para carregar.');
      }
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      if (supabase) {
        const { error: uploadError } = await supabase.storage
          .from('dog-photos')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('dog-photos')
          .getPublicUrl(filePath);

        setUpdateImage(data.publicUrl);
      } else {
        const localUrl = URL.createObjectURL(file);
        setUpdateImage(localUrl);
      }
    } catch (error: any) {
      alert(`Erro no upload: ${error.message || error}`);
    } finally {
      setIsUploadingUpdateImage(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setPasscodeError(false);

    try {
      if (supabase) {
        // Secure production mode: Authenticate against Supabase with secret email and entered passcode
        const { error } = await supabase.auth.signInWithPassword({
          email: 'admin@paws-godparents.com',
          password: passcode,
        });

        if (error) {
          setPasscodeError(true);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        // Local prototype fallback: Check passcode locally if environment variables aren't set
        if (passcode === '757784') {
          localStorage.setItem('paws_admin_auth_timestamp', Date.now().toString());
          setIsAuthenticated(true);
        } else {
          setPasscodeError(true);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setPasscodeError(true);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleAddDogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dogName || !dogDescription || !dogBreed || !dogAge || !dogImage) return;

    if (editingDogId) {
      const existingDog = dogs.find(d => d.id === editingDogId);
      if (existingDog) {
        onEditDog({
          ...existingDog,
          name: dogName,
          breed: dogBreed,
          age: dogAge,
          gender: dogGender,
          description: dogDescription,
          medicalNeeds: dogMedical || undefined,
          targetMonthlySponsorship: dogTarget,
          mainImageUrl: dogImage,
        });
      }
      setEditingDogId(null);
    } else {
      onAddDog({
        name: dogName,
        breed: dogBreed,
        age: dogAge,
        gender: dogGender,
        description: dogDescription,
        medicalNeeds: dogMedical || undefined,
        targetMonthlySponsorship: dogTarget,
        mainImageUrl: dogImage,
      });
    }

    // Reset Form
    setIsAddingDog(false);
    setDogName('');
    setDogBreed('');
    setDogAge('');
    setDogGender('male');
    setDogDescription('');
    setDogMedical('');
    setDogTarget(30);
    setDogImage('');
  };

  const handleEditClick = (dog: Dog) => {
    setEditingDogId(dog.id);
    setDogName(dog.name);
    setDogBreed(dog.breed);
    setDogAge(dog.age);
    setDogGender(dog.gender);
    setDogDescription(dog.description);
    setDogMedical(dog.medicalNeeds || '');
    setDogTarget(dog.targetMonthlySponsorship);
    setDogImage(dog.mainImageUrl);
    setIsAddingDog(true);
  };

  const handleAddUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateDogId || !updateTitle || !updateContent) return;

    onAddUpdate({
      dogId: updateDogId,
      title: updateTitle,
      content: updateContent,
      imageUrl: updateImage || undefined,
    });

    setIsAddingUpdate(false);
    setUpdateDogId('');
    setUpdateTitle('');
    setUpdateContent('');
    setUpdateImage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Acesso Restrito</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Introduza o código de administração para desbloquear o painel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="••••"
              disabled={isLoadingAuth}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-center tracking-widest px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors disabled:opacity-50"
            />
            {passcodeError && (
              <p className="text-[11px] font-bold text-red-500 text-center mt-2">
                Código incorreto. Tente novamente!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoadingAuth}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-amber-500/15 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoadingAuth ? 'A verificar...' : 'Desbloquear Painel'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200/60 dark:border-zinc-800/80">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Painel de Gestão - OBEA</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Faça a gestão dos cães acolhidos, aprove apoios mensais e publique atualizações no diário.
          </p>
        </div>
        <button
          onClick={async () => {
            if (supabase) {
              await supabase.auth.signOut();
            } else {
              localStorage.removeItem('paws_admin_auth_timestamp');
            }
            setIsAuthenticated(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Bloquear Painel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {[
          { key: 'dogs', label: 'Cães Acolhidos' },
          { key: 'sponsorships', label: 'Padrinhos & Madrinhas' },
          { key: 'updates', label: 'Diário de Bordo' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as Tab);
              setIsAddingDog(false);
              setIsAddingUpdate(false);
            }}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Manage Dogs */}
      {activeTab === 'dogs' && (
        <div className="space-y-6">
          {!isAddingDog ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Cães Registados</h3>
                <button
                  onClick={() => setIsAddingDog(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Adicionar Cão
                </button>
              </div>

              {dogs.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div>
                    <Heart className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-zinc-500">Nenhum cão registado ainda.</p>
                  </div>
                  {onSeedDatabase && (
                    <button
                      type="button"
                      disabled={isSeeding}
                      onClick={async () => {
                        setIsSeeding(true);
                        try {
                          await onSeedDatabase();
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setIsSeeding(false);
                        }
                      }}
                      className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-850 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-lg cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSeeding ? 'A semear...' : 'Semear Base de Dados com Cães Demo'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dogs.map((dog) => (
                    <div
                      key={dog.id}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={dog.mainImageUrl}
                          alt={dog.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-zinc-900 dark:text-white">{dog.name}</h4>
                          <p className="text-xs text-zinc-400">
                            {dog.gender === 'male' ? 'Macho' : 'Fêmea'} • {dog.age}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(dog)}
                          className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDog(dog.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Add/Edit Dog Form
            <form onSubmit={handleAddDogSubmit} className="max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-md space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                {editingDogId ? 'Editar Perfil do Cão' : 'Registar Novo Cão'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Nome</label>
                  <input
                    type="text"
                    required
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Raça</label>
                  <input
                    type="text"
                    required
                    value={dogBreed}
                    onChange={(e) => setDogBreed(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Idade</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2 anos"
                    value={dogAge}
                    onChange={(e) => setDogAge(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Sexo</label>
                  <select
                    value={dogGender}
                    onChange={(e) => setDogGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Meta (€/mês)</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={dogTarget}
                    onChange={(e) => setDogTarget(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">História / Perfil</label>
                <textarea
                  required
                  rows={4}
                  value={dogDescription}
                  onChange={(e) => setDogDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Cuidados Médicos Especiais (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Medicação diária (€15/mês)"
                  value={dogMedical}
                  onChange={(e) => setDogMedical(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Fotografia do Cão</label>
                <div className="flex items-center gap-4">
                  {dogImage && (
                    <img 
                      src={dogImage} 
                      alt="Miniatura" 
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingDogImage}
                      onChange={handleImageUpload}
                      className="hidden"
                      id="dog-image-file"
                    />
                    <label
                      htmlFor="dog-image-file"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-lg cursor-pointer transition-colors"
                    >
                      {isUploadingDogImage ? 'A carregar...' : dogImage ? 'Alterar Imagem' : 'Escolher Ficheiro'}
                    </label>
                    <span className="text-[10px] text-zinc-400 block mt-1">Formatos suportados: JPG, PNG, WEBP. Tamanho máximo recomendado: 5MB.</span>
                  </div>
                </div>
                <input type="hidden" value={dogImage} required />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Gravar Perfil
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingDog(false);
                    setEditingDogId(null);
                  }}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 text-sm font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Manage Sponsorships */}
      {activeTab === 'sponsorships' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-bold">Apadrinhamentos Registados</h3>

          {sponsorships.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
              <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-500">Nenhum apadrinhamento registado ainda.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <th className="p-4">Cão</th>
                      <th className="p-4">Padrinho / Madrinha</th>
                      <th className="p-4">Contribuição</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {sponsorships.map((spons) => {
                      const dog = dogs.find((d) => d.id === spons.dogId);
                      return (
                        <tr key={spons.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="p-4 font-bold text-zinc-900 dark:text-white">
                            {dog ? dog.name : 'Cão Desconhecido'}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {spons.sponsorName}
                            </div>
                            <div className="text-xs text-zinc-400">{spons.sponsorEmail}</div>
                          </td>
                          <td className="p-4 font-black text-emerald-600">
                            €{spons.monthlyAmount}/mês
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                spons.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                  : spons.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/10'
                                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              }`}
                            >
                              {spons.status === 'active' ? 'Ativo' : spons.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {spons.status === 'pending' && (
                                <button
                                  onClick={() => onApproveSponsorship(spons.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                                  title="Aprovar pagamento e ativar"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Aprovar
                                </button>
                              )}
                              {spons.status !== 'cancelled' && (
                                <button
                                  onClick={() => onCancelSponsorship(spons.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                  title="Cancelar apadrinhamento"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Post Updates */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          {!isAddingUpdate ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-bold">Histórico do Diário</h3>
                <button
                  onClick={() => setIsAddingUpdate(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Nova Atualização
                </button>
              </div>

              <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
                <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-500">
                  Selecione "Nova Atualização" para escrever notícias sobre saúde, exames ou o dia a dia de um cão.
                </p>
              </div>
            </>
          ) : (
            // Add Update Form
            <form onSubmit={handleAddUpdateSubmit} className="max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-md space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Publicar Atualização no Diário
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Selecionar Cão</label>
                <select
                  required
                  value={updateDogId}
                  onChange={(e) => setUpdateDogId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Escolher cão --</option>
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Título da Notícia</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rocky fez o seu primeiro dia de fisioterapia!"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Mensagem</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Escreva a mensagem para os padrinhos..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none font-medium leading-relaxed text-zinc-600 dark:text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Fotografia da Atualização (Opcional)</label>
                <div className="flex items-center gap-4">
                  {updateImage && (
                    <img 
                      src={updateImage} 
                      alt="Miniatura" 
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingUpdateImage}
                      onChange={handleUpdateImageUpload}
                      className="hidden"
                      id="update-image-file"
                    />
                    <label
                      htmlFor="update-image-file"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-lg cursor-pointer transition-colors"
                    >
                      {isUploadingUpdateImage ? 'A carregar...' : updateImage ? 'Alterar Imagem' : 'Escolher Ficheiro'}
                    </label>
                    <span className="text-[10px] text-zinc-400 block mt-1">Formatos suportados: JPG, PNG, WEBP. Tamanho máximo recomendado: 5MB.</span>
                  </div>
                </div>
                <input type="hidden" value={updateImage} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publicar Atualização
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingUpdate(false)}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 text-sm font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
