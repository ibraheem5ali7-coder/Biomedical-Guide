/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Stethoscope, AlertTriangle, Settings, FileText, Zap, Wrench, Activity, Loader2, ChevronRight, Info, X, Plus, Trash2, LayoutGrid, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getBiomedicalGuidance } from './services/gemini.ts';

interface Category {
  id: string;
  name: string;
  icon: string;
  subCategories: string[];
}

interface Ad {
  id: string;
  text: string;
  color: string;
}

const AD_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500', 'bg-indigo-500'
];

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [ads, setAds] = useState<Ad[]>([
    { id: '1', text: 'تحديث جديد: بروتوكولات أجهزة التنفس الصناعي 2024', color: 'bg-blue-500' },
    { id: '2', text: 'دورة تدريبية قادمة في صيانة أجهزة الأشعة المقطعية', color: 'bg-emerald-500' },
    { id: '3', text: 'تنبيه: تحديث أمني هام لأجهزة مراقبة المريض', color: 'bg-rose-500' },
  ]);
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'أجهزة العناية المركزة', icon: 'Activity', subCategories: ['أجهزة التنفس', 'مراقبة المريض'] },
    { id: '2', name: 'أجهزة الأشعة', icon: 'Zap', subCategories: ['X-Ray', 'CT Scan'] },
  ]);

  // Form States for Settings
  const [newAdText, setNewAdText] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const guidance = await getBiomedicalGuidance(query);
      setResult(guidance);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const addAd = () => {
    if (!newAdText.trim()) return;
    const newAd: Ad = {
      id: Date.now().toString(),
      text: newAdText,
      color: AD_COLORS[Math.floor(Math.random() * AD_COLORS.length)]
    };
    setAds([...ads, newAd]);
    setNewAdText('');
  };

  const deleteAd = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCatName,
      icon: 'LayoutGrid',
      subCategories: []
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };

  const addSubCategory = (catId: string) => {
    if (!newSubName.trim()) return;
    setCategories(categories.map(cat => 
      cat.id === catId ? { ...cat, subCategories: [...cat.subCategories, newSubName] } : cat
    ));
    setNewSubName('');
  };

  const deleteSubCategory = (catId: string, subName: string) => {
    setCategories(categories.map(cat => 
      cat.id === catId ? { ...cat, subCategories: cat.subCategories.filter(s => s !== subName) } : cat
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100" dir="rtl">
      {/* Ads Ticker */}
      <div className="bg-slate-900 overflow-hidden py-2 border-b border-slate-800">
        <motion.div 
          className="flex whitespace-nowrap gap-8"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...ads, ...ads].map((ad, idx) => (
            <div key={`${ad.id}-${idx}`} className={`${ad.color} text-white px-4 py-1 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2`}>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {ad.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
              <Stethoscope size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              خبير الهندسة الطبية الحيوية
              <span className="block text-xs font-medium text-blue-600 uppercase tracking-widest mt-0.5">Senior BioMed Expert</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">لوحة التحكم</a>
            <a href="#" className="hover:text-blue-600 transition-colors">سجل الصيانة</a>
            <a href="#" className="hover:text-blue-600 transition-colors">المخزون</a>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Search Section */}
        <section className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">مساعد الصيانة الذكي</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              أدخل اسم الجهاز الطبي أو كود الخطأ للحصول على تشخيص دقيق، خطوات صيانة تصحيحية، وبروتوكولات PPM المعتمدة.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group mb-8">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثال: Ventilator, Error 501, Defibrillator..."
                className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pr-12 pl-32 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg shadow-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute inset-y-2 left-2 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'تحليل'}
              </button>
            </form>

            {/* Categories Display */}
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="group relative">
                  <button 
                    onClick={() => setQuery(cat.name)}
                    className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all min-w-[120px]"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <LayoutGrid size={24} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{cat.name}</span>
                  </button>
                  
                  {/* Subcategories Dropdown (Simplified) */}
                  {cat.subCategories.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-20 p-2">
                      {cat.subCategories.map((sub, idx) => (
                        <button 
                          key={idx}
                          onClick={() => setQuery(`${cat.name} - ${sub}`)}
                          className="w-full text-right px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-between"
                        >
                          {sub}
                          <ChevronRight size={14} className="rotate-180" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <Loader2 size={48} className="text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">جاري تحليل البيانات الفنية...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-start gap-4"
            >
              <AlertTriangle className="shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">خطأ في النظام</h3>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Quick Actions / Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">الحالة</p>
                    <p className="font-bold text-slate-800">تحتاج صيانة</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">الأولوية</p>
                    <p className="font-bold text-slate-800">عالية</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">التقرير</p>
                    <p className="font-bold text-slate-800">جاهز للمعاينة</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wrench className="text-blue-400" size={24} />
                    <h3 className="text-white font-bold text-xl">تقرير التوجيه الفني</h3>
                  </div>
                  <div className="text-slate-400 text-sm font-mono">REF: {new Date().getFullYear()}-BM-{Math.floor(Math.random() * 10000)}</div>
                </div>
                
                <div className="p-8 prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-strong:text-slate-900 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-slate-100 markdown-body">
                  <Markdown>{result}</Markdown>
                </div>

                <div className="bg-blue-50 border-t border-blue-100 p-6 flex items-start gap-4">
                  <Info className="text-blue-600 shrink-0 mt-1" size={20} />
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <strong>تذكير أمني:</strong> هذه المعلومات مقدمة كدليل استرشادي للمهندسين المختصين. يجب دائماً الرجوع إلى <strong>كتيب الخدمة (Service Manual)</strong> الخاص بالشركة المصنعة للجهاز قبل البدء في أي إجراءات صيانة.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">تشخيص الأجهزة</h4>
              <p className="text-slate-500 leading-relaxed">تحليل متقدم للأعطال الميكانيكية والإلكترونية بناءً على الأعراض الظاهرة.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
              <div className="bg-green-50 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">بروتوكولات PPM</h4>
              <p className="text-slate-500 leading-relaxed">جداول زمنية دقيقة للصيانة الوقائية لضمان استمرارية عمل الأجهزة بكفاءة.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
              <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">السلامة الكهربائية</h4>
              <p className="text-slate-500 leading-relaxed">اختبارات تسريب التيار والمقاومة الأرضية وفق معايير IEC 60601 العالمية.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
              <div className="bg-purple-50 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">إدارة قطع الغيار</h4>
              <p className="text-slate-500 leading-relaxed">توصيات ذكية للقطع الاستهلاكية والأساسية التي يجب توفرها في المخزون.</p>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} نظام خبير الهندسة الطبية الحيوية. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <Settings className="text-blue-400" />
                  <h2 className="text-xl font-bold">إعدادات النظام</h2>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12">
                {/* Ads Management */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                      <Zap size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">إدارة شريط الإعلانات</h3>
                  </div>
                  
                  <div className="flex gap-2 mb-6">
                    <input 
                      type="text"
                      value={newAdText}
                      onChange={(e) => setNewAdText(e.target.value)}
                      placeholder="نص الإعلان الجديد..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={addAd}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      إضافة
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ads.map(ad => (
                      <div key={ad.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl group">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${ad.color}`} />
                          <span className="text-slate-700 font-medium">{ad.text}</span>
                        </div>
                        <button 
                          onClick={() => deleteAd(ad.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Categories Management */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                      <LayoutGrid size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">إدارة أقسام الأجهزة</h3>
                  </div>

                  <div className="flex gap-2 mb-8">
                    <input 
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="اسم القسم الجديد..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={addCategory}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      إضافة قسم
                    </button>
                  </div>

                  <div className="space-y-6">
                    {categories.map(cat => (
                      <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 text-blue-600">
                              <LayoutGrid size={20} />
                            </div>
                            <h4 className="font-bold text-slate-800">{cat.name}</h4>
                          </div>
                          <button 
                            onClick={() => deleteCategory(cat.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Subcategories */}
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={activeCatId === cat.id ? newSubName : ''}
                              onChange={(e) => {
                                setActiveCatId(cat.id);
                                setNewSubName(e.target.value);
                              }}
                              placeholder="إضافة فرع جديد..."
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button 
                              onClick={() => addSubCategory(cat.id)}
                              className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors"
                            >
                              إضافة فرع
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {cat.subCategories.map((sub, idx) => (
                              <div key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm text-slate-600 group">
                                <Layers size={14} className="text-slate-400" />
                                {sub}
                                <button 
                                  onClick={() => deleteSubCategory(cat.id, sub)}
                                  className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  حفظ وإغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
