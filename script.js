const $=id=>document.getElementById(id);
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let patients=load("cp_patients_v2"), visitors=load("cp_visitors_v2"), transactions=load("cp_transactions_v2"), complaints=load("cp_complaints_v2");
let currentUser=null, patientPage=1, facilityPage=1, facilityDepartment="All", pageSize=5, facilitySize=6;

if(!patients.length){
  patients=[
    {pid:"P100001",first:"Ravi",last:"Kumar",email:"ravi.kumar@example.com",mobile:"9876543210",gender:"Male",city:"Anantapur",doctor:"Dr. Suresh",doctorId:"D001",department:"General Medicine",address:"Anantapur",contact:"9876543210",status:"Active",created:new Date().toLocaleString("en-IN")},
    {pid:"P100002",first:"Lakshmi",last:"Devi",email:"lakshmi.devi@example.com",mobile:"9123456780",gender:"Female",city:"Bengaluru",doctor:"Dr. Priya",doctorId:"D101",department:"Cardiology",address:"Bengaluru",contact:"9123456780",status:"Active",created:new Date().toLocaleString("en-IN")},
    {pid:"P100003",first:"Arjun",last:"Reddy",email:"arjun.reddy@example.com",mobile:"9988776655",gender:"Male",city:"Hyderabad",doctor:"Dr. Mahesh",doctorId:"D201",department:"Orthopedics",address:"Hyderabad",contact:"9988776655",status:"Discharged",created:new Date().toLocaleString("en-IN")}
  ]; save("cp_patients_v2",patients);
}
patients.forEach(p=>{
  if(!p.doctorId){
    const list=doctorsByDepartment[p.department]||[];
    const match=list.find(d=>d.name===p.doctor);
    if(match)p.doctorId=match.id;
    else if(list[0]){p.doctorId=list[0].id;p.doctor=list[0].name;}
  }
  if(!p.status)p.status="Active";
});
save("cp_patients_v2",patients);

const facilities=[
 {d:"Emergency",i:"❤",n:"24/7 Emergency Care",p:"Round-the-clock emergency consultation, triage and first-aid support."},
 {d:"Emergency",i:"◉",n:"Ambulance Service",p:"Emergency transportation and rapid response support."},
 {d:"Emergency",i:"▣",n:"Trauma Support",p:"Immediate stabilization and urgent medical assistance."},
 {d:"Cardiology",i:"♥",n:"Cardiology Consultation",p:"Specialist consultation and cardiac monitoring facilities."},
 {d:"Cardiology",i:"⌁",n:"ECG & Monitoring",p:"Diagnostic ECG and monitored cardiac assessment."},
 {d:"Cardiology",i:"◉",n:"Cardiac Follow-up",p:"Scheduled review and follow-up support for patients."},
 {d:"Orthopedics",i:"♙",n:"Orthopedic Clinic",p:"Assessment and treatment for bone and joint conditions."},
 {d:"Orthopedics",i:"▣",n:"Physiotherapy",p:"Rehabilitation and guided physiotherapy services."},
 {d:"Orthopedics",i:"⌁",n:"X-Ray Support",p:"Diagnostic imaging support for orthopedic evaluation."},
 {d:"Pediatrics",i:"●",n:"Child Consultation",p:"Pediatric consultation and routine health support."},
 {d:"Pediatrics",i:"♥",n:"Vaccination Support",p:"Child vaccination and preventive healthcare support."},
 {d:"Pediatrics",i:"◉",n:"Child Observation",p:"Observation and monitoring for pediatric patients."},
 {d:"General Medicine",i:"♙",n:"General Consultation",p:"Routine diagnosis, consultation and treatment."},
 {d:"General Medicine",i:"⌁",n:"Laboratory",p:"Basic laboratory and diagnostic testing support."},
 {d:"General Medicine",i:"▣",n:"Inpatient Care",p:"Monitored inpatient rooms and nursing assistance."},
 {d:"General Medicine",i:"✚",n:"Pharmacy",p:"In-house medicine dispensing for prescribed treatments."}
];
const doctorsByDepartment = {
  "General Medicine": [
    {id:"D001", name:"Dr. Suresh Kumar"},
    {id:"D002", name:"Dr. Anitha Rao"},
    {id:"D003", name:"Dr. Naveen Reddy"}
  ],
  "Cardiology": [
    {id:"D101", name:"Dr. Priya Sharma"},
    {id:"D102", name:"Dr. Rajesh Varma"},
    {id:"D103", name:"Dr. Kiran Rao"}
  ],
  "Orthopedics": [
    {id:"D201", name:"Dr. Mahesh Reddy"},
    {id:"D202", name:"Dr. Vikram Singh"},
    {id:"D203", name:"Dr. Swathi Rao"}
  ],
  "Pediatrics": [
    {id:"D301", name:"Dr. Kavya Reddy"},
    {id:"D302", name:"Dr. Arun Kumar"},
    {id:"D303", name:"Dr. Meena Sharma"}
  ],
  "Emergency": [
    {id:"D401", name:"Dr. Ravi Teja"},
    {id:"D402", name:"Dr. Neha Reddy"},
    {id:"D403", name:"Dr. Ajay Kumar"}
  ],
  "Diagnostics": [
    {id:"D501", name:"Dr. Deepak Rao"},
    {id:"D502", name:"Dr. Lakshmi Prasad"},
    {id:"D503", name:"Dr. Sunil Varma"}
  ]
};

