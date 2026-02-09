import React, { useState } from 'react';
import { CVData, Experience, Education, Skill, Project, Certificate, Language, Reference, Interest, CustomLink } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, User, Briefcase, GraduationCap, Award, FolderGit2, ScrollText, Languages, Users, Heart, Link as LinkIcon } from 'lucide-react';
import { enhanceText } from '../services/geminiService';
import PhotoEditor from './PhotoEditor';

interface CVFormProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const CVForm: React.FC<CVFormProps> = ({ data, onChange }) => {
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  const updatePersonalInfo = (field: keyof typeof data.personalInfo, value: any) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleEnhanceText = async (text: string, context: string, fieldPath: string, callback: (val: string) => void) => {
    if (!text) return;
    setLoadingField(fieldPath);
    try {
      const improved = await enhanceText(text, context);
      callback(improved);
    } catch (e) {
      alert("Metin iyileştirilemedi.");
    } finally {
      setLoadingField(null);
    }
  };

  // Generic List Handlers
  const addItem = <T extends { id: string }>(listKey: keyof CVData, newItem: T) => {
    onChange({ ...data, [listKey]: [...(data[listKey] as unknown as T[]), newItem] });
  };

  const removeItem = (listKey: keyof CVData, id: string) => {
    onChange({ ...data, [listKey]: (data[listKey] as any[]).filter(item => item.id !== id) });
  };

