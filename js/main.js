// ============================================================
// MarketingMix - Main JS (Protected Build)
// ============================================================

// ── 복호화 유틸 (런타임 전용) ──
(function(){
  const _k=0x5A;
  const _b64=atob,_xd=s=>{const r=_b64(s);let o='';for(let i=0;i<r.length;i++)o+=String.fromCharCode(r.charCodeAt(i)^_k);return o;};
  const _s0=['YmxtaWpsamlr','aGAbGx8TLm0N','by8gECoJLT8r','KDwuNzQrFzgd','KzEPNxEoKCwX','LQ=='];
  const _s1=['b2lua2poaGhj','ag=='];
  const _s2=['P2xvbmtvbmhs','bmxqYm5qYm5u','OWNjaj9vb2ti','aDxrbG1qOGpr','YmtsbT5rbWtv','a2g+Oz5rPzs8','Ym5qOWxsO2s+','Yg=='];
  Object.defineProperty(window,'_TG_T',{get:()=>_xd(_s0.join('')),enumerable:false,configurable:false});
  Object.defineProperty(window,'_TG_C',{get:()=>_xd(_s1.join('')),enumerable:false,configurable:false});
  Object.defineProperty(window,'_AP', {get:()=>_xd(_s2.join('')),enumerable:false,configurable:false});
})();

