import memberImage from "../components/images/member.jpg";
import adminImage from "../components/images/admin.jpg";

export const simulatedUsers = {
  member: {
    id: "USR-001",
    memberId: "MBR-2024-001",
    name: "Allensia Wood",
    email: "allensiawood@gmail.com",
    role: "member",
    title: "Patron & Scholar",
    avatar: memberImage
  },
  admin: {
    id: "USR-002",
    memberId: "ADM-2024-999",
    name: "Prof. Alistair Minerva McGonagall",
    email: "admin@heibook.org",
    role: "admin",
    title: "Chief Archival Officer & Curator",
    avatar: adminImage
  },
  guest: {
    id: "USR-000",
    name: "Guest Explorer",
    email: "",
    role: "guest",
    title: "Public Visitor",
    avatar: ""
  }
};
