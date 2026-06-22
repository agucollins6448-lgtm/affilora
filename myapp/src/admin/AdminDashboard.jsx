import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";



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
  const [logSearch, setLogSearch] = useState("");
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletAction, setWalletAction] = useState("add");
  const [logs, setLogs] = useState([]);
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
        ) ||
        user.username
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
        user.phone
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
   COMPONENT
   ═════════════════════════════════════════ */

  return (
    <>
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="globalStyle global">
        {/* ═══════ SIDEBAR ═══════ */}
        <aside>
          <h2 className="adminText">
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
            { key: "security", label: "Security" },
          ].map((item) => (
            <button 
              key={item.key}              
              className={`sidebarBtn ${tab === item.key ? "active" : "" }`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}

          <button className="btnBase btnDanger logout"
            onClick={onLogout}
          >
            Logout
          </button>
        </aside>

        {/* ═══════ MAIN ═══════ */}
        <main>
          {/* Status + Page size */}
          <div className="stat">
            <p className="status">
              Status:{" "}
            <span
              className={
                connected
                  ? "statusLive"
                  : "statusOffline"
              }
            >
              {connected ? "Live" : "Offline"}
            </span>
            </p>

            <div className="pgSz">
              <span className="show">Show:</span>
              <select
                className="inputStyle selectStyle"
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
            <div className="overview">
              <h1 className="sysOv">
                System Overview
              </h1>

              <div className="cards">
                <div className="makeCard cardStyle">
                  <h3 className="totUs">
                    Total Users
                  </h3>
                  <h1 className="cardValues">{totalUsers}</h1>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardText">
                    Banned Users
                  </h3>
                  <h1 className="cardValues">{bannedUsers}</h1>
                </div>
                <div className="makeCard cardStyle">
                  <h3 className="cardText">
                    Active Members
                  </h3>
                  <h1 className="cardValues">{activeMembers}</h1>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardText">
                    Total Revenue
                  </h3>
                  <h1 className="cardValues">₦{totalRevenue.toLocaleString()}</h1>
                </div>
                <div className="makeCard purpleCard">
                  <h3 className="cardText">
                    Pending Memberships
                  </h3>
                  <h1 className="cardValues">{totalMembershipRequests}</h1>
                </div>
                <div className="makeCard orangeCard">
                  <h3 className="cardText">
                    Pending Withdrawals
                  </h3>
                  <h1 className="cardValues">{pendingWithdrawals}</h1>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardText">
                    Approved Withdrawals
                  </h3>
                  <h1 className="cardValues">{approvedWithdrawals}</h1>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardText">
                    Total Withdrawn
                  </h3>
                  <h1 className="cardValues">₦{totalWithdrawn.toLocaleString()}</h1>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardText">
                    Withdrawal Volume
                  </h3>
                  <h1 className="cardValues">₦{totalWithdrawalAmount.toLocaleString()}</h1>
                </div>
                <div className="makeCard cardStyle">
                  <h3 className="cardText">
                    Wallet Balances
                  </h3>
                  <h1 className="cardValues">₦{totalWalletBalance.toLocaleString()}</h1>
                </div>
                <div className="makeCard cardStyle">
                  <h3 className="cardText">
                    Ad Rewards
                  </h3>
                  <h1 className="cardValues">₦{totalAds.toLocaleString()}</h1>
                </div>
                <div className="makeCard orangeCard">
                  <h3 className="cardText">
                    Survey Rewards
                  </h3>                  
                  <h1 className="cardValues">₦{totalSurveys.toLocaleString()}</h1>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardText">
                    Referral Bonuses
                  </h3>
                  <h1 className="cardValues">₦{totalReferrals.toLocaleString()}</h1>
                
                </div>
                <div className="makeCard orangeCard">
                  <h3 className="cardText">
                    Open Support Tickets
                  </h3>
                  <h1 className="cardValues">{openSupportTickets}</h1>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardText">
                    Action Required
                  </h3>
                  <h1 className="cardValues">{actionRequired}</h1>
                </div>
              </div>
            </div>
          )}

          {/* ═══════ USERS ═══════ */}
          {tab === "users" && (
            <div>
              <h1 className="tab">Users</h1>

              <div className="seFiSo">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select className="inputStyle selectStyle" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
                  <option value="all">All Tiers</option>
                  <option value="Starter">Starter</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Premium">Premium</option>
                </select>
                <select className="inputStyle selectStyle" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="balance">Highest Balance</option>
                  <option value="referrals">Most Referrals</option>
                </select>
              </div>

              <p className="showing">
                Showing {currentUsers.length} of {filteredUsers.length} users
              </p>

              {currentUsers.map((u) => (
                <div key={u._id} className="rowBase">
                  <div className="usLi">
                    <p><strong className="usText">Name:</strong> {u.fullName}</p>
                    <p><strong className="usText">Email:</strong> {u.email}</p>
                    <p><strong className="usText">Tier:</strong> {u.membershipTier}</p>
                    <p><strong className="usText">Balance:</strong> ₦{u.walletBalance}</p>
                    <p><strong className="usText">Referrals:</strong> {u.referralsCount}</p>
                  </div>
                  <div className="usButtons">
                    <button
                      className="btnBase btnDanger"
                      onClick={async () => {
                          const confirmDelete =
                          window.confirm(
                            "Are you sure you want to delete this user?"
                          );

                        if (!confirmDelete) return;

                        const text = prompt(
                        'Type DELETE to confirm your action'
                      );

                      if (text !== "DELETE") return;

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
                      className="btnBase btnGhost"
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
                      className="btnBase btnGhost"
                      onClick={async () => {
                        await axios.put(
                          `http://localhost:5000/api/admin/users/membership-reset/${u._id}`,
                          {},
                          { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (u.membershipTier === "Starter"){
                          return;
                        }
                        alert("Membership Reset");
                        fetchUsers();
                      }}
                    >
                      Reset Membership
                    </button>

                    <button
                      className="btnBase btnGhost"
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
                      className="btnBase btnPrimary"
                      onClick={() => {
                        setSelectedUserData(u);
                        setTab("userDetails");
                      }}
                    >
                      View User
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="noFound">No users found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>
                  Previous
                </button>
                {userPageNumbers.map((page) => (
                  <button key={page} onClick={() => setUserPage(page)} className={`pageBtn ${userPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button className="btnBase btnGhost" disabled={userPage === totalUserPages} onClick={() => setUserPage(userPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ WITHDRAWALS ═══════ */}
          {tab === "withdrawals" && (
            <div>
              <h1 className="tab">Withdrawals</h1>

              <div className="seFiSo">
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={withdrawalSearch}
                  onChange={(e) => setWithdrawalSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select
                  className="inputStyle selectStyle"
                  value={withdrawalStatusFilter}
                  onChange={(e) => setWithdrawalStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="wiCard">
                <div className="makeCard cardStyle">
                  <h3 className="cardDesc">Total Paid Out</h3>
                  <h2 className="incardValues">₦{totalWithdrawn}</h2>
                </div>
                <div className="makeCard orangeCard">
                  <h3 className="cardDesc">Pending Amount</h3>
                  <h2 className="incardValues">₦{pendingAmount}</h2>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardDesc">Approved Amount</h3>
                  <h2 className="incardValues">₦{approvedAmount}</h2>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardDesc">Rejected Amount</h3>
                  <h2 className="incardValues">₦{rejectedAmount}</h2>
                </div>
              </div>

              <p className="showing">
                Showing {currentWithdrawals.length} of {filteredWithdrawals.length} withdrawals
              </p>

              {currentWithdrawals.map((w) => (
                <div key={w._id} className="rowBase">
                  <div className="usLi">
                    <p><strong className="usText">Name:</strong> {w.user?.fullName}</p>
                    <p><strong className="usText">Email:</strong> {w.user?.email}</p>
                    <p><strong className="usText">Tier:</strong> {w.user?.membershipTier}</p>
                    <p><strong className="usText">Amount:</strong> ₦{w.amount}</p>
                    <p><strong className="usText">Bank:</strong> {w.bankName}</p>
                    <p><strong className="usText">Account Name:</strong> {w.accountName}</p>
                    <p><strong className="usText">Account Number:</strong> {w.accountNumber}</p>
                    <p><strong className="usText">Slip:</strong> {w.slipNumber}</p>
                    <p><strong className="usText">Status: </strong><span   className={`${w.status === "success" ? "appr" : w.status === "pending" ? "pendi" : "rejec"}`}>{w.status}</span></p>
                  </div>
                  {w.status === "pending" && (
                    <div className="usButtons">
                      <button
                        className="btnBase btnSuccess"
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
                        className="btnBase btnDanger"
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
                <div className="noFound">No withdrawals found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={withdrawalPage === 1} onClick={() => setWithdrawalPage(withdrawalPage - 1)}>
                  Previous
                </button>
                {withdrawalPageNumbers.map((page) => (
                  <button key={page} onClick={() => setWithdrawalPage(page)} className={`pageBtn ${withdrawalPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button
                  className="btnBase btnGhost"
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
              <h1 className="tab">
                Membership Requests
              </h1>

              <div className="seFiSo">
                <input
                  placeholder="Search requests..."
                  value={membershipSearch}
                  onChange={(e) => setMembershipSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select
                  className="inputStyle selectStyle"
                  value={membershipStatusFilter}
                  onChange={(e) => setMembershipStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="memCard">
                <div className="makeCard starterCard">
                  <h3 className="cardDesc">Starter Members</h3>
                  <h1 className="memValues">{starterCount}</h1>
                </div>
                <div className="makeCard bronzeCard">
                  <h3 className="cardDesc">Bronze Members</h3>
                  <h1 className="memValues">{bronzeCount}</h1>
                </div>
                <div className="makeCard silverCard">
                  <h3 className="cardDesc">Silver Members</h3>
                  <h1 className="memValues">{silverCount}</h1>
                </div>
                <div className="makeCard goldCard">
                  <h3 className="cardDesc">Gold Members</h3>
                  <h1 className="memValues">{goldCount}</h1>
                </div>
                <div className="makeCard premiumCard">
                  <h3 className="cardDesc">Premium Members</h3>
                  <h1 className="memValues">{premiumCount}</h1>
                </div>
              </div>

              <p className="showing">
                Showing {currentMembershipRequests.length} of {filteredMembershipRequests.length} requests
              </p>

              {currentMembershipRequests.map((r) => (
                <div key={r._id} className="rowBase">
                  <div className="memLi">
                    <p><strong className="usText">Name:</strong> {r.user?.fullName}</p>
                    <p><strong className="usText">Email:</strong> {r.user?.email}</p>
                    <p><strong className="usText">Plan:</strong> 
                    <span className={`${r.plan === "Bronze" ? "bronze" : r.plan === "Silver" ? "silver" 
                      : r.plan === "Gold" ? "gold" : r.plan === "Premium" ? "premium" : ""}`}> {r.plan}</span></p>
                    <p><strong className="usText">Amount:</strong> ₦{r.amount}</p>
                    <p><strong className="usText">Status:</strong> {r.status}</p>
                  </div>
                  {r.status === "pending" && (
                    <div className="usButtons">
                      <button
                        className="btnBase btnSuccess"
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
                        className="btnBase btnDanger"
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
                <div className="noFound">No membership requests found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={membershipPage === 1} onClick={() => setMembershipPage(membershipPage - 1)}>
                  Previous
                </button>
                {membershipPageNumbers.map((page) => (
                  <button key={page} onClick={() => setMembershipPage(page)} className={`pageBtn ${membershipPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button
                  className="btnBase btnGhost"
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
              <h1 className="tab">Activation Codes</h1>

              <div className="crSe">
                <div className="cr">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="inputStyle seAc"
                  />
                  <button
                    className="btnBase btnPrimary"
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
                  className="inputStyle seAc"
                />
              </div>

              <div className="genCo">
                <h2 className="f115">Generate Activation Codes</h2>
                <button
                  className="btnBase btnPrimary"
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
                <div key={c._id} className="rowBase">
                  <div className="acLi">
                    <p><strong className="usText">Code:</strong> {c.code}</p>
                    <p><strong className="usText">Used:</strong> {c.used ? "Yes" : "No"}</p>
                    <p><strong className="usText">Payment Confirmed:</strong> {c.paymentConfirmed ? "Yes" : "No"}</p>
                  </div>
                  {!c.paymentConfirmed && (
                    <button
                      className="btnBase btnSuccess conPay"
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
              <h1 className="tab">All Transactions</h1>

              <div className="seFiSo">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select className="inputStyle selectStyle" value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value)}>
                  <option value="all">All Transactions</option>
                  <option value="ads">Ad Rewards</option>
                  <option value="referral">Referrals</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="survey">Surveys</option>
                  <option value="admin">Admin</option>
                </select>
                <select className="inputStyle selectStyle" value={transactionSort} onChange={(e) => setTransactionSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>

              <div className="othCard">
                <div className="makeCard cardStyle">
                  <h3 className="cardDesc">Ad Rewards</h3>
                  <h2 className="incardValues">₦{totalAds}</h2>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardDesc">Referral Bonuses</h3>
                  <h2 className="incardValues">₦{totalReferrals}</h2>
                </div>
                <div className="makeCard orangeCard">
                  <h3 className="cardDesc">Survey Rewards</h3>
                  <h2 className="incardValues">₦{totalSurveys}</h2>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardDesc">Withdrawals</h3>
                  <h2 className="incardValues">₦{totalWithdrawalAmount}</h2>
                </div>
                <div className="makeCard purpleCard">
                  <h3 className="cardDesc">Total Transactions</h3>
                  <h2 className="incardValues">{transactions.length}</h2>
                </div>
              </div>

              <p className="showing">
                Showing {currentTransactions.length} of {filteredTransactions.length} transactions
              </p>

              {currentTransactions.map((t) => (
                <div key={t._id} className="rowBase">
                  <p className="p">
                    <strong className="usText">Type:</strong>{" "}
                    <span   className={`tranCol 
                    ${t.type === "withdrawal" ? "with" 
                    : t.type === "referral" ? "refer"
                    : t.type === "ads" ? "ad"
                    : t.type === "survey" ? "surv"
                    : ""}`}
                    >
                      {t.type.toUpperCase()}
                    </span>
                  </p>
                  <div className="tranLi">
                    <p><strong className="usText">User:</strong> {t.user?.fullName}</p>
                    <p><strong className="usText">Email:</strong> {t.user?.email}</p>
                    <p><strong className="usText">Amount:</strong> ₦{t.amount}</p>
                    <p><strong className="usText">Status:</strong> {t.status}</p>
                    <p><strong className="usText">Date:</strong> {new Date(t.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <div className="noFound">No transactions found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={transactionPage === 1} onClick={() => setTransactionPage(transactionPage - 1)}>
                  Previous
                </button>
                {transactionPageNumbers.map((page) => (
                  <button key={page} onClick={() => setTransactionPage(page)} className={`pageBtn ${transactionPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button
                  className="btnBase btnGhost"
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
              <h1 className="tab">Support Tickets</h1>

              <div className="seFiSo">
                <input
                  placeholder="Search tickets..."
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select className="inputStyle selectStyle" value={ticketStatusFilter} onChange={(e) => setTicketStatusFilter(e.target.value)}>
                  <option value="all">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <p className="showing">
                Showing {currentTickets.length} of {filteredTickets.length} tickets
              </p>

              {currentTickets.map((t) => (
                <div key={t._id} className="rowBase">
                  <div className="tranLi">
                    <p><strong className="usText">Name:</strong> {t.fullName}</p>
                    <p><strong className="usText">Email:</strong> {t.email}</p>
                    <p><strong className="usText">Tier:</strong> {t.membershipTier}</p>
                    <p><strong className="usText">Message:</strong> {t.message}</p>
                    <p><strong className="usText">Status:</strong> {t.status}</p>
                  </div>
                  {t.status === "open" && (
                    <button
                      className="btnBase btnSuccess conPay"
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
                <div className="noFound">No support tickets found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={ticketPage === 1} onClick={() => setTicketPage(ticketPage - 1)}>
                  Previous
                </button>
                {ticketPageNumbers.map((page) => (
                  <button key={page} onClick={() => setTicketPage(page)} className={`pageBtn ${ticketPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button className="btnBase btnGhost" disabled={ticketPage === totalTicketPages} onClick={() => setTicketPage(ticketPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ═══════ NOTIFICATIONS ═══════ */}
          {tab === "notifications" && (
            <div>
              <h1 className="tab">Notification Center</h1>

              <div className="sendNo"> 
                <div className="seFi">
                  <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="inputStyle" />
                  <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="inputStyle" />
                  <select className="inputStyle selectStyle" value={targetType} onChange={(e) => setTargetType(e.target.value)}>
                    <option value="all">All Users</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option>
                    <option value="single">Single User</option>
                  </select>

                  {targetType === "single" && (
                    <select className="inputStyle selectStyle" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                      <option value="">Choose User</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.fullName}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    className="btnBase btnPrimary"
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
                      alert("Notification sent")
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

              <div className="seFiSo">
                <input
                  placeholder="Search notification..."
                  value={notificationSearch}
                  onChange={(e) => setNotificationSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select className="inputStyle selectStyle" value={notificationFilter} onChange={(e) => setNotificationFilter(e.target.value)}>
                  <option value="all">All Notifications</option>
                  <option value="admin">Admin Sent</option>
                  <option value="system">System Generated</option>
                </select>
              </div>

              <p className="showing">
                Showing {currentNotifications.length} of {filteredNotifications.length} notifications
              </p>

              {currentNotifications.map((n) => (
                <div key={n._id} className="rowBase">
                  <h3 className="notifTitle">{n.title}</h3>
                  <p className="p">{n.message}</p>
                  {n.targetUser && (
                    <p className="notifInfo">
                      <strong className="usText">User:</strong> {n.targetUser.fullName || "All Users"} ({n.targetUser.email})
                    </p>
                  )}
                  <p className="notifInfo">
                    <strong className="usText">Tier:</strong> {n.targetTier || "All Tiers"}
                  </p>
                  <p className="notifInfo">
                    <strong className="usText">Source:</strong>{" "}
                    {n.senderType === "admin" ? "Admin Broadcast" : "System Generated"}
                  </p>
                  <small className="usText">{new Date(n.createdAt).toLocaleString()}</small>
                  <button
                    className="btnBase btnDanger notifDel"
                    onClick={async () => {

                        const confirmDelete =
                        window.confirm(
                          "Delete notification?"
                        );

                      if (!confirmDelete) return;

                      await axios.delete(`http://localhost:5000/api/admin/notifications/${n._id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      alert("Notification deleted")
                      fetchNotifications();
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="noFound">No notifications found</div>
              )}

              <div className="paginButtons">
                <button
                  className="btnBase btnGhost"
                  disabled={notificationPage === 1}
                  onClick={() => setNotificationPage(notificationPage - 1)}
                >
                  Previous
                </button>
                {notificationPageNumbers.map((page) => (
                  <button key={page} onClick={() => setNotificationPage(page)} className={`pageBtn ${notificationPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button
                  className="btnBase btnGhost"
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
              <button className="btnBase btnGhost" onClick={() => setTab("users")}>
                ← Back
              </button>
              <h1 className="usDet">User Details</h1>

              <div className="makeCard cardStyle">
                <div className="usStru">
                  <p><strong className="usText">Full Name:</strong> {selectedUserData.fullName}</p>
                  <p><strong className="usText">Username:</strong> {selectedUserData.username}</p>
                  <p><strong className="usText">Email:</strong> {selectedUserData.email}</p>
                  <p><strong className="usText">Phone:</strong> {selectedUserData.phone}</p>
                  <p><strong className="usText">Tier:</strong> {selectedUserData.membershipTier}</p>
                  <p><strong className="usText">Wallet Balance:</strong> ₦{selectedUserData.walletBalance}</p>
                  <p><strong className="usText">Total Earned:</strong> ₦{selectedUserData.totalEarned}</p>
                  <p><strong className="usText">Referrals:</strong> {selectedUserData.referralsCount}</p>
                  <p><strong className="usText">Referral Earnings:</strong> ₦{selectedUserData.referralEarnings}</p>
                  <p><strong className="usText">Referral Code:</strong> {selectedUserData.referralCode}</p>
                  <p><strong className="usText">Referred By:</strong> {selectedUserData.referredBy?.username || "None"}</p>
                  <p><strong className="usText">Membership Active:</strong> {selectedUserData.membershipActive ? "Yes" : "No"}</p>
                  <p><strong className="usText">Account Status:</strong> {selectedUserData.isBanned ? "Banned" : "Active"}</p>
                </div>

                <div className="usBank">
                  <h2 className="f115">Bank Information</h2>
                  <div className="usBankdiv">
                    <p><strong className="usText">Bank Name:</strong> {selectedUserData?.bank?.name || "N/A"}</p>
                    <p><strong className="usText">Account Name:</strong> {selectedUserData?.bank?.accountName || "N/A"}</p>
                    <p><strong className="usText">Account Number:</strong> {selectedUserData?.bank?.accountNumber || "N/A"}</p>
                    <p><strong className="usText">Currency:</strong> {selectedUserData?.bank?.currency || "NGN"}</p>
                  </div>
                </div>

                <p className="conPay">
                  <strong className="usText">Joined:</strong> {new Date(selectedUserData?.createdAt).toLocaleString()}
                </p>

                <div className="walAdj">
                  <h2 className="f115">Wallet Adjustment</h2>
                  <div className="walAdjdiv">
                    <select className="inputStyle selectStyle" value={walletAction} onChange={(e) => setWalletAction(e.target.value)}>
                      <option value="add">Add Funds</option>
                      <option value="remove">Remove Funds</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      className="inputStyle se"
                    />
                    <button
                      className="btnBase btnPrimary"
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
              <h1 className="tab">Activity Logs</h1>

              <div className="seFiSo">
                <input
                  type="text"
                  placeholder="Search activity logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="inputStyle se"
                />
                <select className="inputStyle selectStyle" value={logFilter} onChange={(e) => setLogFilter(e.target.value)}>
                  <option value="all">All Activities</option>
                  <option value="User Banned">User Banned</option>
                  <option value="User Unbanned">User Unbanned</option>
                  <option value="Notification Sent">Notifications</option>
                  <option value="Wallet Credit">Wallet Credits</option>
                  <option value="Wallet Debit">Wallet Debits</option>
                </select>
              </div>

              <div className="othCard">
                <div className="makeCard cardStyle">
                  <h3 className="cardDesc">Total Logs</h3>
                  <h2 className="incardValues">{logs.length}</h2>
                </div>
                <div className="makeCard redCard">
                  <h3 className="cardDesc">User Bans</h3>
                  <h2 className="incardValues">
                    {logs.filter((l) => l.action === "User Banned").length}
                  </h2>
                </div>
                <div className="makeCard greenCard">
                  <h3 className="cardDesc">Notifications Sent</h3>
                  <h2 className="incardValues">
                    {logs.filter((l) => l.action === "Notification Sent").length}
                  </h2>
                </div>
              </div>

              <p className="showing">
                Showing {currentLogs.length} of {filteredLogs.length} logs
              </p>

              <button className={`btnBase btnDanger ${filteredLogs.length === 0 ? "logDelete" : ""}`} style={{marginBottom: "10px"}} disabled={filteredLogs.length === 0}
onClick={async () => {

  const confirmDelete =
    window.confirm(
      "Delete all activity logs?"
    );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      "http://localhost:5000/api/admin/logs",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    alert(
      "All logs deleted"
    );

    fetchLogs();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to delete logs"
    );

  }

}}
>
Delete All Logs
</button>

              {currentLogs.map((log) => (
                           
                <div key={log._id} className="rowBase">
                  <div className="logInfo">
                    <p><strong className="usText">Action:</strong> {log.action}</p>
                    <p><strong className="usText">User:</strong> {log.targetUser?.fullName || "N/A"}</p>
                    <p><strong className="usText">Details:</strong> {log.details}</p>
                    <p><strong className="usText">Date:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div> 
              ))}

              {filteredLogs.length === 0 && (
                <div className="noFound">No logs found</div>
              )}

              <div className="paginButtons">
                <button className="btnBase btnGhost" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
                {pageNumbers.map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`pageBtn ${currentPage === page ? "active" : ""}`}>
                    {page}
                  </button>
                ))}
                <button className="btnBase btnGhost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (

<div>

<h1 className="tab">Change Password</h1>

<input
type="password"
placeholder="Current Password"
value={currentPassword}
onChange={(e)=>
setCurrentPassword(e.target.value)
}
className="inputStyle pass"/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>
setNewPassword(e.target.value)
}
className="inputStyle pass"/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>
setConfirmPassword(e.target.value)
}
className="inputStyle pass"/>

<button
className="btnBase btnPrimary"
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