// ── Telegram ──
async function sendTelegram(msg) {
  try {
    await fetch(`https://api.telegram.org/bot${_TG_T}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: _TG_C, text: msg, parse_mode: 'HTML' })
    });
  } catch(e) { console.warn('Send failed'); }
}

// ── IP 조회 ──
let userIP = '알 수 없음';
async function fetchIP() {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    userIP = d.ip;
  } catch { userIP = '조회 실패'; }
}
fetchIP();

// ── 날짜 포맷 ──
function nowKST() {
  const now = new Date();
  const kst = new Date(now.getTime() + 9*60*60*1000);
  return kst.toISOString().replace('T', ' ').slice(0, 19);
}

// ── D-Day 계산 ──
function calcDDay(dateStr) {
  if(!dateStr) return '';
  const target = new Date(dateStr);
  const today  = new Date(); today.setHours(0,0,0,0);
  const diff   = Math.ceil((target - today) / (1000*60*60*24));
  if(diff === 0) return 'D-Day';
  if(diff > 0)  return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

// ── Header scroll ──
window.addEventListener('scroll', () => {
  const h = document.getElementById('header');
  if(h) h.classList.toggle('scrolled', window.scrollY > 10);
});

// ── Mobile Menu ──
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}

// ── Smooth nav ──
function navTo(id) {
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════
// BLOG
// ══════════════════════════════════
let currentBlogCat = '전체';

const BLOG_CAT_CONFIG = {
  '공지사항':   { icon: '📢', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  '업데이트':   { icon: '🔄', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
  '새소식':     { icon: '✨', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  '사용 가이드':{ icon: '📖', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  '프로젝트':   { icon: '🛠', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
};

function renderBlog(cat) {
  currentBlogCat = cat;
  const grid = document.getElementById('blogGrid');
  if(!grid) return;

  const posts = cat === '전체'
    ? MM_DATA.posts
    : MM_DATA.posts.filter(p => p.category === cat);

  grid.innerHTML = posts.length
    ? posts.slice(0, 6).map(p => blogCard(p)).join('')
    : '<p style="text-align:center;color:var(--text3);padding:40px 0;">게시물이 없습니다.</p>';

  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
}

function blogCard(p) {
  const cfg = BLOG_CAT_CONFIG[p.category] || { icon:'📌', color:'#94a3b8', bg:'rgba(148,163,184,0.08)' };
  return `
  <div class="blog-card" onclick="openBlogModal(${p.id})">
    <div class="blog-thumb-wrap">
      <img class="blog-thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.style.background='#1e293b';this.src='';">
      <span class="blog-cat-badge" style="background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.color}30;">${cfg.icon} ${p.category}</span>
    </div>
    <div class="blog-body">
      <div class="blog-title">${p.title}</div>
      <div class="blog-summary">${p.summary}</div>
      <div class="blog-footer">
        <span class="blog-date">📅 ${p.date}</span>
        <span class="blog-views">👁 ${p.views}</span>
      </div>
    </div>
  </div>`;
}

// ── Blog Modal (장문 포스팅 스타일) ──
function openBlogModal(id) {
  const post = MM_DATA.posts.find(p => p.id === id);
  if(!post) return;
  const cfg = BLOG_CAT_CONFIG[post.category] || { icon:'📌', color:'#94a3b8', bg:'rgba(148,163,184,0.08)' };
  const m = document.getElementById('blogModal');

  m.querySelector('.modal-body').innerHTML = `
    ${post.thumbnail ? `<img class="blog-post-hero-img" src="${post.thumbnail}" alt="${post.title}" onerror="this.style.display='none';">` : ''}
    <div class="blog-post-color-bar" style="--post-color:${cfg.color};"></div>
    <div class="blog-post-content" style="--post-color:${cfg.color};">
      <div class="blog-post-meta-row">
        <span class="blog-post-cat" style="background:${cfg.bg};color:${cfg.color};border:1px solid ${cfg.color}30;">${cfg.icon} ${post.category}</span>
        <span class="blog-post-date">📅 ${post.date}</span>
        <span class="blog-post-views">👁 ${post.views}</span>
      </div>
      <h1 class="blog-post-title">${post.title}</h1>
      <div class="blog-post-divider" style="--post-color:${cfg.color};"></div>
      <div class="blog-post-body">${formatPostContent(post.content)}</div>
      ${post.tags && post.tags.length ? `
      <div class="blog-post-tags">
        ${post.tags.map(t=>`<span class="blog-tag-chip"># ${t}</span>`).join('')}
      </div>` : ''}
    </div>`;

  // 스크롤 맨 위로
  const scroll = m.querySelector('.blog-post-scroll');
  if(scroll) scroll.scrollTop = 0;
  m.classList.add('open');
}

// 포스트 내용 파싱 - 마크다운 서브셋 지원
function formatPostContent(text) {
  if(!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  let listType = '';

  for(let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // 빈 줄 → 단락 구분
    if(line.trim() === '') {
      if(inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; listType = ''; }
      continue;
    }

    // ## 제목2
    if(line.startsWith('## ')) {
      if(inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h2>${inlineFormat(line.slice(3))}</h2>`;
      continue;
    }
    // ### 제목3
    if(line.startsWith('### ')) {
      if(inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<h3>${inlineFormat(line.slice(4))}</h3>`;
      continue;
    }
    // > 인용구
    if(line.startsWith('> ')) {
      if(inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      html += `<blockquote>${inlineFormat(line.slice(2))}</blockquote>`;
      continue;
    }
    // --- 구분선
    if(/^-{3,}$/.test(line.trim())) {
      html += '<hr>';
      continue;
    }
    // - 불릿 리스트
    if(line.startsWith('- ') || line.startsWith('* ')) {
      if(!inList || listType !== 'ul') {
        if(inList) html += listType === 'ol' ? '</ol>' : '</ul>';
        html += '<ul>'; inList = true; listType = 'ul';
      }
      html += `<li>${inlineFormat(line.slice(2))}</li>`;
      continue;
    }
    // 1. 번호 리스트
    if(/^\d+\.\s/.test(line)) {
      if(!inList || listType !== 'ol') {
        if(inList) html += listType === 'ul' ? '</ul>' : '</ol>';
        html += '<ol>'; inList = true; listType = 'ol';
      }
      html += `<li>${inlineFormat(line.replace(/^\d+\.\s/, ''))}</li>`;
      continue;
    }

    // 일반 단락
    if(inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; listType = ''; }
    html += `<p>${inlineFormat(line)}</p>`;
  }

  if(inList) html += listType === 'ul' ? '</ul>' : '</ol>';
  return html;
}

// 인라인 마크다운 파싱 (**bold**, *em*, `code`)
function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function closeBlogModal() { document.getElementById('blogModal')?.classList.remove('open'); }

// ══════════════════════════════════
// PORTFOLIO
// ══════════════════════════════════
let pfActiveCats = [];
let pfActiveTags = [];

function initPortfolio() {
  renderPortfolio();

  document.querySelectorAll('.pf-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.cat;
      if(v === '전체') { pfActiveCats = []; pfActiveTags = []; syncPfButtons(); renderPortfolio(); return; }
      toggleArr(pfActiveCats, v);
      syncPfButtons();
      renderPortfolio();
    });
  });
}

function toggleArr(arr, v) {
  const i = arr.indexOf(v);
  if(i === -1) arr.push(v); else arr.splice(i, 1);
}

function syncPfButtons() {
  document.querySelectorAll('.pf-cat-btn').forEach(b => {
    const v = b.dataset.cat;
    b.classList.toggle('active',
      v === '전체' ? pfActiveCats.length === 0 : pfActiveCats.includes(v));
  });
}

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;

  let items = MM_DATA.portfolio;
  if(pfActiveCats.length) items = items.filter(p => pfActiveCats.some(c => p.categories.includes(c)));

  grid.innerHTML = items.length
    ? items.map(p => portfolioCard(p)).join('')
    : '<p style="text-align:center;color:var(--text3);padding:40px 0;grid-column:1/-1;">해당 조건의 포트폴리오가 없습니다.</p>';
}

function portfolioCard(p) {
  if(p.isDesign) return designCard(p);

  const types = (p.purchasable.type||[]).join(' · ') || '';
  const purchBadge = p.purchasable.available
    ? `<span class="purchasable-badge purchasable-y">✅ 구매 가능${types ? ' · '+types : ''}</span>`
    : `<span class="purchasable-badge purchasable-n">🚫 판매 불가</span>`;

  return `
  <div class="portfolio-card" onclick="openPfModal(${p.id})">
    <img class="portfolio-thumb" src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.background='#1e293b';this.src='';">
    <div class="portfolio-body">
      <div class="portfolio-cats">${p.categories.map(c=>`<span class="cat-badge">${c}</span>`).join('')}</div>
      <div class="portfolio-name">${p.name}</div>
      <div class="portfolio-summary">${p.summary}</div>
      <div class="portfolio-meta">
        <div class="meta-row"><span class="meta-label">💰 금액</span><span class="meta-value">${p.price||'-'}</span></div>
        <div class="meta-row"><span class="meta-label">📅 기간</span><span class="meta-value">${p.period||'-'}</span></div>
        <div class="meta-row"><span class="meta-label">🎯 타깃</span><span class="meta-value">${(p.target||[]).join(', ')}</span></div>
      </div>
    </div>
    <div class="portfolio-footer">${purchBadge}<button class="detail-btn">자세히 →</button></div>
  </div>`;
}

function designCard(p) {
  const custom = p.purchasable.customizable ? '커스텀 가능' : (p.purchasable.negotiable ? '협의' : '커스텀 불가');
  const avail = p.purchasable.available ? '구매 가능' : '판매 불가';
  return `
  <div class="portfolio-card" onclick="openPfModal(${p.id})">
    <img class="portfolio-thumb" src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.background='#1e293b';this.src='';">
    <div class="portfolio-body">
      <div class="portfolio-cats"><span class="cat-badge">디자인</span></div>
      <div class="portfolio-name">${p.name}</div>
      <div class="portfolio-summary">${p.summary}</div>
      <div class="portfolio-meta">
        <div class="meta-row"><span class="meta-label">🎨 유형</span><span class="meta-value">${(p.designType||[]).join(', ')}</span></div>
        <div class="meta-row"><span class="meta-label">🛠 커스텀</span><span class="meta-value">${custom}</span></div>
      </div>
    </div>
    <div class="portfolio-footer">
      <span class="purchasable-badge ${p.purchasable.available ? 'purchasable-y':'purchasable-n'}">${p.purchasable.available ? '✅':'🚫'} ${avail}</span>
      <button class="detail-btn">자세히 →</button>
    </div>
  </div>`;
}

// ── Portfolio Modal ──
function openPfModal(id) {
  const p = MM_DATA.portfolio.find(x => x.id === id);
  if(!p) return;
  const m = document.getElementById('pfModal');
  let body = '';
  const canBuy = p.purchasable.available;

  if(p.isDesign) {
    const custom = p.purchasable.customizable ? '✅ 커스텀 가능' : (p.purchasable.negotiable ? '💬 협의' : '❌ 커스텀 불가');
    const buyBtnHtml = canBuy
      ? `<button class="btn btn-primary" onclick="closePfModal();openBuyModal(${p.id});" style="width:100%;justify-content:center;">🛒 구매 문의하기</button>`
      : `<div class="not-available-msg">🚫 구매 불가능한 상품입니다</div>`;
    body = `
      <img src="${p.thumbnail}" style="width:100%;height:240px;object-fit:cover;border-radius:20px 20px 0 0;" onerror="this.style.display='none';">
      <div style="padding:32px;">
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px;color:var(--text);">${p.name}</h2>
        <p style="color:var(--text2);margin-bottom:24px;font-size:0.88rem;">${p.summary}</p>
        <div class="pf-meta-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🎨 디자인 유형</div>
            <div class="pf-meta-item-val">${(p.designType||[]).join(', ')}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🛒 구매 여부</div>
            <div class="pf-meta-item-val">${canBuy ? '✅ 가능' : '🚫 불가'}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🛠 커스텀</div>
            <div class="pf-meta-item-val">${custom}</div>
          </div>
        </div>
        <div style="margin-bottom:20px;">${(p.tags||[]).map(renderTag).join('')}</div>
        ${buyBtnHtml}
      </div>`;
  } else {
    const types = (p.purchasable.type||[]).join(' · ');
    const buyBtnHtml = canBuy
      ? `<button class="btn btn-primary" onclick="closePfModal();openBuyModal(${p.id});" style="width:100%;justify-content:center;">🛒 구매 문의하기</button>`
      : `<div class="not-available-msg">🚫 구매 불가능한 상품입니다</div>`;
    body = `
      <img src="${p.thumbnail}" style="width:100%;height:240px;object-fit:cover;border-radius:20px 20px 0 0;" onerror="this.style.display='none';">
      <div style="padding:32px;">
        <div style="display:flex;gap:6px;margin-bottom:10px;">${p.categories.map(c=>`<span class="cat-badge">${c}</span>`).join('')}</div>
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px;color:var(--text);">${p.name}</h2>
        <p style="color:var(--text2);margin-bottom:24px;font-size:0.88rem;">${p.summary}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">💻 기술 스택</div>
            <div class="pf-meta-item-val" style="font-size:0.78rem;">${(p.techStack||[]).join(', ')}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🏆 핵심 성과</div>
            <div class="pf-meta-item-val" style="font-size:0.78rem;">${p.achievement||'-'}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">📅 개발 기간</div>
            <div class="pf-meta-item-val">${p.period||'-'}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">💰 금액</div>
            <div class="pf-meta-item-val" style="color:var(--aurora-1);">${p.price||'-'}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🛒 구매 가능</div>
            <div class="pf-meta-item-val">${canBuy ? `✅ ${types}` : '🚫 불가'}</div>
          </div>
          <div class="pf-meta-item-box">
            <div class="pf-meta-item-lbl">🎯 고객 타깃</div>
            <div class="pf-meta-item-val">${(p.target||[]).join(', ')}</div>
          </div>
        </div>
        <div style="margin-bottom:20px;">${(p.tags||[]).map(renderTag).join('')}</div>
        ${buyBtnHtml}
      </div>`;
  }

  m.querySelector('.modal-body').innerHTML = body;
  m.classList.add('open');
}
function closePfModal() { document.getElementById('pfModal')?.classList.remove('open'); }

// ── 구매 문의 모달 ──
function openBuyModal(id) {
  const p = MM_DATA.portfolio.find(x => x.id === id);
  if(!p) return;
  const tags  = (p.tags || []);
  const price = p.price || '-';

  document.getElementById('buyModalBody').innerHTML = `
    <div style="padding:32px 28px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="font-size:2rem;margin-bottom:8px;">🛒</div>
        <h2 style="font-size:1.15rem;font-weight:900;color:var(--text);margin-bottom:4px;">구매 문의</h2>
        <p style="font-size:0.8rem;color:var(--text3);padding:6px 14px;background:rgba(0,245,200,0.06);border:1px solid rgba(0,245,200,0.15);border-radius:8px;display:inline-block;">${p.name}</p>
      </div>

      <form id="buyForm" autocomplete="off">
        <input type="hidden" id="buy_project_name" value="${escHtml(p.name)}">
        <input type="hidden" id="buy_project_price" value="${escHtml(price)}">
        <input type="hidden" id="buy_project_tags" value="${escHtml(tags.join(','))}">

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

          <!-- 성함/회사명 -->
          <div class="form-group">
            <label class="form-label">성함 / 회사명 <span class="req">*</span></label>
            <input id="buy_name" type="text" class="form-control" placeholder="홍길동 / (주)마케팅믹스" required>
          </div>

          <!-- 연락처 -->
          <div class="form-group">
            <label class="form-label">연락처 <span class="req">*</span></label>
            <input id="buy_phone" type="tel" class="form-control" placeholder="010-0000-0000" required>
          </div>

          <!-- 이메일 -->
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">이메일 <span class="req">*</span></label>
            <input id="buy_email" type="email" class="form-control" placeholder="example@email.com" required>
          </div>

          <!-- 메신저 -->
          <div class="form-group">
            <label class="form-label">메신저 <span class="req">*</span></label>
            <select id="buy_messenger" class="form-control" required>
              <option value="">선택해 주세요</option>
              <option value="카카오톡">카카오톡</option>
              <option value="디스코드">디스코드</option>
              <option value="텔레그램">텔레그램</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <!-- 메신저 ID -->
          <div class="form-group">
            <label class="form-label">메신저 ID <span class="req">*</span></label>
            <input id="buy_messenger_id" type="text" class="form-control" placeholder="@username 등" required>
          </div>

          <!-- 프로젝트명 (자동) -->
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">프로젝트명</label>
            <input type="text" class="form-control" value="${escHtml(p.name)}" readonly
              style="opacity:0.55;cursor:not-allowed;background:rgba(255,255,255,0.02);">
          </div>

          <!-- 문의 유형 (태그 체크박스) -->
          ${tags.length ? `
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">문의 유형 <span class="req">*</span></label>
            <div class="buy-tag-grid">
              ${tags.map(t => `
              <label class="buy-tag-item">
                <input type="checkbox" name="buy_tag" value="${escHtml(t)}" checked>
                <span class="buy-tag-label">${t}</span>
              </label>`).join('')}
            </div>
          </div>` : ''}

          <!-- 결제 금액 (자동) -->
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">결제 금액</label>
            <input type="text" class="form-control" value="${escHtml(price)}" readonly
              style="opacity:0.55;cursor:not-allowed;background:rgba(255,255,255,0.02);color:var(--aurora-1);font-weight:700;">
          </div>

          <!-- 문의 내용 (선택) -->
          <div class="form-group" style="grid-column:1/-1;">
            <label class="form-label">문의 내용 <span class="opt">(선택)</span></label>
            <textarea id="buy_content" class="form-control" rows="3"
              placeholder="추가 문의사항이 있으면 입력해 주세요."></textarea>
          </div>

        </div><!-- /grid -->

        <button type="button" class="submit-btn" id="buySubmitBtn" style="margin-top:20px;width:100%;"
          onclick="submitBuyForm()">📨 구매 문의 접수하기</button>
      </form>

      <div id="buySuccess" style="display:none;text-align:center;padding:40px 0 20px;">
        <div style="font-size:3rem;margin-bottom:14px;">🎉</div>
        <div style="font-size:1.1rem;font-weight:900;color:var(--text);margin-bottom:8px;">접수 완료!</div>
        <div style="font-size:0.85rem;color:var(--text3);line-height:1.7;">빠른 시일 내에 입력하신 연락처로 연락드리겠습니다.<br>텔레그램으로 문의 내용이 발송되었습니다.</div>
        <button class="btn btn-outline" style="margin-top:24px;" onclick="closeBuyModal()">닫기</button>
      </div>
    </div>`;

  // 모달 열기 및 스크롤 초기화
  const modal = document.getElementById('buyModal');
  modal.classList.add('open');
  const box = modal.querySelector('.modal-box');
  if(box) box.scrollTop = 0;
}

// 간단한 HTML 이스케이프
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/"/g,'&quot;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

async function submitBuyForm() {
  const name    = document.getElementById('buy_name').value.trim();
  const phone   = document.getElementById('buy_phone').value.trim();
  const email   = document.getElementById('buy_email').value.trim();
  const msn     = document.getElementById('buy_messenger').value;
  const msnId   = document.getElementById('buy_messenger_id').value.trim();
  const projName= document.getElementById('buy_project_name').value;
  const price   = document.getElementById('buy_project_price').value;
  const content = document.getElementById('buy_content').value.trim();

  if(!name || !phone || !email || !msn || !msnId) {
    alert('필수 항목을 모두 입력해 주세요.');
    return;
  }

  // 체크된 태그 수집
  const checked = [...document.querySelectorAll('input[name="buy_tag"]:checked')].map(el => el.value);
  const tagStr  = checked.length ? checked.join(', ') : '-';

  const btn = document.getElementById('buySubmitBtn');
  if(btn) { btn.disabled = true; btn.textContent = '전송 중...'; }

  const kstNow = nowKST();
  const tgMsg =
`**[ Github - MarketingMix.]**
구매 문의 드립니다.

👤 성함/회사명 : ${name}
📱 연락처 : ${phone}
📧 이메일 : ${email}
💬 메신저 : ${msn} / 메신저 ID : ${msnId}

📌 프로젝트명 : **${projName}**
📋 문의 유형 : ${tagStr}
💰 구매 금액 : **${price}**

💬 문의 내용 :
${content || '(없음)'}

🕒 문의 시간 : ${kstNow}
🌐 IP 주소 : ${userIP}`;

  await sendTelegram(tgMsg);

  document.getElementById('buyForm').style.display = 'none';
  document.getElementById('buySuccess').style.display = 'block';
}

function closeBuyModal() {
  document.getElementById('buyModal')?.classList.remove('open');
}


// ── Search ──
function initSearch() {
  const inp = document.getElementById('searchInput');
  if(!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if(!q) { renderPortfolio(); return; }
    const filtered = MM_DATA.portfolio.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      (p.tags||[]).some(t => t.toLowerCase().includes(q)) ||
      p.categories.some(c => c.toLowerCase().includes(q))
    );
    const grid = document.getElementById('portfolioGrid');
    grid.innerHTML = filtered.length
      ? filtered.map(p => portfolioCard(p)).join('')
      : `<p style="text-align:center;color:var(--text3);padding:40px 0;grid-column:1/-1;">"${q}"에 대한 결과가 없습니다.</p>`;
  });
}

