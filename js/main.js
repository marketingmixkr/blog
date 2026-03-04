// ============================================================
// MarketingMix - Main JS (Protected Build)
// ============================================================

// ── 복호화 유틸 (런타임 전용) ──
(function(){
  const _k=0x5A;
  const _b64=atob,_xd=s=>{const r=_b64(s);let o='';for(let i=0;i<r.length;i++)o+=String.fromCharCode(r.charCodeAt(i)^_k);return o;};
  // 분산 저장: 각 조각을 별도 배열로 보관
  const _s0=['YmxtaWpsamlr','aGAbGx8TLm0N','by8gECoJLT8r','KDwuNzQrFzgd','KzEPNxEoKCwXLQ=='];
  const _s1=['b2lua2po','aGhjag=='];
  const _s2=['NzsoMT8u','MzQ9NzMi','aGpob3s='];
  // 조각 결합 후 복호화
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

// ── Blog ──
let currentBlogCat = '전체';

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
  return `
  <div class="blog-card" onclick="openBlogModal(${p.id})">
    <img class="blog-thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.style.background='#f1f5f9';this.src='';">
    <div class="blog-body">
      <span class="blog-cat">${p.category}</span>
      <div class="blog-title">${p.title}</div>
      <div class="blog-summary">${p.summary}</div>
      <div class="blog-footer">
        <span class="blog-date">📅 ${p.date}</span>
        <span class="blog-views">👁 ${p.views}</span>
      </div>
    </div>
  </div>`;
}

// ── Blog Modal ──
function openBlogModal(id) {
  const post = MM_DATA.posts.find(p => p.id === id);
  if(!post) return;
  const m = document.getElementById('blogModal');
  m.querySelector('.modal-body').innerHTML = `
    <img src="${post.thumbnail}" style="width:100%;height:240px;object-fit:cover;border-radius:20px 20px 0 0;" alt="" onerror="this.style.display='none';">
    <div style="padding:32px;">
      <span class="blog-cat">${post.category}</span>
      <h2 style="font-size:1.4rem;font-weight:800;margin:12px 0 10px;color:var(--text);">${post.title}</h2>
      <div style="display:flex;gap:16px;font-size:0.75rem;color:var(--text3);margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <span>📅 ${post.date}</span><span>👁 ${post.views}</span>
      </div>
      <p style="line-height:1.9;color:var(--text2);font-size:0.9rem;">${post.content}</p>
    </div>`;
  m.classList.add('open');
}
function closeBlogModal() { document.getElementById('blogModal')?.classList.remove('open'); }

// ── Portfolio ──
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

  document.querySelectorAll('.pf-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.tag;
      toggleArr(pfActiveTags, v);
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
  document.querySelectorAll('.pf-tag-btn').forEach(b => {
    b.classList.toggle('active', pfActiveTags.includes(b.dataset.tag));
  });
}

function renderPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;

  let items = MM_DATA.portfolio;
  if(pfActiveCats.length) items = items.filter(p => pfActiveCats.some(c => p.categories.includes(c)));
  if(pfActiveTags.length) items = items.filter(p => pfActiveTags.some(t => (p.tags||[]).includes(t)));

  grid.innerHTML = items.length
    ? items.map(p => portfolioCard(p)).join('')
    : '<p style="text-align:center;color:var(--text3);padding:40px 0;grid-column:1/-1;">해당 조건의 포트폴리오가 없습니다.</p>';
}

