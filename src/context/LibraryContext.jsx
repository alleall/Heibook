import React, { createContext, useContext, useState, useMemo } from "react";
import { initialBooks } from "../data/books";
import { initialCategories } from "../data/categories";
import { initialMembers } from "../data/members";
import { initialBorrowings } from "../data/borrowings";
import { baselineStats } from "../data/stats";
import { simulatedUsers } from "../data/users";
import memberImage from "../components/images/member.jpg";

const LibraryContext = createContext(null);

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState(initialBooks);
  const [categories, setCategories] = useState(initialCategories);
  const [members, setMembers] = useState(initialMembers);
  const [borrowings, setBorrowings] = useState(initialBorrowings);
  const [userRole, setUserRole] = useState("member"); // "member" | "admin" | "guest"
  const [toasts, setToasts] = useState([]);

  const [circulationPolicy, setCirculationPolicy] = useState(baselineStats.circulationPolicy);

  // Active user entity based on selected role
  const currentUser = useMemo(() => {
    return simulatedUsers[userRole] || simulatedUsers.member;
  }, [userRole]);

  // Toast notification helper
  const addToast = (type, title, message) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper date generators
  const getTodayISO = () => new Date().toISOString().split("T")[0];
  const getFutureISO = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  // Synchronized Baseline Statistics
  const stats = useMemo(() => {
    const titleDelta = books.length - initialBooks.length;
    const memberDelta = members.length - initialMembers.length;
    const activeBorrowingsCount = borrowings.filter(
      (b) => b.status === "Active" || b.status === "Due Soon" || b.status === "Overdue"
    ).length;
    const initialActiveCount = initialBorrowings.filter(
      (b) => b.status === "Active" || b.status === "Due Soon" || b.status === "Overdue"
    ).length;
    const activeDelta = activeBorrowingsCount - initialActiveCount;

    const overdueCount = borrowings.filter((b) => b.status === "Overdue").length;
    const initialOverdueCount = initialBorrowings.filter((b) => b.status === "Overdue").length;
    const overdueDelta = overdueCount - initialOverdueCount;

    return {
      totalCatalogTitles: baselineStats.totalCatalogTitles + titleDelta,
      totalCopies: baselineStats.totalCopies + titleDelta * 4,
      inStacksCopies: baselineStats.inStacksCopies - activeDelta,
      registeredMembers: baselineStats.registeredMembers + memberDelta,
      activeBorrowings: baselineStats.activeBorrowings + activeDelta,
      overdueBooks: baselineStats.overdueBooks + overdueDelta,
      circulationPolicy,
      weeklyCirculation: baselineStats.weeklyCirculation,
      popularDisciplines: baselineStats.popularDisciplines
    };
  }, [books, members, borrowings, circulationPolicy]);

  // ==========================================
  // CIRCULATION ACTIONS
  // ==========================================

  const borrowBook = (bookId, targetMemberId = null) => {
    const activeMemberId = targetMemberId || currentUser.memberId;
    const member = members.find((m) => m.id === activeMemberId);

    if (!member) {
      addToast("error", "Member Not Found", "Selected library patron does not exist in registry.");
      return { success: false, reason: "Member not found" };
    }

    if (member.status === "Suspended") {
      addToast("error", "Borrowing Denied", "Patron membership is currently suspended. Please contact circulation desk.");
      return { success: false, reason: "Suspended" };
    }

    if (member.activeBorrowings >= circulationPolicy.maxQuota) {
      addToast(
        "error",
        "Borrowing Limit Reached",
        `You have reached the maximum active borrowing quota of ${circulationPolicy.maxQuota} books.`
      );
      return { success: false, reason: "Quota full" };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) {
      addToast("error", "Book Not Found", "Requested title is not present in catalog ledger.");
      return { success: false, reason: "Book not found" };
    }

    if (book.availableCopies <= 0) {
      addToast("error", "Out of Stock", "All physical copies of this title are currently checked out.");
      return { success: false, reason: "No stock" };
    }

    // Check if member already has this book checked out
    const alreadyBorrowed = borrowings.some(
      (b) => b.bookId === bookId && b.memberId === activeMemberId && b.status !== "Returned"
    );
    if (alreadyBorrowed) {
      addToast("error", "Duplicate Loan", "You are already actively borrowing a copy of this book.");
      return { success: false, reason: "Already borrowed" };
    }

    // Execute Borrowing
    const newLoanId = `LN-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLoan = {
      id: newLoanId,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      shelfLocation: book.shelfLocation,
      isbn: book.isbn,
      ddc: book.ddc,
      memberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      borrowDate: getTodayISO(),
      dueDate: getFutureISO(circulationPolicy.lendingDays),
      returnDate: null,
      status: "Active",
      extensionsCount: 0,
      maxExtensions: circulationPolicy.maxExtensions,
      fineAmount: 0,
      notes: "Standard circulation loan registered via online catalog desk."
    };

    // Update book stock
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              borrowedCopies: b.borrowedCopies + 1,
              availableCopies: b.availableCopies - 1,
              status: b.availableCopies - 1 === 0 ? "Checked Out" : "Available"
            }
          : b
      )
    );

    // Update member active count
    setMembers((prev) =>
      prev.map((m) =>
        m.id === activeMemberId
          ? { ...m, activeBorrowings: m.activeBorrowings + 1, totalHistorical: m.totalHistorical + 1 }
          : m
      )
    );

    // Append to borrowings
    setBorrowings((prev) => [newLoan, ...prev]);

    addToast(
      "success",
      "Loan Confirmed",
      `"${book.title}" successfully borrowed. Due date is ${newLoan.dueDate}.`
    );

    return { success: true, loan: newLoan };
  };

  const returnBook = (loanId) => {
    const loan = borrowings.find((b) => b.id === loanId);
    if (!loan) {
      addToast("error", "Loan Not Found", "Circulation record does not exist.");
      return { success: false };
    }

    if (loan.status === "Returned") {
      addToast("info", "Already Returned", "This book has already been marked as returned.");
      return { success: false };
    }

    // Update loan status
    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === loanId
          ? { ...b, status: "Returned", returnDate: getTodayISO() }
          : b
      )
    );

    // Replenish book stock
    setBooks((prev) =>
      prev.map((b) =>
        b.id === loan.bookId
          ? {
              ...b,
              borrowedCopies: Math.max(0, b.borrowedCopies - 1),
              availableCopies: b.availableCopies + 1,
              status: "Available"
            }
          : b
      )
    );

    // Decrement member active count
    setMembers((prev) =>
      prev.map((m) =>
        m.id === loan.memberId
          ? { ...m, activeBorrowings: Math.max(0, m.activeBorrowings - 1) }
          : m
      )
    );

    addToast(
      "success",
      "Return Processed",
      `"${loan.bookTitle}" has been returned and checked into archival stacks.`
    );

    return { success: true };
  };

  const extendLoan = (loanId) => {
    const loan = borrowings.find((b) => b.id === loanId);
    if (!loan) {
      addToast("error", "Loan Not Found", "Circulation record not found.");
      return { success: false };
    }

    if (loan.status === "Returned") {
      addToast("error", "Invalid Action", "Cannot extend an already returned loan.");
      return { success: false };
    }

    if (loan.status === "Overdue") {
      addToast("error", "Extension Blocked", "Overdue loans cannot be renewed. Please return the book and settle fines.");
      return { success: false };
    }

    if (loan.extensionsCount >= loan.maxExtensions) {
      addToast(
        "error",
        "Extension Limit Reached",
        `Each borrowing may only be renewed ${loan.maxExtensions} time.`
      );
      return { success: false };
    }

    // Extend due date by configured lending days from current due date
    const currentDueDate = new Date(loan.dueDate);
    currentDueDate.setDate(currentDueDate.getDate() + circulationPolicy.lendingDays);
    const newDueDate = currentDueDate.toISOString().split("T")[0];

    setBorrowings((prev) =>
      prev.map((b) =>
        b.id === loanId
          ? {
              ...b,
              dueDate: newDueDate,
              extensionsCount: b.extensionsCount + 1,
              status: "Active"
            }
          : b
      )
    );

    addToast(
      "success",
      "Loan Renewed",
      `"${loan.bookTitle}" renewed by 7 days. New due date: ${newDueDate}.`
    );

    return { success: true };
  };

  // ==========================================
  // BOOK CRUD ACTIONS
  // ==========================================

  const addBook = (newBookData) => {
    const newId = `BK-${String(books.length + 1).padStart(3, "0")}`;
    const copies = parseInt(newBookData.totalCopies, 10) || 1;
    const book = {
      id: newId,
      title: newBookData.title,
      author: newBookData.author,
      isbn: newBookData.isbn,
      categoryId: newBookData.categoryId || "CAT-01",
      categoryName:
        categories.find((c) => c.id === newBookData.categoryId)?.name || "General Archival",
      publisher: newBookData.publisher || "Heibook Press",
      year: parseInt(newBookData.year, 10) || new Date().getFullYear(),
      pages: parseInt(newBookData.pages, 10) || 200,
      ddc: newBookData.ddc || "000 GEN",
      shelfLocation: newBookData.shelfLocation || "Main Stacks · Row A-01",
      totalCopies: copies,
      borrowedCopies: 0,
      availableCopies: copies,
      rating: 5.0,
      reviewsCount: 1,
      featured: false,
      coverImage:
        newBookData.coverImage ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      synopsis: newBookData.synopsis || "No archival abstract registered yet.",
      status: "Available"
    };

    setBooks((prev) => [book, ...prev]);

    // Update category count
    setCategories((prev) =>
      prev.map((c) => (c.id === book.categoryId ? { ...c, count: c.count + 1 } : c))
    );

    addToast("success", "Book Accessioned", `"${book.title}" added to catalog ledger.`);
    return { success: true, book };
  };

  const updateBook = (bookId, updatedData) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const total = parseInt(updatedData.totalCopies ?? b.totalCopies, 10);
        const available = Math.max(0, total - b.borrowedCopies);
        return {
          ...b,
          ...updatedData,
          totalCopies: total,
          availableCopies: available,
          status: available === 0 ? "Checked Out" : "Available"
        };
      })
    );

    addToast("success", "Catalog Updated", `Bibliographic metadata for "${updatedData.title || bookId}" saved.`);
    return { success: true };
  };

  const deleteBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return { success: false };

    if (book.borrowedCopies > 0) {
      addToast(
        "error",
        "Deletion Blocked",
        `Cannot delete "${book.title}" because ${book.borrowedCopies} copy is currently checked out.`
      );
      return { success: false };
    }

    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    addToast("success", "Book Removed", `"${book.title}" removed from catalog ledger.`);
    return { success: true };
  };

  // ==========================================
  // CATEGORY ACTIONS
  // ==========================================

  const addCategory = (categoryData) => {
    const newId = `CAT-${String(categories.length + 1).padStart(2, "0")}`;
    const newCat = {
      id: newId,
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: categoryData.icon || "bookmark",
      count: 0,
      description: categoryData.description || "Archival taxonomy node."
    };
    setCategories((prev) => [...prev, newCat]);
    addToast("success", "Category Added", `"${newCat.name}" taxonomy node created.`);
    return { success: true, category: newCat };
  };

  const updateCategory = (categoryId, updatedData) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, ...updatedData } : c))
    );
    addToast("success", "Category Updated", "Taxonomy metadata saved.");
    return { success: true };
  };

  const deleteCategory = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    addToast("success", "Category Deleted", `"${cat?.name}" category removed.`);
    return { success: true };
  };

  // ==========================================
  // MEMBER ACTIONS
  // ==========================================

  const updateMemberStatus = (memberId, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
    );
    addToast("success", "Member Status Changed", `Membership status updated to ${newStatus}.`);
    return { success: true };
  };

  const addMember = (memberData) => {
    const newId = `MBR-2024-${String(members.length + 1).padStart(3, "0")}`;
    const newMember = {
      id: newId,
      name: memberData.name,
      email: memberData.email,
      phone: memberData.phone || "-",
      role: memberData.role || "Patron",
      membershipNumber: `HBK-${Date.now().toString().slice(-6)}`,
      memberSince: getTodayISO(),
      status: "Active",
      activeBorrowings: 0,
      maxQuota: 3,
      totalHistorical: 0,
      avatar:
        memberData.avatar || memberImage,
      department: memberData.department || "General Academic",
      notes: "Newly registered member."
    };
    setMembers((prev) => [newMember, ...prev]);
    addToast("success", "Patron Registered", `Welcome ${newMember.name} to Heibook Digital Library.`);
    return { success: true, member: newMember };
  };

  const updateCirculationPolicy = (newPolicy) => {
    setCirculationPolicy((prev) => ({ ...prev, ...newPolicy }));
    addToast("success", "Policy Saved", "Library circulation policy updated successfully.");
    return { success: true };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        members,
        borrowings,
        stats,
        circulationPolicy,
        updateCirculationPolicy,
        userRole,
        setUserRole,
        currentUser,
        toasts,
        addToast,
        removeToast,
        borrowBook,
        returnBook,
        extendLoan,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        updateCategory,
        deleteCategory,
        updateMemberStatus,
        addMember
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
