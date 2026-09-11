/* =====================================================================
   MASARU · ระบบรับซ่อมเครื่องมือช่าง — repair-print.js
   เอกสารสำหรับพิมพ์: ใบรับเครื่อง · ใบส่งมอบ · ใบขอจัดซื้ออะไหล่
   ⚠️ โหลดก่อน repair.html ส่วน <script> หลัก · ห้ามใส่ type="module"
      (ระบบเรียกฟังก์ชันผ่าน onclick= จึงต้องอยู่ใน global scope)
   ===================================================================== */

/* =====================================================================
   เอกสารสำหรับพิมพ์ — SOP แบบฟอร์ม #5 ใบปิดงาน/ใบส่งมอบสินค้า
   2 แบบ: ใบรับเครื่อง (ตอนรับ) · ใบส่งมอบ (ตอนปิดงาน)
   ===================================================================== */
function printJob(kind){
  const j = S.job;
  if (!j) return;
  const deliver = kind === 'delivery';
  const w  = WARRANTY[j.warranty_case] || WARRANTY.unknown;
  const pc = S.lines.reduce((s,l) => s + Number(l.line_total||0), 0);
  const total = pc + (Number(j.labor_cost)||0) - (Number(j.discount)||0);
  const now = new Date().toLocaleString('th-TH',{ day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });

  const row = (k,v) => `<div class="prow"><span class="k">${k}</span><span class="v">${esc(v ?? '—')}</span></div>`;
  const photos = ph => S.photos.filter(x => x.phase === ph).slice(0,4)
    .map(p => `<img src="${photoUrl(p.storage_key)}" alt="">`).join('');

  const before = photos('before'), after = photos('after');

  $('printArea').innerHTML = `
  <div class="pdoc">
    <div class="phdr">
      <div class="co">
        <b>${esc(COMPANY.brand)}</b>
        <div class="s">${esc(COMPANY.name)}</div>
        <div class="s">${esc(COMPANY.sub)}</div>
        <div class="a">${esc(COMPANY.addr)}<br>โทร ${esc(COMPANY.phone)} · เลขผู้เสียภาษี ${esc(COMPANY.taxid)}</div>
      </div>
      <div class="rt">
        <div class="t">${deliver ? 'ใบส่งมอบสินค้า / ปิดงานซ่อม' : 'ใบรับเครื่องเข้าซ่อม'}</div>
        <div class="no">${esc(j.job_no)}</div>
        <div class="d">พิมพ์เมื่อ ${now}</div>
        <div class="d">สถานะ: <b>${esc(STATUS[j.status] || j.status)}</b></div>
      </div>
    </div>

    <div class="p2">
      <div class="pbox"><div class="h">ข้อมูลลูกค้า</div><div class="b">
        ${row('ชื่อลูกค้า', j.customer_name)}
        ${row('เบอร์โทร', j.customer_phone)}
        ${row('เลข Order', j.order_no)}
        ${row('ช่องทางที่ซื้อ', j.platform)}
      </div></div>
      <div class="pbox"><div class="h">ข้อมูลเครื่องมือ</div><div class="b">
        ${row('ประเภทเครื่อง', j.tool_type)}
        ${row('แบรนด์ / รุ่น', [j.brand,j.model].filter(Boolean).join(' '))}
        ${row('Serial No.', j.serial_no)}
        ${row('ของที่นำมาด้วย', j.accessories)}
      </div></div>
    </div>

    <div class="p2">
      <div class="pbox"><div class="h">กำหนดการ</div><div class="b">
        ${row('วันที่รับเครื่อง', dth(j.received_at))}
        ${row('กำหนดเสร็จ', dth(j.due_date))}
        ${deliver ? row('วันที่ส่งมอบ', j.delivered_at ? dth(j.delivered_at) : '—') : ''}
        ${row('ช่างผู้รับผิดชอบ', j.tech_name)}
      </div></div>
      <div class="pbox"><div class="h">เลขพัสดุอ้างอิง</div><div class="b">
        ${row('พัสดุขาเข้า', j.tracking_in)}
        ${row('พัสดุขาออก', j.tracking_out)}
        ${row('ประเภทเคส', CASE_TYPE[j.case_type])}
        ${j.old_unit_disposition ? row('เครื่องเดิม', DISPOSITION[j.old_unit_disposition]) : ''}
      </div></div>
    </div>

    <div class="pwar">
      <b>เงื่อนไขการรับผิดชอบค่าใช้จ่าย — ${esc(w.l)}</b><br>
      ค่าขนส่ง: <b>${esc(w.ship)}</b> &nbsp;·&nbsp; ค่าอะไหล่: <b>${esc(w.parts)}</b>
      &nbsp;·&nbsp; ค่าแรง: <b>${esc(w.labor)}</b>
    </div>

    <div class="pbox"><div class="h">อาการเสียที่ลูกค้าแจ้ง</div>
      <div class="b"><div class="pfree">${esc(j.symptom || '—')}</div></div></div>

    ${deliver ? `
    <div class="pbox"><div class="h">ผลการตรวจเช็คและการซ่อม</div><div class="b">
      <div style="font-size:11px;color:#555;margin-bottom:3px">อาการที่พบ</div>
      <div class="pfree">${esc(j.inspect_result || '—')}</div>
      <div style="font-size:11px;color:#555;margin:7px 0 3px">วิธีการซ่อม</div>
      <div class="pfree">${esc(j.repair_method || '—')}</div>
      <div style="font-size:11px;color:#555;margin:7px 0 3px">ผลการทดสอบ</div>
      <div class="pfree">${esc(j.note || '—')}</div>
    </div></div>

    <div class="pbox"><div class="h">รายการอะไหล่ที่ใช้</div><div class="b">
      <table class="ptab">
        <thead><tr><th style="width:26mm">PART NO.</th><th>รายการ</th>
          <th class="n" style="width:16mm">จำนวน</th><th class="n" style="width:24mm">ราคา</th></tr></thead>
        <tbody>${S.lines.length ? S.lines.map(l => `<tr>
          <td>${esc(l.parts_master?.part_no||'')}</td><td>${esc(l.parts_master?.name||'')}</td>
          <td class="n">${l.qty}</td><td class="n">${money2(l.line_total)}</td></tr>`).join('')
          : '<tr><td colspan="4" style="text-align:center;color:#777">ไม่ได้ใช้อะไหล่</td></tr>'}</tbody>
      </table>
      <div class="psum">
        <div class="r"><span>ค่าอะไหล่</span><span>${money2(pc)}</span></div>
        <div class="r"><span>ค่าแรง</span><span>${money2(j.labor_cost)}</span></div>
        ${Number(j.discount) ? `<div class="r"><span>ส่วนลด</span><span>−${money2(j.discount)}</span></div>` : ''}
        <div class="r t"><span>รวมทั้งสิ้น</span><span>฿${money2(total)}</span></div>
      </div>
    </div></div>` : ''}

    ${before || (deliver && after) ? `
    <div class="pbox"><div class="h">ภาพประกอบ</div><div class="b">
      ${before ? `<div style="font-size:11px;color:#555;margin-bottom:4px">ก่อนซ่อม</div>
        <div class="pph">${before}</div>` : ''}
      ${deliver && after ? `<div style="font-size:11px;color:#555;margin:8px 0 4px">หลังซ่อม</div>
        <div class="pph">${after}</div>` : ''}
    </div></div>` : ''}

    <div class="pnote">${esc(COMPANY.note)}</div>

    <div class="psign">
      <div class="s"><div class="l"></div>
        <div class="c">${deliver ? 'ผู้ส่งมอบ (เจ้าหน้าที่ศูนย์บริการ)' : 'ผู้รับเครื่อง (เจ้าหน้าที่ศูนย์บริการ)'}</div>
        <div class="c">วันที่ ......... / ......... / .........</div></div>
      <div class="s"><div class="l"></div>
        <div class="c">${deliver ? 'ผู้รับสินค้า (ลูกค้า)' : 'ผู้ส่งเครื่อง (ลูกค้า)'}</div>
        <div class="c">วันที่ ......... / ......... / .........</div></div>
    </div>

    <div class="pfoot">
      <div>${esc(COMPANY.name)} · เอกสารนี้ออกจากระบบรับซ่อมอัตโนมัติ · ผู้พิมพ์ ${esc(who())}</div>
      <div class="pqr" id="pqr"></div>
    </div>
  </div>`;

  const q = $('pqr');
  if (q && window.QRCode){
    q.innerHTML = '';
    new QRCode(q, { text: location.origin + location.pathname + '?job=' + j.id,
      width:64, height:64, correctLevel: QRCode.CorrectLevel.L });
  }
  setTimeout(() => window.print(), 350);   // รอ QR + รูปโหลด
}

