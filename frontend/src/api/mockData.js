// Pre-populated realistic healthcare demonstration data for ApnoCare
// Allows the complete application to function seamlessly anywhere (including Vercel deploys)

export const initialFamily = [
  {
    _id: 'fam_mother_64',
    id: 'fam_mother_64',
    name: 'Jaswant Kaur',
    relation: 'Mother',
    age: 64,
    gender: 'Female',
    phone: '+91 98140 11223',
    location: 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    preferred_language: 'Punjabi',
    emergency_contact: {
      name: 'Abhishek Sharma (Son in Toronto)',
      phone: '+1 (647) 555-0192',
      relation: 'Son'
    },
    blood_group: 'B+',
    chronic_conditions: ['Hypertension (BP)', 'Mild Osteoarthritis'],
    allergies: ['Penicillin'],
    preferred_hospital: 'Tagore Hospital & Heart Care, Jalandhar',
    notes: 'Takes Telmisartan 40mg daily morning. Walks slowly due to knee stiffness. Prefers morning appointments.',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    _id: 'fam_father_68',
    id: 'fam_father_68',
    name: 'Harbhajan Singh',
    relation: 'Father',
    age: 68,
    gender: 'Male',
    phone: '+91 98140 44556',
    location: 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    preferred_language: 'Punjabi',
    emergency_contact: {
      name: 'Abhishek Sharma (Son in Toronto)',
      phone: '+1 (647) 555-0192',
      relation: 'Son'
    },
    blood_group: 'O+',
    chronic_conditions: ['Type 2 Diabetes', 'High Cholesterol'],
    allergies: [],
    preferred_hospital: 'Tagore Hospital & Heart Care, Jalandhar',
    notes: 'Monitors fasting blood sugar weekly. Takes Metformin 500mg after dinner.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  }
];

export const initialDoctors = [
  {
    _id: 'doc_1',
    id: 'doc_1',
    name: 'Dr. Rajiv Sharma',
    email: 'dr.sharma@tagore.com',
    specialty: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine), FACP',
    experience_years: 22,
    hospital_name: 'Tagore Hospital & Heart Care',
    hospital_address: 'Banda Bahadur Nagar, Jalandhar',
    city: 'Jalandhar',
    rating: 4.9,
    reviews_count: 340,
    consultation_fee: 800,
    available_today: true,
    available_slots: ['10:30 AM', '11:30 AM', '01:00 PM', '04:30 PM'],
    languages: ['Punjabi', 'Hindi', 'English'],
    health_concerns: ['Blood Pressure', 'Diabetes', 'Fever', 'Routine Health Checkup', 'Geriatric Health'],
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
  },
  {
    _id: 'doc_2',
    id: 'doc_2',
    name: 'Dr. Preeti Varma',
    email: 'dr.preeti@cityheart.com',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology)',
    experience_years: 18,
    hospital_name: 'City Heart & Vascular Institute',
    hospital_address: 'Mall Road, Jalandhar',
    city: 'Jalandhar',
    rating: 4.8,
    reviews_count: 285,
    consultation_fee: 1200,
    available_today: true,
    available_slots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
    languages: ['Hindi', 'English', 'Punjabi'],
    health_concerns: ['Chest Discomfort', 'Heart Palpitations', 'Hypertension', 'Post-Angioplasty Care'],
    image_url: 'https://images.unsplash.com/photo-1594824813533-524021272714?w=200&auto=format&fit=crop&q=80'
  },
  {
    _id: 'doc_3',
    id: 'doc_3',
    name: 'Dr. Amit Mehra',
    email: 'dr.mehra@apollo.com',
    specialty: 'Orthopedic Surgeon',
    qualification: 'MBBS, MS (Ortho), MCh (Joint Replacement)',
    experience_years: 16,
    hospital_name: 'Apollo Clinic & Diagnostic Centre',
    hospital_address: 'Model Town, Jalandhar',
    city: 'Jalandhar',
    rating: 4.75,
    reviews_count: 210,
    consultation_fee: 900,
    available_today: true,
    available_slots: ['11:00 AM', '01:30 PM', '04:00 PM'],
    languages: ['Punjabi', 'English'],
    health_concerns: ['Knee Pain', 'Arthritis', 'Joint Stiffness', 'Fracture Care', 'Backache'],
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80'
  },
  {
    _id: 'doc_4',
    id: 'doc_4',
    name: 'Dr. Simran Kaur',
    email: 'dr.simran@sacred.com',
    specialty: 'Neurologist',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience_years: 14,
    hospital_name: 'Sacred Heart Super-Speciality Hospital',
    hospital_address: 'Maqsudan, Jalandhar',
    city: 'Jalandhar',
    rating: 4.9,
    reviews_count: 195,
    consultation_fee: 1100,
    available_today: true,
    available_slots: ['10:30 AM', '02:00 PM', '05:00 PM'],
    languages: ['Punjabi', 'Hindi', 'English'],
    health_concerns: ['Migraine', 'Tremors', 'Nerve Pain', 'Memory Loss', 'Vertigo'],
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'
  }
];