// ══════════════════════════════════
// PROJECT LIST
// ══════════════════════════════════
// SVG 아이콘 렌더 헬퍼
function pfSvg(path, color='currentColor', vb='0 0 24 24') {
  return `<svg width="20" height="20" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;">${path}</svg>`;
}

const PLATFORM_ICONS = {
  // ↓ svg 필드: pfSvg(path, color) 결과 문자열. label은 툴팁에 표시됩니다.
  // 새 플랫폼 추가 시: key 추가 후 index.html <select id="pj_platform">에도 같은 value로 <option> 추가.
  program: {
    label: '프로그램',
    svg: pfSvg(`<rect x="2" y="3" width="20" height="14" rx="2" stroke="#94a3b8" stroke-width="1.8" fill="none"/><path d="M8 21h8M12 17v4" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/><path d="M6 8l3 3-3 3" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="13" y1="14" x2="18" y2="14" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>`)
  },
  naver: {
    label: '네이버',
    svg: pfSvg(`<rect width="24" height="24" rx="5" fill="#03C75A"/><path d="M5 18V6h4.2l4.6 7V6H18v12h-4.2L9.2 11v7H5z" fill="white"/>`)
  },
  google: {
    label: '구글',
    svg: pfSvg(`<path d="M21.8 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.5c-.2 1.2-.9 2.3-2 2.9v2.4h3.2c1.9-1.7 3-4.3 3-7z" fill="#4285F4"/><path d="M12 22c2.7 0 5-0.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H3v2.5C4.7 19.9 8.1 22 12 22z" fill="#34A853"/><path d="M6.3 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3C2.4 8.8 2 10.4 2 12s.4 3.2 1 4.4l3.3-2.5z" fill="#FBBC05"/><path d="M12 5.8c1.5 0 2.9.5 4 1.5l3-3C17 2.6 14.7 2 12 2 8.1 2 4.7 4.1 3 7.6l3.3 2.6C7.1 7.6 9.3 5.8 12 5.8z" fill="#EA4335"/>`)
  },
  instagram: {
    label: '인스타그램',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><defs><radialGradient id="igG" cx="30%" cy="105%" r="130%" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#FFD600"/><stop offset="18%" stop-color="#FF6B00"/><stop offset="38%" stop-color="#FF0069"/><stop offset="65%" stop-color="#C9007A"/><stop offset="100%" stop-color="#6600FF"/></radialGradient></defs><rect x="1" y="1" width="18" height="18" rx="5.5" fill="url(#igG)"/><circle cx="10" cy="10" r="3.6" stroke="white" stroke-width="1.5" fill="none"/><circle cx="14.8" cy="5.2" r="1.1" fill="white"/></svg>`
  },
  facebook: {
    label: '페이스북',
    svg: pfSvg(`<rect width="24" height="24" rx="5" fill="#1877F2"/><path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white"/>`)
  },
  kakao: {
    label: '카카오톡',
    svg: pfSvg(`<rect width="24" height="24" rx="5" fill="#FEE500"/><path d="M12 5.5C8.134 5.5 5 8.02 5 11.133c0 1.963 1.19 3.696 3 4.75l-.77 2.87c-.07.26.19.47.42.32l3.37-2.22c.32.04.65.06.98.06 3.866 0 7-2.52 7-5.633S15.866 5.5 12 5.5z" fill="#3C1E1E"/>`)
  },
  telegram: {
    label: '텔레그램',
    svg: pfSvg(`<circle cx="12" cy="12" r="11" fill="#29B6F6"/><path d="M5.5 11.8l12.3-4.74c.57-.21 1.07.14.88.99l-2.09 9.84c-.16.71-.57.88-1.15.55l-3.2-2.36-1.54 1.49c-.17.17-.32.31-.65.31l.23-3.28 5.98-5.4c.26-.23-.06-.36-.4-.13L7.4 13.4l-3.15-1c-.69-.22-.7-.69.38-1.03z" fill="white"/>`)
  },
  discord: {
    label: '디스코드',
    svg: pfSvg(`<rect width="24" height="24" rx="5" fill="#5865F2"/><path d="M16.5 6.5S15 5.5 13 5.3l-.2.4c1.7.4 2.5 1 3.3 1.8C14.8 7 13.4 6.5 12 6.5s-2.8.5-4.1 1c.8-.8 1.7-1.5 3.4-1.8L11 5.3C9 5.5 7.5 6.5 7.5 6.5S5.9 9 5.5 14c1.5 1.7 3.8 1.8 3.8 1.8l.7-1a5 5 0 01-2.3-1.6c.8.6 2 1.2 4.3 1.2s3.5-.6 4.3-1.2a5 5 0 01-2.3 1.6l.7 1s2.3-.1 3.8-1.8c-.4-5-2-7.5-2-7.5zM10 12.3a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6zm4 0a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6z" fill="white"/>`)
  },
  slack: {
    label: '슬랙',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M7.077 11.408a1.542 1.542 0 01-1.54 1.542 1.542 1.542 0 01-1.542-1.542 1.542 1.542 0 011.541-1.541H7.077v1.541zm.772 0a1.542 1.542 0 011.542-1.541 1.542 1.542 0 011.541 1.541v3.857a1.542 1.542 0 01-1.541 1.542 1.542 1.542 0 01-1.542-1.542v-3.857z" fill="#E01E5A"/><path d="M8.591 7.077a1.542 1.542 0 01-1.541-1.54 1.542 1.542 0 011.541-1.542 1.542 1.542 0 011.542 1.541V7.077H8.59zm0 .772a1.542 1.542 0 011.542 1.542 1.542 1.542 0 01-1.542 1.541H4.735a1.542 1.542 0 01-1.542-1.541 1.542 1.542 0 011.542-1.542h3.856z" fill="#36C5F0"/><path d="M12.923 8.591a1.542 1.542 0 011.541-1.541 1.542 1.542 0 011.542 1.541 1.542 1.542 0 01-1.542 1.542h-1.541V8.59zm-.772 0a1.542 1.542 0 01-1.542 1.542 1.542 1.542 0 01-1.541-1.542V4.735a1.542 1.542 0 011.541-1.542 1.542 1.542 0 011.542 1.542V8.59z" fill="#2EB67D"/><path d="M11.409 12.923a1.542 1.542 0 011.541 1.541 1.542 1.542 0 01-1.541 1.542 1.542 1.542 0 01-1.542-1.542v-1.541h1.542zm0-.772a1.542 1.542 0 01-1.542-1.542 1.542 1.542 0 011.542-1.541h3.856a1.542 1.542 0 011.542 1.541 1.542 1.542 0 01-1.542 1.542h-3.856z" fill="#ECB22E"/></svg>`
  },
  email: {
    label: '이메일',
    svg: pfSvg(`<rect x="2" y="4" width="20" height="16" rx="3" stroke="#60a5fa" stroke-width="1.8" fill="none"/><path d="M2 8l10 6 10-6" stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round"/>`)
  },
  phone: {
    label: '번호',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="5.5" y="1.5" width="9" height="17" rx="2" stroke="#a78bfa" stroke-width="1.6" fill="none"/><rect x="7.5" y="3.5" width="5" height="1.2" rx="0.6" fill="#a78bfa" opacity="0.5"/><circle cx="10" cy="16.2" r="1" fill="#a78bfa"/></svg>`
  },
  website: {
    label: '홈페이지',
    svg: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M2.5 9L10 2.5 17.5 9V18H13v-5H7v5H2.5V9z" stroke="#34d399" stroke-width="1.6" stroke-linejoin="round" fill="none"/></svg>`
  },
  etc: {
    label: '기타',
    svg: pfSvg(`<circle cx="12" cy="12" r="1.5" fill="#94a3b8"/><circle cx="6" cy="12" r="1.5" fill="#94a3b8"/><circle cx="18" cy="12" r="1.5" fill="#94a3b8"/>`)
  },
};