function validMobile(mobile){
  // Indian 10-digit mobile: starts with 6/7/8/9 and cannot be a repeated single digit.
  mobile=String(mobile||"").trim();
  return /^[6-9][0-9]{9}$/.test(mobile) && !/^([0-9])\1{9}$/.test(mobile);
}

function populateDoctorSelects(department, idSelectId, nameSelectId, selectedId=""){
  const idSelect=$(idSelectId), nameSelect=$(nameSelectId);
  if(!idSelect || !nameSelect) return;
  const doctors=doctorsByDepartment[department] || [];
  idSelect.innerHTML=doctors.map(d=>`<option value="${d.id}" ${d.id===selectedId?"selected":""}>${d.id}</option>`).join("");
  const selected=doctors.find(d=>d.id===selectedId) || doctors[0];
  nameSelect.innerHTML=doctors.map(d=>`<option value="${d.id}" ${selected && d.id===selected.id?"selected":""}>${d.name}</option>`).join("");
}

function syncDoctorName(idSelectId, nameSelectId){
  const idSelect=$(idSelectId), nameSelect=$(nameSelectId);
  if(!idSelect || !nameSelect) return;
  nameSelect.value=idSelect.value;
}

function syncDoctorId(idSelectId, nameSelectId){
  const idSelect=$(idSelectId), nameSelect=$(nameSelectId);
  if(!idSelect || !nameSelect) return;
  idSelect.value=nameSelect.value;
}

