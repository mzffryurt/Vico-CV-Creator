import React from 'react';
import { CVData, CVTemplate } from '../types';
import { User, BookOpen, Cpu, Award, Globe, MessageCircle, Briefcase, Mail, Phone, MapPin, Calendar, Link as LinkIcon, Linkedin, Github, Heart } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  locale?: 'tr' | 'en';
  template?: CVTemplate;
}

// Dictionary Helper
const getLabels = (locale: 'tr' | 'en') => {
  const dictionary = {
    tr: {
      personal: "KİŞİSEL",
      profile: "Profil",
      education: "Eğitim",
      experience: "İş Deneyimi",
      skills: "Beceriler",
      courses: "Kurslar",
      interests: "İlgi Alanları",
      languages: "Diller",
      projects: "Projeler",
      references: "Referanslar",
      contact: "İletişim",
      labels: {
        name: "Ad Soyad",
        phone: "Telefon",
        email: "E-posta",
        address: "Adres",
        birthDate: "Doğum Tarihi",
        github: "GitHub",
        linkedin: "LinkedIn"
      }
    },
    en: {
      personal: "PERSONAL",
      profile: "Profile",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      courses: "Courses",
      interests: "Interests",
      languages: "Languages",
      projects: "Projects",
      references: "References",
      contact: "Contact",
      labels: {
        name: "Name",
        phone: "Phone",
        email: "Email",
        address: "Address",
        birthDate: "Date of Birth",
        github: "GitHub",
        linkedin: "LinkedIn"
      }
    }
  };
  return dictionary[locale];
};

// --- ATS Helper: Screen Reader Only Text ---
const SrOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0,0,0,0)' }}>
    {children}
  </span>
);

// --- Common Components ---
const LinkText = ({ value }: { value: string }) => (
  <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
    {value.replace(/^https?:\/\/(www\.)?/, '')}
  </a>
);

interface PersonalInfoRowProps {
  label: string;
  value: string;
  isLink?: boolean;
}

const PersonalInfoRow: React.FC<PersonalInfoRowProps> = ({ label, value, isLink = false }) => {
  if (!value) return null;
  return (
    <div className="flex text-[10.5pt] py-0.5 border-b border-gray-50 last:border-0" role="listitem">
      <dt className="w-40 font-semibold text-gray-700 flex-shrink-0">{label}</dt>
      <dd className="font-medium text-gray-900 flex-1 min-w-0">
        {isLink ? <LinkText value={value} /> : <span className="break-words block">{value}</span>}
      </dd>
    </div>
  );
};

