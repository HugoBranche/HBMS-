/* ---------------- app state ---------------- */
let S={loggedIn:false,role:"patient",view:"dashboard",loginRole:"patient",authMode:"signin",
 patient:null,doctorName:"",staffName:"Anna Rivera",
 selectedReq:null,assignDoc:"",assignDate:"",assignTime:"",declineTarget:null,reqFilter:"All",docTab:"Upcoming",treatingId:null,
 flash:null,formErr:"",busy:false};

/* role-scoped views the current screen renders from — always re-derived in refresh(), never read/written directly */
let patients=[];   // {id,name,email,phone,dob,password,createdAt}
let appts=[];       // {id,patientId,patientName,department,doctor,date,time,reason,status,declineReason,createdAt,treatment}

/* refresh whichever slice of data the current role needs, then re-render. Always filters from the
   full store so a doctor only ever sees appointments assigned to them, db or no db. */
async function refresh(){
 const all=await dbGetAppts();
 if(S.role==="patient" && S.patient){ appts=all.filter(a=>a.patientId===S.patient.id); }
 else if(S.role==="receptionist"){ appts=all; patients=await dbGetPatients(); }
 else if(S.role==="doctor" && S.doctorName){ appts=all.filter(a=>a.doctor===S.doctorName); }
 render();
}
