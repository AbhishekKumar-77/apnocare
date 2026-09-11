import { store } from '../config/store.js';

export const getPatients = (req, res) => {
  const customerId = req.user.role === 'ADMIN' ? req.query.customerId : req.user._id;

  const patients = customerId
    ? store.patients.filter((p) => p.customerId === customerId)
    : store.patients;

  // Enrich with active request status
  const enriched = patients.map((p) => {
    const activeReq = store.serviceRequests.find(
      (r) => r.patientId === p._id && !['COMPLETED', 'CANCELLED'].includes(r.status)
    );
    return {
      ...p,
      activeRequest: activeReq || null,
      documentsCount: store.healthRecords.filter((d) => d.patientId === p._id).length,
    };
  });

  res.status(200).json({ success: true, count: enriched.length, data: enriched });
};

export const getPatientById = (req, res) => {
  const { id } = req.params;
  const patient = store.patients.find((p) => p._id === id);

  if (!patient) {
    return res.status(404).json({ success: false, message: 'Family member profile not found.' });
  }

  const requests = store.serviceRequests.filter((r) => r.patientId === id);
  const healthRecords = store.healthRecords.filter((h) => h.patientId === id);

  res.status(200).json({
    success: true,
    data: {
      ...patient,
      requests,
      healthRecords,
    },
  });
};

export const createPatient = (req, res) => {
  const {
    name,
    relationship = 'Parent',
    age,
    gender,
    phone,
    address,
    city = 'Jalandhar',
    state = 'Punjab',
    pincode,
    bloodGroup,
    mobility,
    primaryDoctor,
    emergencyContactName,
    emergencyContactPhone,
    currentMedications = [],
  } = req.body;

  if (!name || !phone || !city) {
    return res.status(400).json({
      success: false,
      message: 'Name, contact phone, and Indian city are required.',
    });
  }

  const newPatient = {
    _id: `pat_${Date.now()}`,
    customerId: req.user._id,
    name,
    relationship,
    age: age ? Number(age) : 65,
    gender: gender || 'Not Specified',
    phone,
    address: address || '',
    city,
    state,
    pincode: pincode || '',
    bloodGroup: bloodGroup || 'O+',
    mobility: mobility || 'Independent',
    primaryDoctor: primaryDoctor || 'General Physician',
    emergencyContactName: emergencyContactName || 'Family Doctor',
    emergencyContactPhone: emergencyContactPhone || phone,
    currentMedications: Array.isArray(currentMedications) ? currentMedications : [],
    createdAt: new Date().toISOString(),
  };

  store.patients.unshift(newPatient);

  // Log in Audit Trail
  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'PATIENT_PROFILE_CREATED',
    target: `${newPatient.name} (${newPatient.relationship})`,
    details: `Added new family member located in ${newPatient.city}, ${newPatient.state}`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: `${newPatient.name} added to your family care dashboard.`,
    data: newPatient,
  });
};

export const updatePatient = (req, res) => {
  const { id } = req.params;
  const index = store.patients.findIndex((p) => p._id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Patient not found.' });
  }

  store.patients[index] = {
    ...store.patients[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: 'Health profile updated successfully.',
    data: store.patients[index],
  });
};
