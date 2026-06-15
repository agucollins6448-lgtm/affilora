import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import {
  Bar,
  Pie,
  Line
} from "react-chartjs-2";

import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminDashboard({ setView, onLogout }) {

    const token = localStorage.getItem("adminToken");


  const [tab, setTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [transactionSort, setTransactionSort] = useState("newest");
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [withdrawalStatusFilter, setWithdrawalStatusFilter] = useState("all");
  const [membershipStatusFilter, setMembershipStatusFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [walletActionFilter, setWalletActionFilter] = useState("all");
  const [logFilter, setLogFilter] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");  
  const [transactionSearch, setTransactionSearch] = useState("");
  const [withdrawalSearch, setWithdrawalSearch] = useState("");
  const [membershipSearch, setMembershipSearch] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [notificationSearch, setNotificationSearch] = useState("");
  const [walletHistorySearch, setWalletHistorySearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletAction, setWalletAction] = useState("add");
  const [logs, setLogs] = useState([]);
  const [walletHistory, setWalletHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [transactionPage, setTransactionPage] = useState(1);
  const [withdrawalPage, setWithdrawalPage] = useState(1);
  const [membershipPage, setMembershipPage] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [notificationPage, setNotificationPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [connected, setConnected] = useState(false);

useEffect(() => {

  setConnected(socket.connected);

  socket.on(
    "connect",
    () => {
      setConnected(true);
    }
  );

  socket.on(
    "disconnect",
    () => {
      setConnected(false);
    }
  );

  return () => {
    socket.off("connect");
    socket.off("disconnect");
  };

}, []);



  const totalUsers = users.length;

const activeMembers =
users.filter(
  u => u.membershipActive
).length;

const totalWalletBalance =
users.reduce(
  (sum, u) =>
    sum + Number(u.walletBalance || 0),
  0
);

const totalRevenue =
transactions
  .filter(
    t =>
      ["task","ads","survey","referral"]
      .includes(t.type)
  )
  .reduce(
    (sum, t) =>
      sum + Number(t.amount || 0),
    0
  );

const pendingWithdrawals =
withdrawals.filter(
  w => w.status === "pending"
).length;

const approvedWithdrawals =
withdrawals.filter(
  w =>
    w.status === "approved" ||
    w.status === "success"
).length;

const totalMembershipRequests =
membershipRequests.filter(
  r => r.status === "pending"
).length;

const openSupportTickets =
  tickets.filter(
    t => t.status === "open"
  ).length;

const bannedUsers =
users.filter(
  u => u.isBanned
).length;

const actionRequired =
  pendingWithdrawals +
  totalMembershipRequests +
  openSupportTickets;

const totalWithdrawn =
withdrawals
.filter(
  w =>
    w.status === "approved" ||
    w.status === "success"
)
.reduce(
  (sum, w) => sum + w.amount,
  0
);

const filteredTransactions =
  transactions.filter((t) => {

    const matchType =
      transactionFilter === "all"
        ? true
        : t.type === transactionFilter;

    const matchSearch =
      t.user?.fullName
        ?.toLowerCase()
        .includes(
          transactionSearch.toLowerCase()
        ) ||
      t.user?.email
        ?.toLowerCase()
        .includes(
          transactionSearch.toLowerCase()
        );

    return matchType && matchSearch;

  })
  transactions.sort((a,b)=>{

if (
transactionSort ===
"highest"
) {
return b.amount - a.amount;
}

if (
transactionSort ===
"lowest"
) {
return a.amount - b.amount;
}

if (
transactionSort ===
"oldest"
) {
return (
new Date(a.createdAt) -
new Date(b.createdAt)
);
}

return (
new Date(b.createdAt) -
new Date(a.createdAt)
);

});

const indexOfLastTransaction =
  transactionPage *
  itemsPerPage;

const indexOfFirstTransaction =
  indexOfLastTransaction -
  itemsPerPage;

const currentTransactions =
  filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

const totalTransactionPages =
  Math.ceil(
    filteredTransactions.length /
    itemsPerPage
  );

const transactionPageNumbers =
  Array.from(
    {
      length:
      totalTransactionPages
    },
    (_, i) => i + 1
  );

const filteredWithdrawals =
withdrawals.filter((w)=>{

const search =
withdrawalSearch.toLowerCase();

const matchesSearch =

w.user?.fullName
?.toLowerCase()
.includes(search)

||

w.user?.email
?.toLowerCase()
.includes(search)

||

w.user?.bank.name
?.toLowerCase()
.includes(search)

||

w.user?.bank.accountName
?.toLowerCase()
.includes(search)

||

w.user?.bank.accountNumber
?.toLowerCase()
.includes(search);

const matchesStatus =

withdrawalStatusFilter === "all"

? true

: w.status ===
withdrawalStatusFilter;

return (
matchesSearch &&
matchesStatus
);

});

const indexOfLastWithdrawal =
withdrawalPage *
itemsPerPage;

const indexOfFirstWithdrawal =
indexOfLastWithdrawal -
itemsPerPage;

const currentWithdrawals =
filteredWithdrawals.slice(
indexOfFirstWithdrawal,
indexOfLastWithdrawal
);

const totalWithdrawalPages =
Math.ceil(
filteredWithdrawals.length /
itemsPerPage
);

const withdrawalPageNumbers =
Array.from(
{
length:
totalWithdrawalPages
},
(_, i) => i + 1
);

const filteredMembershipRequests =
membershipRequests.filter((r)=>{

const search =
membershipSearch.toLowerCase();

const matchesSearch =

r.user?.fullName
?.toLowerCase()
.includes(search)

||

r.user?.email
?.toLowerCase()
.includes(search)

||

r.plan
?.toLowerCase()
.includes(
membershipSearch.toLowerCase()
)

const matchesStatus =

membershipStatusFilter === "all"

? true

: r.status ===
membershipStatusFilter;

return (
matchesSearch &&
matchesStatus
);

});

const indexOfLastMembership =
membershipPage *
itemsPerPage;

const indexOfFirstMembership =
indexOfLastMembership -
itemsPerPage;

const currentMembershipRequests =
filteredMembershipRequests.slice(
indexOfFirstMembership,
indexOfLastMembership
);

const totalMembershipPages =
Math.ceil(
filteredMembershipRequests.length /
itemsPerPage
);

const membershipPageNumbers =
Array.from(
{
length:
totalMembershipPages
},
(_, i) => i + 1
);

const filteredCodes =
codes.filter((c)=>

c.code
?.toLowerCase()
.includes(
codeSearch.toLowerCase()
)

);

const filteredTickets =
tickets.filter((t)=>{

const search =
ticketSearch.toLowerCase();

const matchesSearch =

t.fullName
?.toLowerCase()
.includes(search)

||

t.email
?.toLowerCase()
.includes(search)

||

t.message
?.toLowerCase()
.includes(
ticketSearch.toLowerCase()
);


const matchesStatus =

ticketStatusFilter ===
"all"

? true

: t.status ===
ticketStatusFilter;

return (
matchesSearch &&
matchesStatus
);

});

const indexOfLastTicket =
ticketPage *
itemsPerPage;

const indexOfFirstTicket =
indexOfLastTicket -
itemsPerPage;

const currentTickets =
filteredTickets.slice(
indexOfFirstTicket,
indexOfLastTicket
);

const totalTicketPages =
Math.ceil(
filteredTickets.length /
itemsPerPage
);

const ticketPageNumbers =
Array.from(
{
length:
totalTicketPages
},
(_, i) => i + 1
);

const filteredNotifications =
notifications.filter(n => {

const searchMatch =

n.title
?.toLowerCase()
.includes(
notificationSearch.toLowerCase()
)

||

n.message
?.toLowerCase()
.includes(
notificationSearch.toLowerCase()
);

const typeMatch =

notificationFilter === "all"

? true

: n.senderType === notificationFilter;


return (
searchMatch &&
typeMatch
);

});

const indexOfLastNotification =
notificationPage *
itemsPerPage;

const indexOfFirstNotification =
indexOfLastNotification -
itemsPerPage;

const currentNotifications =
filteredNotifications.slice(
indexOfFirstNotification,
indexOfLastNotification
);

const totalNotificationPages =
Math.ceil(
filteredNotifications.length /
itemsPerPage
);

const notificationPageNumbers =
Array.from(
{
length:
totalNotificationPages
},
(_, i) => i + 1
);

const filteredWalletHistory =
walletHistory.filter((h)=>{

const matchesSearch =

h.user?.fullName
?.toLowerCase()
.includes(
walletHistorySearch
.toLowerCase()
);

const matchesAction =

walletActionFilter ===
"all"

? true

: h.action ===
walletActionFilter;

return (
matchesSearch &&
matchesAction
);

});

const filteredLogs =
logs.filter((log) => {

const matchesSearch =

log.action
?.toLowerCase()
.includes(
logSearch.toLowerCase()
)

||

log.details
?.toLowerCase()
.includes(
logSearch.toLowerCase()
)

||

log.targetUser?.fullName
?.toLowerCase()
.includes(
logSearch.toLowerCase()
);

const matchesType =

logFilter === "all"

? true

: log.action === logFilter;

return (
matchesSearch &&
matchesType
);

});


const indexOfLastLog =
  currentPage * itemsPerPage;

const indexOfFirstLog =
  indexOfLastLog - itemsPerPage;

const currentLogs =
  filteredLogs.slice(
    indexOfFirstLog,
    indexOfLastLog
  );

const totalPages =
  Math.ceil(
    filteredLogs.length /
    itemsPerPage
  );

  const pageNumbers =
  Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

const totalAds = transactions
  .filter(t => t.type === "ads")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const totalReferrals = transactions
  .filter(t => t.type === "referral")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const totalSurveys = transactions
  .filter(t => t.type === "survey")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);

const totalWithdrawalAmount = transactions
  .filter(t => t.type === "withdrawal")
  .reduce((sum, t) => sum + Number(t.amount || 0), 0);


  const starterCount =
  users.filter(
    u => u.membershipTier === "Starter"
  ).length;

const bronzeCount =
  users.filter(
    u => u.membershipTier === "Bronze"
  ).length;

const silverCount =
  users.filter(
    u => u.membershipTier === "Silver"
  ).length;

const goldCount =
  users.filter(
    u => u.membershipTier === "Gold"
  ).length;

const premiumCount =
  users.filter(
    u => u.membershipTier === "Premium"
  ).length;


const pendingAmount =
  withdrawals
    .filter(
      w => w.status === "pending"
    )
    .reduce(
      (sum, w) =>
        sum + Number(w.amount || 0),
      0
    );

const approvedAmount =
  withdrawals
    .filter(
      w =>
        w.status === "approved" ||
        w.status === "success"
    )
    .reduce(
      (sum, w) =>
        sum + Number(w.amount || 0),
      0
    );

const rejectedAmount =
  withdrawals
    .filter(
      w => w.status === "rejected"
    )
    .reduce(
      (sum, w) =>
        sum + Number(w.amount || 0),
      0
    );

const membershipChartData = {
  labels: [
    "Starter",
    "Bronze",
    "Silver",
    "Gold",
    "Premium"
  ],

  datasets: [
    {
      data: [

        users.filter(
          u =>
            u.membershipTier === "Starter"
        ).length,

        users.filter(
          u =>
            u.membershipTier === "Bronze"
        ).length,

        users.filter(
          u =>
            u.membershipTier === "Silver"
        ).length,

        users.filter(
          u =>
            u.membershipTier === "Gold"
        ).length,

        users.filter(
          u =>
            u.membershipTier === "Premium"
        ).length
      ],
      backgroundColor: [
        "#64748B", // Starter
        "#CD7F32", // Bronze
        "#C0C0C0", // Silver
        "#FFD700", // Gold
        "#8B5CF6"  // Premium
      ]
    }
  ]
};

const earningsChartData = {

  labels: [
    "Ads",
    "Referrals",
    "Surveys",
    "Withdrawals"
  ],

datasets: [
  {
    label: "Amount",

    data: [
      totalAds,
      totalReferrals,
      totalSurveys,
      totalWithdrawalAmount
    ],

    backgroundColor: [
      "#3B82F6", // Ads
      "#22C55E", // Referrals
      "#ea580c", // Surveys
      "#EF4444"  // Withdrawals
    ]
  }
]
  
};

const topWalletUsers =
  [...users]
    .sort(
      (a, b) =>
        b.walletBalance -
        a.walletBalance
    )
    .slice(0, 5);

const walletChartData = {

  labels:
    topWalletUsers.map(
      u => u.fullName
    ),

 datasets: [
  {
    label: "Wallet Balance",

    data:
      topWalletUsers.map(
        u => u.walletBalance
      ),

    backgroundColor: [
      "#F4C451",
      "#D4AF37",
      "#C9A227",
      "#B8860B",
      "#996515"
    ]
  }
]
  
};

const monthlyUsers = {};

users.forEach(user => {

  const month =
    new Date(
      user.createdAt
    ).toLocaleString(
      "default",
      {
        month: "short"
      }
    );

  monthlyUsers[month] =
    (monthlyUsers[month] || 0) + 1;

});

const userGrowthData = {

  labels:
    Object.keys(
      monthlyUsers
    ),

datasets: [
  {
    label: "New Users",

    data:
      Object.values(
        monthlyUsers
      ),

    borderColor: "#22C55E",

    backgroundColor:
      "rgba(34,197,94,0.2)",

    tension: 0.4,

    fill: true
  }
]
};

const chartOptions = {
  responsive: true,

  plugins: {
    legend: {
      position: "bottom"
    }
  }
};

  const fetchUsers = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/admin/users",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setUsers(res.data);
  };

  const fetchWithdrawals = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/withdrawals/all",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setWithdrawals(res.data);
  };

  const fetchMembershipRequests =
async () => {

  const res =
    await axios.get(
      "http://localhost:5000/api/membership-requests/all",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setMembershipRequests(
    res.data
  );

};

const fetchCodes = async () => {

  const res = await axios.get(
    "http://localhost:5000/api/admin/codes",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setCodes(res.data);
};

const fetchTransactions = async () => {
  try {

    const res = await axios.get(
      "http://localhost:5000/api/admin/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(res.data);

    setTransactions(res.data);

  } catch (err) {

    console.log(err.response?.data || err);

  }
};

const fetchTickets =
async () => {

  const res =
    await axios.get(
      "http://localhost:5000/api/support/all",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setTickets(
    res.data
  );

};

const fetchNotifications =
async () => {

  const res =
    await axios.get(
      "http://localhost:5000/api/admin/notifications",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setNotifications(
    res.data
  );

};

const fetchLogs =
async () => {

  const res =
    await axios.get(
      "http://localhost:5000/api/admin/logs",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setLogs(res.data);

};

const fetchWalletHistory =
async () => {

  const res =
    await axios.get(
      "http://localhost:5000/api/admin/wallet-history",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  setWalletHistory(
    res.data
  );

};

useEffect(() => {

  if (!token) return;

  fetchUsers();
  fetchWithdrawals();
  fetchMembershipRequests();
  fetchCodes();
  fetchTransactions();
  fetchTickets();
  fetchNotifications();
  fetchLogs();
  fetchWalletHistory();

}, [token]);

useEffect(() => {

socket.on(
  "userUpdated",
  fetchUsers
);

socket.on(
  "withdrawalUpdated",
  fetchWithdrawals
);

socket.on(
  "membershipUpdated",
  fetchMembershipRequests
);

socket.on(
  "ticketUpdated",
  fetchTickets
);

socket.on(
  "notificationUpdated",
  fetchNotifications
);

socket.on(
  "transactionUpdated",
  fetchTransactions
);

socket.on(
  "walletHistoryUpdated",
  fetchWalletHistory
);

socket.on(
  "adminLogUpdated",
  fetchLogs
);

return () => {

  socket.off(
    "userUpdated"
  );

  socket.off(
    "withdrawalUpdated"
  );

  socket.off(
    "membershipUpdated"
  );

  socket.off(
    "ticketUpdated"
  );

  socket.off(
    "notificationUpdated"
  );

  socket.off(
    "transactionUpdated"
  );

  socket.off(
    "walletHistoryUpdated"
  );

  socket.off(
    "adminLogUpdated"
  );

};

}, []);

useEffect(() => {

  setCurrentPage(1);

}, [
  logSearch,
  logFilter
]);

useEffect(() => {

setUserPage(1);

}, [
search,
tierFilter,
sortBy
]);

useEffect(() => {

setTransactionPage(1);

}, [
transactionSearch,
transactionFilter
]);

useEffect(() => {

setWithdrawalPage(1);

}, [
withdrawalSearch,
withdrawalStatusFilter
]);

useEffect(() => {

setMembershipPage(1);

}, [
membershipSearch,
membershipStatusFilter
]);

useEffect(() => {

setTicketPage(1);

}, [
ticketSearch,
ticketStatusFilter
]);

useEffect(() => {

setNotificationPage(1);

}, [
notificationSearch,
notificationFilter
]);

const filteredUsers = users
  .filter((user) => {

    const matchesSearch =
      user.fullName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      user.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );

    const matchesTier =
      tierFilter === "all"
        ? true
        : user.membershipTier === tierFilter;

    return (
      matchesSearch &&
      matchesTier
    );
  })
  .sort((a, b) => {

    if (sortBy === "balance") {
      return (
        b.walletBalance -
        a.walletBalance
      );
    }

    if (sortBy === "referrals") {
      return (
        b.referralsCount -
        a.referralsCount
      );
    }

    return (
      new Date(b.createdAt) -
      new Date(a.createdAt)
    );
  });

  const indexOfLastUser =
  userPage * itemsPerPage;

const indexOfFirstUser =
  indexOfLastUser - itemsPerPage;

const currentUsers =
  filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

const totalUserPages =
  Math.ceil(
    filteredUsers.length /
    itemsPerPage
  );

const userPageNumbers =
  Array.from(
    {
      length:
      totalUserPages
    },
    (_, i) => i + 1
  );


/* ═════════════════════════════════════════
   THEME / DESIGN TOKENS
   ═════════════════════════════════════════ */
const fonts = {
  heading: "'Space Grotesk', sans-serif",
  body: "'DM Sans', sans-serif",
};

const colors = {
  bg: "#0a0a1a",
  surface: "#141432",
  surfaceElevated: "#1e1e5a",
  accent: "#4f46e5",
  accentHover: "#4338ca",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "rgba(148, 163, 184, 0.12)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#a855f7",
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#eab308",
  premium: "#8b5cf6",
  starter: "#64748b",
};

const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
};

const shadow = "0 10px 30px -8px rgba(0,0,0,0.45)";
const shadowSm = "0 4px 12px rgba(0,0,0,0.25)";

const globalStyle = {
  fontFamily: fonts.body,
  color: colors.textPrimary,
  lineHeight: 1.5,
};

/* ── Reusable card shell ── */
const makeCard = (accentColor) => ({
  background: colors.surface,
  color: colors.textPrimary,
  padding: "22px",
  borderRadius: radius.lg,
  boxShadow: shadowSm,
  borderLeft: `4px solid ${accentColor}`,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
});

const cardStyle = makeCard(colors.accent);
const greenCard = makeCard(colors.success);
const orangeCard = makeCard(colors.warning);
const redCard = makeCard(colors.danger);
const purpleCard = makeCard(colors.purple);
const starterCard = makeCard(colors.starter);
const bronzeCard = makeCard(colors.bronze);
const silverCard = makeCard(colors.silver);
const goldCard = makeCard(colors.gold);
const premiumCard = makeCard(colors.premium);

/* ── Inputs ── */
const inputStyle = {
  padding: "10px 14px",
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: colors.surfaceElevated,
  color: colors.textPrimary,
  fontFamily: fonts.body,
  fontSize: "0.95rem",
  outline: "none",
  minWidth: "200px",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

/* ── Buttons ── */
const btnBase = {
  padding: "10px 18px",
  borderRadius: radius.md,
  border: "none",
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.1s ease",
};

const btnPrimary = { ...btnBase, background: colors.accent, color: "#fff" };
const btnDanger = { ...btnBase, background: colors.danger, color: "#fff" };
const btnSuccess = { ...btnBase, background: colors.success, color: "#fff" };
const btnGhost = {
  ...btnBase,
  background: "transparent",
  color: colors.textSecondary,
  border: `1px solid ${colors.border}`,
};

/* ── Table / list rows ── */
const rowBase = {
  padding: "14px 18px",
  background: colors.surface,
  borderRadius: radius.md,
  marginBottom: "10px",
  boxShadow: shadowSm,
  color: colors.textPrimary,
};

/* ── Chart container ── */
const chartBox = {
  background: colors.surface,
  padding: "24px",
  marginTop: "28px",
  borderRadius: radius.lg,
  boxShadow: shadow,
};

/* ── Pagination ── */
const pageBtn = (active) => ({
  padding: "8px 14px",
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: active ? colors.accent : colors.surface,
  color: active ? "#fff" : colors.textPrimary,
  fontWeight: active ? 700 : 500,
  cursor: "pointer",
  fontFamily: fonts.body,
  transition: "background 0.2s ease",
});

/* ═════════════════════════════════════════
   COMPONENT
   ═════════════════════════════════════════ */

  return (
    <>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{ display: "flex", minHeight: "100vh", ...globalStyle, background: colors.bg }}>
        {/* ═══════ SIDEBAR ═══════ */}
        <aside
          style={{
            width: "260px",
            background: colors.surface,
            color: colors.textPrimary,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            boxShadow: "4px 0 24px rgba(0,0,0,0.35)",
            position: "sticky",
            top: 0,
            height: "101vh",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              fontFamily: fonts.heading,
              fontSize: "1.35rem",
              fontWeight: 700,
              letterSpacing: "0.5px",
              marginBottom: "20px",
              color: colors.accent,
            }}
          >
            ADMIN PANEL
          </h2>

          {[
            { key: "overview", label: "Overview" },
            { key: "users", label: "Users" },
            { key: "withdrawals", label: "Withdrawals" },
            { key: "membershipRequests", label: "Membership" },
            { key: "codes", label: "Activation Codes" },
            { key: "transactions", label: "Transactions" },
            { key: "support", label: "Support Tickets" },
            { key: "notifications", label: "Notifications" },
            { key: "logs", label: "Activity Logs" },
            { key: "reports", label: "Reports" },
            { key: "walletHistory", label: "Wallet History" },
            { key: "security", label: "Security" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: radius.md,
                border: "none",
                background: tab === item.key ? colors.accent : "transparent",
                color: tab === item.key ? "#fff" : colors.textSecondary,
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (tab !== item.key) e.currentTarget.style.background = colors.surfaceElevated;
              }}
              onMouseLeave={(e) => {
                if (tab !== item.key) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={onLogout}
            style={{
              marginTop: "auto",
              ...btnDanger,
              width: "100%",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Logout
          </button>
        </aside>

        {/* ═══════ MAIN ═══════ */}
        <main style={{ flex: 1, padding: "28px 32px", overflowX: "hidden" }}>
          {/* Status + Page size */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ fontWeight: 500, color: colors.textSecondary }}>
              Status:{" "}
              <span style={{ color: connected ? colors.success : colors.danger, fontWeight: 700 }}>
                {connected ? "Live" : "Offline"}
              </span>
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>Show:</span>
              <select
                style={selectStyle}
                value={itemsPerPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setItemsPerPage(val);
                  setUserPage(1);
                  setWithdrawalPage(1);
                  setTransactionPage(1);
                  setMembershipPage(1);
                  setTicketPage(1);
                  setNotificationPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000000}>All</option>
              </select>
            </div>
          </div>

          {/* ═══════ OVERVIEW ═══════ */}
          {tab === "overview" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px" }}>
                System Overview
              </h1>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                }}
              >
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Total Users
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{totalUsers}</h1>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Banned Users
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{bannedUsers}</h1>
                </div>
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Active Members
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{activeMembers}</h1>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Total Revenue
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>₦{totalRevenue.toLocaleString()}</h1>
                </div>
                <div style={purpleCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Pending Memberships
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{totalMembershipRequests}</h1>
                </div>
                <div style={orangeCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Pending Withdrawals
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{pendingWithdrawals}</h1>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Approved Withdrawals
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{approvedWithdrawals}</h1>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Total Withdrawn
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>₦{totalWithdrawn.toLocaleString()}</h1>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Withdrawal Volume
                  </h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700 }}>₦{totalWithdrawalAmount.toLocaleString()}</h2>
                </div>
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Wallet Balances
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>₦{totalWalletBalance.toLocaleString()}</h1>
                </div>
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Ad Rewards
                  </h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700 }}>₦{totalAds.toLocaleString()}</h2>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Referral Bonuses
                  </h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700 }}>₦{totalReferrals.toLocaleString()}</h2>
                </div>
                <div style={orangeCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Survey Rewards
                  </h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700 }}>₦{totalSurveys.toLocaleString()}</h2>
                </div>
                <div style={orangeCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Open Support Tickets
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{openSupportTickets}</h1>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: colors.textSecondary, marginBottom: "8px" }}>
                    Action Required
                  </h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "2rem", fontWeight: 700 }}>{actionRequired}</h1>
                </div>
              </div>

              <div style={chartBox}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: "1.25rem", marginBottom: "16px" }}>Earnings Analytics</h2>
                <Bar data={earningsChartData} options={chartOptions} />
              </div>
              <div style={chartBox}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: "1.25rem", marginBottom: "16px" }}>Membership Distribution</h2>
                <Pie data={membershipChartData} options={chartOptions} />
              </div>
              <div style={chartBox}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: "1.25rem", marginBottom: "16px" }}>Top Wallet Holders</h2>
                <Bar data={walletChartData} options={chartOptions} />
              </div>
              <div style={chartBox}>
                <h2 style={{ fontFamily: fonts.heading, fontSize: "1.25rem", marginBottom: "16px" }}>User Growth</h2>
                <Line data={userGrowthData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* ═══════ USERS ═══════ */}
          {tab === "users" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Users</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                  <option value="all">All Tiers</option>
                  <option value="Starter">Starter</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Premium">Premium</option>
                </select>
                <select style={selectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="balance">Highest Balance</option>
                  <option value="referrals">Most Referrals</option>
                </select>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentUsers.length} of {filteredUsers.length} users
              </p>

              {currentUsers.map((u) => (
                <div key={u._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Name:</strong> {u.fullName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {u.email}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Tier:</strong> {u.membershipTier}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Balance:</strong> ₦{u.walletBalance}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Referrals:</strong> {u.referralsCount}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      style={btnDanger}
                      onClick={async () => {
                        await axios.delete(`http://localhost:5000/api/admin/users/${u._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        alert("User deleted");
                        fetchUsers();
                      }}
                    >
                      Delete User
                    </button>
                    <button
                      style={btnGhost}
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/admin/users/toggle-membership/${u._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert(u.membershipActive ? "User inactive" : "User active");
                        fetchUsers();
                      }}
                    >
                      Toggle Active
                    </button>
                    <button
                      style={btnGhost}
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/admin/users/ban/${u._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert(u.isBanned ? "User unbanned" : "User banned");
                        fetchUsers();
                      }}
                    >
                      Ban / Unban
                    </button>
                    <button
                      style={btnPrimary}
                      onClick={() => {
                        setSelectedUserData(u);
                        setTab("userDetails");
                      }}
                    >
                      View User
                    </button>
                    <button
                      style={btnGhost}
                      onClick={async () => {
                        const res = await axios.get(`http://localhost:5000/api/admin/reports/user/${u._id}`, {
                          headers: { Authorization: `Bearer ${token}` },
                          responseType: "blob",
                        });
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `${u.username}-report.pdf`);
                        document.body.appendChild(link);
                        link.click();
                      }}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No users found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>
                  Previous
                </button>
                {userPageNumbers.map((page) => (
                  <button key={page} onClick={() => setUserPage(page)} style={pageBtn(userPage === page)}>
                    {page}
                  </button>
                ))}
                <button style={btnGhost} disabled={userPage === totalUserPages} onClick={() => setUserPage(userPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ WITHDRAWALS ═══════ */}
          {tab === "withdrawals" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Withdrawals</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={withdrawalSearch}
                  onChange={(e) => setWithdrawalSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select
                  style={selectStyle}
                  value={withdrawalStatusFilter}
                  onChange={(e) => setWithdrawalStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                  marginBottom: "24px",
                }}
              >
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Total Paid Out</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{totalWithdrawn}</h2>
                </div>
                <div style={orangeCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Pending Amount</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{pendingAmount}</h2>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Approved Amount</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{approvedAmount}</h2>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Rejected Amount</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{rejectedAmount}</h2>
                </div>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentWithdrawals.length} of {filteredWithdrawals.length} withdrawals
              </p>

              {currentWithdrawals.map((w) => (
                <div key={w._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Name:</strong> {w.user?.fullName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {w.user?.email}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Tier:</strong> {w.user?.membershipTier}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Amount:</strong> ₦{w.amount}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Bank:</strong> {w.bankName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Account Name:</strong> {w.accountName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Account Number:</strong> {w.accountNumber}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Slip:</strong> {w.slipNumber}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Status:</strong> {w.status}</p>
                  </div>
                  {w.status === "pending" && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        style={btnSuccess}
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/withdrawals/approve/${w._id}`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          fetchWithdrawals();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={btnDanger}
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/withdrawals/reject/${w._id}`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          fetchWithdrawals();
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filteredWithdrawals.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No withdrawals found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={withdrawalPage === 1} onClick={() => setWithdrawalPage(withdrawalPage - 1)}>
                  Previous
                </button>
                {withdrawalPageNumbers.map((page) => (
                  <button key={page} onClick={() => setWithdrawalPage(page)} style={pageBtn(withdrawalPage === page)}>
                    {page}
                  </button>
                ))}
                <button
                  style={btnGhost}
                  disabled={withdrawalPage === totalWithdrawalPages}
                  onClick={() => setWithdrawalPage(withdrawalPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ MEMBERSHIP REQUESTS ═══════ */}
          {tab === "membershipRequests" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>
                Membership Requests
              </h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Search requests..."
                  value={membershipSearch}
                  onChange={(e) => setMembershipSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select
                  style={selectStyle}
                  value={membershipStatusFilter}
                  onChange={(e) => setMembershipStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={starterCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Starter Members</h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginTop: "8px" }}>{starterCount}</h1>
                </div>
                <div style={bronzeCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Bronze Members</h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginTop: "8px" }}>{bronzeCount}</h1>
                </div>
                <div style={silverCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Silver Members</h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginTop: "8px" }}>{silverCount}</h1>
                </div>
                <div style={goldCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Gold Members</h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginTop: "8px" }}>{goldCount}</h1>
                </div>
                <div style={premiumCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Premium Members</h3>
                  <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginTop: "8px" }}>{premiumCount}</h1>
                </div>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentMembershipRequests.length} of {filteredMembershipRequests.length} requests
              </p>

              {currentMembershipRequests.map((r) => (
                <div key={r._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "12px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Name:</strong> {r.user?.fullName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {r.user?.email}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Plan:</strong> {r.plan}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Amount:</strong> ₦{r.amount}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Status:</strong> {r.status}</p>
                  </div>
                  {r.status === "pending" && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        style={btnSuccess}
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/membership-requests/approve/${r._id}`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          fetchMembershipRequests();
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={btnDanger}
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/membership-requests/reject/${r._id}`,
                            {},
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          fetchMembershipRequests();
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {filteredMembershipRequests.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No membership requests found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={membershipPage === 1} onClick={() => setMembershipPage(membershipPage - 1)}>
                  Previous
                </button>
                {membershipPageNumbers.map((page) => (
                  <button key={page} onClick={() => setMembershipPage(page)} style={pageBtn(membershipPage === page)}>
                    {page}
                  </button>
                ))}
                <button
                  style={btnGhost}
                  disabled={membershipPage === totalMembershipPages}
                  onClick={() => setMembershipPage(membershipPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ ACTIVATION CODES ═══════ */}
          {tab === "codes" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Activation Codes</h1>

              <div
                style={{
                  background: colors.surface,
                  padding: "22px",
                  borderRadius: radius.lg,
                  marginBottom: "24px",
                  boxShadow: shadowSm,
                }}
              >
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", marginBottom: "16px" }}>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    style={btnPrimary}
                    onClick={async () => {
                      await axios.post(
                        "http://localhost:5000/api/admin/codes",
                        { code: newCode },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setNewCode("");
                      fetchCodes();
                    }}
                  >
                    Create Code
                  </button>
                </div>

                <input
                  placeholder="Search code..."
                  value={codeSearch}
                  onChange={(e) => setCodeSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "260px" }}
                />
              </div>

              <div
                style={{
                  background: colors.surface,
                  padding: "22px",
                  borderRadius: radius.lg,
                  marginBottom: "24px",
                  boxShadow: shadowSm,
                }}
              >
                <h2 style={{ fontFamily: fonts.heading, fontSize: "1.15rem", marginBottom: "12px" }}>Generate Activation Codes</h2>
                <button
                  style={btnPrimary}
                  onClick={async () => {
                    const res = await axios.post(
                      "http://localhost:5000/api/admin/generate-codes",
                      { count: 50 },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert(res.data.message);
                  }}
                >
                  Generate 50 Codes
                </button>
              </div>

              {filteredCodes.map((c) => (
                <div key={c._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Code:</strong> {c.code}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Used:</strong> {c.used ? "Yes" : "No"}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Payment Confirmed:</strong> {c.paymentConfirmed ? "Yes" : "No"}</p>
                  </div>
                  {!c.paymentConfirmed && (
                    <button
                      style={{ ...btnSuccess, marginTop: "12px" }}
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/admin/codes/confirm/${c._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        fetchCodes();
                      }}
                    >
                      Confirm Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══════ TRANSACTIONS ═══════ */}
          {tab === "transactions" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>All Transactions</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search user..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}>
                  <option value="all">All Transactions</option>
                  <option value="ads">Ad Rewards</option>
                  <option value="referral">Referrals</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="survey">Surveys</option>
                  <option value="admin">Admin</option>
                </select>
                <select style={selectStyle} value={transactionSort} onChange={(e) => setTransactionSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Ad Rewards</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{totalAds}</h2>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Referral Bonuses</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{totalReferrals}</h2>
                </div>
                <div style={orangeCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Survey Rewards</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{totalSurveys}</h2>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Withdrawals</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>₦{totalWithdrawalAmount}</h2>
                </div>
                <div style={purpleCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Total Transactions</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>{transactions.length}</h2>
                </div>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentTransactions.length} of {filteredTransactions.length} transactions
              </p>

              {currentTransactions.map((t) => (
                <div key={t._id} style={rowBase}>
                  <p style={{ marginBottom: "6px" }}>
                    <strong style={{ color: colors.textSecondary }}>Type:</strong>{" "}
                    <span
                      style={{
                        color:
                          t.type === "withdrawal"
                            ? colors.danger
                            : t.type === "referral"
                            ? colors.success
                            : t.type === "ads"
                            ? colors.info
                            : colors.warning,
                        fontWeight: 700,
                        marginLeft: "6px",
                      }}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>User:</strong> {t.user?.fullName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {t.user?.email}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Amount:</strong> ₦{t.amount}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Status:</strong> {t.status}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No transactions found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={transactionPage === 1} onClick={() => setTransactionPage(transactionPage - 1)}>
                  Previous
                </button>
                {transactionPageNumbers.map((page) => (
                  <button key={page} onClick={() => setTransactionPage(page)} style={pageBtn(transactionPage === page)}>
                    {page}
                  </button>
                ))}
                <button
                  style={btnGhost}
                  disabled={transactionPage === totalTransactionPages}
                  onClick={() => setTransactionPage(transactionPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ SUPPORT TICKETS ═══════ */}
          {tab === "support" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Support Tickets</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Search tickets..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={ticketStatusFilter} onChange={(e) => setTicketStatusFilter(e.target.value)}>
                  <option value="all">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentTickets.length} of {filteredTickets.length} tickets
              </p>

              {currentTickets.map((t) => (
                <div key={t._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Name:</strong> {t.fullName}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {t.email}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Tier:</strong> {t.membershipTier}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Message:</strong> {t.message}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Status:</strong> {t.status}</p>
                  </div>
                  {t.status === "open" && (
                    <button
                      style={{ ...btnSuccess, marginTop: "12px" }}
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/support/resolve/${t._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        fetchTickets();
                      }}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}

              {filteredTickets.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No support tickets found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={ticketPage === 1} onClick={() => setTicketPage(ticketPage - 1)}>
                  Previous
                </button>
                {ticketPageNumbers.map((page) => (
                  <button key={page} onClick={() => setTicketPage(page)} style={pageBtn(ticketPage === page)}>
                    {page}
                  </button>
                ))}
                <button style={btnGhost} disabled={ticketPage === totalTicketPages} onClick={() => setTicketPage(ticketPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ NOTIFICATIONS ═══════ */}
          {tab === "notifications" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Notification Center</h1>

              <div
                style={{
                  background: colors.surface,
                  padding: "22px",
                  borderRadius: radius.lg,
                  marginBottom: "28px",
                  boxShadow: shadowSm,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" }}>
                  <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                  <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
                  <select style={selectStyle} value={targetType} onChange={(e) => setTargetType(e.target.value)}>
                    <option value="all">All Users</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option>
                    <option value="single">Single User</option>
                  </select>

                  {targetType === "single" && (
                    <select style={selectStyle} value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                      <option value="">Choose User</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    style={btnPrimary}
                    onClick={async () => {
                      await axios.post(
                        "http://localhost:5000/api/admin/notifications",
                        {
                          title,
                          message,
                          sendToAll: targetType === "all",
                          targetTier: targetType !== "all" && targetType !== "single" ? targetType : null,
                          targetUser: targetType === "single" ? selectedUser : null,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      setTitle("");
                      setMessage("");
                      setTargetType("all");
                      setSelectedUser("");
                      fetchNotifications();
                    }}
                  >
                    Send Notification
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Search notification..."
                  value={notificationSearch}
                  onChange={(e) => setNotificationSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={notificationFilter} onChange={(e) => setNotificationFilter(e.target.value)}>
                  <option value="all">All Notifications</option>
                  <option value="admin">Admin Sent</option>
                  <option value="system">System Generated</option>
                </select>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentNotifications.length} of {filteredNotifications.length} notifications
              </p>

              {currentNotifications.map((n) => (
                <div key={n._id} style={rowBase}>
                  <h3 style={{ fontFamily: fonts.heading, fontSize: "1.1rem", marginBottom: "6px" }}>{n.title}</h3>
                  <p style={{ marginBottom: "6px" }}>{n.message}</p>
                  {n.targetUser && (
                    <p style={{ marginBottom: "4px" }}>
                      <strong style={{ color: colors.textSecondary }}>User:</strong> {n.targetUser.fullName || "All Users"} ({n.targetUser.email})
                    </p>
                  )}
                  <p style={{ marginBottom: "4px" }}>
                    <strong style={{ color: colors.textSecondary }}>Tier:</strong> {n.targetTier || "All Tiers"}
                  </p>
                  <p style={{ marginBottom: "4px" }}>
                    <strong style={{ color: colors.textSecondary }}>Source:</strong>{" "}
                    {n.senderType === "admin" ? "Admin Broadcast" : "System Generated"}
                  </p>
                  <small style={{ color: colors.textSecondary }}>{new Date(n.createdAt).toLocaleString()}</small>
                  <button
                    style={{ ...btnDanger, marginTop: "12px", marginLeft: "10px" }}
                    onClick={async () => {
                      await axios.delete(`http://localhost:5000/api/admin/notifications/${n._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      fetchNotifications();
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No notifications found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button
                  style={btnGhost}
                  disabled={notificationPage === 1}
                  onClick={() => setNotificationPage(notificationPage - 1)}
                >
                  Previous
                </button>
                {notificationPageNumbers.map((page) => (
                  <button key={page} onClick={() => setNotificationPage(page)} style={pageBtn(notificationPage === page)}>
                    {page}
                  </button>
                ))}
                <button
                  style={btnGhost}
                  disabled={notificationPage === totalNotificationPages}
                  onClick={() => setNotificationPage(notificationPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ USER DETAILS ═══════ */}
          {tab === "userDetails" && selectedUserData && (
            <div>
              <button style={btnGhost} onClick={() => setTab("users")}>
                ← Back
              </button>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, margin: "16px 0 20px" }}>User Details</h1>

              <div style={cardStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "10px" }}>
                  <p><strong style={{ color: colors.textSecondary }}>Full Name:</strong> {selectedUserData.fullName}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Username:</strong> {selectedUserData.username}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Email:</strong> {selectedUserData.email}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Phone:</strong> {selectedUserData.phone}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Tier:</strong> {selectedUserData.membershipTier}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Wallet Balance:</strong> ₦{selectedUserData.walletBalance}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Total Earned:</strong> ₦{selectedUserData.totalEarned}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Referrals:</strong> {selectedUserData.referralsCount}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Referral Earnings:</strong> ₦{selectedUserData.referralEarnings}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Referral Code:</strong> {selectedUserData.referralCode}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Referred By:</strong> {selectedUserData.referredBy || "None"}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Membership Active:</strong> {selectedUserData.membershipActive ? "Yes" : "No"}</p>
                  <p><strong style={{ color: colors.textSecondary }}>Account Status:</strong> {selectedUserData.isBanned ? "Banned" : "Active"}</p>
                </div>

                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: `1px solid ${colors.border}` }}>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.15rem", marginBottom: "12px" }}>Bank Information</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Bank Name:</strong> {selectedUserData?.bank?.name || "N/A"}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Account Name:</strong> {selectedUserData?.bank?.accountName || "N/A"}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Account Number:</strong> {selectedUserData?.bank?.accountNumber || "N/A"}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Currency:</strong> {selectedUserData?.bank?.currency || "NGN"}</p>
                  </div>
                </div>

                <p style={{ marginTop: "12px" }}>
                  <strong style={{ color: colors.textSecondary }}>Joined:</strong> {new Date(selectedUserData?.createdAt).toLocaleString()}
                </p>

                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${colors.border}` }}>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.15rem", marginBottom: "12px" }}>Wallet Adjustment</h2>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <select style={selectStyle} value={walletAction} onChange={(e) => setWalletAction(e.target.value)}>
                      <option value="add">Add Funds</option>
                      <option value="remove">Remove Funds</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      style={inputStyle}
                    />
                    <button
                      style={btnPrimary}
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/admin/users/wallet/${selectedUserData._id}`,
                          { amount: Number(walletAmount), action: walletAction },
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        alert("Wallet updated");
                        fetchUsers();
                      }}
                    >
                      Update Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ ACTIVITY LOGS ═══════ */}
          {tab === "logs" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Activity Logs</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search activity logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={logFilter} onChange={(e) => setLogFilter(e.target.value)}>
                  <option value="all">All Activities</option>
                  <option value="User Banned">User Banned</option>
                  <option value="User Unbanned">User Unbanned</option>
                  <option value="Notification Sent">Notifications</option>
                  <option value="Wallet Credit">Wallet Credits</option>
                  <option value="Wallet Debit">Wallet Debits</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div style={cardStyle}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Total Logs</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>{logs.length}</h2>
                </div>
                <div style={redCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>User Bans</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>
                    {logs.filter((l) => l.action === "User Banned").length}
                  </h2>
                </div>
                <div style={greenCard}>
                  <h3 style={{ fontSize: "0.8rem", textTransform: "uppercase", color: colors.textSecondary, letterSpacing: "1px" }}>Notifications Sent</h3>
                  <h2 style={{ fontFamily: fonts.heading, fontSize: "1.6rem", fontWeight: 700, marginTop: "8px" }}>
                    {logs.filter((l) => l.action === "Notification Sent").length}
                  </h2>
                </div>
              </div>

              <p style={{ color: colors.textSecondary, marginBottom: "16px" }}>
                Showing {currentLogs.length} of {filteredLogs.length} logs
              </p>

              {currentLogs.map((log) => (
                <div key={log._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "6px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>Action:</strong> {log.action}</p>
                    <p><strong style={{ color: colors.textSecondary }}>User:</strong> {log.targetUser?.fullName || "N/A"}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Details:</strong> {log.details}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Date:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No logs found</div>
              )}

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px", flexWrap: "wrap" }}>
                <button style={btnGhost} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
                {pageNumbers.map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={pageBtn(currentPage === page)}>
                    {page}
                  </button>
                ))}
                <button style={btnGhost} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ REPORTS ═══════ */}
          {tab === "reports" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "24px" }}>Reports Center</h1>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px",
                }}
              >
                {[
                  { label: "Download Users Report", endpoint: "users", filename: "users-report.pdf" },
                  { label: "Download Transactions Report", endpoint: "transactions", filename: "transactions-report.pdf" },
                  { label: "Download Withdrawals Report", endpoint: "withdrawals", filename: "withdrawals-report.pdf" },
                  { label: "Download Membership Report", endpoint: "membership", filename: "membership-report.pdf" },
                  { label: "Download Financial Report", endpoint: "financial", filename: "financial-report.pdf" },
                ].map((r) => (
                  <button
                    key={r.endpoint}
                    style={{
                      ...btnPrimary,
                      padding: "18px 24px",
                      fontSize: "1rem",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    onClick={async () => {
                      const res = await axios.get(`http://localhost:5000/api/admin/reports/${r.endpoint}`, {
                        headers: { Authorization: `Bearer ${token}` },
                        responseType: "blob",
                      });
                      const url = window.URL.createObjectURL(new Blob([res.data]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", r.filename);
                      document.body.appendChild(link);
                      link.click();
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ WALLET HISTORY ═══════ */}
          {tab === "walletHistory" && (
            <div>
              <h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Wallet Adjustment History</h1>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <input
                  placeholder="Search history..."
                  value={walletHistorySearch}
                  onChange={(e) => setWalletHistorySearch(e.target.value)}
                  style={{ ...inputStyle, minWidth: "240px" }}
                />
                <select style={selectStyle} value={walletActionFilter} onChange={(e) => setWalletActionFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="add">Credits</option>
                  <option value="remove">Debits</option>
                </select>
              </div>

              {filteredWalletHistory.map((h) => (
                <div key={h._id} style={rowBase}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px" }}>
                    <p><strong style={{ color: colors.textSecondary }}>User:</strong> {h.user?.fullName}</p>
                    <p style={{ color: h.action === "add" ? colors.success : colors.danger, fontWeight: 700 }}>
                      <strong style={{ color: colors.textSecondary }}>Action:</strong> {h.action === "add" ? "Credit" : "Debit"}
                    </p>
                    <p><strong style={{ color: colors.textSecondary }}>Amount:</strong> ₦{h.amount}</p>
                    <p><strong style={{ color: colors.textSecondary }}>Date:</strong> {new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              {filteredWalletHistory.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: colors.textSecondary }}>No history found</div>
              )}
            </div>
          )}

          {tab === "security" && (

<div>

<h1 style={{ fontFamily: fonts.heading, fontSize: "1.8rem", fontWeight: 700, marginBottom: "20px" }}>Change Password</h1>

<input
type="password"
placeholder="Current Password"
value={currentPassword}
onChange={(e)=>
setCurrentPassword(e.target.value)
}
style={{ ...inputStyle, minWidth: "240px", marginRight: "15px" }}
/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>
setNewPassword(e.target.value)
}
style={{ ...inputStyle, minWidth: "240px", marginRight: "15px" }}
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>
setConfirmPassword(e.target.value)
}
style={{ ...inputStyle, minWidth: "240px", marginRight: "15px" }}
/>

<button
style={btnPrimary}
onClick={async () => {


if (
newPassword !== confirmPassword
) {
alert("Passwords do not match");
return;
}

try {

await axios.put(
"http://localhost:5000/api/admin/change-password",
{
currentPassword,
newPassword
},
{
headers:{
Authorization:
`Bearer ${token}`
}
}
);

alert(
"Password changed successfully"
);

setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");


localStorage.removeItem("adminToken");

setView("adminLogin");

} catch (err) {

alert(
err.response?.data?.message ||
"Failed to change password"
);

}

}}
>
Update Password
</button>

</div>

)}
        </main>
      </div>
    </>
  );
}

