<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>ระบบรับซ่อมเครื่องมือช่าง · MASARU</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<link rel="stylesheet" href="repair.css" onerror="window.__cssFail=1">
</head>
<body>

<!-- ============ หน้าล็อกอิน ============ -->
<div class="gate" id="gate">
  <div class="gbox">
    <div class="glogo"><div class="ic">🔧</div>
      <div><b>TOOL REPAIR</b><small>ระบบรับซ่อมเครื่องมือ · MASARU</small></div></div>
    <form id="loginForm" autocomplete="on">
      <div class="f"><label for="liEmail">อีเมล</label>
        <input type="email" id="liEmail" required autocomplete="username" placeholder="you@masaru.co.th"></div>
      <div class="f"><label for="liPass">รหัสผ่าน</label>
        <input type="password" id="liPass" required autocomplete="current-password" placeholder="••••••••"></div>
      <button class="btn g" id="liBtn" type="submit" style="width:100%;padding:12px;margin-top:4px">เข้าสู่ระบบ</button>
    </form>

    <div id="liErr" class="gerr" hidden></div>
    <div class="gfoot" id="gFoot">ยังไม่มีบัญชี —
      <a href="index.html" style="color:var(--blue);font-weight:600">สมัครที่หน้าหลักของระบบ</a></div>
  </div>
</div>

<div class="app" id="app" hidden>
  <aside id="side">
    <div class="logo">
      <div class="ic">🔧</div>
      <div><b>TOOL REPAIR</b><small>ระบบรับซ่อมเครื่องมือ · MASARU</small></div>
    </div>
    <div class="navlbl">เมนูหลัก</div>
    <nav>
      <button data-p="dash"   class="on"><span class="e">📊</span>แดชบอร์ด</button>
      <button data-p="jobs"><span class="e">📋</span>ใบงานซ่อม</button>
      <button data-p="dispatch"><span class="e">🎯</span>จ่ายงานช่าง</button>
      <button data-p="intake"><span class="e">➕</span>รับเครื่อง / บันทึกงาน</button>
      <button data-p="cust"><span class="e">👥</span>ลูกค้า</button>
      <button data-p="parts"><span class="e">📦</span>คลังอะไหล่</button>
      <button data-p="whreq"><span class="e">🔁</span>เบิก / คืน คลังกลาง</button>
      <button data-p="report"><span class="e">📈</span>รายงาน</button>
      <button data-p="setting"><span class="e">⚙️</span>ตั้งค่า</button>
    </nav>
    <nav style="margin-top:16px">
      <button onclick="location.href='index.html'"><span class="e">🏠</span>กลับหน้าหลัก</button>
    </nav>
    <div class="sidefoot">
      <div class="k" id="roleLbl">ผู้ใช้งาน</div>
      <div class="v" id="userName">—</div>
      <div class="st" id="connSt">● กำลังเชื่อมต่อ…</div>
      <button class="btn" id="logoutBtn" style="width:100%;margin-top:11px;background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#fff">
        ออกจากระบบ</button>
    </div>
  </aside>

  <div class="mainarea">
    <div class="phead">
      <button class="burger" onclick="document.getElementById('side').classList.toggle('open')">☰</button>
      <div>
        <h1 id="pgTitle">แดชบอร์ดหัวหน้าช่าง</h1>
        <div class="sub" id="pgSub">ภาพรวมงานซ่อมทั้งหมด</div>
      </div>
      <div class="sp"></div>
      <div class="search">
        <span class="mg">🔍</span>
        <input type="text" id="gSearch" placeholder="ค้นหา ใบงาน / Order / Tracking / แอดมิน"
               title="ค้นได้จากเลขออเดอร์ เลขพัสดุ เลขในระบบ ชื่อลูกค้า ชื่อร้าน SKU Serial รุ่น หรืออาการเสีย">
      </div>
      <button class="bell" id="bellBtn" title="การแจ้งเตือน" aria-haspopup="true" aria-expanded="false">
        🔔<span class="badge" id="bellCount" hidden>0</span></button>
      <div class="avatar" id="avatar">—</div>

      <div class="npanel" id="npanel" role="dialog" aria-label="การแจ้งเตือน">
        <div class="nphead"><b>การแจ้งเตือน</b>
          <span class="pill tag-crit" id="npCount">0</span>
          <span class="sp"></span>
          <button class="btn sm" onclick="closeBell()">ปิด</button></div>
        <div class="nplist" id="nplist"></div>
      </div>
    </div>

    <div class="content">

      <div id="authWarn" class="awarn" hidden></div>
      <div id="bootErrBox" hidden></div>

      <div id="setup" class="setup" style="display:none">
        <h3 style="margin:0 0 8px;color:var(--navy)">⚙️ ยังไม่ได้ตั้งค่าการเชื่อมต่อ</h3>
        <p style="margin:0">แก้ <code>SUPABASE_URL</code> และ <code>SUPABASE_KEY</code> ที่ต้น <code>&lt;script&gt;</code> ท้ายไฟล์</p>
      </div>

      <!-- ============ แดชบอร์ด ============ -->
      <div class="page on" id="p-dash">
        <div class="card"><div class="cb dashtop">
          <div class="steps" id="stepBar"></div>
          <div class="chips" id="rangeChips"></div>
        </div></div>
        <div class="kpis" id="dashKpi"></div>

        <div class="card" id="cardUnbox" hidden>
          <h3>📦 กล่องค้างแกะ <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">
              นับจากวันที่ขนส่งมาถึงศูนย์</span>
            <span class="pill tag-crit" id="ubCount">0</span></h3>
          <div class="cb"><div class="tw"><table id="tblUnbox">
            <thead><tr><th>เลขออเดอร์</th><th>ช่องทาง</th><th>พัสดุขาเข้า</th>
              <th>ของถึงศูนย์</th><th>ครบกำหนด</th><th class="num">เหลือ</th>
              <th class="num noprint"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>

        <div class="card">
          <h3>ติดตามสถานะ 6 ขั้นตอน</h3>
          <div class="cb"><div class="stepcards" id="stepCards"></div></div>
        </div>
        <div class="split">
          <div class="card">
            <h3>งานซ่อมแยกตามขั้นตอน</h3>
            <div class="cb"><div class="chartwrap" id="donutWrap"></div></div>
          </div>
          <div class="card">
            <h3>ผลงานแยกตามช่าง</h3>
            <div class="cb"><div id="techChart"></div></div>
          </div>
        </div>
        <div class="split">
          <div class="card">
            <h3>งานที่เกินกำหนด <span class="sp"></span><span id="odCount" class="pill tag-crit"></span></h3>
            <div class="cb"><div class="tw"><table id="tblOverdue">
              <thead><tr><th>เลขออเดอร์</th><th>ลูกค้า</th><th>เครื่องมือ</th><th>กำหนดเสร็จ</th><th class="num">เกินกำหนด</th><th class="num noprint"></th></tr></thead>
              <tbody></tbody></table></div>
              <div id="odEmpty" class="empty" style="display:none">🎉 ไม่มีงานเกินกำหนด</div>
            </div>
          </div>
          <div class="card">
            <h3>อาการเสียที่พบบ่อย (90 วันล่าสุด)</h3>
            <div class="cb"><div id="symChart"></div></div>
          </div>
        </div>
      </div>

      <!-- ============ ใบงานซ่อม ============ -->
      <div class="page" id="p-jobs">
        <div class="kpis" id="jobKpi"></div>
        <div class="card">
          <h3>กรองรายการ <span class="sp"></span>
            <select id="fTech" class="mini" style="width:auto"><option value="">ช่างทั้งหมด</option></select>
            <select id="fAdmin" class="mini" style="width:auto"><option value="">แอดมิน</option></select>
            <button class="btn sm" onclick="reloadAll()">🔄 รีเฟรช</button>
            <button class="btn sm" onclick="unknownParcel()" title="SOP A9.2 — พัสดุถึงศูนย์แต่หาเจ้าของไม่เจอ">📦 พัสดุไม่ทราบที่มา</button>
            <button class="btn sm g" onclick="goPage('intake')">+ รับเครื่องใหม่</button>
          </h3>
          <div class="cb">
            <div class="chips" id="chipsA" style="margin-bottom:10px"></div>
            <div class="chips" id="chipsB"></div>
          </div>
        </div>
        <div class="card">
          <h3>รายการใบงาน <span class="sp"></span><span class="muted" id="jobCount"></span>
            <button class="btn sm noprint" onclick="exportJobs()"
                    title="ได้เฉพาะใบงานที่กรองอยู่ตอนนี้">⬇️ Export Excel</button>
          </h3>
          <div class="cb">
            <div class="tw"><table id="tblJobs">
              <thead><tr><th>เลขออเดอร์</th><th>ลูกค้า</th><th>เครื่องมือ</th><th>อาการ</th>
                <th>แอดมิน / CS</th><th>ช่าง</th><th>สถานะ</th><th>กำหนดเสร็จ</th><th class="num">รวม</th></tr></thead>
              <tbody></tbody></table></div>
            <div id="jobsEmpty" class="empty" style="display:none">ไม่มีใบงานที่ตรงเงื่อนไข</div>
            <div id="pgJobs"></div>
          </div>
        </div>
      </div>

      <!-- ============ จ่ายงานช่าง ============ -->
      <div class="page" id="p-dispatch">
        <div class="kpis" id="dspKpi"></div>

        <div class="card">
          <h3>🎯 กระดานช่องรับงาน <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px" id="dspRule"></span>
            <button class="btn sm p" id="dspRun" onclick="runDispatch()">⚡ จ่ายงานอัตโนมัติ</button>
          </h3>
          <div class="cb">
            <div class="tw"><table id="tblBoard">
              <thead><tr><th>ช่าง</th>
                <th class="lv-light">🟢 ง่าย</th>
                <th class="lv-medium">🔵 กลาง</th>
                <th class="lv-heavy">🔴 ยาก</th>
                <th class="num">งานค้างรวม</th></tr></thead>
              <tbody></tbody></table></div>
            <div class="box-info" style="margin-top:12px;font-size:13px">
              ช่องว่างเรียงคิวจาก <b>คนที่ว่างมานานที่สุดได้ก่อน</b> ·
              งานที่ไม่มีช่องว่างจะรอในคิวจนกว่าจะมีช่างเคลียร์งานเสร็จ
            </div>
          </div>
        </div>

        <div class="card">
          <h3>⏳ คิวรอจ่าย <span class="sp"></span>
            <span class="pill tag-warn" id="dspQCount">0</span></h3>
          <div class="cb">
            <div class="tw"><table id="tblQueue">
              <thead><tr><th class="num">คิว</th><th>ใบงาน</th><th>ระดับ</th><th>ลูกค้า</th>
                <th>เครื่องมือ</th><th>อาการ</th><th class="num">รอมาแล้ว</th>
                <th class="num noprint"></th></tr></thead>
              <tbody></tbody></table></div>
            <div id="dspQEmpty" class="empty" style="display:none">
              ไม่มีงานรอคิว — ช่างรับงานได้ครบทุกใบแล้ว 👍</div>
          </div>
        </div>

        <div class="card" id="cardNoLevel" hidden>
          <h3>⚠️ ใบงานที่ยังไม่ระบุระดับความยาก <span class="sp"></span>
            <span class="pill tag-crit" id="noLvCount">0</span></h3>
          <div class="cb">
            <div class="box-warn">ระบบจ่ายงานตามระดับความยาก ใบที่ยังไม่ระบุจึง<b>ไม่เข้าคิว</b> —
              เปิดใบงานแล้วเลือกระดับที่ขั้นตรวจเช็ค</div>
            <div class="tw" style="margin-top:11px"><table id="tblNoLevel">
              <thead><tr><th>ใบงาน</th><th>ลูกค้า</th><th>เครื่องมือ</th><th>อาการ</th>
                <th class="num">ค้างมาแล้ว</th><th class="num noprint"></th></tr></thead>
              <tbody></tbody></table></div>
          </div>
        </div>
      </div>

      <!-- ============ รับเครื่อง ============ -->
      <div class="page" id="p-intake">
        <div class="card"><div class="cb dashtop">
          <div class="steps" id="stepBar2" style="flex:1 1 100%"></div>
          <div id="stepHint" class="sub2" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line2)"></div>
        </div></div>
        <div class="card" style="max-width:900px;margin:0 auto">
          <h3>1 · รับเครื่อง — สร้างใบงานซ่อมใหม่ <span class="sp"></span>
            <span class="sub2">เลขที่ใบงานอัตโนมัติ: <b class="mono" id="nextJobNo" style="color:var(--gold)">—</b></span></h3>
          <div class="cb">
            <div class="split" style="grid-template-columns:1fr 1fr">
              <div style="grid-column:1/-1">
                <div class="oswitch">
                  <button type="button" class="obtn on" id="nOrgExt" onclick="setOrigin('external')">
                    <b>🟠 เคสนอกระบบ</b>
                    <span>ลูกค้าทักมาเอง / ส่งเครื่องเข้าศูนย์ตรง — ต้องตัดสินประกันแล้วซ่อม</span></button>
                  <button type="button" class="obtn" id="nOrgInt" onclick="setOrigin('internal')">
                    <b>🟢 เคสในระบบ</b>
                    <span>ลูกค้าเปิดเรื่องผ่านแพลตฟอร์ม — มีหลักฐานแล้ว บันทึกสาเหตุพอ</span></button>
                </div>
                <input type="hidden" id="nOrigin" value="external">
                <div style="font-weight:700;color:var(--navy);margin-bottom:11px">🧾 ข้อมูลอ้างอิงตาม SOP</div>
                <div class="grid g3" style="gap:11px">
                  <div><label>เลขคำสั่งซื้อ (Order No.)</label>
                    <input type="text" id="nOrder" placeholder="เลข Order จากแพลตฟอร์ม"></div>
                  <div><label>เลขพัสดุขาเข้า (Tracking)</label>
                    <input type="text" id="nTrackIn" placeholder="เลขที่ลูกค้าส่งมา"></div>
                  <div><label>ชื่อร้านแพลตฟอร์ม</label>
                    <input type="text" id="nShop" list="shopList" autocomplete="off"
                           placeholder="ร้านที่ลูกค้าซื้อของมา">
                    <datalist id="shopList"></datalist></div>
                  <div><label>แพลตฟอร์ม / ช่องทาง</label><select id="nPlatform">
                    <option value="">— ไม่ระบุ —</option>
                    ${''}</select></div>
                  <div id="nBoxCase"><label>ประเภทเคส <span class="req">*</span></label><select id="nCaseType"></select></div>
                  <div id="nBoxWarranty"><label>เงื่อนไขประกัน <span class="req">*</span></label><select id="nWarranty"></select></div>
                  <div id="nBoxCause" hidden><label>สาเหตุ <span class="req">*</span></label>
                    <select id="nCause"></select>
                    <span class="hint">แก้รายการนี้ได้ที่หน้าตั้งค่า</span></div>
                  <div><label>แอดมิน / CS เจ้าของเคส</label>
                    <input type="text" id="nAdmin" list="adminList" autocomplete="off" placeholder="ชื่อผู้รับเรื่อง">
                    <datalist id="adminList"></datalist></div>
                </div>
                <div id="warnBox" style="margin-top:11px"></div>
              </div>

              <div>
                <div style="font-weight:700;color:var(--navy);margin-bottom:11px">👤 ข้อมูลลูกค้า
                  <span class="muted" style="font-weight:400;font-size:12.5px">· ไม่รู้ตอนนี้ก็ข้ามได้</span></div>
                <div class="box-info" style="margin-bottom:11px;font-size:12.5px">
                  กล่องที่ยังไม่ได้แกะ ยังไม่รู้เจ้าของ — สร้างใบงานไว้ก่อนได้เลย
                  ระบบจะตั้งเป็น <b>"พัสดุไม่ทราบที่มา"</b> แล้วค่อยกด
                  <b>"พบเจ้าของแล้ว"</b> ทีหลัง
                </div>
                <div class="grid">
                  <div>
                    <label>เบอร์โทร</label>
                    <div class="row"><input type="tel" id="nPhone" placeholder="08X-XXX-XXXX" style="flex:1;min-width:110px">
                      <button class="btn sm" onclick="lookupCustomer()">ค้นลูกค้าเดิม</button></div>
                  </div>
                  <div><label>ชื่อลูกค้า</label><input type="text" id="nCustName" placeholder="เช่น ABC Engineering">
                    <span class="hint">ใส่แค่เบอร์ก็ได้ ระบบใช้เบอร์เป็นชื่อไปก่อน แก้ทีหลังได้</span></div>
                  <div><label>ที่อยู่</label><textarea id="nAddress" placeholder="ที่อยู่สำหรับติดต่อ / จัดส่ง" style="min-height:60px"></textarea></div>
                </div>
                <div id="custHint" class="sub2" style="margin-top:8px"></div>
              </div>
              <div>
                <div style="font-weight:700;color:var(--navy);margin-bottom:11px">🔧 รายละเอียดเครื่องมือ</div>
                <div class="grid">
                  <div class="grid g2" style="gap:11px">
                    <div><label>ประเภทเครื่อง</label><input type="text" id="nToolType" placeholder="เช่น Rotary Hammer"></div>
                    <div><label>แบรนด์</label><input type="text" id="nBrand" placeholder="Bosch / Makita…"></div>
                  </div>
                  <div class="grid g2" style="gap:11px">
                    <div><label>รุ่น</label><input type="text" id="nModel" placeholder="เช่น GBH 2-26"></div>
                    <div><label>Serial No.</label><input type="text" id="nSerial" placeholder="—"></div>
                  </div>
                  <div class="grid g2" style="gap:11px">
                    <div><label>SKU</label>
                      <input type="text" id="nSku" placeholder="รหัสสินค้าของตัวเครื่อง"
                             style="text-transform:uppercase"></div>
                    <div></div>
                  </div>
                  <div class="grid g3" style="gap:11px">
                    <div><label>📦 วันที่ขนส่งมาถึงศูนย์</label>
                      <input type="date" id="nArrived">
                      <span class="hint">เริ่มนับเวลาแกะกล่อง</span></div>
                    <div><label>วันที่รับเคส</label><input type="date" id="nRecv">
                      <span class="hint">วันที่ CS รับเรื่อง</span></div>
                    <div><label>กำหนดเสร็จ (ประมาณการ)
                      <span class="muted" style="font-weight:400">· ระบบคิดจริงตอนมอบหมายช่าง</span></label>
                      <input type="date" id="nDue"></div>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--line2)">
              <div class="grid">
                <div><label>อาการเสียที่ลูกค้าแจ้ง</label>
                  <textarea id="nSymptom" placeholder="อธิบายอาการเสีย… (ยังไม่แกะกล่อง ข้ามได้)"></textarea></div>
                <div><label>หมายเหตุ</label>
                  <textarea id="nNote" placeholder="เช่น กล่องบุบมาแต่แรก · ลูกค้าขอด่วน · ไม่มีใบเสร็จ · ตกลงกับลูกค้าว่า…"
                            style="min-height:62px"></textarea></div>
                <select id="nSymCat" hidden><option value="">—</option></select>
              </div>
              <div style="margin-top:13px">
                <label>รูปภาพก่อนรับซ่อม <span class="muted" style="font-weight:400">(สูงสุด 6 รูป · ระบบย่อขนาดให้อัตโนมัติ)</span></label>
                <div class="phs" id="stagedBox"></div>
              </div>
              <input type="hidden" id="nCustId">
              <div class="row" style="justify-content:flex-end;margin-top:16px">
                <button class="btn" onclick="clearIntake()">ยกเลิก</button>
                <button class="btn g" onclick="saveJob()">สร้างใบงาน</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ ลูกค้า ============ -->
      <div class="page" id="p-cust">
        <!-- มุมมองลูกค้ารายคน -->
        <div id="custDetail" hidden>
          <div class="card"><div class="custhead">
            <button class="btn sm" onclick="closeCust()" title="กลับรายชื่อลูกค้า">←</button>
            <div style="flex:1;min-width:0">
              <h2 id="cdName">—</h2>
              <div class="sub2" id="cdMeta"></div>
            </div>
            <span class="pill tag-crit" id="cdCount">0 งาน</span>
          </div></div>
          <div class="kpis" id="cdKpi"></div>
          <div class="card"><div class="cb" style="padding:0">
            <div class="tw"><table id="tblCustJobs">
              <thead><tr><th>เลขออเดอร์</th><th>เครื่องมือ</th><th>อาการ</th><th>สถานะ</th><th>วันที่รับ</th><th class="num">รวม</th></tr></thead>
              <tbody></tbody></table></div>
          </div></div>
        </div>

        <div id="custList">
        <div class="kpis" id="custKpi"></div>
        <div class="card">
          <h3>รายชื่อลูกค้า <span class="sp"></span>
            <input type="text" id="cSearch" placeholder="ค้นชื่อ / เบอร์โทร" style="width:auto;min-width:200px">
          </h3>
          <div class="cb"><div class="tw"><table id="tblCust">
            <thead><tr><th>ชื่อลูกค้า</th><th>เบอร์โทร</th><th>ประเภท</th><th class="num">เคยซ่อม</th><th class="num">ยอดรวม</th><th>ซ่อมล่าสุด</th></tr></thead>
            <tbody></tbody></table></div>
            <div id="custEmpty" class="empty" style="display:none">ยังไม่มีลูกค้า</div>
            <div id="pgCust"></div>
          </div>
        </div>
        </div>
      </div>

      <!-- ============ คลังอะไหล่ ============ -->
      <div class="page" id="p-parts">
        <div class="kpis" id="partKpi"></div>
        <div class="card">
          <h3>รับอะไหล่เข้าคลัง</h3>
          <div class="cb"><div class="grid g4">
            <div style="grid-column:span 2"><label>อะไหล่</label><select id="rcPart"><option value="">— เลือกอะไหล่ —</option></select></div>
            <div><label>จำนวน</label><input type="number" id="rcQty" value="1" min="1"></div>
            <div><label>หมายเหตุ</label><input type="text" id="rcNote" placeholder="นำเข้าจาก JST"></div>
            <div style="display:flex;align-items:flex-end"><button class="btn p" style="width:100%" onclick="receiveParts()">📥 รับเข้า</button></div>
          </div></div>
        </div>
        <div class="card" id="cardAdjust" hidden>
          <h3>⏳ คำขอแก้ / คืนอะไหล่ ที่รออนุมัติ <span class="sp"></span>
            <span class="pill tag-warn" id="adjCount">0</span></h3>
          <div class="cb"><div class="tw"><table id="tblAdjust">
            <thead><tr><th>ใบงาน</th><th>อะไหล่</th><th>คำขอ</th><th class="num">เดิม</th><th class="num">ใหม่</th>
              <th>เหตุผล</th><th>ผู้ขอ</th><th class="num noprint"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>

        <div class="card" id="cardShort">
          <h3>🧾 อะไหล่ที่ขาด — สรุปรายวัน <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">กดปุ่มท้ายแถววันไหน = ออกใบขอจัดซื้อของวันนั้น</span></h3>
          <div class="cb"><div class="tw"><table id="tblShort">
            <thead><tr><th>วันที่</th><th>PART NO.</th><th>รายการ</th><th class="num">ขาด</th>
              <th class="num">เคสที่รอ</th><th>ใบงาน</th><th class="num">มูลค่าทุน</th>
              <th>สถานะ</th><th class="num noprint"></th></tr></thead>
            <tbody></tbody></table></div>
            <div id="shEmpty" class="empty" style="display:none">ยังไม่มีอะไหล่ที่ขาด 👍</div>
          </div>
        </div>

        <div class="card" id="cardSalvage" hidden>
          <h3>📦 เครื่องที่แยกเป็นอะไหล่ <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">
              ประเมินว่าซ่อมไม่ได้ แล้วเลือก "แยกออกไป เพื่อเป็นสต๊อกอะไหล่"</span>
            <span class="pill tag-warn" id="svCount">0</span></h3>
          <div class="cb"><div class="tw"><table id="tblSalvage">
            <thead><tr><th>ใบงาน</th><th>แบรนด์ / รุ่น</th><th>Serial</th>
              <th>อาการที่พบ</th><th>ปลายทางเครื่อง</th><th>วันที่รับเข้า</th></tr></thead>
            <tbody></tbody></table></div>
            <div class="box-info" style="margin-top:12px;font-size:13px">
              เครื่องพวกนี้ยังไม่ถูกถอดเป็นอะไหล่ในระบบ — ถอดแล้วให้ไปที่
              <b>เบิก / คืน คลังกลาง → ตรวจนับ</b> เพื่อเพิ่มยอดอะไหล่ที่ได้มา
            </div>
          </div>
        </div>

        <div class="card" id="cardPR">
          <h3>📄 ใบขอจัดซื้ออะไหล่ <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">SOP A11b.1 · เสนอหัวหน้าศูนย์ → CEO</span></h3>
          <div class="cb"><div class="tw"><table id="tblPR">
            <thead><tr><th>เลขที่</th><th>วันที่</th><th class="num">รายการ</th><th class="num">มูลค่ารวม</th>
              <th>สถานะ</th><th>ผู้ขอ</th><th class="num noprint"></th></tr></thead>
            <tbody></tbody></table></div>
            <div id="prEmpty" class="empty" style="display:none">ยังไม่มีใบขอจัดซื้อ</div>
          </div>
        </div>

        <div class="card">
          <h3>สต็อกและการเบิกใช้ <span class="sp"></span>
            <input type="text" id="pSearch" placeholder="ค้นหา Part No. / ชื่อ" style="width:auto;min-width:180px">
            <button class="btn sm g" onclick="newPart()">+ เพิ่มอะไหล่</button>
          </h3>
          <div class="cb"><div class="tw"><table id="tblParts">
            <thead><tr><th>PART NO.</th><th>รายการ</th><th class="num">ราคา/หน่วย</th><th class="num">เบิกใช้แล้ว</th><th class="num">จุดสั่งซื้อ</th><th class="num">คงเหลือ</th><th>สถานะ</th><th class="noprint"></th></tr></thead>
            <tbody></tbody></table></div>
            <div id="pgParts"></div>
          </div>
        </div>
      </div>

      <!-- ============ รายงาน ============ -->
      <div class="page" id="p-whreq">
        <div id="whRoot"></div>
      </div>

      <div class="page" id="p-report">

        <!-- แท็บ: ผลงาน (ทุกคนดูได้) / การเงิน (หัวหน้า) / คุณภาพสินค้า -->
        <div class="card noprint"><div class="cb" style="padding:11px 14px">
          <div class="chips" id="repTabs"></div>
        </div></div>

        <!-- ---------- แท็บผลงานช่าง ---------- -->
        <div id="rt-work">
          <div class="kpis" id="workKpi"></div>
          <div class="card">
            <h3>เคสที่รับไป แยกตามระดับความยาก <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">นับเป็นจำนวนเคส ไม่มีตัวเลขเงิน</span></h3>
            <div class="cb"><div class="rgrid">
              <div id="diffChart"></div>
              <div class="rside">
                <div class="rsttl">สัดส่วนทั้งศูนย์</div>
                <div id="diffDonut"></div>
                <div id="diffLegend"></div>
              </div>
            </div></div>
          </div>
          <div class="card">
            <h3>ตารางผลงานช่าง <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">แถวของคุณไฮไลท์สีทอง</span></h3>
            <div class="cb"><div class="tw"><table id="tblScore">
              <thead><tr><th>ช่าง</th><th class="num">เคสทั้งหมด</th><th class="num">ปิดงานแล้ว</th>
                <th class="num">ค้างอยู่</th><th class="num">ง่าย</th><th class="num">กลาง</th><th class="num">ยาก</th>
                <th class="num">ตรงกำหนด</th><th class="num">เกินกำหนด</th><th class="num">วันเฉลี่ย/เคส</th></tr></thead>
              <tbody></tbody></table></div>
              <div id="scEmpty" class="empty" style="display:none">ยังไม่มีงานที่มอบหมายให้ช่าง</div>
            </div>
          </div>
        </div>

        <!-- ---------- แท็บการเงิน (เฉพาะหัวหน้า) ---------- -->
        <div id="rt-money" hidden>
          <div class="kpis" id="repKpi"></div>

          <div class="card" id="cardNoWar" hidden>
            <h3>⚠️ เคสที่ยังไม่ได้เลือกเงื่อนไขประกัน <span class="sp"></span>
              <span class="pill tag-crit" id="noWarCount">0</span></h3>
            <div class="cb">
              <div class="box-warn">เคสพวกนี้ยังไม่รู้ว่าใครจ่าย ระบบจึง<b>นับแบบระวังไว้ก่อนว่าบริษัทแบก</b>
                (เข้าช่องต้นทุนเคลม) และ<b>ไม่นับเป็นรายได้</b> — ต้นทุนจะไม่หายไปเงียบ ๆ
                แต่ถ้าจริง ๆ เป็นเคสนอกประกัน ตัวเลขจะติดลบเกินจริง
                <div class="muted" style="font-size:12.5px;margin-top:4px">
                  ตัวเลขรายงานจะแม่นเต็มที่เมื่อรายการนี้เป็น 0</div></div>
              <div class="tw" style="margin-top:11px"><table id="tblNoWar">
                <thead><tr><th>ใบงาน</th><th>ลูกค้า</th><th>เครื่องมือ</th><th>ช่องทาง</th>
                  <th class="num">มูลค่าที่บันทึกไว้</th><th>แอดมิน</th><th class="num noprint"></th></tr></thead>
                <tbody></tbody></table></div>
            </div>
          </div>

          <div class="card">
            <h3>💰 แยกตามเงื่อนไขประกัน — ใครจ่ายอะไร <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">ตัวเลขที่เอาไปคุยกับผู้บริหารได้</span></h3>
            <div class="cb"><div class="tw"><table id="tblWar">
              <thead><tr><th>เงื่อนไขประกัน</th><th class="num">เคส</th>
                <th class="num">🟢 รายได้</th><th class="num">ทุนอะไหล่ที่ขายได้</th>
                <th class="num">🔴 ทุนอะไหล่เคลม</th><th class="num">🚚 ค่าส่งบริษัทออก</th>
                <th class="num">เหลือสุทธิ</th></tr></thead>
              <tbody></tbody></table></div>
              <div class="box-info" style="margin-top:11px" id="warHint"></div>
            </div>
          </div>

          <div class="card">
            <h3>รายได้จริงแยกตามช่าง <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">เฉพาะเคสที่ลูกค้าจ่าย</span></h3>
            <div class="cb"><div id="revChart"></div></div>
          </div>
          <div class="card">
            <h3>🏅 สรุปรางวัลช่างตามระดับความยาก <span class="sp"></span>
              <span class="pill tag-crit">ช่างไม่เห็นหน้านี้</span></h3>
            <div class="cb"><div class="tw"><table id="tblReward">
              <thead><tr><th>ช่าง</th><th class="num">ปิดงาน</th><th class="num">ง่าย</th><th class="num">กลาง</th>
                <th class="num">ยาก</th><th class="num">รางวัลรวม</th></tr></thead><tbody></tbody></table></div>
              <div class="box-info" style="margin-top:11px" id="rewardHint"></div>
            </div>
          </div>
          <div class="card">
            <h3>แยกตามช่องทางที่ลูกค้าซื้อ <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">เรียงจากช่องทางที่เคลมกินเงินมากสุด</span></h3>
            <div class="cb"><div class="tw"><table id="tblPlat">
              <thead><tr><th>ช่องทาง</th><th class="num">เคสทั้งหมด</th>
                <th class="num">เคลม</th><th class="num">ลูกค้าจ่าย</th>
                <th class="num">🟢 รายได้</th><th class="num">🔴 ทุนเคลม</th>
                <th class="num">🚚 ค่าส่งบริษัท</th><th class="num">สุทธิ</th></tr></thead><tbody></tbody></table></div></div>
          </div>

          <div class="card">
            <h3>🔴 ต้นทุนเคลมแยกตามรุ่น <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">ส่งให้จัดซื้อ / โรงงาน แก้ที่ต้นทาง</span></h3>
            <div class="cb"><div class="tw"><table id="tblClaimModel">
              <thead><tr><th>แบรนด์</th><th>รุ่น</th><th class="num">เคสเคลม</th>
                <th class="num">ต้นทุนอะไหล่รวม</th><th class="num">เฉลี่ย/เคส</th></tr></thead>
              <tbody></tbody></table></div>
              <div id="cmEmpty" class="empty" style="display:none">ยังไม่มีต้นทุนเคลมบันทึกไว้</div>
            </div>
          </div>
        </div>

        <!-- ---------- แท็บคุณภาพสินค้า ---------- -->
        <div id="rt-quality" hidden>
          <div class="card">
            <h3>อาการเสียแยกตามรุ่น (ซ้ำ 2 ครั้งขึ้นไป · 1 ปี) <span class="sp"></span>
              <span class="muted" style="font-weight:400;font-size:13px">ส่งให้ทีมจัดซื้อ / QC ใช้ต่อได้</span></h3>
            <div class="cb"><div class="tw"><table id="tblModel">
              <thead><tr><th>แบรนด์</th><th>รุ่น</th><th>อาการ</th><th class="num">จำนวนครั้ง</th></tr></thead><tbody></tbody></table></div>
              <div id="mdEmpty" class="empty" style="display:none">ยังไม่มีรุ่นที่ซ่อมซ้ำ</div>
            </div>
          </div>
          <div class="card">
            <h3>อะไหล่ที่ใช้บ่อยที่สุด (90 วัน)</h3>
            <div class="cb"><div id="topParts"></div></div>
          </div>
        </div>

        <!-- ---------- แท็บค่าส่งเบิกคืนลูกค้า (CS ใช้ยื่นบัญชี) ---------- -->
        <div id="rt-refund" hidden>
          <div class="box-info" style="margin-bottom:14px">
            เคส <b>ประกันภายใน 7 วัน</b> บริษัทเป็นคนแบกค่าส่งขาเข้า
            แต่ลูกค้าเป็นคนสำรองจ่ายไปก่อน — บริษัทจึงต้องคืนเงินให้<br>
            ระบบดึงเคสที่เข้าเกณฑ์มาให้เอง · CS เลือกรายการ → ยื่นบัญชี → บัญชีจ่ายคืน
          </div>

          <div class="kpis" id="rfKpi"></div>

          <div class="card">
            <h3>💰 ค่าส่งที่ต้องคืนลูกค้า <span class="sp"></span>
              <button class="btn sm" onclick="rfExport()">⬇️ โหลดไฟล์ส่งบัญชี</button>
              <button class="btn sm p" onclick="rfSubmit()">📄 ยื่นบัญชี</button>
              <button class="btn sm g" onclick="rfPaid()">✅ จ่ายคืนแล้ว</button>
            </h3>
            <div class="cb">
              <div class="chips" id="rfTabs" style="margin-bottom:12px"></div>
              <div class="search" style="margin-bottom:12px">
                <input type="text" id="rfSearch" placeholder="ค้นหา เลขออเดอร์ / ลูกค้า / เลขเอกสารเบิก"
                       oninput="renderRefund()">
                <select id="rfMonth" onchange="renderRefund()" style="width:auto;min-width:150px"></select>
              </div>
              <div class="tw"><table id="tblRefund">
                <thead><tr>
                  <th class="num noprint"><input type="checkbox" id="rfAll" onchange="rfToggleAll(this)"></th>
                  <th>เลขออเดอร์</th><th>ลูกค้า</th><th>ช่องทาง</th>
                  <th>วันที่รับ</th><th class="num">ยอดคืน</th><th class="num">ใบเสร็จ</th>
                  <th>สถานะ</th><th>เลขเอกสาร</th>
                </tr></thead><tbody></tbody></table></div>
              <div id="rfEmpty" class="empty" style="display:none">ไม่มีรายการในกลุ่มนี้</div>
              <div id="rfSum" class="sub2" style="margin-top:10px"></div>
            </div>
          </div>

          <div class="card">
            <h3>📅 สรุปต่อเดือน</h3>
            <div class="cb"><div class="tw"><table id="tblRefundMonth">
              <thead><tr><th>เดือน</th><th class="num">เคส</th><th class="num">ยอดรวม</th>
                <th class="num">รอเบิก</th><th class="num">ยื่นแล้ว</th><th class="num">จ่ายคืนแล้ว</th>
              </tr></thead><tbody></tbody></table></div></div>
          </div>
        </div>
      </div>

      <!-- ============ ใบงาน (หน้าเต็ม) ============ -->
      <div class="page" id="p-job"><div id="jobWrap"></div></div>

      <!-- ============ ตั้งค่า ============ -->
      <div class="page" id="p-setting">
        <div class="card">
          <h3>⏱️ สเกลความยาก → จำนวนวันที่ให้ซ่อม <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">กำหนดเสร็จ = วันที่มอบหมาย + วันตามระดับนี้</span></h3>
          <div class="cb">
            <div class="grid g3">
              <div><label>เคสเบา (ง่าย)</label><input type="number" id="cfgDLight" min="1" max="60" step="1"></div>
              <div><label>เคสกลาง</label><input type="number" id="cfgDMedium" min="1" max="60" step="1"></div>
              <div><label>เคสหนัก (ยาก)</label><input type="number" id="cfgDHeavy" min="1" max="60" step="1"></div>
            </div>
            <div class="box-info" style="margin-top:12px">
              เปลี่ยนค่านี้แล้ว <b>ใบงานที่ยังไม่ปิด</b> จะคิดกำหนดเสร็จใหม่ตอนแก้ระดับความยากครั้งถัดไป ·
              ใบงานที่ปิดแล้วไม่ถูกแตะ
            </div>
            <div style="margin-top:13px;display:flex;gap:9px;flex-wrap:wrap">
              <button class="btn p" onclick="saveDiffDays()">💾 บันทึกสเกลความยาก</button>
            </div>
          </div>
        </div>

        <div class="card" id="cardCause">
          <h3>🏷️ รายการสาเหตุ (เคสในระบบ) <span class="sp"></span>
            <button class="btn sm g" onclick="editCause()">+ เพิ่มสาเหตุ</button></h3>
          <div class="cb">
            <div class="box-info" style="margin-bottom:11px;font-size:12.5px">
              รายการนี้คือตัวเลือกที่ CS เห็นตอนเลือก <b>"เคสในระบบ"</b> ·
              สาเหตุที่มีใบงานใช้อยู่แล้วจะลบไม่ได้ ระบบจะ<b>ปิดไม่ให้เลือกใหม่</b>แทน
              เพื่อให้ใบงานเก่ายังอ่านออก
            </div>
            <div class="tw"><table id="tblCause">
              <thead><tr><th class="num">ลำดับ</th><th>สาเหตุ</th><th class="mono">รหัส</th>
                <th>สถานะ</th><th class="num noprint">จัดการ</th></tr></thead>
              <tbody></tbody></table></div>
          </div>
        </div>

        <div class="card" id="cardUnboxCfg">
          <h3>📦 กติกาแกะกล่อง</h3>
          <div class="cb">
            <div class="grid g3">
              <div><label>ต้องแกะภายในกี่วัน</label>
                <input type="number" id="cfgUnbox" min="1" max="30" step="1">
                <span class="hint">นับวันปฏิทิน รวมเสาร์-อาทิตย์</span></div>
            </div>
            <div class="box-info" style="margin-top:12px">
              นับจาก <b>วันที่ขนส่งมาถึงศูนย์</b> ที่กรอกในใบงาน —
              ไม่ใช่วันที่สร้างใบงาน<br>
              เกินกำหนดแล้วจะขึ้น <b>การ์ดแดงในแดชบอร์ด</b> ·
              <b>ชิปกรอง "กล่องค้างแกะ"</b> ในหน้าใบงาน · และ <b>กระดิ่งแจ้งเตือน</b>
              <div class="sub2" style="margin-top:4px">
                เปลี่ยนค่านี้แล้วมีผลกับทุกใบทันที รวมใบที่แกะไปแล้ว (คิดย้อนว่าทันกำหนดไหม)</div>
            </div>
            <div style="margin-top:13px">
              <button class="btn p" onclick="saveUnboxDays()">💾 บันทึกกติกาแกะกล่อง</button>
            </div>
          </div>
        </div>

        <div class="card" id="cardReward">
          <h3>🏅 เรทรางวัลช่างต่อชิ้น <span class="sp"></span>
            <span class="pill tag-crit">ช่างไม่เห็นตัวเลขนี้</span></h3>
          <div class="cb">
            <div class="grid g3">
              <div><label>เคสเบา (บาท/เคส)</label><input type="number" id="cfgRLight" min="0" step="5"></div>
              <div><label>เคสกลาง (บาท/เคส)</label><input type="number" id="cfgRMedium" min="0" step="5"></div>
              <div><label>เคสหนัก (บาท/เคส)</label><input type="number" id="cfgRHeavy" min="0" step="5"></div>
            </div>
            <div class="box-warn" style="margin-top:12px">
              ⚠️ หน้ารายงานของช่างแสดงเฉพาะ <b>จำนวนเคสและจำนวนชิ้น</b> ไม่มีตัวเลขเงินทุกกรณี ·
              ยอดรางวัลดูได้ที่ รายงาน → สรุปรางวัลช่าง (เฉพาะหัวหน้า)
            </div>
            <div style="margin-top:13px"><button class="btn p" onclick="saveReward()">💾 บันทึกเรทรางวัล</button></div>
          </div>
        </div>

        <div class="card">
          <h3>🔧 ช่างซ่อม <span class="sp"></span>
            <button class="btn sm g" onclick="addTech()">+ เพิ่มช่าง</button></h3>
          <div class="cb"><div class="tw"><table id="tblTech">
            <thead><tr><th>รหัส</th><th>ชื่อ-สกุล</th><th>ชื่อที่แสดง</th><th>เบอร์โทร</th><th>ความถนัด</th><th class="num">งานค้าง</th><th>สถานะ</th><th class="num"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>

        <div class="card">
          <h3>👤 ผู้ใช้งานและสิทธิ์ <span class="sp"></span>
            <span class="muted" style="font-weight:400;font-size:13px">เปลี่ยนสิทธิ์แล้ว เขาต้องออกจากระบบและเข้าใหม่ 1 ครั้ง</span></h3>
          <div class="cb"><div class="tw"><table id="tblUsers">
            <thead><tr><th>ชื่อ</th><th>อีเมล</th><th>สิทธิ์</th><th>ผูกกับช่าง</th><th>เข้าล่าสุด</th><th class="num"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>

        <div class="card">
          <h3>🎫 โค้ดเชิญ <span class="sp"></span>
            <button class="btn sm g" onclick="addInvite()">+ สร้างโค้ด</button></h3>
          <div class="cb"><div class="tw"><table id="tblInv">
            <thead><tr><th>โค้ด</th><th>สิทธิ์ที่ได้</th><th>คำอธิบาย</th><th class="num">ใช้ไป</th><th class="num">จำกัด</th><th>สถานะ</th><th class="num"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>

        <div class="card">
          <h3>🩺 หมวดอาการเสีย <span class="sp"></span>
            <button class="btn sm g" onclick="addSym()">+ เพิ่มหมวด</button>
            <span class="muted" style="font-weight:400;font-size:13px">ใช้ทำกราฟ Top 5</span></h3>
          <div class="cb"><div class="tw"><table id="tblSym">
            <thead><tr><th>รหัส</th><th>ชื่อหมวด</th><th class="num">ลำดับ</th><th class="num">ใช้ไปแล้ว</th><th>สถานะ</th><th class="num"></th></tr></thead>
            <tbody></tbody></table></div></div>
        </div>
      </div>

    </div>
  </div>
