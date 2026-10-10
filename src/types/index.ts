// Types for everything the RaktoSheba backend returns. Dates arrive as ISO strings.

export type Role = "ADMIN" | "HOSPITAL" | "DONOR";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type RequestStatus = "PENDING" | "VERIFIED" | "MATCHED" | "FULFILLED" | "CANCELLED";
export type DonationStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";
export type PaymentPurpose = "PLATFORM_DONATION" | "EMERGENCY_FUND";
export type HospitalType = "GOVERNMENT" | "PRIVATE" | "CLINIC";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

// ---- Response envelope ----------------------------------------------------

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: { path?: string; message: string }[];
};

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export type Paginated<T> = { data: T; meta: PaginationMeta };

// ---- Auth & users ---------------------------------------------------------

export type AuthUser = { id: string; email: string; role: Role };

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type UserProfile = AuthUser & {
  isVolunteer: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};

// ---- Hospitals & donors ---------------------------------------------------

export type Hospital = {
  id: string;
  userId: string;
  name: string;
  address: string;
  type: HospitalType | null;
  email: string | null;
  district: string | null;
  upazila: string | null;
  phone: string | null;
  emergencyPhone: string | null;
  website: string | null;
  logoUrl: string | null;
  openHours: string | null;
  hasEmergencyService: boolean;
  description: string | null;
  licenseNumber: string | null;
  verificationStatus: VerificationStatus;
  licenseDocUrl: string | null;
  deletedAt: string | null;
  user?: { id: string; email: string };
};

export type DonorProfile = {
  id: string;
  userId: string;
  bloodGroup: BloodGroup;
  lastDonationAt: string | null;
  isAvailable: boolean;
  isEligible: boolean;
  lat: number | null;
  lng: number | null;
  photoUrl: string | null;
  deletedAt: string | null;
  user?: { id: string; email: string };
};

/** A donor returned by the matching engine for a request. */
export type DonorMatch = Omit<DonorProfile, "isEligible"> & {
  user: { id: string; email: string };
  distanceKm: number | null;
};

// ---- Blood requests & donations ------------------------------------------

export type Donation = {
  id: string;
  donorId: string;
  requestId: string;
  scheduledAt: string | null;
  completedAt: string | null;
  status: DonationStatus;
};

/** An open request the signed-in donor's blood can help, from GET /donors/me/matches. */
export type DonorMatchRequest = {
  id: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: number;
  status: RequestStatus;
  createdAt: string;
  hospital: { name: string; address: string } | null;
  distanceKm: number | null;
};

/** One of the donor's own donations with its request, from GET /donors/me/donations. */
export type MyDonation = Donation & {
  request: {
    id: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    urgency: number;
    status: RequestStatus;
    createdAt: string;
    requester: { hospital: { name: string; address: string } | null };
  };
};

export type RequestHospital = {
  id: string;
  name: string;
  address: string;
  verificationStatus: VerificationStatus;
};

export type BloodRequest = {
  id: string;
  requesterId: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: number;
  status: RequestStatus;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  deletedAt: string | null;
  requester: { id: string; email: string; hospital: RequestHospital | null };
  donation: Donation | null;
};

/** Single request as returned by GET /requests/:id — includes the matched donor. */
export type BloodRequestDetail = Omit<BloodRequest, "donation"> & {
  donation:
    | (Donation & {
        donor: { id: string; bloodGroup: BloodGroup; photoUrl: string | null; user: { email: string } };
      })
    | null;
};

export type CreateBloodRequestInput = {
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency?: number;
  lat?: number;
  lng?: number;
};

// ---- Public (no auth) -----------------------------------------------------

/** Request with only public fields: no requester account, coordinates or donor identity. */
export type PublicRequest = {
  id: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: number;
  status: RequestStatus;
  createdAt: string;
  hospital: { name: string; address: string } | null;
};

export type PublicRequestDetail = PublicRequest & {
  donation: { status: DonationStatus; scheduledAt: string | null; completedAt: string | null } | null;
};

export type PlatformStats = {
  totalDonors: number;
  availableDonors: number;
  verifiedHospitals: number;
  completedDonations: number;
  openRequests: number;
};

export type RequestBoardQuery = {
  bloodGroup?: BloodGroup;
  /** A donor's own group: shows every request that group can safely give to. */
  canHelp?: BloodGroup;
  minUrgency?: number;
  search?: string;
  status?: "pending" | "open" | "matched" | "fulfilled" | "cancelled" | "all";
  sortBy?: "urgency" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

// ---- Notifications, payments, audit --------------------------------------

/** One in-app notification for the bell. (Named so it doesn't clash with the browser's `Notification`.) */
export type AppNotification = {
  id: string;
  userId: string;
  requestId: string | null;
  channel: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  sentAt: string;
  readAt: string | null;
};

export type NotificationFeed = { items: AppNotification[]; unread: number };

export type Payment = {
  id: string;
  userId: string;
  requestId: string | null;
  amount: number;
  currency: string;
  gatewayRef: string | null;
  purpose: PaymentPurpose;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  user?: AuthUser;
};

export type CheckoutSession = { payment: Payment; checkoutUrl: string | null };

/** Aggregates from GET /payments/stats (admin only). */
export type PaymentStats = {
  totalCollected: number;
  totalPayments: number;
  byStatus: Record<PaymentStatus, { count: number; amount: number }>;
  byPurpose: Record<PaymentPurpose, { count: number; amount: number }>;
};

export type AuditLog = {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor: AuthUser;
};

// ---- Admin analytics ------------------------------------------------------

export type Analytics = {
  donors: { total: number; available: number };
  hospitals: { total: number; verified: number };
  requests: { total: number; byStatus: Record<RequestStatus, number> };
  donationsCompleted: number;
  bannedUsers: number;
};

export type EmergencyLevel = "critical" | "severe" | "urgent" | "standard";

export type TimeSeries = {
  days: number;
  since: string;
  daily: { date: string; requests: number; donations: number }[];
  byBloodGroup: { bloodGroup: BloodGroup; total: number; open: number }[];
  openByEmergencyLevel: Record<EmergencyLevel, number>;
};
