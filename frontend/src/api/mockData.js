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
  },
  {
    _id: 'fam_grandma_88',
    id: 'fam_grandma_88',
    name: 'Surinder Kaur',
    relation: 'Grandmother',
    age: 88,
    gender: 'Female',
    phone: '+91 98140 77889',
    location: 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
    city: 'Jalandhar',
    preferred_language: 'Punjabi',
    emergency_contact: {
      name: 'Abhishek Sharma (Grandson in Toronto)',
      phone: '+1 (647) 555-0192',
      relation: 'Grandson'
    },
    blood_group: 'AB+',
    chronic_conditions: ['Age-related Mobility Limitation', 'Mild Hearing Loss'],
    allergies: ['Sulfa drugs'],
    preferred_hospital: 'Tagore Hospital & Heart Care, Jalandhar',
    notes: 'Requires wheelchair assistance during hospital visits. Speaks predominantly Punjabi.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
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
    hospital_address: 'Banda Bahadur Nagar, Mahavir Marg, Jalandhar',
    city: 'Jalandhar',
    rating: 4.9,
    reviews_count: 342,
    consultation_fee: 800,
    available_today: true,
    available_slots: ['10:30 AM', '11:30 AM', '01:00 PM', '04:30 PM'],
    languages: ['Punjabi', 'Hindi', 'English'],
    health_concerns: ['Blood Pressure', 'Diabetes', 'Fever', 'Routine Health Checkup', 'Geriatric Care'],
    modes: ['In-Clinic OPD', 'Video Consultation', 'Home Visit'],
    bio: 'Senior Consultant Physician with over two decades of dedicated medical service in Punjab. Specializes in managing chronic geriatric ailments, complex hypertension, and metabolic syndrome.',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    reviews: [
      { author: 'Manpreet S.', relation: 'Son in UK', rating: 5, comment: 'Dr. Sharma examined my mother with immense patience. Explained the BP dosage clearly in Punjabi.', date: '2 days ago' },
      { author: 'Gurjit K.', relation: 'Daughter in Canada', rating: 5, comment: 'Very reassuring and gentle approach with senior citizens.', date: '1 week ago' }
    ]
  },
  {
    _id: 'doc_2',
    id: 'doc_2',
    name: 'Dr. Preeti Varma',
    email: 'dr.preeti@cityheart.com',
    specialty: 'Cardiologist',
    qualification: 'MBBS, MD, DM (Cardiology), FSCAI',
    experience_years: 18,
    hospital_name: 'City Heart & Vascular Institute',
    hospital_address: 'Mall Road, Near BMC Chowk, Jalandhar',
    city: 'Jalandhar',
    rating: 4.85,
    reviews_count: 285,
    consultation_fee: 1200,
    available_today: true,
    available_slots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
    languages: ['Hindi', 'English', 'Punjabi'],
    health_concerns: ['Chest Discomfort', 'Heart Palpitations', 'Hypertension', 'Post-Angioplasty Care', 'ECG/Echo Review'],
    modes: ['In-Clinic OPD', 'Video Consultation'],
    bio: 'Premier Interventional Cardiologist. Pioneer in preventive heart health and post-operative cardiac rehabilitation programs for senior citizens.',
    image_url: 'https://images.unsplash.com/photo-1594824813533-524021272714?w=200&auto=format&fit=crop&q=80',
    reviews: [
      { author: 'Harvinder P.', relation: 'Son in US', rating: 5, comment: 'Accurate diagnosis of cardiac rhythm anomaly. The hospital staff handled everything smoothly.', date: '3 days ago' },
      { author: 'Sunita D.', relation: 'Patient in Jalandhar', rating: 4, comment: 'Very thorough checkup and echocardiogram review.', date: '2 weeks ago' }
    ]
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
    hospital_address: 'Plot 18, Model Town Road, Jalandhar',
    city: 'Jalandhar',
    rating: 4.78,
    reviews_count: 214,
    consultation_fee: 900,
    available_today: true,
    available_slots: ['11:00 AM', '01:30 PM', '04:00 PM'],
    languages: ['Punjabi', 'English'],
    health_concerns: ['Knee Osteoarthritis', 'Joint Stiffness', 'Hip Pain', 'Fracture Care', 'Spine & Spondylitis'],
    modes: ['In-Clinic OPD', 'Home Visit'],
    bio: 'Specialist in minimally invasive joint care, geriatric mobility restoration, and knee cartilage preservation.',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
    reviews: [
      { author: 'Sukhdeep S.', relation: 'Son in Brampton', rating: 5, comment: 'Dr. Mehra advised conservative physiotherapy for my father’s knee rather than rushing into surgery. Great integrity.', date: '5 days ago' }
    ]
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
    rating: 4.92,
    reviews_count: 198,
    consultation_fee: 1100,
    available_today: true,
    available_slots: ['10:30 AM', '02:00 PM', '05:00 PM'],
    languages: ['Punjabi', 'Hindi', 'English'],
    health_concerns: ['Migraine', 'Tremors', 'Nerve Pain / Neuropathy', 'Memory Loss', 'Vertigo & Balance'],
    modes: ['In-Clinic OPD', 'Video Consultation'],
    bio: 'Expert in cognitive wellness, diabetic neuropathy management, and neuro-rehabilitation.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    reviews: [
      { author: 'Rupinder K.', relation: 'Granddaughter', rating: 5, comment: 'Helped adjust grandmother’s Parkinson’s medication. Significant improvement in trembling.', date: '1 week ago' }
    ]
  },
  {
    _id: 'doc_5',
    id: 'doc_5',
    name: 'Dr. Jasleen Ahluwalia',
    email: 'dr.jasleen@patel.com',
    specialty: 'Diabetologist & Endocrinologist',
    qualification: 'MBBS, MD, Fellowship in Diabetology (UK)',
    experience_years: 15,
    hospital_name: 'Patel Hospital & Cancer Institute',
    hospital_address: 'Civil Lines, Near BMC Chowk, Jalandhar',
    city: 'Jalandhar',
    rating: 4.86,
    reviews_count: 176,
    consultation_fee: 850,
    available_today: true,
    available_slots: ['09:30 AM', '12:30 PM', '03:30 PM'],
    languages: ['Punjabi', 'English', 'Hindi'],
    health_concerns: ['Uncontrolled Sugar', 'HbA1c Reduction', 'Thyroid Imbalance', 'Diabetic Diet Planning'],
    modes: ['In-Clinic OPD', 'Video Consultation'],
    bio: 'Focuses on holistic glycemic control for elderly diabetic patients with customized nutrition guidelines suitable for Punjabi diets.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    reviews: [
      { author: 'Balwinder B.', relation: 'Son in Germany', rating: 5, comment: 'Brought my father’s HbA1c down from 9.2% to 6.8% safely.', date: '4 days ago' }
    ]
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
    rating: 4.85,
    bed_count: 250,
    icu_beds: 45,
    nabh_accredited: true,
    cashless_tpa: true,
    departments: [
      '24/7 Emergency & Trauma Unit',
      'Cardiology & Cardiac Surgery',
      'Internal Medicine & Geriatrics',
      'Nephrology & 24/7 Dialysis',
      'Intensive Care Unit (ICU & CCU)',
      'Orthopedics & Joint Replacement'
    ],
    facilities: [
      '24/7 Advanced Life Support Ambulance',
      'In-House 24/7 Pharmacy',
      'NABL Accredited Pathology Lab',
      'Digital Cardiac Cath Lab & Echo',
      'Dedicated Senior Citizen Fast-Track OPD Desk',
      'Wheelchair Ramps & Electric Stretcher Service',
      'All Major TPA Cashless Insurance Counter'
    ],
    doctors_count: 46,
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80'
  },
  {
    _id: 'hosp_2',
    id: 'hosp_2',
    name: 'Patel Hospital & Cancer Institute',
    city: 'Jalandhar',
    address: 'Civil Lines, Near BMC Chowk, Jalandhar, Punjab 144001',
    phone: '0181-5241000',
    emergency_phone: '0181-5241011',
    has_emergency_24_7: true,
    type: 'Super Speciality & Cancer Institute',
    rating: 4.75,
    bed_count: 220,
    icu_beds: 38,
    nabh_accredited: true,
    cashless_tpa: true,
    departments: [
      'Emergency Care & Trauma',
      'Medical & Surgical Oncology',
      'Gastroenterology & Endoscopy',
      'Pulmonology & Respiratory Care',
      'General & Laparoscopic Surgery'
    ],
    facilities: [
      '24/7 Emergency Wing',
      'Licensed Blood Bank & Component Lab',
      'Daycare Chemotherapy Lounge',
      'Modern High-Resolution 128-Slice CT Scan',
      'Cashless TPA Desk',
      'Valet Parking & Patient Escort'
    ],
    doctors_count: 38,
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
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
    type: 'Daycare & Advanced Diagnostic Hub',
    rating: 4.88,
    bed_count: 25,
    icu_beds: 4,
    nabh_accredited: true,
    cashless_tpa: false,
    departments: [
      'Preventive Health Checkups',
      'Pathology & Biochemistry',
      'Digital Radiology & Ultrasound',
      'Orthopedics & Joint Clinic',
      'Diabetic Foot Care & Wellness'
    ],
    facilities: [
      'Home Sample Collection Wing',
      'Digital X-Ray & 2D-Echocardiogram',
      'Doctor Consultation Suites',
      'Vaccination Centre for Seniors',
      'Online Report Delivery within 4-6 Hours'
    ],
    doctors_count: 22,
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
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
    clinical_summary: {
      bp: '132/84 mmHg',
      pulse: '74 bpm',
      weight: '66 kg',
      diagnosis: 'Essential Hypertension (Controlled), Mild Knee Arthralgia',
      rx_medicines: 'Tab Telmisartan 40mg (1-0-0), Tab Shelcal 500mg (0-1-0)',
      next_followup: 'After 3 months or if BP fluctuates'
    },
    care_fee: 1200,
    created_at: new Date(Date.now() - 3.5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 0.3 * 3600000).toISOString()
  }
];