export const initialHospitals = [
  {
    _id: 'hosp_1',
    id: 'hosp_1',
    name: 'Tagore Hospital & Heart Care',
    city: 'Jalandhar',
    address: 'Banda Bahadur Nagar, Mahavir Marg, Jalandhar, Punjab 144008',
    phone: '0181-2244222',
    emergency_phone: '0181-2244225 (24/7 ER)',
    has_emergency_24_7: true,
    type: 'Multi-Super Speciality Hospital',
    rating: 4.8,
    departments: ['Emergency & Trauma Care', 'Cardiology & Heart Care', 'Internal Medicine', 'Dialysis', 'Intensive Care Unit (ICU)'],
    services: ['24/7 Emergency Ambulance', 'Cath Lab', 'Digital Cardiac Monitors', 'In-house Pharmacy', 'NABL Accredited Lab'],
    doctors_count: 42,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_2',
    id: 'hosp_2',
    name: 'Patel Hospital',
    city: 'Jalandhar',
    address: 'Civil Lines, Near BMC Chowk, Jalandhar, Punjab 144001',
    phone: '0181-5241000',
    emergency_phone: '0181-5241011',
    has_emergency_24_7: true,
    type: 'Super Speciality & Cancer Institute',
    rating: 4.7,
    departments: ['Emergency Care', 'Oncology', 'Gastroenterology', 'General Surgery', 'Pulmonology'],
    services: ['24/7 Emergency', 'Advanced ICU', 'Blood Bank', 'Pharmacy', 'Diagnostic Imaging'],
    doctors_count: 38,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_3',
    id: 'hosp_3',
    name: 'Apollo Clinic & Diagnostic Centre',
    city: 'Jalandhar',
    address: 'Plot 18, Model Town Road, Jalandhar, Punjab 144003',
    phone: '0181-2460111',
    emergency_phone: '0181-2460112',
    has_emergency_24_7: false,
    type: 'Daycare & Diagnostic Centre',
    rating: 4.85,
    departments: ['Pathology', 'Radiology', 'Orthopedics', 'Preventive Health', 'Consultation Chambers'],
    services: ['Home Sample Collection', 'Echo & TMT', 'Digital X-Ray', 'Ultrasound', 'Vaccination Clinic'],
    doctors_count: 18,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80'
  }
];

