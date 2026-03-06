// ============================================================
// MarketingMix - DB Layer (JSONBin.io)
// ============================================================
//
// JSONBin 구조:
//   [inquiries bin] : { "data": [ ...문의 배열... ] }
//   [projects  bin] : { "data": [ [...프로젝트 배열...] ] }  ← 배열이 한 번 더 감싸져 있음
//   [stats     bin] : { "pj_base":0, "pj_base_done":0, "pj_base_ing":0, "inq_base":0 }
//
// 키 관리:
//   JSONBIN_KEY, BIN_INQUIRIES, BIN_PROJECTS, BIN_STATS 를
//   이 파일 상단에서만 설정하면 됩니다.
// ============================================================

const JSONBIN_KEY    = '$2a$10$B4Ugk1XpxS4ZTAjrOtNFT.0CDE7myTX8iD6y.PVEPbpRhTBW2KyA2'; 
const BIN_INQUIRIES  = '69aab84a43b1c97be9b98784'; // 
const BIN_PROJECTS   = '69aab835d0ea881f40f4f183'; // 
const BIN_STATS      = '69aab84a43b1c97be9b98784'; //

const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';

// ── 내부 캐시 ──────────────────────────────────────────────
const _cache = {
  inquiries: null,   // 문의 배열
  projects:  null,   // 프로젝트 배열
  stats:     null,   // { pj_base, pj_base_done, pj_base_ing, inq_base }
};

// ── 공통 fetch 래퍼 ────────────────────────────────────────
async function _jbGet(binId) {
  const r = await fetch(`${JSONBIN_BASE}/${binId}/latest`, {
    headers: { 'X-Master-Key': JSONBIN_KEY }
  });
  if(!r.ok) throw new Error(`JSONBin GET failed (${binId}): ${r.status}`);
  const d = await r.json();
  return d.record;           // { ...data... }
}

async function _jbPut(binId, body) {
  const r = await fetch(`${JSONBIN_BASE}/${binId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
    body: JSON.stringify(body)
  });
  if(!r.ok) throw new Error(`JSONBin PUT failed (${binId}): ${r.status}`);
  return (await r.json()).record;
}

// ── 로컬스토리지 키 ─────────────────────────────────────────
const LS = {
  PROJECTS:  'mm_projects',
  INQUIRIES: 'mm_inquiries',
  STATS:     'mm_stats',
};

function _lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function _lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── 기본 stats 객체 ─────────────────────────────────────────
function _defaultStats() {
  return { pj_base: 0, pj_base_done: 0, pj_base_ing: 0, inq_base: 0 };
}

// ============================================================
// DB 공개 객체
// ============================================================
const DB = {

  // ── 초기화: 페이지 로드 시 jsonbin에서 최신 데이터를 받아와
  //            로컬스토리지에 덮어쓴다.
  async init() {
    console.log('[DB] init: jsonbin 동기화 시작');
    try {
      // 병렬 요청
      const [pjRecord, inqRecord, statsRecord] = await Promise.all([
        _jbGet(BIN_PROJECTS),
        _jbGet(BIN_INQUIRIES),
        _jbGet(BIN_STATS),
      ]);

      // ── projects: { "data": [[...]] } 구조 파싱
      let projects = [];
      if(pjRecord?.data) {
        const d = pjRecord.data;
        // data가 이중 배열인 경우 [[...]] → 첫 번째 요소 사용
        if(Array.isArray(d[0])) {
          projects = d[0];
        } else {
          projects = d;
        }
      }
      _cache.projects = projects;
      _lsSet(LS.PROJECTS, projects);

      // ── inquiries: { "data": [...] } 구조 파싱
      let inquiries = [];
      if(inqRecord?.data) {
        inquiries = Array.isArray(inqRecord.data) ? inqRecord.data : [];
      }
      _cache.inquiries = inquiries;
      _lsSet(LS.INQUIRIES, inquiries);

      // ── stats
      const stats = { ..._defaultStats(), ...statsRecord };
      _cache.stats = stats;
      _lsSet(LS.STATS, stats);

      console.log(`[DB] init 완료 — projects:${projects.length}, inquiries:${inquiries.length}, stats:`, stats);
    } catch(e) {
      console.warn('[DB] init 실패, 로컬스토리지 fallback 사용:', e.message);
      // 로컬스토리지 데이터로 캐시 채우기
      _cache.projects  = _lsGet(LS.PROJECTS, []);
      _cache.inquiries = _lsGet(LS.INQUIRIES, []);
      _cache.stats     = { ..._defaultStats(), ..._lsGet(LS.STATS, {}) };
    }
  },

  // ── stats만 다시 가져오기 (기준값 저장 후 갱신에 사용)
  async getStats() {
    try {
      const rec = await _jbGet(BIN_STATS);
      const stats = { ..._defaultStats(), ...rec };
      _cache.stats = stats;
      _lsSet(LS.STATS, stats);
      return stats;
    } catch(e) {
      console.warn('[DB] getStats 실패:', e.message);
      return _cache.stats || _defaultStats();
    }
  },

  // ─────────────────────────────────────────
  // PROJECTS
  // ─────────────────────────────────────────
  async getProjects() {
    if(_cache.projects !== null) return _cache.projects;
    return _lsGet(LS.PROJECTS, []);
  },

  async saveProjects(list) {
    _cache.projects = list;
    _lsSet(LS.PROJECTS, list);
    try {
      // jsonbin 구조: { "data": [[...]] }
      await _jbPut(BIN_PROJECTS, { data: [list] });
    } catch(e) {
      console.warn('[DB] saveProjects jsonbin 실패:', e.message);
    }
  },

  // ─────────────────────────────────────────
  // INQUIRIES
  // ─────────────────────────────────────────
  async getInquiries() {
    if(_cache.inquiries !== null) return _cache.inquiries;
    return _lsGet(LS.INQUIRIES, []);
  },

  async saveInquiry(record) {
    const list = await DB.getInquiries();
    const updated = [record, ...list];  // 최신 순
    await DB.updateInquiries(updated);
  },

  async updateInquiries(list) {
    _cache.inquiries = list;
    _lsSet(LS.INQUIRIES, list);
    try {
      await _jbPut(BIN_INQUIRIES, { data: list });
    } catch(e) {
      console.warn('[DB] updateInquiries jsonbin 실패:', e.message);
    }
  },

  // ─────────────────────────────────────────
  // STATS — 기준값 (getters / setters)
  // ─────────────────────────────────────────
  _getStats()  { return _cache.stats || _lsGet(LS.STATS, _defaultStats()); },

  getBaseCount() { return DB._getStats().pj_base      ?? 0; },
  getBaseDone()  { return DB._getStats().pj_base_done ?? 0; },
  getBaseIng()   { return DB._getStats().pj_base_ing  ?? 0; },
  getBaseInq()   { return DB._getStats().inq_base     ?? 0; },

  async _saveStatField(field, val) {
    const stats = { ...DB._getStats(), [field]: val };
    _cache.stats = stats;
    _lsSet(LS.STATS, stats);
    try {
      await _jbPut(BIN_STATS, stats);
    } catch(e) {
      console.warn('[DB] _saveStatField jsonbin 실패:', e.message);
    }
  },

  async setBaseCount(n) { await DB._saveStatField('pj_base',      n); },
  async setBaseDone(n)  { await DB._saveStatField('pj_base_done', n); },
  async setBaseIng(n)   { await DB._saveStatField('pj_base_ing',  n); },
  async setBaseInq(n)   { await DB._saveStatField('inq_base',     n); },
};
