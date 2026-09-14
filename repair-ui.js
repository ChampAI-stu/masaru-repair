/* =====================================================================
   MASARU · ระบบรับซ่อมเครื่องมือช่าง — repair-ui.js
   เครื่องมือกลาง: helper · toast · หน้าต่างฟอร์ม · รูปภาพ · แบ่งหน้า · กราฟ SVG
   ⚠️ โหลดก่อน repair.html ส่วน <script> หลัก · ห้ามใส่ type="module"
      (ระบบเรียกฟังก์ชันผ่าน onclick= จึงต้องอยู่ใน global scope)
   ===================================================================== */

/* ---------------------------------------------------------------------
   กันมือลั่นในช่องตัวเลข
     1) ลูกศรขึ้น/ลง ถอดออกใน repair.css แล้ว
     2) สกอร์ลเมาส์ทับช่องที่ถูกโฟกัส = ค่าเปลี่ยนเงียบ ๆ อันตรายสุด
        → ปล่อยโฟกัสทิ้งทันที ค่าไม่เปลี่ยน และหน้ายังเลื่อนได้ปกติ
   ------------------------------------------------------------------ */
document.addEventListener('wheel', e => {
  const el = document.activeElement;
  if (el && el.tagName === 'INPUT' && el.type === 'number' && el === e.target) el.blur();
}, { passive: true });

/* ---------- helper พื้นฐาน ---------- */
/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => (s ?? '').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const val = id => ($(id)?.value ?? '').trim();
const money = n => (Number(n)||0).toLocaleString('th-TH',{maximumFractionDigits:0});
const money2 = n => (Number(n)||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});
const dth = d => d ? new Date(d).toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'numeric'}) : '—';
const dtth = d => d ? new Date(d).toLocaleString('th-TH',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

function toast(m, err){
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const d = document.createElement('div');
  d.className = 'toast' + (err ? ' err' : ''); d.textContent = m;
  document.body.appendChild(d); setTimeout(() => d.remove(), err ? 5200 : 2600);
}
const fail = e => { console.error(e); toast('❌ ' + (e?.message || e), true); };

window.__pageAll = async function(build, size = 1000){
  let from = 0, out = [];
  for(;;){
    const { data, error } = await build().range(from, from + size - 1);
    if (error) throw error;
    out = out.concat(data || []);
    if (!data || data.length < size) return out;
    from += size;
  }
};

/* =====================================================================
   หน้าต่างฟอร์ม — ใช้แทน prompt() / confirm() ทั้งระบบ
   ===================================================================== */
let _fmDone = null;

function closeForm(v){
  $('fmask').classList.remove('on');
  document.body.style.overflow = '';
  const d = _fmDone; _fmDone = null;
  if (d) d(v);
}
$('fmX').onclick = () => closeForm(null);
$('fmCancel').onclick = () => closeForm(null);
$('fmask').onclick = e => { if (e.target === $('fmask')) closeForm(null); };

/**
 * fields: [{ k, label, type, value, placeholder, hint, options, list, required, half, min, upper }]
 * คืน object ค่าที่กรอก หรือ null ถ้ายกเลิก
 */
function formModal({ title, subtitle = '', fields = [], ok = 'บันทึก', danger = false }){
  $('fmTitle').textContent = title;
  $('fmSub').textContent = subtitle;
  $('fmSub').style.display = subtitle ? '' : 'none';
  $('fmOk').textContent = ok;
  $('fmOk').className = 'btn ' + (danger ? 'dn' : 'g');
  $('fmCancel').style.display = '';

  $('fmBody').innerHTML = fields.map(f => {
    const id = 'fm_' + f.k;
    const inner = f.type === 'select'
      ? `<select id="${id}">${(f.options||[]).map(o =>
          `<option value="${esc(o.v)}" ${String(o.v)===String(f.value??'')?'selected':''}>${esc(o.t)}</option>`).join('')}</select>`
      : f.type === 'textarea'
        ? `<textarea id="${id}" placeholder="${esc(f.placeholder||'')}">${esc(f.value??'')}</textarea>`
        : `<input type="${f.type||'text'}" id="${id}" value="${esc(f.value??'')}"
             placeholder="${esc(f.placeholder||'')}" ${f.min!==undefined?`min="${f.min}"`:''}
             ${f.list?`list="${id}_dl" autocomplete="off"`:''}
             ${f.upper?'style="text-transform:uppercase"':''}>`
          + (f.list ? `<datalist id="${id}_dl">${f.list.map(v => `<option value="${esc(v)}"></option>`).join('')}</datalist>` : '');
    return `<div class="f ${f.half?'half':''}" data-k="${f.k}">
      <label for="${id}">${esc(f.label)}${f.required?' <span class="req">*</span>':''}</label>
      ${inner}${f.hint?`<span class="hint">${esc(f.hint)}</span>`:''}
      <span class="err" hidden></span></div>`;
  }).join('');

  $('fmask').classList.add('on');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('fmBody').querySelector('input,select,textarea')?.focus(), 60);

  return new Promise(res => {
    _fmDone = res;
    $('fmForm').onsubmit = e => {
      e.preventDefault();
      const out = {}; let bad = null;
      for (const f of fields){
        const el = $('fm_' + f.k), wrap = el.closest('.f'), err = wrap.querySelector('.err');
        let v = (el.value ?? '').trim();
        if (f.upper) v = v.toUpperCase();
        wrap.classList.remove('bad'); err.hidden = true;
        if (f.required && !v){
          wrap.classList.add('bad'); err.textContent = 'จำเป็นต้องกรอก'; err.hidden = false;
          bad = bad || el; continue;
        }
        out[f.k] = f.type === 'number' ? (v === '' ? null : Number(v)) : (v || null);
      }
      if (bad) return bad.focus();
      closeForm(out);
    };
  });
}

