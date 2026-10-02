/* ---------------- static reference data ---------------- */
const DOCTORS=[
 {name:"Dr. Sarah Mitchell",dept:"Cardiology",available:true},
 {name:"Dr. James Patel",dept:"General Medicine",available:true},
 {name:"Dr. Emily Chen",dept:"Orthopedics",available:false},
 {name:"Dr. Robert Garcia",dept:"Dermatology",available:true},
 {name:"Dr. Aisha Okonkwo",dept:"Neurology",available:true},
];
const DEPARTMENTS=["Cardiology","General Medicine","Orthopedics","Dermatology","Neurology","Pediatrics","Gynecology"];
const TIMES=["08:00 AM","09:00 AM","10:00 AM","11:00 AM","01:00 PM","02:00 PM","03:00 PM","04:00 PM"];
const ROLE_LABEL={patient:"Patient",receptionist:"Front desk",doctor:"Clinician"};
const ROLE_LEDE={
 patient:"Create a patient account or sign back in to request and track appointments.",
 receptionist:"Review requests, see patient details, and assign an available doctor.",
 doctor:"Sign in as one of the clinicians to see and manage your own requests."
};
const NAV={
 patient:[["dashboard","Dashboard"],["request","Request appointment"],["appointments","My appointments"]],
 receptionist:[["dashboard","Dashboard"],["assign","Appointment requests"],["appointments","All appointments"],["patients","Patient records"]],
 doctor:[["dashboard","Dashboard"],["requests","Appointment requests"],["appointments","My appointments"]],
};
