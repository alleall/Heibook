import memberImage from "../components/images/member.jpg";
import harryImage from "../components/images/harry.jpg";
import hermioneImage from "../components/images/hermione.jpg";
import ronImage from "../components/images/ron.jpg";
import lunaImage from "../components/images/luna.jpg";
import malfoyImage from "../components/images/malfoy.jpg";

export const initialMembers = [
  {
    id: "MBR-2024-001",
    name: "Allensia Wood",
    email: "allensiawood@gmail.com",
    phone: "+62 812-3456-7890",
    role: "Scholar & Patron",
    membershipNumber: "HBK-992014-E",
    memberSince: "12 Oct 2023",
    status: "Active",
    activeBorrowings: 2,
    maxQuota: 3,
    totalHistorical: 14,
    avatar: memberImage,
    department: "Muggle Informatics Engineering &  Potions Magical Computing",
    notes: "Distinguished researcher in archival interfaces and computational typography."
  },
  {
    id: "MBR-2024-002",
    name: "Harry Potter",
    email: "thechosenone@gmail.com",
    phone: "+62 813-8899-1122",
    role: "Graduate Student",
    membershipNumber: "HBK-202401-A",
    memberSince: "05 Jan 2024",
    status: "Active",
    activeBorrowings: 1,
    maxQuota: 3,
    totalHistorical: 8,
    avatar: harryImage,
    department: "Defense Against the Dark Arts & Auror Studies",
    notes: "Focusing on distributed consensus and transaction protocols."
  },
  {
    id: "MBR-2024-003",
    name: "Hermione Granger",
    email: "hermionegranger@gmail.com",
    phone: "+62 811-2233-4455",
    role: "Senior Researcher",
    membershipNumber: "HBK-202308-C",
    memberSince: "18 Aug 2023",
    status: "Active",
    activeBorrowings: 3,
    maxQuota: 3,
    totalHistorical: 26,
    avatar: hermioneImage,
    department: "Arithmancy & Magical Theory",
    notes: "Active borrowing quota reached (3/3). Renewal pending return of physical copy."
  },
  {
    id: "MBR-2024-004",
    name: "Ron Weasley",
    email: "ron.weasley@gmail.com",
    phone: "+62 817-6655-4433",
    role: "Undergraduate Fellow",
    membershipNumber: "HBK-202402-D",
    memberSince: "14 Feb 2024",
    status: "Active",
    activeBorrowings: 1,
    maxQuota: 3,
    totalHistorical: 5,
    avatar: ronImage,
    department: "Magical Creatures & Wizarding Strategy",
    notes: "Has 1 overdue volume. Circulation alert sent via notification system."
  },
  {
    id: "MBR-2024-005",
    name: "Luna Lovegood",
    email: "lovegoodluna@gmail.com",
    phone: "+62 819-0011-2233",
    role: "Faculty Member",
    membershipNumber: "HBK-202209-S",
    memberSince: "01 Sep 2022",
    status: "Active",
    activeBorrowings: 0,
    maxQuota: 3,
    totalHistorical: 32,
    avatar: lunaImage,
    department: "Magical Creatures & Xenobiology",
    notes: "Zero active loans currently. Eligible for immediate express borrow."
  },
  {
    id: "MBR-2024-006",
    name: "Draco Malfoy",
    email: "scaredpotter@gmail.com",
    phone: "+62 815-4433-2211",
    role: "Visiting Scholar",
    membershipNumber: "HBK-202311-B",
    memberSince: "20 Nov 2023",
    status: "Suspended",
    activeBorrowings: 0,
    maxQuota: 3,
    totalHistorical: 3,
    avatar: malfoyImage,
    department: "Dark Arts & Magical Heritage",
    notes: "Suspended pending administrative verification of academic credentials."
  }
];
