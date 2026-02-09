import React, { useState } from 'react';
import { INITIAL_CV_DATA, SAMPLE_CV_DATA, CVData, CVTemplate } from './types';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import { translateCV } from './services/geminiService';
import { Printer, FileText, Layout, Menu, X, ArrowRight, BrainCircuit, Globe, Maximize2, Minimize2, Palette, Columns, LayoutTemplate, Square } from 'lucide-react';

const App: React.FC = () => {
  const [cvData, setCvData] = useState<CVData>(INITIAL_CV_DATA);
  const [englishCVData, setEnglishCVData] = useState<CVData | null>(null);
  const [previewLanguage, setPreviewLanguage] = useState<'tr' | 'en'>('tr');
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>('classic');
  const [isTranslating, setIsTranslating] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [isEditorFullScreen, setIsEditorFullScreen] = useState(false);

  // CV verisinin boş olup olmadığını kontrol et
  const isCVEmpty = !cvData.personalInfo.fullName && 
                    !cvData.personalInfo.email && 
                    !cvData.personalInfo.phone &&
                    !cvData.personalInfo.address &&
                    !cvData.personalInfo.title &&
                    !cvData.personalInfo.summary &&
                    cvData.experience.length === 0 && 
                    cvData.education.length === 0 &&
                    cvData.skills.length === 0 &&
                    cvData.certificates.length === 0 &&
                    cvData.languages.length === 0 &&
                    cvData.interests.length === 0 &&
                    cvData.projects.length === 0 &&
                    cvData.references.length === 0;

  // Önizlemede gösterilecek veri: boşsa örnek, doluysa gerçek veri
  const previewData = isCVEmpty ? SAMPLE_CV_DATA : cvData;

  const handlePrint = () => {
    // Dinamik PDF adı için document.title'ı güncelle
    const originalTitle = document.title;
    const currentData = previewLanguage === 'en' && englishCVData ? englishCVData : previewData;
    const userName = currentData.personalInfo.fullName.trim();
    
    // PDF adını kullanıcı adına göre ayarla (boşsa varsayılan)
    if (userName) {
      document.title = `${userName} CV`;
    }
    
    // Print dialog'u aç
    window.print();
    
    // Print sonrası title'ı geri al (biraz gecikme ile)
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleLanguageSwitch = async (lang: 'tr' | 'en') => {
    if (lang === 'tr') {
      setPreviewLanguage('tr');
      return;
    }

    // Switch to EN
    setPreviewLanguage('en');

    // If we don't have English data yet, or if user forces a refresh (logic could be added), translate.
    // For now, simple check: if null, translate. 
    if (!englishCVData) {
      setIsTranslating(true);
      try {
        const translated = await translateCV(cvData);
        setEnglishCVData(translated);
      } catch (error) {
        alert("Çeviri sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        setPreviewLanguage('tr'); // Revert on error
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const refreshEnglishTranslation = async () => {
    if (confirm("Mevcut Türkçe verilerinizle İngilizce çeviriyi yeniden oluşturmak istiyor musunuz?")) {
      setIsTranslating(true);
      try {
        const translated = await translateCV(cvData);
        setEnglishCVData(translated);
      } catch (error) {
        alert("Çeviri güncellenemedi.");
      } finally {
        setIsTranslating(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Navbar (No Print) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-[100] print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-900 leading-tight">Vico</h1>
                 <p className="text-xs text-slate-500">CV Creator & AI Editor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobilePreviewOpen ? <FileText className="w-5 h-5"/> : <Layout className="w-5 h-5"/>}
              </button>
              
              <button 
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer active:scale-95 transform duration-100"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">PDF İndir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4 md:p-6 lg:p-8 flex gap-8 transition-all duration-300 print:p-0 print:block">
        
        {/* Editor Column (Left) */}
        <div className={`
            print:hidden
            transition-all duration-300 ease-in-out
            overflow-y-auto h-[calc(100vh-140px)]
            ${isEditorFullScreen 
                ? 'w-full block' 
                : `w-full md:w-5/12 lg:w-4/12 xl:w-3/12 ${mobilePreviewOpen ? 'hidden md:block' : 'block'}`
            }
        `}>
           <div className={isEditorFullScreen ? "max-w-4xl mx-auto" : ""}>
               
               {/* Toolbar for Editor - Sticky */}
               <div className="flex justify-between items-center mb-3 sticky top-0 bg-slate-100 py-2 z-10">
                  <h2 className={`font-bold text-slate-700 transition-all ${isEditorFullScreen ? 'text-2xl' : 'text-lg'}`}>
                    Editör
                  </h2>
                    
                  {/* Genişlet/Daralt Butonu - Kaydırma çubuğunun solunda */}
                  <button 
                    onClick={() => setIsEditorFullScreen(!isEditorFullScreen)}
                    className="hidden md:flex p-2 text-slate-600 hover:bg-slate-200 hover:text-primary rounded-lg transition-all items-center gap-2 text-sm font-medium print:hidden"
                    title={isEditorFullScreen ? "Normal Görünüm" : "Geniş Görünüm"}
                  >
                    {isEditorFullScreen ? (
                      <>
                        <Minimize2 className="w-4 h-4" />
                        <span>Daralt</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-4 h-4" />
                        <span>Genişlet</span>
                      </>
                    )}
                  </button>
               </div>

               <div className="mb-4 bg-blue-50 border border-blue-200 p-4 rounded-xl">
                 <h3 className="text-blue-800 font-bold text-sm mb-1 flex items-center gap-2">
                   <BrainCircuit className="w-4 h-4"/> 
                   Vico AI Assistant
                 </h3>
                 <p className="text-blue-700 text-xs mb-2">
                   Profil fotoğrafınızı yükleyin ve Gemini 2.5 ile düzenleyin. Metinlerinizi profesyonelleştirin.
                 </p>
                 <p className="text-blue-800 text-xs font-semibold">
                   Yeni: Türkçe CV'nizden otomatik İngilizce versiyon oluşturun!
                 </p>
               </div>
               
               <CVForm data={cvData} onChange={(newData) => {
                 setCvData(newData);
                 
                 // Automatically sync photo URL to English data if it exists
                 if (englishCVData) {
                    setEnglishCVData(prev => {
                        if (!prev) return null;
                        // Avoid unnecessary updates if photo hasn't changed
                        if (prev.personalInfo.photoUrl === newData.personalInfo.photoUrl) return prev;

                        return {
                            ...prev,
                            personalInfo: {
                                ...prev.personalInfo,
                                photoUrl: newData.personalInfo.photoUrl
                            }
                        };
                    });
                 }
               }} />
           </div>
        </div>

        {/* Preview Column (Right) */}
        <div 
          id="preview-column"
          className={`
            bg-slate-200/50 rounded-2xl p-4 md:p-8 overflow-y-auto h-[calc(100vh-140px)] flex-col items-center 
            transition-all duration-300 ease-in-out
            print:block print:w-full print:h-auto print:bg-white print:p-0 print:overflow-visible print:static
            ${isEditorFullScreen ? 'hidden' : `flex w-full md:w-7/12 lg:w-8/12 xl:w-9/12 ${mobilePreviewOpen ? 'block fixed inset-0 z-40 bg-slate-100 m-0 rounded-none h-full' : 'hidden md:flex'}`}
        `}>
          
          {/* Preview Header / Controls */}
          <div className="w-full max-w-[210mm] flex flex-col md:flex-row gap-3 justify-between items-center mb-4 print:hidden">
             
             {/* Left: Language Toggle */}
             <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
               <button 
                 onClick={() => handleLanguageSwitch('tr')}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${previewLanguage === 'tr' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 Türkçe
               </button>
               <button 
                 onClick={() => handleLanguageSwitch('en')}
                 className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${previewLanguage === 'en' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Globe className="w-3.5 h-3.5" />
                 English
               </button>
             </div>

             {/* Center: Template Selector */}
             <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
               <span className="text-xs font-semibold text-slate-400 px-2 flex items-center gap-1">
                 <Palette className="w-3 h-3" /> Şablon:
               </span>
               <button
                 onClick={() => setSelectedTemplate('classic')}
                 className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'classic' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                 title="Klasik"
               >
                 <LayoutTemplate className="w-4 h-4" />
                 <span className="hidden sm:inline">Klasik</span>
               </button>
               <button
                 onClick={() => setSelectedTemplate('modern')}
                 className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'modern' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                 title="Modern (Sol Sütun)"
               >
                 <div className="flex w-4 h-4 border border-current rounded-sm overflow-hidden opacity-80"><div className="w-1/3 bg-current h-full"></div></div>
                 <span className="hidden sm:inline">Modern</span>
               </button>
               <button
                 onClick={() => setSelectedTemplate('minimalist')}
                 className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedTemplate === 'minimalist' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                 title="Minimalist"
               >
                 <Square className="w-4 h-4" />
                 <span className="hidden sm:inline">Sade</span>
               </button>
             </div>

             {previewLanguage === 'en' && !isTranslating && (
               <button 
                 onClick={refreshEnglishTranslation}
                 className="text-xs text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
               >
                 <BrainCircuit className="w-3 h-3" />
                 Çeviriyi Güncelle
               </button>
             )}
          </div>

          {mobilePreviewOpen && (
             <button 
               onClick={() => setMobilePreviewOpen(false)}
               className="fixed top-4 right-4 bg-white p-3 rounded-full shadow-lg z-50 md:hidden border border-slate-200"
             >
               <X className="w-6 h-6 text-slate-600" />
             </button>
          )}

          {/* Canvas */}
          <div className="relative print:w-full print:h-auto print:static print:transform-none transform scale-[0.85] md:scale-[0.65] lg:scale-[0.75] xl:scale-90 origin-top transition-transform">
             {/* Örnek veri gösterimi bildirimi */}
             {isCVEmpty && !isTranslating && (
               <div className="absolute -top-[103px] left-1/2 transform -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium shadow-sm border border-amber-200 whitespace-nowrap z-10">
                 📝 Şablon önizlemesi - Bilgilerinizi girdiğinizde güncellenecek
               </div>
             )}
             {isTranslating ? (
               <div className="w-[210mm] h-[297mm] bg-white shadow-2xl flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 font-medium animate-pulse">Profesyonel İngilizce CV oluşturuluyor...</p>
                  <p className="text-xs text-slate-400">Gemini 3 Flash modelini kullanıyor</p>
               </div>
             ) : (
               <CVPreview 
                 data={previewLanguage === 'en' && englishCVData ? englishCVData : previewData} 
                 locale={previewLanguage}
                 template={selectedTemplate}
               />
             )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;