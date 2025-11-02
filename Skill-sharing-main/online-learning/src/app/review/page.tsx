"use client";

import { useState, useMemo } from "react";
import { Star, Search, Filter, User, Code, Brain, FlaskConical, BookOpen, Atom, Cloud } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

const tutors = [
  {
    id: 1,
    name: "Diana Prince",
    icon: Brain,
    rating: 5.0,
    reviews: 212,
    bio: "Data Scientist with a PhD in Machine Learning. I specialize in simplifying complex concepts into real-world applications.",
    courses: ["Data Science", "Machine Learning", "Python"],
    category: "Computer Science",
  },
  {
    id: 2,
    name: "Dr. Emily Carter",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 145,
    bio: "Biologist passionate about cellular processes and genetics. I make biology engaging through interactive discussions.",
    courses: ["General Biology", "Cell Biology", "Genetics"],
    category: "Biology",
  },
  {
    id: 3,
    name: "Michael Brown",
    icon: Atom,
    rating: 4.8,
    reviews: 118,
    bio: "Physics professor focusing on thermodynamics and modern physics. Love connecting theory to daily life examples.",
    courses: ["Thermodynamics", "Modern Physics", "Mechanics"],
    category: "Physics",
  },
  {
    id: 4,
    name: "Alex Johnson",
    icon: Code,
    rating: 4.7,
    reviews: 134,
    bio: "Software engineer teaching core programming and web development skills using hands-on projects.",
    courses: ["Programming I", "Programming II", "Web Development", "Database Systems"],
    category: "Computer Science",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    icon: BookOpen,
    rating: 4.8,
    reviews: 167,
    bio: "English instructor with a focus on literature analysis and creative writing. Encouraging expression through language.",
    courses: ["English Composition", "Creative Writing", "World Literature"],
    category: "English",
  },
  {
    id: 6,
    name: "Dr. Nikhil Sharma",
    icon: Brain,
    rating: 4.9,
    reviews: 192,
    bio: "Expert in Artificial Intelligence and Data Analysis. Teaching students how to make machines think intelligently.",
    courses: ["Data Science", "Artificial Intelligence", "Machine Learning", "Deep Learning"],
    category: "Computer Science",
  },
  {
    id: 7,
    name: "Emma Wilson",
    icon: FlaskConical,
    rating: 4.6,
    reviews: 88,
    bio: "Chemistry tutor focusing on organic and analytical chemistry with practical lab insights.",
    courses: ["Organic Chemistry", "Analytical Chemistry", "Environmental Chemistry"],
    category: "Chemistry",
  },
  {
    id: 8,
    name: "Dr. Olivia Zhang",
    icon: Brain,
    rating: 4.9,
    reviews: 154,
    bio: "Psychology professor specializing in cognitive and social psychology. Helping students understand the mind.",
    courses: ["Introduction to Psychology", "Cognitive Psychology", "Social Psychology"],
    category: "Psychology",
  },
  {
    id: 9,
    name: "Sofia Martinez",
    icon: Atom,
    rating: 4.8,
    reviews: 121,
    bio: "Mathematician teaching everything from Algebra to Differential Equations. Simplifying complex math concepts.",
    courses: ["Algebra II", "Calculus I", "Linear Algebra", "Statistics"],
    category: "Mathematics",
  },
  {
    id: 10,
    name: "Dr. Claire Bennett",
    icon: BookOpen,
    rating: 4.7,
    reviews: 115,
    bio: "Sociology and Political Science specialist. Passionate about teaching how societies function and evolve.",
    courses: ["Sociology", "Political Science", "Cultural Studies"],
    category: "Social Sciences",
  },
  {
    id: 11,
    name: "Isabella Torres",
    icon: Brain,
    rating: 4.9,
    reviews: 143,
    bio: "Data Analyst and instructor for all levels of data and visualization techniques.",
    courses: ["Data Science", "Data Visualization", "Python"],
    category: "Computer Science",
  },
  {
    id: 12,
    name: "Laura Harris",
    icon: BookOpen,
    rating: 4.7,
    reviews: 89,
    bio: "Design instructor focused on digital art and creative expression through modern tools.",
    courses: ["Graphic Design", "Digital Illustration", "Photography"],
    category: "Art & Design",
  },

  {
    id: 13,
    name: "Sana Ali",
    icon: Brain,
    rating: 4.7,
    reviews: 95,
    bio: "Environmental scientist studying pollution, remediation and policy.",
    courses: ["Environmental Science", "Environmental Chemistry", "Sustainability"],
    category: "Environmental Science",
  },

   {
    id: 14,
    name: "Victor Chen",
    icon: Cloud,
    rating: 4.8,
    reviews: 150,
    bio: "DevOps engineer teaching cloud, CI/CD and containers.",
    courses: ["Cloud Computing", "DevOps Basics", "Docker & Kubernetes"],
    category: "Computer Science",
  },

  {
    id: 15,
    name: "Leo Rossi",
    icon: Code,
    rating: 4.7,
    reviews: 102,
    bio: "Software architect focusing on algorithms, performance and system design.",
    courses: ["Data Structures & Algorithms", "Software Engineering", "Systems Design"],
    category: "Computer Science",
  },

  {
    id: 16,
    name: "Hana Suzuki",
    icon: BookOpen,
    rating: 4.9,
    reviews: 159,
    bio: "Translator and linguist teaching Japanese and comparative linguistics.",
    courses: ["Japanese Language", "Linguistics", "Translation Studies"],
    category: "Languages",
  },

  {
    id: 17,
    name: "Dr. Peter Walsh",
    icon: Atom,
    rating: 4.8,
    reviews: 146,
    bio: "Pharmaceutical scientist teaching drug design and pharmacokinetics.",
    courses: ["Pharmacology Basics", "Medicinal Chemistry", "Biochemistry"],
    category: "Medicine",
  },

  {
    id: 18,
    name: "Amara Okonkwo",
    icon: Brain,
    rating: 4.7,
    reviews: 88,
    bio: "Public health specialist with a focus on epidemiology and health policy.",
    courses: ["Health Psychology", "Epidemiology", "Public Health Ethics"],
    category: "Health Science",
  },

  {
    id: 19,
    name: "Carlos Mendes",
    icon: Atom,
    rating: 4.9,
    reviews: 203,
    bio: "Statistician passionate about applied statistics and experimental design.",
    courses: ["Statistics", "Probability Theory", "Data Visualization"],
    category: "Mathematics",
  },

  {
    id: 20,
    name: "Dr. Fiona O'Connor",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 140,
    bio: "Marine biologist studying ecology and conservation; fieldwork-based teaching.",
    courses: ["Marine Biology", "Ecology", "Evolutionary Biology"],
    category: "Biology",
  },

  {
    id: 21,
    name: "Ethan Park",
    icon: Code,
    rating: 4.6,
    reviews: 63,
    bio: "Cybersecurity engineer helping learners build secure web apps and defenses.",
    courses: ["Cybersecurity", "Network Security", "Ethical Hacking Basics"],
    category: "Computer Science",
  },

    // --- Languages (add 2 more) ---
  {
    id: 22,
    name: "Mateo González",
    icon: BookOpen,
    rating: 4.8,
    reviews: 120,
    bio: "Spanish language instructor with 10+ years of experience helping students achieve fluency through immersion techniques.",
    courses: ["Spanish I", "Spanish II", "Conversational Spanish"],
    category: "Languages",
  },
  {
    id: 23,
    name: "Elena Petrova",
    icon: BookOpen,
    rating: 4.9,
    reviews: 137,
    bio: "Linguistics researcher teaching Russian language, phonetics, and comparative grammar.",
    courses: ["Russian Language", "Phonetics", "Comparative Grammar"],
    category: "Languages",
  },

  // --- Medicine (add 5 more) ---
  {
    id: 24,
    name: "Dr. Marcus Reed",
    icon: Atom,
    rating: 4.8,
    reviews: 176,
    bio: "Medical doctor and anatomy instructor focusing on physiology and organ systems.",
    courses: ["Human Anatomy", "Physiology", "Clinical Pathology"],
    category: "Medicine",
  },
  {
    id: 25,
    name: "Dr. Aisha Rahman",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 164,
    bio: "Immunologist and researcher guiding students through microbiology and disease prevention.",
    courses: ["Microbiology", "Immunology", "Infectious Diseases"],
    category: "Medicine",
  },
  {
    id: 26,
    name: "Dr. Jonas Becker",
    icon: Brain,
    rating: 4.7,
    reviews: 111,
    bio: "Neuroscientist exploring brain function and neural communication. Passionate about medical neuroscience education.",
    courses: ["Neuroscience", "Neuroanatomy", "Molecular Biology"],
    category: "Medicine",
  },
  {
    id: 27,
    name: "Dr. Hannah Patel",
    icon: Atom,
    rating: 4.8,
    reviews: 133,
    bio: "Physician assistant educator teaching clinical diagnostics and patient care.",
    courses: ["Clinical Diagnostics", "Medical Ethics", "Emergency Medicine"],
    category: "Medicine",
  },
  {
    id: 28,
    name: "Dr. Leo Anders",
    icon: FlaskConical,
    rating: 4.7,
    reviews: 97,
    bio: "Pharmacologist with deep insight into drug development and therapeutic applications.",
    courses: ["Pharmacology", "Toxicology", "Therapeutics"],
    category: "Medicine",
  },

  // --- Art & Design (add 1 more) ---
  {
    id: 29,
    name: "Nina Laurent",
    icon: BookOpen,
    rating: 4.9,
    reviews: 122,
    bio: "Art historian and visual artist teaching color theory and art interpretation through global perspectives.",
    courses: ["Art History", "Color Theory", "Modern Art Movements"],
    category: "Art & Design",
  },

  // --- Biology (add 4 more) ---
  {
    id: 30,
    name: "Dr. Ahmed El-Sayed",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 151,
    bio: "Geneticist with experience in genomics and DNA sequencing technologies.",
    courses: ["Genetics", "Molecular Biology", "Bioinformatics"],
    category: "Biology",
  },
  {
    id: 31,
    name: "Dr. Rachel Kim",
    icon: FlaskConical,
    rating: 4.7,
    reviews: 98,
    bio: "Microbiologist specializing in bacteria and virology with a hands-on approach to lab skills.",
    courses: ["Microbiology", "Virology", "Biochemistry"],
    category: "Biology",
  },
  {
    id: 32,
    name: "Dr. Louis Moreau",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 178,
    bio: "Evolutionary biologist studying adaptation and population genetics.",
    courses: ["Evolution", "Population Genetics", "Field Biology"],
    category: "Biology",
  },
  {
    id: 33,
    name: "Maya Roberts",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 105,
    bio: "Botanist teaching plant biology and ecology through interactive virtual labs.",
    courses: ["Botany", "Plant Physiology", "Environmental Biology"],
    category: "Biology",
  },

    // --- English (add 2 more) ---
  {
    id: 34,
    name: "James Thornton",
    icon: BookOpen,
    rating: 4.8,
    reviews: 132,
    bio: "English professor emphasizing critical reading and essay composition to build strong analytical skills.",
    courses: ["English Literature", "Academic Writing", "Critical Reading"],
    category: "English",
  },
  {
    id: 35,
    name: "Grace Patel",
    icon: BookOpen,
    rating: 4.7,
    reviews: 115,
    bio: "Creative writing coach helping students find their voice through storytelling and poetry.",
    courses: ["Creative Writing", "Poetry Workshop", "Short Story Craft"],
    category: "English",
  },

  // --- Mathematics (add 4 more) ---
  {
    id: 36,
    name: "Dr. Nathan Li",
    icon: Atom,
    rating: 4.9,
    reviews: 164,
    bio: "Mathematician specializing in calculus and differential equations, helping students visualize abstract math concepts.",
    courses: ["Calculus II", "Differential Equations", "Mathematical Modeling"],
    category: "Mathematics",
  },
  {
    id: 37,
    name: "Julia Carter",
    icon: Atom,
    rating: 4.7,
    reviews: 109,
    bio: "Math instructor focusing on algebra and geometry fundamentals for high school and college prep.",
    courses: ["Algebra I", "Geometry", "Trigonometry"],
    category: "Mathematics",
  },
  {
    id: 38,
    name: "Dr. Omar Hassan",
    icon: Atom,
    rating: 4.8,
    reviews: 143,
    bio: "Applied mathematician and statistician teaching real-world problem-solving using advanced math techniques.",
    courses: ["Applied Mathematics", "Probability & Statistics", "Numerical Methods"],
    category: "Mathematics",
  },
  {
    id: 39,
    name: "Priya Desai",
    icon: Atom,
    rating: 4.9,
    reviews: 127,
    bio: "Tutor helping students master the SAT and college-level math through practice and intuitive logic.",
    courses: ["Pre-Calculus", "SAT Math Prep", "Linear Algebra"],
    category: "Mathematics",
  },

  // --- Physics (add 3 more) ---
  {
    id: 40,
    name: "Dr. Rafael Morales",
    icon: Atom,
    rating: 4.8,
    reviews: 138,
    bio: "Astrophysicist teaching mechanics, relativity, and astronomy with engaging visual simulations.",
    courses: ["Astrophysics", "Relativity", "Classical Mechanics"],
    category: "Physics",
  },
  {
    id: 41,
    name: "Lena Fischer",
    icon: Atom,
    rating: 4.7,
    reviews: 102,
    bio: "Experimental physicist focusing on optics and wave theory with hands-on demonstrations.",
    courses: ["Optics", "Waves & Vibrations", "Quantum Mechanics"],
    category: "Physics",
  },
  {
    id: 42,
    name: "Dr. Ben Thompson",
    icon: Atom,
    rating: 4.9,
    reviews: 160,
    bio: "Nuclear physics expert helping students understand atomic structure and energy systems.",
    courses: ["Nuclear Physics", "Thermodynamics", "Modern Physics"],
    category: "Physics",
  },

  // --- Social Sciences (add 3 more) ---
  {
    id: 43,
    name: "Dr. Maya Hernandez",
    icon: BookOpen,
    rating: 4.8,
    reviews: 150,
    bio: "Anthropologist exploring human culture, society, and global diversity through an inclusive lens.",
    courses: ["Cultural Anthropology", "Human Geography", "Social Change"],
    category: "Social Sciences",
  },
  {
    id: 44,
    name: "Samuel Greene",
    icon: BookOpen,
    rating: 4.7,
    reviews: 128,
    bio: "Economics and sociology instructor helping students connect social theories with real-world events.",
    courses: ["Economics", "Sociology", "Public Policy"],
    category: "Social Sciences",
  },
  {
    id: 45,
    name: "Dr. Clara Nguyen",
    icon: BookOpen,
    rating: 4.9,
    reviews: 174,
    bio: "Political scientist and historian passionate about global governance and international relations.",
    courses: ["Political Theory", "International Relations", "Comparative Politics"],
    category: "Social Sciences",
  },

    {
    id: 46,
    name: "Dr. Marcus Rivera",
    icon: BookOpen,
    rating: 4.8,
    reviews: 136,
    bio: "Art historian specializing in Renaissance and modern art movements.",
    courses: ["Art History", "Modern Art", "Museum Studies"],
    category: "Art & Design",
  },
  {
    id: 47,
    name: "Clara Nguyen",
    icon: BookOpen,
    rating: 4.9,
    reviews: 158,
    bio: "Digital illustrator and animator teaching 2D and 3D art fundamentals.",
    courses: ["Digital Illustration", "Animation", "Character Design"],
    category: "Art & Design",
  },
  {
    id: 48,
    name: "Aiden Brooks",
    icon: BookOpen,
    rating: 4.7,
    reviews: 121,
    bio: "Graphic designer helping students master layout, branding, and color theory.",
    courses: ["Graphic Design", "Typography", "Brand Design"],
    category: "Art & Design",
  },
  {
    id: 49,
    name: "Mila Patel",
    icon: BookOpen,
    rating: 4.8,
    reviews: 142,
    bio: "Photographer with 10+ years of experience in portrait and landscape photography.",
    courses: ["Photography", "Lighting Techniques", "Editing & Retouching"],
    category: "Art & Design",
  },
  {
    id: 50,
    name: "Rafael Gomez",
    icon: BookOpen,
    rating: 4.9,
    reviews: 174,
    bio: "Fashion designer teaching concept development and portfolio building.",
    courses: ["Fashion Design", "Textile Studies", "Design Portfolio"],
    category: "Art & Design",
  },
  {
    id: 51,
    name: "Dr. Maya Thompson",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 167,
    bio: "Molecular biologist specializing in genetics and cell function.",
    courses: ["Molecular Biology", "Genetics", "Biochemistry"],
    category: "Biology",
  },
  {
    id: 52,
    name: "Jonas Müller",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 138,
    bio: "Ecologist passionate about biodiversity and environmental conservation.",
    courses: ["Ecology", "Environmental Biology", "Evolutionary Biology"],
    category: "Biology",
  },
  {
    id: 53,
    name: "Dr. Naomi Foster",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 189,
    bio: "Organic chemist with expertise in reaction mechanisms and synthesis.",
    courses: ["Organic Chemistry I", "Organic Chemistry II", "Chemical Synthesis"],
    category: "Chemistry",
  },
  {
    id: 54,
    name: "Liam Edwards",
    icon: FlaskConical,
    rating: 4.7,
    reviews: 110,
    bio: "Physical chemist teaching thermodynamics and kinetics for real-world contexts.",
    courses: ["Physical Chemistry", "Chemical Kinetics", "Quantum Chemistry"],
    category: "Chemistry",
  },
  {
    id: 55,
    name: "Isla Novak",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 122,
    bio: "Industrial chemist guiding students through applied chemistry and lab processes.",
    courses: ["Industrial Chemistry", "Material Chemistry", "Analytical Chemistry"],
    category: "Chemistry",
  },
  {
    id: 56,
    name: "Dr. Omar Hassan",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 176,
    bio: "Forensic chemist focusing on lab analysis and toxicology applications.",
    courses: ["Forensic Chemistry", "Toxicology", "Analytical Techniques"],
    category: "Chemistry",
  },
  {
    id: 57,
    name: "Ella Roberts",
    icon: FlaskConical,
    rating: 4.6,
    reviews: 92,
    bio: "Medicinal chemist teaching pharmaceutical compound design.",
    courses: ["Medicinal Chemistry", "Biochemistry", "Pharmaceutical Analysis"],
    category: "Chemistry",
  },
  {
    id: 58,
    name: "Javier Lopez",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 134,
    bio: "Inorganic chemist focusing on metals and coordination compounds.",
    courses: ["Inorganic Chemistry", "Materials Science", "Nanochemistry"],
    category: "Chemistry",
  },
  {
    id: 59,
    name: "Sophia Lin",
    icon: FlaskConical,
    rating: 4.7,
    reviews: 119,
    bio: "Environmental chemist specializing in pollution chemistry and sustainability.",
    courses: ["Environmental Chemistry", "Green Chemistry", "Sustainability Science"],
    category: "Chemistry",
  },
  {
    id: 60,
    name: "Dr. Raymond Carter",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 141,
    bio: "Polymer chemist teaching the chemistry of plastics and materials innovation.",
    courses: ["Polymer Chemistry", "Organic Materials", "Industrial Chemistry"],
    category: "Chemistry",
  },
  {
    id: 61,
    name: "Grace Hill",
    icon: BookOpen,
    rating: 4.8,
    reviews: 152,
    bio: "English literature professor exploring Shakespeare and classical texts.",
    courses: ["Shakespeare Studies", "British Literature", "Poetry Analysis"],
    category: "English",
  },
  {
    id: 62,
    name: "Dr. Ahmed Saleh",
    icon: BookOpen,
    rating: 4.9,
    reviews: 161,
    bio: "Linguist and literature expert teaching syntax and semantics.",
    courses: ["Linguistics", "Literature Analysis", "Advanced Writing"],
    category: "English",
  },
  {
    id: 63,
    name: "Olivia Green",
    icon: BookOpen,
    rating: 4.7,
    reviews: 130,
    bio: "Creative writing tutor helping students find their narrative voice.",
    courses: ["Creative Writing", "Poetry & Prose", "Story Development"],
    category: "English",
  },
  {
    id: 64,
    name: "Noah Kim",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 115,
    bio: "Environmental engineer focusing on renewable energy and sustainability.",
    courses: ["Environmental Engineering", "Renewable Energy", "Climate Science"],
    category: "Environmental Science",
  },
  {
    id: 65,
    name: "Dr. Helena Brooks",
    icon: FlaskConical,
    rating: 4.9,
    reviews: 147,
    bio: "Ecologist and field researcher passionate about conservation biology.",
    courses: ["Ecology", "Biodiversity", "Conservation Science"],
    category: "Environmental Science",
  },
  {
    id: 66,
    name: "Ryan Chen",
    icon: FlaskConical,
    rating: 4.7,
    reviews: 106,
    bio: "Environmental policy expert connecting science with sustainability laws.",
    courses: ["Environmental Policy", "Sustainability Management", "Environmental Law"],
    category: "Environmental Science",
  },
  {
    id: 67,
    name: "Lila Ahmed",
    icon: FlaskConical,
    rating: 4.8,
    reviews: 138,
    bio: "Climate scientist focused on atmospheric change and renewable technology.",
    courses: ["Climate Change", "Atmospheric Science", "Renewable Energy"],
    category: "Environmental Science",
  },
  {
    id: 68,
    name: "Marcus Bell",
    icon: FlaskConical,
    rating: 4.6,
    reviews: 97,
    bio: "Wildlife biologist teaching sustainability and environmental fieldwork methods.",
    courses: ["Field Ecology", "Wildlife Management", "Environmental Biology"],
    category: "Environmental Science",
  },
  {
    id: 69,
    name: "Dr. Hannah Rivera",
    icon: Brain,
    rating: 4.9,
    reviews: 163,
    bio: "Clinical psychologist specializing in mental health and therapy techniques.",
    courses: ["Clinical Psychology", "Abnormal Psychology", "Health Psychology"],
    category: "Psychology",
  },
  {
    id: 70,
    name: "Lucas White",
    icon: Brain,
    rating: 4.8,
    reviews: 142,
    bio: "Cognitive psychologist studying memory, perception, and attention.",
    courses: ["Cognitive Psychology", "Memory Studies", "Experimental Psychology"],
    category: "Psychology",
  },
  {
    id: 71,
    name: "Sophia Adams",
    icon: Brain,
    rating: 4.7,
    reviews: 128,
    bio: "Developmental psychologist passionate about lifespan development.",
    courses: ["Developmental Psychology", "Child Psychology", "Personality Theories"],
    category: "Psychology",
  },
  {
    id: 72,
    name: "Ethan Lewis",
    icon: Brain,
    rating: 4.9,
    reviews: 174,
    bio: "Behavioral neuroscientist connecting brain function with behavior.",
    courses: ["Neuropsychology", "Biological Psychology", "Behavioral Neuroscience"],
    category: "Psychology",
  },
  {
    id: 73,
    name: "Amira Singh",
    icon: Brain,
    rating: 4.8,
    reviews: 132,
    bio: "Health psychologist researching stress, resilience, and wellness.",
    courses: ["Health Psychology", "Positive Psychology", "Clinical Practice"],
    category: "Psychology",
  },
  {
    id: 74,
    name: "Dr. Jacob Patel",
    icon: Brain,
    rating: 4.8,
    reviews: 150,
    bio: "Forensic psychologist with expertise in legal applications of psychology.",
    courses: ["Forensic Psychology", "Criminal Behavior", "Law & Psychology"],
    category: "Psychology",
  },
  {
    id: 75,
    name: "Emily Rivera",
    icon: Brain,
    rating: 4.7,
    reviews: 116,
    bio: "Educational psychologist exploring learning processes and motivation.",
    courses: ["Educational Psychology", "Motivation Theory", "Cognitive Development"],
    category: "Psychology",
  },
  {
    id: 76,
    name: "Dr. David Kim",
    icon: Brain,
    rating: 4.9,
    reviews: 185,
    bio: "Public health educator focusing on community well-being and epidemiology.",
    courses: ["Public Health", "Community Health", "Health Education"],
    category: "Health Science",
  },
  {
    id: 77,
    name: "Megan Carter",
    icon: Brain,
    rating: 4.8,
    reviews: 132,
    bio: "Nutritionist teaching principles of diet, metabolism, and health.",
    courses: ["Nutrition", "Dietary Science", "Health Promotion"],
    category: "Health Science",
  },
  {
    id: 78,
    name: "Victor Huang",
    icon: Brain,
    rating: 4.8,
    reviews: 141,
    bio: "Occupational therapist guiding students through rehab and therapy design.",
    courses: ["Occupational Therapy", "Health Psychology", "Rehabilitation Studies"],
    category: "Health Science",
  },
  {
    id: 79,
    name: "Isabella Rossi",
    icon: Brain,
    rating: 4.9,
    reviews: 164,
    bio: "Healthcare manager focusing on policy, systems, and leadership.",
    courses: ["Healthcare Management", "Public Health Ethics", "Policy & Planning"],
    category: "Health Science",
  },
  {
    id: 80,
    name: "Daniel Green",
    icon: Atom,
    rating: 4.8,
    reviews: 142,
    bio: "Applied mathematician teaching modeling, data analysis, and problem solving.",
    courses: ["Mathematical Modeling", "Applied Math", "Numerical Methods"],
    category: "Mathematics",
  },
  {
    id: 81,
    name: "Rachel Kim",
    icon: Atom,
    rating: 4.9,
    reviews: 158,
    bio: "Number theorist passionate about pure math and mathematical logic.",
    courses: ["Number Theory", "Abstract Algebra", "Discrete Mathematics"],
    category: "Mathematics",
  },
  {
    id: 82,
    name: "Liam O’Donnell",
    icon: Atom,
    rating: 4.8,
    reviews: 133,
    bio: "Statistician specializing in data-driven problem solving and probability.",
    courses: ["Probability Theory", "Statistics II", "Data Analytics"],
    category: "Mathematics",
  },
  {
    id: 83,
    name: "Sophia Becker",
    icon: Atom,
    rating: 4.7,
    reviews: 115,
    bio: "Geometry tutor simplifying shapes, proofs, and spatial reasoning.",
    courses: ["Geometry", "Trigonometry", "Precalculus"],
    category: "Mathematics",
  },
  {
    id: 84,
    name: "Dr. Nadia Farouk",
    icon: Atom,
    rating: 4.8,
    reviews: 139,
    bio: "Surgeon and medical educator teaching anatomy and clinical procedures.",
    courses: ["Human Anatomy", "Clinical Procedures", "Medical Ethics"],
    category: "Medicine",
  },
  {
    id: 85,
    name: "Alexei Ivanov",
    icon: Atom,
    rating: 4.9,
    reviews: 167,
    bio: "Medical researcher focused on pharmacology and biomedical sciences.",
    courses: ["Pharmacology", "Biomedical Science", "Molecular Medicine"],
    category: "Medicine",
  },
  {
    id: 86,
    name: "Dr. Hailey Cooper",
    icon: Atom,
    rating: 4.8,
    reviews: 151,
    bio: "Cardiologist and lecturer teaching cardiovascular and human physiology.",
    courses: ["Cardiology", "Human Physiology", "Internal Medicine"],
    category: "Medicine",
  },
  {
    id: 87,
    name: "Omar Delgado",
    icon: Atom,
    rating: 4.7,
    reviews: 112,
    bio: "Pathologist mentoring students in medical diagnostics and disease mechanisms.",
    courses: ["Pathology", "Immunology", "Medical Microbiology"],
    category: "Medicine",
  },



];

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(tutors.map((t) => t.category))].sort();

  const filteredTutors = useMemo(() => {
    return tutors
      .filter((t) => (category === "All" ? true : t.category === category))
      .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.rating - a.rating);
  }, [search, category]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex justify-center items-center py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center">
          Ratings & Reviews
        </h1>
      </div>

      {/* 🔍 Filter/Search Section */}
      <section className="py-6 bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="flex items-center w-full md:w-1/2 relative">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tutors by name..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 👩‍🏫 Tutors Section */}
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => {
              const Icon = tutor.icon;
              return (
                <div
                  key={tutor.id}
                  className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {tutor.name}
                      </h2>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="ml-1 font-medium text-gray-800">
                          {tutor.rating.toFixed(1)} ({tutor.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4">{tutor.bio}</p>

                  {/* Courses */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.courses.map((course) => (
                      <span
                        key={course}
                        className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full"
                      >
                        {course}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Profile
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No tutors found matching your criteria.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
