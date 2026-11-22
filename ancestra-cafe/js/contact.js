/* Interactive directions and front-end-only contact form. */
const CAFE_DESTINATION = "Ancestra Cafe, 311 General Ortega St., Poblacion, Argao, Cebu, Philippines";
document.addEventListener("DOMContentLoaded",()=>{
  const btn=document.getElementById("directionsBtn");const mode=document.getElementById("travelMode");
  const build=()=>`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CAFE_DESTINATION)}&travelmode=${mode.value}`;
  btn.href=build();mode.addEventListener("change",()=>{btn.href=build();});
  document.getElementById("contactForm").addEventListener("submit",e=>{e.preventDefault();const f=e.target;if(!f.checkValidity()){f.classList.add("was-validated");return;}f.reset();f.classList.remove("was-validated");toast("Demo message checked. For a real inquiry, email contact@ancestracafe.ph.","info");});
});