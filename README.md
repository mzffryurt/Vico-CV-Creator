<div align="center">
  <h1>🚀 Vico CV Creator</h1>
  <p>
    <strong>Yapay Zeka Destekli, ATS Uyumlu Profesyonel Özgeçmiş Oluşturucu</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-bard&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=for-the-badge" alt="License" />
  </p>
</div>

<br />

## 📖 Proje Hakkında

Vico CV Creator, kullanıcıların bilgilerini girerek saniyeler içinde ATS uyumlu CV'ler oluşturmasını sağlar. **Google Gemini API** entegrasyonu sayesinde CV içeriğinizi otomatik olarak İngilizceye çevirir, dil bilgisi hatalarını düzeltir ve metinlerinizi profesyonelleştirir.

---

## ✨ Öne Çıkan Özellikler

| Özellik | Açıklama |
| :--- | :--- |
| 🤖 **Yapay Zeka Çeviri** | Google Gemini API ile Türkçe verileri profesyonel İngilizceye çevirir. |
| ✨ **AI Fotoğraf Düzenleme** | Profil fotoğraflarını CV standartlarına uygun hale getiren akıllı araçlar. |
| 📄 **ATS Uyumluluğu** | Aday Takip Sistemleri (ATS) tarafından %100 okunabilir formatta çıktı üretir. |
| 🎨 **3 Farklı Şablon** | Klasik, Modern ve Minimalist şablon seçenekleri. |
| 📱 **Responsive Tasarım** | Mobil ve masaüstü cihazlarda sorunsuz çalışır. |
| 🖨️ **PDF Export** | Tek tıkla profesyonel PDF indirin. |

---

## 🛠️ Teknoloji Mimarisi

| Kategori | Teknoloji |
|----------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite + ESBuild |
| **Styling** | Tailwind CSS |
| **AI** | Google Gemini API (`@google/genai`) |
| **Icons** | Lucide React |

---

## 📦 Gereksinimler

| Gereksinim | Minimum Sürüm | İndirme |
|------------|---------------|---------|
| **Node.js** | v18.0.0 | [nodejs.org](https://nodejs.org/) |
| **npm** | v9.0.0 | Node.js ile birlikte gelir |
| **Git** | v2.0.0 | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/mzffryurt/Vico-CV-Creator.git
cd Vico-CV-Creator
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

Proje kök dizininde `.env.local` dosyası oluşturun:

```bash
# Windows (PowerShell)
New-Item -Path ".env.local" -ItemType File
```

Dosyaya Gemini API anahtarınızı ekleyin:

```env
VITE_GEMINI_API_KEY=buraya_api_anahtarinizi_yapistirin
```

> 🔑 **API Anahtarı Nasıl Alınır?**
> 1. [Google AI Studio](https://aistudio.google.com/) adresine gidin
> 2. Google hesabınızla giriş yapın
> 3. "Get API Key" butonuna tıklayın

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

### 5. Tarayıcıda Açın

```
http://localhost:5173
```

---

## 📖 Kullanım

1. **CV Bilgilerini Girin** — Sol paneldeki form alanlarını doldurun
2. **Şablon Seçin** — Üst menüden Klasik, Modern veya Minimalist şablonu seçin
3. **AI Çevirisi** — "English" butonuna tıklayarak CV'nizi İngilizceye çevirin
4. **PDF İndirin** — "PDF İndir" butonuyla CV'nizi kaydedin

---

## 📁 Proje Yapısı

```
Vico-CV-Creator/
├── components/
│   ├── CVForm.tsx          # CV düzenleme formu
│   ├── CVPreview.tsx       # CV önizleme (3 şablon)
│   └── PhotoEditor.tsx     # AI fotoğraf editörü
├── services/
│   └── geminiService.ts    # Gemini API entegrasyonu
├── App.tsx                 # Ana uygulama bileşeni
├── index.tsx               # React entry point
├── types.ts                # TypeScript tip tanımları
├── index.html              # HTML template
├── index.css               # Global stiller
├── vite.config.ts          # Vite yapılandırması
├── package.json            # Proje bağımlılıkları
├── .env.local              # API anahtarı (gitignore)
└── README.md               # Bu dosya
```

---

## 🧪 Kullanılabilir Scriptler

```bash
npm run dev       # Geliştirme sunucusunu başlat
npm run build     # Production build oluştur
npm run preview   # Build'i önizle
```

---

## 🐛 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| API anahtarı çalışmıyor | `.env.local` dosyasının kök dizinde olduğundan emin olun |
| Port 5173 kullanımda | `npm run dev -- --port 3000` ile farklı port kullanın |
| Modül hatası | `rm -rf node_modules && npm install` ile yeniden yükleyin |

---

## 📄 Lisans

Bu proje [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) lisansı altındadır.

| İzin | Durum |
|------|-------|
| ✅ Kişisel kullanım | Serbest |
| ✅ Eğitim amaçlı kullanım | Serbest |
| ✅ Değiştirme ve paylaşma | Serbest (atıf ile) |
| ❌ Ticari kullanım | **Yasak** |

Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

### ⚠️ Önemli Not: API Yoğunluğu Hakkında
Bu proje Google Gemini API'nin ücretsiz sürümünü kullanmaktadır. Zaman zaman Google sunucularındaki küresel yoğunluk nedeniyle çeviri işlemleri **"503 Service Unavailable"** hatası verebilir veya yavaşlayabilir.
* **Çözüm:** Böyle bir durumda lütfen 1-2 dakika bekleyip tekrar deneyin. Kod sorunsuz çalışmaktadır, yoğunluk geçicidir.

---

## 👤 İletişim

**Muzaffer Yurt**

[![GitHub](https://img.shields.io/badge/GitHub-@mzffryurt-181717?style=flat-square&logo=github)](https://github.com/mzffryurt)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Muzaffer%20Yurt-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/muzaffer-yurt-a64493294/)
---