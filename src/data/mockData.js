/**
 * All match data, groups, and schedules are sourced from the official
 * FIFA World Cup 2026 draw and fixture list.
 * Source: FIFA.com / Al Jazeera full schedule (June 11 – July 19, 2026)
 *
 * Groups (48 teams, 12 groups of 4):
 * A: Mexico, South Africa, Korea Republic, Czechia
 * B: Canada, Bosnia and Herzegovina, Qatar, Switzerland
 * C: Brazil, Morocco, Haiti, Scotland
 * D: USA, Paraguay, Australia, Türkiye
 * E: Germany, Curaçao, Côte d'Ivoire, Ecuador
 * F: Netherlands, Japan, Sweden, Tunisia
 * G: Belgium, Egypt, Iran, New Zealand
 * H: Spain, Cape Verde, Saudi Arabia, Uruguay
 * I: France, Senegal, Iraq, Norway
 * J: Argentina, Algeria, Austria, Jordan
 * K: Portugal, DR Congo, Uzbekistan, Colombia
 * L: England, Croatia, Ghana, Panama
 */

// ─── Featured Match Carousel ─────────────────────────────────────────────────
// First five matches of the tournament in chronological order.
// All times are ET (Eastern Time). Venues use FIFA's official renamed stadium names.

export const featuredMatches = [
  {
    id: 'mex-rsa',
    iso: '2026-06-11T19:00:00Z', // 3:00 PM ET
    home: { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
    away: { code: 'RSA', name: 'South Africa', flag: '🇿🇦' },
    venue: 'Mexico City Stadium (Estadio Azteca), Mexico City',
    kickoff: 'Thu Jun 11 · 3:00 PM ET',
    stage: 'Group A · Match 1',
    odds: { home: 52, draw: 26, away: 22 },
    tagline: 'The opening match of the 2026 World Cup — Mexico and South Africa recreate the iconic opener from the 1986 tournament at the very same ground.',
  },
  {
    id: 'kor-cze',
    iso: '2026-06-12T02:00:00Z', // 10:00 PM ET
    home: { code: 'KOR', name: 'Korea Republic', flag: '🇰🇷' },
    away: { code: 'CZE', name: 'Czechia', flag: '🇨🇿' },
    venue: 'Estadio Guadalajara (Estadio Akron), Zapopan',
    kickoff: 'Thu Jun 11 · 10:00 PM ET',
    stage: 'Group A · Match 2',
    odds: { home: 39, draw: 30, away: 31 },
    tagline: 'Son Heung-min leads Korea in what could be his final World Cup appearance.',
  },
  {
    id: 'can-bih',
    iso: '2026-06-12T19:00:00Z', // 3:00 PM ET
    home: { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
    away: { code: 'BIH', name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
    venue: 'Toronto Stadium (BMO Field), Toronto',
    kickoff: 'Fri Jun 12 · 3:00 PM ET',
    stage: 'Group B · Match 3',
    odds: { home: 48, draw: 28, away: 24 },
    tagline: 'Canada open their home tournament in front of a sold-out BMO Field.',
  },
  {
    id: 'usa-par',
    iso: '2026-06-13T01:00:00Z', // 9:00 PM ET
    home: { code: 'USA', name: 'United States', flag: '🇺🇸' },
    away: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
    venue: 'Los Angeles Stadium (SoFi Stadium), Los Angeles',
    kickoff: 'Fri Jun 12 · 9:00 PM ET',
    stage: 'Group D · Match 4',
    odds: { home: 54, draw: 25, away: 21 },
    tagline: 'The host nation opens their World Cup campaign in front of 70,000 at SoFi.',
  },
  {
    id: 'bra-mar',
    iso: '2026-06-13T22:00:00Z', // 6:00 PM ET
    home: { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
    away: { code: 'MAR', name: 'Morocco', flag: '🇲🇦' },
    venue: 'New York New Jersey Stadium (MetLife), New Jersey',
    kickoff: 'Sat Jun 13 · 6:00 PM ET',
    stage: 'Group C · Match 7',
    odds: { home: 49, draw: 27, away: 24 },
    tagline: 'The reigning African champions against the five-time world champions. MetLife will be electric.',
  },
]

// ─── Match Predictions Hub ───────────────────────────────────────────────────
// Using the highest-profile opening fixtures from across all groups.

export const predictions = [
  // Match 1 — Jun 11
  {
    id: 'mex-rsa',
    date: '2026-06-11',
    time: '15:00',
    home: { code: 'MEX', name: 'Mexico', flag: '🇲🇽' },
    away: { code: 'RSA', name: 'South Africa', flag: '🇿🇦' },
    probs: { home: 52, draw: 26, away: 22 },
    confidence: 68,
    stage: 'Group A · M1 · Jun 11 · 3:00 PM ET',
    factors: [
      { label: 'History', detail: 'Same fixture opened the 1986 World Cup at Azteca — 40 years later, same ground' },
      { label: 'Host advantage', detail: 'Mexico play in front of 87,000 at Azteca; South Africa massive underdogs' },
      { label: 'Form', detail: 'Mexico unbeaten in 9 home qualifiers; South Africa squeezed through play-offs' },
      { label: 'Stage', detail: 'Tournament opener — expect a cautious start; Mexico aiming to control tempo' },
    ],
  },
  // Match 2 — Jun 11
  {
    id: 'kor-cze',
    date: '2026-06-11',
    time: '22:00',
    home: { code: 'KOR', name: 'Korea Republic', flag: '🇰🇷' },
    away: { code: 'CZE', name: 'Czechia', flag: '🇨🇿' },
    probs: { home: 39, draw: 30, away: 31 },
    confidence: 55,
    stage: 'Group A · M2 · Jun 11 · 10:00 PM ET',
    factors: [
      { label: 'Key player', detail: "Son Heung-min at 34 — likely his final World Cup and hugely motivated" },
      { label: 'Form', detail: "Korea finished 2nd in CONCACAF/AFC qualifying; Czechia edged through European play-offs" },
      { label: 'Head-to-head', detail: "First World Cup meeting; two very even sides — coin-flip in the groups" },
      { label: 'Stage', detail: "Tight Group A — a draw here is a decent result for both sides" },
    ],
  },
  // Match 3 — Jun 12
  {
    id: 'can-bih',
    date: '2026-06-12',
    time: '15:00',
    home: { code: 'CAN', name: 'Canada', flag: '🇨🇦' },
    away: { code: 'BIH', name: 'Bosnia & Herz.', flag: '🇧🇦' },
    probs: { home: 44, draw: 29, away: 27 },
    confidence: 60,
    stage: 'Group B · M3 · Jun 12 · 3:00 PM ET',
    factors: [
      { label: 'Host advantage', detail: "Canada co-host and play in front of a packed Toronto crowd" },
      { label: 'Key player', detail: "Alphonso Davies anchors Canada's attack from left-back; Bosnia rely on Džeko partnership" },
      { label: 'Form', detail: "Canada won CONCACAF qualifying convincingly; Bosnia won a tight European play-off" },
      { label: 'Stage', detail: "Group B also includes Qatar and Switzerland — winning the opener is vital" },
    ],
  },
  // Match 4 — Jun 12
  {
    id: 'usa-par',
    date: '2026-06-12',
    time: '21:00',
    home: { code: 'USA', name: 'United States', flag: '🇺🇸' },
    away: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
    probs: { home: 50, draw: 28, away: 22 },
    confidence: 66,
    stage: 'Group D · M4 · Jun 12 · 9:00 PM ET',
    factors: [
      { label: 'Host advantage', detail: "USA co-host; Los Angeles crowd gives a massive home-field boost" },
      { label: 'Key player', detail: "Christian Pulisic leads a young, hungry USMNT lineup in front of their nation" },
      { label: 'Form', detail: "USA improved rapidly under Pochettino; Paraguay top South American qualifiers" },
      { label: 'Head-to-head', detail: "USA lead the series 5–2; Paraguay's best World Cup run was a 2010 quarter-final" },
    ],
  },
  // Match 5 — Jun 13
  {
    id: 'qat-sui',
    date: '2026-06-13',
    time: '15:00',
    home: { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
    away: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭' },
    probs: { home: 20, draw: 25, away: 55 },
    confidence: 72,
    stage: 'Group B · M5 · Jun 13 · 3:00 PM ET',
    factors: [
      { label: 'Form', detail: "Switzerland are a consistent Round of 16 side; Qatar winless (0W 1D 5L) at Qatar 2022" },
      { label: 'Quality gap', detail: "Switzerland ranked ~13 in FIFA rankings; Qatar ranked ~58 — a significant gap" },
      { label: 'Key player', detail: "Granit Xhaka provides Switzerland's creative spine alongside Embolo up front" },
      { label: 'Stage', detail: "Switzerland need points here to give themselves breathing room in Group B" },
    ],
  },
  // Match 6 — Jun 13
  {
    id: 'bra-mar',
    date: '2026-06-13',
    time: '18:00',
    home: { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
    away: { code: 'MAR', name: 'Morocco', flag: '🇲🇦' },
    probs: { home: 49, draw: 27, away: 24 },
    confidence: 72,
    stage: 'Group C · M6 · Jun 13 · 6:00 PM ET',
    factors: [
      { label: 'Form', detail: "Brazil won 6 of last 8 in qualifying; Morocco unbeaten in 10 AFCON & WC qualifiers" },
      { label: 'Head-to-head', detail: "Brazil lead all-time but Morocco were Qatar 2022 semi-finalists — huge confidence" },
      { label: 'Key player', detail: "Vinícius Júnior vs Morocco's ultra-organised defensive block — the key battle" },
      { label: 'Stage', detail: "Group opener — expect both sides to be cautious and take the draw if offered" },
    ],
  },
  // Match 7 — Jun 13
  {
    id: 'hai-sco',
    date: '2026-06-13',
    time: '21:00',
    home: { code: 'HAI', name: 'Haiti', flag: '🇭🇹' },
    away: { code: 'SCO', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    probs: { home: 26, draw: 28, away: 46 },
    confidence: 63,
    stage: 'Group C · M7 · Jun 13 · 9:00 PM ET',
    factors: [
      { label: 'Form', detail: "Scotland qualified via UEFA play-offs; Haiti are CONCACAF's biggest surprise qualifier" },
      { label: 'Head-to-head', detail: "First World Cup meeting — Scotland have far more big-tournament experience" },
      { label: 'Key player', detail: "Scott McTominay's goal-scoring midfielder role crucial to Scotland's set-piece threat" },
      { label: 'Stage', detail: "Both sides are massive underdogs in Group C alongside Brazil and Morocco" },
    ],
  },
  // Match 8 — Jun 13
  {
    id: 'aus-tur',
    date: '2026-06-13',
    time: '21:00',
    home: { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
    away: { code: 'TUR', name: 'Türkiye', flag: '🇹🇷' },
    probs: { home: 35, draw: 29, away: 36 },
    confidence: 52,
    stage: 'Group D · M8 · Jun 13 · 9:00 PM ET',
    factors: [
      { label: 'Form', detail: "Australia rode the Socceroos wave after Qatar 2022; Türkiye impressed at Euro 2024" },
      { label: 'Key player', detail: "Cengiz Ünder and Arda Güler give Türkiye real danger in behind Australia's high line" },
      { label: 'Head-to-head', detail: "Evenly matched historically — both sides desperate to avoid the USA/Paraguay shadow" },
      { label: 'Stage', detail: "A tight Group D — any team can finish 1st or 3rd depending on these opening games" },
    ],
  },
  // Match 9 — Jun 14
  {
    id: 'ger-cuw',
    date: '2026-06-14',
    time: '13:00',
    home: { code: 'GER', name: 'Germany', flag: '🇩🇪' },
    away: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' },
    probs: { home: 84, draw: 11, away: 5 },
    confidence: 91,
    stage: 'Group E · M9 · Jun 14 · 1:00 PM ET',
    factors: [
      { label: 'Quality gap', detail: "Germany ranked 4th in FIFA rankings; Curaçao ranked ~75 — a gulf in class" },
      { label: 'Form', detail: "Germany unbeaten in their last 15, Euro 2024 quarter-finalists on home soil" },
      { label: 'Key player', detail: "Jamal Musiala and Florian Wirtz form one of the most exciting midfield duos in the world" },
      { label: 'Stage', detail: "Germany must win comfortably to boost goal difference in a competitive Group E" },
    ],
  },
  // Match 10 — Jun 14
  {
    id: 'ned-jpn',
    date: '2026-06-14',
    time: '16:00',
    home: { code: 'NED', name: 'Netherlands', flag: '🇳🇱' },
    away: { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
    probs: { home: 47, draw: 27, away: 26 },
    confidence: 62,
    stage: 'Group F · M10 · Jun 14 · 4:00 PM ET',
    factors: [
      { label: 'Form', detail: "Netherlands Nations League finalists 2025; Japan topped a tough AFC qualifying group" },
      { label: 'Head-to-head', detail: "Japan shocked both Spain and Germany at Qatar 2022 — Netherlands wary of the upset" },
      { label: 'Key player', detail: "Cody Gakpo vs Japan's press-and-counter system will define how this match plays out" },
      { label: 'Stage', detail: "Group F also has Sweden and Tunisia — whoever wins here takes a big step towards R32" },
    ],
  },
]

// ─── Players (for comparison tool) ──────────────────────────────────────────
// Official squad members attending WC 2026.

export const players = [
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    team: 'France',
    flag: '🇫🇷',
    position: 'Forward',
    age: 27,
    attrs: { Pace: 97, Shooting: 90, Passing: 82, Dribbling: 93, Defending: 36, Physicality: 78 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'vinicius',
    name: 'Vinícius Júnior',
    team: 'Brazil',
    flag: '🇧🇷',
    position: 'Left Wing',
    age: 25,
    attrs: { Pace: 95, Shooting: 84, Passing: 80, Dribbling: 94, Defending: 29, Physicality: 70 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'bellingham',
    name: 'Jude Bellingham',
    team: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Attacking Midfield',
    age: 22,
    attrs: { Pace: 80, Shooting: 84, Passing: 86, Dribbling: 88, Defending: 72, Physicality: 85 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'pedri',
    name: 'Pedri',
    team: 'Spain',
    flag: '🇪🇸',
    position: 'Central Midfield',
    age: 23,
    attrs: { Pace: 79, Shooting: 74, Passing: 91, Dribbling: 89, Defending: 68, Physicality: 68 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'musiala',
    name: 'Jamal Musiala',
    team: 'Germany',
    flag: '🇩🇪',
    position: 'Attacking Midfield',
    age: 23,
    attrs: { Pace: 85, Shooting: 81, Passing: 84, Dribbling: 92, Defending: 58, Physicality: 66 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'pulisic',
    name: 'Christian Pulisic',
    team: 'United States',
    flag: '🇺🇸',
    position: 'Right Wing',
    age: 27,
    attrs: { Pace: 88, Shooting: 82, Passing: 80, Dribbling: 87, Defending: 44, Physicality: 65 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    team: 'Norway',
    flag: '🇳🇴',
    position: 'Striker',
    age: 25,
    attrs: { Pace: 89, Shooting: 95, Passing: 70, Dribbling: 79, Defending: 38, Physicality: 92 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'son',
    name: 'Son Heung-min',
    team: 'Korea Republic',
    flag: '🇰🇷',
    position: 'Left Wing',
    age: 34,
    attrs: { Pace: 83, Shooting: 87, Passing: 78, Dribbling: 85, Defending: 45, Physicality: 71 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    team: 'Argentina',
    flag: '🇦🇷',
    position: 'Forward',
    age: 38,
    attrs: { Pace: 68, Shooting: 91, Passing: 93, Dribbling: 94, Defending: 32, Physicality: 60 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    team: 'Portugal',
    flag: '🇵🇹',
    position: 'Striker',
    age: 41,
    attrs: { Pace: 70, Shooting: 92, Passing: 74, Dribbling: 82, Defending: 30, Physicality: 78 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 0, 'Dribbles Won': 0, 'Tackles': 0, 'Minutes': 0 },
  },
]

// ─── Tactical Board teams ────────────────────────────────────────────────────
// x: 0–100 (left → right, attacking right), y: 0–100 (top → bottom)

export const tacticalTeams = [
  {
    id: 'bra',
    name: 'Brazil',
    flag: '🇧🇷',
    formation: '4-2-3-1',
    color: '#F59E0B',
    players: [
      { n: 1, role: 'GK', x: 6, y: 50 },
      { n: 2, role: 'RB', x: 24, y: 16 },
      { n: 3, role: 'CB', x: 18, y: 38 },
      { n: 4, role: 'CB', x: 18, y: 62 },
      { n: 6, role: 'LB', x: 24, y: 84 },
      { n: 5, role: 'DM', x: 36, y: 38 },
      { n: 8, role: 'DM', x: 36, y: 62 },
      { n: 11, role: 'RAM', x: 58, y: 20 },
      { n: 10, role: 'CAM', x: 56, y: 50 },
      { n: 7, role: 'LAM', x: 58, y: 80 },
      { n: 9, role: 'ST', x: 76, y: 50 },
    ],
    pressing: [
      { fromX: 76, fromY: 50, toX: 90, toY: 50 },
      { fromX: 58, fromY: 20, toX: 74, toY: 26 },
      { fromX: 58, fromY: 80, toX: 74, toY: 74 },
      { fromX: 56, fromY: 50, toX: 70, toY: 50 },
    ],
  },
  {
    id: 'fra',
    name: 'France',
    flag: '🇫🇷',
    formation: '4-3-3',
    color: '#3B82F6',
    players: [
      { n: 1, role: 'GK', x: 6, y: 50 },
      { n: 2, role: 'RB', x: 22, y: 18 },
      { n: 4, role: 'CB', x: 18, y: 38 },
      { n: 5, role: 'CB', x: 18, y: 62 },
      { n: 3, role: 'LB', x: 22, y: 82 },
      { n: 8, role: 'CM', x: 42, y: 30 },
      { n: 6, role: 'DM', x: 36, y: 50 },
      { n: 14, role: 'CM', x: 42, y: 70 },
      { n: 7, role: 'RW', x: 68, y: 16 },
      { n: 10, role: 'ST', x: 74, y: 50 },
      { n: 11, role: 'LW', x: 68, y: 84 },
    ],
    pressing: [
      { fromX: 68, fromY: 16, toX: 84, toY: 28 },
      { fromX: 74, fromY: 50, toX: 88, toY: 50 },
      { fromX: 68, fromY: 84, toX: 84, toY: 72 },
      { fromX: 42, fromY: 30, toX: 58, toY: 36 },
      { fromX: 42, fromY: 70, toX: 58, toY: 64 },
    ],
  },
]

// Leaderboards — populated live via ESPN; mock shows top contenders until data arrives.

export const leaderboards = {
  goldenBoot: [
    { name: 'Folarin Balogun', team: 'USA', flag: '🇺🇸', value: 2 },
    { name: 'Julián Quiñones', team: 'MEX', flag: '🇲🇽', value: 1 },
    { name: 'Raúl Jiménez', team: 'MEX', flag: '🇲🇽', value: 1 },
    { name: 'Ladislav Krejcí', team: 'CZE', flag: '🇨🇿', value: 1 },
    { name: 'Hwang In-Beom', team: 'KOR', flag: '🇰🇷', value: 1 },
    { name: 'Oh Hyeon-Gyu', team: 'KOR', flag: '🇰🇷', value: 1 },
    { name: 'Jovo Lukic', team: 'BIH', flag: '🇧🇦', value: 1 },
    { name: 'Cyle Larin', team: 'CAN', flag: '🇨🇦', value: 1 },
  ],
  assists: [
    { name: 'Hwang In-Beom', team: 'KOR', flag: '🇰🇷', value: 1 },
    { name: 'Christian Pulisic', team: 'USA', flag: '🇺🇸', value: 1 },
    { name: 'Érik Lira', team: 'MEX', flag: '🇲🇽', value: 1 },
    { name: 'Roberto Alvarado', team: 'MEX', flag: '🇲🇽', value: 1 },
    { name: 'Lee Kang-In', team: 'KOR', flag: '🇰🇷', value: 1 },
    { name: 'Vladimír Coufal', team: 'CZE', flag: '🇨🇿', value: 1 },
    { name: 'Sead Kolasinac', team: 'BIH', flag: '🇧🇦', value: 1 },
    { name: 'Promise David', team: 'CAN', flag: '🇨🇦', value: 1 },
  ],
  cleanSheets: [
    { name: 'Raúl Rangel', team: 'MEX', flag: '🇲🇽', value: 1 },
    { name: 'Unai Simón', team: 'ESP', flag: '🇪🇸', value: 0 },
    { name: 'Mike Maignan', team: 'FRA', flag: '🇫🇷', value: 0 },
    { name: 'Jordan Pickford', team: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', value: 0 },
    { name: 'Emiliano Martínez', team: 'ARG', flag: '🇦🇷', value: 0 },
  ],
}

// ─── Fan Opinions ────────────────────────────────────────────────────────────
// Updated to match the real matchups and correct opening fixtures.

export const fanOpinions = [
  { id: 1, user: '@aztecaroars', flag: '🇲🇽', sentiment: 'Positive', quote: 'MEX 2–0 RSA at the Azteca. Same opener as 1986, same result energy. The whole stadium erupted — this is our tournament.' },
  { id: 2, user: '@bafana_fan9', flag: '🇿🇦', sentiment: 'Negative', quote: 'Outplayed at the Azteca. We need to regroup fast — Korea next and the group is suddenly very tight.' },
  { id: 3, user: '@sonsarmy', flag: '🇰🇷', sentiment: 'Positive', quote: 'Son delivered. KOR 2–1 CZE and we sit top of Group A alongside Mexico. Everything to play for on matchday 3.' },
  { id: 4, user: '@stars_stripes', flag: '🇺🇸', sentiment: 'Positive', quote: 'USA 4–1 PAR at SoFi. Four goals in the home opener — this generation was built for exactly this moment.' },
  { id: 5, user: '@canada_soccer', flag: '🇨🇦', sentiment: 'Neutral', quote: '1–1 with Bosnia in Toronto. Not the dream start but a point at home keeps us alive in Group B.' },
  { id: 6, user: '@canarinho_ny', flag: '🇧🇷', sentiment: 'Positive', quote: 'Brazil vs Morocco at MetLife tonight. 80,000 people in New Jersey for this. The whole stadium will be yellow.' },
  { id: 7, user: '@atlasroar', flag: '🇲🇦', sentiment: 'Positive', quote: 'Morocco reached the World Cup semi-final in 2022. Tonight against Brazil is the statement game of Group C.' },
  { id: 8, user: '@threelionsproud', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sentiment: 'Positive', quote: 'England vs Croatia in Dallas on the 17th. We lost to them in 2018. We won\'t forget. We won\'t let them forget either.' },
  { id: 9, user: '@albiceleste26', flag: '🇦🇷', sentiment: 'Positive', quote: 'Defending champions. Group J kicks off soon — we win the group and focus on the knockouts.' },
  { id: 10, user: '@vikingarna', flag: '🇳🇴', sentiment: 'Neutral', quote: 'Group I with France and Senegal. Haaland against the best defences in the world. This is the group of death and we are in it.' },
]

// ─── Live Ticker (fallback — replaced by ESPN API when available) ─────────────
export const liveTicker = {
  match: 'MEX vs RSA',
  minute: "LIVE",
}