/** กล่องยืนยัน — ใช้แทน confirm() */
function confirmModal(title, msg, { ok = 'ยืนยัน', danger = true } = {}){
  $('fmTitle').textContent = title;
  $('fmSub').style.display = 'none';
  $('fmOk').textContent = ok;
  $('fmOk').className = 'btn ' + (danger ? 'dn' : 'g');
  $('fmBody').outerHTML = `<div class="cmsg" id="fmBody">${esc(msg)}</div>`;
  $('fmask').classList.add('on');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('fmOk').focus(), 60);
  return new Promise(res => {
    _fmDone = v => res(v === true);
    $('fmForm').onsubmit = e => { e.preventDefault(); closeForm(true); };
  }).finally(() => {
    // คืน container กลับเป็น grid สำหรับฟอร์มครั้งถัดไป
    const b = $('fmBody');
    if (b && !b.classList.contains('fbody')) b.outerHTML = '<div class="fbody" id="fmBody"></div>';
  });
}

/**
 * หน้าต่างแสดงข้อมูลอย่างเดียว — ใช้ดูอะไรสักอย่างโดยไม่ต้องย้ายหน้า
 * html เป็น HTML ดิบ (ผู้เรียกต้อง esc เองแล้ว)
 */
function infoModal(title, subtitle, html, { ok = 'ปิด', wide = true } = {}){
  $('fmTitle').textContent = title;
  $('fmSub').textContent = subtitle || '';
  $('fmSub').style.display = subtitle ? '' : 'none';
  $('fmOk').textContent = ok;
  $('fmOk').className = 'btn g';
  $('fmCancel').style.display = 'none';
  $('fmBody').outerHTML = `<div class="cinfo" id="fmBody">${html}</div>`;
  $('fmask').classList.add('on');
  $('fmask').classList.toggle('wide', !!wide);
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('fmOk').focus(), 60);
  return new Promise(res => {
    _fmDone = () => res(true);
    $('fmForm').onsubmit = e => { e.preventDefault(); closeForm(true); };
  }).finally(() => {
    $('fmask').classList.remove('wide');
    $('fmCancel').style.display = '';
    const b = $('fmBody');
    if (b && !b.classList.contains('fbody')) b.outerHTML = '<div class="fbody" id="fmBody"></div>';
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('fmask').classList.contains('on')) closeForm(null);
});

/* =====================================================================
   รูปภาพ — บีบอัดในเบราว์เซอร์ แล้วส่งตรงเข้า Google Drive
   ไฟล์ไม่ผ่าน Supabase เลย ฐานข้อมูลเก็บแค่ storage_key
   ===================================================================== */
