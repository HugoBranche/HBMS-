/* ---------------- events ---------------- */
document.addEventListener("submit",async e=>{
 const form=e.target;
 if(form.matches('[data-form="signup"]')){
  e.preventDefault();
  const f=new FormData(form); const email=f.get("email").trim().toLowerCase();
  S.busy=true; S.formErr=""; render();
  const existing=await dbGetPatients();
  if(existing.some(p=>p.email.toLowerCase()===email)){ S.busy=false; S.formErr="An account with that email already exists."; render(); return; }
  const data={name:f.get("name").trim(),email,phone:f.get("phone").trim(),dob:f.get("dob"),password:f.get("password"),createdAt:Date.now()};
  const id=await dbAddPatient(data);
  S.patient={id,...data}; S.loggedIn=true; S.role="patient"; S.view="dashboard"; S.busy=false; S.authMode="signin";
  await refresh();
 }
 else if(form.matches('[data-form="signin"]')){
  e.preventDefault();
  const f=new FormData(form); const email=f.get("email").trim().toLowerCase(); const pw=f.get("password");
  S.busy=true; S.formErr=""; render();
  const all=await dbGetPatients();
  const match=all.find(p=>p.email.toLowerCase()===email);
  if(!match){ S.busy=false; S.formErr="No account found with that email."; render(); return; }
  if(match.password!==pw){ S.busy=false; S.formErr="Incorrect password."; render(); return; }
  S.patient=match; S.loggedIn=true; S.role="patient"; S.view="dashboard"; S.busy=false;
  await refresh();
 }
 else if(form.matches('[data-form="treat"]')){
  e.preventDefault();
  const f=new FormData(form); const id=form.dataset.id;
  S.busy=true; render();
  const treatment={bp:f.get("bp"),temp:f.get("temp"),pulse:f.get("pulse"),weight:f.get("weight"),diagnosis:f.get("diagnosis"),treatmentPlan:f.get("treatmentPlan"),notes:f.get("notes"),followUp:f.get("followUp"),recordedAt:Date.now()};
  await dbUpdateAppt(id,{status:"Completed",treatment});
  S.busy=false; S.docTab="Completed"; S.view="appointments"; await refresh();
 }
 else if(form.matches('[data-form="request"]')){
  e.preventDefault();
  const f=new FormData(form); S.busy=true; render();
  await dbAddAppt({patientId:S.patient.id,patientName:S.patient.name,doctor:"",department:f.get("department"),date:f.get("date"),time:f.get("time"),status:"Pending",reason:f.get("reason"),declineReason:"",createdAt:Date.now()});
  S.submitted=true; S.busy=false; await refresh();
 }
});

document.addEventListener("click",async e=>{
 const b=e.target.closest("[data-act]"); if(!b) return;
 const act=b.dataset.act;
 if(act==="login-tab"){S.loginRole=b.dataset.role; S.formErr=""; render();}
 else if(act==="auth-mode"){S.authMode=b.dataset.m; S.formErr=""; render();}
 else if(act==="do-login"){
  if(S.loginRole==="receptionist"){ S.staffName=document.getElementById("staffName").value.trim()||"Anna Rivera"; S.role="receptionist"; }
  else if(S.loginRole==="doctor"){ S.doctorName=document.getElementById("docSelect").value; S.role="doctor"; }
  S.loggedIn=true; S.view="dashboard"; await refresh();
 }
 else if(act==="logout"){S=Object.assign({},S,{loggedIn:false,view:"dashboard",selectedReq:null,flash:null,patient:null,submitted:false}); render();}
 else if(act==="nav"){S.view=b.dataset.view; S.submitted=false; S.selectedReq=null; render();}
 else if(act==="req-again"){S.submitted=false; render();}
 else if(act==="pick-req"){S.selectedReq=b.dataset.id; S.assignDoc=""; S.assignDate=""; S.assignTime=""; render();}
 else if(act==="confirm-assign"){
  const sel=appts.find(a=>a.id===S.selectedReq);
  if(sel && S.assignDoc){
   S.busy=true; render();
   const docName=S.assignDoc;
   await dbUpdateAppt(sel.id,{doctor:docName,date:S.assignDate||sel.date,time:S.assignTime||sel.time,status:"Assigned"});
   S.flash=`Patient successfully assigned to ${docName}.`; S.selectedReq=null; S.assignDoc=""; S.busy=false;
   await refresh();
  }
 }
 else if(act==="cancel-appt"){
  S.busy=true; render();
  await dbUpdateAppt(b.dataset.id,{status:"Cancelled"}); S.busy=false; await refresh();
 }
 else if(act==="clear-flash"){S.flash=null; render();}
 else if(act==="set-filter"){S.reqFilter=b.dataset.f; render();}
 else if(act==="doc-tab"){S.docTab=b.dataset.t; render();}
 else if(act==="open-treat"){S.treatingId=b.dataset.id; S.view="treat"; render();}
 else if(act==="accept"){
  S.busy=true; render();
  await dbUpdateAppt(b.dataset.id,{status:"Accepted"});
  S.flash={msg:`Appointment accepted.`}; S.busy=false; await refresh();
 }
 else if(act==="start-decline"){S.declineTarget=b.dataset.id; render();}
 else if(act==="cancel-decline"){S.declineTarget=null; render();}
 else if(act==="confirm-decline"){
  const reason=(document.getElementById("declineReason")||{}).value||"";
  S.busy=true; render();
  await dbUpdateAppt(b.dataset.id,{status:"Declined",declineReason:reason});
  S.flash={msg:`Appointment declined.`,bad:true}; S.declineTarget=null; S.busy=false; await refresh();
 }
});

document.addEventListener("change",e=>{
 const bind=e.target.dataset.bind;
 if(bind==="assignDoc"){S.assignDoc=e.target.value; render();}
 else if(bind==="assignDate"){S.assignDate=e.target.value;}
 else if(bind==="assignTime"){S.assignTime=e.target.value;}
});