export const initialAppointments = [
  {
    _id: 'appt_1',
    id: 'appt_1',
    appointment_code: 'APPT-8821',
    token_number: 'OPD-28',
    doctor_id: 'doc_1',
    doctor_name: 'Dr. Rajiv Sharma',
    doctor_specialty: 'General Physician',
    hospital_name: 'Tagore Hospital & Heart Care',
    hospital_address: 'Banda Bahadur Nagar, Mahavir Marg, Jalandhar',
    patient_id: 'fam_mother_64',
    patient_name: 'Jaswant Kaur',
    patient_relation: 'Mother',
    appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointment_time: '10:30 AM',
    consultation_mode: 'In-Clinic OPD',
    reason: 'Follow-up on Blood Pressure & Medicine Refill',
    status: 'confirmed',
    accompanied_by_rep: true,
    representative_name: 'Rajesh Kumar',
    representative_phone: '+91 98722 34567',
    consultation_fee: 800,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'appt_2',
    id: 'appt_2',
    appointment_code: 'APPT-9340',
    token_number: 'OPD-14',
    doctor_id: 'doc_2',
    doctor_name: 'Dr. Preeti Varma',
    doctor_specialty: 'Cardiologist',
    hospital_name: 'City Heart & Vascular Institute',
    hospital_address: 'Mall Road, Near BMC Chowk, Jalandhar',
    patient_id: 'fam_father_68',
    patient_name: 'Harbhajan Singh',
    patient_relation: 'Father',
    appointment_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    appointment_time: '11:15 AM',
    consultation_mode: 'In-Clinic OPD',
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
    description: 'General Physician checkup completed at Tagore Hospital. Prescription renewed.',
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
    notes: 'Advised continuing Telmisartan 40mg once daily after breakfast. Restrict sodium to under 2g/day. Hydration advised.',
    diagnosis: 'Hypertension Stage 1 (Controlled)',
    medicines: ['Telmisartan 40mg (Morning)', 'Shelcal 500mg (Noon)'],
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
    notes: 'Hemoglobin 12.8 g/dL (Normal). Fasting Blood Sugar 98 mg/dL (Normal). HbA1c 5.6% (Normal). Serum Creatinine 0.9 mg/dL.',
    diagnosis: 'Routine Metabolic Panel - All Clear',
    medicines: [],
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
    notes: 'Total Cholesterol 185 mg/dL. Triglycerides within acceptable limits. LDL 102 mg/dL. Advised regular evening walks.',
    diagnosis: 'Borderline Hyperlipidemia',
    medicines: ['Atorvastatin 10mg'],
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const initialVitals = [
  { id: 'v1', family_member_id: 'fam_mother_64', patient_name: 'Jaswant Kaur', type: 'BP', value: '132/84', pulse: 74, status: 'Normal', date: 'Today, 11:45 AM', notes: 'Recorded at Tagore Hospital by Care Associate' },
  { id: 'v2', family_member_id: 'fam_mother_64', patient_name: 'Jaswant Kaur', type: 'BP', value: '138/88', pulse: 78, status: 'Pre-Hypertension', date: '4 days ago', notes: 'Home digital monitor reading' },
  { id: 'v3', family_member_id: 'fam_mother_64', patient_name: 'Jaswant Kaur', type: 'BP', value: '130/82', pulse: 72, status: 'Normal', date: '10 days ago', notes: 'Morning resting reading' },
  { id: 'v4', family_member_id: 'fam_father_68', patient_name: 'Harbhajan Singh', type: 'Blood Sugar', value: '114 mg/dL', subType: 'Fasting', status: 'Normal', date: '3 days ago', notes: 'Fasting glucose before breakfast' },
  { id: 'v5', family_member_id: 'fam_father_68', patient_name: 'Harbhajan Singh', type: 'Blood Sugar', value: '142 mg/dL', subType: 'Post-Meal (PP)', status: 'Optimal', date: '3 days ago', notes: '2 hours after lunch' },
  { id: 'v6', family_member_id: 'fam_father_68', patient_name: 'Harbhajan Singh', type: 'HbA1c', value: '6.4%', status: 'Well-Controlled', date: '2 weeks ago', notes: 'Apollo Lab quarterly test' }
];

export const initialDiagnostics = [
  {
    _id: 'd1',
    id: 'd1',
    test_name: 'Complete Blood Count (CBC) with ESR',
    category: 'Routine Pathology',
    price: 350,
    fasting_required: false,
    sample_type: 'Blood Sample',
    tat: '6 Hours',
    popular: true,
    parameters_count: 24,
    description: 'Checks red & white blood cells, platelets, hemoglobin, and general systemic infection or anemia signs.',
    parameters: ['Hemoglobin (Hb)', 'Total Leucocyte Count (TLC)', 'Platelet Count', 'Neutrophils', 'Lymphocytes', 'ESR (Erythrocyte Sedimentation Rate)'],
    preparation: 'No special fasting required. Can be conducted at any time of the day.'
  },
  {
    _id: 'd2',
    id: 'd2',
    test_name: 'HbA1c (Glycated 3-Month Glucose)',
    category: 'Diabetes Care',
    price: 450,
    fasting_required: false,
    sample_type: 'Blood Sample',
    tat: '6 Hours',
    popular: true,
    parameters_count: 3,
    description: 'Gold-standard test measuring 3-month average blood glucose level for diabetes control and medication efficacy.',
    parameters: ['HbA1c Percentage', 'Estimated Average Glucose (eAG)', 'Total Glycated Hemoglobin'],
    preparation: 'No fasting necessary. Continue routine prescribed diabetes medications.'
  },
  {
    _id: 'd3',
    id: 'd3',
    test_name: 'Lipid Profile (Full Cardiovascular Cholesterol)',
    category: 'Cardiac Health',
    price: 750,
    fasting_required: true,
    sample_type: 'Blood Sample',
    tat: '8 Hours',
    popular: true,
    parameters_count: 8,
    description: 'Measures Total Cholesterol, Good HDL, Bad LDL, VLDL, and Triglycerides to evaluate cardiovascular plaque risk.',
    parameters: ['Total Cholesterol', 'HDL Good Cholesterol', 'LDL Bad Cholesterol', 'Triglycerides', 'VLDL Cholesterol', 'Cholesterol/HDL Ratio'],
    preparation: 'Strict 10-12 hours overnight fasting required. Plain drinking water is permitted.'
  },
  {
    _id: 'd4',
    id: 'd4',
    test_name: 'Senior Citizen Complete Wellness Package',
    category: 'Full Body Packages',
    price: 1999,
    original_price: 3800,
    fasting_required: true,
    sample_type: 'Blood & Urine',
    tat: '12 Hours',
    popular: true,
    parameters_count: 62,
    description: 'Specially designed for parents & seniors: covers Complete Blood Count, HbA1c, Full Lipid, Liver (LFT), Kidney (KFT), Thyroid (TSH), Vitamin D3 & B12, and Urine Routine.',
    parameters: ['CBC (24 parameters)', 'HbA1c & Fasting Glucose', 'Lipid Profile (8 parameters)', 'Kidney Profile (KFT)', 'Liver Function (LFT)', 'Thyroid TSH', 'Vitamin D3 & B12'],
    preparation: '10-12 hours overnight fasting required. Phlebotomist visits home at 07:30 AM or 08:30 AM.'
  },
  {
    _id: 'd5',
    id: 'd5',
    test_name: 'Kidney Function Test (KFT / RFT with Electrolytes)',
    category: 'Organ Profiles',
    price: 700,
    fasting_required: false,
    sample_type: 'Blood Sample',
    tat: '8 Hours',
    popular: false,
    parameters_count: 9,
    description: 'Checks blood urea nitrogen, serum creatinine, uric acid, and critical electrolytes (Sodium, Potassium, Chloride).',
    parameters: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'Uric Acid', 'Serum Sodium', 'Serum Potassium', 'BUN/Creatinine Ratio'],
    preparation: 'Hydrate well with plain water before sample collection.'
  },
  {
    _id: 'd6',
    id: 'd6',
    test_name: 'Liver Function Test (LFT)',
    category: 'Organ Profiles',
    price: 800,
    fasting_required: true,
    sample_type: 'Blood Sample',
    tat: '8 Hours',
    popular: false,
    parameters_count: 11,
    description: 'Evaluates liver enzymes (SGOT, SGPT, Alkaline Phosphatase), Bilirubin levels, and total serum proteins.',
    parameters: ['SGPT (ALT)', 'SGOT (AST)', 'Bilirubin Total & Direct', 'Alkaline Phosphatase', 'Serum Albumin', 'A/G Ratio'],
    preparation: '8 hours fasting recommended. Avoid heavy evening meals prior to test.'
  },
  {
    _id: 'd7',
    id: 'd7',
    test_name: 'Thyroid Profile Total (T3, T4, Ultra TSH)',
    category: 'Endocrine Health',
    price: 550,
    fasting_required: true,
    sample_type: 'Blood Sample',
    tat: '10 Hours',
    popular: false,
    parameters_count: 3,
    description: 'Evaluates thyroid gland activity and metabolic hormone balance.',
    parameters: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Thyroid Stimulating Hormone (TSH)'],
    preparation: 'Morning sample preferred before taking daily morning thyroid medication.'
  }
];

export const initialPharmacyCatalog = [
  {
    id: 'rx_1',
    name: 'Telmisartan 40mg (Telma 40)',
    brand: 'Glenmark Pharmaceuticals',
    category: 'Chronic - Blood Pressure',
    salt: 'Telmisartan 40mg',
    strip_size: 'Strip of 30 Tablets',
    price: 180,
    mrp: 220,
    requires_rx: true,
    dosage: '1 tablet daily in the morning',
    indications: 'Essential hypertension, cardiovascular risk reduction',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_2',
    name: 'Metformin 500mg SR (Glycomet 500 SR)',
    brand: 'USV Ltd',
    category: 'Chronic - Diabetes',
    salt: 'Metformin Hydrochloride (Sustained Release) 500mg',
    strip_size: 'Strip of 20 Tablets',
    price: 65,
    mrp: 85,
    requires_rx: true,
    dosage: '1 tablet after dinner',
    indications: 'Type 2 Diabetes Mellitus glycemic control',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_3',
    name: 'Atorvastatin 10mg (Atorva 10)',
    brand: 'Zydus Cadila',
    category: 'Chronic - Heart & Cholesterol',
    salt: 'Atorvastatin Calcium 10mg',
    strip_size: 'Strip of 15 Tablets',
    price: 110,
    mrp: 145,
    requires_rx: true,
    dosage: '1 tablet at bedtime',
    indications: 'High cholesterol, prevention of atherosclerotic cardiovascular events',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_4',
    name: 'Shelcal 500 (Calcium + Vitamin D3)',
    brand: 'Torrent Pharmaceuticals',
    category: 'Joints & Bone Health',
    salt: 'Calcium 500mg + Vitamin D3 250 IU',
    strip_size: 'Bottle of 60 Tablets',
    price: 240,
    mrp: 290,
    requires_rx: false,
    dosage: '1 tablet daily after breakfast',
    indications: 'Osteopenia, osteoporosis, calcium deficiency in elderly',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_5',
    name: 'Becadexamin Multivitamin & Minerals',
    brand: 'GlaxoSmithKline (GSK)',
    category: 'Daily Wellness & Immunity',
    salt: 'Multivitamins, Minerals and Trace Elements',
    strip_size: 'Bottle of 30 Softgels',
    price: 95,
    mrp: 120,
    requires_rx: false,
    dosage: '1 capsule daily after lunch',
    indications: 'Nutritional immunity support, lethargy, convalescence',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_6',
    name: 'Omron HEM-7120 Digital BP Monitor',
    brand: 'Omron Healthcare',
    category: 'Medical Devices & Monitors',
    salt: 'Automatic Digital Upper Arm Blood Pressure Monitor',
    strip_size: 'Device with Standard Cuff & 3-Yr Warranty',
    price: 1950,
    mrp: 2490,
    requires_rx: false,
    dosage: 'One-touch automatic reading',
    indications: 'Accurate home monitoring of blood pressure and pulse for parents',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'rx_7',
    name: 'Accu-Chek Active 50 Test Strips',
    brand: 'Roche Diabetes Care',
    category: 'Medical Devices & Monitors',
    salt: 'Blood Glucose Test Strips for Accu-Chek Active',
    strip_size: 'Box of 50 Strips',
    price: 920,
    mrp: 1049,
    requires_rx: false,
    dosage: 'Use with Accu-Chek glucometer',
    indications: 'Self-monitoring of blood glucose level',
    in_stock: true,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80'
  }
];

export const initialMedicines = [
  {
    _id: 'med_1',
    id: 'med_1',
    patient_name: 'Jaswant Kaur',
    order_code: 'MED-5541',
    delivery_rider: 'Kewal Singh (+91 98765 43210)',
    items: [
      { name: 'Telmisartan 40mg (Telma 40)', qty: 30, price: 180 },
      { name: 'Shelcal 500 (Calcium + D3)', qty: 30, price: 125 }
    ],
    total_amount: 305,
    status: 'delivered',
    delivery_address: 'House 142, Sector 2, Model Town, Jalandhar',
    ordered_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    delivered_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    is_recurring: true,
    next_refill_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0]
  },
  {
    _id: 'med_2',
    id: 'med_2',
    patient_name: 'Harbhajan Singh',
    order_code: 'MED-5589',
    delivery_rider: 'Baljeet Singh (+91 98111 22334)',
    items: [
      { name: 'Metformin 500mg SR (Glycomet)', qty: 60, price: 140 },
      { name: 'Atorvastatin 10mg (Atorva)', qty: 30, price: 195 }
    ],
    total_amount: 335,
    status: 'in_transit',
    delivery_address: 'House 142, Sector 2, Model Town, Jalandhar',
    ordered_at: new Date(Date.now() - 86400000).toISOString(),
    estimated_delivery: 'Today, by 05:00 PM',
    is_recurring: true,
    next_refill_date: new Date(Date.now() + 29 * 86400000).toISOString().split('T')[0]
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
