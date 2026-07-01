import React, { useState } from 'react';
import type { Dog, DogUpdate, Sponsorship } from '../types';
import { X, Calendar, Heart, ShieldAlert, CheckCircle, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface DogDetailModalProps {
  dog: Dog;
  updates: DogUpdate[];
  onClose: () => void;
  onAddSponsorship: (sponsorship: Omit<Sponsorship, 'id' | 'createdAt' | 'status' | 'startDate'>) => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({
  dog,
  updates,
  onClose,
  onAddSponsorship,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');

  const percentSponsored = Math.min(
    Math.round((dog.currentMonthlySponsorship / dog.targetMonthlySponsorship) * 100),
    100
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorEmail) return;

    const amount = monthlyAmount === 0 ? parseFloat(customAmount) : monthlyAmount;
    if (isNaN(amount) || amount <= 0) return;

    onAddSponsorship({
      dogId: dog.id,
      sponsorName,
      sponsorEmail,
      monthlyAmount: amount,
    });

    setShowSuccess(true);
  };

  const activeAmount = monthlyAmount === 0 ? parseFloat(customAmount) || 0 : monthlyAmount;
  const translatedGender = dog.gender === 'male' ? 'Macho' : 'Fêmea';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Image, Stats, Info OR Sponsor Form */}
          <div className="w-full md:w-1/2 overflow-y-auto p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-200/60 dark:border-zinc-800/80">
            {!showForm && !showSuccess ? (
              // Dog Details View
              <div className="space-y-6">
                {/* Dog Photo */}
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-inner">
                  <img src={dog.mainImageUrl} alt={dog.name} className="object-cover w-full h-full" />
                </div>

                {/* Name & Basic Info */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">{dog.name}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 capitalize">
                      {translatedGender} • {dog.age}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 font-semibold tracking-wide uppercase">
                    Raça: {dog.breed}
                  </p>
                </div>

                {/* About Bio */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">História</h4>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {dog.description}
                  </p>
                </div>

                {/* Special/Medical Needs */}
                {dog.medicalNeeds && (
                  <div className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 rounded-2xl flex gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Cuidados Médicos Especiais</h4>
                      <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 font-medium leading-normal">
                        {dog.medicalNeeds}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sponsorship Bar */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <div className="flex justify-between items-end text-xs font-semibold mb-2">
                    <span className="text-zinc-500">Custo Mensal: €{dog.targetMonthlySponsorship}</span>
                    <span className="text-amber-500">€{dog.currentMonthlySponsorship} garantidos ({percentSponsored}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                      style={{ width: `${percentSponsored}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                    Quero Apadrinhar o/a {dog.name}
                  </button>
                </div>
              </div>
            ) : showForm && !showSuccess ? (
              // Sponsorship Form View
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Seja Padrinho / Madrinha</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Preencha o formulário abaixo para apoiar o/a <span className="font-semibold text-zinc-800 dark:text-zinc-200">{dog.name}</span>.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                      Nome Completo
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={sponsorName}
                      onChange={(e) => setSponsorName(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                      Endereço de E-mail
                    </label>
                    <input 
                      type="email"
                      required
                      placeholder="Ex: joao@exemplo.com"
                      value={sponsorEmail}
                      onChange={(e) => setSponsorEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">
                      Contribuição Mensal
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[10, 20, 0].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setMonthlyAmount(val)}
                          className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                            monthlyAmount === val
                              ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {val === 0 ? 'Outro' : `€${val}/mês`}
                        </button>
                      ))}
                    </div>

                    {monthlyAmount === 0 && (
                      <div className="mt-3 flex items-center bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500">
                        <span className="pl-4 text-zinc-500 text-sm font-bold">€</span>
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder="Outro valor"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full px-2 py-3 bg-transparent text-sm focus:outline-none"
                        />
                        <span className="pr-4 text-zinc-400 text-xs font-semibold">/mês</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-colors cursor-pointer"
                    >
                      Continuar para Pagamento
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full text-center text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mt-3 block"
                    >
                      Voltar aos detalhes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Success & Payment Instructions View
              <div className="space-y-6 flex flex-col justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 mb-2">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white">Quase concluído!</h3>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    O seu pedido de apadrinhamento para o/a <span className="font-bold text-amber-500">{dog.name}</span> foi registado como pendente.
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    Para ativar o seu apadrinhamento mensal:
                  </p>
                  
                  {/* Payment Details */}
                  <div className="space-y-3.5">
                    {/* Method 1: MBWay */}
                    <div className="flex justify-between items-center text-sm border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">Transferência MBWay</div>
                      <div className="text-right">
                        <div className="font-bold text-amber-500">+351 912 345 678</div>
                        <div className="text-[10px] text-zinc-400">Telemóvel da Associação</div>
                      </div>
                    </div>

                    {/* Method 2: IBAN */}
                    <div className="flex flex-col gap-1 text-sm border-b border-zinc-200/60 dark:border-zinc-800/80 pb-2.5">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">Transferência Bancária (IBAN)</div>
                      <div className="font-mono text-xs font-extrabold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-lg text-center mt-1">
                        PT50 0007 0000 1234 5678 9012 3
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-between items-center text-sm">
                      <div className="font-bold text-zinc-800 dark:text-zinc-200">Valor Mensal Escolhido</div>
                      <div className="font-black text-emerald-600">€{activeAmount}/mês</div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                      ⚠️ <strong>Importante:</strong> Inclua a descrição <strong>"Padrinho {dog.name}"</strong> na transferência/MBWay para que possamos identificar e ativar a sua subscrição!
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
                >
                  Concluí a transferência
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Timeline / Dog Updates */}
          <div className="w-full md:w-1/2 overflow-y-auto p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-amber-500" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Diário do Cão</h3>
            </div>

            {updates.length === 0 ? (
              // Empty State
              <div className="h-[200px] flex flex-col items-center justify-center text-center p-4">
                <Sparkles className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
                <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Sem diário ainda</h4>
                <p className="text-xs text-zinc-400 max-w-[240px] mt-1 leading-normal">
                  As atualizações de saúde, progresso e bem-estar de {dog.name} serão publicadas aqui para os padrinhos.
                </p>
              </div>
            ) : (
              // Timeline Updates
              <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-6 space-y-8">
                {updates.map((update) => (
                  <div key={update.id} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-amber-500 bg-white dark:bg-zinc-900" />

                    {/* Date */}
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 tracking-wider uppercase mb-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(update.createdAt).toLocaleDateString('pt-PT', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    {/* Content */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 rounded-2xl shadow-sm space-y-3">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">
                        {update.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {update.content}
                      </p>
                      {update.imageUrl && (
                        <div className="rounded-xl overflow-hidden aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-800">
                          <img src={update.imageUrl} alt={update.title} className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
