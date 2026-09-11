import { store } from '../config/store.js';

export const getRequests = (req, res) => {
  let list = [...store.serviceRequests];

  if (req.user.role === 'CUSTOMER') {
    list = list.filter((r) => r.customerId === req.user._id);
  } else if (req.user.role === 'REPRESENTATIVE') {
    const rep = store.representatives.find((rep) => rep.userId === req.user._id || rep._id === 'rep_1');
    list = list.filter((r) => r.representativeId === rep?._id);
  } else if (req.user.role === 'PATIENT') {
    const pat = store.patients.find((p) => p.phone === req.user.phone || p._id === 'pat_1');
    list = list.filter((r) => r.patientId === pat?._id);
  }

  // Filter by status if provided
  if (req.query.status) {
    list = list.filter((r) => r.status.toUpperCase() === req.query.status.toUpperCase());
  }

  // Sort latest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    success: true,
    count: list.length,
    data: list,
  });
};

export const getRequestById = (req, res) => {
  const { id } = req.params;
  const request = store.serviceRequests.find((r) => r._id === id);

  if (!request) {
    return res.status(404).json({ success: false, message: 'Assistance request not found.' });
  }

  const representative = request.representativeId
    ? store.representatives.find((rep) => rep._id === request.representativeId)
    : null;

  const patient = store.patients.find((p) => p._id === request.patientId);

  res.status(200).json({
    success: true,
    data: {
      ...request,
      representative,
      patient,
    },
  });
};

export const createRequest = (req, res) => {
  const {
    patientId,
    serviceType,
    category,
    description,
    scheduledDate,
    scheduledTime,
    partnerProvider,
    isEmergency = false,
    documents = [],
  } = req.body;

  const patient = store.patients.find((p) => p._id === patientId);
  if (!patient) {
    return res.status(400).json({ success: false, message: 'Valid family member must be selected.' });
  }

  // Calculate estimated price based on service type
  const pricingMap = {
    'Doctor Appointment': 950,
    'Home Visit': 1200,
    'Hospital Assistance': 1800,
    'Diagnostic Tests': 1100,
    'Medicine Assistance': 650,
    'Report Collection': 500,
    'Medical Transportation': 1400,
    'Follow-up Care': 900,
    'Recovery Assistance': 1600,
    'Emergency Coordination': 2500,
  };

  const estimatedPriceINR = isEmergency ? 2500 : (pricingMap[serviceType] || 1000);

  // Auto-assign suitable verified representative in that city if available
  const availableRep = store.representatives.find(
    (rep) => rep.city.toLowerCase() === patient.city.toLowerCase() && rep.verificationStatus === 'VERIFIED'
  ) || store.representatives[0];

  const newRequest = {
    _id: `req_${Date.now()}`,
    customerId: req.user._id,
    patientId: patient._id,
    patientName: patient.name,
    representativeId: availableRep?._id || null,
    representativeName: availableRep?.name || 'Assigning Representative...',
    serviceType: serviceType || 'Care Assistance',
    category: category || serviceType,
    description: description || 'Family requested healthcare accompaniment and coordination.',
    status: isEmergency ? 'EMERGENCY' : (availableRep ? 'ASSIGNED' : 'ASSIGNING'),
    priority: isEmergency ? 'EMERGENCY' : 'NORMAL',
    city: patient.city,
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTime: scheduledTime || 'As soon as possible',
    partnerProvider: partnerProvider || 'Local Healthcare Provider',
    estimatedPriceINR,
    paymentStatus: 'PAID_DEMO',
    timeline: [
      {
        status: isEmergency ? 'EMERGENCY_TRIGGERED' : 'REQUEST_CREATED',
        title: isEmergency ? '🚨 Emergency SOS Triggered' : 'Assistance Request Created',
        note: isEmergency
          ? 'Emergency response protocol activated. Local coordinator and designated contacts alerted.'
          : `Requested from ${req.user.country || 'Remote'} for ${patient.name} in ${patient.city}.`,
        timestamp: new Date().toISOString(),
      },
      ...(availableRep && !isEmergency ? [
        {
          status: 'ASSIGNED',
          title: `Care Representative Assigned: ${availableRep.name}`,
          note: `Verified local coordinator (${availableRep.badgeId}) assigned. Initial review in progress.`,
          timestamp: new Date().toISOString(),
        }
      ] : []),
    ],
    documents: documents || [],
    createdAt: new Date().toISOString(),
  };

  store.serviceRequests.unshift(newRequest);

  // Create In-App Notification for Customer
  store.notifications.unshift({
    _id: `notif_${Date.now()}`,
    userId: req.user._id,
    title: isEmergency ? '🚨 Emergency Request Created' : `Assistance Request: ${serviceType}`,
    message: isEmergency
      ? `Emergency coordinator contacted for ${patient.name}. Stay tuned for updates.`
      : `Request #${newRequest._id} created for ${patient.name}. Care representative assigned.`,
    type: isEmergency ? 'EMERGENCY' : 'REQUEST_UPDATE',
    read: false,
    createdAt: new Date().toISOString(),
  });

  // Audit Log
  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: isEmergency ? 'EMERGENCY_REQUEST_TRIGGERED' : 'REQUEST_CREATED',
    target: `Request #${newRequest._id}`,
    details: `${serviceType} for ${patient.name} in ${patient.city}`,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({
    success: true,
    message: isEmergency
      ? 'Emergency SOS triggered! Local coordinator and family notified immediately.'
      : 'Assistance request created successfully.',
    data: newRequest,
  });
};

