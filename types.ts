
export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5, though the new template might just list them
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string; // Used for "Provider" in new template often
  link?: string; // Optional certificate/course link
}

export interface Language {
  id: string;
  name: string;
  level: string; // "Başlangıç", "Orta", "İleri", "Anadil" vb.
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  contact: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface CustomLink {
  id: string;
  label: string; // e.g., "Portfolio", "Medium", "ArtStation"
  url: string;
}

export type CVTemplate = 'classic' | 'modern' | 'minimalist';

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    title: string;
    summary: string;
    photoUrl?: string;
    linkedin?: string;
    github?: string;
    customLinks: CustomLink[]; // Replaces fixed website field
    birthDate?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[]; // Mapped to "Kurslar"
  languages: Language[];
  references: Reference[];
  interests: Interest[];
}

export const INITIAL_CV_DATA: CVData = {
  personalInfo: {
    fullName: "",
    title: "", 
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    summary: "",
    photoUrl: "", 
    linkedin: "",
    github: "",
    customLinks: []
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  references: [],
  interests: []
};

// Şablonların nasıl göründüğünü göstermek için örnek veriler
export const SAMPLE_CV_DATA: CVData = {
  personalInfo: {
    fullName: "Ahmet Yılmaz",
    title: "Yazılım Geliştirici", 
    email: "ahmet.yilmaz@email.com",
    phone: "0532 123 4567",
    address: "İstanbul, Türkiye",
    birthDate: "15-06-1995",
    summary: "5 yıllık deneyime sahip yazılım geliştirici. Modern web teknolojileri, React, Node.js ve Python konularında uzmanım. Takım çalışmasına yatkın, problem çözme odaklı ve sürekli öğrenmeye açık bir profesyonelim.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", 
    linkedin: "linkedin.com/in/ahmetyilmaz",
    github: "github.com/ahmetyilmaz",
    customLinks: [
      { id: "1", label: "Portfolio", url: "ahmetyilmaz.dev" }
    ]
  },
  experience: [
    {
      id: "1",
      title: "Senior Yazılım Geliştirici",
      company: "Tech Solutions A.Ş., İstanbul",
      startDate: "2022",
      endDate: "Hâlen",
      description: "React ve Node.js ile kurumsal web uygulamaları geliştirdim. Takım liderliği yaparak 5 kişilik ekibi yönettim."
    },
    {
      id: "2",
      title: "Yazılım Geliştirici",
      company: "Digital Agency, Ankara",
      startDate: "2019",
      endDate: "2022",
      description: "E-ticaret platformları ve mobil uygulamalar için backend servisleri geliştirdim."
    }
  ],
  education: [
    {
      id: "1",
      degree: "Lisans - Bilgisayar Mühendisliği",
      school: "İstanbul Teknik Üniversitesi",
      startDate: "2014",
      endDate: "2018",
      description: "3.45 GPA ile mezun"
    }
  ],
  skills: [
    { id: "1", name: "JavaScript/TypeScript", level: 5 },
    { id: "2", name: "React & Next.js", level: 5 },
    { id: "3", name: "Node.js", level: 4 },
    { id: "4", name: "Python", level: 4 },
    { id: "5", name: "SQL & NoSQL", level: 4 },
    { id: "6", name: "Git & CI/CD", level: 4 }
  ],
  projects: [
    {
      id: "1",
      name: "E-Ticaret Platformu",
      description: "React ve Node.js ile geliştirilen tam kapsamlı e-ticaret çözümü.",
      link: "github.com/ahmetyilmaz/ecommerce"
    }
  ],
  certificates: [
    {
      id: "1",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023"
    },
    {
      id: "2",
      name: "React Advanced Patterns",
      issuer: "Frontend Masters",
      date: "2022"
    }
  ],
  languages: [
    { id: "1", name: "Türkçe", level: "Anadil" },
    { id: "2", name: "İngilizce", level: "C1 - İleri" }
  ],
  references: [],
  interests: [
    { id: "1", name: "Açık kaynak projeleri" },
    { id: "2", name: "Yapay zeka" },
    { id: "3", name: "Teknoloji blogları" }
  ]
};
