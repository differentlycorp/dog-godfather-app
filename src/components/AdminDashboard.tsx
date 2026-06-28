import React, { useState } from 'react';
import type { Dog, DogUpdate, Sponsorship } from '../types';
import { PlusCircle, FileText, CheckCircle, XCircle, Trash2, Edit3, Lock, ArrowLeft, Heart } from 'lucide-react';

interface AdminDashboardProps {
  dogs: Dog[];
  sponsorships: Sponsorship[];
  onAddDog: (dog: Omit<Dog, 'id' | 'createdAt' | 'currentMonthlySponsorship' | 'status'>) => void;
  onEditDog: (dog: Dog) => void;
  onDeleteDog: (id: string) => void;
  onApproveSponsorship: (id: string) => void;
  onCancelSponsorship: (id: string) => void;
  onAddUpdate: (update: Omit<DogUpdate, 'id' | 'createdAt'>) => void;
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
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<Tab>('dogs');

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234' || passcode.toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
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
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Admin Access</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Please enter your administrator passcode. <br />
            <span className="text-[10px] font-semibold text-amber-500">(Hint: Use "1234")</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="••••"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-center tracking-widest px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
            />
            {passcodeError && (
              <p className="text-[11px] font-bold text-red-500 text-center mt-2">
                Incorrect passcode. Try again!
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-amber-500/15 cursor-pointer"
          >
            Unlock Dashboard
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
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage dogs, approve godfather requests, and post status updates.
          </p>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Lock Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {(['dogs', 'sponsorships', 'updates'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsAddingDog(false);
              setIsAddingUpdate(false);
            }}
            className={`py-3 px-6 text-sm font-bold border-b-2 capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Manage Dogs */}
      {activeTab === 'dogs' && (
        <div className="space-y-6">
          {!isAddingDog ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Registered Dogs</h3>
                <button
                  onClick={() => setIsAddingDog(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add a Dog
                </button>
              </div>

              {dogs.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
                  <Heart className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-500">No dogs registered yet.</p>
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
                          <p className="text-xs text-zinc-400 capitalize">
                            {dog.gender} • {dog.age}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(dog)}
                          className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDog(dog.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
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
                {editingDogId ? 'Edit Dog Profile' : 'Register New Dog'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Breed</label>
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
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 years"
                    value={dogAge}
                    onChange={(e) => setDogAge(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={dogGender}
                    onChange={(e) => setDogGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Goal (€/mo)</label>
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
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Description / Story</label>
                <textarea
                  required
                  rows={4}
                  value={dogDescription}
                  onChange={(e) => setDogDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Medical Needs (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Daily eye drops (€15/mo)"
                  value={dogMedical}
                  onChange={(e) => setDogMedical(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={dogImage}
                  onChange={(e) => setDogImage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingDog(false);
                    setEditingDogId(null);
                  }}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 text-sm font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Manage Sponsorships */}
      {activeTab === 'sponsorships' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Godfather Sponsorships</h3>

          {sponsorships.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
              <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-zinc-500">No sponsorships registered yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                      <th className="p-4">Dog</th>
                      <th className="p-4">Sponsor</th>
                      <th className="p-4">Contribution</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {sponsorships.map((spons) => {
                      const dog = dogs.find((d) => d.id === spons.dogId);
                      return (
                        <tr key={spons.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                          <td className="p-4 font-bold text-zinc-900 dark:text-white">
                            {dog ? dog.name : 'Unknown Dog'}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {spons.sponsorName}
                            </div>
                            <div className="text-xs text-zinc-400">{spons.sponsorEmail}</div>
                          </td>
                          <td className="p-4 font-black text-emerald-600">
                            €{spons.monthlyAmount}/mo
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                spons.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                                  : spons.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/10'
                                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              }`}
                            >
                              {spons.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              {spons.status === 'pending' && (
                                <button
                                  onClick={() => onApproveSponsorship(spons.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                                  title="Approve payment and activate"
                                >
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Approve
                                </button>
                              )}
                              {spons.status !== 'cancelled' && (
                                <button
                                  onClick={() => onCancelSponsorship(spons.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                  title="Cancel subscription"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Cancel
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
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-bold">Dog Updates Log</h3>
                <button
                  onClick={() => setIsAddingUpdate(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-500/10 transition-colors cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Update
                </button>
              </div>

              <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
                <FileText className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-500">
                  Select "Post Update" to write a medical update or status milestones.
                </p>
              </div>
            </>
          ) : (
            // Add Update Form
            <form onSubmit={handleAddUpdateSubmit} className="max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl shadow-md space-y-5">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Post New Update
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Select Dog</label>
                <select
                  required
                  value={updateDogId}
                  onChange={(e) => setUpdateDogId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Choose a dog --</option>
                  {dogs.map((dog) => (
                    <option key={dog.id} value={dog.id}>
                      {dog.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Update Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Max went to the vet today"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Content</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell the godparents how the dog is doing..."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500 resize-none font-medium leading-relaxed text-zinc-600 dark:text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Update Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={updateImage}
                  onChange={(e) => setUpdateImage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingUpdate(false)}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-850 dark:hover:bg-zinc-800 dark:text-zinc-300 text-sm font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