const PHASES = [
  { k:'before',   label:'ก่อนซ่อม',    max:6 },
  { k:'during',   label:'ระหว่างซ่อม',  max:6 },
  { k:'after',    label:'หลังซ่อม',     max:4 },
  { k:'document', label:'เอกสาร',      max:4 }
];
const photoUrl  = key => 'https://drive.google.com/thumbnail?id=' + key + '&sz=w600';
const photoOpen = key => 'https://drive.google.com/file/d/' + key + '/view';
const uploadOn  = () => !!UPLOAD_URL;

/** ย่อรูปเหลือด้านยาว 1280px คุณภาพ 0.72 — 3MB เหลือราว 80KB */
function compressImage(file, maxDim = 1280, quality = 0.72){
  return new Promise((res, rej) => {
    const rd = new FileReader(), img = new Image();
    rd.onerror = () => rej(new Error('อ่านไฟล์ไม่ได้'));
    rd.onload  = () => { img.src = rd.result; };
    img.onerror = () => rej(new Error('ไฟล์นี้ไม่ใช่รูปภาพ'));
    img.onload = () => {
      const sc = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * sc), h = Math.round(img.height * sc);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0,0,w,h);
      ctx.drawImage(img, 0, 0, w, h);
      res(c.toDataURL('image/jpeg', quality));
    };
    rd.readAsDataURL(file);
  });
}

/** ห้ามใส่ header Content-Type — จะโดน CORS preflight แล้ว Apps Script ตอบไม่ได้ */
async function driveCall(payload){
  const r = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: JSON.stringify({ token: UPLOAD_TOKEN, ...payload })
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'Google ตอบกลับผิดพลาด');
  return j;
}

async function uploadPhotos(files, jobId, jobNo, phase){
  if (!uploadOn()) { toast('ยังไม่ได้ตั้งค่า UPLOAD_URL', true); return 0; }
  let n = 0;
  for (const f of files){
    try {
      const data = await compressImage(f);
      const up = await driveCall({ action:'upload', jobNo, phase, mime:'image/jpeg', data });
      const { error } = await sb.from('repair_photos').insert({
        job_id: jobId, phase, provider:'gdrive',
        storage_key: up.fileId, bytes: up.bytes, created_by: who()
      });
      if (error) throw error;
      n++;
    } catch(e){ fail(e); }
  }
  return n;
}

async function deletePhoto(id, key){
  if (!await confirmModal('ลบรูปนี้?', 'ไฟล์จะถูกย้ายไปถังขยะใน Google Drive กู้คืนได้ภายใน 30 วัน', { ok:'ลบรูป' })) return;
  try {
    const { error } = await sb.from('repair_photos').delete().eq('id', id);
    if (error) throw error;
    if (uploadOn()) { try { await driveCall({ action:'delete', fileId:key }); } catch(e){ console.warn(e); } }
    toast('ลบรูปแล้ว');
    await openJob(S.job.id);
  } catch(e){ fail(e); }
}

/** เคลียร์รูปทั้งเคสที่ปิดงานแล้ว — ลบทั้งในฐานข้อมูลและใน Google Drive */
async function clearPhotos(){
  const j = S.job;
  if (!j) return;
  if (!CLOSED.includes(j.status)) return toast('เคลียร์รูปได้เฉพาะเคสที่ปิดงานแล้ว', true);

  const nPh = S.photos.length;
  if (!nPh) return toast('เคสนี้ไม่มีรูปแล้ว');
  if (!await confirmModal(`เคลียร์รูปทั้งหมด ${nPh} รูปของ ${j.job_no}?`,
      'ไฟล์จะถูกย้ายไปถังขยะใน Google Drive (กู้คืนได้ 30 วัน) และหายจากใบงานทันที\n'
    + 'ข้อมูลใบงาน อะไหล่ และยอดเงิน ยังอยู่ครบ ไม่ถูกลบ', { ok:'เคลียร์รูป' })) return;

  try {
    const { data: keys, error } = await sb.rpc('clear_job_photos', { p_job_id: j.id });
    if (error) throw error;
    let gone = 0;
    if (uploadOn()){
      for (const k of (keys || [])){
        try { await driveCall({ action:'delete', fileId:k }); gone++; }
        catch(e){ console.warn('ลบไฟล์ Drive ไม่สำเร็จ', k, e); }
      }
    }
    toast(`✅ เคลียร์แล้ว ${nPh} รูป · ลบไฟล์ใน Drive ${gone} ไฟล์`);
    await openJob(j.id); reloadAll();
  } catch(e){ fail(e); }
}

