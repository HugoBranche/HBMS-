/* ---------------- render helpers ---------------- */
function badge(s){return `<span class="badge badge-${s}">${s}</span>`;}
function esc(s){return (s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
function render(){document.getElementById("app").innerHTML = S.loggedIn ? shell() : login();}

/* ---------------- LOGIN ---------------- */
function login(){
 const r=S.loginRole;
 const tabs=["patient","receptionist","doctor"].map(k=>`<button class="role-tab ${k===r?'active':''}" data-act="login-tab" data-role="${k}">${ROLE_LABEL[k]}</button>`).join("");
 let body="";
 if(r==="patient"){
  const modeBtns=`<div class="auth-toggle">
    <button class="${S.authMode==='signin'?'active':''}" data-act="auth-mode" data-m="signin">Sign in</button>
    <button class="${S.authMode==='signup'?'active':''}" data-act="auth-mode" data-m="signup">Create account</button></div>`;
  const errHtml = S.formErr?`<div class="err">${esc(S.formErr)}</div>`:"";
  if(S.authMode==="signup"){
   body=`${modeBtns}<form data-form="signup">
    <div class="field"><label>Full name</label><input name="name" required></div>
    <div class="field"><label>Email</label><input type="email" name="email" required></div>
    <div class="field"><label>Phone</label><input name="phone" required></div>
    <div class="field"><label>Date of birth</label><input type="date" name="dob" required></div>
    <div class="field"><label>Password</label><input type="password" name="password" required minlength="4"></div>
    ${errHtml}
    <button class="btn block" type="submit" ${S.busy?'disabled':''}>${S.busy?'Creating account…':'Create account'}</button>
   </form>`;
  } else {
   body=`${modeBtns}<form data-form="signin">
    <div class="field"><label>Email</label><input type="email" name="email" required></div>
    <div class="field"><label>Password</label><input type="password" name="password" required></div>
    ${errHtml}
    <button class="btn block" type="submit" ${S.busy?'disabled':''}>${S.busy?'Signing in…':'Sign in'}</button>
   </form>
   <p class="id-note"></p>`;
  }
 } else if(r==="receptionist"){
  body=`<div class="field"><label>Your name</label><input id="staffName" value="${esc(S.staffName)}"></div>
   <button class="btn block" data-act="do-login">Sign in</button>`;
 } else {
  const opts=DOCTORS.map(d=>`<option value="${esc(d.name)}">${esc(d.name)} — ${esc(d.dept)}</option>`).join("");
  body=`<div class="field"><label>Sign in as</label><select id="docSelect">${opts}</select></div>
   <button class="btn block" data-act="do-login">Sign in</button>`;
 }
 return `<div class="login-wrap"><div class="intake">
  <div class="intake-brand"><span class="mark">HBMS</span><span class="tag">hospital scheduling</span></div>
  <div class="role-tabs">${tabs}</div>
  <div class="intake-card">
   <h2>Sign in as ${ROLE_LABEL[r].toLowerCase()}</h2>
   <p class="lede">${ROLE_LEDE[r]}</p>
   ${body}
   <p class="id-note">${dbReady? '' : ''}</p>
  </div>
 </div></div>`;
}

/* ---------------- SHELL ---------------- */
function shell(){
 const nav=NAV[S.role].map(([v,label],i)=>`<button class="tab-item ${S.view===v?'active':''}" data-act="nav" data-view="${v}"><span class="n">0${i+1}</span>${label}</button>`).join("");
 const who = S.role==="patient" ? S.patient.name : S.role==="doctor" ? S.doctorName : S.staffName;
 return `<div class="topbar"><span class="mark">HBMS</span>
   <span class="wristband">${ROLE_LABEL[S.role]} <span class="who">· ${esc(who)}</span></span></div>
  <div class="rail">${nav}
   <div class="rail-foot"><button class="tab-item" data-act="logout">⟵ Sign out</button></div>
  </div>
  <div class="main">${page()}</div>`;
}

function syncTag(){return `<span class="sync ${dbReady?'live':''}">${dbReady?'● synced':'○ local only'}</span>`;}

function page(){
 if(S.role==="patient"){
  if(S.view==="request") return patientRequest();
  if(S.view==="appointments") return patientAppointments();
  return patientDashboard();
 }
 if(S.role==="receptionist"){
  if(S.view==="assign") return receptionAssign();
  if(S.view==="appointments") return receptionAppointments();
  if(S.view==="patients") return receptionPatients();
  return receptionDashboard();
 }
 if(S.view==="requests") return doctorRequests();
 if(S.view==="appointments") return doctorAppointments();
 if(S.view==="treat") return doctorTreat();
 return doctorDashboard();
}

/* ---------------- PATIENT ---------------- */
function patientDashboard(){
 const up=appts.filter(a=>["Confirmed","Accepted","Assigned"].includes(a.status));
 const pend=appts.filter(a=>a.status==="Pending");
 const done=appts.filter(a=>a.status==="Completed");
 const next=up[0];
 return `<div class="page-head"><div><h1>Good day, ${esc(S.patient.name.split(" ")[0])}</h1><p>Here's where your appointments stand.</p></div>${syncTag()}</div>
 <div class="stat-row">
  <div class="stat accent-urgent"><div class="v">${pend.length}</div><div class="l">Pending requests</div></div>
  <div class="stat accent-info"><div class="v">${up.length}</div><div class="l">Upcoming appointments</div></div>
  <div class="stat"><div class="v">${done.length}</div><div class="l">Completed visits</div></div>
 </div>
 ${next?`<div class="card pad" style="margin-bottom:22px"><div class="mono" style="font-size:11px;color:var(--info);margin-bottom:10px">Next appointment</div>
   <div style="display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-weight:600">${esc(next.doctor||"Awaiting assignment")}</div><div style="font-size:12.5px;color:var(--ink-soft)">${esc(next.department)}</div>
     <div class="mono" style="margin-top:8px">${next.date} · ${next.time}</div></div>
    ${badge(next.status)}
   </div></div>`
  :`<div class="card empty" style="margin-bottom:22px"><div class="glyph">—</div>No upcoming appointments yet.<br>Request one to get started.</div>`}
 <div style="display:flex;gap:10px">
  <button class="btn" data-act="nav" data-view="request">+ Request appointment</button>
  <button class="btn ghost" data-act="nav" data-view="appointments">My appointments</button>
 </div>`;
}

function patientRequest(){
 if(S.submitted){
  return `<div class="page-head"><h1>Request appointment</h1></div>
  <div class="card pad empty" style="max-width:440px"><div class="glyph">✓</div>
   <div style="font-weight:600;color:var(--ink);margin-bottom:4px">Request submitted</div>
   Reception will match you with a doctor shortly.<br>
   <button class="link-btn" style="margin-top:14px" data-act="req-again">Submit another request →</button>
  </div>`;
 }
 const timeOpts=TIMES.map(t=>`<option>${t}</option>`).join("");
 const deptOpts=DEPARTMENTS.map(d=>`<option>${d}</option>`).join("");
 return `<div class="page-head"><h1>Request appointment</h1><p>Fill in the details below.</p></div>
 <form class="card pad" style="max-width:460px" data-form="request">
  <div class="field"><label>Department / specialty</label><select name="department" required><option value="">Select a department</option>${deptOpts}</select></div>
  <div class="grid2">
   <div class="field"><label>Preferred date</label><input type="date" name="date" required></div>
   <div class="field"><label>Preferred time</label><select name="time" required><option value="">Select time</option>${timeOpts}</select></div>
  </div>
  <div class="field"><label>Reason for appointment</label><textarea name="reason" rows="3" required placeholder="Briefly describe your symptoms…"></textarea></div>
  <button class="btn" type="submit" ${S.busy?'disabled':''}>${S.busy?'Submitting…':'Submit request'}</button>
 </form>`;
}

function patientAppointments(){
 return `<div class="page-head"><div><h1>My appointments</h1><p>Status of every request you've made.</p></div>${syncTag()}</div>
 ${apptTable(appts,{patientActions:true})}`;
}

function apptTable(list,opts){
 opts=opts||{};
 if(!list.length) return `<div class="card empty"><div class="glyph">—</div>No appointments to show.</div>`;
 const rows=list.map(a=>{
  const doc = a.doctor||`<span style="color:var(--muted);font-style:italic">Not assigned yet</span>`;
  let actions="";
  if(opts.patientActions && ["Pending","Assigned"].includes(a.status)) actions=`<button class="link-btn danger" data-act="cancel-appt" data-id="${a.id}">Cancel</button>`;
  return `<tr><td style="font-weight:600">${doc}</td><td>${esc(a.department)}</td><td class="mono">${a.date}</td><td class="mono">${a.time}</td><td>${badge(a.status)}</td><td>${actions}</td></tr>`;
 }).join("");
 return `<div class="card"><table><thead><tr><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/* ---------------- RECEPTIONIST ---------------- */
function receptionDashboard(){
 const pending=appts.filter(a=>a.status==="Pending");
 const avail=DOCTORS.filter(d=>d.available);
 const rows=pending.map(a=>`<tr><td style="font-weight:600">${esc(a.patientName)}</td><td class="mono">${a.date}</td><td>${esc(a.department)}</td><td>${badge(a.status)}</td>
  <td><button class="btn small" data-act="nav" data-view="assign">Assign doctor</button></td></tr>`).join("");
 return `<div class="page-head"><div><h1>Front desk</h1><p>Manage appointment requests and scheduling.</p></div>${syncTag()}</div>
 <div class="stat-row">
  <div class="stat"><div class="v">${patients.length}</div><div class="l">Registered patients</div></div>
  <div class="stat accent-urgent"><div class="v">${pending.length}</div><div class="l">Pending requests</div></div>
  <div class="stat"><div class="v">${appts.length}</div><div class="l">Total appointments</div></div>
  <div class="stat accent-confirm"><div class="v">${avail.length}</div><div class="l">Available doctors</div></div>
 </div>
 <div class="card">
  <div class="section-head"><h3>Pending appointment requests</h3><button class="link-btn" data-act="nav" data-view="assign">View all →</button></div>
  ${pending.length? `<table><thead><tr><th>Patient</th><th>Requested date</th><th>Specialty</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table>`
   : `<div class="empty">No pending requests — all caught up.</div>`}
 </div>`;
}

function receptionAssign(){
 const pending=appts.filter(a=>a.status==="Pending");
 const sel=pending.find(a=>a.id===S.selectedReq);
 const list=pending.map(a=>`<button class="pick-item ${a.id===S.selectedReq?'sel':''}" data-act="pick-req" data-id="${a.id}">
   <div class="nm">${esc(a.patientName)}</div><div class="dp">${esc(a.department)}</div>
   <div class="meta">${a.date} ${badge(a.status)}</div></button>`).join("") || `<div class="card pad empty">No pending requests right now.</div>`;
 let panel;
 if(sel){
  const patientInfo=patients.find(p=>p.id===sel.patientId)||{};
  const docOpts=DOCTORS.filter(d=>d.available).map(d=>`<option value="${esc(d.name)}" ${S.assignDoc===d.name?'selected':''}>${esc(d.name)} — ${esc(d.dept)}</option>`).join("");
  const timeOpts=`<option value="">Keep patient preference</option>`+TIMES.map(t=>`<option ${S.assignTime===t?'selected':''}>${t}</option>`).join("");
  panel=`<div class="card pad">
   <h3 style="margin-bottom:14px">Assign doctor</h3>
   <div style="background:var(--paper-2);border-radius:5px;padding:14px;margin-bottom:16px">
    <div class="mono" style="font-size:11px;color:var(--ink-soft);margin-bottom:6px">Patient information</div>
    <div style="font-weight:600">${esc(sel.patientName)}</div>
    <div style="font-size:13px;color:var(--ink-soft)">${esc(patientInfo.email||"")} ${patientInfo.phone?' · '+esc(patientInfo.phone):''}</div>
    <div style="font-size:13px;color:var(--ink-soft);margin-top:2px">${esc(sel.department)} · ${sel.date} at ${sel.time}</div>
    <div class="quote">"${esc(sel.reason)}"</div>
   </div>
   <div class="field"><label>Select available doctor</label><select data-bind="assignDoc"><option value="">Choose a doctor</option>${docOpts}</select></div>
   <div class="grid2">
    <div class="field"><label>Appointment date</label><input type="date" data-bind="assignDate" value="${S.assignDate}" placeholder="${sel.date}"></div>
    <div class="field"><label>Appointment time</label><select data-bind="assignTime">${timeOpts}</select></div>
   </div>
   <button class="btn" data-act="confirm-assign" ${!S.assignDoc||S.busy?'disabled':''}>${S.busy?'Assigning…':'Assign doctor'}</button>
  </div>`;
 } else {
  panel=`<div class="placeholder">Select a request from the list to assign a doctor.</div>`;
 }
 return `<div class="page-head"><div><h1>Appointment requests</h1><p>Review pending requests and assign an available doctor.</p></div>${syncTag()}</div>
 ${S.flash?`<div class="flash ok">${S.flash}<button class="x" data-act="clear-flash">×</button></div>`:""}
 <div class="picker-grid"><div>${list}</div><div>${panel}</div></div>`;
}

function receptionAppointments(){
 const filters=["All","Pending","Assigned","Accepted","Confirmed","Completed","Cancelled","Declined"];
 const chips=filters.map(f=>`<button class="chip ${S.reqFilter===f?'active':''}" data-act="set-filter" data-f="${f}">${f}</button>`).join("");
 const list=S.reqFilter==="All"?appts:appts.filter(a=>a.status===S.reqFilter);
 const rows=list.map(a=>`<tr><td style="font-weight:600">${esc(a.patientName)}</td><td>${a.doctor||`<span style="color:var(--muted);font-style:italic">Unassigned</span>`}</td>
   <td>${esc(a.department)}</td><td class="mono">${a.date}</td><td class="mono">${a.time}</td><td>${badge(a.status)}</td></tr>`).join("");
 return `<div class="page-head"><div><h1>All appointments</h1><p>Every appointment in the system.</p></div>${syncTag()}</div>
 <div class="chip-row">${chips}</div>
 <div class="card">${list.length?`<table><thead><tr><th>Patient</th><th>Doctor</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`:`<div class="empty">No appointments match this filter.</div>`}</div>`;
}

function receptionPatients(){
 const rows=patients.map(p=>`<tr><td style="font-weight:600">${esc(p.name)}</td><td class="mono">${esc(p.email)}</td><td>${esc(p.phone)}</td><td class="mono">${esc(p.dob)}</td></tr>`).join("");
 return `<div class="page-head"><div><h1>Patient records</h1><p>Accounts registered through the patient portal.</p></div>${syncTag()}</div>
 <div class="card">${patients.length?`<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Date of birth</th></tr></thead><tbody>${rows}</tbody></table>`:`<div class="empty">No patients registered yet.</div>`}</div>`;
}

/* ---------------- DOCTOR ---------------- */
function doctorDashboard(){
 const pending=appts.filter(a=>a.status==="Assigned");
 const accepted=appts.filter(a=>["Accepted","Confirmed"].includes(a.status));
 return `<div class="page-head"><div><h1>Good day, ${esc(S.doctorName)}</h1><p>You have ${pending.length} pending request${pending.length!==1?'s':''} to review.</p></div>${syncTag()}</div>
 <div class="stat-row">
  <div class="stat accent-urgent"><div class="v">${pending.length}</div><div class="l">Pending requests</div></div>
  <div class="stat accent-confirm"><div class="v">${accepted.length}</div><div class="l">Accepted</div></div>
  <div class="stat"><div class="v">${appts.length}</div><div class="l">Total on your list</div></div>
 </div>
 ${pending.length? `<div class="flash bad" style="align-items:center">
   <div><div style="font-weight:600">You have ${pending.length} unreviewed request${pending.length!==1?'s':''}</div>
   <div style="font-size:12.5px">Accept or decline appointments assigned to you.</div></div>
   <button class="btn small" style="margin-left:auto;background:var(--urgent);border-color:var(--urgent)" data-act="nav" data-view="requests">Review now</button></div>`
  : `<div class="card empty"><div class="glyph">✓</div>No pending requests. All caught up.</div>`}`;
}

function doctorRequests(){
 const reqs=appts.filter(a=>a.status==="Assigned");
 const declining=S.declineTarget;
 const rows=reqs.map(a=>{
  const actions = declining===a.id
   ? `<div style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
       <div class="field"><label>Reason for declining</label><textarea rows="2" id="declineReason" placeholder="Schedule conflict, not my specialty, etc."></textarea></div>
       <button class="btn small" style="background:var(--urgent);border-color:var(--urgent)" data-act="confirm-decline" data-id="${a.id}" ${S.busy?'disabled':''}>Confirm decline</button>
       <button class="btn small ghost" data-act="cancel-decline">Cancel</button></div>`
   : `<div style="margin-top:14px;display:flex;gap:8px">
       <button class="btn small" data-act="accept" data-id="${a.id}" ${S.busy?'disabled':''}>Accept</button>
       <button class="btn small danger" data-act="start-decline" data-id="${a.id}">Decline</button></div>`;
  return `<div class="card pad" style="margin-bottom:12px">
    <div style="display:flex;justify-content:space-between">
     <div><div style="font-weight:600">${esc(a.patientName)}</div><div style="font-size:12.5px;color:var(--ink-soft)">${esc(a.department)}</div>
      <div class="mono" style="margin:6px 0">${a.date} · ${a.time}</div>
      <div style="background:var(--paper-2);border-radius:4px;padding:8px 11px;font-size:13px;margin-top:4px"><b>Reason:</b> ${esc(a.reason)}</div></div>
     ${badge(a.status)}
    </div>${actions}</div>`;
 }).join("");
 return `<div class="page-head"><div><h1>Appointment requests</h1><p>Accept or decline visits assigned to you.</p></div>${syncTag()}</div>
 ${S.flash?`<div class="flash ${S.flash.bad?'bad':'ok'}">${S.flash.msg}<button class="x" data-act="clear-flash">×</button></div>`:""}
 ${reqs.length? rows : `<div class="card empty"><div class="glyph">✓</div>No pending requests. All caught up.</div>`}`;
}

function doctorAppointments(){
 const m=appts.filter(a=>a.status!=="Assigned");
 const up=m.filter(a=>["Accepted","Confirmed"].includes(a.status));
 const done=m.filter(a=>a.status==="Completed");
 const shown=S.docTab==="Upcoming"?up:done;
 const tabs=["Upcoming","Completed"].map(t=>`<button class="chip ${S.docTab===t?'active':''}" data-act="doc-tab" data-t="${t}">${t} (${t==="Upcoming"?up.length:done.length})</button>`).join("");
 const rows=shown.map(a=>{
  const action = S.docTab==="Upcoming"
   ? `<button class="link-btn" data-act="open-treat" data-id="${a.id}">Treat patient</button>`
   : (a.treatment ? `<button class="link-btn" data-act="open-treat" data-id="${a.id}">View notes</button>` : `<span class="mono" style="color:var(--muted)">no notes</span>`);
  return `<tr><td style="font-weight:600">${esc(a.patientName)}</td><td>${esc(a.department)}</td><td class="mono">${a.date}</td><td class="mono">${a.time}</td><td>${badge(a.status)}</td><td>${action}</td></tr>`;
 }).join("");
 return `<div class="page-head"><h1>My appointments</h1></div>
 <div class="chip-row">${tabs}</div>
 <div class="card">${shown.length?`<table><thead><tr><th>Patient</th><th>Department</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table>`:`<div class="empty">Nothing here.</div>`}</div>`;
}

function doctorTreat(){
 const a=appts.find(x=>x.id===S.treatingId);
 if(!a) return `<div class="page-head"><h1>Treatment record</h1></div><div class="card empty">Appointment not found.</div>`;
 const t=a.treatment||{};
 const readOnly=a.status==="Completed";
 return `<div class="page-head"><div><h1>Treatment record</h1><p>${esc(a.patientName)} · ${esc(a.department)} · ${a.date} at ${a.time}</p></div>${syncTag()}</div>
 <div class="card pad" style="max-width:520px;margin-bottom:16px">
  <div class="mono" style="font-size:11px;color:var(--ink-soft);margin-bottom:6px">Patient's reason for visit</div>
  <div style="font-size:13.5px">${esc(a.reason)}</div>
 </div>
 <form class="card pad" style="max-width:520px" data-form="treat" data-id="${a.id}">
  <div class="grid2">
   <div class="field"><label>Blood pressure</label><input name="bp" placeholder="e.g. 120/80" value="${esc(t.bp)}" ${readOnly?'disabled':''}></div>
   <div class="field"><label>Temperature (°C)</label><input name="temp" value="${esc(t.temp)}" ${readOnly?'disabled':''}></div>
   <div class="field"><label>Pulse (bpm)</label><input name="pulse" value="${esc(t.pulse)}" ${readOnly?'disabled':''}></div>
   <div class="field"><label>Weight (kg)</label><input name="weight" value="${esc(t.weight)}" ${readOnly?'disabled':''}></div>
  </div>
  <div class="field"><label>Diagnosis</label><textarea name="diagnosis" rows="2" ${readOnly?'disabled':''}>${esc(t.diagnosis)}</textarea></div>
  <div class="field"><label>Treatment / prescription</label><textarea name="treatmentPlan" rows="2" ${readOnly?'disabled':''}>${esc(t.treatmentPlan)}</textarea></div>
  <div class="field"><label>Doctor's notes</label><textarea name="notes" rows="2" ${readOnly?'disabled':''}>${esc(t.notes)}</textarea></div>
  <div class="field"><label>Follow-up date (optional)</label><input type="date" name="followUp" value="${esc(t.followUp)}" ${readOnly?'disabled':''}></div>
  ${readOnly
    ? `<button class="btn ghost" type="button" data-act="nav" data-view="appointments">Back to appointments</button>`
    : `<button class="btn" type="submit" ${S.busy?'disabled':''}>${S.busy?'Saving…':'Save & complete visit'}</button>
       <button class="btn ghost" type="button" data-act="nav" data-view="appointments" style="margin-left:8px">Cancel</button>`}
 </form>`;
}