/* ---------- ใบขอจัดซื้ออะไหล่ (SOP แบบฟอร์ม A11b.1) ---------- */
/* ---------- ใบขอจัดซื้อสำหรับพิมพ์ (SOP แบบฟอร์ม A11b.1) ---------- */
async function printPR(no){
  try {
    const [pr, lines] = await Promise.all([
      sb.from('v_purchase_requests').select('*').eq('pr_no', no).maybeSingle(),
      sb.from('v_pr_lines').select('*').eq('pr_no', no)
    ]);
    if (pr.error) throw pr.error;
    const p = pr.data, ls = lines.data || [];
    if (!p) return toast('ไม่พบใบขอจัดซื้อ ' + no, true);

    $('printArea').innerHTML = `
    <div class="pdoc">
      <div class="phdr">
        <div class="co"><b>${esc(COMPANY.brand)}</b>
          <div class="s">${esc(COMPANY.name)}</div>
          <div class="s">${esc(COMPANY.sub)}</div>
          <div class="a">${esc(COMPANY.addr)}<br>โทร ${esc(COMPANY.phone)}</div></div>
        <div class="rt"><div class="t">ใบขอจัดซื้ออะไหล่</div>
          <div class="no">${esc(p.pr_no)}</div>
          <div class="d">วันที่ ${esc(dth(p.pr_date))}</div>
          <div class="d">ผู้ขอ: ${esc(p.requested_by || '—')}</div></div>
      </div>
      <div class="pwar">อะไหล่ที่ขาดจากงานซ่อมของวันที่ <b>${esc(dth(p.pr_date))}</b>
        รวม <b>${ls.length}</b> รายการ · ขออนุมัติสั่งซื้อเพื่อให้งานซ่อมเดินต่อได้</div>
      <table class="ptab"><thead><tr>
        <th>PART NO.</th><th>รายการ</th><th class="n">จำนวน</th><th>หน่วย</th>
        <th class="n">ราคาทุน/หน่วย</th><th class="n">รวม</th><th>ใบงานที่รออยู่</th>
      </tr></thead><tbody>
        ${ls.map(l => `<tr><td>${esc(l.part_no)}</td><td>${esc(l.part_name)}</td>
          <td class="n">${l.qty}</td><td>${esc(l.unit||'')}</td>
          <td class="n">฿${money2(l.unit_cost)}</td><td class="n">฿${money2(l.line_total)}</td>
          <td style="font-size:10px">${esc(l.job_refs||'—')}</td></tr>`).join('')}
        <tr><td colspan="5" style="text-align:right"><b>รวมทั้งใบ</b></td>
          <td class="n"><b>฿${money2(p.total_cost)}</b></td><td></td></tr>
      </tbody></table>
      ${p.note ? `<div class="pbox" style="margin-top:9px"><div class="h">หมายเหตุ</div>
        <div class="b" style="white-space:pre-wrap;font-size:12px">${esc(p.note)}</div></div>` : ''}
      <div class="psign" style="grid-template-columns:1fr 1fr 1fr;gap:18px">
        <div class="s"><div class="l"></div><div class="c">ผู้ขอซื้อ · ศูนย์บริการ<br>${esc(p.requested_by||'')}</div></div>
        <div class="s"><div class="l"></div><div class="c">หัวหน้าศูนย์บริการ<br>วันที่ ______________</div></div>
        <div class="s"><div class="l"></div><div class="c">ผู้อนุมัติ · CEO<br>วันที่ ______________</div></div>
      </div>
      <div class="pnote">${esc(COMPANY.note)}</div>
    </div>`;
    window.print();
  } catch(e){ fail(e); }
}