async function addPhotos(input, phase){
  const files = [...input.files];
  input.value = '';
  if (!files.length) return;
  toast(`⏳ กำลังอัปโหลด ${files.length} รูป…`);
  const n = await uploadPhotos(files, S.job.id, S.job.job_no, phase);
  if (n) toast(`✅ อัปโหลด ${n} รูปแล้ว`);
  await openJob(S.job.id);
}

/* -- รูปตอนรับเครื่อง: พักไว้ในหน่วยความจำก่อน แล้วอัปหลังสร้างใบงานเสร็จ -- */
let INTAKE_FILES = [];
function stageIntake(input){
  INTAKE_FILES = INTAKE_FILES.concat([...input.files]).slice(0,6);
  input.value = '';
  renderStaged();
}
function unstage(i){ INTAKE_FILES.splice(i,1); renderStaged(); }
function renderStaged(){
  const box = $('stagedBox');
  if (!box) return;
  box.innerHTML = INTAKE_FILES.map((f,i) =>
    `<div class="ph"><img src="${URL.createObjectURL(f)}" alt="รูปก่อนรับซ่อม ${i+1}">
     <button class="x" onclick="unstage(${i})" title="เอาออก">✕</button></div>`).join('')
    + (INTAKE_FILES.length < 6
      ? `<label class="ph add" title="เลือกรูป">＋<input type="file" accept="image/*" multiple hidden onchange="stageIntake(this)"></label>
         <label class="ph add" title="ถ่ายรูป" style="font-size:19px">📷<input type="file" accept="image/*" capture="environment" hidden onchange="stageIntake(this)"></label>` : '');
}

/* =====================================================================
   สิทธิ์เข้าโมดูล — ของกลาง ใช้ร่วมทุกโมดูล
   "โมดูลเป็นคนกำหนดว่า role ไหนเข้าได้" เก็บไว้ในตาราง module_access
   ===================================================================== */

/** เข้าโมดูลนี้ได้ไหม
    ถ้ายังไม่ได้รัน 20_access.sql จะปล่อยผ่าน — กันเคสอัปไฟล์เว็บก่อนรัน SQL
    แล้วล็อกคนทั้งบริษัทออกจากระบบ */
async function canModule(sb, key){
  try {
    const { data, error } = await sb.rpc('can_module', { p_module: key });
    if (error){
      if (/does not exist|not exist|schema cache/i.test(error.message || '')) return true;
      throw error;
    }
    return data !== false;
  } catch(e){
    console.warn('[สิทธิ์] เช็คสิทธิ์โมดูลไม่สำเร็จ — ปล่อยผ่านไว้ก่อน', e);
    return true;
  }
}

/** ไม่มีสิทธิ์ = ปิดทั้งหน้า ไม่ให้เห็นข้อมูลอะไรเลย */
function blockModule(name){
  document.title = 'ไม่มีสิทธิ์เข้าใช้งาน · MASARU';
  document.body.innerHTML = `<div class="gate">
    <div class="gbox" style="text-align:center">
      <div style="font-size:46px;line-height:1;margin-bottom:10px">🔒</div>
      <h3 style="color:var(--navy);margin:0 0 8px;font-size:19px">ไม่มีสิทธิ์เข้าโมดูลนี้</h3>
      <p style="color:var(--ink2);font-size:14px;line-height:1.7;margin:0 0 22px">
        บัญชีของคุณยังไม่ได้รับสิทธิ์เข้า <b>${esc(name)}</b><br>
        ขอสิทธิ์ได้ที่ผู้ดูแลระบบ
      </p>
      <a class="btn g" href="index.html"
         style="display:inline-block;text-decoration:none;padding:11px 24px">← กลับหน้าหลัก</a>
    </div></div>`;
}


/* =====================================================================
   อ่านไฟล์ตาราง (CSV / Excel) — ของกลาง ใช้ร่วมทุกโมดูลที่มีตัวนำเข้า
   อ่านในเบราว์เซอร์ทั้งหมด ไฟล์ไม่ถูกส่งขึ้นเซิร์ฟเวอร์
   ===================================================================== */

/** โหลดตัวอ่าน Excel เมื่อจำเป็นเท่านั้น หน้าปกติจะได้ไม่ต้องแบกไลบรารี */
function loadXLSX(){
  if (window.XLSX) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = () => res();
    s.onerror = () => rej(new Error('โหลดตัวอ่านไฟล์ Excel ไม่สำเร็จ — ตรวจอินเทอร์เน็ต หรือ Save As เป็น CSV แล้วลองใหม่'));
    document.head.appendChild(s);
  });
}

