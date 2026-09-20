import { User } from '../models/user.model';
import { Election } from '../models/election.model';
import { Candidate } from '../models/candidate.model';
import { Party } from '../models/party.model';
import { PollingBooth } from '../models/booth.model';
import { AuditEvent } from '../models/audit.model';
import { ServiceHealth, KafkaTopicMetric, CassandraNodeMetric } from '../models/system.model';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    voterId: 'VTR-2026-88210',
    name: 'Hira Kumar',
    email: 'hira.voter@evote.gov.in',
    mobileNumber: '9876543210',
    dateOfBirth: '1998-05-14',
    age: 28,
    gender: 'Male',
    address: 'Flat 402, Shanti Vihar, Ward 12',
    city: 'Sitamarhi',
    state: 'Bihar',
    pincode: '843302',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-101',
    role: 'VOTER',
    verificationStatus: 'VERIFIED',
    hasVoted: false,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'usr-002',
    voterId: 'VTR-2026-10492',
    name: 'Sunita Sharma',
    email: 'sunita.rep@abcparty.org',
    mobileNumber: '9811223344',
    dateOfBirth: '1985-11-20',
    age: 41,
    gender: 'Female',
    address: '14 Vikas Marg, Ward 12',
    city: 'Sitamarhi',
    state: 'Bihar',
    pincode: '843302',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-101',
    role: 'PARTY_REP',
    partyName: 'Aam Vikas Party (AVP)',
    verificationStatus: 'VERIFIED',
    hasVoted: false
  },
  {
    id: 'usr-003',
    voterId: 'OFF-2026-0044',
    name: 'Rajesh N. Verma',
    email: 'rajesh.verma@eci.gov.in',
    mobileNumber: '9871100223',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-101',
    role: 'OFFICER',
    officerBadgeId: 'ECI-OFF-902',
    verificationStatus: 'VERIFIED',
    hasVoted: false
  },
  {
    id: 'usr-004',
    voterId: 'OBS-2026-0012',
    name: 'Dr. Ananya Sen (IAS Retd.)',
    email: 'ananya.sen@election-observer.org',
    mobileNumber: '9988776655',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-101',
    role: 'OBSERVER',
    verificationStatus: 'VERIFIED',
    hasVoted: false
  },
  {
    id: 'usr-005',
    voterId: 'ADM-2026-0001',
    name: 'Vikramaditya Rao',
    email: 'superadmin@evote.gov.in',
    mobileNumber: '9000000001',
    wardNumber: 'HQ',
    constituency: 'State Commission',
    pollingBoothId: 'booth-100',
    role: 'SUPER_ADMIN',
    verificationStatus: 'VERIFIED',
    hasVoted: false
  },
  {
    id: 'usr-006',
    voterId: 'SYS-2026-0002',
    name: 'DevOps Lead Engineer',
    email: 'sysadmin@infrastructure.evote.gov.in',
    mobileNumber: '9000000002',
    wardNumber: 'DC-01',
    constituency: 'Infrastructure Zone',
    pollingBoothId: 'booth-100',
    role: 'SYSTEM_ADMIN',
    verificationStatus: 'VERIFIED',
    hasVoted: false
  },
  {
    id: 'usr-007',
    voterId: 'VTR-2026-90311',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@gmail.com',
    mobileNumber: '9422019283',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-101',
    role: 'VOTER',
    verificationStatus: 'PENDING',
    hasVoted: false
  },
  {
    id: 'usr-008',
    voterId: 'VTR-2026-77402',
    name: 'Kavita Patel',
    email: 'kavita.p@gmail.com',
    mobileNumber: '9372109845',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    pollingBoothId: 'booth-102',
    role: 'VOTER',
    verificationStatus: 'VERIFIED',
    hasVoted: true
  }
];

