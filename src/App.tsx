/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  ChevronRight,
  BookOpen,
  Cpu,
  X,
  Mail,
  Menu,
  ShieldCheck,
  Compass,
  GraduationCap,
  HeartHandshake,
  Brain,
  Building2,
  Sparkles,
  Award,
  Upload,
  FileText,
  Link as LinkIcon,
  FileCheck,
} from "lucide-react";

interface FocusAreaModalData {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  academicAnchor: string;
  description: string;
  deliverables: string[];
  audience: string;
  status: string;
}

const FOCUS_AREAS_DATA: FocusAreaModalData[] = [
  {
    id: "strategy",
    index: "01",
    title: "Executive Strategy & Systems",
    subtitle: "Enterprise Governance, Operating Models & Program Execution",
    academicAnchor: "DBA Track · William Howard Taft University",
    description:
      "Drawing from 25 years of enterprise technology leadership and doctoral research in Business Administration, this pillar provides pragmatic executive playbooks on structuring agile transformation, capital allocation, PMO governance, and operating model evolution without theoretical fluff.",
    deliverables: [
      "Enterprise Operating Model Transformation Playbook",
      "Executive PMO & Portfolio Governance Framework",
      "Strategic Alignment Scorecard for C-Suite & Board of Directors",
      "Operational Excellence & Lean Six Sigma Deployment Roadmaps",
    ],
    audience: "CEOs, CIOs, CTOs, COOs, VPs of Transformation, Enterprise PMO Directors",
    status: "Active Research & Platform Release Q2 2026",
  },
  {
    id: "ai-trans",
    index: "02",
    title: "AI & Technology Transformation",
    subtitle: "Pragmatic Enterprise AI Adoption & Workflow Modernization",
    academicAnchor: "Applied Enterprise Practice & DBA Strategy",
    description:
      "Enterprise leaders face unprecedented pressure to incorporate generative and agentic AI. This track delivers clear decision architecture to separate hype from durable ROI, establishing human-in-the-loop governance, clean data pipelines, and scalable workflow automation.",
    deliverables: [
      "Executive AI Readiness & ROI Valuation Compass",
      "Human-in-the-Loop Governance & Risk Mitigation Standards",
      "Legacy Core to Modern Cloud & Agentic Architecture Roadmaps",
      "Departmental AI Adoption & Workflow Automation Templates",
    ],
    audience: "Chief Technology Officers, Chief Digital Officers, Heads of Innovation, Technology VPs",
    status: "Whitepapers & Diagnostic Tools Launching With Platform",
  },
  {
    id: "biblical-psych",
    index: "03",
    title: "The Heart of Biblical Psychology",
    subtitle: "Understanding Identity, Renewing the Mind & Pastoral Discernment",
    academicAnchor: "D.B.Psy. Dissertation · HOPE Bible Institute",
    description:
      "Grounded in Jack Darnell Givens' doctoral dissertation (Dr. Johnny Young, Chair), this pillar establishes a heart-centered framework that distinguishes moral responsibility, involuntary distress, and contextual harm. It translates theological truth into actionable discernment across 5 distinct stages.",
    deliverables: [
      "The 5-Stage Counseling Framework: Description, Formulation, Discernment, Agreed Practice, Review",
      "Crucial Distinctions: Moral Responsibility vs. Involuntary Distress vs. Contextual Harm",
      "Deconstructing Approval Seeking & Emotional Withdrawal Under Relational Pressure",
      "Four Evaluative Criteria: Textual Fidelity, Theological Coherence, Contextual Adequacy & Practical Clarity",
    ],
    audience: "Christian Counselors, Pastors, Faith-Driven Executives, Organizational Leaders, Mentors",
    status: "Doctoral Dissertation Research · HOPE Bible Institute (In Progress)",
  },
  {
    id: "doctoral-synthesis",
    index: "04",
    title: "Applied Research & The BeVISIBLE™ Model",
    subtitle: "Leadership Visibility, Sponsorship Dynamics & Decision Tools",
    academicAnchor: "Synthesizing Both Doctorates (DBA + D.B.Psy.)",
    description:
      "Where insights from two separate doctorates—organizational systems (DBA) and human psychology (D.B.Psy.)—converge. Highlighting the BeVISIBLE™ Alliance Model for leadership visibility, sponsorship mechanics, and equitable career velocity in tech, accompanied by ready-to-deploy decision frameworks.",
    deliverables: [
      "The BeVISIBLE™ Alliance Model: Systematic Visibility in Technology",
      "Empirical Research on Executive Sponsorship vs. Mentorship Mechanics",
      "Executive Sponsor Alignment Matrix & Scorecard",
      "Enterprise Transformation Readiness Assessment Tool",
    ],
    audience: "Senior Technology Leaders, Diversity & Talent Strategists, Executive Sponsors, Researchers",
    status: "Doctoral Research & Interactive Web Tools In Development",
  },
];

interface SynthesisScenario {
  id: string;
  title: string;
  challenge: string;
  dbaPerspective: string;
  dbpsyPerspective: string;
  synthesis: string;
}

const SYNTHESIS_SCENARIOS: SynthesisScenario[] = [
  {
    id: "ai-disruption",
    title: "Enterprise AI Adoption & Workforce Anxiety",
    challenge: "Rolling out agentic AI across an organization creates operational turbulence and widespread employee fear of obsolescence.",
    dbaPerspective: "Establishes operating model redesign, human-in-the-loop governance, automated workflow pipelines, and ROI performance metrics.",
    dbpsyPerspective: "Addresses fear, identity crises, and psychological vulnerability through biblical principles of human dignity, purpose, and compassionate leadership.",
    synthesis: "AI adoption accelerates with minimal resistance because systemic workflow transformation is coupled with genuine moral stewardship and human assurance.",
  },
  {
    id: "executive-burnout",
    title: "High-Stakes Executive Burnout & Moral Fatigue",
    challenge: "Senior leaders managing 70+ hour weeks and $100M+ budgets experience emotional depletion, cynicism, and ethical vulnerability.",
    dbaPerspective: "Re-engineers PMO governance, delegates authority, optimizes portfolio capacity, and eliminates low-value operational meetings.",
    dbpsyPerspective: "Restores spiritual grounding, examines root motivations, instills Sabbath rhythms of renewal, and heals psychological isolation.",
    synthesis: "Sustainable high performance achieved by pairing disciplined operational boundary architecture with spiritual and psychological resilience.",
  },
  {
    id: "leadership-advancement",
    title: "Underrepresented Advancement & Invisible Talent",
    challenge: "High-performing leaders remain trapped in execution roles without senior executive visibility or sponsorship.",
    dbaPerspective: "Structures objective performance tracking, high-stakes project positioning, and enterprise value realization metrics.",
    dbpsyPerspective: "Overcomes impostor syndrome, instills faith-rooted boldness, and fosters sacrificial executive sponsorship grounded in covenant relationships.",
    synthesis: "The BeVISIBLE™ Alliance Model delivers: visible business accountability paired with relational courage to open closed corporate doors.",
  },
];

