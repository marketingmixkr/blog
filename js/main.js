// ============================================================
// MarketingMix - Main JS (Protected Build)
// ============================================================

// ── 복호화 유틸 (런타임 전용) ──
(function(){
  const _k=0x5A;
  const _b64=atob,_xd=s=>{const r=_b64(s);let o='';for(let i=0;i<r.length;i++)o+=String.fromCharCode(r.charCodeAt(i)^_k);return o;};
  const _s0=['YmxtaWpsamlr','aGAbGx8TLm0N','by8gECoJLT8r','KDwuNzQrFzgd','KzEPNxEoKCwXLQ=='];
  const _s1=['b2lua2po','aGhjag=='];
  const _s2=['NzsoMT8u','MzQ9NzMi','aGpob3s='];
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
`[ Github - MarketingMix. ]
구매 문의 드립니다.

👤 성함/회사명 : ${name}
📱 연락처 : ${phone}
📧 이메일 : ${email}
💬 메신저 : ${msn} / 메신저 ID : ${msnId}

📌 프로젝트명 : ${projName}
📋 문의 유형 : ${tagStr}
💰 구매 금액 : ${price}

💬 문의 내용 :
${content || '(없음)'}

🕒 문의 시간 : ${kstNow} (UTC+9 기준)
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
const PLATFORM_ICONS = {
  program:   { icon:'💻', label:'프로그램' },
  naver:     { icon:'🟢', label:'네이버' },
  google:    { icon:'🔵', label:'구글' },
  instagram: { icon:'📸', label:'인스타그램' },
  facebook:  { icon:'👤', label:'페이스북' },
  discord:   { icon:'🎮', label:'디스코드' },
  slack:     { icon:'💬', label:'슬랙' },
  email:     { icon:'📧', label:'이메일' },
  phone:     { icon:'📱', label:'번호' },
  website:   { icon:'🌐', label:'홈페이지' },
  etc:       { icon:'📌', label:'기타' },
};
// ↑ 플랫폼 아이콘/라벨을 바꾸려면 위 객체의 icon 값을 수정하세요.
// key(program, naver...) 는 드롭다운 option value 와 일치해야 합니다.
// 새 플랫폼 추가: { icon:'🆕', label:'새플랫폼' } 형태로 추가 후,
// index.html의 <select id="pj_platform"> 에도 동일한 value의 <option> 을 추가하세요.


const STATUS_STYLES = {
  '접수':   { color:'#64748b', bg:'rgba(100,116,139,0.12)', border:'rgba(100,116,139,0.3)' },
  '대기 중':{ color:'#f59e0b', bg:'rgba(245,158,11,0.1)',   border:'rgba(245,158,11,0.3)' },
  '진행 중':{ color:'#0ea5e9', bg:'rgba(14,165,233,0.1)',   border:'rgba(14,165,233,0.3)' },
  '보류 중':{ color:'#ef4444', bg:'rgba(239,68,68,0.1)',    border:'rgba(239,68,68,0.3)' },
  '완료':   { color:'#10b981', bg:'rgba(16,185,129,0.1)',   border:'rgba(16,185,129,0.3)' },
};

function maskName(name) {
  const n = name.length;
  if(n <= 2) return name;
  if(n === 3) return name[0] + '●' + name[2];
  if(n === 4) return name[0] + '●●' + name[3];
  // 5글자 이상: 가운데 1~2자 마스킹
  const mid = Math.floor(n / 2);
  const maskLen = n >= 6 ? 2 : 1;
  return name.slice(0, mid - Math.floor(maskLen/2)) + '●'.repeat(maskLen) + name.slice(mid - Math.floor(maskLen/2) + maskLen);
}

function getProjects() {
  try { return JSON.parse(localStorage.getItem('mm_projects') || '[]'); } catch { return []; }
}
function saveProjects(list) {
  localStorage.setItem('mm_projects', JSON.stringify(list));
}
function getTotalOverride() {
  const v = localStorage.getItem('mm_pj_total_override');
  return v !== null ? parseInt(v) : null;
}

function renderProjectList() {
  const tbody = document.getElementById('pjTableBody');
  if(!tbody) return;
  const list = getProjects();
  const recent = list.slice(0, 10);

  // 통계 업데이트
  const totalOverride = getTotalOverride();
  const total = totalOverride !== null ? totalOverride : list.length;
  const done  = list.filter(p => p.status === '완료').length;
  const ing   = list.filter(p => p.status === '진행 중').length;

  const elTotal = document.getElementById('pjTotalCount');
  const elDone  = document.getElementById('pjDoneCount');
  const elIng   = document.getElementById('pjIngCount');
  if(elTotal) elTotal.textContent = total;
  if(elDone)  elDone.textContent  = done;
  if(elIng)   elIng.textContent   = ing;

  if(!recent.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:32px;color:var(--text3);">등록된 프로젝트가 없습니다.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(p => {
    const pf = PLATFORM_ICONS[p.platform] || PLATFORM_ICONS.etc;
    const st = STATUS_STYLES[p.status]   || STATUS_STYLES['접수'];
    return `<tr>
      <td style="font-weight:600;color:var(--text);">${maskName(p.name)}</td>
      <td style="text-align:center;" title="${pf.label}"><span style="font-size:1.3rem;">${pf.icon}</span></td>
      <td style="color:var(--text2);">${p.title}</td>
      <td style="text-align:center;">
        <span style="display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${p.status}</span>
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

    const tgMsg = `[ Github - MarketingMix. ]
👤 성함/회사명 : ${name}
📱 연락처 : ${phone}
📧 이메일 : ${email}
💬 메신저 : ${messenger} / 메신저 ID : ${messId}

📋 문의 유형 : ${type}
💰 예산 범위 : ${budget}
⏰ 희망 납기 : ${dueDate}${dday}

💬 문의 내용 :
${content}

🕒 문의 시간 : ${kstNow} (UTC+9 기준)
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

function initAdmin() {
  const loginBtn = document.getElementById('adminLoginBtn');
  if(loginBtn) {
    loginBtn.addEventListener('click', () => {
      const pw = document.getElementById('adminPw').value;
      if(pw === _AP) {
        _adminOk = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminInquiries();
        setInterval(loadAdminInquiries, 30000);
      } else {
        document.getElementById('adminLoginErr').textContent = '비밀번호가 올바르지 않습니다.';
      }
    });
    document.getElementById('adminPw').addEventListener('keydown', e => {
      if(e.key === 'Enter') loginBtn.click();
    });
  }
}

function loadAdminInquiries() {
  const list = MM_DATA.getInquiries();
  const tbody = document.getElementById('adminTableBody');
  if(!tbody) return;

  document.getElementById('adminTotal').textContent = list.length;
  document.getElementById('adminNew').textContent = list.filter(i => i.status === 'new').length;

  tbody.innerHTML = list.length ? list.map(item => `
    <tr>
      <td>${item.id}</td>
      <td><span class="status-badge ${item.status === 'new' ? 'status-new':'status-read'}">${item.status === 'new' ? '신규':'확인'}</span></td>
      <td><strong>${item.name}</strong></td>
      <td>${item.phone}</td>
      <td>${item.email}</td>
      <td>${item.messenger} / ${item.messId}</td>
      <td>${item.type}</td>
      <td>${item.budget}</td>
      <td>${item.dueDate}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.content}</td>
      <td>${item.time}</td>
      <td>${item.ip}</td>
      <td>
        <button onclick="markRead(${item.id})" class="btn btn-sm btn-outline" style="font-size:0.7rem;padding:4px 10px;">확인</button>
        <button onclick="deleteInquiry(${item.id})" class="btn btn-sm" style="font-size:0.7rem;padding:4px 10px;background:#fef2f2;color:#ef4444;margin-left:4px;">삭제</button>
      </td>
    </tr>`).join('')
    : '<tr><td colspan="13" style="text-align:center;padding:40px;color:var(--text3);">문의 내역이 없습니다.</td></tr>';
}

function markRead(id) {
  const list = MM_DATA.getInquiries().map(i => i.id === id ? {...i, status:'read'} : i);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
}
function deleteInquiry(id) {
  if(!confirm('삭제하시겠습니까?')) return;
  const list = MM_DATA.getInquiries().filter(i => i.id !== id);
  localStorage.setItem('mm_inquiries', JSON.stringify(list));
  loadAdminInquiries();
}

// ── 프로젝트 목록 관리 ──
function loadAdminProjects() {
  const list = getProjects();
  const totalOverride = getTotalOverride();
  const total = totalOverride !== null ? totalOverride : list.length;
  const done  = list.filter(p => p.status === '완료').length;
  const ing   = list.filter(p => p.status === '진행 중').length;

  const elTotal = document.getElementById('adminPjTotal');
  const elDone  = document.getElementById('adminPjDone');
  const elIng   = document.getElementById('adminPjIng');
  if(elTotal) elTotal.textContent = total;
  if(elDone)  elDone.textContent  = done;
  if(elIng)   elIng.textContent   = ing;

  const tbody = document.getElementById('adminPjBody');
  if(!tbody) return;

  tbody.innerHTML = list.length ? list.map(p => {
    const pf = PLATFORM_ICONS[p.platform] || PLATFORM_ICONS.etc;
    const st = STATUS_STYLES[p.status]   || STATUS_STYLES['접수'];
    return `<tr>
      <td>${p.name}</td>
      <td style="text-align:center;" title="${pf.label}"><span style="font-size:1.2rem;">${pf.icon}</span> <span style="font-size:0.72rem;color:var(--text3);">${pf.label}</span></td>
      <td>${p.title}</td>
      <td style="text-align:center;"><span style="display:inline-block;padding:3px 10px;border-radius:100px;font-size:0.72rem;font-weight:700;background:${st.bg};color:${st.color};border:1px solid ${st.border};">${p.status}</span></td>
      <td>
        <button onclick="editPjItem(${p.id})" class="btn btn-sm btn-outline" style="font-size:0.7rem;padding:4px 10px;">수정</button>
        <button onclick="deletePjItem(${p.id})" class="btn btn-sm" style="font-size:0.7rem;padding:4px 10px;background:#fef2f2;color:#ef4444;margin-left:4px;">삭제</button>
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

function editTotalProjects() {
  const cur = getTotalOverride() ?? getProjects().length;
  const val = prompt('누적 프로젝트 수를 입력하세요:', cur);
  if(val === null) return;
  const num = parseInt(val);
  if(isNaN(num) || num < 0) { alert('올바른 숫자를 입력하세요.'); return; }
  localStorage.setItem('mm_pj_total_override', num);
  loadAdminProjects();
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
  initAdmin();

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if(e.target === m) m.classList.remove('open'); });
  });
});
