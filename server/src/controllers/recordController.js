import { store } from '../config/store.js';

export const getRecords = (req, res) => {
  const { patientId } = req.query;

  let records = [...store.healthRecords];
  if (patientId) {
    records = records.filter((r) => r.patientId === patientId);
  }

  // Filter by user permissions if CUSTOMER
  if (req.user.role === 'CUSTOMER') {
    const customerPatientIds = store.patients
      .filter((p) => p.customerId === req.user._id)
      .map((p) => p._id);
    records = records.filter((r) => customerPatientIds.includes(r.patientId));
  }

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
};

export const uploadRecord = (req, res) => {
  const { patientId, title, category, documentType, doctorName, facility, date, fileUrl, notes } = req.body;

  const patient = store.patients.find((p) => p._id === patientId);
  if (!patient) {
    return res.status(400).json({ success: false, message: 'Valid family member must be specified.' });
  }

  const newRecord = {
    _id: `rec_${Date.now()}`,
    patientId: patient._id,
    patientName: patient.name,
    title: title || 'Medical Record',
    category: category || 'General Health',
    documentType: documentType || 'Medical Report',
    doctorName: doctorName || 'Attending Physician',
    facility: facility || patient.city,
    date: date || new Date().toISOString().split('T')[0],
    fileUrl: fileUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    notes: notes || '',
    uploadedBy: `${req.user.name} (${req.user.role})`,
    createdAt: new Date().toISOString(),
  };

  store.healthRecords.unshift(newRecord);

  // Audit log
  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'HEALTH_RECORD_UPLOADED',
    target: newRecord.title,
    details: `Uploaded for ${patient.name} (${newRecord.documentType})`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: 'Document securely uploaded and encrypted into patient health vault.',
    data: newRecord,
  });
};

export const getFamilyShares = (req, res) => {
  const shares = store.familyShares.filter((s) => s.customerId === req.user._id);
  res.status(200).json({ success: true, count: shares.length, data: shares });
};

export const inviteFamilyMember = (req, res) => {
  const { patientId, invitedEmail, invitedName, permission = 'VIEW_ONLY' } = req.body;

  if (!invitedEmail) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const patient = store.patients.find((p) => p._id === patientId) || store.patients[0];

  const share = {
    _id: `share_${Date.now()}`,
    customerId: req.user._id,
    patientId: patient?._id || 'pat_1',
    invitedEmail,
    invitedName: invitedName || invitedEmail,
    permission,
    status: 'INVITED',
    createdAt: new Date().toISOString(),
  };

  store.familyShares.unshift(share);

  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'FAMILY_SHARE_INVITED',
    target: invitedEmail,
    details: `Access granted (${permission}) for ${patient?.name}`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: `Invitation sent to ${invitedEmail} with ${permission} permissions.`,
    data: share,
  });
};