</div>

<div id="printArea"></div>

<div class="fmask" id="fmask">
  <div class="fmodal">
    <div class="fhead"><div class="ttl"><h4 id="fmTitle">—</h4><p class="sub" id="fmSub"></p></div>
      <button class="x" type="button" id="fmX" aria-label="ปิด">✕</button></div>
    <form id="fmForm"><div class="fbody" id="fmBody"></div>
      <div class="ffoot">
        <button type="button" class="btn" id="fmCancel">ยกเลิก</button>
        <button type="submit" class="btn g" id="fmOk">บันทึก</button>
      </div></form>
  </div>
</div>

<script>
/* =====================================================================
   ดักข้อผิดพลาดของทั้งหน้า — วางไว้บนสุด เพื่อให้เห็นแม้โค้ดข้างล่างพัง
   ===================================================================== */
window.__bootErr = [];
function showCrash(msg, src){
  window.__bootErr.push(msg);
  let box = document.getElementById('crashBox');
  if (!box){
    box = document.createElement('div');
    box.id = 'crashBox';
    box.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#BE3A32;color:#fff;'
      + 'padding:11px 16px;font:600 13.5px/1.55 Sarabun,sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.3)';
    document.body ? document.body.prepend(box) : null;
  }
  if (box) box.innerHTML = '⚠️ <b>ระบบทำงานผิดพลาด</b> — ' + String(msg).slice(0,300)
    + (src ? '<div style="font-weight:400;opacity:.9;font-size:12px">' + src + '</div>' : '')
    + '<div style="font-weight:400;font-size:12px;margin-top:4px">กด F12 → Console เพื่อดูรายละเอียด · '
    + 'แล้วส่งข้อความสีแดงมาให้ผู้ดูแลระบบ</div>';
}
window.addEventListener('error', e => showCrash(e.message, (e.filename||'') + ':' + (e.lineno||'')));

/* ---------------------------------------------------------------------
   ไฟล์ประกอบโหลดครบไหม — เตือนใน Console เท่านั้น ไม่บังหน้าจอ
   หน้าเว็บใช้ 3 ไฟล์: repair.html · repair.css · repair-ui.js
   ต้องอยู่โฟลเดอร์เดียวกัน ถ้าขาดตัวใด จะเห็นสาเหตุที่ F12 → Console
   ------------------------------------------------------------------ */
window.addEventListener('load', () => {
  const miss = [];
  try {
    const t = document.createElement('div');
    t.className = 'card';
    t.style.cssText = 'position:absolute;left:-9999px;top:0';
    document.body.appendChild(t);
    const br = getComputedStyle(t).borderRadius;
    t.remove();
    if (window.__cssFail || !br || br === '0px') miss.push('repair.css');
  } catch(e){}
  if (typeof formModal !== 'function' || typeof donutSVG !== 'function') miss.push('repair-ui.js');
  /* printJob ฝังอยู่ในไฟล์นี้แล้ว ไม่ต้องเช็คว่าไฟล์นอกโหลดครบไหม */

  if (miss.length){
    const base = location.href.replace(/[^/]*$/, '');
    console.warn('[repair] ไฟล์ประกอบยังโหลดไม่ครบ:', miss.join(', '),
      '\n· ถ้าเพิ่ง push ขึ้น GitHub Pages ให้รอ 1-2 นาที แล้วกด Ctrl+Shift+R',
      '\n· ถ้ายังไม่หาย เปิด', base + miss[0], 'ดูว่าขึ้น 404 ไหม');

    /* เตือนใน Console อย่างเดียวไม่พอ — ถ้าไฟล์ที่หายคือ repair.css
       หน้าจะกลายเป็น HTML เปล่า คนใช้เห็นแต่หน้าพัง ไม่รู้ว่าเพราะอะไร
       แบนเนอร์นี้จึงเขียน style ฝังในตัวเอง ไม่พึ่ง repair.css เลย */
    const bar = document.createElement('div');
    bar.setAttribute('data-boot-warn', '1');
    bar.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:99999;'
      + 'background:#fdecec;border-bottom:2px solid #c0392b;color:#7d1d13;'
      + 'font:14px/1.6 system-ui,sans-serif;padding:12px 16px;box-shadow:0 2px 10px rgba(0,0,0,.18)';
    bar.innerHTML =
      '<b>⚠️ ไฟล์ประกอบโหลดไม่ครบ — หน้าจอจะเพี้ยน</b>'
      + '<div style="margin-top:5px">ขาด: <b>' + miss.join(' · ') + '</b>'
      + ' — ต้องอยู่โฟลเดอร์เดียวกับ index.html ใน repo</div>'
      + '<div style="margin-top:5px;font-size:13px">'
      +   '1) เพิ่ง push ขึ้น GitHub Pages → รอ 1-2 นาที แล้วกด <b>Ctrl+Shift+R</b><br>'
      +   '2) ยังไม่หาย → กดลิงก์นี้ดูว่าขึ้น 404 ไหม: '
      +   miss.map(f => '<a href="' + base + f + '" target="_blank" style="color:#7d1d13">' + f + '</a>').join(' · ')
      +   '<br>3) ขึ้น 404 = ยังไม่ได้อัปไฟล์นี้ หรือชื่อไฟล์ตัวพิมพ์ใหญ่-เล็กไม่ตรง'
      + '</div>'
      + '<button style="position:absolute;right:10px;top:10px;border:1px solid #c0392b;'
      +   'background:#fff;color:#7d1d13;border-radius:7px;padding:4px 10px;cursor:pointer"'
      +   ' onclick="this.parentNode.remove()">ปิด</button>';
    document.body.appendChild(bar);
    document.body.style.paddingTop = bar.offsetHeight + 'px';
  }
});
window.addEventListener('unhandledrejection', e => showCrash(e.reason?.message || e.reason, 'promise'));
</script>

<!-- เครื่องมือกลาง — แก้ไม่บ่อย เบราว์เซอร์แคชไว้ได้ ไม่ต้องใส่ ?v= -->
<script src="repair-ui.js"></script>
<!-- repair-print.js ฝังมาในไฟล์นี้แล้ว (เอกสารสำหรับพิมพ์)
     เดิมแยกเป็นไฟล์ แต่อัปขึ้น GitHub แล้วเนื้อหาสลับกับไฟล์อื่นบ่อย
     ฝังไว้เลย = ไฟล์น้อยลง 1 ไฟล์ พลาดไม่ได้อีก -->