function toast(msg,type="normal"){const t=$("toast");t.textContent=msg;t.className="toast show";if(type==="error")t.style.background="#9b3131";else t.style.background="#173042";setTimeout(()=>t.className="toast",2600)}
function initials(n){return (n||"A").split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function validPassword(p){return p.length>=10 && /[A-Z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p)}
function validUser(u){return /^[A-Za-z0-9_]{8,}$/.test(u)}
function fullName(p){return `${p.first} ${p.last}`}

document.querySelectorAll(".auth-tab").forEach(b=>b.addEventListener("click",()=>{
 document.querySelectorAll(".auth-tab").forEach(x=>x.classList.toggle("active",x===b));
 document.querySelectorAll(".auth-form").forEach(x=>x.classList.toggle("active",x.id===b.dataset.auth));
}));

$("adminLogin").addEventListener("submit",e=>{
 e.preventDefault();
 const ADMIN_USER="carepoint@admin";
 const ADMIN_PASS="Admin@123";
 if($("adminUser").value.trim()===ADMIN_USER && $("adminPass").value===ADMIN_PASS) login({type:"admin",name:"Administrator",role:"Admin"});
 else toast("Invalid admin user ID or password.","error");
});

$("visitorRegister").addEventListener("submit",e=>{
 e.preventDefault();
 const u=$("regUser").value.trim(), pass=$("regPass").value, confirmPass=$("regConfirm").value, email=$("regEmail").value.trim().toLowerCase(), mobile=$("regMobile").value.trim();
 if(!validUser(u)) return toast("User ID must contain at least 8 alphanumeric characters.","error");
 if(!validPassword(pass)) return toast("Password must be 10+ chars with uppercase, number and special character.","error");
 if(pass!==confirmPass) return toast("Password and Confirm Password do not match.","error");
 if(!validMobile(mobile)) return toast("Mobile number must be 10 digits, start with 6/7/8/9, and cannot contain all identical digits.","error");
 if(visitors.some(v=>v.user.toLowerCase()===u.toLowerCase())) return toast("User ID already exists.","error");
 if(visitors.some(v=>v.email===email)) return toast("Email is already registered.","error");
 const gender=document.querySelector('input[name="regGender"]:checked')?.value;
 visitors.push({user:u,first:$("regFirst").value.trim(),last:$("regLast").value.trim(),email,mobile,city:$("regCity").value,gender,password:pass});
 save("cp_visitors_v2",visitors); $("visitorRegister").reset(); document.querySelector('[data-auth="visitorLogin"]').click(); $("visitorUser").value=u;
 toast("Registration successful. Please login.");
});

$("visitorLogin").addEventListener("submit",e=>{
 e.preventDefault(); const u=$("visitorUser").value.trim(),p=$("visitorPass").value;
 if(!validUser(u)) return toast("User ID must be at least 8 characters.","error");
 const v=visitors.find(x=>x.user.toLowerCase()===u.toLowerCase()&&x.password===p);
 if(v) login({type:"visitor",name:`${v.first} ${v.last}`,role:"Visitor",user:v.user,email:v.email});
 else toast("Invalid user ID or password.","error");
});

function login(u){
 currentUser=u;$("authScreen").classList.add("hidden");$("app").classList.remove("hidden");
 $("sideName").textContent=u.name;$("sideRole").textContent=u.role;$("sideAvatar").textContent=initials(u.name);$("topAvatar").textContent=initials(u.name);
 $("adminNav").classList.toggle("hidden",u.type!=="admin");$("visitorNav").classList.toggle("hidden",u.type!=="visitor");
 document.querySelectorAll(".visitor-only").forEach(x=>x.classList.toggle("hidden",u.type!=="visitor"));
 $("visitorWelcome").textContent=`Welcome, ${u.name}`;
 showPage(u.type==="admin"?"dashboard":"visitorHome");renderAll();toast(`Welcome, ${u.name}`);
}
$("logoutBtn").addEventListener("click",()=>{
 if(confirm("Exit the application and logout?")){currentUser=null;$("app").classList.add("hidden");$("authScreen").classList.remove("hidden");document.querySelector('[data-auth="adminLogin"]').click();$("adminLogin").reset();toast("Logged out successfully")}
});
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
$("menuBtn").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("dateText").textContent=new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});

const titles={dashboard:"Dashboard",patients:"View Patients",search:"Search by PID",update:"Update by Email",delete:"Delete by Mobile",transactions:"Transactions",hospital:"Hospital Facilities",complaints:"Complaints",visitorHome:"Visitor Home"};
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 $("pageTitle").textContent=titles[id]||"Hospital";
 $("sidebar").classList.remove("open");
 if(id==="patients")renderPatients(); if(id==="transactions")renderTransactions(); if(id==="complaints")renderComplaints(); if(id==="hospital")renderFacilities(); if(id==="visitorHome")renderVisitorHome();
}
function renderAll(){renderDashboard();renderPatients();renderTransactions();renderComplaints();renderFacilities();renderVisitorHome()}