function portfolioCard(p) {
  if(p.isDesign) return designCard(p);

  const types = (p.purchasable.type||[]).join(' · ') || '';
  const purchBadge = p.purchasable.available
    ? `<span class="purchasable-badge purchasable-y">✅ 구매 가능${types ? ' · '+types : ''}</span>`
    : `<span class="purchasable-badge purchasable-n">❌ 판매 중단</span>`;

  return `
  <div class="portfolio-card" onclick="openPfModal(${p.id})">
    <img class="portfolio-thumb" src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.background='#f1f5f9';this.src='';">
    <div class="portfolio-body">
      <div class="portfolio-cats">${p.categories.map(c=>`<span class="cat-badge">${c}</span>`).join('')}</div>
      <div class="portfolio-name">${p.name}</div>
      <div class="portfolio-summary">${p.summary}</div>
      <div class="portfolio-tags">${(p.tags||[]).map(renderTag).join('')}</div>
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
  const avail = p.purchasable.available ? '구매 가능' : '판매 중단';
  return `
  <div class="portfolio-card" onclick="openPfModal(${p.id})">
    <img class="portfolio-thumb" src="${p.thumbnail}" alt="${p.name}" loading="lazy" onerror="this.style.background='#f1f5f9';this.src='';">
    <div class="portfolio-body">
      <div class="portfolio-cats"><span class="cat-badge">디자인</span></div>
      <div class="portfolio-name">${p.name}</div>
      <div class="portfolio-summary">${p.summary}</div>
      <div class="portfolio-tags">${(p.tags||[]).map(renderTag).join('')}</div>
      <div class="portfolio-meta">
        <div class="meta-row"><span class="meta-label">🎨 유형</span><span class="meta-value">${(p.designType||[]).join(', ')}</span></div>
        <div class="meta-row"><span class="meta-label">🛠 커스텀</span><span class="meta-value">${custom}</span></div>
      </div>
    </div>
    <div class="portfolio-footer">
      <span class="purchasable-badge ${p.purchasable.available ? 'purchasable-y':'purchasable-n'}">${p.purchasable.available ? '✅':'❌'} ${avail}</span>
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

  if(p.isDesign) {
    const custom = p.purchasable.customizable ? '✅ 커스텀 가능' : (p.purchasable.negotiable ? '💬 협의' : '❌ 커스텀 불가');
    body = `
      <img src="${p.thumbnail}" style="width:100%;height:240px;object-fit:cover;border-radius:20px 20px 0 0;" onerror="this.style.display='none';">
      <div style="padding:32px;">
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px;color:var(--text);">${p.name}</h2>
        <p style="color:var(--text2);margin-bottom:24px;font-size:0.88rem;">${p.summary}</p>
        <div class="pf-meta-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🎨 디자인 유형</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${(p.designType||[]).join(', ')}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🛒 구매 여부</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${p.purchasable.available ? '✅ 가능' : '❌ 불가'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🛠 커스텀</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${custom}</div>
          </div>
        </div>
        <div style="margin-bottom:20px;">${(p.tags||[]).map(renderTag).join('')}</div>
        <button class="btn btn-primary" onclick="navToContact();closePfModal();" style="width:100%;justify-content:center;">문의하기</button>
      </div>`;
  } else {
    const types = (p.purchasable.type||[]).join(' · ');
    body = `
      <img src="${p.thumbnail}" style="width:100%;height:240px;object-fit:cover;border-radius:20px 20px 0 0;" onerror="this.style.display='none';">
      <div style="padding:32px;">
        <div style="display:flex;gap:6px;margin-bottom:10px;">${p.categories.map(c=>`<span class="cat-badge">${c}</span>`).join('')}</div>
        <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:8px;color:var(--text);">${p.name}</h2>
        <p style="color:var(--text2);margin-bottom:24px;font-size:0.88rem;">${p.summary}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">💻 기술 스택</div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text);">${(p.techStack||[]).join(', ')}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🏆 핵심 성과</div>
            <div style="font-size:0.78rem;font-weight:600;color:var(--text);">${p.achievement||'-'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">📅 개발 기간</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${p.period||'-'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">💰 금액</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--aurora-1);">${p.price||'-'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🛒 구매 가능</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${p.purchasable.available ? `✅ ${types}` : '❌ 불가'}</div>
          </div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;">
            <div style="font-size:0.68rem;color:var(--text3);margin-bottom:4px;">🎯 고객 타깃</div>
            <div style="font-size:0.85rem;font-weight:600;color:var(--text);">${(p.target||[]).join(', ')}</div>
          </div>
        </div>
        <div style="margin-bottom:20px;">${(p.tags||[]).map(renderTag).join('')}</div>
        <button class="btn btn-primary" onclick="navToContact();closePfModal();" style="width:100%;justify-content:center;">이 프로젝트 문의하기</button>
      </div>`;
  }

  m.querySelector('.modal-body').innerHTML = body;
  m.classList.add('open');
}
function closePfModal() { document.getElementById('pfModal')?.classList.remove('open'); }
function navToContact() { navTo('contact'); }

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

// ── Contact Form ──
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

// ── Admin ──
let _adminOk = false;

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

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  renderBlog('전체');
  initPortfolio();
  initSearch();
  initContactForm();
  renderBoard();
  initAdmin();

  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if(e.target === m) m.classList.remove('open'); });
  });
});
