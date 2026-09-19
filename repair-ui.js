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
  { k:'document',     label:'เอกสาร',       max:4 },
  { k:'ship_receipt', label:'ใบเสร็จค่าส่ง', max:3 }
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

/** ดูว่าคอลัมน์นั้น "หน้าตาข้อมูล" เป็นแบบไหน — ใช้ตอนชีทไม่มีหัวตารางให้เดา
    คืนอาร์เรย์ตามลำดับคอลัมน์ แต่ละตัวบอกสัดส่วน 0-1 ว่าเป็นไทย / ตัวเลข / รหัส */
function profileColumns(rows, cols){
  const out = [];
  for (let j = 0; j < cols; j++){
    const vals = [];
    for (let i = 0; i < rows.length && vals.length < 30; i++){
      const v = cleanCell(rows[i][j]);
      if (v) vals.push(v);
    }
    if (!vals.length){ out.push(null); continue; }
    const pct = f => vals.filter(f).length / vals.length;
    out.push({
      j,
      n:    vals.length,
      thai: pct(v => /[฀-๿]/.test(v)),
      num:  pct(v => /^[\d.,\s฿+\-]+$/.test(v)),
      code: pct(v => /^[A-Za-z][A-Za-z0-9\-\/*.\s]*$/.test(v) && /\d/.test(v))
    });
  }
  return out;
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



/* =====================================================================
   คลังของฉัน — โมดูลใช้ร่วม (ช่าง = REPAIR · ขาย = SALES)
   ---------------------------------------------------------------------
   แต่ละฝ่ายเบิกของชุดใหญ่จากคลังกลาง แล้วมาบริหารสต๊อกตัวเองต่อ
     ทำใบเบิก  → คลังกลางอนุมัติ+จ่าย → ฝ่ายกดรับเข้า → ยอดขึ้นคลังตัวเอง
     ตรวจนับ   → ปรับยอดของตัวเองได้ ระบบคิดส่วนต่างให้
     คืนของ    → ตัดของออกจากคลังตัวเองทันที คลังกลางกดรับ
   หน้าจอเดียว 2 โมดูลใช้ร่วมกัน จึงห้ามอ้างชื่อฟังก์ชันของโมดูลใดโมดูลหนึ่ง
   ===================================================================== */
const MYWH = {
  wh:'REPAIR', label:'คลังอะไหล่ช่าง', mount:'whRoot',
  all:[], docs:[], tab:'stock', q:'', lowOnly:false, loaded:false,
  /* ตะกร้าใบเบิก/ใบคืน — เก็บไว้ในหน้าเลย ไม่ใช้ป๊อบอัพทีละบรรทัด
     เพราะคนเบิกต้องเห็นทั้งใบพร้อมกัน ถึงจะตรวจได้ว่าใส่ครบหรือซ้ำ */
  cart:[], cartKind:'req', team:'', note:'',
  teams:[], sheetUrl:'', sheetLabel:'ชีทรูป/รหัสอะไหล่'
};

const WH_ST = {
  requested:['st1','⏳ รออนุมัติ'], sent:['st3','🚚 จ่ายแล้ว รอรับ'],
  received:['tag-good','✅ รับเข้าแล้ว'], rejected:['tag-crit','✕ ไม่อนุมัติ'],
  cancelled:['st0','ยกเลิก'], draft:['st0','ร่าง']
};

function mywhSetup(cfg){ Object.assign(MYWH, cfg); }

/** ยอดในคลังตัวเอง — v_stock_all เก็บเป็นคอลัมน์ qty_main / qty_repair / qty_sales */
/* บรรทัดที่ยังไม่ได้เลือกอะไหล่จะส่ง undefined เข้ามา — ต้องไม่พัง */
const mywhQty  = r => r ? Number(r['qty_' + MYWH.wh.toLowerCase()]) || 0 : 0;
const mywhMain = r => r ? Number(r.qty_main) || 0 : 0;

async function mywhLoad(){
  try {
    const [all, docs, cfg] = await Promise.all([
      __pageAll(() => sb.from('v_stock_all').select('*')),
      sb.from('v_transfers').select('*')
        .or(`from_code.eq.${MYWH.wh},to_code.eq.${MYWH.wh}`).limit(300),
      sb.from('sys_config').select('key,value').in('key', ['req_teams','parts_sheet_url'])
    ]);
    if (docs.error) throw docs.error;
    MYWH.all    = all || [];
    MYWH.docs   = docs.data || [];
    /* 31_sales_req.sql ยังไม่รันก็ใช้ได้ แค่ไม่มีรายการทีมกับลิงก์ชีท */
    (cfg.data || []).forEach(r => {
      if (r.key === 'req_teams')       MYWH.teams = (r.value && r.value.list) || [];
      if (r.key === 'parts_sheet_url'){
        MYWH.sheetUrl   = (r.value && r.value.url)   || '';
        MYWH.sheetLabel = (r.value && r.value.label) || MYWH.sheetLabel;
      }
    });
    MYWH.loaded = true;
  } catch(e){
    // ยังไม่ได้รัน 22_requisition.sql → ยังดูยอดได้ แค่ทำใบเบิกไม่ได้
    if (/does not exist|schema cache|column/i.test(e?.message || '')){
      MYWH.docs = null;
      try { MYWH.all = await __pageAll(() => sb.from('v_stock_all').select('*')); } catch(e2){}
      MYWH.loaded = true;
    } else fail(e);
  }
  mywhRender();
}

function mywhTab(t){ MYWH.tab = t; mywhRender(); }
function mywhFind(){ MYWH.q = val('mywhQ'); S.pg.mywh = 1; mywhRender(); }
function mywhLow(el){ MYWH.lowOnly = el.checked; S.pg.mywh = 1; mywhRender(); }

function mywhRender(){
  const root = $(MYWH.mount);
  if (!root) return;
  if (!MYWH.loaded) return root.innerHTML = '<div class="empty">กำลังโหลด…</div>';

  const mine   = MYWH.all.filter(r => mywhQty(r) !== 0);
  const low    = MYWH.all.filter(r => r.reorder_point > 0 && mywhQty(r) < r.reorder_point);
  const neg    = MYWH.all.filter(r => mywhQty(r) < 0);
  const docs   = MYWH.docs || [];
  const waitMe = docs.filter(d => d.status === 'sent' && d.to_code === MYWH.wh);
  const waitHQ = docs.filter(d => d.status === 'requested');

  root.innerHTML = `
    <div class="kpis">
      ${[['na','📦','อะไหล่ที่มีในคลัง', money(mine.length), 'รายการที่ยอดไม่เป็น 0'],
         [low.length ? 'nb' : 'nc','⚠️','ต่ำกว่าจุดสั่ง', money(low.length),
           low.length ? 'ควรทำใบเบิกเพิ่ม' : 'ยังพอใช้'],
         [waitMe.length ? 'ne' : 'nc','📥','ของรอรับเข้า', money(waitMe.length),
           waitMe.length ? 'คลังกลางจ่ายแล้ว กดรับได้เลย' : 'ไม่มีของค้างทาง'],
         [waitHQ.length ? 'nb' : 'nc','⏳','ใบเบิกรออนุมัติ', money(waitHQ.length),
           waitHQ.length ? 'รอคลังกลางอนุมัติ' : 'ไม่มีใบค้าง']
        ].map(([cl,e,l,n,u]) => `<div class="kpi ${cl}">
          <div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
          <div class="n">${n}</div><div class="sub2">${esc(u)}</div></div>`).join('')}
    </div>

    ${neg.length ? `<div class="box-crit" style="margin-bottom:14px">
      ⚠️ มี ${money(neg.length)} รายการที่ยอด<b>ติดลบ</b> —
      แปลว่าเบิกใช้ไปโดยไม่ได้รับเข้า ให้กด 🔢 ตรวจนับใส่ยอดจริง
      <div class="sub2" style="margin-top:4px">${neg.slice(0,6).map(r =>
        esc(r.part_no) + ' (' + mywhQty(r) + ')').join(' · ')}</div></div>` : ''}

    ${MYWH.docs === null ? `<div class="box-warn" style="margin-bottom:14px">
      ยังใช้ใบเบิก/ใบคืนไม่ได้ — ให้รัน <b class="mono">22_requisition.sql</b>
      ที่ Supabase → SQL Editor ก่อน (ตอนนี้ดูยอดคงเหลือได้อย่างเดียว)</div>` : ''}

    <div class="card"><h3>🏬 ${esc(MYWH.label)}<span class="sp"></span>
      ${MYWH.sheetUrl ? `<a class="btn sm" target="_blank" rel="noopener"
         href="${esc(MYWH.sheetUrl)}">📗 ${esc(MYWH.sheetLabel)}</a>` : ''}
      ${MYWH.docs !== null ? `
        <button class="btn p sm" onclick="mywhStart('req')">📝 ทำใบเบิก</button>
        <button class="btn sm" onclick="mywhStart('return')">↩️ คืนของกลับคลังกลาง</button>` : ''}
      ${isBoss() ? `<button class="btn ic" title="ตั้งค่าทีม / ลิงก์ชีท"
         onclick="mywhConfig()">⚙️</button>` : ''}
    </h3>
    <div class="cb">
      <div class="gtabs" style="margin-bottom:14px">
        <button class="gtab ${MYWH.tab==='stock'?'on':''}" onclick="mywhTab('stock')">
          📦 ยอดคงเหลือ</button>
        <button class="gtab ${MYWH.tab==='doc'?'on':''}" onclick="mywhTab('doc')">
          📄 ใบเบิก / ใบคืน ${docs.length ? '(' + money(docs.length) + ')' : ''}</button>
        ${MYWH.tab === 'cart' ? `<button class="gtab on">
          ${MYWH.cartKind === 'req' ? '📝 ใบเบิกที่กำลังทำ' : '↩️ ใบคืนที่กำลังทำ'}</button>` : ''}
      </div>
      ${MYWH.tab === 'cart' ? mywhCartHTML()
        : MYWH.tab === 'stock' ? mywhStockHTML() : mywhDocHTML()}
    </div></div>`;
}

function mywhStockHTML(){
  const q = (MYWH.q || '').toLowerCase();
  const rows = MYWH.all.filter(r => {
    if (MYWH.lowOnly){
      if (!(r.reorder_point > 0 && mywhQty(r) < r.reorder_point)) return false;
    } else if (mywhQty(r) === 0) return false;
    if (!q) return true;
    return [r.part_no, r.name, r.fits_models, r.category]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
  }).sort((a,b) => a.part_no.localeCompare(b.part_no, 'th'));

  const m = paginate(rows, 'mywh');
  const can = isBoss();

  return `<div class="search" style="margin-bottom:12px">
      <input type="text" id="mywhQ" placeholder="ค้นหารหัส ชื่อ หรือรุ่นที่ใช้ร่วม"
             value="${esc(MYWH.q)}" oninput="mywhFind()">
      <label style="display:flex;gap:6px;align-items:center;font-size:13px;white-space:nowrap">
        <input type="checkbox" ${MYWH.lowOnly?'checked':''} onchange="mywhLow(this)">
        เฉพาะที่ต่ำกว่าจุดสั่ง</label>
    </div>
    ${rows.length ? `<div class="tw"><table>
      <thead><tr><th>รหัส</th><th>ชื่ออะไหล่</th><th>ใส่รุ่นไหนได้</th>
        <th class="num">มีในคลังนี้</th><th class="num">จุดสั่ง</th>
        <th class="num">คลังกลางมี</th><th></th></tr></thead>
      <tbody>${m.slice.map(r => {
        const n = mywhQty(r), lo = r.reorder_point > 0 && n < r.reorder_point;
        return `<tr>
          <td><b class="mono">${esc(r.part_no)}</b></td>
          <td>${esc(r.name)}</td>
          <td class="sub2">${esc(r.fits_models || '—')}</td>
          <td class="num"><b style="color:${n < 0 ? 'var(--crit)' : lo ? 'var(--warn)' : 'inherit'}">
            ${money(n)}</b> <span class="sub2">${esc(r.unit || '')}</span></td>
          <td class="num sub2">${r.reorder_point > 0 ? money(r.reorder_point) : '—'}</td>
          <td class="num sub2">${money(mywhMain(r))}</td>
          <td class="num" style="white-space:nowrap">
            ${can ? `<button class="btn ic" title="ตรวจนับ / ปรับยอด"
                    onclick="mywhCount('${esc(r.part_no)}')">🔢</button>` : ''}
            ${MYWH.docs !== null ? `<button class="btn ic" title="เบิกตัวนี้เพิ่ม"
                    onclick="mywhStart('req','${esc(r.part_no)}')">📝</button>` : ''}
          </td></tr>`;
      }).join('')}</tbody></table></div>${pagerHTML(m, 'mywh')}`
      : `<div class="empty">${MYWH.lowOnly
          ? 'ไม่มีรายการที่ต่ำกว่าจุดสั่ง 👍'
          : 'ยังไม่มีของในคลังนี้ — กด "ทำใบเบิก" เพื่อขอของจากคลังกลาง'}</div>`}`;
}

function mywhDocHTML(){
  const q = (MYWH.q || '').toLowerCase();
  const all = MYWH.docs || [];
  const docs = q ? all.filter(d => [d.transfer_no, d.team, d.order_nos, d.req_by, d.note]
    .filter(Boolean).join(' ').toLowerCase().includes(q)) : all;
  if (!all.length) return '<div class="empty">ยังไม่มีใบเบิกหรือใบคืน</div>';
  return `<div class="search" style="margin-bottom:12px">
      <input type="text" id="mywhQ" placeholder="ค้นหา เลขใบ / ทีม / เลขออเดอร์ / คนเบิก"
             value="${esc(MYWH.q)}" oninput="mywhFind()">
    </div>
    ${docs.length ? '' : '<div class="empty">ไม่มีใบที่ตรงคำค้น</div>'}
    <div class="tw"><table>
    <thead><tr><th>เลขที่</th><th>ชนิด</th><th>ทีม</th><th>เลขออเดอร์</th>
      <th>จาก → ไป</th><th class="num">จำนวน</th>
      <th>สถานะ</th><th>ล่าสุด</th><th></th></tr></thead>
    <tbody>${docs.map(d => {
      const [cl, lb] = WH_ST[d.status] || ['st0', d.status];
      const mineIn   = d.to_code === MYWH.wh;
      return `<tr>
        <td><b class="mono">${esc(d.transfer_no)}</b>
          <div class="sub2">${esc(d.req_by || d.created_by || '')}</div></td>
        <td>${esc(d.kind_label || '')}</td>
        <td>${d.team ? `<span class="pill st2">${esc(d.team)}</span>` : '<span class="muted">—</span>'}</td>
        <td class="mono sub2" style="max-width:190px">${esc(d.order_nos || '—')}</td>
        <td class="sub2">${esc(d.from_name)} <b>→</b> ${esc(d.to_name)}
          ${d.note ? `<div class="sub2">${esc(d.note)}</div>` : ''}
          ${d.reject_reason ? `<div class="sub2" style="color:var(--crit)">
            เหตุผล: ${esc(d.reject_reason)}</div>` : ''}</td>
        <td class="num">${money(d.qty_total)} <span class="sub2">/ ${money(d.line_count)} รายการ</span></td>
        <td><span class="pill ${cl}">${esc(lb)}</span></td>
        <td class="sub2" style="white-space:nowrap">${esc(dtth(d.received_at || d.sent_at || d.created_at))}</td>
        <td class="num" style="white-space:nowrap">
          <button class="btn ic" title="ดูรายการ" onclick="mywhPeek('${esc(d.transfer_no)}')">👀</button>
          ${mineIn && d.status === 'sent'
            ? `<button class="btn sm g" onclick="mywhAct('${esc(d.transfer_no)}','receive')">📥 รับเข้า</button>` : ''}
          ${d.status === 'requested'
            ? `<button class="btn ic dn" title="ยกเลิกใบเบิก"
                       onclick="mywhAct('${esc(d.transfer_no)}','cancel')">✕</button>` : ''}
        </td></tr>`;
    }).join('')}</tbody></table></div>`;
}

/* ---------- ตัวเลือกอะไหล่ในฟอร์ม ---------- */
function mywhPartOptions(showMain){
  return MYWH.all
    .slice()
    .sort((a,b) => a.part_no.localeCompare(b.part_no, 'th'))
    .map(r => ({ v:r.part_no,
      t: r.part_no + ' · ' + (r.name || '') +
         (showMain ? '  (คลังกลางมี ' + money(mywhMain(r)) + ')'
                   : '  (มี ' + money(mywhQty(r)) + ')') }));
}

/* =====================================================================
   ใบเบิก / ใบคืน — ตะกร้าอยู่ในหน้า ไม่ใช่ป๊อบอัพทีละบรรทัด
     ป๊อบอัพแบบเดิมเห็นได้ทีละรายการ ตรวจว่าใส่ครบหรือซ้ำไม่ได้เลย
     แบบใหม่เห็นทั้งใบพร้อมกัน แก้บรรทัดไหนก็ได้ก่อนส่ง
   ===================================================================== */

/** เริ่มทำใบใหม่ — kind = 'req' (เบิก) | 'return' (คืน) */
function mywhStart(kind, preset){
  if (MYWH.docs === null) return toast('ยังไม่ได้รัน 22_requisition.sql', true);
  if (kind === 'return' && !isBoss())
    return toast('คืนของกลับคลังกลางได้เฉพาะหัวหน้าฝ่าย', true);

  /* กำลังทำใบอยู่แล้ว แล้วกดเบิกอะไหล่ตัวใหม่จากตาราง = ต่อบรรทัดให้เลย */
  const same = MYWH.tab === 'cart' && MYWH.cartKind === kind && MYWH.cart.length;
  if (!same){
    MYWH.cart = []; MYWH.cartKind = kind; MYWH.note = '';
    MYWH.team = MYWH.team || '';
  }
  MYWH.cart.push({ part_no: preset || '', qty:1, order_no:'' });
  MYWH.tab = 'cart';
  mywhRender();
}

function mywhAddLine(){ MYWH.cart.push({ part_no:'', qty:1, order_no:'' }); mywhRender(); }
function mywhDelLine(i){ MYWH.cart.splice(i, 1); mywhRender(); }

/** แก้ค่าในบรรทัด — ไม่ re-render เพื่อไม่ให้เคอร์เซอร์เด้งออกจากช่องที่พิมพ์อยู่ */
function mywhSetLine(i, key, v){
  if (!MYWH.cart[i]) return;
  MYWH.cart[i][key] = key === 'qty' ? Number(v) || 0 : v;
  if (key === 'part_no' || key === 'qty') mywhSyncWarn();
}
function mywhSetHead(key, v){ MYWH[key] = v; }

/** เตือนของไม่พอแบบสด ๆ โดยไม่วาดทั้งตารางใหม่ */
function mywhSyncWarn(){
  const box = $('mywhWarn');
  if (box) box.innerHTML = mywhWarnHTML();
  const sum = $('mywhSum');
  if (sum) sum.innerHTML = mywhSumHTML();
}

/** ของพอไหม — รวมทุกบรรทัดที่เป็นอะไหล่ตัวเดียวกัน (คนละออเดอร์ก็ตัดจากกองเดียวกัน) */
function mywhShortages(){
  const need = {}, out = [];
  MYWH.cart.forEach(c => { if (c.part_no) need[c.part_no] = (need[c.part_no] || 0) + (Number(c.qty) || 0); });
  Object.entries(need).forEach(([pn, q]) => {
    const r = MYWH.all.find(x => x.part_no === pn);
    const have = MYWH.cartKind === 'req' ? mywhMain(r) : mywhQty(r);
    if (q > have) out.push({ part_no:pn, need:q, have });
  });
  return out;
}

function mywhWarnHTML(){
  const sh = mywhShortages();
  if (!sh.length) return '';
  const where = MYWH.cartKind === 'req' ? 'คลังกลาง' : 'คลังนี้';
  return `<div class="box-${MYWH.cartKind === 'req' ? 'warn' : 'crit'}" style="margin-bottom:12px">
    ⚠️ <b>${where}มีของไม่พอ ${sh.length} รายการ</b>
    <div class="sub2" style="margin-top:4px">${sh.map(s =>
      `${esc(s.part_no)} — ขอ ${money(s.need)} มี ${money(s.have)}`).join(' · ')}</div>
    <div class="sub2" style="margin-top:4px">${MYWH.cartKind === 'req'
      ? 'ส่งใบได้ แต่คลังกลางอาจไม่อนุมัติบรรทัดที่ของไม่พอ'
      : 'คืนเกินที่มีไม่ได้ ต้องแก้จำนวนก่อน'}</div></div>`;
}

function mywhSumHTML(){
  const lines = MYWH.cart.filter(c => c.part_no && Number(c.qty) > 0);
  const qty   = lines.reduce((s,c) => s + Number(c.qty), 0);
  const orders = [...new Set(lines.map(c => (c.order_no || '').trim()).filter(Boolean))];
  return `รวม <b>${money(lines.length)}</b> บรรทัด · <b>${money(qty)}</b> ชิ้น`
    + (orders.length ? ` · <b>${money(orders.length)}</b> ออเดอร์` : '')
    + (MYWH.cartKind === 'req' && lines.some(c => !(c.order_no || '').trim())
        ? ' · <span style="color:var(--crit)">ยังมีบรรทัดที่ไม่ได้ใส่เลขออเดอร์</span>' : '');
}

/** ฟอร์มใบเบิก/ใบคืนทั้งใบ */
function mywhCartHTML(){
  const isReq = MYWH.cartKind === 'req';
  const needOrder = isReq && MYWH.wh === 'SALES';   // ฝ่ายขายต้องระบุออเดอร์เสมอ
  const opts = mywhPartOptions(isReq);
  const teamOpts = MYWH.teams.length
    ? MYWH.teams.map(t => `<option value="${esc(t)}" ${t === MYWH.team ? 'selected' : ''}>${esc(t)}</option>`).join('')
    : '';

  return `
  <div class="box-info" style="margin-bottom:13px;font-size:12.5px">
    ${isReq
      ? 'ใส่ให้ครบทั้งใบก่อน แล้วค่อยกดส่ง — คลังกลางอนุมัติแล้วของถึงจะถูกตัด'
      : 'ของจะถูกตัดออกจากคลังนี้ทันทีที่ส่งใบ คลังกลางกดรับเมื่อของไปถึง'}
    ${MYWH.sheetUrl ? ` · ไม่แน่ใจว่าอะไหล่หน้าตายังไง เปิด
      <a href="${esc(MYWH.sheetUrl)}" target="_blank" rel="noopener"><b>📗 ${esc(MYWH.sheetLabel)}</b></a>` : ''}
  </div>

  <div class="grid g2" style="margin-bottom:13px">
    <div><label>ทีมที่เบิก ${needOrder ? '<span class="req">*</span>' : ''}</label>
      ${MYWH.teams.length
        ? `<select id="mywhTeam" onchange="mywhSetHead('team', this.value)">
             <option value="">— เลือกทีม —</option>${teamOpts}</select>`
        : `<input type="text" id="mywhTeam" value="${esc(MYWH.team)}"
             placeholder="เช่น TikTok / Shopee" oninput="mywhSetHead('team', this.value)">
           <span class="hint">รัน 31_sales_req.sql แล้วจะมีรายการให้เลือก</span>`}
    </div>
    <div><label>${isReq ? 'เบิกไปทำอะไร' : 'คืนเพราะอะไร'}</label>
      <input type="text" id="mywhNote" value="${esc(MYWH.note)}"
        oninput="mywhSetHead('note', this.value)"
        placeholder="${isReq ? 'เช่น เติมของประจำสัปดาห์' : 'เช่น เบิกมาเกิน / ใช้ไม่ตรงรุ่น'}"></div>
  </div>

  <div id="mywhWarn">${mywhWarnHTML()}</div>

  <div class="tw"><table>
    <thead><tr><th style="min-width:230px">อะไหล่</th><th class="num" style="width:110px">จำนวน</th>
      <th style="width:190px">เลขออเดอร์${needOrder ? ' <span class="req">*</span>' : ''}</th>
      <th class="num" style="width:56px"></th></tr></thead>
    <tbody>${MYWH.cart.map((c, i) => {
      const r = MYWH.all.find(x => x.part_no === c.part_no);
      const have = isReq ? mywhMain(r) : mywhQty(r);
      return `<tr>
        <td><select onchange="mywhSetLine(${i},'part_no',this.value)">
            <option value="">— เลือกอะไหล่ —</option>
            ${opts.map(o => `<option value="${esc(o.v)}" ${o.v === c.part_no ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}
          </select>
          ${c.part_no ? `<div class="sub2">${isReq ? 'คลังกลางมี' : 'ในคลังนี้มี'} ${money(have)}</div>` : ''}</td>
        <td class="num"><input type="number" min="1" value="${Number(c.qty) || 1}"
            oninput="mywhSetLine(${i},'qty',this.value)" style="text-align:right"></td>
        <td><input type="text" value="${esc(c.order_no || '')}"
            oninput="mywhSetLine(${i},'order_no',this.value)"
            placeholder="${needOrder ? 'เช่น 2609110XXXX' : 'ถ้ามี'}"></td>
        <td class="num"><button class="btn ic dn" title="ลบบรรทัดนี้"
            onclick="mywhDelLine(${i})">✕</button></td></tr>`;
    }).join('')}</tbody></table></div>

  <div style="margin-top:11px;display:flex;gap:9px;flex-wrap:wrap;align-items:center">
    <button class="btn" onclick="mywhAddLine()">＋ เพิ่มบรรทัด</button>
    <span class="sp" style="flex:1"></span>
    <span class="sub2" id="mywhSum">${mywhSumHTML()}</span>
  </div>

  <div style="margin-top:14px;display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end">
    <button class="btn" onclick="mywhCancelCart()">ยกเลิกทั้งใบ</button>
    <button class="btn ${isReq ? 'p' : 'dn'}" onclick="mywhSubmit()">
      ${isReq ? '📤 ส่งใบเบิก' : '↩️ ส่งใบคืน'}</button>
  </div>`;
}

async function mywhCancelCart(){
  if (MYWH.cart.some(c => c.part_no) &&
      !await confirmModal('ทิ้งใบที่กำลังทำ?', 'รายการที่ใส่ไว้จะหายทั้งหมด', { ok:'ทิ้งเลย', danger:true }))
    return;
  MYWH.cart = []; MYWH.tab = 'stock'; mywhRender();
}

async function mywhSubmit(){
  const isReq = MYWH.cartKind === 'req';
  const needOrder = isReq && MYWH.wh === 'SALES';
  const lines = MYWH.cart.filter(c => c.part_no && Number(c.qty) > 0);

  if (!lines.length) return toast('ยังไม่มีรายการในใบนี้', true);
  const dupKey = c => c.part_no + '|' + (c.order_no || '').trim();
  const seen = new Set(), dup = [];
  lines.forEach(c => { const k = dupKey(c); if (seen.has(k)) dup.push(c.part_no); seen.add(k); });
  if (dup.length) return toast('มีบรรทัดซ้ำ (อะไหล่+ออเดอร์เดียวกัน): ' + [...new Set(dup)].join(', ')
    + ' — รวมเป็นบรรทัดเดียวก่อน', true);

  if (needOrder && !MYWH.team) return toast('เลือกทีมที่เบิกก่อน', true);
  if (needOrder && lines.some(c => !(c.order_no || '').trim()))
    return toast('ฝ่ายขายต้องใส่เลขออเดอร์ทุกบรรทัด — ระบบนี้มีไว้ตามว่าอะไหล่ไปออเดอร์ไหน', true);

  const short = mywhShortages();
  if (!isReq && short.length)
    return toast('คืนเกินที่มีในคลังไม่ได้: ' + short.map(s => s.part_no).join(', '), true);

  const qty = lines.reduce((s,c) => s + Number(c.qty), 0);
  const body = lines.map(c => `• ${c.part_no} × ${c.qty}`
      + (c.order_no ? '  → ' + c.order_no : '')).join('\n');
  const ok = await confirmModal(isReq ? 'ยืนยันส่งใบเบิก' : 'ยืนยันคืนของ',
    (isReq ? `ขอเบิกเข้า ${MYWH.label}` : `คืนจาก ${MYWH.label} → คลังกลาง`)
    + (MYWH.team ? `\nทีม: ${MYWH.team}` : '')
    + `\n${lines.length} บรรทัด · รวม ${money(qty)} ชิ้น\n\n${body}\n\n`
    + (isReq ? 'ส่งแล้วรอคลังกลางอนุมัติ ของยังไม่ถูกตัดตอนนี้'
             : 'กดยืนยันแล้วของจะออกจากคลังนี้ทันที ยกเลิกไม่ได้')
    + (isReq && short.length ? '\n\n⚠️ มีบรรทัดที่คลังกลางของไม่พอ อาจถูกปฏิเสธ' : ''),
    { ok: isReq ? 'ส่งใบเบิก' : 'คืนของเลย', danger: !isReq });
  if (!ok) return;

  const payload = lines.map(c => ({
    part_no: c.part_no, qty: Number(c.qty),
    order_no: (c.order_no || '').trim() || null
  }));

  try {
    let res;
    if (isReq){
      res = await sb.rpc('create_request', {
        p_to:MYWH.wh, p_lines:payload, p_note:MYWH.note || null,
        p_by:who(), p_from:'MAIN', p_team:MYWH.team || null });
      /* ยังไม่ได้รัน 31 → ฟังก์ชันเก่าไม่มี p_team ลองใหม่แบบไม่มีทีม */
      if (res.error && /p_team|order_no|function/i.test(res.error.message || '')){
        toast('⚠️ ยังไม่ได้รัน 31_sales_req.sql — ส่งใบโดยไม่มีทีม/เลขออเดอร์', true);
        res = await sb.rpc('create_request', {
          p_to:MYWH.wh, p_lines:payload.map(l => ({ part_no:l.part_no, qty:l.qty })),
          p_note:MYWH.note || null, p_by:who() });
      }
    } else {
      res = await sb.rpc('create_return', {
        p_from:MYWH.wh, p_lines:payload, p_note:MYWH.note || null, p_by:who() });
    }
    if (res.error) throw res.error;
    toast(isReq ? '✅ ส่งใบเบิก ' + res.data + ' แล้ว — รอคลังกลางอนุมัติ'
                : '✅ ส่งใบคืน ' + res.data + ' แล้ว — ของออกจากคลังนี้ รอคลังกลางรับ');
    MYWH.cart = []; MYWH.note = ''; MYWH.tab = 'doc';
    mywhLoad();
  } catch(e){ fail(e); }
}

/* ---------- ตั้งค่าทีม + ลิงก์ชีท (หัวหน้าเท่านั้น) ---------- */
async function mywhConfig(){
  if (!isBoss()) return toast('แก้ค่าตั้งได้เฉพาะหัวหน้าฝ่าย', true);
  const f = await formModal({
    title:'⚙️ ตั้งค่าใบเบิก',
    subtitle:'ลิงก์ชีทจะโผล่ให้คนเบิกกดดูตอนทำใบ · รายชื่อทีมใช้ในช่อง "ทีมที่เบิก"',
    ok:'บันทึก',
    fields:[
      { k:'url',   label:'ลิงก์ชีทรูป/รหัสอะไหล่', value:MYWH.sheetUrl,
        placeholder:'https://docs.google.com/spreadsheets/…',
        hint:'เว้นว่าง = ไม่โชว์ปุ่ม' },
      { k:'label', label:'ชื่อที่ขึ้นบนปุ่ม', value:MYWH.sheetLabel, half:true },
      { k:'teams', label:'รายชื่อทีม (บรรทัดละทีม)', type:'textarea',
        value:MYWH.teams.join('\n'), placeholder:'TikTok\nShopee\nLazada' }
    ]});
  if (!f) return;
  const teams = (f.teams || '').split('\n').map(s => s.trim()).filter(Boolean);
  try {
    const { error } = await sb.from('sys_config').upsert([
      { key:'parts_sheet_url', value:{ url:(f.url || '').trim(), label:(f.label || '').trim() || 'ชีทรูป/รหัสอะไหล่' },
        updated_by:who(), updated_at:new Date().toISOString() },
      { key:'req_teams', value:{ list:teams },
        updated_by:who(), updated_at:new Date().toISOString() }
    ], { onConflict:'key' });
    if (error) throw error;
    toast('✅ บันทึกค่าตั้งแล้ว');
    mywhLoad();
  } catch(e){ fail(e); }
}

/* ---------- ตรวจนับ ---------- */
async function mywhCount(partNo){
  if (!isBoss()) return toast('ปรับยอดได้เฉพาะหัวหน้าฝ่าย', true);
  const r = MYWH.all.find(x => x.part_no === partNo);
  if (!r) return;
  const have = mywhQty(r);

  const f = await formModal({
    title:'🔢 ตรวจนับ / ปรับยอด',
    subtitle:`${partNo} · ${r.name || ''} — ในระบบตอนนี้ ${money(have)} ${r.unit || ''}`,
    ok:'ปรับยอดตามที่นับได้',
    fields:[
      { k:'qty',  label:'นับได้จริงกี่ชิ้น', type:'number', required:true, min:0, value:have,
        hint:'ใส่ยอดจริงที่นับได้ ไม่ใช่ส่วนต่าง — ระบบคิดให้เอง' },
      { k:'note', label:'หมายเหตุ', placeholder:'เช่น นับรอบสิ้นเดือน' }
    ]});
  if (!f) return;

  try {
    const { data, error } = await sb.rpc('stock_count', {
      p_part_no:partNo, p_wh_code:MYWH.wh, p_counted:Number(f.qty),
      p_note:f.note || null, p_by:who() });
    if (error) throw error;
    const d = Number(data) || 0;
    toast(d === 0 ? '✅ ยอดตรงกับระบบอยู่แล้ว ไม่ได้ปรับอะไร'
                  : `✅ ปรับยอดแล้ว ${d > 0 ? 'ของเกิน +' : 'ของหาย '}${money(d)}`);
    mywhLoad();
  } catch(e){ fail(e); }
}

/* ---------- รับเข้า / ยกเลิก ---------- */
async function mywhAct(no, act){
  const label = act === 'receive'
    ? 'รับของเข้า ' + MYWH.label
    : 'ยกเลิกใบเบิกนี้ (ของยังไม่ถูกตัด)';
  const ok = await confirmModal('ยืนยัน', label + '\nเอกสาร ' + no,
    { ok:'ยืนยัน', danger: act === 'cancel' });
  if (!ok) return;
  try {
    const { error } = await sb.rpc(
      act === 'receive' ? 'transfer_receive' : 'transfer_cancel',
      { p_no:no, p_by:who() });
    if (error) throw error;
    toast('✅ ' + label + ' เรียบร้อย');
    mywhLoad();
  } catch(e){ fail(e); }
}

/* ---------- ดูรายการในเอกสาร ---------- */
async function mywhPeek(no){
  const d = (MYWH.docs || []).find(x => x.transfer_no === no);
  if (!d) return;
  try {
    const { data, error } = await sb.from('v_transfer_lines')
      .select('*').eq('transfer_id', d.id);
    if (error) throw error;
    const lines = data || [];
    const [, lb] = WH_ST[d.status] || ['', d.status];
    await infoModal(`${d.kind_label || 'เอกสาร'} ${no}`,
      `${d.from_name} → ${d.to_name} · ${lb}`,
      `${d.team ? `<div class="box-info" style="margin-bottom:11px">
          ทีมที่เบิก <b>${esc(d.team)}</b></div>` : ''}
      <div class="tw"><table>
        <thead><tr><th>อะไหล่</th><th class="num">จำนวน</th><th>เลขออเดอร์</th>
          <th class="num">ต้นทางมี</th></tr></thead>
        <tbody>${lines.length ? lines.map(l => `<tr>
          <td><b class="mono">${esc(l.part_no)}</b>
            <div class="sub2">${esc(l.part_name || '')}</div></td>
          <td class="num">${money(l.qty)} ${esc(l.unit || '')}</td>
          <td class="mono sub2">${esc(l.order_no || '—')}</td>
          <td class="num sub2">${money(l.from_qty)}</td></tr>`).join('')
          : '<tr><td colspan="4" class="empty">ไม่มีรายการ</td></tr>'}</tbody></table></div>
      ${d.reject_reason ? `<div class="box-crit" style="margin-top:12px">
        ไม่อนุมัติ: ${esc(d.reject_reason)}</div>` : ''}
      <div class="box-info" style="margin-top:12px;font-size:12.5px">
        ตั้งเรื่อง ${esc(dtth(d.req_at || d.created_at))} โดย ${esc(d.req_by || d.created_by || '—')}<br>
        ${d.sent_at ? (d.status === 'rejected' ? 'ไม่อนุมัติ ' : 'จ่ายของ ')
            + esc(dtth(d.sent_at)) + ' โดย ' + esc(d.sent_by || '—') + '<br>' : ''}
        ${d.received_at ? 'รับเข้า ' + esc(dtth(d.received_at)) + ' โดย ' + esc(d.received_by || '—') : ''}
      </div>`, { wide:false });
  } catch(e){ fail(e); }
}