export const MOCK_ELECTIONS: Election[] = [
  {
    id: 'elec-2026-01',
    title: 'Sitamarhi Municipal Corporation Election 2026',
    type: 'MUNICIPAL',
    ward: 'Ward 12',
    constituency: 'Sitamarhi Central',
    state: 'Bihar',
    district: 'Sitamarhi',
    status: 'ACTIVE',
    startDate: '2026-08-22',
    endDate: '2026-08-22',
    startTime: '07:00 AM',
    endTime: '06:00 PM',
    totalVoters: 45820,
    totalVotesCast: 32421,
    turnoutPercentage: 70.75,
    totalBooths: 42,
    description: 'General election for Municipal Councilors and Ward 12 representative for local governance and development.'
  },
  {
    id: 'elec-2026-02',
    title: 'Gram Panchayat General Election 2026',
    type: 'PANCHAYAT',
    ward: 'Block 4',
    constituency: 'Dumra Rural',
    state: 'Bihar',
    district: 'Sitamarhi',
    status: 'UPCOMING',
    startDate: '2026-09-05',
    endDate: '2026-09-05',
    startTime: '08:00 AM',
    endTime: '05:00 PM',
    totalVoters: 28400,
    totalVotesCast: 0,
    turnoutPercentage: 0,
    totalBooths: 28,
    description: 'Panchayat Samiti & Mukhiya election for local rural council administration.'
  },
  {
    id: 'elec-2026-03',
    title: 'Ward Development Committee By-Election',
    type: 'WARD_COMMITTEE',
    ward: 'Ward 08',
    constituency: 'Sitamarhi East',
    state: 'Bihar',
    district: 'Sitamarhi',
    status: 'UPCOMING',
    startDate: '2026-09-12',
    endDate: '2026-09-12',
    startTime: '07:30 AM',
    endTime: '05:30 PM',
    totalVoters: 14200,
    totalVotesCast: 0,
    turnoutPercentage: 0,
    totalBooths: 14,
    description: 'Special by-election for Ward 08 local committee chairperson seat.'
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    electionId: 'elec-2026-01',
    name: 'Raj Kumar',
    partyName: 'Aam Vikas Party (AVP)',
    partyCode: 'AVP',
    symbol: '🌳',
    symbolName: 'Banyan Tree (Vriksha)',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 44,
    education: 'Post Graduate (M.A. Public Admin)',
    profession: 'Social Worker & Educator',
    verificationStatus: 'VERIFIED',
    ballotPosition: 1,
    votesReceived: 10420,
    manifestoSummary: '24x7 Clean Drinking Water, Solar Street Lights, Upgraded Ward Dispensary, and Women Self Help Group grants.',
    affidavitUrl: '/assets/docs/affidavit_cand_001.pdf'
  },
  {
    id: 'cand-002',
    electionId: 'elec-2026-01',
    name: 'Priya Sharma',
    partyName: 'Pragati Seva Sangh (PSS)',
    partyCode: 'PSS',
    symbol: '⭐',
    symbolName: 'Bright Star (Taara)',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 38,
    education: 'B.Tech Civil Engineering',
    profession: 'Urban Infrastructure Planner',
    verificationStatus: 'VERIFIED',
    ballotPosition: 2,
    votesReceived: 12150,
    manifestoSummary: 'Modern underground drainage, Zero waterlogging guarantee, smart digital ward office, and open green parks.',
    affidavitUrl: '/assets/docs/affidavit_cand_002.pdf'
  },
  {
    id: 'cand-003',
    electionId: 'elec-2026-01',
    name: 'Aman Singh',
    partyName: 'Rashtriya Janata Dal Morcha',
    partyCode: 'RJDM',
    symbol: '🐘',
    symbolName: 'Elephant (Gajraj)',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 51,
    education: 'LL.B. (Law Graduate)',
    profession: 'Advocate & Municipal Legal Advisor',
    verificationStatus: 'VERIFIED',
    ballotPosition: 3,
    votesReceived: 7890,
    manifestoSummary: 'Youth employment skill center, transparency in tender allocation, free legal aid clinic for residents.',
    affidavitUrl: '/assets/docs/affidavit_cand_003.pdf'
  },
  {
    id: 'cand-004',
    electionId: 'elec-2026-01',
    name: 'Harpreet Kaur',
    partyName: 'Kisan Shramik Union',
    partyCode: 'KSU',
    symbol: '🚜',
    symbolName: 'Tractor (Kisan)',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 42,
    education: 'M.Sc Agriculture',
    profession: 'Farmer Cooperative Leader',
    verificationStatus: 'VERIFIED',
    ballotPosition: 4,
    votesReceived: 1420,
    manifestoSummary: 'Direct market linkages for local produce, dairy refrigeration hubs, and organic waste management.',
    affidavitUrl: '/assets/docs/affidavit_cand_004.pdf'
  },
  {
    id: 'cand-005',
    electionId: 'elec-2026-01',
    name: 'Dr. Suresh Chandra',
    partyName: 'Lok Suraksha Parishad',
    partyCode: 'LSP',
    symbol: '☀️',
    symbolName: 'Rising Sun (Surya)',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 60,
    education: 'M.B.B.S., M.D.',
    profession: 'Senior Physician',
    verificationStatus: 'VERIFIED',
    ballotPosition: 5,
    votesReceived: 541,
    manifestoSummary: 'Mobile medical dispensaries, elder care support cells, and health cards for all residents.',
    affidavitUrl: '/assets/docs/affidavit_cand_005.pdf'
  },
  {
    id: 'cand-nota',
    electionId: 'elec-2026-01',
    name: 'None of the Above (NOTA)',
    partyName: 'Independent Election Option',
    partyCode: 'NOTA',
    symbol: '❌',
    symbolName: 'None of the Above',
    photoUrl: '',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    age: 0,
    education: 'Statutory Voter Right',
    profession: 'Constitutional Expression',
    verificationStatus: 'VERIFIED',
    isNota: true,
    ballotPosition: 6,
    votesReceived: 0,
    manifestoSummary: 'Voter right to reject all listed candidates under Election Conduct Rules.'
  }
];