/** ไฟล์ไทยจาก JST มีทั้ง UTF-8 และ windows-874 ถ้าถอดผิดจะได้ภาษาต่างดาว */
function decodeText(buf){
  try { return new TextDecoder('utf-8', { fatal:true }).decode(buf); } catch(e){}
  for (const enc of ['windows-874','tis-620','utf-8']){
    try { return new TextDecoder(enc).decode(buf); } catch(e){}
  }
  return '';
}

/** แยก CSV เอง — รองรับเครื่องหมายคำพูด คอมมาในข้อความ และตัวคั่น , ; แท็บ | */
function parseCSV(text){
  text = text.replace(/^﻿/, '');
  const head = text.slice(0, 4000);
  const sep = [',', ';', '\t', '|'].reduce((b, c) =>
    (head.split(c).length > head.split(b).length ? c : b), ',');

  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++){
    const ch = text[i];
    if (q){
      if (ch === '"'){ if (text[i+1] === '"'){ cell += '"'; i++; } else q = false; }
      else cell += ch;
      continue;
    }
    if (ch === '"'){ q = true; continue; }
    if (ch === sep){ row.push(cell); cell = ''; continue; }
    if (ch === '\r') continue;
    if (ch === '\n'){ row.push(cell); rows.push(row); row = []; cell = ''; continue; }
    cell += ch;
  }
  if (cell !== '' || row.length){ row.push(cell); rows.push(row); }
  return rows;
}

/** ล้างค่าในเซลล์ — สูตรพังใน Excel (#REF! #N/A …) ต้องกลายเป็นช่องว่าง ไม่ใช่ข้อมูล */
function cleanCell(v){
  const s = (v ?? '').toString().trim();
  return /^#(REF|N\/A|VALUE|DIV\/0|NAME|NULL|NUM)\b/i.test(s) ? '' : s;
}

const cellCount = r => (r || []).filter(c => cleanCell(c) !== '').length;
const normKey   = s => (s ?? '').toString().toLowerCase().replace(/[\s_\-.()]/g, '');

/** แปลงข้อความเป็นตัวเลขแบบทนสกปรก — หยิบ "ตัวเลขก้อนแรก" ที่เจอ
    "1,180.50" → 1180.5 · "250.-" → 250 · "฿350" → 350 · "(500)" → -500 · "-" → 0
    "คู่ละ 150" → 150 · "ตัวข้างบน40 ข้างล่าง10บาท" → 40

    ทำไมต้องเอาก้อนแรก ไม่ใช่กวาดตัวเลขทั้งหมดมาต่อกัน
      ราคาในชีทจริงมีที่เขียนเป็นประโยค เช่น "ตัวข้างบน40 ข้างล่าง10บาท"
      ถ้ากวาดทั้งหมดจะได้ 4010 บาท — ผิดไป 100 เท่า */
function numOf(v){
  let s = (v ?? '').toString().trim();
  if (!s) return 0;
  const neg = /^-/.test(s) || /^\(.*\)$/.test(s);
  s = s.replace(/(?<=\d),(?=\d)/g, '');          // ตัดลูกน้ำคั่นหลักพัน
  const m = s.match(/\d+(?:\.\d+)?/);
  if (!m) return 0;
  const n = Number(m[0]);
  return Number.isFinite(n) ? (neg ? -n : n) : 0;
}

/** ราคาที่เขียนเป็นประโยค (มีทั้งตัวหนังสือไทยและตัวเลข) — ควรให้คนตรวจซ้ำ */
function priceLooksOdd(v){
  const s = (v ?? '').toString();
  return /[\u0E00-\u0E7F]/.test(s) && /\d/.test(s);
}

/** หัวตาราง = แถวที่มีเซลล์ไม่ว่างมากที่สุดใน 6 แถวแรก
    (บางชีทมีหัวเรื่องลอยอยู่แถว 1 หัวตารางจริงอยู่แถว 2) */
function guessHeaderRow(rows){
  let best = 0;
  for (let i = 0; i < Math.min(6, rows.length); i++)
    if (cellCount(rows[i]) > cellCount(rows[best])) best = i;
  return best;
}

