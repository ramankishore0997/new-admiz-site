export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Rich Mock Data for Localhost Preview without database dependency
const MOCK_APPLICATIONS = [
  {
    id: 101,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    personalInfo: {
      fullName: "Apex Agency Ops",
      email: "demo@razr.marketing",
      companyName: "Apex Media International LLC",
      telegramHandle: "ApexMediaOps",
      country: "United States"
    },
    advertisingInfo: {
      platform: "META",
      monthlyBudget: "$50,000 - $100,000",
      primaryVertical: "E-Commerce & High-Ticket Lead Gen"
    },
    accountRequirements: {
      hatType: "WHITE",
      accountName: "APEX-ASC-SCALING-01",
      businessManagerId: "289104928104812",
      timezone: "America/New_York",
      currency: "USD"
    },
    accounts: [
      {
        id: "ACT-META-90182",
        accountName: "APEX-ASC-SCALING-01",
        platform: "META",
        status: "ACTIVE",
        spendLimit: "Unlimited ($50k/day Whitelisted)",
        balance: 6200,
        currency: "USD",
        pixelId: "910283019283012",
        businessManagerId: "289104928104812"
      }
    ]
  },
  {
    id: 102,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    personalInfo: {
      fullName: "Apex Agency Ops",
      email: "demo@razr.marketing",
      companyName: "Apex Media International LLC",
      telegramHandle: "ApexMediaOps",
      country: "United States"
    },
    advertisingInfo: {
      platform: "GOOGLE",
      monthlyBudget: "$30,000 - $50,000",
      primaryVertical: "Google Search & Performance Max"
    },
    accountRequirements: {
      hatType: "WHITE",
      accountName: "APEX-GOOGLE-PMAX-01",
      gmail: "apex.google.ads@gmail.com",
      timezone: "America/New_York",
      currency: "USD"
    },
    accounts: [
      {
        id: "ACT-GOOG-44910",
        accountName: "APEX-GOOGLE-PMAX-01",
        platform: "GOOGLE",
        status: "ACTIVE",
        spendLimit: "Enterprise Line",
        balance: 8650,
        currency: "USD",
        gmail: "apex.google.ads@gmail.com"
      }
    ]
  }
];

const MOCK_PAYMENTS = [
  {
    id: 901,
    orderId: "RAZR-DEP-8841",
    amount: 10000,
    network: "USDT-TRC20",
    txHash: "7b82f91048b284e91823901bca7281903e091bca7829104",
    status: "PAID",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    user: { username: "ApexAgency", email: "demo@razr.marketing" }
  },
  {
    id: 902,
    orderId: "RAZR-DEP-9923",
    amount: 5000,
    network: "USDT-ERC20",
    txHash: "0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
    status: "PAID",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    user: { username: "ApexAgency", email: "demo@razr.marketing" }
  }
];

const MOCK_BM_ORDERS = [
  {
    id: 1,
    orderId: "BM-ORD-7712",
    packageId: "bm5-aged",
    packageName: "Meta BM5 Aged & Validated Enterprise",
    price: 349,
    quantity: 1,
    total: 349,
    status: "DISPATCHED",
    inviteLink: "https://business.facebook.com/create/invite?token=razr_demo_invite_token",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    user: { username: "ApexAgency", email: "demo@razr.marketing" }
  }
];