export const MOCK_PARTIES: Party[] = [
  {
    id: 'party-01',
    name: 'Aam Vikas Party (AVP)',
    code: 'AVP',
    symbol: '🌳',
    symbolName: 'Banyan Tree',
    presidentName: 'Shri Ramakant Sharma',
    headquarters: 'Patna, Bihar',
    contactEmail: 'contact@avp.org',
    contactPhone: '+91 612 2200112',
    registrationNumber: 'ECI/PP/2021/889',
    candidateCount: 18,
    manifestoFile: {
      name: 'AVP_Local_Manifesto_2026.pdf',
      size: '2.4 MB',
      uploadedAt: '2026-08-10 14:30',
      url: '#'
    },
    manifestoKeyPoints: [
      'Universal clean piped water supply to every household',
      'Modern digital library and skill center in every ward',
      'Zero-tolerance policy on road contractor corruption',
      '100% LED street lighting coverage with smart sensors'
    ]
  },
  {
    id: 'party-02',
    name: 'Pragati Seva Sangh (PSS)',
    code: 'PSS',
    symbol: '⭐',
    symbolName: 'Bright Star',
    presidentName: 'Smt. Vandana Gupta',
    headquarters: 'Muzaffarpur, Bihar',
    contactEmail: 'info@pragatiseva.org',
    contactPhone: '+91 621 2891004',
    registrationNumber: 'ECI/PP/2019/341',
    candidateCount: 22,
    manifestoFile: {
      name: 'PSS_Vision_2026_Sitamarhi.pdf',
      size: '3.1 MB',
      uploadedAt: '2026-08-12 11:15',
      url: '#'
    },
    manifestoKeyPoints: [
      'Comprehensive underground drainage and flood prevention',
      'Subsidized solar rooftop incentives for residential colonies',
      'Doorstep municipal certificate delivery within 48 hours',
      'Upgraded primary health centers with 24x7 ambulance'
    ]
  }
];