export default function App() {
  const [activeModal, setActiveModal] = useState<FocusAreaModalData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHopeModalOpen, setIsHopeModalOpen] = useState(false);
  const [isTaftModalOpen, setIsTaftModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDoctorateTab, setActiveDoctorateTab] = useState<"both" | "dba" | "dbpsy">("both");
  const [activeSynthesisScenario, setActiveSynthesisScenario] = useState<string>("ai-disruption");

  const [hopeDissertationUrl, setHopeDissertationUrl] = useState<string>(() => {
    return localStorage.getItem("drjackdee_hope_dissertation_url") || "";
  });
  const [hopeUrlInput, setHopeUrlInput] = useState<string>("");
  const [hopeFileName, setHopeFileName] = useState<string>(() => {
    return localStorage.getItem("drjackdee_hope_file_name") || "";
  });
  const [hopeDocTitle, setHopeDocTitle] = useState<string>(() => {
    return localStorage.getItem("drjackdee_hope_doc_title") || "";
  });
  const [hopeAbstractText, setHopeAbstractText] = useState<string>(() => {
    return localStorage.getItem("drjackdee_hope_abstract_text") || "";
  });
  const [activeHopeTab, setActiveHopeTab] = useState<"upload" | "link" | "text">("upload");
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [emailInput, setEmailInput] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "DBA (Enterprise Strategy & AI)",
    "D.B.Psy. (Biblical Psychology & Leadership)",
  ]);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter((i) => i !== interest));
      }
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigator.clipboard.writeText("advisory@donoraglobal.com");
    showToast("Email address copied to clipboard (advisory@donoraglobal.com)");
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setNotificationStatus("Please enter a valid executive email address.");
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("drjackdee_signups") || "[]");
      existing.push({
        email: emailInput,
        interests: selectedInterests,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("drjackdee_signups", JSON.stringify(existing));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setNotificationStatus(
      `Thank you. ${emailInput} has been registered for updates on Dr. Jack Dee's two separate doctorates (DBA and D.B.Psy.).`
    );
    showToast("Launch notification request confirmed!");
  };

  const openEmailDraft = () => {
    const subject = encodeURIComponent("DrJackDee.com Two Separate Doctorates Briefing Inquiry");
    const body = encodeURIComponent(
      `Hello Jack Dee,\n\nPlease register my email (${emailInput || "executive@domain.com"}) for updates on DrJackDee.com.\n\nDoctoral & Advisory Areas of Interest:\n${selectedInterests.map((i) => `- ${i}`).join("\n")}\n\nLooking forward to the platform launch.\n`
    );
    window.location.href = `mailto:advisory@donoraglobal.com?subject=${subject}&body=${body}`;
  };

  const handleSaveHopeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hopeUrlInput.trim()) return;
    const url = hopeUrlInput.trim();
    setHopeDissertationUrl(url);
    localStorage.setItem("drjackdee_hope_dissertation_url", url);
    setHopeUrlInput("");
    showToast("HOPE Bible Institute dissertation link saved successfully!");

    fetch("/api/dissertation-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => {});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const fileName = file.name;
    const fileType = file.type || "application/octet-stream";

    const reader = new FileReader();

    // Check if it's text or binary
    if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      reader.onload = async (event) => {
        const text = (event.target?.result as string) || "";
        try {
          const res = await fetch("/api/upload-dissertation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName,
              fileType,
              textContent: text,
              title: fileName.replace(/\.[^/.]+$/, ""),
            }),
          });
          const json = await res.json();
          if (json.success) {
            setHopeDissertationUrl(json.meta.fileUrl);
            setHopeFileName(fileName);
            localStorage.setItem("drjackdee_hope_dissertation_url", json.meta.fileUrl);
            localStorage.setItem("drjackdee_hope_file_name", fileName);
            if (!hopeAbstractText && text) {
              setHopeAbstractText(text.slice(0, 800));
              localStorage.setItem("drjackdee_hope_abstract_text", text.slice(0, 800));
            }
            showToast(`Uploaded ${fileName} successfully!`);
          }
        } catch (err) {
          showToast("Upload completed with local document attachment.");
        } finally {
          setIsUploadingFile(false);
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = async (event) => {
        const base64Data = (event.target?.result as string) || "";
        try {
          const res = await fetch("/api/upload-dissertation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName,
              fileType,
              base64Data,
              title: fileName.replace(/\.[^/.]+$/, ""),
            }),
          });
          const json = await res.json();
          if (json.success) {
            setHopeDissertationUrl(json.meta.fileUrl);
            setHopeFileName(fileName);
            localStorage.setItem("drjackdee_hope_dissertation_url", json.meta.fileUrl);
            localStorage.setItem("drjackdee_hope_file_name", fileName);
            showToast(`Uploaded ${fileName} successfully!`);
          }
        } catch {
          setHopeDissertationUrl(URL.createObjectURL(file));
          setHopeFileName(fileName);
          localStorage.setItem("drjackdee_hope_file_name", fileName);
          showToast(`Uploaded ${fileName} successfully!`);
        } finally {
          setIsUploadingFile(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAbstract = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("drjackdee_hope_doc_title", hopeDocTitle);
    localStorage.setItem("drjackdee_hope_abstract_text", hopeAbstractText);
    showToast("Dissertation details published to website!");
  };

  // Sync with backend on mount
  useEffect(() => {
    const savedLocal = localStorage.getItem("drjackdee_hope_dissertation_url");
    if (savedLocal) {
      fetch("/api/dissertation-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: savedLocal }),
      }).catch(() => {});
    } else {
      fetch("/api/dissertation-link")
        .then((r) => r.json())
        .then((data) => {
          if (data?.url) {
            setHopeDissertationUrl(data.url);
            localStorage.setItem("drjackdee_hope_dissertation_url", data.url);
            if (data.fileName) {
              setHopeFileName(data.fileName);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  // Close modals on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModal(null);
        setIsProfileOpen(false);
        setIsHopeModalOpen(false);
        setIsTaftModalOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentScenario =
    SYNTHESIS_SCENARIOS.find((s) => s.id === activeSynthesisScenario) ||
    SYNTHESIS_SCENARIOS[0];

  return (
    <div className="site-shell text-slate-100 min-h-screen">
      {/* Background Ambients & Fine Geometric Grid Overlay */}
      <div className="ambient ambient-left" aria-hidden="true"></div>
      <div className="ambient ambient-right" aria-hidden="true"></div>
      <div className="grid-overlay" aria-hidden="true"></div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0f213d] border border-[#f2c94c]/40 text-slate-100 shadow-2xl shadow-black/60 transition-all">
          <CheckCircle2 className="w-5 h-5 text-[#f2c94c] shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sticky Site Header */}
      <header className="site-header">
        <div className="container header-inner">
          {/* Brand Mark with DJD Crest */}
          <a className="brand-mark group" href="#top" aria-label="DrJackDee.com home">
            <span
              className="brand-mark__crest shadow-lg shadow-[#0a192f] transition-transform duration-300 group-hover:scale-105"
              aria-hidden="true"
            >
              DJD
            </span>
            <span className="brand-mark__text">
              <strong className="tracking-wide text-white group-hover:text-[#ffe082] transition-colors">
                DrJackDee.com
              </strong>
              <span className="text-slate-400 text-xs">
                Dual Doctorate: Business Administration &amp; Biblical Psychology
              </span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="site-nav hidden md:flex items-center gap-6" aria-label="Primary">
            <a href="#dual-doctorates" className="hover:text-[#ffe082] transition-colors">
              Two Separate Doctorates
            </a>
            <a href="#transition" className="hover:text-[#ffe082] transition-colors">
              Transition
            </a>
            <a href="#coming" className="hover:text-[#ffe082] transition-colors">
              What Is Coming
            </a>
            <a href="#synthesis" className="hover:text-[#ffe082] transition-colors">
              The Synthesis
            </a>
            <a href="#connect" className="hover:text-[#ffe082] transition-colors">
              Connect
            </a>
            <a href="#notify" className="hover:text-[#ffe082] transition-colors font-medium">
              Notify Me
            </a>
          </nav>

          {/* Quick Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#f2c94c]/40 bg-[#0f213d]/80 text-[#ffe082] hover:bg-[#f2c94c]/10 hover:border-[#f2c94c] transition-all"
            >
              Background &amp; Experience
            </button>
            <a
              href="#notify"
              className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] shadow-md shadow-[#f2c94c]/20 transition-all"
            >
              Join Launch List
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#233554] bg-[#0a192f]/95 backdrop-blur-xl px-6 py-5 space-y-4">
            <nav className="flex flex-col space-y-3 text-base">
              <a
                href="#dual-doctorates"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] transition-colors"
              >
                Two Separate Doctorates (DBA &amp; D.B.Psy.)
              </a>
              <a
                href="#transition"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] transition-colors"
              >
                Brand Transition
              </a>
              <a
                href="#coming"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] transition-colors"
              >
                What Is Coming (4 Pillars)
              </a>
              <a
                href="#synthesis"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] transition-colors"
              >
                The Synthesis
              </a>
              <a
                href="#connect"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] transition-colors"
              >
                Connect With Jack Dee
              </a>
              <a
                href="#notify"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-[#ffe082] font-semibold transition-colors"
              >
                Launch Notification
              </a>
            </nav>
            <div className="pt-3 border-t border-[#233554] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsProfileOpen(true);
                }}
                className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-center border border-[#f2c94c]/40 text-[#ffe082] bg-[#0f213d]"
              >
                View Background &amp; Experience
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="hero section">
          <div className="container hero-layout">
            <div className="hero-copy">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <p className="eyebrow-badge !mb-0">Two Separate Doctorates: DBA &amp; D.B.Psy.</p>
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#f2c94c]/30 bg-[#0f213d] text-[#ffe082]">
                  Two Distinct Programs
                </span>
              </div>

              <h1>Dr. Jack Dee is Coming Soon</h1>

              <p className="hero-subhead">
                Where 25 years of enterprise technology leadership meets two separate doctorates:
                Business Administration (DBA) and Biblical Psychology (D.B.Psy.).
              </p>

              <p className="hero-body">
                DrJackDee.com is the upcoming thought leadership and executive advisory platform for{" "}
                <strong>Jack Darnell Givens</strong>, who is earning <strong>two separate doctorates</strong> across two institutions:
                a <strong>Doctor of Business Administration (DBA)</strong> at{" "}
                <span className="text-[#ffe082]">William Howard Taft University</span> and a{" "}
                <strong>Doctor in Biblical Psychology (D.B.Psy.)</strong> at{" "}
                <span className="text-[#ffe082]">HOPE Bible Institute</span>. Each doctorate represents an independent, rigorous course of study—one in organizational systems and AI operating models, the other in biblical behavioral psychology and executive resilience.
              </p>

              {/* Two Separate Doctorates Institutional Trust Markers */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                <div className="p-3 rounded-xl bg-[#0a192f]/70 border border-[#233554] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f2c94c]/10 border border-[#f2c94c]/30 flex items-center justify-center text-[#ffe082] shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-snug">
                    <span className="text-[10px] uppercase tracking-wider text-[#ffe082] font-bold block">Separate Doctorate #1</span>
                    <strong className="block text-slate-200">Doctor of Business Administration (DBA)</strong>
                    <span className="text-slate-400">William Howard Taft University (In Progress)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0a192f]/70 border border-[#233554] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f2c94c]/10 border border-[#f2c94c]/30 flex items-center justify-center text-[#ffe082] shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="text-xs leading-snug">
                    <span className="text-[10px] uppercase tracking-wider text-[#ffe082] font-bold block">Separate Doctorate #2</span>
                    <strong className="block text-slate-200">Doctor in Biblical Psychology (D.B.Psy.)</strong>
                    <span className="text-slate-400">HOPE Bible Institute (In Progress)</span>
                  </div>
                </div>
              </div>

              <div className="cta-row">
                <a
                  className="button button-primary"
                  href="https://www.mrjackdee.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit MrJackDee.com
                  <ArrowUpRight className="inline-block ml-1.5 w-4 h-4 opacity-75" />
                </a>
                <a
                  className="button button-secondary"
                  href="https://www.donoraglobal.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore DonOra Global
                  <ArrowUpRight className="inline-block ml-1.5 w-4 h-4 opacity-75" />
                </a>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="button button-secondary text-xs"
                >
                  Background &amp; Experience
                </button>
              </div>

              <p className="hero-microcopy">
                Doctoral platform launching soon. Current consulting practice remains active through MrJackDee.com.
              </p>
            </div>

            {/* Strategic Brand Evolution Interactive Aside Panel */}
            <aside className="hero-panel" aria-label="Brand transition summary">
              <div className="panel-shell">
                <p className="panel-label">Two Separate Doctoral Degrees</p>
                <div className="brand-transition">
                  <div className="brand-transition__item">
                    <span className="transition-tag">Corporate Practice</span>
                    <strong className="text-slate-200">MrJackDee</strong>
                  </div>
                  <div className="transition-axis" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="brand-transition__item is-featured">
                    <span className="transition-tag">Two Doctorates</span>
                    <strong className="text-[#ffe082]">DrJackDee</strong>
                  </div>
                </div>

                <div className="insight-stack">
                  <article className="insight-card">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Doctorate 1: DBA · Taft University</span>
                      <Building2 className="w-3.5 h-3.5 text-[#ffe082]" />
                    </div>
                    <p>
                      Enterprise systems, PMO governance, AI operating models, and executive sponsorship.
                    </p>
                  </article>

                  <article className="insight-card">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Doctorate 2: D.B.Psy. · HOPE Bible</span>
                      <Brain className="w-3.5 h-3.5 text-[#ffe082]" />
                    </div>
                    <p>
                      Biblical psychology, mind renewal, executive resilience, and moral character.
                    </p>
                  </article>

                  <article className="insight-card">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Where Both Doctorates Meet</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#ffe082]" />
                    </div>
                    <p>
                      The BeVISIBLE™ Model: Uniting organizational mechanisms with human soul and sponsorship courage.
                    </p>
                  </article>
                </div>

                <div className="mt-4 pt-3 border-t border-[#233554]/70 flex items-center justify-between text-xs text-slate-400">
                  <span>Author: Jack Darnell Givens</span>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="text-[#ffe082] hover:underline flex items-center gap-1 font-medium"
                  >
                    View Background &amp; Experience <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TWO SEPARATE DOCTORATES SECTION                                           */}
        {/* ========================================================================= */}
        <section className="section section-surface" id="dual-doctorates">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Two Separate Doctorates · DBA &amp; D.B.Psy.</p>
              <h2>Two Separate Doctorates: One in Business, One in Biblical Psychology.</h2>
              <p>
                Rather than a single joint degree, Jack Darnell Givens is completing <strong>two entirely separate, independent doctorates</strong> across two distinct institutions. Each degree addresses a vital dimension of leadership: the Taft DBA solves organizational execution and systems, while the HOPE D.B.Psy. addresses the human mind, spirit, and emotional resilience under pressure.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8 p-1.5 rounded-full bg-[#0a192f] border border-[#233554] max-w-lg mx-auto">
              <button
                onClick={() => setActiveDoctorateTab("both")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeDoctorateTab === "both"
                    ? "bg-[#f2c94c] text-[#0a192f]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Compare Both Doctorates
              </button>
              <button
                onClick={() => setActiveDoctorateTab("dba")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeDoctorateTab === "dba"
                    ? "bg-[#f2c94c] text-[#0a192f]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Doctorate 1: Taft DBA
              </button>
              <button
                onClick={() => setActiveDoctorateTab("dbpsy")}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeDoctorateTab === "dbpsy"
                    ? "bg-[#f2c94c] text-[#0a192f]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Doctorate 2: HOPE D.B.Psy.
              </button>
            </div>

            {/* Side-by-Side Doctoral Comparison Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Card 1: William Howard Taft DBA */}
              {(activeDoctorateTab === "both" || activeDoctorateTab === "dba") && (
                <div className="p-6 md:p-8 rounded-3xl bg-[#0f213d] border border-[#233554] hover:border-[#f2c94c]/50 transition-all shadow-xl space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#ffe082] font-bold block mb-1">
                        Separate Doctorate 1 of 2 · In Progress
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white">
                        Doctor of Business Administration (DBA)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">William Howard Taft University (In Progress)</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/30 flex items-center justify-center text-[#ffe082] shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        Core Focus: Strategy &amp; Execution
                      </h4>
                      <p className="text-slate-200">
                        How large organizations streamline technology programs, adopt AI with clear ROI, and align teams around measurable business results.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        Applied Research: The BeVISIBLE™ Alliance Model
                      </h4>
                      <p className="text-slate-300">
                        Creating clear, actionable pathways for talented underrepresented leaders in technology to gain senior executive sponsorship and measurable advancement.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0a192f]/70 border border-[#233554] space-y-2">
                      <span className="text-xs font-bold text-[#ffe082] uppercase tracking-wider block">
                        Practical Tools &amp; Frameworks
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        <li>• Operating models that turn executive vision into everyday delivery</li>
                        <li>• Pragmatic AI adoption roadmaps with clear governance and metrics</li>
                        <li>• Executive sponsorship scorecards that open doors for rising talent</li>
                        <li>• Lean Six Sigma and Agile workflows to cut operational waste</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#233554] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <button
                      onClick={() => setIsTaftModalOpen(true)}
                      className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Taft DBA Research &amp; Program
                    </button>
                    <span className="text-[#ffe082] font-semibold">Taft University System (In Progress)</span>
                  </div>
                </div>
              )}

              {/* Card 2: HOPE Bible Institute D.B.Psy. */}
              {(activeDoctorateTab === "both" || activeDoctorateTab === "dbpsy") && (
                <div className="p-6 md:p-8 rounded-3xl bg-[#0f213d] border border-[#233554] hover:border-[#f2c94c]/50 transition-all shadow-xl space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#ffe082] font-bold block mb-1">
                        Separate Doctorate 2 of 2 · In Progress
                      </span>
                      <h3 className="text-2xl font-serif font-bold text-white">
                        Doctor in Biblical Psychology (D.B.Psy.)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        HOPE Bible Institute (In Progress) · Dissertation: <em className="text-slate-200">The Heart of Biblical Psychology: Understanding Identity, Renewing the Mind, and Applying Biblical Truth in Counseling</em>
                      </p>
                      <p className="text-[11px] text-[#ffe082]/80 mt-1">
                        Committee Chair: Dr. Johnny Young, President of HOPE Bible Institute
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/30 flex items-center justify-center text-[#ffe082] shrink-0">
                      <Brain className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-slate-300">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        Core Focus: People, Mindset &amp; Resilience
                      </h4>
                      <p className="text-slate-200">
                        Bridging the gap between what leaders believe in their heads and how they respond when pressure, conflict, or fatigue hits in real life.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                        The Three Key Distinctions
                      </h4>
                      <p className="text-slate-300">
                        Separating <strong className="text-white">Personal Responsibility</strong> (actions we can repair), <strong className="text-white">Honest Hurt &amp; Fatigue</strong> (pain needing care, not guilt), and <strong className="text-white">Harm from Others</strong> (unfair situations needing boundaries and protection).
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0a192f]/70 border border-[#233554] space-y-2">
                      <span className="text-xs font-bold text-[#ffe082] uppercase tracking-wider block">
                        The 5-Stage Discernment Framework (Givens)
                      </span>
                      <ul className="space-y-1 text-xs text-slate-300">
                        <li>• <strong>1. Listen:</strong> Separate what actually happened from what we fear it means</li>
                        <li>• <strong>2. Understand:</strong> Look at exhaustion, stress, and relationships before jumping to blame</li>
                        <li>• <strong>3. Discern:</strong> Apply grace, renewal (Romans 12), and biblical truth with care</li>
                        <li>• <strong>4. Practice:</strong> Agree on small, doable steps (boundaries, clear speech, pausing to pray)</li>
                        <li>• <strong>5. Review:</strong> Check what worked, what remains difficult, and adjust freely</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#233554] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                    <button
                      onClick={() => setIsHopeModalOpen(true)}
                      className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-colors flex items-center gap-1.5 shadow-md shadow-[#f2c94c]/20"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View D.B.Psy. Dissertation Details
                    </button>
                    {hopeDissertationUrl ? (
                      <a
                        href={hopeDissertationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#ffe082] hover:underline flex items-center gap-1 font-semibold"
                      >
                        Read Attached Doc <ArrowUpRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[#ffe082] font-semibold">HOPE Bible Institute (In Progress)</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Why Both? The Core Thesis */}
            <div className="mt-8 p-6 md:p-8 rounded-3xl bg-[#0a192f] border border-[#f2c94c]/30 max-w-4xl mx-auto text-center space-y-3 shadow-2xl">
              <span className="text-xs font-bold text-[#ffe082] uppercase tracking-widest block">
                Why Earn Two Separate Doctorates?
              </span>
              <p className="text-lg md:text-xl font-serif italic text-slate-100 max-w-3xl mx-auto leading-relaxed">
                “Organizations struggle for two distinct reasons: either their business systems and execution are flawed,
                or the people leading them are exhausted, isolated, and overwhelmed.
                That is why I am completing two separate doctorates: one to solve the operational and governance challenges of business (DBA), and one to care for the mind, spirit, and resilience of the leader (D.B.Psy.).”
              </p>
              <p className="text-xs text-slate-400 font-medium">
                — Jack Darnell Givens, DBA (In Progress, William Howard Taft) &amp; D.B.Psy. (In Progress, HOPE Bible Institute)
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TRANSITION SECTION                                                       */}
        {/* ========================================================================= */}
        <section className="section" id="transition">
          <div className="container two-column">
            <div className="section-copy">
              <p className="section-kicker">From MrJackDee to DrJackDee</p>
              <h2>This is a brand transition, not a placeholder.</h2>
              <p>
                This site marks the next chapter of a professional journey built on
                25 years of technology program leadership, enterprise transformation, AI
                strategy, and rigorous doctoral research. DrJackDee.com will become a
                focused platform for executive insight, strategic advisory work,
                doctoral thought leadership, and tools designed for leaders who need
                practical clarity, not empty theory.
              </p>
              <p>
                The platform will also create more room for scholarship-informed
                thinking around leadership visibility, sponsorship, and advancement
                in technology, including work connected to the BeVISIBLE™ Alliance
                Model and the spiritual and behavioral dynamics of high-performing teams.
              </p>

              {/* Verified Practitioner-Scholar Metrics */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#233554] pt-6">
                <div>
                  <span className="block text-2xl font-bold font-serif text-[#ffe082]">25+ Years</span>
                  <span className="text-xs text-slate-400">Enterprise Technology &amp; PMO Leadership</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-serif text-[#ffe082]">2 Doctorates</span>
                  <span className="text-xs text-slate-400">Taft DBA + HOPE D.B.Psy.</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-serif text-[#ffe082]">DonOra Global</span>
                  <span className="text-xs text-slate-400">Enterprise Transformation &amp; AI Advisory</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold font-serif text-[#ffe082]">BeVISIBLE™</span>
                  <span className="text-xs text-slate-400">Visibility &amp; Sponsorship Model</span>
                </div>
              </div>
            </div>

            <div className="transition-card">
              <div className="transition-card__frame">
                <div className="transition-card__path" aria-hidden="true"></div>
                <div className="transition-card__step">
                  <span className="step-label">Professional Brand</span>
                  <strong>MrJackDee</strong>
                  <p>Established executive voice for enterprise transformation, PMO execution, and consulting leadership.</p>
                </div>
                <div className="transition-card__step is-active">
                  <span className="step-label">Two Separate Doctorates</span>
                  <strong>DrJackDee</strong>
                  <p>
                    Unified public platform bringing together two separate doctorates: William Howard Taft (DBA) business systems and HOPE Bible Institute (D.B.Psy.) biblical psychology.
                  </p>
                </div>
                <div className="transition-card__step">
                  <span className="step-label">Strategic Advisory Voice</span>
                  <strong>Next Chapter</strong>
                  <p>Where enterprise execution, AI strategy, and servant-leader practitioner-scholar perspective meet.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WHAT IS COMING (4 PILLARS ACROSS BOTH DISCIPLINES)                       */}
        {/* ========================================================================= */}
        <section className="section section-surface" id="coming">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">What Is Coming</p>
              <h2>Focused, practical, leadership-grade content and tools.</h2>
              <p>
                The new platform is being designed for leaders who value strategic
                depth, operational clarity, and applied insight they can actually use.
                Every pillar is anchored in academic rigor and corporate delivery.
              </p>
            </div>

            <div className="focus-grid">
              {FOCUS_AREAS_DATA.map((item) => (
                <article
                  key={item.id}
                  onClick={() => setActiveModal(item)}
                  className="focus-card cursor-pointer group hover:border-[#f2c94c]/60 transition-all"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveModal(item);
                    }
                  }}
                  aria-label={`View details for ${item.title}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="focus-card__index">{item.index}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#f2c94c]/10 text-[#ffe082] border border-[#f2c94c]/20">
                      {item.academicAnchor.split("·")[0]}
                    </span>
                  </div>
                  <h3 className="group-hover:text-[#ffe082] transition-colors">{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="mt-4 pt-3 border-t border-[#233554]/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate max-w-[140px]">{item.academicAnchor}</span>
                    <span className="text-[#ffe082]/90 flex items-center gap-1 font-semibold">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE DUAL-LENS SYNTHESIS ENGINE                                            */}
        {/* ========================================================================= */}
        <section className="section" id="synthesis">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Synthesizing Both Disciplines</p>
              <h2>How Two Separate Doctorates Solve Real Executive Crises.</h2>
              <p>
                Select a high-stakes challenge below to observe how applying insights from two separate doctorates—William Howard Taft business systems and HOPE Bible Institute psychology—produces complete solutions.
              </p>
            </div>

            {/* Scenario Buttons */}
            <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8 max-w-2xl mx-auto">
              {SYNTHESIS_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveSynthesisScenario(sc.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                    activeSynthesisScenario === sc.id
                      ? "bg-[#f2c94c] text-[#0a192f] border-[#f2c94c] shadow-lg shadow-[#f2c94c]/20"
                      : "bg-[#0f213d] text-slate-300 border-[#233554] hover:border-slate-500"
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>

            {/* Active Scenario Card */}
            <div className="panel-shell max-w-4xl mx-auto p-6 md:p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-[#0a192f]/70 border border-[#233554]">
                <span className="text-xs uppercase tracking-wider text-[#ffe082] font-bold block mb-1">
                  The Enterprise Dilemma
                </span>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  {currentScenario.title}
                </h3>
                <p className="text-slate-300 text-sm md:text-base">
                  {currentScenario.challenge}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* DBA Lens */}
                <div className="p-5 rounded-2xl bg-[#0f213d] border border-[#233554] space-y-2">
                  <div className="flex items-center gap-2 text-[#ffe082]">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      The DBA Lens (Taft University)
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Systemic &amp; Operational Architecture</h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentScenario.dbaPerspective}
                  </p>
                </div>

                {/* DBPsy Lens */}
                <div className="p-5 rounded-2xl bg-[#0f213d] border border-[#233554] space-y-2">
                  <div className="flex items-center gap-2 text-[#ffe082]">
                    <Brain className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      The D.B.Psy. Lens (HOPE Institute)
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">Psychological &amp; Spiritual Resilience</h4>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {currentScenario.dbpsyPerspective}
                  </p>
                </div>
              </div>

              {/* The Synthesis Result */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0a192f] to-[#112240] border border-[#f2c94c]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#ffe082]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    The Practitioner-Scholar Synthesis
                  </span>
                </div>
                <p className="text-sm md:text-base font-medium text-slate-100 leading-relaxed">
                  {currentScenario.synthesis}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CONNECT WITH JACK DEE NOW SECTION                                        */}
        {/* ========================================================================= */}
        <section className="section section-surface" id="connect">
          <div className="container">
            <div className="section-heading">
              <p className="section-kicker">Connect With Jack Dee Now</p>
              <h2>Current platforms, live channels, and launch-ready contact points.</h2>
              <p>
                While this dual-doctoral platform is being completed, connect with Jack Dee through
                his current professional site, company platform, and active channels.
              </p>
            </div>

            <div className="connect-grid">
              {/* MrJackDee.com */}
              <a
                className="connect-card group"
                href="https://www.mrjackdee.com/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 5h18v14H3z" />
                    <path d="M8 3v4M16 3v4M3 9h18" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong className="group-hover:text-[#ffe082] transition-colors flex items-center gap-1.5">
                    MrJackDee.com <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </strong>
                  <span>Current professional website</span>
                </span>
              </a>

              {/* DonOra Global */}
              <a
                className="connect-card group"
                href="https://www.donoraglobal.com/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 20V8l8-4 8 4v12" />
                    <path d="M9 20v-5h6v5" />
                    <path d="M8 10h.01M12 10h.01M16 10h.01" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong className="group-hover:text-[#ffe082] transition-colors flex items-center gap-1.5">
                    DonOra Global <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </strong>
                  <span>Company platform</span>
                </span>
              </a>

              {/* Email */}
              <div
                onClick={handleCopyEmail}
                className="connect-card cursor-pointer group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCopyEmail();
                }}
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 6h18v12H3z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong className="group-hover:text-[#ffe082] transition-colors flex items-center gap-1.5">
                    Email Jack Dee <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#ffe082]" />
                  </strong>
                  <span>advisory@donoraglobal.com</span>
                </span>
              </div>

              {/* LinkedIn */}
              <a
                className="connect-card group"
                href="https://www.linkedin.com/in/mrjackdee/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7 8v9" />
                    <path d="M7 5h.01" />
                    <path d="M12 17v-5" />
                    <path d="M17 17v-4a2 2 0 0 0-4 0" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong className="group-hover:text-[#ffe082] transition-colors flex items-center gap-1.5">
                    LinkedIn <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </strong>
                  <span>Professional profile</span>
                </span>
              </a>

              {/* X / Twitter */}
              <a
                className="connect-card group"
                href="https://x.com/MrKreducator/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 5 19 19" />
                    <path d="M19 5 5 19" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong className="group-hover:text-[#ffe082] transition-colors flex items-center gap-1.5">
                    X (@MrKreducator) <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </strong>
                  <span>Verified public channel</span>
                </span>
              </a>

              {/* Inactive future channels */}
              <div
                className="connect-card connect-card--inactive"
                aria-label="Additional social channels coming soon"
              >
                <span className="connect-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </span>
                <span className="connect-card__content">
                  <strong>Instagram, Facebook, YouTube</strong>
                  <span>Handles will be connected at launch</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LAUNCH NOTIFICATION SECTION                                              */}
        {/* ========================================================================= */}
        <section className="section" id="notify">
          <div className="container">
            <div className="notify-shell">
              <div className="notify-copy">
                <p className="section-kicker">Launch Notification</p>
                <h2>Be notified when DrJackDee.com launches.</h2>
                <p>
                  Join the early interest list for launch updates and research releases across both separate doctorates (DBA and D.B.Psy.).
                </p>

                {/* Track Selection Tags */}
                <div className="mt-5 space-y-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                    Choose Your Research &amp; Advisory Tracks:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "DBA (Enterprise Strategy & AI)",
                      "D.B.Psy. (Biblical Psychology & Leadership)",
                      "BeVISIBLE™ Alliance Model",
                      "Advisory & Decision Tools",
                    ].map((topic) => {
                      const active = selectedInterests.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => toggleInterest(topic)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            active
                              ? "border-[#f2c94c] bg-[#f2c94c]/15 text-[#ffe082]"
                              : "border-slate-700 bg-slate-900/40 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          {topic} {active ? "✓" : "+"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Notification Form */}
              <div className="notify-form">
                {!isSubmitted ? (
                  <form onSubmit={handleNotificationSubmit} className="space-y-4">
                    <label className="sr-only" htmlFor="notify-email">
                      Email address
                    </label>
                    <div className="notify-form__row">
                      <input
                        id="notify-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Enter your executive email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className="bg-[#07101f]/80 text-white placeholder-slate-400 border border-[#8892b0]/30 focus:border-[#f2c94c] focus:outline-none"
                      />
                      <button className="button button-primary shrink-0" type="submit">
                        Notify Me
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>No spam. Strict executive privacy.</span>
                      <button
                        type="button"
                        onClick={openEmailDraft}
                        className="text-[#ffe082] hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" /> Send pre-filled email draft
                      </button>
                    </div>

                    <p className="notify-form__note">
                      Until a dedicated CRM endpoint is attached, this records your preference locally and provides an instant pre-addressed email draft.
                    </p>
                    {notificationStatus && (
                      <p className="notify-form__status text-[#ffe082] text-sm" role="status">
                        {notificationStatus}
                      </p>
                    )}
                  </form>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/50 text-slate-200 space-y-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[#f2c94c] shrink-0" />
                      <h3 className="text-lg font-bold text-white">Registered for Launch Updates</h3>
                    </div>
                    <p className="text-sm text-slate-300">
                      We've recorded your email (<strong className="text-[#ffe082]">{emailInput}</strong>) with interest in:{" "}
                      <span className="text-slate-200">{selectedInterests.join(", ")}</span>.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={openEmailDraft}
                        className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-colors"
                      >
                        Open Email Confirmation Draft
                      </button>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmailInput("");
                        }}
                        className="px-4 py-2 rounded-full text-xs font-medium border border-slate-600 hover:border-slate-400 text-slate-300"
                      >
                        Register Another Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* SITE FOOTER                                                              */}
      {/* ========================================================================= */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-copy">© 2026 Jack Darnell Givens. All rights reserved.</p>
            <p className="footer-note">
              Earning two separate doctorates: Doctor of Business Administration (DBA, William Howard Taft University) &amp; Doctor in Biblical Psychology (D.B.Psy., HOPE Bible Institute).
            </p>
          </div>
          <div className="footer-links" aria-label="Footer">
            <a href="https://www.mrjackdee.com/" target="_blank" rel="noreferrer">
              MrJackDee.com
            </a>
            <a href="https://www.donoraglobal.com/" target="_blank" rel="noreferrer">
              DonOra Global
            </a>
            <a href="mailto:advisory@donoraglobal.com">Contact</a>
            <a href="#top" className="text-xs text-[#ffe082]/80 hover:text-[#ffe082]">
              ↑ Back to Top
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FOCUS AREA DETAIL MODAL                                                  */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f213d] border border-[#f2c94c]/40 p-6 md:p-8 shadow-2xl text-slate-100"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-[#f2c94c] font-bold text-sm tracking-widest uppercase">
                Pillar {activeModal.index}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f2c94c]/10 text-[#ffe082] border border-[#f2c94c]/20">
                {activeModal.academicAnchor}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1">
              {activeModal.title}
            </h2>
            <p className="text-sm text-slate-300 font-medium mb-6">
              {activeModal.subtitle}
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-semibold mb-2">
                  Academic &amp; Executive Overview
                </h3>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  {activeModal.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-semibold mb-2.5">
                  Core Deliverables &amp; Research Artifacts
                </h3>
                <ul className="space-y-2.5">
                  {activeModal.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#f2c94c] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Target Audience:
                </span>
                <p className="text-xs text-slate-300">{activeModal.audience}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#233554]">
                <a
                  href="#notify"
                  onClick={() => {
                    setActiveModal(null);
                    if (!selectedInterests.includes(activeModal.title)) {
                      setSelectedInterests([...selectedInterests, activeModal.title]);
                    }
                  }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-colors"
                >
                  Join Interest List for This Pillar
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACADEMIC & PROFESSIONAL BACKGROUND MODAL                                 */}
      {/* ========================================================================= */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f213d] border border-[#f2c94c]/40 p-6 md:p-10 shadow-2xl text-slate-100"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="brand-mark__crest w-9 h-9 text-xs" aria-hidden="true">DJD</span>
              <div>
                <span className="text-[#f2c94c] font-bold text-xs tracking-widest uppercase block">
                  Background &amp; Experience
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                  Jack Darnell Givens (Dr. Jack Dee)
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed mt-4">
              <p>
                <strong>Jack Darnell Givens</strong> (M.Ed., MBA, MTRS, D.B.Psy., DBA Candidate) brings over 25 years of hands-on leadership in enterprise technology, business operations, and organizational change. As the founder of{" "}
                <a href="https://www.donoraglobal.com/" target="_blank" rel="noreferrer" className="text-[#ffe082] underline font-medium">
                  DonOra Global
                </a>, he combines real-world corporate execution with <strong>two separate doctorates</strong>: an accredited Doctor of Business Administration (DBA) at William Howard Taft University and a Doctor in Biblical Psychology (D.B.Psy.) at HOPE Bible Institute.
              </p>

              {/* Complete Academic Vita Grid */}
              <div className="p-5 rounded-2xl bg-[#0a192f] border border-[#233554] space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#ffe082] font-bold block">
                  Education &amp; Academic Degrees
                </span>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <span className="text-[10px] uppercase font-bold text-[#ffe082] block">Separate Doctorate #1 · In Progress</span>
                    <strong className="text-white block font-medium">Doctor of Business Administration (DBA)</strong>
                    <span className="text-slate-300">William Howard Taft University (In Progress)</span>
                    <p className="text-slate-400 mt-1">Research: The BeVISIBLE™ Alliance Model &amp; Tech Advancement</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <span className="text-[10px] uppercase font-bold text-[#ffe082] block">Separate Doctorate #2 · In Progress</span>
                    <strong className="text-white block font-medium">Doctor in Biblical Psychology (D.B.Psy.)</strong>
                    <span className="text-[#ffe082]">HOPE Bible Institute (In Progress)</span>
                    <p className="text-slate-400 mt-1">Dissertation: The Heart of Biblical Psychology (Dr. Johnny Young, Chair)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <strong className="text-white block font-medium">Master of Theology &amp; Religious Studies (MTRS)</strong>
                    <span className="text-slate-300">HOPE Bible Institute</span>
                    <p className="text-slate-400 mt-0.5">Preceded by Bachelor of Theology (B.Th.)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <strong className="text-white block font-medium">Master of Business Administration (MBA)</strong>
                    <span className="text-slate-300">Louisiana State University Shreveport</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <strong className="text-white block font-medium">Master of Education (M.Ed.) in Educational Technology</strong>
                    <span className="text-slate-300">Northwestern State University</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#233554]">
                    <strong className="text-white block font-medium">Bachelor of Science in CIS &amp; Business Administration</strong>
                    <span className="text-slate-300">Northwestern State University</span>
                  </div>
                </div>
              </div>

              {/* Professional Credentials & Methodology */}
              <div className="p-4 rounded-xl bg-[#0a192f]/60 border border-[#233554]">
                <h4 className="text-xs uppercase tracking-wider text-[#ffe082] font-bold mb-2">
                  Professional Experience &amp; Certifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div>• Project Management Professional (PMP®)</div>
                  <div>• Lean Six Sigma Black Belt (LSSBB)</div>
                  <div>• Certified Scrum Product Owner (CSPO®)</div>
                  <div>• 25+ Years Global Tech Program Leadership</div>
                  <div>• Fractional COO &amp; Strategic Advisory</div>
                  <div>• Founder &amp; Managing Director, DonOra Global</div>
                </div>
              </div>

              {/* Dedication & The Story of DonOra Global */}
              <div className="p-4 rounded-xl bg-[#07101f] border border-[#f2c94c]/20 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#ffe082] font-bold block">
                  Family Heritage: The Story Behind DonOra Global
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  “I dedicate this accomplishment in loving memory of my mother, Dora Baker Givens, and my father, Donald Ray Givens. From both of you, I learned that strength is not always loud and sacrifice is not always visible. I learned responsibility, perseverance, the importance of relationships, and the value of continuing forward when life becomes difficult.”
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong>DonOra Global</strong> was named in honor of this heritage—combining the names of Donald (“Don”) and Dora (“Ora”)—symbolizing enduring integrity, quiet strength, and dedication to serving others.
                </p>
              </div>

              <div className="pt-4 border-t border-[#233554] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.mrjackdee.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#ffe082] hover:underline flex items-center gap-1"
                  >
                    MrJackDee.com <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span className="text-slate-600">·</span>
                  <a
                    href="https://www.donoraglobal.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#ffe082] hover:underline flex items-center gap-1"
                  >
                    DonOra Global <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span className="text-slate-600">·</span>
                  <button
                    onClick={handleCopyEmail}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    Copy Email <Copy className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082]"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HOPE BIBLE INSTITUTE D.B.PSY. DISSERTATION & CURRICULUM MODAL             */}
      {/* ========================================================================= */}
      {isHopeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f213d] border border-[#f2c94c]/40 p-6 md:p-10 shadow-2xl text-slate-100"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsHopeModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/40 flex items-center justify-center text-[#ffe082]">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[#f2c94c] font-bold text-xs tracking-widest uppercase block">
                  Doctoral Program &amp; Research Defense
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                  HOPE Bible Institute · Doctor of Biblical Psychology (D.B.Psy.)
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed mt-4">
              {/* Document Connection Hub: Tabs for Upload, Link, or Direct Text */}
              <div className="p-5 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#233554] pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#ffe082]" />
                    <strong className="text-white text-xs uppercase tracking-wider">
                      Dissertation Document &amp; Research Access
                    </strong>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[#07101f] border border-[#233554]">
                    <button
                      type="button"
                      onClick={() => setActiveHopeTab("upload")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeHopeTab === "upload"
                          ? "bg-[#f2c94c] text-[#0a192f]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Upload className="w-3 h-3" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHopeTab("link")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeHopeTab === "link"
                          ? "bg-[#f2c94c] text-[#0a192f]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" /> Web Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHopeTab("text")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeHopeTab === "text"
                          ? "bg-[#f2c94c] text-[#0a192f]"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-3 h-3" /> Enter Text
                    </button>
                  </div>
                </div>

                {/* Status of Currently Attached Document */}
                {(hopeDissertationUrl || hopeFileName || hopeDocTitle) && (
                  <div className="p-3 rounded-xl bg-[#0f213d] border border-[#f2c94c]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#f2c94c] shrink-0" />
                      <div>
                        <span className="font-semibold text-white block">
                          {hopeDocTitle || hopeFileName || "Attached Dissertation Document"}
                        </span>
                        <span className="text-slate-400 font-mono break-all text-[11px]">
                          {hopeFileName ? `File: ${hopeFileName}` : hopeDissertationUrl}
                        </span>
                      </div>
                    </div>
                    {hopeDissertationUrl && (
                      <a
                        href={hopeDissertationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-colors flex items-center gap-1 shadow-md shadow-[#f2c94c]/20"
                      >
                        Open Document <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Tab 1: Upload File */}
                {activeHopeTab === "upload" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Upload your dissertation document directly. Supported file formats:{" "}
                      <strong className="text-[#ffe082]">PDF (.pdf), Word (.docx, .doc), Text (.txt), Markdown (.md)</strong>.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.doc,.txt,.md,.rtf"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#233554] hover:border-[#f2c94c]/70 rounded-2xl p-6 text-center cursor-pointer bg-[#07101f]/60 hover:bg-[#07101f] transition-all group"
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-[#ffe082] group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-white block">
                        {isUploadingFile ? "Processing and saving file..." : "Click or drag to upload your dissertation"}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        PDF, Word (.docx), or Text document (up to 50MB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Web Link */}
                {activeHopeTab === "link" && (
                  <form onSubmit={handleSaveHopeUrl} className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Paste a public or shared link to your document (Google Docs, Google Drive, Dropbox, OneDrive, or university repository):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={hopeUrlInput}
                        onChange={(e) => setHopeUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#07101f] text-white border border-[#233554] focus:border-[#f2c94c] focus:outline-none placeholder-slate-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-all shrink-0"
                      >
                        Save Link
                      </button>
                    </div>
                  </form>
                )}

                {/* Tab 3: Direct Text / Abstract Input */}
                {activeHopeTab === "text" && (
                  <form onSubmit={handleSaveAbstract} className="space-y-3">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                        Dissertation Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Biblical Psychology in Executive Adversity: Cognitive Renewal and Soul Care"
                        value={hopeDocTitle}
                        onChange={(e) => setHopeDocTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-[#07101f] text-white border border-[#233554] focus:border-[#f2c94c] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                        Abstract / Core Summary Text
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Paste your abstract, research problem, theological basis, and key conclusions..."
                        value={hopeAbstractText}
                        onChange={(e) => setHopeAbstractText(e.target.value)}
                        className="w-full p-3 rounded-xl text-xs bg-[#07101f] text-white border border-[#233554] focus:border-[#f2c94c] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082] transition-all"
                    >
                      Publish Details to Site
                    </button>
                  </form>
                )}
              </div>

              {/* Everyday Summary & Official Dissertation Title */}
              <div className="p-5 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#233554] pb-2">
                  <span className="text-xs uppercase tracking-wider text-[#ffe082] font-bold">
                    Doctoral Research Summary (Givens)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Committee: Dr. Johnny Young, Chair · Dr. Kelsei Favors
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base md:text-lg font-serif font-bold text-white">
                    The Heart of Biblical Psychology: Understanding Identity, Renewing the Mind, and Applying Biblical Truth in Counseling
                  </h4>
                  <p className="text-xs text-slate-400">
                    Doctor in Biblical Psychology (D.B.Psy.) · HOPE Bible Institute (In Progress)
                  </p>
                </div>

                {/* In Everyday Terms Card */}
                <div className="p-3.5 rounded-xl bg-[#0f213d] border border-[#233554] space-y-1.5">
                  <span className="text-xs font-bold text-[#ffe082] uppercase tracking-wider block">
                    In Plain Language: What This Research Solves
                  </span>
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                    When relationships or work get stressful, people often experience a painful gap between what they believe in their hearts and how they react under pressure. Some people over-explain themselves to constantly earn approval, while others withdraw into cold silence to stay safe.
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This research introduces a practical 5-step way to slow down, tell the difference between honest exhaustion and moral failure, stop weaponizing religion to silence people, and take small, healthy steps grounded in grace.
                  </p>
                </div>

                <details className="text-xs text-slate-400 cursor-pointer pt-1">
                  <summary className="hover:text-white font-medium text-[#ffe082]/90">
                    Read the formal academic abstract
                  </summary>
                  <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-[#f2c94c]/60 pl-3 py-2 mt-2 bg-[#07101f] rounded-r-xl">
                    “This dissertation develops a heart-centered framework for biblical counseling that distinguishes moral responsibility, involuntary distress, and contextual harm. Constructive theological analysis and a focused narrative review provide the argument; two real counseling experiences serve as limited reflective illustrations. Scripture supplies the account of persons and Christian formation, while psychological, educational, and organizational research informs questions about interpretation and practice. The framework organizes description, formulation, biblical discernment, agreed practice, and review... The theological argument supports counsel that joins accountability with care for suffering and revises applications when context or experience challenges them.”
                  </p>
                </details>
              </div>

              {/* The Three Core Distinctions */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-bold mb-2.5">
                  Three Simple, Powerful Distinctions
                </h3>
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <strong className="text-white block font-semibold">1. Personal Responsibility</strong>
                    <p className="text-slate-300">
                      When we make a mistake or hurt someone, we need honest confession, repentance, and making things right.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <strong className="text-white block font-semibold">2. Honest Hurt &amp; Fatigue</strong>
                    <p className="text-slate-300">
                      Physical exhaustion, grief, and emotional pain need care, rest, and patience—not guilt or false blame.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <strong className="text-white block font-semibold">3. Harm from Others</strong>
                    <p className="text-slate-300">
                      When someone else is mistreating you, the answer is healthy boundaries and protection—never self-blame.
                    </p>
                  </div>
                </div>
              </div>

              {/* The 5-Stage Discernment Framework (Table 2) */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-bold mb-2.5">
                  The 5-Stage Care Framework
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-[#ffe082] font-semibold">Stage 1: Listen to What Actually Happened</strong>
                      <p className="text-slate-300 mt-0.5">Separate the facts of an event from the fear or self-criticism we attach to it.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Pause if: New facts emerge or a situation is unsafe</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-[#ffe082] font-semibold">Stage 2: Look at the Whole Picture</strong>
                      <p className="text-slate-300 mt-0.5">Look at physical exhaustion, relationship pressures, and stress before assuming it's a moral flaw.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Pause if: A better, simpler explanation fits</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-[#ffe082] font-semibold">Stage 3: Apply Biblical Wisdom With Grace</strong>
                      <p className="text-slate-300 mt-0.5">Focus on God's grace and renewed thinking (Romans 12)—never weaponize verses to silence real pain.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Pause if: Advice is causing unnecessary burden</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-[#ffe082] font-semibold">Stage 4: Take Small, Practical Steps</strong>
                      <p className="text-slate-300 mt-0.5">Agree on manageable actions: speaking up honestly, pausing to pray, setting a boundary, or resting.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Pause if: The step is overwhelming or unclear</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-[#ffe082] font-semibold">Stage 5: Check In &amp; Adjust</strong>
                      <p className="text-slate-300 mt-0.5">Talk openly about what worked and what is still hard. Change the approach without guilt.</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Pause if: Outside professional care or medical help is needed</span>
                  </div>
                </div>
              </div>

              {/* The Four Evaluative Criteria */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-bold mb-2.5">
                  Four Standards for Responsible Care
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554]">
                    <strong className="text-white block font-medium">1. True to Scripture</strong>
                    <p className="text-slate-400 mt-0.5">Biblical passages are applied in context, without twisting them into rigid personal opinions.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554]">
                    <strong className="text-white block font-medium">2. Rooted in Grace</strong>
                    <p className="text-slate-400 mt-0.5">Emphasizes God's love and acceptance without demanding emotional perfection.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554]">
                    <strong className="text-white block font-medium">3. Realistic About Life</strong>
                    <p className="text-slate-400 mt-0.5">Considers real fatigue, financial stress, and relationship safety before giving advice.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a192f] border border-[#233554]">
                    <strong className="text-white block font-medium">4. Clear &amp; Open to Feedback</strong>
                    <p className="text-slate-400 mt-0.5">Every step makes sense to the person, and they have complete freedom to ask questions or change it.</p>
                  </div>
                </div>
              </div>

              {/* Connecting 25 Years of Tech Experience with Biblical Care */}
              <div className="p-4 rounded-xl bg-[#0f213d] border border-[#233554] space-y-2 text-xs">
                <strong className="text-[#ffe082] uppercase tracking-wider block">
                  Connecting 25 Years of Systems Leadership with Human Care
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  Givens highlights how 25 years of IT systems analysis, educational technology (M.Ed.), and business administration (MBA) shaped his focus on the <em>“distance between understanding and action.”</em> In organizational change, taking a training class is not the same as adopting a new system; similarly, in leadership and personal life, knowing a truth in your head is very different from living it out during difficult conversations.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  His research explicitly warns against using faith to silence people: <em>“Counsel about identity should never train people to accept unfair treatment as a test of humility. It should help distinguish another person's wrongdoing from one's own responsibility, and legitimate advocacy from the demand to control every outcome.”</em>
                </p>
              </div>

              <div className="pt-4 border-t border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  HOPE Bible Institute · Doctor in Biblical Psychology (In Progress)
                </span>
                <button
                  onClick={() => setIsHopeModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082]"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WILLIAM HOWARD TAFT DBA RESEARCH & CURRICULUM MODAL                       */}
      {/* ========================================================================= */}
      {isTaftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f213d] border border-[#f2c94c]/40 p-6 md:p-10 shadow-2xl text-slate-100"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setIsTaftModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/40 flex items-center justify-center text-[#ffe082]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[#f2c94c] font-bold text-xs tracking-widest uppercase block">
                  Doctor of Business Administration (DBA)
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
                  William Howard Taft University (In Progress)
                </h2>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-300 leading-relaxed mt-4">
              {/* Applied Doctoral Project Spotlight */}
              <div className="p-5 rounded-2xl bg-[#0a192f] border border-[#f2c94c]/40 space-y-2">
                <span className="text-xs font-bold text-[#ffe082] uppercase tracking-wider block">
                  Applied Doctoral Project Title
                </span>
                <h3 className="text-base md:text-lg font-serif font-bold text-white leading-snug">
                  “Developing a Strategic Advisory Framework to Advance Black Senior Leadership in the Technology Industry: The BeVISIBLE™ Alliance Model”
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Investigating institutional barriers, sponsorship dynamics, and quantitative PMO execution accountability
                  to systematically accelerate underrepresented executive advancement in high-stakes enterprise technology.
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.bevisible.work"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffe082] hover:underline"
                  >
                    Explore BeVISIBLE™ Research Portal <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Taft DBA Curriculum Pillars */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-[#ffe082] font-bold mb-3">
                  DBA Course of Study &amp; Core Disciplines
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <span className="text-xs font-bold text-[#ffe082] block">
                      Enterprise Strategic Management
                    </span>
                    <p className="text-xs text-slate-300">
                      Corporate governance, operating model restructuring, organizational design, and capital allocation frameworks.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <span className="text-xs font-bold text-[#ffe082] block">
                      Information Systems &amp; Technology Strategy
                    </span>
                    <p className="text-xs text-slate-300">
                      Scalable enterprise architecture, cloud transformation, AI workflow integration, and technology valuation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <span className="text-xs font-bold text-[#ffe082] block">
                      Quantitative Research &amp; PMO Governance
                    </span>
                    <p className="text-xs text-slate-300">
                      Empirical research methodology, statistical validation, portfolio risk mitigation, and Lean Six Sigma alignment.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0a192f] border border-[#233554] space-y-1">
                    <span className="text-xs font-bold text-[#ffe082] block">
                      Executive Leadership &amp; Transformation
                    </span>
                    <p className="text-xs text-slate-300">
                      Organizational change management, executive sponsorship, stakeholder negotiation, and cross-functional execution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Institution: William Howard Taft University · The Taft University System (In Progress)
                </span>
                <button
                  onClick={() => setIsTaftModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#f2c94c] text-[#0a192f] hover:bg-[#ffe082]"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
