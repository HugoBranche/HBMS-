/* ---------------- storage layer ---------------- */
let db=null, dbReady=false;
async function initDb(){
 try{ db = await claude.use("db"); }catch(e){ db=null; }
 dbReady = !!db;
}
function genId(){ return (crypto.randomUUID ? crypto.randomUUID() : 'id_'+Date.now()+'_'+Math.random().toString(36).slice(2)); }

/* full backing store used only when db is unavailable (the actual db is the store otherwise) */
let _localPatients=[];
let _localAppts=[];

async function dbGetPatients(){ if(!db) return _localPatients; const s=await db.collection("patients").get(); return s.docs.map(d=>({id:d.id,...d.data()})); }
async function dbGetAppts(){ if(!db) return _localAppts; const s=await db.collection("appointments").get(); return s.docs.map(d=>({id:d.id,...d.data()})); }
async function dbAddPatient(p){ const id=genId(); if(db) await db.collection("patients").doc(id).set(p); else _localPatients.push({id,...p}); return id; }
async function dbAddAppt(a){ const id=genId(); if(db) await db.collection("appointments").doc(id).set(a); else _localAppts.push({id,...a}); return id; }
async function dbUpdateAppt(id,patch){ if(db) await db.collection("appointments").doc(id).update(patch); else { const a=_localAppts.find(x=>x.id===id); if(a) Object.assign(a,patch); } }

/* ---------------- seed (fallback only, used when db is unavailable) ---------------- */
function seedFallback(){
 _localPatients=[{id:"seed-1",name:"John Doe",email:"john@example.com",phone:"0712 345 678",dob:"1990-04-12",password:"demo",createdAt:Date.now()}];
 _localAppts=[
  {id:"a1",patientId:"seed-1",patientName:"John Doe",doctor:"Dr. Sarah Mitchell",department:"Cardiology",date:"2026-09-20",time:"10:00 AM",status:"Confirmed",reason:"Chest pain and shortness of breath"},
  {id:"a2",patientId:"seed-1",patientName:"John Doe",doctor:"",department:"Neurology",date:"2026-09-22",time:"11:00 AM",status:"Pending",reason:"Recurring migraines"},
 ];
}