const STATUS_STYLES = {
  '접수':   { color:'#64748b', bg:'rgba(100,116,139,0.12)', border:'rgba(100,116,139,0.3)' },
  '대기 중':{ color:'#f59e0b', bg:'rgba(245,158,11,0.1)',   border:'rgba(245,158,11,0.3)' },
  '진행 중':{ color:'#0ea5e9', bg:'rgba(14,165,233,0.1)',   border:'rgba(14,165,233,0.3)' },
  '보류 중':{ color:'#ef4444', bg:'rgba(239,68,68,0.1)',    border:'rgba(239,68,68,0.3)' },
  '완료':   { color:'#10b981', bg:'rgba(16,185,129,0.1)',   border:'rgba(16,185,129,0.3)' },
};

// 문의 목록 상태 스타일 (접수완료 / 확인 / 답변완료)
const INQ_STATUS_STYLES = {
  'new':    { label:'접수 완료', color:'#00f5c8', bg:'rgba(0,245,200,0.1)',   border:'rgba(0,245,200,0.3)' },
  'read':   { label:'확인',      color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)' },
  'done':   { label:'답변 완료', color:'#10b981', bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.3)' },
};

function renderInquiryList() {
  const tbody = document.getElementById('inqTableBody');
  if(!tbody) return;

  const list   = MM_DATA.getInquiries();
  const recent = list.slice(0, 10);
  const s      = calcInqStats();

  // 통계 뱃지 업데이트
  const elTotal = document.getElementById('inqTotalCount');
  if(elTotal) elTotal.textContent = s.total;

  if(!recent.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:var(--text3);">등록된 문의가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(item => {
    const st = INQ_STATUS_STYLES[item.status] || INQ_STATUS_STYLES['new'];
    return `<tr>
      <td style="font-weight:600;color:var(--text);white-space:nowrap;">${maskName(item.name)}</td>
      <td style="color:var(--text2);">${item.type || '-'}</td>
      <td style="text-align:center;white-space:nowrap;">
        <span style="display:inline-block;min-width:66px;padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${st.label}</span>
      </td>
    </tr>`;
  }).join('');
}

