import { motion } from 'motion/react';
import { X, Dices, Feather, Zap, Star, Users, Heart, Sparkles, Volume2 } from 'lucide-react';
import { speakText } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  const steps = [
    {
      num: '1',
      title: 'Pilih Bilangan Pemain & Watak Inside Out',
      desc: 'Boleh dimainkan oleh 2, 3, atau 4 orang murid. Pilih watak emosi kegemaran kamu seperti Joy (Riang), Sadness (Sedih), Anger (Marah), Fear (Takut), Anxiety (Gelisah), dan lain-lain!',
      icon: Users,
      color: 'bg-amber-100 text-amber-700 border-amber-300',
    },
    {
      num: '2',
      title: 'Baling Dadu & Laluan Jelas 🎲 (Nisbah 4:3)',
      desc: 'Papan kini berformat nisbah 4:3 yang luas dan mudah dilihat! Setiap petak dinomborkan (#1 hingga #20) bersama anak panah arah gerakan mengikut arah jam (➔ ↓ ← ↑). Petak sasaran dan jejak langkah akan menyala secara automatik.',
      icon: Dices,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    {
      num: '3',
      title: 'Soalan Berbeza Setiap Pusingan 💭',
      desc: 'Setiap pusingan ada soalan berlainan yang semakin mendalam! Bermula dari mengenal asas emosi (Pusingan 1), situasi kawan & sekolah (Pusingan 2), luahan hati rahsia (Pusingan 3), strategi bertenang (Pusingan 4), hingga nilai syukur & memori emas (Pusingan 5). Murid juga boleh menekan "Tukar Soalan" bila-bila masa!',
      icon: Heart,
      color: 'bg-rose-100 text-rose-700 border-rose-300',
    },
    {
      num: '4',
      title: 'Kad Tenang (Minda Damai) 🕊️',
      desc: 'Jika berhenti di petak Kad Tenang, kamu akan dapat kad teknik bertenang secara rawak—seperti pernafasan rama-rama, hembusan belon, atau afirmasi positif untuk menenangkan diri.',
      icon: Feather,
      color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    },
    {
      num: '5',
      title: 'Kad Cabaran (Aksi & Lakonan Ceria) ⚡',
      desc: 'Jika berhenti di petak Kad Cabaran, lakukan cabaran ekspresi emosi secara rawak seperti berlakon gaya watak, teka emosi, atau puji kawan di sebelah!',
      icon: Zap,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
    },
    {
      num: '6',
      title: 'Kumpul Bintang Emosi ⭐ (Butang +0 Jika Belum Bersedia)',
      desc: 'Dalam Emotionopoly, tiada yang muflis atau kalah! Jika murid tidak dapat atau belum bersedia menjawab mana-mana soalan, tekan butang "+0 ⭐" untuk teruskan giliran tanpa paksaan. Setiap perkongsian jujur dan saling menghormati adalah kemenangan bersama!',
      icon: Star,
      color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    },
  ];

  const handleReadRules = () => {
    const speech = `Cara Bermain Emotionopoly. Pertama, pilih dua hingga empat pemain dan watak Inside Out. Kedua, baling dadu automatik. Ketiga, bila mendarat di petak emosi, kongsi perasaan anda secara jujur. Keempat, cabut Kad Tenang untuk latihan minda damai. Kelima, cabut Kad Cabaran untuk aksi lakonan ceria. Keenam, kumpul Bintang Emosi bersama rakan-rakan!`;
    speakText(speech);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-900 flex items-center justify-between border-b border-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/40 rounded-xl shadow-sm">
              <Sparkles className="w-6 h-6 text-amber-900" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                Cara Bermain Emotionopoly
              </h2>
              <p className="text-xs font-semibold text-slate-800">
                Panduan ringkas & mudah untuk murid sekolah rendah (Umur 7 - 12 Tahun)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadRules}
              title="Dengarkan Panduan"
              className="p-2 bg-white/60 hover:bg-white rounded-xl transition-colors text-slate-800"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/60 hover:bg-white rounded-xl transition-colors text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <p className="text-xs sm:text-sm font-bold text-amber-950">
              🎯 Matlamat Permainan: Belajar mengenali perasaan diri, saling mendengar antara kawan, dan mengekspresikan emosi secara sihat bersama watak Inside Out!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${step.color}`}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-11">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Inside Out Emotional Guide */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2 flex items-center gap-1.5">
              Watak Emosi Inside Out:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                <span>⭐</span> Joy (Riang)
              </div>
              <div className="p-2 rounded-xl bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1.5">
                <span>💧</span> Sadness (Sedih)
              </div>
              <div className="p-2 rounded-xl bg-red-100 text-red-900 border border-red-200 flex items-center gap-1.5">
                <span>🔥</span> Anger (Marah)
              </div>
              <div className="p-2 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1.5">
                <span>⚡</span> Fear (Takut)
              </div>
              <div className="p-2 rounded-xl bg-orange-100 text-orange-900 border border-orange-200 flex items-center gap-1.5">
                <span>🌀</span> Anxiety (Gelisah)
              </div>
              <div className="p-2 rounded-xl bg-green-100 text-green-900 border border-green-200 flex items-center gap-1.5">
                <span>🌱</span> Disgust (Jijik)
              </div>
              <div className="p-2 rounded-xl bg-teal-100 text-teal-900 border border-teal-200 flex items-center gap-1.5">
                <span>✨</span> Envy (Cemburu)
              </div>
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-200 flex items-center gap-1.5">
                <span>🛋️</span> Ennui (Bosan)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="btn-close-how-to-play"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-all"
          >
            Faham, Jom Mula Main! 🎮
          </button>
        </div>
      </motion.div>
    </div>
  );
}