export const initialCareRequests = [
  {
    _id: 'care_req_782190',
    id: 'care_req_782190',
    request_code: 'CARE-782190',
    user_id: 'user_abhishek',
    user_name: 'Abhishek Sharma',
    user_phone: '+1 (647) 555-0192',
    family_member_id: 'fam_mother_64',
    patient_name: 'Jaswant Kaur',
    patient_relation: 'Mother',
    patient_age: 64,
    patient_gender: 'Female',
    patient_phone: '+91 98140 11223',
    pickup_address: 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    service_type: 'Doctor Visit Assistance',
    preferred_hospital_doctor: 'Dr. Rajiv Sharma at Tagore Hospital',
    gender_pref: 'Any',
    language_pref: 'Punjabi',
    special_instructions: 'Mother walks slowly due to mild knee osteoarthritis. Please assist carefully with vehicle boarding and steps.',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '10:00 AM',
    representative_id: 'rep_rajesh',
    representative_name: 'Rajesh Kumar',
    representative_phone: '+91 98722 34567',
    representative_rating: 4.95,
    representative_photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'consultation_done',
    timeline: [
      {
        stage: 'requested',
        title: 'Care Request Created',
        timestamp: new Date(Date.now() - 3.5 * 3600000).toISOString(),
        notes: 'Requested Doctor Visit Assistance for Jaswant Kaur from Toronto.'
      },
      {
        stage: 'assigned',
        title: 'Care Associate Rajesh Kumar Assigned',
        timestamp: new Date(Date.now() - 3.2 * 3600000).toISOString(),
        notes: 'Matched verified local associate speaking Punjabi within 4km radius.'
      },
      {
        stage: 'accepted',
        title: 'Assignment Accepted',
        timestamp: new Date(Date.now() - 3.1 * 3600000).toISOString(),
        notes: 'Rajesh confirmed vehicle readiness and scheduled departure.'
      },
      {
        stage: 'on_the_way',
        title: 'Representative On The Way',
        timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString(),
        notes: 'Driving towards Model Town address.'
      },
      {
        stage: 'reached_home',
        title: "Reached Patient's Home",
        timestamp: new Date(Date.now() - 2.1 * 3600000).toISOString(),
        notes: 'Met Jaswant Ji at home. Confirmed BP records and ID documents are ready.'
      },
      {
        stage: 'patient_picked_up',
        title: 'Patient Accompanied / Picked Up',
        timestamp: new Date(Date.now() - 1.8 * 3600000).toISOString(),
        notes: 'Safely assisted into comfortable AC cab.'
      },
      {
        stage: 'reached_hospital',
        title: 'Reached Tagore Hospital & Heart Care',
        timestamp: new Date(Date.now() - 1.4 * 3600000).toISOString(),
        notes: 'Arrived at OPD entrance. Wheelchair provided for comfort.'
      },
      {
        stage: 'registration_done',
        title: 'Hospital Registration Completed',
        timestamp: new Date(Date.now() - 1.0 * 3600000).toISOString(),
        notes: 'Token #28 collected. Queue moving smoothly.'
      },
      {
        stage: 'consultation_done',
        title: 'Doctor Consultation Completed with Dr. Rajiv Sharma',
        timestamp: new Date(Date.now() - 0.3 * 3600000).toISOString(),
        notes: 'Dr. Sharma examined Jaswant Ji. Blood pressure is 132/84 (stable). Renewed Telmisartan prescription and advised regular hydration.'
      }
    ],
    uploaded_documents: [
      {
        title: "Dr. Sharma's Prescription - Jaswant Kaur",
        type: 'Prescription',
        file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
        uploaded_at: new Date(Date.now() - 0.25 * 3600000).toISOString(),
        uploaded_by: 'Rajesh Kumar (Care Associate)'
      }
    ],
    care_fee: 1200,
    created_at: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 0.3 * 3600000).toISOString()
  }
];