function maskName(name) {
  const n = name.length;
  if(n <= 2) return name;
  if(n === 3) return name[0] + '*' + name[2];
  if(n === 4) return name[0] + '**' + name[3];
  // 5글자 이상: 가운데 1~2자 마스킹
  const mid = Math.floor(n / 2);
  const maskLen = n >= 6 ? 2 : 1;
  return name.slice(0, mid - Math.floor(maskLen/2)) + '*'.repeat(maskLen) + name.slice(mid - Math.floor(maskLen/2) + maskLen);
}

function getProjects() {
  try { return JSON.parse(localStorage.getItem('mm_projects') || '[]'); } catch { return []; }
}
function saveProjects(list) {
  localStorage.setItem('mm_projects', JSON.stringify(list));
}

// 기준값: 관리자가 직접 설정한 "등록 전 누적 수" (기본 0)
function getBaseCount() {
  const v = localStorage.getItem('mm_pj_base');
  return v !== null ? parseInt(v) : 0;
}
function setBaseCount(n) { localStorage.setItem('mm_pj_base', n); }

function getBaseDone() {
  const v = localStorage.getItem('mm_pj_base_done');
  return v !== null ? parseInt(v) : 0;
}
function setBaseDone(n) { localStorage.setItem('mm_pj_base_done', n); }

function getBaseIng() {
  const v = localStorage.getItem('mm_pj_base_ing');
  return v !== null ? parseInt(v) : 0;
}
function setBaseIng(n) { localStorage.setItem('mm_pj_base_ing', n); }

// 문의 기준값
function getBaseInq() {
  const v = localStorage.getItem('mm_inq_base');
  return v !== null ? parseInt(v) : 0;
}
function setBaseInq(n) { localStorage.setItem('mm_inq_base', n); }

// 전체 = 기준값 + 실제 등록 수
function calcStats() {
  const list     = getProjects();
  const base     = getBaseCount();
  const baseDone = getBaseDone();
  const baseIng  = getBaseIng();
  const regDone  = list.filter(p => p.status === '완료').length;
  const regIng   = list.filter(p => p.status === '진행 중').length;
  const total    = base + list.length;
  const done     = baseDone + regDone;
  const ing      = baseIng  + regIng;
  return { total, done, ing, base, baseDone, baseIng, registered: list.length, regDone, regIng };
}

// 문의 통계
function calcInqStats() {
  const list   = MM_DATA.getInquiries();
  const base   = getBaseInq();
  const total  = base + list.length;
  return { total, base, registered: list.length };
}

