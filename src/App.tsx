/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Stethoscope, AlertTriangle, Settings, FileText, Zap, Wrench, Activity, Loader2, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { getBiomedicalGuidance } from './services/gemini.ts';

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100" dir="rtl">
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
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
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

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
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
    </div>
  );
}