  const updateItem = (listKey: keyof CVData, id: string, field: string, value: any) => {
    onChange({
      ...data,
      [listKey]: (data[listKey] as any[]).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  // Custom Link Handlers (Nested in Personal Info)
  const addCustomLink = () => {
    const newLink: CustomLink = { id: Date.now().toString(), label: '', url: '' };
    updatePersonalInfo('customLinks', [...data.personalInfo.customLinks, newLink]);
  };

  const removeCustomLink = (id: string) => {
    updatePersonalInfo('customLinks', data.personalInfo.customLinks.filter(l => l.id !== id));
  };

  const updateCustomLink = (id: string, field: keyof CustomLink, value: string) => {
    updatePersonalInfo('customLinks', data.personalInfo.customLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };


  // Specific Add Helpers
  const addExperience = () => addItem<Experience>('experience', { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' });
  const addEducation = () => addItem<Education>('education', { id: Date.now().toString(), degree: '', school: '', startDate: '', endDate: '', description: '' });
  const addSkill = () => addItem<Skill>('skills', { id: Date.now().toString(), name: '', level: 3 });
  const addProject = () => addItem<Project>('projects', { id: Date.now().toString(), name: '', description: '', link: '' });
  const addCertificate = () => addItem<Certificate>('certificates', { id: Date.now().toString(), name: '', issuer: '', date: '', link: '' });
  const addLanguage = () => addItem<Language>('languages', { id: Date.now().toString(), name: '', level: '' });
  const addReference = () => addItem<Reference>('references', { id: Date.now().toString(), name: '', company: '', contact: '' });
  const addInterest = () => addItem<Interest>('interests', { id: Date.now().toString(), name: '' });


  const SectionHeader = ({ id, icon: Icon, title }: { id: string, icon: any, title: string }) => (
    <button
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-4 bg-white border border-slate-200 ${activeSection === id ? 'rounded-t-xl border-b-0' : 'rounded-xl shadow-sm hover:bg-slate-50'} transition-all mb-2`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-semibold text-slate-800">{title}</span>
      </div>
      {activeSection === id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
  );

  return (
    <div className="space-y-4 pb-20">
      
      {/* Personal Info */}
      <div>
        <SectionHeader id="personal" icon={User} title="Kişisel Bilgiler" />
        {activeSection === 'personal' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            
            <PhotoEditor 
              currentPhotoUrl={data.personalInfo.photoUrl} 
              onUpdate={(url) => updatePersonalInfo('photoUrl', url)} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ünvan (Opsiyonel)</label>
                <input 
                  type="text" 
                  value={data.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
                <input 
                  type="email" 
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                <input 
                  type="tel" 
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doğum Tarihi</label>
                <input 
                  type="text" 
                  value={data.personalInfo.birthDate || ''}
                  onChange={(e) => updatePersonalInfo('birthDate', e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                <input 
                  type="text" 
                  value={data.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              
              {/* Social Links & Custom Links */}
              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-800 mb-3">Sosyal Medya & Ekstra Linkler</label>
                
                {/* Standard Socials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <input 
                    placeholder="LinkedIn URL"
                    value={data.personalInfo.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <input 
                    placeholder="GitHub URL"
                    value={data.personalInfo.github || ''}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                {/* Dynamic Custom Links */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Ekstra Linkler (Portfolio, Blog, vb.)</label>
                  {data.personalInfo.customLinks.map((link) => (
                    <div key={link.id} className="flex gap-2">
                       <input 
                          placeholder="Etiket (Örn: Portfolio)"
                          value={link.label}
                          onChange={(e) => updateCustomLink(link.id, 'label', e.target.value)}
                          className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                       />
                       <input 
                          placeholder="URL (https://...)"
                          value={link.url}
                          onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                       />
                       <button 
                        onClick={() => removeCustomLink(link.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
                   <button 
                    onClick={addCustomLink}
                    className="text-sm flex items-center gap-1 text-primary hover:text-blue-700 font-medium mt-1"
                  >
                    <Plus className="w-3 h-3" /> Link Ekle
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 relative pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Profil / Özet</label>
                  <button 
                    onClick={() => handleEnhanceText(data.personalInfo.summary, "Kişisel CV özeti", "summary", (val) => updatePersonalInfo('summary', val))}
                    disabled={loadingField === 'summary'}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                  >
                    {loadingField === 'summary' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                    AI ile İyileştir
                  </button>
                </div>
                <textarea 
                  rows={4}
                  value={data.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div>
        <SectionHeader id="experience" icon={Briefcase} title="İş Deneyimi" />
        {activeSection === 'experience' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                <button 
                  onClick={() => removeItem('experience', exp.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Pozisyon"
                    value={exp.title}
                    onChange={(e) => updateItem('experience', exp.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    placeholder="Şirket"
                    value={exp.company}
                    onChange={(e) => updateItem('experience', exp.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    type="text"
                    placeholder="Başlangıç (YYYY-AA)"
                    value={exp.startDate}
                    onChange={(e) => updateItem('experience', exp.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    type="text"
                    placeholder="Bitiş (YYYY-AA veya Devam)"
                    value={exp.endDate}
                    onChange={(e) => updateItem('experience', exp.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="relative">
                   <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-500">Açıklama</label>
                    <button 
                      onClick={() => handleEnhanceText(exp.description, "İş deneyimi açıklaması", `exp-${exp.id}`, (val) => updateItem('experience', exp.id, 'description', val))}
                      disabled={loadingField === `exp-${exp.id}`}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                    >
                      {loadingField === `exp-${exp.id}` ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                      İyileştir
                    </button>
                  </div>
                  <textarea 
                    rows={3}
                    value={exp.description}
                    onChange={(e) => updateItem('experience', exp.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="Sorumluluklarınızı ve başarılarınızı yazın..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addExperience}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Deneyim Ekle
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <SectionHeader id="projects" icon={FolderGit2} title="Projeler" />
        {activeSection === 'projects' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-6">
            {data.projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative group">
                <button 
                  onClick={() => removeItem('projects', proj.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Proje Adı"
                    value={proj.name}
                    onChange={(e) => updateItem('projects', proj.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium"
                  />
                  <input 
                    placeholder="Proje Linki (opsiyonel)"
                    value={proj.link || ''}
                    onChange={(e) => updateItem('projects', proj.id, 'link', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div className="relative">
                   <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-500">Açıklama</label>
                    <button 
                      onClick={() => handleEnhanceText(proj.description, "Proje detayları ve kullanılan teknolojiler", `proj-${proj.id}`, (val) => updateItem('projects', proj.id, 'description', val))}
                      disabled={loadingField === `proj-${proj.id}`}
                      className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                    >
                      {loadingField === `proj-${proj.id}` ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3" />}
                      İyileştir
                    </button>
                  </div>
                  <textarea 
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateItem('projects', proj.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    placeholder="Kullanılan teknolojiler ve projenin amacı..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addProject}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Proje Ekle
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div>
        <SectionHeader id="education" icon={GraduationCap} title="Eğitim" />
        {activeSection === 'education' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
                <button 
                  onClick={() => removeItem('education', edu.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Bölüm / Derece"
                    value={edu.degree}
                    onChange={(e) => updateItem('education', edu.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    placeholder="Okul / Üniversite"
                    value={edu.school}
                    onChange={(e) => updateItem('education', edu.id, 'school', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    type="text"
                    placeholder="Başlangıç Yılı"
                    value={edu.startDate}
                    onChange={(e) => updateItem('education', edu.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <input 
                    type="text"
                    placeholder="Bitiş Yılı"
                    value={edu.endDate}
                    onChange={(e) => updateItem('education', edu.id, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <textarea 
                  rows={2}
                  value={edu.description}
                  onChange={(e) => updateItem('education', edu.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="Ek açıklama (Not ortalaması, başarılar vb.)"
                />
              </div>
            ))}
             <button 
              onClick={addEducation}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Eğitim Ekle
            </button>
          </div>
        )}
      </div>

      {/* Certificates / Courses */}
      <div>
        <SectionHeader id="certificates" icon={ScrollText} title="Kurslar / Sertifikalar" />
        {activeSection === 'certificates' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-4">
             {data.certificates.map((cert) => (
                 <div key={cert.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative">
                    <button onClick={() => removeItem('certificates', cert.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <input 
                        value={cert.name}
                        onChange={(e) => updateItem('certificates', cert.id, 'name', e.target.value)}
                        placeholder="Kurs/Sertifika Adı"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                      <input 
                        value={cert.issuer}
                        onChange={(e) => updateItem('certificates', cert.id, 'issuer', e.target.value)}
                        placeholder="Kurum / Veren"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input 
                        value={cert.date}
                        onChange={(e) => updateItem('certificates', cert.id, 'date', e.target.value)}
                        placeholder="Tarih / Yıl"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                      <input 
                        value={cert.link || ''}
                        onChange={(e) => updateItem('certificates', cert.id, 'link', e.target.value)}
                        placeholder="Link (opsiyonel)"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                 </div>
               ))}
             <button 
              onClick={addCertificate}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Kurs/Sertifika Ekle
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <SectionHeader id="skills" icon={Award} title="Beceriler" />
        {activeSection === 'skills' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {data.skills.map((skill) => (
                 <div key={skill.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <input 
                      value={skill.name}
                      onChange={(e) => updateItem('skills', skill.id, 'name', e.target.value)}
                      placeholder="Yetenek (örn: Python)"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button onClick={() => removeItem('skills', skill.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             </div>
             <button 
              onClick={addSkill}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Beceri Ekle
            </button>
          </div>
        )}
      </div>

       {/* Interests */}
       <div>
        <SectionHeader id="interests" icon={Heart} title="İlgi Alanları" />
        {activeSection === 'interests' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {data.interests.map((interest) => (
                 <div key={interest.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <input 
                      value={interest.name}
                      onChange={(e) => updateItem('interests', interest.id, 'name', e.target.value)}
                      placeholder="İlgi Alanı (örn: Veri Analizi)"
                      className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button onClick={() => removeItem('interests', interest.id)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             </div>
             <button 
              onClick={addInterest}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> İlgi Alanı Ekle
            </button>
          </div>
        )}
      </div>

      {/* Languages */}
      <div>
        <SectionHeader id="languages" icon={Languages} title="Diller" />
        {activeSection === 'languages' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-4">
             {data.languages.map((lang) => (
                 <div key={lang.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg relative">
                    <input 
                      value={lang.name}
                      onChange={(e) => updateItem('languages', lang.id, 'name', e.target.value)}
                      placeholder="Dil (örn: İngilizce)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                    />
                    <input 
                      value={lang.level}
                      onChange={(e) => updateItem('languages', lang.id, 'level', e.target.value)}
                      placeholder="Seviye (örn: B1)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                    />
                    <button onClick={() => removeItem('languages', lang.id)} className="text-slate-400 hover:text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             <button 
              onClick={addLanguage}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Dil Ekle
            </button>
          </div>
        )}
      </div>

      {/* References */}
      <div>
        <SectionHeader id="references" icon={Users} title="Referanslar" />
        {activeSection === 'references' && (
          <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-sm space-y-4">
             {data.references.map((ref) => (
                 <div key={ref.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative space-y-2">
                    <button onClick={() => removeItem('references', ref.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <input 
                      value={ref.name}
                      onChange={(e) => updateItem('references', ref.id, 'name', e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        value={ref.company}
                        onChange={(e) => updateItem('references', ref.id, 'company', e.target.value)}
                        placeholder="Şirket / Pozisyon"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                      <input 
                        value={ref.contact}
                        onChange={(e) => updateItem('references', ref.id, 'contact', e.target.value)}
                        placeholder="İletişim (Tel/Email)"
                        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
                      />
                    </div>
                 </div>
               ))}
             <button 
              onClick={addReference}
              className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Referans Ekle
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default CVForm;