/** เดาว่าคอลัมน์ไหนคือช่องอะไร — 1 คอลัมน์จับได้ช่องเดียว ห้ามซ้ำ
    fields: [{ k, hints:[...] }] · head: ชื่อคอลัมน์จากไฟล์ */
function guessMap(fields, head){
  const map = {}, used = new Set();
  const cols = head.map(normKey);
  fields.forEach(fd => {
    let best = -1, bestScore = 0;
    cols.forEach((c, i) => {
      if (!c || used.has(i)) return;
      let sc = 0;
      (fd.hints || []).forEach((h, hi) => {
        const hn = normKey(h);
        if (c === hn)            sc = Math.max(sc, 100 - hi);
        else if (c.includes(hn)) sc = Math.max(sc, 60 - hi);
      });
      if (sc > bestScore){ bestScore = sc; best = i; }
    });
    if (best >= 0){ map[fd.k] = best; used.add(best); }
    else map[fd.k] = -1;
  });
  return map;
}

/** ลายนิ้วมือของแถว — ใช้กันนำเข้าซ้ำเวลาอัปไฟล์เดิมอีกรอบ (FNV-1a) */
function rowHash(parts){
  const s = parts.map(v => (v ?? '').toString().trim()).join('|');
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16).padStart(8, '0') + '-' + s.length.toString(36);
}

/** วันที่ในชีทไทยมีทุกแบบ: 26/2/2026 · 9/14/2026 · 24/02/2569 · เลข serial ของ Excel
    คืน 'YYYY-MM-DD' หรือ null ถ้าอ่านไม่ออก — อ่านไม่ออกก็ยังนำเข้าได้ แค่ไม่มีวันที่
    dayFirst: true = อ่านแบบ วัน/เดือน/ปี (ค่าปกติของไทย) */
function dateOf(v, dayFirst = true){
  const raw = (v ?? '').toString().trim();
  if (!raw) return null;

  /* เลขล้วน 5 หลัก = serial ของ Excel (นับจาก 30/12/1899) */
  if (/^\d{5}$/.test(raw)){
    const d = new Date(Date.UTC(1899, 11, 30) + Number(raw) * 86400000);
    return d.toISOString().slice(0, 10);
  }

  const m = raw.match(/^(\d{1,4})[\/\-.](\d{1,2})[\/\-.](\d{1,4})$/);
  if (!m){
    const t = Date.parse(raw);
    return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
  }

  const a = Number(m[1]), b = Number(m[2]), c = Number(m[3]);
  const yearFirst = m[1].length === 4;

  let y = yearFirst ? a : c;
  if (y > 2400) y -= 543;                       // พ.ศ. → ค.ศ.
  if (y < 100)  y += 2000;

  let day, mon;
  if (yearFirst)      { mon = b; day = c; }
  else if (a > 12)    { day = a; mon = b; }
  else if (b > 12)    { day = b; mon = a; }
  else                { day = dayFirst ? a : b; mon = dayFirst ? b : a; }

  if (!(mon >= 1 && mon <= 12)) return null;
  if (!(day >= 1 && day <= 31)) return null;
  if (!(y >= 1990 && y <= 2100)) return null;
  return y + '-' + String(mon).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}


/* =====================================================================
   แบ่งหน้า — ใช้ร่วมกันทุกตาราง
   ===================================================================== */
function paginate(rows, key){
  const per = S.per || 30;
  const max = Math.max(1, Math.ceil(rows.length / per));
  S.pg[key] = Math.min(Math.max(1, S.pg[key] || 1), max);
  const p = S.pg[key], from = (p-1)*per;
  return { slice: rows.slice(from, from + per), total: rows.length, page: p, max, from, per };
}

function pagerHTML(m, key){
  if (!m.total) return '';
  const btn = (p, txt, dis, on) =>
    `<button class="pgbtn ${on?'on':''}" ${dis?'disabled':''} onclick="setPg('${key}',${p})">${txt}</button>`;
  let nums = '', prev = 0;
  const near = [1, m.max, m.page, m.page-1, m.page+1];
  for (let i = 1; i <= m.max; i++){
    if (!near.includes(i)) continue;
    if (i - prev > 1) nums += '<span class="pgdots">…</span>';
    nums += btn(i, i, false, i === m.page);
    prev = i;
  }
  return `<div class="pager">
    <span class="info">แสดง <b>${m.from + 1}–${Math.min(m.from + m.per, m.total)}</b> จาก <b>${m.total}</b> รายการ</span>
    ${m.max > 1 ? `<div class="pgbtns">
      ${btn(m.page-1, '‹ ก่อนหน้า', m.page === 1)}${nums}${btn(m.page+1, 'ถัดไป ›', m.page === m.max)}
    </div>` : ''}
    <label class="perpage">แสดงหน้าละ
      <select onchange="setPer(this.value)">
        ${[20,30,50,100].map(v => `<option value="${v}" ${v===(S.per||30)?'selected':''}>${v}</option>`).join('')}
      </select></label>
  </div>`;
}