export const MOCK_BOOTHS: PollingBooth[] = [
  {
    id: 'booth-101',
    code: 'PB-12-01',
    name: 'Government Girls High School (North Wing)',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    locationAddress: 'Station Road, Near Gandhi Chowk',
    latitude: 26.5921,
    longitude: 85.4912,
    officerInCharge: 'Rajesh N. Verma',
    contactNumber: '+91 9871100223',
    totalRegisteredVoters: 1150,
    votesCast: 840,
    turnoutPercentage: 73.04,
    evmUnitNumber: 'EVM-IN-88902',
    batteryLevel: 94,
    status: 'ONLINE',
    lastHeartbeat: 'Just now (12s ago)',
    networkLatencyMs: 18
  },
  {
    id: 'booth-102',
    code: 'PB-12-02',
    name: 'Government Girls High School (South Wing)',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    locationAddress: 'Station Road, Near Gandhi Chowk',
    latitude: 26.5925,
    longitude: 85.4915,
    officerInCharge: 'Rameshwar Thakur',
    contactNumber: '+91 9871100445',
    totalRegisteredVoters: 1080,
    votesCast: 792,
    turnoutPercentage: 73.33,
    evmUnitNumber: 'EVM-IN-88903',
    batteryLevel: 89,
    status: 'ONLINE',
    lastHeartbeat: '18s ago',
    networkLatencyMs: 24
  },
  {
    id: 'booth-103',
    code: 'PB-12-03',
    name: 'Community Development Hall',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    locationAddress: 'Shanti Nagar, Sector 3',
    latitude: 26.5880,
    longitude: 85.4890,
    officerInCharge: 'Manju Kumari',
    contactNumber: '+91 9871100778',
    totalRegisteredVoters: 1220,
    votesCast: 810,
    turnoutPercentage: 66.39,
    evmUnitNumber: 'EVM-IN-88910',
    batteryLevel: 98,
    status: 'ONLINE',
    lastHeartbeat: '4s ago',
    networkLatencyMs: 15
  },
  {
    id: 'booth-104',
    code: 'PB-12-04',
    name: 'Primary Model Urdu School',
    wardNumber: 'Ward 12',
    constituency: 'Sitamarhi Central',
    locationAddress: 'Old Bazar Road',
    latitude: 26.5950,
    longitude: 85.4970,
    officerInCharge: 'Syed Tariq Anwar',
    contactNumber: '+91 9871100991',
    totalRegisteredVoters: 980,
    votesCast: 690,
    turnoutPercentage: 70.41,
    evmUnitNumber: 'EVM-IN-88915',
    batteryLevel: 78,
    status: 'ONLINE',
    lastHeartbeat: '8s ago',
    networkLatencyMs: 21
  }
];

export const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-9901',
    timestamp: '2026-08-22 11:24:05',
    eventType: 'BALLOT_CAST_SUCCESS',
    actor: 'ANONYMOUS_VOTER',
    role: 'VOTER',
    ipAddress: '10.14.8.42',
    resource: 'EVM-IN-88902',
    details: 'Digital Ballot securely cast and encrypted via ECC-256 with verifiable zero-knowledge stamp.',
    severity: 'INFO',
    status: 'SUCCESS',
    blockchainTxHash: '0x8f2a9910d5e8812c3b889e1a90c441b897621fec88019ab98'
  },
  {
    id: 'aud-9902',
    timestamp: '2026-08-22 11:20:18',
    eventType: 'VOTER_AUTHENTICATED',
    actor: 'VTR-2026-88210',
    role: 'VOTER',
    ipAddress: '10.14.8.42',
    resource: 'AuthService/VerifyOTP',
    details: 'Aadhaar / Voter ID biometric & OTP handshake completed successfully.',
    severity: 'INFO',
    status: 'SUCCESS'
  },
  {
    id: 'aud-9903',
    timestamp: '2026-08-22 11:15:30',
    eventType: 'BOOTH_HEARTBEAT_SYNC',
    actor: 'BOOTH-101',
    role: 'OFFICER',
    ipAddress: '10.14.8.1',
    resource: 'MonitoringService/Telemetry',
    details: 'Booth PB-12-01 reported 94% battery, 840 total votes cast, EVM tamper sensor nominal.',
    severity: 'INFO',
    status: 'SUCCESS'
  },
  {
    id: 'aud-9904',
    timestamp: '2026-08-22 10:55:12',
    eventType: 'INVALID_TOKEN_ATTEMPT',
    actor: 'UNAUTHENTICATED_IP',
    role: 'EXTERNAL',
    ipAddress: '192.168.1.144',
    resource: 'ApiGateway/v1/votes',
    details: 'Direct vote endpoint invocation blocked due to missing cryptographic session token.',
    severity: 'SECURITY',
    status: 'BLOCKED'
  }
];