function renderDashboard(){
 $("statTotal").textContent=patients.length;$("statActive").textContent=patients.filter(p=>p.status==="Active").length;$("statDischarged").textContent=patients.filter(p=>p.status==="Discharged").length;$("statComplaints").textContent=complaints.length;
 const rows=patients.slice(-5).reverse();
 $("recentTable").innerHTML=rows.length?table(["PID","Patient","Email","Status"],rows.map(p=>[p.pid,fullName(p),p.email,`<span class="pill ${p.status.toLowerCase()}">${p.status}</span>`])):"<div class='empty'>No patient records.</div>";
}
function table(head,rows){return `<div style="overflow:auto"><table class="data-table"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}

$("viewSearch").addEventListener("input",()=>{patientPage=1;renderPatients()});$("viewStatus").addEventListener("change",()=>{patientPage=1;renderPatients()});
function renderPatients(){
 const q=$("viewSearch").value.trim().toLowerCase(), st=$("viewStatus").value;
 const list=patients.filter(p=>(!q||`${p.pid} ${fullName(p)} ${p.email} ${p.mobile}`.toLowerCase().includes(q))&&(!st||p.status===st));
 const pages=Math.max(1,Math.ceil(list.length/pageSize));patientPage=Math.min(patientPage,pages);const start=(patientPage-1)*pageSize,items=list.slice(start,start+pageSize);
 $("patientTable").innerHTML=items.length?table(["PID","Patient","Email","Mobile","Gender","City","Doctor","Department","Status","Action"],items.map(p=>[p.pid,fullName(p),p.email,p.mobile,p.gender,p.city,p.doctor,p.department,`<span class="pill ${p.status.toLowerCase()}">${p.status}</span>`,`<button class="action" onclick="quickEdit('${p.pid}')">Edit</button>`])):"<div class='empty'>No patient records match your search.</div>";
 pagination("patientPagination",patientPage,pages,p=>{patientPage=p;renderPatients()});
}
function pagination(id,current,total,fn){
 let h=`<button ${current===1?"disabled":""} onclick="(${fn.toString()})(${current-1})">‹</button>`;
 for(let i=1;i<=total;i++)h+=`<button class="${i===current?"active":""}" onclick="(${fn.toString()})(${i})">${i}</button>`;
 h+=`<button ${current===total?"disabled":""} onclick="(${fn.toString()})(${current+1})">›</button>`;$(`${id}`).innerHTML=h;
}
function searchByPID(){
 const pid=$("pidSearch").value.trim().toUpperCase(),p=patients.find(x=>x.pid===pid);
 if(!pid)return $("pidResult").innerHTML="<div class='empty'>Please enter a PID.</div>";
 if(!p)return $("pidResult").innerHTML="<div class='empty'>No patient found for PID <b>"+pid+"</b>.</div>";
 $("pidResult").innerHTML=detailCard(p);
}
function detailCard(p){return `<div class="result-card"><h3>${fullName(p)} <span class="pill ${p.status.toLowerCase()}">${p.status}</span></h3><div class="detail-grid">${[["PID",p.pid],["First Name",p.first],["Last Name",p.last],["Email",p.email],["Mobile",p.mobile],["Gender",p.gender],["City",p.city],["Doctor",p.doctor],["Department",p.department],["Address",p.address],["Contact",p.contact],["Registered",p.created]].map(x=>`<div class="detail"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("")}</div></div>`}

function loadUpdatePatient(){
 const email=$("emailSearch").value.trim().toLowerCase(),p=patients.find(x=>x.email.toLowerCase()===email);
 if(!p){$("updateForm").classList.add("hidden");$("updateMessage").innerHTML="<div class='empty'>No patient found for this email. Please check the email and try again.</div>";return}
 $("updateMessage").innerHTML="";$("updateForm").classList.remove("hidden");
 $("updatePid").value=p.pid;$("updatePidText").textContent=p.pid;$("updateFirst").value=p.first;$("updateLast").value=p.last;$("updateEmail").value=p.email;$("updateMobile").value=p.mobile;$("updateCity").value=p.city;$("updateDept").value=p.department;
 populateDoctorSelects(p.department,"updateDoctorId","updateDoctor",p.doctorId||"");
 $("updateAddress").value=p.address;$("updateContact").value=p.contact;$("updateStatus").value=p.status||"Active";
}
$("updateForm").addEventListener("submit",e=>{
 e.preventDefault();const pid=$("updatePid").value,p=patients.find(x=>x.pid===pid);if(!p)return;
 const email=$("updateEmail").value.trim().toLowerCase();
 const newMobile=$("updateMobile").value.trim();
 const newContact=$("updateContact").value.trim();
 if(!validMobile(newMobile))return toast("Mobile number must be 10 digits, start with 6/7/8/9, and cannot contain all identical digits.","error");
 if(!validMobile(newContact))return toast("Contact number must be 10 digits, start with 6/7/8/9, and cannot contain all identical digits.","error");
 if(patients.some(x=>x.pid!==pid&&x.email.toLowerCase()===email))return toast("Another patient already uses this email.","error");
 if(patients.some(x=>x.pid!==pid&&x.mobile===newMobile))return toast("Another patient already uses this mobile number.","error");
 const selectedDoctor=doctorsByDepartment[$("updateDept").value]?.find(d=>d.id===$("updateDoctorId").value);
 if(!selectedDoctor)return toast("Please select a valid doctor for the selected department.","error");
 Object.assign(p,{first:$("updateFirst").value.trim(),last:$("updateLast").value.trim(),email,mobile:newMobile,doctorId:selectedDoctor.id,doctor:selectedDoctor.name,city:$("updateCity").value,department:$("updateDept").value,address:$("updateAddress").value.trim(),contact:newContact,status:$("updateStatus").value});
 save("cp_patients_v2",patients);$("updatePidText").textContent=p.pid;toast("Patient details updated successfully.");renderAll();
});

function deleteByMobile(){
 const mobile=$("deleteMobile").value.trim(),p=patients.find(x=>x.mobile===mobile||x.contact===mobile);
 if(!validMobile(mobile))return toast("Enter a valid mobile number starting with 6/7/8/9; repeated digits are not allowed.","error");
 if(!p){$("deleteResult").innerHTML="<div class='empty'>No patient found with this mobile number.</div>";return}
 $("deleteResult").innerHTML=detailCard(p)+`<div style="margin-top:10px;text-align:right"><button class="btn danger" onclick="confirmDelete('${p.pid}')">Confirm Delete Patient</button></div>`;
}
function confirmDelete(pid){
 const p=patients.find(x=>x.pid===pid);if(!p)return;
 if(confirm(`Delete ${fullName(p)} (${p.pid})? This action cannot be undone.`)){patients=patients.filter(x=>x.pid!==pid);save("cp_patients_v2",patients);$("deleteResult").innerHTML="<div class='empty'>Patient deleted successfully.</div>";renderAll();toast("Patient deleted successfully.");}
}
function quickEdit(pid){const p=patients.find(x=>x.pid===pid);if(p){showPage("update");$("emailSearch").value=p.email;loadUpdatePatient()}}

function nextPID(){let n=100000;patients.forEach(p=>{const x=parseInt(p.pid.replace(/\D/g,""));if(x>n)n=x});return "P"+(n+1)}
$("patientForm").addEventListener("submit",e=>{
 e.preventDefault();
 const email=$("pEmail").value.trim().toLowerCase(),mobile=$("pMobile").value.trim(),gender=document.querySelector('input[name="pGender"]:checked')?.value;
 if(!validMobile(mobile))return toast("Mobile number must be 10 digits, start with 6/7/8/9, and cannot contain all identical digits.","error");
 if(!validMobile($("pContact").value.trim()))return toast("Contact number must be 10 digits, start with 6/7/8/9, and cannot contain all identical digits.","error");
 if(patients.some(p=>p.email.toLowerCase()===email))return toast("Email already exists.","error");
 if(patients.some(p=>p.mobile===mobile))return toast("Mobile number already exists.","error");
 const selectedDoctor=doctorsByDepartment[$("pDept").value]?.find(d=>d.id===$("pDoctorId").value);
 if(!selectedDoctor)return toast("Please select a valid doctor for the selected department.","error");
 const p={pid:nextPID(),first:$("pFirst").value.trim(),last:$("pLast").value.trim(),email,mobile,gender,city:$("pCity").value,doctorId:selectedDoctor.id,doctor:selectedDoctor.name,department:$("pDept").value,address:$("pAddress").value.trim(),contact:$("pContact").value.trim(),status:"Active",created:new Date().toLocaleString("en-IN")};
 patients.push(p);save("cp_patients_v2",patients);closePatientModal();$("patientForm").reset();renderAll();toast(`Patient registered successfully. PID: ${p.pid}`);
});
function openPatientModal(){$("patientModal").classList.add("show")}
function closePatientModal(){$("patientModal").classList.remove("show")}

$("pDept").addEventListener("change",()=>populateDoctorSelects($("pDept").value,"pDoctorId","pDoctor"));
$("pDoctorId").addEventListener("change",()=>syncDoctorName("pDoctorId","pDoctor"));
$("pDoctor").addEventListener("change",()=>syncDoctorId("pDoctorId","pDoctor"));

$("updateDept").addEventListener("change",()=>{
  populateDoctorSelects($("updateDept").value,"updateDoctorId","updateDoctor");
});
$("updateDoctorId").addEventListener("change",()=>syncDoctorName("updateDoctorId","updateDoctor"));
$("updateDoctor").addEventListener("change",()=>syncDoctorId("updateDoctorId","updateDoctor"));

populateDoctorSelects($("pDept").value,"pDoctorId","pDoctor");
populateDoctorSelects($("updateDept").value,"updateDoctorId","updateDoctor");

function renderTransactions(){
 $("txnPatient").innerHTML=patients.map(p=>`<option value="${p.pid}">${p.pid} — ${fullName(p)}</option>`).join("")||"<option>No patients available</option>";
 $("transactionTable").innerHTML=transactions.length?table(["ID","PID","Patient","Type","Department","Remarks","Date"],transactions.slice().reverse().map(t=>[t.id,t.pid,t.patient,t.type,t.department,t.remarks||"—",t.date])):"<div class='empty'>No transactions recorded.</div>";
}
$("transactionForm").addEventListener("submit",e=>{
 e.preventDefault();const pid=$("txnPatient").value,p=patients.find(x=>x.pid===pid);if(!p)return;
 const type=$("txnType").value;if(type==="Admission")p.status="Active";if(type==="Discharge")p.status="Discharged";
 transactions.push({id:"T"+String(Date.now()).slice(-7),pid,patient:fullName(p),type,department:$("txnDept").value,remarks:$("txnRemarks").value.trim(),date:new Date().toLocaleString("en-IN")});
 save("cp_patients_v2",patients);save("cp_transactions_v2",transactions);$("transactionForm").reset();renderAll();toast("Transaction processed successfully.");
});
function clearTransactions(){if(transactions.length&&confirm("Clear transaction history?")){transactions=[];save("cp_transactions_v2",transactions);renderTransactions();toast("Transaction history cleared.")}}

document.querySelectorAll(".facility-tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".facility-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");facilityDepartment=b.dataset.dept;facilityPage=1;renderFacilities()}));
function renderFacilities(){
 const list=facilityDepartment==="All"?facilities:facilities.filter(x=>x.d===facilityDepartment),pages=Math.max(1,Math.ceil(list.length/facilitySize));facilityPage=Math.min(facilityPage,pages);
 const items=list.slice((facilityPage-1)*facilitySize,facilityPage*facilitySize);
 $("facilityGrid").innerHTML=items.map(x=>`<div class="facility-card"><div class="facility-icon">${x.i}</div><h3>${x.n}</h3><p>${x.p}</p><small>${x.d}</small></div>`).join("");
 pagination("facilityPagination",facilityPage,pages,p=>{facilityPage=p;renderFacilities()});
}

$("complaintForm").addEventListener("submit",e=>{
 e.preventDefault();if(!currentUser||currentUser.type!=="visitor")return toast("Visitor login is required to register a complaint.","error");
 const c={id:"C"+String(Date.now()).slice(-7),visitor:currentUser.name,email:currentUser.email,subject:$("complaintSubject").value.trim(),category:$("complaintCategory").value,department:$("complaintDept").value,message:$("complaintMessage").value.trim(),status:"Open",date:new Date().toLocaleString("en-IN")};
 if(!c.subject||!c.message)return toast("Please complete all complaint fields.","error");
 complaints.push(c);save("cp_complaints_v2",complaints);$("complaintForm").reset();renderComplaints();renderVisitorHome();toast("Complaint registered successfully.");
});
function renderComplaints(){
 const admin=currentUser?.type==="admin";$("complaintFormPanel").classList.toggle("hidden",admin);$("complaintHeading").textContent=admin?"All Complaint Records":"My Complaint Records";
 const list=admin?complaints:complaints.filter(c=>c.email===currentUser?.email);
 $("complaintTable").innerHTML=list.length?table(["ID","Subject","Category","Department","Status","Date",...(admin?["Visitor","Action"]:[])],list.slice().reverse().map(c=>[c.id,`${c.subject}<br><small>${c.message.slice(0,45)}${c.message.length>45?"…":""}</small>`,c.category,c.department,`<span class="pill ${c.status.toLowerCase()}">${c.status}</span>`,c.date,...(admin?[c.visitor,`<button class="action" onclick="toggleComplaint('${c.id}')">${c.status==="Resolved"?"Reopen":"Resolve"}</button> <button class="action delete" onclick="removeComplaint('${c.id}')">Delete</button>`]:[]) ])):"<div class='empty'>No complaints found.</div>";
}
function toggleComplaint(id){const c=complaints.find(x=>x.id===id);if(c){c.status=c.status==="Resolved"?"Open":"Resolved";save("cp_complaints_v2",complaints);renderComplaints();renderDashboard();toast("Complaint status updated.")}}
function removeComplaint(id){if(confirm("Delete this complaint?")){complaints=complaints.filter(x=>x.id!==id);save("cp_complaints_v2",complaints);renderComplaints();renderDashboard();toast("Complaint deleted.")}}
function renderVisitorHome(){if(currentUser?.type==="visitor")$("myComplaintCount").textContent=complaints.filter(c=>c.email===currentUser.email).length}

window.addEventListener("click",e=>{if(e.target===$("patientModal"))closePatientModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePatientModal()});