/* ตารางไหนใช้แบ่งหน้า ให้ลงทะเบียนไว้ที่ window.PAGERS = { key: ฟังก์ชันวาดใหม่ }
   ไฟล์นี้ใช้ร่วมกันหลายโมดูล จึงห้ามอ้างชื่อฟังก์ชันของโมดูลใดโมดูลหนึ่งตรง ๆ */
const _pagers = () => window.PAGERS || {};

function setPg(key, p){
  S.pg[key] = p;
  const f = _pagers()[key];
  if (typeof f === 'function') f();
  window.scrollTo({ top:0, behavior:'smooth' });
}
function setPer(v){
  S.per = Number(v) || 30;
  try { localStorage.setItem('repair_per', S.per); } catch(e){}
  S.pg = {};
  Object.entries(_pagers()).forEach(([k, f]) => {
    S.pg[k] = 1;
    if (typeof f === 'function') f();
  });
}

/* =====================================================================
   กราฟ — วาดเป็น SVG เอง ไม่ต้องโหลดไลบรารี
   ===================================================================== */
/** ความกว้างจริงของกล่องที่จะใส่กราฟ — ให้ 1 หน่วยใน viewBox = 1 px พอดี
    ถ้าไม่ใส่ค่านี้ SVG จะยืดเต็มการ์ด แล้วตัวหนังสือในกราฟจะโตตามไป 2-3 เท่า */
function boxW(id, min = 300, max = 980){
  const el = typeof id === 'string' ? $(id) : id;
  const w = el ? Math.floor(el.getBoundingClientRect().width) : 0;
  return Math.max(min, Math.min(max, w || 640));
}

/** ครอบ SVG ให้ยืดลงได้ แต่ห้ามยืดขึ้นเกิน 1:1 */
const svgBox = (w, inner, label, minW) =>
  `<div class="tw"><svg viewBox="0 0 ${w} ${inner.h}" role="img" aria-label="${esc(label)}"
     style="display:block;margin:0 auto;width:100%;max-width:${w}px;height:auto${minW ? ';min-width:' + minW + 'px' : ''}">${inner.body}</svg></div>`;

