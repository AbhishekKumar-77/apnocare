import { store } from '../config/store.js';

export const getAssignedTasks = (req, res) => {
  const rep = store.representatives.find((r) => r.userId === req.user._id || r._id === 'rep_1');

  if (!rep) {
    return res.status(404).json({ success: false, message: 'Representative profile not found.' });
  }

  const tasks = store.serviceRequests.filter((r) => r.representativeId === rep._id);

  res.status(200).json({
    success: true,
    repProfile: rep,
    count: tasks.length,
    data: tasks,
  });
};

export const updateTaskStatus = (req, res) => {
  const { id } = req.params;
  const { action, note, documentName, documentUrl, documentType } = req.body;

  const request = store.serviceRequests.find((r) => r._id === id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const stepStatusMap = {
    ACCEPT: { status: 'ACCEPTED', title: 'Task Accepted by Representative' },
    CONTACT: { status: 'PATIENT_CONTACTED', title: 'Patient Contacted by Phone' },
    ON_THE_WAY: { status: 'ON_THE_WAY', title: 'Representative is En Route' },
    ARRIVED: { status: 'ARRIVED', title: 'Representative Arrived at Patient Location' },
    AT_CLINIC: { status: 'AT_CLINIC', title: 'Patient & Representative Reached Clinic/Hospital' },
    UPLOAD_DOC: { status: 'DOCUMENTS_UPLOADED', title: 'Medical Document / Receipt Uploaded' },
    COMPLETE: { status: 'COMPLETED', title: 'Service Successfully Completed' },
  };

  const step = stepStatusMap[action] || { status: 'IN_PROGRESS', title: 'Update Logged' };

  request.status = step.status;
  request.timeline.push({
    status: step.status,
    title: step.title,
    note: note || `Updated by Care Representative (${req.user.name})`,
    timestamp: new Date().toISOString(),
  });

  if (documentUrl) {
    const docObj = {
      name: documentName || 'Prescription_Document.pdf',
      url: documentUrl,
      type: documentType || 'Medical Report',
      uploadedAt: new Date().toISOString(),
    };
    request.documents.push(docObj);

    // Also automatically file in patient's permanent Health Vault
    store.healthRecords.unshift({
      _id: `rec_${Date.now()}`,
      patientId: request.patientId,
      patientName: request.patientName,
      title: documentName || `${request.serviceType} Document`,
      category: request.category || 'General Health',
      documentType: documentType || 'Medical Report',
      doctorName: 'Attending Physician',
      facility: request.partnerProvider || request.city,
      date: new Date().toISOString().split('T')[0],
      fileUrl: documentUrl,
      notes: note || 'Uploaded by Care Representative during service.',
      uploadedBy: `${req.user.name} (Representative)`,
      createdAt: new Date().toISOString(),
    });
  }

  if (step.status === 'COMPLETED') {
    request.completedAt = new Date().toISOString();
  }

  // Notify Family Customer
  store.notifications.unshift({
    _id: `notif_${Date.now()}`,
    userId: request.customerId,
    title: `Live Update: ${step.title}`,
    message: `${step.title} for ${request.patientName} (${request.city}). ${note ? `Note: "${note}"` : ''}`,
    type: 'MILESTONE_ALERT',
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: `Status updated to ${step.status}`,
    data: request,
  });
};
