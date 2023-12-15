let userForm = document.getElementById("userForm");
let userEntries = [];

const retrieveEntries = () => {
    let entries = localStorage.getItem("usr_entries");
    if(entries) entries = JSON.parse(entries);
    if(!entries) entries = [];
    return entries;
}


const saveUserForm = (event) => {
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const acceptTC = document.getElementById("acceptTerms").checked;
    
    
    const entry = {
        name,
        email,
        password,
        dob,
     acceptTC
    }
    
    userEntries = retrieveEntries();
    userEntries.push(entry);
    
    localStorage.setItem("usr_entries",JSON.stringify(userEntries));
}

const dispEntries = () => {
    const entries = retrieveEntries();
    
    const tableEntries = entries.map((entry) => {
        const nameCell = `<td>${entry.name}</td>`;
        const emailCell = `<td>${entry.email}</td>`;
        const passwordCell = `<td>${entry.password}</td>`;
        const dobCell = `<td>${entry.dob}</td>`;
        const tcCell = `<td>${entry.acceptTC}</td>`;
        
        const row = `<tr>${nameCell} ${emailCell} ${passwordCell} ${dobCell} ${tcCell}</tr>`;
        return row;
    }).join('\n');
    
    const table = `<table <tr>
    <th> Name </th>
    <th> Email </th>
    <th> Password </th>
    <th> Dob </th>
    <th> Accepted terms? </th>
    </tr>${tableEntries} </table>`;
    
    let details = document.getElementById("usr_entries");
    details.innerHTML = table;
}








let minD = new Date(new Date());
minD.setFullYear(minD.getFullYear() - 56);
let maxD = new Date(new Date());
maxD.setFullYear(maxD.getFullYear() - 19);



document.getElementById("dob").setAttribute("max", maxD.toISOString().slice(0, 10));

document.getElementById("dob").setAttribute("min", minD.toISOString().slice(0, 10));
userForm.addEventListener("submit",saveUserForm);

dispEntries();

userForm.reset();