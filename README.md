# CarePoint Hospital Management System — Final

This version implements the acceptance criteria visible in the supplied Hospital Sprint/Product Backlog screenshots.

## Technology
- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage (browser-side database)
- Responsive UI

## Acceptance Criteria Covered

### US001 — Menu Based Console Application
The administrator has a numbered web menu corresponding to:
1. View Patient Details
2. Search Patient by PID
3. Update Patients by Email
4. Delete Patients by Mobile Number
5. Patient Registration
6. Transaction Processing
7. Complaints
8. Hospital Facilities

The Logout/Exit action terminates the current session and returns to the protected login screen.

### US002 — Admin Register
Patient registration contains:
- First Name
- Last Name
- Email ID
- Mobile Number
- Gender
- City
- Doctor Name
- Department
- Address
- Contact Number

A unique PID is automatically generated after registration. Duplicate email/mobile values are blocked.

### US003 — Admin View
- Displays registered patients with complete details.
- Search/filter available.
- Finite number of records per screen (5).
- Pagination is provided.

### US004 — Admin Search
- Search using PID.
- Complete patient details are displayed.
- Invalid/missing PID produces a user-friendly message.

### US005 — Admin Update
- Find a patient using email.
- Update mobile number, address, doctor, city, department and other editable details.
- PID is read-only and cannot be changed.
- Duplicate email is prevented.
- Success/error messages are shown.

### US006 — Admin Delete
- Search by mobile number.
- Patient details are shown before deletion.
- Delete confirmation is required.
- Success/error messages are shown.

### US007 — Visitor Register
Visitor registration contains:
- User ID
- First Name
- Last Name
- Password
- Confirm Password
- Email ID
- Mobile Number
- Gender radio buttons
- City dropdown

Validation:
- User ID minimum 8 characters.
- Password minimum 10 characters.
- Password requires uppercase, number and special character.
- Password confirmation must match.
- Mobile number must be 10 digits.
- Duplicate user IDs/emails are blocked.

### US008 — Visitor Login
- User ID and password protected.
- User ID minimum 8 characters.
- Password validation rules are enforced during registration.
- Logout/Exit is available.

### US009 — Visitor View Facilities
- Hospital facilities are displayed department-wise.
- Departments include Emergency, Cardiology, Orthopedics, Pediatrics and General Medicine.
- Finite number of facility cards per screen (6).
- Pagination and department filtering are provided.

### US010 — Visitor Register Complaint
- Visitor can register a complaint.
- Category, department, subject and description are captured.
- Success/error messages are shown.
- Visitor sees their own complaint records.
- Admin can view, resolve/reopen and delete complaints.

## Demo Admin
User ID: `admin`
Password: `admin123`

## How to Run
1. Extract the ZIP.
2. Open `index.html` in Chrome/Edge/Firefox.
3. No npm, backend or database server is required.
4. Data is stored in LocalStorage.

## LocalStorage Keys
- cp_patients_v2
- cp_visitors_v2
- cp_transactions_v2
- cp_complaints_v2

## Note
LocalStorage is appropriate for a college/demo project. It is not a secure production database. A real deployment should use a backend API and server-side authentication/database.


## Latest Updates
### Doctor ID + Doctor Name
Patient registration and patient update now use department-dependent doctor dropdowns.
Each department has hospital doctors with a Doctor ID and Doctor Name. Changing the department refreshes the available doctors.

Example:
- General Medicine: D001 Dr. Suresh Kumar, D002 Dr. Anitha Rao, D003 Dr. Naveen Reddy
- Cardiology: D101 Dr. Priya Sharma, D102 Dr. Rajesh Varma, D103 Dr. Kiran Rao
- Orthopedics: D201 Dr. Mahesh Reddy, D202 Dr. Vikram Singh, D203 Dr. Swathi Rao
- Pediatrics: D301 Dr. Kavya Reddy, D302 Dr. Arun Kumar, D303 Dr. Meena Sharma
- Emergency: D401 Dr. Ravi Teja, D402 Dr. Neha Reddy, D403 Dr. Ajay Kumar
- Diagnostics: D501 Dr. Deepak Rao, D502 Dr. Lakshmi Prasad, D503 Dr. Sunil Varma

### Mobile Validation
Patient and visitor mobile/contact numbers:
- Must contain exactly 10 digits.
- Must start with 6, 7, 8 or 9.
- Repeated values such as `0000000000`, `1111111111`, `6666666666`, `9999999999` are rejected.

### Patient Status Update
The Admin Update by Email screen now includes:
- Active
- Discharged

This allows an administrator to change a patient's status from Active to Discharged after the patient is discharged.


## Mandatory Admin Credential Update
The login screen no longer displays any demo/admin credential hint.

Admin credentials configured for this project:
- Username: `carepoint@admin`
- Password: `Admin@123`

The credentials are not shown in the page UI.

## Mandatory Features Retained
- Department-dependent Doctor ID and Doctor Name dropdowns.
- Doctor lists for General Medicine, Cardiology, Orthopedics, Pediatrics, Emergency and Diagnostics.
- Patient and visitor mobile/contact validation: exactly 10 digits, starting with 6/7/8/9.
- Repeated-number mobile values such as 0000000000, 1111111111, 6666666666 and 9999999999 are rejected.
- Admin Update by Email includes Patient Status with Active and Discharged options.
