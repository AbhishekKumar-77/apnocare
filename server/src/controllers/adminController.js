import { store } from '../config/store.js';

export const getAdminAnalytics = (req, res) => {
  const totalCustomers = store.users.filter((u) => u.role === 'CUSTOMER').length;
  const totalPatients = store.patients.length;
  const totalRequests = store.serviceRequests.length;
  const activeRequests = store.serviceRequests.filter((r) => !['COMPLETED', 'CANCELLED'].includes(r.status)).length;
  const completedRequests = store.serviceRequests.filter((r) => r.status === 'COMPLETED').length;
  const emergencyRequests = store.serviceRequests.filter((r) => r.priority === 'EMERGENCY' || r.status === 'EMERGENCY').length;
  const verifiedReps = store.representatives.filter((r) => r.verificationStatus === 'VERIFIED').length;

  // Calculate total revenue
  const totalRevenueINR = store.serviceRequests.reduce((sum, r) => sum + (r.estimatedPriceINR || 0), 0) +
    store.subscriptions.reduce((sum, s) => sum + (s.priceINR || 0), 0);

  // Category breakdown
  const serviceCategories = {};
  store.serviceRequests.forEach((r) => {
    serviceCategories[r.serviceType] = (serviceCategories[r.serviceType] || 0) + 1;
  });

  // City breakdown
  const cityRequests = {};
  store.serviceRequests.forEach((r) => {
    cityRequests[r.city] = (cityRequests[r.city] || 0) + 1;
  });

  res.status(200).json({
    success: true,
    metrics: {
      totalCustomers,
      totalPatients,
      totalRequests,
      activeRequests,
      completedRequests,
      emergencyRequests,
      verifiedReps,
      totalRevenueINR,
      completionRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 100,
      customerSatisfaction: 4.9,
    },
    serviceCategories,
    cityRequests,
    recentAuditLogs: store.auditLogs.slice(0, 10),
  });
};

export const getRepresentatives = (req, res) => {
  res.status(200).json({
    success: true,
    count: store.representatives.length,
    data: store.representatives,
  });
};

export const updateRepresentativeVerification = (req, res) => {
  const { id } = req.params;
  const { verificationStatus, policeVerificationStatus, trainingCompleted } = req.body;

  const rep = store.representatives.find((r) => r._id === id);
  if (!rep) {
    return res.status(404).json({ success: false, message: 'Representative not found.' });
  }

  if (verificationStatus) rep.verificationStatus = verificationStatus;
  if (policeVerificationStatus) rep.policeVerificationStatus = policeVerificationStatus;
  if (typeof trainingCompleted === 'boolean') rep.trainingCompleted = trainingCompleted;

  // Audit Log
  store.auditLogs.unshift({
    _id: `log_${Date.now()}`,
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'REPRESENTATIVE_STATUS_CHANGE',
    target: `${rep.name} (${rep.badgeId})`,
    details: `Status set to ${rep.verificationStatus}, Police: ${rep.policeVerificationStatus}`,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json({
    success: true,
    message: `Representative ${rep.name} status updated to ${rep.verificationStatus}`,
    data: rep,
  });
};

export const getPartners = (req, res) => {
  res.status(200).json({
    success: true,
    count: store.partners.length,
    data: store.partners,
  });
};

export const createPartner = (req, res) => {
  const { name, type, city, address, phone, website, services } = req.body;

  if (!name || !type || !city) {
    return res.status(400).json({ success: false, message: 'Name, type, and city are required.' });
  }

  const newPartner = {
    _id: `part_${Date.now()}`,
    name,
    type,
    city,
    address: address || '',
    phone: phone || '',
    website: website || '',
    services: Array.isArray(services) ? services : ['General Support'],
    verified: true,
    rating: 5.0,
  };

  store.partners.push(newPartner);

  res.status(201).json({
    success: true,
    message: 'Healthcare partner registered.',
    data: newPartner,
  });
};

export const getServiceAreas = (req, res) => {
  res.status(200).json({
    success: true,
    serviceAreas: store.serviceAreas,
    waitlistCount: store.waitlist.length,
    waitlist: store.waitlist,
  });
};

export const addToWaitlist = (req, res) => {
  const { name, email, phone, patientCity, state, neededService } = req.body;

  if (!name || !email || !patientCity) {
    return res.status(400).json({ success: false, message: 'Name, email, and patient city are required.' });
  }

  const entry = {
    _id: `wl_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    patientCity,
    state: state || 'India',
    neededService: neededService || 'Elderly Care Assistance',
    createdAt: new Date().toISOString(),
  };

  store.waitlist.unshift(entry);

  res.status(201).json({
    success: true,
    message: `Thank you! You have been added to the priority waitlist for ${patientCity}. We will notify you when ApnoCare launches in your area.`,
    data: entry,
  });
};

export const getAuditLogs = (req, res) => {
  res.status(200).json({
    success: true,
    count: store.auditLogs.length,
    data: store.auditLogs,
  });
};
