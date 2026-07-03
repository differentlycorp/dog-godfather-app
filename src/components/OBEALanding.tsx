import React, { useState } from 'react';
import { OBEALogo } from './OBEALogo';
import { 
  ShieldCheck, 
  Smile, 
  Heart, 
  PlusCircle, 
  Trees, 
  Activity, 
  ArrowRight, 
  Send, 
  CheckCircle,
  FileText,
  UserCheck,
  Bookmark,
  X
} from 'lucide-react';

interface OBEALandingProps {
  onHelpClick: () => void;
}

export const OBEALanding: React.FC<OBEALandingProps> = ({ onHelpClick }) => {
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFullManifesto, setShowFullManifesto] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const pillars = [
    {
      title: 'Protege',
      desc: 'Cuidar e salvaguardar a vida e integridade de todos os animais.',
      icon: ShieldCheck,
      color: '#0E3B2E',
    },
    {
      title: 'Convive',
      desc: 'Promover a harmonia e o convívio responsável no dia a dia.',
      icon: Smile,
      color: '#8CC63F',
    },
    {
      title: 'Respeita',
      desc: 'Reconhecer cada animal como um ser senciente e com direitos próprios.',
      icon: Heart,
      color: '#0E3B2E',
    },
    {
      title: 'Inclui',
      desc: 'Dar voz aos mais vulneráveis e integrá-los na consciência social.',
      icon: PlusCircle,
      color: '#8CC63F',
    },
    {
      title: 'Abrange',
      desc: 'Defender todos os animais: domésticos, de produção, selvagens e exóticos.',
      icon: Trees,
      color: '#0E3B2E',
    },
    {
      title: 'Cuida',
      desc: 'Garantir o bem-estar físico, veterinário, comportamental e sanitário.',
      icon: Activity,
      color: '#8CC63F',
    },
  ];

  return (
    <div className="space-y-24 pb-20 selection:bg-emerald-500/20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 to-transparent dark:from-emerald-950/10">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10">
          
          {/* Logo Principal */}
          <OBEALogo variant="vertical" className="mb-2" />

          {/* Slogan */}
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-[1.1] max-w-3xl">
            Pelo conhecimento. Pela consciência. <span style={{ color: '#0E3B2E' }} className="dark:text-emerald-400">Pela responsabilidade.</span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            O Observatório do Bem-Estar Animal (OBEA) é uma associação sem fins lucrativos dedicada à proteção, estudo e defesa de todos os seres sencientes. Apoiamos o acolhimento responsável e criamos pontes entre a ciência e a sociedade.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={onHelpClick}
              style={{ backgroundColor: '#0E3B2E' }}
              className="px-8 py-3.5 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-900/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
            >
              <Heart className="h-4.5 w-4.5 fill-current" />
              Quero Ajudar (Apadrinhar)
            </button>
            <a
              href="#manifesto"
              className="px-8 py-3.5 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold rounded-xl transition-all"
            >
              Ler Manifesto
            </a>
          </div>
        </div>

        {/* Decorative blur elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-72 h-72 bg-lime-500/5 rounded-full blur-3xl" />
      </section>

      {/* 2. Manifesto Section */}
      <section id="manifesto" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div 
          style={{ backgroundColor: '#0E3B2E' }}
          className="p-8 sm:p-12 lg:p-16 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl"
        >
          {/* Subtle background graphics */}
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
            <OBEALogo variant="symbol" className="h-96 w-96 translate-x-20 translate-y-20" lightMode />
          </div>

          <div className="max-w-3xl space-y-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 uppercase tracking-widest text-emerald-300">
              <Bookmark className="h-3.5 w-3.5" />
              Manifesto Fundador
            </div>

            <blockquote className="text-2xl sm:text-3xl font-extrabold leading-tight text-emerald-100">
              "Não há ética humana possível que ignore o sofrimento animal."
            </blockquote>

            <div className="space-y-5 text-sm sm:text-base text-emerald-100/80 leading-relaxed font-medium">
              <p>
                Vivemos num tempo de extraordinário conhecimento e, paradoxalmente, de profunda cegueira. Nunca soubemos tanto sobre os animais – as suas emoções, capacidades cognitivas e inteligência – e, ao mesmo tempo, nunca os submetemos a tanta exploração e abandono invisível.
              </p>
              <p>
                Os animais deixaram, há muito, de ser objetos. A ciência provou que são seres sencientes, capazes de sentir dor, prazer, medo e expetativa. O OBEA nasce exatamente nesse intervalo: no espaço onde a ciência já chegou, mas a sociedade ainda não. 
              </p>
              <p>
                Propomos uma síntese: uma ecologia com rosto, uma ciência com consciência e com responsabilidade ativa.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowFullManifesto(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <span>Ler Manifesto na Íntegra</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Olhares Que Unem (Pillars) */}
      <section id="missao" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Olhares Que Unem</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Uma comunidade. Todos diferentes, todos importantes, todos ligados.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex gap-4"
              >
                <div 
                  style={{ backgroundColor: `${pillar.color}15`, color: pillar.color }}
                  className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                >
                  <IconComp className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{pillar.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Programa Guardião */}
      <section id="programa-guardiao" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-12 rounded-[2.5rem] flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10">
              <UserCheck className="h-3.5 w-3.5" />
              Continuidade de Cuidados
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">
              Programa Guardião OBEA
            </h2>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
              Um programa pioneiro desenhado para garantir o bem-estar permanente dos animais pertencentes ou confiados aos associados do OBEA. Sempre que um tutor falecer, entrar em situação de incapacidade ou deixar de conseguir assegurar os cuidados, o OBEA intervém imediatamente.
            </p>
            
            {/* Features list */}
            <div className="grid gap-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#8CC63F' }} />
                <span>Ativação de Guardiões e Fiel Depositário previamente acordados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#8CC63F' }} />
                <span>Integração em Famílias de Acolhimento selecionadas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#8CC63F' }} />
                <span>Preenchimento de Ficha com hábitos, saúde e alimentação do cão</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-sm space-y-5">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Adesão ao Programa</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Disponível para todos os associados do Observatório</p>
              </div>
            </div>
            
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
              Ao aderir, o associado preenche a <strong>Ficha de Continuidade de Cuidados</strong>, identificando um Guardião Suplente, o veterinário assistente, medicação habitual e hábitos do animal. O OBEA garante o respeito integral por estas diretrizes em caso de emergência.
            </p>

            <button
              onClick={onHelpClick}
              style={{ color: '#0E3B2E', borderColor: '#0E3B2E' }}
              className="w-full py-3 border border-current text-xs font-bold rounded-xl hover:bg-emerald-500/5 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              Apadrinhar cães no programa
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contactos" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Contacte-nos</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Tem dúvidas ou quer colaborar? Envie-nos uma mensagem.</p>
        </div>

        {showSuccess ? (
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/15 rounded-3xl flex flex-col items-center justify-center text-center space-y-2.5 shadow-sm">
            <div className="h-12 w-12 bg-emerald-500/15 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">Mensagem Enviada!</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
              Obrigado pelo seu contacto. A equipa do OBEA responderá para o seu e-mail o mais breve possível.
            </p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-8 rounded-[2.5rem] shadow-sm space-y-5">
            {errorMessage && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-xl">
                ⚠️ {errorMessage}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Assunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Mensagem</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-emerald-700 resize-none leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: '#0E3B2E' }}
              className="w-full py-3.5 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
            >
              {isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </section>



      {/* Full Manifesto Modal */}
      {showFullManifesto && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowFullManifesto(false)} />
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all max-h-[90vh] overflow-y-auto space-y-6">
              
              {/* Close Button */}
              <button 
                onClick={() => setShowFullManifesto(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6 text-zinc-750 dark:text-zinc-300">
                <div className="text-center space-y-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Documento Histórico</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-wider">Manifesto Fundador</h2>
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Observatório do Bem-Estar Animal</p>
                </div>

                <div className="space-y-6 text-sm leading-relaxed font-medium">
                  <p className="italic text-base text-zinc-900 dark:text-zinc-100 font-bold border-l-4 border-emerald-500 pl-4 py-1">
                    "Não há ética humana possível que ignore o sofrimento animal."
                  </p>
                  
                  <p>
                    Vivemos num tempo de extraordinário conhecimento e, paradoxalmente, de profunda cegueira.
                  </p>
                  <p>
                    Nunca soubemos tanto sobre os animais — sobre as suas emoções, as suas capacidades cognitivas, as suas formas de comunicação, as suas vidas sociais — e nunca, simultaneamente, os submetemos a tamanha escala de exploração, abandono e sofrimento invisível.
                  </p>
                  <p>
                    Este desfasamento entre conhecimento e acção é uma das grandes falhas morais do nosso tempo.
                  </p>
                  <p>
                    O <strong>Observatório do Bem-Estar Animal</strong> nasce precisamente nesse intervalo — nesse espaço onde a ciência já chegou, mas a sociedade ainda não.
                  </p>
                  <p>
                    Não nasce como um gesto de indignação momentânea, nem como uma resposta emocional isolada. Nasce como uma estrutura de pensamento, de observação e de intervenção — uma tentativa de aproximar o que sabemos do que fazemos.
                  </p>

                  <div className="h-[1px] bg-zinc-200/60 dark:bg-zinc-800" />

                  <p>
                    Os animais deixaram, há muito, de ser objectos.
                  </p>
                  <p>
                    A ciência mostrou-nos que são seres sencientes — capazes de sentir dor, prazer, medo, expectativa, vínculo. Mas mostrou-nos mais: revelou-nos continuidades profundas entre humanos e não humanos, desafiando a fronteira confortável que durante séculos justificou a indiferença.
                  </p>
                  <p>
                    Persistir nessa indiferença, hoje, já não é ignorância. É escolha.
                  </p>

                  <div className="h-[1px] bg-zinc-200/60 dark:bg-zinc-800" />

                  <p>
                    Este Observatório afirma um princípio simples, mas exigente: <strong>não há ética humana possível que ignore o sofrimento animal.</strong>
                  </p>
                  <p>
                    E, por extensão, não há verdadeira conservação da natureza que não integre o bem-estar dos indivíduos que a compõem.
                  </p>
                  <p>
                    Durante demasiado tempo, a natureza foi pensada em abstração — populações, espécies, ecossistemas — esquecendo que cada um desses níveis é constituído por vidas concretas. O sofrimento individual foi diluído em estatísticas, e a compaixão substituída por métricas.
                  </p>
                  <p>
                    O Observatório propõe uma síntese: uma ecologia com rosto, uma ciência com consciência.
                  </p>

                  <div className="h-[1px] bg-zinc-200/60 dark:bg-zinc-800" />

                  <p>
                    Mas este não é apenas um projecto ético. É também um projecto epistemológico.
                  </p>
                  <p>
                    Observar o bem-estar animal é, em última análise, interrogar o próprio humano. As formas como tratamos os outros animais revelam as estruturas profundas da nossa cultura, da nossa economia, das nossas hierarquias e dos nossos limites morais.
                  </p>
                  <p>
                    O bem-estar animal não é um tema periférico. É um espelho.
                  </p>

                  <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 space-y-4">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider">O Observatório assume, por isso, three compromissos fundamentais:</p>
                    <div className="space-y-3 text-xs leading-relaxed">
                      <p>
                        <strong>Conhecer</strong>: Produzir e divulgar conhecimento científico rigoroso sobre comportamento, cognição e bem-estar animal, recusando simplificações e antropomorfismos fáceis, mas também resistindo à frieza de uma ciência que esquece o que observa.
                      </p>
                      <p>
                        <strong>Pensar</strong>: Integrar esse conhecimento numa reflexão ética e filosófica mais ampla, questionando os fundamentos das nossas práticas e das nossas instituições.
                      </p>
                      <p>
                        <strong>Agir</strong>: Intervir na sociedade — através da educação, da colaboração institucional e da promoção de boas práticas — contribuindo para uma transformação gradual, mas consistente, das relações entre humanos e animais.
                      </p>
                    </div>
                  </div>

                  <p>
                    Este Observatório não se pretende neutro. A neutralidade, quando confrontada com o sofrimento, é frequentemente apenas uma forma sofisticada de indiferença. Mas também não se pretende dogmático. A sua força residirá na capacidade de manter um equilíbrio difícil: entre ciência e ética, entre rigor e compaixão, entre crítica e construção.
                  </p>
                  <p>
                    Sabemos que não mudaremos o mundo de um dia para o outro. Mas sabemos também que todas as mudanças profundas começam por deslocações quase invisíveis — na linguagem, no olhar, na forma de pensar.
                  </p>
                  <p>
                    Este Observatório é uma dessas deslocações. Um pequeno desvio no curso das coisas. Talvez insuficiente. Mas necessário.
                  </p>
                  <p className="text-center font-bold text-zinc-950 dark:text-white pt-2">
                    Porque, no fundo, a questão não é apenas o que fazemos aos animais. É o que nos tornamos ao fazê-lo.
                  </p>
                </div>

                <div className="flex justify-end pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs font-bold text-zinc-400">
                  <span>Luís Matos Vicente • Observatório do Bem-Estar Animal</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