<script>
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
        <div class="no">${esc((j.order_no || '').trim() || (j.tracking_in || '').trim() || j.job_no)}</div>
        <div class="d">เลขในระบบ ${esc(j.job_no)}</div>
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
        ${row('ชื่อร้าน', j.shop_name)}
      </div></div>
      <div class="pbox"><div class="h">ข้อมูลเครื่องมือ</div><div class="b">
        ${row('ประเภทเครื่อง', j.tool_type)}
        ${row('แบรนด์ / รุ่น', [j.brand,j.model].filter(Boolean).join(' '))}
        ${row('SKU', j.sku)}
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
        ${j.case_origin === 'internal'
            ? row('ที่มาของเคส', 'เคสในระบบแพลตฟอร์ม')
            : row('ประเภทเคส', CASE_TYPE[j.case_type])}
        ${j.cause_label ? row('สาเหตุ', j.cause_label) : ''}
        ${row('แอดมิน / CS', j.admin_name)}
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
      <div class="mono">${esc(j.job_no || '')}</div>
    </div>
  </div>`;

  setTimeout(() => window.print(), 350);   // รอรูปโหลดก่อนสั่งพิมพ์
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
</script>

<script>

/* =====================================================================
   ⚙️ ตั้งค่า
   ===================================================================== */
const SUPABASE_URL = 'https://rmunaewdmlnsiwogmozq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_m10p5I53UNKTZbUAEiUaCw_OCSR63mq';

/* รูปภาพ — เอา URL ที่ลงท้ายด้วย /exec จาก Apps Script มาใส่
   ปล่อยว่างไว้ = ปิดฟีเจอร์รูป ระบบส่วนอื่นยังใช้ได้ปกติ */
const UPLOAD_URL   = 'https://script.google.com/macros/s/AKfycbxsh18xEyOaOb6sWKwF55I786IDXB0yASFiZ-j8hGWXOMBbwBLEvd7k0OkP-9D1y35V/exec';
const UPLOAD_TOKEN = 'masaru-repair-6heftvnll9fldpgb';   // ตรงกับ TOKEN ใน upload.gs

/* ข้อมูลที่พิมพ์บนหัวเอกสาร — แก้ให้ตรงกับที่จดทะเบียน */
const COMPANY = {
  name:   'บริษัท มาซารุ มาร์เก็ตติ้ง จำกัด',
  brand:  'MASARU',
  sub:    'ศูนย์บริการหลังการขาย (Claims & Returns Center)',
  addr:   '— ที่อยู่บริษัท —',
  phone:  '— เบอร์โทรศูนย์บริการ —',
  taxid:  '— เลขประจำตัวผู้เสียภาษี —',
  note:   'เงื่อนไข: บริษัทรับประกันงานซ่อมเฉพาะรายการที่ระบุในเอกสารนี้เป็นเวลา 30 วันนับจากวันส่งมอบ '
        + 'ไม่ครอบคลุมความเสียหายจากการใช้งานผิดวิธี ตกกระแทก หรือน้ำเข้า '
        + 'กรุณาเก็บเอกสารนี้ไว้เป็นหลักฐานในการติดต่อครั้งถัดไป'
};
/* ===================================================================== */

/* ---------- ขั้นตอน 6 ขั้น + สี ramp เดียวไล่อ่อน→เข้ม ---------- */
const STEPS = [
  { n:1, main:'received',   label:'รับเครื่อง',            hint:'บันทึกลูกค้า เครื่องมือ อาการเสีย',   st:['awaiting_parcel','unknown_parcel','received'], c:'#c3d6ec', ink:'#2b4a7a' },
  { n:2, main:'inspecting', label:'ตรวจเช็ค',              hint:'บันทึกอาการที่พบจากการตรวจเช็ค',       st:['inspecting'],               c:'#9cbbdf', ink:'#26456f' },
  { n:3, main:'assigned',   label:'มอบหมายงาน',            hint:'ระบบจ่ายงานให้ช่างตามคิว + กำหนดวันเสร็จ',    st:['assigned','wait_approve'],  c:'#75a0d0', ink:'#1f3c63' },
  { n:4, main:'repairing',  label:'ซ่อม / เปลี่ยนอะไหล่',   hint:'ซ่อม เปลี่ยนอะไหล่ หรือรออุปกรณ์',    st:['repairing','wait_parts'],   c:'#4f83bb', ink:'#fff'    },
  { n:5, main:'testing',    label:'ตรวจสอบ',               hint:'ทดสอบเครื่องก่อนส่งมอบ',              st:['testing'],                  c:'#35659c', ink:'#fff'    },
  { n:6, main:'ready',      label:'ส่งมอบลูกค้า',           hint:'นัดรับเครื่องและปิดงาน',              st:['ready','delivered'],        c:'#1F3864', ink:'#fff'    }
];
/* ---------- ตาม SOP-CLM-01 ---------- */
const PLATFORMS = ['TikTok','Shopee','Lazada','Facebook','LINE','หน้าร้าน','ดีลเลอร์','อื่น ๆ'];
/* ---------------------------------------------------------------------
   ที่มาของเคส (30_cs_feedback.sql)
     external = ลูกค้าทักมาเอง / ส่งเครื่องเข้ามาตรง  → ต้องตัดสินประกัน + ซ่อม
     internal = ลูกค้าเปิดเรื่องในแพลตฟอร์ม           → มีหลักฐานแล้ว บันทึกสาเหตุพอ
   แยกคนละคอลัมน์กับ "ประเภทเคส" เพราะคนละคำถามกัน
   --------------------------------------------------------------------- */
const ORIGIN = {
  external: { l:'เคสนอกระบบ', ico:'🟠', cls:'tag-warn' },
  internal: { l:'เคสในระบบ',  ico:'🟢', cls:'tag-good' }
};
/** เคสในระบบไหม — ใบงานเก่าที่ยังไม่ได้รัน 30 จะไม่มีคอลัมน์นี้ ถือเป็นนอกระบบ */
function isInternal(j){ return (j && j.case_origin) === 'internal'; }
/* 30_cs_feedback.sql รันแล้วหรือยัง — ยังไม่รัน ต้องซ่อนของใหม่ทั้งชุด
   ไม่งั้นกดบันทึกแล้วเจอ "Could not find the 'case_origin' column" ทั้งใบ */
window.HAS_ORIGIN = false;
/** ชื่อสาเหตุที่อ่านออก — ลบออกจากรายการแล้วยังต้องอ่านของเก่าได้ */
function causeName(j){
  if (!j || !j.cause_code) return '';
  return j.cause_label || (S.causes.find(c => c.code === j.cause_code) || {}).label || j.cause_code;
}

const CASE_TYPE = {
  claim:     'เคลม / ส่งซ่อม',
  part_only: 'ส่งอะไหล่ให้ลูกค้าเปลี่ยนเอง',
  replace:   'เปลี่ยนสินค้าใหม่',
  return:    'ตีกลับ ยกเลิกการสั่งซื้อ',
  consult:   'สอบถาม / ให้คำปรึกษา'
};
const WARRANTY = {
  within7:      { l:'ภายใน 7 วัน',               ship:'บริษัท', parts:'บริษัท', labor:'บริษัท', cls:'tag-good',
                  shipIn:'บริษัท', shipOut:'บริษัท', advance:true,
                  note:'ขาส่งมา <b>ลูกค้าสำรองจ่ายไปก่อน</b> แล้วบริษัทคืนเงินให้ · ขาส่งกลับบริษัทออกเอง' },
  in_warranty:  { l:'ในประกัน 1 / 6 / 12 เดือน',  ship:'ลูกค้า', parts:'บริษัท', labor:'บริษัท', cls:'tag-warn',
                  shipIn:'ลูกค้า', shipOut:'ลูกค้า', advance:false,
                  note:'ค่าส่งลูกค้าออกเองทั้ง 2 ขา · บริษัทออกให้เฉพาะค่าอะไหล่กับค่าแรง' },
  out_warranty: { l:'นอกประกัน / ประกันขาด',       ship:'ลูกค้า', parts:'ลูกค้า', labor:'ลูกค้า', cls:'tag-crit',
                  shipIn:'ลูกค้า', shipOut:'ลูกค้า', advance:false,
                  note:'ลูกค้าออกเองทั้งหมด — ค่าส่ง ค่าอะไหล่ ค่าแรง' },
  unknown:      { l:'ยังไม่ระบุ',                 ship:'—',      parts:'—',      labor:'—',      cls:'st0' }
};
const SEVERITY = { light:'เคสเบา (ง่าย)', medium:'เคสกลาง', heavy:'เคสหนัก (ยาก)' };
/* ต้องแกะกล่องภายในกี่วันหลังขนส่งมาถึง — โหลดจริงจาก sys_config คีย์ unbox_days */
let UNBOX_DAYS = 3;

/* กล่องต้องแกะภายในกำหนด — นับจากวันที่ขนส่งมาถึง (24_unbox.sql)
     unbox_state     : no_date · ok · today · late · done · done_late
     unbox_days_left : เหลือกี่วัน · ติดลบ = เกินมาแล้วกี่วัน
   ประกาศเป็น function ไม่ใช่ const เพราะถูกเรียกจากโค้ดที่อยู่ก่อนหน้านี้ในไฟล์ */

/* เลขที่ใช้เรียกใบงานในหน้าจอ — เอาเลขออเดอร์ขึ้นก่อน
     เลขระบบ REP-xxxx ยังมีอยู่ในฐานข้อมูล ใช้เป็นกุญแจ และใช้บนใบพิมพ์
     แต่คนทำงานจำเลขออเดอร์ ไม่ใช่เลขระบบ จอจึงโชว์เลขออเดอร์เป็นหลัก
     ไม่มีออเดอร์ (พัสดุไม่ทราบที่มา / หน้าร้าน) ค่อยไล่ลงไปเลขพัสดุ แล้วเลขระบบ */
function jobRef(j){
  return (j.order_no || '').trim() || (j.tracking_in || '').trim() || j.job_no || '—';
}
/** เจอแค่เลขระบบ (ตารางอะไหล่ขาด / คำขอแก้) ให้ย้อนไปหาเลขออเดอร์จากใบงาน */
function refByNo(no){
  if (!no) return '—';
  const j = (S.jobs || []).find(x => x.job_no === no);
  return j ? jobRef(j) : no;
}

/** ป้ายบอกว่าเลขที่โชว์อยู่เป็นเลขอะไร */
function jobRefKind(j){
  if ((j.order_no || '').trim())   return 'Order';
  if ((j.tracking_in || '').trim()) return 'พัสดุ';
  return 'เลขระบบ';
}

/** กล่องใบนี้ยังค้างแกะอยู่ไหม — ปิดงานแล้วไม่นับ */
function unboxPending(j){
  return !CLOSED.includes(j.status) && !j.unboxed_at && j.arrived_at != null;
}

/** ข้อความนับถอยหลังสั้น ๆ ใช้ได้ทั้งในตารางและในกระดิ่ง */
function unboxLeftText(j){
  const d = j.unbox_days_left;
  if (d == null) return '';
  if (d < 0)   return 'เกินมา ' + Math.abs(d) + ' วัน';
  if (d === 0) return 'ครบวันนี้';
  return 'เหลือ ' + d + ' วัน';
}

/* จำนวนวันต่อระดับ — โหลดจริงจาก sys_config ตอนเปิดระบบ ค่านี้เป็นค่าสำรอง */
let DIFF_DAYS   = { light:1, medium:2, heavy:3 };
let REWARD_RATE = { light:0, medium:0, heavy:0 };
const diffDays = sv => Number(DIFF_DAYS[sv || 'medium']) || 2;

/* ระดับความยาก + จำนวนช่องรับงานต่อคน — ประกาศไว้ตรงนี้ให้ startApp ใช้ได้ทัน
   (ถ้าไปประกาศท้ายไฟล์จะติด TDZ เพราะ startApp เรียกก่อน) */
const LEVELS = [
  { k:'light',  t:'ง่าย',  ico:'🟢' },
  { k:'medium', t:'กลาง', ico:'🔵' },
  { k:'heavy',  t:'ยาก',  ico:'🔴' }
];
let SLOTS = { light:1, medium:1, heavy:1 };

/* ใครจ่ายอะไหล่ในเคสนี้ — อ่านจากตาราง warranty_rules ผ่าน v_jobs
   'ลูกค้า' = คิดราคาขาย (รายได้)  ·  'บริษัท' = คิดราคาทุน (ต้นทุนเคลม) */
const partsByCustomer = j => (j?.parts_by || WARRANTY[j?.warranty_case]?.parts) === 'ลูกค้า';
const laborByCustomer = j => (j?.labor_by || WARRANTY[j?.warranty_case]?.labor) === 'ลูกค้า';
const priceBasis = j => partsByCustomer(j) ? 'sell' : 'cost';

/* ค่าส่ง — ไม่ใช่รายได้ของใคร เป็นต้นทุนของฝ่ายที่รับผิดชอบขานั้น
   ค่าตั้งต้นว่าใครจ่ายมาจาก warranty_rules แก้รายเคสได้ */
const SHIP_BY = { 'บริษัท':'บริษัท', 'ลูกค้า':'ลูกค้า' };
const shipByOpts = cur => ['','บริษัท','ลูกค้า'].map(v =>
  `<option value="${v}" ${v === (cur || '') ? 'selected' : ''}>${v || '— ยังไม่ระบุ —'}</option>`).join('');
/* ค่าส่งที่บริษัทออกในใบงานนี้ */
const shipCompany = j =>
    (j?.ship_in_by  === 'บริษัท' ? Number(j.ship_in_fee  || 0) : 0)
  + (j?.ship_out_by === 'บริษัท' ? Number(j.ship_out_fee || 0) : 0);
const shipCustomer = j =>
    (j?.ship_in_by  === 'ลูกค้า' ? Number(j.ship_in_fee  || 0) : 0)
  + (j?.ship_out_by === 'ลูกค้า' ? Number(j.ship_out_fee || 0) : 0);
const addDays  = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n);
  return x.getFullYear() + '-' + String(x.getMonth()+1).padStart(2,'0') + '-' + String(x.getDate()).padStart(2,'0'); };
const DISPOSITION = {
  repair_resell:'ซ่อมต่อ เก็บเข้าคลังขายต่อ',
  spare_parts:  'เก็บเป็นอะไหล่สำรอง',
  scrap:        'ทิ้ง / ตัดจำหน่าย'
};
const opts = (obj, cur) => Object.entries(obj)
  .map(([k,v]) => `<option value="${k}" ${k===cur?'selected':''}>${esc(typeof v === 'string' ? v : v.l)}</option>`).join('');

const STATUS = {
  awaiting_parcel:'รอลูกค้าส่งของ',
  unknown_parcel:'พัสดุไม่ทราบที่มา',
  received:'ได้รับเครื่อง', inspecting:'ตรวจเช็ค', assigned:'มอบหมายแล้ว', wait_approve:'รออนุมัติ',
  repairing:'กำลังซ่อม', wait_parts:'รออะไหล่', testing:'ทดสอบ',
  ready:'พร้อมส่งมอบ', delivered:'ส่งมอบแล้ว', rejected:'ไม่รับเคลม', cancelled:'ยกเลิก'
};
const STEP_OF = {};
STEPS.forEach(s => s.st.forEach(k => STEP_OF[k] = s.n));
const CLOSED = ['delivered','cancelled','rejected'];
const stepOf = st => STEP_OF[st] || 0;

let sb = null;
const S = { jobs:[], techs:[], cats:[], parts:[], custs:[], stock:[], job:null, lines:[], photos:[], slog:[], filter:'open', range:'all', seen:null, peek:null, custView:null, pg:{jobs:1,cust:1,parts:1}, per:30,
  adjust:[], shortage:[], shortDaily:[], prs:[], salvage:[], score:[], repTab:'work',
  refund:[], refundMonth:[], rfTab:'pending', causes:[], fAdmin:'',
  board:[], queue:[] };

/* ตารางที่แบ่งหน้า — repair-ui.js เรียกผ่านทะเบียนนี้ (ใช้ร่วมกับโมดูลอื่นได้) */
window.PAGERS = {
  jobs:  () => renderJobs(),
  cust:  () => renderCust(),
  parts: () => renderParts(),
  mywh:  () => mywhRender()          // หน้าเบิก/คืน คลังกลาง (repair-ui.js)
};

/* ---------- ผู้ใช้ที่ล็อกอินอยู่ ---------- */
let ME = { id:null, email:'', name:'', role:'staff', techId:null };
const who = () => ME.name || ME.email || 'ไม่ระบุ';
const isBoss = () => ME.role === 'head' || ME.role === 'admin';
const ROLE_LABEL = { staff:'พนักงานรับเครื่อง', tech:'ช่างซ่อม', head:'หัวหน้าช่าง',
                     admin:'ผู้ดูแลระบบ', test:'ผู้ทดลองใช้' };
const ROLE_PAGES = {
  staff: ['dash','jobs','intake','cust','job'],
  tech:  ['dash','jobs','dispatch','parts','whreq','report','job'],
  head:  ['dash','jobs','dispatch','intake','cust','parts','whreq','report','setting','job'],
  admin: ['dash','jobs','dispatch','intake','cust','parts','whreq','report','setting','job'],
  /* ผู้ทดลองใช้ — เหมือนหัวหน้าทุกหน้า ยกเว้น "ตั้งค่า"
     และ is_boss() ไม่รวม test จึงลบใบงาน/อนุมัติ/แก้ค่าตั้งระบบไม่ได้ */
  test:  ['dash','jobs','dispatch','intake','cust','parts','whreq','report','job']
};


/* =====================================================================
   nav
   ===================================================================== */
const PGT = {
  dash:   ['แดชบอร์ดหัวหน้าช่าง','ภาพรวมงานซ่อมทั้งหมด'],
  jobs:   ['ใบงานซ่อม','รายการงานทั้งหมดในระบบ'],
  dispatch:['จ่ายงานช่าง','ช่องรับงานตามระดับความยาก · คิวรอจ่าย'],
  intake: ['รับเครื่อง / บันทึกงาน','ขั้นตอนที่ 1/6 — สร้างใบงานซ่อม'],
  cust:   ['ลูกค้า','ประวัติลูกค้าและการซ่อม'],
  parts:  ['คลังอะไหล่','สต็อกและการเบิกใช้'],
  whreq:  ['เบิก / คืน คลังกลาง','ขอของชุดใหญ่จากคลังกลาง แล้วบริหารในคลังช่างเอง'],
  report: ['รายงาน','ผลงานช่าง · การเงิน · คุณภาพสินค้า'],
  setting:['ตั้งค่าระบบ','ช่างซ่อม · ผู้ใช้งาน · โค้ดเชิญ · หมวดอาการ'],
  job:    ['ใบงานซ่อม','รายละเอียดและบันทึกงานตามขั้นตอน']
};
document.querySelectorAll('aside nav button[data-p]').forEach(b => b.onclick = () => goPage(b.dataset.p));
function goPage(p){
  const allow = ROLE_PAGES[ME.role] || ROLE_PAGES.staff;
  if (ME.id && !allow.includes(p)) { toast('ไม่มีสิทธิ์เข้าหน้านี้', true); return; }
  document.querySelectorAll('aside nav button[data-p]').forEach(b => b.classList.toggle('on', b.dataset.p === p));
  document.querySelectorAll('.page').forEach(el => el.classList.toggle('on', el.id === 'p-' + p));
  $('pgTitle').textContent = PGT[p][0]; $('pgSub').textContent = PGT[p][1];
  $('side').classList.remove('open');
  window.scrollTo(0,0);
  if (p === 'cust')   { closeCust(); renderCust(); }
  if (p === 'dispatch') loadDispatch();
  if (p === 'parts')  loadParts();
  if (p === 'whreq')  { mywhSetup({ wh:'REPAIR', label:'คลังอะไหล่ช่าง', mount:'whRoot' }); mywhLoad(); }
  if (p === 'report') loadReport();
  if (p === 'setting'){ loadSettings(); loadCauses(); }
}

/* =====================================================================
   คงสถานะล็อกอินให้ทนสภาพจริง
     · token refresh ล้มชั่วคราว (เน็ตกระตุก / เครื่อง sleep / เปิดหลายแท็บ)
       ทำให้ Supabase ยิง SIGNED_OUT ได้ ทั้งที่ session ยังใช้ได้อยู่
     · เดิมเจอ SIGNED_OUT แล้ว reload ทันที = เด้งออกทั้งที่ไม่ได้กดออก
     · ใหม่ = ตรวจให้ชัดก่อน ลองต่ออายุ 1 รอบ แล้วค่อยตัดสิน
   ===================================================================== */
let _authBound  = false;
let _userLogout = false;      // true เฉพาะเมื่อผู้ใช้กดปุ่มออกจากระบบเอง

function authNotice(msg, kind){
  const el = $('authWarn');
  if (!el) return;
  el.hidden = !msg;
  el.className = 'awarn' + (kind ? ' ' + kind : '');
  el.innerHTML = msg || '';
}

function bindAuthEvents(){
  if (_authBound) return;
  _authBound = true;

  sb.auth.onAuthStateChange(async (ev, session) => {
    console.info('[auth]', ev, session ? '· มี session' : '· ไม่มี session');

    if (ev === 'TOKEN_REFRESHED'){ authNotice(''); return; }
    if (ev === 'SIGNED_IN')      { authNotice(''); return; }
    if (ev !== 'SIGNED_OUT') return;

    if (_userLogout) { location.reload(); return; }   // กดออกเอง = ออกจริง

    /* ยังไม่เคยเข้าระบบในหน้านี้ ไม่ต้องทำอะไร */
    if (!ME.id) return;

    /* เน็ตหลุด — รอให้กลับมาเอง ไม่ไล่ออก */
    if (navigator.onLine === false){
      authNotice('🔌 <b>อินเทอร์เน็ตหลุด</b> — ยังไม่ต้องปิดหน้านี้ ระบบจะเชื่อมต่อใหม่ให้เองเมื่อเน็ตกลับมา', 'warn');
      return;
    }

    /* เช็คว่าไม่มี session จริงหรือเปล่า แล้วลองต่ออายุอีก 1 รอบ */
    try {
      const { data } = await sb.auth.getSession();
      if (data?.session){ authNotice(''); return; }
    } catch(e){}
    try {
      const { data } = await sb.auth.refreshSession();
      if (data?.session){
        authNotice('');
        console.info('[auth] ต่ออายุ session สำเร็จ ไม่ต้องล็อกอินใหม่');
        return;
      }
    } catch(e){ console.warn('[auth] ต่ออายุไม่สำเร็จ', e); }

    authNotice('🔑 <b>เซสชันหมดอายุ</b> — กำลังพากลับไปหน้าเข้าสู่ระบบ', 'crit');
    setTimeout(() => location.reload(), 1400);
  });

  /* เน็ตกลับมา / กลับมาที่แท็บนี้ → ต่ออายุให้เลย ไม่ต้องรอพัง */
  window.addEventListener('online', async () => {
    if (!ME.id) return;
    authNotice('');
    try { await sb.auth.refreshSession(); await reloadAll(); } catch(e){ console.warn(e); }
  });
  window.addEventListener('offline', () => {
    if (ME.id) authNotice('🔌 <b>อินเทอร์เน็ตหลุด</b> — ข้อมูลที่ยังไม่กดบันทึกอย่าปิดหน้านี้', 'warn');
  });
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || !ME.id) return;
    try {
      const { data } = await sb.auth.getSession();
      if (!data?.session) await sb.auth.refreshSession();
    } catch(e){ console.warn('[auth] เช็ค session ตอนกลับมาที่แท็บ', e); }
  });
}


/* =====================================================================
   boot
   ===================================================================== */
(async function boot(){
  if (!SUPABASE_URL || !SUPABASE_KEY){
    $('gate').hidden = true; $('app').hidden = false;
    $('setup').style.display = 'block';
    document.querySelectorAll('.page').forEach(v => v.classList.remove('on'));
    return;
  }
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession:     true,    // จำการล็อกอินไว้ใน localStorage
      autoRefreshToken:   true,    // ต่ออายุ token ให้เองก่อนหมด
      detectSessionInUrl: false,   // ระบบนี้ใช้ ?job= ไม่ได้ใช้ลิงก์เข้าระบบทางอีเมล
      storageKey: 'masaru-repair-auth'
    }
  });
  bindAuthEvents();
  try {
    const { data:{ session } } = await sb.auth.getSession();
    if (session) return startApp(session);
  } catch(e){ console.warn('getSession ล้มเหลว', e); }
  $('liEmail').focus();
})();


/* ---------- ล็อกอิน ---------- */
function authMsg(e){
  const m = (e?.message || '').toLowerCase();
  if (m.includes('invalid login'))       return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  if (m.includes('email not confirmed')) return 'อีเมลนี้ยังไม่ได้ยืนยัน — ให้ผู้ดูแลติ๊ก Auto Confirm ให้';
  if (m.includes('rate limit') || m.includes('too many')) return 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่';
  if (m.includes('failed to fetch'))     return 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจอินเทอร์เน็ตหรือค่า SUPABASE_URL';
  if (m.includes('permission denied'))   return 'ฐานข้อมูลไม่ให้สิทธิ์อ่าน — น่าจะลืม grant หลัง drop view · รัน diagnose2.sql';
  if (m.includes('does not exist') || m.includes('not exist'))
    return 'ตาราง/view บางตัวหายไป — รัน SQL ไม่ครบตามลำดับ · รัน diagnose2.sql';
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'อีเมลนี้สมัครไว้แล้ว — กดแท็บ "เข้าสู่ระบบ" แทน';
  if (m.includes('signups not allowed') || m.includes('signup is disabled'))
    return 'ยังปิดการสมัครอยู่ — ผู้ดูแลต้องเปิด Enable email signups ใน Supabase';
  if (m.includes('password'))            return 'รหัสผ่านสั้นเกินไป — ต้องอย่างน้อย 6 ตัวอักษร';
  if (m.includes('โค้ด'))                 return e.message;
  return e?.message || 'เข้าสู่ระบบไม่สำเร็จ';
}

$('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('liBtn');
  btn.disabled = true; btn.textContent = 'กำลังเข้าสู่ระบบ…'; $('liErr').hidden = true;
  try {
    const { data, error } = await sb.auth.signInWithPassword({
      email: val('liEmail'), password: $('liPass').value
    });
    if (error) throw error;
    await startApp(data.session);
  } catch(err){
    console.error('[repair] login', err);
    $('liErr').innerHTML = esc(authMsg(err))
      + '<div style="font-weight:400;font-size:12px;margin-top:5px;opacity:.9">' + esc(err.message || err) + '</div>'
      ;
    $('liErr').hidden = false;
    $('liPass').focus();
  } finally { btn.disabled = false; btn.textContent = 'เข้าสู่ระบบ'; }
});

/* ---------- สลับแท็บ เข้าสู่ระบบ / สมัครสมาชิก ---------- */
/* การสมัครสมาชิกย้ายไปอยู่หน้าหลัก (index.html) แล้ว
   เพราะระบบมี 3 โมดูล คนที่ไม่ได้ทำงานซ่อมไม่ควรต้องเดินผ่านหน้านี้เพื่อสมัคร */

$('logoutBtn').addEventListener('click', async () => {
  if (!await confirmModal('ออกจากระบบ?', 'ครั้งหน้าต้องกรอกอีเมลและรหัสผ่านใหม่', { ok:'ออกจากระบบ' })) return;
  _userLogout = true;
  try { await sb.auth.signOut(); } catch(e){}
  location.reload();
});

async function forceLogout(){
  _userLogout = true;
  try { await sb.auth.signOut(); } catch(e){}
  location.reload();
}

/* ---------- เริ่มระบบหลังล็อกอินผ่าน ---------- */
async function startApp(session){
  ME.id = session.user.id;
  ME.email = session.user.email || '';
  const jwtRole = session.user.app_metadata?.role || null;
  ME.role = jwtRole || 'staff';
  ME.name = ME.email.split('@')[0];

  try {
    const [prof, techs, cats, parts, cfg] = await Promise.all([
      sb.from('app_users').select('full_name, role, technician_id').eq('id', ME.id).maybeSingle(),
      sb.from('technicians').select('*').eq('is_active', true).order('code'),
      sb.from('symptom_categories').select('*').eq('is_active', true).order('sort_order'),
      sb.from('parts_master').select('id,part_no,name,sell_price,cost_price').eq('is_active', true).order('part_no'),
      sb.from('sys_config').select('key,value')
    ]);
    /* sys_config มาจาก 13_update.sql — ถ้ายังไม่ได้รัน ระบบใช้ค่าสำรองต่อไปได้ */
    if (cfg.error) console.warn('อ่าน sys_config ไม่ได้ — ใช้ค่าสำรอง', cfg.error.message);
    (cfg.data || []).forEach(r => {
      if (r.key === 'difficulty_days') DIFF_DAYS   = { ...DIFF_DAYS,   ...(r.value || {}) };
      if (r.key === 'reward_rate')     REWARD_RATE = { ...REWARD_RATE, ...(r.value || {}) };
      if (r.key === 'slots_per_level') SLOTS       = { ...SLOTS,       ...(r.value || {}) };
      if (r.key === 'unbox_days')      UNBOX_DAYS  = Number(r.value?.limit) || UNBOX_DAYS;
    });
    if (techs.error) throw techs.error;

    // โปรไฟล์คือแหล่งความจริงของสิทธิ์ — ถ้าอ่านไม่ได้ ต้องบอกให้ชัด ไม่ใช่เงียบแล้วลดสิทธิ์
    if (prof.error) throw new Error('อ่านตาราง app_users ไม่ได้ (' + prof.error.message + ') — รัน 06_auth_rls.sql แล้วหรือยัง?');
    if (!prof.data)  throw new Error('บัญชี ' + ME.email + ' ยังไม่ได้ผูกกับสิทธิ์ใด ๆ — สมัครใหม่ด้วยโค้ดเชิญ หรือให้แอดมินรัน set_user_role()');

    ME.name   = prof.data.full_name || ME.name;
    ME.role   = prof.data.role || 'staff';
    ME.techId = prof.data.technician_id || null;
    S.techs = techs.data || []; S.cats = cats.data || []; S.parts = parts.data || [];

    /* รายการสาเหตุ มาจาก 30_cs_feedback.sql — ยังไม่ได้รันก็ใช้ระบบต่อได้
       แค่สลับเป็นเคสในระบบแล้วจะไม่มีตัวเลือกให้เลือก */
    const cz = await sb.from('repair_causes').select('*').eq('is_active', true).order('sort_no');
    if (cz.error){ S.causes = []; console.warn('ยังไม่มีตาราง repair_causes — รัน 30_cs_feedback.sql', cz.error.message); }
    else { S.causes = (cz.data || []).filter(c => c.is_active !== false); HAS_ORIGIN = true; }

    // role ใน token ไม่ตรงกับในตาราง → ต่ออายุ token 1 รอบ ไม่งั้น RLS ฝั่ง DB จะมองเป็นสิทธิ์เก่า
    if (jwtRole !== ME.role){
      /* ทำครั้งเดียวต่อการเปิดแท็บ — เดิมยิงทุกครั้งที่เปิดหน้า
         ถ้า set_user_role ไม่ได้อัปเดต auth.users ด้วย role จะไม่ตรงตลอดไป
         แล้วการยิง refreshSession รัว ๆ ทำให้ refresh token ชนกันเองจนเด้งออก */
      let once = false;
      try { once = sessionStorage.getItem('repair_role_refreshed') === ME.role; } catch(e){}
      if (!once){
        try {
          const { data: fresh } = await sb.auth.refreshSession();
          const nr = fresh?.session?.user?.app_metadata?.role;
          try { sessionStorage.setItem('repair_role_refreshed', ME.role); } catch(e){}
          if (nr && nr !== ME.role)
            console.warn('token role =', nr, '/ app_users role =', ME.role,
                         '— ให้แอดมินรัน set_user_role() ใหม่ เพื่ออัปเดต app_metadata');
        } catch(e){ console.warn('refreshSession ไม่สำเร็จ', e); }
      }
    }
    console.info('[repair] เข้าสู่ระบบเป็น', ME.name, '· สิทธิ์', ME.role, '· เมนู', (ROLE_PAGES[ME.role]||[]).join(', '));
  } catch(e){
    console.error('[repair] startApp ล้มเหลว', e);
    /* โหลดข้อมูลตั้งต้นไม่สำเร็จ ไม่ได้แปลว่าล็อกอินไม่ผ่าน
       เดิม signOut() ทิ้งทั้งเซสชัน → เน็ตกระตุกครั้งเดียวก็ต้องล็อกอินใหม่
       ใหม่ = เก็บเซสชันไว้ ให้กด "ลองใหม่" หรือออกเองถ้าต้องการ */
    const netErr = /failed to fetch|networkerror|load failed|timeout/i.test(e?.message || '');
    $('bootErrBox').innerHTML =
      `<div class="card"><div class="cb">
        <h4 style="margin:0 0 7px;color:var(--crit)">⚠️ โหลดข้อมูลตั้งต้นไม่สำเร็จ</h4>
        <div style="font-size:14px">${esc(authMsg(e))}</div>
        <div class="muted" style="font-size:12.5px;margin-top:6px;word-break:break-word">${esc(e.message || e)}</div>
        <div class="box-info" style="margin-top:11px;font-size:13px">
          ${netErr
            ? 'ดูเหมือนเน็ตมีปัญหา — <b>ยังล็อกอินอยู่</b> กดลองใหม่ได้เลย ไม่ต้องกรอกรหัสใหม่'
            : 'ฐานข้อมูลตอบว่าอ่านไม่ได้ — <b>ยังล็อกอินอยู่</b> แก้ที่ Supabase แล้วกดลองใหม่'}
        </div>
        <div style="display:flex;gap:9px;margin-top:13px;flex-wrap:wrap">
          <button class="btn p" onclick="location.reload()">🔄 ลองใหม่</button>
          <button class="btn dn" onclick="forceLogout()">ออกจากระบบ</button>
        </div>
      </div></div>`;
    $('bootErrBox').hidden = false;
    $('gate').hidden = true; $('app').hidden = false;
    document.querySelectorAll('.page').forEach(v => v.classList.remove('on'));
    return;
  }

  // เมนูตามตำแหน่ง
  const allow = ROLE_PAGES[ME.role] || ROLE_PAGES.staff;
  document.querySelectorAll('aside nav button[data-p]').forEach(b => { b.hidden = !allow.includes(b.dataset.p); });

  $('userName').innerHTML = esc(ME.name) + `<span class="rolepill">${ROLE_LABEL[ME.role] || ME.role}</span>`;
  $('roleLbl').textContent = ME.email;
  $('avatar').textContent = (ME.name || '—').slice(0,2);

  const to = S.techs.map(t => `<option value="${t.id}">${esc(t.nickname || t.full_name)}</option>`).join('');
  $('fTech').insertAdjacentHTML('beforeend', to);
  $('nSymCat').insertAdjacentHTML('beforeend', S.cats.map(c => `<option value="${c.code}">${esc(c.name_th)}</option>`).join(''));
  $('nPlatform').insertAdjacentHTML('beforeend', PLATFORMS.map(p => `<option>${esc(p)}</option>`).join(''));
  fillCauses();
  /* ยังไม่ได้รัน 30 — เอาสวิตช์ออกไปเลย ดีกว่าให้กดแล้วพัง */
  if (!HAS_ORIGIN) document.querySelectorAll('.oswitch').forEach(el => { el.hidden = true; });
  $('nCaseType').innerHTML  = opts(CASE_TYPE, 'claim');
  $('nWarranty').innerHTML  = opts(WARRANTY, 'unknown');
  $('nWarranty').addEventListener('change', showWarrantyBox);
  showWarrantyBox();
  $('rcPart').insertAdjacentHTML('beforeend', S.parts.map(p => `<option value="${esc(p.part_no)}">${esc(p.part_no)} · ${esc(p.name)}</option>`).join(''));

  $('gSearch').addEventListener('input', () => {
    S.pg.jobs = 1;
    if (!$('p-jobs').classList.contains('on')) goPage('jobs');
    renderJobs();
  });
  $('fTech').addEventListener('change', () => { S.pg.jobs = 1; renderJobs(); });
  $('fAdmin').addEventListener('change', () => { S.pg.jobs = 1; renderJobs(); });
  $('cSearch').addEventListener('input',  () => { S.pg.cust = 1; renderCust(); });
  $('pSearch').addEventListener('input',  () => { S.pg.parts = 1; renderParts(); });
  try { S.per = Number(localStorage.getItem('repair_per')) || 30; } catch(e){}

  /* ด่านตรวจสิทธิ์ — ต้องผ่านก่อนถึงจะเห็นอะไรในหน้านี้ */
  if (!await canModule(sb, 'repair')) return blockModule('ระบบรับซ่อมเครื่องมือ');

  // ช่างเปิดมาที่รายการงานของตัวเองเลย
  if (ME.role === 'tech' && ME.techId) $('fTech').value = ME.techId;

  $('gate').hidden = true; $('app').hidden = false;
  $('bootErrBox').hidden = true;
  authNotice('');
  try { clearIntake(); } catch(e){ console.warn('clearIntake', e); }
  try { goPage(allow[0]); } catch(e){ console.warn('goPage', e); }
  try { await reloadAll(); } catch(e){ fail(e); }

  // การจัดการ session ย้ายไปที่ bindAuthEvents() ตอน boot แล้ว
  // ผูกที่นี่ไม่ได้ เพราะ startApp ถูกเรียกซ้ำได้ → listener ซ้อนกันหลายตัว
}

async function reloadAll(){
  try {
    const [jobs, custs, stock, adj, sho, dq] = await Promise.all([
      window.__pageAll(() => sb.from('v_jobs').select('*').order('received_at', { ascending:false })),
      window.__pageAll(() => sb.from('repair_customers').select('*').order('name')),
      window.__pageAll(() => sb.from('v_parts_stock').select('*')),
      sb.from('v_adjust_requests').select('*').eq('status','pending'),
      sb.from('v_shortage_open').select('*'),
      sb.from('v_dispatch_queue').select('*')
    ]);
    S.jobs = jobs; S.custs = custs; S.stock = stock;
    /* สองอันนี้มาจาก 13_update.sql — ยังไม่รันก็ใช้ระบบต่อได้ */
    S.adjust   = adj.error ? [] : (adj.data || []);
    S.shortage = sho.error ? [] : (sho.data || []);
    S.queue    = dq.error  ? [] : (dq.data  || []);
    if (adj.error) console.warn('v_adjust_requests', adj.error.message);
    $('connSt').textContent = `● เชื่อมต่อแล้ว · ${jobs.length} ใบงาน`;
    renderDash(); renderChips(); renderJobs(); renderCust(); renderAdjust(); renderBell();
  } catch(e){
    const m = (e?.message || '') + '';
    $('connSt').textContent = '● โหลดข้อมูลไม่สำเร็จ';
    $('connSt').style.color = '#f0928c';
    if (/permission denied|not exist|does not exist/i.test(m)){
      toast('❌ ฐานข้อมูลยังไม่พร้อม — ' + m + ' · รัน diagnose2.sql เพื่อดูสาเหตุ', true);
    } else fail(e);
  }
}

/* =====================================================================
   แดชบอร์ด
   ===================================================================== */
function stepCounts(){
  const c = {1:0,2:0,3:0,4:0,5:0,6:0};
  inRange().forEach(j => { const s = stepOf(j.status); if (s) c[s]++; });
  return c;
}
function openJobs(){ return inRange().filter(j => !CLOSED.includes(j.status)); }

const RANGES = [['today','วันนี้'],['week','สัปดาห์นี้'],['month','เดือนนี้'],['all','ทั้งหมด']];
function rangeStart(){
  const t = new Date(); t.setHours(0,0,0,0);
  if (S.range === 'today') return t;
  if (S.range === 'week')  { const d = new Date(t); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d; }
  if (S.range === 'month') return new Date(t.getFullYear(), t.getMonth(), 1);
  return null;
}
function inRange(){
  const s = rangeStart();
  return s ? S.jobs.filter(j => new Date(j.received_at) >= s) : S.jobs;
}
function setRange(k){ S.range = k; renderDash(); renderChips(); }

function renderStepBar(el){
  const c = stepCounts();
  el.innerHTML = STEPS.map((s,i) =>
    `${i ? '<span class="stpline" aria-hidden="true"></span>' : ''}
     <span class="stp"><span class="b" style="background:${s.c};color:${s.ink}">${s.n}</span>
     <span class="n">${esc(s.label)}</span><span class="q">${c[s.n]}</span></span>`).join('');
}

function renderDash(){
  $('rangeChips').innerHTML = RANGES.map(([k,l]) =>
    `<button class="chip ${S.range===k?'on':''}" onclick="setRange('${k}')">${l}</button>`).join('');
  renderStepBar($('stepBar')); renderStepBar($('stepBar2'));
  const sh = $('stepHint');
  if (sh) sh.innerHTML = 'ขั้นตอนปัจจุบัน: <b style="color:var(--navy)">1/6 รับเครื่อง</b> — ' + esc(STEPS[0].hint) + ' · มอบหมายช่างในขั้นที่ 3';

  const scope = inRange(), open = openJobs();
  const today = new Date().toISOString().slice(0,10);
  const doneToday = scope.filter(j => (j.finished_at||'').slice(0,10) === today).length;
  const overdue = open.filter(j => j.days_overdue > 0);
  const waitParts = scope.filter(j => j.status === 'wait_parts').length;
  const unassigned = open.filter(j => !j.technician_id).length;
  const dl = scope.filter(j => j.delivered_at && j.received_at);
  const avg = dl.length
    ? (dl.reduce((s,j) => s + (new Date(j.delivered_at) - new Date(j.received_at))/864e5, 0) / dl.length).toFixed(1)
    : '—';

  const kpi = (a) => a.map(([c,e,l,n,u]) =>
    `<div class="kpi ${c}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
     <div class="n">${n}<small>${u||''}</small></div></div>`).join('');

  $('dashKpi').innerHTML = kpi([
    ['na','📋','งานทั้งหมด',   scope.length,   'งาน'],
    ['nb','⏳','งานค้าง',      open.length,    'งาน'],
    ['nc','✅','เสร็จวันนี้',   doneToday,      'งาน'],
    ['nd','🚨','เกินกำหนด',    overdue.length, 'งาน'],
    ['ne','📦','รออะไหล่',     waitParts,      'งาน'],
    ['na','⏱️','เฉลี่ยเวลาซ่อม', avg,          'วัน']
  ]);
  $('jobKpi').innerHTML = kpi([
    ['na','📋','ใบงานทั้งหมด',  S.jobs.length,  'ใบ'],
    ['nb','⏳','งานค้าง',       S.jobs.filter(j => !CLOSED.includes(j.status)).length, 'ใบ'],
    ['nd','🚨','เกินกำหนด',     S.jobs.filter(j => !CLOSED.includes(j.status) && j.days_overdue > 0).length, 'ใบ'],
    ['ne','📦','รออะไหล่',      S.jobs.filter(j => j.status === 'wait_parts').length, 'ใบ'],
    ['nb','👤','ยังไม่มอบหมาย', S.jobs.filter(j => !CLOSED.includes(j.status) && !j.technician_id).length, 'ใบ']
  ]);

  // การ์ด 6 ขั้นตอน
  const sc = stepCounts();
  $('stepCards').innerHTML = STEPS.map(s =>
    `<div class="stepcard" style="border-left:4px solid ${s.c}">
       <div class="h">${s.n}. ${esc(s.label)}</div>
       <div class="n" style="color:${s.n>=4?s.c:'var(--navy)'}">${sc[s.n]}</div>
       <div class="d">${esc(s.hint)}</div></div>`).join('');

  // โดนัท (เฉพาะงานที่ยังไม่ปิด)
  const oc = {1:0,2:0,3:0,4:0,5:0,6:0};
  open.forEach(j => { const s = stepOf(j.status); if (s) oc[s]++; });
  const items = STEPS.map(s => ({ label:s.n + '. ' + s.label, value:oc[s.n], color:s.c }));
  const tot = items.reduce((a,b) => a + b.value, 0) || 1;
  $('donutWrap').innerHTML = donutSVG(items) +
    `<div class="lg">${items.map(i =>
      `<div class="lgi"><span class="sw" style="background:${i.color}"></span>
       <span class="nm">${esc(i.label)}</span><span class="v">${i.value}</span>
       <span class="p">${Math.round(i.value/tot*100)}%</span></div>`).join('')}</div>`;

  // ผลงานแยกตามช่าง
  const names = [], d1 = [], d2 = [], d3 = [];
  S.techs.forEach(t => {
    const mine = scope.filter(j => j.technician_id === t.id);
    names.push(t.nickname || t.full_name);
    d1.push(mine.filter(j => !CLOSED.includes(j.status)).length);
    d2.push(mine.filter(j => CLOSED.includes(j.status)).length);
    d3.push(mine.filter(j => j.days_overdue > 0).length);
  });
  $('techChart').innerHTML = names.length ? groupedBarSVG(names, [
    { name:'งานค้าง',   data:d1, color:'#C98A12' },
    { name:'เสร็จแล้ว', data:d2, color:'#12875C' },
    { name:'เกินกำหนด', data:d3, color:'#BE3A32' }
  ], boxW('techChart'), 220) : '<div class="empty">ยังไม่มีช่างในระบบ</div>';

  // เกินกำหนด
  const od = overdue.slice().sort((a,b) => b.days_overdue - a.days_overdue);
  $('odCount').textContent = od.length + ' ใบ';
  $('odEmpty').style.display = od.length ? 'none' : 'block';
  $('tblOverdue').querySelector('tbody').innerHTML = od.slice(0,12).map(j =>
    `<tr>
      <td class="mono"><b>${esc(jobRef(j))}</b></td><td>${esc(j.customer_name || '—')}</td>
      <td>${esc([j.brand,j.model].filter(Boolean).join(' ') || '—')}</td>
      <td>${dth(j.due_date)}</td>
      <td class="num"><span class="pill tag-crit">${j.days_overdue} วัน</span></td>
      <td class="num noprint"><button class="btn sm p" onclick="openJob('${j.id}')">✏️ แก้ไข</button></td></tr>`).join('');

  // อาการเสียบ่อย 90 วัน
  const since = Date.now() - 90*864e5, cnt = {};
  scope.filter(j => new Date(j.received_at).getTime() >= since)
        .forEach(j => { const k = j.symptom_name || 'ยังไม่ระบุ'; cnt[k] = (cnt[k]||0) + 1; });
  const tot2 = Object.values(cnt).reduce((a,b) => a+b, 0) || 1;
  const top = Object.entries(cnt).sort((a,b) => b[1]-a[1]).slice(0,5)
    .map(([k,v]) => ({ label:k, value:v, sub:Math.round(v/tot2*100) + '%', color:'#2E75B6' }));
  $('symChart').innerHTML = hBarsSVG(top, boxW('symChart'));
}

/* =====================================================================
   ใบงาน + ชิปกรอง
   ===================================================================== */
function filterCounts(){
  const open = openJobs();
  const c = {
    all:        S.jobs.length,
    open:       open.length,
    overdue:    open.filter(j => j.days_overdue > 0).length,
    wait_parts: S.jobs.filter(j => j.status === 'wait_parts').length,
    unassigned: open.filter(j => !j.technician_id).length,
    ready:      S.jobs.filter(j => j.status === 'ready').length,
    waiting:    S.jobs.filter(j => j.status === 'awaiting_parcel').length,
    unknown:    S.jobs.filter(j => j.status === 'unknown_parcel').length,
    notnotified:S.jobs.filter(j => j.status === 'awaiting_parcel' && !j.notified_at).length,
    unbox:      S.jobs.filter(unboxPending).length,
    clip:       S.jobs.filter(j => j.clip_waiting).length,
    unboxlate:  S.jobs.filter(j => unboxPending(j) && j.unbox_days_left < 0).length,
    nowarranty: open.filter(j => j.warranty_case === 'out_warranty').length,
    nocondition:open.filter(j => !j.warranty_case || j.warranty_case === 'unknown').length,
    mine:       S.jobs.filter(j => (j.admin_name || '').trim() === who()).length,
    internal:   S.jobs.filter(isInternal).length,
    external:   S.jobs.filter(j => !isInternal(j)).length
  };
  const sc = stepCounts();
  STEPS.forEach(s => c['step' + s.n] = sc[s.n]);
  return c;
}
/** รายชื่อร้านที่เคยกรอกมาแล้ว — เอามาเป็นตัวช่วยเลือก จะได้ไม่พิมพ์ผิดคนละแบบ */
function refreshShopList(){
  const el = $('shopList');
  if (!el) return;
  const names = [...new Set((S.jobs || []).map(j => (j.shop_name || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'th'));
  el.innerHTML = names.map(n => `<option value="${esc(n)}"></option>`).join('');
}

function renderChips(){
  renderUnbox();
  refreshShopList();
  refreshAdminList();
  const c = filterCounts();
  const A = [['all','ทั้งหมด'],['open','งานค้าง'],['waiting','รอลูกค้าส่งของ'],['overdue','เกินกำหนด'],
             ['wait_parts','รออะไหล่'],['unassigned','ยังไม่มอบหมาย'],['ready','พร้อมส่งมอบ'],
             ['nowarranty','นอกประกัน'],['nocondition','ยังไม่ระบุประกัน'],
             ['unknown','พัสดุไม่ทราบที่มา'],['notnotified','ยังไม่แจ้งลูกค้า'],
             ['unbox','📦 กล่องค้างแกะ'],['unboxlate','🚨 เกินกำหนดแกะ'],
             ['clip','📹 รอคลิปจากลูกค้า'],
             ['mine','⭐ เคสของฉัน'],
             ['internal','🟢 เคสในระบบ'],['external','🟠 เคสนอกระบบ']];
  $('chipsA').innerHTML = A.map(([k,l]) =>
    `<button class="chip ${S.filter===k?'on':''}" onclick="setFilter('${k}')">${l}<span class="c">${c[k]}</span></button>`).join('');
  $('chipsB').innerHTML = STEPS.map(s =>
    `<button class="chip ${S.filter==='step'+s.n?'on':''}" onclick="setFilter('step${s.n}')">
       <span class="pill" style="background:${s.c};color:${s.ink};padding:1px 7px">${s.n}</span>${esc(s.label)}
       <span class="c">${c['step'+s.n]}</span></button>`).join('');
}
function setFilter(k){ S.filter = k; S.pg.jobs = 1; renderChips(); renderJobs(); }

function matchFilter(j){
  const f = S.filter;
  if (f === 'all')        return true;
  if (f === 'open')       return !CLOSED.includes(j.status);
  if (f === 'overdue')    return !CLOSED.includes(j.status) && j.days_overdue > 0;
  if (f === 'wait_parts') return j.status === 'wait_parts';
  if (f === 'unassigned') return !CLOSED.includes(j.status) && !j.technician_id;
  if (f === 'ready')      return j.status === 'ready';
  if (f === 'waiting')    return j.status === 'awaiting_parcel';
  if (f === 'unknown')    return j.status === 'unknown_parcel';
  if (f === 'notnotified')return j.status === 'awaiting_parcel' && !j.notified_at;
  if (f === 'clip')       return !!j.clip_waiting;
  if (f === 'mine')       return (j.admin_name || '').trim() === who();
  if (f === 'internal')   return isInternal(j);
  if (f === 'external')   return !isInternal(j);
  if (f === 'unbox')      return unboxPending(j);
  if (f === 'unboxlate')  return unboxPending(j) && j.unbox_days_left < 0;
  if (f === 'nowarranty') return !CLOSED.includes(j.status) && j.warranty_case === 'out_warranty';
  if (f === 'nocondition')return !CLOSED.includes(j.status) && (!j.warranty_case || j.warranty_case === 'unknown');
  if (f.startsWith('step')) return stepOf(j.status) === Number(f.slice(4));
  return true;
}

function renderJobs(){
  const q = val('gSearch').toLowerCase(), tc = val('fTech'), ad = val('fAdmin');
  const rows = S.jobs.filter(j => {
    if (!matchFilter(j)) return false;
    if (tc && j.technician_id !== tc) return false;
    if (ad && (j.admin_name || '').trim() !== ad) return false;
    if (q && ![j.job_no,j.customer_name,j.serial_no,j.sku,j.model,j.brand,j.tool_type,j.symptom,
               j.order_no,j.tracking_in,j.tracking_out,j.platform,j.shop_name,j.admin_name]
      .join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
  $('jobCount').textContent = rows.length + ' รายการ';
  $('jobsEmpty').style.display = rows.length ? 'none' : 'block';
  const m = paginate(rows, 'jobs');
  $('pgJobs').innerHTML = pagerHTML(m, 'jobs');
  $('tblJobs').querySelector('tbody').innerHTML = m.slice.map(j => {
    const s = stepOf(j.status), sd = STEPS[s-1];
    const late = j.days_overdue > 0;
    return `<tr class="click ${S.seen === j.id ? 'seen' : ''}" tabindex="0"
      onclick="openJob('${j.id}')"
      onkeydown="if(event.key==='Enter'){event.preventDefault();openJob('${j.id}')}">
      <td class="mono"><b>${esc(jobRef(j))}</b>
        <div class="sub2">${esc(jobRefKind(j))} · ${esc(dth(j.received_at))}</div></td>
      <td>${unboxPending(j) ? `<span class="pill ${j.unbox_days_left < 0 ? 'tag-crit' : 'tag-warn'}">📦 ${j.unbox_days_left < 0 ? 'เกินกำหนดแกะ' : 'รอแกะกล่อง'}</span> ` : ''}
        ${j.clip_waiting ? '<span class="pill tag-warn">📹 รอคลิป</span> ' : ''}
        ${j.status === 'unknown_parcel'
        ? '<span class="pill st-unknown">ยังไม่ทราบเจ้าของ</span>'
        : esc(j.customer_name || '—')}
        <div class="sub2">${esc(j.customer_phone || (j.tracking_in ? 'พัสดุ ' + j.tracking_in : ''))}</div></td>
      <td>${esc([j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || '—')}
        <div class="sub2">${esc(j.serial_no || '')}</div></td>
      <td>${esc((j.symptom||'').slice(0,34))}${(j.symptom||'').length>34?'…':''}
        ${causeName(j) ? `<div class="sub2">สาเหตุ: ${esc(causeName(j))}</div>` : ''}</td>
      <td>${esc(j.admin_name || '—')}
        ${isInternal(j) ? '<div class="sub2">🟢 เคสในระบบ</div>' : ''}</td>
      <td>${j.tech_name
        ? esc(j.tech_name) + (/อัตโนมัติ/.test(j.assign_note||'') ? ''
            : '<div class="sub2">หัวหน้าเลือกเอง</div>')
        : (j.severity
            ? '<span class="pill tag-warn">รอระบบจ่าย</span>'
            : '<span class="pill st0">ยังไม่ระบุระดับ</span>')}</td>
      <td><span class="pill st${s||0}"><span class="d"></span>${STATUS[j.status]||j.status}</span>
        ${j.warranty_case && j.warranty_case !== 'unknown'
          ? `<div style="margin-top:3px"><span class="pill ${WARRANTY[j.warranty_case].cls}">${esc(WARRANTY[j.warranty_case].l)}</span></div>` : ''}
        ${sd ? `<div class="sub2">ขั้น ${s}/6 · ${esc(sd.label)}</div>` : ''}</td>
      <td ${late?'style="color:var(--crit);font-weight:700"':''}>${dth(j.due_date)}
        ${late ? `<div><span class="pill tag-crit">เกิน ${j.days_overdue} วัน</span></div>` : ''}
        ${j.severity ? `<div class="sub2">${esc(SEVERITY[j.severity])}</div>`
                     : (j.assigned_at ? '' : '<div class="sub2">ประมาณการ</div>')}
        ${Number(j.adjust_pending) > 0 ? '<div><span class="pill tag-warn">รออนุมัติอะไหล่</span></div>' : ''}
        ${Number(j.shortage_count) > 0 ? '<div><span class="pill tag-crit">อะไหล่ขาด</span></div>' : ''}</td>
      <td class="num"><b>฿${money(j.total_cost)}</b></td>
    </tr>`;
  }).join('');
}

/* =====================================================================
   รับเครื่อง
   ===================================================================== */
/** กล่องสรุปความรับผิดชอบค่าใช้จ่าย ตาม SOP หน้า 4 */
function warrantyBox(code){
  const w = WARRANTY[code] || WARRANTY.unknown;
  if (code === 'unknown') return '<div class="box-warn">⚠️ ยังไม่ระบุเงื่อนไขประกัน — ต้องเลือกก่อนเริ่มซ่อม</div>';
  const cls = code === 'within7' ? 'box-ok' : code === 'in_warranty' ? 'box-warn' : 'box-crit';
  const who = v => v === 'บริษัท'
    ? '<b style="color:var(--good)">บริษัทออก</b>'
    : '<b style="color:var(--crit)">ลูกค้าออก</b>';
  return `<div class="${cls}"><b>${esc(w.l)}</b>
    <div style="margin-top:6px;display:flex;gap:16px;flex-wrap:wrap;font-size:13px">
      <span>🚚 ค่าส่งขาเข้า: ${who(w.shipIn)}</span>
      <span>📦 ค่าส่งขากลับ: ${who(w.shipOut)}</span>
      <span>🔩 ค่าอะไหล่: ${who(w.parts)}</span>
      <span>🔧 ค่าแรง: ${who(w.labor)}</span>
    </div>
    <div class="sub2" style="margin-top:5px">${w.note || ''}</div>
    ${w.advance ? `<div class="sub2" style="margin-top:4px">
      💰 เคสนี้จะเข้ารายการ <b>"ค่าส่งรอเบิกคืนลูกค้า"</b> ให้เอง เมื่อกรอกค่าส่งขาเข้าแล้ว —
      CS ดูรวมได้ที่ รายงาน → 💰 ค่าส่งเบิกคืน</div>` : ''}
    <div class="muted" style="font-size:12px;margin-top:3px">
      ค่าส่งเป็นต้นทุนของฝ่ายที่รับผิดชอบ ไม่ใช่รายได้ของใคร</div></div>`;
}
function showWarrantyBox(){
  /* เคสในระบบไม่ได้ส่งซ่อม กล่องอธิบายใครออกค่าอะไรจึงไม่เกี่ยว */
  $('warnBox').innerHTML = val('nOrigin') === 'internal' ? '' : warrantyBox(val('nWarranty'));
}

/** เติมดรอปดาวน์สาเหตุ ใช้ทั้งฟอร์มรับเครื่องและในใบงาน */
function fillCauses(){
  const el = $('nCause'); if (!el) return;
  el.innerHTML = S.causes.length
    ? '<option value="">— เลือกสาเหตุ —</option>' +
      S.causes.map(c => `<option value="${esc(c.code)}">${esc(c.label)}</option>`).join('')
    : '<option value="">— ยังไม่มีรายการ (รัน 30_cs_feedback.sql) —</option>';
}

/** ตัวเลือกสาเหตุสำหรับ select ในใบงาน — เก็บของเก่าที่ถูกปิดไปแล้วไว้ด้วย */
function causeOpts(cur){
  const list = S.causes.slice();
  if (cur && !list.some(c => c.code === cur)) list.push({ code:cur, label:cur + ' (ปิดใช้แล้ว)' });
  return '<option value="">— ไม่ระบุ —</option>' + list.map(c =>
    `<option value="${esc(c.code)}" ${c.code === cur ? 'selected' : ''}>${esc(c.label)}</option>`).join('');
}

/**
 * สลับ เคสในระบบ / นอกระบบ ในฟอร์มรับเครื่อง
 * เคสในระบบ: ไม่ถามประเภทเคส/เงื่อนไขประกัน (ไม่ได้ส่งซ่อม) — ถามสาเหตุแทน
 */
function setOrigin(v){
  const int_ = v === 'internal';
  $('nOrigin').value = int_ ? 'internal' : 'external';
  $('nOrgInt').classList.toggle('on', int_);
  $('nOrgExt').classList.toggle('on', !int_);
  $('nBoxCase').hidden     = int_;
  $('nBoxWarranty').hidden = int_;
  $('nBoxCause').hidden    = !int_;
  showWarrantyBox();
}

/** ชื่อแอดมินที่เคยใช้ — เอาไว้เติมให้ในฟอร์มและใช้ทำตัวกรอง */
function adminNames(){
  return [...new Set((S.jobs || []).map(j => (j.admin_name || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'th'));
}
function refreshAdminList(){
  const names = adminNames();
  const dl = $('adminList');
  if (dl) dl.innerHTML = names.map(n => `<option value="${esc(n)}"></option>`).join('');
  const sel = $('fAdmin');
  if (sel){
    const cur = sel.value;
    sel.innerHTML = '<option value="">แอดมิน</option>'
      + (who() && names.includes(who()) ? `<option value="${esc(who())}">⭐ เคสของฉัน (${esc(who())})</option>` : '')
      + names.map(n => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
    sel.value = cur;
  }
}

async function lookupCustomer(){
  const ph = val('nPhone');
  if (!ph) return toast('ใส่เบอร์โทรก่อน', true);
  const c = S.custs.find(x => (x.phone||'') === ph);
  if (!c){ $('nCustId').value = ''; $('custHint').textContent = 'ไม่พบลูกค้าเดิม — จะสร้างรายการใหม่ให้ตอนบันทึก'; return; }
  $('nCustId').value = c.id; $('nCustName').value = c.name || '';
  $('nAddress').value = c.address || '';
  const n = S.jobs.filter(j => j.customer_id === c.id).length;
  $('custHint').innerHTML = `✅ พบลูกค้าเดิม — <b>เคยซ่อมมาแล้ว ${n} ครั้ง</b>`;
}

function clearIntake(){
  ['nSerial','nToolType','nBrand','nModel','nPhone','nCustName','nAddress','nSymptom','nSku','nNote','nShop','nCustId',
   'nOrder','nTrackIn','nAdmin'].forEach(id => $(id).value = '');
  $('nSymCat').value = ''; $('nPlatform').value = ''; $('nArrived').value = '';
  $('nCaseType').value = 'claim'; $('nWarranty').value = 'unknown';
  if ($('nCause')) $('nCause').value = '';
  setOrigin('external');
  const t = new Date(), d = n => String(n).padStart(2,'0');
  const iso = x => x.getFullYear() + '-' + d(x.getMonth()+1) + '-' + d(x.getDate());
  $('nRecv').value = iso(t);
  $('nDue').value  = iso(new Date(t.getTime() + 3*864e5));
  $('custHint').textContent = '';
  INTAKE_FILES = []; renderStaged();
  previewJobNo();
}

/** โชว์เลขใบงานที่กำลังจะได้ ก่อนกดบันทึก */
async function previewJobNo(){
  const el = $('nextJobNo'); if (!el) return;
  try {
    const y = new Date().getFullYear();
    const { data } = await sb.from('job_counter').select('last_no').eq('yr', y).maybeSingle();
    el.textContent = 'REP-' + y + '-' + String((data?.last_no || 0) + 1).padStart(4,'0');
  } catch(e){ el.textContent = 'REP-' + new Date().getFullYear() + '-????'; }
}

async function saveJob(){
  /* กล่องมาถึงแต่ยังไม่ได้แกะ = ยังไม่รู้เจ้าของ ไม่รู้เครื่อง ไม่รู้อาการ
     จึงไม่บังคับช่องพวกนี้ — ขอแค่มีอะไรสักอย่างที่ใช้ตามเรื่องกลับมาได้ */
  const hasCust = val('nCustName') || val('nPhone');
  const hasRef  = val('nTrackIn') || val('nOrder');
  if (!hasCust && !hasRef)
    return toast('ต้องมีอย่างน้อย 1 อย่าง: ชื่อลูกค้า · เบอร์โทร · เลขพัสดุขาเข้า · เลขคำสั่งซื้อ', true);

  const miss = [!val('nToolType') && 'ประเภทเครื่อง',
                !val('nSymptom')  && 'อาการเสีย'].filter(Boolean);
  if (miss.length){
    const okGo = await confirmModal('ยังไม่ได้กรอก ' + miss.join(' และ '),
      'ถ้ายังไม่ได้แกะกล่อง ข้ามไปก่อนได้ — กลับมาเติมทีหลังในใบงานได้เลย\n\n' +
      'สร้างใบงานเลยไหม?', { ok:'สร้างใบงาน', danger:false });
    if (!okGo) return;
  }

  const internal = val('nOrigin') === 'internal';
  if (internal && S.causes.length && !val('nCause'))
    return toast('เคสในระบบต้องเลือกสาเหตุก่อน', true);

  try {
    let cid = val('nCustId');
    if (!cid && hasCust){
      const { data, error } = await sb.from('repair_customers').insert({
        /* ไม่ใส่ชื่อมา ใช้เบอร์เป็นชื่อไปก่อน — ค้นเจอ แก้ทีหลังได้ */
        name: val('nCustName') || val('nPhone'),
        phone: val('nPhone') || null, address: val('nAddress') || null
      }).select('id').single();
      if (error) throw error;
      cid = data.id;
    }
    const rec = val('nRecv');
    const { data: job, error } = await sb.from('repair_jobs').insert({
      customer_id: cid || null,          // ไม่มีลูกค้า ต้องส่ง null ไม่ใช่ค่าว่าง (uuid รับค่าว่างไม่ได้)
      tool_type: val('nToolType') || null, brand: val('nBrand') || null,
      model: val('nModel') || null, serial_no: val('nSerial') || null,
      symptom: val('nSymptom') || null, symptom_category: val('nSymCat') || null,
      sku: val('nSku').toUpperCase() || null,
      intake_note: val('nNote') || null,
      order_no:      val('nOrder')    || null,
      tracking_in:   val('nTrackIn')  || null,
      platform:      val('nPlatform') || null,
      shop_name:     val('nShop')     || null,
      case_type:     val('nCaseType')  || 'claim',
      warranty_case: internal ? 'unknown' : val('nWarranty'),
      ...(HAS_ORIGIN ? { case_origin: internal ? 'internal' : 'external',
                         cause_code:  internal ? (val('nCause') || null) : null } : {}),
      admin_name:    val('nAdmin') || who(),
      /* ไม่รู้เจ้าของ = พัสดุไม่ทราบที่มา (SOP A9.2) ตามเรื่องต่อด้วยปุ่ม "พบเจ้าของแล้ว" */
      status: !cid ? 'unknown_parcel'
            : val('nTrackIn') ? 'received' : 'awaiting_parcel',
      arrived_at:  val('nArrived') || null,
      received_at: rec ? new Date(rec + 'T09:00:00').toISOString() : undefined,
      due_date: val('nDue') || null, created_by: who()
    }).select('id, job_no').single();
    if (error) throw error;
    toast(cid ? '✅ สร้างใบงาน ' + job.job_no + ' แล้ว'
              : '✅ สร้างใบงาน ' + job.job_no + ' แบบยังไม่รู้เจ้าของ — กด "พบเจ้าของแล้ว" เมื่อรู้ข้อมูล');

    if (INTAKE_FILES.length && uploadOn()){
      toast(`⏳ กำลังอัปโหลดรูป ${INTAKE_FILES.length} รูป…`);
      const n = await uploadPhotos(INTAKE_FILES, job.id, job.job_no, 'before');
      if (n) toast(`✅ ใบงาน ${job.job_no} · อัปโหลดรูป ${n} รูปแล้ว`);
    }
    clearIntake();
    await reloadAll();
    openJob(job.id);
  } catch(e){ fail(e); }
}

/* =====================================================================
   ใบงาน (modal)
   ===================================================================== */
function closeJob(){ S.peek = null; goPage('jobs'); renderJobs();
  const r = document.querySelector('#tblJobs tbody tr.seen');
  if (r) r.scrollIntoView({ block:'nearest' });
}

async function openJob(id){
  try {
    const [j, lines, photos, slog] = await Promise.all([
      sb.from('v_jobs').select('*').eq('id', id).single(),
      sb.from('repair_parts_used').select('*, parts_master(part_no,name)').eq('job_id', id).order('created_at'),
      sb.from('repair_photos').select('*').eq('job_id', id).order('created_at'),
      sb.from('repair_status_log').select('*').eq('job_id', id).order('created_at')
    ]);
    if (j.error) throw j.error;
    S.job = j.data; S.lines = lines.data || []; S.photos = photos.data || [];
    S.slog = slog.data || []; S.seen = id; S.peek = null;
    goPage('job');
    renderJobPage();
  } catch(e){ fail(e); }
}

/* ---------- แถบความคืบหน้า 6 ขั้น ---------- */
function progBar(cur){
  return STEPS.map((s,i) => {
    let st = s.n < cur ? 'done' : s.n === cur ? 'now' : 'todo';
    const can = s.n <= cur;
    if (S.peek === s.n) st += ' peek';
    return `${i ? `<span class="pline ${s.n <= cur ? 'done' : ''}"></span>` : ''}
      <span class="pstep ${st} ${can ? 'can' : ''}" ${can ? `onclick="peekStep(${s.n})"` : ''}
        title="${can ? 'ดูสิ่งที่บันทึกไว้ในขั้นนี้' : 'ยังไม่ถึงขั้นนี้'}">
        <span class="b">${st.startsWith('done') ? '✓' : s.n}</span>
        <span class="n">${esc(s.label)}</span></span>`;
  }).join('');
}

/** กดเลขขั้นตอน → ดูย้อนหลังว่าบันทึกอะไรไว้ */
function peekStep(nStep){
  const cur = stepOf(S.job.status) || 1;
  S.peek = (nStep === cur || S.peek === nStep) ? null : nStep;
  renderJobPage();
}

/** เวลาที่เข้าสู่ขั้นนั้น + ใครทำ */
function stepLog(nStep){
  const sts = STEPS[nStep-1].st;
  return (S.slog || []).filter(l => sts.includes(l.to_status));
}

/* ---------- กล่องรูปตามช่วง ---------- */
function photoBox(phase, label, max){
  const list = S.photos.filter(x => x.phase === phase);
  return `<div class="phgrp"><div class="t">${label}<span class="c">${list.length}/${max}</span></div>
    <div class="phs">
      ${list.map(p => `<div class="ph">
        <img src="${photoUrl(p.storage_key)}" alt="${label}" loading="lazy"
             onclick="window.open('${photoOpen(p.storage_key)}','_blank')">
        <button class="x noprint" onclick="deletePhoto('${p.id}','${p.storage_key}')" title="ลบรูป">✕</button></div>`).join('')}
      ${uploadOn() && list.length < max ? `<label class="ph add noprint" title="เลือกรูปจากเครื่อง">＋
        <input type="file" accept="image/*" multiple hidden onchange="addPhotos(this,'${phase}')"></label>
        <label class="ph add noprint" title="ถ่ายรูปเลย" style="font-size:19px">📷
        <input type="file" accept="image/*" capture="environment" hidden onchange="addPhotos(this,'${phase}')"></label>` : ''}
    </div></div>`;
}

/* =====================================================================
   หน้าใบงาน — โชว์เฉพาะฟอร์มของขั้นที่กำลังทำ
   ===================================================================== */
function renderJobPage(){
  const j = S.job, cur = stepOf(j.status) || 1, sd = STEPS[cur-1];
  const view = S.peek || cur, vs = STEPS[view-1];
  $('pgTitle').textContent = 'รายละเอียดงานซ่อม';
  $('pgSub').textContent = `ขั้นตอน ${cur}/6 · ${sd.label}`;
  const late = j.days_overdue > 0;
  const pc = S.lines.reduce((s,l) => s + Number(l.line_total||0), 0);
  const hist = S.jobs.filter(x => x.customer_id === j.customer_id && x.id !== j.id).length;

  $('jobWrap').innerHTML = `
  <div class="card noprint"><div class="cb">
    <div class="prog">${progBar(cur)}</div>
    <div class="sub2" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line2)">
      ขั้นตอนปัจจุบัน: <b style="color:var(--navy)">${cur}/6 ${esc(sd.label)}</b> · ${esc(vs.hint)}</div>
  </div></div>

  <div class="card"><div class="cb" style="display:flex;align-items:center;gap:11px;flex-wrap:wrap;padding:13px 18px">
    <button class="btn sm noprint" onclick="closeJob()" title="กลับรายการใบงาน">←</button>
    <span style="line-height:1.2">
      <span class="mono" style="font-size:18px;font-weight:800;color:var(--navy);display:block">${esc(jobRef(j))}</span>
      <span class="sub2" style="font-size:11.5px">${esc(jobRefKind(j))}${
        jobRefKind(j) === 'เลขระบบ' ? '' : ' · ระบบ ' + esc(j.job_no)}</span>
    </span>
    <span class="pill st${cur}"><span class="d"></span>${STATUS[j.status]||j.status}</span>
    ${late ? `<span class="pill tag-crit">เกินกำหนด ${j.days_overdue} วัน</span>` : ''}
    ${j.warranty_case && j.warranty_case !== 'unknown'
      ? `<span class="pill ${WARRANTY[j.warranty_case].cls}">${esc(WARRANTY[j.warranty_case].l)}</span>` : ''}
    ${j.status === 'rejected' && j.reject_reason
      ? `<span class="pill tag-crit" title="${esc(j.reject_reason)}">ไม่รับเคลม</span>` : ''}
    ${j.clip_waiting
      ? `<span class="pill tag-warn" title="${esc(j.clip_note || '')}">
           📹 รอคลิป ${j.clip_days_waiting > 0 ? j.clip_days_waiting + ' วัน' : 'วันนี้'}</span>
         <button class="btn sm g noprint" onclick="clipReceived()">✅ ได้คลิปแล้ว</button>` : ''}
    <span class="sp" style="flex:1"></span>
    ${CLOSED.includes(j.status) && isBoss() && (j.photo_count > 0)
      ? `<button class="btn sm dn noprint" onclick="clearPhotos()"
           title="ลบรูปทั้งหมดของเคสนี้เพื่อประหยัดพื้นที่ Drive">🧹 เคลียร์รูป (${j.photo_count})</button>` : ''}
    <div style="display:flex;align-items:center;gap:9px">
      <div class="avatar" style="width:32px;height:32px;font-size:12px">${esc((j.tech_name||'—').slice(0,2))}</div>
      <div style="line-height:1.3"><div class="sub2">ช่างผู้รับผิดชอบ</div>
        <b>${esc(j.tech_name || 'ยังไม่มอบหมาย')}</b></div>
    </div>
  </div></div>

  <div class="jgrid">
    <div class="card">
      <h3><span class="jnum">1</span> ข้อมูลรับเครื่อง</h3>
      <div class="cb">
        <div class="kv"><span class="k">ลูกค้า</span><span class="v">${esc(j.customer_name||'—')}</span></div>
        <div class="kv"><span class="k">เบอร์โทร</span><span class="v">${esc(j.customer_phone||'—')}</span></div>
        <div class="kv"><span class="k">ประวัติซ่อม</span><span class="v">
          ${hist ? `<a href="#" onclick="showHistory('${j.customer_id}');return false" style="color:var(--blue)">ดูประวัติ (${hist})</a>`
                 : '<span class="muted">ครั้งแรก</span>'}</span></div>
        <div class="kv"><span class="k">เลข Order</span><span class="v mono">${esc(j.order_no||'—')}</span></div>
        <div class="kv"><span class="k">พัสดุขาเข้า</span><span class="v mono">${esc(j.tracking_in||'—')}</span></div>
        ${j.tracking_out ? `<div class="kv"><span class="k">พัสดุขาออก</span><span class="v mono">${esc(j.tracking_out)}</span></div>` : ''}
        <div class="kv"><span class="k">ช่องทาง</span><span class="v">${esc(j.platform||'—')}</span></div>
        <div class="kv"><span class="k">ชื่อร้าน</span><span class="v">${esc(j.shop_name||'—')}</span></div>
        <div class="kv"><span class="k">ที่มาของเคส</span><span class="v">
          <span class="pill ${(ORIGIN[j.case_origin]||ORIGIN.external).cls}">${(ORIGIN[j.case_origin]||ORIGIN.external).ico} ${(ORIGIN[j.case_origin]||ORIGIN.external).l}</span></span></div>
        ${causeName(j) ? `<div class="kv"><span class="k">สาเหตุ</span><span class="v">${esc(causeName(j))}</span></div>` : ''}
        ${isInternal(j) ? '' : `<div class="kv"><span class="k">ประเภทเคส</span><span class="v">${esc(CASE_TYPE[j.case_type]||'—')}</span></div>`}
        <div class="kv"><span class="k">ประกัน</span><span class="v">
          <span class="pill ${(WARRANTY[j.warranty_case]||WARRANTY.unknown).cls}">${esc((WARRANTY[j.warranty_case]||WARRANTY.unknown).l)}</span></span></div>
        <div class="kv"><span class="k">ประเภทเครื่อง</span><span class="v">${esc(j.tool_type||'—')}</span></div>
        <div class="kv"><span class="k">แบรนด์ / รุ่น</span><span class="v">${esc([j.brand,j.model].filter(Boolean).join(' ')||'—')}</span></div>
        <div class="kv"><span class="k">SKU</span><span class="v mono">${esc(j.sku||'—')}</span></div>
        <div class="kv"><span class="k">Serial No.</span><span class="v mono">${esc(j.serial_no||'—')}</span></div>
        <div class="kv"><span class="k">วันที่รับเคส</span><span class="v">${dth(j.received_at)}</span></div>
        <div class="kv"><span class="k">ระดับความยาก</span><span class="v">
          ${j.severity
            ? `<span class="pill st${j.severity === 'heavy' ? 6 : j.severity === 'medium' ? 4 : 2}">${esc(SEVERITY[j.severity])} · ${diffDays(j.severity)} วัน</span>`
            : '<span class="muted">ยังไม่ระบุ</span>'}</span></div>
        <div class="kv"><span class="k">วันที่มอบหมาย</span>
          <span class="v">${j.assigned_at ? dth(j.assigned_at) : '<span class="muted">ยังไม่มอบหมาย</span>'}</span></div>
        <div class="kv"><span class="k">กำหนดเสร็จ</span>
          <span class="v" ${late?'style="color:var(--crit)"':''}>${dth(j.due_date)}
            ${j.assigned_at ? '' : '<span class="sub2">(ประมาณการ)</span>'}</span></div>

        <div style="margin-top:13px">
          <label>อาการเสียที่ลูกค้าแจ้ง</label>
          <div class="box-warn">${esc(j.symptom||'—')}</div>
        </div>
        ${j.accessories ? `<div style="margin-top:13px">
          <label>ของที่นำมาด้วย <span class="muted" style="font-weight:400">(ใบงานเก่า)</span></label>
          <div class="chipset">${j.accessories.split(/[,·]/).filter(x=>x.trim())
            .map(x => `<span>${esc(x.trim())}</span>`).join('')}</div></div>` : ''}
        ${j.intake_note ? `<div style="margin-top:13px"><label>📝 หมายเหตุตอนรับเครื่อง</label>
          <div class="box-info">${esc(j.intake_note)}</div></div>` : ''}

        <div style="margin-top:15px">${photoBox('before','รูปภาพก่อนซ่อม',6)}</div>

        <div class="noprint" style="margin-top:12px;text-align:center">
          <div class="row" style="justify-content:center">
            <button class="btn sm" onclick="printJob('intake')">🖨️ ใบรับเครื่อง</button>
            <button class="btn sm g" onclick="printJob('delivery')">🖨️ ใบส่งมอบ</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3><span class="jnum" style="background:${vs.c};color:${vs.ink}">${view}</span> ${esc(vs.label)}</h3>
      <div class="cb" id="stepForm">${stepForm(view, j, pc)}</div>
    </div>
  </div>`;

  bindStepForm(view, pc);
}

/* ---------- ฟอร์มของแต่ละขั้น ----------
   ขั้นที่ผ่านมาแล้ว "แก้ไขได้" เหมือนต้นฉบับ ไม่ได้ล็อกอ่านอย่างเดียว
   ------------------------------------------------------------------ */
/** ขั้น 3 — ช่างมาจากระบบจ่ายงาน ไม่ให้เลือกเอง
    เลือกเองได้เฉพาะหัวหน้า และต้องบอกเหตุผล เพราะเป็นการข้ามคิวคนอื่น */
function techBox(j){
  if (j.technician_id){
    const auto = /อัตโนมัติ/.test(j.assign_note || '');
    return `<div class="box-ok">
      👷 <b>ช่างผู้รับผิดชอบ: ${esc(j.tech_name || '—')}</b>
      <span class="pill ${auto ? 'st2' : 'tag-warn'}" style="margin-left:7px">
        ${auto ? 'ระบบจ่ายให้' : 'หัวหน้าเลือกเอง'}</span>
      <div class="muted" style="font-size:12.5px;margin-top:4px">
        ${j.assigned_at ? 'มอบหมายเมื่อ ' + esc(dtth(j.assigned_at)) : ''}
        ${j.assign_note ? ' · ' + esc(j.assign_note) : ''}</div>
      ${isBoss() ? `<button type="button" class="btn sm" style="margin-top:9px"
        onclick="overrideTech()">🔁 เปลี่ยนช่างเอง</button>` : ''}
    </div>`;
  }

  const q = (S.queue || []).find(x => x.id === j.id);
  const lv = LEVELS.find(l => l.k === j.severity);
  return `<div class="box-warn">
    ⏳ <b>ยังไม่มีช่างรับ — รอระบบจ่ายงาน</b>
    <div style="font-size:13px;margin-top:4px">
      ${j.severity
        ? `อยู่ในคิวระดับ <b>${esc(lv ? lv.t : j.severity)}</b>` +
          (q ? ` · คิวที่ <b>${q.queue_no}</b>` : '') +
          ' — ระบบจะจ่ายให้ช่างที่ช่องว่างมานานที่สุดโดยอัตโนมัติ'
        : '<b style="color:var(--crit)">ยังไม่ได้เลือกระดับความยาก</b> — เลือกข้างล่างก่อน ระบบถึงจะจ่ายงานได้'}
    </div>
    <div style="display:flex;gap:9px;margin-top:10px;flex-wrap:wrap">
      ${j.severity ? `<button type="button" class="btn p sm" onclick="assignNow()">⚡ จ่ายงานเดี๋ยวนี้</button>` : ''}
      <button type="button" class="btn sm" onclick="peekBoard()">👀 ดูกระดานจ่ายงาน</button>
      ${isBoss() && j.severity ? `<button type="button" class="btn sm" onclick="overrideTech()">🔁 เลือกช่างเอง</button>` : ''}
    </div>
  </div>`;
}

/** ดูกระดานจ่ายงานแบบไม่ต้องย้ายหน้า — ใบงานที่เปิดอยู่จะถูกไฮไลท์ในคิว */
async function peekBoard(){
  const jobId = S.job?.id || null;
  try {
    const [board, queue] = await Promise.all([
      sb.from('v_tech_slots').select('*'),
      sb.from('v_dispatch_queue').select('*')
    ]);
    if (board.error) throw board.error;
    S.board = board.data || [];
    S.queue = queue.error ? [] : (queue.data || []);
    LEVELS.forEach(l => {
      const r = S.board.find(x => x.level === l.k);
      if (r && r.capacity) SLOTS[l.k] = Number(r.capacity);
    });

    const techs = [...new Set(S.board.map(r => r.technician_id))]
      .map(id => S.board.find(r => r.technician_id === id))
      .sort((a,b) => (a.code||'').localeCompare(b.code||''));
    const by = {};
    S.board.forEach(r => { (by[r.technician_id] = by[r.technician_id] || {})[r.level] = r; });

    const capAll  = S.board.reduce((s,r) => s + Number(r.capacity||0), 0);
    const usedAll = S.board.reduce((s,r) => s + Number(r.used||0), 0);
    const lvOf = k => LEVELS.find(l => l.k === k);

    const html = `
      <div class="kpis" style="margin-bottom:14px">
        ${[['na','🎯','ช่องทั้งหมด', capAll, techs.length + ' ช่าง'],
           ['nb','🔧','ใช้อยู่', usedAll, capAll ? Math.round(usedAll/capAll*100) + '%' : ''],
           [capAll-usedAll ? 'nc' : 'nd','🟩','ช่องว่าง', capAll - usedAll,
             capAll-usedAll ? 'พร้อมรับงาน' : 'เต็มทุกช่อง'],
           [S.queue.length ? 'nd' : 'nc','⏳','รอคิว', S.queue.length,
             S.queue.length ? 'ใบงาน' : 'ไม่มีคิว']
          ].map(([cl,e,l,n,u]) => `<div class="kpi ${cl}" style="padding:11px 13px">
            <div class="t"><span class="l" style="font-size:11.5px">${l}</span><span class="e">${e}</span></div>
            <div class="n" style="font-size:21px">${n}</div>
            <div class="sub2">${esc(u)}</div></div>`).join('')}
      </div>

      <div class="tw"><table>
        <thead><tr><th>ช่าง</th>${LEVELS.map(l =>
          `<th class="lv-${l.k}">${l.ico} ${l.t}</th>`).join('')}<th class="num">ค้างรวม</th></tr></thead>
        <tbody>${techs.length ? techs.map(t => {
          const mine = t.technician_id === ME.techId;
          return `<tr ${mine ? 'style="background:var(--gold-l)"' : ''}>
            <td><b>${esc(t.tech_name)}</b>${mine ? ' <span class="pill st1">คุณ</span>' : ''}
              <div class="sub2 mono">${esc(t.code||'')}</div></td>
            ${LEVELS.map(l => slotCell(by[t.technician_id]?.[l.k], l)).join('')}
            <td class="num"><b>${t.load_total ?? 0}</b></td></tr>`;
        }).join('') : '<tr><td colspan="5" class="empty">ยังไม่มีช่างที่ใช้งานอยู่</td></tr>'}</tbody>
      </table></div>

      <div style="margin-top:16px;font-weight:700;font-size:13.5px;color:var(--ink2)">
        ⏳ คิวรอจ่าย ${S.queue.length} ใบ</div>
      ${S.queue.length ? `<div class="tw" style="margin-top:7px"><table>
        <thead><tr><th class="num">คิว</th><th>ใบงาน</th><th>ระดับ</th><th>เครื่องมือ</th>
          <th class="num">รอมาแล้ว</th></tr></thead>
        <tbody>${S.queue.map(q => {
          const me2 = q.id === jobId, lv = lvOf(q.severity) || { t:'—', ico:'' };
          return `<tr ${me2 ? 'style="background:var(--gold-l);font-weight:700"' : ''}>
            <td class="num">${q.queue_no}</td>
            <td class="mono">${esc(jobRef(q))}${me2 ? ' <span class="pill st1">ใบนี้</span>' : ''}</td>
            <td><span class="pill lv-${q.severity}">${lv.ico} ${lv.t}</span></td>
            <td>${esc([q.brand,q.model].filter(Boolean).join(' ') || q.tool_type || '—')}</td>
            <td class="num">${esc(waitTxt(Number(q.hours_waiting)||0))}</td></tr>`;
        }).join('')}</tbody></table></div>`
        : '<div class="empty" style="padding:18px">ไม่มีงานรอคิว — ช่างรับได้ครบทุกใบแล้ว 👍</div>'}

      <div class="box-info" style="margin-top:14px;font-size:12.5px">
        ช่องว่างเรียงคิวจาก <b>คนที่ว่างมานานที่สุดได้ก่อน</b> ·
        ระบบจ่ายให้เองเมื่อมีช่องว่าง ไม่ต้องเลือกช่างเอง</div>`;

    await infoModal('🎯 กระดานจ่ายงาน',
      'ช่องต่อคน — ' + LEVELS.map(l => l.t + ' ' + (Number(SLOTS[l.k])||1)).join(' · '),
      html);
  } catch(e){
    if (/does not exist|not exist/i.test(e.message||''))
      toast('❌ ยังไม่ได้รัน 16_dispatch.sql', true);
    else fail(e);
  }
}

/** จ่ายงานใบนี้ตามคิว — ใครก็กดได้ ระบบเป็นคนเลือกช่างเอง */
async function assignNow(){
  try {
    if (!S.job.severity) return toast('เลือกระดับความยากก่อน', true);
    const { data, error } = await sb.rpc('auto_assign', { p_job_id:S.job.id, p_by:who() });
    if (error) throw error;
    if (!data) toast('ช่องของระดับนี้เต็มทุกคน — ใบนี้รอคิวต่อ ระบบจะจ่ายให้เองเมื่อมีช่างว่าง', true);
    else toast('✅ ระบบจ่ายให้ ' + data + ' แล้ว');
    await openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}

/** ข้ามคิว — เฉพาะหัวหน้า และต้องมีเหตุผล */
async function overrideTech(){
  const j = S.job;
  const f = await formModal({
    title:'เปลี่ยนช่างเอง', subtitle:'ข้ามคิวที่ระบบจัดไว้ — ต้องบันทึกเหตุผลทุกครั้ง',
    ok:'ยืนยันเปลี่ยนช่าง', danger:true,
    fields:[
      { k:'tech', label:'ช่างที่ต้องการ', type:'select', required:true,
        value:j.technician_id || '',
        options:[{ v:'', t:'— เอาช่างออก ให้กลับเข้าคิว —' }].concat(
          S.techs.map(t => {
            const load = S.jobs.filter(x => x.technician_id === t.id && !CLOSED.includes(x.status)).length;
            const same = S.jobs.filter(x => x.technician_id === t.id && x.severity === j.severity
                                         && !CLOSED.includes(x.status)).length;
            const cap  = Number(SLOTS[j.severity] || 1);
            return { v:t.id, t:`${t.nickname || t.full_name} — ช่องระดับนี้ ${same}/${cap}`
                              + (same >= cap ? ' (เต็มแล้ว)' : ' (ว่าง)')
                              + ` · งานค้างรวม ${load}` };
          })) },
      { k:'reason', label:'เหตุผลที่ข้ามคิว', type:'textarea', required:true,
        placeholder:'เช่น ช่างคนนี้เคยซ่อมเครื่องรุ่นนี้มาก่อน / ช่างที่ระบบจ่ายให้ลาป่วย' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('repair_jobs').update({
      technician_id: f.tech || null,
      assign_note: 'หัวหน้าเลือกเอง (' + who() + '): ' + f.reason,
      created_by: who()
    }).eq('id', j.id);
    if (error) throw error;
    toast(f.tech ? '✅ เปลี่ยนช่างแล้ว' : 'เอาช่างออกแล้ว — ใบนี้กลับเข้าคิว');
    await openJob(j.id); reloadAll();
  } catch(e){ fail(e); }
}

/** ขั้น 3 — โชว์กำหนดเสร็จที่ระบบจะคำนวณให้ทันทีที่เลือกระดับความยาก */
function previewDue(){
  if (!$('sDueShow')) return;
  const j  = S.job || {};
  const sv = val('sDiff') || 'medium';
  const d  = diffDays(sv);
  /* มอบหมายแล้ว = ยึดวันเดิม · ยังไม่มอบหมาย = ยึดวันนี้ */
  const base = j.assigned_at ? new Date(j.assigned_at) : new Date();
  const due  = addDays(base, d);
  $('sDueShow').value = dth(due);
  if ($('dueHint')) $('dueHint').innerHTML =
    `📅 <b>${esc(SEVERITY[sv] || 'เคสกลาง')}</b> = ${d} วัน · `
    + `${esc(dth(base))} + ${d} วัน = <b>${esc(dth(due))}</b>`
    + (val('sDiff') ? '' : ' <span class="muted">(ยังไม่เลือกระดับ ระบบใช้เคสกลางไปก่อน)</span>')
    + '<div class="muted" style="font-size:12.5px;margin-top:4px">แก้จำนวนวันต่อระดับได้ที่ ตั้งค่า → สเกลความยาก</div>';
}

function stepForm(nStep, j, pc){
  const cur  = stepOf(j.status) || 1;
  const past = nStep < cur;
  const sd   = STEPS[nStep-1];

  const hint = `<div class="jhint">${esc(sd.hint)} · <b>${past ? 'ผ่านแล้ว — แก้ไขได้' : 'กำลังดำเนินการ'}</b></div>`;
  const recap = t => `<div class="recap">${t}</div>`;
  const save  = `<button class="btn" onclick="saveStep()">บันทึก</button>`;
  const back  = nStep > 1 ? `<button class="btn" onclick="moveStep(${nStep-1})">← ย้อนขั้น</button>` : '';
  const toCur = `<button class="btn g" onclick="peekStep(${cur})">ไปขั้นปัจจุบัน (${cur}) →</button>`;
  const deliver = `<button class="btn" style="background:#1c1c1c;border-color:#1c1c1c;color:#fff"
     onclick="setStatus('delivered')">ยืนยันส่งมอบลูกค้า</button>`;
  const foot = extras => `<div class="jfoot">${past ? save + toCur + (cur === 6 ? deliver : '')
                                                   : back + save + extras}</div>`;

  /* ---- 1 รับเครื่อง ---- */
  if (nStep === 1){
    const waiting = j.status === 'awaiting_parcel';
    const unknown = j.status === 'unknown_parcel';
    const head = unknown
      ? `<div class="box-crit">📦 <b>พัสดุไม่ทราบที่มา (SOP A9.2)</b> — ถึงศูนย์แล้ว ${j.days_in_shop ?? 0} วัน
           ยังหาเจ้าของไม่เจอ · ประสานเจ้าของร้านให้ช่วยค้นหาข้อมูล แล้วกด "พบเจ้าของแล้ว"</div>`
      : waiting
        ? `<div class="box-warn">📦 <b>รอลูกค้าส่งของมาที่ศูนย์</b>
             ${j.notified_at
               ? `· แจ้งลูกค้าแล้วเมื่อ <b>${dtth(j.notified_at)}</b>`
               : '· <b style="color:var(--crit)">ยังไม่ได้แจ้งลูกค้าให้ส่งของ (SOP A6)</b>'}</div>`
        : '';
    const ubox = unboxBox(j);
    const cbox = j.clip_waiting ? `<div class="box-warn" style="margin-top:13px">
      📹 <b>ขอคลิปจากลูกค้าไปแล้ว</b> เมื่อ ${dtth(j.clip_requested_at)}
      ${j.clip_requested_by ? 'โดย ' + esc(j.clip_requested_by) : ''}
      · รอมา <b>${j.clip_days_waiting > 0 ? j.clip_days_waiting + ' วัน' : 'วันนี้'}</b>
      <div class="sub2" style="margin-top:4px">ขอไว้ว่า: ${esc(j.clip_note || '—')}</div>
      <div style="margin-top:9px">
        <button class="btn g" onclick="clipReceived()">✅ ได้คลิปแล้ว เปิดเรื่องต่อ</button>
      </div></div>` : '';
    return hint + head + (unknown ? `
    <div class="grid g2">
      <div><label>แบรนด์บนกล่อง</label>
        <input type="text" id="sBrandU" value="${esc(j.brand||'')}" placeholder="MASARU / Kosen / ..."></div>
    </div>
    <div style="margin-top:14px"><label>บันทึกการประสานงาน</label>
      <textarea id="sUnknown" placeholder="เช่น 9 ก.ย. ส่งรูปกล่องให้ร้าน A แล้ว รอตอบกลับ">${esc(j.unknown_note||'')}</textarea></div>
    ` : '') + `
    <div class="grid g3">
      <div><label>เลขคำสั่งซื้อ (Order No.)</label><input type="text" id="sOrder" value="${esc(j.order_no||'')}"></div>
      <div><label>เลขพัสดุขาเข้า</label><input type="text" id="sTrackIn" value="${esc(j.tracking_in||'')}"></div>
      <div><label>แพลตฟอร์ม</label><select id="sPlatform"><option value="">— ไม่ระบุ —</option>
        ${PLATFORMS.map(p => `<option ${p===j.platform?'selected':''}>${esc(p)}</option>`).join('')}</select></div>
      <div><label>ชื่อร้านแพลตฟอร์ม</label>
        <input type="text" id="sShop" value="${esc(j.shop_name||'')}" list="shopListJob" autocomplete="off"
               placeholder="${unknown ? 'ร้านที่ต้องประสานหาเจ้าของ' : 'ร้านที่ลูกค้าซื้อของมา'}">
        <datalist id="shopListJob">${shopOptions()}</datalist></div>
      <div ${HAS_ORIGIN ? '' : 'hidden'}><label>ที่มาของเคส</label>
        <select id="sOrigin" onchange="jobOriginChanged()">
          <option value="external" ${isInternal(j) ? '' : 'selected'}>🟠 เคสนอกระบบ — ส่งเข้าศูนย์ตรง</option>
          <option value="internal" ${isInternal(j) ? 'selected' : ''}>🟢 เคสในระบบ — เปิดเรื่องในแพลตฟอร์ม</option>
        </select></div>
      <div id="jBoxCause" ${HAS_ORIGIN && isInternal(j) ? '' : 'hidden'}><label>สาเหตุ</label>
        <select id="sCause">${causeOpts(j.cause_code)}</select></div>
      <div id="jBoxCase" ${isInternal(j) ? 'hidden' : ''}><label>ประเภทเคส</label>
        <select id="sCaseType">${opts(CASE_TYPE, j.case_type)}</select></div>
      <div id="jBoxWarranty" ${isInternal(j) ? 'hidden' : ''}><label>เงื่อนไขประกัน <span class="req">*</span></label>
        <select id="sWarranty" onchange="document.getElementById('wBox').innerHTML=warrantyBox(this.value)">
          ${opts(WARRANTY, j.warranty_case)}</select></div>
      <div><label>แอดมิน / CS เจ้าของเคส</label>
        <input type="text" id="sAdmin" value="${esc(j.admin_name||'')}" list="adminListJob" autocomplete="off">
        <datalist id="adminListJob">${adminNames().map(n => `<option value="${esc(n)}"></option>`).join('')}</datalist></div>
    </div>
    <div id="wBox" style="margin-top:13px">${isInternal(j) ? '' : warrantyBox(j.warranty_case)}</div>

    <div class="grid g3" style="margin-top:14px">
      <div><label>📦 วันที่ขนส่งมาถึงศูนย์</label>
        <input type="date" id="sArrived" value="${j.arrived_at ? String(j.arrived_at).slice(0,10) : ''}"
               max="${new Date().toISOString().slice(0,10)}">
        <span class="hint">เริ่มนับเวลาแกะกล่องจากวันนี้ — กรอกตามวันที่ขนส่งเอามาส่งจริง</span></div>
      <div><label>วันที่รับเคส <span class="muted" style="font-weight:400">(ล็อกไว้ แก้ไม่ได้)</span></label>
        <input type="text" value="${dth(j.received_at)}" disabled></div>
      <div><label>กำหนดเสร็จ</label>
        <input type="text" value="${j.assigned_at ? dth(j.due_date) : 'กำหนดที่ขั้น 3 มอบหมายงาน'}" disabled></div>
    </div>
    ${ubox}${cbox}
    <div style="margin-top:14px"><label>อาการเสียที่ลูกค้าแจ้ง <span class="req">*</span></label>
      <textarea id="sSymptom">${esc(j.symptom||'')}</textarea></div>
    <div style="margin-top:14px"><label>SKU</label>
      <input type="text" id="sSku" value="${esc(j.sku||'')}" placeholder="รหัสสินค้าของตัวเครื่อง"
             style="text-transform:uppercase"></div>
    <div style="margin-top:14px"><label>หมายเหตุตอนรับเครื่อง</label>
      <textarea id="sIntakeNote" style="min-height:62px"
        placeholder="เช่น กล่องบุบมาแต่แรก · ลูกค้าขอด่วน · ไม่มีใบเสร็จ">${esc(j.intake_note||'')}</textarea></div>

    <div style="margin-top:16px"><label>🚚 ค่าส่งขาเข้า
      <span class="muted" style="font-weight:400">(ลูกค้าส่งเครื่องมาศูนย์)</span></label>
      <div class="grid g3">
        <div><input type="number" id="sShipIn" value="${Number(j.ship_in_fee)||0}" min="0" step="10"
          placeholder="ค่าส่ง (บาท)"></div>
        <div><select id="sShipInBy">${shipByOpts(j.ship_in_by)}</select></div>
        <div><input type="text" id="sShipNote" value="${esc(j.ship_note||'')}"
          placeholder="ขนส่งเจ้าไหน / เลขใบเสร็จ"></div>
      </div>
      <label style="display:flex;gap:7px;align-items:flex-start;margin-top:11px;font-weight:400;font-size:13px">
        <input type="checkbox" id="sAdvance" ${j.ship_in_advanced ? 'checked' : ''} style="margin-top:3px">
        <span>💰 <b>ลูกค้าสำรองจ่ายค่าส่งขาเข้าไปก่อน</b> — บริษัทต้องคืนเงินให้
          <div class="sub2">ติ๊กไว้ = เข้ารายการรอเบิกคืนอัตโนมัติ ·
            ถ้าบริษัทเรียกรถไปรับเองแล้วจ่ายขนส่งตรง ให้ติ๊กออก</div></span>
      </label>
      <div class="box-info" style="margin-top:9px;font-size:12.5px">
        ค่าส่ง <b>ไม่นับเป็นรายได้ของใคร</b> — บันทึกไว้เพื่อรู้ว่าฝ่ายไหนแบกเท่าไหร่ ·
        ระบบเติม "ใครจ่าย" ให้เองตามเงื่อนไขประกัน แก้ได้ถ้าตกลงกับลูกค้าเป็นอย่างอื่น</div>
      ${refundBox(j)}
      ${j.ship_refund_status && j.ship_refund_status !== 'none'
        ? `<div style="margin-top:13px">${photoBox('ship_receipt','ใบเสร็จค่าส่งของลูกค้า',3)}</div>` : ''}
    </div>
    ` + foot(
      (unknown
        ? `<button class="btn p" onclick="claimOwner()">✅ พบเจ้าของแล้ว</button>`
        : waiting
          ? (j.notified_at ? '' : `<button class="btn" onclick="notifyCustomer()">📞 แจ้งลูกค้าแล้ว</button>`)
            + `<button class="btn p" onclick="receiveParcel()">📦 รับพัสดุเข้าศูนย์</button>`
          : `<button class="btn g" onclick="moveStep(2)">ไปตรวจเช็ค →</button>`)
      /* ขอคลิปเป็นเรื่องของ "เคสในระบบ" — ลูกค้าแจ้งผ่านแพลตฟอร์ม ไม่ได้ส่งเครื่องมา
         จะตัดสินว่าเคลมไหมต้องดูจากคลิป · เคสนอกระบบเครื่องอยู่ในมือช่างแล้ว ไม่ต้องขอ
         (ยังไม่ได้รัน 30 = ยังไม่รู้ว่าเคสไหนเป็นแบบไหน จึงโชว์ไว้เหมือนเดิม) */
      + ((!HAS_ORIGIN || isInternal(j))
          ? `<button class="btn dn" data-int-only="1" onclick="requestClip()">📹 ไม่รับเคลม (ขอคลิป)</button>`
          : '')
      + `<button class="btn dn" onclick="rejectClaim()">ไม่รับเคลม</button>`);
  }

  /* ---- 2 ตรวจเช็ค ---- */
  if (nStep === 2) return hint + `
    <div><label>หมวดอาการที่พบ</label><select id="sCat">
      <option value="">— ยังไม่ระบุ —</option>
      ${S.cats.map(c => `<option value="${c.code}" ${c.code===j.symptom_category?'selected':''}>${esc(c.name_th)}</option>`).join('')}
    </select></div>
    <div style="margin-top:14px"><label>อาการที่พบ (จากการตรวจเช็ค) <span class="req">*</span></label>
      <textarea id="sInspect" placeholder="เช่น ทริกเกอร์ชำรุด">${esc(j.inspect_result||'')}</textarea></div>
    <div class="grid g2" style="margin-top:14px">
      <div><label>ความรุนแรงของเคส</label><select id="sSeverity">
        <option value="">— ยังไม่ระบุ —</option>${opts(SEVERITY, j.severity)}</select></div>
      <div><label>ประเมินการซ่อม</label>
        <select id="sRepairable" onchange="repairableChanged()">
        <option value="">— ยังไม่ระบุ —</option>
        <option value="yes" ${j.repairable === true ? 'selected':''}>ซ่อมได้</option>
        <option value="no" ${j.repairable === false && j.no_repair_action !== 'salvage'
          ? 'selected':''}>ซ่อมไม่ได้ — ควรเปลี่ยนสินค้าใหม่ให้ลูกค้า</option>
        <option value="salvage" ${j.no_repair_action === 'salvage'
          ? 'selected':''}>ซ่อมไม่ได้ — แยกออกไป เพื่อเป็นสต๊อกอะไหล่</option>
      </select></div>
    </div>
    <div id="sRepairNote">${repairNoteHTML(
       j.no_repair_action === 'salvage' ? 'salvage' : (j.repairable === false ? 'no' : ''))}</div>
    ${recap('อาการที่ลูกค้าแจ้ง: ' + esc(j.symptom || '—')
      + '\nเงื่อนไขประกัน: ' + esc((WARRANTY[j.warranty_case]||WARRANTY.unknown).l))}
    ` + foot(`<button class="btn g" onclick="moveStep(3)">ไปมอบหมายงาน →</button>`);

  /* ---- 3 มอบหมายงาน ---- */
  if (nStep === 3) return hint + `
    ${techBox(j)}
    <div class="grid g3" style="margin-top:14px">
      <div><label>ระดับความยาก <span class="req">*</span></label>
        <select id="sDiff" onchange="previewDue()">
          <option value="">— ยังไม่ระบุ (ใช้เคสกลาง) —</option>${opts(SEVERITY, j.severity)}</select></div>
      <div><label>วันที่มอบหมาย <span class="muted" style="font-weight:400">(ล็อก)</span></label>
        <input type="text" value="${j.assigned_at ? dth(j.assigned_at) : dth(new Date())}" disabled></div>
      <div><label>กำหนดเสร็จ <span class="muted" style="font-weight:400">(ระบบคำนวณ)</span></label>
        <input type="text" id="sDueShow" value="—" disabled></div>
    </div>
    <div class="box-info" id="dueHint" style="margin-top:12px"></div>
    ${recap('ผลตรวจเช็ค: ' + esc(j.inspect_result || '—'))}
    ` + foot(`<button class="btn g" onclick="moveStep(4)">เริ่มซ่อม →</button>`);

  /* ---- 4 ซ่อม / เปลี่ยนอะไหล่ ---- */
  if (nStep === 4) return hint + `
    <div><label>วิธีการซ่อม <span class="req">*</span></label>
      <textarea id="sMethod" placeholder="เปลี่ยนลูกปืน, ทำความสะอาด Gear Housing, เติม Grease">${esc(j.repair_method||'')}</textarea></div>

    <div style="margin-top:16px"><label>อะไหล่ที่ใช้
      <span class="muted" style="font-weight:400">(ตัดสต็อกอัตโนมัติ · ระบบใส่${partsByCustomer(j) ? 'ราคาขาย' : 'ราคาทุน'}ให้เอง)</span></label>
      <div class="tw"><table>
        <thead><tr><th>PART NO.</th><th>รายการ</th><th class="num">จำนวน</th>
          <th class="num">${partsByCustomer(j) ? 'ราคาขาย' : 'ราคาทุน'}</th><th class="num noprint"></th></tr></thead>
        <tbody>${S.lines.length ? S.lines.map(l => `<tr>
          <td class="mono"><b>${esc(l.parts_master?.part_no||'')}</b></td>
          <td>${esc(l.parts_master?.name||'')}</td><td class="num">${l.qty}</td>
          <td class="num">฿${money2(l.line_total)}</td>
          <td class="num noprint">${isBoss()
            ? `<button class="btn ic" onclick="requestAdjust('${l.id}','edit')" title="แก้จำนวน">✏️</button>
               <button class="btn ic dn" onclick="removeLine('${l.id}')" title="เอาออก คืนของเข้าสต็อก">✕</button>`
            : `<button class="btn ic" onclick="requestAdjust('${l.id}','edit')" title="ขอแก้จำนวน">✏️</button>
               <button class="btn ic dn" onclick="requestAdjust('${l.id}','return')" title="ขอคืนของ ต้องหัวหน้าอนุมัติ">↩</button>`}
          </td></tr>`).join('')
          : '<tr><td colspan="5" class="muted" style="text-align:center;padding:16px">ยังไม่มีอะไหล่</td></tr>'}</tbody>
      </table></div>
      <div class="addrow noprint">
        <input list="partList" id="aPart" placeholder="Part No." autocomplete="off">
        <input id="aName" placeholder="ชื่ออะไหล่" disabled>
        <input type="number" id="aQty" value="1" min="1" title="จำนวน">
        <input type="number" id="aPrice" placeholder="ราคา" min="0" title="ราคา/หน่วย">
        <button class="btn p" onclick="addLineInline()" title="เพิ่ม">＋</button>
      </div>
      <datalist id="partList">${S.parts.map(p => `<option value="${esc(p.part_no)}">${esc(p.name)}</option>`).join('')}</datalist>
    </div>

    <div style="margin-top:16px">
      <div class="sumrow"><span>รวมค่าอะไหล่ ${partsByCustomer(j)
        ? '<span class="pill tag-good">ลูกค้าจ่าย</span>'
        : '<span class="pill tag-crit">บริษัทแบก · ราคาทุน</span>'}</span><b>฿${money2(pc)}</b></div>
      <div class="sumrow"><span>ค่าแรง ${laborByCustomer(j)
        ? '<span class="pill tag-good">ลูกค้าจ่าย</span>'
        : '<span class="pill st0">เคลม ไม่คิดเงิน</span>'}</span>
        <input type="number" id="sLabor" value="${Number(j.labor_cost)||0}" min="0" step="10"></div>
      <div class="sumrow"><span>ส่วนลด</span><input type="number" id="sDiscount" value="${Number(j.discount)||0}" min="0" step="10"></div>
      <div class="sumrow total"><span>${partsByCustomer(j) ? 'เก็บจากลูกค้ารวม' : 'มูลค่างานรวม (ไม่เรียกเก็บ)'}</span>
        <span id="sTotal">฿${money2(pc + (Number(j.labor_cost)||0) - (Number(j.discount)||0))}</span></div>
      ${partsByCustomer(j) ? '' : `<div class="box-info" style="margin-top:10px;font-size:13px">
        🔴 เคสเคลม — ยอดนี้เป็น <b>ต้นทุนที่บริษัทแบก</b> ไม่ใช่รายได้ ·
        อะไหล่คิดที่ราคาทุน · ค่าแรงไม่ต้องกรอกก็ได้ (เงินเดือนช่างเป็นต้นทุนคงที่อยู่แล้ว)</div>`}
    </div>
    ${adjustBox(j.id)}
    ${shortageBox(j.id)}
    <div style="margin-top:16px">${photoBox('during','รูประหว่างซ่อม',6)}</div>
    <div style="margin-top:16px">${warrantyBox(j.warranty_case)}</div>
    ${recap('ผลตรวจเช็ค: ' + esc(j.inspect_result || '—')
      + (j.severity ? '\nความรุนแรง: ' + esc(SEVERITY[j.severity]) : ''))}
    ` + foot(
      `<button class="btn" onclick="reportShortage()">🧾 แจ้งอะไหล่ขาด</button>`
      + (j.status !== 'wait_parts'
        ? `<button class="btn" onclick="setStatus('wait_parts')">📦 รออะไหล่</button>`
        : `<button class="btn p" onclick="setStatus('repairing')">▶️ อะไหล่มาแล้ว</button>`)
      + `<button class="btn dn" onclick="replaceUnit()">🔄 ซ่อมไม่ได้ เปลี่ยนสินค้า</button>`
      + `<button class="btn g" onclick="moveStep(5)">ไปตรวจสอบ →</button>`);

  /* ---- 5 ตรวจสอบ — เฉพาะหัวหน้างานเท่านั้นที่ตรวจผ่านได้ ---- */
  if (nStep === 5){
    const partTxt = S.lines.length
      ? S.lines.map(l => `${l.parts_master?.name || l.parts_master?.part_no} ×${l.qty}`).join(', ')
      : 'ไม่ได้ใช้อะไหล่';
    const body = recap('วิธีซ่อม: ' + esc(j.repair_method || '—') + '\nอะไหล่: ' + esc(partTxt))
      + `<div style="margin-top:16px">${photoBox('after','รูปหลังซ่อม',4)}</div>`;

    /* ช่างเห็นทุกอย่าง แต่กดผ่านไม่ได้ */
    if (!isBoss()) return hint + `
      <div class="box-warn">🔒 <b>ขั้นตรวจสอบเป็นหน้าที่ของหัวหน้างาน</b>
        <div class="muted" style="font-size:13px;margin-top:4px">
          ช่างซ่อมเสร็จแล้วให้แจ้งหัวหน้ามาตรวจ · ช่างดูข้อมูลและอัปโหลดรูปหลังซ่อมได้ แต่กดผ่านขั้นนี้ไม่ได้</div></div>
      <div style="margin-top:14px"><label>สรุปผลการทดสอบ (หัวหน้ากรอก)</label>
        <textarea disabled>${esc(j.note||'')}</textarea></div>
      ${body}
      <div class="jfoot">${back}${past ? toCur : ''}</div>`;

    return hint + `
    <div class="box-info">👤 ผู้ตรวจสอบ: <b>${esc(who())}</b> · ${esc(ROLE_LABEL[ME.role]||ME.role)}</div>
    <div style="margin-top:14px"><label>สรุปผลการทดสอบ <span class="req">*</span></label>
      <textarea id="sNote" placeholder="ทดสอบเดินเครื่อง 10 นาที ทำงานปกติ ไม่มีเสียงผิดปกติ">${esc(j.note||'')}</textarea></div>
    ${body}
    ` + foot(`<button class="btn dn" onclick="replaceUnit()">🔄 เปลี่ยนสินค้า</button>`
      + `<button class="btn g" onclick="moveStep(6)">พร้อมส่งมอบ →</button>`);
  }

  /* ---- 6 ส่งมอบลูกค้า ---- */
  const done = j.status === 'delivered';
  return hint + `
    <div class="grid g2" style="gap:0 26px">
      <div class="kv"><span class="k">ช่าง</span><span class="v">${esc(j.tech_name || '—')}</span></div>
      <div class="kv"><span class="k">รวมค่าซ่อม</span><span class="v">฿${money2(j.total_cost)}</span></div>
      <div class="kv"><span class="k">ผลการทดสอบ</span><span class="v">${esc(j.note || '—')}</span></div>
      <div class="kv"><span class="k">วันส่งมอบ</span>
        <span class="v" ${done?'':'style="color:var(--ink3);font-weight:600"'}>${done ? dtth(j.delivered_at) : 'ยังไม่ส่งมอบ'}</span></div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div><label>เลขพัสดุขาออก (Tracking ส่งคืน)</label>
        <input type="text" id="sTrackOut" value="${esc(j.tracking_out||'')}" placeholder="เลขที่ส่งคืนลูกค้า"></div>
      <div><label>อ้างอิงเลขคำสั่งซื้อเดิม</label>
        <input type="text" value="${esc(j.order_no||'—')}" disabled></div>
    </div>

    <div style="margin-top:16px"><label>🚚 ค่าส่งขาออก
      <span class="muted" style="font-weight:400">(ศูนย์ส่งเครื่องคืนลูกค้า)</span></label>
      <div class="grid g2">
        <div><input type="number" id="sShipOut" value="${Number(j.ship_out_fee)||0}" min="0" step="10"
          placeholder="ค่าส่ง (บาท)"></div>
        <div><select id="sShipOutBy">${shipByOpts(j.ship_out_by)}</select></div>
      </div>
      <div class="box-info" style="margin-top:9px;font-size:13px">
        รวมค่าส่งใบงานนี้: บริษัทออก <b>฿${money2(shipCompany(j))}</b> ·
        ลูกค้าออก <b>฿${money2(shipCustomer(j))}</b>
        <div class="muted" style="font-size:12.5px;margin-top:3px">
          ค่าส่งไม่เข้ารายได้ของฝ่ายใด — ฝ่ายที่รับผิดชอบแบกเป็นต้นทุนของตัวเอง</div>
      </div>
    </div>
    ${j.case_type === 'replace' ? `<div class="box-warn" style="margin-top:14px">
      🔄 <b>เคสเปลี่ยนสินค้า</b> — ปลายทางเครื่องเดิม:
      <b>${esc(DISPOSITION[j.old_unit_disposition] || 'ยังไม่ระบุ')}</b></div>` : ''}
    ${j.no_repair_action === 'salvage' ? `<div class="box-warn" style="margin-top:14px">
      📦 <b>เครื่องนี้แยกเก็บเป็นสต๊อกอะไหล่</b> — ไม่ส่งคืนลูกค้า
      <div class="sub2" style="margin-top:3px">ฝ่ายคลังดูรายการทั้งหมดได้ที่
        หน้า <b>คลังอะไหล่ → เครื่องที่แยกเป็นอะไหล่</b></div></div>` : ''}
    <div style="margin-top:14px">${warrantyBox(j.warranty_case)}</div>
    <p style="margin:16px 0 0;color:var(--ink2)">
      ${done ? '✅ ปิดงานเรียบร้อยแล้ว' : 'เมื่อลูกค้ารับเครื่องแล้ว กดยืนยันส่งมอบเพื่อปิดงาน'}</p>
    <div style="margin-top:16px">${photoBox('document','เอกสาร / ใบเสร็จ',4)}</div>
    <div class="jfoot">${back}${save}
      ${done ? `<button class="btn" onclick="setStatus('ready')">↩ เปิดงานใหม่</button>` : deliver}</div>`;
}

function bindStepForm(cur, pc){
  if (cur === 3) previewDue();
  if (cur === 4){
    const upd = () => $('sTotal').textContent = '฿' + money2(pc + (Number(val('sLabor'))||0) - (Number(val('sDiscount'))||0));
    ['sLabor','sDiscount'].forEach(id => $(id)?.addEventListener('input', upd));
    $('aPart')?.addEventListener('input', () => {
      const p = S.parts.find(x => x.part_no.toUpperCase() === val('aPart').toUpperCase());
      $('aName').value = p ? p.name : '';
      if (!p) return;
      /* ราคาอัตโนมัติตามเงื่อนไขประกัน — แอดมินไม่ต้องคิดเอง */
      const cust = partsByCustomer(S.job);
      $('aPrice').value = cust ? (p.sell_price ?? 0) : (p.cost_price ?? 0);
      $('aPrice').title = cust ? 'ราคาขาย — ลูกค้าจ่าย' : 'ราคาทุน — บริษัทแบก (เคลม)';
    });
  }
}

/* ---------- เก็บค่าจากฟอร์มขั้นปัจจุบัน ---------- */
function collectStep(){
  const p = { created_by: who() };
  const g = id => $(id) ? val(id) : undefined;
  if ($('sSymptom'))  p.symptom         = g('sSymptom') || null;
  if ($('sSku'))      p.sku             = g('sSku').toUpperCase() || null;
  if ($('sCat'))      p.symptom_category= g('sCat') || null;
  if ($('sArrived'))  p.arrived_at      = g('sArrived')  || null;
  if ($('sIntakeNote')) p.intake_note    = g('sIntakeNote') || null;
  if ($('sOrder'))    p.order_no        = g('sOrder')    || null;
  if ($('sTrackIn'))  p.tracking_in     = g('sTrackIn')  || null;
  if ($('sTrackOut')) p.tracking_out    = g('sTrackOut') || null;
  if ($('sPlatform')) p.platform        = g('sPlatform') || null;
  if ($('sCaseType')) p.case_type       = g('sCaseType');
  if ($('sWarranty')) p.warranty_case   = g('sWarranty');
  if ($('sAdmin'))    p.admin_name      = g('sAdmin') || null;
  if (HAS_ORIGIN && $('sOrigin')){
    p.case_origin = g('sOrigin') || 'external';
    p.cause_code  = p.case_origin === 'internal' ? (g('sCause') || null) : null;
  }
  if ($('sSeverity')) p.severity        = g('sSeverity') || null;
  if ($('sShop'))     p.shop_name       = g('sShop') || null;
  if ($('sBrandU'))   p.brand           = g('sBrandU') || null;
  if ($('sUnknown'))  p.unknown_note    = g('sUnknown') || null;
  if ($('sRepairable')){
    /* ดรอปดาวน์มี 3 ตัวเลือก แต่เก็บลง 2 คอลัมน์
         repairable        true / false / null  (ของเดิม รายงานเก่ายังใช้ได้)
         no_repair_action  replace / salvage / null  (ทางที่เลือกเมื่อซ่อมไม่ได้) */
    const v = g('sRepairable');
    p.repairable       = v === 'yes' ? true : (v === 'no' || v === 'salvage') ? false : null;
    p.no_repair_action = v === 'salvage' ? 'salvage' : v === 'no' ? 'replace' : null;
  }
  if ($('sInspect'))  p.inspect_result  = g('sInspect') || null;
  if ($('sDiff'))     p.severity        = g('sDiff') || null;
  if ($('sMethod'))   p.repair_method   = g('sMethod') || null;
  if ($('sNote'))     p.note            = g('sNote') || null;
  if ($('sShipIn'))    p.ship_in_fee    = Number(g('sShipIn'))  || 0;
  if ($('sShipOut'))   p.ship_out_fee   = Number(g('sShipOut')) || 0;
  if ($('sShipInBy'))  p.ship_in_by     = g('sShipInBy')  || null;
  if ($('sShipOutBy')) p.ship_out_by    = g('sShipOutBy') || null;
  if ($('sShipNote'))  p.ship_note      = g('sShipNote')  || null;
  if ($('sAdvance'))   p.ship_in_advanced = $('sAdvance').checked;
  if ($('sLabor'))    p.labor_cost      = Number(g('sLabor')) || 0;
  if ($('sDiscount')) p.discount        = Number(g('sDiscount')) || 0;
  Object.keys(p).forEach(k => p[k] === undefined && delete p[k]);
  return p;
}

async function saveStep(extra){
  const keep = S.peek;
  try {
    const { error } = await sb.from('repair_jobs').update({ ...collectStep(), ...(extra||{}) }).eq('id', S.job.id);
    if (error) throw error;
    toast('✅ บันทึกแล้ว');
    /* ปิดงาน = ช่องว่าง → ลองจ่ายคิวต่อให้เลย ไม่ต้องรอหัวหน้ามากด */
    if (extra?.status && CLOSED.includes(extra.status)){
      try { await sb.rpc('dispatch_queue', { p_by:'ระบบ (ปิดงาน ' + who() + ')' }); }
      catch(e){ console.warn('dispatch หลังปิดงาน', e); }
    }
    /* เพิ่งรู้ระดับความยากแต่ยังไม่มีช่าง → ระบบจ่ายให้ทันทีถ้ามีช่องว่าง */
    if (!S.job.technician_id && !CLOSED.includes(S.job.status)){
      try {
        const { data: tn } = await sb.rpc('auto_assign', { p_job_id:S.job.id, p_by:who() });
        if (tn) toast('🎯 ระบบจ่ายงานให้ ' + tn + ' แล้ว');
      } catch(e){ console.warn('auto_assign หลังบันทึก', e); }
    }
    await openJob(S.job.id);
    if (keep && !extra?.status){ S.peek = keep; renderJobPage(); }
    reloadAll();
  } catch(e){ fail(e); }
}

/* ---------------------------------------------------------------------
   ค่าส่งที่ลูกค้าสำรองจ่าย — บริษัทเป็นหนี้อยู่ ต้องคืน
   รอเบิก → ยื่นบัญชีแล้ว → จ่ายคืนลูกค้าแล้ว
   --------------------------------------------------------------------- */
const REFUND = {
  pending:   ['tag-warn', '💰 รอ CS รวบรวมยื่นเบิก'],
  submitted: ['st3',      '📄 ยื่นบัญชีแล้ว'],
  paid:      ['tag-good', '✅ จ่ายคืนลูกค้าแล้ว']
};

function refundBox(j){
  const st = j.ship_refund_status;
  if (!st || st === 'none') return '';
  const [cl, lb] = REFUND[st] || ['st0', st];
  const amt = Number(j.ship_refund_amount ?? j.ship_in_fee) || 0;
  return `<div class="box-${st === 'paid' ? 'ok' : 'warn'}" style="margin-top:13px">
    <span class="pill ${cl}">${lb}</span>
    <b style="margin-left:8px">ต้องคืนลูกค้า ฿${money2(amt)}</b>
    ${st === 'pending' && isBoss()
      ? `<button class="btn sm" style="margin-left:8px" onclick="editRefund()">✏️ แก้ยอด</button>` : ''}
    <div class="sub2" style="margin-top:4px">
      ${j.ship_refund_ref ? 'เลขเอกสารเบิก <b>' + esc(j.ship_refund_ref) + '</b> · ' : ''}
      ${j.ship_refund_submitted_at
        ? 'ยื่น ' + dth(j.ship_refund_submitted_at) + ' โดย ' + esc(j.ship_refund_submitted_by || '—') : ''}
      ${j.ship_refund_paid_at
        ? ' · จ่ายคืน ' + dth(j.ship_refund_paid_at) + ' โดย ' + esc(j.ship_refund_paid_by || '—') : ''}
    </div>
    ${j.ship_refund_note ? `<div class="sub2">หมายเหตุ: ${esc(j.ship_refund_note)}</div>` : ''}
    ${st === 'pending' && !(j.receipt_count > 0)
      ? '<div class="sub2" style="color:var(--crit);margin-top:4px">⚠️ ยังไม่มีรูปใบเสร็จค่าส่ง — บัญชีมักขอดูก่อนอนุมัติ</div>' : ''}
  </div>`;
}

async function editRefund(){
  if (!S.job) return;
  const f = await formModal({
    title:'✏️ แก้ยอดที่ต้องคืนลูกค้า',
    subtitle:'ใส่ยอดตามใบเสร็จค่าส่งจริง · แก้ได้เฉพาะตอนยังไม่ได้ยื่นบัญชี',
    ok:'บันทึกยอด',
    fields:[
      { k:'amt',  label:'ยอดที่ต้องคืน (บาท)', type:'number', required:true, min:0,
        value: S.job.ship_refund_amount ?? S.job.ship_in_fee ?? 0 },
      { k:'note', label:'หมายเหตุ', placeholder:'เช่น ใบเสร็จจริง 72 บาท' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.rpc('refund_set_amount',
      { p_job_id:S.job.id, p_amount:Number(f.amt), p_note:f.note || null });
    if (error) throw error;
    toast('✅ แก้ยอดแล้ว');
    S.peek = null; openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}

/** สลับช่องในใบงานเมื่อเปลี่ยนที่มาของเคส */
function jobOriginChanged(){
  const int_ = val('sOrigin') === 'internal';
  if ($('jBoxCause'))    $('jBoxCause').hidden    = !int_;
  if ($('jBoxCase'))     $('jBoxCase').hidden     = int_;
  if ($('jBoxWarranty')) $('jBoxWarranty').hidden = int_;
  if ($('wBox'))         $('wBox').innerHTML      = int_ ? '' : warrantyBox(val('sWarranty'));
  document.querySelectorAll('[data-int-only]').forEach(el => { el.hidden = !int_; });
}

/** ตัวเลือกชื่อร้านสำหรับ datalist ในหน้าใบงาน */
function shopOptions(){
  return [...new Set((S.jobs || []).map(j => (j.shop_name || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'th'))
    .map(n => `<option value="${esc(n)}"></option>`).join('');
}

/** กล่องสรุปสถานะการแกะ + ปุ่มกด — โผล่ในขั้นรับเครื่อง */
function unboxBox(j){
  if (j.unboxed_at){
    const late = j.unbox_state === 'done_late';
    return `<div class="box-${late ? 'warn' : 'ok'}" style="margin-top:13px">
      ✅ <b>แกะกล่องแล้ว</b> เมื่อ ${dtth(j.unboxed_at)}
      ${j.unboxed_by ? 'โดย ' + esc(j.unboxed_by) : ''}
      ${j.unbox_days_used != null
        ? ` · ใช้ไป <b>${j.unbox_days_used} วัน</b>หลังของถึงศูนย์` : ''}
      ${late ? '<div class="sub2" style="margin-top:3px">ช้ากว่ากติกาที่ตั้งไว้</div>' : ''}
    </div>`;
  }
  if (!j.arrived_at) return `<div class="box-info" style="margin-top:13px">
    📦 <b>ยังไม่ได้ลงวันที่ขนส่งมาถึง</b> — กรอกวันข้างบนแล้วกดบันทึก
    ระบบจะเริ่มนับเวลาแกะกล่องให้</div>`;

  const d    = j.unbox_days_left;
  const kind = d < 0 ? 'crit' : d === 0 ? 'warn' : 'info';
  const head = d < 0 ? `🚨 <b>เกินกำหนดแกะมาแล้ว ${Math.abs(d)} วัน</b>`
             : d === 0 ? '⏰ <b>ครบกำหนดแกะวันนี้</b>'
             : `📦 <b>เหลือเวลาแกะอีก ${d} วัน</b>`;
  return `<div class="box-${kind}" style="margin-top:13px">
    ${head}
    <div class="sub2" style="margin-top:3px">
      ของถึงศูนย์ ${dth(j.arrived_at)} · ครบกำหนด ${dth(j.unbox_due)}</div>
    <div style="margin-top:9px">
      <button class="btn ${d < 0 ? 'dn' : 'g'}" onclick="markUnboxed()">📦 แกะกล่องแล้ว</button>
    </div></div>`;
}

/** บันทึกว่าแกะกล่องแล้ว — เวลาจับจากเครื่องเซิร์ฟเวอร์ แก้ย้อนหลังไม่ได้ */
async function markUnboxed(){
  if (!S.job) return;
  /* ถ้าเพิ่งพิมพ์วันที่ลงช่องแต่ยังไม่กดบันทึก ต้องเซฟก่อน ไม่งั้นฝั่งเซิร์ฟเวอร์ยังไม่มีวัน */
  const typed = val('sArrived');
  if (typed && String(S.job.arrived_at || '').slice(0,10) !== typed) await saveStep();

  const ok = await confirmModal('ยืนยันว่าแกะกล่องแล้ว',
    `${S.job.job_no} · ของถึงศูนย์ ${dth(typed || S.job.arrived_at)}\n\n` +
    'ระบบจะบันทึกเวลาตอนนี้เป็นเวลาที่แกะกล่อง แก้ย้อนหลังไม่ได้',
    { ok:'แกะแล้ว', danger:false });
  if (!ok) return;

  try {
    const { error } = await sb.rpc('mark_unboxed', { p_job_id:S.job.id, p_by:who() });
    if (error) throw error;
    toast('✅ บันทึกว่าแกะกล่องแล้ว');
    S.peek = null;
    openJob(S.job.id);
    reloadAll();
  } catch(e){ fail(e); }
}

/** A9 — พัสดุมาถึงศูนย์ */
async function receiveParcel(){
  if (!val('sTrackIn') && !await confirmModal('ยังไม่มีเลขพัสดุขาเข้า',
      'SOP ข้อ A9.1 ให้ตรวจสอบเลขอ้างอิงก่อนรับเข้า\nยืนยันรับเข้าโดยไม่มีเลขพัสดุ?', { ok:'รับเข้าเลย' })) return;
  S.peek = null;
  /* ยังไม่เคยลงวันของมาถึง ให้ถือว่าวันนี้ — นาฬิกาแกะกล่องจะได้เริ่มเดิน */
  const extra = { status:'received', received_at: new Date().toISOString() };
  if (!S.job?.arrived_at && !val('sArrived'))
    extra.arrived_at = new Date().toISOString().slice(0,10);
  await saveStep(extra);
}

/** A6 — แจ้งลูกค้าให้จัดส่งสินค้ามาที่ศูนย์ */
async function notifyCustomer(){
  if (!await confirmModal('บันทึกว่าแจ้งลูกค้าแล้ว',
      `${S.job.customer_name || 'ลูกค้า'} · ${S.job.customer_phone || 'ไม่มีเบอร์'}\n\n` +
      'ยืนยันว่าแจ้งให้จัดส่งสินค้ามาที่ศูนย์เรียบร้อยแล้ว\nระบบจะเริ่มนับวันรอพัสดุจากตอนนี้',
      { ok:'บันทึก', danger:false })) return;
  await saveStep({ notified_at: new Date().toISOString() });
}

/** A9.2 — เปิดรายการพัสดุที่หาเจ้าของไม่เจอ */
async function unknownParcel(){
  const f = await formModal({
    title:'รับพัสดุไม่ทราบที่มา',
    subtitle:'SOP A9.2 — พัสดุถึงศูนย์แต่ไม่พบข้อมูลอ้างอิงในระบบ',
    ok:'บันทึกพัสดุ',
    fields:[
      { k:'tracking_in', label:'เลขพัสดุบนกล่อง', required:true, placeholder:'เลข Tracking ที่หน้ากล่อง' },
      { k:'brand',    label:'แบรนด์บนกล่อง', half:true, placeholder:'MASARU / Kosen / ...' },
      { k:'platform', label:'ช่องทาง (ถ้าเดาได้)', type:'select', half:true,
        options:[{v:'',t:'— ไม่ทราบ —'}, ...PLATFORMS.map(p => ({v:p,t:p}))] },
      { k:'shop_name', label:'ร้านที่ต้องประสาน', placeholder:'ชื่อร้านบนฉลาก (ถ้ามี)' },
      { k:'unknown_note', label:'บันทึกลักษณะพัสดุ', type:'textarea',
        placeholder:'เช่น กล่องน้ำตาล ไม่มีใบเสร็จ มีเครื่องเจียร 1 ตัว' }
    ]});
  if (!f) return;
  try {
    const { data, error } = await sb.from('repair_jobs').insert({
      ...f, status:'unknown_parcel', case_type:'claim',
      symptom:'พัสดุไม่ทราบที่มา — รอประสานหาเจ้าของ',
      created_by: who(), admin_name: who()
    }).select('id, job_no').single();
    if (error) throw error;
    toast('✅ บันทึก ' + data.job_no + ' แล้ว');
    await reloadAll();
    openJob(data.id);
  } catch(e){ fail(e); }
}

/** A9.2 (ต่อ) — ประสานเจอเจ้าของแล้ว ผูกเข้าลูกค้า */
async function claimOwner(){
  const f = await formModal({
    title:'พบเจ้าของพัสดุแล้ว', subtitle:'ผูกพัสดุนี้เข้ากับลูกค้า แล้วเดินเรื่องซ่อมตามปกติ',
    ok:'ผูกและรับเข้าศูนย์',
    fields:[
      { k:'phone', label:'เบอร์โทรลูกค้า', required:true, half:true,
        hint:'ถ้าเคยซ่อมมาก่อน ระบบจะผูกกับประวัติเดิมให้' },
      { k:'name', label:'ชื่อลูกค้า', required:true, half:true },
      { k:'order_no', label:'เลขคำสั่งซื้อ', half:true },
      { k:'warranty_case', label:'เงื่อนไขประกัน', type:'select', half:true,
        value:'unknown', options:Object.entries(WARRANTY).map(([k,v]) => ({v:k, t:v.l})) },
      { k:'symptom', label:'อาการเสียที่ลูกค้าแจ้ง', type:'textarea', required:true }
    ]});
  if (!f) return;
  try {
    let c = S.custs.find(x => (x.phone||'') === f.phone);
    if (!c){
      const { data, error } = await sb.from('repair_customers')
        .insert({ name:f.name, phone:f.phone }).select('*').single();
      if (error) throw error;
      c = data;
    }
    S.peek = null;
    await saveStep({
      customer_id: c.id, order_no: f.order_no || null,
      warranty_case: f.warranty_case, symptom: f.symptom,
      status:'received', received_at: new Date().toISOString()
    });
  } catch(e){ fail(e); }
}

/* ---------------------------------------------------------------------
   ประเมินว่าซ่อมไม่ได้ — มี 2 ทางที่ปลายทางเครื่องต่างกันคนละเรื่อง
     เปลี่ยนสินค้าใหม่ = เครื่องเดิมออกจากบริษัท ลูกค้าได้เครื่องใหม่
     แยกเป็นสต๊อกอะไหล่ = เครื่องอยู่ในบริษัท ถอดเก็บเป็นอะไหล่
   ต้องแยกให้ออก ไม่งั้นรายงาน "ซ่อมไม่ได้" จะปนกันจนใช้ไม่ได้
   --------------------------------------------------------------------- */
function repairNoteHTML(v){
  if (v === 'salvage') return `<div class="box-warn" style="margin-top:12px">
    📦 <b>แยกเก็บเป็นสต๊อกอะไหล่</b> — เครื่องนี้ไม่ซ่อมและไม่ส่งคืนลูกค้า
    ให้ถอดเก็บเป็นอะไหล่ไว้ใช้กับเคสอื่น
    <div class="sub2" style="margin-top:4px">
      บันทึกแล้วจะไปโผล่ในรายการ <b>"เครื่องที่แยกเป็นอะไหล่"</b> ให้ฝ่ายคลังไปถอดต่อ ·
      ยังต้องแจ้งลูกค้าตามเงื่อนไขประกันตามปกติ</div></div>`;
  if (v === 'no') return `<div class="box-warn" style="margin-top:12px">
    🔄 <b>ควรเปลี่ยนสินค้าใหม่</b> — ไปที่ขั้นซ่อม แล้วกดปุ่ม
    <b>"ซ่อมไม่ได้ เปลี่ยนสินค้า"</b> เพื่อออกเลขพัสดุใหม่ตาม SOP A12b</div>`;
  return '';
}

function repairableChanged(){
  const v = val('sRepairable');
  if ($('sRepairNote')) $('sRepairNote').innerHTML = repairNoteHTML(v);
}

/** A12b — ซ่อมไม่ได้ / ใช้เวลานาน → ส่งสินค้าใหม่ให้ลูกค้าทันที */
async function replaceUnit(){
  const f = await formModal({
    title:'เปลี่ยนสินค้า', subtitle:'SOP A12b — ซ่อมไม่ได้ หรือใช้เวลานานเกินไป จึงส่งสินค้าใหม่ให้ลูกค้า',
    ok:'ยืนยันเปลี่ยนสินค้า', danger:true,
    fields:[
      { k:'tracking_out', label:'เลขพัสดุขาออก (สินค้าใหม่)', required:true,
        value:S.job.tracking_out, hint:'เลขนี้จะเป็นเลขบิลใหม่ที่ผูกกับใบงานนี้' },
      { k:'old_unit_disposition', label:'ปลายทางเครื่องเดิม', type:'select', required:true,
        value:'repair_resell', options:Object.entries(DISPOSITION).map(([k,v]) => ({v:k, t:v})) },
      { k:'note', label:'เหตุผล / หมายเหตุ', type:'textarea',
        value:S.job.note, placeholder:'เช่น อะไหล่หลักไม่มีในสต็อก รอ 3 สัปดาห์' }
    ]});
  if (!f) return;
  S.peek = null;
  await saveStep({
    case_type:'replace', tracking_out:f.tracking_out,
    old_unit_disposition:f.old_unit_disposition, note:f.note || null,
    status:'ready'
  });
  toast('✅ บันทึกเป็นเคสเปลี่ยนสินค้าแล้ว — ไปขั้นส่งมอบเพื่อปิดงาน');
}

/* ---------------------------------------------------------------------
   ไม่รับเคลม แต่ขอคลิป — ปิดเรื่องไว้ก่อน ยังเปิดช่องให้ลูกค้าส่งคลิปมาแย้ง
   ต่างจากไม่รับเคลมธรรมดาตรงที่ยังมีอะไรให้รอ จึงต้องตามได้ว่ารอมากี่วันแล้ว
   --------------------------------------------------------------------- */
const CLIP_ASK = [
  'ถ่ายตอนกดสวิตช์ ให้เห็นทั้งเครื่องในคลิปเดียว',
  'ถ่ายให้เห็น Serial No. บนตัวเครื่องชัด ๆ',
  'ถ่ายตอนเสียบแบต / ชาร์จ ให้เห็นไฟสถานะ',
  'ถ่ายอาการเสียตอนใช้งานจริง ไม่ตัดต่อ'
];

async function requestClip(){
  if (!S.job) return;
  const f = await formModal({
    title:'📹 ไม่รับเคลม — ขอคลิปจากลูกค้า',
    subtitle:'ปิดเรื่องไว้ก่อน แต่ยังเปิดช่องให้ลูกค้าส่งคลิปมาแย้ง · ถ้าคลิปชัดว่าเสียจริง เปิดเรื่องต่อได้',
    ok:'บันทึกและขอคลิป', danger:true,
    fields:[
      { k:'ask', label:'ขอให้ลูกค้าถ่ายอะไร', required:true, list:CLIP_ASK,
        hint:'พิมพ์เองได้ หรือเลือกจากรายการที่ใช้บ่อย',
        placeholder:'เช่น ถ่ายตอนกดสวิตช์ ให้เห็นทั้งเครื่อง + เห็น Serial ในคลิปเดียว' },
      { k:'channel', label:'แจ้งลูกค้าทางไหน', half:true,
        list:['Shopee chat','TikTok chat','Lazada chat','LINE','โทรศัพท์','Facebook'],
        placeholder:'Shopee chat / LINE / โทร' }
    ]});
  if (!f) return;
  try {
    const note = f.ask + (f.channel ? ' · แจ้งทาง ' + f.channel : '');
    const { error } = await sb.rpc('request_clip',
      { p_job_id:S.job.id, p_note:note, p_by:who() });
    if (error) throw error;
    toast('📹 บันทึกว่าขอคลิปแล้ว — เคสนี้จะอยู่ในรายการ "รอคลิปจากลูกค้า"');
    S.peek = null;
    openJob(S.job.id);
    reloadAll();
  } catch(e){ fail(e); }
}

/** ลูกค้าส่งคลิปมาแล้ว — เปิดเรื่องกลับมาเดินตามขั้นตอนปกติ */
async function clipReceived(){
  if (!S.job) return;
  const f = await formModal({
    title:'✅ ได้คลิปจากลูกค้าแล้ว',
    subtitle:'ใบงานจะกลับไปขั้นตรวจเช็ค แล้วเดินเรื่องตามปกติ',
    ok:'เปิดเรื่องต่อ',
    fields:[
      { k:'note', label:'คลิปบอกอะไร', type:'textarea',
        placeholder:'เช่น คลิปเห็นชัดว่ากดสวิตช์แล้วไม่ติดจริง' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.rpc('clip_received',
      { p_job_id:S.job.id, p_note:f.note || null, p_by:who() });
    if (error) throw error;
    toast('✅ เปิดเรื่องต่อแล้ว — ไปขั้นตรวจเช็คได้เลย');
    S.peek = null;
    openJob(S.job.id);
    reloadAll();
  } catch(e){ fail(e); }
}

/** A3.1 — ไม่รับเคลม ปิดเรื่อง */
async function rejectClaim(){
  const f = await formModal({
    title:'ไม่รับเคลม — ปิดเรื่อง', subtitle:'ตาม SOP ข้อ A3.1 ต้องบันทึกเหตุผลทุกครั้ง',
    ok:'ยืนยันไม่รับเคลม', danger:true,
    fields:[
      { k:'reason', label:'เหตุผล', type:'select', required:true, value:'not_genuine', options:[
        { v:'not_genuine',   t:'เป็นสินค้าปลอม / ไม่ใช่สินค้าของบริษัท' },
        { v:'not_our_channel', t:'ไม่ได้ซื้อจากบริษัทหรือช่องทางจำหน่ายที่เป็นทางการ' },
        { v:'customer_decline', t:'ลูกค้าไม่ประสงค์ใช้บริการต่อ (A3.3)' },
        { v:'other', t:'อื่น ๆ' } ]},
      { k:'note', label:'รายละเอียดเพิ่มเติม', type:'textarea',
        placeholder:'บันทึกสิ่งที่แจ้งลูกค้าไป' }
    ]});
  if (!f) return;
  const TXT = { not_genuine:'สินค้าปลอม/ไม่ใช่ของบริษัท', not_our_channel:'ไม่ได้ซื้อจากช่องทางทางการ',
                customer_decline:'ลูกค้าไม่ประสงค์ใช้บริการต่อ', other:'อื่น ๆ' };
  S.peek = null;
  await saveStep({ status:'rejected', case_type:'consult',
    reject_reason: TXT[f.reason] + (f.note ? ' — ' + f.note : '') });
}

async function setStatus(st){
  S.peek = null;
  await saveStep({ status: st });
}

async function moveStep(to){
  const from = S.peek || stepOf(S.job.status) || 1;
  if (to > from){
    if (from === 1 && !val('sSymptom')) return toast('กรอกอาการเสียที่ลูกค้าแจ้งก่อน', true);
    if (from === 1 && (!val('sWarranty') || val('sWarranty') === 'unknown'))
      return toast('เลือกเงื่อนไขประกันก่อน — ถ้าไม่เลือก ตัวเลขในรายงานจะเพี้ยนทั้งหมด', true);
    if (from === 2 && !val('sInspect')) return toast('กรอกอาการที่พบจากการตรวจเช็คก่อน', true);
    if (from === 3 && !val('sDiff'))
      return toast('เลือกระดับความยากก่อน — ระบบใช้ค่านี้จ่ายงานและคิดกำหนดเสร็จ', true);
    if (from === 3 && !S.job.technician_id)
      return toast('ยังไม่มีช่างรับงานใบนี้ — กด "จ่ายงานเดี๋ยวนี้" หรือรอคิว', true);
    if (from === 4 && !val('sMethod'))  return toast('กรอกวิธีการซ่อมก่อน', true);
    if (from === 5 && !isBoss())        return toast('ขั้นตรวจสอบต้องให้หัวหน้างานกดผ่าน', true);
    if (from === 5 && !val('sNote'))    return toast('กรอกสรุปผลการทดสอบก่อน', true);
  }
  S.peek = null;
  await saveStep({ status: STEPS[to-1].main });
}

function showHistory(cid){ goPage('cust'); openCust(cid); }

async function addLineInline(){
  const pn = val('aPart').toUpperCase();
  const p = S.parts.find(x => x.part_no.toUpperCase() === pn);
  if (!p) return toast('ไม่พบอะไหล่รหัสนี้ในทะเบียน', true);
  const q = Number(val('aQty')) || 0;
  if (q < 1) return toast('จำนวนต้องมากกว่า 0', true);
  try {
    const cust = partsByCustomer(S.job);
    const auto = cust ? (p.sell_price ?? 0) : (p.cost_price ?? 0);
    const { error } = await sb.from('repair_parts_used').insert({
      job_id:S.job.id, part_id:p.id, qty:q,
      unit_price: val('aPrice') === '' ? auto : Number(val('aPrice')),
      unit_cost:  Number(p.cost_price) || 0,
      price_basis: cust ? 'sell' : 'cost',
      created_by:who() });
    if (error) throw error;
    toast('✅ เพิ่ม ' + p.part_no + ' — ตัดสต็อกแล้ว · คิด'
      + (cust ? 'ราคาขาย (ลูกค้าจ่าย)' : 'ราคาทุน (เคลม บริษัทแบก)'));
    await openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}


async function removeLine(id){
  if (!await confirmModal('ลบรายการอะไหล่นี้?', 'ระบบจะคืนของเข้าสต็อกอัตโนมัติ และบันทึกลง log การเคลื่อนไหว', { ok:'ลบและคืนของ' })) return;
  try {
    const { error } = await sb.from('repair_parts_used').delete().eq('id', id);
    if (error) throw error;
    toast('ลบแล้ว — คืนของเข้าสต็อก');
    await openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}



/* =====================================================================
   คำขอแก้ / คืนอะไหล่ — ต้องหัวหน้าอนุมัติ แล้วระบบคิดยอดใหม่เอง
   ===================================================================== */
const ADJ_KIND = { edit:'ขอแก้จำนวน', return:'ขอคืนของ / ไม่ได้ใช้' };

/** กล่องคำขอของใบงานนี้ — โชว์ในขั้น 4 */
function adjustBox(jobId){
  const rows = (S.adjust || []).filter(a => a.job_id === jobId);
  if (!rows.length) return '';
  return `<div style="margin-top:16px" class="box-warn">
    ⏳ <b>คำขอแก้อะไหล่ที่รอหัวหน้าอนุมัติ ${rows.length} รายการ</b>
    <div class="tw" style="margin-top:9px"><table>
      <thead><tr><th>รายการ</th><th>คำขอ</th><th class="num">เดิม</th><th class="num">ใหม่</th>
        <th>เหตุผล</th><th>ผู้ขอ</th><th class="num noprint"></th></tr></thead>
      <tbody>${rows.map(a => `<tr>
        <td class="mono"><b>${esc(a.part_no||'—')}</b><div class="sub2">${esc(a.part_name||'')}</div></td>
        <td><span class="pill st1">${esc(ADJ_KIND[a.kind]||a.kind)}</span></td>
        <td class="num">${a.qty_now ?? '—'}</td>
        <td class="num"><b>${a.kind === 'return' ? '0' : (a.qty_new ?? '—')}</b></td>
        <td class="sub2">${esc(a.reason||'')}</td>
        <td class="sub2">${esc(a.requested_by||'—')}<div class="sub2">${esc(dth(a.created_at))}</div></td>
        <td class="num noprint">${isBoss()
          ? `<button class="btn ic" onclick="decideAdjust('${a.id}',true)" title="อนุมัติ">✓</button>
             <button class="btn ic dn" onclick="decideAdjust('${a.id}',false)" title="ไม่อนุมัติ">✕</button>`
          : '<span class="muted">รออนุมัติ</span>'}</td></tr>`).join('')}</tbody>
    </table></div></div>`;
}

/** กล่องอะไหล่ที่ขาดของใบงานนี้ */
function shortageBox(jobId){
  const rows = (S.shortage || []).filter(s => s.job_id === jobId);
  if (!rows.length) return '';
  return `<div style="margin-top:16px" class="box-crit">
    🧾 <b>อะไหล่ที่ขาด ${rows.length} รายการ</b> — เข้าใบขอจัดซื้อรายวันแล้ว
    <div style="margin-top:7px">${rows.map(s =>
      `<div>• <b class="mono">${esc(s.part_no)}</b> ${esc(s.part_name)} ×${s.qty_short} ${esc(s.unit||'')}
        <span class="muted">· ค้าง ${s.days_waiting} วัน${s.note ? ' · ' + esc(s.note) : ''}</span></div>`).join('')}</div>
    <div class="muted" style="font-size:12.5px;margin-top:6px">
      หัวหน้าออกใบขอจัดซื้อได้ที่ คลังอะไหล่ → อะไหล่ที่ขาด</div></div>`;
}

async function requestAdjust(usedId, kind){
  const l = S.lines.find(x => x.id === usedId);
  if (!l) return toast('ไม่พบรายการนี้', true);
  const pn = l.parts_master?.part_no || '';

  const f = await formModal({
    title: ADJ_KIND[kind], subtitle: pn + ' · ' + (l.parts_master?.name || '') + ' · ใช้อยู่ ' + l.qty,
    ok: isBoss() ? 'บันทึกและอนุมัติเลย' : 'ส่งให้หัวหน้าอนุมัติ', danger: kind === 'return',
    fields: [
      ...(kind === 'edit'
        ? [{ k:'qty_new', label:'จำนวนที่ใช้จริง', type:'number', required:true, min:1, value:l.qty }]
        : []),
      { k:'reason', label:'เหตุผล', type:'textarea', required:true,
        placeholder: kind === 'return' ? 'เช่น เบิกมาเกิน ไม่ได้ใช้ คืนเข้าคลัง' : 'เช่น ใช้จริง 1 ชิ้น ไม่ใช่ 2' }
    ]});
  if (!f) return;

  try {
    const { data, error } = await sb.rpc('request_parts_adjust', {
      p_used_id: usedId, p_kind: kind,
      p_qty_new: kind === 'edit' ? Number(f.qty_new) : null,
      p_reason: f.reason, p_by: who() });
    if (error) throw error;

    /* หัวหน้าทำเอง = อนุมัติในจังหวะเดียว ไม่ต้องรอใคร */
    if (isBoss()){
      const r = await sb.rpc('decide_parts_adjust',
        { p_id: data, p_approve: true, p_note: 'หัวหน้าดำเนินการเอง', p_by: who() });
      if (r.error) throw r.error;
      toast('✅ แก้แล้ว — ระบบคิดยอดรวมใหม่และปรับสต็อกให้เรียบร้อย');
    } else {
      toast('📨 ส่งคำขอให้หัวหน้าแล้ว — ยอดรวมจะเปลี่ยนหลังอนุมัติ');
    }
    await openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}

async function decideAdjust(id, ok){
  const a = (S.adjust || []).find(x => x.id === id);
  const f = await formModal({
    title: ok ? 'อนุมัติคำขอ' : 'ไม่อนุมัติคำขอ',
    subtitle: a ? `${a.part_no} · ${ADJ_KIND[a.kind]} · ผู้ขอ ${a.requested_by || '—'}` : '',
    ok: ok ? 'อนุมัติ — คิดยอดใหม่' : 'ไม่อนุมัติ', danger: !ok,
    fields: [{ k:'note', label:'หมายเหตุของหัวหน้า', type:'textarea',
      placeholder: ok ? 'เช่น ตรวจของคืนแล้วครบ' : 'เช่น อะไหล่ตัวนี้ใช้จริงตามที่เบิก' }]
  });
  if (!f) return;
  try {
    const { error } = await sb.rpc('decide_parts_adjust',
      { p_id:id, p_approve:ok, p_note:f.note || null, p_by:who() });
    if (error) throw error;
    toast(ok ? '✅ อนุมัติแล้ว — ยอดรวมและสต็อกอัปเดตแล้ว' : 'ไม่อนุมัติคำขอนี้');
    if (S.job) await openJob(S.job.id);
    reloadAll();
  } catch(e){ fail(e); }
}


/* =====================================================================
   อะไหล่ขาด → ใบขอจัดซื้อรายวัน (SOP A11b.1)
   ===================================================================== */
async function reportShortage(){
  const f = await formModal({
    title:'แจ้งอะไหล่ขาด', subtitle:'เข้าสรุปรายวัน แล้วหัวหน้าออกใบขอจัดซื้อได้ทันที',
    ok:'บันทึกอะไหล่ขาด', danger:true,
    fields:[
      { k:'part_no', label:'รหัสอะไหล่ที่ขาด', required:true, upper:true, half:true,
        list:S.parts.map(p => p.part_no), placeholder:'BR-00124' },
      { k:'qty', label:'จำนวนที่ต้องใช้', type:'number', required:true, min:1, value:1, half:true },
      { k:'note', label:'หมายเหตุ', placeholder:'เช่น ในคลังเหลือ 0 ต้องสั่งเข้า' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.rpc('report_shortage', {
      p_job_id:S.job.id, p_part_no:f.part_no, p_qty:Number(f.qty),
      p_note:f.note || null, p_by:who() });
    if (error) throw error;
    toast('✅ บันทึกแล้ว — ใบงานเปลี่ยนเป็น "รออะไหล่"');
    await openJob(S.job.id); reloadAll();
  } catch(e){ fail(e); }
}

async function makePR(d){
  const f = await formModal({
    title:'ออกใบขอจัดซื้ออะไหล่', subtitle:'รวมอะไหล่ที่ขาดของวันที่ ' + dth(d) + ' ทุกเคสเป็นใบเดียว',
    ok:'ออกใบขอจัดซื้อ',
    fields:[{ k:'note', label:'หมายเหตุถึงจัดซื้อ / ผู้อนุมัติ', type:'textarea',
      placeholder:'เช่น ขออนุมัติสั่งด่วน มีเคสลูกค้ารออยู่ 3 เคส' }]
  });
  if (!f) return;
  try {
    const { data, error } = await sb.rpc('make_purchase_request',
      { p_date:d, p_note:f.note || null, p_by:who() });
    if (error) throw error;
    toast('✅ ออกใบ ' + data + ' แล้ว');
    await loadParts();
    printPR(data);
  } catch(e){ fail(e); }
}

async function receivePR(no){
  if (!await confirmModal('รับอะไหล่ตามใบ ' + no + '?',
      'ระบบจะรับเข้าสต็อกทุกบรรทัดในใบนี้ และปิดรายการอะไหล่ที่ขาดให้อัตโนมัติ', { ok:'รับเข้าคลัง', danger:false })) return;
  try {
    const { data, error } = await sb.rpc('receive_purchase_request', { p_pr_no:no, p_by:who() });
    if (error) throw error;
    toast(`✅ รับเข้าแล้ว ${data} รายการ`);
    await loadParts(); reloadAll();
  } catch(e){ fail(e); }
}


/* =====================================================================
   จ่ายงานช่าง — ช่องรับงานตามระดับความยาก + คิวยุติธรรม
     · ช่างทุกคนมีช่องละ 1 งานต่อระดับ (ปรับได้ในหน้าตั้งค่า)
     · เติมช่องให้เต็มก่อน เกินนั้นรอคิว
     · ช่องว่างนานที่สุด = ได้งานใหม่ก่อน
   ===================================================================== */

/** "ว่างมา x" — อ่านง่ายกว่าโชว์วันเวลาเต็ม */
function agoTxt(ts){
  if (!ts) return '';
  const t = new Date(ts).getTime();
  if (!t || t < 864e5) return 'ยังไม่เคยรับงานระดับนี้';
  const h = (Date.now() - t) / 36e5;
  if (h < 1)  return 'ว่างมา ' + Math.max(1, Math.round(h * 60)) + ' นาที';
  if (h < 24) return 'ว่างมา ' + Math.round(h) + ' ชม.';
  return 'ว่างมา ' + Math.round(h / 24) + ' วัน';
}
const waitTxt = hrs => !hrs || hrs < 1 ? Math.max(1, Math.round((hrs||0)*60)) + ' นาที'
                     : hrs < 24 ? Math.round(hrs) + ' ชม.'
                     : Math.round(hrs/24) + ' วัน';

async function loadDispatch(){
  try {
    const [board, queue] = await Promise.all([
      sb.from('v_tech_slots').select('*'),
      sb.from('v_dispatch_queue').select('*')
    ]);
    if (board.error) throw board.error;
    S.board = board.data || [];
    S.queue = queue.error ? [] : (queue.data || []);
    /* ความจุจริงอ่านจาก view (slot_capacity ฝั่ง DB) ค่า SLOTS ใช้แค่ตอนไม่มีข้อมูล */
    LEVELS.forEach(l => {
      const r = S.board.find(x => x.level === l.k);
      if (r && r.capacity) SLOTS[l.k] = Number(r.capacity);
    });
    renderDispatch();
  } catch(e){
    if (/does not exist|not exist/i.test(e.message||''))
      toast('❌ ยังไม่ได้รัน 16_dispatch.sql — หน้าจ่ายงานยังใช้ไม่ได้', true);
    else fail(e);
  }
}

function renderDispatch(){
  const board = S.board || [], queue = S.queue || [];
  const by = {};                      // technician_id → { light, medium, heavy }
  board.forEach(r => { (by[r.technician_id] = by[r.technician_id] || {})[r.level] = r; });

  const techs = [...new Set(board.map(r => r.technician_id))]
    .map(id => ({ id, ...board.find(r => r.technician_id === id) }))
    .sort((a,b) => (a.code||'').localeCompare(b.code||''));

  const capAll  = techs.length * LEVELS.reduce((s,l) => s + (Number(SLOTS[l.k])||1), 0);
  const usedAll = board.reduce((s,r) => s + Number(r.used||0), 0);
  const freeAll = Math.max(0, capAll - usedAll);

  /* ---- KPI ---- */
  $('dspKpi').innerHTML = [
    ['na','🎯','ช่องทั้งหมด', capAll,      techs.length + ' ช่าง × ' +
      LEVELS.map(l => (Number(SLOTS[l.k])||1)).join('+') + ' ช่อง'],
    ['nb','🔧','ใช้อยู่',      usedAll,     capAll ? Math.round(usedAll/capAll*100) + '% ของความจุ' : ''],
    [freeAll ? 'nc' : 'nd','🟩','ช่องว่าง', freeAll, freeAll ? 'พร้อมรับงานใหม่' : 'เต็มทุกช่อง'],
    [queue.length ? 'nd' : 'nc','⏳','รอคิว', queue.length,
      queue.length ? 'รอนานสุด ' + waitTxt(Math.max(...queue.map(q => Number(q.hours_waiting)||0))) : 'ไม่มีงานค้างคิว']
  ].map(([cl,e,l,n,u]) => `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
    <div class="n">${n}</div><div class="sub2">${esc(u)}</div></div>`).join('');

  $('dspRule').textContent = 'ช่องต่อคน — ' +
    LEVELS.map(l => l.t + ' ' + (Number(SLOTS[l.k])||1)).join(' · ') + ' (แก้ได้ที่ตั้งค่า)';
  $('dspRun').hidden = !isBoss() || !queue.length || !freeAll;

  /* ---- กระดาน ---- */
  $('tblBoard').querySelector('tbody').innerHTML = techs.length ? techs.map(t => {
    const mine = t.technician_id === ME.techId;
    return `<tr ${mine ? 'style="background:var(--gold-l)"' : ''}>
      <td><b>${esc(t.tech_name)}</b>${mine ? ' <span class="pill st1">คุณ</span>' : ''}
        <div class="sub2 mono">${esc(t.code||'')}</div></td>
      ${LEVELS.map(l => slotCell(by[t.technician_id]?.[l.k], l)).join('')}
      <td class="num"><b style="font-size:16px">${t.load_total ?? 0}</b></td></tr>`;
  }).join('') : '<tr><td colspan="5" class="empty">ยังไม่มีช่างที่ใช้งานอยู่</td></tr>';

  /* ---- คิว ---- */
  $('dspQCount').textContent = queue.length + ' ใบ';
  $('dspQEmpty').style.display = queue.length ? 'none' : 'block';
  $('tblQueue').querySelector('tbody').innerHTML = queue.map(q => {
    const lv = LEVELS.find(l => l.k === q.severity) || { t:'—', ico:'' };
    const wait = Number(q.hours_waiting) || 0;
    return `<tr class="click" onclick="openJob('${q.id}')">
      <td class="num"><b>${q.queue_no}</b></td>
      <td class="mono"><b>${esc(jobRef(q))}</b></td>
      <td><span class="pill lv-${q.severity}">${lv.ico} ${lv.t}</span></td>
      <td>${esc(q.customer_name || '—')}</td>
      <td>${esc([q.brand,q.model].filter(Boolean).join(' ') || q.tool_type || '—')}</td>
      <td class="sub2">${esc((q.symptom||'').slice(0,40))}</td>
      <td class="num ${wait >= 24 ? '' : 'muted'}" ${wait >= 24 ? 'style="color:var(--crit);font-weight:700"' : ''}>
        ${esc(waitTxt(wait))}</td>
      <td class="num noprint nostop" onclick="event.stopPropagation()">
        ${isBoss() ? `<button class="btn sm" onclick="assignOne('${q.id}')">จ่ายใบนี้</button>` : ''}</td></tr>`;
  }).join('');

  /* ---- ใบที่ยังไม่ระบุระดับ = ไม่เข้าคิว ---- */
  const noLv = S.jobs.filter(j => !j.severity && !j.technician_id && !CLOSED.includes(j.status));
  $('cardNoLevel').hidden = !noLv.length;
  $('noLvCount').textContent = noLv.length + ' ใบ';
  if (noLv.length) $('tblNoLevel').querySelector('tbody').innerHTML = noLv.map(j => `<tr>
    <td class="mono"><b>${esc(jobRef(j))}</b></td>
    <td>${esc(j.customer_name || '—')}</td>
    <td>${esc([j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || '—')}</td>
    <td class="sub2">${esc((j.symptom||'').slice(0,40))}</td>
    <td class="num">${j.days_in_shop ?? 0} วัน</td>
    <td class="num noprint"><button class="btn sm p" onclick="openJob('${j.id}')">ระบุระดับ</button></td></tr>`).join('');
}

/** ช่องเดียวในกระดาน — เต็ม = โชว์ใบงาน · ว่าง = โชว์ว่าว่างมานานแค่ไหน */
function slotCell(s, lv){
  if (!s) return '<td class="muted">—</td>';
  const cap = Number(s.capacity) || 1, used = Number(s.used) || 0;
  const jobs = S.jobs.filter(j => j.technician_id === s.technician_id
                               && j.severity === lv.k && !CLOSED.includes(j.status));
  const chips = jobs.map(j => `<div class="slotjob ${j.days_overdue > 0 ? 'late' : ''}"
      onclick="openJob('${j.id}')" title="${esc(j.symptom||'')}">
      <b>${esc(jobRef(j).replace(/^REP-\d{4}-/,'#').slice(-12))}</b>
      <span>${esc([j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || '')}</span>
      ${j.days_overdue > 0 ? `<em>เกิน ${j.days_overdue} วัน</em>` : ''}</div>`).join('');
  /* ระบบนับว่าใช้อยู่ n งาน แต่หาใบในเครื่องไม่เจอ (คนละสิทธิ์ / ยังไม่รีเฟรช)
     ต้องโชว์ว่าไม่ว่าง ไม่งั้นช่องจะดูโล่งทั้งที่มีงานอยู่ */
  const ghost = Math.max(0, used - jobs.length);
  const busy = ghost ? `<div class="slotjob" style="cursor:default;border-left-color:var(--ink3)">
      <b>กำลังทำอยู่</b><span>${ghost} งาน</span></div>` : '';
  const empty = Array.from({ length: Math.max(0, cap - used) }, () =>
    `<div class="slotfree">ว่าง<span>${esc(agoTxt(s.free_since))}</span></div>`).join('');
  return `<td class="slotcell lv-${lv.k}">${chips}${busy}${empty}</td>`;
}

/** จ่ายทั้งคิว */
async function runDispatch(){
  const btn = $('dspRun');
  btn.disabled = true; btn.textContent = 'กำลังจ่าย…';
  try {
    const { data, error } = await sb.rpc('dispatch_queue', { p_by: who() });
    if (error) throw error;
    const n = (data || []).length;
    if (!n) toast('ไม่มีช่องว่างที่ตรงกับระดับของงานในคิว — ต้องรอช่างเคลียร์งานก่อน');
    else {
      toast(`✅ จ่ายงานแล้ว ${n} ใบ`);
      await formModal({
        title:'ผลการจ่ายงาน', subtitle:`จ่ายไป ${n} ใบ ตามลำดับคิว`, ok:'ปิด',
        fields:[{ k:'x', label:'รายละเอียด', type:'textarea',
          value:(data||[]).map(r => {
            const lv = LEVELS.find(l => l.k === r.level);
            return `${refByNo(r.job_no)}  →  ${r.tech_name}  (${lv ? lv.t : r.level}` +
                   `${r.waited_hours ? ' · รอมา ' + waitTxt(Number(r.waited_hours)) : ''})`;
          }).join('\n') }]
      });
    }
    await loadDispatch(); reloadAll();
  } catch(e){ fail(e); }
  finally { btn.disabled = false; btn.textContent = '⚡ จ่ายงานอัตโนมัติ'; }
}

/** จ่ายใบเดียว */
async function assignOne(id){
  try {
    const { data, error } = await sb.rpc('auto_assign', { p_job_id:id, p_by:who() });
    if (error) throw error;
    if (!data) toast('ยังไม่มีช่องว่างของระดับนี้ — ใบนี้รอคิวต่อ', true);
    else toast('✅ จ่ายให้ ' + data + ' แล้ว');
    await loadDispatch(); reloadAll();
  } catch(e){ fail(e); }
}

/* =====================================================================
   ลูกค้า
   ===================================================================== */
const CT = { end_user:'ลูกค้าทั่วไป', dealer:'ดีลเลอร์ / ร้านค้า', shop:'หน้าร้าน', internal:'ภายในบริษัท' };
function renderCust(){
  const q = val('cSearch').toLowerCase();
  const rows = S.custs.map(c => {
    const mine = S.jobs.filter(j => j.customer_id === c.id);
    return { ...c, n:mine.length,
      sum: mine.reduce((s,j) => s + Number(j.total_cost||0), 0),
      last: mine.length ? mine[0].received_at : null };
  }).filter(c => !q || [c.name,c.phone].join(' ').toLowerCase().includes(q))
    .sort((a,b) => b.n - a.n);

  $('custKpi').innerHTML = [
    ['na','👥','ลูกค้าทั้งหมด', S.custs.length, 'ราย'],
    ['ne','🔁','ลูกค้าซ้ำ',     rows.filter(c => c.n > 1).length, 'ราย'],
    ['nc','🏪','ดีลเลอร์',      S.custs.filter(c => c.customer_type === 'dealer').length, 'ราย'],
    ['na','💰','ยอดซ่อมรวม',   '฿' + money(rows.reduce((s,c) => s + c.sum, 0)), '']
  ].map(([cl,e,l,n,u]) => `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
    <div class="n">${n}<small>${u}</small></div></div>`).join('');

  $('custEmpty').style.display = rows.length ? 'none' : 'block';
  const mc = paginate(rows, 'cust');
  $('pgCust').innerHTML = pagerHTML(mc, 'cust');
  $('tblCust').querySelector('tbody').innerHTML = mc.slice.map(c => `<tr class="click" tabindex="0"
    onclick="openCust('${c.id}')" onkeydown="if(event.key==='Enter')openCust('${c.id}')">
    <td><b>${esc(c.name)}</b><div class="sub2">${esc(c.address||'')}</div></td>
    <td>${esc(c.phone||'—')}</td>
    <td><span class="pill st1">${CT[c.customer_type]||c.customer_type}</span></td>
    <td class="num">${c.n}</td><td class="num">฿${money(c.sum)}</td><td>${dth(c.last)}</td></tr>`).join('');
}

function openCust(id){
  const c = S.custs.find(x => x.id === id); if (!c) return;
  S.custView = id;
  const rows = S.jobs.filter(j => j.customer_id === id)
                     .sort((a,b) => new Date(b.received_at) - new Date(a.received_at));
  const sum = rows.reduce((s,j) => s + Number(j.total_cost||0), 0);
  const open = rows.filter(j => !CLOSED.includes(j.status)).length;

  $('cdName').textContent = c.name;
  $('cdMeta').textContent = [c.phone, c.address].filter(Boolean).join(' · ') || 'ไม่มีข้อมูลติดต่อ';
  $('cdCount').textContent = rows.length + ' งาน';

  $('cdKpi').innerHTML = [
    ['na','🔧','ซ่อมทั้งหมด', rows.length, 'ครั้ง'],
    ['nb','⏳','งานค้างอยู่', open, 'ใบ'],
    ['nc','💰','ยอดรวมสะสม', '฿' + money(sum), ''],
    ['ne','📅','ซ่อมล่าสุด', rows.length ? dth(rows[0].received_at) : '—', '']
  ].map(([cl,e,l,v,u]) => `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
    <div class="n" style="font-size:${String(v).length > 7 ? '20px' : '29px'}">${v}<small>${u}</small></div></div>`).join('');

  $('tblCustJobs').querySelector('tbody').innerHTML = rows.length ? rows.map(j => {
    const s = stepOf(j.status);
    return `<tr class="click" tabindex="0" onclick="openJob('${j.id}')"
      onkeydown="if(event.key==='Enter')openJob('${j.id}')">
      <td class="mono"><b>${esc(jobRef(j))}</b></td>
      <td>${esc([j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || '—')}
        <div class="sub2">${esc(j.serial_no||'')}</div></td>
      <td>${esc(j.symptom||'—')}</td>
      <td><span class="pill st${s||0}"><span class="d"></span>${STATUS[j.status]||j.status}</span></td>
      <td>${dth(j.received_at)}</td>
      <td class="num"><b>฿${money(j.total_cost)}</b></td></tr>`;
  }).join('') : '<tr><td colspan="6" class="empty">ยังไม่เคยส่งซ่อม</td></tr>';

  $('custList').hidden = true; $('custDetail').hidden = false;
  $('pgTitle').textContent = c.name;
  $('pgSub').textContent = 'ประวัติการซ่อมของลูกค้ารายนี้';
  window.scrollTo(0,0);
}

function closeCust(){
  S.custView = null;
  $('custDetail').hidden = true; $('custList').hidden = false;
  $('pgTitle').textContent = PGT.cust[0]; $('pgSub').textContent = PGT.cust[1];
}

/* =====================================================================
   คลังอะไหล่
   ===================================================================== */
async function loadParts(){
  try {
    const [stock, sh, pr, sv] = await Promise.all([
      window.__pageAll(() => sb.from('v_parts_stock').select('*')),
      sb.from('v_shortage_daily').select('*').limit(200),
      sb.from('v_purchase_requests').select('*').limit(100),
      sb.from('v_salvage_units').select('*').limit(300)
    ]);
    S.stock = stock;
    S.shortDaily = sh.error ? [] : (sh.data || []);
    S.prs        = pr.error ? [] : (pr.data || []);
    /* ยังไม่ได้รัน 23_salvage.sql ก็ไม่ต้องพัง แค่ซ่อนการ์ดไว้ */
    S.salvage    = sv.error ? [] : (sv.data || []);
    if (sh.error) console.warn('v_shortage_daily', sh.error.message);
    if (sv.error) console.warn('v_salvage_units — ยังไม่ได้รัน 23_salvage.sql?', sv.error.message);
    renderParts(); renderShortage(); renderPR(); renderAdjust(); renderSalvage(); renderBell();
  } catch(e){ fail(e); }
}

/* ---------- เครื่องที่แยกไว้เป็นสต๊อกอะไหล่ ---------- */
function renderSalvage(){
  const rows = S.salvage || [];
  $('cardSalvage').hidden = !rows.length;
  $('svCount').textContent = money(rows.length);
  if (!rows.length) return;
  $('tblSalvage').querySelector('tbody').innerHTML = rows.map(r => `<tr>
    <td><b class="mono">${esc(refByNo(r.job_no))}</b>
      ${r.customer_name ? `<div class="sub2">${esc(r.customer_name)}</div>` : ''}</td>
    <td>${esc(r.brand || '—')}${r.model ? ' / ' + esc(r.model) : ''}</td>
    <td class="mono sub2">${esc(r.serial_no || '—')}</td>
    <td>${esc(r.inspect_result || r.symptom || '—')}
      ${r.symptom_name ? `<div class="sub2">${esc(r.symptom_name)}</div>` : ''}</td>
    <td><span class="pill ${r.old_unit_disposition === 'spare_parts' ? 'tag-good' : 'st0'}">
      ${esc(r.disposition_label)}</span></td>
    <td class="sub2" style="white-space:nowrap">${esc(dth(r.received_at))}</td>
  </tr>`).join('');
}

/* ---------- อะไหล่ที่ขาด สรุปรายวัน ---------- */
function renderShortage(){
  const rows = S.shortDaily || [];
  $('shEmpty').style.display = rows.length ? 'none' : 'block';
  const ST = { open:['tag-crit','ยังไม่ได้สั่ง'], requested:['tag-warn','ออกใบแล้ว'],
               received:['tag-good','รับเข้าแล้ว'], cancelled:['st0','ยกเลิก'] };
  $('tblShort').querySelector('tbody').innerHTML = rows.map(r => {
    const s = ST[r.status] || ['st0', r.status];
    return `<tr>
      <td><b>${esc(dth(r.short_date))}</b></td>
      <td class="mono"><b>${esc(r.part_no)}</b></td><td>${esc(r.part_name)}</td>
      <td class="num"><b style="font-size:16px;color:var(--crit)">${r.qty_short}</b>
        <span class="sub2">${esc(r.unit||'')}</span></td>
      <td class="num">${r.job_count}</td>
      <td class="sub2 mono" style="font-size:11.5px">${esc(r.job_refs||'—')}</td>
      <td class="num">฿${money(Number(r.cost_price||0) * r.qty_short)}</td>
      <td><span class="pill ${s[0]}">${esc(s[1])}</span></td>
      <td class="num noprint">${r.status === 'open' && isBoss()
        ? `<button class="btn sm p" onclick="makePR('${r.short_date}')">ออกใบขอซื้อ</button>` : ''}</td></tr>`;
  }).join('');
}

/* ---------- ใบขอจัดซื้อ ---------- */
function renderPR(){
  const rows = S.prs || [];
  $('prEmpty').style.display = rows.length ? 'none' : 'block';
  const ST = { draft:['tag-warn','รออนุมัติ'], approved:['st1','อนุมัติแล้ว'],
               ordered:['st2','สั่งซื้อแล้ว'], received:['tag-good','รับเข้าแล้ว'],
               cancelled:['st0','ยกเลิก'] };
  $('tblPR').querySelector('tbody').innerHTML = rows.map(r => {
    const s = ST[r.status] || ['st0', r.status];
    return `<tr>
      <td class="mono"><b>${esc(r.pr_no)}</b></td><td>${esc(dth(r.pr_date))}</td>
      <td class="num">${r.line_count}</td><td class="num"><b>฿${money(r.total_cost)}</b></td>
      <td><span class="pill ${s[0]}">${esc(s[1])}</span></td>
      <td class="sub2">${esc(r.requested_by||'—')}</td>
      <td class="num noprint">
        <button class="btn ic" onclick="printPR('${esc(r.pr_no)}')" title="พิมพ์ใบขอจัดซื้อ">🖨️</button>
        ${r.status !== 'received' && isBoss()
          ? `<button class="btn sm g" onclick="receivePR('${esc(r.pr_no)}')">รับเข้าคลัง</button>` : ''}</td></tr>`;
  }).join('');
}

/* ---------- คำขอแก้อะไหล่ที่รออนุมัติ ---------- */
function renderAdjust(){
  const rows = (S.adjust || []);
  $('cardAdjust').hidden = !rows.length;
  $('adjCount').textContent = rows.length;
  if (!rows.length) return;
  $('tblAdjust').querySelector('tbody').innerHTML = rows.map(a => `<tr>
    <td class="mono"><b>${esc(refByNo(a.job_no))}</b>
      <div class="sub2"><button class="dlink2" onclick="openJob('${a.job_id}')">เปิดใบงาน</button></div></td>
    <td class="mono"><b>${esc(a.part_no||'—')}</b><div class="sub2">${esc(a.part_name||'')}</div></td>
    <td><span class="pill st1">${esc(ADJ_KIND[a.kind]||a.kind)}</span></td>
    <td class="num">${a.qty_now ?? '—'}</td>
    <td class="num"><b>${a.kind === 'return' ? '0' : (a.qty_new ?? '—')}</b></td>
    <td class="sub2">${esc(a.reason||'')}</td>
    <td class="sub2">${esc(a.requested_by||'—')}<div class="sub2">${esc(dth(a.created_at))}</div></td>
    <td class="num noprint">${isBoss()
      ? `<button class="btn ic" onclick="decideAdjust('${a.id}',true)" title="อนุมัติ">✓</button>
         <button class="btn ic dn" onclick="decideAdjust('${a.id}',false)" title="ไม่อนุมัติ">✕</button>`
      : '<span class="muted">รอหัวหน้า</span>'}</td></tr>`).join('');
}
function renderParts(){
  const q = val('pSearch').toLowerCase();
  const rows = S.stock.filter(p => !q || [p.part_no,p.name].join(' ').toLowerCase().includes(q));
  const low = S.stock.filter(p => p.stock_state !== 'ปกติ').length;
  const value = S.stock.reduce((s,p) => s + p.qty * Number(p.cost_price||0), 0);
  const used = S.stock.reduce((s,p) => s + Number(p.used_90d||0), 0);

  $('partKpi').innerHTML = [
    ['na','📦','รายการอะไหล่', S.stock.length, 'SKU'],
    ['nd','⚠️','สต็อกต่ำ',  low, 'รายการ'],
    ['nc','💰','มูลค่าคลัง',   '฿' + money(value), ''],
    ['ne','🔧','เบิกใช้สะสม', used, 'ชิ้น']
  ].map(([cl,e,l,n,u]) => `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
    <div class="n">${n}<small>${u}</small></div></div>`).join('');

  const cls = { 'ติดลบ':'tag-crit', 'หมด':'tag-crit', 'ต้องสั่ง':'tag-warn', 'ปกติ':'tag-good' };
  const mp = paginate(rows, 'parts');
  $('pgParts').innerHTML = pagerHTML(mp, 'parts');
  $('tblParts').querySelector('tbody').innerHTML = rows.length ? mp.slice.map(p => `<tr>
    <td class="mono"><b>${esc(p.part_no)}</b></td><td>${esc(p.name)}</td>
    <td class="num">฿${money(p.sell_price)}</td><td class="num">${p.used_90d}</td>
    <td class="num muted">${p.reorder_point}</td>
    <td class="num"><b style="font-size:16px">${p.qty}</b> <span class="sub2">${esc(p.unit||'')}</span></td>
    <td><span class="pill ${cls[p.stock_state]||'st0'}">${esc(p.stock_state)}</span></td>
    <td class="num noprint">
      <button class="btn ic" onclick="adjust('${esc(p.part_no)}',1)" title="รับเข้า 1">+</button>
      <button class="btn ic" onclick="adjust('${esc(p.part_no)}',-1)" title="เบิกออก 1">−</button>
      <button class="btn ic" onclick="editReorder('${esc(p.part_no)}',${p.reorder_point})" title="แก้จุดสั่งซื้อ">✏️</button></td></tr>`).join('')
    : '<tr><td colspan="8" class="empty">ยังไม่มีอะไหล่ในทะเบียน</td></tr>';
}
async function newPart(){
  const f = await formModal({
    title:'เพิ่มอะไหล่ใหม่', subtitle:'สร้าง SKU ในทะเบียนอะไหล่ · ยอดคงเหลือเริ่มที่ 0',
    ok:'เพิ่มอะไหล่',
    fields:[
      { k:'part_no', label:'รหัสอะไหล่ (Part No.)', required:true, upper:true, half:true, placeholder:'BR-00124' },
      { k:'name',    label:'ชื่ออะไหล่', required:true, half:true, placeholder:'Bearing 6001ZZ' },
      { k:'sell_price', label:'ราคาขาย (บาท)', type:'number', value:0, min:0, half:true },
      { k:'cost_price', label:'ราคาทุน (บาท)', type:'number', value:0, min:0, half:true },
      { k:'unit', label:'หน่วยนับ', value:'ชิ้น', half:true },
      { k:'reorder_point', label:'จุดสั่งซื้อ', type:'number', value:10, min:0, half:true,
        hint:'ต่ำกว่านี้จะขึ้นเตือน "ต้องสั่ง"' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('parts_master').insert(f);
    if (error) throw error;
    toast('✅ เพิ่ม ' + f.part_no + ' แล้ว');
    const { data } = await sb.from('parts_master').select('id,part_no,name,sell_price,cost_price').eq('is_active', true).order('part_no');
    S.parts = data || [];
    $('rcPart').innerHTML = '<option value="">— เลือกอะไหล่ —</option>'
      + S.parts.map(p => `<option value="${esc(p.part_no)}">${esc(p.part_no)} · ${esc(p.name)}</option>`).join('');
    await loadParts();
  } catch(e){ fail(e); }
}

async function editReorder(pn, cur){
  const p = S.stock.find(x => x.part_no === pn) || {};
  const f = await formModal({
    title:'แก้ไขอะไหล่', subtitle:pn + ' · ' + (p.name || ''),
    fields:[
      { k:'name', label:'ชื่ออะไหล่', value:p.name, required:true },
      { k:'sell_price', label:'ราคาขาย (บาท)', type:'number', value:p.sell_price ?? 0, min:0, half:true },
      { k:'cost_price', label:'ราคาทุน (บาท)', type:'number', value:p.cost_price ?? 0, min:0, half:true },
      { k:'reorder_point', label:'จุดสั่งซื้อ', type:'number', value:cur, min:0, half:true,
        hint:'คงเหลือปัจจุบัน ' + (p.qty ?? 0) + ' ' + (p.unit || 'ชิ้น') }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('parts_master').update(f).eq('part_no', pn);
    if (error) throw error;
    toast('✅ บันทึกแล้ว');
    await loadParts();
  } catch(e){ fail(e); }
}

async function adjust(pn, d){
  try {
    const { error } = await sb.rpc('receive_parts', { p_part_no:pn, p_qty:d, p_note:'ปรับยอดจากหน้าคลัง', p_by:who() });
    if (error) throw error;
    await loadParts();
  } catch(e){ fail(e); }
}
async function receiveParts(){
  const pn = val('rcPart'), q = Number(val('rcQty'))||0;
  if (!pn) return toast('เลือกอะไหล่ก่อน', true);
  if (q < 1) return toast('จำนวนต้องมากกว่า 0', true);
  try {
    const { data, error } = await sb.rpc('receive_parts', { p_part_no:pn, p_qty:q, p_note:val('rcNote')||null, p_by:who() });
    if (error) throw error;
    toast(`✅ รับเข้าแล้ว — คงเหลือ ${data} ชิ้น`);
    $('rcQty').value = 1; $('rcNote').value = '';
    await loadParts();
  } catch(e){ fail(e); }
}

/* =====================================================================
   รายงาน
   ===================================================================== */
/* =====================================================================
   จัดการรายการสาเหตุ — หน้าตั้งค่า
   ===================================================================== */
async function loadCauses(){
  const { data, error } = await sb.from('repair_causes').select('*').order('sort_no').order('code');
  const tb = $('tblCause') && $('tblCause').querySelector('tbody');
  if (!tb) return;
  if (error){
    S.causes = [];
    tb.innerHTML = `<tr><td colspan="5" class="empty">
      ยังไม่มีตาราง repair_causes — รัน <b>30_cs_feedback.sql</b> ก่อน</td></tr>`;
    return;
  }
  S.causes = (data || []).filter(c => c.is_active);
  fillCauses();
  tb.innerHTML = (data || []).length ? data.map(c => `<tr>
    <td class="num">${c.sort_no}</td>
    <td><b>${esc(c.label)}</b></td>
    <td class="mono sub2">${esc(c.code)}</td>
    <td>${c.is_active ? '<span class="pill tag-good">เปิดใช้</span>'
                      : '<span class="pill st0">ปิด — เลือกใหม่ไม่ได้</span>'}</td>
    <td class="num noprint">
      <button class="btn sm" onclick="editCause('${esc(c.code)}')">✏️ แก้</button>
      <button class="btn sm ${c.is_active ? 'dn' : 'g'}"
              onclick="toggleCause('${esc(c.code)}', ${c.is_active ? 'false' : 'true'})">
        ${c.is_active ? 'ปิด' : 'เปิด'}</button>
      <button class="btn sm dn" onclick="delCause('${esc(c.code)}','${esc(c.label)}')">🗑️</button>
    </td></tr>`).join('')
    : '<tr><td colspan="5" class="empty">ยังไม่มีรายการสาเหตุ</td></tr>';
}

async function editCause(code){
  const cur = code ? (S.causes.find(c => c.code === code)
              || { code, label:code, sort_no:100 }) : null;
  const f = await formModal({
    title: cur ? '✏️ แก้สาเหตุ' : '+ เพิ่มสาเหตุ',
    subtitle:'ชื่อคือสิ่งที่ CS เห็นในดรอปดาวน์ · รหัสใช้เก็บในฐานข้อมูล เปลี่ยนแล้วใบงานเก่าจะไม่ตามมา',
    ok:'บันทึก',
    fields:[
      { k:'label', label:'ชื่อสาเหตุ', required:true, value: cur ? cur.label : '',
        placeholder:'เช่น ชำรุด / เสียหาย' },
      { k:'code',  label:'รหัส (a-z, 0-9, _)', required:true, value: cur ? cur.code : '',
        placeholder:'เช่น damaged' },
      { k:'sort',  label:'ลำดับที่แสดง', type:'number', min:1,
        value: cur ? cur.sort_no : 100 }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.rpc('set_cause', {
      p_code: f.code, p_label: f.label,
      p_sort: Number(f.sort) || 100, p_active: true, p_by: who() });
    if (error) throw error;
    toast('✅ บันทึกสาเหตุแล้ว');
    await loadCauses();
  } catch(e){ fail(e); }
}

async function toggleCause(code, on){
  try {
    const c = S.causes.find(x => x.code === code) || {};
    const { error } = await sb.rpc('set_cause', {
      p_code: code, p_label: c.label || code,
      p_sort: c.sort_no ?? 100, p_active: !!on, p_by: who() });
    if (error) throw error;
    toast(on ? '✅ เปิดใช้แล้ว' : '⏸️ ปิดแล้ว — ใบงานเก่ายังอ่านได้');
    await loadCauses();
  } catch(e){ fail(e); }
}

async function delCause(code, label){
  const go = await confirmModal('ลบสาเหตุ "' + label + '"?',
    'ถ้ามีใบงานใช้สาเหตุนี้อยู่ ระบบจะปิดไม่ให้เลือกใหม่แทนการลบ — ประวัติเดิมจะยังอ่านได้',
    { ok:'ลบ', danger:true });
  if (!go) return;
  try {
    const { data, error } = await sb.rpc('del_cause', { p_code: code });
    if (error) throw error;
    toast('✅ ' + (data || 'ลบแล้ว'));
    await loadCauses();
  } catch(e){ fail(e); }
}


/* =====================================================================
   Export รายการใบงานเป็น Excel
     ได้เฉพาะใบที่กรองอยู่ตอนนี้ (ชิป + ค้นหา + ช่าง) — เห็นอะไรได้อันนั้น
     ใช้ SheetJS เขียน .xlsx จริง · โหลดไลบรารีไม่ได้ก็ถอยไปเป็น CSV
   ===================================================================== */
const XL_COLS = [
  ['เลขออเดอร์',     j => j.order_no || j.tracking_in || ''],
  ['เลขในระบบ',      j => j.job_no],
  ['สถานะ',          j => STATUS[j.status] || j.status],
  ['ขั้นตอน',         j => stepOf(j.status) + '/6'],
  ['ลูกค้า',          j => j.customer_name || ''],
  ['เบอร์โทร',        j => j.customer_phone || ''],
  ['ช่องทาง',         j => j.platform || ''],
  ['ชื่อร้าน',         j => j.shop_name || ''],
  ['เลขพัสดุขาเข้า',   j => j.tracking_in || ''],
  ['เลขพัสดุขาออก',   j => j.tracking_out || ''],
  ['SKU',            j => j.sku || ''],
  ['แบรนด์',          j => j.brand || ''],
  ['รุ่น',             j => j.model || ''],
  ['Serial No.',     j => j.serial_no || ''],
  ['ประเภทเครื่อง',    j => j.tool_type || ''],
  ['อาการที่ลูกค้าแจ้ง', j => j.symptom || ''],
  ['อาการที่พบ',       j => j.inspect_result || ''],
  ['หมวดอาการ',       j => j.symptom_name || ''],
  ['ที่มาของเคส',      j => (ORIGIN[j.case_origin] || ORIGIN.external).l],
  ['สาเหตุ',           j => causeName(j)],
  ['เงื่อนไขประกัน',    j => (WARRANTY[j.warranty_case] || {}).l || ''],
  ['ประเภทเคส',       j => CASE_TYPE[j.case_type] || ''],
  ['ระดับความยาก',    j => SEVERITY[j.severity] || ''],
  ['ช่างผู้รับผิดชอบ',   j => j.tech_name || ''],
  ['วันที่ขนส่งมาถึง',   j => dth(j.arrived_at)],
  ['แกะกล่องเมื่อ',     j => j.unboxed_at ? dth(j.unboxed_at) : ''],
  ['วันที่รับเครื่อง',    j => dth(j.received_at)],
  ['กำหนดเสร็จ',      j => dth(j.due_date)],
  ['ส่งมอบเมื่อ',       j => j.delivered_at ? dth(j.delivered_at) : ''],
  ['เกินกำหนด (วัน)',  j => j.days_overdue > 0 ? j.days_overdue : 0],
  ['อยู่ในศูนย์ (วัน)',  j => j.days_in_shop ?? ''],
  ['ค่าแรง',           j => Number(j.labor_cost) || 0],
  ['ค่าอะไหล่',        j => Number(j.parts_cost) || 0],
  ['ทุนอะไหล่จริง',    j => Number(j.parts_cost_real ?? j.parts_cost) || 0],
  ['ส่วนลด',          j => Number(j.discount) || 0],
  ['รวมค่าซ่อม',       j => Number(j.total_cost) || 0],
  ['ค่าส่งขาเข้า',      j => Number(j.ship_in_fee) || 0],
  ['ค่าส่งขาเข้าใครจ่าย', j => j.ship_in_by || ''],
  ['ค่าส่งขาออก',      j => Number(j.ship_out_fee) || 0],
  ['ค่าส่งขาออกใครจ่าย', j => j.ship_out_by || ''],
  ['ค่าส่งรอคืนลูกค้า',  j => Number(j.ship_refund_amount) || 0],
  ['สถานะเบิกคืน',     j => j.refund_label || ''],
  ['ประเมินการซ่อม',   j => j.repairable === true ? 'ซ่อมได้'
                          : j.no_repair_action === 'salvage' ? 'ซ่อมไม่ได้ — แยกเป็นอะไหล่'
                          : j.repairable === false ? 'ซ่อมไม่ได้ — เปลี่ยนสินค้า' : ''],
  ['รอคลิปจากลูกค้า',  j => j.clip_waiting ? 'รออยู่ ' + (j.clip_days_waiting || 0) + ' วัน' : ''],
  ['เหตุผลที่ไม่รับเคลม', j => j.reject_reason || ''],
  ['หมายเหตุตอนรับ',   j => j.intake_note || ''],
  ['แอดมิน / CS เจ้าของเคส', j => j.admin_name || ''],
  ['สถานะกล่อง', j => j.unboxed_at ? 'แกะแล้ว'
                        : (j.arrived_at ? 'รอแกะ ' + (j.unbox_days_left < 0 ? '(เกินกำหนด)' : '') : '')]
];

/** ใบงานที่กรองอยู่ตอนนี้ — ตรรกะเดียวกับที่ renderJobs ใช้ จะได้ไม่หลุดกัน */
function jobsInView(){
  const q = (val('gSearch') || '').toLowerCase(), tc = val('fTech'), ad = val('fAdmin');
  return S.jobs.filter(j => {
    if (!matchFilter(j)) return false;
    if (tc && j.technician_id !== tc) return false;
    if (ad && (j.admin_name || '').trim() !== ad) return false;
    if (q && ![j.job_no,j.customer_name,j.serial_no,j.sku,j.model,j.brand,j.tool_type,j.symptom,
               j.order_no,j.tracking_in,j.tracking_out,j.platform,j.shop_name,j.admin_name]
      .join(' ').toLowerCase().includes(q)) return false;
    return true;
  });
}

async function exportJobs(){
  const rows = jobsInView();
  if (!rows.length) return toast('ไม่มีใบงานให้ส่งออก — ลองเปลี่ยนตัวกรอง', true);

  const head = XL_COLS.map(c => c[0]);
  const body = rows.map(j => XL_COLS.map(c => { try { return c[1](j); } catch(e){ return ''; } }));
  const chip = (S.filter || 'all');
  const name = 'ใบงานซ่อม_' + chip + '_' + new Date().toISOString().slice(0,10);

  try {
    await loadXLSX();
    const ws = XLSX.utils.aoa_to_sheet([head, ...body]);
    /* ความกว้างคอลัมน์ — ไม่ตั้งไว้ Excel จะบีบจนอ่านไม่ออก */
    ws['!cols'] = head.map((t, i) => ({
      wch: Math.min(42, Math.max(t.length + 2,
        ...body.slice(0, 200).map(r => String(r[i] ?? '').length + 2))) }));
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({
      s:{ r:0, c:0 }, e:{ r:body.length, c:head.length - 1 } }) };
    ws['!freeze'] = { xSplit:'1', ySplit:'1' };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ใบงานซ่อม');
    XLSX.writeFile(wb, name + '.xlsx');
    toast(`⬇️ ส่งออก ${money(rows.length)} ใบงานแล้ว`);
  } catch(e){
    /* เน็ตบริษัทบล็อก CDN ก็ยังต้องได้ไฟล์ — CSV เปิดด้วย Excel ได้เหมือนกัน */
    console.warn('เขียน .xlsx ไม่ได้ ใช้ CSV แทน', e);
    const cell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const csv = '﻿' + [head, ...body].map(r => r.map(cell).join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8' }));
    a.download = name + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(`⬇️ ส่งออก ${money(rows.length)} ใบงานเป็น CSV (เปิดด้วย Excel ได้)`);
  }
}


/* =====================================================================
   ค่าส่งเบิกคืนลูกค้า — CS รวบรวมยื่นบัญชี
     เคสภายใน 7 วัน ลูกค้าสำรองจ่ายค่าส่งขาเข้าไปก่อน บริษัทต้องคืน
     รอเบิก → ยื่นบัญชีแล้ว → จ่ายคืนลูกค้าแล้ว
   ===================================================================== */
const RF_TABS = [['pending','💰 รอเบิก'],['submitted','📄 ยื่นบัญชีแล้ว'],
                 ['paid','✅ จ่ายคืนแล้ว'],['','ทั้งหมด']];

async function loadRefund(){
  try {
    const [r, m] = await Promise.all([
      window.__pageAll(() => sb.from('v_ship_refund').select('*')),
      sb.from('v_ship_refund_month').select('*').limit(36)
    ]);
    S.refund = r || [];
    S.refundMonth = m.error ? [] : (m.data || []);
  } catch(e){
    /* ยังไม่ได้รัน 28_ship_refund.sql → ซ่อนแท็บ ไม่ให้หน้าพัง */
    if (/does not exist|schema cache/i.test(e?.message || '')){
      S.refund = null; S.refundMonth = [];
      console.warn('v_ship_refund — ยังไม่ได้รัน 28_ship_refund.sql?', e.message);
    } else fail(e);
  }
}

function rfToggleAll(el){
  document.querySelectorAll('#tblRefund tbody input[type=checkbox]')
    .forEach(c => { if (!c.disabled) c.checked = el.checked; });
}
const rfPicked = () => [...document.querySelectorAll('#tblRefund tbody input[type=checkbox]:checked')]
  .map(c => c.dataset.id);

function rfSetTab(k){ S.rfTab = k; renderRefund(); }

function rfRows(){
  const q  = (val('rfSearch') || '').toLowerCase();
  const mo = val('rfMonth');
  return (S.refund || []).filter(r => {
    if (S.rfTab && r.ship_refund_status !== S.rfTab) return false;
    if (mo && String(r.received_at || '').slice(0,7) !== mo) return false;
    if (!q) return true;
    return [r.order_no, r.job_no, r.customer_name, r.customer_phone, r.ship_refund_ref, r.shop_name]
      .filter(Boolean).join(' ').toLowerCase().includes(q);
  });
}

function renderRefund(){
  const card = $('rt-refund');
  if (!card) return;
  if (S.refund === null){
    card.innerHTML = `<div class="box-warn">ยังใช้หน้านี้ไม่ได้ — ให้รัน
      <b class="mono">28_ship_refund.sql</b> ที่ Supabase → SQL Editor ก่อน</div>`;
    return;
  }
  const all = S.refund || [];
  if (S.rfTab === undefined) S.rfTab = 'pending';

  /* ตัวเลือกเดือน — เติมครั้งเดียว ไม่ให้ค่าที่เลือกไว้หาย */
  const sel = $('rfMonth');
  if (sel && !sel.dataset.filled){
    const mons = [...new Set(all.map(r => String(r.received_at || '').slice(0,7)).filter(Boolean))].sort().reverse();
    sel.innerHTML = '<option value="">ทุกเดือน</option>' +
      mons.map(m => `<option value="${m}">${m}</option>`).join('');
    sel.dataset.filled = '1';
  }

  const sum = st => all.filter(r => !st || r.ship_refund_status === st)
                       .reduce((s, r) => s + (Number(r.refund_amount) || 0), 0);
  const cnt = st => all.filter(r => !st || r.ship_refund_status === st).length;

  $('rfKpi').innerHTML = [
    ['nb','💰','รอ CS ยื่นเบิก', cnt('pending'),   sum('pending')],
    ['ne','📄','ยื่นบัญชีแล้ว',   cnt('submitted'), sum('submitted')],
    ['nc','✅','จ่ายคืนแล้ว',     cnt('paid'),      sum('paid')],
    ['na','Σ','รวมทั้งหมด',      cnt(''),          sum('')]
  ].map(([cl,e,l,n,v]) => `<div class="kpi ${cl}">
      <div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
      <div class="n">${money(n)}<small> เคส</small></div>
      <div class="sub2">฿${money2(v)}</div></div>`).join('');

  $('rfTabs').innerHTML = RF_TABS.map(([k,t]) =>
    `<button class="chip ${S.rfTab === k ? 'on' : ''}" onclick="rfSetTab('${k}')">
       ${t} <b>${money(cnt(k))}</b></button>`).join('');

  const rows = rfRows();
  $('rfEmpty').style.display = rows.length ? 'none' : 'block';
  $('rfAll').checked = false;
  $('tblRefund').querySelector('tbody').innerHTML = rows.map(r => {
    const [cl, lb] = REFUND[r.ship_refund_status] || ['st0', r.ship_refund_status];
    const canPick = r.ship_refund_status !== 'paid';
    return `<tr>
      <td class="num noprint"><input type="checkbox" data-id="${esc(r.id)}" ${canPick ? '' : 'disabled'}></td>
      <td class="mono"><b>${esc(r.order_no || r.tracking_in || r.job_no)}</b>
        <div class="sub2">ระบบ ${esc(r.job_no)}</div></td>
      <td>${esc(r.customer_name || '—')}
        <div class="sub2">${esc(r.customer_phone || '')}</div></td>
      <td class="sub2">${esc(r.platform || '—')}
        ${r.shop_name ? '<div class="sub2">' + esc(r.shop_name) + '</div>' : ''}</td>
      <td class="sub2" style="white-space:nowrap">${esc(dth(r.received_at))}</td>
      <td class="num"><b>฿${money2(r.refund_amount)}</b></td>
      <td class="num">${r.receipt_count > 0
        ? '<span class="pill tag-good">' + r.receipt_count + '</span>'
        : '<span class="pill tag-crit">ไม่มี</span>'}</td>
      <td><span class="pill ${cl}">${lb}</span></td>
      <td class="mono sub2">${esc(r.ship_refund_ref || '—')}</td>
    </tr>`;
  }).join('');

  const tot = rows.reduce((s, r) => s + (Number(r.refund_amount) || 0), 0);
  $('rfSum').innerHTML = `แสดง <b>${money(rows.length)}</b> รายการ · รวม <b>฿${money2(tot)}</b>
    ${rows.some(r => !(r.receipt_count > 0))
      ? ' · <span style="color:var(--crit)">มีรายการที่ยังไม่มีรูปใบเสร็จ</span>' : ''}`;

  $('tblRefundMonth').querySelector('tbody').innerHTML =
    (S.refundMonth || []).map(m => `<tr>
      <td><b>${esc(String(m['เดือน']).slice(0,7))}</b></td>
      <td class="num">${money(m['เคสทั้งหมด'])}</td>
      <td class="num"><b>฿${money2(m['ยอดรวม'])}</b></td>
      <td class="num">฿${money2(m['ยอดรอเบิก'] || 0)}</td>
      <td class="num">฿${money2(m['ยอดยื่นแล้ว'] || 0)}</td>
      <td class="num">฿${money2(m['ยอดจ่ายคืนแล้ว'] || 0)}</td>
    </tr>`).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีข้อมูล</td></tr>';
}

/* ---------- ยื่นบัญชี ---------- */
async function rfSubmit(){
  const ids = rfPicked();
  if (!ids.length) return toast('เลือกรายการที่จะยื่นก่อน (ติ๊กช่องหน้าแถว)', true);
  const picked = (S.refund || []).filter(r => ids.includes(r.id));
  const bad = picked.filter(r => r.ship_refund_status !== 'pending');
  if (bad.length) return toast(`มี ${bad.length} รายการที่ยื่นไปแล้ว — เอาออกก่อน`, true);
  const noRc = picked.filter(r => !(r.receipt_count > 0));

  const f = await formModal({
    title:'📄 ยื่นเบิกค่าส่งกับบัญชี',
    subtitle:`${picked.length} รายการ · รวม ฿${money2(picked.reduce((s,r)=>s+(Number(r.refund_amount)||0),0))}`
      + (noRc.length ? ` · ⚠️ ไม่มีรูปใบเสร็จ ${noRc.length} รายการ` : ''),
    ok:'บันทึกว่ายื่นแล้ว',
    fields:[{ k:'ref', label:'เลขเอกสารที่ยื่นบัญชี', required:true,
              placeholder:'เช่น PV-2609-001', hint:'ใช้เลขเดียวกันทุกรายการที่เลือก' }]});
  if (!f) return;
  try {
    const { data, error } = await sb.rpc('refund_submit',
      { p_job_ids:ids, p_ref:f.ref, p_by:who() });
    if (error) throw error;
    toast(`✅ ยื่นบัญชีแล้ว ${money(data)} รายการ (เอกสาร ${f.ref})`);
    await loadRefund(); renderRefund();
  } catch(e){ fail(e); }
}

/* ---------- บัญชีจ่ายคืนแล้ว ---------- */
async function rfPaid(){
  const ids = rfPicked();
  if (!ids.length) return toast('เลือกรายการที่จ่ายคืนแล้วก่อน', true);
  const picked = (S.refund || []).filter(r => ids.includes(r.id));
  const bad = picked.filter(r => r.ship_refund_status !== 'submitted');
  if (bad.length) return toast(`มี ${bad.length} รายการที่ยังไม่ได้ยื่นบัญชี — ต้องยื่นก่อน`, true);

  const f = await formModal({
    title:'✅ บันทึกว่าจ่ายคืนลูกค้าแล้ว',
    subtitle:`${picked.length} รายการ · รวม ฿${money2(picked.reduce((s,r)=>s+(Number(r.refund_amount)||0),0))}`,
    ok:'บันทึก',
    fields:[{ k:'note', label:'หมายเหตุ', placeholder:'เช่น โอนคืนพร้อมกันวันที่ 20 ก.ย.' }]});
  if (!f) return;
  try {
    const { data, error } = await sb.rpc('refund_paid',
      { p_job_ids:ids, p_by:who(), p_note:f.note || null });
    if (error) throw error;
    toast(`✅ บันทึกจ่ายคืนแล้ว ${money(data)} รายการ`);
    await loadRefund(); renderRefund();
  } catch(e){ fail(e); }
}

/* ---------- โหลดเป็นไฟล์ส่งบัญชี ---------- */
function rfExport(){
  const rows = rfRows();
  if (!rows.length) return toast('ไม่มีรายการให้โหลด', true);
  const head = ['เลขออเดอร์','เลขในระบบ','ลูกค้า','เบอร์โทร','ช่องทาง','ชื่อร้าน',
                'วันที่รับเครื่อง','ค่าส่งขาเข้า','ยอดที่ต้องคืน','จำนวนใบเสร็จ',
                'สถานะ','เลขเอกสารเบิก','วันที่ยื่น','ผู้ยื่น','วันที่จ่ายคืน','ผู้จ่าย','หมายเหตุ'];
  const body = rows.map(r => [
    r.order_no || r.tracking_in || '', r.job_no, r.customer_name || '', r.customer_phone || '',
    r.platform || '', r.shop_name || '', dth(r.received_at),
    Number(r.ship_in_fee) || 0, Number(r.refund_amount) || 0, r.receipt_count || 0,
    r.refund_label || '', r.ship_refund_ref || '',
    r.ship_refund_submitted_at ? dth(r.ship_refund_submitted_at) : '', r.ship_refund_submitted_by || '',
    r.ship_refund_paid_at ? dth(r.ship_refund_paid_at) : '', r.ship_refund_paid_by || '',
    r.ship_refund_note || ''
  ]);
  const tot = rows.reduce((s, r) => s + (Number(r.refund_amount) || 0), 0);
  body.push([]);
  body.push(['รวม', '', '', '', '', '', '', '', tot]);

  /* ใส่ BOM ให้ Excel ภาษาไทยไม่เพี้ยน · ครอบ " ทุกช่องกันคอมมาในข้อความ */
  const cell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const csv = '﻿' + [head, ...body].map(r => r.map(cell).join(',')).join('\r\n');
  const name = 'ค่าส่งเบิกคืน_' + new Date().toISOString().slice(0,10) +
               (S.rfTab ? '_' + S.rfTab : '') + '.csv';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8' }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast(`⬇️ โหลด ${money(rows.length)} รายการแล้ว — รวม ฿${money2(tot)}`);
}


/* ---------- แท็บ ---------- */
const REP_TABS = [
  { k:'work',    t:'📊 ผลงานช่าง',    boss:false },
  { k:'money',   t:'💵 การเงินและรางวัล', boss:true  },
  { k:'quality', t:'🔍 คุณภาพสินค้า',  boss:false },
  { k:'refund',  t:'💰 ค่าส่งเบิกคืน',  boss:false }
];
const DIFF_COLOR = { light:'#9cbbdf', medium:'#4f83bb', heavy:'#1F3864', none:'#d8e0ec' };

function setRepTab(k){
  S.repTab = k;
  REP_TABS.forEach(t => { const el = $('rt-' + t.k); if (el) el.hidden = (t.k !== k); });
  renderRepTabs();
  /* กล่องที่ซ่อนอยู่ วัดความกว้างได้ 0 → ต้องวาดซ้ำหลังโผล่มาแล้ว */
  requestAnimationFrame(() => { try { redrawRepTab(); } catch(e){ console.warn(e); } });
}

function redrawRepTab(){
  if (S.repTab === 'work')    drawDiffChart();
  if (S.repTab === 'money')   drawRevChart();
  if (S.repTab === 'quality') drawTopParts();
  if (S.repTab === 'refund')  renderRefund();
}
function renderRepTabs(){
  const show = REP_TABS.filter(t => !t.boss || isBoss());
  $('repTabs').innerHTML = show.map(t =>
    `<button class="chip ${S.repTab === t.k ? 'on' : ''}" onclick="setRepTab('${t.k}')">${t.t}</button>`).join('');
}

async function loadReport(){
  if (!S.repTab || (!isBoss() && S.repTab === 'money')) S.repTab = 'work';
  setRepTab(S.repTab);

  /* ช่างไม่ต้องมีตัวเลขเงินอยู่ในหน้าเลย — ถอดออกจาก DOM ทิ้ง */
  if (!isBoss()){ const m = $('rt-money'); if (m) m.innerHTML = ''; }

  await loadRefund();
  await loadWorkReport();                     // ต้องมาก่อน — ตารางรางวัลใช้ S.score
  await Promise.all([loadQualityReport(), isBoss() ? loadMoneyReport() : Promise.resolve()]);
}


/* =====================================================================
   แท็บ 1 · ผลงานช่าง — จำนวนเคส ไม่มีตัวเลขเงิน ช่างเปิดดูได้
   ===================================================================== */
/* กราฟแท่งกลุ่ม — ช่างละ 3 แท่ง ง่าย/กลาง/ยาก · แยกออกมาเพื่อวาดซ้ำได้ */
function drawDiffChart(){
  if (!$('diffChart')) return;
  const has = (S.score || []).filter(r => r.jobs_total > 0);
  $('diffChart').innerHTML = has.length
    ? groupedBarSVG(
        has.map(r => r.tech_name),
        [{ name:'ง่าย',  color:DIFF_COLOR.light,  data:has.map(r => Number(r.lv_light)) },
         { name:'กลาง', color:DIFF_COLOR.medium, data:has.map(r => Number(r.lv_medium)) },
         { name:'ยาก',  color:DIFF_COLOR.heavy,  data:has.map(r => Number(r.lv_heavy)) }],
        /* ช่างน้อย = กราฟแคบลงตาม ไม่ยืดแท่งให้บาน */
        Math.min(boxW('diffChart'), Math.max(300, has.length * 108 + 60)), 220)
    : '<div class="empty">ยังไม่มีเคสที่มอบหมายให้ช่าง</div>';
}

async function loadWorkReport(){
  let rows = [];
  try {
    const { data, error } = await sb.from('v_tech_scorecard').select('*');
    if (error) throw error;
    rows = data || [];
  } catch(e){
    console.warn('v_tech_scorecard — ยังไม่ได้รัน 13_update.sql?', e.message);
    /* คิดจากข้อมูลที่มีในเครื่องแทน ให้หน้าไม่ว่าง */
    rows = S.techs.map(t => {
      const mine = S.jobs.filter(j => j.technician_id === t.id);
      const cnt = sv => mine.filter(j => j.severity === sv).length;
      return { technician_id:t.id, code:t.code, tech_name:t.nickname || t.full_name,
        jobs_total:mine.length,
        jobs_done: mine.filter(j => j.status === 'delivered').length,
        jobs_open: mine.filter(j => !CLOSED.includes(j.status)).length,
        lv_light:cnt('light'), lv_medium:cnt('medium'), lv_heavy:cnt('heavy'),
        lv_none: mine.filter(j => !j.severity).length,
        on_time:null, overdue_now: mine.filter(j => !CLOSED.includes(j.status) && j.days_overdue > 0).length,
        avg_days:null };
    }).sort((a,b) => b.jobs_total - a.jobs_total);
  }
  S.score = rows;

  /* ช่างเห็นแถวตัวเองเด่นขึ้นมา แต่ยังเทียบกับเพื่อนได้ */
  const meRow = rows.find(r => r.technician_id === ME.techId);
  const sum = k => rows.reduce((s,r) => s + Number(r[k]||0), 0);

  const kpi = ME.role === 'tech' && meRow
    ? [['na','🧰','เคสของคุณ',        meRow.jobs_total,  'เคส'],
       ['nb','✅','ปิดงานแล้ว',        meRow.jobs_done,   'เคส'],
       ['nd','⏳','ค้างอยู่',          meRow.jobs_open,   'เคส'],
       ['nc','🔥','เคสหนักที่รับไป',    meRow.lv_heavy,    'เคส']]
    : [['na','🧰','เคสที่มอบหมายแล้ว', sum('jobs_total'), 'เคส'],
       ['nb','✅','ปิดงานแล้ว',        sum('jobs_done'),  'เคส'],
       ['nd','⏳','ค้างอยู่',          sum('jobs_open'),  'เคส'],
       ['ne','👷','ช่างที่มีงาน',       rows.filter(r => r.jobs_total > 0).length, 'คน']];

  $('workKpi').innerHTML = kpi.map(([cl,e,l,nv,u]) =>
    `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
      <div class="n">${nv}<small>${u}</small></div></div>`).join('');

  drawDiffChart();
  /* ตาราง */
  $('scEmpty').style.display = rows.length ? 'none' : 'block';
  $('tblScore').querySelector('tbody').innerHTML = rows.map(r => {
    const mine = r.technician_id === ME.techId;
    return `<tr ${mine ? 'style="background:var(--gold-l)"' : ''}>
      <td><b>${esc(r.tech_name)}</b>${mine ? ' <span class="pill st1">คุณ</span>' : ''}
        <div class="sub2 mono">${esc(r.code||'')}</div></td>
      <td class="num"><b style="font-size:16px">${r.jobs_total}</b></td>
      <td class="num">${r.jobs_done}</td>
      <td class="num">${r.jobs_open}</td>
      <td class="num" style="color:${DIFF_COLOR.light}">${r.lv_light}</td>
      <td class="num" style="color:${DIFF_COLOR.medium}"><b>${r.lv_medium}</b></td>
      <td class="num" style="color:${DIFF_COLOR.heavy}"><b>${r.lv_heavy}</b></td>
      <td class="num">${r.on_time ?? '—'}</td>
      <td class="num">${Number(r.overdue_now) > 0
        ? `<span class="pill tag-crit">${r.overdue_now}</span>` : '0'}</td>
      <td class="num muted">${r.avg_days ?? '—'}</td></tr>`;
  }).join('');

  /* โดนัทสัดส่วนทั้งศูนย์ */
  const tot = [
    { key:'light',  label:'ง่าย (' + diffDays('light') + ' วัน)',   value:sum('lv_light'),  color:DIFF_COLOR.light },
    { key:'medium', label:'กลาง (' + diffDays('medium') + ' วัน)',  value:sum('lv_medium'), color:DIFF_COLOR.medium },
    { key:'heavy',  label:'ยาก (' + diffDays('heavy') + ' วัน)',    value:sum('lv_heavy'),  color:DIFF_COLOR.heavy },
    { key:'none',   label:'ยังไม่ระบุระดับ',                        value:sum('lv_none'),   color:DIFF_COLOR.none }
  ];
  const all = tot.reduce((s,i) => s + i.value, 0);
  $('diffDonut').innerHTML = donutSVG(tot, 168, 28, 'เคสที่มอบหมาย');
  $('diffLegend').innerHTML = tot.map(i => `
    <div class="lgi" style="padding:5px 0;border-bottom:1px solid var(--line2)">
      <span class="sw" style="background:${i.color}"></span>
      <span class="nm">${esc(i.label)}</span>
      <span class="v">${i.value}</span>
      <span class="p">${all ? Math.round(i.value/all*100) : 0}%</span>
    </div>`).join('');
}


/* =====================================================================
   แท็บ 2 · การเงินและรางวัล — เฉพาะ head / admin
   ===================================================================== */
/** รายได้แยกตามช่าง — แยกออกมาเพื่อวาดซ้ำได้ตอนสลับแท็บ / ย่อขยายจอ */
function drawRevChart(){
  if (!$('revChart')) return;
  const live = S.jobs.filter(j => j.status !== 'cancelled');
  /* รายได้จริง = เฉพาะส่วนที่ลูกค้าเป็นคนจ่าย ไม่ใช่ total_cost ทั้งก้อน
     เคสเคลม total_cost มีค่าแต่ไม่ได้เก็บเงินลูกค้า จึงต้องไม่นับ */
  const revOf = j => (partsByCustomer(j) ? Number(j.parts_cost||0) : 0)
                   + (laborByCustomer(j) ? Number(j.labor_cost||0) : 0)
                   - Number(j.discount||0);
  const items = S.techs.map(t => {
    const v = live.filter(j => j.technician_id === t.id).reduce((s,j) => s + revOf(j), 0);
    return { label: t.nickname || t.full_name, value: Math.max(0, Math.round(v)),
             sub: '฿' + money(v), color:'#2E75B6' };
  }).sort((a,b) => b.value - a.value);
  $('revChart').innerHTML = items.some(i => i.value > 0)
    ? hBarsSVG(items, boxW('revChart'))
    : '<div class="empty">ยังไม่มีรายได้จากลูกค้า — เคสทั้งหมดเป็นงานเคลม</div>';
}

/** อะไหล่ที่ใช้บ่อย 90 วัน */
function drawTopParts(){
  if (!$('topParts')) return;
  const top = (S.stock || []).filter(p => Number(p.used_90d) > 0)
    .sort((a,b) => Number(b.used_90d) - Number(a.used_90d)).slice(0,12)
    .map(p => ({ label:p.part_no + ' · ' + (p.name||''), value:Number(p.used_90d),
                 sub:p.used_90d + ' ' + (p.unit||'ชิ้น'), color:'#4f83bb' }));
  $('topParts').innerHTML = top.length
    ? hBarsSVG(top, boxW('topParts')) : '<div class="empty">ยังไม่มีการเบิกอะไหล่</div>';
}

async function loadMoneyReport(){
  /* ---------- คิดเงินฝั่งเบราว์เซอร์จาก S.jobs — ตรงกับ v_job_money ----------
     รายได้      = อะไหล่+ค่าแรง เฉพาะส่วนที่ "ลูกค้า" เป็นคนจ่าย แล้วหักส่วนลด
     ต้นทุนเคลม  = อะไหล่ตีราคาทุน เฉพาะเคสที่ "บริษัท" เป็นคนจ่าย
     ค่าแรงเคลม  = ไม่นับ เพราะเงินเดือนช่างเป็นต้นทุนคงที่ ไม่ผูกรายเคส
                   ต้นทุนแรงรายเคส = รางวัลต่อชิ้นตามระดับความยาก (ตารางล่าง) */
  const live = S.jobs.filter(j => j.status !== 'cancelled');
  const rev  = j => (partsByCustomer(j) ? Number(j.parts_cost||0) : 0)
                  + (laborByCustomer(j) ? Number(j.labor_cost||0) : 0)
                  - Number(j.discount||0);
  const atCost    = j => Number(j.parts_cost_real ?? j.parts_cost ?? 0);
  const claimCost = j => partsByCustomer(j) ? 0 : atCost(j);
  const cogs      = j => partsByCustomer(j) ? atCost(j) : 0;

  const revenue = live.reduce((s,j) => s + rev(j), 0);
  const claim   = live.reduce((s,j) => s + claimCost(j), 0);
  const cogsSum = live.reduce((s,j) => s + cogs(j), 0);
  /* 🚚 ค่าส่งไม่ใช่รายได้ของใคร — นับเฉพาะขาที่บริษัทออก เข้าเป็นต้นทุน */
  const shipCo  = live.reduce((s,j) => s + shipCompany(j), 0);
  const shipCus = live.reduce((s,j) => s + shipCustomer(j), 0);

  /* รางวัลช่าง = ต้นทุนแรงงานรายเคสตัวจริง */
  const rate = REWARD_RATE;
  const rwOf = j => Number(rate[j.severity || 'medium'] || 0);
  const rewardTotal = live.filter(j => j.status === 'delivered').reduce((s,j) => s + rwOf(j), 0);

  /* ---------- KPI ----------
     ศูนย์ซ่อมเป็น cost center โดยออกแบบ — ตัวชี้วัดคือ "ต้นทุนถูกลงไหม"
     ไม่ใช่ "หาเงินได้เท่าไหร่" · ช่องรายได้จึงโผล่เฉพาะเมื่อมีเคสนอกประกันจริง */
  const paidJobs  = live.filter(j => partsByCustomer(j));
  const claimJobs = live.filter(j => !partsByCustomer(j));
  const centerCost = claim + shipCo + rewardTotal;      // ต้นทุนศูนย์จริง
  const perCase = live.length ? centerCost / live.length : 0;

  /* เทียบเดือนนี้กับเดือนก่อน — ตัวที่บอกได้ว่าดีขึ้นหรือแย่ลง */
  const ym = d => { const x = new Date(d); return x.getFullYear() * 12 + x.getMonth(); };
  const nowYm = ym(new Date());
  const costOf = j => claimCost(j) + shipCompany(j)
                    + (j.status === 'delivered' ? rwOf(j) : 0);
  const bucket = n => live.filter(j => ym(j.received_at) === nowYm - n);
  const thisM = bucket(0), lastM = bucket(1);
  const cThis = thisM.reduce((s,j) => s + costOf(j), 0);
  const cLast = lastM.reduce((s,j) => s + costOf(j), 0);
  /* เทียบต่อเคส ยุติธรรมกว่าเทียบยอดรวม เพราะจำนวนเคสแต่ละเดือนไม่เท่ากัน */
  const pThis = thisM.length ? cThis / thisM.length : 0;
  const pLast = lastM.length ? cLast / lastM.length : 0;
  const diff  = pLast ? Math.round((pThis - pLast) / pLast * 100) : null;
  const trend = diff === null ? ['na','—','ยังไม่มีเดือนก่อนให้เทียบ']
              : diff > 0      ? ['nd','▲ +' + diff + '%', 'แย่ลง — ต้นทุนต่อเคสสูงขึ้น']
              : diff < 0      ? ['nc','▼ ' + diff + '%',  'ดีขึ้น — ต้นทุนต่อเคสลดลง']
                              : ['na','เท่าเดิม', 'ต้นทุนต่อเคสไม่เปลี่ยน'];

  const cards = [
    ['nd','🔴','ต้นทุนศูนย์รวม', '฿' + money(centerCost),
      `อะไหล่เคลม ฿${money(claim)} · ค่าส่ง ฿${money(shipCo)} · รางวัลช่าง ฿${money(rewardTotal)}`],
    ['nb','📉','ต้นทุนต่อเคส',   '฿' + money(perCase),
      live.length + ' เคสทั้งหมด · ยิ่งต่ำยิ่งดี'],
    [trend[0],'📈','เทียบเดือนก่อน', trend[1],
      `เดือนนี้ ฿${money(pThis)}/เคส · เดือนก่อน ฿${money(pLast)}/เคส`],
    ['ne','🚚','ค่าส่งที่บริษัทออก', '฿' + money(shipCo),
      'ลูกค้าออกอีก ฿' + money(shipCus) + ' (ไม่ใช่เงินบริษัท)']
  ];

  /* ช่องรายได้ — โผล่เฉพาะเมื่อมีเคสที่ลูกค้าจ่ายจริง ไม่งั้นเป็น ฿0 กินที่เปล่า ๆ */
  if (paidJobs.length) cards.push(
    ['nc','🟢','รายได้จริง (ลูกค้าจ่าย)', '฿' + money(revenue),
      paidJobs.length + ' เคสนอกประกัน · เหลือหลังหักทุนอะไหล่ ฿' + money(revenue - cogsSum)]);

  $('repKpi').innerHTML = cards.map(([cl,e,l,nv,u]) =>
    `<div class="kpi ${cl}"><div class="t"><span class="l">${l}</span><span class="e">${e}</span></div>
      <div class="n">${nv}</div><div class="sub2">${esc(u)}</div></div>`).join('');

  /* บอกให้ชัดว่าทำไมไม่มีช่องรายได้ กันคนเข้าใจผิดว่าระบบพัง */
  if (!paidJobs.length) $('repKpi').insertAdjacentHTML('beforeend',
    `<div class="kpi" style="border-style:dashed;background:#fbfcfe">
      <div class="t"><span class="l">รายได้จริง</span><span class="e">🟢</span></div>
      <div class="n" style="font-size:19px;color:var(--ink3)">ยังไม่มี</div>
      <div class="sub2">ไม่มีเคสนอกประกันที่เก็บเงินลูกค้า —
        ช่องนี้จะแสดงตัวเลขเองเมื่อมีเคสแรก</div></div>`);

  /* ---------- แยกตามเงื่อนไขประกัน ---------- */
  const wRows = Object.keys(WARRANTY).map(code => {
    const g = live.filter(j => (j.warranty_case || 'unknown') === code);
    return { code, label: WARRANTY[code].l, n: g.length,
      rev:   g.reduce((s,j) => s + rev(j), 0),
      cogs:  g.reduce((s,j) => s + cogs(j), 0),
      claim: g.reduce((s,j) => s + claimCost(j), 0),
      shipCo:  g.reduce((s,j) => s + shipCompany(j), 0),
      shipCus: g.reduce((s,j) => s + shipCustomer(j), 0) };
  }).filter(r => r.n > 0);

  $('tblWar').querySelector('tbody').innerHTML = wRows.length ? wRows.map(r => `<tr>
    <td><span class="pill ${WARRANTY[r.code].cls}">${esc(r.label)}</span>
      ${r.code === 'unknown' ? '<div class="sub2" style="color:var(--crit)">ยังไม่เลือก — นับว่าบริษัทแบกไว้ก่อน</div>' : ''}
      ${r.shipCus ? `<div class="sub2">ลูกค้าออกค่าส่ง ฿${money(r.shipCus)}</div>` : ''}</td>
    <td class="num">${r.n}</td>
    <td class="num" style="color:var(--good);font-weight:700">${r.rev ? '฿' + money(r.rev) : '—'}</td>
    <td class="num muted">${r.cogs ? '฿' + money(r.cogs) : '—'}</td>
    <td class="num" style="color:var(--crit);font-weight:700">${r.claim ? '฿' + money(r.claim) : '—'}</td>
    <td class="num" style="color:var(--warn);font-weight:700">${r.shipCo ? '฿' + money(r.shipCo) : '—'}</td>
    <td class="num"><b>฿${money(r.rev - r.cogs - r.claim - r.shipCo)}</b></td></tr>`).join('')
    + `<tr style="border-top:2px solid var(--navy)">
        <td><b>รวม</b></td><td class="num"><b>${live.length}</b></td>
        <td class="num"><b style="color:var(--good)">฿${money(revenue)}</b></td>
        <td class="num"><b>฿${money(cogsSum)}</b></td>
        <td class="num"><b style="color:var(--crit)">฿${money(claim)}</b></td>
        <td class="num"><b style="color:var(--warn)">฿${money(shipCo)}</b></td>
        <td class="num"><b>฿${money(revenue - cogsSum - claim - shipCo)}</b></td></tr>`
    : '<tr><td colspan="7" class="empty">ยังไม่มีข้อมูล</td></tr>';

  $('warHint').innerHTML =
    '<b>🚚 ค่าส่งไม่นับเป็นรายได้ของฝ่ายใด</b> — ตารางนี้นับเฉพาะขาที่<b>บริษัทออก</b>เข้าเป็นต้นทุน '
    + 'ค่าส่งที่ลูกค้าออกโชว์ไว้ใต้ชื่อเงื่อนไข เป็นข้อมูลเท่านั้น ไม่แตะสูตรเงินของบริษัท'
    + '<div class="muted" style="font-size:12.5px;margin-top:5px">'
    + '<b>ภายใน 7 วัน</b> และ <b>ในประกัน</b> บริษัทจ่ายอะไหล่+ค่าแรงเอง ช่องรายได้จึงเป็น "—" ถูกต้องแล้ว · '
    + 'เฉพาะ <b>นอกประกัน</b> ที่เป็นรายได้จริง · อะไหล่ในเคสเคลมตีที่ <b>ราคาทุน</b> · '
    + 'เงินเดือนช่างไม่รวมในนี้เพราะเป็นต้นทุนคงที่ ต้นทุนแรงรายเคสดูที่ตารางรางวัลข้างล่าง</div>';

  /* ---------- เคสที่ยังไม่เลือกเงื่อนไขประกัน ---------- */
  const noWar = live.filter(j => !j.warranty_case || j.warranty_case === 'unknown');
  $('cardNoWar').hidden = !noWar.length;
  $('noWarCount').textContent = noWar.length + ' เคส';
  if (noWar.length){
    $('tblNoWar').querySelector('tbody').innerHTML = noWar.slice(0,50).map(j => `<tr>
      <td class="mono"><b>${esc(jobRef(j))}</b><div class="sub2">${esc(dth(j.received_at))}</div></td>
      <td>${esc(j.customer_name || '—')}</td>
      <td>${esc([j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || '—')}</td>
      <td>${esc(j.platform || '—')}</td>
      <td class="num">฿${money(j.total_cost)}</td>
      <td class="sub2">${esc(j.admin_name || '—')}</td>
      <td class="num noprint"><button class="btn sm p" onclick="openJob('${j.id}')">แก้ไข</button></td></tr>`).join('');
  }

  drawRevChart();

  /* ---------- รางวัลช่าง ---------- */
  const rows = S.score || [];
  $('rewardHint').innerHTML =
    `เรทที่ใช้อยู่: ง่าย <b>฿${money(rate.light)}</b> · กลาง <b>฿${money(rate.medium)}</b> · ยาก <b>฿${money(rate.heavy)}</b> ต่อเคส`
    + ' · แก้ได้ที่ ตั้งค่า → เรทรางวัลช่าง'
    + '<div class="muted" style="font-size:12.5px;margin-top:4px">นับจากใบงานที่ปิดแล้วจริง เคสที่ยังไม่ระบุระดับนับเป็นเคสกลาง · '
    + 'นี่คือ<b>ต้นทุนแรงงานรายเคส</b>ตัวจริง เพราะค่าแรงในใบงานเป็นเงินที่คิดกับลูกค้า ไม่ใช่เงินที่จ่ายช่าง · '
    + 'ช่างเห็นได้แค่จำนวนเคสในแท็บผลงาน</div>';

  /* นับจากใบงานที่ปิดแล้วจริง ๆ ไม่ใช่ประมาณจากสัดส่วน — ยอดจะตรงกับ KPI ข้างบน */
  const done = live.filter(j => j.status === 'delivered');
  const rw = (S.techs.length ? S.techs : rows.map(r => ({ id:r.technician_id, nickname:r.tech_name })))
    .map(t => {
      const mine = done.filter(j => j.technician_id === t.id);
      const cnt = sv => mine.filter(j => (j.severity || 'medium') === sv).length;
      const l = cnt('light'), m = cnt('medium'), hv = cnt('heavy');
      return { tech_name: t.nickname || t.full_name || '—', jobs_done: mine.length,
        dl:l, dm:m, dh:hv,
        reward: l*Number(rate.light||0) + m*Number(rate.medium||0) + hv*Number(rate.heavy||0) };
    }).filter(r => r.jobs_done > 0).sort((a,b) => b.reward - a.reward);

  $('tblReward').querySelector('tbody').innerHTML = rw.length ? rw.map(r => `<tr>
    <td><b>${esc(r.tech_name)}</b></td>
    <td class="num">${r.jobs_done}</td>
    <td class="num">${r.dl}</td><td class="num">${r.dm}</td><td class="num">${r.dh}</td>
    <td class="num"><b style="font-size:15px;color:var(--good)">฿${money(r.reward)}</b></td></tr>`).join('')
    + `<tr><td colspan="5" style="text-align:right"><b>รวมทั้งศูนย์</b></td>
       <td class="num"><b>฿${money(rw.reduce((s,r) => s + r.reward, 0))}</b></td></tr>`
    : '<tr><td colspan="6" class="empty">ยังไม่มีข้อมูล</td></tr>';

  /* ---------- แยกตามช่องทาง ---------- */
  const pmap = {};
  live.forEach(j => {
    const k = j.platform || 'ไม่ระบุ';
    const o = pmap[k] || (pmap[k] = { n:0, claimN:0, paidN:0, rev:0, claim:0, cogs:0, ship:0 });
    o.n++;
    if (partsByCustomer(j)) o.paidN++; else o.claimN++;
    o.rev += rev(j); o.claim += claimCost(j); o.cogs += cogs(j); o.ship += shipCompany(j);
  });
  const pRows = Object.entries(pmap).sort((a,b) => (b[1].claim + b[1].ship) - (a[1].claim + a[1].ship));
  $('tblPlat').querySelector('tbody').innerHTML = pRows.length ? pRows.map(([k,o]) => `<tr>
    <td><b>${esc(k)}</b></td><td class="num">${o.n}</td>
    <td class="num">${o.claimN}</td><td class="num">${o.paidN}</td>
    <td class="num" style="color:var(--good)">${o.rev ? '฿' + money(o.rev) : '—'}</td>
    <td class="num" style="color:var(--crit)">${o.claim ? '฿' + money(o.claim) : '—'}</td>
    <td class="num" style="color:var(--warn)">${o.ship ? '฿' + money(o.ship) : '—'}</td>
    <td class="num"><b>฿${money(o.rev - o.cogs - o.claim - o.ship)}</b></td></tr>`).join('')
    : '<tr><td colspan="8" class="empty">ยังไม่มีข้อมูล</td></tr>';

  /* ---------- ต้นทุนเคลมแยกตามรุ่น ---------- */
  const mmap = {};
  live.filter(j => !partsByCustomer(j) && claimCost(j) > 0).forEach(j => {
    const k = (j.brand || '-') + ' ' + (j.model || '-');
    const o = mmap[k] || (mmap[k] = { brand:j.brand || '—', model:j.model || '—', n:0, c:0 });
    o.n++; o.c += claimCost(j);
  });
  const mRows = Object.values(mmap).sort((a,b) => b.c - a.c).slice(0,40);
  $('cmEmpty').style.display = mRows.length ? 'none' : 'block';
  $('tblClaimModel').querySelector('tbody').innerHTML = mRows.map(r => `<tr>
    <td>${esc(r.brand)}</td><td><b>${esc(r.model)}</b></td>
    <td class="num">${r.n}</td>
    <td class="num"><b style="color:var(--crit)">฿${money(r.c)}</b></td>
    <td class="num muted">฿${money(r.c / r.n)}</td></tr>`).join('');
}


/* =====================================================================
   แท็บ 3 · คุณภาพสินค้า
   ===================================================================== */
async function loadQualityReport(){
  try {
    const { data } = await sb.from('v_symptoms_by_model').select('*').limit(40);
    const rows = data || [];
    $('mdEmpty').style.display = rows.length ? 'none' : 'block';
    $('tblModel').querySelector('tbody').innerHTML = rows.map(r => `<tr>
      <td>${esc(r.brand||'—')}</td><td><b>${esc(r.model||'—')}</b></td>
      <td>${esc(r.symptom_name)}</td>
      <td class="num"><span class="pill ${r.job_count>=4?'tag-crit':'tag-warn'}">${r.job_count} ครั้ง</span></td></tr>`).join('');
  } catch(e){ console.warn(e); }

  drawTopParts();
}


/* =====================================================================
   ตั้งค่าระบบ — เฉพาะหัวหน้าช่าง / แอดมิน
   ===================================================================== */
const SET = { users:[], invites:[], syms:[] };

async function loadSettings(){
  try {
    const [techs, users, inv, syms] = await Promise.all([
      sb.from('technicians').select('*').order('code'),
      sb.from('v_app_users').select('*').order('role'),
      sb.from('invite_codes').select('*').order('created_at'),
      sb.from('symptom_categories').select('*').order('sort_order')
    ]);
    if (techs.error) throw techs.error;
    S.techs  = (techs.data || []).filter(t => t.is_active);
    SET.techsAll = techs.data || [];
    SET.users = users.data || [];
    SET.invites = inv.data || [];
    SET.syms = syms.data || [];
    renderSettings();
  } catch(e){ fail(e); }
}

function renderSettings(){
  /* ---- สเกลความยาก + เรทรางวัล ---- */
  const set = (id, v) => { if ($(id)) $(id).value = v; };
  set('cfgUnbox',   UNBOX_DAYS);
  set('cfgDLight',  DIFF_DAYS.light);
  set('cfgDMedium', DIFF_DAYS.medium);
  set('cfgDHeavy',  DIFF_DAYS.heavy);
  set('cfgRLight',  REWARD_RATE.light);
  set('cfgRMedium', REWARD_RATE.medium);
  set('cfgRHeavy',  REWARD_RATE.heavy);

  /* ---- ช่าง ---- */
  $('tblTech').querySelector('tbody').innerHTML = (SET.techsAll || []).map(t => {
    const load = S.jobs.filter(j => j.technician_id === t.id && !CLOSED.includes(j.status)).length;
    return `<tr>
      <td class="mono"><b>${esc(t.code)}</b></td>
      <td>${esc(t.full_name)}</td><td>${esc(t.nickname || '—')}</td>
      <td>${esc(t.phone || '—')}</td><td class="sub2">${esc(t.skill_note || '—')}</td>
      <td class="num">${load}</td>
      <td><span class="pill ${t.is_active ? 'tag-good' : 'st0'}">${t.is_active ? 'ใช้งาน' : 'ปิดใช้'}</span></td>
      <td class="num">
        <button class="btn ic" onclick="editTech('${t.id}')" title="แก้ไข">✏️</button>
        <button class="btn ic ${t.is_active ? 'dn' : ''}" onclick="toggleTech('${t.id}',${!t.is_active})"
          title="${t.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}">${t.is_active ? '🚫' : '✓'}</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="8" class="empty">ยังไม่มีช่าง</td></tr>';

  /* ---- ผู้ใช้ ---- */
  const RL = { staff:'พนักงานรับเครื่อง', tech:'ช่างซ่อม', head:'หัวหน้าช่าง', admin:'ผู้ดูแลระบบ' };
  $('tblUsers').querySelector('tbody').innerHTML = SET.users.map(u => `<tr>
    <td><b>${esc(u.full_name)}</b>${u.id === ME.id ? ' <span class="pill st1">คุณ</span>' : ''}</td>
    <td class="sub2">${esc(u.email)}</td>
    <td><select class="mini" onchange="changeRole('${esc(u.email)}', this.value)">
      ${Object.entries(RL).map(([k,v]) => `<option value="${k}" ${k===u.role?'selected':''}>${v}</option>`).join('')}
    </select></td>
    <td>${u.tech_code ? `<span class="pill st2">${esc(u.tech_code)} · ${esc(u.tech_name||'')}</span>` : '<span class="muted">—</span>'}</td>
    <td class="sub2">${u.last_sign_in_at ? dtth(u.last_sign_in_at) : 'ยังไม่เคยเข้า'}</td>
    <td class="num">${u.id === ME.id ? '' :
      `<button class="btn ic dn" onclick="revokeUser('${esc(u.email)}')" title="ตัดสิทธิ์">✕</button>`}</td>
  </tr>`).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีผู้ใช้</td></tr>';

  /* ---- โค้ดเชิญ ---- */
  $('tblInv').querySelector('tbody').innerHTML = SET.invites.map(c => {
    const full = c.max_uses !== null && c.used_count >= c.max_uses;
    return `<tr>
      <td class="mono"><b>${esc(c.code)}</b></td>
      <td><span class="pill st2">${RL[c.role] || c.role}</span></td>
      <td class="sub2">${esc(c.label || '—')}</td>
      <td class="num">${c.used_count}</td>
      <td class="num">${c.max_uses ?? '∞'}</td>
      <td><span class="pill ${!c.is_active ? 'st0' : full ? 'tag-warn' : 'tag-good'}">
        ${!c.is_active ? 'ปิดแล้ว' : full ? 'ใช้ครบแล้ว' : 'เปิดอยู่'}</span></td>
      <td class="num">
        <button class="btn ic" onclick="copyCode('${esc(c.code)}')" title="คัดลอก">📋</button>
        <button class="btn ic ${c.is_active ? 'dn' : ''}" onclick="toggleInvite('${esc(c.code)}',${!c.is_active})"
          title="${c.is_active ? 'ปิดโค้ด' : 'เปิดโค้ด'}">${c.is_active ? '🚫' : '✓'}</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="7" class="empty">ยังไม่มีโค้ดเชิญ</td></tr>';

  /* ---- หมวดอาการ ---- */
  $('tblSym').querySelector('tbody').innerHTML = SET.syms.map(s => {
    const used = S.jobs.filter(j => j.symptom_category === s.code).length;
    return `<tr>
      <td class="mono"><b>${esc(s.code)}</b></td><td>${esc(s.name_th)}</td>
      <td class="num muted">${s.sort_order}</td><td class="num">${used}</td>
      <td><span class="pill ${s.is_active ? 'tag-good' : 'st0'}">${s.is_active ? 'ใช้งาน' : 'ปิดใช้'}</span></td>
      <td class="num"><button class="btn ic ${s.is_active ? 'dn' : ''}"
        onclick="toggleSym('${esc(s.code)}',${!s.is_active})">${s.is_active ? '🚫' : '✓'}</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="empty">ยังไม่มีหมวดอาการ</td></tr>';
}

/* ---------- ค่าตั้งระบบ ---------- */
async function saveCfg(key, value, label){
  const { error } = await sb.from('sys_config')
    .upsert({ key, value, updated_by: who(), updated_at: new Date().toISOString() },
            { onConflict: 'key' });
  if (error) throw error;
  toast('✅ บันทึก' + label + 'แล้ว');
}

async function saveDiffDays(){
  const num = (id, d) => Math.max(1, Math.min(60, Math.round(Number(val(id)) || d)));
  const v = { light: num('cfgDLight',1), medium: num('cfgDMedium',2), heavy: num('cfgDHeavy',3) };
  try {
    await saveCfg('difficulty_days', v, 'สเกลความยาก');
    DIFF_DAYS = v; renderSettings(); previewDue();
  } catch(e){ fail(e); }
}

async function saveUnboxDays(){
  const n = Math.max(1, Math.min(30, Math.round(Number(val('cfgUnbox')) || 3)));
  try {
    await saveCfg('unbox_days', { limit:n }, 'กติกาแกะกล่อง');
    UNBOX_DAYS = n;
    renderSettings();
    reloadAll();                       // วันที่เหลือคิดที่ฝั่งฐานข้อมูล ต้องโหลดใหม่
  } catch(e){ fail(e); }
}

async function saveReward(){
  const num = id => Math.max(0, Math.round(Number(val(id)) || 0));
  const v = { light: num('cfgRLight'), medium: num('cfgRMedium'), heavy: num('cfgRHeavy') };
  try {
    await saveCfg('reward_rate', v, 'เรทรางวัล');
    REWARD_RATE = v; renderSettings();
  } catch(e){ fail(e); }
}

/* ---------- ช่าง ---------- */
async function addTech(){
  const f = await formModal({
    title:'เพิ่มช่างซ่อม', subtitle:'ช่างใหม่จะขึ้นในช่องมอบหมายงานและกราฟทันที', ok:'เพิ่มช่าง',
    fields:[
      { k:'code', label:'รหัสช่าง', required:true, upper:true, half:true, placeholder:'TECH-04' },
      { k:'full_name', label:'ชื่อ-สกุล', required:true, half:true, placeholder:'วิทยา ใจงาม' },
      { k:'nickname', label:'ชื่อที่แสดงบนแดชบอร์ด', half:true, placeholder:'วิทยา' },
      { k:'phone', label:'เบอร์โทร', type:'tel', half:true, placeholder:'08X-XXX-XXXX' },
      { k:'skill_note', label:'ความถนัด', placeholder:'มอเตอร์, แบตเตอรี่, ชุดเกียร์' }
    ]});
  if (!f) return;
  if (!f.nickname) f.nickname = f.full_name.split(' ')[0];
  try {
    const { error } = await sb.from('technicians').insert(f);
    if (error) throw error;
    toast('✅ เพิ่มช่าง ' + f.nickname + ' แล้ว');
    await loadSettings(); refreshTechSelects();
  } catch(e){ fail(e); }
}

async function editTech(id){
  const t = (SET.techsAll || []).find(x => x.id === id); if (!t) return;
  const f = await formModal({
    title:'แก้ไขข้อมูลช่าง', subtitle:t.code + ' · ' + t.full_name,
    fields:[
      { k:'full_name', label:'ชื่อ-สกุล', value:t.full_name, required:true, half:true },
      { k:'nickname', label:'ชื่อที่แสดง', value:t.nickname, half:true },
      { k:'phone', label:'เบอร์โทร', type:'tel', value:t.phone, half:true },
      { k:'skill_note', label:'ความถนัด', value:t.skill_note, half:true }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('technicians').update(f).eq('id', id);
    if (error) throw error;
    toast('✅ บันทึกแล้ว');
    await loadSettings(); refreshTechSelects();
  } catch(e){ fail(e); }
}

async function toggleTech(id, on){
  if (!on && !await confirmModal('ปิดใช้งานช่างคนนี้?',
      'ใบงานเดิมยังอยู่ครบและยังเห็นชื่อได้ตามปกติ\nแต่จะไม่ขึ้นในช่องเลือกช่างสำหรับงานใหม่', { ok:'ปิดใช้งาน' })) return;
  try {
    const { error } = await sb.from('technicians').update({ is_active: on }).eq('id', id);
    if (error) throw error;
    await loadSettings(); refreshTechSelects();
  } catch(e){ fail(e); }
}

function refreshTechSelects(){
  const to = S.techs.map(t => `<option value="${t.id}">${esc(t.nickname || t.full_name)}</option>`).join('');
  const f = $('fTech'), cur = f.value;
  f.innerHTML = '<option value="">ช่างทั้งหมด</option>' + to;
  f.value = cur;
  renderJobs();
}

/* ---------- ผู้ใช้ ---------- */
async function changeRole(email, role){
  const RL = { staff:'พนักงานรับเครื่อง', tech:'ช่างซ่อม', head:'หัวหน้าช่าง', admin:'ผู้ดูแลระบบ' };
  if (!await confirmModal('เปลี่ยนสิทธิ์ผู้ใช้',
      `${email}\nจะได้สิทธิ์ใหม่เป็น "${RL[role] || role}"\n\nเขาต้องออกจากระบบและเข้าใหม่ 1 ครั้ง สิทธิ์ถึงจะมีผล`,
      { ok:'เปลี่ยนสิทธิ์', danger:false })) { loadSettings(); return; }
  try {
    const { data, error } = await sb.rpc('set_user_role', { p_email: email, p_role: role });
    if (error) throw error;
    toast('✅ ' + data);
    await loadSettings();
  } catch(e){ fail(e); loadSettings(); }
}

async function revokeUser(email){
  if (!await confirmModal('ตัดสิทธิ์ผู้ใช้',
      `${email}\n\nบัญชียังอยู่ ล็อกอินได้ แต่จะไม่เห็นข้อมูลใด ๆ ในระบบ\nคืนสิทธิ์ทีหลังได้ด้วยการเปลี่ยน role`,
      { ok:'ตัดสิทธิ์' })) return;
  try {
    const { data, error } = await sb.rpc('revoke_member', { p_email: email });
    if (error) throw error;
    toast('✅ ' + data);
    await loadSettings();
  } catch(e){ fail(e); }
}

/* ---------- โค้ดเชิญ ---------- */
async function addInvite(){
  const f = await formModal({
    title:'สร้างโค้ดเชิญ', subtitle:'คนที่ได้โค้ดนี้จะสมัครเข้าระบบเองได้ พร้อมสิทธิ์ที่กำหนด',
    ok:'สร้างโค้ด',
    fields:[
      { k:'code', label:'โค้ดเชิญ', required:true, upper:true, placeholder:'MASARU-TECH-2026',
        hint:'ตั้งให้เดายาก และไม่ซ้ำกับโค้ดเดิม' },
      { k:'role', label:'สิทธิ์ที่จะได้', type:'select', value:'tech', half:true, options:[{v:'staff',t:'พนักงานรับเครื่อง'},{v:'tech',t:'ช่างซ่อม'},{v:'head',t:'หัวหน้าช่าง'},{v:'admin',t:'ผู้ดูแลระบบ'}] },
      { k:'max_uses', label:'จำกัดกี่คน', type:'number', value:10, min:1, half:true,
        hint:'เว้นว่าง = ไม่จำกัด' },
      { k:'label', label:'คำอธิบาย', placeholder:'ช่างซ่อม รอบเดือน ก.ย.' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('invite_codes').insert(f);
    if (error) throw error;
    toast('✅ สร้างโค้ด ' + f.code + ' แล้ว');
    await loadSettings();
  } catch(e){ fail(e); }
}

async function toggleInvite(code, on){
  try {
    const { error } = await sb.from('invite_codes').update({ is_active: on }).eq('code', code);
    if (error) throw error;
    toast(on ? 'เปิดโค้ดแล้ว' : 'ปิดโค้ดแล้ว');
    await loadSettings();
  } catch(e){ fail(e); }
}

function copyCode(c){
  navigator.clipboard?.writeText(c).then(() => toast('📋 คัดลอกโค้ด ' + c + ' แล้ว'))
    .catch(() => formModal({ title:'คัดลอกโค้ดเชิญ', subtitle:'กดค้างเพื่อเลือกแล้วคัดลอก',
        fields:[{ k:'c', label:'โค้ดเชิญ', value:c }], ok:'ปิด' }));
}

/* ---------- หมวดอาการ ---------- */
async function addSym(){
  const f = await formModal({
    title:'เพิ่มหมวดอาการเสีย', subtitle:'ใช้เป็นแกนของกราฟ "อาการเสียที่พบบ่อย Top 5"',
    ok:'เพิ่มหมวด',
    fields:[
      { k:'code', label:'รหัสหมวด (อังกฤษพิมพ์ใหญ่)', required:true, upper:true, half:true, placeholder:'CABLE' },
      { k:'name_th', label:'ชื่อหมวดภาษาไทย', required:true, half:true, placeholder:'สายไฟขาด' },
      { k:'sort_order', label:'ลำดับการแสดง', type:'number', value:100, min:1,
        hint:'เลขน้อยขึ้นก่อน — "อื่น ๆ" ใช้ 999' }
    ]});
  if (!f) return;
  try {
    const { error } = await sb.from('symptom_categories').insert(f);
    if (error) throw error;
    toast('✅ เพิ่มหมวดแล้ว');
    const { data } = await sb.from('symptom_categories').select('*').eq('is_active', true).order('sort_order');
    S.cats = data || [];
    $('nSymCat').innerHTML = '<option value="">— ยังไม่ระบุ —</option>'
      + S.cats.map(c => `<option value="${c.code}">${esc(c.name_th)}</option>`).join('');
    await loadSettings();
  } catch(e){ fail(e); }
}

async function toggleSym(code, on){
  try {
    const { error } = await sb.from('symptom_categories').update({ is_active: on }).eq('code', code);
    if (error) throw error;
    await loadSettings();
  } catch(e){ fail(e); }
}

/* =====================================================================
   การแจ้งเตือน — คำนวณสด ๆ จากข้อมูลจริง ไม่ต้องมีตารางเพิ่ม
   ===================================================================== */
/** ตารางกล่องค้างแกะในแดชบอร์ด — ไม่มีของค้างก็ซ่อนการ์ดไปเลย */
function renderUnbox(){
  const card = $('cardUnbox');
  if (!card) return;
  const rows = S.jobs.filter(unboxPending)
    .sort((a,b) => (a.unbox_days_left ?? 99) - (b.unbox_days_left ?? 99));
  card.hidden = !rows.length;
  if (!rows.length) return;

  const late = rows.filter(j => j.unbox_days_left < 0).length;
  const cnt  = $('ubCount');
  cnt.textContent = late ? `${money(rows.length)} · เกินกำหนด ${money(late)}` : money(rows.length);
  cnt.className   = 'pill ' + (late ? 'tag-crit' : 'tag-warn');

  $('tblUnbox').querySelector('tbody').innerHTML = rows.slice(0, 40).map(j => {
    const d  = j.unbox_days_left;
    const cl = d < 0 ? 'tag-crit' : d === 0 ? 'tag-warn' : 'tag-good';
    return `<tr>
      <td><b class="mono">${esc(jobRef(j))}</b>
        <div class="sub2">${esc(j.customer_name || 'ยังไม่รู้เจ้าของ')}</div></td>
      <td>${esc(j.platform || '—')}
        ${j.shop_name ? `<div class="sub2">${esc(j.shop_name)}</div>` : ''}</td>
      <td class="mono sub2">${esc(j.tracking_in || '—')}</td>
      <td>${esc(dth(j.arrived_at))}</td>
      <td class="sub2">${esc(dth(j.unbox_due))}</td>
      <td class="num"><span class="pill ${cl}">${esc(unboxLeftText(j))}</span></td>
      <td class="num noprint">
        <button class="btn sm p" onclick="openJob('${esc(j.id)}')">เปิดใบงาน</button></td>
    </tr>`;
  }).join('') + (rows.length > 40
    ? `<tr><td colspan="7" class="sub2">…และอีก ${money(rows.length - 40)} ใบ
         — ดูทั้งหมดที่หน้าใบงาน ตัวกรอง "กล่องค้างแกะ"</td></tr>` : '');
}

function buildAlerts(){
  const A = [];
  const open = S.jobs.filter(j => !CLOSED.includes(j.status));
  const today = new Date(); today.setHours(0,0,0,0);
  const dayDiff = d => Math.round((new Date(d).setHours(0,0,0,0) - today) / 864e5);

  // คำขอแก้อะไหล่ที่รอหัวหน้าอนุมัติ — ค้างไว้ = ยอดเงินในใบงานยังไม่ถูก
  (S.adjust || []).forEach(a => A.push({
    g:'คำขอแก้อะไหล่ รออนุมัติ', lv:(a.days_waiting||0) >= 1 ? 'crit' : 'warn', ic:'✏️',
    t1:`${refByNo(a.job_no)} · ${a.part_no || '—'} ${a.part_name || ''}`,
    t2:`${ADJ_KIND[a.kind] || a.kind} · ${a.qty_now ?? '—'} → ${a.kind === 'return' ? 0 : (a.qty_new ?? '—')} · ผู้ขอ ${a.requested_by || '—'}`,
    rt:(a.days_waiting||0) > 0 ? `รอ ${a.days_waiting} วัน` : 'วันนี้',
    go:() => openJob(a.job_id) }));

  // อะไหล่ขาด ยังไม่ได้ออกใบขอจัดซื้อ
  (S.shortage || []).forEach(s => A.push({
    g:'อะไหล่ขาด ยังไม่ได้สั่งซื้อ', lv:(s.days_waiting||0) >= 2 ? 'crit' : 'warn', ic:'🧾',
    t1:`${s.part_no} · ${s.part_name}`,
    t2:`ขาด ${s.qty_short} ${s.unit || 'ชิ้น'} · ใบงาน ${refByNo(s.job_no)}`,
    rt:`ค้าง ${s.days_waiting || 0} วัน`,
    go:() => goPage('parts') }));

  // รอคลิปจากลูกค้า — ปิดเรื่องไว้แล้ว แต่ยังมีอะไรให้ตาม ไม่งั้นค้างลืม
  S.jobs.filter(j => j.clip_waiting)
        .sort((a,b) => (b.clip_days_waiting||0) - (a.clip_days_waiting||0))
        .forEach(j => A.push({
          g:'รอคลิปจากลูกค้า', lv:(j.clip_days_waiting||0) >= 3 ? 'crit' : 'warn', ic:'📹',
          t1:`${jobRef(j)} · ${j.customer_name || 'ยังไม่รู้เจ้าของ'}`,
          t2:(j.clip_note || 'ขอคลิปประกอบการพิจารณา').slice(0, 70),
          rt:(j.clip_days_waiting||0) > 0 ? `รอ ${j.clip_days_waiting} วัน` : 'วันนี้',
          go:() => openJob(j.id) }));

  // กล่องค้างแกะ — ของยังไม่ได้เปิดเลย เร่งกว่างานที่เริ่มแล้ว
  S.jobs.filter(unboxPending)
        .filter(j => (j.unbox_days_left ?? 99) <= 0)
        .sort((a,b) => (a.unbox_days_left ?? 0) - (b.unbox_days_left ?? 0))
        .forEach(j => A.push({
          g:'กล่องค้างแกะ', lv:(j.unbox_days_left ?? 0) < 0 ? 'crit' : 'warn', ic:'📦',
          t1:`${jobRef(j)} · ${j.customer_name || 'ยังไม่รู้เจ้าของ'}`,
          t2:`${j.platform || 'ไม่ระบุช่องทาง'} · ของถึงศูนย์ ${dth(j.arrived_at)}` +
             (j.tracking_in ? ' · พัสดุ ' + j.tracking_in : ''),
          rt:unboxLeftText(j), go:() => openJob(j.id) }));

  // เกินกำหนด — เร่งด่วนสุด
  open.filter(j => j.days_overdue > 0)
      .sort((a,b) => b.days_overdue - a.days_overdue)
      .forEach(j => A.push({ g:'เกินกำหนด', lv:'crit', ic:'🚨',
        t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
        t2:`${[j.brand,j.model].filter(Boolean).join(' ') || j.tool_type || 'ไม่ระบุเครื่อง'} · ${j.tech_name || 'ยังไม่มอบหมาย'}`,
        rt:`เกิน ${j.days_overdue} วัน`, go:() => openJob(j.id) }));

  // ครบกำหนดวันนี้ / พรุ่งนี้
  open.filter(j => j.due_date && !(j.days_overdue > 0) && dayDiff(j.due_date) <= 1)
      .sort((a,b) => new Date(a.due_date) - new Date(b.due_date))
      .forEach(j => { const d = dayDiff(j.due_date);
        A.push({ g:'ใกล้ครบกำหนด', lv:'warn', ic:'⏰',
          t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
          t2:`${j.tech_name || 'ยังไม่มอบหมาย'} · ${STATUS[j.status] || j.status}`,
          rt: d <= 0 ? 'วันนี้' : 'พรุ่งนี้', go:() => openJob(j.id) }); });

  // ยังไม่มอบหมายช่าง
  open.filter(j => !j.technician_id)
      .forEach(j => A.push({ g:'ยังไม่มอบหมายช่าง', lv:'warn', ic:'👤',
        t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
        t2:`รับเข้ามา ${j.days_in_shop ?? 0} วันแล้ว`,
        rt:'รอจ่ายงาน', go:() => openJob(j.id) }));

  // รออะไหล่
  open.filter(j => j.status === 'wait_parts')
      .forEach(j => A.push({ g:'งานติดรออะไหล่', lv:'warn', ic:'📦',
        t1:`${jobRef(j)} · ${[j.brand,j.model].filter(Boolean).join(' ') || '—'}`,
        t2:`${j.tech_name || '—'} · ค้าง ${j.days_in_shop ?? 0} วัน`,
        rt:'รออะไหล่', go:() => openJob(j.id) }));

  // พร้อมส่งมอบ — ต้องโทรตามลูกค้า
  S.jobs.filter(j => j.status === 'ready')
        .forEach(j => A.push({ g:'พร้อมส่งมอบ — รอลูกค้ารับ', lv:'ok', ic:'✅',
          t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
          t2:`${j.customer_phone || 'ไม่มีเบอร์ติดต่อ'} · รวม ฿${money(j.total_cost)}`,
          rt:'นัดรับได้', go:() => openJob(j.id) }));

  // พัสดุไม่ทราบที่มา — ของอยู่ที่ศูนย์แต่ไม่มีเจ้าของ
  S.jobs.filter(j => j.status === 'unknown_parcel')
        .sort((a,b) => (b.days_in_shop||0) - (a.days_in_shop||0))
        .forEach(j => A.push({ g:'พัสดุไม่ทราบที่มา — ต้องประสานหาเจ้าของ',
          lv:(j.days_in_shop||0) > 7 ? 'crit' : 'warn', ic:'📦',
          t1:`${jobRef(j)} · ${j.tracking_in || 'ไม่มีเลขพัสดุ'}`,
          t2:`${j.brand || 'ไม่ทราบแบรนด์'}${j.shop_name ? ' · ร้าน ' + j.shop_name : ''}`,
          rt:`ค้าง ${j.days_in_shop ?? 0} วัน`, go:() => openJob(j.id) }));

  // ยังไม่ได้แจ้งลูกค้าให้ส่งของ (SOP A6)
  S.jobs.filter(j => j.status === 'awaiting_parcel' && !j.notified_at)
        .forEach(j => A.push({ g:'ยังไม่ได้แจ้งลูกค้าให้ส่งของ', lv:'crit', ic:'📞',
          t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
          t2:`${j.customer_phone || 'ไม่มีเบอร์ติดต่อ'} · รับเรื่องมาแล้ว ${j.days_in_shop ?? 0} วัน`,
          rt:'ต้องแจ้ง', go:() => openJob(j.id) }));

  // รอลูกค้าส่งของนานเกิน 7 วัน (SOP A6-A7)
  S.jobs.filter(j => j.status === 'awaiting_parcel' && (j.days_in_shop ?? 0) > 7)
        .forEach(j => A.push({ g:'รอลูกค้าส่งของนานเกิน 7 วัน', lv:'warn', ic:'📮',
          t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
          t2:`${j.order_no ? 'Order ' + j.order_no + ' · ' : ''}แจ้งเคลมมาแล้ว ${j.days_in_shop} วัน`,
          rt:'ตามลูกค้า', go:() => openJob(j.id) }));

  // ยังไม่ระบุเงื่อนไขประกัน — กระทบว่าใครจ่ายเงิน
  open.filter(j => !j.warranty_case || j.warranty_case === 'unknown')
      .forEach(j => A.push({ g:'ยังไม่ระบุเงื่อนไขประกัน', lv:'crit', ic:'⚖️',
        t1:`${jobRef(j)} · ${j.customer_name || '—'}`,
        t2:'ต้องระบุก่อนเริ่มซ่อม ไม่งั้นเก็บเงินลูกค้าไม่ถูก',
        rt:'ต้องระบุ', go:() => openJob(j.id) }));

  // อะไหล่หมด / ติดลบ / ถึงจุดสั่งซื้อ
  (S.stock || []).filter(p => p.stock_state !== 'ปกติ')
    .sort((a,b) => a.qty - b.qty)
    .forEach(p => A.push({
      g:'อะไหล่ต้องสั่งเพิ่ม', lv: p.qty <= 0 ? 'crit' : 'warn', ic:'🔩',
      t1:`${p.part_no} · ${p.name}`,
      t2:`เหลือ ${p.qty} ${p.unit || ''} · จุดสั่งซื้อ ${p.reorder_point} · ใช้ไป 90 วัน ${p.used_90d}`,
      rt:p.stock_state, go:() => goPage('parts') }));

  return A;
}

function renderBell(){
  const A = buildAlerts();
  const b = $('bellCount');
  b.textContent = A.length > 99 ? '99+' : A.length;
  b.hidden = A.length === 0;
  $('npCount').textContent = A.length + ' รายการ';

  if (!A.length){
    $('nplist').innerHTML = `<div class="npempty"><span class="e">🎉</span>
      ไม่มีอะไรต้องจัดการตอนนี้<br><span class="sub2">งานทั้งหมดอยู่ในกำหนด และอะไหล่พอใช้</span></div>`;
    return;
  }
  let html = '', last = null;
  A.forEach((a, i) => {
    if (a.g !== last){ html += `<div class="ngrp">${esc(a.g)}</div>`; last = a.g; }
    html += `<button class="nitem lv-${a.lv}" onclick="hitAlert(${i})">
      <span class="ic">${a.ic}</span>
      <span class="tx"><span class="t1">${esc(a.t1)}</span><span class="t2">${esc(a.t2)}</span></span>
      <span class="rt">${esc(a.rt)}</span></button>`;
  });
  $('nplist').innerHTML = html;
  window.__alerts = A;
}

function hitAlert(i){ closeBell(); window.__alerts?.[i]?.go?.(); }
function closeBell(){ $('npanel').classList.remove('on'); $('bellBtn').classList.remove('act'); $('bellBtn').setAttribute('aria-expanded','false'); }

$('bellBtn').addEventListener('click', e => {
  e.stopPropagation();
  const on = $('npanel').classList.toggle('on');
  $('bellBtn').classList.toggle('act', on);
  $('bellBtn').setAttribute('aria-expanded', on);
  if (on) renderBell();
});
document.addEventListener('click', e => {
  if ($('npanel').classList.contains('on') && !$('npanel').contains(e.target) && e.target !== $('bellBtn')) closeBell();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBell(); });




/* ---------------------------------------------------------------------
   ย่อ-ขยายหน้าต่าง → วาดกราฟใหม่ให้พอดีกล่อง
   ใช้ข้อมูลที่โหลดไว้แล้วใน S ไม่ยิง query ใหม่
   ------------------------------------------------------------------ */
let _rszT = null;
window.addEventListener('resize', () => {
  clearTimeout(_rszT);
  _rszT = setTimeout(() => {
    try {
      if ($('p-dash')?.classList.contains('on')) { renderDash(); return; }
      if (!$('p-report')?.classList.contains('on')) return;
      redrawRepTab();
    } catch(e){ console.warn('redraw', e); }
  }, 220);
});

/* เปิดใบงานจากลิงก์ ?job=<id> — ยังใช้ส่งลิงก์ให้กันในแชทได้ */
window.addEventListener('load', () => {
  const id = new URLSearchParams(location.search).get('job');
  if (id) setTimeout(() => { if (sb) openJob(id); }, 900);
});

</script>
</body>
</html>