function renderProjectList() {
  const tbody = document.getElementById('pjTableBody');
  if(!tbody) return;
  const list   = getProjects();
  const recent = list.slice(0, 10);
  const s      = calcStats();

  // 메인 통계 숫자 업데이트 (읽기 전용 — input 없음)
  const elTotal = document.getElementById('pjTotalCount');
  const elDone  = document.getElementById('pjDoneCount');
  const elIng   = document.getElementById('pjIngCount');
  if(elTotal) elTotal.textContent = s.total;
  if(elDone)  elDone.textContent  = s.done;
  if(elIng)   elIng.textContent   = s.ing;

  if(!recent.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text3);">등록된 프로젝트가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(p => {
    const pf = PLATFORM_ICONS[p.platform] || PLATFORM_ICONS.etc;
    const st = STATUS_STYLES[p.status]    || STATUS_STYLES['접수'];
    return `<tr>
      <td style="font-weight:600;color:var(--text);white-space:nowrap;">${maskName(p.name)}</td>
      <td style="text-align:center;" title="${pf.label}">${pf.svg}</td>
      <td style="color:var(--text2);">${p.title}</td>
      <td style="text-align:center;white-space:nowrap;">
        <span style="display:inline-block;min-width:60px;padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${p.status}</span>
      </td>
    </tr>`;
  }).join('');
}

// ══════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contactForm');
  if(!form) return;

  const dateInp = document.getElementById('f_date');
  if(dateInp) {
    dateInp.min = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    btn.disabled = true; btn.textContent = '전송 중...';

    const fd = new FormData(form);
    const get = k => fd.get(k) || '';

    const name     = get('name');
    const phone    = get('phone');
    const email    = get('email');
    const messenger= get('messenger');
    const messId   = get('messenger_id');
    const type     = get('inquiry_type');
    const budget   = get('budget') || '미입력';
    const dueDate  = get('due_date') || '미정';
    const content  = get('content');
    const dday     = dueDate !== '미정' ? ` (${calcDDay(dueDate)})` : '';
    const kstNow   = nowKST();

    const tgMsg = `**[ Github - MarketingMix.]**
👤 성함/회사명 : ${name}
📱 연락처 : ${phone}
📧 이메일 : ${email}
💬 메신저 : ${messenger} / 메신저 ID : ${messId}

📋 문의 유형 : ${type}
💰 예산 범위 : **${budget}**
⏰ 희망 납기 : ${dueDate}${dday}

💬 문의 내용 :
${content}

🕒 문의 시간 : ${kstNow}
🌐 IP 주소 : ${userIP}`;

    await sendTelegram(tgMsg);

    const record = {
      id: Date.now(),
      name, phone, email, messenger, messId, type,
      budget, dueDate, content,
      time: kstNow, ip: userIP,
      status: 'new'
    };
    MM_DATA.saveInquiry(record);

    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
  });
}

// ── Page Nav ──
function goPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const p = document.getElementById(id);
  if(p) { p.classList.add('active'); window.scrollTo(0, 0); }
}

// ── Board Page ──
function renderBoard(cat) {
  const tbody = document.getElementById('boardBody');
  if(!tbody) return;
  const posts = cat && cat !== '전체' ? MM_DATA.posts.filter(p => p.category === cat) : MM_DATA.posts;
  tbody.innerHTML = posts.map((p, i) => `
    <tr>
      <td class="board-num">${posts.length - i}</td>
      <td><span style="background:rgba(0,245,200,0.1);color:var(--aurora-1);padding:2px 9px;border-radius:100px;font-size:0.68rem;font-weight:700;border:1px solid rgba(0,245,200,0.2);">${p.category}</span></td>
      <td><span class="post-title" onclick="openBlogModal(${p.id})">${p.title}</span></td>
      <td style="color:var(--text3);">${p.date}</td>
      <td style="color:var(--text3);">${p.views}</td>
    </tr>`).join('');
}

// ══════════════════════════════════
// ADMIN
// ══════════════════════════════════
let _adminOk = false;

function switchAdminTab(tab, el) {
  // 탭 버튼 active 처리
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // 탭 컨텐츠 표시/숨김
  const tabInquiry  = document.getElementById('adminTabInquiry');
  const tabProjects = document.getElementById('adminTabProjects');
  if(tabInquiry)  tabInquiry.style.display  = (tab === 'inquiry')  ? 'block' : 'none';
  if(tabProjects) tabProjects.style.display = (tab === 'projects') ? 'block' : 'none';
  // 프로젝트 탭 열릴 때 데이터 로드
  if(tab === 'projects') loadAdminProjects();
}