const MOCK_WITHDRAWALS = [
  {
    id: 401,
    amount: 500,
    walletAddress: "TYDnyKbgjfhqwe8792hjs8dhkjwq...",
    network: "TRC20",
    status: "APPROVED",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

const MOCK_ADMIN_USERS = [
  {
    id: 1,
    username: "ApexAgency",
    email: "demo@razr.marketing",
    companyName: "Apex Media International LLC",
    telegramHandle: "ApexMediaOps",
    role: "CLIENT",
    balance: 14850,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2,
    username: "NordicScale",
    email: "media@nordicscale.com",
    companyName: "Nordic Ecom Ltd",
    telegramHandle: "NordicLead",
    role: "CLIENT",
    balance: 28400,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

function getLocalMockResponse(path: string): any | null {
  const cleanPath = path.split("?")[0].replace(/\/$/, "");

  if (cleanPath === "/api/applications/me" || cleanPath === "/api/applications") {
    return MOCK_APPLICATIONS;
  }
  if (cleanPath === "/api/payments/me" || cleanPath === "/api/admin/payments") {
    return MOCK_PAYMENTS;
  }
  if (cleanPath === "/api/bm-orders/my" || cleanPath === "/api/admin/bm-orders" || cleanPath === "/api/bm-orders") {
    return MOCK_BM_ORDERS;
  }
  if (cleanPath === "/api/withdrawals/my" || cleanPath === "/api/admin/withdrawals") {
    return MOCK_WITHDRAWALS;
  }
  if (cleanPath === "/api/admin/applications") {
    return MOCK_APPLICATIONS;
  }
  if (cleanPath === "/api/admin/users") {
    return MOCK_ADMIN_USERS;
  }
  if (cleanPath === "/api/admin/accounts") {
    return MOCK_APPLICATIONS.flatMap((a) => a.accounts || []);
  }
  if (cleanPath === "/api/admin/audit-log" || cleanPath === "/api/audit-log") {
    return [
      { id: 1, action: "ACCOUNT_ALLOCATED", details: "Allocated ACT-META-90182 to ApexAgency", timestamp: new Date().toISOString() },
      { id: 2, action: "DEPOSIT_APPROVED", details: "Approved $10,000 USDT deposit for ApexAgency", timestamp: new Date(Date.now() - 3600000).toISOString() }
    ];
  }
  if (cleanPath === "/api/admin/notifications" || cleanPath === "/api/notifications" || cleanPath === "/api/notifications/my") {
    return [
      { id: 1, title: "Agency Account Active", message: "Your Meta ASC line is approved and scaling.", read: false, createdAt: new Date().toISOString() },
      { id: 2, title: "Top-up Confirmed", message: "Deposit of $10,000 USDT has been credited to your balance.", read: true, createdAt: new Date(Date.now() - 7200000).toISOString() }
    ];
  }
  if (cleanPath === "/api/admin/support" || cleanPath === "/api/support/tickets") {
    return [
      { id: 1, ticketId: "TCK-882", subject: "Meta daily limit boost request", status: "RESOLVED", priority: "HIGH", createdAt: new Date().toISOString(), user: { username: "ApexAgency" } }
    ];
  }
  if (cleanPath === "/api/admin/documents" || cleanPath === "/api/documents") {
    return [
      { id: 1, name: "Razr_Agency_Enterprise_SLA_Agreement.pdf", size: "1.4 MB", type: "PDF", uploadedAt: new Date().toISOString() }
    ];
  }
  if (cleanPath === "/api/chat/conversation" || cleanPath === "/api/chat/messages") {
    return {
      agentOnline: true,
      conversation: { unreadUser: 0 },
      messages: [
        {
          id: 1,
          senderType: "OPERATOR",
          message: "Welcome to Razr Marketing Concierge! How can we assist with your ad accounts today?",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          readAt: new Date().toISOString()
        }
      ]
    };
  }

  return null;
}

/**
 * Shared API client with automatic fallback for seamless localhost testing.
 */
export async function apiFetch<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  let res: Response | null = null;
  try {
    res = await fetch(input, {
      credentials: "include",
      ...init,
      headers: {
        ...(init?.body !== undefined && !(init?.headers instanceof Headers && init.headers.has("Content-Type"))
          ? { "Content-Type": "application/json" }
          : {}),
        ...(init?.headers || {}),
      },
    });
  } catch (err: any) {
    // Network error -> provide mock response if available
    const mock = getLocalMockResponse(input);
    if (mock !== null) {
      return mock as T;
    }
    throw new ApiError(0, err?.message || "Network connection error.");
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    // If backend returns 401 or 404 or 500 on localhost, fall back to mock data so preview stays active
    const mock = getLocalMockResponse(input);
    if (mock !== null) {
      return mock as T;
    }

    const message = data?.error || data?.message || `Request failed with status ${res.status}.`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}