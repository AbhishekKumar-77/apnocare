import os
import sys
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from core.db import get_collection, get_db
from core.auth import hash_password

def seed_database():
    print("[+] Seeding ApnoCare MongoDB Database...")

    # 1. Users
    users_col = get_collection('users')
    users_col.delete_one({'email': 'abhishek@apnocare.com'})
    users_col.delete_one({'email': 'rajesh.care@apnocare.com'})
    users_col.delete_one({'email': 'admin@apnocare.com'})

    user_demo = {
        'name': 'Abhishek Sharma',
        'email': 'abhishek@apnocare.com',
        'password': hash_password('password123'),
        'role': 'family_user',
        'phone': '+1 (647) 555-0192', # Living in Canada
        'location': 'Toronto, Canada (Family in Jalandhar, Punjab)',
        'created_at': datetime.utcnow()
    }
    user_res = users_col.insert_one(user_demo)
    user_id = str(user_res.inserted_id)

    rep_demo = {
        'name': 'Rajesh Kumar',
        'email': 'rajesh.care@apnocare.com',
        'password': hash_password('password123'),
        'role': 'care_representative',
        'phone': '+91 98722 34567',
        'location': 'Model Town, Jalandhar',
        'representative_profile': {
            'verification_status': 'verified',
            'verified_at': datetime.utcnow().isoformat(),
            'languages': ['Punjabi', 'Hindi', 'English'],
            'service_area': 'Jalandhar City & Cantt',
            'service_radius_km': 20,
            'government_id_type': 'Aadhaar Card',
            'government_id_number': 'XXXX-XXXX-9182',
            'is_available': True,
            'rating': 4.95,
            'completed_visits': 52,
            'training_status': 'Senior Certified Care Associate',
            'photo_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
        },
        'created_at': datetime.utcnow()
    }
    rep_res = users_col.insert_one(rep_demo)
    rep_id = str(rep_res.inserted_id)

    admin_demo = {
        'name': 'ApnoCare Ops Admin',
        'email': 'admin@apnocare.com',
        'password': hash_password('admin123'),
        'role': 'admin',
        'phone': '+91 1800 123 4567',
        'location': 'Headquarters, India',
        'created_at': datetime.utcnow()
    }
    users_col.insert_one(admin_demo)

    print(f"[OK] Created Demo Users (abhishek@apnocare.com, rajesh.care@apnocare.com, admin@apnocare.com)")

    # 2. Family Members
    fam_col = get_collection('family_members')
    fam_col.delete_one({'user_id': user_id})

    mother_doc = {
        'user_id': user_id,
        'name': 'Jaswant Kaur',
        'relation': 'Mother',
        'age': 64,
        'gender': 'Female',
        'phone': '+91 98140 11223',
        'location': 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
        'city': 'Jalandhar',
        'preferred_language': 'Punjabi',
        'emergency_contact': {
            'name': 'Abhishek Sharma (Son)',
            'phone': '+1 (647) 555-0192',
            'relation': 'Son (Living in Toronto)'
        },
        'blood_group': 'B+',
        'chronic_conditions': ['Hypertension (BP)', 'Mild Osteoarthritis'],
        'allergies': ['Penicillin'],
        'preferred_hospital': 'Tagore Hospital & Heart Care, Jalandhar',
        'notes': 'Takes Telmisartan 40mg daily morning. Prefers morning appointments.',
        'created_at': datetime.utcnow()
    }
    m_res = fam_col.insert_one(mother_doc)
    mother_id = str(m_res.inserted_id)

    father_doc = {
        'user_id': user_id,
        'name': 'Harbhajan Singh',
        'relation': 'Father',
        'age': 68,
        'gender': 'Male',
        'phone': '+91 98140 44556',
        'location': 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
        'city': 'Jalandhar',
        'preferred_language': 'Punjabi',
        'emergency_contact': {
            'name': 'Abhishek Sharma (Son)',
            'phone': '+1 (647) 555-0192',
            'relation': 'Son'
        },
        'blood_group': 'O+',
        'chronic_conditions': ['Type 2 Diabetes', 'High Cholesterol'],
        'allergies': ['None'],
        'preferred_hospital': 'Tagore Hospital & Heart Care, Jalandhar',
        'notes': 'Monitors fasting blood sugar weekly.',
        'created_at': datetime.utcnow()
    }
    f_res = fam_col.insert_one(father_doc)
    father_id = str(f_res.inserted_id)

    print("[OK] Added Family Members (Mother: Jaswant Kaur, Father: Harbhajan Singh)")

    # 3. Doctors
    docs_col = get_collection('doctors')
    # Clear and re-populate
    docs_col.delete_one({'email': 'dr.sharma@tagore.com'})
    docs_col.delete_one({'email': 'dr.preeti@cityheart.com'})
    docs_col.delete_one({'email': 'dr.mehra@apollo.com'})
    docs_col.delete_one({'email': 'dr.simran@sacred.com'})

    doctors_list = [
        {
            'name': 'Dr. Rajiv Sharma',
            'email': 'dr.sharma@tagore.com',
            'specialty': 'General Physician',
            'qualification': 'MBBS, MD (Internal Medicine), FACP',
            'experience_years': 22,
            'hospital_name': 'Tagore Hospital & Heart Care',
            'hospital_address': 'Banda Bahadur Nagar, Jalandhar',
            'city': 'Jalandhar',
            'rating': 4.9,
            'reviews_count': 340,
            'consultation_fee': 800,
            'available_today': True,
            'available_slots': ['10:30 AM', '11:30 AM', '01:00 PM', '04:30 PM'],
            'languages': ['Punjabi', 'Hindi', 'English'],
            'health_concerns': ['Blood Pressure', 'Diabetes', 'Fever', 'Routine Health Checkup', 'Geriatric Health'],
            'image_url': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Dr. Preeti Varma',
            'email': 'dr.preeti@cityheart.com',
            'specialty': 'Cardiologist',
            'qualification': 'MBBS, MD, DM (Cardiology)',
            'experience_years': 18,
            'hospital_name': 'City Heart & Vascular Institute',
            'hospital_address': 'Mall Road, Jalandhar',
            'city': 'Jalandhar',
            'rating': 4.8,
            'reviews_count': 285,
            'consultation_fee': 1200,
            'available_today': True,
            'available_slots': ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
            'languages': ['Hindi', 'English', 'Punjabi'],
            'health_concerns': ['Chest Discomfort', 'Heart Palpitations', 'Hypertension', 'Post-Angioplasty Care'],
            'image_url': 'https://images.unsplash.com/photo-1594824813533-524021272714?w=200&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Dr. Amit Mehra',
            'email': 'dr.mehra@apollo.com',
            'specialty': 'Orthopedic Surgeon',
            'qualification': 'MBBS, MS (Ortho), MCh (Joint Replacement)',
            'experience_years': 16,
            'hospital_name': 'Apollo Clinic & Diagnostic Centre',
            'hospital_address': 'Model Town, Jalandhar',
            'city': 'Jalandhar',
            'rating': 4.75,
            'reviews_count': 210,
            'consultation_fee': 900,
            'available_today': True,
            'available_slots': ['11:00 AM', '01:30 PM', '04:00 PM'],
            'languages': ['Punjabi', 'English'],
            'health_concerns': ['Knee Pain', 'Arthritis', 'Joint Stiffness', 'Fracture Care', 'Backache'],
            'image_url': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Dr. Simran Kaur',
            'email': 'dr.simran@sacred.com',
            'specialty': 'Neurologist',
            'qualification': 'MBBS, MD, DM (Neurology)',
            'experience_years': 14,
            'hospital_name': 'Sacred Heart Super-Speciality Hospital',
            'hospital_address': 'Maqsudan, Jalandhar',
            'city': 'Jalandhar',
            'rating': 4.9,
            'reviews_count': 195,
            'consultation_fee': 1100,
            'available_today': True,
            'available_slots': ['10:30 AM', '02:00 PM', '05:00 PM'],
            'languages': ['Punjabi', 'Hindi', 'English'],
            'health_concerns': ['Migraine', 'Tremors', 'Nerve Pain', 'Memory Loss', 'Vertigo'],
            'image_url': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'
        }
    ]

    for doc in doctors_list:
        docs_col.insert_one(doc)

    print(f"[OK] Added {len(doctors_list)} Verified Doctors in Jalandhar")

    # 4. Hospitals
    hosp_col = get_collection('hospitals')
    hosp_col.delete_one({'name': 'Tagore Hospital & Heart Care'})
    hosp_col.delete_one({'name': 'Patel Hospital'})
    hosp_col.delete_one({'name': 'Apollo Clinic & Diagnostic Centre'})

    hospitals_list = [
        {
            'name': 'Tagore Hospital & Heart Care',
            'city': 'Jalandhar',
            'address': 'Banda Bahadur Nagar, Mahavir Marg, Jalandhar, Punjab 144008',
            'phone': '0181-2244222',
            'emergency_phone': '0181-2244225 (24/7 ER)',
            'has_emergency_24_7': True,
            'type': 'Multi-Super Speciality Hospital',
            'rating': 4.8,
            'departments': ['Emergency & Trauma Care', 'Cardiology & Heart Care', 'Internal Medicine', 'Dialysis', 'Intensive Care Unit (ICU)'],
            'services': ['24/7 Emergency Ambulance', 'Cath Lab', 'Digital Cardiac Monitors', 'In-house Pharmacy', 'NABL Accredited Lab'],
            'doctors_count': 42,
            'image_url': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Patel Hospital',
            'city': 'Jalandhar',
            'address': 'Civil Lines, Near BMC Chowk, Jalandhar, Punjab 144001',
            'phone': '0181-5241000',
            'emergency_phone': '0181-5241011',
            'has_emergency_24_7': True,
            'type': 'Super Speciality & Cancer Institute',
            'rating': 4.7,
            'departments': ['Emergency Care', 'Oncology', 'Gastroenterology', 'General Surgery', 'Pulmonology'],
            'services': ['24/7 Emergency', 'Advanced ICU', 'Blood Bank', 'Pharmacy', 'Diagnostic Imaging'],
            'doctors_count': 38,
            'image_url': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80'
        },
        {
            'name': 'Apollo Clinic & Diagnostic Centre',
            'city': 'Jalandhar',
            'address': 'Plot 18, Model Town Road, Jalandhar, Punjab 144003',
            'phone': '0181-2460111',
            'emergency_phone': '0181-2460112',
            'has_emergency_24_7': False,
            'type': 'Daycare & Diagnostic Centre',
            'rating': 4.85,
            'departments': ['Pathology', 'Radiology', 'Orthopedics', 'Preventive Health', 'Consultation Chambers'],
            'services': ['Home Sample Collection', 'Echo & TMT', 'Digital X-Ray', 'Ultrasound', 'Vaccination Clinic'],
            'doctors_count': 18,
            'image_url': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80'
        }
    ]

    for hosp in hospitals_list:
        hosp_col.insert_one(hosp)

    print(f"[OK] Added {len(hospitals_list)} Hospitals")

    # 5. Diagnostic Catalog
    diag_col = get_collection('diagnostic_tests')
    tests_list = [
        {'test_name': 'Complete Blood Count (CBC)', 'category': 'Routine Pathology', 'price': 350, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '6 Hours'},
        {'test_name': 'HbA1c (Glycated Hemoglobin)', 'category': 'Diabetes Care', 'price': 450, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '6 Hours'},
        {'test_name': 'Lipid Profile (Full Cholesterol)', 'category': 'Cardiac Health', 'price': 750, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '8 Hours'},
        {'test_name': 'Thyroid Profile Total (T3, T4, TSH)', 'category': 'Endocrine Health', 'price': 550, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '12 Hours'},
        {'test_name': 'Kidney Function Test (KFT / RFT)', 'category': 'Organ Profile', 'price': 700, 'fasting_required': False, 'sample_type': 'Blood', 'tat': '8 Hours'},
        {'test_name': 'Liver Function Test (LFT)', 'category': 'Organ Profile', 'price': 800, 'fasting_required': True, 'sample_type': 'Blood', 'tat': '8 Hours'},
        {'test_name': 'Digital Chest X-Ray (PA View)', 'category': 'Radiology', 'price': 450, 'fasting_required': False, 'sample_type': 'In-clinic', 'tat': 'Instant'}
    ]
    for t in tests_list:
        diag_col.insert_one(t)

    print("[OK] Populated Diagnostic Test Catalog")

    # 6. Active Care Request with Real-Time Timeline for Demonstration
    care_col = get_collection('care_requests')
    care_col.delete_one({'request_code': 'CARE-782190'})

    today_str = datetime.utcnow().strftime('%Y-%m-%d')
    active_care_request = {
        'request_code': 'CARE-782190',
        'user_id': user_id,
        'user_name': 'Abhishek Sharma',
        'user_phone': '+1 (647) 555-0192',
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'patient_relation': 'Mother',
        'patient_age': 64,
        'patient_gender': 'Female',
        'patient_phone': '+91 98140 11223',
        'pickup_address': 'House 142, Sector 2, Model Town, Jalandhar, Punjab',
        'city': 'Jalandhar',
        'emergency_contact': {
            'name': 'Abhishek Sharma (Son in Toronto)',
            'phone': '+1 (647) 555-0192',
            'relation': 'Son'
        },
        'service_type': 'Doctor Visit Assistance',
        'preferred_provider_mode': 'selected_provider',
        'preferred_hospital_doctor': 'Dr. Rajiv Sharma at Tagore Hospital',
        'gender_pref': 'Any',
        'language_pref': 'Punjabi',
        'special_instructions': 'Mother walks slowly due to mild knee osteoarthritis. Please assist carefully with vehicle boarding and steps.',
        'scheduled_date': today_str,
        'scheduled_time': '10:00 AM',
        
        'representative_id': rep_id,
        'representative_name': 'Rajesh Kumar',
        'representative_phone': '+91 98722 34567',
        'representative_rating': 4.95,
        'representative_photo': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',

        'status': 'consultation_done', # Active live status currently at Consultation Completed
        'timeline': [
            {
                'stage': 'requested',
                'title': 'Care Request Created',
                'timestamp': (datetime.utcnow() - timedelta(hours=3, minutes=30)).isoformat(),
                'notes': 'Requested Doctor Visit Assistance for Jaswant Kaur from Toronto.'
            },
            {
                'stage': 'assigned',
                'title': 'Care Associate Rajesh Kumar Assigned',
                'timestamp': (datetime.utcnow() - timedelta(hours=3, minutes=20)).isoformat(),
                'notes': 'Matched verified local associate speaking Punjabi within 4km radius.'
            },
            {
                'stage': 'accepted',
                'title': 'Assignment Accepted',
                'timestamp': (datetime.utcnow() - timedelta(hours=3, minutes=10)).isoformat(),
                'notes': 'Rajesh confirmed vehicle readiness and scheduled departure.'
            },
            {
                'stage': 'on_the_way',
                'title': 'Representative On The Way',
                'timestamp': (datetime.utcnow() - timedelta(hours=2, minutes=30)).isoformat(),
                'notes': 'Driving towards Model Town address.'
            },
            {
                'stage': 'reached_home',
                'title': "Reached Patient's Home",
                'timestamp': (datetime.utcnow() - timedelta(hours=2, minutes=5)).isoformat(),
                'notes': 'Met Jaswant Ji at home. Confirmed BP records and ID documents are ready.'
            },
            {
                'stage': 'patient_picked_up',
                'title': 'Patient Accompanied / Picked Up',
                'timestamp': (datetime.utcnow() - timedelta(hours=1, minutes=50)).isoformat(),
                'notes': 'Safely assisted into comfortable AC cab.'
            },
            {
                'stage': 'reached_hospital',
                'title': 'Reached Tagore Hospital & Heart Care',
                'timestamp': (datetime.utcnow() - timedelta(hours=1, minutes=25)).isoformat(),
                'notes': 'Arrived at OPD entrance. Wheelchair provided for comfort.'
            },
            {
                'stage': 'registration_done',
                'title': 'Hospital Registration Completed',
                'timestamp': (datetime.utcnow() - timedelta(hours=1, minutes=0)).isoformat(),
                'notes': 'Token #28 collected. Queue moving smoothly.'
            },
            {
                'stage': 'consultation_done',
                'title': 'Doctor Consultation Completed with Dr. Rajiv Sharma',
                'timestamp': (datetime.utcnow() - timedelta(minutes=20)).isoformat(),
                'notes': 'Dr. Sharma examined Jaswant Ji. Blood pressure is 132/84 (stable). Renewed Telmisartan prescription and advised regular hydration.'
            }
        ],
        'uploaded_documents': [
            {
                'title': "Dr. Sharma's Prescription - Jaswant Kaur",
                'type': 'Prescription',
                'file_url': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
                'uploaded_at': (datetime.utcnow() - timedelta(minutes=15)).isoformat(),
                'uploaded_by': 'Rajesh Kumar (Care Associate)'
            }
        ],
        'care_fee': 1200,
        'created_at': datetime.utcnow() - timedelta(hours=3, minutes=30),
        'updated_at': datetime.utcnow() - timedelta(minutes=20)
    }

    care_col.insert_one(active_care_request)
    print("[OK] Created Demonstration Active Care Request with Live Stepper Timeline (CARE-782190)")

    # 7. Health Records Vault
    vault_col = get_collection('health_records')
    vault_col.delete_one({'title': 'Cardiology & BP Review Prescription'})
    vault_col.delete_one({'title': 'Comprehensive Blood & HbA1c Lab Report'})

    vault_col.insert_one({
        'user_id': user_id,
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'title': 'Cardiology & BP Review Prescription',
        'record_type': 'Prescription',
        'doctor_name': 'Dr. Rajiv Sharma',
        'hospital_name': 'Tagore Hospital & Heart Care',
        'date': today_str,
        'file_url': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
        'notes': 'Advised continuing Telmisartan 40mg once daily after breakfast. Avoid excessive sodium.',
        'created_at': datetime.utcnow()
    })

    vault_col.insert_one({
        'user_id': user_id,
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'title': 'Comprehensive Blood & HbA1c Lab Report',
        'record_type': 'Lab Report',
        'doctor_name': 'Apollo Diagnostics',
        'hospital_name': 'Apollo Diagnostic Centre, Model Town',
        'date': (datetime.utcnow() - timedelta(days=12)).strftime('%Y-%m-%d'),
        'file_url': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80',
        'notes': 'Hemoglobin 12.8 g/dL (Normal). Fasting Blood Sugar 98 mg/dL (Normal). HbA1c 5.6% (Normal).',
        'created_at': datetime.utcnow() - timedelta(days=12)
    })

    # 8. Unified Health Timeline
    timeline_col = get_collection('health_timeline')
    timeline_col.delete_one({'user_id': user_id})

    timeline_col.insert_one({
        'user_id': user_id,
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'event_type': 'Care Assistance',
        'title': 'Physical Care Visit to Tagore Hospital',
        'description': 'Accompanied by Care Associate Rajesh Kumar for OPD consultation.',
        'status': 'In Progress',
        'date': today_str,
        'created_at': datetime.utcnow() - timedelta(hours=3)
    })

    timeline_col.insert_one({
        'user_id': user_id,
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'event_type': 'Prescription Uploaded',
        'title': 'Prescription by Dr. Rajiv Sharma',
        'description': 'Uploaded to Health Vault by Care Associate Rajesh Kumar.',
        'status': 'Completed',
        'date': today_str,
        'created_at': datetime.utcnow() - timedelta(minutes=15)
    })

    timeline_col.insert_one({
        'user_id': user_id,
        'family_member_id': mother_id,
        'patient_name': 'Jaswant Kaur',
        'event_type': 'Diagnostic Report',
        'title': 'CBC & Fasting Blood Sugar Report',
        'description': 'All markers within normal limits. Fasting glucose: 98 mg/dL.',
        'status': 'Completed',
        'date': (datetime.utcnow() - timedelta(days=12)).strftime('%Y-%m-%d'),
        'created_at': datetime.utcnow() - timedelta(days=12)
    })

    print("[OK] Populated Family Health Vault & Chronological Health Timeline")

    # 9. Initial Notifications
    notifs_col = get_collection('notifications')
    notifs_col.delete_one({'user_id': user_id})

    notifs_col.insert_one({
        'user_id': user_id,
        'title': 'Care Assistance: Doctor Consultation Completed',
        'message': "Rajesh Kumar reported: 'Dr. Sharma completed consultation with Jaswant Kaur. Prescription collected.'",
        'type': 'care_status_update',
        'read': False,
        'created_at': datetime.utcnow() - timedelta(minutes=20)
    })

    notifs_col.insert_one({
        'user_id': user_id,
        'title': 'Prescription Saved to Health Vault',
        'message': "A new prescription for Jaswant Kaur from Tagore Hospital is now available in your Health Vault.",
        'type': 'document_uploaded',
        'read': False,
        'created_at': datetime.utcnow() - timedelta(minutes=14)
    })

    print("[SUCCESS] ApnoCare Database Seeding Finished Successfully!")

if __name__ == '__main__':
    seed_database()