export const MOCK_SERVICES_HEALTH: ServiceHealth[] = [
  {
    name: 'API Gateway Service',
    category: 'API',
    status: 'HEALTHY',
    uptimePercentage: 99.99,
    latencyMs: 12,
    activeInstances: 4,
    cpuUsage: 28,
    memoryUsage: 45,
    version: 'v2.4.1'
  },
  {
    name: 'Authentication & Identity Service',
    category: 'AUTH',
    status: 'HEALTHY',
    uptimePercentage: 99.98,
    latencyMs: 22,
    activeInstances: 3,
    cpuUsage: 35,
    memoryUsage: 52,
    version: 'v2.1.0'
  },
  {
    name: 'Core EVM Voting Service',
    category: 'VOTING',
    status: 'HEALTHY',
    uptimePercentage: 100.0,
    latencyMs: 8,
    activeInstances: 6,
    cpuUsage: 41,
    memoryUsage: 60,
    version: 'v3.0.4'
  },
  {
    name: 'Election Management Service',
    category: 'ELECTION',
    status: 'HEALTHY',
    uptimePercentage: 99.95,
    latencyMs: 16,
    activeInstances: 2,
    cpuUsage: 19,
    memoryUsage: 38,
    version: 'v1.9.2'
  },
  {
    name: 'Kafka Event Broker Cluster',
    category: 'BROKER',
    status: 'HEALTHY',
    uptimePercentage: 100.0,
    latencyMs: 4,
    activeInstances: 3,
    cpuUsage: 32,
    memoryUsage: 64,
    version: 'v3.6.1'
  },
  {
    name: 'Cassandra Storage Cluster',
    category: 'DATA',
    status: 'HEALTHY',
    uptimePercentage: 99.99,
    latencyMs: 6,
    activeInstances: 3,
    cpuUsage: 46,
    memoryUsage: 71,
    version: 'v5.0.0'
  }
];

export const MOCK_KAFKA_METRICS: KafkaTopicMetric[] = [
  {
    topicName: 'evm.vote.cast.events',
    messagesPerSec: 1420,
    consumerLag: 4,
    partitions: 12,
    consumersCount: 6,
    retentionHours: 720,
    status: 'ACTIVE'
  },
  {
    topicName: 'evm.audit.security.logs',
    messagesPerSec: 340,
    consumerLag: 0,
    partitions: 8,
    consumersCount: 4,
    retentionHours: 8760,
    status: 'ACTIVE'
  },
  {
    topicName: 'booth.telemetry.heartbeat',
    messagesPerSec: 95,
    consumerLag: 1,
    partitions: 4,
    consumersCount: 2,
    retentionHours: 168,
    status: 'ACTIVE'
  },
  {
    topicName: 'voter.sms.notifications',
    messagesPerSec: 210,
    consumerLag: 8,
    partitions: 6,
    consumersCount: 3,
    retentionHours: 24,
    status: 'ACTIVE'
  }
];

export const MOCK_CASSANDRA_NODES: CassandraNodeMetric[] = [
  {
    nodeId: 'cas-node-01',
    ipAddress: '10.200.1.11',
    datacenter: 'dc-east-india-1',
    rack: 'rack-A1',
    status: 'UP',
    loadGb: 142.6,
    readOpsSec: 4200,
    writeOpsSec: 6800,
    readLatencyMs: 1.4,
    writeLatencyMs: 0.8,
    cpuUsage: 44
  },
  {
    nodeId: 'cas-node-02',
    ipAddress: '10.200.1.12',
    datacenter: 'dc-east-india-1',
    rack: 'rack-A2',
    status: 'UP',
    loadGb: 139.8,
    readOpsSec: 4150,
    writeOpsSec: 6790,
    readLatencyMs: 1.3,
    writeLatencyMs: 0.9,
    cpuUsage: 42
  },
  {
    nodeId: 'cas-node-03',
    ipAddress: '10.200.1.13',
    datacenter: 'dc-east-india-1',
    rack: 'rack-B1',
    status: 'UP',
    loadGb: 141.2,
    readOpsSec: 4320,
    writeOpsSec: 6820,
    readLatencyMs: 1.5,
    writeLatencyMs: 0.8,
    cpuUsage: 48
  }
];
