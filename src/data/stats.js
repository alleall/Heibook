export const baselineStats = {
  totalCatalogTitles: 1248,
  totalCopies: 4892,
  inStacksCopies: 3950,
  registeredMembers: 342,
  activeBorrowings: 87,
  overdueBooks: 12,
  circulationPolicy: {
    maxQuota: 3,
    lendingDays: 7,
    maxExtensions: 1,
    finePerDay: 1000
  },
  weeklyCirculation: [
    { day: "Mon", borrows: 42, returns: 38 },
    { day: "Tue", borrows: 56, returns: 48 },
    { day: "Wed", borrows: 64, returns: 52 },
    { day: "Thu", borrows: 48, returns: 44 },
    { day: "Fri", borrows: 72, returns: 60 },
    { day: "Sat", borrows: 88, returns: 74 },
    { day: "Sun", borrows: 34, returns: 29 }
  ],
  popularDisciplines: [
    { name: "Computer Science", percentage: 34, growth: "+14%" },
    { name: "Design & Architecture", percentage: 28, growth: "+8%" },
    { name: "Data & Systems", percentage: 22, growth: "+19%" },
    { name: "Philosophy & Epistemology", percentage: 16, growth: "+4%" }
  ]
};