export const updateMilestone = (req, res) => {
  const { id } = req.params;
  const { status, title, note, document } = req.body;

  const request = store.serviceRequests.find((r) => r._id === id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found.' });
  }

  const milestone = {
    status: status || request.status,
    title: title || `Status Updated: ${status}`,
    note: note || `Updated by ${req.user.name}`,
    timestamp: new Date().toISOString(),
  };

  request.status = status || request.status;
  request.timeline.push(milestone);

  if (document) {
    request.documents.push(document);
  }

  if (status === 'COMPLETED') {
    request.completedAt = new Date().toISOString();
  }

  // Notify customer
  store.notifications.unshift({
    _id: `notif_${Date.now()}`,
    userId: request.customerId,
    title: `Update: ${request.serviceType} for ${request.patientName}`,
    message: `${milestone.title} - ${milestone.note}`,
    type: 'REQUEST_UPDATE',
    read: false,
    createdAt: new Date().toISOString(),
  });

  // Audit log
  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'REQUEST_STATUS_UPDATED',
    target: `Request #${request._id}`,
    details: `Moved to state: ${status}`,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: 'Request milestone updated.',
    data: request,
  });
};

export const assignRepresentative = (req, res) => {
  const { id } = req.params;
  const { representativeId } = req.body;

  const request = store.serviceRequests.find((r) => r._id === id);
  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found.' });
  }

  const rep = store.representatives.find((r) => r._id === representativeId);
  if (!rep) {
    return res.status(404).json({ success: false, message: 'Representative not found.' });
  }

  request.representativeId = rep._id;
  request.representativeName = rep.name;
  request.status = 'ASSIGNED';
  request.timeline.push({
    status: 'ASSIGNED',
    title: `Reassigned to ${rep.name}`,
    note: `Assigned by operations administrator (${rep.badgeId}).`,
    timestamp: new Date().toISOString(),
  });

  // Notify representative
  if (rep.userId) {
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      userId: rep.userId,
      title: 'New Service Request Assigned',
      message: `You have been assigned to assist ${request.patientName} (${request.serviceType}) in ${request.city}.`,
      type: 'TASK_ASSIGNMENT',
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  res.status(200).json({
    success: true,
    message: `Assigned ${rep.name} to request #${request._id}`,
    data: request,
  });
};
