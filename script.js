// Admin Security 
let checkAdmin=()=> {
  const adminPassword = "admin123"; // Set your admin password here
  let userInput = prompt("Enter the admin password:");
  
  if (userInput === adminPassword) {
    alert("Access granted! You will be redirected to the Admin Data page.");
      location.href = "admin.html"; // Change this to the actual admission page URL
  } else {
    Swal.fire({
      title: "Invalid Data!",
      text: "Authentication Failed. Please Enter the Correct Admin Password",
      icon: "warning",
      confirmButtonColor: "#0c5d69",
      confirmButtonText: "Understood",
    })
  }
}
let checkUser=()=> {
  alert("Access granted! You will be redirected to the Student Data page.");
  location.href = "student.html";
}
let admissions=()=> {
  alert("Access granted! You will be redirected to the Admission Form.");
  location.href = "admission.html";
}
let home=()=> {
  alert("Access granted! You will be redirected to the Home page.");
  location.href = "index.html";
}


// for search by details 
let searchStudent = async()=>{
  let searchName=document.querySelector("#name").value.toUpperCase().trim();
  let searchRoll=document.querySelector("#rollNo").value.toString().trim();
  let searchNumber=document.querySelector("#number").value.toString().trim();
  let searchId=document.querySelector("#inpId").value.toUpperCase().toString().trim()
  let searchClass = document.querySelector("#class").value;
  let searchSection = document.querySelector("#section").value;
  let table = document.querySelector("#studentTab");
  let url='http://localhost:3000/Students'
  let res= await fetch(url, {method:"GET"})
  let data= await res.json();

  let filterData=data.filter((e)=>{
    return (
      (e.name.toUpperCase().includes(searchName)) &&
      (e.id.toString().toUpperCase().trim() === searchId) &&
      (e.rollNo.toString().trim() == searchRoll) &&
      (e.number.toString().trim() == searchNumber) &&
      (e.class === searchClass) &&
      ( e.section === searchSection)
      // (searchSection === "Section" || e.section === searchSection)
    );
  })
  if (filterData.length > 0) {
    table.style.display = "table"; // Show table
    dataShow(filterData);
  } else {
    table.style.display = "none"; // Hide table if no data found
    Swal.fire({
      title: "Invalid Data!",
      text: "This cannot be wrong/empty, Enter Correct Details.",
      icon: "warning",
      confirmButtonColor: "#0c5d69",
      confirmButtonText: "Understood",
    })
  }
};

let dataShow=(data)=>{
  let show=document.querySelector("#studentTable")
  show.innerHTML=""
  data.map((e)=>{
      show.innerHTML +=`
      <tr class="row">
          <td>${e.name}</td>
          <td>${e.class}</td>
          <td>${e.section}</td>
          <td>${e.id}</td>
          <td>${e.fees.tution}</td>
          <td>${e.fees.library+e.fees.exam}</td>
          <td>${e.totalFees}</td>
          <td>${e.feesPaid ? "✅ Paid" : "❌ Not Paid"}</td>
          <td>
            <button class="payColumn" ${e.feesPaid ? 'disabled' : ''} onclick="payFees('${e.id}')">
              ${e.feesPaid ? 'Done' : 'Pay'}</button>
          </td>
      </tr> `
      // <td class="payColumn" onclick="return payFees('${e.id}')">Pay</td>
  })
};
let payFees = async (id) => {
  Swal.fire({
    title: "Payment Done!",
    text: "Payment will be Completed it's can't be Refunded",
    icon: "success",
    confirmButtonColor: "#0c5d69",
    confirmButtonText: "Understood",
  })
  let url = `http://localhost:3000/Students/${id}`;
  let res = await fetch(url);
  let data = await res.json();
  data.feesPaid = true;
  
  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data) 
  });
alert("Payment Successfull")
  // location.href="student.html";
};

// for Admin Panel to show all data
let fetchAdmin = async()=>{
  let url='http://localhost:3000/Students'
  let res=await fetch(url, {method:"GET"})
  let data = await res.json()
  console.log(data);
  paginationn(data)
}
// for search by details 
let searchh=async()=>{
  let searchInp=document.querySelector("#searchInp").value.toUpperCase().trim();
  let url= 'http://localhost:3000/Students';
  let res= await fetch(url,{ method:"GET"})
    let data = await res.json()
    let filterData=data.filter((e)=>{
    return e.name.toUpperCase().includes(searchInp) || e.number.toUpperCase().includes(searchInp)|| e.class.toString().toUpperCase().includes(searchInp)
  })
    paginationn(filterData)
}
let paginationn=(data)=>{
  $('#pagin').pagination({
    dataSource: data,
    pageSize: 5,
    showSizeChanger: true,
    callback: function(data, pagination) {
      dataSo(data)
    }
})
}
let dataSo=(data)=>{
let show=document.querySelector("#studentData")
show.innerHTML=""
data.map((e)=>{
    show.innerHTML +=`
    <tr class="row">
        <td>${e.name}</td>
        <td>${e.class}</td>
        <td>${e.section}</td>
        <td>${e.number}</td>
        <td>${e.rollNo}</td>
        <td>${e.id}</td>
        <td>${e.totalFees}</td>
        <td>${e.feesPaid ? "✅ Paid" : "❌ Not Paid"}</td>
        <td onclick="return formFill('${e.id}')">Edit</td>
        <td onclick="condel('${e.id}')" class="cancel-button">Cancel</td>
        
    </tr> `
})
};