function donutSVG(items, size = 190, thick = 32, centerLabel = 'งานค้าง'){
  const live = items.filter(i => i.value > 0);
  const total = live.reduce((s,i) => s + i.value, 0);
  const cx = size/2, cy = size/2, r = size/2 - thick/2;
  if (!total) return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="ยังไม่มีข้อมูล">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eaeff7" stroke-width="${thick}"/></svg>`;

  const gap = live.length > 1 ? 0.028 : 0;   // เว้นช่องระหว่างชิ้น
  let a = -Math.PI/2, paths = '';
  live.forEach(i => {
    const sweep = (i.value/total) * Math.PI*2;
    const a1 = a + gap/2, a2 = a + sweep - gap/2;
    if (a2 > a1){
      const large = (a2-a1) > Math.PI ? 1 : 0;
      paths += `<path d="M ${(cx+r*Math.cos(a1)).toFixed(2)} ${(cy+r*Math.sin(a1)).toFixed(2)} `
             + `A ${r} ${r} 0 ${large} 1 ${(cx+r*Math.cos(a2)).toFixed(2)} ${(cy+r*Math.sin(a2)).toFixed(2)}" `
             + `fill="none" stroke="${i.color}" stroke-width="${thick}"><title>${esc(i.label)}: ${i.value}</title></path>`;
    }
    a += sweep;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img"
      aria-label="สัดส่วนงานซ่อมแยกตามขั้นตอน รวม ${total} งาน">
    ${paths}
    <text x="${cx}" y="${cy-4}" text-anchor="middle" style="font:800 27px Sarabun;fill:var(--navy)">${total}</text>
    <text x="${cx}" y="${cy+16}" text-anchor="middle" style="font:600 12px Sarabun;fill:var(--ink3)">${esc(centerLabel)}</text>
  </svg>`;
}

function groupedBarSVG(cats, series, w = 560, h = 230){
  const pad = { l:36, r:12, t:26, b:34 };
  const iw = w - pad.l - pad.r, ih = h - pad.t - pad.b;
  const max = Math.max(1, ...series.flatMap(s => s.data));
  const ticks = 4, step = Math.ceil(max/ticks) || 1, top = step*ticks;
  const gw = iw / (cats.length || 1);
  const bw = Math.max(7, Math.min(20, (gw - 14) / series.length - 2));

  let g = '', bars = '', lbl = '';
  for (let t = 0; t <= ticks; t++){
    const y = pad.t + ih - (t*step/top)*ih;
    g += `<line class="gl" x1="${pad.l}" y1="${y.toFixed(1)}" x2="${w-pad.r}" y2="${y.toFixed(1)}"/>`
       + `<text class="ax" x="${pad.l-6}" y="${(y+4).toFixed(1)}" text-anchor="end">${t*step}</text>`;
  }
  cats.forEach((c,ci) => {
    const gx = pad.l + ci*gw;
    const grpW = series.length*(bw+2) - 2;
    series.forEach((s,si) => {
      const v = s.data[ci] || 0;
      const bh = (v/top)*ih;
      const x = gx + (gw-grpW)/2 + si*(bw+2);
      const y = pad.t + ih - bh;
      if (bh > 0){
        const rr = Math.min(4, bh);
        bars += `<path d="M ${x} ${pad.t+ih} V ${y+rr} q 0 -${rr} ${rr} -${rr} h ${bw-2*rr} q ${rr} 0 ${rr} ${rr} V ${pad.t+ih} Z"
                  fill="${s.color}"><title>${esc(c)} · ${esc(s.name)}: ${v}</title></path>`;
        if (v > 0) bars += `<text class="vl" x="${(x+bw/2).toFixed(1)}" y="${(y-4).toFixed(1)}" text-anchor="middle">${v}</text>`;
      }
    });
    lbl += `<text class="nm" x="${(gx+gw/2).toFixed(1)}" y="${h-12}" text-anchor="middle">${esc(c)}</text>`;
  });
  const legend = series.map(s =>
    `<span class="lgi" style="display:inline-flex;width:auto;margin-right:16px">
       <span class="sw" style="background:${s.color}"></span><span>${esc(s.name)}</span></span>`).join('');
  return `<div style="margin-bottom:8px">${legend}</div>`
    + svgBox(w, { h, body: g + bars + lbl },
        'กราฟแท่งเปรียบเทียบของแต่ละคน', Math.min(w, 380));
}

function hBarsSVG(items, w = 640){
  if (!items.length) return '<div class="empty">ยังไม่มีข้อมูล</div>';
  const rowH = 28;                                  // สูงคงที่ ไม่ผูกกับความกว้าง
  const lw   = Math.round(Math.min(190, Math.max(96, w * 0.26)));   // คอลัมน์ชื่อ
  const vw   = 74;                                  // คอลัมน์ตัวเลขขวา
  const h    = items.length*rowH + 6;
  const max  = Math.max(1, ...items.map(i => i.value));
  const bw   = Math.max(40, w - lw - vw);
  const clip = s => { s = String(s ?? ''); const n = Math.floor(lw / 7);
                      return s.length > n ? s.slice(0, n-1) + '…' : s; };
  const rows = items.map((it,i) => {
    const y = i*rowH + 5, len = Math.max(2, (it.value/max)*bw);
    return `<text class="nm" x="0" y="${y+14}">${esc(clip(it.label))}<title>${esc(it.label)}</title></text>
      <rect x="${lw}" y="${y+4}" width="${bw}" height="13" rx="4" fill="#eef2f8"/>
      <rect x="${lw}" y="${y+4}" width="${len.toFixed(1)}" height="13" rx="4" fill="${it.color || 'var(--blue)'}">
        <title>${esc(it.label)}: ${it.value}</title></rect>
      <text class="vl" x="${w-4}" y="${y+14}" text-anchor="end">${esc(it.sub ?? it.value)}</text>`;
  }).join('');
  return svgBox(w, { h, body: rows }, 'กราฟแท่งแนวนอน', Math.min(w, 340));
}