export const initialAppointments = [
  {
    _id: 'appt_1',
    id: 'appt_1',
    doctor_id: 'doc_1',
    doctor_name: 'Dr. Rajiv Sharma',
    doctor_specialty: 'General Physician',
    hospital_name: 'Tagore Hospital & Heart Care',
    hospital_address: 'Banda Bahadur Nagar, Jalandhar',
    patient_id: 'fam_mother_64',
    patient_name: 'Jaswant Kaur (Mother)',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '10:30 AM',
    reason: 'Follow-up on Blood Pressure & Medicine Refill',
    status: 'confirmed',
    accompanied_by_rep: true,
    representative_name: 'Rajesh Kumar',
    consultation_fee: 800,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'appt_2',
    id: 'appt_2',
    doctor_id: 'doc_2',
    doctor_name: 'Dr. Preeti Varma',
    doctor_specialty: 'Cardiologist',
    hospital_name: 'City Heart & Vascular Institute',
    hospital_address: 'Mall Road, Jalandhar',
    patient_id: 'fam_father_68',
    patient_name: 'Harbhajan Singh (Father)',
    appointment_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    appointment_time: '11:15 AM',
    reason: 'Routine ECG & Cardiovascular Wellness Evaluation',
    status: 'confirmed',
    accompanied_by_rep: false,
    consultation_fee: 1200,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const initialTimeline = [
  {
    _id: 'tl_1',
    id: 'tl_1',
    patient_name: 'Jaswant Kaur',
    title: 'BP & Vitals Check Recorded',
    category: 'vitals',
    description: 'BP: 132/84 mmHg, Pulse: 74 bpm. Normal range maintained during hospital visit.',
    date: 'Today, 11:45 AM',
    timestamp: new Date().toISOString(),
    recorded_by: 'Rajesh Kumar (Care Associate)'
  },
  {
    _id: 'tl_2',
    id: 'tl_2',
    patient_name: 'Jaswant Kaur',
    title: 'Dr. Rajiv Sharma OPD Consultation',
    category: 'doctor_visit',
    description: 'General Physician checkup completed at Tagore Hospital. Medicines renewed.',
    date: 'Today, 11:10 AM',
    timestamp: new Date().toISOString(),
    recorded_by: 'Rajesh Kumar (Care Associate)'
  },
  {
    _id: 'tl_3',
    id: 'tl_3',
    patient_name: 'Harbhajan Singh',
    title: 'Fasting Blood Sugar Test',
    category: 'lab',
    description: 'Result: 114 mg/dL. Good glycemic control with current evening diet plan.',
    date: '3 days ago',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    recorded_by: 'Apollo Diagnostic Centre'
  },
  {
    _id: 'tl_4',
    id: 'tl_4',
    patient_name: 'Jaswant Kaur',
    title: 'Prescription Refill Delivered',
    category: 'medication',
    description: 'Telmisartan 40mg (30 tabs) safely delivered to Model Town home.',
    date: '5 days ago',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    recorded_by: 'ApnoCare Pharmacy Partner'
  }
];

export const initialHealthRecords = [
  {
    _id: 'hr_1',
    id: 'hr_1',
    family_member_id: 'fam_mother_64',
    patient_name: 'Jaswant Kaur',
    title: 'Cardiology & BP Review Prescription',
    record_type: 'Prescription',
    doctor_name: 'Dr. Rajiv Sharma',
    hospital_name: 'Tagore Hospital & Heart Care',
    date: new Date().toISOString().split('T')[0],
    file_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    notes: 'Advised continuing Telmisartan 40mg once daily after breakfast. Avoid excessive sodium.',
    created_at: new Date().toISOString()
  },
  {
    _id: 'hr_2',
    id: 'hr_2',
    family_member_id: 'fam_mother_64',
    patient_name: 'Jaswant Kaur',
    title: 'Comprehensive Blood & HbA1c Lab Report',
    record_type: 'Lab Report',
    doctor_name: 'Apollo Diagnostics',
    hospital_name: 'Apollo Diagnostic Centre, Model Town',
    date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    file_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
    notes: 'Hemoglobin 12.8 g/dL (Normal). Fasting Blood Sugar 98 mg/dL (Normal). HbA1c 5.6% (Normal).',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    _id: 'hr_3',
    id: 'hr_3',
    family_member_id: 'fam_father_68',
    patient_name: 'Harbhajan Singh',
    title: 'Lipid Profile & Cholesterol Screening',
    record_type: 'Lab Report',
    doctor_name: 'Dr. Lal PathLabs',
    hospital_name: 'Lal PathLabs Jalandhar Cantt',
    date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    file_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
    notes: 'Total Cholesterol 185 mg/dL. Triglycerides within acceptable limits.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const initialDiagnostics = [
  { _id: 'd1', id: 'd1', test_name: 'Complete Blood Count (CBC)', category: 'Routine Pathology', price: 350, fasting_required: false, sample_type: 'Blood', tat: '6 Hours', description: 'Checks red & white blood cells, platelets, and general infection signs.' },
  { _id: 'd2', id: 'd2', test_name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes Care', price: 450, fasting_required: false, sample_type: 'Blood', tat: '6 Hours', description: 'Measures 3-month average blood glucose level for diabetes control.' },
  { _id: 'd3', id: 'd3', test_name: 'Lipid Profile (Full Cholesterol)', category: 'Cardiac Health', price: 750, fasting_required: true, sample_type: 'Blood', tat: '8 Hours', description: 'Total cholesterol, HDL, LDL, VLDL, and triglycerides.' },
  { _id: 'd4', id: 'd4', test_name: 'Thyroid Profile Total (T3, T4, TSH)', category: 'Endocrine Health', price: 550, fasting_required: true, sample_type: 'Blood', tat: '12 Hours', description: 'Evaluates thyroid gland activity and metabolic balance.' },
  { _id: 'd5', id: 'd5', test_name: 'Kidney Function Test (KFT / RFT)', category: 'Organ Profile', price: 700, fasting_required: false, sample_type: 'Blood', tat: '8 Hours', description: 'Creatinine, Urea, Uric Acid, and electrolyte balance.' },
  { _id: 'd6', id: 'd6', test_name: 'Liver Function Test (LFT)', category: 'Organ Profile', price: 800, fasting_required: true, sample_type: 'Blood', tat: '8 Hours', description: 'SGOT, SGPT, Bilirubin, and protein levels.' },
  { _id: 'd7', id: 'd7', test_name: 'Digital Chest X-Ray (PA View)', category: 'Radiology', price: 450, fasting_required: false, sample_type: 'In-clinic', tat: 'Instant', description: 'Lungs, heart size, and chest cavity imaging.' }
];

export const initialMedicines = [
  {
    _id: 'med_1',
    id: 'med_1',
    patient_name: 'Jaswant Kaur',
    order_code: 'MED-5541',
    items: [
      { name: 'Telmisartan 40mg (Telma)', qty: 30, price: 180 },
      { name: 'Calcium + Vitamin D3 500mg (Shelcal)', qty: 30, price: 125 }
    ],
    total_amount: 305,
    status: 'delivered',
    delivery_address: 'House 142, Sector 2, Model Town, Jalandhar',
    ordered_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: 'med_2',
    id: 'med_2',
    patient_name: 'Harbhajan Singh',
    order_code: 'MED-5589',
    items: [
      { name: 'Metformin 500mg SR (Glycomet)', qty: 60, price: 140 },
      { name: 'Atorvastatin 10mg (Atorva)', qty: 30, price: 195 }
    ],
    total_amount: 335,
    status: 'in_transit',
    delivery_address: 'House 142, Sector 2, Model Town, Jalandhar',
    ordered_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const initialNotifications = [
  {
    id: 'notif_1',
    title: 'Consultation Completed',
    message: 'Dr. Rajiv Sharma has completed consultation with Jaswant Ji at Tagore Hospital.',
    type: 'success',
    timestamp: '15 minutes ago',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Care Associate on Duty',
    message: 'Rajesh Kumar is accompanying Jaswant Kaur at Tagore Hospital.',
    type: 'info',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 'notif_3',
    title: 'Prescription Uploaded',
    message: 'New prescription from Dr. Sharma added to your Health Vault.',
    type: 'file',
    timestamp: '2 hours ago',
    read: true
  }
];

export const initialAdminStats = {
  total_users: 142,
  total_family_members: 284,
  verified_reps: 18,
  pending_reps: 4,
  active_care_requests: 3,
  completed_care_visits: 89,
  total_revenue_inr: 106800,
  average_rating: 4.92
};

export const initialAdminReps = [
  {
    _id: 'rep_rajesh',
    id: 'rep_rajesh',
    name: 'Rajesh Kumar',
    email: 'rajesh.care@apnocare.com',
    phone: '+91 98722 34567',
    service_area: 'Jalandhar City & Cantt',
    verification_status: 'verified',
    rating: 4.95,
    completed_visits: 52,
    languages: ['Punjabi', 'Hindi', 'English'],
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    _id: 'rep_priya',
    id: 'rep_priya',
    name: 'Priya Gill',
    email: 'priya.care@apnocare.com',
    phone: '+91 98144 55678',
    service_area: 'Model Town & Rama Mandi',
    verification_status: 'verified',
    rating: 4.88,
    completed_visits: 34,
    languages: ['Punjabi', 'Hindi'],
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  },
  {
    _id: 'rep_gurpreet',
    id: 'rep_gurpreet',
    name: 'Gurpreet Singh',
    email: 'gurpreet.applicant@gmail.com',
    phone: '+91 98788 12345',
    service_area: 'Maqsudan & BMC Chowk',
    verification_status: 'pending',
    rating: 0,
    completed_visits: 0,
    languages: ['Punjabi', 'Hindi'],
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  }
];