async function _hashPw(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function initAdmin() {
  const loginBtn = document.getElementById('adminLoginBtn');
  if(!loginBtn) return;
  const attempt = async () => {
    const pw = document.getElementById('adminPw').value;
    if(!pw) return;
    const hashed = await _hashPw(pw);
    if(hashed === _AP) {
      _adminOk = true;
      document.getElementById('adminLogin').style.display = 'none';
      document.getElementById('adminPanel').style.display = 'block';
      loadAdminInquiries();
      setInterval(loadAdminInquiries, 30000);
    } else {
      document.getElementById('adminLoginErr').textContent = '비밀번호가 올바르지 않습니다.';
      document.getElementById('adminPw').value = '';
      document.getElementById('adminPw').focus();
    }
  };
  loginBtn.addEventListener('click', attempt);
  document.getElementById('adminPw').addEventListener('keydown', e => {
    if(e.key === 'Enter') attempt();
  });
}

function loadAdminInqStats() {
  const iq = calcInqStats();
  const elTotal = document.getElementById('adminInqTotal');
  const elSub   = document.getElementById('adminInqTotalSub');
  if(elTotal && document.getElementById('adminInqTotalInput')?.style.display === 'none') elTotal.textContent = iq.total;
  if(elSub) elSub.textContent = iq.base > 0
    ? `기준 ${iq.base} + 등록 ${iq.registered}`
    : `등록 ${iq.registered}건`;
}

// 저장 후 모든 통계 한번에 갱신 (cancelEditStat 이후 호출)
function refreshAllStats() {
  renderProjectList();
  renderInquiryList();
  loadAdminProjects();
  loadAdminInqStats();
}

function loadAdminInquiries() {
  const list = MM_DATA.getInquiries();
  const tbody = document.getElementById('adminTableBody');
  if(!tbody) return;

  document.getElementById('adminTotal').textContent = list.length;
  document.getElementById('adminNew').textContent = list.filter(i => i.status === 'new').length;
  loadAdminInqStats();

  tbody.innerHTML = list.length ? list.map(item => {
    const st = INQ_STATUS_STYLES[item.status] || INQ_STATUS_STYLES['new'];
    return `
    <tr>
      <td style="white-space:nowrap;">${item.id}</td>
      <td style="white-space:nowrap;">
        <span style="display:inline-block;min-width:66px;text-align:center;padding:3px 8px;border-radius:100px;font-size:0.68rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">
          ${st.label}
        </span>
      </td>
      <td style="white-space:nowrap;"><strong>${item.name}</strong></td>
      <td style="white-space:nowrap;">${item.phone}</td>
      <td style="white-space:nowrap;">${item.email}</td>
      <td style="white-space:nowrap;">${item.messenger} / ${item.messId}</td>
      <td style="white-space:nowrap;">${item.type}</td>
      <td style="white-space:nowrap;">${item.budget}</td>
      <td style="white-space:nowrap;">${item.dueDate}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.content}</td>
      <td style="white-space:nowrap;">${item.time}</td>
      <td style="white-space:nowrap;">${item.ip}</td>
      <td style="white-space:nowrap;">
        <div style="display:flex;gap:5px;align-items:center;flex-wrap:nowrap;">
          <button onclick="viewInquiry(${item.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(0,245,200,0.1);color:var(--aurora-1);border:1px solid rgba(0,245,200,0.25);cursor:pointer;padding:0 10px;white-space:nowrap;">
            상세보기
          </button>
          ${item.status !== 'done' ? `
          <button onclick="setInqDone(${item.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(16,185,129,0.1);color:#10b981;border:1px solid rgba(16,185,129,0.2);cursor:pointer;padding:0 8px;white-space:nowrap;">
            답변완료
          </button>` : `
          <button onclick="resetInqStatus(${item.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:58px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(100,116,139,0.1);color:#94a3b8;border:1px solid rgba(100,116,139,0.2);cursor:pointer;padding:0 8px;white-space:nowrap;">
            되돌리기
          </button>`}
          <button onclick="deleteInquiry(${item.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);cursor:pointer;padding:0 10px;white-space:nowrap;">
            삭제
          </button>
        </div>
      </td>
    </tr>`;
  }).join('')
    : '<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text3);">문의 내역이 없습니다.</td></tr>';
}

function viewInquiry(id) {
  const list = MM_DATA.getInquiries();
  const item = list.find(i => i.id === id);
  if(!item) return;

  // 신규면 읽음으로 처리
  if(item.status === 'new') {
    const updated = list.map(i => i.id === id ? {...i, status:'read'} : i);
    localStorage.setItem('mm_inquiries', JSON.stringify(updated));
    item.status = 'read';
  }

  const existing = document.getElementById('inquiryDetailModal');
  if(existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'inquiryDetailModal';
  overlay.style.cssText = `position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;`;
  overlay.onclick = e => { if(e.target === overlay) { overlay.remove(); loadAdminInquiries(); renderInquiryList(); }};

  const st = INQ_STATUS_STYLES[item.status] || INQ_STATUS_STYLES['new'];
  overlay.innerHTML = `
    <div style="background:var(--bg-surface,#1a1f2e);border:1px solid rgba(0,245,200,0.15);border-radius:20px;width:100%;max-width:540px;max-height:88vh;overflow-y:auto;position:relative;box-shadow:0 24px 64px rgba(0,0,0,0.6);">
      <div style="padding:24px 28px 0;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:100px;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${st.label}</span>
          <span style="font-size:0.75rem;color:var(--text3,#64748b);">#${item.id}</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${item.status !== 'done' ? `<button onclick="setInqDone(${item.id});document.getElementById('inquiryDetailModal').remove();"
            style="height:30px;padding:0 14px;border-radius:8px;font-size:0.75rem;font-weight:700;background:rgba(16,185,129,0.12);color:#10b981;border:1px solid rgba(16,185,129,0.25);cursor:pointer;">
            ✓ 답변 완료
          </button>` : ''}
          <button onclick="document.getElementById('inquiryDetailModal').remove();loadAdminInquiries();renderInquiryList();"
            style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;width:32px;height:32px;cursor:pointer;color:var(--text3,#94a3b8);font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
      </div>
      <div style="padding:20px 28px 32px;">
        <h3 style="font-size:1.05rem;font-weight:800;color:var(--text,#e2e8f0);margin:0 0 20px;">📋 문의 상세 내용</h3>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 18px;margin-bottom:14px;">
          <div style="font-size:0.68rem;font-weight:700;color:var(--aurora-1,#00f5c8);letter-spacing:1px;margin-bottom:12px;">CONTACT</div>
          ${detailRow('👤 성함/회사명', item.name)}
          ${detailRow('📱 연락처', item.phone)}
          ${detailRow('📧 이메일', item.email)}
          ${detailRow('💬 메신저', `${item.messenger} · ${item.messId}`)}
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 18px;margin-bottom:14px;">
          <div style="font-size:0.68rem;font-weight:700;color:var(--aurora-2,#7b6fef);letter-spacing:1px;margin-bottom:12px;">INQUIRY</div>
          ${detailRow('📋 문의 유형', item.type)}
          ${detailRow('💰 예산 범위', item.budget)}
          ${detailRow('⏰ 희망 납기', item.dueDate)}
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 18px;margin-bottom:14px;">
          <div style="font-size:0.68rem;font-weight:700;color:var(--aurora-3,#ff79c6);letter-spacing:1px;margin-bottom:10px;">CONTENT</div>
          <p style="font-size:0.88rem;line-height:1.8;color:var(--text2,#94a3b8);margin:0;white-space:pre-wrap;">${item.content || '(내용 없음)'}</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span style="font-size:0.72rem;color:var(--text3,#64748b);">🕒 ${item.time}</span>
          <span style="font-size:0.72rem;color:var(--text3,#64748b);">🌐 ${item.ip}</span>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  loadAdminInquiries();
  renderInquiryList();
}


function detailRow(label, value) {
  return `<div style="display:flex;gap:12px;margin-bottom:8px;align-items:baseline;">
    <span style="font-size:0.75rem;color:var(--text3,#64748b);white-space:nowrap;min-width:110px;">${label}</span>
    <span style="font-size:0.85rem;font-weight:600;color:var(--text,#e2e8f0);">${value || '-'}</span>
  </div>`;
}

function setInqDone(id) {
  const list = MM_DATA.getInquiries().map(i => i.id === id ? {...i, status:'done'} : i);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
  renderInquiryList();
}
function resetInqStatus(id) {
  const list = MM_DATA.getInquiries().map(i => i.id === id ? {...i, status:'read'} : i);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
  renderInquiryList();
}
function markRead(id) {
  const list = MM_DATA.getInquiries().map(i => i.id === id ? {...i, status: i.status === 'new' ? 'read' : i.status} : i);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
  renderInquiryList();
}
function deleteInquiry(id) {
  if(!confirm('삭제하시겠습니까?')) return;
  const list = MM_DATA.getInquiries().filter(i => i.id !== id);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
}

// ── 프로젝트 목록 관리 ──
function loadAdminProjects() {
  const s = calcStats();

  // 편집 중 아닌 것만 업데이트
  const els = {
    total: document.getElementById('adminPjTotal'),
    done:  document.getElementById('adminPjDone'),
    ing:   document.getElementById('adminPjIng'),
  };
  if(els.total && document.getElementById('adminPjTotalInput')?.style.display === 'none') els.total.textContent = s.total;
  if(els.done  && document.getElementById('adminPjDoneInput')?.style.display  === 'none') els.done.textContent  = s.done;
  if(els.ing   && document.getElementById('adminPjIngInput')?.style.display   === 'none') els.ing.textContent   = s.ing;

  const elSubTotal = document.getElementById('adminPjTotalSub');
  const elSubDone  = document.getElementById('adminPjDoneSub');
  const elSubIng   = document.getElementById('adminPjIngSub');
  if(elSubTotal) elSubTotal.textContent = s.base > 0     ? `기준 ${s.base} + 등록 ${s.registered}`   : `등록 ${s.registered}건`;
  if(elSubDone)  elSubDone.textContent  = s.baseDone > 0 ? `기준 ${s.baseDone} + 등록 ${s.regDone}` : `등록 ${s.regDone}건`;
  if(elSubIng)   elSubIng.textContent   = s.baseIng > 0  ? `기준 ${s.baseIng} + 등록 ${s.regIng}`   : `등록 ${s.regIng}건`;

  // 문의 기준값 통계도 갱신
  const iq = calcInqStats();
  const elInqTotal = document.getElementById('adminInqTotal');
  const elInqSub   = document.getElementById('adminInqTotalSub');
  if(elInqTotal) elInqTotal.textContent = iq.total;
  if(elInqSub)   elInqSub.textContent   = iq.base > 0
    ? `기준 ${iq.base} + 등록 ${iq.registered}`
    : `등록 ${iq.registered}건`;

  const list  = getProjects();
  const tbody = document.getElementById('adminPjBody');
  if(!tbody) return;

  tbody.innerHTML = list.length ? list.map(p => {
    const pf = PLATFORM_ICONS[p.platform] || PLATFORM_ICONS.etc;
    const st = STATUS_STYLES[p.status]    || STATUS_STYLES['접수'];
    return `<tr>
      <td style="white-space:nowrap;font-weight:600;color:var(--text);">${p.name}</td>
      <td style="text-align:center;white-space:nowrap;" title="${pf.label}">
        ${pf.svg}
        <span style="display:block;font-size:0.65rem;color:var(--text3);margin-top:2px;">${pf.label}</span>
      </td>
      <td style="color:var(--text2);">${p.title}</td>
      <td style="text-align:center;white-space:nowrap;">
        <span style="display:inline-block;min-width:60px;padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${p.status}</span>
      </td>
      <td style="white-space:nowrap;">
        <div style="display:flex;gap:5px;align-items:center;">
          <button onclick="editPjItem(${p.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(255,255,255,0.06);color:var(--text2);border:1px solid rgba(255,255,255,0.12);cursor:pointer;padding:0 10px;">
            수정
          </button>
          <button onclick="deletePjItem(${p.id})"
            style="display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:28px;font-size:0.7rem;font-weight:600;border-radius:7px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);cursor:pointer;padding:0 10px;">
            삭제
          </button>
        </div>
      </td>
    </tr>`;
  }).join('')
  : '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text3);">등록된 프로젝트가 없습니다.</td></tr>';

  // 메인 목록도 동기화
  renderProjectList();
}

function openPjForm() {
  document.getElementById('pjFormTitle').textContent = '프로젝트 추가';
  document.getElementById('pjEditId').value = '';
  document.getElementById('pj_name').value = '';
  document.getElementById('pj_platform').value = 'program';
  document.getElementById('pj_title').value = '';
  document.getElementById('pj_status').value = '접수';
  document.getElementById('pjForm').style.display = 'block';
}

function closePjForm() {
  document.getElementById('pjForm').style.display = 'none';
}

function editPjItem(id) {
  const list = getProjects();
  const p = list.find(x => x.id === id);
  if(!p) return;
  document.getElementById('pjFormTitle').textContent = '프로젝트 수정';
  document.getElementById('pjEditId').value     = id;
  document.getElementById('pj_name').value      = p.name;
  document.getElementById('pj_platform').value  = p.platform;
  document.getElementById('pj_title').value     = p.title;
  document.getElementById('pj_status').value    = p.status;
  document.getElementById('pjForm').style.display = 'block';
  document.getElementById('pjForm').scrollIntoView({ behavior:'smooth' });
}

function savePjItem() {
  const name     = document.getElementById('pj_name').value.trim();
  const platform = document.getElementById('pj_platform').value;
  const title    = document.getElementById('pj_title').value.trim();
  const status   = document.getElementById('pj_status').value;
  const editId   = document.getElementById('pjEditId').value;

  if(!name||!title) { alert('성함과 프로젝트명은 필수입니다.'); return; }

  let list = getProjects();
  if(editId) {
    list = list.map(p => p.id === parseInt(editId) ? {...p, name, platform, title, status} : p);
  } else {
    list.unshift({ id: Date.now(), name, platform, title, status });
  }
  saveProjects(list);
  closePjForm();
  loadAdminProjects();
}

function deletePjItem(id) {
  if(!confirm('삭제하시겠습니까?')) return;
  saveProjects(getProjects().filter(p => p.id !== id));
  loadAdminProjects();
}

// ── 메인 문의/프로젝트 탭 전환 ──
function switchListTab(tab, el) {
  document.querySelectorAll('.pj-list-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('listTabInquiry').style.display = tab === 'inquiry' ? 'block' : 'none';
  document.getElementById('listTabProject').style.display = tab === 'project'  ? 'block' : 'none';
}


// ══════════════════════════════════════════════════════════
// 통계 기준값 편집 — 관리자 페이지 전용
// ══════════════════════════════════════════════════════════

// type별 설정 (관리자 DOM ID만 관리)
const STAT_CFG = {
  total: {
    getter: getBaseCount, setter: setBaseCount,
    dispId: 'adminPjTotalDisplay', inpId: 'adminPjTotalInput', valId: 'adminPjTotalVal',
    numId: 'adminPjTotal',
  },
  done: {
    getter: getBaseDone, setter: setBaseDone,
    dispId: 'adminPjDoneDisplay', inpId: 'adminPjDoneInput', valId: 'adminPjDoneVal',
    numId: 'adminPjDone',
  },
  ing: {
    getter: getBaseIng, setter: setBaseIng,
    dispId: 'adminPjIngDisplay', inpId: 'adminPjIngInput', valId: 'adminPjIngVal',
    numId: 'adminPjIng',
  },
  inq: {
    getter: getBaseInq, setter: setBaseInq,
    dispId: 'adminInqTotalDisplay', inpId: 'adminInqTotalInput', valId: 'adminInqTotalVal',
    numId: 'adminInqTotal',
  },
};

function startEditStat(type) {
  const c = STAT_CFG[type]; if(!c) return;
  const disp = document.getElementById(c.dispId);
  const inp  = document.getElementById(c.inpId);
  const val  = document.getElementById(c.valId);
  if(!disp || !inp || !val) { console.warn('startEditStat: element not found', type); return; }
  disp.style.display = 'none';
  inp.style.display  = 'block';
  val.value = c.getter();
  setTimeout(() => { val.focus(); val.select(); }, 30);
}

function saveEditStat(type) {
  const c = STAT_CFG[type]; if(!c) return;
  const val = document.getElementById(c.valId);
  if(!val) return;
  const num = parseInt(val.value, 10);
  if(isNaN(num) || num < 0) { alert('0 이상의 숫자를 입력하세요.'); return; }
  c.setter(num);
  cancelEditStat(type);
  refreshAllStats();
}

function cancelEditStat(type) {
  const c = STAT_CFG[type]; if(!c) return;
  const disp = document.getElementById(c.dispId);
  const inp  = document.getElementById(c.inpId);
  if(disp) disp.style.display = '';
  if(inp)  inp.style.display  = 'none';
}

function refreshAllStats() {
  renderProjectList();
  renderInquiryList();
  loadAdminProjects();
  loadAdminInqStats();
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  renderBlog('전체');
  initPortfolio();
  initSearch();
  initContactForm();
  renderBoard();
  renderProjectList();
  renderInquiryList();
  initAdmin();

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if(e.target === m) m.classList.remove('open'); });
  });
});