// --- TEMPLATE 1: CLASSIC ---
const ClassicLayout = ({ data, t, locale }: { data: CVData, t: any, locale: 'tr' | 'en' }) => {
  const SectionHeader = ({ icon: Icon, title, id }: { icon: any, title: string, id: string }) => (
    <header className="bg-[#f3f4f6] -mx-[6mm] px-[6mm] py-1 mb-2 mt-2 flex items-center gap-2 border-l-4 border-gray-400 print:bg-gray-100 print:border-gray-800">
      <Icon className="w-4 h-4 text-gray-800" aria-hidden="true" />
      <h2 id={id} className="text-gray-800 font-bold text-[12pt] tracking-wider">{title.toLocaleUpperCase(locale === 'tr' ? 'tr-TR' : 'en-US')}</h2>
    </header>
  );

  return (
    <article className="w-full h-full font-sans text-gray-800 leading-snug p-[10mm] pt-[5mm] flex flex-col min-h-full" itemScope itemType="https://schema.org/Person">
      {/* ATS: Gizli semantik bilgiler */}
      <SrOnly>
        <h1>{data.personalInfo.fullName} - CV / Resume</h1>
        <meta itemProp="name" content={data.personalInfo.fullName} />
        <meta itemProp="email" content={data.personalInfo.email} />
        <meta itemProp="telephone" content={data.personalInfo.phone} />
        <meta itemProp="jobTitle" content={data.personalInfo.title} />
      </SrOnly>

      {/* Header */}
      <header className="flex items-center gap-5 mb-5">
        {data.personalInfo.photoUrl && (
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shrink-0 shadow-sm print:border-gray-400">
            <img src={data.personalInfo.photoUrl} alt={`${data.personalInfo.fullName} profil fotoğrafı`} className="w-full h-full object-cover" itemProp="image"/>
          </div>
        )}
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight uppercase mb-1" itemProp="name">{data.personalInfo.fullName}</h1>
           {data.personalInfo.title && <p className="text-lg text-gray-600 font-medium" itemProp="jobTitle">{data.personalInfo.title}</p>}
        </div>
      </header>

      <section className="mb-2" aria-labelledby="personal-section">
        <SectionHeader icon={User} title={t.personal} id="personal-section" />
        <dl className="flex flex-col px-1" role="list">
          <PersonalInfoRow label={t.labels.name} value={data.personalInfo.fullName} />
          <PersonalInfoRow label={t.labels.phone} value={data.personalInfo.phone} />
          <PersonalInfoRow label={t.labels.email} value={data.personalInfo.email} />
          <PersonalInfoRow label={t.labels.address} value={data.personalInfo.address} />
          <PersonalInfoRow label={t.labels.birthDate} value={data.personalInfo.birthDate || ''} />
          <PersonalInfoRow label={t.labels.github} value={data.personalInfo.github || ''} isLink />
          <PersonalInfoRow label={t.labels.linkedin} value={data.personalInfo.linkedin || ''} isLink />
          {data.personalInfo.customLinks.map(link => (
             <PersonalInfoRow key={link.id} label={link.label} value={link.url} isLink />
          ))}
        </dl>
      </section>

      {data.personalInfo.summary && (
        <section className="mb-2" aria-labelledby="profile-section">
          <SectionHeader icon={User} title={t.profile} id="profile-section" />
          <p className="text-[10.5pt] text-gray-700 leading-relaxed text-justify px-1" itemProp="description">{data.personalInfo.summary}</p>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-2" aria-labelledby="education-section">
          <SectionHeader icon={BookOpen} title={t.education} id="education-section" />
          <div className="space-y-3 px-1">
            {data.education.map((edu) => (
              <article key={edu.id} itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 text-[10.5pt] uppercase" itemProp="name">{edu.degree}</h3>
                  <time className="text-[9.5pt] text-gray-600 whitespace-nowrap ml-4 font-medium">{edu.startDate} - {edu.endDate}</time>
                </div>
                <div className="text-[10.5pt] text-gray-700 italic" itemProp="educationalLevel">{edu.school}</div>
                {edu.description && <p className="text-[10.5pt] text-gray-500 mt-0.5" itemProp="description">{edu.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {data.experience.length > 0 && (
         <section className="mb-2" aria-labelledby="experience-section">
           <SectionHeader icon={Briefcase} title={t.experience} id="experience-section" />
           <div className="space-y-3 px-1">
             {data.experience.map((exp) => (
               <article key={exp.id} itemScope itemType="https://schema.org/WorkExperience">
                 <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-800 text-[10.5pt] uppercase" itemProp="jobTitle">{exp.title}</h3>
                    <time className="text-[9.5pt] text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</time>
                 </div>
                 <div className="text-[10.5pt] text-gray-700 italic mb-1" itemProp="worksFor">{exp.company}</div>
                 <p className="text-[10.5pt] text-gray-600 leading-snug" itemProp="description">{exp.description}</p>
               </article>
             ))}
           </div>
         </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-2" aria-labelledby="skills-section">
          <SectionHeader icon={Cpu} title={t.skills} id="skills-section" />
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2 px-1 list-none">
            {data.skills.map((skill) => (
              <li key={skill.id} className="border-b border-gray-100 pb-1" itemProp="knowsAbout">
                <span className="text-[10.5pt] font-bold text-gray-700">{skill.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.certificates.length > 0 && (
        <section className="mb-2" aria-labelledby="courses-section">
          <SectionHeader icon={Award} title={t.courses} id="courses-section" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-1">
            {data.certificates.map((cert) => (
              <article key={cert.id} itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                <div className="flex justify-between items-start">
                  <h3 className="text-[10.5pt] font-bold text-gray-800 leading-tight" itemProp="name">
                    {cert.name}
                    {cert.link && <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 font-normal no-underline hover:underline text-[9.5pt]" itemProp="url">(Link)</a>}
                  </h3>
                  {cert.date && <time className="text-[9.5pt] text-gray-600 whitespace-nowrap ml-2 font-medium">{cert.date}</time>}
                </div>
                <div className="text-[9.5pt] text-gray-600 italic" itemProp="issuedBy">{cert.issuer}</div>
              </article>
            ))}
          </div>
        </section>
      )}
      
      <div className="grid grid-cols-2 gap-x-16 gap-y-2 mt-2 mb-2">
          {data.interests.length > 0 && (
            <section aria-labelledby="interests-section">
              <SectionHeader icon={Heart} title={t.interests} id="interests-section" />
              <ul className="px-1 text-[10.5pt] text-gray-700 leading-normal list-none">
                <SrOnly>{t.interests}: </SrOnly>
                {data.interests.map((i, idx) => (
                  <li key={i.id} className="inline">
                    <span itemProp="seeks">{i.name}</span>
                    {idx < data.interests.length - 1 && ', '}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.languages.length > 0 && (
            <section aria-labelledby="languages-section">
              <SectionHeader icon={Globe} title={t.languages} id="languages-section" />
              <dl className="space-y-1 px-1">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between" itemScope itemType="https://schema.org/Language">
                     <dt className="text-[10.5pt] font-bold text-gray-700" itemProp="name">{lang.name}</dt>
                     <dd className="text-[10.5pt] text-gray-600 italic" itemProp="proficiencyLevel">{lang.level}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
      </div>

       {data.projects.length > 0 && (
         <section className="mt-2" aria-labelledby="projects-section">
           <SectionHeader icon={Cpu} title={t.projects} id="projects-section" />
           <div className="space-y-2 px-1">
             {data.projects.map((proj) => (
               <article key={proj.id} itemScope itemType="https://schema.org/CreativeWork">
                 <h3 className="text-[10.5pt] font-bold text-gray-800" itemProp="name">
                    {proj.name} 
                    {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 font-normal no-underline hover:underline text-[9.5pt]" itemProp="url">(Link)</a>}
                 </h3>
                 <p className="text-[10.5pt] text-gray-600 leading-tight" itemProp="description">{proj.description}</p>
               </article>
             ))}
           </div>
         </section>
      )}

      {data.references.length > 0 && (
         <section className="mt-2" aria-labelledby="references-section">
           <SectionHeader icon={MessageCircle} title={t.references} id="references-section" />
           <div className="grid grid-cols-2 gap-4 px-1">
             {data.references.map((ref) => (
               <article key={ref.id} itemScope itemType="https://schema.org/Person">
                 <h3 className="text-[10.5pt] font-bold text-gray-800" itemProp="name">{ref.name}</h3>
                 <div className="text-[9.5pt] text-gray-600" itemProp="worksFor">{ref.company}</div>
                 <div className="text-[9.5pt] text-gray-500" itemProp="email">{ref.contact}</div>
               </article>
             ))}
           </div>
         </section>
      )}

      <div className="flex-grow bg-[#f3f4f6] -mx-[10mm] mt-4 print:bg-gray-100" aria-hidden="true"></div>
    </article>
  );
};

// --- TEMPLATE 2: MODERN (Sidebar) ---
const ModernLayout = ({ data, t, locale }: { data: CVData, t: any, locale: 'tr' | 'en' }) => {
  const toUpper = (text: string) => text.toLocaleUpperCase(locale === 'tr' ? 'tr-TR' : 'en-US');
  
  return (
    <article className="w-full min-h-[297mm] flex bg-white font-sans" itemScope itemType="https://schema.org/Person">
      {/* ATS: Gizli semantik bilgiler */}
      <SrOnly>
        <h1>{data.personalInfo.fullName} - CV / Resume</h1>
        <meta itemProp="name" content={data.personalInfo.fullName} />
        <meta itemProp="email" content={data.personalInfo.email} />
        <meta itemProp="telephone" content={data.personalInfo.phone} />
        <meta itemProp="jobTitle" content={data.personalInfo.title} />
      </SrOnly>

      {/* Left Sidebar */}
      <aside className="w-[32%] bg-[#1e293b] text-white p-[8mm] flex flex-col gap-6 print:bg-[#1e293b] print:text-white">
        
        {/* Photo & Name */}
        <header className="flex flex-col items-center text-center">
          {data.personalInfo.photoUrl && (
            <div className="w-32 h-32 rounded-full border-4 border-[#334155] overflow-hidden mb-4 shadow-lg">
              <img src={data.personalInfo.photoUrl} alt={`${data.personalInfo.fullName} profil fotoğrafı`} className="w-full h-full object-cover" itemProp="image"/>
            </div>
          )}
          <h1 className="text-xl font-bold tracking-wide mb-1" itemProp="name">{toUpper(data.personalInfo.fullName)}</h1>
          <p className="text-sm text-gray-300 font-medium" itemProp="jobTitle">{data.personalInfo.title}</p>
        </header>

        {/* Contact Info */}
        <section className="text-[9pt] flex flex-col gap-3 mt-2" aria-labelledby="sidebar-contact">
            <h2 id="sidebar-contact" className="tracking-widest text-xs font-bold border-b border-gray-600 pb-1 text-gray-400">{toUpper(t.personal)}</h2>
            {data.personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <span className="break-all" itemProp="email">{data.personalInfo.email}</span></div>}
            {data.personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <span itemProp="telephone">{data.personalInfo.phone}</span></div>}
            {data.personalInfo.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <span itemProp="address">{data.personalInfo.address}</span></div>}
            {data.personalInfo.birthDate && <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <time itemProp="birthDate">{data.personalInfo.birthDate}</time></div>}
            {data.personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <LinkText value={data.personalInfo.linkedin}/></div>}
            {data.personalInfo.github && <div className="flex items-center gap-2"><Github className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/> <LinkText value={data.personalInfo.github}/></div>}
            
            {data.personalInfo.customLinks.map(link => (
                <div key={link.id} className="flex items-center gap-2">
                   <LinkIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true"/>
                   <div className="flex flex-col leading-none">
                     <span className="text-[7pt] text-gray-400 uppercase tracking-wider">{link.label}</span>
                     <LinkText value={link.url}/>
                   </div>
                </div>
            ))}
        </section>

        {/* Skills */}
        {data.skills.length > 0 && (
          <section aria-labelledby="sidebar-skills">
            <h2 id="sidebar-skills" className="tracking-widest text-xs font-bold border-b border-gray-600 pb-1 text-gray-400 mb-3">{toUpper(t.skills)}</h2>
            <ul className="flex flex-wrap gap-2 list-none">
              {data.skills.map(s => (
                <li key={s.id} className="bg-[#334155] px-2 py-1 rounded text-[9pt]" itemProp="knowsAbout">{s.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <section aria-labelledby="sidebar-languages">
            <h2 id="sidebar-languages" className="tracking-widest text-xs font-bold border-b border-gray-600 pb-1 text-gray-400 mb-3">{toUpper(t.languages)}</h2>
            <dl className="flex flex-col gap-1.5 text-[9.5pt]">
              {data.languages.map(l => (
                <div key={l.id} className="flex justify-between" itemScope itemType="https://schema.org/Language">
                  <dt itemProp="name">{l.name}</dt>
                  <dd className="text-gray-400 text-xs" itemProp="proficiencyLevel">{l.level}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

         {/* Interests */}
         {data.interests.length > 0 && (
          <section aria-labelledby="sidebar-interests">
            <h2 id="sidebar-interests" className="tracking-widest text-xs font-bold border-b border-gray-600 pb-1 text-gray-400 mb-3">{toUpper(t.interests)}</h2>
            <ul className="flex flex-col gap-1 text-[9.5pt] list-none">
              {data.interests.map(i => <li key={i.id} itemProp="seeks">• {i.name}</li>)}
            </ul>
          </section>
        )}

        {/* References */}
        {data.references.length > 0 && (
          <section aria-labelledby="sidebar-references">
            <h2 id="sidebar-references" className="tracking-widest text-xs font-bold border-b border-gray-600 pb-1 text-gray-400 mb-3">{toUpper(t.references)}</h2>
            <div className="flex flex-col gap-3 text-[9pt]">
              {data.references.map(ref => (
                <article key={ref.id} itemScope itemType="https://schema.org/Person">
                  <h3 className="font-semibold" itemProp="name">{ref.name}</h3>
                  <div className="text-gray-400 text-[8pt]" itemProp="worksFor">{ref.company}</div>
                  <div className="text-gray-300 text-[8pt]" itemProp="email">{ref.contact}</div>
                </article>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Right Content */}
      <main className="w-[68%] p-[8mm] text-gray-800">
        
        {/* Profile */}
        {data.personalInfo.summary && (
          <section className="mb-6" aria-labelledby="main-profile">
            <h2 id="main-profile" className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-3">{toUpper(t.profile)}</h2>
            <p className="text-[10pt] leading-relaxed text-slate-600" itemProp="description">{data.personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6" aria-labelledby="main-experience">
            <h2 id="main-experience" className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">{toUpper(t.experience)}</h2>
            <div className="flex flex-col gap-5">
              {data.experience.map(exp => (
                <article key={exp.id} itemScope itemType="https://schema.org/WorkExperience">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[11pt] text-slate-900" itemProp="jobTitle">{exp.title}</h3>
                    <time className="text-xs font-medium text-slate-500">{exp.startDate} - {exp.endDate}</time>
                  </div>
                  <div className="text-[10pt] text-slate-600 italic mb-2 font-medium" itemProp="worksFor">{exp.company}</div>
                  <p className="text-[10pt] leading-snug text-slate-600" itemProp="description">{exp.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6" aria-labelledby="main-education">
            <h2 id="main-education" className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">{toUpper(t.education)}</h2>
            <div className="flex flex-col gap-4">
              {data.education.map(edu => (
                <article key={edu.id} itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[11pt] text-slate-900" itemProp="name">{edu.degree}</h3>
                    <time className="text-xs font-semibold text-slate-500">{edu.startDate} - {edu.endDate}</time>
                  </div>
                  <div className="text-[10pt] text-slate-600 italic" itemProp="educationalLevel">{edu.school}</div>
                  {edu.description && <p className="text-[9.5pt] text-slate-500 mt-1" itemProp="description">{edu.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Certificates Grid */}
        <div className="grid grid-cols-1 gap-6">
          {data.projects.length > 0 && (
            <section aria-labelledby="main-projects">
              <h2 id="main-projects" className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-3">{toUpper(t.projects)}</h2>
              <div className="space-y-3">
                 {data.projects.map(proj => (
                   <article key={proj.id} itemScope itemType="https://schema.org/CreativeWork">
                     <h3 className="font-bold text-[10.5pt] text-slate-800" itemProp="name">{proj.name} {proj.link && <LinkText value={proj.link}/>}</h3>
                     <p className="text-[9.5pt] text-slate-600" itemProp="description">{proj.description}</p>
                   </article>
                 ))}
              </div>
            </section>
          )}
          
          {data.certificates.length > 0 && (
            <section aria-labelledby="main-courses">
              <h2 id="main-courses" className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-3">{toUpper(t.courses)}</h2>
              <div className="space-y-2">
                 {data.certificates.map(cert => (
                   <article key={cert.id} className="text-[10pt]" itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                     <div className="flex justify-between items-start">
                       <h3 className="font-medium text-slate-800" itemProp="name">
                         {cert.name}
                         {cert.link && <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noreferrer" className="ml-2 text-blue-600 font-normal no-underline hover:underline text-[9pt]" itemProp="url">(Link)</a>}
                       </h3>
                       {cert.date && <time className="text-xs text-slate-500 whitespace-nowrap ml-2">{cert.date}</time>}
                     </div>
                     <div className="text-slate-500 italic text-sm" itemProp="issuedBy">{cert.issuer}</div>
                   </article>
                 ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </article>
  );
};

// --- TEMPLATE 3: MINIMALIST (Clean, Centered) ---
const MinimalistLayout = ({ data, t, locale }: { data: CVData, t: any, locale: 'tr' | 'en' }) => {
  const Header = ({ title, id }: { title: string, id: string }) => (
    <h2 id={id} className="text-sm font-bold tracking-[0.15em] border-b border-black pb-1 mb-4 mt-6 text-center text-gray-900">
      {title.toLocaleUpperCase(locale === 'tr' ? 'tr-TR' : 'en-US')}
    </h2>
  );

  return (
    <article className="w-full h-full font-sans text-gray-900 bg-white p-[12mm] text-center" itemScope itemType="https://schema.org/Person">
      {/* ATS: Gizli semantik bilgiler */}
      <SrOnly>
        <h1>{data.personalInfo.fullName} - CV / Resume</h1>
        <meta itemProp="name" content={data.personalInfo.fullName} />
        <meta itemProp="email" content={data.personalInfo.email} />
        <meta itemProp="telephone" content={data.personalInfo.phone} />
        <meta itemProp="jobTitle" content={data.personalInfo.title} />
      </SrOnly>
      
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-light uppercase tracking-widest mb-2 text-black" itemProp="name">{data.personalInfo.fullName}</h1>
        {data.personalInfo.title && <p className="text-sm font-medium tracking-wide text-gray-600 mb-3 uppercase" itemProp="jobTitle">{data.personalInfo.title}</p>}
        
        <address className="text-[9pt] flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 leading-none not-italic">
          {data.personalInfo.email && <span itemProp="email">{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span className="border-l border-gray-400 pl-4" itemProp="telephone">{data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span className="border-l border-gray-400 pl-4" itemProp="address">{data.personalInfo.address}</span>}
          {data.personalInfo.linkedin && <span className="border-l border-gray-400 pl-4"><LinkText value={data.personalInfo.linkedin}/></span>}
          {data.personalInfo.github && <span className="border-l border-gray-400 pl-4"><LinkText value={data.personalInfo.github}/></span>}
          {data.personalInfo.customLinks.map(link => (
             <span key={link.id} className="border-l border-gray-400 pl-4">
               <span className="font-semibold">{link.label}:</span> <LinkText value={link.url}/>
             </span>
          ))}
        </address>
      </header>

      {/* Profile */}
      {data.personalInfo.summary && (
        <section className="mb-4 text-left" aria-labelledby="min-profile">
           <SrOnly><h2 id="min-profile">{t.profile}</h2></SrOnly>
           <p className="text-[10pt] leading-relaxed text-gray-700" itemProp="description">{data.personalInfo.summary}</p>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="text-left" aria-labelledby="min-education">
          <Header title={t.education} id="min-education" />
          <div className="space-y-4">
            {data.education.map(edu => (
              <article key={edu.id} itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                <div className="flex justify-between items-end mb-0.5">
                  <h3 className="font-bold text-[10.5pt]" itemProp="educationalLevel">{edu.school}</h3>
                  <time className="text-[9.5pt] italic">{edu.startDate} - {edu.endDate}</time>
                </div>
                <div className="flex justify-between text-[10pt]">
                  <span itemProp="name">{edu.degree}</span>
                </div>
                {edu.description && <p className="text-[9.5pt] text-gray-600 mt-1" itemProp="description">{edu.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="text-left" aria-labelledby="min-experience">
          <Header title={t.experience} id="min-experience" />
          <div className="space-y-5">
            {data.experience.map(exp => (
              <article key={exp.id} itemScope itemType="https://schema.org/WorkExperience">
                <div className="flex justify-between items-end mb-0.5">
                  <h3 className="font-bold text-[10.5pt]" itemProp="worksFor">{exp.company}</h3>
                  <time className="text-[9.5pt] italic">{exp.startDate} - {exp.endDate}</time>
                </div>
                <div className="text-[10pt] font-medium mb-1" itemProp="jobTitle">{exp.title}</div>
                <p className="text-[10pt] leading-snug text-gray-700" itemProp="description">{exp.description}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-0 text-left">
        {/* 1. Projeler (Sol) */}
        {data.projects.length > 0 && (
          <section aria-labelledby="min-projects">
            <Header title={t.projects} id="min-projects" />
            <div className="space-y-3">
              {data.projects.map(proj => (
                <article key={proj.id} itemScope itemType="https://schema.org/CreativeWork">
                  <h3 className="text-[10pt] font-bold" itemProp="name">{proj.name}</h3>
                  <p className="text-[9.5pt] text-gray-700" itemProp="description">{proj.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 2. Kurslar (Sağ) */}
        {data.certificates.length > 0 && (
          <section aria-labelledby="min-courses">
            <Header title={t.courses} id="min-courses" />
            <div className="space-y-1">
              {data.certificates.map(cert => (
                <article key={cert.id} className="text-[10pt]" itemScope itemType="https://schema.org/EducationalOccupationalCredential">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium" itemProp="name">{cert.name}</h3>
                    {cert.date && <time className="text-[9pt] text-gray-500 whitespace-nowrap ml-2">{cert.date}</time>}
                  </div>
                  <div>
                    <span className="text-gray-500" itemProp="issuedBy">- {cert.issuer}</span>
                    {cert.link && <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noreferrer" className="ml-1 text-blue-600 no-underline hover:underline text-[9pt]" itemProp="url">(Link)</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 3. Beceriler (Sol) */}
        {data.skills.length > 0 && (
          <section aria-labelledby="min-skills">
            <Header title={t.skills} id="min-skills" />
            <ul className="text-[10pt] leading-normal list-none">
              {data.skills.map((s, idx) => (
                <li key={s.id} className="inline" itemProp="knowsAbout">
                  {s.name}{idx < data.skills.length - 1 && ' • '}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 4. Diller (Sağ) */}
        {data.languages.length > 0 && (
          <section aria-labelledby="min-languages">
            <Header title={t.languages} id="min-languages" />
            <dl className="text-[10pt] list-none space-y-1">
              {data.languages.map(l => (
                <div key={l.id} itemScope itemType="https://schema.org/Language">
                  <dt className="inline font-semibold" itemProp="name">{l.name}:</dt>
                  <dd className="inline" itemProp="proficiencyLevel"> {l.level}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* 5. İlgi Alanları (Sol) */}
        {data.interests.length > 0 && (
          <section aria-labelledby="min-interests">
            <Header title={t.interests} id="min-interests" />
            <ul className="text-[10pt] leading-normal list-none">
              {data.interests.map((i, idx) => (
                <li key={i.id} className="inline" itemProp="seeks">
                  {i.name}{idx < data.interests.length - 1 && ' • '}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 6. Referanslar (Sağ) */}
        {data.references.length > 0 && (
          <section aria-labelledby="min-references">
            <Header title={t.references} id="min-references" />
            <div className="space-y-2">
              {data.references.map(ref => (
                <article key={ref.id} className="text-[10pt]" itemScope itemType="https://schema.org/Person">
                  <h3 className="font-bold" itemProp="name">{ref.name}</h3>
                  <div className="text-gray-600 text-[9pt]" itemProp="worksFor">{ref.company}</div>
                  <div className="text-gray-500 text-[9pt]" itemProp="email">{ref.contact}</div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
      
    </article>
  );
};


const CVPreview: React.FC<CVPreviewProps> = ({ data, locale = 'tr', template = 'classic' }) => {
  const t = getLabels(locale as 'tr' | 'en');

  return (
    <div 
      id="printable-cv-paper"
      className="w-full bg-white shadow-2xl print:shadow-none mx-auto overflow-hidden print:overflow-visible relative" 
      style={{ width: '210mm', minHeight: '297mm' }}
      role="document"
      aria-label="CV Önizleme"
    >
      {template === 'classic' && <ClassicLayout data={data} t={t} locale={locale as 'tr' | 'en'} />}
      {template === 'modern' && <ModernLayout data={data} t={t} locale={locale as 'tr' | 'en'} />}
      {template === 'minimalist' && <MinimalistLayout data={data} t={t} locale={locale as 'tr' | 'en'} />}
    </div>
  );
};

export default CVPreview;