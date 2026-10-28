import os

candidates = [
    {"file": "arjun.svg", "bg": "#E2E8F0", "suit": "#1E293B", "kurta": "#FFFFFF", "tie": "#F97316", "initials": "AS", "name": "Arjun Sharma"},
    {"file": "vikram.svg", "bg": "#E0F2FE", "suit": "#0F172A", "kurta": "#FFFFFF", "tie": "#0284C7", "initials": "VD", "name": "Vikram Das"},
    {"file": "devendra.svg", "bg": "#DCFCE7", "suit": "#14532D", "kurta": "#F0FDF4", "tie": "#15803D", "initials": "DPY", "name": "D. P. Yadav"},
    {"file": "sunil.svg", "bg": "#FEF9C3", "suit": "#713F12", "kurta": "#FEF08A", "tie": "#CA8A04", "initials": "SK", "name": "Sunil Kushwaha"},
    {"file": "sanjay.svg", "bg": "#EDE9FE", "suit": "#312E81", "kurta": "#FFFFFF", "tie": "#7C3AED", "initials": "SKS", "name": "Sanjay Singh"},
    {"file": "mithilesh.svg", "bg": "#FFEDD5", "suit": "#7C2D12", "kurta": "#FFFFFF", "tie": "#EA580C", "initials": "MK", "name": "Mithilesh Kumar"},
    {"file": "varun.svg", "bg": "#E0E7FF", "suit": "#1E1B4B", "kurta": "#EEF2FF", "tie": "#4338CA", "initials": "VK", "name": "Dr. Varun Kumar"},
    {"file": "sunil_k.svg", "bg": "#FCE7F3", "suit": "#831843", "kurta": "#FDF2F8", "tie": "#BE185D", "initials": "SK", "name": "Sunil Kumar"},
    {"file": "amit.svg", "bg": "#CFFAFE", "suit": "#164E63", "kurta": "#ECFEFF", "tie": "#0891B2", "initials": "AT", "name": "Amit Tunna"},
    {"file": "brajesh.svg", "bg": "#FEE2E2", "suit": "#7F1D1D", "kurta": "#FEF2F2", "tie": "#DC2626", "initials": "BP", "name": "Brajesh Pathak"},
    {"file": "ravidas.svg", "bg": "#DCFCE7", "suit": "#064E3B", "kurta": "#ECFDF5", "tie": "#059669", "initials": "RM", "name": "Ravidas Mehrotra"},
    {"file": "sadaf.svg", "bg": "#F3E8FF", "suit": "#581C87", "kurta": "#FAF5FF", "tie": "#9333EA", "initials": "SJ", "name": "Sadaf Jafar"},
    {"file": "ananta.svg", "bg": "#CCFBF1", "suit": "#134E4A", "kurta": "#F0FDFA", "tie": "#0D9488", "initials": "ANJ", "name": "Ananta Jena"},
    {"file": "jagannath.svg", "bg": "#FFEDD5", "suit": "#7C2D12", "kurta": "#FFF7ED", "tie": "#C2410C", "initials": "JP", "name": "Jagannath Pradhan"},
    {"file": "satya.svg", "bg": "#E0F2FE", "suit": "#0C4A6E", "kurta": "#F0F9FF", "tie": "#0284C7", "initials": "SPN", "name": "Satya Nayak"},
    {"file": "default.svg", "bg": "#F1F5F9", "suit": "#334155", "kurta": "#FFFFFF", "tie": "#64748B", "initials": "CAN", "name": "Candidate"},
]

out_dir = r"d:\E-Voting Pilot System\frontend\public\candidates"
os.makedirs(out_dir, exist_ok=True)

for c in candidates:
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
  <!-- Studio Passport Background -->
  <rect width="100" height="120" fill="{c['bg']}" rx="4"/>
  <rect x="0.5" y="0.5" width="99" height="119" fill="none" stroke="#94A3B8" stroke-width="1" rx="4"/>
  
  <!-- Passport Vignette / Studio Lighting -->
  <radialGradient id="grad_{c['initials']}" cx="50%" cy="40%" r="50%">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="{c['bg']}" stop-opacity="0"/>
  </radialGradient>
  <rect width="100" height="120" fill="url(#grad_{c['initials']})"/>

  <!-- Head / Face Silhouette -->
  <ellipse cx="50" cy="46" rx="20" ry="24" fill="#F8D7BE"/>
  
  <!-- Hair Silhouette -->
  <path d="M 28 42 C 28 22, 72 22, 72 42 C 68 30, 58 26, 50 26 C 42 26, 32 30, 28 42 Z" fill="#1E293B"/>

  <!-- Ears -->
  <ellipse cx="29" cy="47" rx="3.5" ry="6" fill="#F1BC9B"/>
  <ellipse cx="71" cy="47" rx="3.5" ry="6" fill="#F1BC9B"/>

  <!-- Eyes & Eyebrows -->
  <ellipse cx="42" cy="44" rx="2" ry="1.5" fill="#1E293B"/>
  <ellipse cx="58" cy="44" rx="2" ry="1.5" fill="#1E293B"/>
  <path d="M 38 40 Q 42 38 46 40" stroke="#1E293B" stroke-width="1.2" fill="none"/>
  <path d="M 54 40 Q 58 38 62 40" stroke="#1E293B" stroke-width="1.2" fill="none"/>
  
  <!-- Nose & Smile -->
  <path d="M 50 44 L 49 50 L 52 50" stroke="#D97706" stroke-width="1" fill="none"/>
  <path d="M 45 55 Q 50 58 55 55" stroke="#9A3412" stroke-width="1.2" fill="none"/>

  <!-- Neck -->
  <rect x="43" y="66" width="14" height="12" fill="#E8B08F"/>

  <!-- Formal Shoulders & Attire (Nehru Jacket / Formal Coat) -->
  <path d="M 12 120 L 18 84 Q 50 78 82 84 L 88 120 Z" fill="{c['suit']}"/>
  
  <!-- Inner White Collar / Shirt -->
  <polygon points="44,76 50,96 56,76 50,78" fill="{c['kurta']}"/>
  
  <!-- Tie or Jacket Trim -->
  <polygon points="48,80 52,80 53,108 50,114 47,108" fill="{c['tie']}"/>

  <!-- Official Passport Label Badge -->
  <rect x="15" y="104" width="70" height="13" rx="2" fill="#0F172A" fill-opacity="0.85"/>
  <text x="50" y="113" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">{c['initials']}</text>
</svg>"""
    with open(os.path.join(out_dir, c['file']), "w", encoding="utf-8") as f:
        f.write(svg_content)

print(f"Generated {len(candidates)} candidate passport photos in {out_dir}")
