const roles = {
  student: {label:"Student", email:"student@uniconnect.edu", name:"Aarav Sharma", nav:[["Overview","⌂"],["My Courses","▤"],["Attendance","◷"],["Marks & Results","▧"],["Timetable","▦"],["Announcements","♧"],["My Profile","♙"]]},
  teacher: {label:"Teacher", email:"teacher@uniconnect.edu", name:"Dr. Meera Shah", nav:[["Overview","⌂"],["Student Records","♙"],["Attendance Sheet","◷"],["Marks Entry","▧"],["Course Results","▤"],["Announcements","♧"],["My Profile","♙"]]},
  admin: {label:"Administrator", email:"admin@uniconnect.edu", name:"Administrator", nav:[["Overview","⌂"],["Students","♙"],["Teachers","♧"],["Courses & Subjects","▤"],["Academic Reports","▧"],["Settings","⚙"]]}
};
let selectedRole = "student", currentUser = null, currentSection = "Overview";
const $ = id => document.getElementById(id);
const demoHint = {student:"student@uniconnect.edu · demo123",teacher:"teacher@uniconnect.edu · demo123",admin:"admin@uniconnect.edu · demo123"};
document.querySelectorAll(".role").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".role").forEach(b => b.classList.toggle("active", b === btn));
  selectedRole = btn.dataset.role;
  $("demoHint").textContent = demoHint[selectedRole];
  $("email").value = roles[selectedRole].email;
  $("loginMessage").textContent = "";
}));
$("fillDemo").addEventListener("click", () => {$("email").value=roles[selectedRole].email;$("password").value="demo123";});
$("togglePassword").addEventListener("click", () => {
  const input=$("password"); input.type=input.type==="password"?"text":"password";
  $("togglePassword").textContent=input.type==="password"?"Show":"Hide";
});
$("loginForm").addEventListener("submit", async e => {
  e.preventDefault(); $("loginMessage").textContent="Signing in…";
  const body={role:selectedRole,email:$("email").value.trim(),password:$("password").value};
  try {
    const res=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(!res.ok) throw new Error("The details didn't match. Try the demo credentials shown below.");
    currentUser=await res.json(); showApp();
  } catch(err) {
    // Allow the static UI to be previewed without starting the Java server.
    if(location.protocol==="file:" && body.email===roles[selectedRole].email && body.password==="demo123"){
      currentUser={role:selectedRole,name:roles[selectedRole].name,email:body.email}; showApp();
    } else $("loginMessage").textContent=err.message || "Could not connect to the server. Start the Java application and try again.";
  }
});
function showApp(){
  $("loginView").classList.add("hidden");$("appView").classList.remove("hidden");
  const role=roles[currentUser.role];$("roleLabel").textContent=role.label;$("userRole").textContent=role.label;
  $("userName").textContent=currentUser.name;$("avatar").textContent=currentUser.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  $("greeting").textContent=`Welcome back, ${currentUser.name.split(" ")[0]} 👋`;
  $("greetingSub").textContent=currentUser.role==="student"?"Here’s what’s happening with your studies today.":currentUser.role==="teacher"?"Here’s your teaching workspace at a glance.":"Here’s a summary of your university workspace.";
  const now=new Date();$("todayDate").textContent=now.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
  $("sideNav").innerHTML=role.nav.map(([name,icon],i)=>`<button class="nav-link ${i===0?"active":""}" data-section="${name}"><span>${icon}</span>${name}</button>`).join("");
  document.querySelectorAll(".nav-link").forEach(btn=>btn.addEventListener("click",()=>renderSection(btn.dataset.section)));
  renderSection("Overview");
}
async function renderSection(section){
  currentSection=section;$("pageHeading").textContent=section;
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.section===section));
  let data;
  try {const r=await fetch(`/api/dashboard/${currentUser.role}`);if(!r.ok)throw new Error();data=await r.json();}
  catch {data=fallbackData(currentUser.role);}
  let stats=data.stats, items=data.items, heading=currentUser.role==="student"?"Recent course updates":currentUser.role==="teacher"?"Teaching activity":"University management";
  if(section!=="Overview"){
    heading=section;
    const custom=sectionContent(currentUser.role,section);
    items=custom.items || items; stats=custom.stats || stats;
  }
  $("listHeading").textContent=heading;
  $("statsGrid").innerHTML=stats.map((s,i)=>`<article class="stat-card"><div class="stat-top">${s.label}<span class="stat-icon">${["◷","▧","▤","✦"][i%4]}</span></div><div class="stat-value">${s.value}</div><div class="stat-note">${s.note}</div></article>`).join("");
  $("itemsList").innerHTML=items.map((item,i)=>`<div class="item-row"><div class="item-icon">${["▤","◷","▧"][i%3]}</div><div class="item-info"><strong>${item.name}</strong><p>${item.detail}</p></div><span class="status ${/due|pending|open/i.test(item.status)?"amber":""}">${item.status}</span></div>`).join("");
  const links=currentUser.role==="student"?[["My Courses","View enrolled subjects"],["Attendance","Check your records"],["Marks & Results","Review academic progress"]]:currentUser.role==="teacher"?[["Student Records","Browse assigned classes"],["Attendance Sheet","Record class attendance"],["Marks Entry","Update assessment marks"]]:[["Students","Manage student records"],["Teachers","Manage faculty accounts"],["Courses & Subjects","Update course catalogue"]];
  $("quickLinks").innerHTML=links.map(([t,sub],i)=>`<button class="quick-link" data-quick="${t}"><span class="item-icon">${["▤","◷","▧"][i]}</span><span><strong>${t}</strong><small>${sub}</small></span></button>`).join("");
  document.querySelectorAll(".quick-link").forEach(b=>b.addEventListener("click",()=>renderSection(b.dataset.quick)));
  $("viewAllBtn").onclick=()=>renderSection(currentUser.role==="student"?"My Courses":currentUser.role==="teacher"?"Student Records":"Students");
}
function fallbackData(role){
  if(role==="student")return {stats:[{label:"Attendance",value:"92%",note:"Across all subjects"},{label:"Current GPA",value:"8.7",note:"Sample data"},{label:"Courses",value:"6",note:"This semester"},{label:"Pending tasks",value:"3",note:"Assignments and work"}],items:[{name:"Data Structures",detail:"Next class · 10:00 AM",status:"In progress"},{name:"Database Management Systems",detail:"Assignment due · Friday",status:"Due soon"},{name:"Artificial Intelligence",detail:"Internal marks published",status:"Updated"}]};
  if(role==="teacher")return {stats:[{label:"My students",value:"124",note:"Across assigned courses"},{label:"Courses",value:"4",note:"Current semester"},{label:"Attendance pending",value:"2",note:"Sheets to complete"},{label:"Marks pending",value:"18",note:"Entries to review"}],items:[{name:"CS-201 · Data Structures",detail:"42 students",status:"Attendance open"},{name:"CS-204 · Database Systems",detail:"38 students",status:"Marks review"},{name:"CS-210 · Intro to AI",detail:"44 students",status:"Up to date"}]};
  return {stats:[{label:"Students",value:"1,248",note:"Sample total"},{label:"Teachers",value:"86",note:"Academic staff"},{label:"Courses",value:"42",note:"Active courses"},{label:"Pending requests",value:"7",note:"Need review"}],items:[{name:"Student directory",detail:"Add or review student records",status:"Open section"},{name:"Faculty directory",detail:"Manage teacher accounts",status:"Open section"},{name:"Courses & subjects",detail:"Maintain course catalogue",status:"Open section"}]};
}
function sectionContent(role,section){
  if(role==="student"){
    if(section==="Attendance")return {stats:[{label:"Overall attendance",value:"92%",note:"Sample data"},{label:"Present",value:"46",note:"Classes attended"},{label:"Absent",value:"4",note:"Classes missed"},{label:"Subjects tracked",value:"6",note:"Current semester"}],items:[{name:"Data Structures",detail:"24 of 26 classes attended",status:"92%"},{name:"Database Systems",detail:"21 of 24 classes attended",status:"88%"},{name:"Artificial Intelligence",detail:"18 of 19 classes attended",status:"95%"}]};
    if(/Marks|Results/.test(section))return {items:[{name:"Data Structures",detail:"Internal: 24/30 · End-sem: pending",status:"In progress"},{name:"Database Systems",detail:"Internal: 27/30 · End-sem: pending",status:"Updated"},{name:"Artificial Intelligence",detail:"Internal: 26/30 · End-sem: pending",status:"Updated"}]};
    if(section==="Timetable")return {items:[{name:"Data Structures",detail:"Monday · 10:00–11:00 AM · Room 204",status:"Scheduled"},{name:"Database Systems",detail:"Monday · 11:15 AM–12:15 PM · Lab 2",status:"Scheduled"},{name:"Artificial Intelligence",detail:"Tuesday · 9:00–10:00 AM · Room 105",status:"Scheduled"}]};
    if(section==="My Profile")return {items:[{name:currentUser.name,detail:currentUser.email,status:"Student"},{name:"Programme",detail:"B.Tech · Computer Science (sample)",status:"Active"},{name:"Student ID",detail:"UC2026-1042 (sample)",status:"Verified"}]};
    if(section==="Announcements")return {items:[{name:"Mid-semester assessment schedule",detail:"Academic Office · Posted recently",status:"New"},{name:"Library hours update",detail:"Central Library · This week",status:"Notice"}]};
  }
  if(role==="teacher"){
    if(/Attendance/.test(section))return {items:[{name:"CS-201 · Data Structures",detail:"42 students · Select class to record attendance",status:"Action needed"},{name:"CS-204 · Database Systems",detail:"38 students · Last updated today",status:"Updated"}]};
    if(/Marks|Results/.test(section))return {items:[{name:"CS-201 · Data Structures",detail:"42 students · Internal assessment",status:"18 pending"},{name:"CS-204 · Database Systems",detail:"38 students · Unit test",status:"Reviewed"}]};
    if(/Student Records/.test(section))return {items:[{name:"Aarav Sharma · UC2026-1042",detail:"CS-201 · Data Structures",status:"Enrolled"},{name:"Diya Patel · UC2026-1051",detail:"CS-204 · Database Systems",status:"Enrolled"},{name:"Kabir Mehta · UC2026-1088",detail:"CS-201 · Data Structures",status:"Enrolled"}]};
  }
  if(role==="admin"){
    if(section==="Students")return {items:[{name:"Student directory",detail:"1,248 sample student records",status:"View records"},{name:"New student registration",detail:"Create a student profile",status:"Admin task"}]};
    if(section==="Teachers")return {items:[{name:"Faculty directory",detail:"86 sample teacher accounts",status:"View records"},{name:"Assign course",detail:"Connect faculty to subjects",status:"Admin task"}]};
    if(section==="Courses & Subjects")return {items:[{name:"Active courses",detail:"42 courses in the catalogue",status:"View courses"},{name:"Add a course",detail:"Create a course and assign a teacher",status:"Admin task"}]};
    if(section==="Academic Reports")return {items:[{name:"Attendance summary",detail:"Sample semester-wide attendance overview",status:"Available"},{name:"Result summary",detail:"Sample academic performance overview",status:"Available"}]};
  }
  return {};
}
$("logoutBtn").addEventListener("click",()=>{currentUser=null;$("appView").classList.add("hidden");$("loginView").classList.remove("hidden");$("password").value="";$("loginMessage").textContent="";});
$("email").value=roles.student.email;$("demoHint").textContent=demoHint.student;