let formFill= async(id)=> {
  let url = `http://localhost:3000/Students/${id}`
  
  let res = await fetch(url,{method:"GET"})
  let data = await res.json()
  let form=`
  
    <div class="group">
      <label for="class">Select Class:</label>
      <select id="class">
        <option value="">Select Class</option>
        <option value="9th">Class 9th</option>
        <option value="10th">Class 10th</option>
        <option value="11th">Class 11th</option>
        <option value="12th">Class 12th</option>
      </select>
    </div>
    <div class="group">
      <label for="section">Select Section:</label>
      <select id="section">
        <option value="">Section</option>
        <option value="A">Section A</option>
        <option value="B">Section B</option>
      </select>
    </div>
    <div class="group">
      <label for="name">Student's Name:</label>
      <input type="text" value="${data.name}"  placeholder="Name" id="name">
    </div>
    <div class="group">
      <label for="number">Mobile Number:</label>
      <input type="number" value="${data.number}"  placeholder="Mobile Number" id="number">
    </div>
    <div class="group">
      <label for="rollNo">Roll Number:</label>
      <input type="number" value="${data.rollNo}"  placeholder="Roll Number" id="rollNo">
    </div>
    <div class="group">
      <label for="totalFees">Total Fees:</label>
      <input type="number" value="${data.totalFees}" readonly placeholder="Total Fees" id="totalFees">
    </div>

      <button onclick="updatee('${data.id}')">Update</button>
  `
  document.querySelector("#contentt").innerHTML=form
  }
  
let updatee=(id)=>{
  console.log("Student ID:", id);  // Debugging line

let searchName=document.querySelector("#name").value.toUpperCase().trim();
let searchRollNo=document.querySelector("#rollNo").value.toUpperCase().toString().trim()
let searchClass = document.querySelector("#class").value;
let searchSection = document.querySelector("#section").value;
let searchNumber = document.querySelector("#number").value.toUpperCase().toString().trim();
let searchTotalFees = document.querySelector("#totalFees").value.toUpperCase().toString().trim();

let url = `http://localhost:3000/Students/${id}`

fetch(url,{
  method:"PUT",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify(
    {
      name:searchName,
      class:searchClass,
      section:searchSection,
      number:searchNumber,
      rollNo:searchRollNo,
      totalFees:searchTotalFees,
    }
  )
})
return false;
}

let del =(id)=>{
  let url = `http://localhost:3000/Students/${id}`
  fetch(url, {method: "DELETE"})
}

// alert script library 
let condel=(id)=>{
Swal.fire({
  title: "Are you sure?",
  text: "This cannot be undone, proceed carefully!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!",
  
}).then((result) => {
  if (result.isConfirmed) {
    del(id)
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});
}


// admission 
let admission = () => {
  let adname = document.querySelector('#adname').value;
  let adphone = document.querySelector('#adphone').value;
  let adclass = document.querySelector('#adclass').value;
  let adsection = document.querySelector('#adsection').value;
  let adRollNo = document.querySelector('#adRollNo').value;

  // Fees structure object
  const fees = {
    "9th": {
      tution: 5000,
      library: 1500,
      exam: 800
    },
    "10th": {
      tution: 7500,
      library: 2000,
      exam: 1000
    },
    "11th": {
      tution: 7000,
      library: 2500,
      exam: 1200
    },
    "12th": {
      tution: 8000,
      library: 3000,
      exam: 1500
    }
  };

  // Input validation
  if (adname === '' || adclass === '' || adsection === '' || adRollNo === '') {
    alert("Enter All Details");
    return false;
  } 
  if (adphone === "" || isNaN(adphone) || adphone.length !== 10) {
    alert("Enter a Correct Mobile Number");
    return false;
  }

  // Access fees based on the selected class
  const classFees = fees[adclass];

  // Calculate total fees for the selected class
  const totalFees = Object.values(classFees).reduce((sum, fee) => sum + fee, 0);

  // Save student data in localStorage (optional)
  localStorage.setItem("name", adname);
  localStorage.setItem("class", adclass);
  localStorage.setItem("section", adsection);
  localStorage.setItem("rollNo", adRollNo);
  localStorage.setItem("number", adphone);

  // Save student data in the database
  const url = 'http://localhost:3000/Students'; 
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: adname,
      class: adclass,
      section: adsection,
      rollNo: adRollNo,
      number: adphone,
      fees: classFees,
      totalFees: totalFees,
      feesPaid:false,
    }),
  })
location.href="admin.html";
alert("Successful")

  return false; // Prevent page refresh
};
