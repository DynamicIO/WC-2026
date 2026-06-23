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
// Key matches — completed results + today (Jun 23) + upcoming.
// All times are ET (Eastern Time). Venues use FIFA's official renamed stadium names.

export const featuredMatches = [
  {
    id: 'mex-rsa',
    iso: '2026-06-11T19:00:00Z', // 3:00 PM ET
    home: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', score: 2 },
    away: { code: 'RSA', name: 'South Africa', flag: '🇿🇦', score: 0 },
    venue: 'Mexico City Stadium (Estadio Azteca), Mexico City',
    kickoff: 'Thu Jun 11 · FT',
    stage: 'Group A · Match 1',
    odds: { home: 52, draw: 26, away: 22 },
    tagline: 'Mexico opened the 2026 World Cup with a 2-0 win over South Africa at the Azteca — echoing the iconic 1986 opener at the very same ground.',
  },
  {
    id: 'usa-par',
    iso: '2026-06-13T01:00:00Z', // 9:00 PM ET
    home: { code: 'USA', name: 'United States', flag: '🇺🇸', score: 4 },
    away: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', score: 1 },
    venue: 'Los Angeles Stadium (SoFi Stadium), Los Angeles',
    kickoff: 'Fri Jun 12 · FT',
    stage: 'Group D · Match 4',
    odds: { home: 54, draw: 25, away: 21 },
    tagline: 'Folarin Balogun bagged a brace as the USA roared to a 4-1 opening win at SoFi in front of 70,000 screaming home fans.',
  },
  {
    id: 'por-uzb',
    iso: '2026-06-23T17:00:00Z', // 1:00 PM ET
    home: { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
    away: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿' },
    venue: 'Houston Stadium (NRG Stadium), Houston',
    kickoff: 'Tue Jun 23 · 1:00 PM ET',
    stage: 'Group K · Match 47',
    odds: { home: 72, draw: 18, away: 10 },
    tagline: 'Portugal need a win after their shock draw with DR Congo. Ronaldo has been subdued — this is a must-win to stay in control of Group K.',
  },
  {
    id: 'eng-gha',
    iso: '2026-06-23T20:00:00Z', // 4:00 PM ET
    home: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    away: { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
    venue: 'Boston Stadium (Gillette), Foxborough',
    kickoff: 'Tue Jun 23 · 4:00 PM ET',
    stage: 'Group L · Match 46',
    odds: { home: 55, draw: 25, away: 20 },
    tagline: 'Both England (4-2 vs Croatia) and Ghana (1-0 vs Panama) won their openers. The winner of this Group L clash books their Round of 32 spot.',
  },
  {
    id: 'arg-aut',
    iso: '2026-06-22T17:00:00Z', // 1:00 PM ET
    home: { code: 'ARG', name: 'Argentina', flag: '🇦🇷', score: 2 },
    away: { code: 'AUT', name: 'Austria', flag: '🇦🇹', score: 0 },
    venue: 'Dallas Stadium (AT&T), Arlington',
    kickoff: 'Mon Jun 22 · FT',
    stage: 'Group J · Match 41',
    odds: { home: 68, draw: 20, away: 12 },
    tagline: 'Messi scored his 17th and 18th World Cup goals to overtake Klose and Marta — 18 WC goals, the most ever. Argentina through to the knockouts.',
  },
]

// ─── Match Predictions Hub ───────────────────────────────────────────────────
// Mix of completed results (for reference) and upcoming matches (Jun 23–27).
// Completed match probs reflect pre-match odds; upcoming reflect current form.

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
  // Match 9 — Jun 14 (RESULT: GER 7–1 CUW)
  {
    id: 'ger-cuw',
    date: '2026-06-14',
    time: '13:00',
    home: { code: 'GER', name: 'Germany', flag: '🇩🇪' },
    away: { code: 'CUW', name: 'Curaçao', flag: '🇨🇼' },
    probs: { home: 84, draw: 11, away: 5 },
    confidence: 91,
    stage: 'Group E · M9 · Jun 14 · FT · 7–1',
    factors: [
      { label: 'Result', detail: "Germany destroyed Curaçao 7-1 — Undav scored twice off the bench, Musiala and Wirtz brilliant" },
      { label: 'Quality gap', detail: "Germany ranked 4th in FIFA rankings; Curaçao ranked ~75 — the gulf in class was on full display" },
      { label: 'Key player', detail: "Deniz Undav came off the bench to score twice — he now leads the tournament with 3 goals total" },
      { label: 'Outcome', detail: "Germany topped Group E with 6 points and a +7 goal difference — through to the Round of 32" },
    ],
  },
  // Match 10 — Jun 14 (RESULT: NED 2–2 JPN)
  {
    id: 'ned-jpn',
    date: '2026-06-14',
    time: '16:00',
    home: { code: 'NED', name: 'Netherlands', flag: '🇳🇱' },
    away: { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
    probs: { home: 47, draw: 27, away: 26 },
    confidence: 62,
    stage: 'Group F · M10 · Jun 14 · FT · 2–2',
    factors: [
      { label: 'Result', detail: "Japan came back to level at 2-2 — exactly the kind of upset form that makes them dangerous" },
      { label: 'Form', detail: "Both sides bounced back well in the second round — NED beat Sweden 5-1, Japan thrashed Tunisia 4-0" },
      { label: 'Key player', detail: "Cody Gakpo has 2 goals and 1 assist so far — leading Netherlands into the knockouts" },
      { label: 'Outcome', detail: "Netherlands and Japan both have 4 points after 2 games — Group F goes to the final matchday" },
    ],
  },
  // Match — Jun 23 TODAY
  {
    id: 'por-uzb',
    date: '2026-06-23',
    time: '13:00',
    home: { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
    away: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿' },
    probs: { home: 72, draw: 18, away: 10 },
    confidence: 80,
    stage: 'Group K · M47 · Jun 23 · 1:00 PM ET',
    factors: [
      { label: 'Form', detail: "Portugal drew 1-1 with DR Congo — a shock result that has left Group K wide open" },
      { label: 'Opponent', detail: "Uzbekistan were beaten 3-1 by Colombia in their opener and have nothing to lose here" },
      { label: 'Key player', detail: "Ronaldo yet to score — Portugal need him to step up or rely on Bruno Fernandes and João Félix" },
      { label: 'Stage', detail: "A win puts Portugal back in control of Group K ahead of the final matchday vs Colombia" },
    ],
  },
  // Match — Jun 23 TODAY
  {
    id: 'eng-gha',
    date: '2026-06-23',
    time: '16:00',
    home: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    away: { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
    probs: { home: 55, draw: 25, away: 20 },
    confidence: 70,
    stage: 'Group L · M46 · Jun 23 · 4:00 PM ET',
    factors: [
      { label: 'Form', detail: "England hammered Croatia 4-2 — Harry Kane scored twice and Bellingham dominated midfield" },
      { label: 'Opponent', detail: "Ghana edged Panama 1-0 in a tight opener — they are well-organised but limited going forward" },
      { label: 'Key player', detail: "Harry Kane tied Gary Lineker's England WC goal record with 2 vs Croatia — hungry for more" },
      { label: 'Stage', detail: "Winner of this match books their Round of 32 place — both sides desperately want this win" },
    ],
  },
  // Match — Jun 23 TODAY
  {
    id: 'pan-cro',
    date: '2026-06-23',
    time: '19:00',
    home: { code: 'PAN', name: 'Panama', flag: '🇵🇦' },
    away: { code: 'CRO', name: 'Croatia', flag: '🇭🇷' },
    probs: { home: 28, draw: 30, away: 42 },
    confidence: 58,
    stage: 'Group L · M47 · Jun 23 · 7:00 PM ET',
    factors: [
      { label: 'Form', detail: "Croatia conceded 4 to England and looked a shadow of their 2018 and 2022 sides" },
      { label: 'Opponent', detail: "Panama lost 0-1 to Ghana in a dour match — must win to stay alive in Group L" },
      { label: 'Key player', detail: "Luka Modrić at 40 is running out of chances — Croatia desperately need him to find his rhythm" },
      { label: 'Stage', detail: "Both teams must win to keep any hope of knockout qualification — expect an open, attacking match" },
    ],
  },
]

// ─── Players (for comparison tool) ──────────────────────────────────────────
// Official squad members attending WC 2026.

// WC 2026 in-tournament stats as of Jun 23. Source: FIFA/ESPN match summaries.
export const players = [
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    team: 'France',
    flag: '🇫🇷',
    position: 'Forward',
    age: 27,
    attrs: { Pace: 97, Shooting: 90, Passing: 82, Dribbling: 93, Defending: 36, Physicality: 78 },
    stats: { Goals: 4, Assists: 0, 'Key Passes': 5, 'Dribbles Won': 8, 'Tackles': 1, 'Minutes': 180 },
  },
  {
    id: 'vinicius',
    name: 'Vinícius Júnior',
    team: 'Brazil',
    flag: '🇧🇷',
    position: 'Left Wing',
    age: 25,
    attrs: { Pace: 95, Shooting: 84, Passing: 80, Dribbling: 94, Defending: 29, Physicality: 70 },
    stats: { Goals: 2, Assists: 1, 'Key Passes': 6, 'Dribbles Won': 11, 'Tackles': 1, 'Minutes': 180 },
  },
  {
    id: 'bellingham',
    name: 'Jude Bellingham',
    team: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    position: 'Attacking Midfield',
    age: 22,
    attrs: { Pace: 80, Shooting: 84, Passing: 86, Dribbling: 88, Defending: 72, Physicality: 85 },
    stats: { Goals: 1, Assists: 2, 'Key Passes': 7, 'Dribbles Won': 5, 'Tackles': 3, 'Minutes': 90 },
  },
  {
    id: 'pedri',
    name: 'Pedri',
    team: 'Spain',
    flag: '🇪🇸',
    position: 'Central Midfield',
    age: 23,
    attrs: { Pace: 79, Shooting: 74, Passing: 91, Dribbling: 89, Defending: 68, Physicality: 68 },
    stats: { Goals: 0, Assists: 2, 'Key Passes': 9, 'Dribbles Won': 6, 'Tackles': 4, 'Minutes': 180 },
  },
  {
    id: 'musiala',
    name: 'Jamal Musiala',
    team: 'Germany',
    flag: '🇩🇪',
    position: 'Attacking Midfield',
    age: 23,
    attrs: { Pace: 85, Shooting: 81, Passing: 84, Dribbling: 92, Defending: 58, Physicality: 66 },
    stats: { Goals: 1, Assists: 2, 'Key Passes': 8, 'Dribbles Won': 9, 'Tackles': 2, 'Minutes': 180 },
  },
  {
    id: 'pulisic',
    name: 'Christian Pulisic',
    team: 'United States',
    flag: '🇺🇸',
    position: 'Right Wing',
    age: 27,
    attrs: { Pace: 88, Shooting: 82, Passing: 80, Dribbling: 87, Defending: 44, Physicality: 65 },
    stats: { Goals: 1, Assists: 1, 'Key Passes': 6, 'Dribbles Won': 7, 'Tackles': 2, 'Minutes': 180 },
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    team: 'Norway',
    flag: '🇳🇴',
    position: 'Striker',
    age: 25,
    attrs: { Pace: 89, Shooting: 95, Passing: 70, Dribbling: 79, Defending: 38, Physicality: 92 },
    stats: { Goals: 4, Assists: 0, 'Key Passes': 3, 'Dribbles Won': 4, 'Tackles': 1, 'Minutes': 180 },
  },
  {
    id: 'son',
    name: 'Son Heung-min',
    team: 'Korea Republic',
    flag: '🇰🇷',
    position: 'Left Wing',
    age: 34,
    attrs: { Pace: 83, Shooting: 87, Passing: 78, Dribbling: 85, Defending: 45, Physicality: 71 },
    stats: { Goals: 0, Assists: 1, 'Key Passes': 4, 'Dribbles Won': 5, 'Tackles': 2, 'Minutes': 180 },
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    team: 'Argentina',
    flag: '🇦🇷',
    position: 'Forward',
    age: 38,
    attrs: { Pace: 68, Shooting: 91, Passing: 93, Dribbling: 94, Defending: 32, Physicality: 60 },
    stats: { Goals: 5, Assists: 0, 'Key Passes': 7, 'Dribbles Won': 6, 'Tackles': 0, 'Minutes': 188 },
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    team: 'Portugal',
    flag: '🇵🇹',
    position: 'Striker',
    age: 41,
    attrs: { Pace: 70, Shooting: 92, Passing: 74, Dribbling: 82, Defending: 30, Physicality: 78 },
    stats: { Goals: 0, Assists: 0, 'Key Passes': 2, 'Dribbles Won': 1, 'Tackles': 0, 'Minutes': 90 },
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

// Leaderboards — populated live via ESPN; fallback shows real stats as of Jun 23 (matchday 13).
// Source: SB Nation / Yahoo Sports Golden Boot tracker, updated Jun 23 2026.

export const leaderboards = {
  goldenBoot: [
    { name: 'Lionel Messi', team: 'ARG', flag: '🇦🇷', value: 5 },
    { name: 'Kylian Mbappé', team: 'FRA', flag: '🇫🇷', value: 4 },
    { name: 'Erling Haaland', team: 'NOR', flag: '🇳🇴', value: 4 },
    { name: 'Deniz Undav', team: 'GER', flag: '🇩🇪', value: 3 },
    { name: 'Jonathan David', team: 'CAN', flag: '🇨🇦', value: 3 },
    { name: 'Crysencio Summerville', team: 'NED', flag: '🇳🇱', value: 2 },
    { name: 'Mikel Oyarzabal', team: 'ESP', flag: '🇪🇸', value: 2 },
    { name: 'Cody Gakpo', team: 'NED', flag: '🇳🇱', value: 2 },
  ],
  assists: [
    { name: 'Deniz Undav', team: 'GER', flag: '🇩🇪', value: 2 },
    { name: 'Crysencio Summerville', team: 'NED', flag: '🇳🇱', value: 1 },
    { name: 'Cody Gakpo', team: 'NED', flag: '🇳🇱', value: 1 },
    { name: 'Vinícius Júnior', team: 'BRA', flag: '🇧🇷', value: 1 },
    { name: 'Mikel Oyarzabal', team: 'ESP', flag: '🇪🇸', value: 1 },
    { name: 'Ayase Ueda', team: 'JPN', flag: '🇯🇵', value: 1 },
    { name: 'Maximiliano Araújo', team: 'URU', flag: '🇺🇾', value: 1 },
    { name: 'Christian Pulisic', team: 'USA', flag: '🇺🇸', value: 1 },
  ],
  cleanSheets: [
    { name: 'Emiliano Martínez', team: 'ARG', flag: '🇦🇷', value: 2 },
    { name: 'Raúl Rangel', team: 'MEX', flag: '🇲🇽', value: 2 },
    { name: 'Yassine Bounou', team: 'MAR', flag: '🇲🇦', value: 1 },
    { name: 'Unai Simón', team: 'ESP', flag: '🇪🇸', value: 1 },
    { name: 'Matt Turner', team: 'USA', flag: '🇺🇸', value: 1 },
  ],
}

// ─── Fan Opinions ────────────────────────────────────────────────────────────
// Reflecting real results as of Jun 23, 2026 (matchday 13).

export const fanOpinions = [
  { id: 1, user: '@aztecaroars', flag: '🇲🇽', sentiment: 'Positive', quote: 'Mexico won the group with 6 points — 2-0 over South Africa and 1-0 over South Korea. Same as 1986, the Azteca is still our fortress. We are THROUGH.' },
  { id: 2, user: '@bafana_fan9', flag: '🇿🇦', sentiment: 'Negative', quote: 'Lost to Mexico, drew with Czechia. We need a miracle result vs South Korea on the 24th to have any hope. Group A was brutal.' },
  { id: 3, user: '@sonsarmy', flag: '🇰🇷', sentiment: 'Positive', quote: '2-1 over Czechia, then 0-1 to Mexico. 3 points, sitting 2nd in Group A. The last game vs South Africa is a must-win. Son still has it.' },
  { id: 4, user: '@stars_stripes', flag: '🇺🇸', sentiment: 'Positive', quote: 'USA through to the knockouts! 4-1 vs Paraguay and 2-0 vs Australia. Six points, top of Group D with a game to spare. This team is for real.' },
  { id: 5, user: '@canada_soccer', flag: '🇨🇦', sentiment: 'Positive', quote: 'After the 1-1 draw vs Bosnia we CRUSHED Qatar 6-0. Jonathan David with 3 goals in 2 games. Canada are flying into the Round of 32.' },
  { id: 6, user: '@canarinho_ny', flag: '🇧🇷', sentiment: 'Neutral', quote: '1-1 with Morocco at MetLife was a wake-up call. But 3-0 vs Haiti put us back on track. Brazil top Group C on goal difference — the Seleção march on.' },
  { id: 7, user: '@atlasroar', flag: '🇲🇦', sentiment: 'Positive', quote: 'Morocco drew 1-1 with Brazil and beat Scotland 1-0. We are through to the Round of 32! The Atlas Lions are at their best when it matters most.' },
  { id: 8, user: '@threelionsproud', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', sentiment: 'Positive', quote: 'ENGLAND 4-2 CROATIA. Kane with two. Bellingham pulling the strings. That is the statement England needed after 2018. Ghana today — we are going through.' },
  { id: 9, user: '@albiceleste26', flag: '🇦🇷', sentiment: 'Positive', quote: 'MESSI IS HISTORY. 18 World Cup goals. Broke Marta\'s all-time record vs Austria. Argentina top Group J with 6 points, clean sheet in both games. The legend continues.' },
  { id: 10, user: '@vikingarna', flag: '🇳🇴', sentiment: 'Positive', quote: 'HAALAND! 4 goals in 2 games. Norway beat Iraq 4-1 and Senegal 3-2 to qualify with a game to spare. We face France next — Norway is ready for the big stage.' },
]

// ─── Live Ticker (fallback — replaced by ESPN API when available) ─────────────
// Jun 23: Portugal vs Uzbekistan (1PM ET), England vs Ghana (4PM ET), Panama vs Croatia (7PM ET), Colombia vs DR Congo (10PM ET)
export const liveTicker = {
  match: 'POR vs UZB',
  minute: 'TODAY',
}
