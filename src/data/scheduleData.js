/**
 * Official FIFA World Cup 2026 Group Stage Schedule — all 72 matches.
 * Source: FIFA.com / Al Jazeera official schedule.
 * All times listed in ET (Eastern Time, UTC-4).
 * Venues use FIFA's official tournament names.
 */

const T = (code, name, flag) => ({ code, name, flag })

const TEAMS = {
  MEX: T('MEX', 'Mexico', '🇲🇽'),
  RSA: T('RSA', 'South Africa', '🇿🇦'),
  KOR: T('KOR', 'Korea Republic', '🇰🇷'),
  CZE: T('CZE', 'Czechia', '🇨🇿'),
  CAN: T('CAN', 'Canada', '🇨🇦'),
  BIH: T('BIH', 'Bosnia & Herz.', '🇧🇦'),
  QAT: T('QAT', 'Qatar', '🇶🇦'),
  SUI: T('SUI', 'Switzerland', '🇨🇭'),
  BRA: T('BRA', 'Brazil', '🇧🇷'),
  MAR: T('MAR', 'Morocco', '🇲🇦'),
  HAI: T('HAI', 'Haiti', '🇭🇹'),
  SCO: T('SCO', 'Scotland', '🏴󠁧󠁢󠁳󠁣󠁴󠁿'),
  USA: T('USA', 'United States', '🇺🇸'),
  PAR: T('PAR', 'Paraguay', '🇵🇾'),
  AUS: T('AUS', 'Australia', '🇦🇺'),
  TUR: T('TUR', 'Türkiye', '🇹🇷'),
  GER: T('GER', 'Germany', '🇩🇪'),
  CUW: T('CUW', 'Curaçao', '🇨🇼'),
  CIV: T('CIV', "Côte d'Ivoire", '🇨🇮'),
  ECU: T('ECU', 'Ecuador', '🇪🇨'),
  NED: T('NED', 'Netherlands', '🇳🇱'),
  JPN: T('JPN', 'Japan', '🇯🇵'),
  SWE: T('SWE', 'Sweden', '🇸🇪'),
  TUN: T('TUN', 'Tunisia', '🇹🇳'),
  ESP: T('ESP', 'Spain', '🇪🇸'),
  CPV: T('CPV', 'Cape Verde', '🇨🇻'),
  KSA: T('KSA', 'Saudi Arabia', '🇸🇦'),
  URU: T('URU', 'Uruguay', '🇺🇾'),
  BEL: T('BEL', 'Belgium', '🇧🇪'),
  EGY: T('EGY', 'Egypt', '🇪🇬'),
  IRN: T('IRN', 'Iran', '🇮🇷'),
  NZL: T('NZL', 'New Zealand', '🇳🇿'),
  FRA: T('FRA', 'France', '🇫🇷'),
  SEN: T('SEN', 'Senegal', '🇸🇳'),
  IRQ: T('IRQ', 'Iraq', '🇮🇶'),
  NOR: T('NOR', 'Norway', '🇳🇴'),
  ARG: T('ARG', 'Argentina', '🇦🇷'),
  ALG: T('ALG', 'Algeria', '🇩🇿'),
  AUT: T('AUT', 'Austria', '🇦🇹'),
  JOR: T('JOR', 'Jordan', '🇯🇴'),
  POR: T('POR', 'Portugal', '🇵🇹'),
  COD: T('COD', 'DR Congo', '🇨🇩'),
  UZB: T('UZB', 'Uzbekistan', '🇺🇿'),
  COL: T('COL', 'Colombia', '🇨🇴'),
  ENG: T('ENG', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  CRO: T('CRO', 'Croatia', '🇭🇷'),
  GHA: T('GHA', 'Ghana', '🇬🇭'),
  PAN: T('PAN', 'Panama', '🇵🇦'),
}

const m = (id, h, a, group, venue, date, time, hs = null, as = null) => ({
  id,
  home: TEAMS[h],
  away: TEAMS[a],
  group,
  venue,
  date,
  time,
  homeScore: hs,
  awayScore: as,
  status: hs !== null ? 'finished' : 'upcoming',
})

export const GROUP_MATCHES = [
  // ── June 11 ───────────────────────────────────────────────────────────────
  m('m01', 'MEX', 'RSA', 'A', 'Mexico City Stadium', '2026-06-11', '3:00 PM ET', 2, 0),
  m('m02', 'KOR', 'CZE', 'A', 'Estadio Guadalajara, Zapopan', '2026-06-11', '10:00 PM ET', 2, 1),

  // ── June 12 ───────────────────────────────────────────────────────────────
  m('m03', 'CAN', 'BIH', 'B', 'Toronto Stadium', '2026-06-12', '3:00 PM ET', 1, 1),
  m('m04', 'USA', 'PAR', 'D', 'Los Angeles Stadium', '2026-06-12', '9:00 PM ET', 4, 1),

  // ── June 13 ───────────────────────────────────────────────────────────────
  m('m05', 'QAT', 'SUI', 'B', 'San Francisco Bay Area Stadium', '2026-06-13', '3:00 PM ET', 1, 1),
  m('m06', 'BRA', 'MAR', 'C', 'New York New Jersey Stadium', '2026-06-13', '6:00 PM ET', 1, 1),
  m('m07', 'HAI', 'SCO', 'C', 'Boston Stadium', '2026-06-13', '9:00 PM ET', 0, 1),
  m('m08', 'AUS', 'TUR', 'D', 'BC Place, Vancouver', '2026-06-13', '9:00 PM ET', 2, 0),

  // ── June 14 ───────────────────────────────────────────────────────────────
  m('m09', 'GER', 'CUW', 'E', 'Houston Stadium', '2026-06-14', '1:00 PM ET', 7, 1),
  m('m10', 'NED', 'JPN', 'F', 'Dallas Stadium', '2026-06-14', '4:00 PM ET', 2, 2),
  m('m11', 'CIV', 'ECU', 'E', 'Philadelphia Stadium', '2026-06-14', '7:00 PM ET', 1, 0),
  m('m12', 'SWE', 'TUN', 'F', 'Estadio Monterrey', '2026-06-14', '9:00 PM ET', 5, 1),

  // ── June 15 ───────────────────────────────────────────────────────────────
  m('m13', 'ESP', 'CPV', 'H', 'Atlanta Stadium', '2026-06-15', '12:00 PM ET', 0, 0),
  m('m14', 'BEL', 'EGY', 'G', 'BC Place, Vancouver', '2026-06-15', '3:00 PM ET', 1, 1),
  m('m15', 'KSA', 'URU', 'H', 'Miami Stadium', '2026-06-15', '6:00 PM ET', 1, 1),
  m('m16', 'IRN', 'NZL', 'G', 'Los Angeles Stadium', '2026-06-15', '9:00 PM ET', 2, 2),

  // ── June 16 ───────────────────────────────────────────────────────────────
  m('m17', 'FRA', 'SEN', 'I', 'New York New Jersey Stadium', '2026-06-16', '3:00 PM ET', 3, 1),
  m('m18', 'IRQ', 'NOR', 'I', 'Boston Stadium', '2026-06-16', '6:00 PM ET', 1, 4),
  m('m19', 'ARG', 'ALG', 'J', 'Kansas City Stadium', '2026-06-16', '9:00 PM ET', 3, 0),
  m('m20', 'AUT', 'JOR', 'J', 'San Francisco Bay Area Stadium', '2026-06-17', '12:00 AM ET', 3, 1),

  // ── June 17 ───────────────────────────────────────────────────────────────
  m('m21', 'POR', 'COD', 'K', 'Houston Stadium', '2026-06-17', '1:00 PM ET', 1, 1),
  m('m22', 'ENG', 'CRO', 'L', 'Dallas Stadium', '2026-06-17', '4:00 PM ET', 4, 2),
  m('m23', 'GHA', 'PAN', 'L', 'Toronto Stadium', '2026-06-17', '7:00 PM ET', 1, 0),
  m('m24', 'UZB', 'COL', 'K', 'Mexico City Stadium', '2026-06-17', '9:00 PM ET', 1, 3),

  // ── June 18 ───────────────────────────────────────────────────────────────
  m('m25', 'CZE', 'RSA', 'A', 'Atlanta Stadium', '2026-06-18', '12:00 PM ET', 1, 1),
  m('m26', 'SUI', 'BIH', 'B', 'Los Angeles Stadium', '2026-06-18', '3:00 PM ET', 4, 1),
  m('m27', 'CAN', 'QAT', 'B', 'BC Place, Vancouver', '2026-06-18', '6:00 PM ET', 6, 0),
  m('m28', 'MEX', 'KOR', 'A', 'Estadio Guadalajara, Zapopan', '2026-06-18', '9:00 PM ET', 1, 0),

  // ── June 19 ───────────────────────────────────────────────────────────────
  m('m29', 'USA', 'AUS', 'D', 'Seattle Stadium', '2026-06-19', '3:00 PM ET', 2, 0),
  m('m30', 'SCO', 'MAR', 'C', 'Boston Stadium', '2026-06-19', '6:00 PM ET', 0, 1),
  m('m31', 'BRA', 'HAI', 'C', 'Philadelphia Stadium', '2026-06-19', '8:30 PM ET', 3, 0),
  m('m32', 'TUR', 'PAR', 'D', 'San Francisco Bay Area Stadium', '2026-06-20', '12:00 AM ET', 0, 1),

  // ── June 20 ───────────────────────────────────────────────────────────────
  m('m33', 'NED', 'SWE', 'F', 'Houston Stadium', '2026-06-20', '1:00 PM ET', 5, 1),
  m('m34', 'GER', 'CIV', 'E', 'Toronto Stadium', '2026-06-20', '4:00 PM ET', 2, 1),
  m('m35', 'ECU', 'CUW', 'E', 'Kansas City Stadium', '2026-06-20', '8:00 PM ET', 0, 0),
  m('m36', 'TUN', 'JPN', 'F', 'Estadio Monterrey', '2026-06-21', '12:00 AM ET', 0, 4),

  // ── June 21 ───────────────────────────────────────────────────────────────
  m('m37', 'ESP', 'KSA', 'H', 'Atlanta Stadium', '2026-06-21', '12:00 PM ET', 4, 0),
  m('m38', 'BEL', 'IRN', 'G', 'Los Angeles Stadium', '2026-06-21', '3:00 PM ET', 0, 0),
  m('m39', 'URU', 'CPV', 'H', 'Miami Stadium', '2026-06-21', '6:00 PM ET', 2, 2),
  m('m40', 'NZL', 'EGY', 'G', 'BC Place, Vancouver', '2026-06-21', '9:00 PM ET', 1, 3),

  // ── June 22 ───────────────────────────────────────────────────────────────
  m('m41', 'ARG', 'AUT', 'J', 'Dallas Stadium', '2026-06-22', '1:00 PM ET', 2, 0),
  m('m42', 'FRA', 'IRQ', 'I', 'Philadelphia Stadium', '2026-06-22', '5:00 PM ET', 3, 0),
  m('m43', 'NOR', 'SEN', 'I', 'New York New Jersey Stadium', '2026-06-22', '8:00 PM ET', 3, 2),
  m('m44', 'JOR', 'ALG', 'J', 'San Francisco Bay Area Stadium', '2026-06-22', '11:00 PM ET', 1, 2),

  // ── June 23 ───────────────────────────────────────────────────────────────
  m('m45', 'POR', 'UZB', 'K', 'Houston Stadium', '2026-06-23', '1:00 PM ET'),
  m('m46', 'ENG', 'GHA', 'L', 'Boston Stadium', '2026-06-23', '4:00 PM ET'),
  m('m47', 'PAN', 'CRO', 'L', 'Toronto Stadium', '2026-06-23', '7:00 PM ET'),
  m('m48', 'COL', 'COD', 'K', 'Estadio Guadalajara, Zapopan', '2026-06-23', '10:00 PM ET'),

  // ── June 24 ───────────────────────────────────────────────────────────────
  m('m49', 'SUI', 'CAN', 'B', 'BC Place, Vancouver', '2026-06-24', '3:00 PM ET'),
  m('m50', 'BIH', 'QAT', 'B', 'Seattle Stadium', '2026-06-24', '3:00 PM ET'),
  m('m51', 'SCO', 'BRA', 'C', 'Miami Stadium', '2026-06-24', '6:00 PM ET'),
  m('m52', 'MAR', 'HAI', 'C', 'Atlanta Stadium', '2026-06-24', '6:00 PM ET'),
  m('m53', 'CZE', 'MEX', 'A', 'Mexico City Stadium', '2026-06-24', '9:00 PM ET'),
  m('m54', 'RSA', 'KOR', 'A', 'Estadio Monterrey', '2026-06-24', '9:00 PM ET'),

  // ── June 25 ───────────────────────────────────────────────────────────────
  m('m55', 'ECU', 'GER', 'E', 'New York New Jersey Stadium', '2026-06-25', '4:00 PM ET'),
  m('m56', 'CUW', 'CIV', 'E', 'Philadelphia Stadium', '2026-06-25', '4:00 PM ET'),
  m('m57', 'JPN', 'SWE', 'F', 'Dallas Stadium', '2026-06-25', '7:00 PM ET'),
  m('m58', 'TUN', 'NED', 'F', 'Kansas City Stadium', '2026-06-25', '7:00 PM ET'),
  m('m59', 'TUR', 'USA', 'D', 'Los Angeles Stadium', '2026-06-25', '10:00 PM ET'),
  m('m60', 'PAR', 'AUS', 'D', 'San Francisco Bay Area Stadium', '2026-06-25', '10:00 PM ET'),

  // ── June 26 ───────────────────────────────────────────────────────────────
  m('m61', 'NOR', 'FRA', 'I', 'Boston Stadium', '2026-06-26', '3:00 PM ET'),
  m('m62', 'SEN', 'IRQ', 'I', 'Toronto Stadium', '2026-06-26', '3:00 PM ET'),
  m('m63', 'CPV', 'KSA', 'H', 'Houston Stadium', '2026-06-26', '8:00 PM ET'),
  m('m64', 'URU', 'ESP', 'H', 'Estadio Guadalajara, Zapopan', '2026-06-26', '8:00 PM ET'),
  m('m65', 'EGY', 'IRN', 'G', 'Seattle Stadium', '2026-06-26', '11:00 PM ET'),
  m('m66', 'NZL', 'BEL', 'G', 'BC Place, Vancouver', '2026-06-26', '11:00 PM ET'),

  // ── June 27 ───────────────────────────────────────────────────────────────
  m('m67', 'PAN', 'ENG', 'L', 'New York New Jersey Stadium', '2026-06-27', '5:00 PM ET'),
  m('m68', 'CRO', 'GHA', 'L', 'Philadelphia Stadium', '2026-06-27', '5:00 PM ET'),
  m('m69', 'COL', 'POR', 'K', 'Miami Stadium', '2026-06-27', '7:30 PM ET'),
  m('m70', 'COD', 'UZB', 'K', 'Atlanta Stadium', '2026-06-27', '7:30 PM ET'),
  m('m71', 'ALG', 'AUT', 'J', 'Kansas City Stadium', '2026-06-27', '9:00 PM ET'),
  m('m72', 'JOR', 'ARG', 'J', 'Dallas Stadium', '2026-06-27', '9:00 PM ET'),
]

// Unique matchdays for tab navigation
export const MATCH_DATES = [...new Set(GROUP_MATCHES.map((m) => m.date))].sort()

// Group metadata
export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

// All 48 teams with their groups — for favorite team picker
export const ALL_TEAMS = Object.values(
  GROUP_MATCHES.reduce((acc, match) => {
    if (!acc[match.home.code]) acc[match.home.code] = { ...match.home, group: match.group }
    if (!acc[match.away.code]) acc[match.away.code] = { ...match.away, group: match.group }
    return acc
  }, {})
).sort((a, b) => a.name.localeCompare(b.name))

// Knockout stage placeholder structure (teams TBD after group stage)
export const KNOCKOUT_ROUNDS = [
  { label: 'Round of 32', short: 'R32', date: 'Jun 28 – Jul 3', slots: 16 },
  { label: 'Round of 16', short: 'R16', date: 'Jul 4 – 7', slots: 8 },
  { label: 'Quarter-finals', short: 'QF', date: 'Jul 9 – 11', slots: 4 },
  { label: 'Semi-finals', short: 'SF', date: 'Jul 14 – 15', slots: 2 },
  { label: 'Final', short: 'F', date: 'Jul 19 · MetLife', slots: 1 },
]
